import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import qs from "query-string";
import "rc-time-picker/assets/index.css";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import "react-datepicker/dist/react-datepicker.css";
import recommendationsActions from "../actions";
import projectActions from "../../project/actions";
import Loader from "../../common/components/Loader";
import Portal from "../../common/components/Portal";
import buildingActions from "../../building/actions";
import userActions from "../../users/actions";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import ReactTooltip from "react-tooltip";
import RepotNoteTemplateModal from "./RepotNoteTemplateModal";
import RecommendationTemplateModal from "./RecommendationTemplateModal";
import assetActions from "../../assets/actions";
import Draggable from "react-draggable";
import DatePicker from "react-datepicker";
class RecommendationForm extends Component {
    state = {
        activeDetail: "Main Details",
        loading: false,
        systemLoading: false,
        subSystemLoading: false,
        regionLoading: false,
        siteLoading: false,
        buildingLoading: false,
        floorLoading: false,
        additionLoading: false,
        clients: "",
        activeBuilding: "",
        showConfirmModal: false,
        building_type: "",
        priorityTotal: 0,
        emptyArray: [],
        systemArray: [],
        initialPriorityTotal: "",
        costTotal: 0,
        initialCostYear: 0,
        imageUploadModal: false,
        project: {
            client_id: "",
            region_id: "",
            room: "",
            site_id: "",
            notes: "",
            // asset_condition_id: "",
            project_id: "",
            comments: "",
            image: "",
            building_id: "",
            floor_id: "",
            addition_id: "",
            trade_id: "",
            system_id: "",
            sub_system_id: "",
            img_desc: "",
            category_id: "",
            asset_name: "",
            asset_tag: "",
            recommendationIdentifier: "",
            description: "",
            department_id: "",
            project: "",
            service_life: "",
            usefull_life_remaining: "",
            model_number: "",
            serial_number: "",
            area_served: "",
            installed_year: "",
            image_name: "",
            priority_elements: [
                { index: "1", element: "" },
                { index: "2", element: "" },
                { index: "3", element: "" },
                { index: "4", element: "" },
                { index: "5", element: "" },
                { index: "6", element: "" },
                { index: "7", element: "" },
                { index: "8", element: "" }
            ],
            capacity: "",
            capital_type: "",
            criticality_id: "",
            surveyor: "",

            funding_source_id: "",
            status: "",
            surveyor: localStorage.getItem("printed_name") || "",
            priority: 0,
            asset_notes: "",
            crv: "",
            inspection_date: "",
            maintenance_years: [],
            manufacturer: "",
            quantity: "",
            unit: "",
            cost_per_unit: "",
            options_cost: "",
            asset: {},
            recommendation_type: "",
            budget_priority: "",
            infrastructure_request: "",
            red_line: ""
        },
        isLoading: false,
        errorMessage: "",
        showErrorBorder: false,
        isNewProject: true,
        selectedClient: {},
        regionList: [],
        siteList: [],
        initialValues: {},
        buildingList: [],
        projectList: [],
        selectedImage: "",
        selectedConsultancyUsers: [],
        uploadError: "",
        attachmentChanged: false,
        locked: "",
        additional_maintenance_years: [],
        showAssetModal: false,
        initialAssetFormData: {},
        showRecommendationTemplateModal: false,
        recommendationTemplateList: [],
        recommendationSuggestions: [],
        showGroupUpdateConfirmation: false,
        priorityElementsData: [],
        criticalityData: []
    };

    componentDidMount = async () => {
        this.setState({ initialValues: this.state.project, isLoading: true });
        const { clientId, projectId, selectedRecomIds } = this.props;
        await this.props.getPriorityElementDropDownData(projectId);
        this.props.getTradeBasedOnProject(projectId);
        this.props.getCategoryBasedOnProject(projectId);
        this.props.getFundingSourceByProject(projectId);
        this.props.getCapitalTypeBasedOnProject(projectId);

        this.props.getProjectById(projectId);
        this.props.getInitiativeDropdown({ project_id: projectId, client_id: clientId });
        // await this.props.getCriticalityDropDownData(projectId)
        await this.props.getCriticalityData({ project_id: projectId });
        // let criticalityData = this.props.projectReducer.criticalityData?.criticalities || [];
        //   let criticalityData = this.props.recommendationsReducer.criticalityData?.criticalities || [];
        // console.log(criticalityData);
        if (selectedRecomIds?.length) {
            await this.props.getRecommendationCommonDataByIds({ recommendation_ids: selectedRecomIds });
            const {
                recommendationsReducer: {
                    getRecommendationCommonDataByIdsResponse: {
                        common_fields: {
                            trade_id,
                            system_id,
                            sub_system_id,
                            category_id,
                            priority,
                            future_capital,
                            project_total,
                            status,
                            initiative_id,
                            capital_type,
                            funding_source_id,
                            maintenance_years,
                            priority_elements,
                            budget_priority,
                            recommendation_type,
                            inspection_date,
                            condition,
                            infrastructure_request,
                            red_line,
                            criticality_id,
                            surveyor
                        },
                        success
                    }
                }
            } = this.props;

            if (success) {
                let finalPriorityElements = this.getUpdatedPriorityElementsData(
                    priority_elements,
                    this.props.recommendationsReducer.priorityElementsDropDownResponse.priority_elements
                );
                let systemData = [];
                let subSystemData = [];
                if (trade_id) {
                    await this.props.getSystemBasedOnProject(projectId, trade_id);
                    systemData = this.props.recommendationsReducer?.getSystemByProject?.systems || [];
                }
                if (system_id) {
                    await this.props.getSubSystemBasedOnProject(projectId, system_id);
                    subSystemData = this.props.recommendationsReducer?.getSubSystemByProject?.sub_systems || [];
                }
                if (recommendation_type && recommendation_type === "building") {
                    this.props.getConditionBasedOnProject(projectId);
                }
                if (recommendation_type && recommendation_type === "asset") {
                    this.props.getDropdownList("asset_conditions", { client_id: clientId });
                }
                await this.setState({
                    emptyArray: systemData,
                    systemArray: subSystemData,
                    project: {
                        ...this.state.project,
                        trade_id: trade_id || "",
                        system_id: system_id || "",
                        sub_system_id: sub_system_id || "",
                        category_id: category_id || "",
                        priority: priority || "",
                        future_capital: future_capital || "",
                        project_total: project_total || "",
                        status: status || "",
                        initiative_id: initiative_id || "",
                        capital_type: capital_type || "",
                        criticality_id: criticality_id || "",
                        surveyor: surveyor || "",
                        maintenance_years: maintenance_years || "",
                        priority_elements: priority_elements || "",
                        funding_source_id: funding_source_id || "",
                        budget_priority: budget_priority || "",
                        recommendation_type: recommendation_type || "",
                        inspection_date: inspection_date || "",
                        condition: condition || "",
                        infrastructure_request: infrastructure_request || "",
                        red_line: red_line || ""
                    },
                    isPriorityTotalSame: priority ? true : false,
                    priorityElementsData: finalPriorityElements
                });
                let costTotal = 0;
                let calculatedPriority = 0;
                maintenance_years && maintenance_years.length && maintenance_years.map(item => (costTotal += item.amount));
                priority_elements && priority_elements.length && priority_elements.map(item => (calculatedPriority += item.element));
                this.setState({
                    costTotal: costTotal,
                    initialCostYear: costTotal,
                    initialPriorityTotal: priority,
                    priorityTotal: priority || calculatedPriority
                });
                this.setState({ initialValues: _.cloneDeep(this.state.project) });
            }
        }
        this.setState({ isLoading: false });
    };

