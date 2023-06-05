import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import qs from "query-string";
import "rc-time-picker/assets/index.css";
import DatePicker from "react-datepicker";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import "react-datepicker/dist/react-datepicker.css";
import recommendationsActions from "../actions";
import projectActions from "../../project/actions";
import NumberFormat from "react-number-format";
import Loader from "../../common/components/Loader";
import Portal from "../../common/components/Portal";
import buildingActions from "../../building/actions";
import userActions from "../../users/actions";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import {
    popBreadCrumpData,
    addToBreadCrumpData,
    findInfoPathFromBreadCrump,
    getUsefullLifeRemaining,
    convertToXML,
    removeAllTags
} from "../../../config/utils";
import ReactTooltip from "react-tooltip";
import ImageUploadModal from "../../common/components/ImagesModal";
import RepotNoteTemplateModal from "./RepotNoteTemplateModal";
import AssignAssetModal from "./AssignAssetModal";
import RecommendationTemplateModal from "./RecommendationTemplateModal";
import history from "../../../config/history";
import assetActions from "../../assets/actions";
import Autosuggest from "react-autosuggest";
import AssetForm from "./AssetForm";
import { checkPermission } from "../../../config/utils";
import recomIcon from "../../../assets/img/recom-icon.svg";
import recomIcon1 from "../../../assets/img/img-recm.svg";
import RecommendationNoteEdit from "../../common/components/RecommendationNoteEdit";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { EnergyBand } from "./Bands/EnergyBand";
import { WaterBand } from "./Bands/WaterBand";
import { energy_fields } from "./Bands/EnergyBand";
import { water_fields } from "./Bands/WaterBand";
const editorConfiguration = {
    toolbar: [
        // "fontFamily",
        // "fontSize",
        // "|",
        "bold",
        "italic",
        "underLine",
        "|",
        "alignment:left",
        "alignment:right",
        "alignment:center",
        "alignment:justify",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        // "outdent",
        // "indent",
        "highlight",
        "|",
        "undo",
        "redo"
        // "heading"
    ],
    removePlugins: ["Title", "ListStyle"],
    alignment: {
        options: ["left", "right", "center", "justify"]
    },
    highlight: {
        options: [
            { model: "yellowMarker", class: "marker-yellow", title: "Yellow marker", color: "var(--ck-highlight-marker-yellow)", type: "marker" },
            { model: "greenMarker", class: "marker-green", title: "Green marker", color: "#32CD32", type: "marker" },
            { model: "pinkMarker", class: "marker-pink", title: "Pink marker", color: "#FF00FF", type: "marker" },
            { model: "blueMarker", class: "marker-blue", title: "Blue marker", color: "#0000FF", type: "marker" }
        ]
    },
    placeholder: "Type Here..."
};
class RecommendationForm extends Component {
    constructor(props) {
        super(props);
        const {
            location: { search }
        } = this.props;
        this.templateRef = React.createRef();
        const query = qs.parse(search);
        this.state = {
            toggleInput: false,
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
            systemArray: [],
            subSystemArray: [],
            initialPriorityTotal: "",
            costTotal: 0,
            initialCostYear: 0,
            imageUploadModal: false,
            project: {
                code: "",
                client_id: "",
                region_id: "",
                room: "",
                site_id: "",
                notes: "",
                note_html: "",
                asset_condition_id: "",
                project_id: query.p_id || "",
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
                funding_source_id: "",
                status: "pending",
                surveyor:
                    localStorage.getItem("printed_name") && localStorage.getItem("printed_name") !== "null"
                        ? localStorage.getItem("printed_name")
                        : "",
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
                recommendation_type: "building",
                fmp_id: "",
                fmp_project: "",
                fmp_track: "",
                infrastructure_request: localStorage.getItem("infrastructure_request_user") === "yes" ? "yes" : "no",
                fmp: localStorage.getItem("fmp_user") === "yes" ? "yes" : "no",
                red_line: "",
                budget_priority: "",
                criticality_id: "",
                source: query.type || "Regular",
                energy_band: {
                    ecm_description: "",
                    annual_savings: "",
                    implementation_cost: "",
                    simple_payback: "",
                    annual_nat_gas_savings: "",
                    annual_elec_savings: "",
                    total_annual_savings: ""
                },
                water_band: {
                    recommendation_for_improvement: "",
                    annual_savings: "",
                    safety_concerns: "",
                    return_on_investment: ""
                },
                energy_band_show: "no",
                water_band_show: "no"
            },
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
            assetFormData: assetFormInitialState,
            initialAssetFormData: {},
            showRecommendationTemplateModal: false,
            recommendationTemplateList: [],
            recommendationSuggestions: [],
            captionLength: 1000,
            showBand: {
                band1: true,
                band2: true,
                band3: false,
                band4: false,
                band5: false,
                band6: false,
                energyBand: false,
                waterBand: false
            },
            priorityElementsData: [],
            criticalityData: [],
            capitalTypeData: [],
            showNoteModal: false,
            note_html: "",
            note_xml: "",
            editorHeight: "310"
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
        await this.props.getPriorityElementDropDownData(query.p_id);
        let updatedPriorityElements = this.props.recommendationsReducer.priorityElementsDropDownResponse?.priority_elements || [];
        await this.props.getCriticalityData({ project_id: query.p_id });
        let criticalityData = this.props.projectReducer.criticalityData?.criticalities || [];
        await this.props.getCapitalTypeDropDownData(query.p_id);
        let capitalTypeData = this.props.recommendationsReducer.capitalTypeDropDownResponse?.capital_types || [];
        this.props.getDepartmentByProject(query.p_id);
        this.props.getConditionBasedOnProject(query.p_id);
        this.props.getTradeBasedOnProject(query.p_id);
        this.props.getCategoryBasedOnProject(query.p_id);
        this.props.getCapitalTypeBasedOnProject(query.p_id);
        this.props.getFundingSourceByProject(query.p_id);
        await this.props.getProjectById(query.p_id);
        const { getProjectByIdResponse } = this.props.projectReducer;
        await this.setState({
            captionLength: getProjectByIdResponse.reco_length
        });
        this.props.getInitiativeDropdown({ project_id: query.p_id, client_id: query.c_id });
        await this.props.getAllClientsRecomentation();
        this.props.getDropdownList("uniformat_level_1s");
        if (query.c_id) {
            // get asset dropdowns
            this.props.getDropdownList("asset_conditions", { client_id: query.c_id });
            this.props.getDropdownList("asset_statuses", { client_id: query.c_id });
            this.props.getDropdownList("asset_types", { client_id: query.c_id });
            let regionList = await this.props.getRegionListBasedOnClient(query.c_id);
            this.setState({
                regionList,
                project: {
                    ...this.state.project,
                    client_id: query.c_id
                },
                assetFormData: {
                    ...this.state.assetFormData,
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
                        note_html,
                        funding_source,
                        locked,
                        client,
                        region,
                        site,
                        building,
                        image,
                        maintenance_years,
                        priority_elements,
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
                        fmp_track,
                        criticality,
                        source,
                        energy_band,
                        water_band,
                        energy_band_show,
                        water_band_show,
                        red_line,
                        budget_priority,
                        infrastructure_request
                    }
                }
            } = this.props;
            if (success) {
                updatedPriorityElements = this.getUpdatedPriorityElementsData(
                    priority_elements,
                    this.props.recommendationsReducer.priorityElementsDropDownResponse.priority_elements
                );
                let latestPriorityElements = this.getLatestPriorityElements(
                    priority_elements,
                    this.props.recommendationsReducer.priorityElementsDropDownResponse.priority_elements
                );

                let selectedCriticality = null;
                if (priority_elements?.length && !criticality?.id) {
                    let priorityTotal = 0;
                    let pelement = priority_elements;
                    pelement.map(item => (priorityTotal += Number(item.element)));
                    if (priorityTotal && criticalityData.length) {
                        selectedCriticality = criticalityData.find(
                            c => priorityTotal >= parseFloat(c.start_range) && priorityTotal <= parseFloat(c.end_range)
                        );
                    }
                }
                await this.props.getSystemBasedOnProject(query.p_id, trade.id);
                const systemData = this.props.recommendationsReducer?.getSystemByProject?.systems || [];
                await this.props.getSubSystemBasedOnProject(query.p_id, system.id);
                const subSystemData = this.props.recommendationsReducer?.getSubSystemByProject?.sub_systems || [];
                let regionList = await this.props.getRegionListBasedOnClient(client.id);
                let siteList = await this.props.getSiteListBasedOnRegion(region.id);
                this.props.getBuildingsBasedOnSite(site.id);
                this.props.getFloorBasedOnBuilding(building.id);
                this.props.getAdditionBasedOnBuilding(building.id);
                await this.setState({
                    systemArray: systemData,
                    subSystemArray: subSystemData,
                    project: {
                        name,
                        code,
                        comments,
                        description,
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
                        asset_condition_id: condition?.id,
                        priority,
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
                        client_id: client.id || "",
                        region_id: region.id || "",
                        site_id: site.id || "",
                        building_id: building.id || "",
                        building_type: building.building_type,
                        image: image.id ? image : [],
                        maintenance_years,
                        priority_elements: latestPriorityElements,
                        img_desc: image.description || "",
                        area_served,
                        notes: notes || "",
                        note_html: note_html || notes?.replace(/\n/g, "<br />"),
                        image_id: image ? image.id : "",
                        funding_source_id: funding_source.id,
                        manufacturer,
                        project,
                        quantity,
                        unit,
                        cost_per_unit,
                        options_cost,
                        asset,
                        asset_id: asset?.id || "",
                        recommendation_type: recommendation_type || "building",
                        fmp,
                        fmp_id,
                        fmp_project,
                        fmp_track,
                        criticality_id: criticality.id || selectedCriticality?.id || "",
                        source: "query.type",
                        energy_band: { ...this.state.project.energy_band, ...energy_band },
                        water_band: { ...this.state.project.water_band, ...water_band },
                        energy_band_show,
                        water_band_show,
                        infrastructure_request,
                        red_line,
                        budget_priority
                    },
                    regionList,
                    siteList,
                    selectedImage: image,
                    createdAt: created_at,
                    updatedAt: updated_at,
                    locked: locked,
                    editorHeight: recommendation_type === "asset" ? "400" : "310"
                });
                if (recommendation_type === "asset") {
                    await this.handleAssignAsset(asset);
                }
                this.getRecommendationTemplates(this.state.project.sub_system_id);
                await this.props.getAllBuildingsDropdown({ site_id: this.state.project.site_id, project_id: query.p_id });
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
        } else if (query.type === "Similar" || query.type === "Duplicate") {
            // set the initial recommendation form values based on the create type
            this.populateValuesBasedOnType();
        } else {
            await this.props.getUserDefaultTrade(query.p_id);
            const { getUserDefaultTradeResponse } = this.props.recommendationsReducer;
            if (getUserDefaultTradeResponse?.id) {
                await this.setState({
                    project: { ...this.state.project, trade_id: getUserDefaultTradeResponse?.id },
                    assetFormData: { ...this.state.assetFormData, trade_id: getUserDefaultTradeResponse?.id }
                });
                this.handleTrade(getUserDefaultTradeResponse?.id);
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
            priorityElementsData: updatedPriorityElements,
            criticalityData: criticalityData,
            capitalTypeData: capitalTypeData
        });
        ReactTooltip.rebuild();
        // to set the previous recommendation data
        await this.setPrevRecomData();
        this.setState({ initialAssetFormData: _.cloneDeep(this.state.assetFormData) });
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
    getLatestPriorityElements = (currentData = [], dropDownData = []) => {
        let newElements = [];
        newElements = dropDownData.filter(item => !currentData.map(item => item.recommendation_priority_id).includes(item.id));
        if (newElements.length) {
            newElements.forEach(elem => {
                currentData.push({ index: currentData?.length + 1, element: "", option_id: "", recommendation_priority_id: "" });
            });
        }
        return currentData;
    };

    setPriorirtyElementData = priority_elements => {
        let priorityElementData = [];
        priority_elements.map((element, i) => {
            priorityElementData.push({ index: i + 1, element: "", option_id: "", recommendation_priority_id: "" });
        });
        return priorityElementData;
    };

    setPrevRecomData = async () => {
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
                    await this.props.getSystemBasedOnProject(query.p_id, project?.trade_id);
                    systemData = this.props.recommendationsReducer?.getSystemByProject?.systems || [];
                }
                if (project?.system_id) {
                    await this.props.getSubSystemBasedOnProject(query.p_id, project?.system_id);
                    subSystemData = this.props.recommendationsReducer?.getSubSystemByProject?.sub_systems || [];
                }
                if (project?.sub_system_id) {
                    this.getRecommendationTemplates(project?.sub_system_id);
                }
                if (project?.client_id) {
                    regionList = await this.props.getRegionListBasedOnClient(project?.client_id);
                }
                if (project?.region_id) {
                    siteList = await this.props.getSiteListBasedOnRegion(project?.region_id);
                }
                if (project?.site_id) {
                    this.props.getAllBuildingsDropdown({ site_id: project?.site_id, project_id: query.p_id });
                }
                if (project?.building_id) {
                    this.props.getFloorBasedOnBuilding(project?.building_id);
                    this.props.getAdditionBasedOnBuilding(project?.building_id);
                }
            }
            await this.setState({
                project,
                systemArray: systemData,
                subSystemArray: subSystemData,
                regionList,
                siteList
            });
            this.assignLastCreatedAsset();
            sessionStorage.removeItem("currentFormData");
            sessionStorage.removeItem("activeDetail");
        }
    };

