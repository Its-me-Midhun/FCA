import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import qs from "query-string";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import DatePicker from "react-datepicker";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import "react-datepicker/dist/react-datepicker.css";

import recommendationsActions from "../../../recommendations/actions";
import projectActions from "../../../project/actions";
import NumberFormat from "react-number-format";
import Loader from "../../../common/components/Loader";
import Portal from "../../../common/components/Portal";
import buildingActions from "../../../building/actions";
import userActions from "../../../users/actions";

import { API_ROUTE } from "../../../../config/constants";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import { popBreadCrumpData, addToBreadCrumpData, findInfoPathFromBreadCrump, findPrevPathFromBreadCrump } from "../../../../config/utils";
import ReactTooltip from "react-tooltip";
import ImageUploadModal from "../../../common/components/ImagesModal";
import RepotNoteTemplateModal from "../../../recommendations/components/RepotNoteTemplateModal";
import AssignAssetModal from "../../../recommendations/components/AssignAssetModal";
import RecommendationTemplateModal from "../../../recommendations/components/RecommendationTemplateModal";
import history from "../../../../config/history";
import assetActions from "../../../assets/actions";
class RecommendationForm extends Component {
    constructor(props) {
        super(props);
        const {
            location: { search }
        } = this.props;

        const query = qs.parse(search);
        this.state = {
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
                asset_condition_id: "",
                project_id: query.pid || "",
                comments: "",
                image: "",
                building_id: "",
                floor_id: "",
                addition_id: "",
                trade_id: "",
                essential: "",
                system_id: "",
                sub_system_id: "",
                img_desc: "",
                category_id: "",
                condition: "",
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
                funding: "",
                funding_source_id: "",
                status: "pending",
                surveyor: "",
                priority: 0,
                asset_notes: "",
                crv: "",
                inspection_date: "",
                inspection_time: "",
                maintenance_years: [],
                manufacturer: "",
                quantity: "",
                unit: "",
                cost_per_unit: "",
                options_cost: "",
                asset: {},
                recommendation_type: "building",
                fmp_id: "",
                fmp_project: "",
                fmp_track: ""
            },
            fmp: "",
            isLoading: true,
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
            selectedProject: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            locked: "",
            additional_maintenance_years: [],
            showAssetModal: false,
            assetData: {},
            showRecommendationTemplateModal: false,
            selectedHeading: "h1",
            priorityElementsData: []
        };
    }

    componentDidMount = async () => {
        this.setState({ initialValues: this.state.project });
        const {
            location: { search }
        } = this.props;

        const query = qs.parse(search);

        this.setState({
            activeDetail: sessionStorage.getItem("activeDetail")
                ? sessionStorage.getItem("activeDetail")
                : query.active_tab === "additional"
                ? "Additional Details"
                : query.active_tab === "asset"
                ? "Asset Details"
                : "Main Details"
        });
        await this.props.getPriorityElementDropDownData(query.pid);
        let updatedPriorityElements = this.props.recommendationsReducer.priorityElementsDropDownResponse?.priority_elements || [];
        this.props.getDepartmentByProject(query.pid);
        this.props.getConditionBasedOnProject(query.pid);
        this.props.getTradeBasedOnProject(query.pid);
        this.props.getCategoryBasedOnProject(query.pid);
        this.props.getFundingSourceByProject(query.pid);
        this.props.getProjectById(query.pid);
        this.props.getInitiativeDropdown({ project_id: query.pid, client_id: query.c_id });
        await this.props.getAllClientsRecomentation();
        if (query.c_id) {
            let regionList = await this.props.getRegionListBasedOnClient(query.c_id);
            this.setState({
                regionList,
                project: {
                    ...this.state.project,
                    client_id: query.c_id
                }
            });
        }
        const {
            projectReducer: {
                getAllClientsResponse: { clients }
            }
        } = this.props;

        const { selectedProject } = this.state;
        let projectList = [];
        if (query.inp || selectedProject) {
            projectList = this.props.projectReducer.getAllProjectsResponse.projects;
        }
        if (selectedProject) {
            await this.props.getDataById(selectedProject);
            const {
                recommendationsReducer: {
                    getRecommendationByIdResponse: {
                        code,
                        comments,
                        name,
                        success,
                        description,
                        trade,
                        system,
                        sub_system,
                        floor,
                        addition,
                        department,
                        category,
                        room,
                        asset_name,
                        asset_tag,
                        installed_year,
                        condition,
                        priority,
                        funding,
                        inspection_date,
                        future_capital,
                        project_total,
                        surveyor,
                        status,
                        initiative,
                        capital_type,
                        service_life,
                        usefull_life_remaining,
                        crv,
                        model_number,
                        serial_number,
                        capacity,
                        asset_notes,
                        area_served,
                        notes,
                        funding_source,
                        locked,
                        essential,
                        client,
                        region,
                        site,
                        building,
                        image,
                        maintenance_years,
                        priority_elements,
                        inspection_time,
                        created_at,
                        updated_at,
                        manufacturer,
                        project,
                        quantity,
                        unit,
                        cost_per_unit,
                        options_cost,
                        asset,
                        recommendation_type,
                        fmp,
                        fmp_id,
                        fmp_project,
                        fmp_track
                    }
                }
            } = this.props;
            if (success) {
                updatedPriorityElements = this.getUpdatedPriorityElementsData(
                    priority_elements,
                    this.props.recommendationsReducer.priorityElementsDropDownResponse.priority_elements
                );
                await this.props.getSystemBasedOnProject(query.pid, trade.id);
                const systemData = this.props.recommendationsReducer?.getSystemByProject?.systems || [];
                await this.props.getSubSystemBasedOnProject(query.pid, system.id);
                const subSystemData = this.props.recommendationsReducer?.getSubSystemByProject?.sub_systems || [];
                let regionList = await this.props.getRegionListBasedOnClient(client.id);
                let siteList = await this.props.getSiteListBasedOnRegion(region.id);
                this.props.getBuildingsBasedOnSite(site.id);
                this.props.getFloorBasedOnBuilding(building.id);
                this.props.getAdditionBasedOnBuilding(building.id);
                await this.setState({
                    emptyArray: systemData,
                    systemArray: subSystemData,
                    project: {
                        name,
                        code,
                        comments,
                        description,
                        essential,
                        trade_id: trade.id,
                        system_id: system.id || "",
                        sub_system_id: sub_system.id,
                        floor_id: floor.id,
                        addition_id: addition?.id,
                        department_id: department.id,
                        category_id: category.id,
                        room,
                        asset_name,
                        asset_tag,
                        installed_year,
                        condition,
                        priority,
                        funding,
                        inspection_date,
                        future_capital,
                        project_total,
                        surveyor,
                        status,
                        initiative_id: initiative ? initiative.id : "",
                        capital_type: capital_type || "",
                        service_life,
                        usefull_life_remaining,
                        crv,
                        model_number,
                        serial_number,
                        capacity,
                        asset_notes,
                        inspection_time,
                        client_id: client.id || "",
                        region_id: region.id || "",
                        site_id: site.id || "",
                        building_id: building.id || "",
                        building_type: building.building_type,
                        image: image.id ? image : [],
                        maintenance_years,
                        priority_elements,
                        img_desc: image.description || "",
                        hospital_name: building.hospital_name || "",
                        ministry: building.ministry || "",
                        area_served,
                        notes: notes || "",
                        image_id: image ? image.id : "",
                        funding_source_id: funding_source.id,
                        manufacturer,
                        project,
                        quantity,
                        unit,
                        cost_per_unit,
                        options_cost,
                        asset,
                        asset_id: asset?.id,
                        recommendation_type: recommendation_type || "asset",
                        fmp_id,
                        fmp_project,
                        fmp_track
                    },
                    fmp,
                    regionList,
                    siteList,
                    selectedImage: image,
                    createdAt: created_at,
                    updatedAt: updated_at,
                    locked: locked
                });
                await this.props.getAllBuildingsDropdown({ site_id: this.state.project.site_id, project_id: query.pid });
                let costTotal = 0;
                maintenance_years && maintenance_years.length && maintenance_years.map(item => (costTotal += item.amount));
                this.setState({
                    costTotal: costTotal,
                    initialCostYear: costTotal,
                    initialPriorityTotal: priority,
                    priorityTotal: priority
                });
                this.setState({ initialValues: _.cloneDeep(this.state.project) });
            }
        }
        if (!selectedProject) {
            let initialPriorityElementData = this.setPriorirtyElementData(updatedPriorityElements);
            await this.setState({
                project: {
                    ...this.state.project,
                    priority_elements: initialPriorityElementData
                }
            });
        }
        await this.setState({
            clients,
            projectList,
            isNewProject: query.inp,
            isLoading: false,
            priorityElementsData: updatedPriorityElements
        });
        // to set the previous data after creting new asset
        this.setPrevDataFromLocalStorage();
    };

    setPrevDataFromLocalStorage = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        if (JSON.parse(sessionStorage.getItem("currentFormData"))) {
            const project = JSON.parse(sessionStorage.getItem("currentFormData"));
            let systemData = [];
            let subSystemData = [];
            let regionList = [];
            let siteList = [];
            if (!this.state.selectedProject) {
                if (project?.trade_id) {
                    await this.props.getSystemBasedOnProject(query.pid, project?.trade_id);
                    systemData = this.props.recommendationsReducer?.getSystemByProject?.systems || [];
                }
                if (project?.system_id) {
                    await this.props.getSubSystemBasedOnProject(query.pid, project?.system_id);
                    subSystemData = this.props.recommendationsReducer?.getSubSystemByProject?.sub_systems || [];
                }
                if (project?.client_id) {
                    regionList = await this.props.getRegionListBasedOnClient(project?.client_id);
                }
                if (project?.region_id) {
                    siteList = await this.props.getSiteListBasedOnRegion(project?.region_id);
                }
                if (project?.site_id) {
                    this.props.getBuildingsBasedOnSite(project?.site_id);
                }
                if (project?.building_id) {
                    this.props.getFloorBasedOnBuilding(project?.building_id);
                    this.props.getAdditionBasedOnBuilding(project?.building_id);
                }
            }
            await this.setState({
                project,
                emptyArray: systemData,
                systemArray: subSystemData,
                regionList,
                siteList
            });
            this.assignLastCreatedAsset();
            localStorage.removeItem("currentFormData");
            localStorage.removeItem("activeDetail");
        }
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

    setPriorirtyElementData = priority_elements => {
        let priorityElementData = [];
        priority_elements.map((element, i) => {
            priorityElementData.push({ index: i + 1, element: "", option_id: "", recommendation_priority_id: "" });
        });
        return priorityElementData;
    };

    assignLastCreatedAsset = async () => {
        let lastCreatedAssetId = localStorage.getItem("lastCreatedAssetId");
        if (lastCreatedAssetId) {
            await this.props.getAssetDataById(lastCreatedAssetId);
            const resData = this.props.assetReducer.getDataByIdResponse;
            this.handleAssignAsset(resData);
            localStorage.removeItem("lastCreatedAssetId");
        }
    };

    onSelectConsultancyUsers = async selectedConsultancyUsers => {
        const { project } = this.state;
        let tempUsers = [];
        if (selectedConsultancyUsers.length) {
            selectedConsultancyUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            project: {
                ...project,
                consultancy_user_ids: tempUsers
            },
            selectedConsultancyUsers
        });
    };

    scrollRight = event => {
        let conent = document.querySelector("#yearList");
        conent.scrollLeft += 203;
        event.preventDefault();
    };

    scrollLeft = event => {
        let conent = document.querySelector("#yearList");
        conent.scrollLeft -= 203;
        event.preventDefault();
    };

    confirmCancel = () => {
        const { costTotal, initialCostYear, priorityTotal, project } = this.state;
        if (_.isEqual(this.state.initialValues, this.state.project) && costTotal === initialCostYear && priorityTotal === project.priority) {
            this.cancelForm();
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
        const oldData = myear.filter(i => i.year == name);
        if (oldData.length) {
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
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to clear and lose all changes?"}
                        type="cancel"
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => {
                            this.cancelForm();
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
        let siteList = await this.props.getSiteListBasedOnRegion(project.region_id, { project_id: query.pid });
        this.setState({
            siteList,
            project: {
                ...project,
                site_id: ""
            },
            siteLoading: false
        });
    };

    handleFloorSelect = async e => {
        this.setState({
            floorLoading: true
        });
        const { project } = this.state;
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
        const { project } = this.state;
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
        let buildingList = await this.props.getAllBuildingsDropdown({ site_id: project.site_id, project_id: query.pid });
        this.setState({
            buildingList,
            project: {
                ...project,
                building_id: ""
            },
            buildingLoading: false
        });
    };

    validate = () => {
        const { project } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!this.state.project.client_id.trim().length) {
            this.setState({
                errorMessage: "* Client field is missing",
                showErrorBorder: true
            });
            return false;
        }
        if (!this.state.project.trade_id.trim().length) {
            this.setState({
                errorMessage: "* Trade field is missing",
                showErrorBorder: true
            });
            return false;
        }
        if (!this.state.project.system_id.trim().length) {
            this.setState({
                showErrorBorder: true,
                errorMessage: "* System field is missing"
            });
            return false;
        }
        if (!this.state.project.sub_system_id.trim().length) {
            this.setState({
                showErrorBorder: true,
                errorMessage: "* SubSystem field is missing"
            });
            return false;
        }
        if (!project.description.trim().length) {
            this.setState({
                errorMessage: "* Description field is missing",
                showErrorBorder: true
            });
            return false;
        }
        if (!this.state.project.region_id.trim().length) {
            this.setState({
                errorMessage: "* Region field is missing",
                showErrorBorder: true
            });
            return false;
        }
        if (!this.state.project.site_id.trim().length) {
            this.setState({
                errorMessage: "* Site field is missing",
                showErrorBorder: true
            });
            return false;
        }
        if (!this.state.project.building_id.trim().length) {
            this.setState({
                errorMessage: "* Building field is missing",
                showErrorBorder: true
            });
            return false;
        }

        if (this.state.costTotal === 0) {
            this.setState({
                showErrorBorder: true,
                // uploadError: "* Project Total cannot be zero",
                errorMessage: "* Project Total cannot be zero"
            });
            return false;
        }
        if (!this.state.project.status) {
            this.setState({
                showErrorBorder: true,
                errorMessage: "* Status field is missing"
            });
            return false;
        }
        if (!this.state.project.category_id.trim().length) {
            this.setState({
                showErrorBorder: true,
                errorMessage: "* Category field is missing"
            });
            return false;
        }
        if (!this.state.project.capital_type.trim().length) {
            this.setState({
                showErrorBorder: true,
                errorMessage: "* Capital field is missing"
            });
            return false;
        }
        let validatePriorityElementResult = this.validatePriorityElements();
        if (!validatePriorityElementResult.isValidate) {
            this.setState({
                showErrorBorder: true,
                errorMessage: validatePriorityElementResult.errorMessage
            });
        }

        return true;
    };

    validatePriorityElements = () => {
        const { priorityElementsData, project } = this.state;
        let isValidate = true;
        let errorMessage = "";
        priorityElementsData.map((pElement, index) => {
            if (
                pElement.recommendation_required &&
                (!project.priority_elements[index].element || !project.priority_elements[index].element.toString().trim().length) &&
                project.priority_elements[index].element !== 0
            ) {
                isValidate = false;
                if (errorMessage === "") {
                    errorMessage = `* ${pElement.display_name} is required`;
                }
            }
        });
        return { isValidate, errorMessage };
    };

    addProject = async () => {
        const {
            project: { asset, ...rest },
            selectedImage,
            initialValues
        } = this.state;
        if (this.validate()) {
            this.setState({ loading: true });
            if (asset?.id) {
                rest.asset_id = asset?.id;
            }
            let newData = {};
            newData.code = rest.code;
            Object.entries(rest).map(([key, value]) => {
                if (!_.isEqual(value, initialValues[key])) {
                    newData[key] = value;
                }
            });
            await this.props.handleUpdateRecommendations(newData, selectedImage);
            this.setState({ loading: false });
            this.props.cancelForm();
        }
    };

    updateProject = async () => {
        const { project } = this.state;
        const { handleUpdateRecommendations } = this.props;
        if (this.validate()) {
            await handleUpdateRecommendations(project);
        }
    };

    cancelForm = () => {
        this.props.cancelForm();
    };

    getSubSystem = systemId => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        this.props.getSubSystemBasedOnProject(query.pid, systemId);
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
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
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

        await this.props.getCostYearByProject(query.pid, this.state.project.site_id);

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
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        this.setState({
            systemLoading: true
        });
        await this.props.getSystemBasedOnProject(query.pid, tradeId);
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
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        await this.props.getSubSystemBasedOnProject(query.pid, systemId);
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

    renderAssetModal = () => {
        const { showAssetModal, project } = this.state;
        if (!showAssetModal) return null;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        return (
            <Portal
                body={
                    <AssignAssetModal
                        handleAssignAsset={this.handleAssignAsset}
                        selectedData={project}
                        clientId={project.client_id || query.c_id}
                        onCancel={() => this.setState({ showAssetModal: false })}
                    />
                }
                onCancel={() => this.setState({ showAssetModal: false })}
            />
        );
    };

    handleAssignAsset = async assetData => {
        this.setState({
            project: {
                ...this.state.project,
                asset: assetData
            }
        });
    };

    scrollToTestDiv(id, hed) {
        const HEADER_HEIGHT = 125;
        const divElement = document.getElementById(id);
        const elementPosition = divElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition - HEADER_HEIGHT;
        window.scrollBy({
            top: offsetPosition,
            behavior: "smooth"
        });
        this.setState({ selectedHeading: hed });
    }

    renderPriorityElementToolTip = (name, options = [], notes, index = "") => {
        let tootTipData = "";
        if (options.length) {
            tootTipData = `<h4>${name ? name : `Priority Element ${index + 1}`}</h4>`;
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
        const { isLoading, loading } = this.state;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { clients, project, regionList, siteList, additional_maintenance_years, selectedHeading, priorityElementsData } = this.state;
        let role = localStorage.getItem("role") || "";

        return (
            <LoadingOverlay active={loading || isLoading} spinner={<Loader />} fadeSpeed={10}>
                <ReactTooltip id="recommandation_detils" effect="solid" />
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng additional-dtl addition-edit">
                        <ul>
                            <li
                                className={this.state.activeDetail == "Main Details" ? "active cursor-hand" : "cursor-hand"}
                                onClick={() => this.setActiveTab("Main Details")}
                            >
                                Main Details
                            </li>
                            {project.recommendation_type === "asset" && (
                                <li
                                    className={this.state.activeDetail == "Asset Details" ? "active cursor-hand" : "cursor-hand"}
                                    onClick={() => this.setActiveTab("Asset Details")}
                                >
                                    Asset Details
                                </li>
                            )}
                        </ul>

                        {this.state.activeDetail == "Main Details" ? (
                            <div className="tab-active location-sec recom-sec main-dtl-add recommendation-form add-recommendation flex-column">
                                <div className="col-md-12 detail-recom add-details-outer">
                                    <div className="outer-rcm recommendations">
                                        <div className="cnt-sec">
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div id="accordion">
                                                        <div className="card">
                                                            <div className="card-header" id="headingOne">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseOne"
                                                                        aria-expanded="true"
                                                                        aria-controls="collapseOne"
                                                                    >
                                                                        Recommendation
                                                                    </button>

                                                                    {/* {this.state.selectedProject && (
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Recommendation Identifier</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        readOnly
                                                                                        className="custom-input form-control"
                                                                                        placeholder="Recommendation Identifier"
                                                                                        value={this.state.project.code}
                                                                                        onChange={e =>
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    code: e.target.value
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )} */}
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Trade *</label>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.trade_id.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox`}
                                                                                        value={this.state.project.trade_id}
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
                                                                                <div className="custom-selecbox">
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
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            }custom-selecbox`}
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
                                                                                <div className="custom-selecbox">
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
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            }custom-selecbox`}
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
                                                                </div>
                                                            </div>
                                                            <div id="collapseOne" className="collapse show" aria-labelledby="heading">
                                                                <div className="card-body">
                                                                    <div className="outer-rcm mt-1">
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Type</label>
                                                                                    <div className="custom-selecbox">
                                                                                        <select
                                                                                            autoComplete={"nope"}
                                                                                            className={`custom-selecbox`}
                                                                                            value={this.state.project.recommendation_type}
                                                                                            onChange={async e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        recommendation_type: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <option value="asset">Asset</option>
                                                                                            <option value="building">Building</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm pt-0 txt-rcm-full-w">
                                                                            <div className="heading">
                                                                                <h3>Recommendation *</h3>
                                                                                {this.state.project.sub_system_id && (
                                                                                    <button
                                                                                        className="btn btn-clear"
                                                                                        onClick={() => this.toggleShowRecommendationTemplateModal()}
                                                                                    >
                                                                                        <i className="fas fa-plus" /> Add Template
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.description.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-input form-control`}
                                                                                        placeholder="Enter Recommendation"
                                                                                        value={this.state.project.description}
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    description: e.target.value
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
                                                        <div className="card">
                                                            <div className="card-header" id="headingTwo">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseTwo"
                                                                        aria-expanded="true"
                                                                        aria-controls="collapseTwo"
                                                                    >
                                                                        Geo Hierarchy
                                                                    </button>

                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Region *</label>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.region_id.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox`}
                                                                                        value={this.state.project.region_id}
                                                                                        onChange={async e => {
                                                                                            await this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    region_id: e.target.value
                                                                                                }
                                                                                            });
                                                                                            this.handleRegionSelect();
                                                                                        }}
                                                                                    >
                                                                                        <option value="">Select</option>
                                                                                        {regionList && regionList.length
                                                                                            ? regionList.map((item, i) => (
                                                                                                  <option value={item.id} key={i}>
                                                                                                      {item.name}
                                                                                                  </option>
                                                                                              ))
                                                                                            : null}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Site *</label>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.site_id.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox`}
                                                                                        value={this.state.project.site_id}
                                                                                        onChange={async e => {
                                                                                            await this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    site_id: e.target.value
                                                                                                }
                                                                                            });
                                                                                            await this.handleSiteSelect();
                                                                                            if (this.state.project.site_id !== "") {
                                                                                                await this.getCostYear();
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <option value="">Select</option>
                                                                                        {siteList && siteList.length
                                                                                            ? siteList.map((item, i) => (
                                                                                                  <option value={item.id} key={i}>
                                                                                                      {item.name}
                                                                                                  </option>
                                                                                              ))
                                                                                            : null}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Building *</label>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.building_id.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox`}
                                                                                        value={this.state.project.building_id}
                                                                                        onChange={async e => {
                                                                                            let buildingType = e.target.value
                                                                                                ? this.props.userReducer
                                                                                                      .getAllBuildingsDropdownResponse.buildings &&
                                                                                                  this.props.userReducer
                                                                                                      .getAllBuildingsDropdownResponse.buildings
                                                                                                      .length
                                                                                                    ? this.props.userReducer.getAllBuildingsDropdownResponse.buildings.find(
                                                                                                          b => b.id == e.target.value
                                                                                                      )
                                                                                                        ? this.props.userReducer.getAllBuildingsDropdownResponse.buildings.find(
                                                                                                              b => b.id == e.target.value
                                                                                                          )
                                                                                                        : null
                                                                                                    : null
                                                                                                : "";
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    building_id: e.target.value,
                                                                                                    building_type: buildingType
                                                                                                        ? buildingType.description
                                                                                                        : "",
                                                                                                    ministry: buildingType
                                                                                                        ? buildingType.ministry
                                                                                                        : "",
                                                                                                    hospital_name: buildingType
                                                                                                        ? buildingType.hospital_name
                                                                                                        : ""
                                                                                                },
                                                                                                activeBuilding: e.target.value
                                                                                            });
                                                                                            this.handleAdditionSelect(e);
                                                                                            this.handleFloorSelect(e);
                                                                                        }}
                                                                                    >
                                                                                        <option value="">Select</option>
                                                                                        {this.props.userReducer.getAllBuildingsDropdownResponse
                                                                                            .buildings &&
                                                                                        this.props.userReducer.getAllBuildingsDropdownResponse
                                                                                            .buildings.length
                                                                                            ? this.props.userReducer.getAllBuildingsDropdownResponse.buildings.map(
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
                                                                </div>
                                                            </div>
                                                            <div id="collapseTwo" className="collapse show" aria-labelledby="headingTwo">
                                                                <div className="card-body">
                                                                    <div className="outer-rcm mt-1">
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Building Type *</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        readOnly
                                                                                        autoComplete={"nope"}
                                                                                        className="custom-input form-control"
                                                                                        placeholder=" Building Type"
                                                                                        value={this.state.project.building_type}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Addition</label>
                                                                                    <div className="custom-selecbox">
                                                                                        <select
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.addition_id || ""}
                                                                                            onChange={async e => {
                                                                                                await this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        addition_id: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.props.recommendationsReducer.getAdditionByBuilding
                                                                                                ?.additions?.length
                                                                                                ? this.props.recommendationsReducer.getAdditionByBuilding.additions.map(
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
                                                                                    <label>Floor</label>
                                                                                    <div className="custom-selecbox">
                                                                                        <select
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.floor_id || ""}
                                                                                            onChange={async e => {
                                                                                                await this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        floor_id: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.props.recommendationsReducer &&
                                                                                            this.props.recommendationsReducer.getFloorByBuilding &&
                                                                                            this.props.recommendationsReducer.getFloorByBuilding
                                                                                                .floors &&
                                                                                            this.props.recommendationsReducer.getFloorByBuilding
                                                                                                .floors.length
                                                                                                ? this.props.recommendationsReducer.getFloorByBuilding.floors.map(
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
                                                                                    <label>Room</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        value={this.state.project.room}
                                                                                        className="custom-input form-control"
                                                                                        placeholder="Enter Room"
                                                                                        onChange={e =>
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    room: e.target.value
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <>
                                                            {this.props.projectReducer.getProjectByIdResponse?.display_unit ? (
                                                                <div className="card">
                                                                    <div className="card-header" id="headingTre">
                                                                        <div className="otr-recom-div">
                                                                            <button
                                                                                className="btn btn-link"
                                                                                data-toggle="collapse"
                                                                                data-target="#collapseTre"
                                                                                aria-expanded="false"
                                                                                aria-controls="collapseOne"
                                                                            >
                                                                                Capital Spending Plan
                                                                            </button>
                                                                            <div className="txt-rcm">
                                                                                <div className="content-inp-card blue-sec">
                                                                                    <h3 className="p-name">Project Total</h3>
                                                                                    <h3>
                                                                                        <NumberFormat
                                                                                            autoComplete={"nope"}
                                                                                            className="color-white"
                                                                                            value={parseInt(this.state.costTotal || 0)}
                                                                                            thousandSeparator={true}
                                                                                            displayType={"text"}
                                                                                            prefix={"$ "}
                                                                                        />
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="txt-categ txt-rcm year-item main_year">
                                                                                <div className="content-inp-card">
                                                                                    <div className="form-group">
                                                                                        <label>Quantity</label>
                                                                                        <NumberFormat
                                                                                            autoComplete={"nope"}
                                                                                            className="custom-input form-control"
                                                                                            placeholder="Quantity"
                                                                                            value={project.quantity}
                                                                                            thousandSeparator={true}
                                                                                            displayType={"input"}
                                                                                            onValueChange={values => {
                                                                                                const { value } = values;
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        quantity: value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="txt-categ txt-rcm year-item main_year">
                                                                                <div className="content-inp-card">
                                                                                    <div className="form-group">
                                                                                        <label>Unit</label>
                                                                                        <input
                                                                                            autoComplete={"nope"}
                                                                                            className="custom-input form-control"
                                                                                            placeholder="Unit"
                                                                                            value={project.unit}
                                                                                            type="text"
                                                                                            onChange={e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        unit: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div id="collapseTre" className="collapse" aria-labelledby="headingTre">
                                                                        <div className="card-body add-sec">
                                                                            <div className="outer-rcm mt-1">
                                                                                <div className="txt-categ txt-rcm year-item main_year">
                                                                                    <div className="content-inp-card">
                                                                                        <div className="form-group">
                                                                                            <label>Cost per Unit</label>
                                                                                            <NumberFormat
                                                                                                autoComplete={"nope"}
                                                                                                className="custom-input form-control"
                                                                                                placeholder="Cost per Unit"
                                                                                                value={project.cost_per_unit}
                                                                                                thousandSeparator={true}
                                                                                                displayType={"input"}
                                                                                                prefix={"$ "}
                                                                                                onValueChange={values => {
                                                                                                    const { value } = values;
                                                                                                    this.setState({
                                                                                                        project: {
                                                                                                            ...project,
                                                                                                            cost_per_unit: value
                                                                                                        }
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="txt-categ txt-rcm year-item main_year">
                                                                                    <div className="content-inp-card">
                                                                                        <div className="form-group">
                                                                                            <label>Opinions of Cost</label>
                                                                                            <NumberFormat
                                                                                                autoComplete={"nope"}
                                                                                                className="custom-input form-control"
                                                                                                placeholder="Opinions of Cost"
                                                                                                value={project.options_cost}
                                                                                                thousandSeparator={true}
                                                                                                displayType={"input"}
                                                                                                prefix={"$ "}
                                                                                                onValueChange={values => {
                                                                                                    const { value } = values;
                                                                                                    this.setState({
                                                                                                        project: {
                                                                                                            ...project,
                                                                                                            options_cost: value
                                                                                                        }
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {this.state.project.maintenance_years &&
                                                                                    this.state.project.maintenance_years.map((item, i) => {
                                                                                        return (
                                                                                            <>
                                                                                                <div className="txt-categ txt-rcm year-item main_year">
                                                                                                    <div className="content-inp-card">
                                                                                                        <div className="form-group">
                                                                                                            <label>{item && item.year}</label>
                                                                                                            <NumberFormat
                                                                                                                autoComplete={"nope"}
                                                                                                                className="custom-input form-control"
                                                                                                                placeholder="$ 0"
                                                                                                                value={
                                                                                                                    (item && parseInt(item.amount)) ||
                                                                                                                    ""
                                                                                                                }
                                                                                                                thousandSeparator={true}
                                                                                                                displayType={"input"}
                                                                                                                prefix={"$ "}
                                                                                                                onValueChange={values => {
                                                                                                                    const { value } = values;
                                                                                                                    this.setMaintenanceYear(
                                                                                                                        values,
                                                                                                                        item.year
                                                                                                                    );
                                                                                                                }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    {/* additional_maintenance_years.includes(item.year) && */}
                                                                                                    {additional_maintenance_years.includes(
                                                                                                        item.year
                                                                                                    ) &&
                                                                                                    this.state.project.maintenance_years &&
                                                                                                    this.state.project.maintenance_years.length -
                                                                                                        1 ===
                                                                                                        i ? (
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            class="close"
                                                                                                            data-dismiss="modal"
                                                                                                            aria-label="Close"
                                                                                                            onClick={async e =>
                                                                                                                await this.removeMaintenanceYear(item)
                                                                                                            }
                                                                                                        >
                                                                                                            <span aria-hidden="true">
                                                                                                                <img src="/img/close.svg" alt="" />
                                                                                                            </span>
                                                                                                        </button>
                                                                                                    ) : null}
                                                                                                </div>
                                                                                            </>
                                                                                        );
                                                                                    })}
                                                                                <div className={` txt-rcm `}>
                                                                                    <div className="content-inp-card icn">
                                                                                        <button
                                                                                            class="btn btn-add"
                                                                                            onClick={async e => await this.addMaintenanceYear()}
                                                                                        >
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                width="45"
                                                                                                height="45"
                                                                                                viewBox="0 0 45 45"
                                                                                            >
                                                                                                <g
                                                                                                    id="Group_55"
                                                                                                    data-name="Group 55"
                                                                                                    transform="translate(-1217 -1006)"
                                                                                                >
                                                                                                    <rect
                                                                                                        id="Rectangle_86"
                                                                                                        data-name="Rectangle 86"
                                                                                                        width="45"
                                                                                                        height="45"
                                                                                                        rx="22.5"
                                                                                                        transform="translate(1217 1006)"
                                                                                                        fill="#c3cad0"
                                                                                                    />
                                                                                                    <path
                                                                                                        id="Path_8"
                                                                                                        data-name="Path 8"
                                                                                                        d="M15.844-.263H9.735V5.932H7.3V-.263H1.218V-2.471H7.3V-8.694H9.735v6.223h6.108Z"
                                                                                                        transform="translate(1230.782 1029.694)"
                                                                                                        fill="#848e97"
                                                                                                    />
                                                                                                </g>
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="card">
                                                                    <div className="card-header" id="headingTre">
                                                                        <div className="otr-recom-div">
                                                                            <button
                                                                                className="btn btn-link"
                                                                                data-toggle="collapse"
                                                                                data-target="#collapseTre"
                                                                                aria-expanded="false"
                                                                                aria-controls="collapseOne"
                                                                            >
                                                                                Capital Spending Plan
                                                                            </button>
                                                                            <div className="txt-rcm">
                                                                                <div className="content-inp-card blue-sec">
                                                                                    <h3 className="p-name">Project Total</h3>
                                                                                    <h3>
                                                                                        <NumberFormat
                                                                                            autoComplete={"nope"}
                                                                                            className="color-white"
                                                                                            value={parseInt(this.state.costTotal || 0)}
                                                                                            thousandSeparator={true}
                                                                                            displayType={"text"}
                                                                                            prefix={"$ "}
                                                                                        />
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.project.maintenance_years &&
                                                                                this.state.project.maintenance_years.map((item, i) => {
                                                                                    return (
                                                                                        <>
                                                                                            {(i === 0 || i === 1) && (
                                                                                                <div className="txt-categ txt-rcm year-item main_year">
                                                                                                    <div className="content-inp-card">
                                                                                                        <div className="form-group">
                                                                                                            <label>{item && item.year}</label>
                                                                                                            <NumberFormat
                                                                                                                autoComplete={"nope"}
                                                                                                                className="custom-input form-control"
                                                                                                                placeholder="$ 0"
                                                                                                                value={
                                                                                                                    (item && parseInt(item.amount)) ||
                                                                                                                    ""
                                                                                                                }
                                                                                                                thousandSeparator={true}
                                                                                                                displayType={"input"}
                                                                                                                prefix={"$ "}
                                                                                                                onValueChange={values => {
                                                                                                                    const { value } = values;
                                                                                                                    this.setMaintenanceYear(
                                                                                                                        values,
                                                                                                                        item.year
                                                                                                                    );
                                                                                                                }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    {additional_maintenance_years.includes(
                                                                                                        item.year
                                                                                                    ) &&
                                                                                                    this.state.project.maintenance_years &&
                                                                                                    this.state.project.maintenance_years.length -
                                                                                                        1 ===
                                                                                                        i ? (
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            class="close"
                                                                                                            data-dismiss="modal"
                                                                                                            aria-label="Close"
                                                                                                            onClick={async e =>
                                                                                                                await this.removeMaintenanceYear(item)
                                                                                                            }
                                                                                                        >
                                                                                                            <span aria-hidden="true">
                                                                                                                <img src="/img/close.svg" alt="" />
                                                                                                            </span>
                                                                                                        </button>
                                                                                                    ) : null}
                                                                                                </div>
                                                                                            )}
                                                                                        </>
                                                                                    );
                                                                                })}
                                                                            {this.state.project.maintenance_years?.length < 2 && (
                                                                                <div className={` txt-rcm `}>
                                                                                    <div className="content-inp-card icn">
                                                                                        <button
                                                                                            class="btn btn-add"
                                                                                            onClick={async e => await this.addMaintenanceYear()}
                                                                                        >
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                width="45"
                                                                                                height="45"
                                                                                                viewBox="0 0 45 45"
                                                                                            >
                                                                                                <g
                                                                                                    id="Group_55"
                                                                                                    data-name="Group 55"
                                                                                                    transform="translate(-1217 -1006)"
                                                                                                >
                                                                                                    <rect
                                                                                                        id="Rectangle_86"
                                                                                                        data-name="Rectangle 86"
                                                                                                        width="45"
                                                                                                        height="45"
                                                                                                        rx="22.5"
                                                                                                        transform="translate(1217 1006)"
                                                                                                        fill="#c3cad0"
                                                                                                    />
                                                                                                    <path
                                                                                                        id="Path_8"
                                                                                                        data-name="Path 8"
                                                                                                        d="M15.844-.263H9.735V5.932H7.3V-.263H1.218V-2.471H7.3V-8.694H9.735v6.223h6.108Z"
                                                                                                        transform="translate(1230.782 1029.694)"
                                                                                                        fill="#848e97"
                                                                                                    />
                                                                                                </g>
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div id="collapseTre" className="collapse" aria-labelledby="headingTre">
                                                                        <div className="card-body add-sec">
                                                                            <div className="outer-rcm mt-1">
                                                                                {this.state.project.maintenance_years &&
                                                                                    this.state.project.maintenance_years.map((item, i) => {
                                                                                        return (
                                                                                            <>
                                                                                                {i !== 0 && i !== 1 && (
                                                                                                    <div className="txt-categ txt-rcm year-item main_year">
                                                                                                        <div className="content-inp-card">
                                                                                                            <div className="form-group">
                                                                                                                <label>{item && item.year}</label>
                                                                                                                <NumberFormat
                                                                                                                    autoComplete={"nope"}
                                                                                                                    className="custom-input form-control"
                                                                                                                    placeholder="$ 0"
                                                                                                                    value={
                                                                                                                        (item &&
                                                                                                                            parseInt(item.amount)) ||
                                                                                                                        ""
                                                                                                                    }
                                                                                                                    thousandSeparator={true}
                                                                                                                    displayType={"input"}
                                                                                                                    prefix={"$ "}
                                                                                                                    onValueChange={values => {
                                                                                                                        const { value } = values;
                                                                                                                        this.setMaintenanceYear(
                                                                                                                            values,
                                                                                                                            item.year
                                                                                                                        );
                                                                                                                    }}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {/* additional_maintenance_years.includes(item.year) && */}
                                                                                                        {additional_maintenance_years.includes(
                                                                                                            item.year
                                                                                                        ) &&
                                                                                                        this.state.project.maintenance_years &&
                                                                                                        this.state.project.maintenance_years.length -
                                                                                                            1 ===
                                                                                                            i ? (
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                class="close"
                                                                                                                data-dismiss="modal"
                                                                                                                aria-label="Close"
                                                                                                                onClick={async e =>
                                                                                                                    await this.removeMaintenanceYear(
                                                                                                                        item
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                <span aria-hidden="true">
                                                                                                                    <img
                                                                                                                        src="/img/close.svg"
                                                                                                                        alt=""
                                                                                                                    />
                                                                                                                </span>
                                                                                                            </button>
                                                                                                        ) : null}
                                                                                                    </div>
                                                                                                )}
                                                                                            </>
                                                                                        );
                                                                                    })}
                                                                                {this.state.project.maintenance_years?.length >= 2 && (
                                                                                    <div className={` txt-rcm `}>
                                                                                        <div className="content-inp-card icn">
                                                                                            <button
                                                                                                class="btn btn-add"
                                                                                                onClick={async e => await this.addMaintenanceYear()}
                                                                                            >
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    width="45"
                                                                                                    height="45"
                                                                                                    viewBox="0 0 45 45"
                                                                                                >
                                                                                                    <g
                                                                                                        id="Group_55"
                                                                                                        data-name="Group 55"
                                                                                                        transform="translate(-1217 -1006)"
                                                                                                    >
                                                                                                        <rect
                                                                                                            id="Rectangle_86"
                                                                                                            data-name="Rectangle 86"
                                                                                                            width="45"
                                                                                                            height="45"
                                                                                                            rx="22.5"
                                                                                                            transform="translate(1217 1006)"
                                                                                                            fill="#c3cad0"
                                                                                                        />
                                                                                                        <path
                                                                                                            id="Path_8"
                                                                                                            data-name="Path 8"
                                                                                                            d="M15.844-.263H9.735V5.932H7.3V-.263H1.218V-2.471H7.3V-8.694H9.735v6.223h6.108Z"
                                                                                                            transform="translate(1230.782 1029.694)"
                                                                                                            fill="#848e97"
                                                                                                        />
                                                                                                    </g>
                                                                                                </svg>
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>

                                                        <div className="card">
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
                                                                        <div className="content-inp-card blue-sec">
                                                                            <h3 className="p-name">Priority Total</h3>
                                                                            <h3 className="color-white">
                                                                                {this.state.priorityTotal || this.state.project.priority || 0}
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                    {priorityElementsData.map((item, i) => (
                                                                        <>
                                                                            {(i === 0 || i === 1) && (
                                                                                <div className="txt-rcm" key={i}>
                                                                                    <div
                                                                                        className="content-inp-card"
                                                                                        data-tip={this.renderPriorityElementToolTip(
                                                                                            item.display_name,
                                                                                            item.options,
                                                                                            item.notes,
                                                                                            i
                                                                                        )}
                                                                                        data-for="recommandation_detils"
                                                                                        data-place="top"
                                                                                        data-html={true}
                                                                                    >
                                                                                        {item.options?.length ? (
                                                                                            <div className="form-group">
                                                                                                <label>
                                                                                                    {item.display_name || `Priority Element ${i + 1}`}
                                                                                                </label>
                                                                                                <select
                                                                                                    autoComplete={"nope"}
                                                                                                    className={`form-control fs-12 ${
                                                                                                        item.recommendation_required &&
                                                                                                        this.state.showErrorBorder &&
                                                                                                        project.priority_elements[i] &&
                                                                                                        (!project.priority_elements[i].element ||
                                                                                                            !project.priority_elements[i].element
                                                                                                                .toString()
                                                                                                                .trim().length) &&
                                                                                                        project.priority_elements[i].element !== 0
                                                                                                            ? "error-border "
                                                                                                            : ""
                                                                                                    }`}
                                                                                                    placeholder="0"
                                                                                                    onChange={e => {
                                                                                                        this.setPriorityelement(e, item.id);
                                                                                                    }}
                                                                                                    name={i + 1}
                                                                                                    value={
                                                                                                        this.state.project.priority_elements[i]
                                                                                                            ?.option_id || ""
                                                                                                    }
                                                                                                >
                                                                                                    <option value={""}>Select</option>
                                                                                                    {item.options &&
                                                                                                        item.options.map((priorityItem, i) => (
                                                                                                            <option
                                                                                                                key={priorityItem.id}
                                                                                                                className="fs-12"
                                                                                                                value={priorityItem.id}
                                                                                                            >
                                                                                                                {priorityItem.name}
                                                                                                            </option>
                                                                                                        ))}
                                                                                                </select>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <>
                                                                                                <label>
                                                                                                    {item.display_name || `Priority Element ${i + 1}`}
                                                                                                </label>
                                                                                                <input
                                                                                                    autoComplete={"nope"}
                                                                                                    type="text"
                                                                                                    className="custom-input form-control"
                                                                                                    placeholder="0"
                                                                                                    name={i + 1}
                                                                                                    value={
                                                                                                        parseInt(
                                                                                                            this.state.project.priority_elements[i]
                                                                                                                ?.element
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
                                                                                            className="content-inp-card"
                                                                                            data-tip={this.renderPriorityElementToolTip(
                                                                                                item.display_name,
                                                                                                item.options,
                                                                                                item.notes,
                                                                                                i
                                                                                            )}
                                                                                            data-for="recommandation_detils"
                                                                                            data-place="top"
                                                                                            data-html={true}
                                                                                        >
                                                                                            {item.options?.length ? (
                                                                                                <div className="form-group">
                                                                                                    <label>
                                                                                                        {item.display_name ||
                                                                                                            `Priority Element ${i + 1}`}
                                                                                                    </label>
                                                                                                    <select
                                                                                                        autoComplete={"nope"}
                                                                                                        className={`form-control fs-12 ${
                                                                                                            item.recommendation_required &&
                                                                                                            this.state.showErrorBorder &&
                                                                                                            project.priority_elements[i] &&
                                                                                                            (!project.priority_elements[i].element ||
                                                                                                                !project.priority_elements[i].element
                                                                                                                    .toString()
                                                                                                                    .trim().length) &&
                                                                                                            project.priority_elements[i].element !== 0
                                                                                                                ? "error-border "
                                                                                                                : ""
                                                                                                        }`}
                                                                                                        placeholder="0"
                                                                                                        onChange={e => {
                                                                                                            this.setPriorityelement(e, item.id);
                                                                                                        }}
                                                                                                        name={i + 1}
                                                                                                        value={
                                                                                                            this.state.project.priority_elements[i]
                                                                                                                ?.option_id || ""
                                                                                                        }
                                                                                                    >
                                                                                                        <option value={""}>Select</option>
                                                                                                        {item.options &&
                                                                                                            item.options.map((priorityItem, i) => (
                                                                                                                <option
                                                                                                                    key={priorityItem.id}
                                                                                                                    className="fs-12"
                                                                                                                    value={priorityItem.id}
                                                                                                                >
                                                                                                                    {priorityItem.name}
                                                                                                                </option>
                                                                                                            ))}
                                                                                                    </select>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <label>
                                                                                                        {item.display_name ||
                                                                                                            `Priority Element ${i + 1}`}
                                                                                                    </label>
                                                                                                    <input
                                                                                                        autoComplete={"nope"}
                                                                                                        type="text"
                                                                                                        className="custom-input form-control"
                                                                                                        placeholder="0"
                                                                                                        name={i + 1}
                                                                                                        value={
                                                                                                            parseInt(
                                                                                                                this.state.project.priority_elements[
                                                                                                                    i
                                                                                                                ]?.element
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
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {this.state.fmp === "yes" && (
                                                            <div className={`card ${this.state.showErrorBorder ? "error-border" : ""}`}>
                                                                <div className="card-header" id="headingSeven">
                                                                    <div className="otr-recom-div">
                                                                        <button
                                                                            className="btn btn-link"
                                                                            data-toggle="collapse"
                                                                            data-target="#collapseSeven"
                                                                            aria-expanded="false"
                                                                            aria-controls="collapseOne"
                                                                        >
                                                                            Facility Master Plan
                                                                        </button>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>FMP ID</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        className={`form-control`}
                                                                                        placeholder="FMP ID"
                                                                                        value={project?.fmp_id}
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    fmp_id: e.target.value
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
                                                                                    <label>FMP Project</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        className={`form-control`}
                                                                                        placeholder="FMP Project"
                                                                                        value={project?.fmp_project}
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    fmp_project: e.target.value
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
                                                                                    <label>FMP Track</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        className={`form-control`}
                                                                                        placeholder="FMP Track"
                                                                                        value={project?.fmp_track}
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    fmp_track: e.target.value
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div id="collapseSeven" className="collapse" aria-labelledby="headingSeven">
                                                                    <div className="card-body"></div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="card">
                                                            <div className="card-header" id="headingFive">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseFive"
                                                                        aria-expanded="false"
                                                                        aria-controls="collapseOne"
                                                                    >
                                                                        Additional Details
                                                                    </button>
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Status</label>
                                                                                <div
                                                                                    className={`${
                                                                                        this.state.showErrorBorder && !this.state.project.status
                                                                                            ? "error-border "
                                                                                            : ""
                                                                                    }custom-selecbox`}
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
                                                                                <label>Category *</label>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.category_id.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox`}
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
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.capital_type.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        } custom-selecbox`}
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
                                                                                        <option value={"NI"} key={"NI"}>
                                                                                            {"Non-Infrastructure"}
                                                                                        </option>
                                                                                        <option value={"DM"} key={"DM"}>
                                                                                            {"Deferred Maintenance"}
                                                                                        </option>
                                                                                        <option value={"FC"} key={"FC"}>
                                                                                            {"Future Capital"}
                                                                                        </option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div id="collapseFive" className="collapse" aria-labelledby="headingFive">
                                                                <div className="card-body">
                                                                    <div className="outer-rcm mt-1">
                                                                        {project.recommendation_type === "building" && (
                                                                            <>
                                                                                <div className="txt-rcm">
                                                                                    <div className="content-inp-card">
                                                                                        <div className="form-group">
                                                                                            <label>Installed Year</label>
                                                                                            <NumberFormat
                                                                                                autoComplete={"nope"}
                                                                                                className="form-control"
                                                                                                placeholder="Installed Year"
                                                                                                value={
                                                                                                    parseInt(this.state.project.installed_year) || ""
                                                                                                }
                                                                                                format="####"
                                                                                                displayType={"input"}
                                                                                                onValueChange={values => {
                                                                                                    const { value } = values;
                                                                                                    this.setState({
                                                                                                        project: {
                                                                                                            ...project,
                                                                                                            installed_year: value
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
                                                                                            <label>Service Life</label>
                                                                                            <input
                                                                                                type="text"
                                                                                                autoComplete={"nope"}
                                                                                                className="form-control"
                                                                                                placeholder=" Service Life"
                                                                                                value={this.state.project.service_life}
                                                                                                onChange={e => {
                                                                                                    this.setState({
                                                                                                        project: {
                                                                                                            ...project,
                                                                                                            service_life: e.target.value
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
                                                                                            <label>Useful Life Remaining</label>
                                                                                            <input
                                                                                                readOnly
                                                                                                type="text"
                                                                                                autoComplete={"nope"}
                                                                                                className="form-control cursor-notallowed"
                                                                                                placeholder=" Useful Life Remaining"
                                                                                                value={this.state.project.usefull_life_remaining}
                                                                                                onChange={e => {
                                                                                                    this.setState({
                                                                                                        project: {
                                                                                                            ...project,
                                                                                                            usefull_life_remaining: e.target.value
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
                                                                                            <label>CRV</label>
                                                                                            <NumberFormat
                                                                                                autoComplete={"nope"}
                                                                                                className="form-control"
                                                                                                placeholder="CRV"
                                                                                                value={parseInt(this.state.project.crv) || ""}
                                                                                                thousandSeparator={true}
                                                                                                displayType={"input"}
                                                                                                prefix={"$ "}
                                                                                                onValueChange={values => {
                                                                                                    const { value } = values;
                                                                                                    this.setState({
                                                                                                        project: {
                                                                                                            ...project,
                                                                                                            crv: value
                                                                                                        }
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Parent Building</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        readOnly
                                                                                        className="custom-input form-control cursor-notallowed"
                                                                                        placeholder="Parent Building"
                                                                                        value={this.state.project.hospital_name}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Department</label>
                                                                                    <div className="custom-selecbox">
                                                                                        <select
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.department_id}
                                                                                            onChange={e =>
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        department_id: e.target.value
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.props.recommendationsReducer &&
                                                                                            this.props.recommendationsReducer.getDepaartmentsByProject
                                                                                                .departments &&
                                                                                            this.props.recommendationsReducer.getDepaartmentsByProject
                                                                                                .departments.length
                                                                                                ? this.props.recommendationsReducer.getDepaartmentsByProject.departments
                                                                                                      .filter(item => item.name !== null)
                                                                                                      .map((item, i) => (
                                                                                                          <option value={item.id} key={i}>
                                                                                                              {item.name}
                                                                                                          </option>
                                                                                                      ))
                                                                                                : null}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Initiative</label>
                                                                                    <div className="custom-selecbox">
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
                                                                                            {this.props.recommendationsReducer &&
                                                                                            this.props.recommendationsReducer.getInitiativeDropdown
                                                                                                .projects &&
                                                                                            this.props.recommendationsReducer.getInitiativeDropdown
                                                                                                .projects.length
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
                                                                                    <div className="custom-selecbox">
                                                                                        <select
                                                                                            className="custom-selecbox"
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
                                                                        {/* <div className="txt-rcm"></div> */}
                                                                    </div>
                                                                    <div className="form-row mt-2">
                                                                        <div className="col-md-4">
                                                                            <div className="outer-rcm">
                                                                                <div className="txt-rcm w-100">
                                                                                    <div>
                                                                                        <img src="/img/icn1.png" alt="" />
                                                                                    </div>
                                                                                    <div className="txt-secn">
                                                                                        <h4>Surveyor</h4>
                                                                                        <input
                                                                                            type="text"
                                                                                            autoComplete={"nope"}
                                                                                            className="form-control"
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
                                                                        <div className="col-md-4">
                                                                            <div className="outer-rcm">
                                                                                <div className="txt-rcm w-100">
                                                                                    <div>
                                                                                        <img src="/img/icn-2.png" alt="" />
                                                                                    </div>
                                                                                    <div className="txt-secn">
                                                                                        <h4>Inspection Date</h4>
                                                                                        <DatePicker
                                                                                            autoComplete={"nope"}
                                                                                            placeholderText={`Inspection Date`}
                                                                                            className="form-control custom-wid"
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
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="outer-rcm">
                                                                                <div className="txt-rcm w-100">
                                                                                    <div>
                                                                                        <img src="/img/icn-3.png" alt="" />
                                                                                    </div>
                                                                                    <div className="txt-secn">
                                                                                        <h4>Inspection Time</h4>
                                                                                        <TimePicker
                                                                                            autoComplete={"nope"}
                                                                                            className="custom-wid"
                                                                                            placeholder="Inspection Time"
                                                                                            use12Hours
                                                                                            showSecond={false}
                                                                                            value={
                                                                                                this.state.project.inspection_time === "Invalid date"
                                                                                                    ? ""
                                                                                                    : this.state.project.inspection_time
                                                                                                    ? moment(
                                                                                                          `7/10/2013 ${this.state.project.inspection_time}`
                                                                                                      )
                                                                                                    : ""
                                                                                            }
                                                                                            onChange={e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        inspection_time: moment(e, "hh").format("LT")
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
                                                <div className="col-md-4 back-set">
                                                    <div className="details-img-block details-img-new">
                                                        {this.state.selectedImage && this.state.selectedImage.url ? (
                                                            <>
                                                                {this.state.selectedImage !== this.state.project.image ? (
                                                                    <>
                                                                        <div
                                                                            className="custom-image-upload edit-addtn"
                                                                            onClick={this.handleAddAttachment}
                                                                        >
                                                                            <label for="file-input">
                                                                                {this.state.project.image.name ? (
                                                                                    <i class="fas fa-pencil-alt"></i>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </label>
                                                                        </div>
                                                                        <img src={`${this.state.previewImage}`} alt="" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div
                                                                            className="custom-image-upload edit-addtn"
                                                                            onClick={this.handleAddAttachment}
                                                                        >
                                                                            <label for="file-input">
                                                                                {this.state.project.image.name ? (
                                                                                    <i className="fas fa-pencil-alt"></i>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </label>
                                                                        </div>
                                                                        <img src={`${this.state.selectedImage.url}`} alt="" />
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {this.state.previewImage ? (
                                                                    <>
                                                                        <div
                                                                            className="custom-image-upload edit-addtn"
                                                                            onClick={this.handleAddAttachment}
                                                                        >
                                                                            <label for="file-input">
                                                                                {this.state.project.image && this.state.project.image.name ? (
                                                                                    <i className="fas fa-pencil-alt"></i>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </label>
                                                                        </div>
                                                                        <img src={`${this.state.previewImage}`} alt="" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="custom-image-upload" onClick={this.handleAddAttachment}>
                                                                            <label htmlFor="file-input">Add Image</label>
                                                                        </div>
                                                                        <img src="/img/no-image.png" alt="" />
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                        {this.state.imageUploadModal ? (
                                                            <>
                                                                <Portal
                                                                    body={
                                                                        <ImageUploadModal
                                                                            imageList={this.state.project.image ? [this.state.project.image] : []}
                                                                            img_desc={this.state.project.img_desc ? this.state.project.img_desc : ""}
                                                                            isRecomentaionView={true}
                                                                            handleImage={this.handleImage}
                                                                            handleAddImage={this.handleAddImage}
                                                                            deleteImageRecomention={this.deleteImage}
                                                                            onCancel={() =>
                                                                                this.setState({
                                                                                    imageUploadModal: false
                                                                                })
                                                                            }
                                                                        />
                                                                    }
                                                                    onCancel={() =>
                                                                        this.setState({
                                                                            imageUploadModal: false
                                                                        })
                                                                    }
                                                                />{" "}
                                                            </>
                                                        ) : null}
                                                    </div>
                                                    <div className="template">
                                                        <div className="heading">
                                                            <h3>Report Notes</h3>
                                                            {this.state.project.sub_system_id && (
                                                                <button
                                                                    className="btn btn-clear"
                                                                    onClick={() => this.toggleShowReportNoteTemplateModal()}
                                                                >
                                                                    <i className="fas fa-plus" /> Add Template
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="cnt-temp-area">
                                                            <textarea
                                                                autoComplete={"nope"}
                                                                className="form-control"
                                                                placeholder="Report Notes"
                                                                cols="50"
                                                                value={this.state.project.notes}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        project: {
                                                                            ...project,
                                                                            notes: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12 text-right btnOtr mt-3 mb-2">
                                        <span className="errorMessage">{this.state.showErrorBorder ? this.state.errorMessage : ""}</span>
                                        <button type="button" class="btn btn-secondary btnClr" onClick={() => this.confirmCancel()}>
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
                                                 ${this.state.locked === true ? "cursor-notallowed" : ""}`}
                                                disabled={this.state.locked === true ? true : false}
                                                onClick={() => this.addProject()}
                                            >
                                                {this.state.selectedProject ? "Update" : "Save"}
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
                        ) : this.state.activeDetail == "Asset Details" ? (
                            <div className="tab-active location-sec recom-sec recommendation-form  addition-add">
                                <div className="col-md-12 detail-recom">
                                    <div className="btn-assign">
                                        <button
                                            className={`btn add-btn mr-2 ${
                                                !(project.region_id && project.site_id && project.building_id) ? "cursor-diabled" : ""
                                            }`}
                                            disabled={!(project.region_id && project.site_id && project.building_id)}
                                            onClick={() => {
                                                sessionStorage.setItem("currentFormData", JSON.stringify(project));
                                                sessionStorage.setItem("activeDetail", "Asset Details");
                                                addToBreadCrumpData({
                                                    key: "addAsset",
                                                    name: `Add Asset`,
                                                    path: `/assets/add`
                                                });
                                                history.push({
                                                    pathname: "/assets/add",
                                                    search: "?isRecomAsset=true"
                                                });
                                            }}
                                        >
                                            <i className="fas fa-plus" /> Add New Asset
                                        </button>
                                        <button
                                            className={`btn add-btn ${
                                                !(project.region_id && project.site_id && project.building_id) ? "cursor-diabled" : ""
                                            }`}
                                            disabled={!(project.region_id && project.site_id && project.building_id)}
                                            onClick={() => this.setState({ showAssetModal: true })}
                                        >
                                            <i className="fas fa-plus" /> Assign Asset
                                        </button>
                                    </div>
                                    <div className="add-btn-wrapper">
                                        <span className="errorMessage">{this.state.showErrorBorder ? this.state.errorMessage : ""}</span>
                                        <button className="button btn-clear" onClick={() => this.confirmCancel()}>
                                            Cancel
                                        </button>

                                        {!this.state.loading ? (
                                            <button
                                                title={
                                                    this.state.locked === true
                                                        ? "You cannot update this item as this recommendation is locked!!!"
                                                        : ""
                                                }
                                                className={`button btn-save ml-2 ${this.state.locked === true ? "cursor-notallowed" : ""}`}
                                                disabled={this.state.locked === true ? true : false}
                                                onClick={() => this.addProject()}
                                            >
                                                {this.state.selectedProject ? "Update" : "Save"}
                                            </button>
                                        ) : (
                                            <button className="button btn-save ml-2">
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
                        ) : null}
                    </div>
                </div>
                {this.renderConfirmationModal()}
                {this.renderReportNoteTemplateModal()}
                {this.renderAssetModal()}
                {this.renderRecommendationTemplateModal()}
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