    getUpdatedPriorityElementsData = (currentData = [], dropDownData = []) => {
        let updatedData = [];
        if (currentData.length > dropDownData.length) {
            updatedData = currentData.map((pData, i) => {
                if (dropDownData[i]) {
                    return {
                        ...dropDownData[i]
                    };
                }
                return {
                    ...pData
                };
            });
        } else {
            updatedData = [...dropDownData];
        }
        return updatedData;
    };

    confirmCancel = () => {
        const { costTotal, initialCostYear, priorityTotal, project } = this.state;
        if (_.isEqual(this.state.initialValues, this.state.project) && costTotal === initialCostYear && priorityTotal === project.priority) {
            this.props.onCancel();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    handleClientSelect = async e => {
        this.setState({
            regionLoading: true
        });
        const { project } = this.state;
        let regionList = await this.props.getRegionListBasedOnClient(project.client_id);
        this.setState({
            regionList,
            project: {
                ...project,
                region_id: "",
                site_id: ""
            },
            siteList: [],
            regionLoading: false
        });
    };

    setMaintenanceYear = (e, name) => {
        const { value } = e;
        let costTotal = 0;
        let myear = this.state.project.maintenance_years;
        // eslint-disable-next-line eqeqeq
        const oldData = myear.filter(i => i.year == name);
        if (oldData.length) {
            // eslint-disable-next-line eqeqeq
            myear.map(i => (i.amount = i.year == name ? value : i.amount));
        } else {
            const newObject = { year: name, amount: value };
            myear.push(newObject);
        }
        this.setState({
            project: {
                ...this.state.project,
                maintenance_years: myear
            }
        });
        myear.map(item => (costTotal += Number(item.amount)));
        this.setState({
            costTotal: costTotal
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, selectedProject } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={`Do you want to ${selectedProject ? "cancel" : "clear"} and lose all changes?`}
                        type="cancel"
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => {
                            this.props.onCancel();
                        }}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    setPriorityelement = (e, priorityId) => {
        const { priorityElementsData } = this.state;
        const { name, value } = e.target;
        let selectedPriority = priorityElementsData.find(p => p.id === priorityId);
        let selectedOption = selectedPriority.options.find(o => o.id === value);

        let priorityTotal = 0;
        let pelement = this.state.project.priority_elements;
        pelement.map(i => {
            if (i.index == name) {
                if (!selectedOption) {
                    i.recommendation_priority_id = priorityId;
                    i.element = value ? parseInt(value) : "";
                    i.option_id = "";
                } else {
                    i.recommendation_priority_id = priorityId;
                    i.option_id = value;
                    i.element = parseInt(selectedOption.value);
                }
            }
            // i.element = i.index == name ? parseInt(value) : i.element
        });
        this.setState({
            project: {
                ...this.state.project,
                priority_elements: pelement
            }
        });
        pelement.map(item => (priorityTotal += Number(item.element)));
        this.setState({
            priorityTotal: priorityTotal
        });
    };

    addMaintenanceYear = () => {
        let currentState = this.state.project.maintenance_years;
        let currentAddYears = this.state.additional_maintenance_years;
        const nextYear = this.state.project.maintenance_years.length
            ? parseInt(this.state.project.maintenance_years[this.state.project.maintenance_years.length - 1].year) + 1
            : new Date().getFullYear();

        currentState.push({ year: nextYear, amount: 0.0, isAdditional: true });
        currentAddYears.push(nextYear);
        this.setState({
            project: {
                ...this.state.project,
                maintenance_years: currentState
            },
            additional_maintenance_years: currentAddYears
        });
    };

    removeMaintenanceYear = item => {
        let currentState = this.state.project.maintenance_years;
        let currentAddYears = this.state.additional_maintenance_years;
        let currentCostTotal = this.state.costTotal;
        currentState.splice(-1);
        currentAddYears.splice(-1);
        this.setState({
            project: {
                ...this.state.project,
                maintenance_years: currentState
            },
            additional_maintenance_years: currentAddYears,
            costTotal: currentCostTotal - parseInt(item.amount)
        });
    };

    handleRegionSelect = async e => {
        const {
            location: { search }
        } = this.props;

        const query = qs.parse(search);
        this.setState({
            siteLoading: true
        });
        const { project } = this.state;
        let siteList = await this.props.getSiteListBasedOnRegion(project.region_id, { project_id: query.p_id });
        this.setState({
            siteList,
            project: {
                ...project,
                site_id: "",
                building_id: "",
                building_type: "",
                addition_id: "",
                floor_id: ""
            },
            siteLoading: false
        });
    };

    handleFloorSelect = async e => {
        this.setState({
            floorLoading: true
        });
        let floorList = await this.props.getFloorBasedOnBuilding(e.target.value);
        this.setState({
            floorList,
            floorLoading: false
        });
    };
    handleAdditionSelect = async e => {
        this.setState({
            additionLoading: true
        });
        let additionList = await this.props.getAdditionBasedOnBuilding(e.target.value);
        this.setState({
            additionList,
            additionLoading: false
        });
    };

    handleSiteSelect = async e => {
        this.setState({
            buildingLoading: true
        });
        const {
            location: { search }
        } = this.props;

        const query = qs.parse(search);
        const { project } = this.state;
        let buildingList = await this.props.getAllBuildingsDropdown({ site_id: project.site_id, project_id: query.p_id });
        this.setState({
            buildingList,
            project: {
                ...project,
                building_id: "",
                building_type: "",
                addition_id: "",
                floor_id: ""
            },
            buildingLoading: false
        });
    };

    updateSelectedRecommendations = async () => {
        let {
            project: { asset, ...rest },
            initialValues
        } = this.state;
        this.setState({ loading: true });
        let selectedCapitalType = this.props.recommendationsReducer?.getCapitalTypeBasedOnProject?.capital_types?.find(
            cType => cType.name === this.state.project.capital_type
        );
        let newData = {};
        Object.entries(rest).forEach(([key, value]) => {
            if (!_.isEqual(value, initialValues[key])) {
                newData[key] = value;
            }
        });
        newData.recommendation_type = rest.recommendation_type || "nil";
        if (newData.condition) {
            if (rest.recommendation_type === "asset") {
                newData.client_asset_condition_id = newData.condition;
            } else {
                newData.asset_condition_id = newData.condition;
            }
            delete newData.condition;
        }
        if (newData.capital_type) {
            newData.recommendation_capital_type_id = selectedCapitalType?.id || "";
        }
        if (newData.priority_elements?.length) {
            let tempElements = [];
            newData.priority_elements.forEach((item, idx) => {
                if (!_.isEqual(item, initialValues?.priority_elements[idx])) {
                    tempElements.push(item);
                }
            });
            newData.priority_elements = tempElements;
        }
        await this.props.handleUpdateRecommendations(newData);
        this.setState({ loading: false });
    };

    renderGroupUpdateConfirmationModal = () => {
        const { showGroupUpdateConfirmation } = this.state;
        if (!showGroupUpdateConfirmation) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={`You are about to modify ${this.props.selectedRecomIds?.length} Recommendations. This action cannot be undone! `}
                        type="cancel"
                        message={"Are you sure you want to continue?"}
                        onNo={() => this.setState({ showGroupUpdateConfirmation: false })}
                        onYes={() => {
                            this.setState({ showGroupUpdateConfirmation: false });
                            this.updateSelectedRecommendations();
                        }}
                    />
                }
                onCancel={() => this.setState({ showGroupUpdateConfirmation: false })}
            />
        );
    };

    updateProject = async () => {
        const { project } = this.state;
        const { handleUpdateRecommendations } = this.props;
        if (this.validate()) {
            await handleUpdateRecommendations(project);
        }
    };

    getSubSystem = systemId => {
        this.props.getSubSystemBasedOnProject(this.props.projectId, systemId);
    };

    clearForm = async () => {
        await this.setState({
            project: {
                consultancy_user_ids: [],
                client_id: "",
                name: "",
                comments: "",
                region_id: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleAddAttachment = e => {
        this.setState({
            imageUploadModal: true
        });
    };

    setActiveTab = activeTab => {
        this.setState({ activeDetail: activeTab });
    };

    handleIdentifier = value => {
        this.setState({ project: { recommendationIdentifier: value } });
    };

    handleRecomentation = value => {
        this.setState({ project: { recommendation: value } });
    };

    getCostYear = async () => {
        const {
            location: { search }
        } = this.props;

        let costPerYear = {};
        const query = qs.parse(search);

        await this.props.getCostYearByProject(query.p_id, this.state.project.site_id);

        costPerYear =
            this.props.recommendationsReducer.getCostYearByProject &&
            this.props.recommendationsReducer.getCostYearByProject.year_limits &&
            this.props.recommendationsReducer.getCostYearByProject.year_limits;

        if (costPerYear && costPerYear.start && costPerYear && costPerYear.end) {
            let currentState = [];
            let i = 0;
            for (i = costPerYear.start; i <= costPerYear.end; i++) {
                currentState.push({ year: i, amount: 0.0 });
            }

            await this.setState({
                project: {
                    ...this.state.project,
                    maintenance_years: currentState
                }
            });
        } else {
            this.setState({
                project: {
                    ...this.state.project,
                    maintenance_years: []
                },
                costTotal: 0
            });
        }
    };

    handleImage = e => {};

    deleteImage = () => {
        this.setState({
            attachmentChanged: true,
            project: {
                ...this.state.project,
                image: null,
                img_desc: null,
                image_id: null,
                image_name: ""
            },
            selectedImage: null
        });
    };

    handleAddImage = imageData => {
        this.setState({
            uploadError: "",
            imageUploadModal: false
        });
        if (!imageData.id) {
            this.setState({
                attachmentChanged: true,
                project: {
                    ...this.state.project,
                    image: imageData.file,
                    img_desc: imageData.comments
                },
                previewImage: URL.createObjectURL(imageData.file)
            });
        } else if (imageData.comments) {
            this.setState({
                project: {
                    ...this.state.project,
                    img_desc: imageData.comments
                }
            });
        }
    };

    handleTrade = async tradeId => {
        this.setState({
            systemLoading: true
        });
        await this.props.getSystemBasedOnProject(this.props.projectId, tradeId);
        const data =
            this.props.recommendationsReducer &&
            this.props.recommendationsReducer.getSystemByProject &&
            this.props.recommendationsReducer.getSystemByProject.systems &&
            this.props.recommendationsReducer.getSystemByProject.systems;
        this.setState({
            project: {
                ...this.state.project,
                system_id: "",
                sub_system_id: ""
            },
            emptyArray: [],
            systemArray: []
        });
        setTimeout(() => {
            this.setState({
                emptyArray: data,
                systemArray: [],
                systemLoading: false
            });
        }, 100);
    };

    handleSystem = async systemId => {
        this.setState({
            subSystemLoading: true
        });
        let data = [];
        await this.props.getSubSystemBasedOnProject(this.props.projectId, systemId);
        data =
            (this.props.recommendationsReducer &&
                this.props.recommendationsReducer.getSubSystemByProject &&
                this.props.recommendationsReducer.getSubSystemByProject.sub_systems &&
                this.props.recommendationsReducer.getSubSystemByProject.sub_systems) ||
            [];
        this.setState({
            project: {
                ...this.state.project,
                sub_system_id: ""
            },
            systemArray: []
        });
        setTimeout(() => {
            this.setState({
                systemArray: data,
                subSystemLoading: false
            });
        }, 100);
    };

    toggleShowReportNoteTemplateModal = () => {
        const { showReportNoteTemplateModal } = this.state;
        this.setState({
            showReportNoteTemplateModal: !showReportNoteTemplateModal
        });
    };

    toggleShowRecommendationTemplateModal = () => {
        const { showRecommendationTemplateModal } = this.state;
        this.setState({
            showRecommendationTemplateModal: !showRecommendationTemplateModal
        });
    };

    renderRecommendationTemplateModal = () => {
        const { showRecommendationTemplateModal, project } = this.state;
        if (!showRecommendationTemplateModal || !project.sub_system_id) return null;
        return (
            <Portal
                body={
                    <RecommendationTemplateModal
                        heading={"Recommendation Templates"}
                        sub_system_id={project.sub_system_id || null}
                        onOk={this.updateRecommendationContent}
                        onCancel={() => {
                            this.setState({ showRecommendationTemplateModal: false });
                        }}
                    />
                }
                onCancel={() => this.setState({ showRecommendationTemplateModal: false })}
            />
        );
    };

    updateTextBandContent = async newBandContent => {
        const { project } = this.state;
        this.setState({
            project: {
                ...project,
                notes: project.notes + newBandContent
            }
        });
    };

    updateRecommendationContent = async newBandContent => {
        const { project } = this.state;
        this.setState({
            project: {
                ...project,
                description: project.description + newBandContent
            }
        });
    };

    renderReportNoteTemplateModal = () => {
        const { showReportNoteTemplateModal, project } = this.state;
        if (!showReportNoteTemplateModal || !project.sub_system_id) return null;
        return (
            <Portal
                body={
                    <RepotNoteTemplateModal
                        heading={"Narrative Templates"}
                        sub_system_id={project.sub_system_id || null}
                        onOk={this.updateTextBandContent}
                        onCancel={() => {
                            this.setState({ showReportNoteTemplateModal: false });
                        }}
                    />
                }
                onCancel={() => this.setState({ showReportNoteTemplateModal: false })}
            />
        );
    };

    multiselectClass = (field, index) => {
        let selectboxClass = "";
        let { project, initialValues } = this.state;
        if (field === "priority_elements") {
            // if all data common
            if (
                project[field] &&
                project[field][index] &&
                (project[field][index]?.element || project[field][index]?.element === 0) &&
                _.isEqual(project[field][index], initialValues[field] && initialValues[field][index])
            ) {
                selectboxClass = "common-data ";
            } // if field get updated
            else if (
                project[field] &&
                project[field][index] &&
                (project[field][index]?.element || project[field][index]?.element === 0) &&
                !_.isEqual(project[field][index], initialValues[field] && initialValues[field][index])
            ) {
                selectboxClass = "dirty-field ";
            }
        } else {
            // if all data common
            if (project[field] && _.isEqual(project[field], initialValues[field])) {
                selectboxClass = "common-data ";
            } // if field get updated
            else if (project[field] && !_.isEqual(project[field], initialValues[field])) {
                selectboxClass = "dirty-field ";
            }
        }
        return selectboxClass;
    };

    renderPriorityElementToolTip = (name, options = [], notes) => {
        let tootTipData = "";
        if (name && options.length) {
            tootTipData = `<h4>${name}</h4>`;
            if (notes) {
                tootTipData = tootTipData + `<p>${notes}</p>`;
            }
            options.map((option, i) => {
                tootTipData = tootTipData + `<p>${option.name}</p>`;
            });
        }
        return tootTipData || null;
    };

    render() {
        const { project, isLoading, loading, initialValues, recommendation_type, priorityElementsData, criticalityData } = this.state;
        const isDirty = !_.isEqual(initialValues, project);
        const {
            assetReducer: { dropDownList }
        } = this.props;
        return (
            <LoadingOverlay active={loading || isLoading} spinner={<Loader />} fadeSpeed={10}>
                <ReactTooltip id="recommandation_detils" effect="solid" />
                <div className="dtl-sec modal-recom-tab-view col-md-12">
                    <Draggable cancel=".not-draggable" positionOffset={{ x: "0%", y: "0%" }}>
                        <div className="tab-dtl region-mng additional-dtl addition-edit" style={{ cursor: "move" }}>
                            <div class="close-btn-otr">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.confirmCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div class="header-mod-top">
                                <label for="" class="btn-new-noti btn-padding-noti">
                                    Selected Recommendations
                                    <span>{this.props.selectedRecomIds?.length}</span>
                                </label>
                            </div>
                            <div className="tab-active location-sec recom-sec main-dtl-add recommendation-form add-recommendation">
                                <div className="col-md-12 detail-recom add-details-outer">
                                    <div className="outer-rcm recommendations">
                                        <div className="cnt-sec">
                                            <div className="row">
                                                <div className="col-md-12 pr-0">
                                                    <div id="accordion">
                                                        <div className={`card`}>
                                                            <div className="card-header" id="headingOne">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseOne"
                                                                        aria-expanded="false"
                                                                        aria-controls="collapseOne"
                                                                    >
                                                                        Recommendation
                                                                    </button>
                                                                    <div className="txt-rcm">
                                                                        <div
                                                                            className="content-inp-card"
                                                                            data-tip="<b>Cannot update Trade field for multiple Recommendations. To update Trade field, please select one Recommendation at a time.</b>"
                                                                            data-for="recommandation_detils"
                                                                            data-delay-show={500}
                                                                            data-place="top"
                                                                            data-html={true}
                                                                        >
                                                                            <div className="form-group">
                                                                                <label>Trade *</label>
                                                                                <div
                                                                                    className={`custom-selecbox ${this.multiselectClass("trade_id")}`}
                                                                                >
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.trade_id.trim().length
                                                                                                ? "error-border not-draggable "
                                                                                                : ""
                                                                                        }  custom-selecbox cursor-diabled not-draggable`}
                                                                                        value={this.state.project.trade_id}
                                                                                        disabled
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    trade_id: e.target.value
                                                                                                }
                                                                                            });
                                                                                            this.handleTrade(e.target.value);
                                                                                        }}
                                                                                    >
                                                                                        <option value=""> Select</option>
                                                                                        {this.props.recommendationsReducer &&
                                                                                        this.props.recommendationsReducer.getTradeByProject &&
                                                                                        this.props.recommendationsReducer.getTradeByProject.trades &&
                                                                                        this.props.recommendationsReducer.getTradeByProject.trades
                                                                                            .length
                                                                                            ? this.props.recommendationsReducer.getTradeByProject.trades.map(
                                                                                                  (item, i) => (
                                                                                                      <option value={item.id} key={i}>
                                                                                                          {item.name}
                                                                                                      </option>
                                                                                                  )
                                                                                              )
                                                                                            : null}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>System *</label>
                                                                                <div
                                                                                    className={`custom-selecbox ${this.multiselectClass(
                                                                                        "system_id"
                                                                                    )} not-draggable`}
                                                                                >
                                                                                    <LoadingOverlay
                                                                                        active={this.state.systemLoading}
                                                                                        spinner={<Loader />}
                                                                                        fadeSpeed={10}
                                                                                    >
                                                                                        <select
                                                                                            autoComplete={"nope"}
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                !this.state.project.system_id.trim().length
                                                                                                    ? "error-border not-draggable"
                                                                                                    : ""
                                                                                            } custom-selecbox not-draggable`}
                                                                                            value={this.state.project.system_id}
                                                                                            onChange={async e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        system_id: e.target.value
                                                                                                    }
                                                                                                });
                                                                                                await this.handleSystem(e.target.value);
                                                                                            }}
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.state.emptyArray &&
                                                                                                this.state.emptyArray.length &&
                                                                                                this.state.emptyArray.map((item, i) => (
                                                                                                    <option value={item.id} key={i}>
                                                                                                        {item.name}
                                                                                                    </option>
                                                                                                ))}
                                                                                        </select>
                                                                                    </LoadingOverlay>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Sub-System *</label>
                                                                                <div
                                                                                    className={`custom-selecbox ${this.multiselectClass(
                                                                                        "sub_system_id"
                                                                                    )}not-draggable`}
                                                                                >
                                                                                    <LoadingOverlay
                                                                                        active={this.state.subSystemLoading}
                                                                                        spinner={<Loader />}
                                                                                        fadeSpeed={10}
                                                                                    >
                                                                                        <select
                                                                                            autoComplete={"nope"}
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                !this.state.project.sub_system_id.trim().length
                                                                                                    ? "error-border not-draggable "
                                                                                                    : ""
                                                                                            } custom-selecbox not-draggable`}
                                                                                            value={this.state.project.sub_system_id}
                                                                                            onChange={e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        sub_system_id: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.state.systemArray &&
                                                                                                this.state.systemArray.length &&
                                                                                                this.state.systemArray.map((item, i) => (
                                                                                                    <option value={item.id} key={i}>
                                                                                                        {item.name}
                                                                                                    </option>
                                                                                                ))}
                                                                                        </select>
                                                                                    </LoadingOverlay>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Type</label>
                                                                                <div
                                                                                    className={`custom-selecbox ${this.multiselectClass(
                                                                                        "recommendation_type"
                                                                                    )}`}
                                                                                >
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.recommendation_type.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        } custom-selecbox`}
                                                                                        value={this.state.project.recommendation_type}
                                                                                        onChange={async e => {
                                                                                            await this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    recommendation_type: e.target.value
                                                                                                }
                                                                                            });
                                                                                            // this.handleRecommendationTypeSelect();
                                                                                        }}
                                                                                    >
                                                                                        <option value="asset">Asset</option>
                                                                                        <option value="building">Building</option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`card`}>
                                                            <div className="card-header" id="headingFour">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseFour"
                                                                        aria-expanded="false"
                                                                        aria-controls="collapseOne"
                                                                    >
                                                                        Priority
                                                                    </button>
                                                                    <div className="txt-rcm">
                                                                        <div
                                                                            className="content-inp-card blue-sec"
                                                                            data-for="recommandation_detils"
                                                                            data-delay-show={500}
                                                                            data-place="top"
                                                                            data-html={true}
                                                                            data-tip={
                                                                                !this.state.isPriorityTotalSame
                                                                                    ? "<b>The priority total may vary because the selected recommendations have different priority elements</b>"
                                                                                    : ""
                                                                            }
                                                                        >
                                                                            <h3 className="p-name">Priority Total</h3>
                                                                            <h3 className="color-white">
                                                                                {this.state.priorityTotal || 0}
                                                                                {!this.state.isPriorityTotalSame ? " (may vary)" : ""}
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                    {priorityElementsData?.length ? (
                                                                        priorityElementsData.map((item, i) => (
                                                                            <>
                                                                                {(i === 0 || i === 1) && (
                                                                                    <div className="txt-rcm" key={i}>
                                                                                        <div
                                                                                            className="content-inp-card not-draggable"
                                                                                            data-tip={this.renderPriorityElementToolTip(
                                                                                                item.display_name,
                                                                                                item.options,
                                                                                                item.notes
                                                                                            )}
                                                                                            data-for="recommandation_detils"
                                                                                            data-place="top"
                                                                                            data-html={true}
                                                                                        >
                                                                                            {item.display_name && item.display_name !== "" ? (
                                                                                                <div className={`form-group`}>
                                                                                                    <label>{item.display_name}</label>
                                                                                                    <div
                                                                                                        className={`custom-selecbox ${this.multiselectClass(
                                                                                                            "priority_elements",
                                                                                                            i
                                                                                                        )} not-draggable`}
                                                                                                    >
                                                                                                        <select
                                                                                                            autoComplete={"nope"}
                                                                                                            className={`form-control fs-12 not-draggable`}
                                                                                                            placeholder="0"
                                                                                                            onChange={e => {
                                                                                                                this.setPriorityelement(e, item.id);
                                                                                                            }}
                                                                                                            name={i + 1}
                                                                                                            value={
                                                                                                                (this.state.project.priority_elements[
                                                                                                                    i
                                                                                                                ] &&
                                                                                                                    this.state.project
                                                                                                                        .priority_elements[i]
                                                                                                                        .option_id) ||
                                                                                                                ""
                                                                                                            }
                                                                                                        >
                                                                                                            <option value={""}>Select</option>
                                                                                                            {item.options &&
                                                                                                                item.options.map(
                                                                                                                    (priorityItem, i) => (
                                                                                                                        <option
                                                                                                                            key={priorityItem.id}
                                                                                                                            className="fs-12"
                                                                                                                            value={priorityItem.id}
                                                                                                                        >
                                                                                                                            {priorityItem.name}
                                                                                                                        </option>
                                                                                                                    )
                                                                                                                )}
                                                                                                        </select>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <label>Priority {i + 1}</label>
                                                                                                    <input
                                                                                                        autoComplete={"nope"}
                                                                                                        type="text"
                                                                                                        className={`custom-input form-control ${this.multiselectClass(
                                                                                                            "priority_elements",
                                                                                                            i
                                                                                                        )} not-draggable`}
                                                                                                        placeholder="0"
                                                                                                        name={i + 1}
                                                                                                        value={
                                                                                                            parseInt(
                                                                                                                this.state.project.priority_elements[
                                                                                                                    i
                                                                                                                ] &&
                                                                                                                    this.state.project
                                                                                                                        .priority_elements[i].element
                                                                                                            ) || ""
                                                                                                        }
                                                                                                        onChange={e => {
                                                                                                            this.setPriorityelement(e, item.id);
                                                                                                        }}
                                                                                                    />
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        ))
                                                                    ) : (
                                                                        <>
                                                                            <div className="txt-rcm">
                                                                                <div className="content-inp-card">
                                                                                    <div className="form-group">
                                                                                        <label>Criticality *</label>
                                                                                        <div
                                                                                            className={`custom-selecbox ${this.multiselectClass(
                                                                                                "criticality_id"
                                                                                            )}`}
                                                                                        >
                                                                                            <select
                                                                                                // autoComplete={"nope"}
                                                                                                className={`${
                                                                                                    this.state.showErrorBorder &&
                                                                                                    !this.state.project.criticality_id.trim().length
                                                                                                        ? "error-border not-draggable "
                                                                                                        : ""
                                                                                                }  custom-selecbox  not-draggable`}
                                                                                                value={this.state.project.criticality_id}
                                                                                                onChange={e => {
                                                                                                    this.setState({
                                                                                                        project: {
                                                                                                            ...project,
                                                                                                            criticality_id: e.target.value
                                                                                                        }
                                                                                                    });
                                                                                                }}
                                                                                            >
                                                                                                <option value=""> Select</option>
                                                                                                {this.props.projectReducer &&
                                                                                                this.props.projectReducer.criticalityData &&
                                                                                                this.props.projectReducer.criticalityData
                                                                                                    .criticalities &&
                                                                                                this.props.projectReducer.criticalityData
                                                                                                    .criticalities.length
                                                                                                    ? this.props.projectReducer.criticalityData.criticalities.map(
                                                                                                          (item, i) => (
                                                                                                              <option value={item.id} key={i}>
                                                                                                                  {item.name}
                                                                                                              </option>
                                                                                                          )
                                                                                                      )
                                                                                                    : null}
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="txt-rcm"></div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div id="collapseFour" className="collapse" aria-labelledby="headingFour">
                                                                <div className="card-body">
                                                                    <div className="outer-rcm mt-1">
                                                                        {priorityElementsData.map((item, i) => (
                                                                            <>
                                                                                {i !== 0 && i !== 1 && (
                                                                                    <div className="txt-rcm" key={i}>
                                                                                        <div
                                                                                            className="content-inp-card not-draggable"
                                                                                            data-tip={this.renderPriorityElementToolTip(
                                                                                                item.display_name,
                                                                                                item.options,
                                                                                                item.notes
                                                                                            )}
                                                                                            data-for="recommandation_detils"
                                                                                            data-place="top"
                                                                                            data-html={true}
                                                                                        >
                                                                                            {item.display_name &&
                                                                                            item.display_name !== "" &&
                                                                                            item.options &&
                                                                                            item.options.length ? (
                                                                                                <div className="form-group">
                                                                                                    <label>{item.display_name}</label>
                                                                                                    <div
                                                                                                        className={`custom-selecbox ${this.multiselectClass(
                                                                                                            "priority_elements",
                                                                                                            i
                                                                                                        )} not-draggable`}
                                                                                                    >
                                                                                                        <select
                                                                                                            autoComplete={"nope"}
                                                                                                            className={`form-control fs-12 not-draggable`}
                                                                                                            placeholder="0"
                                                                                                            onChange={e => {
                                                                                                                this.setPriorityelement(e, item.id);
                                                                                                            }}
                                                                                                            name={i + 1}
                                                                                                            value={
                                                                                                                (this.state.project.priority_elements[
                                                                                                                    i
                                                                                                                ] &&
                                                                                                                    this.state.project
                                                                                                                        .priority_elements[i]
                                                                                                                        .option_id) ||
                                                                                                                ""
                                                                                                            }
                                                                                                        >
                                                                                                            <option value={""}>Select</option>
                                                                                                            {item.options &&
                                                                                                                item.options.map(
                                                                                                                    (priorityItem, i) => (
                                                                                                                        <option
                                                                                                                            key={priorityItem.id}
                                                                                                                            className="fs-12 not-draggable"
                                                                                                                            value={priorityItem.id}
                                                                                                                        >
                                                                                                                            {priorityItem.name}
                                                                                                                        </option>
                                                                                                                    )
                                                                                                                )}
                                                                                                        </select>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <label>Priority {i + 1}</label>
                                                                                                    <input
                                                                                                        autoComplete={"nope"}
                                                                                                        type="text"
                                                                                                        className={`custom-input form-control ${this.multiselectClass(
                                                                                                            "priority_elements",
                                                                                                            i
                                                                                                        )} not-draggable`}
                                                                                                        placeholder="0"
                                                                                                        name={i + 1}
                                                                                                        value={
                                                                                                            parseInt(
                                                                                                                this.state.project.priority_elements[
                                                                                                                    i
                                                                                                                ] &&
                                                                                                                    this.state.project
                                                                                                                        .priority_elements[i].element
                                                                                                            ) || ""
                                                                                                        }
                                                                                                        onChange={e => {
                                                                                                            this.setPriorityelement(e, item.id);
                                                                                                        }}
                                                                                                    />
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        ))}
                                                                        {priorityElementsData?.length > 2 && (
                                                                            <div className="txt-rcm">
                                                                                <div className="content-inp-card">
                                                                                    <div className="form-group">
                                                                                        <label>Criticality *</label>
                                                                                        <div
                                                                                            className={`custom-selecbox ${this.multiselectClass(
                                                                                                "criticality_id"
                                                                                            )}`}
                                                                                        >
                                                                                            <select
                                                                                                // autoComplete={"nope"}
                                                                                                className={`${
                                                                                                    this.state.showErrorBorder &&
                                                                                                    !this.state.project.criticality_id.trim().length
                                                                                                        ? "error-border not-draggable "
                                                                                                        : ""
                                                                                                }  custom-selecbox  not-draggable`}
                                                                                                value={this.state.project.criticality_id}
                                                                                                onChange={e => {
                                                                                                    this.setState({
                                                                                                        project: {
                                                                                                            ...project,
                                                                                                            criticality_id: e.target.value
                                                                                                        }
                                                                                                    });
                                                                                                }}
                                                                                            >
                                                                                                <option value=""> Select</option>
                                                                                                {this.props.projectReducer &&
                                                                                                this.props.projectReducer.criticalityData &&
                                                                                                this.props.projectReducer.criticalityData
                                                                                                    .criticalities &&
                                                                                                this.props.projectReducer.criticalityData
                                                                                                    .criticalities.length
                                                                                                    ? this.props.projectReducer.criticalityData.criticalities.map(
                                                                                                          (item, i) => (
                                                                                                              <option value={item.id} key={i}>
                                                                                                                  {item.name}
                                                                                                              </option>
                                                                                                          )
                                                                                                      )
                                                                                                    : null}
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className={`card`}>
                                                            <div className="card-header" id="headingSix">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseSix"
                                                                        aria-expanded="true"
                                                                        aria-controls="collapseOne"
                                                                    >
                                                                        Additional Details
                                                                    </button>
                                                                    {project.recommendation_type === "building" ? (
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Condition *</label>
                                                                                    <div
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project?.condition
                                                                                                ? "error-border not-draggable"
                                                                                                : ""
                                                                                        } ${this.multiselectClass(
                                                                                            "condition"
                                                                                        )} custom-selecbox not-draggable`}
                                                                                    >
                                                                                        <select
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                !project?.condition?.trim().length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            } ${
                                                                                                !project.recommendation_type ? "cursor-diabled" : ""
                                                                                            } custom-selecbox not-draggable`}
                                                                                            autoComplete={"nope"}
                                                                                            value={project?.condition}
                                                                                            disabled={!project.recommendation_type}
                                                                                            onChange={e =>
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        condition: e.target.value
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.props.recommendationsReducer
                                                                                                .getConditionBasedOnProject?.asset_conditions?.length
                                                                                                ? this.props.recommendationsReducer.getConditionBasedOnProject?.asset_conditions.map(
                                                                                                      item => (
                                                                                                          <option value={item.id} key={item.id}>
                                                                                                              {item.name}
                                                                                                          </option>
                                                                                                      )
                                                                                                  )
                                                                                                : null}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="txt-rcm">
                                                                            <div
                                                                                className="content-inp-card"
                                                                                data-for="recommandation_detils"
                                                                                data-delay-show={500}
                                                                                data-place="top"
                                                                                data-tip={
                                                                                    !project.recommendation_type
                                                                                        ? "<b>Cannot update Condition field for mixed Recommendation Types. please select same Recommendation Type to update.</b>"
                                                                                        : ""
                                                                                }
                                                                                data-html={true}
                                                                            >
                                                                                <div className="form-group">
                                                                                    <label>Condition *</label>
                                                                                    <div
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project?.condition
                                                                                                ? "error-border not-draggable"
                                                                                                : ""
                                                                                        } ${this.multiselectClass(
                                                                                            "condition"
                                                                                        )} custom-selecbox not-draggable`}
                                                                                    >
                                                                                        <select
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                !project?.condition?.trim().length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            } ${
                                                                                                !project.recommendation_type ? "cursor-diabled" : ""
                                                                                            } custom-selecbox`}
                                                                                            autoComplete={"nope"}
                                                                                            value={project?.condition}
                                                                                            disabled={!project.recommendation_type}
                                                                                            onChange={e =>
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        condition: e.target.value
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {dropDownList?.asset_conditions?.length
                                                                                                ? dropDownList.asset_conditions.map(item => (
                                                                                                      <option value={item.id} key={item.id}>
                                                                                                          {item.name}
                                                                                                      </option>
                                                                                                  ))
                                                                                                : null}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Category *</label>
                                                                                <div
                                                                                    className={`custom-selecbox ${this.multiselectClass(
                                                                                        "category_id"
                                                                                    )}not-draggable`}
                                                                                >
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.category_id.trim().length
                                                                                                ? "error-border not-draggable"
                                                                                                : ""
                                                                                        } custom-selecbox not-draggable`}
                                                                                        value={this.state.project.category_id}
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    category_id: e.target.value
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    >
                                                                                        <option value=""> Select</option>
                                                                                        {this.props.recommendationsReducer &&
                                                                                        this.props.recommendationsReducer.getCategoryByProject &&
                                                                                        this.props.recommendationsReducer.getCategoryByProject
                                                                                            .categories &&
                                                                                        this.props.recommendationsReducer.getCategoryByProject
                                                                                            .categories.length
                                                                                            ? this.props.recommendationsReducer.getCategoryByProject.categories.map(
                                                                                                  (item, i) => (
                                                                                                      <option value={item.id} key={i}>
                                                                                                          {item.name}
                                                                                                      </option>
                                                                                                  )
                                                                                              )
                                                                                            : null}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Capital Type *</label>
                                                                                <div
                                                                                    className={`custom-selecbox ${this.multiselectClass(
                                                                                        "capital_type"
                                                                                    )}not-draggable`}
                                                                                >
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.capital_type.trim().length
                                                                                                ? "error-border not-draggable"
                                                                                                : ""
                                                                                        } custom-selecbox not-draggable`}
                                                                                        value={this.state.project.capital_type}
                                                                                        placeholder="Select Capital Type"
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    capital_type: e.target.value
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    >
                                                                                        <option value=""> Select</option>
                                                                                        {this.props.recommendationsReducer &&
                                                                                        this.props.recommendationsReducer
                                                                                            .getCapitalTypeBasedOnProject &&
                                                                                        this.props.recommendationsReducer.getCapitalTypeBasedOnProject
                                                                                            .capital_types &&
                                                                                        this.props.recommendationsReducer.getCapitalTypeBasedOnProject
                                                                                            .capital_types.length
                                                                                            ? this.props.recommendationsReducer.getCapitalTypeBasedOnProject.capital_types.map(
                                                                                                  (item, i) => (
                                                                                                      <option value={item.name} key={i}>
                                                                                                          {item.display_name}
                                                                                                      </option>
                                                                                                  )
                                                                                              )
                                                                                            : null}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div id="collapseSix" className="collapse show" aria-labelledby="headingSix">
                                                                <div className="card-body">
                                                                    <div className="outer-rcm mt-1">
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Status</label>
                                                                                    <div
                                                                                        className={`${
                                                                                            this.state.showErrorBorder && !this.state.project.status
                                                                                                ? "error-border not-draggable"
                                                                                                : ""
                                                                                        } ${this.multiselectClass(
                                                                                            "status"
                                                                                        )} custom-selecbox not-draggable`}
                                                                                    >
                                                                                        <select
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.status}
                                                                                            onChange={e =>
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        status: e.target.value
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        >
                                                                                            <option value={""} key={""}>
                                                                                                {"Select"}
                                                                                            </option>
                                                                                            <option value={"active"} key={"active"}>
                                                                                                {"Active"}
                                                                                            </option>
                                                                                            <option value={"in_progress"} key={"in_progress"}>
                                                                                                {"In Progress"}
                                                                                            </option>
                                                                                            <option value={"pending"} key={"pending"}>
                                                                                                {"Pending"}
                                                                                            </option>
                                                                                            <option value={"on_hold"} key={"on_hold"}>
                                                                                                {"On Hold"}
                                                                                            </option>
                                                                                            <option value={"completed"} key={"completed "}>
                                                                                                {"Completed "}
                                                                                            </option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Initiative</label>
                                                                                    <div
                                                                                        className={`custom-selecbox ${this.multiselectClass(
                                                                                            "initiative_id"
                                                                                        )}not-draggable`}
                                                                                    >
                                                                                        <select
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.initiative_id}
                                                                                            onChange={e =>
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        initiative_id: e.target.value
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.props.recommendationsReducer?.getInitiativeDropdown
                                                                                                ?.projects?.length
                                                                                                ? this.props.recommendationsReducer.getInitiativeDropdown.projects.map(
                                                                                                      (item, i) => (
                                                                                                          <option value={item.id} key={i}>
                                                                                                              {item.name}
                                                                                                          </option>
                                                                                                      )
                                                                                                  )
                                                                                                : null}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Funding</label>
                                                                                    <div
                                                                                        className={`custom-selecbox ${this.multiselectClass(
                                                                                            "funding_source_id"
                                                                                        )}not-draggable`}
                                                                                    >
                                                                                        <select
                                                                                            className={`custom-selecbox`}
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.funding_source_id}
                                                                                            onChange={e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        funding_source_id: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.props.recommendationsReducer &&
                                                                                            this.props.recommendationsReducer
                                                                                                .getFundingSourceByProject &&
                                                                                            this.props.recommendationsReducer
                                                                                                .getFundingSourceByProject.funding_sources &&
                                                                                            this.props.recommendationsReducer
                                                                                                .getFundingSourceByProject.funding_sources.length
                                                                                                ? this.props.recommendationsReducer.getFundingSourceByProject.funding_sources.map(
                                                                                                      (item, i) => (
                                                                                                          <option value={item.id} key={i}>
                                                                                                              {item.name}
                                                                                                          </option>
                                                                                                      )
                                                                                                  )
                                                                                                : null}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Budget Priority</label>
                                                                                    <div
                                                                                        className={`custom-selecbox ${this.multiselectClass(
                                                                                            "budget_priority"
                                                                                        )}not-draggable`}
                                                                                    >
                                                                                        <select
                                                                                            className={`custom-selecbox`}
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.budget_priority}
                                                                                            onChange={e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        budget_priority: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            <option value="no">No</option>
                                                                                            <option value="yes">Yes</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Infrastructure Request</label>
                                                                                    <div
                                                                                        className={`custom-selecbox ${this.multiselectClass(
                                                                                            "infrastructure_request"
                                                                                        )}not-draggable`}
                                                                                    >
                                                                                        <select
                                                                                            className={`custom-selecbox`}
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.infrastructure_request}
                                                                                            onChange={e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        infrastructure_request: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            <option value="no">No</option>
                                                                                            <option value="yes">Yes</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Redlining</label>
                                                                                    <div
                                                                                        className={`custom-selecbox ${this.multiselectClass(
                                                                                            "red_line"
                                                                                        )}not-draggable`}
                                                                                    >
                                                                                        <select
                                                                                            className={`custom-selecbox`}
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.red_line}
                                                                                            onChange={e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        red_line: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            <option value="no">No</option>
                                                                                            <option value="yes">Yes</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group not-draggable">
                                                                                    <label>Inspection Date</label>
                                                                                    <DatePicker
                                                                                        autoComplete={"nope"}
                                                                                        placeholderText={`Inspection Date`}
                                                                                        // className="form-control custom-wid"
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.inspection_date
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }${this.multiselectClass(
                                                                                            "inspection_date"
                                                                                        )} form-control custom-wid not-draggable`}
                                                                                        selected={
                                                                                            this.state.project.inspection_date
                                                                                                ? new Date(this.state.project.inspection_date)
                                                                                                : ""
                                                                                        }
                                                                                        onChange={date => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    inspection_date: new Date(date)
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Surveyor</label>{" "}
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        className={`custom-input form-control ${this.multiselectClass(
                                                                                            "surveyor"
                                                                                        )} not-draggable`}
                                                                                        placeholder="Surveyor"
                                                                                        value={this.state.project.surveyor}
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    surveyor: e.target.value
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 text-right btnOtr mt-3 mb-2">
                                        <span className="errorMessage">{this.state.showErrorBorder ? this.state.errorMessage : ""}</span>
                                        <button type="button" className="btn btn-secondary btnClr" onClick={() => this.confirmCancel()}>
                                            Cancel
                                        </button>
                                        {!this.state.loading ? (
                                            <button
                                                type="button"
                                                title={
                                                    this.state.locked === true
                                                        ? "You cannot update this item as this recommendation is locked!!!"
                                                        : ""
                                                }
                                                className={`btn btn-primary btnRgion ml-2
                                                 ${this.state.locked || !isDirty ? "cursor-notallowed" : ""}`}
                                                disabled={this.state.locked || !isDirty}
                                                onClick={() => this.setState({ showGroupUpdateConfirmation: true })}
                                            >
                                                {"Update"}
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-primary btnRgion ml-2">
                                                <div className="button-loader d-flex justify-content-center align-items-center">
                                                    <div className="spinner-border text-white" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </div>
                {this.renderConfirmationModal()}
                {this.renderGroupUpdateConfirmationModal()}
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { projectReducer, buildingReducer, recommendationsReducer, commonReducer, userReducer, assetReducer } = state;
    return { projectReducer, buildingReducer, recommendationsReducer, commonReducer, userReducer, assetReducer };
};

export default withRouter(
    connect(mapStateToProps, { ...recommendationsActions, ...buildingActions, ...userActions, ...projectActions, ...assetActions })(
        RecommendationForm
    )
);