    assignLastCreatedAsset = async () => {
        let lastCreatedAssetId = sessionStorage.getItem("lastCreatedAssetId");
        if (lastCreatedAssetId) {
            await this.props.getAssetDataById(lastCreatedAssetId);
            const resData = this.props.assetReducer.getDataByIdResponse;
            this.handleAssignAsset(resData);
            sessionStorage.removeItem("lastCreatedAssetId");
        }
    };

    populateValuesBasedOnType = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let recomData = JSON.parse(sessionStorage.getItem("currentRecommendationData"));
        if (recomData) {
            let systemData = [];
            let subSystemData = [];
            let regionList = [];
            let siteList = [];
            if (recomData?.trade?.id) {
                await this.props.getSystemBasedOnProject(query.p_id, recomData?.trade?.id);
                systemData = this.props.recommendationsReducer?.getSystemByProject?.systems || [];
            }
            if (recomData?.system?.id) {
                await this.props.getSubSystemBasedOnProject(query.p_id, recomData?.system?.id);
                subSystemData = this.props.recommendationsReducer?.getSubSystemByProject?.sub_systems || [];
            }
            if (recomData?.sub_system?.id) {
                this.getRecommendationTemplates(recomData?.sub_system?.id);
            }
            if (recomData?.client?.id) {
                regionList = await this.props.getRegionListBasedOnClient(recomData?.client?.id);
            }
            if (recomData?.region?.id) {
                siteList = await this.props.getSiteListBasedOnRegion(recomData?.region?.id);
            }
            if (recomData?.site?.id) {
                this.props.getAllBuildingsDropdown({ site_id: recomData?.site?.id, project_id: query.p_id });
                this.getCostYear(recomData?.site?.id);
            }
            if (recomData?.building?.id) {
                this.props.getFloorBasedOnBuilding(recomData?.building?.id);
                this.props.getAdditionBasedOnBuilding(recomData?.building?.id);
            }
            await this.setState({
                systemArray: systemData,
                subSystemArray: subSystemData,
                regionList,
                siteList
            });
            const {
                addition,
                area_served,
                asset,
                asset_name,
                asset_notes,
                asset_tag,
                building,
                capacity,
                capital_type,
                category,
                client,
                condition,
                cost_per_unit,
                criticality,
                crv,
                department,
                description,
                energy_band,
                floor,
                funding_source,
                initiative,
                inspection_date,
                installed_year,
                maintenance_years,
                manufacturer,
                model_number,
                notes,
                note_html,
                options_cost,
                priority,
                priority_elements,
                project,
                project_total,
                quantity,
                recommendation_type,
                region,
                room,
                serial_number,
                service_life,
                site,
                status,
                sub_system,
                surveyor,
                system,
                trade,
                unit,
                usefull_life_remaining,
                water_band,
                energy_band_show,
                water_band_show
            } = recomData;
            if (query.type === "Similar") {
                await this.setState({
                    project: {
                        ...this.state.project,
                        addition_id: addition?.id,
                        building_id: building?.id,
                        building_type: building?.building_type,
                        floor_id: floor?.id,
                        inspection_date,
                        recommendation_type,
                        region_id: region?.id,
                        room,
                        site_id: site?.id,
                        status,
                        sub_system_id: sub_system?.id,
                        system_id: system?.id,
                        trade_id: trade?.id
                    }
                });
                this.handleRecommendationTypeSelect();
                if (this.state.project.site_id !== "") {
                    await this.getCostYear();
                }
            } else if (query.type === "Duplicate") {
                await this.setState({
                    project: {
                        ...this.state.project,
                        addition_id: addition?.id,
                        area_served,
                        asset_name,
                        asset_notes,
                        asset_tag,
                        building_id: building.id,
                        building_type: building.building_type,
                        capacity,
                        capital_type: capital_type || "",
                        category_id: category?.id,
                        client_id: client?.id,
                        asset_condition_id: condition?.id,
                        cost_per_unit,
                        crv,
                        department_id: department.id,
                        description,
                        floor_id: floor.id,
                        funding_source_id: funding_source.id,
                        initiative_id: initiative?.id,
                        inspection_date,
                        installed_year,
                        maintenance_years,
                        manufacturer,
                        model_number,
                        notes: notes || "",
                        note_html: note_html || notes,
                        options_cost,
                        priority,
                        priority_elements,
                        project,
                        project_total,
                        quantity,
                        recommendation_type: recommendation_type || "asset",
                        region_id: region.id,
                        room,
                        serial_number,
                        service_life,
                        site_id: site.id,
                        status,
                        sub_system_id: sub_system.id,
                        surveyor,
                        system_id: system.id,
                        trade_id: trade.id,
                        unit,
                        usefull_life_remaining,
                        criticality_id: criticality?.id,
                        energy_band: {
                            annual_savings: energy_band?.annual_savings || "",
                            total_captial_spending_plan_kbtu_savings: energy_band?.total_captial_spending_plan_kbtu_savings || "",
                            implementation_cost: energy_band?.implementation_cost || "",
                            simple_payback: energy_band?.simple_payback || "",
                            annual_nat_gas_savings: energy_band?.annual_nat_gas_savings || "",
                            annual_elec_savings: energy_band?.annual_elec_savings || "",
                            total_annual_savings: energy_band?.total_annual_savings || "",
                            annual_energy_savings: energy_band?.annual_energy_savings || "",
                            annual_cost_to_implement_ecm: energy_band?.annual_cost_to_implement_ecm || ""
                        },
                        water_band: {
                            annual_savings_water: water_band?.annual_savings_water || "",
                            safety_concerns: water_band?.safety_concerns || "",
                            simple_payback_water: water_band?.simple_payback_water || ""
                        },
                        energy_band_show,
                        water_band_show
                    },
                    costTotal: project_total,
                    initialPriorityTotal: priority,
                    priorityTotal: priority
                });
                await this.duplicateAsset(asset);
            }
        }
    };

    duplicateAsset = async asset => {
        await this.setState({
            assetFormData: {
                code: "",
                asset_name: asset.asset_name,
                asset_tag: "",
                asset_note: asset.asset_note,
                client_asset_condition_id: asset.asset_condition?.id,
                installed_year: asset.installed_year,
                service_life: asset.service_life,
                usefull_life_remaining: asset.usefull_life_remaining,
                crv: asset.crv,
                manufacturer: asset.manufacturer,
                year_manufactured: asset.year_manufactured,
                model_number: asset.model_number,
                serial_number: "",
                capacity: asset.capacity,
                criticality: asset.criticality,
                area_served: asset.area_served,
                client_id: asset.client?.id,
                region_id: asset.region?.id,
                site_id: asset.site?.id,
                building_id: asset.building?.id,
                addition_id: asset.addition?.id,
                floor_id: asset.floor?.id,
                room_number: asset.room_number,
                room_name: asset.room_name,
                location: asset.location,
                architectural_room_number: asset.architectural_room_number,
                additional_room_description: asset.additional_room_description,
                uniformat_level_1_id: asset.uniformat_level_1?.id,
                uniformat_level_2_id: asset.uniformat_level_2?.id,
                uniformat_level_3_id: asset.uniformat_level_3?.id,
                uniformat_level_4_id: asset.uniformat_level_4?.id,
                uniformat_level_5_id: asset.uniformat_level_5?.id,
                asset_type_id: asset.asset_type?.id,
                asset_description: asset.asset_description,
                asset_barcode: "",
                asset_client_id: asset.asset_client_id,
                asset_cmms_id: asset.asset_cmms_id,
                warranty_start: asset.warranty_start,
                warranty_end: asset.warranty_end,
                install_date: asset.install_date,
                startup_date: asset.startup_date,
                upstream_asset_barcode_number: asset.upstream_asset_barcode_number,
                linked_asset_barcode_number: asset.linked_asset_barcode_number,
                source_panel_barcode_number: asset.source_panel_barcode_number,
                source_panel: asset.source_panel,
                asset_status_id: asset.asset_status?.id,
                notes: asset.notes,
                building_type: asset?.building_type?.name,
                main_category_id: asset?.main_category?.id,
                sub_category_1_id: asset?.sub_category_1?.id,
                sub_category_2_id: asset?.sub_category_2?.id,
                sub_category_3_id: asset?.sub_category_3?.id,
                guid: "",
                source_panel_name: asset?.source_panel_name,
                skysite_hyperlink: asset?.skysite_hyperlink,
                trade_id: asset.trade?.id,
                system_id: asset.system?.id,
                sub_system_id: asset.sub_system?.id,

                quantity: asset?.quantity,
                rtls_tag: asset?.rtls_tag,
                latitude: asset?.latitude,
                longitude: asset?.longitude,
                current_age: asset?.current_age,
                age: asset?.age,
                new_asset: asset?.new_asset,
                parent_global_id: asset?.parent_global_id,
                survey_global_id: asset?.survey_global_id,
                survey_id: asset?.survey_id,
                survey_property_note: asset?.survey_property_note,
                capacity_status: asset?.capacity_status,
                installed_year_status: asset?.installed_year_status,
                name_plate_status: asset?.name_plate_status,
                qa_notes: asset?.qa_notes,
                additional_qa_notes: asset?.additional_qa_notes,
                surveyor: asset?.surveyor,
                editor: asset?.editor,
                survey_date_created: asset?.survey_date_created,
                survey_date_edited: asset?.survey_date_edited,
                description: asset?.asset_condition?.description,
                uniformat_level_6_id: asset?.uniformat_level_6?.id,
                uniformat_level_6_description: asset?.uniformat_level_6?.uniformat_level_6_description,
                subcategory2_description: asset?.sub_category_2?.subcategory2_description,
                capacity_unit: asset?.capacity_unit
            }
        });
        this.getSelectedAssetDropdowns();
        this.setState({ initialAssetFormData: _.cloneDeep(this.state.assetFormData) });
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
        if (
            _.isEqual(this.state.initialValues, this.state.project) &&
            _.isEqual(this.state.assetFormData, this.state.initialAssetFormData) &&
            costTotal === initialCostYear &&
            priorityTotal === project.priority
        ) {
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

        // if criticality score is based on the years
        if (this.props.projectReducer.getProjectByIdResponse?.criticality_score === "year") {
            this.handleCriticalityByYear(myear);
        }
    };

    handleCriticalityByYear = years => {
        const {
            project: { criticality_id },
            criticalityData
        } = this.state;
        let selectedCriticality = criticality_id;
        const firstCostYear = years.find(year => parseInt(year.amount) > 0)?.year;
        if (firstCostYear) {
            selectedCriticality =
                criticalityData.find(c => firstCostYear >= parseFloat(c.start_range) && firstCostYear <= parseFloat(c.end_range))?.id || "";
            this.setState({ project: { ...this.state.project, criticality_id: selectedCriticality } });
        }
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
                            this.cancelForm();
                        }}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    setPriorityelement = (e, priorityId) => {
        const {
            priorityElementsData,
            criticalityData,
            project: { criticality_id }
        } = this.state;
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
        pelement.map(item => (priorityTotal += Number(item.element)));

        // if criticality score is based on the priority
        let selectedCriticality = criticality_id;
        if (this.props.projectReducer.getProjectByIdResponse?.criticality_score !== "year") {
            if (priorityTotal && criticalityData.length) {
                selectedCriticality =
                    criticalityData.find(c => priorityTotal >= parseFloat(c.start_range) && priorityTotal <= parseFloat(c.end_range))?.id || "";
            }
        }
        this.setState({
            project: {
                ...this.state.project,
                priority_elements: pelement,
                criticality_id: selectedCriticality
            },
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
        let currentState = this.state.project.maintenance_years.filter(items => items.year !== item.year);
        let currentAddYears = this.state.additional_maintenance_years.filter(items => items !== item.year);
        let currentCostTotal = this.state.costTotal;
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

    validate = () => {
        const { project, selectedProject } = this.state;
        let role = localStorage.getItem("role");
        let showErrorBorder = false;
        let errorMessage = "";
        let validatePriorityElementResult = this.validatePriorityElements();
        if (!validatePriorityElementResult.isValidate) {
            showErrorBorder = true;
            errorMessage = validatePriorityElementResult.errorMessage;
        } else if (!this.state.project.client_id?.trim()?.length) {
            errorMessage = "* Client is required";
            showErrorBorder = true;
        } else if (!this.state.project.trade_id?.trim()?.length) {
            errorMessage = "* Trade is required";
            showErrorBorder = true;
        } else if (!this.state.project.system_id?.trim()?.length) {
            showErrorBorder = true;
            errorMessage = "* System is required";
        } else if (!this.state.project.sub_system_id?.trim()?.length) {
            showErrorBorder = true;
            errorMessage = "* SubSystem is required";
        } else if (!project.description?.trim()?.length) {
            errorMessage = "* Recommendation is required";
            showErrorBorder = true;
        } else if (!this.state.project.region_id?.trim()?.length) {
            errorMessage = "* Region is required";
            showErrorBorder = true;
        } else if (!this.state.project.site_id?.trim()?.length) {
            errorMessage = "* Site is required";
            showErrorBorder = true;
        } else if (!this.state.project.building_id?.trim()?.length) {
            errorMessage = "* Building is required";
            showErrorBorder = true;
        } else if (this.props.projectReducer.getProjectByIdResponse?.addition_required && !this.state.project.addition_id?.trim()?.length) {
            showErrorBorder = true;
            errorMessage = "* Addition  is required";
        } else if (
            !selectedProject &&
            this.props.projectReducer.getProjectByIdResponse?.project_total_required &&
            !this.props.recommendationsReducer.getCostYearByProject.year_limits
        ) {
            showErrorBorder = true;
            errorMessage = "* No maintenance years defined for the site";
        } else if (this.props.projectReducer.getProjectByIdResponse?.project_total_required && this.state.costTotal === 0) {
            showErrorBorder = true;
            errorMessage = "* Project Total cannot be zero";
        } else if (this.state.project.recommendation_type === "asset" && !this.state.assetFormData.asset_name) {
            showErrorBorder = true;
            errorMessage = "* Asset name is required";
        } else if (this.state.project.recommendation_type === "asset" && !this.state.assetFormData.client_asset_condition_id) {
            showErrorBorder = true;
            errorMessage = "* Asset condition is required";
        } else if (this.state.project.recommendation_type === "building" && !this.state.project.asset_condition_id) {
            showErrorBorder = true;
            errorMessage = "* Condition is required";
        } else if (!this.state.project.category_id?.trim()?.length) {
            showErrorBorder = true;
            errorMessage = "* Category is required";
        } else if (!this.state.project.capital_type?.trim()?.length) {
            showErrorBorder = true;
            errorMessage = "* Capital is required";
        } else if (this.props.projectReducer.getProjectByIdResponse?.funding_required && !this.state.project.funding_source_id?.trim()?.length) {
            showErrorBorder = true;
            errorMessage = "* Funding  is required";
        } else if (
            this.props.projectReducer.getProjectByIdResponse?.asset_tag_required &&
            this.state.project.recommendation_type === "asset" &&
            !this.state.assetFormData.asset_tag
        ) {
            showErrorBorder = true;
            errorMessage = "* Asset Tag  is required";
        } else if (
            this.props.projectReducer.getProjectByIdResponse?.serial_number_required &&
            this.state.project.recommendation_type === "asset" &&
            !this.state.assetFormData.serial_number
        ) {
            showErrorBorder = true;
            errorMessage = "* Serial Number  is required";
        } else if (!this.state.project.inspection_date) {
            showErrorBorder = true;
            errorMessage = "* Inspection date is required";
        } else if (!this.state.project.status) {
            showErrorBorder = true;
            errorMessage = "* Status is required";
        } else if (!this.state.project.code && role === "super_admin" && selectedProject) {
            showErrorBorder = true;
            errorMessage = "* Code is required";
        } else if (this.state.project.code && role === "super_admin" && !this.state.project.code?.split("-")[2]) {
            showErrorBorder = true;
            errorMessage = "* Invalid code format";
        } else {
            let validatePriorityElementResult = this.validatePriorityElements();
            if (!validatePriorityElementResult.isValidate) {
                showErrorBorder = true;
                errorMessage = validatePriorityElementResult.errorMessage;
            }
        }

        this.setState({ showErrorBorder, errorMessage });
        if (showErrorBorder) return false;
        return true;
    };
    // handleChangeInput = async description => {

    //    console.log(description);

    //   };

    validatePriorityElements = () => {
        const { priorityElementsData, project } = this.state;
        let isValidate = true;
        let errorMessage = "";
        priorityElementsData &&
            priorityElementsData.map((pElement, index) => {
                if (
                    pElement.recommendation_required &&
                    (!project.priority_elements[index]?.element || !project.priority_elements[index]?.element.toString()?.trim()?.length) &&
                    project.priority_elements[index]?.element !== 0
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
        try {
            let {
                project: { asset, ...rest },
                selectedImage,
                initialValues,
                capitalTypeData
            } = this.state;
            let selectedCapitalType = capitalTypeData.find(cType => cType.name === this.state.project.capital_type);
            const { handleAddRecommendations } = this.props;
            if (this.validate()) {
                this.setState({ loading: true });
                if (rest.recommendation_type === "asset") {
                    rest = await this.manageAssetData(asset, rest);
                } else {
                    rest.asset_id = "";
                }
                if (this.state.selectedProject) {
                    let redirectUrl = findInfoPathFromBreadCrump();
                    if (redirectUrl?.length === 3) {
                        addToBreadCrumpData({
                            key: "Name",
                            name: this.state.project.code,
                            path: `/recommendations/recommendationsinfo/${this.state.selectedProject}/${
                                this.state.activeDetail === "Main Details" ? "maindetails" : "additionaldetails"
                            }`
                        });
                        addToBreadCrumpData({
                            key: "info",
                            name: `${this.state.activeDetail === "Main Details" ? "Main Details" : "Additional Details"}`,
                            path: `/recommendations/recommendationsinfo/${this.state.selectedProject}/${
                                this.state.activeDetail === "Main Details" ? "maindetails" : "additionaldetails"
                            }`
                        });
                    }
                    let newData = {};
                    // newData.code = rest.code;
                    newData.building_id = rest.building_id;
                    newData.recommendation_type = rest.recommendation_type;
                    Object.entries(rest).map(([key, value]) => {
                        if (!_.isEqual(value, initialValues[key])) {
                            newData[key] = value;
                        }
                    });
                    if (newData.hasOwnProperty("capital_type")) {
                        newData.recommendation_capital_type_id = selectedCapitalType?.id || "";
                    }
                    await this.props.handleUpdateRecommendations(newData, selectedImage);
                    this.setState({ loading: false });
                } else {
                    popBreadCrumpData();
                    await handleAddRecommendations({ ...rest, recommendation_capital_type_id: selectedCapitalType?.id || "" });
                    this.setState({ loading: false });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    manageAssetData = async (asset, rest) => {
        let assetFormData = this.state.assetFormData;
        const { initialAssetFormData } = this.state;
        if (!asset.id) {
            await this.props.addData(assetFormData);
            const { asset_id } = this.props.assetReducer.addDataResponse;
            rest.asset_id = asset_id;
        } else if (!_.isEqual(this.state.assetFormData, this.state.initialAssetFormData)) {
            let newData = {};
            newData.asset_name = assetFormData.asset_name;
            Object.entries(assetFormData).map(([key, value]) => {
                if (value !== initialAssetFormData[key]) {
                    newData[key] = value;
                }
            });
            await this.props.updateData(asset?.id, newData);
            rest.asset_id = asset?.id;
        } else {
            rest.asset_id = asset?.id;
        }
        return rest;
    };

    updateProject = async () => {
        const { project } = this.state;
        const { handleUpdateRecommendations } = this.props;
        if (this.validate()) {
            await handleUpdateRecommendations(project);
        }
    };

    cancelForm = () => {
        const { history } = this.props;
        popBreadCrumpData();
        let redirectUrl = findInfoPathFromBreadCrump();
        if (!this.props.isChartView) {
            history.push(redirectUrl[redirectUrl.length - 1]?.path || "/recommendations");
        } else {
            history.push(redirectUrl[6]?.path || "/recommendations");
        }
    };

    getSubSystem = systemId => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        this.props.getSubSystemBasedOnProject(query.p_id, systemId);
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

    getCostYear = async (site_id = "") => {
        const {
            location: { search }
        } = this.props;

        let costPerYear = {};
        const query = qs.parse(search);

        await this.props.getCostYearByProject(query.p_id, this.state.project.site_id || site_id);

        costPerYear =
            this.props.recommendationsReducer.getCostYearByProject &&
            this.props.recommendationsReducer.getCostYearByProject.year_limits &&
            this.props.recommendationsReducer.getCostYearByProject.year_limits;

        if (costPerYear && costPerYear.start && costPerYear && costPerYear.end) {
            let currentState = [];
            let i = 0;
            for (i = costPerYear.start; i <= costPerYear.end; i++) {
                let amount = this.state.project.maintenance_years.find(item => item.year === i)?.amount || 0.0;
                currentState.push({ year: i, amount: amount });
            }
            await this.setState({
                project: {
                    ...this.state.project,
                    maintenance_years: currentState
                }
            });
        } else {
            await this.setState({
                project: {
                    ...this.state.project,
                    maintenance_years: []
                },
                costTotal: 0,
                alertMessage: "No maintenance years defined for this site."
            });
            this.showLongAlert();
        }
    };

    showLongAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
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
        await this.props.getSystemBasedOnProject(query.p_id, tradeId);
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
            systemArray: [],
            subSystemArray: []
        });
        setTimeout(() => {
            this.setState({
                systemArray: data,
                subSystemArray: [],
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
        await this.props.getSubSystemBasedOnProject(query.p_id, systemId);
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
            subSystemArray: []
        });
        setTimeout(() => {
            this.setState({
                subSystemArray: data,
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
                note_html: project.note_html + newBandContent
            }
        });
    };

    updateRecommendationContent = async newBandContent => {
        const { project, captionLength } = this.state;
        const { text = "", cost_per_unit = "", unit = "", description = "" } = newBandContent;
        let newContent = text?.substr(0, captionLength - project.description.length) || "";
        this.setState({
            project: {
                ...project,
                description: project.description.length === captionLength ? project.description : project.description + newContent,
                cost_per_unit: cost_per_unit || project.cost_per_unit,
                unit: unit || project.unit,
                options_cost: project.quantity ? cost_per_unit * project.quantity : project.options_cost,
                notes: project.notes ? `${project.notes} ${description}` : description,
                note_html: project.note_html
                    ? `${project.note_html} ${description?.replace(/\n/g, "<br />") || ""}`
                    : description?.replace(/\n/g, "<br />")
            }
        });
    };

    onSuggestionSelected = newBandContent => {
        const { project, captionLength } = this.state;
        const { text_format = "", cost_per_unit = "", unit = "", description = "" } = newBandContent;
        let newContent = text_format?.substr(0, captionLength) || "";
        this.setState({
            project: {
                ...project,
                description: newContent,
                cost_per_unit: cost_per_unit || project.cost_per_unit,
                unit: unit || project.unit,
                options_cost: project.quantity ? cost_per_unit * project.quantity : project.options_cost,
                notes: project.notes ? `${project.notes} ${description}` : description,
                note_html: project.note_html
                    ? `${project.note_html} ${description?.replace(/\n/g, "<br />") || ""}`
                    : description?.replace(/\n/g, "<br />")
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
        if (assetData?.client_asset_condition) {
            assetData.asset_condition = assetData.client_asset_condition;
        }
        await this.setState({
            project: {
                ...this.state.project,
                asset: { id: assetData?.id }
            },
            assetFormData: {
                code: assetData.code,
                asset_name: assetData.asset_name,
                asset_tag: assetData.asset_tag,
                asset_note: assetData.asset_note,
                client_asset_condition_id: assetData.asset_condition?.id,
                installed_year: assetData.installed_year,
                service_life: assetData.service_life,
                usefull_life_remaining: assetData.usefull_life_remaining,
                crv: assetData.crv,
                manufacturer: assetData.manufacturer,
                year_manufactured: assetData.year_manufactured,
                model_number: assetData.model_number,
                serial_number: assetData.serial_number,
                capacity: assetData.capacity,
                criticality: assetData.criticality,
                area_served: assetData.area_served,
                client_id: assetData.client?.id,
                region_id: assetData.region?.id,
                site_id: assetData.site?.id,
                building_id: assetData.building?.id,
                addition_id: assetData.addition?.id,
                floor_id: assetData.floor?.id,
                room_number: assetData.room_number,
                room_name: assetData.room_name,
                location: assetData.location,
                architectural_room_number: assetData.architectural_room_number,
                additional_room_description: assetData.additional_room_description,
                uniformat_level_1_id: assetData.uniformat_level_1?.id,
                uniformat_level_2_id: assetData.uniformat_level_2?.id,
                uniformat_level_3_id: assetData.uniformat_level_3?.id,
                uniformat_level_4_id: assetData.uniformat_level_4?.id,
                uniformat_level_5_id: assetData.uniformat_level_5?.id,
                asset_type_id: assetData.asset_type?.id,
                asset_description: assetData.asset_description,
                asset_barcode: assetData.asset_barcode,
                asset_client_id: assetData.asset_client_id,
                asset_cmms_id: assetData.asset_cmms_id,
                warranty_start: assetData.warranty_start,
                warranty_end: assetData.warranty_end,
                install_date: assetData.install_date,
                startup_date: assetData.startup_date,
                upstream_asset_barcode_number: assetData.upstream_asset_barcode_number,
                linked_asset_barcode_number: assetData.linked_asset_barcode_number,
                source_panel_barcode_number: assetData.source_panel_barcode_number,
                source_panel: assetData.source_panel,
                asset_status_id: assetData.asset_status?.id,
                notes: assetData.notes,
                building_type: assetData?.building_type?.name,
                main_category_id: assetData?.main_category?.id,
                sub_category_1_id: assetData?.sub_category_1?.id,
                sub_category_2_id: assetData?.sub_category_2?.id,
                sub_category_3_id: assetData?.sub_category_3?.id,
                guid: assetData?.guid,
                source_panel_name: assetData?.source_panel_name,
                skysite_hyperlink: assetData?.skysite_hyperlink,
                trade_id: assetData.trade?.id,
                system_id: assetData.system?.id,
                sub_system_id: assetData?.sub_system?.id,

                quantity: assetData?.quantity,
                rtls_tag: assetData?.rtls_tag,
                latitude: assetData?.latitude,
                longitude: assetData?.longitude,
                current_age: assetData?.current_age,
                age: assetData?.age,
                new_asset: assetData?.new_asset,
                parent_global_id: assetData?.parent_global_id,
                survey_global_id: assetData?.survey_global_id,
                survey_id: assetData?.survey_id,
                survey_property_note: assetData?.survey_property_note,
                capacity_status: assetData?.capacity_status,
                installed_year_status: assetData?.installed_year_status,
                name_plate_status: assetData?.name_plate_status,
                qa_notes: assetData?.qa_notes,
                additional_qa_notes: assetData?.additional_qa_notes,
                surveyor: assetData?.surveyor,
                editor: assetData?.editor,
                survey_date_created: assetData?.survey_date_created,
                survey_date_edited: assetData?.survey_date_edited,
                description: assetData?.asset_condition?.description,
                uniformat_level_6_id: assetData?.uniformat_level_6?.id,
                uniformat_level_6_description: assetData?.uniformat_level_6?.uniformat_level_6_description,
                subcategory2_description: assetData?.sub_category_2?.subcategory2_description,
                capacity_unit: assetData?.capacity_unit
            }
        });
        this.getSelectedAssetDropdowns();
        this.setState({ initialAssetFormData: _.cloneDeep(this.state.assetFormData) });
    };

    handleRecommendationTypeSelect = async () => {
        const {
            recommendation_type,
            trade_id,
            system_id,
            sub_system_id,
            client_id,
            region_id,
            site_id,
            building_id,
            building_type,
            addition_id,
            floor_id,
            room
        } = this.state.project;
        if (recommendation_type === "asset") {
            await this.setState({
                assetFormData: {
                    ...this.state.assetFormData,
                    client_id,
                    region_id,
                    site_id,
                    building_id,
                    building_type,
                    addition_id,
                    floor_id,
                    room_number: room,
                    trade_id,
                    system_id,
                    sub_system_id
                }
            });
            this.setState({ initialAssetFormData: _.cloneDeep(this.state.assetFormData) });
        }
        ReactTooltip.rebuild();
    };

    getRecommendationTemplates = async sub_system_id => {
        let params = {};
        let dynamicUrl = `/sub_systems/${sub_system_id}/recommendation_templates`;
        let recommendationTemplateList = [];

        await this.props.getRecommendationTemplates(params, dynamicUrl);
        recommendationTemplateList =
            this.props.recommendationsReducer.getRecommendationTemplatesResponse?.project_sub_system_recommendation_templates || [];

        await this.setState({
            recommendationTemplateList,
            recommendationSuggestions: recommendationTemplateList
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            recommendationSuggestions: this.getSuggestions(value)
        });
        ReactTooltip.rebuild();
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            recommendationSuggestions: []
        });
    };

    getSuggestions = value => {
        let recommendationTemplateList = this.state.recommendationTemplateList;
        const inputValue = value?.trim()?.toLowerCase() || "";
        return recommendationTemplateList.filter(
            item =>
                item.text_format?.toString()?.toLowerCase().includes(inputValue) || item.description?.toString()?.toLowerCase().includes(inputValue)
        );
    };

    getSuggestionValue = suggestion => suggestion.text_format;

    renderSuggestion = suggestion => (
        <div>
            <ReactTooltip id="suggestions" effect="solid" backgroundColor="#007bff" place="bottom" />
            <div data-for="suggestions" data-tip={suggestion.description || ""}>
                {suggestion.text_format}
            </div>
        </div>
    );

    handleChangeAssetForm = async e => {
        const { name, value } = e.target;
        await this.setState({
            assetFormData: {
                ...this.state.assetFormData,
                [name]: value
            }
        });
    };

    setAssetFormData = async assetFormData => {
        await this.setState({ assetFormData });
    };

    getSelectedAssetDropdowns = () => {
        const { assetFormData } = this.state;
        this.props.getDropdownList("uniformat_level_2s", {
            uniformat_level_1_id: assetFormData.uniformat_level_1_id
        });
        this.props.getDropdownList("uniformat_level_3s", {
            uniformat_level_1_id: assetFormData.uniformat_level_1_id,
            uniformat_level_2_id: assetFormData.uniformat_level_2_id
        });
        this.props.getDropdownList("uniformat_level_4s", {
            uniformat_level_1_id: assetFormData.uniformat_level_1_id,
            uniformat_level_2_id: assetFormData.uniformat_level_2_id,
            uniformat_level_3_id: assetFormData.uniformat_level_3_id
        });
        this.props.getDropdownList("uniformat_level_5s", {
            uniformat_level_1_id: assetFormData.uniformat_level_1_id,
            uniformat_level_2_id: assetFormData.uniformat_level_2_id,
            uniformat_level_3_id: assetFormData.uniformat_level_3_id,
            uniformat_level_4_id: assetFormData.uniformat_level_4_id
        });
        this.props.getDropdownList("uniformat_level_6s", {
            uniformat_level_1_id: assetFormData.uniformat_level_1_id,
            uniformat_level_2_id: assetFormData.uniformat_level_2_id,
            uniformat_level_3_id: assetFormData.uniformat_level_3_id,
            uniformat_level_4_id: assetFormData.uniformat_level_4_id,
            uniformat_level_5_id: assetFormData.uniformat_level_5_id
        });
        this.props.getDropdownList("main_categories", {
            client_id: assetFormData.client_id
        });
        this.props.getDropdownList("sub_category_1s", {
            client_id: assetFormData.client_id,
            main_category_id: assetFormData.main_category_id
        });
        this.props.getDropdownList("sub_category_2s", {
            client_id: assetFormData.client_id,
            main_category_id: assetFormData.main_category_id,
            sub_category_1_id: assetFormData.sub_category_1_id
        });
        this.props.getDropdownList("sub_category_3s", {
            client_id: assetFormData.client_id,
            main_category_id: assetFormData.main_category_id,
            sub_category_1_id: assetFormData.sub_category_1_id,
            sub_category_2_id: assetFormData.sub_category_2_id
        });
    };

    showErrorBand = item => {
        // const { project, assetFormData, costTotal } = this.state;
        // switch (item) {
        //     case "b1":
        //         return !(project.trade_id && project.system_id && project.sub_system_id && project.description?.trim()?.length);
        //     case "b2":
        //         return !(project.region_id && project.site_id && project.building_id);
        //     case "b3":
        //         return costTotal === 0;
        //     case "b4":
        //         return false;
        //     case "b5":
        //         return project.recommendation_type === "asset" && !(assetFormData.asset_name && assetFormData.client_asset_condition_id);
        //     case "b6":
        //         return (
        //             (project.recommendation_type === "building" && !project.asset_condition_id) ||
        //             !(project.capital_type && project.category_id && project.status)
        //         );
        //     default:
        //         return false;
        // }
        return false;
    };
    // showBand = item => {
    //     const { showBand } = this.state;

    //     return false;
    // };

    handleClick = () => {
        this.setState(prevState => ({
            toggleInput: !prevState.toggleInput
        }));
    };

    renderCode = () => {
        const { project } = this.state;
        let val =
            (this.props.recommendationsReducer.getTradeByProject &&
                this.props.recommendationsReducer.getTradeByProject.trades &&
                this.props.recommendationsReducer.getTradeByProject.trades.find(item => item.id === project.trade_id)?.name) ||
            "";
        let bui =
            (this.props.userReducer.getAllBuildingsDropdownResponse &&
                this.props.userReducer.getAllBuildingsDropdownResponse.buildings &&
                this.props.userReducer.getAllBuildingsDropdownResponse.buildings.find(item => item.id === project.building_id)?.name) ||
            "";
        return `${bui}-${val.substring(0, 1)}-`;
    };

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

    openReportNote = () => {
        this.setState({
            showNoteModal: true
        });
    };

    handleChangeNote = data => {
        let note_xml = convertToXML([data], 1);
        let removedAllTags = removeAllTags(data);
        this.setState({
            project: {
                ...this.state.project,
                notes: removedAllTags,
                note_xml: note_xml,
                note_html: data
            }
        });
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.showBand !== this.state.showBand || prevState.project !== this.state.project) {
            setTimeout(() => {
                let height = this.templateRef?.current?.clientHeight - 340;
                this.setState({ editorHeight: height });
            }, 500);
        }
    };

    handleBandClick = (key, value) => {
        this.setState({
            showBand: {
                ...this.state.showBand,
                [key]: value
            }
        });
    };
    handleChangeBandData = bandData => {
        this.setState({ project: { ...this.state.project, ...bandData } });
    };

    handleCheckBoxClick = (key, checked, field = "") => {
        const { project } = this.state;
        const valueFound = this.checkAnyActiveData(field);
        if (!checked && valueFound) {
            this.setState(
                {
                    alertMessage: "You can't uncheck when there is active data in the band"
                },
                () => this.showAlert()
            );
        } else {
            this.setState({
                project: { ...project, [key]: checked ? "yes" : "no" }
            });
        }
    };

    checkAnyActiveData = field => {
        const { project } = this.state;
        let fields = [];
        let data = project[field];
        let valueFound = false;
        switch (field) {
            case "energy_band":
                fields = energy_fields;
                break;
            case "water_band":
                fields = water_fields;
                break;

            default:
                break;
        }
        valueFound = fields.some(f => data[f.key]);
        return valueFound;
    };
    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    render() {
        let role = localStorage.getItem("role");
        const {
            project,
            regionList,
            showBand,
            siteList,
            additional_maintenance_years,
            recommendationSuggestions,
            assetFormData,
            clients,
            isLoading,
            loading,
            showErrorBorder,
            priorityElementsData,
            criticalityData,
            capitalTypeData
        } = this.state;
        const {
            assetReducer: { dropDownList }
        } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const isFMPUser = localStorage.getItem("fmp_user") === "yes" ? true : false;
        const isIRUser = localStorage.getItem("infrastructure_request_user") === "yes" ? true : false;
        return (
            <LoadingOverlay active={loading || isLoading} spinner={<Loader />} fadeSpeed={10}>
                {this.state.showNoteModal && (
                    <Portal
                        body={
                            <RecommendationNoteEdit
                                notes={this.state.project.note_html}
                                onCancel={() => this.setState({ showNoteModal: false })}
                                isRecommendationView={true}
                                handleChangeNote={this.handleChangeNote}
                                subSystemId={this.state.project.sub_system_id}
                                toggleShowReportNoteTemplateModal={this.toggleShowReportNoteTemplateModal}
                            />
                        }
                        onCancel={() => this.setState({ showNoteModal: false })}
                    />
                )}

                <div className="dtl-sec col-md-12">
                    <ReactTooltip id="recommandation_detils" effect="solid" backgroundColor="#007bff" className="rc-tooltip-custom-class" />
                    <div className="tab-dtl region-mng additional-dtl addition-edit">
                        <ul>
                            <div className="recom-notify-img">
                                <img
                                    src={this.state.activeDetail === "Main Details" ? recomIcon : recomIcon1}
                                    alt=""
                                    data-tip={"Recommendation in Edit or New mode.\nChanges not saved yet!"}
                                    data-for="recommandation_detils"
                                    data-place="top"
                                />
                            </div>
                            <li
                                className={this.state.activeDetail === "Main Details" ? "active cursor-hand pl-4" : "cursor-hand pl-4"}
                                onClick={() => this.setActiveTab("Main Details")}
                            >
                                {this.state.selectedProject
                                    ? "Edit Recommendation"
                                    : query.type === "Regular"
                                    ? "Add New Recommendation"
                                    : query.type === "Similar"
                                    ? "Add Similar Recommendation"
                                    : query.type === "Duplicate"
                                    ? "Add Duplicate Recommendation"
                                    : "Add New Recommendation"}
                            </li>
                            {project.recommendation_type === "asset" && (
                                <li
                                    className={this.state.activeDetail === "Asset Details" ? "active cursor-hand" : "cursor-hand"}
                                    onClick={() => this.setActiveTab("Asset Details")}
                                >
                                    Asset
                                </li>
                            )}
                        </ul>

                        {this.state.activeDetail === "Main Details" ? (
                            <div
                                className={`tab-active location-sec recom-sec main-dtl-add recommendation-form add-recommendation ${
                                    project?.recommendation_type === "asset"
                                        ? ""
                                        : query.type === "Regular"
                                        ? "building-type edit-ck-recom"
                                        : "building-type"
                                }`}
                            >
                                <div class="wrapper-id-check">
                                    {this.state.selectedProject && (
                                        <label htmlFor="" className="label-box-top txt-editable">
                                            {this.state.toggleInput ? (
                                                <>
                                                    {checkPermission("forms", "recommendation_code", "edit") && this.state.selectedProject && (
                                                        <div className="label-detl">
                                                            <NumberFormat
                                                                autoComplete={"nope"}
                                                                className="custom-input form-control"
                                                                placeholder="Quantity"
                                                                value={this.state.project.code}
                                                                prefix={this.renderCode()}
                                                                allowEmptyFormatting={true}
                                                                decimalSeparator={false}
                                                                displayType={"input"}
                                                                allowLeadingZeros
                                                                onValueChange={values => {
                                                                    const { formattedValue } = values;
                                                                    this.setState({
                                                                        project: {
                                                                            ...project,
                                                                            code: formattedValue
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="p-2">
                                                    <span className="label-txt"> ID: </span> <span className="label-detl">{` ${project?.code}`}</span>{" "}
                                                </div>
                                            )}
                                            {checkPermission("forms", "recommendation_code", "edit") && this.state.selectedProject && (
                                                <button
                                                    data-tip={"Edit Code"}
                                                    data-for="recommandation_detils"
                                                    data-place="top"
                                                    onClick={this.handleClick}
                                                >
                                                    <i className="fa fa-edit"></i>
                                                </button>
                                            )}
                                        </label>
                                    )}
                                    <div class="wrapper-check-box">
                                        <div class="wrapper-water-check">
                                            <label class="container-check">
                                                <input
                                                    checked={project.red_line === "yes"}
                                                    type="checkbox"
                                                    name="red_line"
                                                    onChange={e => this.handleCheckBoxClick(e.target.name, e.target.checked)}
                                                />
                                                <span class="checkmark"></span>Redlining
                                            </label>
                                        </div>
                                        <div class="wrapper-water-check">
                                            <label class={`container-check ${isIRUser ? "cursor-diabled" : ""}`}>
                                                <input
                                                    checked={project.infrastructure_request === "yes"}
                                                    type="checkbox"
                                                    disabled={isIRUser}
                                                    name="infrastructure_request"
                                                    onChange={e => this.handleCheckBoxClick(e.target.name, e.target.checked)}
                                                />
                                                <span class="checkmark"></span>Infrastructure Request
                                            </label>
                                        </div>
                                        <div class="wrapper-water-check">
                                            <label class="container-check">
                                                <input
                                                    checked={project.budget_priority === "yes"}
                                                    type="checkbox"
                                                    name="budget_priority"
                                                    onChange={e => this.handleCheckBoxClick(e.target.name, e.target.checked)}
                                                />
                                                <span class="checkmark"></span>Budget Priority
                                            </label>
                                        </div>
                                        <div class="wrapper-water-check">
                                            <label class={`container-check ${isFMPUser ? "cursor-diabled" : ""}`}>
                                                <input
                                                    checked={project.fmp === "yes"}
                                                    type="checkbox"
                                                    disabled={isFMPUser}
                                                    name="fmp"
                                                    onChange={e => this.handleCheckBoxClick(e.target.name, e.target.checked)}
                                                />
                                                <span class="checkmark"></span>Facility Master Plan
                                            </label>
                                        </div>
                                        {this.props.projectReducer.getProjectByIdResponse?.show_energy_band && (
                                            <div class="wrapper-water-check">
                                                <label class="container-check">
                                                    <input
                                                        checked={project.energy_band_show === "yes"}
                                                        type="checkbox"
                                                        name="energy_band_show"
                                                        onChange={e => this.handleCheckBoxClick(e.target.name, e.target.checked, "energy_band")}
                                                    />
                                                    <span class="checkmark"></span>Energy
                                                </label>
                                            </div>
                                        )}
                                        {this.props.projectReducer.getProjectByIdResponse?.show_water_band && (
                                            <div class="wrapper-energy-check">
                                                <label class="container-check">
                                                    <input
                                                        checked={project.water_band_show === "yes"}
                                                        type="checkbox"
                                                        name="water_band_show"
                                                        onChange={e => this.handleCheckBoxClick(e.target.name, e.target.checked, "water_band")}
                                                    />
                                                    <span class="checkmark"></span>Water
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12 detail-recom add-details-outer">
                                    <div className="outer-rcm recommendations">
                                        <div className="cnt-sec">
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div id="accordion" ref={this.templateRef}>
                                                        <div className={`card ${showErrorBorder && this.showErrorBand("b1") ? "error-border" : ""}`}>
                                                            <div className="card-header" id="headingOne">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseOne"
                                                                        aria-expanded="true"
                                                                        aria-controls="collapseOne"
                                                                        onClick={() =>
                                                                            this.setState({
                                                                                showBand: {
                                                                                    ...showBand,
                                                                                    band1: false
                                                                                }
                                                                            })
                                                                        }
                                                                    >
                                                                        Recommendation
                                                                    </button>
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div>
                                                                                <label>Trade *</label>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.trade_id?.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox`}
                                                                                        value={this.state.project.trade_id}
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    trade_id: e.target.value
                                                                                                },
                                                                                                assetFormData: {
                                                                                                    ...assetFormData,
                                                                                                    trade_id: e.target.value,
                                                                                                    system_id: "",
                                                                                                    sub_system_id: ""
                                                                                                }
                                                                                            });
                                                                                            this.handleTrade(e.target.value);
                                                                                        }}
                                                                                        data-target="#collapseOne"
                                                                                        aria-expanded="true"
                                                                                        aria-controls="collapseOne"
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band1: true
                                                                                                }
                                                                                            })
                                                                                        }
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
                                                                                                !this.state.project.system_id?.trim().length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            }custom-selecbox`}
                                                                                            value={this.state.project.system_id}
                                                                                            onChange={async e => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        system_id: e.target.value
                                                                                                    },
                                                                                                    assetFormData: {
                                                                                                        ...assetFormData,
                                                                                                        system_id: e.target.value,
                                                                                                        sub_system_id: ""
                                                                                                    }
                                                                                                });
                                                                                                await this.handleSystem(e.target.value);
                                                                                            }}
                                                                                            data-target="#collapseOne"
                                                                                            aria-expanded="false"
                                                                                            aria-controls="collapseOne"
                                                                                            onClick={() =>
                                                                                                this.setState({
                                                                                                    showBand: {
                                                                                                        ...showBand,
                                                                                                        band1: true
                                                                                                    }
                                                                                                })
                                                                                            }
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
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div
                                                                                className="form-group"
                                                                                data-target="#collapseOne"
                                                                                aria-expanded="false"
                                                                                aria-controls="collapseOne"
                                                                                onClick={() =>
                                                                                    this.setState({
                                                                                        showBand: {
                                                                                            ...showBand,
                                                                                            band1: true
                                                                                        }
                                                                                    })
                                                                                }
                                                                            >
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
                                                                                                !this.state.project.sub_system_id?.trim().length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            }custom-selecbox`}
                                                                                            value={this.state.project.sub_system_id}
                                                                                            onChange={e => {
                                                                                                const data = this.state?.subSystemArray.find(
                                                                                                    item => item.id === e.target.value
                                                                                                )?.service_life;
                                                                                                this.setState(
                                                                                                    {
                                                                                                        project: {
                                                                                                            ...project,
                                                                                                            sub_system_id: e.target.value,
                                                                                                            service_life: this.state.project
                                                                                                                .service_life
                                                                                                                ? this.state.project?.service_life
                                                                                                                : data || 0
                                                                                                        },
                                                                                                        assetFormData: {
                                                                                                            ...assetFormData,
                                                                                                            sub_system_id: e.target.value,
                                                                                                            service_life: this.state.assetFormData
                                                                                                                .service_life
                                                                                                                ? this.state.assetFormData
                                                                                                                      .service_life
                                                                                                                : data || 0
                                                                                                        }
                                                                                                    },
                                                                                                    () =>
                                                                                                        this.getRecommendationTemplates(
                                                                                                            this.state.project.sub_system_id
                                                                                                        )
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.state.subSystemArray &&
                                                                                                this.state.subSystemArray.length &&
                                                                                                this.state.subSystemArray.map((item, i) => (
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
                                                            <div
                                                                id="collapseOne"
                                                                className={showBand.band1 ? "collapse show" : "collapse"}
                                                                aria-labelledby="heading"
                                                            >
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
                                                                                                await this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        recommendation_type: e.target.value
                                                                                                    }
                                                                                                });
                                                                                                this.handleRecommendationTypeSelect();
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
                                                                                <div>
                                                                                    {this.state.project.sub_system_id && (
                                                                                        <button
                                                                                            className="btn btn-clear"
                                                                                            onClick={() =>
                                                                                                this.toggleShowRecommendationTemplateModal()
                                                                                            }
                                                                                        >
                                                                                            <i className="fas fa-plus" /> Add Template
                                                                                        </button>
                                                                                    )}
                                                                                    <span className="ml-2">
                                                                                        {project.description?.length}/{this.state.captionLength}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <Autosuggest
                                                                                        suggestions={recommendationSuggestions}
                                                                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                                                        getSuggestionValue={this.getSuggestionValue}
                                                                                        renderSuggestion={this.renderSuggestion}
                                                                                        shouldRenderSuggestions={() => true}
                                                                                        onSuggestionSelected={(e, { suggestion }) =>
                                                                                            this.onSuggestionSelected(suggestion)
                                                                                        }
                                                                                        inputProps={{
                                                                                            type: "text",
                                                                                            maxLength: this.state.captionLength,

                                                                                            placeholder: "Enter Recommendation",
                                                                                            value: this.state.project.description,

                                                                                            onChange: (e, { newValue }) => {
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        description: newValue
                                                                                                    }
                                                                                                });
                                                                                            },

                                                                                            className: `${
                                                                                                this.state.showErrorBorder &&
                                                                                                !this.state.project.description?.trim().length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            }
                                                                                            custom-input form-control pr-5`
                                                                                        }}
                                                                                    />
                                                                                    <i
                                                                                        className="fas fa-times cursor-pointer recom-close-icon"
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                project: { ...project, description: "" }
                                                                                            })
                                                                                        }
                                                                                    ></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`card ${showErrorBorder && this.showErrorBand("b2") ? "error-border" : ""}`}>
                                                            <div className="card-header" id="headingTwo">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseTwo"
                                                                        aria-expanded="true"
                                                                        aria-controls="collapseTwo"
                                                                        onClick={() =>
                                                                            this.setState({
                                                                                showBand: {
                                                                                    ...showBand,
                                                                                    band2: false
                                                                                }
                                                                            })
                                                                        }
                                                                    >
                                                                        Geo Hierarchy
                                                                    </button>

                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div
                                                                                className="form-group"
                                                                                data-target="#collapseTwo"
                                                                                aria-expanded="false"
                                                                                aria-controls="collapseTwo"
                                                                                onClick={() =>
                                                                                    this.setState({
                                                                                        showBand: {
                                                                                            ...showBand,
                                                                                            band2: true
                                                                                        }
                                                                                    })
                                                                                }
                                                                            >
                                                                                <label>Region *</label>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.region_id?.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox`}
                                                                                        value={this.state.project.region_id}
                                                                                        onChange={async e => {
                                                                                            await this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    region_id: e.target.value
                                                                                                },
                                                                                                assetFormData: {
                                                                                                    ...assetFormData,
                                                                                                    region_id: e.target.value,
                                                                                                    site_id: "",
                                                                                                    building_id: "",
                                                                                                    building_type: "",
                                                                                                    addition_id: "",
                                                                                                    floor_id: ""
                                                                                                }
                                                                                            });
                                                                                            this.handleRegionSelect();
                                                                                        }}
                                                                                        data-target="#collapseTwo"
                                                                                        aria-expanded="false"
                                                                                        aria-controls="collapseTwo"
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band2: true
                                                                                                }
                                                                                            })
                                                                                        }
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
                                                                                            !this.state.project.site_id?.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox`}
                                                                                        value={this.state.project.site_id}
                                                                                        onChange={async e => {
                                                                                            await this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    site_id: e.target.value
                                                                                                },
                                                                                                assetFormData: {
                                                                                                    ...assetFormData,
                                                                                                    site_id: e.target.value,
                                                                                                    building_id: "",
                                                                                                    building_type: "",
                                                                                                    addition_id: "",
                                                                                                    floor_id: ""
                                                                                                }
                                                                                            });
                                                                                            await this.handleSiteSelect();
                                                                                            if (this.state.project.site_id !== "") {
                                                                                                await this.getCostYear();
                                                                                            }
                                                                                        }}
                                                                                        data-target="#collapseTwo"
                                                                                        aria-expanded="false"
                                                                                        aria-controls="collapseTwo"
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band2: true
                                                                                                }
                                                                                            })
                                                                                        }
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
                                                                                            !this.state.project.building_id?.trim().length
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
                                                                                                    addition_id: "",
                                                                                                    floor_id: ""
                                                                                                },
                                                                                                assetFormData: {
                                                                                                    ...assetFormData,
                                                                                                    building_id: e.target.value,
                                                                                                    building_type: buildingType
                                                                                                        ? buildingType.description
                                                                                                        : "",
                                                                                                    addition_id: "",
                                                                                                    floor_id: ""
                                                                                                },
                                                                                                activeBuilding: e.target.value
                                                                                            });
                                                                                            this.handleAdditionSelect(e);
                                                                                            this.handleFloorSelect(e);
                                                                                        }}
                                                                                        data-target="#collapseTwo"
                                                                                        aria-expanded="false"
                                                                                        aria-controls="collapseTwo"
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band2: true
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    >
                                                                                        <option value="">Select</option>
                                                                                        {this.props.userReducer.getAllBuildingsDropdownResponse
                                                                                            .buildings &&
                                                                                        this.props.userReducer.getAllBuildingsDropdownResponse
                                                                                            .buildings.length
                                                                                            ? this.props.userReducer.getAllBuildingsDropdownResponse.buildings.map(
                                                                                                  (item, i) => (
                                                                                                      <option value={item.id} key={i}>
                                                                                                          {item.name}{" "}
                                                                                                          {item.building_description
                                                                                                              ? `(${item.building_description})`
                                                                                                              : ""}
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
                                                            <div
                                                                id="collapseTwo"
                                                                className={showBand.band2 ? "collapse show" : "collapse"}
                                                                aria-labelledby="headingTwo"
                                                            >
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
                                                                                    <label>
                                                                                        {" "}
                                                                                        {this.props.projectReducer.getProjectByIdResponse
                                                                                            ?.addition_required
                                                                                            ? "Addition *"
                                                                                            : "Addition"}{" "}
                                                                                    </label>
                                                                                    <div className="custom-selecbox">
                                                                                        <select
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                this.props.projectReducer.getProjectByIdResponse
                                                                                                    ?.addition_required &&
                                                                                                !this.state.project.addition_id?.trim().length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            }form-control`}
                                                                                            autoComplete={"nope"}
                                                                                            value={this.state.project.addition_id || ""}
                                                                                            onChange={async e => {
                                                                                                await this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        addition_id: e.target.value
                                                                                                    },
                                                                                                    assetFormData: {
                                                                                                        ...assetFormData,
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
                                                                                                    },
                                                                                                    assetFormData: {
                                                                                                        ...assetFormData,
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
                                                                                                },
                                                                                                assetFormData: {
                                                                                                    ...assetFormData,
                                                                                                    room_number: e.target.value
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
                                                                <div
                                                                    className={`card ${
                                                                        showErrorBorder && this.showErrorBand("b3") ? "error-border" : ""
                                                                    }`}
                                                                >
                                                                    <div className="card-header" id="headingTre">
                                                                        <div className="otr-recom-div">
                                                                            <button
                                                                                className="btn btn-link"
                                                                                data-toggle="collapse"
                                                                                data-target="#collapseTre"
                                                                                aria-expanded="false"
                                                                                aria-controls="collapseOne"
                                                                                onClick={() =>
                                                                                    this.setState({
                                                                                        showBand: {
                                                                                            ...showBand,
                                                                                            band3: false
                                                                                        }
                                                                                    })
                                                                                }
                                                                            >
                                                                                Capital Spending Plan
                                                                            </button>
                                                                            <div className="txt-rcm">
                                                                                <div
                                                                                    className="content-inp-card blue-sec"
                                                                                    data-target="#collapseTre"
                                                                                    aria-expanded="false"
                                                                                    aria-controls="collapseOne"
                                                                                    onClick={() =>
                                                                                        this.setState({
                                                                                            showBand: {
                                                                                                ...showBand,
                                                                                                band3: true
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                >
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
                                                                                    <div
                                                                                        className="form-group"
                                                                                        data-target="#collapseTre"
                                                                                        aria-expanded="false"
                                                                                        aria-controls="collapseOne"
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band3: true
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    >
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
                                                                            <div className="txt-categ txt-rcm year-item main_year">
                                                                                <div className="content-inp-card">
                                                                                    <div
                                                                                        className="form-group"
                                                                                        //  data-toggle={this.state.test?"collapse" : "false"}
                                                                                        data-target="#collapseTre"
                                                                                        aria-expanded="false"
                                                                                        aria-controls="collapseOne"
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band3: true
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    >
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
                                                                                                        cost_per_unit: value,
                                                                                                        options_cost: project.quantity
                                                                                                            ? value * project.quantity
                                                                                                            : project.options_cost
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        id="collapseTre"
                                                                        className={this.state.showBand.band3 ? "collapse show" : "collapse"}
                                                                        aria-labelledby="headingTre"
                                                                    >
                                                                        <div className="card-body add-sec">
                                                                            <div className="outer-rcm mt-1">
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
                                                                                                            quantity: value,
                                                                                                            options_cost: project.cost_per_unit
                                                                                                                ? value * project.cost_per_unit
                                                                                                                : project.options_cost
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
                                                                                                displayType={"text"}
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
                                                                                                    {item?.isAdditional && (
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            className="close"
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
                                                                                                    )}
                                                                                                </div>
                                                                                            </>
                                                                                        );
                                                                                    })}
                                                                                <div className={` txt-rcm `}>
                                                                                    <div className="content-inp-card icn">
                                                                                        <button
                                                                                            className="btn btn-add"
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
                                                                <div
                                                                    className={`card ${
                                                                        showErrorBorder && this.showErrorBand("b3") ? "error-border" : ""
                                                                    }`}
                                                                >
                                                                    <div className="card-header" id="headingTre">
                                                                        <div className="otr-recom-div">
                                                                            <button
                                                                                className="btn btn-link"
                                                                                data-toggle="collapse"
                                                                                data-target="#collapseTre"
                                                                                aria-expanded="false"
                                                                                aria-controls="collapseOne"
                                                                                onClick={() =>
                                                                                    this.setState({
                                                                                        showBand: {
                                                                                            ...showBand,
                                                                                            band3: false
                                                                                        }
                                                                                    })
                                                                                }
                                                                            >
                                                                                Capital Spending Plan
                                                                            </button>
                                                                            <div className="txt-rcm">
                                                                                <div
                                                                                    className="content-inp-card blue-sec"
                                                                                    data-target="#collapseTre"
                                                                                    aria-expanded="false"
                                                                                    aria-controls="collapseOne"
                                                                                    onClick={() =>
                                                                                        this.setState({
                                                                                            showBand: {
                                                                                                ...showBand,
                                                                                                band3: true
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <h3
                                                                                        className="p-name"
                                                                                        data-target={
                                                                                            this.state.showBand.b3 ? "#collapseTre" : "false"
                                                                                        }
                                                                                        aria-expanded={this.state.showBand.b3 ? true : "false"}
                                                                                        aria-controls={
                                                                                            this.state.showBand.b3 ? "collapseOne" : "false"
                                                                                        }
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band3: true
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    >
                                                                                        Project Total
                                                                                    </h3>
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
                                                                                                    <div
                                                                                                        className="content-inp-card"
                                                                                                        data-target={
                                                                                                            this.state.showBand.band3
                                                                                                                ? "#collapseTre"
                                                                                                                : "false"
                                                                                                        }
                                                                                                        aria-expanded={
                                                                                                            this.state.showBand.band3 ? true : "false"
                                                                                                        }
                                                                                                        aria-controls={
                                                                                                            this.state.showBand.band3
                                                                                                                ? "collapseTre"
                                                                                                                : "false"
                                                                                                        }
                                                                                                        onClick={() =>
                                                                                                            this.setState({
                                                                                                                showBand: {
                                                                                                                    ...showBand,
                                                                                                                    band3: true
                                                                                                                }
                                                                                                            })
                                                                                                        }
                                                                                                    >
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
                                                                                                                    this.setMaintenanceYear(
                                                                                                                        values,
                                                                                                                        item.year
                                                                                                                    );
                                                                                                                }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    {item?.isAdditional && (
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            className="close"
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
                                                                                                    )}
                                                                                                </div>
                                                                                            )}
                                                                                        </>
                                                                                    );
                                                                                })}
                                                                            {this.state.project.maintenance_years?.length < 2 && (
                                                                                <div className={` txt-rcm `}>
                                                                                    <div className="content-inp-card icn">
                                                                                        <button
                                                                                            className="btn btn-add"
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
                                                                    <div
                                                                        id="collapseTre"
                                                                        className={showBand.band3 ? "collapse show" : "collapse"}
                                                                        aria-labelledby="headingTre"
                                                                    >
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
                                                                                                                        this.setMaintenanceYear(
                                                                                                                            values,
                                                                                                                            item.year
                                                                                                                        );
                                                                                                                    }}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {item?.isAdditional && (
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                className="close"
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
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}
                                                                                            </>
                                                                                        );
                                                                                    })}
                                                                                {this.state.project.maintenance_years?.length >= 2 && (
                                                                                    <div className={` txt-rcm `}>
                                                                                        <div className="content-inp-card icn">
                                                                                            <button
                                                                                                className="btn btn-add"
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
                                                        <div className={`card ${showErrorBorder && this.showErrorBand("b4") ? "error-border" : ""}`}>
                                                            <div className="card-header" id="headingFour">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseFour"
                                                                        aria-expanded="false"
                                                                        aria-controls="collapseOne"
                                                                        onClick={() =>
                                                                            this.setState({
                                                                                showBand: {
                                                                                    ...showBand,
                                                                                    band4: false
                                                                                }
                                                                            })
                                                                        }
                                                                    >
                                                                        Priority
                                                                    </button>
                                                                    <div className="txt-rcm">
                                                                        <div
                                                                            className="content-inp-card blue-sec"
                                                                            data-target={this.state.showBand.band4 ? "#collapseFour" : "false"}
                                                                            aria-expanded={this.state.showBand.band4 ? true : "false"}
                                                                            aria-controls={this.state.showBand.band4 ? "collapseOne" : "false"}
                                                                            onClick={() =>
                                                                                this.setState({
                                                                                    showBand: {
                                                                                        ...showBand,
                                                                                        band4: true
                                                                                    }
                                                                                })
                                                                            }
                                                                        >
                                                                            <h3 className="p-name">Priority Total</h3>
                                                                            <h3 className="color-white">{this.state.priorityTotal || 0}</h3>
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
                                                                                        data-target={
                                                                                            this.state.showBand.band4 ? "#collapseFour" : "false"
                                                                                        }
                                                                                        aria-expanded={this.state.showBand.band4 ? true : "false"}
                                                                                        aria-controls={
                                                                                            this.state.showBand.band4 ? "collapseOne" : "false"
                                                                                        }
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band4: true
                                                                                                }
                                                                                            })
                                                                                        }
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
                                                                                                                ?.toString()
                                                                                                                ?.trim().length) &&
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
                                                                            {/* here */}
                                                                        </>
                                                                    ))}
                                                                    {!priorityElementsData.length ? (
                                                                        <div className="txt-rcm border-right-last">
                                                                            <div
                                                                                className="content-inp-card"
                                                                                data-for="recommandation_detils"
                                                                                data-place="top"
                                                                                data-html={true}
                                                                            >
                                                                                <div className="form-group">
                                                                                    <label>Criticality</label>
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`form-control fs-12`}
                                                                                        placeholder="0"
                                                                                        value={this.state.project.criticality_id}
                                                                                        onChange={async e => {
                                                                                            await this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    criticality_id: e.target.value
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    >
                                                                                        <option value={""}>Select</option>
                                                                                        {criticalityData.map((criticality, i) => (
                                                                                            <option
                                                                                                key={criticality.id}
                                                                                                className="fs-12"
                                                                                                value={criticality.id}
                                                                                            >
                                                                                                {criticality.name}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div
                                                                id="collapseFour"
                                                                className={showBand.band4 ? "collapse show" : "collapse"}
                                                                aria-labelledby="headingFour"
                                                            >
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
                                                                                                                    ?.toString()
                                                                                                                    ?.trim().length) &&
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
                                                                        {priorityElementsData?.length ? (
                                                                            <div className="txt-rcm">
                                                                                <div
                                                                                    className="content-inp-card"
                                                                                    data-for="recommandation_detils"
                                                                                    data-place="top"
                                                                                    data-html={true}
                                                                                >
                                                                                    <div className="form-group">
                                                                                        <label>Criticality</label>
                                                                                        <select
                                                                                            autoComplete={"nope"}
                                                                                            className={`form-control fs-12`}
                                                                                            placeholder="0"
                                                                                            value={this.state.project.criticality_id}
                                                                                            onChange={async e => {
                                                                                                await this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        criticality_id: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <option value={""}>Select</option>
                                                                                            {criticalityData.map((criticality, i) => (
                                                                                                <option
                                                                                                    key={criticality.id}
                                                                                                    className="fs-12"
                                                                                                    value={criticality.id}
                                                                                                >
                                                                                                    {criticality.name}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {this.state.project.recommendation_type === "asset" && (
                                                            <div
                                                                className={`card ${
                                                                    showErrorBorder && this.showErrorBand("b5") ? "error-border" : ""
                                                                }`}
                                                            >
                                                                <div className="card-header" id="headingFive">
                                                                    <div className="otr-recom-div">
                                                                        <button
                                                                            className="btn btn-link"
                                                                            data-toggle="collapse"
                                                                            data-target="#collapseFive"
                                                                            aria-expanded="false"
                                                                            aria-controls="collapseOne"
                                                                            onClick={() =>
                                                                                this.setState({
                                                                                    showBand: {
                                                                                        ...showBand,
                                                                                        band5: false
                                                                                    }
                                                                                })
                                                                            }
                                                                        >
                                                                            Asset
                                                                        </button>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div
                                                                                    className="form-group"
                                                                                    data-target={
                                                                                        this.state.showBand.band5 ? "#collapseFive" : "false"
                                                                                    }
                                                                                    aria-expanded={this.state.showBand.band5 ? true : "false"}
                                                                                    aria-controls={
                                                                                        this.state.showBand.band5 ? "collapseOne" : "false"
                                                                                    }
                                                                                    onClick={() =>
                                                                                        this.setState({
                                                                                            showBand: {
                                                                                                ...showBand,
                                                                                                band5: true
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <label>Asset Name *</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !assetFormData?.asset_name?.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }form-control`}
                                                                                        placeholder="Asset Name"
                                                                                        value={assetFormData?.asset_name}
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                assetFormData: {
                                                                                                    ...assetFormData,
                                                                                                    asset_name: e.target.value
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div
                                                                                    className="form-group"
                                                                                    data-target={
                                                                                        this.state.showBand.band5 ? "#collapseFive" : "false"
                                                                                    }
                                                                                    aria-expanded={this.state.showBand.band5 ? true : "false"}
                                                                                    aria-controls={
                                                                                        this.state.showBand.band5 ? "collapseOne" : "false"
                                                                                    }
                                                                                    onClick={() =>
                                                                                        this.setState({
                                                                                            showBand: {
                                                                                                ...showBand,
                                                                                                band5: true
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <label>Asset Condition *</label>
                                                                                    <div className={`custom-selecbox`}>
                                                                                        <select
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                !assetFormData?.client_asset_condition_id?.trim()
                                                                                                    .length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            } custom-selecbox`}
                                                                                            autoComplete={"nope"}
                                                                                            value={assetFormData?.client_asset_condition_id}
                                                                                            onChange={e =>
                                                                                                this.setState({
                                                                                                    assetFormData: {
                                                                                                        ...assetFormData,
                                                                                                        client_asset_condition_id: e.target.value
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

                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div
                                                                                    className="form-group"
                                                                                    data-target={
                                                                                        this.state.showBand.band5 ? "#collapseFive" : "false"
                                                                                    }
                                                                                    aria-expanded={this.state.showBand.band5 ? true : "false"}
                                                                                    aria-controls={
                                                                                        this.state.showBand.band5 ? "collapseOne" : "false"
                                                                                    }
                                                                                    onClick={() =>
                                                                                        this.setState({
                                                                                            showBand: {
                                                                                                ...showBand,
                                                                                                band5: true
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <label>
                                                                                        {this.props.projectReducer.getProjectByIdResponse
                                                                                            ?.asset_tag_required
                                                                                            ? "Asset Tag *"
                                                                                            : "Asset Tag"}
                                                                                    </label>
                                                                                    {/* <NumberFormat
                                                                                        autoComplete={"nope"}
                                                                                        className=" custom-input form-control"
                                                                                        placeholder="Asset Tag"
                                                                                        value={parseInt(assetFormData.asset_tag) || ""}
                                                                                        format="####"
                                                                                        displayType={"input"}
                                                                                        onValueChange={values => {
                                                                                            const { value } = values;
                                                                                            this.setState({
                                                                                                assetFormData: {
                                                                                                    ...assetFormData,
                                                                                                    asset_tag: value
                                                                                                    // usefull_life_remaining: getUsefullLifeRemaining(
                                                                                                    //     value,
                                                                                                    //     assetFormData.service_life
                                                                                                    // )
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    /> */}
                                                                                    <input
                                                                                        type="text"
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            this.props.projectReducer.getProjectByIdResponse
                                                                                                ?.asset_tag_required &&
                                                                                            !this.state.assetFormData.asset_tag?.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }form-control`}
                                                                                        // className="form-control"
                                                                                        placeholder="Asset Name"
                                                                                        value={assetFormData?.asset_tag}
                                                                                        onChange={e => {
                                                                                            this.setState({
                                                                                                assetFormData: {
                                                                                                    ...assetFormData,
                                                                                                    asset_tag: e.target.value
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    id="collapseFive"
                                                                    className={showBand.band5 ? "collapse show" : "collapse"}
                                                                    aria-labelledby="headingFive"
                                                                >
                                                                    <div className="card-body">
                                                                        <div className="outer-rcm mt-1">
                                                                            <div className="txt-rcm">
                                                                                <div className="content-inp-card">
                                                                                    <div className="form-group">
                                                                                        <label>
                                                                                            {" "}
                                                                                            {this.props.projectReducer.getProjectByIdResponse
                                                                                                ?.serial_number_required
                                                                                                ? "Serial Number *"
                                                                                                : "Serial Number"}
                                                                                        </label>
                                                                                        <input
                                                                                            autoComplete={"nope"}
                                                                                            type="text"
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                this.props.projectReducer.getProjectByIdResponse
                                                                                                    ?.serial_number_required &&
                                                                                                !this.state.assetFormData.serial_number?.trim().length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            } form-control`}
                                                                                            placeholder="Serial Number"
                                                                                            value={assetFormData.serial_number}
                                                                                            onChange={e => {
                                                                                                this.setState({
                                                                                                    assetFormData: {
                                                                                                        ...assetFormData,
                                                                                                        serial_number: e.target.value
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
                                                                                        <label>Installed Year</label>
                                                                                        <NumberFormat
                                                                                            autoComplete={"nope"}
                                                                                            className=" custom-input form-control"
                                                                                            placeholder="Installed Year"
                                                                                            value={parseInt(assetFormData.installed_year) || ""}
                                                                                            format="####"
                                                                                            displayType={"input"}
                                                                                            onValueChange={values => {
                                                                                                const { value } = values;
                                                                                                this.setState({
                                                                                                    assetFormData: {
                                                                                                        ...assetFormData,
                                                                                                        installed_year: value,
                                                                                                        usefull_life_remaining:
                                                                                                            getUsefullLifeRemaining(
                                                                                                                value,
                                                                                                                assetFormData.service_life
                                                                                                            )
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
                                                                                        <NumberFormat
                                                                                            autoComplete={"nope"}
                                                                                            className=" custom-input form-control"
                                                                                            placeholder="Service Life"
                                                                                            value={parseInt(assetFormData.service_life) || ""}
                                                                                            displayType={"input"}
                                                                                            onValueChange={values => {
                                                                                                const { value } = values;
                                                                                                this.setState({
                                                                                                    assetFormData: {
                                                                                                        ...assetFormData,
                                                                                                        service_life: value,
                                                                                                        usefull_life_remaining:
                                                                                                            getUsefullLifeRemaining(
                                                                                                                assetFormData.installed_year,
                                                                                                                value
                                                                                                            )
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="txt-rcm">
                                                                                <div
                                                                                    className="content-inp-card"
                                                                                    data-tip={
                                                                                        assetFormData.usefull_life_remaining
                                                                                            ? `Year= ${
                                                                                                  new Date().getFullYear() +
                                                                                                  assetFormData.usefull_life_remaining
                                                                                              }`
                                                                                            : ""
                                                                                    }
                                                                                    data-for="recommandation_detils"
                                                                                    data-place="top"
                                                                                >
                                                                                    <div className="form-group">
                                                                                        <label>Useful Life Remaining</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            autoComplete={"nope"}
                                                                                            className="form-control cursor-diabled"
                                                                                            placeholder="Useful Life Remaining"
                                                                                            value={assetFormData?.usefull_life_remaining}
                                                                                            readOnly
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* <div className="txt-rcm">
                                                                                <div className="content-inp-card">
                                                                                    <div className="form-group">
                                                                                        <label>Manufacturer</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            autoComplete={"nope"}
                                                                                            className={`form-control`}
                                                                                            placeholder="Manufacturer"
                                                                                            value={assetFormData?.manufacturer}
                                                                                            onChange={e => {
                                                                                                this.setState({
                                                                                                    assetFormData: {
                                                                                                        ...assetFormData,
                                                                                                        manufacturer: e.target.value
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div> */}
                                                                            <div className="txt-rcm"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {this.state.project?.fmp === "yes" && (
                                                            <div
                                                                className={`card ${
                                                                    showErrorBorder && this.showErrorBand("b7") ? "error-border" : ""
                                                                }`}
                                                            >
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
                                                        <div className={`card ${showErrorBorder && this.showErrorBand("b6") ? "error-border" : ""}`}>
                                                            <div className="card-header" id="headingSix">
                                                                <div className="otr-recom-div">
                                                                    <button
                                                                        className="btn btn-link"
                                                                        data-toggle="collapse"
                                                                        data-target="#collapseSix"
                                                                        aria-expanded="false"
                                                                        aria-controls="collapseOne"
                                                                        onClick={() =>
                                                                            this.setState({
                                                                                showBand: {
                                                                                    ...showBand,
                                                                                    band6: false
                                                                                }
                                                                            })
                                                                        }
                                                                    >
                                                                        Additional Details
                                                                    </button>
                                                                    {project.recommendation_type === "building" ? (
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Condition *</label>
                                                                                    <div className={`custom-selecbox`}>
                                                                                        <select
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                !project?.asset_condition_id?.trim().length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            } custom-selecbox`}
                                                                                            autoComplete={"nope"}
                                                                                            value={project?.asset_condition_id}
                                                                                            onChange={e =>
                                                                                                this.setState({
                                                                                                    project: {
                                                                                                        ...project,
                                                                                                        asset_condition_id: e.target.value
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            data-target={
                                                                                                this.state.showBand.band6 ? "#collapseSix" : "false"
                                                                                            }
                                                                                            aria-expanded={this.state.showBand.band6 ? true : "false"}
                                                                                            aria-controls={
                                                                                                this.state.showBand.band6 ? "collapseOne" : "false"
                                                                                            }
                                                                                            onClick={() =>
                                                                                                this.setState({
                                                                                                    showBand: {
                                                                                                        ...showBand,
                                                                                                        band6: true
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        >
                                                                                            <option value="">Select</option>
                                                                                            {this.props.recommendationsReducer
                                                                                                ?.getConditionBasedOnProject?.asset_conditions?.length
                                                                                                ? this.props.recommendationsReducer.getConditionBasedOnProject.asset_conditions.map(
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
                                                                                            data-target={
                                                                                                this.state.showBand.band6 ? "#collapseSix" : "false"
                                                                                            }
                                                                                            aria-expanded={this.state.showBand.band6 ? true : "false"}
                                                                                            aria-controls={
                                                                                                this.state.showBand.band6 ? "collapseOne" : "false"
                                                                                            }
                                                                                            onClick={() =>
                                                                                                this.setState({
                                                                                                    showBand: {
                                                                                                        ...showBand,
                                                                                                        band6: true
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
                                                                    )}
                                                                    <div className="txt-rcm">
                                                                        <div className="content-inp-card">
                                                                            <div className="form-group">
                                                                                <label>Category *</label>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete={"nope"}
                                                                                        className={`${
                                                                                            this.state.showErrorBorder &&
                                                                                            !this.state.project.category_id?.trim().length
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox`}
                                                                                        value={this.state.project.category_id}
                                                                                        onChange={e => {
                                                                                            const bands =
                                                                                                this.props.recommendationsReducer?.getCategoryByProject?.categories.find(
                                                                                                    elem => elem.id === e.target.value
                                                                                                )?.assigned_bands;
                                                                                            this.setState({
                                                                                                project: {
                                                                                                    ...project,
                                                                                                    category_id: e.target.value,
                                                                                                    energy_band_show: bands.includes("energy_band")
                                                                                                        ? "yes"
                                                                                                        : "no",
                                                                                                    water_band_show: bands.includes("water_band")
                                                                                                        ? "yes"
                                                                                                        : "no"
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                        data-target={
                                                                                            this.state.showBand.band6 ? "#collapseSix" : "false"
                                                                                        }
                                                                                        aria-expanded={this.state.showBand.band6 ? true : "false"}
                                                                                        aria-controls={
                                                                                            this.state.showBand.band6 ? "collapseOne" : "false"
                                                                                        }
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band6: true
                                                                                                }
                                                                                            })
                                                                                        }
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
                                                                                            !this.state.project.capital_type?.trim().length
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
                                                                                        data-target={
                                                                                            this.state.showBand.band6 ? "#collapseSix" : "false"
                                                                                        }
                                                                                        aria-expanded={this.state.showBand.band6 ? true : "false"}
                                                                                        aria-controls={
                                                                                            this.state.showBand.band6 ? "collapseOne" : "false"
                                                                                        }
                                                                                        onClick={() =>
                                                                                            this.setState({
                                                                                                showBand: {
                                                                                                    ...showBand,
                                                                                                    band6: true
                                                                                                }
                                                                                            })
                                                                                        }
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

                                                            <div
                                                                id="collapseSix"
                                                                className={showBand.band6 ? "collapse show" : "collapse"}
                                                                aria-labelledby="headingSix"
                                                            >
                                                                <div className="card-body">
                                                                    <div className="outer-rcm mt-1">
                                                                        {project.recommendation_type === "building" && (
                                                                            <>
                                                                                <div className="txt-rcm">
                                                                                    <div className="content-inp-card">
                                                                                        <div className="form-group">
                                                                                            <label>Status</label>
                                                                                            <div
                                                                                                className={`${
                                                                                                    this.state.showErrorBorder &&
                                                                                                    !this.state.project.status
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
                                                                                                            installed_year: value,
                                                                                                            usefull_life_remaining:
                                                                                                                getUsefullLifeRemaining(
                                                                                                                    value,
                                                                                                                    project.service_life
                                                                                                                )
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
                                                                                                            service_life: e.target.value,
                                                                                                            usefull_life_remaining:
                                                                                                                getUsefullLifeRemaining(
                                                                                                                    project.installed_year,
                                                                                                                    e.target.value
                                                                                                                )
                                                                                                        }
                                                                                                    });
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="txt-rcm">
                                                                                    <div
                                                                                        className="content-inp-card"
                                                                                        data-tip={
                                                                                            project.usefull_life_remaining
                                                                                                ? `Year= ${
                                                                                                      new Date().getFullYear() +
                                                                                                      project.usefull_life_remaining
                                                                                                  }`
                                                                                                : ""
                                                                                        }
                                                                                        data-for="recommandation_detils"
                                                                                        data-place="top"
                                                                                    >
                                                                                        <div className="form-group">
                                                                                            <label>Useful Life Remaining</label>
                                                                                            <input
                                                                                                readOnly
                                                                                                type="text"
                                                                                                autoComplete={"nope"}
                                                                                                className="form-control cursor-notallowed"
                                                                                                placeholder=" Useful Life Remaining"
                                                                                                value={project.usefull_life_remaining}
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
                                                                        {/* <div className={`card ${showErrorBorder && this.showErrorBand("b4") ? "error-border" : ""}`}> */}
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>
                                                                                        {" "}
                                                                                        {this.props.projectReducer.getProjectByIdResponse
                                                                                            ?.funding_required
                                                                                            ? "Funding *"
                                                                                            : "Funding"}{" "}
                                                                                    </label>
                                                                                    <div className="custom-selecbox">
                                                                                        <select
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                this.props.projectReducer.getProjectByIdResponse
                                                                                                    ?.funding_required &&
                                                                                                !this.state.project.funding_source_id?.trim().length
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            }form-control`}
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
                                                                        {/* </div> */}
                                                                        <div className="txt-rcm">
                                                                            <div className="content-inp-card">
                                                                                <div className="form-group">
                                                                                    <label>Project</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        readOnly
                                                                                        autoComplete={"nope"}
                                                                                        className="custom-input form-control cursor-diabled"
                                                                                        placeholder="Project"
                                                                                        value={this.props.projectReducer.getProjectByIdResponse?.name}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {project.recommendation_type === "building" && (
                                                                            <div className="txt-rcm max-width-100">
                                                                                <div className="content-inp-card">
                                                                                    <div className="form-group"></div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="form-row m-0">
                                                                        <div className="col-md-4 p-0">
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
                                                                        <div className="col-md-4 p-0">
                                                                            <div className="outer-rcm">
                                                                                <div className="txt-rcm w-100">
                                                                                    <div>
                                                                                        <img src="/img/icn-2.png" alt="" />
                                                                                    </div>
                                                                                    <div className="txt-secn">
                                                                                        <h4>Inspection Date *</h4>
                                                                                        <DatePicker
                                                                                            autoComplete={"nope"}
                                                                                            placeholderText={`Inspection Date`}
                                                                                            // className="form-control custom-wid"
                                                                                            className={`${
                                                                                                this.state.showErrorBorder &&
                                                                                                !this.state.project.inspection_date
                                                                                                    ? "error-border "
                                                                                                    : ""
                                                                                            }form-control custom-wid`}
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
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {project.energy_band_show === "yes" && (
                                                            <EnergyBand
                                                                energyData={project.energy_band}
                                                                bandShown={showBand.energyBand}
                                                                handleBandClick={this.handleBandClick}
                                                                handleChangeData={this.handleChangeBandData}
                                                                bandId="energyBand"
                                                            />
                                                        )}
                                                        {project.water_band_show === "yes" && (
                                                            <WaterBand
                                                                waterData={project.water_band}
                                                                bandShown={showBand.waterBand}
                                                                handleBandClick={this.handleBandClick}
                                                                handleChangeData={this.handleChangeBandData}
                                                                bandId="waterBand"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-4 back-set">
                                                    <div className="details-img-block details-img-new" style={{ height: "250px" }}>
                                                        {this.state.selectedImage && this.state.selectedImage.url ? (
                                                            <>
                                                                {this.state.selectedImage !== this.state.project.image ? (
                                                                    <>
                                                                        {/* <div
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
                                                                        </div> */}
                                                                        <img src={`${this.state.previewImage}`} alt="" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {/* <div
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
                                                                        </div> */}
                                                                        <img src={`${this.state.selectedImage.url}`} alt="" />
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {this.state.previewImage ? (
                                                                    <>
                                                                        {/* <div
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
                                                                        </div> */}
                                                                        <img src={`${this.state.previewImage}`} alt="" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {/* <div className="custom-image-upload" onClick={this.handleAddAttachment}>
                                                                            <label htmlFor="file-input">Add Image</label>
                                                                        </div> */}
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
                                                        {/* <h1>{dimensions}</h1> */}
                                                        <div className="heading">
                                                            <h3>Report Notes</h3>

                                                            <div class="d-flex align-items-center">
                                                                {this.state.project.sub_system_id && (
                                                                    <button
                                                                        className="btn btn-clear"
                                                                        onClick={() => this.toggleShowReportNoteTemplateModal()}
                                                                    >
                                                                        <i className="fas fa-plus" /> Add Template
                                                                    </button>
                                                                )}
                                                                <div
                                                                    data-tip="Click to Expand Report Notes"
                                                                    data-for="recommandation_detils"
                                                                    data-effect="solid"
                                                                    data-place="left"
                                                                    class="ml-2 btn-expand-bl"
                                                                >
                                                                    <img
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => this.openReportNote()}
                                                                        src="/img/expand1.svg"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="cnt-temp-area notes-outer-area"
                                                            style={{ maxHeight: `${this.state.editorHeight}px` }}
                                                        >
                                                            {/* <textarea
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
                                                                
                                                            ></textarea> */}
                                                            <CKEditor
                                                                editor={Editor}
                                                                config={editorConfiguration}
                                                                id="text-form"
                                                                data={this.state.project.note_html || ""}
                                                                onChange={(event, editor) => {
                                                                    const data = editor.getData();
                                                                    this.handleChangeNote(data);
                                                                }}
                                                            />
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
                        ) : this.state.activeDetail === "Asset Details" ? (
                            <div className="tab-active location-sec recom-sec recommendation-form  addition-add">
                                {project.code && (
                                    <label htmlFor="" className="label-box-top">
                                        <span className="label-txt"> ID: </span> <span className="label-detl">{` ${project?.code}`}</span>{" "}
                                    </label>
                                )}
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
                                            <i className="fas fa-plus" /> Add New Asset & Assign
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
                                    <AssetForm
                                        assetFormData={assetFormData}
                                        clientList={clients}
                                        regionList={regionList}
                                        siteList={siteList}
                                        additionList={this.props.recommendationsReducer.getAdditionByBuilding.additions}
                                        buildingList={this.props.userReducer.getAllBuildingsDropdownResponse.buildings}
                                        floorList={this.props.recommendationsReducer.getFloorByBuilding.floors}
                                        tradeList={this.props.recommendationsReducer.getTradeByProject.trades}
                                        systemList={this.state.systemArray}
                                        subSystemList={this.state.subSystemArray}
                                        handleChangeAssetForm={this.handleChangeAssetForm}
                                        setAssetFormData={this.setAssetFormData}
                                        showErrorBorder={this.state.showErrorBorder}
                                    />
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

const assetFormInitialState = {
    code: "",
    asset_name: "",
    asset_tag: "",
    asset_note: "",
    client_asset_condition_id: "",
    installed_year: "",
    service_life: "",
    usefull_life_remaining: "",
    crv: "",
    manufacturer: "",
    year_manufactured: "",
    model_number: "",
    serial_number: "",
    capacity: "",
    criticality: "",
    area_served: "",

    trade_id: "",
    system_id: "",
    sub_system_id: "",

    client_id: "",
    region_id: "",
    site_id: "",
    building_id: "",
    addition_id: "",
    floor_id: "",
    room_number: "",
    room_name: "",
    location: "",
    architectural_room_number: "",
    additional_room_description: "",

    uniformat_level_1_id: "",
    uniformat_level_2_id: "",
    uniformat_level_3_id: "",
    uniformat_level_4_id: "",
    uniformat_level_5_id: "",

    asset_type_id: "",
    asset_description: "",
    asset_barcode: "",
    asset_client_id: "",
    asset_cmms_id: "",

    warranty_start: "",
    warranty_end: "",
    install_date: "",
    startup_date: "",
    upstream_asset_barcode_number: "",
    linked_asset_barcode_number: "",
    source_panel_barcode_number: "",
    source_panel: "",
    asset_status_id: "",
    notes: "",

    main_category_id: "",
    sub_category_1_id: "",
    sub_category_2_id: "",
    sub_category_3_id: "",
    guid: "",
    source_panel_name: "",
    skysite_hyperlink: "",

    quantity: "",
    rtls_tag: "",
    latitude: "",
    longitude: "",
    current_age: "",
    age: "",
    new_asset: "",
    parent_global_id: "",
    survey_global_id: "",
    survey_id: "",
    survey_property_note: "",
    capacity_status: "",
    installed_year_status: "",
    name_plate_status: "",
    qa_notes: "",
    additional_qa_notes: "",
    surveyor: "",
    editor: "",
    survey_date_created: "",
    survey_date_edited: "",
    description: "",
    uniformat_level_6_id: "",
    uniformat_level_6_description: "",
    subcategory2_description: "",
    capacity_unit: ""
};
