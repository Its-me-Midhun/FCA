import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import qs from "query-string";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import initativeAction from "../initiatives/actions";

import CommonActions from "../common/actions";
import regionActions from "../region/actions";
import projectAction from "../project/actions";
import ViewExportModal from "./components/ExportSettingsModal";
import ViewModal from "../common/components/ViewModal";
import AssignClientUserModal from "./components/AssignClientUserModal";
import AssignConsultancyUserModal from "./components/AssignConsultancyUserModal";
import recommendationsActions from "./actions";
import siteActions from "../site/actions";
import buildingActions from "../building/actions";
import _, { debounce } from "lodash";
import RecommendationsMain from "./components/RecommendationsMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { recommendationsTableData } from "../../config/tableData";
import RecommendationsInfo from "./components/RecommendationsInfo";
import CutPasteModal from "./components/CopyModal";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    findPrevPathFromBreadCrumpRecData,
    popBreadCrumpRecData,
    checkPermission,
    popBreadCrumpOnPageClose,
    findPrevPathFromBreadCrump
} from "../../config/utils";
import "../../assets/css/add-recommendation.css";
import MultiSelectFormModal from "./components/MultiSelectFormModal";
import { energy_fields } from "./components/Bands/EnergyBand";
import { water_fields } from "./components/Bands/WaterBand";
import { lockRecommendation } from "./services";
import { getPinnedColumnLeftPositions } from "../../utils/tableUtils";
import { LOCK_STATUS } from "../common/constants";
// import ViewImportModal from "./components/ViewImportHistoryTable";

