import React, { Component } from "react";
import { connect } from "react-redux";
import _, { delay } from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../common/components/Loader";
import CommonActions from "../common/actions";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import BuildingModal from "./components/BuildingModal";
import ViewModal from "../common/components/ViewModal";
import AssignConsultancyUserModal from "./components/AssignConsultancyUserModal";
import AssignClientUserModal from "./components/AssignClientUserModal";
import buildingActions from "./actions";
import projectActions from "../project/actions";
import siteActions from "../site/actions";
import BuildingMain from "./components/BuildingMain";
import Form from "./components/Form";
import { buildingTableData } from "../../config/tableData";
import BuildingInfo from "./components/BuildingInfo";
import EfciInfo from "./components/EfciInfo";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrumpRecData,
    findPrevPathFromBreadCrump,
    popBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    checkPermission
} from "../../config/utils";

class Index extends Component {
    constructor(props) {
        super(props);
        const {
            location: { search = "" }
        } = this.props;
        this.state = {
            isLoading: true,
            loading: true,
            errorMessage: "",
            buildingList: [],
            efciLog: [],
            refreshData: false,
            sortData: false,
            paginationParams: this.props.buildingReducer.entityParams.paginationParams,
            currentViewAllUsers: null,
            currentActions: null,
            showBuildingModal: false,
            showViewModal: false,
            tableLoading: false,
            showWildCardFilter: false,
            showAssignConsultancyUsers: false,
            filterValues: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true },
            clients: [],
            regionList: [],
            consultancy_users: [],
            efciBuildingData: {},
            selectedRowId: this.props.buildingReducer.entityParams.selectedRowId,
            params: this.props.buildingReducer.entityParams.params,
            selectedClient: {},
            selectedBuilding: this.props.match.params.id || this.props.buildingReducer.entityParams.selectedEntity,
            tableData: {
                keys: buildingTableData.keys,
                config: this.props.buildingReducer.entityParams.tableConfig || _.cloneDeep(buildingTableData.config)
            },
            breadCrumbsData: [{ key: "main", name: "Regions", path: "/region" }],
            infoTabsData: [],
            wildCardFilterParams: this.props.buildingReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.buildingReducer.entityParams.filterParams,
            alertMessage: "",
            hiddenFundingOptionList: [],
            hideFundingOptionSiteList: [],
            summaryRowData: {
                cost_total: "",
                total_sf: "",
                crv_total: ""
            },
            historyPaginationParams: this.props.buildingReducer.entityParams.historyPaginationParams,
            historyParams: this.props.buildingReducer.entityParams.historyParams,
            building_ids: this.props.buildingReducer.entityParams.building_ids,
            start_year: this.props.buildingReducer.entityParams.start_year,
            end_year: this.props.buildingReducer.entityParams.end_year,
            isDashboard: this.props.buildingReducer.entityParams.isDashboard,
            logData: {
                count: "",
                data: []
            },
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            permissions: {},
            logPermission: {},
            imageResponse: [],
            logPaginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            logParams: {
                limit: 40,
                offset: 0
            },
            loghistoryPaginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            dashboardFilterParams: this.props.buildingReducer.entityParams.dashboardFilterParams
        };
        this.exportTableXl = this.exportTableXl.bind(this);
        this.updateBuildingEfciLock = this.updateBuildingEfciLock.bind(this);
    }

    componentDidMount = async () => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;

        await this.refreshBuildingList();
        if (tab === "efci" || "dashboard") {
            this.getColorCode();
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const siteId = this.props.match.params.id;
        if (this.props.location.search !== prevProps.location.search || this.props.match.params.id !== prevProps.match.params.id) {
            await this.refreshBuildingList(); // activated for building efci chartview
            await this.getSiteEfciByBuilding();
            await this.refreshEfciBuildingData(); // activated for building efci chartview
        }
        if (prevProps.match.params.tab !== tab) {
            this.setState({
                efciLoading: true
            });
            await this.refreshEfciBuildingData();
            await this.getSiteEfciByBuilding();
            this.setState({
                efciLoading: false
            });
        }
        if (
            prevProps.buildingReducer.entityParams.building_ids !== this.props.buildingReducer.entityParams.building_ids ||
            prevProps.buildingReducer.entityParams.dashboardFilterParams !== this.props.buildingReducer.entityParams.dashboardFilterParams
        ) {
            this.setState(
                {
                    building_ids: this.props.buildingReducer.entityParams.building_ids,
                    dashboardFilterParams: this.props.buildingReducer.entityParams.dashboardFilterParams
                },
                async () => await this.refreshBuildingList()
            );
        }
        if (prevProps.match.params.tab !== tab && tab === "efci") {
            this.getColorCode();
        }
    };

    getColorCode = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        await this.props.getColorCodes(query.pid);
        const colorCodes =
            (this.props.projectReducer && this.props.projectReducer.getColorCodes && this.props.projectReducer.getColorCodes.color_codes) || [];
        this.setState({
            colorCodes: colorCodes
        });
    };

    loadData = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const buildingId = this.props.match.params.id;
        let params = {
            buildingId,
            projectId: query.pid
        };
        await this.props.loadChartDataBuilding(params);
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    saveData = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const buildingId = this.props.match.params.id;
        let params = {
            buildingId,
            projectId: query.pid
        };
        await this.props.saveDataEfciChartBuilding(params);
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    refreshBuildingList = async () => {
        await this.setState({ isLoading: true });
        const { paginationParams, tableData, dashboardFilterParams } = this.state;

        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        }

        const {
            match: {
                params: { section, id: siteId }
            },
            location: { search }
        } = this.props;
        await this.setState({
            params: {
                ...this.state.params,
                project_id: this.props.projectId || null,
                building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
                region_id: this.props.regionId || null
            }
        });

        if (this.props.clientId && (section === "energyinfo" || section === "assetinfo")) {
            await this.setState({
                params: {
                    ...this.state.params,
                    client_id: this.props.clientId
                }
            });
        }

        // await this.props.getAllConsultancyUsers();
        // await this.props.getAllClients();
        // await this.props.getMenuItems();

        const query = qs.parse(search);
        if (query.pid && query.pid.trim().length) {
            this.setInFoPage(this.props.match.params.id);
            this.setState({
                params: {
                    ...this.state.params,
                    project_id: query.pid || null
                }
            });
            const buildingId = this.props.match.params.id;
            let chartParams = {
                buildingId: buildingId,
                projectId: query.pid
            };
            await this.props.getMiscSettings(query.pid);
            await this.props.getChartsBuilding(chartParams, this.state.filterValues);
            await this.refreshEfciBuildingData();
        }

        // using same componet for site mangement and site listing in info page
        let buildingList = [];
        let totalCount = 0;
        let cost_total = "";
        let crv_total = "";
        let total_sf = "";
        // if (this.props.buildingReducer.entityParams.building_ids) {
        //     await this.props.getAllBuildings({
        //         ...this.state.params,
        //         building_ids: this.props.buildingReducer.entityParams.building_ids || null
        //     });
        // }
        if (section === "siteinfo") {
            await this.props.getBuildingsBasedOnSite(siteId, this.state.params);
            buildingList = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.buildings || []
                : [];
            totalCount = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.count || 0
                : 0;
            cost_total = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.cost_total || 0
                : 0;
            crv_total = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.crv_total || 0
                : 0;
            total_sf = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.total_sf || 0
                : 0;
        } else if (section === "userinfo") {
            const { limit, offset, search, filters, list, order } = this.state.params;
            let user_id = this.props.match.params.id;
            let userParams = {
                limit,
                offset,
                search,
                filters,
                list,
                order,
                user_id
            };
            await this.props.getAllBuildings(userParams);
            buildingList = this.props.buildingReducer.getAllBuildingsResponse
                ? this.props.buildingReducer.getAllBuildingsResponse.buildings || []
                : [];
            totalCount = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.count || 0 : 0;
            cost_total = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.cost_total || 0 : 0;
            crv_total = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.crv_total || 0 : 0;
            total_sf = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.total_sf || 0 : 0;
        } else {
            await this.props.getAllBuildings({
                ...this.state.params,
                ...(isDashboardFiltered && { ...dashboardFilterParams })
            });
            buildingList = this.props.buildingReducer.getAllBuildingsResponse
                ? this.props.buildingReducer.getAllBuildingsResponse.buildings || []
                : [];
            totalCount = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.count || 0 : 0;
            cost_total = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.cost_total || 0 : 0;
            crv_total = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.crv_total || 0 : 0;
            total_sf = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.total_sf || 0 : 0;
        }

        const {
            buildingReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            }
        } = this.props;

        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.buildings
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.buildings || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.building_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.building_logs || {}
                : {};
        // go to previous page is the last record of the current page is deleted
        if (buildingList && !buildingList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...this.state.params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            if (section === "siteinfo") {
                await this.props.getBuildingsBasedOnSite(siteId, this.state.params);
                buildingList = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                    ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.buildings || []
                    : [];
                totalCount = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                    ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.count || 0
                    : 0;
                cost_total = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                    ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.cost_total || 0
                    : 0;
                crv_total = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                    ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.crv_total || 0
                    : 0;
                total_sf = this.props.buildingReducer.getBuildingsBasedOnSiteResponse
                    ? this.props.buildingReducer.getBuildingsBasedOnSiteResponse.total_sf || 0
                    : 0;
            } else {
                await this.props.getAllBuildings(this.state.params);
                buildingList = this.props.buildingReducer.getAllBuildingsResponse
                    ? this.props.buildingReducer.getAllBuildingsResponse.buildings || []
                    : [];
                totalCount = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.count || 0 : 0;
                cost_total = this.props.buildingReducer.getAllBuildingsResponse
                    ? this.props.buildingReducer.getAllBuildingsResponse.cost_total || 0
                    : 0;
                crv_total = this.props.buildingReducer.getAllBuildingsResponse
                    ? this.props.buildingReducer.getAllBuildingsResponse.crv_total || 0
                    : 0;
                total_sf = this.props.buildingReducer.getAllBuildingsResponse ? this.props.buildingReducer.getAllBuildingsResponse.total_sf || 0 : 0;
            }
        }

        if (
            buildingList &&
            !buildingList.length &&
            this.props.buildingReducer.getAllBuildingsResponse &&
            this.props.buildingReducer.getAllBuildingsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.buildingReducer.getAllBuildingsResponse.error });
            this.showAlerts();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: buildingList,
                config: this.props.buildingReducer.entityParams.tableConfig || tableData.config
            },
            summaryRowData: {
                ...this.state.summaryRowData,
                cost_total,
                crv_total,
                total_sf
            },
            buildingList,
            paginationParams: {
                ...paginationParams,
                totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            clients,
            consultancy_users,
            showWildCardFilter: this.state.params.filters ? true : false,
            permissions: project_permission,
            logPermission: region_logs,
            isLoading: false
        });
        this.updateEntityParams();
        return true;
    };

    updateWildCardFilter = async newFilter => {
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                filters: newFilter
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        await this.refreshBuildingList();
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

    updateEntityParams = async () => {
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        }
        let entityParams = {
            entity: "Building",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            building_ids: isDashboardFiltered ? this.state.building_ids : null,
            start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
            end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
            isDashboardFiltered,
            dashboardFilterParams: this.state.dashboardFilterParams
        };
        await this.props.updateBuildingEntityParams(entityParams);
    };

    resetAllFilters = async () => {
        await this.setState({
            selectedRegion: null,
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 100,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,
                list: null
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshBuildingList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshBuildingList();
    };
    resetAll = async () => {
        await this.setState({
            selectedRegion: null,
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 100,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,

                order: null,
                list: null
            },
            tableData: {
                ...this.state.tableData,
                config: _.cloneDeep(buildingTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshBuildingList();
    };

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        const project_id = this.state.project_id;
        const {
            match: {
                params: { id: siteId, section }
            }
        } = this.props;

        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        }
        if (section === "userinfo") {
            params.search = search;
            params.filters = filters;
            params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
            params.user_id = siteId;
            await this.props.getListForCommonFilterbuilding(params);
        } else if (section === "projectinfo") {
            params.search = search;
            params.filters = filters;
            params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
            params.project_id = siteId;
            params.building_ids = (isDashboardFiltered ? this.state.building_ids : null) || null;
            params.start_year = (isDashboardFiltered ? this.state.start_year : null) || null;
            params.end_year = (isDashboardFiltered ? this.state.end_year : null) || null;
            await this.props.getListForCommonFilterbuilding({ ...params, ...(isDashboardFiltered && { ...this.state.dashboardFilterParams }) });
        } else if (section === "siteinfo") {
            params.search = search;
            params.filters = filters;
            params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
            params.project_id = project_id;
            params.site_id = siteId;
            params.building_ids = (isDashboardFiltered ? this.state.building_ids : null) || null;
            params.start_year = (isDashboardFiltered ? this.state.start_year : null) || null;
            params.end_year = (isDashboardFiltered ? this.state.end_year : null) || null;
            await this.props.getListForCommonFilterbuilding(params);
        } else if (section === "energyinfo" || section === "assetinfo") {
            params.search = search;
            params.filters = filters;
            params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
            params.client_id = this.props.clientId;
            params.start_year = (isDashboardFiltered ? this.state.start_year : null) || null;
            params.end_year = (isDashboardFiltered ? this.state.end_year : null) || null;
            await this.props.getListForCommonFilterbuilding(params);
        } else {
            params.search = search;
            params.filters = filters;
            params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
            params.project_id = project_id;
            params.region_id = siteId;
            params.building_ids = (isDashboardFiltered ? this.state.building_ids : null) || null;
            params.start_year = (isDashboardFiltered ? this.state.start_year : null) || null;
            params.end_year = (isDashboardFiltered ? this.state.end_year : null) || null;
            await this.props.getListForCommonFilterbuilding(params);
        }
        return (this.props.buildingReducer.getListForCommonFilterResponse && this.props.buildingReducer.getListForCommonFilterResponse.list) || [];
    };

    updateCommonFilter = async commonFilters => {
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                list: commonFilters
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        await this.refreshBuildingList();
    };

    updateTableSortFilters = async searchKey => {
        if (this.state.params.order) {
            await this.setState({
                params: {
                    ...this.state.params,
                    order: {
                        ...this.state.params.order,
                        [searchKey]: this.state.params.order[searchKey] === "desc" ? "asc" : "desc"
                    }
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
        this.updateEntityParams();
        this.refreshBuildingList();
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
        await this.refreshBuildingList();
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
        await this.refreshBuildingList();
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

    showBuildingModal = buildingId => {
        this.setState({
            showBuildingModal: true,
            selectedBuilding: buildingId
        });
    };

    showEditPage = buildingId => {
        const selectedproject = this.props.match.params.id;
        const { history } = this.props;
        this.setState({
            selectedBuilding: buildingId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Building",
            path: `/building/edit/${buildingId}`
        });
        this.updateEntityParams();
        history.push(`/building/edit/${buildingId}?p_id=${selectedproject}`);
    };

    showAddForm = () => {
        const selectedproject = this.props.match.params.id;
        let selectedSite = "";
        let selectedClient = "";
        let selectedRegion = "";
        let selectedConsultancy = "";
        let consultancyUsers = [];

        if (this.props.basicDetails) {
            selectedClient = this.props.basicDetails.client && this.props.basicDetails.client.id;
            selectedConsultancy = this.props.basicDetails.consultancy && this.props.basicDetails.consultancy.id;
        }
        if (this.props.regionId) {
            selectedRegion = this.props.regionId;
        }
        if (this.props.siteId) {
            selectedRegion = this.props.basicDetails?.region?.id;
            selectedSite = this.props.siteId;
            consultancyUsers = this.props.basicDetails.users;
        }
        const { history } = this.props;
        this.setState({
            selectedRegion: null
        });
        addToBreadCrumpData({ key: "add", name: "Add Building", path: "/building/add" });
        if (selectedproject) {
            history.push(
                `/building/add?s_id=${selectedSite}&r_id=${selectedRegion}&c_id=${selectedClient}&cty_id=${selectedConsultancy}&p_id=${selectedproject}`,
                {
                    consultancy_users: consultancyUsers
                }
            );
        } else {
            history.push("/building/add");
        }
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    updateBuildingEfciLock = async lock => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            isLoading: true
        });
        if (tab === "dashboard" || tab === "efcisandbox") {
            let params = {
                buildingId: this.props.match.params.id,
                projectId: query.pid
            };
            await this.props.dashboardBuildingLock(params, { lock });
        } else {
            await this.props.updateBuildingLock(this.props.match.params.id, {
                building_id: this.props.match.params.id,
                project_id: query.pid,
                lock: lock
            });
        }
        this.setState({
            isLoading: false
        });
        await this.refreshEfciBuildingData();
        // await this.getDataById(this.props.match.params.id);
        this.setState({ refreshData: !this.state.refreshData });
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    handleAssignConsultancyUsersModal = async () => {
        await this.setState({
            showAssignConsultancyUsers: true
        });
    };

    handleAssignClientUsersModal = async () => {
        await this.setState({
            showAssignClientUsers: true
        });
    };

    handleAddBuilding = async building => {
        const { history } = this.props;
        await this.props.addBuilding(building);
        this.setState({
            isLoading: true
        });
        if (this.props.buildingReducer.addBuildingResponse && this.props.buildingReducer.addBuildingResponse.error) {
            await this.setState({
                alertMessage: this.props.buildingReducer.addBuildingResponse.error
            });
            this.showAlerts();
        } else {
            // await this.props.getMenuItems();
            await this.setState({
                alertMessage: this.props.buildingReducer.addBuildingResponse && this.props.buildingReducer.addBuildingResponse.message
            });
            await this.refreshBuildingList();
            this.setState({
                isLoading: false
            });
            this.showAlerts();
            history.push(findPrevPathFromBreadCrump() || "/building");
        }
        this.setState({
            isLoading: false
        });
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, buildingTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    showAlerts = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    handleUpdateBuilding = async (building, isMap = false) => {
        const { history } = this.props;
        const { selectedBuilding } = this.state;
        this.setState({
            isLoading: true
        });
        await this.props.updateBuilding(building, this.props.match.params.id || selectedBuilding);
        if (this.props.buildingReducer.updateBuildingResponse && this.props.buildingReducer.updateBuildingResponse.error) {
            await this.setState({ alertMessage: this.props.buildingReducer.updateBuildingResponse.error });
            this.showAlerts();
        } else {
            await this.setState({
                alertMessage: this.props.buildingReducer.updateBuildingResponse && this.props.buildingReducer.updateBuildingResponse.message,
                currentActions: null
            });
            // await this.props.getMenuItems();
            await this.refreshBuildingList();
            this.showAlerts();
            if (!isMap) {
                history.push(findPrevPathFromBreadCrump() || "/building");
            }
        }
        this.setState({
            isLoading: false
        });
    };

    updateRegionsBasedOnClient = async clientData => {
        await this.props.getRegionsBasedOnClient(clientData.value);
        this.setState({
            regionList: _.map(this.props.buildingReducer.getRegionsBasedOnClientResponse.regions, ({ name, id }) => {
                return {
                    label: name,
                    value: id
                };
            }),
            selectedClient: clientData
        });
    };

    renderBuildingModal = () => {
        const { showBuildingModal, selectedBuilding, regionList, selectedClient } = this.state;
        if (!showBuildingModal) return null;
        return (
            <Portal
                body={
                    <BuildingModal
                        selectedBuilding={selectedBuilding}
                        handleAddBuilding={this.handleAddBuilding}
                        handleUpdateBuilding={this.handleUpdateBuilding}
                        updateRegionsBasedOnClient={this.updateRegionsBasedOnClient}
                        regionList={regionList}
                        selectedClient={selectedClient}
                        onCancel={() => this.setState({ showBuildingModal: false })}
                    />
                }
                onCancel={() => this.setState({ showBuildingModal: false })}
            />
        );
    };

    handleDeleteBuilding = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedBuilding: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this building?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteBuildingOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteBuildingOnConfirm = async () => {
        const { selectedBuilding } = this.state;
        const { history } = this.props;
        this.setState({
            isLoading: true,
            showConfirmModal: false
        });
        await this.props.deleteBuilding(selectedBuilding);
        if (this.props.buildingReducer.deleteBuildingResponse && this.props.buildingReducer.deleteBuildingResponse.error) {
            await this.setState({ alertMessage: this.props.buildingReducer.deleteBuildingResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlerts();
        } else {
            // await this.props.getMenuItems();
            await this.refreshBuildingList();
            this.setState({
                isLoading: false
            });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData());
            }
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
                search
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        await this.refreshBuildingList();
    };

    getDataById = async buildingId => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        // await this.props.getBuildingById(buildingId);
        await this.props.getBuildingById(buildingId, query.pid);

        await this.getSiteEfciByBuilding();
        return true;
    };

    getSiteEfciByBuilding = async params => {
        const {
            location: { search }
        } = this.props;

        const site =
            this.props.buildingReducer &&
            this.props.buildingReducer.getBuildingByIdResponse &&
            this.props.buildingReducer.getBuildingByIdResponse.site &&
            this.props.buildingReducer.getBuildingByIdResponse.site;
        const query = qs.parse(search);
        if (site && site.id) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getChartEfci(site.id, { project_id: query.pid }, params);
                await this.setState({
                    efciSiteData: this.props.siteReducer.getEfciBySiteGraph ? this.props.siteReducer.getEfciBySiteGraph.site || {} : {}
                });
            } else if (tab == "efci") {
                await this.props.getEfciBySite(site.id, { project_id: query.pid });
                await this.setState({
                    efciSiteData: this.props.siteReducer.getEfciBySite ? this.props.siteReducer.getEfciBySite.site || {} : {}
                });
            }
        }
    };

    setInFoPage = buildingId => {
        const {
            location: { search },
            match: {
                params: { section, id }
            }
        } = this.props;

        const query = qs.parse(search);
        if (section === "projectinfo") {
            query.pid = id;
        }

        let tempSearch = "?" + qs.stringify(query);
        this.setState({
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Building",
                    path: `/building/buildinginfo/${buildingId}/basicdetails${tempSearch}`
                },
                {
                    key: "buildingAddition",
                    name: "Additions",
                    path: `/building/buildinginfo/${buildingId}/buildingAddition${tempSearch}`
                },
                {
                    key: "floors",
                    name: "Floors",
                    path: `/building/buildinginfo/${buildingId}/floors${tempSearch}`
                },
                {
                    key: "recommendations",
                    name: "Recommendations",
                    path: `/building/buildinginfo/${buildingId}/recommendations${tempSearch}`
                },
                {
                    key: "infoimages",
                    name: "Images",
                    path: `/building/buildinginfo/${buildingId}/infoimages${tempSearch}`
                },
                {
                    key: "infomap",
                    name: "Map",
                    path: `/building/buildinginfo/${buildingId}/infomap${tempSearch}`
                },
                {
                    key: "dashboard",
                    name: "Charts & Graphs",
                    path: `/building/buildinginfo/${buildingId}/dashboard${tempSearch}`,
                    show: checkPermission("charts_and_graph", "building", "view")
                },
                {
                    key: "efcisandbox",
                    name: "EFCI Sandbox",
                    path: `/building/buildinginfo/${buildingId}/efcisandbox${tempSearch}`
                },
                {
                    key: "efci",
                    name: "EFCI",
                    path: `/building/buildinginfo/${buildingId}/efci${tempSearch}`
                },
                // {
                //     key: "reports",
                //     name: "Reports",
                //     path: `/building/buildinginfo/${buildingId}/reports/specialReports${tempSearch}`,
                //     bcName: "Special Reports"
                // },
                {
                    key: "softCosts",
                    name: "Soft Costs",
                    path: `/building/buildinginfo/${buildingId}/softCosts${tempSearch}`
                },
                {
                    key: "documents",
                    name: "Documents",
                    path: `/building/buildinginfo/${buildingId}/documents${tempSearch}`
                }
            ]
        });
    };

    showInfoPage = siteId => {
        const { history } = this.props;
        const {
            location: { search },
            match: {
                params: { section, id, tab, subTab }
            }
        } = this.props;

        const query = qs.parse(search);
        if (section === "projectinfo") {
            query.pid = id;
        }

        let tempSearch = "?" + qs.stringify(query);
        if (query.pid && query.pid.trim().length) {
            this.setInFoPage(this.props.match.params.id);
        } else {
            this.setState({
                selectedSite: siteId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Building",
                        path: `/building/buildinginfo/${siteId}/basicdetails${tempSearch}`
                    },
                    {
                        key: "buildingAddition",
                        name: "Additions",
                        path: `/building/buildinginfo/${siteId}/buildingAddition${tempSearch}`
                    },
                    {
                        key: "floors",
                        name: "Floors",
                        path: `/building/buildinginfo/${siteId}/floors${tempSearch}`
                    },
                    {
                        key: "infoimages",
                        name: "Images",
                        path: `/building/buildinginfo/${siteId}/infoimages${tempSearch}`
                    },
                    // {
                    //     key: "dashboard",
                    //     name: "Charts & Graphs",
                    //     path: `/building/buildinginfo/${siteId}/dashboard${search}`
                    // },
                    { key: "infomap", name: "Map", path: `/building/buildinginfo/${siteId}/infomap${tempSearch}` },
                    {
                        key: "softCosts",
                        name: "Soft Costs",
                        path: `/building/buildinginfo/${siteId}/softCosts${tempSearch}`
                    },
                    {
                        key: "documents",
                        name: "Documents",
                        path: `/building/buildinginfo/${siteId}/documents${tempSearch}`
                    }
                ]
            });
        }

        let tabKeyList = [];

        const tabFilter = JSON.parse(sessionStorage.getItem("bc-data"))[0].name;

        if (tabFilter === "Energy Management") {
            tabKeyList = ["basicdetails", "Electricity", "Water", "Gas", "Sewer", "energyStar"];
            this.setState({
                selectedSite: siteId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Building",
                        path: `/building/buildinginfo/${siteId}/basicdetails${tempSearch}`
                    },

                    {
                        key: "Electricity",
                        name: "Electricity",
                        path: `/building/buildinginfo/${siteId}/Electricity${tempSearch}`
                    },
                    {
                        key: "Gas",
                        name: "Gas",
                        path: `/building/buildinginfo/${siteId}/Gas${tempSearch}`
                    },
                    {
                        key: "Water",
                        name: "Water",
                        path: `/building/buildinginfo/${siteId}/Water${tempSearch}`
                    },

                    {
                        key: "Sewer",
                        name: "Sewer",
                        path: `/building/buildinginfo/${siteId}/Sewer${tempSearch}`
                    },
                    {
                        key: "energyStarRating",
                        name: "Energy Star",
                        path: `/building/buildinginfo/${siteId}/energyStarRating${tempSearch}`,
                        bcName: "energyStarRating"
                    },
                    {
                        key: "energydashboard",
                        name: "Charts & Graphs",
                        path: `/building/buildinginfo/${siteId}/energydashboard`
                    },
                    {
                        key: "energyStar",
                        name: "Portfolio Manager",
                        path: `/building/buildinginfo/${siteId}/energyStar`
                    }
                ]
            });
        } else if (tabFilter === "Asset Management") {
            tabKeyList = ["basicdetails", "assets", "assetcharts"];
            this.setState({
                selectedSite: siteId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Building",
                        path: `/building/buildinginfo/${siteId}/basicdetails${tempSearch}`
                    },

                    {
                        key: "assets",
                        name: "Assets",
                        path: `/building/buildinginfo/${siteId}/assets${tempSearch}`
                    },
                    {
                        key: "assetcharts",
                        name: "Charts & Graphs",
                        path: `/building/buildinginfo/${siteId}/assetcharts`
                    }
                ]
            });
        } else {
            tabKeyList = [
                "basicdetails",
                "buildingAddition",
                "floors",
                "infoimages",
                "infomap",
                "efci",
                "efcisandbox",
                "recommendations",
                "dashboard",
                "reports",
                "softCosts",
                "documents"
            ];
        }
        let path = `/building/buildinginfo/${siteId}/${
            this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
        }`;

        path += tab === "reports" ? `${subTab ? `/${subTab}` : ""}` : "";

        history.push(`${path}${tempSearch}`);
    };

    uploadImages = async (imageData = {}) => {
        const { selectedBuilding } = this.state;
        await this.props.uploadBuildingImage(imageData, selectedBuilding || this.props.match.params.id);
        await this.getAllImageList(selectedBuilding);
        return true;
    };

    deleteImages = async imageId => {
        const { selectedBuilding } = this.state;
        await this.props.deleteBuildingImage(imageId);
        await this.getAllImageList(selectedBuilding);
        return true;
    };

    getAllImageList = async (regionId, params) => {
        await this.props.getAllBuildingImages(regionId, params);
        const {
            buildingReducer: { getAllImagesResponse }
        } = this.props;
        await this.setState({
            imageResponse: getAllImagesResponse
        });
        return true;
    };

    updateBuildingImageComment = async imageData => {
        const { selectedBuilding } = this.state;
        await this.props.updateBuildingImageComment(imageData);
        await this.getAllImageList(selectedBuilding);
        return true;
    };

    refreshEfciBuildingData = async () => {
        const {
            location: { search }
        } = this.props;
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        const query = qs.parse(search);
        if (query.pid) {
            if (tab === "dashboard" || tab === "efcisandbox") {
                let chartParams = {
                    buildingId: this.props.match.params.id,
                    projectId: query.pid
                };
                await this.props.getChartEfciBuilding(chartParams);
                await this.setState({
                    efciBuildingData: this.props.buildingReducer.getEfciByBuildingGraph
                        ? this.props.buildingReducer.getEfciByBuildingGraph.building || {}
                        : {},
                    loading: false,
                    isLoading: false
                });
            } else if (tab == "efci") {
                await this.props.getEfciBasedOnProject(query.pid, this.props.match.params.id);
                await this.setState({
                    efciBuildingData: this.props.buildingReducer.getEfciBasedOnProject
                        ? this.props.buildingReducer.getEfciBasedOnProject.building || {}
                        : {},
                    loading: false
                });
            }
        }
    };

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateAnnualEfciCalculationSite = async (id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            f_o.annual_efcis.map(aEfci => {
                if (aEfci.id === id) {
                    aEfci.value = value;
                }
            });
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateFcisSite = async (id, fci) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateAnnualEfciChart(id, fci);
        } else {
            await this.props.updateAnnualEfci(id, fci);
        }
        await this.getSiteEfciByBuilding();
        await this.refreshEfciBuildingData();
    };

    updateAnnualFundingOptionCalculationSite = async (id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            f_o.annual_funding_options.map(afo => {
                if (afo.id === id) {
                    afo.amount = value;
                }
            });
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateAnnualFundingOptionSite = async (id, amount) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;

        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateAnnualFundingChart(id, amount);
        } else {
            await this.props.updateAnnualFunding(id, amount);
        }
        await this.getSiteEfciByBuilding();
        await this.refreshEfciBuildingData();
    };

    updateProjectAnnualFundingSite = async (id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            if (f_o.id === id) {
                f_o.funding_cost = value;
            }
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateSiteFundingOptionSite = async (id, fundingCost) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateFundingOptionChart(id, fundingCost);
        } else {
            await this.props.updateFundingOption(id, fundingCost);
        }
        await this.getSiteEfciByBuilding();
        await this.refreshEfciBuildingData();
    };

    updateEfciInInitialFundingOptionsSite = async (efci_id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            if (f_o.efci_id === efci_id) {
                f_o.efci = value;
            }
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateFundingEfciData = async (id, value) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateFundingSiteEfciChart(id, value.value);
        } else {
            await this.props.updateFundingSiteEfci(id, value.value);
        }
        await this.getSiteEfciByBuilding();
        await this.refreshEfciBuildingData();
    };

    updateTotalProjectFundingSite = async (id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            if (f_o.id === id) {
                f_o.expected_cost = value;
            }
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateCapitalSpendingPercent = async (id, value) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateCapitalSpendingPlanChart(id, { percentage: value || 0 });
        } else {
            await this.props.updateCapitalSpendingPercentage(id, { percentage: value || 0 });
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    updateAnnualFundingOptions = async (id, annualFundingOption) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;

        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateAnnualFundingChart(id, annualFundingOption);
        } else {
            await this.props.updateAnnualFundingOption(id, annualFundingOption);
        }
        await this.sleep(2000);
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    updateFcis = async (id, fci) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateAnnualEfciChart(id, fci);
        } else {
            await this.props.updateFci(id, fci);
        }
        await this.sleep(2000);
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    updateFundingOption1 = async (id, fundingCost) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateFundingOptionChart(id, fundingCost);
        } else {
            await this.props.updateFundingCost(id, fundingCost);
        }
        await this.sleep(2000);
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    updateFundingOptionEfci = async (id, fundingEfci) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateFundingSiteEfciChart(id, fundingEfci.value);
        } else {
            await this.props.updateFundingEfci(id, fundingEfci);
        }
        await this.sleep(2000);
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    updateFundingPercentage = async (id, value) => {
        let tempEfciBuildingData = this.state.efciBuildingData;
        tempEfciBuildingData.capital_spending_plans.map(csp => {
            csp.fundings.map(funding => {
                if (funding.id === id) {
                    funding.percentage = value;
                }
            });
        });
        await this.setState({
            efciBuildingData: tempEfciBuildingData
        });
    };

    updateProjectAnnualFunding = async (id, value) => {
        let tempEfciBuildingData = this.state.efciBuildingData;
        tempEfciBuildingData.funding_options.map(f_o => {
            if (f_o.id === id) {
                f_o.funding_cost = value;
            }
        });
        await this.setState({
            efciBuildingData: tempEfciBuildingData
        });
    };

    updateEfciInInitialFundingOptions = async (efci_id, value) => {
        let tempEfciBuildingData = this.state.efciBuildingData;
        tempEfciBuildingData.funding_options.map(f_o => {
            if (f_o.efci_id === efci_id) {
                f_o.efci = value;
            }
        });
        await this.setState({
            efciBuildingData: tempEfciBuildingData
        });
    };

    updateTotalProjectFunding = async (id, value) => {
        let tempEfciBuildingData = this.state.efciBuildingData;
        tempEfciBuildingData.funding_options.map(f_o => {
            if (f_o.id === id) {
                f_o.expected_cost = value;
            }
        });
        await this.setState({
            efciBuildingData: tempEfciBuildingData
        });
    };

    updateAnnualFundingOptionCalculation = async (id, value) => {
        let tempEfciBuildingData = this.state.efciBuildingData;
        tempEfciBuildingData.funding_options.map(f_o => {
            f_o.annual_funding_options.map(afo => {
                if (afo.id === id) {
                    afo.amount = value;
                }
            });
        });
        await this.setState({
            efciBuildingData: tempEfciBuildingData
        });
    };

    updateAnnualEfciCalculation = async (id, value) => {
        let tempEfciBuildingData = this.state.efciBuildingData;
        tempEfciBuildingData.funding_options.map(f_o => {
            f_o.annual_efcis.map(aEfci => {
                if (aEfci.id === id) {
                    aEfci.value = value;
                }
            });
        });
        await this.setState({
            efciBuildingData: tempEfciBuildingData
        });
    };

    updateHiddenFundingOption = async hiddenFundingOptionList => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.hideFundingOptionChart(hiddenFundingOptionList);
        } else {
            await this.props.hideFundingOption(hiddenFundingOptionList);
        }
        await this.setState({
            hiddenFundingOptionList: this.props.buildingReducer.hiddenFundingOptionList || []
        });
    };

    hideFundingOptionSite = async hiddenFundingOptionList => {
        await this.props.hideFundingOptionBuildingSite(hiddenFundingOptionList);
        await this.setState({
            hideFundingOptionSiteList: this.props.buildingReducer.hideFundingOptionBuildingSite || []
        });
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section, tab }
            }
        } = this.props;
        const {
            location: { search }
        } = this.props;
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name === "Dashboard" ? true : false;
        }
        const query = qs.parse(search);
        await this.setState({ tableLoading: true });
        section === "siteinfo" && query.pid
            ? await this.props.exportBuildingsBySite({
                  project_id: query.pid,
                  site_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              })
            : // ----------------building export under project region-----
            section === "regioninfo" && query.pid
            ? await this.props.exportBuildingsBySite({
                  project_id: query.pid,
                  region_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              })
            : section === "regioninfo"
            ? await this.props.exportBuildings({
                  region_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              })
            : section === "siteinfo"
            ? await this.props.exportBuildingsUnderSite({
                  site_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              })
            : section === "userinfo"
            ? await this.props.exportBuildings({
                  user_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              })
            : section === "projectinfo"
            ? await this.props.exportBuildings({
                  project_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year,
                  ...(isDashboardFiltered && { ...this.state.dashboardFilterParams })
              })
            : section === "assetinfo"
            ? await this.props.exportBuildings({
                  client_id: this.props.clientId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              })
            : section === "energyinfo"
            ? await this.props.exportBuildings({
                  client_id: this.props.clientId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              })
            : await this.props.exportBuildings({
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              }); // sidemenu
        await this.setState({ tableLoading: false });
        if (this.props.buildingReducer.buildingExportResponse && this.props.buildingReducer.buildingExportResponse.error) {
            await this.setState({ alertMessage: this.props.buildingReducer.buildingExportResponse.error });
            this.showAlerts();
        }
    };

    getLogData = async buildingId => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllBuildingLogs(buildingId, historyParams);
        const {
            buildingReducer: {
                getAllBuildingLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.buildingReducer.getAllBuildingLogsResponse && this.props.buildingReducer.getAllBuildingLogsResponse.error) {
            await this.setState({ alertMessage: this.props.buildingReducer.getAllBuildingLogsResponse.error });
            this.showAlerts();
        } else {
            await this.setState({
                logData: {
                    ...this.state.logData,
                    data: logs
                },
                historyPaginationParams: {
                    ...this.state.historyPaginationParams,
                    totalCount: count,
                    totalPages: Math.ceil(count / this.state.historyPaginationParams.perPage)
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
                offset: page.selected * historyPaginationParams.perPage
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

    handleDeleteLog = async (id, choice) => {
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
        await this.props.deleteBuildingLog(selectedLog);
        if (this.props.buildingReducer.deleteBuildingLogResponse && this.props.buildingReducer.deleteBuildingLogResponse.error) {
            await this.setState({ alertMessage: this.props.buildingReducer.deleteBuildingLogResponse.error });
            this.showAlerts();
        }
        await this.getLogData(this.props.match.params.id);
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreBuildingLog(id);
        if (this.props.buildingReducer.restoreBuildingLogResponse && this.props.buildingReducer.restoreBuildingLogResponse.error) {
            await this.setState({ alertMessage: this.props.buildingReducer.restoreBuildingLogResponse.error });
            this.showAlerts();
        }
        await this.refreshBuildingList();
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

    getCSPLogs = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "cspLog",
            sortKey: sortKey,
            efciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getCapitalSpendingPlanByChartLogs(id, {
                // order: { [sortKey]: this.state.sortData ? "asc" : "desc" }
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs =
                (this.props.siteReducer &&
                    this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                    this.props.siteReducer.getCapitalSpendingPlanByChartLogs.logs) ||
                [];
            let totalCount =
                (this.props.siteReducer &&
                    this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                    this.props.siteReducer.getCapitalSpendingPlanByChartLogs.count) ||
                0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getCSPLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.buildingReducer && this.props.buildingReducer.getCSPLog.logs) || [];
            let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getCSPLog.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreCSP = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreCapitalSpendingPlanByChartLogs(id);
        } else {
            await this.props.restoreCSPLog(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    getFundingCostLogs = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "fundingCostLog",
            sortKey: sortKey,
            efciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getTotalFundingByChartLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });

            const logs = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getFundingCostLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });

            const logs = (this.props.buildingReducer && this.props.buildingReducer.getFundingCostLog.logs) || [];
            let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getFundingCostLog.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreFundingCostLog = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreFundingTotalByChartLogs(id);
        } else {
            await this.props.restoreFundingCost(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };
    // getFundingEfciLog
    // restoreFundingEfciLog
    getFundingCostEfciLogs = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "fundingCost",
            sortKey: sortKey,
            efciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getFundingSiteEfciByChartLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getFundingEfciLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.buildingReducer && this.props.buildingReducer.getFundingEfciLog.logs) || [];
            let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getFundingEfciLog.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreFundingCostEfciLog = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreFundingEfciByChartLogs(id);
        } else {
            await this.props.restoreFundingEfciLog(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };
    // getTotalFundingCostLog
    // restoreTotalFundingCost
    getTotalFundingCostEfciLogs = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "fundingCost",
            sortKey: sortKey,
            efciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getFundingOptionByChartLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs =
                (this.props.siteReducer &&
                    this.props.siteReducer.getFundingOptionByChartLog &&
                    this.props.siteReducer.getFundingOptionByChartLog.logs) ||
                [];
            let totalCount =
                (this.props.siteReducer &&
                    this.props.siteReducer.getFundingOptionByChartLog &&
                    this.props.siteReducer.getFundingOptionByChartLog.count) ||
                0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getTotalFundingCostLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.buildingReducer && this.props.buildingReducer.getTotalFundingCostLog.logs) || [];
            let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getTotalFundingCostLog.count) || [];
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreTotalFundingCostEfciLog = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreFundingTotalByChartLogs(id);
        } else {
            await this.props.restoreTotalFundingCost(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    // getAnnualFundingOptionLog
    // restoreAnnualFundingCost
    getAnnualFundingOptionLogs = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "annualFunding",
            sortKey: sortKey,
            efciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getAnnualFundingCalculationByChartLogs(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getAnnualFundingOptionLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.buildingReducer && this.props.buildingReducer.getAnnualFundingOptionLog.logs) || [];
            this.setState({
                efciLog: logs,
                sortData: false
            });
        }
    };

    restoreAnnualFundingOptionLog = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreAnnualFundingByChartCalculation(id);
        } else {
            await this.props.restoreAnnualFundingCost(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    // getAnnualEFCILog
    // restoreAnnualEFCILog
    getAnnualEFCILogs = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "annualEfci",
            sortKey: sortKey,
            efciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getAnnualEfciByChartLogs(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.logs) || [];
            const totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getAnnualEFCILog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.buildingReducer && this.props.buildingReducer.getAnnualEFCILog.logs) || [];
            const totalCount = (this.props.buildingReducer && this.props.buildingReducer.getAnnualEFCILog.count) || [];
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreAnnualEFCILogs = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreAnnualByChartEFCI(id);
        } else {
            await this.props.restoreAnnualEFCILog(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    getSiteAnnualEfciColumnLogs = async (id, sortKey) => {
        this.setState({
            annualEfciLogsLoading: true
        });
        // await this.props.getAnnualEfciLogs(id, {
        //     order: { [sortKey]: "desc" }
        // });
        // const efciLogs = this.props.siteReducer &&
        //     this.props.siteReducer.getAnnualEfciLogs.logs || [];
        // this.setState({
        //     efciLog: efciLogs,
        //     annualEfciLogsLoading: false,
        //     sortData: false
        // })
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "siteAnnualEfci",
            sortKey: sortKey
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getAnnualEfciByChartLogs(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const efciLogs = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.logs) || [];
            const totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.count) || 0;
            this.setState({
                efciLog: efciLogs,
                annualEfciLogsLoading: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getAnnualEfciLogs(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const efciLogs = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciLogs.logs) || [];
            const totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciLogs.count) || 0;

            this.setState({
                efciLog: efciLogs,
                annualEfciLogsLoading: false,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreSiteAnnualEfciCalculation = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreAnnualByChartEFCI(id);
            await this.refreshEfciBuildingData();
            await this.getSiteEfciByBuilding();
        } else {
            await this.props.restoreAnnualEFCI(id);
            await this.refreshEfciBuildingData();
            await this.getSiteEfciByBuilding();
        }
    };

    // getSiteAnnualFundingCalculationColumnLogs = async (id, sortKey) => {
    //     await this.props.getAnnualFundingCalculationLogs(id, {
    //         order: { [sortKey]: "desc" }

    //     });
    //     const logs = this.props.siteReducer &&
    //         this.props.siteReducer.getAnnualFundingCalculationLogs.logs || [];
    //     this.setState({
    //         efciLog: logs,
    //         sortData: false
    //     })
    getSiteAnnualFundingCalculationColumnLogs = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "siteAnnualFunding",
            sortKey: sortKey
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getAnnualFundingCalculationByChartLogs(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.logs) || [];
            const totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.count) || 0;
            this.setState({
                efciLog: logs,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getAnnualFundingCalculationLogs(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationLogs.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationLogs.count) || 0;

            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreSiteAnnualFundingOption = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreAnnualFundingByChartCalculation(id);
        } else {
            await this.props.restoreAnnualFundingCalculation(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    // getSiteFundingOptionLogs = async (id, sortKey) => {
    //     await this.props.getFundingOptionLog(id, {
    //         order: { [sortKey]: "desc" }
    //     });
    //     const logs = this.props.siteReducer &&
    //         this.props.siteReducer.getFundingOptionLog.logs || [];
    //     this.setState({
    //         efciLog: logs
    //     })
    getSiteFundingOptionLogs = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "siteFunding",
            sortKey: sortKey
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getFundingOptionByChartLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getFundingOptionByChartLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingOptionByChartLog.count) || 0;
            this.setState({
                efciLog: logs,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getFundingOptionLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getFundingOptionLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingOptionLog.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreSiteFundingOptionLog = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreFundingOptionByChartLogs(id);
        } else {
            await this.props.restoreFundingOptionLogs(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    getSiteFundingEfciLog = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "siteFundingEfci",
            sortKey: sortKey
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getFundingSiteEfciByChartLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.count) || 0;
            this.setState({
                efciLog: logs,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getFundingSiteEfciLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciLog.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreSiteFundingEFCILog = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreFundingEfciByChartLogs(id);
        } else {
            await this.props.restoreFundingEfciLogs(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    getSiteTotalFundingLogs = async (id, sortKey) => {
        // this.setState({
        //     efciLog: []
        // })
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "siteTotalFunding",
            sortKey: sortKey
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getTotalFundingByChartLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.count) || [];
            this.setState({
                efciLog: logs,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getTotalFundingLog(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getTotalFundingLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getTotalFundingLog.count) || 0;
            this.setState({
                efciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        }
    };

    restoreSiteTotalFundingLog = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreFundingTotalByChartLogs(id);
        } else {
            await this.props.restoreFundingTotalLogs(id);
        }
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    deleteEfciLogData = async id => {
        await this.props.deleteEFCILog(id);
        await this.refreshEfciBuildingData();
        await this.getSiteEfciByBuilding();
    };

    sortBuildingEfciLog = async (id, sortKey, flag) => {
        this.setState({
            selectedColumnId: id,
            typeLog: "sort",
            sortKey: sortKey,
            flag: flag
        });
        const { logPaginationParams, logParams } = this.state;
        if (flag === 1) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getCapitalSpendingPlanByChartLogs(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                        this.props.siteReducer.getCapitalSpendingPlanByChartLogs.logs) ||
                    [];
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                        this.props.siteReducer.getCapitalSpendingPlanByChartLogs.count) ||
                    0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getCSPLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.buildingReducer && this.props.buildingReducer.getCSPLog.logs) || [];
                let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getCSPLog.count) || 0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }

        if (flag === 2) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getTotalFundingByChartLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.count) || 0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getFundingCostLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.buildingReducer && this.props.buildingReducer.getFundingCostLog.logs) || [];
                let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getFundingCostLog.count) || 0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }

        if (flag === 3) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingSiteEfciByChartLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.count) || 0;

                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getFundingEfciLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.buildingReducer && this.props.buildingReducer.getFundingEfciLog.logs) || [];
                let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getFundingEfciLog.count) || 0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }

        if (flag === 4) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingOptionByChartLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getFundingOptionByChartLog &&
                        this.props.siteReducer.getFundingOptionByChartLog.logs) ||
                    [];
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getFundingOptionByChartLog &&
                        this.props.siteReducer.getFundingOptionByChartLog.count) ||
                    0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getTotalFundingCostLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.buildingReducer && this.props.buildingReducer.getTotalFundingCostLog.logs) || [];
                let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getTotalFundingCostLog.count) || 0;

                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }

        if (flag === 5) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getAnnualFundingCalculationByChartLogs(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.count) || 0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getAnnualFundingOptionLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.buildingReducer && this.props.buildingReducer.getAnnualFundingOptionLog.logs) || [];
                let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getAnnualFundingOptionLog.count) || 0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }

        if (flag === 6) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getAnnualEfciByChartLogs(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.count) || [];
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getAnnualEFCILog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.buildingReducer && this.props.buildingReducer.getAnnualEFCILog.logs) || [];
                let totalCount = (this.props.buildingReducer && this.props.buildingReducer.getAnnualEFCILog.count) || 0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }
        if (flag === 7) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getAnnualEfciByChartLogs(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const efciLogs = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.count) || 0;
                this.setState({
                    efciLog: efciLogs,
                    annualEfciLogsLoading: false,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getAnnualEfciLogs(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const efciLogs = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciLogs.count) || 0;
                this.setState({
                    efciLog: efciLogs,
                    annualEfciLogsLoading: false,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }

        if (flag === 8) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getAnnualFundingCalculationByChartLogs(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.count) || [];
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getAnnualFundingCalculationLogs(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationLogs.count) || [];
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }

        if (flag === 9) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingOptionByChartLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getFundingOptionByChartLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingOptionByChartLog.count) || 0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getFundingOptionLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getFundingOptionLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingOptionLog.count) || [];
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }

        if (flag === 10) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingSiteEfciByChartLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.count) || 0;
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getFundingSiteEfciLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciLog.count) || [];
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }
        if (flag === 11) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getTotalFundingByChartLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.count) || [];
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getTotalFundingLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getTotalFundingLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getTotalFundingLog.count) || [];
                this.setState({
                    efciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }
    };

    getAllBuildingDropdowns = async () => {
        let role = localStorage.getItem("role") || "";
        await this.props.getAllConsultancyUsers();
        if (role === "consultancy_user") {
            // await this.props.BuildinggetAllClients();
        }
        await this.props.getAllConsultanciesDropdown();
    };

    handlePerPageChangeLogs = async e => {
        const { logPaginationParams, typeLog, selectedColumnId, logParams, sortKey, flag, noOfYears } = this.state;
        await this.setState({
            logPaginationParams: {
                ...logPaginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            logParams: {
                ...this.state.logParams,
                offset: 0,
                limit: e.target.value
            }
        });
        if (typeLog == "fundingCost") {
            await this.getFundingCostEfciLogs(selectedColumnId, sortKey);
        } else if (typeLog == "annualFunding") {
            await this.getAnnualFundingOptionLogs(selectedColumnId, sortKey);
        } else if (typeLog == "annualEfci") {
            await this.getAnnualEFCILogs(selectedColumnId, sortKey);
        } else if (typeLog == "siteAnnualEfci") {
            await this.getSiteAnnualEfciColumnLogs(selectedColumnId, sortKey);
        } else if (typeLog == "siteAnnualFunding") {
            await this.getSiteAnnualFundingCalculationColumnLogs(selectedColumnId, sortKey);
        } else if (typeLog == "siteFunding") {
            await this.getSiteFundingOptionLogs(selectedColumnId, sortKey);
        } else if ((typeLog = "siteFundingEfci")) {
            await this.getSiteFundingEfciLog(selectedColumnId, sortKey);
        } else if (typeLog == "siteTotalFunding") {
            await this.getSiteTotalFundingLogs(selectedColumnId, sortKey);
        } else if (typeLog == "sort") {
            await this.sortBuildingEfciLog(selectedColumnId, sortKey, flag);
        }
    };

    handlePageClickLogs = async page => {
        const { logPaginationParams, logParams, typeLog, selectedColumnId, sortKey, flag, noOfYears } = this.state;
        await this.setState({
            logPaginationParams: {
                ...logPaginationParams,
                currentPage: page.selected
            },
            logParams: {
                ...logParams,
                // offset: page.selected * paginationParams.perPage
                offset: page.selected + 1
            }
        });
        if (typeLog == "fundingCost") {
            await this.getFundingCostEfciLogs(selectedColumnId, sortKey);
        } else if (typeLog == "annualFunding") {
            await this.getAnnualFundingOptionLogs(selectedColumnId, sortKey);
        } else if (typeLog == "annualEfci") {
            await this.getAnnualEFCILogs(selectedColumnId, sortKey);
        } else if (typeLog == "siteAnnualEfci") {
            await this.getSiteAnnualEfciColumnLogs(selectedColumnId, sortKey);
        } else if (typeLog == "siteAnnualFunding") {
            await this.getSiteAnnualFundingCalculationColumnLogs(selectedColumnId, sortKey);
        } else if (typeLog == "siteFunding") {
            await this.getSiteFundingOptionLogs(selectedColumnId, sortKey);
        } else if ((typeLog = "siteFundingEfci")) {
            await this.getSiteFundingEfciLog(selectedColumnId, sortKey);
        } else if (typeLog == "siteTotalFunding") {
            await this.getSiteTotalFundingLogs(selectedColumnId, sortKey);
        } else if (typeLog == "sort") {
            await this.sortBuildingEfciLog(selectedColumnId, sortKey, flag);
        } else if (typeLog == "fundingCostLog") {
            await this.getgetFundingCostLogs(selectedColumnId, sortKey);
        } else if (typeLog == "cspLog") {
            await this.getCSPLogs(selectedColumnId, sortKey);
        }
    };

    handleDisableButtons = () => {
        if (JSON.parse(sessionStorage.getItem("bc-data"))?.[0]?.name === "Energy Management") {
            return true;
        }
        return false;
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            showAssignConsultancyUsers,
            showAssignClientUsers,
            clients,
            consultancy_users,
            tableData,
            selectedBuilding,
            breadCrumbsData,
            infoTabsData,
            selectedRowId,
            hiddenFundingOptionList,
            summaryRowData,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission,
            imageResponse
        } = this.state;

        const {
            match: {
                params: { section }
            }
        } = this.props;
        const {
            match: {
                params: { tab }
            }
        } = this.props;

        return (
            <>
                <LoadingOverlay active={this.state.isLoading && tab != "dashboard"} spinner={<Loader />} fadeSpeed={10}>
                    {section === "add" || section === "edit" ? (
                        <Form
                            selectedBuilding={selectedBuilding}
                            refreshBuildingList={this.refreshBuildingList}
                            handleAddBuilding={this.handleAddBuilding}
                            handleUpdateBuilding={this.handleUpdateBuilding}
                            breadCrumbsData={breadCrumbsData}
                            getAllBuildingDropdowns={this.getAllBuildingDropdowns}
                        />
                    ) : section === "buildinginfo" ? (
                        <BuildingInfo
                            keys={tableData.keys}
                            config={tableData.config}
                            infoTabsData={infoTabsData}
                            loading={this.state.loading}
                            refreshData={this.state.refreshData}
                            efciSiteData={this.state.efciSiteData}
                            efciBuildingData={this.state.efciBuildingData}
                            getEfciBasedOnProject={this.getEfciBasedOnProject}
                            hideFundingOptionSiteList={this.state.hideFundingOptionSiteList}
                            updateFcis={this.updateFcis}
                            showInfoPage={this.showInfoPage}
                            getDataById={this.getDataById}
                            uploadImages={this.uploadImages}
                            deleteImages={this.deleteImages}
                            updateFcisSite={this.updateFcisSite}
                            getAllImageList={this.getAllImageList}
                            handleUpdateData={this.handleUpdateBuilding}
                            handleDeleteItem={this.handleDeleteBuilding}
                            hiddenFundingOptionList={hiddenFundingOptionList}
                            updateFundingOption1={this.updateFundingOption1}
                            hideFundingOptionSite={this.hideFundingOptionSite}
                            updateFundingEfciData={this.updateFundingEfciData}
                            updateBuildingEfciLock={this.updateBuildingEfciLock}
                            updateFundingOptionEfci={this.updateFundingOptionEfci}
                            updateFundingPercentage={this.updateFundingPercentage}
                            updateHiddenFundingOption={this.updateHiddenFundingOption}
                            updateTotalProjectFunding={this.updateTotalProjectFunding}
                            updateProjectAnnualFunding={this.updateProjectAnnualFunding}
                            updateBuildingImageComment={this.updateBuildingImageComment}
                            updateAnnualFundingOptions={this.updateAnnualFundingOptions}
                            updateAnnualEfciCalculation={this.updateAnnualEfciCalculation}
                            updateSiteFundingOptionSite={this.updateSiteFundingOptionSite}
                            updateCapitalSpendingPercent={this.updateCapitalSpendingPercent}
                            updateTotalProjectFundingSite={this.updateTotalProjectFundingSite}
                            updateAnnualFundingOptionSite={this.updateAnnualFundingOptionSite}
                            updateProjectAnnualFundingSite={this.updateProjectAnnualFundingSite}
                            updateAnnualEfciCalculationSite={this.updateAnnualEfciCalculationSite}
                            updateEfciInInitialFundingOptions={this.updateEfciInInitialFundingOptions}
                            updateAnnualFundingOptionCalculation={this.updateAnnualFundingOptionCalculation}
                            updateEfciInInitialFundingOptionsSite={this.updateEfciInInitialFundingOptionsSite}
                            updateAnnualFundingOptionCalculationSite={this.updateAnnualFundingOptionCalculationSite}
                            loadData={this.loadData}
                            saveData={this.saveData}
                            getAllBuildLogs={this.getLogData}
                            handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                            handlePageClickHistory={this.handlePageClickHistory}
                            handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                            globalSearchKeyHistory={
                                this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""
                            }
                            logData={logData}
                            handleDeleteLog={this.handleDeleteLog}
                            historyPaginationParams={historyPaginationParams}
                            HandleRestoreBuildingLog={this.HandleRestoreRegionLog}
                            historyParams={historyParams}
                            updateLogSortFilters={this.updateLogSortFilters}
                            efciLog={this.state.efciLog}
                            getCSPLogs={this.getCSPLogs}
                            restoreCSP={this.restoreCSP}
                            getFundingCostLogs={this.getFundingCostLogs}
                            restoreFundingCostLog={this.restoreFundingCostLog}
                            getFundingCostEfciLogs={this.getFundingCostEfciLogs}
                            restoreFundingCostEfciLog={this.restoreFundingCostEfciLog}
                            // getFundingCostEfciLogs={this.getFundingCostEfciLogs}
                            restoreTotalFundingCostEfciLog={this.restoreTotalFundingCostEfciLog}
                            getAnnualFundingOptionLogs={this.getAnnualFundingOptionLogs}
                            restoreAnnualFundingOptionLog={this.restoreAnnualFundingOptionLog}
                            getAnnualEFCILogs={this.getAnnualEFCILogs}
                            restoreAnnualEFCILogs={this.restoreAnnualEFCILogs}
                            getSiteAnnualEfciColumnLogs={this.getSiteAnnualEfciColumnLogs}
                            restoreSiteAnnualEfciCalculation={this.restoreSiteAnnualEfciCalculation}
                            getSiteAnnualFundingCalculationColumnLogs={this.getSiteAnnualFundingCalculationColumnLogs}
                            restoreSiteAnnualFundingOption={this.restoreSiteAnnualFundingOption}
                            getSiteFundingOptionLogs={this.getSiteFundingOptionLogs}
                            restoreSiteFundingOptionLog={this.restoreSiteFundingOptionLog}
                            getSiteFundingEfciLog={this.getSiteFundingEfciLog}
                            restoreSiteFundingEFCILog={this.restoreSiteFundingEFCILog}
                            getSiteTotalFundingLogs={this.getSiteTotalFundingLogs}
                            restoreSiteTotalFundingLog={this.restoreSiteTotalFundingLog}
                            getTotalFundingCostEfciLogs={this.getTotalFundingCostEfciLogs}
                            deleteEfciLogData={this.deleteEfciLogData}
                            sortBuildingEfciLog={this.sortBuildingEfciLog}
                            efciLoading={this.state.efciLoading}
                            colorCodes={this.state.colorCodes}
                            permissions={permissions}
                            logPermission={logPermission}
                            imageResponse={imageResponse}
                            logCount={this.state.logCount}
                            logPaginationParams={this.state.logPaginationParams}
                            handlePageClickLogs={this.handlePageClickLogs}
                            handlePerPageChangeLogs={this.handlePerPageChangeLogs}
                            hasEdit={this.handleDisableButtons() ? false : checkPermission("forms", "buildings", "edit")}
                            hasDelete={this.handleDisableButtons() ? false : checkPermission("forms", "buildings", "delete")}
                            hasLogView={this.handleDisableButtons() ? false : checkPermission("logs", "buildings", "view")}
                            hasLogDelete={this.handleDisableButtons() ? false : checkPermission("logs", "buildings", "delete")}
                            hasLogRestore={this.handleDisableButtons() ? false : checkPermission("logs", "buildings", "restore")}
                            hasInfoPage={checkPermission("forms", "buildings", "view")}
                            hasCreate={checkPermission("forms", "buildings", "create")}
                            hasLock={checkPermission("forms", "recommendations", "lock")}
                            entity="buildings"
                        />
                    ) : section === "efciinfo" ? (
                        <EfciInfo
                            keys={tableData.keys}
                            config={tableData.config}
                            infoTabsData={infoTabsData}
                            loading={this.state.loading}
                            refreshData={this.state.refreshData}
                            efciSiteData={this.state.efciSiteData}
                            efciBuildingData={this.state.efciBuildingData}
                            getEfciBasedOnProject={this.getEfciBasedOnProject}
                            hideFundingOptionSiteList={this.state.hideFundingOptionSiteList}
                            updateFcis={this.updateFcis}
                            showInfoPage={this.showInfoPage}
                            getDataById={this.getDataById}
                            uploadImages={this.uploadImages}
                            deleteImages={this.deleteImages}
                            updateFcisSite={this.updateFcisSite}
                            getAllImageList={this.getAllImageList}
                            handleUpdateData={this.handleUpdateBuilding}
                            handleDeleteItem={this.handleDeleteBuilding}
                            hiddenFundingOptionList={hiddenFundingOptionList}
                            updateFundingOption1={this.updateFundingOption1}
                            hideFundingOptionSite={this.hideFundingOptionSite}
                            updateFundingEfciData={this.updateFundingEfciData}
                            updateBuildingEfciLock={this.updateBuildingEfciLock}
                            updateFundingOptionEfci={this.updateFundingOptionEfci}
                            updateFundingPercentage={this.updateFundingPercentage}
                            updateHiddenFundingOption={this.updateHiddenFundingOption}
                            updateTotalProjectFunding={this.updateTotalProjectFunding}
                            updateProjectAnnualFunding={this.updateProjectAnnualFunding}
                            updateBuildingImageComment={this.updateBuildingImageComment}
                            updateAnnualFundingOptions={this.updateAnnualFundingOptions}
                            updateAnnualEfciCalculation={this.updateAnnualEfciCalculation}
                            updateSiteFundingOptionSite={this.updateSiteFundingOptionSite}
                            updateCapitalSpendingPercent={this.updateCapitalSpendingPercent}
                            updateTotalProjectFundingSite={this.updateTotalProjectFundingSite}
                            updateAnnualFundingOptionSite={this.updateAnnualFundingOptionSite}
                            updateProjectAnnualFundingSite={this.updateProjectAnnualFundingSite}
                            updateAnnualEfciCalculationSite={this.updateAnnualEfciCalculationSite}
                            updateEfciInInitialFundingOptions={this.updateEfciInInitialFundingOptions}
                            updateAnnualFundingOptionCalculation={this.updateAnnualFundingOptionCalculation}
                            updateEfciInInitialFundingOptionsSite={this.updateEfciInInitialFundingOptionsSite}
                            updateAnnualFundingOptionCalculationSite={this.updateAnnualFundingOptionCalculationSite}
                            loadData={this.loadData}
                            saveData={this.saveData}
                            getCSPLogs={this.getCSPLogs}
                            restoreCSP={this.restoreCSP}
                            efciLog={this.state.efciLog}
                            sortBuildingEfciLog={this.sortBuildingEfciLog}
                            getFundingCostLogs={this.getFundingCostLogs}
                            restoreFundingCostLog={this.restoreFundingCostLog}
                            getFundingCostEfciLogs={this.getFundingCostEfciLogs}
                            restoreFundingCostEfciLog={this.restoreFundingCostEfciLog}
                            getTotalFundingCostEfciLogs={this.getTotalFundingCostEfciLogs}
                            restoreTotalFundingCostEfciLog={this.restoreTotalFundingCostEfciLog}
                            getAnnualFundingOptionLogs={this.getAnnualFundingOptionLogs}
                            restoreAnnualFundingOptionLog={this.restoreAnnualFundingOptionLog}
                            getAnnualEFCILogs={this.getAnnualEFCILogs}
                            restoreAnnualEFCILogs={this.restoreAnnualEFCILogs}
                            getSiteAnnualEfciColumnLogs={this.getSiteAnnualEfciColumnLogs}
                            restoreSiteAnnualEfciCalculation={this.restoreSiteAnnualEfciCalculation}
                            getSiteAnnualFundingCalculationColumnLogs={this.getSiteAnnualFundingCalculationColumnLogs}
                            restoreSiteAnnualFundingOption={this.restoreSiteAnnualFundingOption}
                            getSiteFundingOptionLogs={this.getSiteFundingOptionLogs}
                            restoreSiteFundingOptionLog={this.restoreSiteFundingOptionLog}
                            getSiteFundingEfciLog={this.getSiteFundingEfciLog}
                            restoreSiteFundingEFCILog={this.restoreSiteFundingEFCILog}
                            getSiteTotalFundingLogs={this.getSiteTotalFundingLogs}
                            restoreSiteTotalFundingLog={this.restoreSiteTotalFundingLog}
                            colorCodes={this.state.colorCodes}
                            logCount={this.state.logCount}
                            logPaginationParams={this.state.logPaginationParams}
                            handlePageClickLogs={this.handlePageClickLogs}
                            handlePerPageChangeLogs={this.handlePerPageChangeLogs}
                            deleteEfciLogData={this.deleteEfciLogData}
                        />
                    ) : (
                        <BuildingMain
                            showWildCardFilter={showWildCardFilter}
                            paginationParams={paginationParams}
                            currentViewAllUsers={currentViewAllUsers}
                            tableData={tableData}
                            showViewModal={this.showViewModal}
                            showEditPage={this.showEditPage}
                            updateSelectedRow={this.updateSelectedRow}
                            isColunmVisibleChanged={this.isColunmVisibleChanged}
                            selectedRowId={selectedRowId}
                            handleGlobalSearch={this.handleGlobalSearch}
                            globalSearchKey={this.state.params.search}
                            toggleWildCardFilter={this.toggleWildCardFilter}
                            showAddForm={this.showAddForm}
                            updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                            handleDeleteBuilding={this.handleDeleteBuilding}
                            handlePerPageChange={this.handlePerPageChange}
                            handlePageClick={this.handlePageClick}
                            showInfoPage={this.showInfoPage}
                            updateWildCardFilter={this.updateWildCardFilter}
                            wildCardFilter={this.state.params.filters}
                            handleHideColumn={this.handleHideColumn}
                            getListForCommonFilterBuilding={this.getListForCommonFilter}
                            updateCommonFilter={this.updateCommonFilter}
                            commonFilter={this.state.params.list}
                            resetAllFilters={this.resetAllFilters}
                            resetAll={this.resetAll}
                            updateTableSortFilters={this.updateTableSortFilters}
                            resetSort={this.resetSort}
                            tableParams={this.state.params}
                            summaryRowData={summaryRowData}
                            exportTableXl={this.exportTableXl}
                            tableLoading={this.state.tableLoading}
                            permissions={permissions}
                            logPermission={logPermission}
                            isUser={this.props.isUser || false}
                            hasExport={checkPermission("forms", "buildings", "export")}
                            showAddButton={
                                this.handleDisableButtons() || this.props.dontShowAddButton ? false : checkPermission("forms", "buildings", "create")
                            }
                            hasEdit={this.handleDisableButtons() ? false : checkPermission("forms", "buildings", "edit")}
                            hasDelete={this.handleDisableButtons() ? false : checkPermission("forms", "buildings", "delete")}
                            hasInfoPage={checkPermission("forms", "buildings", "view")}
                            entity="buildings"
                        />
                    )}
                    {this.renderBuildingModal()}
                    {this.renderConfirmationModal()}
                    {this.renderConfirmationModalLog()}
                    {showViewModal ? (
                        <Portal
                            body={
                                <ViewModal
                                    keys={tableData.keys}
                                    config={tableData.config}
                                    handleHideColumn={this.handleHideColumn}
                                    onCancel={() => this.setState({ showViewModal: false })}
                                />
                            }
                            onCancel={() => this.setState({ showViewModal: false })}
                        />
                    ) : null}
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
                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = state => {
    const { buildingReducer, projectReducer, siteReducer, commonReducer, recommendationsReducer } = state;
    return { buildingReducer, projectReducer, siteReducer, commonReducer, recommendationsReducer };
};

export default withRouter(connect(mapStateToProps, { ...buildingActions, ...projectActions, ...siteActions, ...CommonActions })(Index));