class index extends Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
        this.pinnedColumnsRef = {};
        const {
            match: {
                params: { section }
            }
        } = this.props;
        this.state = {
            isLoading: true,
            errorMessage: "",
            recommendationsList: [],
            exportWordLoading: false,
            paginationParams: this.props.recommendationsReducer.entityParams[section]?.paginationParams || {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            currentViewAllUsers: null,
            currentActions: null,
            tableLoading: false,
            exportAllTradesLoading: false,
            showViewModal: false,
            showViewModalExport: false,
            // showViewImport: false,
            showWildCardFilter: false,
            showAssignConsultancyUsers: false,
            showNewOrExistingConfirmModal: false,
            showMergeOrReplaceModal: false,
            recommendationsData: {},
            clients: [],
            regionList: [],
            consultancy_users: [],
            confirmUnAssign: false,
            selectedRowId: this.props.recommendationsReducer.entityParams[section]?.selectedRowId,
            initiative_ids: this.props.recommendationsReducer.entityParams[section]?.initiative_ids,
            params: this.props.recommendationsReducer.entityParams[section]?.params || {
                limit: 40,
                offset: 0,
                search: "",
                filters: null,
                list: null,
                year: [],
                index: [],
                active: true,
                surveyor: null,
                image_or_not: null,
                infrastructure_request: null,
                water: null,
                energy: null,
                facility_master_plan: null,
                recommendation_type: null,
                budget_priority: null
            },
            capital_type: this.props.recommendationsReducer.entityParams[section]?.capital_type,
            dashboard: this.props.recommendationsReducer.entityParams[section]?.dashboard,
            start_year: this.props.recommendationsReducer.entityParams[section]?.start_year,
            end_year: this.props.recommendationsReducer.entityParams[section]?.end_year,
            infrastructure_requests: this.props.recommendationsReducer.entityParams[section]?.infrastructure_requests,
            year: this.props.recommendationsReducer.entityParams[section]?.year,
            selectedClient: {},
            selectedRecommendations: this.props.projectIdDashboard
                ? this.props.projectIdDashboard
                : this.props.match.params.id || this.props.recommendationsReducer.entityParams[section]?.selectedEntity,
            tableData: {
                keys: _.cloneDeep(recommendationsTableData.keys),
                config: this.props.recommendationsReducer.entityParams[section]?.tableConfig || _.cloneDeep(recommendationsTableData.config)
            },
            initialTableConfig: _.cloneDeep(recommendationsTableData.config),
            wildCardFilterParams: this.props.recommendationsReducer.entityParams[section]?.wildCardFilterParams,
            filterParams: this.props.recommendationsReducer.entityParams[section]?.filterParams,
            building_ids: this.props.recommendationsReducer.entityParams[section]?.building_ids,
            isDashboardFiltered: this.props.recommendationsReducer.entityParams[section]?.isDashboardFiltered,
            selectedYear: "",
            showCutPasteModal: false,
            maintenance_years: [],
            summaryRowData: {
                crv_total: "",
                year_totals: {}
            },
            showRestoreConfirmModal: false,
            isDeleted: false,
            showConfirmCopyPasteModal: false,
            target_year: "",
            historyPaginationParams: this.props.recommendationsReducer.entityParams[section]?.historyPaginationParams || {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            historyParams: this.props.recommendationsReducer.entityParams[section]?.historyParams || {
                limit: 40,
                offset: 0,
                search: ""
            },
            logData: {
                count: "",
                data: []
            },
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            selectedMainItem: "",
            selectedDropdown: this.props.recommendationsReducer.entityParams[section]?.selectedDropdown || "active",
            selectedDropdownInitiaive: this.props.recommendationsReducer.entityParams[section]?.selectedDropdownInitiaive || "active",
            alertMessage: "",
            permissions: {},
            logPermission: {},
            imageResponse: [],
            selectedRecomIds: this.props.recommendationsReducer.entityParams[section]?.selectedRecomIds || [],
            tempRecommendationsList: this.props.recommendationsReducer?.entityParams[section]?.recommendationList || [],
            showMultiSelectEditForm: false,
            currentFilterParams: {},
            exportLoader: false,
            multiExportPdfLoader: false,
            multiExportWordLoader: false,
            showHardDeleteConfirmationModal: false,
            dashboardFilterParams: this.props.recommendationsReducer.entityParams[section]?.dashboardFilterParams,
            parentSectionId: this.props.recommendationsReducer.entityParams[section]?.parentSectionId || this.props.match.params.id,
            tableDataExportFilters: this.props.recommendationsReducer?.entityParams[section]?.tableDataExportFilters || {},
            isInputMode: {
                rowIndex: "",
                keyItem: ""
            },
            lineEditingEnabled: false
        };
        this.exportTableXl = this.exportTableXl.bind(this);
    }

    componentDidMount = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        localStorage.removeItem("recommendationIds");
        localStorage.removeItem("selectAll");
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name === "Dashboard" ? true : false;
            isDashboardFiltered && this.modifyDashboardFilterParams();
        }
        this.setState({
            isDashboardFiltered
        });
        if (this.props.match.params.tab === "recommendation") {
            this.setState(
                {
                    selectedDropdownInitiaive: "assigned",
                    selectedDropdown: "all",
                    params: {
                        ...this.state.params,
                        view: "assigned",
                        active: null,
                        deleted: null,
                        unlocked: null,
                        locked: null,
                        on_hold: null,
                        completed: null
                    }
                },
                async () => {
                    await this.refreshRecommendationsList(true);
                }
            );
        } else if (this.props.match.params.section === "initiativeInfo") {
            this.setState(
                {
                    selectedDropdown: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.selectedDropdown || "active",
                    selectedDropdownInitiaive:
                        this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.selectedDropdownInitiaive || "all",
                    params: {
                        ...this.state.params,
                        view: null
                    }
                },
                async () => {
                    await this.updateEntityParams();
                    await this.refreshRecommendationsList();
                }
            );
        }
        // -----------------------------------
        else if (this.props.match.params.tab === "recommendations") {
            if (this.state.parentSectionId !== this.props.match.params.id) {
                await this.resetEntityParams();
            }
            this.setState(
                {
                    selectedDropdown: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.selectedDropdown || "active",
                    params: {
                        ...this.state.params,
                        view: null
                    },
                    parentSectionId: this.props.match.params.id
                },
                async () => {
                    await this.updateEntityParams();
                    await this.refreshRecommendationsList();
                }
            );
        } else if (this.props.match.path === "/recommendations/:section/:id/:tab" || this.props.match.path === "/recommendations/:section/:id") {
            this.setState({ isLoading: false });
        } else {
            await this.refreshRecommendationsList();
        }
        const projectId = this.props.projectIdDashboard || query.pid || this.props.match.params.id || "";

        if (projectId) {
            await this.props.getPriorityElementDropDownData(projectId);
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (
            (this.props.location.search !== prevProps.location.search || this.props.match.params.id !== prevProps.match.params.id) &&
            this.props.match.path !== "/recommendations/:section/:id/:tab" &&
            this.props.match.path !== "/recommendations/:section/:id"
        ) {
            await this.refreshRecommendationsList();
        }
        if (prevProps.submitAssign != this.props.submitAssign) {
            if (this.props.submitAssign) {
                await this.refreshRecommendationsList();
            }
        }
        if (this.props.isBudgetPriority && prevProps.getDashboardValue !== this.props.getDashboardValue) {
            await this.refreshRecommendationsList();
        }
    };

    handleScrollPosition = () => {
        const scrollPosition = this.props.recommendationsReducer.scrollPosition;
        if (scrollPosition && this.tableRef?.current) {
            this.tableRef.current.scrollTo(0, parseInt(scrollPosition));
            this.props.setRecommendationScrollPosition(0);
        }
    };

    refreshRecommendationsList = async (isRecom, noLoading = false) => {
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        }
        !noLoading && (await this.setState({ isLoading: true }));
        const { params, paginationParams, dashboardFilterParams } = this.state;
        let recommendationsList = [];
        let totalCount = 0;
        let crv_total = "";
        let project_total = "";
        let year_totals = {};
        const {
            match: {
                params: { section }
            }
        } = this.props;
        // Getting All Recommendations by Id

        if (this.props.isChartView) {
            await this.props.getMiscSettings(this.props.projectIdDashboard);
            if (this.props.dataView == "building") {
                let chartParams = {
                    buildingId: this.props.buildingIdDashboard,
                    projectId: this.props.projectIdDashboard,
                    building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null
                };
                await this.props.getChartsBuilding(chartParams, params);
                this.props.handleFilterValues(params);
                recommendationsList = this.props.buildingReducer.graphDetails.recommendations;
                totalCount = this.props.buildingReducer.graphDetails.count;
                crv_total = this.props.buildingReducer.graphDetails.crv_total;
                year_totals = this.props.buildingReducer.graphDetails.year_totals;
                project_total = this.props.buildingReducer.graphDetails.project_total;
            } else if (this.props.dataView == "region") {
                let chartParams = {
                    regionId: this.props.regionId
                };
                let tempParams = {
                    ...params,
                    project_id: this.props.projectIdDashboard
                };
                await this.props.getChartsByRegion(chartParams, tempParams);
                this.props.handleFilterValues(params);
                recommendationsList = this.props.regionReducer.graphDetails.recommendations;
                totalCount = this.props.regionReducer.graphDetails.count;
                crv_total = this.props.regionReducer.graphDetails.crv_total;
                year_totals = this.props.regionReducer.graphDetails.year_totals;
                project_total = this.props.regionReducer.graphDetails.project_total;
            } else if (this.props.dataView == "project") {
                let chartParams = {
                    projectId: this.props.projectIdChart
                };
                let tempParams = {
                    ...params,
                    project_id: this.props.projectIdDashboard,
                    building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                    capital_type: (isDashboardFiltered ? this.state.capital_type : null) || null,
                    start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                    end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
                    infrastructure_requests: (isDashboardFiltered ? this.state.infrastructure_requests : null) || null,
                    dashboard: (isDashboardFiltered ? this.state.dashboard : null) || null,
                    year: (isDashboardFiltered ? this.state.year : null) || null
                };

                await this.props.getChartByProject(chartParams, tempParams);
                this.props.handleFilterValues(params);
                recommendationsList = this.props.projectReducer.graphDetails.recommendations;
                totalCount = this.props.projectReducer.graphDetails.count;
                crv_total = this.props.projectReducer.graphDetails.crv_total;
                year_totals = this.props.projectReducer.graphDetails.year_totals;
                project_total = this.props.projectReducer.graphDetails.project_total;
            } else {
                let chartParams = {
                    siteId: this.props.siteId,
                    projectId: this.props.projectIdDashboard
                };
                await this.props.getChartData(chartParams, params);

                this.props.handleFilterValues(params);
                recommendationsList = this.props.siteReducer.graphDetails.recommendations;
                totalCount = this.props.siteReducer.graphDetails.count;
                crv_total = this.props.siteReducer.graphDetails.crv_total;
                year_totals = this.props.siteReducer.graphDetails.year_totals;
                project_total = this.props.siteReducer.graphDetails.project_total;
            }
        } else if (section === "regioninfo") {
            const {
                limit,
                offset,
                search,
                filters,
                list,
                order,
                year,
                maintenance_year,
                index,
                deleted,
                active,
                locked,
                unlocked,
                on_hold,
                completed,
                image_or_not,
                surveyor,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                recommendation_ids
            } = this.state.params;
            let regionParam = {
                region_id: this.props.match.params.id,
                project_id: this.props.projectIdDashboard,
                limit,
                offset,
                search,
                filters,
                list,
                order,
                index,
                deleted,
                active,
                locked,
                unlocked,
                maintenance_year,
                building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                capital_type: (isDashboardFiltered ? this.state.capital_type : null) || null,
                start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
                infrastructure_requests: (isDashboardFiltered ? this.state.infrastructure_requests : null) || null,
                dashboard: (isDashboardFiltered ? this.state.dashboard : null) || null,
                year: (isDashboardFiltered ? this.state.year : null) || null,
                on_hold,
                completed,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor,
                recommendation_ids
            };
            await this.props.getAllRecommendationsRegion(regionParam);
            recommendationsList = this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations;
            totalCount = this.props.recommendationsReducer.getAllRecommendationsResponse.count;
            crv_total = this.props.recommendationsReducer.getAllRecommendationsResponse.crv_total;
            year_totals = this.props.recommendationsReducer.getAllRecommendationsResponse.year_totals;
            project_total = this.props.recommendationsReducer.getAllRecommendationsResponse.project_total;
        } else if (section === "buildinginfo") {
            const {
                limit,
                on_hold,
                completed,
                offset,
                search,
                view,
                filters,
                list,
                order,
                year,
                index,
                deleted,
                active,
                locked,
                unlocked,
                maintenance_year,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor,
                recommendation_ids
            } = this.state.params;
            let buildingParam = {
                building_id: this.props.match.params.id || null,
                project_id: this.props.projectIdDashboard,
                limit,
                offset,
                search,
                filters,
                list,
                order,
                index,
                deleted,
                active,
                locked,
                unlocked,
                view,
                maintenance_year,
                building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                capital_type: (isDashboardFiltered ? this.state.capital_type : null) || null,
                start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
                infrastructure_requests: (isDashboardFiltered ? this.state.infrastructure_requests : null) || null,
                dashboard: (isDashboardFiltered ? this.state.dashboard : null) || null,
                year: (isDashboardFiltered ? this.state.year : null) || null,
                on_hold,
                completed,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor,
                recommendation_ids
            };
            await this.props.getAllRecommendationsRegion(buildingParam);
            recommendationsList = this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations;
            totalCount = this.props.recommendationsReducer.getAllRecommendationsResponse.count;
            crv_total = this.props.recommendationsReducer.getAllRecommendationsResponse.crv_total;
            year_totals = this.props.recommendationsReducer.getAllRecommendationsResponse.year_totals;
            project_total = this.props.recommendationsReducer.getAllRecommendationsResponse.project_total;
        } else if (section === "siteinfo") {
            const {
                limit,
                on_hold,
                completed,
                offset,
                search,
                filters,
                list,
                order,
                year,
                index,
                deleted,
                active,
                locked,
                unlocked,
                maintenance_year,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor,
                recommendation_ids
            } = this.state.params;
            let siteParam = {
                site_id: this.props.match.params.id,
                project_id: this.props.projectIdDashboard,
                limit,
                offset,
                search,
                filters,
                list,
                order,
                index,
                deleted,
                active,
                locked,
                unlocked,
                maintenance_year,
                building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                capital_type: (isDashboardFiltered ? this.state.capital_type : null) || null,
                start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
                infrastructure_requests: (isDashboardFiltered ? this.state.infrastructure_requests : null) || null,
                dashboard: (isDashboardFiltered ? this.state.dashboard : null) || null,
                year: (isDashboardFiltered ? this.state.year : null) || null,
                on_hold,
                completed,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor,
                recommendation_ids
            };
            await this.props.getAllRecommendationsRegion(siteParam);
            recommendationsList = this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations;
            totalCount = this.props.recommendationsReducer.getAllRecommendationsResponse.count;
            crv_total = this.props.recommendationsReducer.getAllRecommendationsResponse.crv_total;
            year_totals = this.props.recommendationsReducer.getAllRecommendationsResponse.year_totals;
            project_total = this.props.recommendationsReducer.getAllRecommendationsResponse.project_total;
        } else if (section === "initiativeInfo") {
            const {
                limit,
                on_hold,
                completed,
                offset,
                search,
                filters,
                view,
                maintenance_year,
                list,
                order,
                year,
                index,
                deleted,
                active,
                locked,
                unlocked,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor
            } = this.state.params;
            let query = qs.parse(this.props.location.search);
            let siteParam = {
                initiative_id: this.props.match.params.id,
                project_id: view != "assigned" ? query.pid : null,
                limit,
                offset,
                search,
                filters,
                list,
                order,
                index,
                deleted,
                view,
                maintenance_year,
                initiative_ids:
                    view == "assigned" && this.props.match.params.tab == "recommendations"
                        ? this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.initiative_ids
                        : [],
                active,
                locked,
                unlocked,
                building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                capital_type: (isDashboardFiltered ? this.state.capital_type : null) || null,
                start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
                infrastructure_requests: (isDashboardFiltered ? this.state.infrastructure_requests : null) || null,
                dashboard: (isDashboardFiltered ? this.state.dashboard : null) || null,
                year: (isDashboardFiltered ? this.state.year : null) || null,
                on_hold,
                completed,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor
            };
            await this.props.getAllRecommendationsRegion(siteParam);
            recommendationsList = this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations;
            totalCount = this.props.recommendationsReducer.getAllRecommendationsResponse.count;
            crv_total = this.props.recommendationsReducer.getAllRecommendationsResponse.crv_total;
            year_totals = this.props.recommendationsReducer.getAllRecommendationsResponse.year_totals;
            project_total = this.props.recommendationsReducer.getAllRecommendationsResponse.project_total;
        } else if (section === "imageInfo") {
            const {
                limit,
                on_hold,
                completed,
                offset,
                search,
                view,
                filters,
                list,
                order,
                year,
                index,
                deleted,
                active,
                locked,
                unlocked,
                maintenance_year,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor
            } = this.state.params;
            let imageRecomParams = {
                image_id: this.props.match.params.id,
                limit,
                offset,
                search,
                filters,
                list,
                order,
                index,
                deleted,
                active,
                locked,
                unlocked,
                view,
                maintenance_year,
                on_hold,
                completed,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor
            };
            await this.props.getAllRecommendationsRegion(imageRecomParams);
            recommendationsList = this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations;
            totalCount = this.props.recommendationsReducer.getAllRecommendationsResponse.count;
            crv_total = this.props.recommendationsReducer.getAllRecommendationsResponse.crv_total;
            year_totals = this.props.recommendationsReducer.getAllRecommendationsResponse.year_totals;
            project_total = this.props.recommendationsReducer.getAllRecommendationsResponse.project_total;
        } else if (section === "assetInfo") {
            const {
                limit,
                on_hold,
                completed,
                offset,
                search,
                view,
                filters,
                list,
                order,
                year,
                index,
                deleted,
                active,
                locked,
                unlocked,
                maintenance_year,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor
            } = this.state.params;
            let imageRecomParams = {
                asset_id: this.props.match.params.id,
                limit,
                offset,
                search,
                filters,
                list,
                order,
                index,
                deleted,
                active,
                locked,
                unlocked,
                view,
                maintenance_year,
                on_hold,
                completed,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor
            };
            await this.props.getAllRecommendationsRegion(imageRecomParams);
            recommendationsList = this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations;
            totalCount = this.props.recommendationsReducer.getAllRecommendationsResponse.count;
            crv_total = this.props.recommendationsReducer.getAllRecommendationsResponse.crv_total;
            year_totals = this.props.recommendationsReducer.getAllRecommendationsResponse.year_totals;
            project_total = this.props.recommendationsReducer.getAllRecommendationsResponse.project_total;
        } else if (this.props.isBudgetPriority) {
            const {
                limit,
                on_hold,
                completed,
                offset,
                search,
                view,
                filters,
                list,
                order,
                year,
                index,
                deleted,
                active,
                locked,
                unlocked,
                maintenance_year,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor
            } = this.state.params;
            let recomParams = {
                limit,
                offset,
                search,
                filters,
                list,
                order,
                index,
                deleted,
                active,
                locked,
                unlocked,
                view,
                maintenance_year,
                on_hold,
                completed,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                surveyor,
                ...this.props.dashboardFilterParams
            };
            await this.props.getAllBudgetPriorityRecommendations(recomParams);
            recommendationsList = this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations;
            totalCount = this.props.recommendationsReducer.getAllRecommendationsResponse.count;
            crv_total = this.props.recommendationsReducer.getAllRecommendationsResponse.crv_total;
            year_totals = this.props.recommendationsReducer.getAllRecommendationsResponse.year_totals;
            project_total = this.props.recommendationsReducer.getAllRecommendationsResponse.project_total;
        } else {
            await this.props.getAllRecommendations(
                {
                    ...params,
                    year: (isDashboardFiltered ? this.state.year : null) || null,
                    capital_type: (isDashboardFiltered ? this.state.capital_type : null) || null,
                    start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                    end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
                    infrastructure_requests: (isDashboardFiltered ? this.state.infrastructure_requests : null) || null,
                    dashboard: (isDashboardFiltered ? this.state.dashboard : null) || null,
                    building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                    ...(isDashboardFiltered && { ...dashboardFilterParams })
                },
                this.props.match.params.id
            );
            recommendationsList = this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations;
            totalCount = this.props.recommendationsReducer.getAllRecommendationsResponse.count;
            crv_total = this.props.recommendationsReducer.getAllRecommendationsResponse.crv_total;
            year_totals = this.props.recommendationsReducer.getAllRecommendationsResponse.year_totals;
            project_total = this.props.recommendationsReducer.getAllRecommendationsResponse.project_total;
        }
        let tempRecommendationsList = recommendationsList;
        // For creating dynamic keys and config data for recommendation table data
        if (recommendationsList && recommendationsList.length) {
            // setting priority elements
            if (this.props.recommendationsReducer.priorityElementsDropDownResponse?.priority_elements?.length) {
                let tempKeys = this.state.tableData.keys;
                let tempConfig = this.state.tableData.config;
                this.props.recommendationsReducer.priorityElementsDropDownResponse.priority_elements.map((item, i) => {
                    tempKeys.splice(19 + i + 1, 0, `priority_element${i + 1}`);
                    tempConfig[`priority_element${i + 1}`] = {
                        isVisible:
                            this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.tableConfig &&
                            this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.tableConfig[
                                `priority_element${i + 1}`
                            ] &&
                            this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.tableConfig[`priority_element${i + 1}`]
                                .isVisible == false
                                ? this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.tableConfig[
                                      `priority_element${i + 1}`
                                  ].isVisible
                                : true,
                        // !item.recommendation_required
                        // ? false
                        // : true,
                        label: item.display_name ? item.display_name : `Priority Element ${i + 1}`,
                        class: "width-230px",
                        searchKey: `priority_elements.${i + 1}`,
                        type: "number",
                        hasWildCardSearch: true,
                        hasCommonSearch: false,
                        getListTable: "priority_element",
                        commonSearchKey: "priority_elements",
                        commonSearchObjectKey: `${i + 1}`
                    };
                });
                tempKeys = _.uniq(tempKeys);
                await this.setState({
                    tableData: {
                        ...this.state.tableData,
                        keys: tempKeys,
                        config: tempConfig
                    }
                });
            }
            recommendationsList.map((item, i) => {
                if (item.priority_elements && item.priority_elements.length) {
                    item.priority_elements.map(yearItem => {
                        tempRecommendationsList[i][`priority_element${yearItem.index}`] = yearItem.option_id || yearItem.element || null;
                    });
                }
            });

            //settings energy band
            if (this.props.projectReducer?.getProjectByIdResponse?.show_energy_band) {
                let tempKeys = this.state.tableData.keys;
                let tempConfig = this.state.tableData.config;
                let indexBeforeDate = tempKeys.findIndex(item => item === "created_at");
                tempKeys.splice(indexBeforeDate, 0, "energy_band_show");
                energy_fields.map((item, i) => {
                    let indexToInsertBefore = tempKeys.findIndex(item => item === "created_at");
                    tempKeys.splice(indexToInsertBefore, 0, `energy_band_${i}`);
                    tempConfig[`energy_band_${i}`] = {
                        isVisible: true,
                        label: item.label,
                        class: "width-230px",
                        searchKey: `energy_bands.${item.key}`,
                        type: item.type,
                        hasWildCardSearch: true,
                        hasCommonSearch: false,
                        getListTable: "",
                        commonSearchKey: "energy_band",
                        commonSearchObjectKey: item.key
                    };
                });
                tempKeys = _.uniq(tempKeys);
                await this.setState({
                    tableData: {
                        ...this.state.tableData,
                        keys: tempKeys,
                        config: tempConfig
                    }
                });
            }
            //setting water band
            if (this.props.projectReducer?.getProjectByIdResponse?.show_water_band) {
                let tempKeys = this.state.tableData.keys;
                let tempConfig = this.state.tableData.config;
                let indexBeforeDate = tempKeys.findIndex(item => item === "created_at");
                tempKeys.splice(indexBeforeDate, 0, "water_band_show");
                water_fields.map((item, i) => {
                    let indexToInsertBefore = tempKeys.findIndex(item => item === "created_at");
                    tempKeys.splice(indexToInsertBefore, 0, `water_band_${i}`);

                    tempConfig[`water_band_${i}`] = {
                        isVisible: true,
                        label: item?.tableLabel ? item.tableLabel : item.label,
                        class: "width-230px",
                        searchKey: `water_bands.${item.key}`,
                        type: item.type,
                        hasWildCardSearch: true,
                        hasCommonSearch: false,
                        getListTable: "",
                        commonSearchKey: "water_band",
                        commonSearchObjectKey: item.key
                    };
                });
                tempKeys = _.uniq(tempKeys);
                await this.setState({
                    tableData: {
                        ...this.state.tableData,
                        keys: tempKeys,
                        config: tempConfig
                    }
                });
            }

            // setting maintenance years
            if (year_totals && Object.keys(year_totals)?.length) {
                let tempKeys = this.state.tableData.keys;
                let tempConfig = this.state.tableData.config;
                // recommendationsList[0].maintenance_years.sort((a, b) => (a.year > b.year ? 1 : -1));
                Object.keys(year_totals).map(item => {
                    // tempKeys.push(`year_${item}`);
                    let indexToInsertBefore = tempKeys.findIndex(item => item === "created_at");
                    tempKeys.splice(indexToInsertBefore, 0, `year_${item}`);
                    tempConfig[`year_${item}`] = {
                        isVisible:
                            this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.tableConfig &&
                            this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.tableConfig[`year_${item}`] &&
                            this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.tableConfig[`year_${item}`].isVisible ==
                                false
                                ? this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.tableConfig[`year_${item}`]
                                      .isVisible
                                : true,
                        label: item,
                        class: " width-140px txt-box-table",
                        searchKey: `maintenance_years.${item}`,
                        type: "number",
                        hasInputToggle: this.state.lineEditingEnabled,
                        hasWildCardSearch: true,
                        hasCommonSearch: false,
                        hasCutPaste: true,
                        getListTable: "maintenance_year",
                        commonSearchKey: "maintenance_years",
                        commonSearchObjectKey: `${item}`
                    };
                });
                tempKeys = _.uniq(tempKeys);
                this.setState({
                    tableData: {
                        ...this.state.tableData,
                        keys: tempKeys,
                        config: tempConfig
                    },
                    maintenance_years: year_totals ? Object.keys(year_totals) : []
                });
            }
            recommendationsList.map((item, i) => {
                if (item.maintenance_years && item.maintenance_years.length) {
                    item.maintenance_years.map(yearItem => {
                        tempRecommendationsList[i][`year_${yearItem.year}`] = parseInt(yearItem.amount || 0);
                    });
                }
            });
        }

        // go to previous page is the last record of the current page is deleted
        if (recommendationsList && !recommendationsList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params
                    // offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getAllRecommendations({
                ...this.state.params,
                year: this.state.year || null,
                capital_type: (isDashboardFiltered ? this.state.capital_type : null) || null,
                start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
                infrastructure_requests: (isDashboardFiltered ? this.state.infrastructure_requests : null) || null,
                dashboard: (isDashboardFiltered ? this.state.dashboard : null) || null,
                building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null
            });
        }
        if (
            recommendationsList &&
            !recommendationsList.length &&
            this.props.recommendationsReducer.getAllRecommendationsResponse &&
            this.props.recommendationsReducer.getAllRecommendationsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationsReducer.getAllRecommendationsResponse.error });
            this.showAlert();
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.recommendations
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.recommendations || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.recommendation_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.recommendation_logs || {}
                : {};
        this.setState({
            tableData: {
                ...this.state.tableData,
                data: tempRecommendationsList,
                config: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.tableConfig || this.state.tableData.config
            },
            tempRecommendationsList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            summaryRowData: {
                ...this.state.summaryRowData,
                crv_total: crv_total,
                year_totals: year_totals,
                project_total: project_total
            },
            showWildCardFilter: this.state.params.filters ? true : false,
            permissions: project_permission,
            logPermission: region_logs,
            isLoading: false,
            initialTableConfig: _.cloneDeep(this.state.tableData.config)
        });
        // this.handleScrollPosition();
        if (!isRecom) this.updateEntityParams();
        return true;
    };

    updateWildCardFilter = async newFilter => {
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                filters: newFilter,
                recommendation_ids: null
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    updateEntityParams = async (value = {}) => {
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        }
        let entityParams = {
            entity: "Recommendation",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            selectedDropdown: this.state.selectedDropdown,
            selectedDropdownInitiaive: this.state.selectedDropdownInitiaive,
            building_ids: isDashboardFiltered ? this.state.building_ids : null,
            dashboard: isDashboardFiltered ? this.state.dashboard : null,
            capital_type: isDashboardFiltered ? this.state.capital_type : null,
            start_year: this.state.start_year || null,
            end_year: this.state.end_year || null,
            infrastructure_requests: this.state.infrastructure_requests || null,
            year: isDashboardFiltered ? this.state.year : null,
            isDashboardFiltered,
            initiative_ids: this.state.initiative_ids,
            recommendationList: this.state.tempRecommendationsList,
            initialTableConfig: this.state.initialTableConfig,
            selectedRecomIds: this.state.selectedRecomIds,
            dashboardFilterParams: this.state.dashboardFilterParams,
            parentSectionId: this.state.parentSectionId,
            tableDataExportFilters: this.state.tableDataExportFilters
        };
        await this.props.updateRecommendationEntityParams(entityParams, this.props.match.params.section);
    };

    getListForCommonFilter = async params => {
        if (this.props.isBudgetPriority) {
            await this.getListForBudgetPriorityFilter(params);
        } else {
            const {
                match: {
                    params: { section }
                }
            } = this.props;

            const {
                search,
                filters,
                list,
                view,
                deleted,
                on_hold,
                completed,
                locked,
                unlocked,
                active,
                surveyor,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                recommendation_ids
            } = this.state.params;
            const projectId = this.props.projectIdDashboard || this.props.match.params.id;
            if (section == "initiativeInfo" && view != "assigned") {
                const {
                    location: { search }
                } = this.props;
                const query = qs.parse(search);
                params.project_id = query.pid;
            } else if (section !== "imageInfo" && section != "initiativeInfo" && section !== "assetInfo") {
                params.project_id = projectId;
            }
            if (section == "initiativeInfo" && view == "assigned") {
                params.initiative_id = this.props.match.params.id || null;
            }
            let isDashboardFiltered = false;
            let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
            if (breadcrumbdata && breadcrumbdata[0]) {
                isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
            }
            if (isDashboardFiltered) {
                params.dashboard = this.state.dashboard;
                params.capital_type = this.state.capital_type;
                params.building_ids = this.state.building_ids;
                params.year = this.state.year;
            }

            params.search = search;
            params.filters = filters;
            params.list = list
                ? Object.fromEntries(
                      Object.entries(list)?.filter(([key, value]) => !params?.field?.map(elem => elem.replace("recommendations.", ""))?.includes(key))
                  )
                : null;
            params.view = view;
            params.deleted = deleted;
            params.on_hold = on_hold;
            params.completed = completed;
            params.locked = locked;
            params.unlocked = unlocked;
            params.active = active;
            params.surveyor = surveyor;
            params.image_or_not = image_or_not;
            params.water = water;
            params.energy = energy;
            params.facility_master_plan = facility_master_plan;
            params.recommendation_type = recommendation_type;
            params.budget_priority = budget_priority;
            params.infrastructure_request = infrastructure_request;
            params.start_year = this.state.start_year;
            params.end_year = this.state.end_year;
            params.infrastructure_requests = this.state.infrastructure_requests;
            params.recommendation_ids = recommendation_ids;
            if (section === "buildinginfo") {
                params.building_id = this.props.match.params.id;
            } else if (section === "siteinfo") {
                params.site_id = this.props.match.params.id;
            } else if (section === "regioninfo") {
                params.region_id = this.props.match.params.id;
            } else if (section === "imageInfo") {
                params.image_id = this.props.match.params.id;
            } else if (section === "assetInfo") {
                params.asset_id = this.props.match.params.id;
            }
            await this.props.getListForCommonFilterrecommendation({ ...params, ...(isDashboardFiltered && { ...this.state.dashboardFilterParams }) });
        }
        return (
            (this.props.recommendationsReducer.getListForCommonFilterResponse &&
                this.props.recommendationsReducer.getListForCommonFilterResponse.list) ||
            []
        );
    };

    getListForBudgetPriorityFilter = async params => {
        const {
            search,
            filters,
            list,
            view,
            deleted,
            on_hold,
            completed,
            locked,
            unlocked,
            active,
            surveyor,
            image_or_not,
            infrastructure_request,
            water,
            energy,
            facility_master_plan,
            recommendation_type,
            budget_priority
        } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field)) : null;
        params.view = view;
        params.deleted = deleted;
        params.on_hold = on_hold;
        params.completed = completed;
        params.locked = locked;
        params.unlocked = unlocked;
        params.active = active;
        params.surveyor = surveyor;
        params.image_or_not = image_or_not;
        params.infrastructure_request = infrastructure_request;
        params.water = water;
        params.energy = energy;
        params.facility_master_plan = facility_master_plan;
        params.recommendation_type = recommendation_type;
        params.budget_priority = budget_priority;
        await this.props.getListForBudgetPriorityFilter({ ...params, ...this.props.dashboardFilterParams });
    };

    resetAllFilters = async () => {
        await this.setState({
            selectedRegion: null,
            paginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 40,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,
                list: null,
                deleted: null,
                view: this.props.match.params.tab == "recommendation" ? "assigned" : null,
                locked: null,
                unlocked: null,
                active: this.props.match.params.section == "initiativeInfo" ? null : true,
                on_hold: null,
                completed: null,
                image_or_not: null,
                infrastructure_request: null,
                water: null,
                energy: null,
                facility_master_plan: null,
                recommendation_type: null,
                budget_priority: null,
                recommendation_ids: null,
                surveyor: null
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null,
            selectedDropdown:
                this.props.match.params.section == "initiativeInfo" ? (this.props.match.params.tab == "recommendation" ? "assigned" : "") : "active",
            selectedDropdownInitiaive: "active",
            tableDataExportFilters: {}
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null,
                index: [],
                year: [],
                maintenance_year: [],
                recommendation_ids: null
            },
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    updateCommonFilter = async (commonFilters, exportFilters) => {
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                list: commonFilters,
                recommendation_ids: null
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            tableDataExportFilters: exportFilters,
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    updateTableSortFilters = async (searchKey, val) => {
        let tempYear = [];
        let tempIndex = [];
        let main_key = searchKey.split(".")[0];
        if (main_key === "maintenance_years") {
            if (!tempYear.includes(val)) {
                tempYear.push(val);
            }
            if (this.state.params.order) {
                await this.setState({
                    params: {
                        ...this.state.params,
                        order: {
                            ...this.state.params.order,
                            ["maintenance_years.amount"]: this.state.params.order["maintenance_years.amount"] === "desc" ? "asc" : "desc"
                        },
                        maintenance_year: tempYear
                    }
                });
            } else {
                await this.setState({
                    params: {
                        ...this.state.params,
                        order: { ["maintenance_years.amount"]: "asc" },
                        maintenance_year: tempYear
                    }
                });
            }
        } else if (main_key === "priority_elements") {
            //changes of priority elements
            if (!tempIndex.includes(searchKey.split(".")[1])) {
                tempIndex.push(searchKey.split(".")[1]);
            }
            if (this.state.params.order) {
                await this.setState({
                    params: {
                        ...this.state.params,
                        order: {
                            ...this.state.params.order,
                            ["options.name"]: this.state.params.order["options.name"] === "desc" ? "asc" : "desc"
                        },
                        index: tempIndex
                    }
                });
            } else {
                await this.setState({
                    params: {
                        ...this.state.params,
                        order: { ["options.name"]: "asc" },
                        index: tempIndex
                    }
                });
            }
        } else {
            if (this.state.params.order) {
                if (searchKey === "recommendations.usefull_life_remaining") {
                    await this.setState({
                        params: {
                            ...this.state.params,
                            order: {
                                ...this.state.params.order,
                                [searchKey]: this.state.params.order[searchKey] === "desc" ? "asc" : "desc",
                                "assets.usefull_life_remaining": this.state.params.order[searchKey] === "desc" ? "asc" : "desc"
                            }
                        }
                    });
                } else {
                    await this.setState({
                        params: {
                            ...this.state.params,
                            order: {
                                ...this.state.params.order,
                                [searchKey]: this.state.params.order[searchKey] === "desc" ? "asc" : "desc"
                            }
                        }
                    });
                }
            } else {
                if (searchKey === "recommendations.usefull_life_remaining") {
                    await this.setState({
                        params: {
                            ...this.state.params,
                            order: { [searchKey]: "asc", "assets.usefull_life_remaining": "asc" }
                        }
                    });
                } else {
                    await this.setState({
                        params: {
                            ...this.state.params,
                            order: { [searchKey]: "asc" }
                        }
                    });
                }
            }
        }
        await this.setState({ params: { ...this.state.params, recommendation_ids: null }, selectedRecomIds: [] });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    updateLastSortFilter = async (searchKey, val) => {
        if (this.state.params.order && this.state.params?.order[searchKey]) {
            await this.setState({
                params: {
                    ...this.state.params,
                    order: {
                        [searchKey]: this.state.params.order[searchKey] === "asc" ? "desc" : "asc"
                    }
                }
            });
        } else {
            await this.setState({
                params: {
                    ...this.state.params,
                    order: { [searchKey]: "desc" }
                }
            });
        }
        await this.setState({ params: { ...this.state.params, recommendation_ids: null }, selectedRecomIds: [] });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    handleHideColumn = async keyItem => {
        if (keyItem !== "selectAll" && keyItem !== "deselectAll") {
            await this.setState({
                tableData: {
                    ...this.state.tableData,
                    config: {
                        ...this.state.tableData.config,
                        [keyItem]: {
                            ...this.state.tableData.config[keyItem],
                            isVisible: !this.state.tableData.config[keyItem].isVisible
                        }
                    }
                }
            });
        } else {
            let tempConfig = this.state.tableData.config;
            this.state.tableData.keys.map(item => {
                if (keyItem === "selectAll") {
                    tempConfig[item].isVisible = true;
                } else {
                    tempConfig[item].isVisible = false;
                }
            });
            await this.setState({
                tableData: {
                    ...this.state.tableData,
                    config: tempConfig
                }
            });
        }
        await this.updateEntityParams();
        return true;
    };

    updateSelectedRow = async rowId => {
        await this.setState({
            selectedRowId: rowId
        });
        await this.updateEntityParams();
    };

    handlePerPageChange = async e => {
        const { paginationParams } = this.state;
        await this.setState({
            paginationParams: {
                ...paginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            params: {
                ...this.state.params,
                offset: 0,
                limit: e.target.value
            }
        });
        await this.refreshRecommendationsList();
    };

    handlePageClick = async page => {
        const { paginationParams, params } = this.state;
        await this.setState({
            paginationParams: {
                ...paginationParams,
                currentPage: page.selected
            },
            params: {
                ...params,
                // offset: page.selected * paginationParams.perPage
                offset: page.selected + 1
            }
        });
        await this.refreshRecommendationsList();
    };

    updateCurrentActions = async key => {
        const { currentActions } = this.state;
        await this.setState({
            currentActions: currentActions === key ? null : key
        });
        return true;
    };

    updateCurrentViewAllUsers = async key => {
        const { currentViewAllUsers } = this.state;
        await this.setState({
            currentViewAllUsers: currentViewAllUsers === key ? null : key
        });
        return true;
    };

    showEditPage = recommendationsId => {
        if (this.tableRef?.current?.scrollTop) {
            this.props.setRecommendationScrollPosition(this.tableRef.current.scrollTop);
        }
        const { history } = this.props;
        this.setState({
            selectedRecommendations: recommendationsId
        });
        let projectid_budget =
            this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations &&
            this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations
                .filter(item => item.id === recommendationsId)
                .map(item => item.project_id);
        let clientid_budget =
            this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations &&
            this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations
                .filter(item => item.id === recommendationsId)
                .map(item => item.client?.id);
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Recommendations",
            path:
                this.props.match.params.section === "initiativeInfo"
                    ? `/recommendations/edit/${recommendationsId}`
                    : `/recommendations/edit/${recommendationsId}?p_id=${
                          this.props.projectIdDashboard ? this.props.projectIdDashboard : this.props.match.params.id
                      }&c_id=${this.props.basicDetails && this.props.basicDetails.client ? this.props.basicDetails.client.id : ""}`
        });
        if (this.props.match.params.section === "initiativeInfo") {
            history.push(`/recommendations/edit/${recommendationsId}`);
        } else if (projectid_budget && clientid_budget && this.props.isBudgetPriority) {
            history.push(
                `/recommendations/edit/${recommendationsId}?p_id=${projectid_budget[0] ? projectid_budget[0] : this.props.match.params.id}&c_id=${
                    clientid_budget[0] ? clientid_budget[0] : ""
                }`
            );
        } else {
            history.push(
                `/recommendations/edit/${recommendationsId}?p_id=${
                    this.props.projectIdDashboard ? this.props.projectIdDashboard : this.props.match.params.id
                }&c_id=${this.props.basicDetails && this.props.basicDetails.client ? this.props.basicDetails.client.id : ""}`
            );
        }
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedRecommendations: null
        });
        let type = "Regular";

        addToBreadCrumpData({
            key: "add",
            name: "Add Recommendations",
            path: `/recommendations/add?p_id=${this.props.projectIdDashboard ? this.props.projectIdDashboard : this.props.match.params.id}&c_id=${
                this.props.basicDetails.client.id
            }&type=${type}`
        });
        history.push(
            `/recommendations/add?p_id=${this.props.projectIdDashboard ? this.props.projectIdDashboard : this.props.match.params.id}&c_id=${
                this.props.basicDetails.client.id
            }&type=${type}`
        );
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    // showViewImport = () => {
    //     this.setState({
    //         showViewImport: true
    //     });
    // };

    showViewModalExport = () => {
        this.setState({
            showViewModalExport: true
        });
    };

    getSiteListBasedOnRegion = async (recommendationsId, params) => {
        await this.props.getSitesBasedOnRegion(recommendationsId, params);
        const {
            buildingReducer: {
                getSitesBasedOnRegionResponse: { sites: siteList }
            }
        } = this.props;
        return siteList;
    };

    getDepartmentByProject = async projectId => {
        const department = await this.props.getDepartmentByProject(projectId);
    };

    getSystemBasedOnProject = async projectId => {
        const system = await this.props.getSystemBasedOnProject(projectId);
        return system;
    };

    getFloorBasedOnBuilding = async buildingId => {
        const system = await this.props.getFloorBasedOnBuilding(buildingId);
        return system;
    };
    getSubSystemBasedOnProject = async (projectId, systemId) => {
        const system = await this.props.getSubSystemBasedOnProject(projectId, systemId);
    };
    getTradeBasedOnProject = async projectId => {
        const system = await this.props.getTradeBasedOnProject(projectId);
    };

    getCategoryBasedOnProject = async projectId => {
        const department = await this.props.getCategoryBasedOnProject(projectId);
        const {
            buildingReducer: {
                getSitesBasedOnRegionResponse: { sites: siteList }
            }
        } = this.props;
        return siteList;
    };

    getRegionListBasedOnClient = async clientId => {
        await this.props.getRegionsBasedOnClient(clientId);
        const {
            recommendationsReducer: {
                getRegionsBasedOnClientResponse: { regions: regionList }
            }
        } = this.props;
        return regionList;
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    handleAssignConsultancyUsersModal = async recommendationsData => {
        this.setState({
            showAssignConsultancyUsers: true
        });
    };

    handleAssignClientUsersModal = async recommendationsData => {
        this.setState({
            showAssignClientUsers: true
        });
    };

    handleAddRecommendations = async recommendation => {
        const { history } = this.props;
        await this.props.addRecommendation(recommendation);
        const { recommendation_code, recommendation_id, error, message } = this.props.recommendationsReducer.addRecommendationResponse || {};
        if (error) {
            await this.setState({
                alertMessage: error
            });
            this.showAlert();
        } else {
            await this.setState({
                alertMessage: message
            });
            this.showAlert();
            if (findPrevPathFromBreadCrumpData()?.split("/")[2] === "recommendationsinfo") {
                popBreadCrumpOnPageClose();
            }
            addToBreadCrumpData({
                key: "Name",
                name: recommendation_code,
                path: `/recommendations/recommendationsinfo/${recommendation_id}/maindetails`
            });
            addToBreadCrumpData({
                key: "info",
                name: "Main Details",
                path: `/recommendations/recommendationsinfo/${recommendation_id}/maindetails`
            });
            sessionStorage.removeItem("currentRecommendationData");
            this.showInfoPage(recommendation_id);
        }
    };

    handleUpdateRecommendations = async (recommendation, selectedImage) => {
        const { history } = this.props;
        const { selectedRecommendations } = this.state;
        await this.props.updateRecommendation(recommendation, selectedRecommendations, selectedImage);
        const { success, error, message } = this.props.recommendationsReducer.updateRecommendationResponse;
        if (!success || error) {
            await this.setState({
                alertMessage: message || "Failed to update Recommendation!"
            });
            this.showAlert();
        } else {
            this.setState({
                currentActions: null
            });
            await this.setState({
                alertMessage: this.props.recommendationsReducer.updateRecommendationResponse?.message
            });
            this.showAlert();
            this.props.history.push(findPrevPathFromBreadCrump() || "/recommendations");
            popBreadCrumpOnPageClose();
        }
    };

    handleDeleteRecommendations = async (id, isDeleted) => {
        if (!checkPermission("forms", "recommendations", "hard_delete") && isDeleted) {
            await this.setState({
                alertMessage: "You are not authorised to perform the Hard Delete !"
            });
            this.showAlert();
        } else {
            await this.setState({
                showConfirmModal: true,
                selectedRecommendations: id,
                isDeleted: isDeleted
            });
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, isDeleted } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Recommendation?"}
                        message={""}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={ishardDelete => {
                            ishardDelete
                                ? this.setState({ showHardDeleteConfirmationModal: true })
                                : this.deleteRecommendationOnConfirm(ishardDelete);
                        }}
                        onHardDelete={this.deleteRecommendationOnConfirm}
                        isHard={checkPermission("forms", "recommendations", "hard_delete")}
                        isDeleted={isDeleted}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };
    renderHardDeleteConfirmationModal = () => {
        const { showHardDeleteConfirmationModal } = this.state;
        if (!showHardDeleteConfirmationModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Are you sure you want to permanently (Hard) delete this Recommendation?"}
                        type="cancel"
                        onNo={() => this.setState({ showHardDeleteConfirmationModal: false })}
                        onYes={() => {
                            this.setState({ showHardDeleteConfirmationModal: false });
                            this.deleteRecommendationOnConfirm(true);
                        }}
                    />
                }
                onCancel={() => this.setState({ showHardDeleteConfirmationModal: false })}
            />
        );
    };

    deleteRecommendationOnConfirm = async (ishardDelete = false) => {
        const { selectedRecommendations, selectedRecomIds, params } = this.state;
        if (ishardDelete) {
            this.setState({
                showConfirmModal: false,
                isLoading: true
            });
            await this.props.deleteRecommendation(selectedRecommendations, true);
        } else {
            this.setState({
                showConfirmModal: false,
                isLoading: true
            });
            await this.props.deleteRecommendation(selectedRecommendations);
        }
        if (this.props.recommendationsReducer.deleteRecommendationResponse && this.props.recommendationsReducer.deleteRecommendationResponse.error) {
            await this.setState({
                alertMessage: this.props.recommendationsReducer.deleteRecommendationResponse.error,
                showConfirmModal: false,
                isRedirectionOnDelete: false,
                selectedRecommendations: null
            });
            this.showAlert();
        } else {
            await this.refreshRecommendationsList();
            // await this.props.getMenuItems();
            this.setState(
                {
                    alertMessage: this.props.recommendationsReducer.deleteRecommendationResponse?.message || "Recommendation deleted successfully",
                    showConfirmModal: false,
                    selectedRecommendations: null,
                    selectedRecomIds: selectedRecomIds.filter(elem => elem.id !== selectedRecommendations),
                    params: {
                        ...params,
                        recommendation_ids: params?.recomentation_ids?.length
                            ? params.recommendation_ids?.filter(elem => elem !== selectedRecommendations)
                            : null
                    }
                },
                () => this.showAlert()
            );
            if (this.state.isRedirectionOnDelete) {
                popBreadCrumpRecData();
                const redirectionurl = findPrevPathFromBreadCrumpRecData();
                this.props.history.push(findPrevPathFromBreadCrumpData() || "/recommendations");
                // this.props.history.push(redirectionurl[2].path || "/recommendations");
            }
            this.setState({
                isRedirectionOnDelete: false
            });
        }
        this.setState({
            isLoading: false
        });
    };

    handleGlobalSearch = async search => {
        const { params } = this.state;
        await this.setState({
            params: {
                ...params,
                offset: 0,
                search,
                recommendation_ids: null
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            selectedRecomIds: []
        });
        await this.refreshRecommendationsList();
    };

    showInfoPage = recommendationsId => {
        const { history } = this.props;
        if (this.tableRef?.current?.scrollTop) {
            this.props.setRecommendationScrollPosition(this.tableRef.current.scrollTop);
        }
        this.setState({
            selectedRecommendations: recommendationsId
        });
        let tabKeyList = ["maindetails", "additionaldetails", "infoimages", "assetdetails", "documents"];
        history.push(
            `/recommendations/recommendationsinfo/${recommendationsId}/${
                tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "maindetails"
            }`
        );
        // history.push(`/recommendations/recommendationsinfo/${recommendationsId}/maindetails`);
    };

    getDataById = async recommendationsId => {
        await this.props.getRecommendationById(recommendationsId);
        return this.props.recommendationsReducer.getRecommendationByIdResponse || {};
    };

    uploadImages = async (imageData = {}) => {
        const { selectedRecommendations } = this.state;
        await this.props.uploadRecommendationImage(imageData, selectedRecommendations || this.props.match.params.id);
        // await this.getAllImageList(selectedRecommendations);
        return true;
    };

    deleteImages = async imageId => {
        const { selectedRecommendations } = this.state;
        await this.props.deleteRecommendationImage(imageId);
        // await this.getAllImageList(selectedRecommendations);
        return true;
    };

    getAllImageList = async (recommendationsId, params) => {
        await this.props.getAllRecommendationImages(recommendationsId, params);
        const {
            recommendationsReducer: { getAllImagesResponse }
        } = this.props;
        await this.setState({
            imageResponse: getAllImagesResponse
        });
        return true;
    };

    updateRecommendationImageComment = async imageData => {
        const { selectedRecommendations } = this.state;
        await this.props.updateRecommendationImageComment(imageData);
        // await this.getAllImageList(selectedRecommendations);
        return true;
    };

    openDeleteBox = (isDeleted = false) => {
        this.setState({
            showConfirmModal: true,
            isRedirectionOnDelete: true,
            isDeleted: isDeleted
        });
    };
    openRestoreBox = () => {
        this.setState({
            showRestoreConfirmModal: true,
            isRedirectionOnDelete: true
        });
    };
    handleCutPaste = async current_year => {
        await this.setState({
            selectedYear: current_year.split("_")[1]
        });

        this.toggleShowCutPasteModal();
    };
    toggleShowCutPasteModal = async () => {
        await this.setState({
            showCutPasteModal: !this.state.showCutPasteModal
        });
    };
    ShowCutPasteModalConfirm = async target_year => {
        this.toggleShowCutPasteModal();
        await this.setState({
            showConfirmCopyPasteModal: true,
            target_year: target_year
        });
    };
    renderCutPasteConfirmationModal = () => {
        const { showConfirmCopyPasteModal } = this.state;
        if (!showConfirmCopyPasteModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to move Recommendation Cost?"}
                        message={
                            "Moving Recommendations costs from one year to another will OVERWRITE these existing Recommendations costs in Target Year,Are you sure you want to continue?"
                        }
                        onNo={() => this.setState({ showConfirmCopyPasteModal: false })}
                        onYes={this.HandleCutPasteSubmit}
                        isCutPaste={true}
                        type={"cutpaste"}
                    />
                }
                onCancel={() => this.setState({ showConfirmCopyPasteModal: false })}
            />
        );
    };
    HandleCutPasteSubmit = async () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const projectId = this.props.match.params.id;
        const { selectedYear, target_year } = this.state;
        let {
            search,
            filters,
            list,
            order,
            view,
            deleted,
            on_hold,
            completed,
            locked,
            unlocked,
            active,
            surveyor,
            image_or_not,
            infrastructure_request,
            water,
            energy,
            facility_master_plan,
            recommendation_type,
            budget_priority,
            recommendation_ids
        } = this.state.params;
        let tempFilters = filters ? JSON.stringify(filters) : null;
        let tempList = list ? JSON.stringify(list) : null;
        let tempOrder = order ? JSON.stringify(order) : null;
        recommendation_ids = recommendation_ids ? JSON.stringify(recommendation_ids) : null;
        let cutpasteParams = {};
        if (section === "regioninfo") {
            cutpasteParams = {
                project_id: this.props.projectIdDashboard,
                region_id: this.props.match.params.id,
                from: parseInt(selectedYear),
                to: parseInt(target_year),
                filters: tempFilters,
                search,
                list: tempList,
                order: tempOrder,
                view,
                deleted,
                on_hold,
                completed,
                locked,
                unlocked,
                active,
                surveyor,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                recommendation_ids
            };
        } else if (section === "siteinfo") {
            cutpasteParams = {
                project_id: this.props.projectIdDashboard,
                site_id: this.props.match.params.id,
                from: parseInt(selectedYear),
                to: parseInt(target_year),
                filters: tempFilters,
                search,
                list: tempList,
                order: tempOrder,
                view,
                deleted,
                on_hold,
                completed,
                locked,
                unlocked,
                active,
                surveyor,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                recommendation_ids
            };
        } else if (section === "buildinginfo") {
            cutpasteParams = {
                project_id: this.props.projectIdDashboard,
                building_id: this.props.match.params.id || null,
                from: parseInt(selectedYear),
                to: parseInt(target_year),
                filters: tempFilters,
                search,
                list: tempList,
                order: tempOrder,
                view,
                deleted,
                on_hold,
                completed,
                locked,
                unlocked,
                active,
                surveyor,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                recommendation_ids
            };
        } else {
            cutpasteParams = {
                project_id: projectId,
                from: parseInt(selectedYear),
                to: parseInt(target_year),
                filters: tempFilters,
                search,
                list: tempList,
                order: tempOrder,
                view,
                deleted,
                on_hold,
                completed,
                locked,
                unlocked,
                active,
                surveyor,
                image_or_not,
                infrastructure_request,
                water,
                energy,
                facility_master_plan,
                recommendation_type,
                budget_priority,
                recommendation_ids
            };
        }
        await this.props.updateMaintenanceYearCutPaste(cutpasteParams);
        if (
            this.props.recommendationsReducer.updateMaintenanceYearCutPasteResponse &&
            this.props.recommendationsReducer.updateMaintenanceYearCutPasteResponse.error
        ) {
            await this.setState({
                alertMessage: this.props.recommendationsReducer.updateMaintenanceYearCutPasteResponse.error,
                selectedYear: "",
                showConfirmCopyPasteModal: false,
                target_year: ""
            });
            this.showAlert();
        } else {
            this.setState({
                selectedYear: "",
                showConfirmCopyPasteModal: false,
                target_year: ""
            });
            // this.toggleShowCutPasteModal();
            this.refreshRecommendationsList();
        }
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section }
            },
            location: { search }
        } = this.props;
        const {
            tableData: { keys, config }
        } = this.state;
        const query = qs.parse(search);
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name === "Dashboard" ? true : false;
        }
        await this.setState({ tableLoading: true });
        let hide_columns = [""];
        keys.map((keyItem, i) => {
            if (config && !config[keyItem]?.isVisible) {
                hide_columns.push(config[keyItem]?.label);
            }
        });
        section === "regioninfo"
            ? await this.props.exportRecommendationByRegion({
                  ...this.state.params,
                  project_id: query.pid,
                  region_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  hide_columns,
                  ...(isDashboardFiltered && { ...this.state.dashboardFilterParams })
              })
            : section === "siteinfo"
            ? await this.props.exportRecommendationBySite({
                  ...this.state.params,
                  project_id: query.pid,
                  site_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  hide_columns,
                  ...(isDashboardFiltered && { ...this.state.dashboardFilterParams })
              })
            : section === "buildinginfo"
            ? await this.props.exportRecommendationByBuilding({
                  ...this.state.params,
                  project_id: query.pid,
                  building_id: entityId || null,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  hide_columns,
                  ...(isDashboardFiltered && { ...this.state.dashboardFilterParams })
              })
            : section === "initiativeInfo"
            ? await this.props.exportRecommendations({
                  ...this.state.params,
                  initiative_id: entityId || null,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  view: this.state.params.view,
                  hide_columns
              })
            : this.props.isImageView
            ? await this.props.exportRecommendations({
                  ...this.state.params,
                  image_id: this.props.imageId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  view: this.state.params.view,
                  hide_columns
              })
            : section === "assetInfo"
            ? await this.props.exportRecommendations({
                  ...this.state.params,
                  asset_id: entityId || null,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  view: this.state.params.view,
                  hide_columns,
                  ...(isDashboardFiltered && { ...this.state.dashboardFilterParams })
              })
            : this.props.isBudgetPriority
            ? await this.props.exportBudgetPriorityRecommendations({
                  ...this.state.params,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  hide_columns,
                  ...this.props.dashboardFilterParams
              })
            : await this.props.exportRecommendations({
                  ...this.state.params,
                  project_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  hide_columns,
                  ...(isDashboardFiltered && { ...this.state.dashboardFilterParams })
              });

        this.setState({ tableLoading: false });
        if (this.props.recommendationsReducer.recommendationExportResponse && this.props.recommendationsReducer.recommendationExportResponse.error) {
            await this.setState({ alertMessage: this.props.recommendationsReducer.recommendationExportResponse.error });
            this.showAlert();
        }
    };

    exportAllTrades = async (export_type = "Building") => {
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section }
            },
            location: { search }
        } = this.props;
        const {
            tableData: { keys, config }
        } = this.state;
        const query = qs.parse(search);
        await this.setState({ exportAllTradesLoading: true });
        let hide_columns = [""];
        keys.map((keyItem, i) => {
            if (config && !config[keyItem]?.isVisible) {
                hide_columns.push(config[keyItem]?.label);
            }
        });
        let tempParams = {};
        section === "regioninfo"
            ? (tempParams = {
                  ...this.state.params,
                  project_id: query.pid,
                  region_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  export_type,
                  hide_columns
              })
            : section === "siteinfo"
            ? (tempParams = {
                  ...this.state.params,
                  project_id: query.pid,
                  site_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  export_type,
                  hide_columns
              })
            : section === "buildinginfo"
            ? (tempParams = {
                  ...this.state.params,
                  project_id: query.pid,
                  building_id: entityId || null,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  export_type,
                  hide_columns
              })
            : section === "initiativeInfo"
            ? (tempParams = {
                  ...this.state.params,
                  initiative_id: entityId || null,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  view: this.state.params.view,
                  export_type,
                  hide_columns
              })
            : (tempParams = {
                  ...this.state.params,
                  project_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  capital_type: this.state.capital_type,
                  start_year: this.state.start_year || null,
                  end_year: this.state.end_year || null,
                  infrastructure_requests: this.state.infrastructure_requests || null,
                  year: this.state.year,
                  dashboard: this.state.dashboard,
                  export_type,
                  hide_columns
              });
        await this.props.exportAllTrades(tempParams);
        this.setState({ exportAllTradesLoading: false });
        if (this.props.recommendationsReducer.exportAllTradesResponse && this.props.recommendationsReducer.exportAllTradesResponse.error) {
            await this.setState({ alertMessage: this.props.recommendationsReducer.exportAllTradesResponse.error });
            this.showAlert();
        }
    };

    showRestoreModal = async id => {
        await this.setState({
            showRestoreConfirmModal: true,
            selectedRecommendations: id
        });
    };

    renderRestoreConfirmationModal = () => {
        const { showRestoreConfirmModal } = this.state;
        if (!showRestoreConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this Recommendation?"}
                        message={""}
                        onNo={() => this.setState({ showRestoreConfirmModal: false })}
                        onYes={this.restoreRecommendationOnConfirm}
                        type={"restore"}
                        isRestore={true}
                    />
                }
                onCancel={() => this.setState({ showRestoreConfirmModal: false })}
            />
        );
    };

    restoreRecommendationOnConfirm = async () => {
        const { selectedRecommendations } = this.state;
        this.setState({
            isLoading: true,
            showRestoreConfirmModal: false
        });
        await this.props.getRestoreRecommendation(selectedRecommendations);
        if (
            this.props.recommendationsReducer.recoverRecommendationResponse &&
            this.props.recommendationsReducer.recoverRecommendationResponse.error
        ) {
            await this.setState({
                alertMessage: this.props.recommendationsReducer.recoverRecommendationResponse.error,
                showRestoreConfirmModal: false
            });
            this.showAlert();
        } else {
            await this.refreshRecommendationsList();
            // await this.props.getMenuItems();
            this.setState(
                {
                    alertMessage: this.props.recommendationsReducer.recoverRecommendationResponse?.message
                },
                () => this.showAlert()
            );
            if (this.state.isRedirectionOnDelete) {
                popBreadCrumpRecData();
                const redirectionurl = findPrevPathFromBreadCrumpRecData();
                this.props.history.push(findPrevPathFromBreadCrumpData() || "/recommendations");
                // this.props.history.push(redirectionurl[2].path || "/recommendations");
            }
            this.setState({
                showRestoreConfirmModal: false,
                isRedirectionOnDelete: false
            });
        }
        this.setState({
            isLoading: false
        });
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllRecommendationLogs(buildingId, historyParams);
        const {
            recommendationsReducer: {
                getAllRecommendationLogsResponse: { logs, count }
            }
        } = this.props;
        if (
            this.props.recommendationsReducer.getAllRecommendationLogsResponse &&
            this.props.recommendationsReducer.getAllRecommendationLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationsReducer.getAllRecommendationLogsResponse.error });
            this.showAlert();
        } else {
            await this.setState({
                logData: {
                    ...this.state.logData,
                    data: logs
                },
                historyPaginationParams: {
                    ...this.state.historyPaginationParams,
                    totalCount: count,
                    totalPages: this.state.historyPaginationParams && Math.ceil(count / this.state.historyPaginationParams.perPage)
                }
            });
        }
    };

    handlePerPageChangeHistory = async e => {
        const { historyPaginationParams } = this.state;
        await this.setState({
            historyPaginationParams: {
                ...historyPaginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            historyParams: {
                ...this.state.historyParams,
                offset: 0,
                limit: e.target.value
            }
        });
        await this.getLogData(this.props.match.params.id);
    };

    handlePageClickHistory = async page => {
        const { historyPaginationParams, historyParams } = this.state;
        await this.setState({
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: page.selected
            },
            historyParams: {
                ...historyParams,
                // offset: page.selected * historyPaginationParams.perPage
                offset: page.selected + historyPaginationParams.perPage
            }
        });
        await this.getLogData(this.props.match.params.id);
    };

    handleGlobalSearchHistory = async search => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.setState({
            historyParams: {
                ...historyParams,
                offset: 0,
                search
            },
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: 0
            }
        });
        await this.getLogData(this.props.match.params.id);
    };

    handleDeleteLog = async (id, choice = "delete") => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            isRestoreOrDelete: choice
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, isRestoreOrDelete } = this.state;
        if (!showConfirmModalLog) return null;
        if (isRestoreOrDelete === "delete") {
            return (
                <Portal
                    body={
                        <ConfirmationModal
                            heading={"Do you want to delete this log?"}
                            message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                            onNo={() => this.setState({ showConfirmModalLog: false })}
                            onYes={this.deleteLogOnConfirm}
                        />
                    }
                    onCancel={() => this.setState({ showConfirmModalLog: false })}
                />
            );
        } else {
            return (
                <Portal
                    body={
                        <ConfirmationModal
                            heading={"Do you want to restore this log?"}
                            message={"This action cannot be reverted, are you sure that you need to restore this item?"}
                            onNo={() => this.setState({ showConfirmModalLog: false })}
                            onYes={this.restoreLogOnConfirm}
                            isRestore={true}
                            type={"restore"}
                        />
                    }
                    onCancel={() => this.setState({ showConfirmModalLog: false })}
                />
            );
        }
    };

    deleteLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.deleteRecommendationLog(selectedLog);
        if (
            this.props.recommendationsReducer.deleteRecommendationLogResponse &&
            this.props.recommendationsReducer.deleteRecommendationLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationsReducer.deleteRecommendationLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        this.setState({ isLoading: true });
        await this.props.restoreRecommendationLog(id);
        if (
            this.props.recommendationsReducer.restoreRecommendationLogResponse &&
            this.props.recommendationsReducer.restoreRecommendationLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationsReducer.restoreRecommendationLogResponse.error, isLoading: false });
            this.showAlert();
        } else {
            await this.refreshRecommendationsList();
            await this.setState({ alertMessage: this.props.recommendationsReducer.restoreRecommendationLogResponse.message, isLoading: false });
            this.showAlert();
        }
    };

    updateLogSortFilters = async searchKey => {
        if (this.state.historyParams.order) {
            await this.setState({
                historyParams: {
                    ...this.state.historyParams,
                    order: {
                        ...this.state.historyParams.order,
                        [searchKey]: this.state.historyParams.order[searchKey] === "desc" ? "asc" : "desc"
                    }
                }
            });
        } else {
            await this.setState({
                historyParams: {
                    ...this.state.historyParams,
                    order: { [searchKey]: "asc" }
                }
            });
        }
        this.updateEntityParams();
        await this.getLogData(this.props.match.params.id);
    };
    selectFilterHandler = async e => {
        localStorage.removeItem("recommendationIds");
        localStorage.removeItem("selectAll");
        switch (e.target.value) {
            case "deleted":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: true,
                        active: null,
                        locked: null,
                        unlocked: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "active":
                await this.setState({
                    params: {
                        ...this.state.params,
                        active: true,
                        deleted: null,
                        unlocked: null,
                        locked: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "locked":
                await this.setState({
                    params: {
                        ...this.state.params,
                        locked: true,
                        unlocked: null,
                        deleted: null,
                        active: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "unlocked":
                await this.setState({
                    params: {
                        ...this.state.params,
                        unlocked: true,
                        deleted: null,
                        active: null,
                        locked: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "assigned":
                await this.setState({
                    params: {
                        ...this.state.params,
                        view: "assigned",
                        unlocked: null,
                        deleted: null,
                        active: null,
                        locked: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "unassigned":
                await this.setState({
                    params: {
                        ...this.state.params,
                        view: "unassigned",
                        unlocked: null,
                        deleted: null,
                        active: null,
                        locked: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "all":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "completed":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        view: null,
                        on_hold: null,
                        completed: true
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "on_hold":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        view: null,
                        on_hold: true,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            default:
                break;
        }
        await this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    selectFilterHandlerInitiative = async e => {
        localStorage.removeItem("recommendationIds");
        localStorage.removeItem("selectAll");
        let isRecom = this.props.match.params.tab == "recommendation" ? true : false;
        switch (e.target.value) {
            case "deleted":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: true,
                        active: null,
                        locked: null,
                        unlocked: null,
                        // view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "active":
                await this.setState({
                    params: {
                        ...this.state.params,
                        active: true,
                        deleted: null,
                        unlocked: null,
                        locked: null,
                        // view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "locked":
                await this.setState({
                    params: {
                        ...this.state.params,
                        locked: true,
                        unlocked: null,
                        deleted: null,
                        active: null,
                        // view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "unlocked":
                await this.setState({
                    params: {
                        ...this.state.params,
                        unlocked: true,
                        deleted: null,
                        active: null,
                        locked: null,
                        // view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "assigned":
                await this.setState({
                    params: {
                        ...this.state.params,
                        view: "assigned"
                        // unlocked: null,
                        // deleted: null,
                        // active: null,
                        // locked: null,
                        // on_hold: null,
                        // completed: null
                    },
                    selectedDropdownInitiaive: e.target.value
                });
                break;
            case "unassigned":
                await this.setState({
                    params: {
                        ...this.state.params,
                        view: "unassigned"
                        // unlocked: null,
                        // deleted: null,
                        // active: null,
                        // locked: null,
                        // on_hold: null,
                        // completed: null
                    },
                    selectedDropdownInitiaive: e.target.value
                });
                break;
            case "all":
                await this.setState({
                    params: {
                        ...this.state.params,
                        // deleted: null,
                        // active: null,
                        // locked: null,
                        // unlocked: null,
                        view: null
                        // on_hold: null,
                        // completed: null
                    },
                    selectedDropdownInitiaive: e.target.value
                });
                break;
            case "allInitiative":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        // view: null,
                        on_hold: null,
                        completed: null
                    },
                    // selectedDropdownInitiaive: e.target.value,
                    selectedDropdown: e.target.value
                });
                break;
            case "completed":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        // view: null,
                        on_hold: null,
                        completed: true
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "on_hold":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        // view: null,
                        on_hold: true,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            default:
                break;
        }
        if (!isRecom) this.updateEntityParams();
        await this.refreshRecommendationsList(isRecom);
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

    renderConfirmationModalUnassign = () => {
        const { confirmUnAssign } = this.state;
        if (!confirmUnAssign) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to unassign this recommendation?"}
                        message={"This action cannot be reverted, are you sure that you need to unassign this item?"}
                        onNo={() => this.setState({ confirmUnAssign: false })}
                        onYes={this.handleUnassign}
                        type={"unassign"}
                        isUnAssign={true}
                    />
                }
                onCancel={() => this.setState({ confirmUnAssign: false })}
            />
        );
    };

    handleUnassign = async () => {
        if (this.props.match.params.section === "imageInfo") {
            this.setState({
                confirmUnAssign: false,
                isLoading: true
            });
            const { selectedRecomIds } = this.state;
            let params = {
                id: this.props.match.params.id,
                recommendation_ids: selectedRecomIds.map(elem => elem.id)
            };
            await this.props.unAssignImage(params);
            await this.refreshRecommendationsList();
            const { unAssignImageResponse } = this.props.recommendationsReducer;
            if (unAssignImageResponse.error) {
                await this.setState({
                    alertMessage: unAssignImageResponse.error
                });
                this.showAlert();
            } else if (unAssignImageResponse.success) {
                await this.setState({
                    alertMessage: unAssignImageResponse.message
                });
                this.showAlert();
            }
        } else {
            let tempIds = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];
            let data = {
                recommendation_ids: tempIds
            };
            await this.setState({
                confirmUnAssign: false,
                isLoading: true
            });

            await this.props.unAssignProject(data, this.props.match.params.id);
            await localStorage.removeItem("recommendationIds");
            await localStorage.removeItem("selectAll");
            await this.props.unAassignContent();
            await this.setState({
                confirmUnAssign: false
            });
            await this.refreshRecommendationsList();
            await this.props.refreshinfoDetails();
            if (this.props.initativeReducer.unAssignProject && this.props.initativeReducer.unAssignProject.error) {
                await this.setState({
                    alertMessage: this.props.initativeReducer.unAssignProject.error,
                    showConfirmModal: false,
                    isRedirectionOnDelete: false,
                    selectedInitiative: null
                });
                this.showAlert();
            } else {
                if (this.props.initativeReducer.unAssignProject && this.props.initativeReducer.unAssignProject.success) {
                    await this.setState({
                        alertMessage: this.props.initativeReducer.unAssignProject.message
                    });
                    this.showAlert();
                }
            }
        }
    };

    unAassignContent = async () => {
        this.setState({
            confirmUnAssign: true
        });
    };

    downloadPdfReport = async params => {
        this.setState({ isLoading: true });
        await this.props.downloadPdfReport(params);
        await this.props.addUserActivityLog({ text: "Downloaded pdf report." });
        this.setState({ isLoading: false });
        const { success, PDF_URL } = this.props.recommendationsReducer.pdfReportResponse || {};
        if (!success) {
            this.setState(
                {
                    alertMessage: "Narrative Report Not Found"
                },
                () => this.showAlert()
            );
            return false;
        }
        const link = document.createElement("a");
        link.href = PDF_URL;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    assignImagesToRecom = async imageData => {
        const { selectedRecommendations } = this.state;
        await this.props.assignImagesToRecom(imageData, selectedRecommendations || this.props.match.params.id);
        return this.props.recommendationsReducer.assignImageResponse;
    };

    handleSelectRecom = async (data, isChecked) => {
        const {
            tempRecommendationsList,
            selectedRecomIds,
            paginationParams: { currentPage, perPage }
        } = this.state;
        const { id, lock_status } = data;
        const page = currentPage * perPage;
        const index = page + (tempRecommendationsList.findIndex(elem => elem.id === id) + 1);
        await this.setState({
            selectedRecomIds: isChecked
                ? [...selectedRecomIds, { id, index, locked: lock_status === LOCK_STATUS.LOCKED }]
                : selectedRecomIds.filter(t => t.id !== id)
        });
        this.updateEntityParams();
    };

    handleSelectAllRecom = async isChecked => {
        const {
            tempRecommendationsList,
            selectedRecomIds,
            paginationParams: { currentPage, perPage }
        } = this.state;
        let tempSelected = [];
        const page = currentPage * perPage;
        if (isChecked) {
            tempRecommendationsList.forEach((item, idx) => {
                tempSelected.push({ id: item.id, locked: item?.lock_status === LOCK_STATUS.LOCKED, index: page * (idx + 1) });
            });
        } else {
            tempSelected = selectedRecomIds;
            tempRecommendationsList.forEach((item, idx) => {
                tempSelected = tempSelected.filter(t => t.id !== item.id);
            });
        }
        await this.setState({ selectedRecomIds: tempSelected });
        this.updateEntityParams();
    };

    selectWholeRecommendation = async () => {
        this.setState({ isLoading: true });
        const {
            match: {
                params: { section }
            }
        } = this.props;
        let params = this.state.params;
        const projectId = this.props.projectIdDashboard || this.props.match.params.id;
        if (section === "initiativeInfo" && params.view !== "assigned") {
            const {
                location: { search }
            } = this.props;
            const query = qs.parse(search);
            params.project_id = query.pid;
        } else if (section !== "imageInfo" && section !== "initiativeInfo" && section !== "assetInfo") {
            params.project_id = projectId;
        }
        if (section === "initiativeInfo" && params.view === "assigned") {
            params.initiative_id = this.props.match.params.id || null;
        }
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        }
        if (isDashboardFiltered) {
            params.dashboard = this.state.dashboard;
            params.capital_type = this.state.capital_type;
            params.building_ids = this.state.building_ids;
            params.year = this.state.year;
        }
        params.start_year = this.state.start_year;
        params.end_year = this.state.end_year;
        params.infrastructure_requests = this.state.infrastructure_requests;
        if (section === "buildinginfo") {
            params.building_id = this.props.match.params.id;
        } else if (section === "siteinfo") {
            params.site_id = this.props.match.params.id;
        } else if (section === "regioninfo") {
            params.region_id = this.props.match.params.id;
        } else if (section === "imageInfo") {
            params.image_id = this.props.match.params.id;
        } else if (section === "assetInfo") {
            params.asset_id = this.props.match.params.id;
        }
        await this.props.getAllRecommendationIds({ ...params, ...(isDashboardFiltered && { ...this.state.dashboardFilterParams }) });
        const { recommendation_ids } = this.props.recommendationsReducer.getWholeRecommendationIdsResponse;
        let tempSelected = [];
        recommendation_ids?.length &&
            recommendation_ids.forEach((id, index) => {
                tempSelected.push({ id, index });
            });
        await this.setState({ selectedRecomIds: [] });
        await this.setState({ selectedRecomIds: tempSelected, isLoading: false });
        this.updateEntityParams();
    };

    clearSelection = async () => {
        await this.setState({ selectedRecomIds: [] });
        this.updateEntityParams();
        if (this.state.params?.recommendation_ids) {
            await this.setState({
                params: {
                    ...this.state.params,
                    offset: 0,
                    recommendation_ids: null
                },
                paginationParams: {
                    ...this.state.paginationParams,
                    currentPage: 0
                }
            });
            await this.refreshRecommendationsList();
        }
    };

    filterBySurveyor = async () => {
        let surveyor = localStorage.getItem("printed_name");
        if (surveyor && surveyor !== "undefined" && surveyor !== null && surveyor !== "null") {
            await this.setState({
                params: {
                    ...this.state.params,
                    offset: 0,
                    recommendation_ids: null,
                    surveyor: this.state.params.surveyor ? null : surveyor || null
                },
                paginationParams: {
                    ...this.state.paginationParams,
                    currentPage: 0
                },
                selectedRecomIds: []
            });
            this.updateEntityParams();
            await this.refreshRecommendationsList();
        } else {
            this.setState(
                {
                    alertMessage: "You don't have a printed name. please provide a printed name"
                },
                () => this.showAlert()
            );
        }
    };
    filterByImages = async () => {
        const { image_or_not } = this.state.params;
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                image_or_not: image_or_not === "true" ? "false" : image_or_not === "false" ? null : "true",
                recommendation_ids: null
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };
    filterByIR = async () => {
        const { infrastructure_request } = this.state.params;
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                recommendation_ids: null,
                infrastructure_request: infrastructure_request === "yes" ? "no" : infrastructure_request === "no" ? null : "yes"
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };
    filterByWater = async () => {
        const { water } = this.state.params;
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                recommendation_ids: null,
                water: water === "yes" ? "no" : water === "no" ? null : "yes"
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };
    filterByEnergy = async () => {
        const { energy } = this.state.params;
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                recommendation_ids: null,
                energy: energy === "yes" ? "no" : energy === "no" ? null : "yes"
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };
    filterByBudgetPriority = async () => {
        const { budget_priority } = this.state.params;
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                recommendation_ids: null,
                budget_priority: budget_priority === "yes" ? "no" : budget_priority === "no" ? null : "yes"
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    filterByFmp = async () => {
        const { facility_master_plan } = this.state.params;
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                recommendation_ids: null,
                facility_master_plan: facility_master_plan === "yes" ? "no" : facility_master_plan === "no" ? null : "yes"
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };
    filterByRecomType = async () => {
        const { recommendation_type } = this.state.params;
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                recommendation_ids: null,
                recommendation_type: recommendation_type === "asset" ? "building" : recommendation_type === "building" ? null : "asset"
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            },
            selectedRecomIds: []
        });
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    resetEntityParams = async () => {
        await this.setState({
            selectedRegion: null,
            paginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 40,
                offset: 0,
                search: "",
                order: null,
                index: [],
                maintenance_year: [],
                project_id: null,
                filters: null,
                list: null,
                deleted: null,
                view: this.props.match.params.tab === "recommendation" ? "assigned" : null,
                locked: null,
                unlocked: null,
                active: this.props.match.params.section === "initiativeInfo" ? null : true,
                on_hold: null,
                completed: null,
                image_or_not: null,
                infrastructure_request: null,
                surveyor: null,
                recommendation_ids: null,
                water: null,
                energy: null,
                facility_master_plan: null,
                recommendation_type: null,
                budget_priority: null
            },
            tableData: {
                ...this.state.tableData,
                config: _.cloneDeep(this.state.initialTableConfig)
            },
            wildCardFilterParams: {},
            filterParams: {},
            tableConfig: null,
            selectedRowId: null,
            selectedDropdown:
                this.props.match.params.section === "initiativeInfo" ? (this.props.match.params.tab == "recommendation" ? "assigned" : "") : "active",
            selectedDropdownInitiaive: "active",
            selectedRecomIds: [],
            parentSectionId: null,
            tableDataExportFilters: {}
        });
        this.updateEntityParams();
    };

    resetAll = async () => {
        await this.resetEntityParams();
        await this.refreshRecommendationsList();
    };

    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config },
            initialTableConfig
        } = this.state;
        keys.map(key => {
            if (initialTableConfig[key] && !_.isEqual(config[key]?.isVisible, initialTableConfig[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };

    toggleMultiSelectEditForm = async () => {
        //if locked selected
        const hasLockRecom = this.state.selectedRecomIds.some(elem => elem.locked);
        if (hasLockRecom) {
            await this.setState({
                alertMessage: "Locked recommendations cannot be edited!"
            });
            this.showAlert();
        } else {
            this.setState({ showMultiSelectEditForm: !this.state.showMultiSelectEditForm });
        }
    };

    renderMultiSelectEditForm = () => {
        const { showMultiSelectEditForm, selectedRecomIds } = this.state;
        if (!showMultiSelectEditForm) return null;
        return (
            <Portal
                body={
                    <MultiSelectFormModal
                        handleUpdateRecommendations={this.handleUpdateMultiRecommendations}
                        getSiteListBasedOnRegion={this.getSiteListBasedOnRegion}
                        getRegionListBasedOnClient={this.getRegionListBasedOnClient}
                        clientId={this.props.basicDetails?.client?.id}
                        projectId={this.props.projectIdDashboard ? this.props.projectIdDashboard : this.props.match.params.id}
                        onCancel={this.toggleMultiSelectEditForm}
                        selectedRecomIds={selectedRecomIds.map(elem => elem.id)}
                    />
                }
                onCancel={this.toggleMultiSelectEditForm}
            />
        );
    };

    handleUpdateMultiRecommendations = async recommendation => {
        const { selectedRecomIds, selectedDropdown } = this.state;
        await this.props.updateMultipleRecommendations(
            recommendation,
            selectedRecomIds.map(elem => elem.id)
        );
        if (
            this.props.recommendationsReducer.updateMultipleRecommendationsResponse &&
            this.props.recommendationsReducer.updateMultipleRecommendationsResponse.error
        ) {
            await this.setState({
                alertMessage: this.props.recommendationsReducer.updateMultipleRecommendationsResponse.error
            });
            this.showAlert();
        } else {
            this.toggleMultiSelectEditForm();
            // if the recommendation status is changed and current status filter is different clearing selection
            if (recommendation.status && selectedDropdown !== "all" && recommendation.status !== selectedDropdown) {
                this.clearSelection();
            }
            await this.setState({
                params: {
                    ...this.state.params,
                    offset: 0
                },
                paginationParams: {
                    ...this.state.paginationParams,
                    currentPage: 0
                }
            });
            await this.refreshRecommendationsList();
            await this.setState({
                alertMessage: this.props.recommendationsReducer.updateMultipleRecommendationsResponse?.message
            });
            this.showAlert();
        }
    };

    showSelectedRecom = async () => {
        if (this.state.params.recommendation_ids?.length) {
            await this.setState({
                params: {
                    ...this.state.params,
                    offset: 0,
                    recommendation_ids: null
                },
                paginationParams: {
                    ...this.state.paginationParams,
                    currentPage: 0
                }
            });
        } else {
            await this.setState({
                params: {
                    ...this.state.params,
                    offset: 0,
                    recommendation_ids: this.state.selectedRecomIds.map(elem => elem.id)
                },
                paginationParams: {
                    ...this.state.paginationParams,
                    currentPage: 0
                }
            });
        }
        this.updateEntityParams();
        await this.refreshRecommendationsList();
    };

    exportSelectedRecom = async (type, isChecked) => {
        const {
            selectedRecomIds,
            params: { list, infrastructure_request, image_or_not, water, energy, facility_master_plan, recommendation_type, budget_priority },
            tableData: { keys, config }
        } = this.state;
        let sortedRecommendationIds = selectedRecomIds.sort((a, b) => a.index - b.index).map(elem => elem.id);
        const {
            match: {
                params: { section }
            },
            location: { search }
        } = this.props;
        let key_name = {};
        const query = qs.parse(search);
        const project_id = section === "projectinfo" ? this.props.match.params.id : query.pid;
        if (list && Object.keys(list).length) {
            keys.forEach(item => {
                Object.entries(list).forEach(([key, value]) => {
                    if (config[item].searchKey === key) {
                        key_name[config[item].label] = value;
                    }
                });
            });
        }
        if (infrastructure_request) {
            key_name["Infrastructure Reques"] = [infrastructure_request];
        }
        if (water) {
            key_name["Water"] = [water];
        }
        if (energy) {
            key_name["Energy"] = [energy];
        }
        if (facility_master_plan) {
            key_name["FMP"] = [facility_master_plan];
        }
        if (recommendation_type) {
            key_name["Recommendation Type"] = [recommendation_type];
        }
        if (budget_priority) {
            key_name["Budget Priority"] = [budget_priority];
        }
        if (image_or_not) {
            key_name["Images"] = [image_or_not === "true" ? "yes" : "no"];
        }
        key_name = Object.keys(key_name)?.length ? key_name : null;
        if (type === "word") {
            this.setState({ multiExportWordLoader: true });
            await this.props.exportSelectedRecomWord({
                recommendations: sortedRecommendationIds,
                key_name,
                username: localStorage.getItem("user"),
                project_id,
                notes: isChecked
            });
            this.setState({ multiExportWordLoader: false });
        } else if (type === "pdf") {
            this.setState({ multiExportPdfLoader: true });
            await this.props.exportSelectedRecomPDF({
                recommendations: sortedRecommendationIds,
                key_name,
                username: localStorage.getItem("user"),
                project_id,
                notes: isChecked
            });
            this.setState({ multiExportPdfLoader: false });
        }
    };

    getPriorityElementDropDownData = async projectId => {
        await this.props.getPriorityElementDropDownData(projectId);
        return this.props.recommendationsReducer.priorityElementsDropDownResponse || {};
    };

    postExport = async params => {
        this.setState({ exportLoader: true });
        await this.props.exportReportPdf(params);
        this.setState({ exportLoader: false });
    };

    // get sorted recom export params (word/excel)
    getExportParams = () => {
        const {
            match: {
                params: { section }
            },
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const project_id = section === "projectinfo" ? this.props.match.params.id : query.pid;
        const userId = localStorage.getItem("userId");
        const user_name = localStorage.getItem("user");
        const scope = section.substring(0, section.length - 4);
        const { tableDataExportFilters, building_ids, year } = this.state;
        let params = {
            project_id,
            user_id: userId,
            export_from: scope,
            user_name,
            ...tableDataExportFilters
        };
        if (section === "buildinginfo") {
            params.building_id = [this.props.match.params.id];
        } else if (section === "siteinfo") {
            params.site_id = [this.props.match.params.id];
        } else if (section === "regioninfo") {
            params.region_id = [this.props.match.params.id];
        } else if (section === "imageInfo") {
            params.image_id = [this.props.match.params.id];
        } else if (section === "assetInfo") {
            params.asset_id = [this.props.match.params.id];
        }

        //if dashboard filtered
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        }
        if (isDashboardFiltered) {
            if (query.DM_ID) {
                params.recommendation_capital_type_id = [query.DM_ID];
            }
            if (building_ids?.length) {
                params.building_id = building_ids;
            }
            if (year) {
                params.year = year;
            }
        }
        return params;
    };

    exportToWord = async sort_type => {
        this.setState({ exportWordLoading: true });
        let params = this.getExportParams();
        params.sort_type = sort_type;
        await this.props.exportToWord(params);
        this.setState({ exportWordLoading: false });
        const res = this.props.recommendationsReducer.exportWordDataResponse;
        await this.setState({
            alertMessage: res?.message_status ? res.message_status : res?.message || "Something Went Wrong"
        });
        this.showAlert();
    };
    exportToExcel = async sort_type => {
        this.setState({ exportWordLoading: true });
        let params = this.getExportParams();
        params.sort_type = sort_type;
        await this.props.exportToExcelFile(params);
        this.setState({ exportWordLoading: false });
        const res = this.props.recommendationsReducer.exportExcelDataResponse;
        await this.setState({
            alertMessage: res?.message_status ? res.message_status : res?.message || "Something Went Wrong"
        });
        this.showAlert();
    };

    lockRecommendation = flag => {
        lockRecommendation(this.props.match.params.id, { lock: flag });
    };

    modifyDashboardFilterParams = () => {
        let { dashboardFilterParams } = this.state;
        const { chart_type, horizontal_chart_type } = this.state?.dashboardFilterParams || {};
        const trade_id =
            chart_type?.split("_")[0] === "system"
                ? chart_type?.split("_")[1]
                : horizontal_chart_type?.split("_")[0] === "system"
                ? horizontal_chart_type?.split("_")[1]
                : null;
        if (trade_id) {
            delete dashboardFilterParams.chart_type;
            dashboardFilterParams.trade_id = trade_id;
        }
        this.setState({ dashboardFilterParams });
    };
    toggleLineEditing = () => {
        this.setState(prevState => {
            const { config, keys } = prevState.tableData;
            const { lineEditingEnabled } = prevState;

            const updatedConfig = keys.reduce(
                (updated, key) => {
                    if (key.includes("year_")) {
                        return {
                            ...updated,
                            [key]: { ...config[key], hasInputToggle: !lineEditingEnabled }
                        };
                    }
                    return updated;
                },
                { ...config }
            );

            return {
                lineEditingEnabled: !lineEditingEnabled,
                tableData: {
                    ...prevState.tableData,
                    config: updatedConfig
                }
            };
        });
    };
    handleCellFocus = (keyItem, rowIndex) => {
        this.setState({ isInputMode: { keyItem, rowIndex } });
    };
    handleCellValueChange = (value, keyItem, rowIndex) => {
        let tableData = this.state.tableData.data;
        const year = keyItem?.split("year_")?.[1] ? parseInt(keyItem?.split("year_")?.[1]) : null;
        const findIndex = tableData[rowIndex]?.maintenance_years?.findIndex(elem => elem.year === year);
        if (findIndex !== -1 && tableData[rowIndex].maintenance_years[findIndex]) {
            tableData[rowIndex].maintenance_years[findIndex].amount = parseInt(value) || 0;
        }
        tableData[rowIndex][keyItem] = parseInt(value) || null;
        this.setState(
            {
                tableData: {
                    ...this.state.tableData,
                    data: tableData
                },
                summaryRowData: {
                    ...this.state.summaryRowData,
                    project_total: "isLoading",
                    year_totals: {
                        ...this.state.summaryRowData.year_totals,
                        [year]: "isLoading"
                    }
                }
            },
            () => this.debouncedSaveTableValue(rowIndex)
        );
    };

    debouncedSaveTableValue = async rowIndex => {
        let newData = {};
        const { id, ...rest } = this.state.tableData?.data[rowIndex] || {};
        newData.maintenance_years = rest.maintenance_years;
        newData.building_id = rest.building?.id;
        newData.recommendation_type = rest?.recommendation_type;
        await this.props.updateRecommendation(newData, id);
        const { success, error, message } = this.props.recommendationsReducer.updateRecommendationResponse;
        if (!success || error) {
            await this.setState({
                alertMessage: message || "Failed to update Recommendation!"
            });
            this.showAlert();
        } else {
            this.refreshRecommendationsList(false, true);
        }
    };

    handleColumnPin = keyItem => {
        this.setState(prevState => {
            const { config } = prevState.tableData;
            const updatedConfig = {
                ...config,
                [keyItem]: {
                    ...config[keyItem],
                    pinned: !config[keyItem]?.pinned
                }
            };
            return {
                tableData: {
                    ...prevState.tableData,
                    config: updatedConfig
                }
            };
        }, this.setLeftForPinnedColumns);
    };

    setLeftForPinnedColumns = () => {
        const {
            tableData: { config, keys }
        } = this.state;
        const pinnedColumns = keys.filter(key => config[key]?.pinned);
        const columnLeftValues = getPinnedColumnLeftPositions(pinnedColumns, this.pinnedColumnsRef);
        const updatedConfig = { ...config };

        pinnedColumns.forEach(key => {
            updatedConfig[key] = {
                ...config[key],
                style: {
                    ...config[key]?.style,
                    left: columnLeftValues[key]
                }
            };
        });

        this.setState(
            prevState => ({
                tableData: {
                    ...prevState.tableData,
                    config: updatedConfig
                }
            }),
            () => this.updateEntityParams()
        );
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            showViewModalExport,
            showAssignConsultancyUsers,
            showAssignClientUsers,
            clients,
            consultancy_users,
            tableData,
            selectedRecommendations,
            selectedRowId,
            showCutPasteModal,
            summaryRowData,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission,
            imageResponse,
            multiExportPdfLoader,
            multiExportWordLoader,
            exportWordLoading,
            tableDataExportFilters,
            isInputMode,
            lineEditingEnabled
        } = this.state;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        let tempIds = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];
        let priorityElementsData = this.props.recommendationsReducer.priorityElementsDropDownResponse?.priority_elements || [];
        let selectedRecomIds = this.state.selectedRecomIds.map(elem => elem.id);
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        projectId={this.props.projectId}
                        selectedRecommendations={selectedRecommendations}
                        refreshRecommendationsList={this.refreshRecommendationsList}
                        handleAddRecommendations={this.handleAddRecommendations}
                        handleUpdateRecommendations={this.handleUpdateRecommendations}
                        getSiteListBasedOnRegion={this.getSiteListBasedOnRegion}
                        getRegionListBasedOnClient={this.getRegionListBasedOnClient}
                        consultancy_users1={consultancy_users}
                        getDataById={this.getDataById}
                        isChartView={this.props.isChartView}
                    />
                ) : section === "recommendationsinfo" ? (
                    <RecommendationsInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        tableData={this.props.recommendationsReducer.getAllRecommendationsResponse.recommendations}
                        getDataById={this.getDataById}
                        handleUpdateData={this.handleUpdateRecommendations}
                        uploadImages={this.uploadImages}
                        getAllImageList={this.getAllImageList}
                        deleteImages={this.deleteImages}
                        showInfoPage={this.showInfoPage}
                        showDeleteBox={this.openDeleteBox}
                        isChartView={this.props.isChartView}
                        isBuildingLocked={this.props.isBuildingLocked}
                        data={this.props.isBuildingEFCI}
                        updateRecommendationImageComment={this.updateRecommendationImageComment}
                        showRestoreBox={this.openRestoreBox}
                        getAllSettingsLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        handleRestoreLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        imageResponse={imageResponse}
                        handleSelect={this.props.handleSelect}
                        handleSelectAll={this.props.handleSelectAll}
                        assignProjectModal={this.props.assignProjectModal}
                        recomentationIds={this.props.recomentationIds}
                        hasEdit={checkPermission("forms", "recommendations", "edit")}
                        hasDelete={!this.props.isAssetView && checkPermission("forms", "recommendations", "delete")}
                        hasLogView={checkPermission("logs", "recommendations", "view")}
                        hasLogDelete={checkPermission("logs", "recommendations", "delete")}
                        hasLogRestore={checkPermission("logs", "recommendations", "restore")}
                        hasInfoPage={checkPermission("forms", "recommendations", "view")}
                        hasCreate={checkPermission("forms", "recommendations", "create")}
                        downloadPdfReport={this.downloadPdfReport}
                        entity="recommendations"
                        assignImagesToRecom={this.assignImagesToRecom}
                        updateBudget={this.props.updateBudgetPriority}
                        updateFMP={this.props.updateFMP}
                        updateIR={this.props.updateIR}
                        updateRL={this.props.updateRL}
                        updateSelectedRow={this.updateSelectedRow}
                        getPriorityElementDropDownData={this.getPriorityElementDropDownData}
                        postExport={this.postExport}
                        exportLoader={this.state.exportLoader}
                        lockRecommendation={this.lockRecommendation}
                    />
                ) : (
                    <RecommendationsMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        showViewModalExport={this.showViewModalExport}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteRecommendations={this.handleDeleteRecommendations}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterRecommendation={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        updateTableSortFilters={this.updateTableSortFilters}
                        updateLastSortFilter={this.updateLastSortFilter}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        isImageView={this.props.isImageView}
                        isBuildingLocked={this.props.isBuildingLocked}
                        handleCutPaste={this.handleCutPaste}
                        summaryRowData={summaryRowData}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        exportExcelAllTrades={this.exportAllTrades}
                        exportAllTradesLoading={this.state.exportAllTradesLoading}
                        showRestoreModal={this.showRestoreModal}
                        selectFilterHandler={this.selectFilterHandler}
                        selectFilterHandlerInitiative={this.selectFilterHandlerInitiative}
                        selectedDropdown={this.state.selectedDropdown}
                        selectedDropdownInitiaive={this.state.selectedDropdownInitiaive}
                        selectedDropdownInitiaiveFirst={this.state.selectedDropdownInitiaiveFirst}
                        permissions={permissions}
                        logPermission={logPermission}
                        handleSelect={this.props.handleSelect}
                        handleSelectAll={this.props.handleSelectAll}
                        assignProjectModal={this.props.assignProjectModal}
                        recomentationIds={this.props.recomentationIds}
                        enableButton={tempIds && tempIds.length ? true : false}
                        idCount={tempIds.length}
                        unAassignContent={this.unAassignContent}
                        hasExport={checkPermission("forms", "recommendations", "export")}
                        showAddButton={checkPermission("forms", "recommendations", "create")}
                        hasEdit={!this.props.isImageView && !this.props.isAssetView && checkPermission("forms", "recommendations", "edit")}
                        hasDelete={!this.props.isAssetView && checkPermission("forms", "recommendations", "delete")}
                        hasInfoPage={checkPermission("forms", "recommendations", "view")}
                        entity="recommendations"
                        handleSelectRecom={this.handleSelectRecom}
                        handleSelectAllRecom={this.handleSelectAllRecom}
                        selectedRecomIds={selectedRecomIds}
                        isBudgetPriority={this.props.isBudgetPriority}
                        isFullscreen={this.props.isFullscreen}
                        handleFullView={this.props.handleFullView}
                        toggleSecondChartView={this.props.toggleSecondChartView}
                        tableRef={this.tableRef}
                        hasNewlyCreated={true}
                        hasNewlyEdited={true}
                        hasViewMyRecommendation={true}
                        hasViewExportModal={true}
                        hasFilterByImages={true}
                        hasFilterByWater={true}
                        hasFilterByEnergy={true}
                        hasFilterByFmp={true}
                        hasRecomTypeFilter={true}
                        hasFilterByBudgetPriority={true}
                        filterByBudgetPriority={this.filterByBudgetPriority}
                        filterByWater={this.filterByWater}
                        filterByEnergy={this.filterByEnergy}
                        filterByFmp={this.filterByFmp}
                        filterByRecomType={this.filterByRecomType}
                        filterBySurveyor={this.filterBySurveyor}
                        filterByImages={this.filterByImages}
                        filterByIR={this.filterByIR}
                        resetAll={this.resetAll}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        hasMultiAction={!this.props.isBudgetPriority && !this.props.isImageView && !this.props.isAssetView}
                        isAssetView={this.props.isAssetView}
                        handleEditMultiSelectedData={this.toggleMultiSelectEditForm}
                        showSelectedRecom={this.showSelectedRecom}
                        clearSelection={this.clearSelection}
                        everyItemCheckedPerPage={tableData?.data?.every(item => selectedRecomIds.includes(item.id))}
                        selectWholeRecommendation={this.selectWholeRecommendation}
                        hasIrRecommendation={true}
                        priorityElementsData={priorityElementsData}
                        exportSelectedRecom={this.exportSelectedRecom}
                        multiExportPdfLoader={multiExportPdfLoader}
                        multiExportWordLoader={multiExportWordLoader}
                        exportToWordFile={this.exportToWord}
                        exportToExcelFiles={this.exportToExcel}
                        exportWordLoading={exportWordLoading}
                        tableDataExportFilters={tableDataExportFilters}
                        isInputMode={isInputMode}
                        handleCellFocus={this.handleCellFocus}
                        handleCellValueChange={this.handleCellValueChange}
                        lineEditingEnabled={lineEditingEnabled}
                        toggleLineEditing={this.toggleLineEditing}
                        handleColumnPin={this.handleColumnPin}
                        pinnedColumnsRef={this.pinnedColumnsRef}
                    />
                )}

                {this.renderConfirmationModal()}
                {this.renderRestoreConfirmationModal()}
                {this.renderCutPasteConfirmationModal()}
                {this.renderConfirmationModalLog()}
                {this.renderConfirmationModalUnassign()}
                {this.renderMultiSelectEditForm()}
                {this.renderHardDeleteConfirmationModal()}
                {showViewModal ? (
                    <Portal
                        body={
                            <ViewModal
                                keys={tableData.keys}
                                config={tableData.config}
                                tableData={tableData}
                                handleHideColumn={this.handleHideColumn}
                                onCancel={() => this.setState({ showViewModal: false })}
                            />
                        }
                        onCancel={() => this.setState({ showViewModal: false })}
                    />
                ) : null}
                {showViewModalExport ? (
                    <Portal
                        body={
                            <ViewExportModal
                                keys={tableData.keys}
                                config={tableData.config}
                                tableData={tableData}
                                handleHideColumn={this.handleHideColumn}
                                onCancel={() => this.setState({ showViewModalExport: false })}
                            />
                        }
                        onCancel={() => this.setState({ showViewModalExport: false })}
                    />
                ) : null}
                {/* {showViewImport ? (
                    <Portal
                        body={
                            <ViewImportModal
                                // handleHideColumn={this.handleHideColumn}
                                onCancel={() => this.setState({ showViewImport: false })}
                            />
                        }
                        onCancel={() => this.setState({ showViewImport: false })}
                    />
                ) : null} */}
                {showAssignConsultancyUsers ? (
                    <Portal
                        body={
                            <AssignConsultancyUserModal
                                onCancel={() => this.setState({ showAssignConsultancyUsers: false })}
                                userList={consultancy_users}
                            />
                        }
                        onCancel={() => this.setState({ showAssignConsultancyUsers: false })}
                    />
                ) : null}
                {showAssignClientUsers ? (
                    <Portal
                        body={<AssignClientUserModal onCancel={() => this.setState({ showAssignClientUsers: false })} userList={clients} />}
                        onCancel={() => this.setState({ showAssignClientUsers: false })}
                    />
                ) : null}
                {showCutPasteModal ? (
                    <Portal
                        body={
                            <CutPasteModal
                                HandleCutPasteSubmit={this.ShowCutPasteModalConfirm}
                                startYear={this.state.selectedYear}
                                maintenance_years={this.state.maintenance_years}
                                onCancel={this.toggleShowCutPasteModal}
                            />
                        }
                        onCancel={this.toggleShowCutPasteModal}
                    />
                ) : null}
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { recommendationsReducer, initativeReducer, siteReducer, buildingReducer, commonReducer, regionReducer, projectReducer } = state;
    return { recommendationsReducer, initativeReducer, siteReducer, buildingReducer, commonReducer, regionReducer, projectReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...recommendationsActions,
        ...siteActions,
        ...buildingActions,
        ...CommonActions,
        ...regionActions,
        ...projectAction,
        ...initativeAction
    })(index)
);
