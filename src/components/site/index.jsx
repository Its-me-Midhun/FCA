import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import _, { uniqBy, trim } from "lodash";
import LoadingOverlay from "react-loading-overlay";

import ConfirmationModal from "../common/components/ConfirmationModal";
import CommonActions from "../common/actions";
import Portal from "../common/components/Portal";
import SiteModal from "./components/SiteModal";
import ViewModal from "../common/components/ViewModal";
import AssignClientUserModal from "./components/AssignClientUserModal";
import AssignConsultancyUserModal from "./components/AssignConsultancyUserModal";
import siteActions from "./actions";
import regionActions from "../region/actions";
import buildingActions from "../building/actions";
import SiteMain from "./components/SiteMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { siteTableData } from "../../config/tableData";
import { futureCapitalTableData, differedMaintenanceTableData } from "../../config/tableData";
import SiteInfo from "./components/SiteInfo";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrump,
    findPrevPathFromBreadCrumpRecData,
    resetToDashboardBreadCrumpData,
    popBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    checkPermission
} from "../../config/utils";
import projectActions from "../project/actions";
import EfciInfo from "./components/EfciInfo";
import EFCILogs from "../common/components/CommonEFCI/EfciLogs";
import dashboardActions from "../dashboard/actions";
class index extends Component {
    constructor(props) {
        super(props);
        const {
            location: { search = "" }
        } = this.props;

        this.state = {
            isLoading: true,
            errorMessage: "",
            siteList: [],
            paginationParams: this.props.siteReducer.entityParams.paginationParams,
            currentViewAllUsers: null,
            currentActions: null,
            showSiteModal: false,
            showViewModal: false,
            showWildCardFilter: false,
            efciLoading: false,
            annualEfciLogsLoading: false,
            annualEfciLog: [],
            annualFundingOptionLogs: [],
            efciByRegion: {},
            showAssignConsultancyUsers: false,
            tableLoading: false,
            siteData: {},
            sortData: false,
            colorCodes: [],
            clients: [],
            regionList: [],
            consultancy_users: [],
            filterValues: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params,
            selectedRowId: this.props.siteReducer.entityParams.selectedRowId,
            params: this.props.siteReducer.entityParams.params,
            selectedClient: {},
            selectedSite: this.props.match.params.id || this.props.siteReducer.entityParams.selectedEntity,
            tableData: {
                keys: siteTableData.keys,
                config: this.props.siteReducer.entityParams.tableConfig || _.cloneDeep(siteTableData.config)
            },
            futureCapitalData: futureCapitalTableData,
            nonFutureCapitalData: futureCapitalTableData,
            differedMaintenanceData: differedMaintenanceTableData,
            proDifferedMaintenanceData: differedMaintenanceTableData,
            infoTabsData: [],
            wildCardFilterParams: this.props.siteReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.siteReducer.entityParams.filterParams,
            alertMessage: "",
            efciSiteData: {},
            hiddenFundingOptionList: [],
            historyPaginationParams: this.props.siteReducer.entityParams.historyPaginationParams,
            historyParams: this.props.siteReducer.entityParams.historyParams,
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
            isValueChanged: false,
            forcedChangeArray: [],
            site_ids: this.props.siteReducer.entityParams.site_ids,
            building_ids: this.props.siteReducer.entityParams.building_ids,
            start_year: this.props.siteReducer.entityParams.start_year,
            end_year: this.props.siteReducer.entityParams.end_year,

            isDashboardFiltered: this.props.siteReducer.entityParams.isDashboardFiltered,
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
            sortParams: {
                order: {
                    "efci_versions.created_at": "desc"
                }
            },
            dashboardFilterParams: this.props.siteReducer.entityParams.dashboardFilterParams
        };
        this.exportSiteTable = this.exportSiteTable.bind(this);
    }

    componentDidMount = async () => {
        await this.refreshSiteList();
        await this.getEfciBasedOnSite(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true });
        this.getColorCode();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (this.props.location.search !== prevProps.location.search || this.props.match.params.id !== prevProps.match.params.id) {
            this.setState({
                isLoading: false
            });
            await this.getEfciBasedOnSite(
                this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
            );
            // await this.refreshSiteList();
            this.setState({
                isLoading: false
            });
        } else if (prevProps.match.params.tab !== tab) {
            this.setState({
                efciLoading: true
            });
            await this.getEfciBasedOnSite(
                this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
            );
            this.setState({ efciLoading: false });
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

    getEfciBasedOnRegion = async () => {
        const regionId =
            (this.props.siteReducer.getSiteByIdResponse &&
                this.props.siteReducer.getSiteByIdResponse.region &&
                this.props.siteReducer.getSiteByIdResponse.region &&
                this.props.siteReducer.getSiteByIdResponse.region.id) ||
            "";
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const projectId = query.pid;
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            let siteDatas = JSON.parse(localStorage.getItem(this.props.match.params.id));
            let siteChecked = [];
            if (siteDatas && this.props.match.params.id == siteDatas.id) {
                siteChecked = siteDatas ? (siteDatas.region ? siteDatas.region : []) : [];
            }
            let param = { reset: true };
            if (siteChecked && siteChecked.length) {
                param = {
                    ...param,
                    site_ids: siteChecked
                };
            }
            await this.props.getChartEfciRegion(regionId, projectId, param);
            this.setState({
                efciByRegion: this.props.regionReducer.getEfciBySiteGraph ? this.props.regionReducer.getEfciBySiteGraph.region || {} : {}
            });
        } else {
            await this.props.getEfciByRegion(projectId, regionId);
            this.setState({
                efciByRegion: (this.props.regionReducer.getEfciByRegion && this.props.regionReducer.getEfciByRegion.region) || {}
            });
        }
    };

    getEfciBasedOnSite = async tempParams => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const siteId = this.props.match.params.id;
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            let buildingDatas = JSON.parse(localStorage.getItem(this.props.match.params.id));
            let chartParams = {
                siteId: siteId,
                projectId: query.pid
            };
            await this.props.getTradeSettingsDropdown(query.pid);
            const { trades } = this.props.projectReducer.getTradeSettingsDropdownResponse || {};
            const trade_ids = trades?.length ? [trades[0]?.id] : [];
            const systemParams = {
                chart_type: "proj_fca_chart",
                export_type: "system",
                trade_ids,
                project_ids: [query.pid],
                site_ids: [siteId],
                user_id: localStorage.getItem("userId")
            };
            await Promise.all([
                this.props.getMiscSettings(query.pid),
                this.props.getChartData(chartParams, tempParams),
                this.props.getChartsDashboardPython(systemParams)
            ]);
            let buildingChecked = [];
            if (buildingDatas && this.props.match.params.id == buildingDatas.id) {
                buildingChecked = buildingDatas ? (buildingDatas.tempBuilding ? buildingDatas.tempBuilding : []) : [];
            }
            let param = { reset: true };
            if (buildingChecked && buildingChecked.length) {
                param = {
                    ...param,
                    building_ids: buildingChecked
                };
            }
            await this.props.getChartEfci(siteId, { project_id: query.pid }, param);
            await this.setState({
                efciSiteData: this.props.siteReducer.getEfciBySiteGraph ? this.props.siteReducer.getEfciBySiteGraph.site || {} : {}
            });
        } else if (tab == "efci") {
            // this.setState({
            //     efciLoading: true
            // })
            await this.props.getEfciBySite(siteId, { project_id: query.pid });
            await this.setState(
                {
                    efciSiteData: this.props.siteReducer.getEfciBySite ? this.props.siteReducer.getEfciBySite.site || {} : {}
                    // isefciLoading: false
                },
                () => this.resetData()
            );
        }
    };

    resetData = () => {
        let tempArray = [];
        const { efciSiteData } = this.state;

        if (efciSiteData && efciSiteData.funding_options && efciSiteData.funding_options.length) {
            efciSiteData.funding_options.map((item, index) =>
                tempArray.push({ value: parseFloat(item.efci), index: index + 1, color: item.efci_color })
            );
        }
        this.setState({
            tempArray
        });
    };

    loadData = async params => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const siteId = this.props.match.params.id;
        await this.props.loadChartData(siteId, query.pid);
        await this.getEfciBasedOnSite();
    };

    saveData = async params => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const siteId = this.props.match.params.id;
        await this.props.saveDataEfciChart(siteId, query.pid);
        await this.getEfciBasedOnSite();
    };

    updateSiteCapitalSpending = async (id, percentage) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.setState({
                temp_csp: { percentage: percentage }
            });
            await this.props.updateCapitalSpendingPlanChart(id, { percentage: percentage });
            await this.getEfciBasedOnSite();
        } else {
            await this.setState({
                site_csp: { percentage: percentage }
            });
            await this.props.updateCapitalSpendingPlan(id, { percentage: percentage });
            await this.getEfciBasedOnSite();
            await this.getEfciBasedOnRegion();
        }
    };

    updatePercentage = async (id, value) => {
        //handle csp %
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.capital_spending_plans.map(csp => {
            csp.fundings.map(funding => {
                if (funding.id === id) {
                    funding.percentage = value;
                }
            });
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateProjectAnnualFunding = async (id, value) => {
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

    updateSiteFundingOption = async (id, fundingCost) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateFundingOptionChart(id, fundingCost);
            await this.getEfciBasedOnSite();
        } else {
            await this.props.updateFundingOption(id, fundingCost);
            await this.getEfciBasedOnSite();
            await this.getEfciBasedOnRegion();
        }
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

    updateAnnualEfciCalculation = async (id, value) => {
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

    updateFcis = async (id, fci) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateAnnualEfciChart(id, fci);
            await this.getEfciBasedOnSite();
        } else {
            await this.props.updateAnnualEfci(id, fci);
            await this.getEfciBasedOnSite();
            await this.getEfciBasedOnRegion();
        }
    };

    updateAnnualFundingOptionCalculation = async (id, value) => {
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

    updateAnnualFundingOption1 = async (id, amount) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateAnnualFundingChart(id, amount);
            await this.getEfciBasedOnSite();
            await this.getEfciBasedOnRegion();
        } else {
            await this.props.updateAnnualFunding(id, amount);
            await this.getEfciBasedOnSite();
            await this.getEfciBasedOnRegion();
        }
    };

    updateEfciInInitialFundingOptions = async (efci_id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData &&
            tempEfciSiteData.funding_options &&
            tempEfciSiteData.funding_options.map(f_o => {
                if (f_o.efci_id == efci_id) {
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
            await this.getEfciBasedOnSite();
        } else {
            await this.props.updateFundingSiteEfci(id, value.value);
            await this.getEfciBasedOnSite();
            await this.getEfciBasedOnRegion();
        }
    };

    updateTotalProjectFunding = async (id, value) => {
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
            hiddenFundingOptionList: this.props.siteReducer.hiddenFundingOptionList || []
        });
    };

    refreshSiteList = async () => {
        await this.setState({ isLoading: true });
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        }
        const { paginationParams, tableData, dashboardFilterParams } = this.state;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        let regionId = this.props.regionId || null;
        await this.setState({
            params: {
                ...this.state.params,
                project_id: this.props.projectId || null,
                site_ids: (isDashboardFiltered ? this.state.site_ids : null) || null,
                building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                end_year: (isDashboardFiltered ? this.state.end_year : null) || null
            }
        });
        // await this.props.getMenuItems();
        // await this.props.getAllConsultancyUsers();
        // await this.props.getAllClients();

        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        if (query.pid && query.pid.trim().length) {
            this.setState({
                params: {
                    ...this.state.params,
                    project_id: query.pid || null
                }
            });
        }

        if (this.props.clientId && (section === "energyinfo" || section === "assetinfo")) {
            await this.setState({
                params: {
                    ...this.state.params,
                    client_id: this.props.clientId
                }
            });
        }

        // using same componet for site mangement and site listing info page
        let siteList = [];
        let totalCount = 0;
        if (section === "regioninfo") {
            await this.props.getSitesBasedOnRegion(regionId, this.state.params);
            siteList = this.props.buildingReducer.getSitesBasedOnRegionResponse
                ? this.props.buildingReducer.getSitesBasedOnRegionResponse.sites || []
                : [];
            totalCount = this.props.buildingReducer.getSitesBasedOnRegionResponse
                ? this.props.buildingReducer.getSitesBasedOnRegionResponse.count || 0
                : 0;
        } else {
            await this.props.getAllSites({
                ...this.state.params,
                ...(isDashboardFiltered && { ...dashboardFilterParams })
            });
            siteList = this.props.siteReducer.getAllSitesResponse ? this.props.siteReducer.getAllSitesResponse.sites || [] : [];
            totalCount = this.props.siteReducer.getAllSitesResponse ? this.props.siteReducer.getAllSitesResponse.count || 0 : 0;
        }

        const {
            siteReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            }
        } = this.props;
        let project_permission = {};

        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.sites
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.sites || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.site_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.site_logs || {}
                : {};

        // go to previous page is the last record of the current page is deleted
        if (siteList && !siteList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...this.state.params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            if (section === "regioninfo") {
                await this.props.getSitesBasedOnRegion(regionId, this.state.params);
                siteList = this.props.buildingReducer.getSitesBasedOnRegionResponse
                    ? this.props.buildingReducer.getSitesBasedOnRegionResponse.sites || []
                    : [];
                totalCount = this.props.buildingReducer.getSitesBasedOnRegionResponse
                    ? this.props.buildingReducer.getSitesBasedOnRegionResponse.count || 0
                    : 0;
            } else {
                await this.props.getAllSites(this.state.params);
                siteList = this.props.siteReducer.getAllSitesResponse ? this.props.siteReducer.getAllSitesResponse.sites || [] : [];
                totalCount = this.props.siteReducer.getAllSitesResponse ? this.props.siteReducer.getAllSitesResponse.count || 0 : 0;
            }
        }
        if (siteList && !siteList.length && this.props.siteReducer.getAllSitesResponse && this.props.siteReducer.getAllSitesResponse.error) {
            await this.setState({ alertMessage: this.props.siteReducer.getAllSitesResponse.error });
            this.showAlerts();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: siteList,
                config: this.props.siteReducer.entityParams.tableConfig || tableData.config
            },

            siteList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
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

        if (query.info === "true" || (query.pid && query.pid.trim().length)) {
            await this.props.getFutureCapitalBySite(query.pid, this.props.match.params.id).then(() => {
                let futureCapital = [];
                let nonfutureCapital = [];
                futureCapital =
                    (this.props.projectReducer &&
                        this.props.projectReducer.getFutureCapitalBySite &&
                        this.props.projectReducer.getFutureCapitalBySite.future_capitals) ||
                    [];
                nonfutureCapital =
                    (this.props.projectReducer &&
                        this.props.projectReducer.getFutureCapitalBySite &&
                        this.props.projectReducer.getFutureCapitalBySite.pro_future_capitals) ||
                    [];

                this.setState({
                    futureCapitalData: {
                        ...this.state.futureCapitalData,
                        data: futureCapital
                    },
                    nonFutureCapitalData: {
                        ...this.state.nonFutureCapitalData,
                        data: nonfutureCapital
                    }
                });
            });
            await this.props.getDifferedMaintenanceBySite(query.pid, this.props.match.params.id).then(() => {
                let differedMaintenance = [];
                let proDifferedMaintenance = [];
                differedMaintenance =
                    (this.props.projectReducer &&
                        this.props.projectReducer.getDifferedMaintenanceBySite &&
                        this.props.projectReducer.getDifferedMaintenanceBySite.differed_maintenances) ||
                    [];
                proDifferedMaintenance =
                    (this.props.projectReducer &&
                        this.props.projectReducer.getDifferedMaintenanceBySite &&
                        this.props.projectReducer.getDifferedMaintenanceBySite.pro_differed_maintenances) ||
                    [];

                this.setState({
                    differedMaintenanceData: {
                        ...this.state.differedMaintenanceData,
                        data: differedMaintenance
                    },
                    proDifferedMaintenanceData: {
                        ...this.state.proDifferedMaintenanceData,
                        data: proDifferedMaintenance
                    }
                });
            });
        }
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
        await this.refreshSiteList();
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
            let tempConfig = { ...this.state.tableData.config };
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
            entity: "Site",
            selectedEntity: this.state.selectedSite,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            site_ids: isDashboardFiltered ? this.state.site_ids : null,
            building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
            start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
            end_year: (isDashboardFiltered ? this.state.end_year : null) || null,
            isDashboardFiltered,
            dashboardFilterParams: this.state.dashboardFilterParams
        };
        await this.props.updateSiteEntityParams(entityParams);
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
                list: null
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshSiteList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshSiteList();
    };
    resetAll = async () => {
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

                order: null,
                list: null
            },
            tableData: {
                ...this.state.tableData,
                config: _.cloneDeep(siteTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshSiteList();
    };
    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;

        const {
            match: {
                params: { section: client_section }
            }
        } = this.props;

        let project_id = null;
        if (this.props.isProjectView) {
            const {
                match: {
                    params: { id, section }
                }
            } = this.props;
            project_id = id;
        }
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        } else {
            project_id = this.state.project_id;
        }

        // const {
        //     match: {
        //         params: { id: regionId }
        //     }
        // } = this.props;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        params.start_year = (isDashboardFiltered ? this.state.start_year : null) || null;
        params.end_year = (isDashboardFiltered ? this.state.end_year : null) || null;

        if (client_section === "energyinfo" || client_section === "assetinfo") {
            params.client_id = this.props.clientId;
            await this.props.getListForCommonFiltersite(params);
            return (this.props.siteReducer.getListForCommonFilterResponse && this.props.siteReducer.getListForCommonFilterResponse.list) || [];
        }

        params.project_id = project_id;
        params.region_id = this.props.regionId || null;
        params.site_ids = isDashboardFiltered ? this.state.site_ids : null;
        params.building_ids = (isDashboardFiltered ? this.state.building_ids : null) || null;

        await this.props.getListForCommonFiltersite({ ...params, ...(isDashboardFiltered && { ...this.state.dashboardFilterParams }) });
        return (this.props.siteReducer.getListForCommonFilterResponse && this.props.siteReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshSiteList();
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
        await this.refreshSiteList();
    };

    updateSelectedRow = async rowId => {
        await this.setState({
            selectedRowId: rowId
        });
        await this.updateEntityParams();
    };

    // updateBuildingEfciLock(lock) {
    //     const {
    //         location: { search = "" }
    //     } = this.props;
    //     const query = qs.parse(search);
    //     this.props.updateBuildingLock(this.props.match.params.id, {
    //         building_id: this.props.match.params.id,
    //         project_id: query.pid,
    //         lock: lock
    //     })
    // }

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
        await this.refreshSiteList();
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
        await this.refreshSiteList();
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

    showEditPage = siteId => {
        const { history } = this.props;
        this.setState({
            selectedSite: siteId
        });
        addToBreadCrumpData({ key: "edit", name: "Edit Site", path: `/site/edit/${siteId}` });
        history.push(`/site/edit/${siteId}`);
    };

    showSiteModal = (siteId = null) => {
        this.setState({
            showSiteModal: true,
            selectedSite: siteId
        });
    };

    showAddForm = () => {
        let regionId = this.props.regionId;
        // const selectedRegion = this.props.match.params.id;
        const selectedproject = this.props.match.params.id;
        let selectedRegion = "";
        let selectedClient = "";
        let selectedConsultancy = "";
        if (this.props.basicDetails) {
            selectedClient = this.props.basicDetails.client.id;
            selectedConsultancy = this.props.basicDetails.consultancy.id;
        }

        const { history } = this.props;
        this.setState({
            selectedSite: null
        });
        addToBreadCrumpData({ key: "add", name: "Add Site", path: "/site/add" });
        if (selectedproject && !regionId) {
            history.push(`/site/add?r_id=${selectedRegion}&c_id=${selectedClient}&cty_id=${selectedConsultancy}&p_id=${selectedproject}`);
        }
        // --------------------for default region in site----------------
        else if (regionId) {
            history.push(`/site/add?r_id=${regionId}&c_id=${selectedClient}&cty_id=${selectedConsultancy}`);
        }
        // --------------------------------
        else {
            history.push("/site/add");
        }
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    handleAssignConsultancyUsersModal = async siteData => {
        await this.setState({
            showAssignConsultancyUsers: true
        });
    };

    handleAssignClientUsersModal = async siteData => {
        await this.setState({
            showAssignClientUsers: true
        });
    };

    handleAddSite = async site => {
        const { history } = this.props;
        this.setState({
            isLoading: true
        });

        await this.props.addSite(site);
        if (this.props.siteReducer.addSiteResponse && this.props.siteReducer.addSiteResponse.error) {
            await this.setState({
                alertMessage: this.props.siteReducer.addSiteResponse.error
            });
            this.showAlerts();
        } else {
            this.setState({
                isLoading: true
            });
            // await this.props.getMenuItems();
            await this.setState({
                alertMessage: this.props.siteReducer.addSiteResponse && this.props.siteReducer.addSiteResponse.message
            });
            await this.refreshSiteList();
            this.setState({
                isLoading: false
            });
            this.showAlerts();
            history.push(findPrevPathFromBreadCrump() || "/site");
        }
        this.setState({
            isLoading: false
        });
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

    handleUpdateSite = async (site, isMap = false) => {
        const { history } = this.props;
        const { selectedSite } = this.state;
        this.setState({
            isLoading: true
        });
        await this.props.updateSite(site, selectedSite);
        if (this.props.siteReducer.updateSiteResponse && this.props.siteReducer.updateSiteResponse.error) {
            await this.setState({ alertMessage: this.props.siteReducer.updateSiteResponse.error });
            this.showAlerts();

            this.setState({
                isLoading: false
            });
        } else {
            await this.setState({
                alertMessage: this.props.siteReducer.updateSiteResponse && this.props.siteReducer.updateSiteResponse.message,
                currentActions: null,
                isLoading: true
            });
            // await this.props.getMenuItems();
            this.showAlerts();
            await this.refreshSiteList();
            this.setState({
                isLoading: false
            });
            if (!isMap) {
                history.push(findPrevPathFromBreadCrump() || "/site");
            }
        }
        this.setState({
            isLoading: false
        });
    };

    handleDeleteSite = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedSite: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this site?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteSiteOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteSiteOnConfirm = async () => {
        const { selectedSite } = this.state;
        const { history } = this.props;
        this.setState({
            isLoading: true,
            showConfirmModal: false
        });
        await this.props.deleteSite(selectedSite);
        if (this.props.siteReducer.deleteSiteResponse && this.props.siteReducer.deleteSiteResponse.error) {
            await this.setState({ alertMessage: this.props.siteReducer.deleteSiteResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedSite: null,
                isLoading: false
            });
            this.showAlerts();
        } else {
            // await this.props.getMenuItems();
            this.setState({
                showConfirmModal: false,
                selectedSite: null
            });
            await this.refreshSiteList();
            this.setState({
                isLoading: false
            });
            const {
                location: { search }
            } = this.props;
            const query = qs.parse(search);
            // if(query.dashboardView){
            //     history.push(resetToDashboardBreadCrumpData() || "/site");
            // }
            // else
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/site");
            }
        }
        this.setState({
            isLoading: false
        });
    };

    renderSiteModal = () => {
        const { showSiteModal, siteData, selectedSite, regionList, selectedClient } = this.state;
        if (!showSiteModal) return null;
        return (
            <Portal
                body={
                    <SiteModal
                        selectedSite={selectedSite}
                        handleAddSite={this.handleAddSite}
                        handleUpdateSite={this.handleUpdateSite}
                        regionList={regionList}
                        selectedClient={selectedClient}
                        onCancel={() => this.setState({ showSiteModal: false })}
                    />
                }
                onCancel={() => this.setState({ showSiteModal: false })}
            />
        );
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
        await this.refreshSiteList();
    };

    setInFoPage = siteId => {
        const { history } = this.props;
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
                    name: "Site",
                    path: `/site/siteinfo/${siteId}/basicdetails${tempSearch}`
                },
                {
                    key: "buildings",
                    name: "Buildings",
                    path: `/site/siteinfo/${siteId}/buildings${tempSearch}`
                },
                {
                    key: "recommendations",
                    name: "Recommendations",
                    path: `/site/siteinfo/${siteId}/recommendations${tempSearch}`
                },
                {
                    key: "infoimages",
                    name: "Images",
                    path: `/site/siteinfo/${siteId}/infoimages${tempSearch}`
                },
                {
                    key: "infomap",
                    name: "Map",
                    path: `/site/siteinfo/${siteId}/infomap${tempSearch}`
                },
                {
                    key: "futurecapital",
                    name: "FC",
                    path: `/site/siteinfo/${siteId}/futurecapital${tempSearch}`
                },

                {
                    key: "deferredmaintenance",
                    name: "DM",
                    path: `/site/siteinfo/${siteId}/deferredmaintenance${tempSearch}`
                },
                {
                    key: "dashboard",
                    name: "Charts & Graphs",
                    path: `/site/siteinfo/${siteId}/dashboard${tempSearch}`,
                    show: checkPermission("charts_and_graph", "site", "view")
                },
                {
                    key: "efcisandbox",
                    name: "EFCI Sandbox",
                    path: `/site/siteinfo/${siteId}/efcisandbox${tempSearch}`
                },
                {
                    key: "efci",
                    name: "EFCI",
                    path: `/site/siteinfo/${siteId}/efci${tempSearch}`
                },
                {
                    key: "softCosts",
                    name: "Soft Costs",
                    path: `/site/siteinfo/${siteId}/softCosts${tempSearch}`
                },
                // {
                //     key: "reports",
                //     name: "Reports",
                //     path: `/site/siteinfo/${siteId}/reports/specialReports${tempSearch}`,
                //     bcName: "Special Reports"
                // },

                {
                    key: "documents",
                    name: "Documents",
                    path: `/site/siteinfo/${siteId}/documents${tempSearch}`
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

        if (query.info === "true" || (query.pid && query.pid.trim().length)) {
            this.setInFoPage(this.props.match.params.id);
        } else {
            this.setState({
                selectedSite: siteId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Site",
                        path: `/site/siteinfo/${siteId}/basicdetails${tempSearch}`
                    },
                    { key: "buildings", name: "Buildings", path: `/site/siteinfo/${siteId}/buildings${tempSearch}` },
                    { key: "infoimages", name: "Images", path: `/site/siteinfo/${siteId}/infoimages${tempSearch}` },
                    { key: "infomap", name: "Map", path: `/site/siteinfo/${siteId}/infomap${tempSearch}` },
                    {
                        key: "softCosts",
                        name: "Soft Costs",
                        path: `/site/siteinfo/${siteId}/softCosts${tempSearch}`
                    },
                    {
                        key: "documents",
                        name: "Documents",
                        path: `/site/siteinfo/${siteId}/documents${tempSearch}`
                    }
                ]
            });
        }

        const tabFilter = JSON.parse(sessionStorage.getItem("bc-data"))[0].name;

        let tabKeyList = [];

        if (tabFilter === "Energy Management") {
            tabKeyList = ["basicdetails", "buildings", "Electricity", "Water", "Gas", "Sewer", "energyStar"];
            this.setState({
                selectedSite: siteId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Site",
                        path: `/site/siteinfo/${siteId}/basicdetails${tempSearch}`
                    },

                    {
                        key: "buildings",
                        name: "Building",
                        path: `/site/siteinfo/${siteId}/buildings${tempSearch}`
                    },
                    {
                        key: "Electricity",
                        name: "Electricity",
                        path: `/site/siteinfo/${siteId}/Electricity${tempSearch}`
                    },
                    {
                        key: "Gas",
                        name: "Gas",
                        path: `/site/siteinfo/${siteId}/Gas${tempSearch}`
                    },
                    {
                        key: "Water",
                        name: "Water",
                        path: `/site/siteinfo/${siteId}/Water${tempSearch}`
                    },

                    {
                        key: "Sewer",
                        name: "Sewer",
                        path: `/site/siteinfo/${siteId}/Sewer${tempSearch}`
                    },
                    {
                        key: "energyStarRating",
                        name: "Energy Star",
                        path: `/site/siteinfo/${siteId}/energyStarRating${tempSearch}`,
                        bcName: "energyStarRating"
                    },
                    {
                        key: "energydashboard",
                        name: "Charts & Graphs",
                        path: `/site/siteinfo/${siteId}/energydashboard`
                    },
                    {
                        key: "energyStar",
                        name: "Portfolio Manager",
                        path: `/site/siteinfo/${siteId}/energyStar`
                    }
                ]
            });
        } else if (tabFilter === "Asset Management") {
            tabKeyList = ["basicdetails", "buildings", "assets", "assetcharts"];
            this.setState({
                selectedSite: siteId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Site",
                        path: `/site/siteinfo/${siteId}/basicdetails${tempSearch}`
                    },

                    {
                        key: "buildings",
                        name: "Building",
                        path: `/site/siteinfo/${siteId}/buildings${tempSearch}`
                    },
                    {
                        key: "assets",
                        name: "Assets",
                        path: `/site/siteinfo/${siteId}/assets${tempSearch}`
                    },
                    {
                        key: "assetcharts",
                        name: "Charts & Graphs",
                        path: `/site/siteinfo/${siteId}/assetcharts`
                    }
                ]
            });
        } else
            tabKeyList = [
                "basicdetails",
                "buildings",
                "infoimages",
                "infomap",
                "futurecapital",
                "deferredmaintenance",
                "dashboard",
                "recommendations",
                "reports",
                "escalation",
                "documents",
                "efci",
                "efcisandbox"
            ];

        let path = `/site/siteinfo/${siteId}/${
            this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
        }`;
        path += tab === "reports" ? `${subTab ? `/${subTab}` : ""}` : "";

        history.push(`${path}${tempSearch}`);
    };

    getDataById = async siteId => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const project_id = query.pid;
        await this.props.getSiteById(siteId, { project_id });
        await this.getEfciBasedOnRegion();
        return true;
    };

    uploadImages = async (imageData = {}) => {
        const { selectedSite } = this.state;
        await this.props.uploadSiteImage(imageData, selectedSite || this.props.match.params.id);
        return true;
    };

    deleteImages = async imageId => {
        await this.props.deleteSiteImage(imageId);
        return true;
    };

    getAllImageList = async (siteId, params) => {
        await this.props.getAllSiteImages(siteId, params);
        const {
            siteReducer: { getAllImagesResponse }
        } = this.props;
        await this.setState({
            imageResponse: getAllImagesResponse
        });
        return true;
    };

    updateSiteImageComment = async imageData => {
        await this.props.updateSiteImageComment(imageData);
        return true;
    };

    exportSiteTable = async () => {
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section }
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
        this.setState({ tableLoading: true });
        search === "" && section === "regioninfo"
            ? await this.props.exportSiteUnderRegion({
                  region_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  site_ids: this.state.site_ids,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              })
            : section === "regioninfo"
            ? await this.props.exportSiteByRegion({
                  project_id: query.pid,
                  region_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  site_ids: this.state.site_ids,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              })
            : section === "projectinfo"
            ? await this.props.exportSite({
                  project_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  site_ids: this.state.site_ids,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year,
                  ...(isDashboardFiltered && { ...this.state.dashboardFilterParams })
              })
            : section === "assetinfo"
            ? await this.props.exportSite({
                  client_id: this.props.clientId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              })
            : section === "energyinfo"
            ? await this.props.exportSite({
                  client_id: this.props.clientId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              })
            : await this.props.exportSite({
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  site_ids: this.state.site_ids,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              });
        this.setState({ tableLoading: false });
        if (this.props.siteReducer.siteExportResponse && this.props.siteReducer.siteExportResponse.error) {
            await this.setState({ alertMessage: this.props.siteReducer.siteExportResponse.error });
            this.showAlerts();
        }
    };

    updateSiteEfciLock = async lock => {
        const {
            location: { search }
        } = this.props;
        this.setState({
            isLoading: true
        });
        const query = qs.parse(search);
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.lockSiteSandbox(query.pid, this.props.match.params.id, {
                lock: lock
            });
            await this.getEfciBasedOnSite();
        } else {
            await this.props.lockSite(query.pid, this.props.match.params.id, {
                lock: lock
            });
            await this.getEfciBasedOnSite();
        }
        this.setState({
            isLoading: false
        });
    };

    updateBuildingEfciLock = async (buildingId, lock) => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            let params = {
                buildingId: buildingId,
                projectId: query.pid
            };
            await this.props.dashboardBuildingLock(params, { lock });
            await this.getEfciBasedOnSite();
        }
        // else {
        //     await this.props.lockSite(query.pid, this.props.match.params.id, {
        //         lock: lock
        //     });
        //     await this.getEfciBasedOnSite();
        // }

        // await this.getDataById(this.props.match.params.id);
        // this.setState({ refreshData: !this.state.refreshData })
    };

    getLogData = async buildingId => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllSiteLogs(buildingId, historyParams);
        const {
            siteReducer: {
                getAllSiteLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.siteReducer.getAllSiteLogsResponse && this.props.siteReducer.getAllSiteLogsResponse.error) {
            await this.setState({ alertMessage: this.props.siteReducer.getAllSiteLogsResponse.error });
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
        await this.props.deleteSiteLog(selectedLog);
        if (this.props.siteReducer.deleteSiteLogResponse && this.props.siteReducer.deleteSiteLogResponse.error) {
            await this.setState({ alertMessage: this.props.siteReducer.deleteSiteLogResponse.error });
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
        await this.props.restoreSiteLog(id);
        if (this.props.siteReducer.restoreSiteLogResponse && this.props.siteReducer.restoreSiteLogResponse.error) {
            await this.setState({ alertMessage: this.props.siteReducer.restoreSiteLogResponse.error });
            this.showAlerts();
        }
        await this.refreshSiteList();
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
        if (typeLog == "annualEfciCalculation") {
            await this.getAnnualEfciColumnLogs(selectedColumnId, sortKey, flag, noOfYears);
        } else if (typeLog == "annualFundingCalculation") {
            await this.getAnnualFundingCalculationColumnLogs(selectedColumnId, sortKey);
        } else if (typeLog == "fundingOption") {
            await this.getFundingOptionLogs(selectedColumnId, sortKey);
        } else if (typeLog == "fundingEFCI") {
            await this.getFundingEfciLog1(selectedColumnId, sortKey);
        } else if (typeLog == "totalFunding") {
            await this.getTotalFundingLogs(selectedColumnId, sortKey);
        } else if (typeLog == "cspLog") {
            await this.getCSPLogs(selectedColumnId, sortKey);
        } else if (typeLog == "sort") {
            await this.sortSiteEfciLog(selectedColumnId, sortKey, flag);
        } else {
            await this.showLog(selectedColumnId, typeLog, noOfYears);
        }
    };

    handlePageClickLogs = async page => {
        const { logPaginationParams, logParams, typeLog, selectedColumnId, flag, sortKey, noOfYears } = this.state;
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
        if (typeLog == "annualEfciCalculation") {
            await this.getAnnualEfciColumnLogs(selectedColumnId, sortKey);
        } else if (typeLog == "annualFundingCalculation") {
            await this.getAnnualFundingCalculationColumnLogs(selectedColumnId, sortKey);
        } else if (typeLog == "fundingOption") {
            await this.getFundingOptionLogs(selectedColumnId, sortKey);
        } else if (typeLog == "fundingEFCI") {
            await this.getFundingEfciLog1(selectedColumnId, sortKey);
        } else if (typeLog == "totalFunding") {
            await this.getTotalFundingLogs(selectedColumnId, sortKey);
        } else if (typeLog == "cspLog") {
            await this.getCSPLogs(selectedColumnId, sortKey);
        } else if (typeLog == "sort") {
            await this.sortSiteEfciLog(selectedColumnId, sortKey, flag);
        } else {
            await this.showLog(selectedColumnId, typeLog, noOfYears);
        }
    };

    getAnnualEfciColumnLogs = async (id, sortKey) => {
        this.setState({
            annualEfciLogsLoading: true
        });
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "annualEfciCalculation",
            sortKey: sortKey,
            annualEfciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getAnnualEfciByChartLogs(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const efciLogs = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.count) || [];
            this.setState({
                annualEfciLog: efciLogs,
                annualEfciLogsLoading: false,
                logCount: totalCount,
                sortData: false,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getAnnualEfciByChartLogs(id, {
                    order: { [sortKey]: "desc" },
                    ...logParams
                });
                const efciLogs = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.count) || [];
                this.setState({
                    annualEfciLog: efciLogs,
                    annualEfciLogsLoading: false,
                    sortData: false,
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
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciLogs.count) || [];
                this.setState({
                    annualEfciLog: efciLogs,
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
        }
    };

    getAnnualFundingCalculationColumnLogs = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;

        this.setState({
            selectedColumnId: id,
            typeLog: "annualFundingCalculation",
            sortKey: sortKey,
            annualEfciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getAnnualFundingCalculationByChartLogs(id, {
                order: { [sortKey]: "desc" },
                ...logParams
            });
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.count) || 0;
            const logs = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationByChartLogs.logs) || [];
            this.setState({
                annualEfciLog: logs,
                sortData: false,
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
                annualEfciLog: logs,
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

    restoreAnnualEfciCalculation = async id => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.restoreAnnualByChartEFCI(id);
            await this.getEfciBasedOnSite();
        } else {
            await this.props.restoreAnnualEFCI(id);
            await this.getEfciBasedOnSite();
        }
    };

    restoreAnnualFundingOption = async id => {
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
        await this.getEfciBasedOnSite();
    };

    getFundingOptionLogs = async (id, sortKey) => {
        // await this.props.getFundingOptionLog(id);
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "fundingOption",
            sortKey: sortKey,
            annualEfciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getFundingOptionByChartLog(id, {
                // order: { [sortKey]: this.state.sortData ? "asc" : "desc" }
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getFundingOptionByChartLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingOptionByChartLog.count) || 0;
            this.setState({
                annualEfciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getFundingOptionLog(id, {
                // order: { [sortKey]: this.state.sortData ? "asc" : "desc" }
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getFundingOptionLog.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingOptionLog.count) || 0;
            this.setState({
                annualEfciLog: logs,
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

    restoreFundingOptionLog = async id => {
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
        await this.getEfciBasedOnSite();
    };

    getFundingEfciLog1 = async (id, sortKey) => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "fundingEFCI",
            sortKey: sortKey,
            annualEfciLog: []
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
                annualEfciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingSiteEfciByChartLog(id, {
                    order: { [sortKey]: "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciByChartLog.count) || 0;
                this.setState({
                    annualEfciLog: logs,
                    sortData: false,
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
                    annualEfciLog: logs,
                    sortData: false,
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
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, siteTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    sortSiteEfciLog = async (id, sortKey, flag) => {
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
                const logs = (this.props.siteReducer && this.props.siteReducer.getCapitalSpendingPlanByChartLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getCapitalSpendingPlanByChartLogs.count) || 0;
                this.setState({
                    annualEfciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getCapitalSpendingPlanLogs(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getCapitalSpendingPlanLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getCapitalSpendingPlanLogs.count) || 0;

                this.setState({
                    annualEfciLog: logs,
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
                    annualEfciLog: logs,
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
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingSiteEfciLog.count) || 0;

                this.setState({
                    annualEfciLog: logs,
                    sortData: !this.state.sortData,
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
            // }
        }
        if (flag === 2) {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingOptionByChartLog(id, {
                    // order: { [sortKey]: this.state.sortData ? "asc" : "desc" }
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getFundingOptionByChartLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingOptionByChartLog.count) || 0;

                this.setState({
                    annualEfciLog: logs,
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
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getFundingOptionLog.count) || 0;

                this.setState({
                    annualEfciLog: logs,
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
                await this.props.getTotalFundingByChartLog(id, {
                    order: { [sortKey]: !this.state.sortData ? "asc" : "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.count) || 0;
                this.setState({
                    annualEfciLog: logs,
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
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getTotalFundingLog.count) || 0;

                this.setState({
                    annualEfciLog: logs,
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
                    annualEfciLog: logs,
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
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualFundingCalculationLogs.count) || 0;
                this.setState({
                    annualEfciLog: logs,
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
                const efciLogs = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciByChartLogs.logs) || [];

                this.setState({
                    annualEfciLog: efciLogs,
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
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getAnnualEfciLogs.count) || [];
                this.setState({
                    annualEfciLog: efciLogs,
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
    };

    restoreFundingEFCILog = async id => {
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
        await this.getEfciBasedOnSite();
    };

    getTotalFundingLogs = async (id, sortKey) => {
        this.setState({
            annualEfciLog: []
        });
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "totalFunding",
            sortKey: sortKey
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
                annualEfciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            this.setState({
                annualEfciLog: []
            });
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getTotalFundingByChartLog(id, {
                    order: { [sortKey]: "desc" },
                    ...logParams
                });
                const logs = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.logs) || [];
                let totalCount = (this.props.siteReducer && this.props.siteReducer.getTotalFundingByChartLog.count) || 0;

                this.setState({
                    annualEfciLog: logs,
                    sortData: false,
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
                    annualEfciLog: logs,
                    sortData: false,
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

    restoreTotalFundingLog = async id => {
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
        await this.getEfciBasedOnSite();
    };

    getCSPLogs = async (id, sortKey, sortOrder) => {
        // await this.props.getCapitalSpendingPlanLogs(id);
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedColumnId: id,
            typeLog: "cspLog",
            sortKey: sortKey,
            annualEfciLog: []
        });
        const { logPaginationParams, logParams } = this.state;
        let totalCount =
            (this.props.siteReducer &&
                this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                this.props.siteReducer.getCapitalSpendingPlanByChartLogs.count) ||
            0;
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
                annualEfciLog: logs,
                sortData: false,
                logCount: totalCount,
                logPaginationParams: {
                    ...logPaginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                }
            });
        } else {
            await this.props.getCapitalSpendingPlanLogs(id, {
                // order: { [sortKey]: this.state.sortData ? "asc" : "desc" }
                order: { [sortKey]: "desc" },
                ...logParams
            });
            const logs = (this.props.siteReducer && this.props.siteReducer.getCapitalSpendingPlanLogs.logs) || [];
            let totalCount = (this.props.siteReducer && this.props.siteReducer.getCapitalSpendingPlanLogs.count) || 0;
            this.setState({
                annualEfciLog: logs,
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
            await this.props.restoreCapitalSpendingPlanLogs(id);
        }
        await this.getEfciBasedOnSite();
    };

    deleteEfciLogData = async id => {
        await this.props.deleteEFCILog(id);
        await this.getEfciBasedOnSite();
    };

    handleRegionEfciFundingCost = async (id, value) => {
        let tempRegionEfciFC = this.state.efciByRegion;
        tempRegionEfciFC &&
            tempRegionEfciFC.funding_options.length &&
            tempRegionEfciFC.funding_options.map(fo => {
                if (fo.id === id) {
                    fo.value = value;
                }
            });
        this.setState({
            efciByRegion: tempRegionEfciFC
        });
    };

    updateRegionEfciFundingCost = async (id, value) => {
        this.setState({
            efciLoading: true
        });
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateFundingOptionChart(id, { value });
            await this.getEfciBasedOnRegion();
            await this.getEfciBasedOnSite();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateRegionFundingCost(value, id);
            await this.getEfciBasedOnRegion();
            await this.getEfciBasedOnSite();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleRegionFundingCostEfci = async (id, value) => {
        let tempRegionEfciFC = this.state.efciByRegion;
        tempRegionEfciFC &&
            tempRegionEfciFC.expected_fcis.length &&
            tempRegionEfciFC.expected_fcis.map(efci => {
                if (efci.id === id) {
                    efci.value = value;
                }
            });
        this.setState({
            efciByRegion: tempRegionEfciFC
        });
    };

    updateRegionFundingEfci = async (id, value) => {
        this.setState({
            efciLoading: true
        });
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateFundingSiteEfciChart(id, value);
            await this.getEfciBasedOnRegion();
            await this.getEfciBasedOnSite();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateRegionFundingCostEfci(value, id);
            await this.getEfciBasedOnRegion();
            await this.getEfciBasedOnSite();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleRegionAnnualFundingOption = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciByRegion;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fundings &&
            tempRegionEfciFC.annual_fundings[index].map(item => {
                if (item.id === id) {
                    item.amount = amount;
                }
            });
        this.setState({
            efciByRegion: tempRegionEfciFC
        });
    };

    updateRegionAnnualFunding = async (id, amount) => {
        this.setState({
            efciLoading: true
        });
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateAnnualFundingChart(id, { amount });
            await this.getEfciBasedOnRegion();
            await this.getEfciBasedOnSite();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateRegionAnnualFundingOption(amount, id);
            await this.getEfciBasedOnRegion();
            await this.getEfciBasedOnSite();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleRegionAnnualEfci = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciByRegion;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fcis &&
            tempRegionEfciFC.annual_fcis[index].map(item => {
                if (item.id === id) {
                    item.value = amount;
                }
            });
        this.setState({
            efciByRegion: tempRegionEfciFC
        });
    };

    updateRegionAnnualEFCI = async (id, amount) => {
        this.setState({
            efciLoading: true
        });
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateAnnualEfciChart(id, { value: amount });
            await this.getEfciBasedOnRegion();
            await this.getEfciBasedOnSite();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateRegionAnnualEfci(id, amount);
            await this.getEfciBasedOnRegion();
            await this.getEfciBasedOnSite();
            this.setState({
                efciLoading: false
            });
        }
    };

    // getAllSiteDropdowns = async () => {
    //     await this.props.getAllConsultancyUsers();
    //     await this.props.getAllClients();
    // }

    showLog = async (id, type, noOfYears) => {
        const { sortKey } = this.state;
        this.setState({
            selectedColumnId: id,
            hasLoading: true,
            typeLog: type,
            noOfYears: noOfYears,
            efciLoading: true
        });
        await this.renderLogData(id, type);
        this.setState({
            openLogPanel: true,
            efciLoading: false
        });
        this.setState({
            hasLoading: false
        });
    };

    renderLogData = async (id, type) => {
        const { sortParams, logParams, logPaginationParams } = this.state;
        let params = { ...sortParams, ...logParams };
        if (type == "project funding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingOptionByChartLog(id, params);
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getFundingOptionByChartLog &&
                        this.props.siteReducer.getFundingOptionByChartLog.count) ||
                    0;
                // await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getFundingOptionByChartLog &&
                            this.props.siteReducer.getFundingOptionByChartLog.logs) ||
                        [],
                    logCount:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getFundingOptionByChartLog &&
                            this.props.siteReducer.getFundingOptionByChartLog.count) ||
                        0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectFundingCostLogs(id, params);
                const { FundingCostLogs } = this.props.projectReducer;
                let totalCount = FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.count : 0;
                this.setState({
                    log: FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.logs : [],
                    logCount: FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.count : 0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }
        if (type == "project_funding_total") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getTotalFundingByChartLog(id, params);
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getTotalFundingByChartLog &&
                        this.props.siteReducer.getTotalFundingByChartLog.count) ||
                    0;
                // await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                const { getTotalFundingByChartLog } = this.props.siteReducer;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getTotalFundingByChartLog &&
                            this.props.siteReducer.getTotalFundingByChartLog.logs) ||
                        [],
                    logCount:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getTotalFundingByChartLog &&
                            this.props.siteReducer.getTotalFundingByChartLog.count) ||
                        0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectFundingCostLogs(id, params);
                const { FundingCostLogs } = this.props.projectReducer;
                let totalCount = FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.count : 0;
                this.setState({
                    log: FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.logs : [],
                    logCount: FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.count : 0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        } else if (type == "fundingCostEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingSiteEfciByChartLog(id, params);
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getFundingSiteEfciByChartLog &&
                        this.props.siteReducer.getFundingSiteEfciByChartLog.count) ||
                    0;
                // await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                const { getFundingSiteEfciByChartLog } = this.props.siteReducer;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getFundingSiteEfciByChartLog &&
                            this.props.siteReducer.getFundingSiteEfciByChartLog.logs) ||
                        [],
                    logCount:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getFundingSiteEfciByChartLog &&
                            this.props.siteReducer.getFundingSiteEfciByChartLog.count) ||
                        0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectFundingCostEfciLogs(id, params);
                const { annualFundingLogs } = this.props.projectReducer;
                let totalCount = annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.count : 0;

                this.setState({
                    log: annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.logs : [],
                    logCount: annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.count : 0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        } else if (type == "cspSummary") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getCapitalSpendingPlanByChartLogs(id, params);
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                        this.props.siteReducer.getCapitalSpendingPlanByChartLogs.count) ||
                    0;
                // await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                const { getCapitalSpendingPlanByChartLogs } = this.props.siteReducer;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                            this.props.siteReducer.getCapitalSpendingPlanByChartLogs.logs) ||
                        [],
                    logCount:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                            this.props.siteReducer.getCapitalSpendingPlanByChartLogs.count) ||
                        0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectCspSummaryDataLogs(id, params);
                // await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                const { cspSummaryLog } = this.props.projectReducer;
                let totalCount = cspSummaryLog && cspSummaryLog.logs ? cspSummaryLog.count : 0;
                this.setState({
                    log: cspSummaryLog && cspSummaryLog.logs ? cspSummaryLog.logs : [],
                    logCount: cspSummaryLog && cspSummaryLog.logs ? cspSummaryLog.count : 0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        } else if (type == "annualFunding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getAnnualFundingCalculationByChartLogs(id, params);
                // await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                const { getAnnualFundingCalculationByChartLogs } = this.props.siteReducer;
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getAnnualFundingCalculationByChartLogs &&
                        this.props.siteReducer.getAnnualFundingCalculationByChartLogs.count) ||
                    0;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getAnnualFundingCalculationByChartLogs &&
                            this.props.siteReducer.getAnnualFundingCalculationByChartLogs.logs) ||
                        [],
                    logCount:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getAnnualFundingCalculationByChartLogs &&
                            this.props.siteReducer.getAnnualFundingCalculationByChartLogs.count) ||
                        0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectAnnualFundingOptionLogs(id, params);
                // await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                const { annualFundingLogs } = this.props.projectReducer;
                let totalCount = annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.count : 0;

                this.setState({
                    log: annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.logs : [],
                    logCount: annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.count : 0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        } else if (type == "annualEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getAnnualEfciByChartLogs(id, params);
                // await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                const { getAnnualEfciByChartLogs } = this.props.siteReducer;
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getAnnualEfciByChartLogs &&
                        this.props.siteReducer.getAnnualEfciByChartLogs.count) ||
                    0;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getAnnualEfciByChartLogs &&
                            this.props.siteReducer.getAnnualEfciByChartLogs.logs) ||
                        [],
                    logCount:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getAnnualEfciByChartLogs &&
                            this.props.siteReducer.getAnnualEfciByChartLogs.count) ||
                        0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectAnnualEfciLogs(id, params);
                // await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                const { annualEfciLogs } = this.props.projectReducer;
                let totalCount = annualEfciLogs && annualEfciLogs.logs ? annualEfciLogs.count : [];
                this.setState({
                    log: annualEfciLogs && annualEfciLogs.logs ? annualEfciLogs.logs : [],
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

    showLog = async (id, type, noOfYears) => {
        const { sortKey } = this.state;
        this.setState({
            selectedColumnId: id,
            hasLoading: true,
            typeLog: type,
            noOfYears: noOfYears,
            efciLoading: true
        });
        await this.renderLogData(id, type);
        this.setState({
            openLogPanel: true,
            efciLoading: false
        });
        this.setState({
            hasLoading: false
        });
    };

    renderLogModal = () => {
        const { openLogPanel, typeLog, noOfYears, logCount, logPaginationParams } = this.state;
        if (!openLogPanel) return null;
        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.state.log}
                        onCancel={this.onCancel}
                        logCount={logCount}
                        logPaginationParams={logPaginationParams}
                        handlePageClickLogs={this.handlePageClickLogs}
                        handlePerPageChangeLogs={this.handlePerPageChangeLogs}
                        restoreAnnualEfci={this.showRestore}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortFundingEfci={this.sortLog}
                        totalFunding={typeLog == "project_funding_total"}
                        numberOfYears={noOfYears}
                        value={typeLog == "fundingCostEfci" || typeLog == "annualEfci" || typeLog == "cspSummary" ? "value" : null}
                        isValue={typeLog == "fundingCostEfci" || typeLog == "annualEfci"}
                        isPercentage={typeLog == "cspSummary"}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    onCancel = () => {
        this.setState({
            openLogPanel: false,
            order: {
                "efci_versions.created_at": "desc"
            }
        });
    };

    deleteLog = async id => {
        this.setState({
            showDeleteConfirmModal: true,
            deleteId: id
        });
    };

    sortLog = async () => {
        const { typeLog, sortParams, selectedColumnId } = this.state;
        let id = selectedColumnId;
        let type = typeLog;
        let sortKey = {
            order: {
                "efci_versions.created_at": sortParams["order"]["efci_versions.created_at"] == "desc" ? "asc" : "desc"
            }
        };
        this.setState({
            sortParams: sortKey
        });

        const { logPaginationParams, logParams } = this.state;
        if (type == "project funding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingOptionByChartLog(id, { ...sortKey, ...logParams });
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getFundingOptionByChartLog &&
                        this.props.siteReducer.getFundingOptionByChartLog.count) ||
                    0;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getFundingOptionByChartLog &&
                            this.props.siteReducer.getFundingOptionByChartLog.logs) ||
                        [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectFundingCostLogs(id, { ...sortKey, ...logParams });
                const { FundingCostLogs } = this.props.projectReducer;
                let totalCount = FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.count : 0;
                this.setState({
                    log: FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.logs : [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }
        if (type == "project_funding_total") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getTotalFundingByChartLog(id, { ...sortKey, ...logParams });
                const { getTotalFundingByChartLog } = this.props.siteReducer;
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getTotalFundingByChartLog &&
                        this.props.siteReducer.getTotalFundingByChartLog.count) ||
                    0;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getTotalFundingByChartLog &&
                            this.props.siteReducer.getTotalFundingByChartLog.logs) ||
                        [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectFundingCostLogs(id, { ...sortKey, ...logParams });
                const { FundingCostLogs } = this.props.projectReducer;
                let totalCount = FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.count : 0;
                this.setState({
                    log: FundingCostLogs && FundingCostLogs.logs ? FundingCostLogs.logs : [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        } else if (type == "fundingCostEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getFundingSiteEfciByChartLog(id, { ...sortKey, ...logParams });
                const { getFundingSiteEfciByChartLog } = this.props.siteReducer;
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getFundingSiteEfciByChartLog &&
                        this.props.siteReducer.getFundingSiteEfciByChartLog.count) ||
                    0;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getFundingSiteEfciByChartLog &&
                            this.props.siteReducer.getFundingSiteEfciByChartLog.logs) ||
                        [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectFundingCostEfciLogs(id, { ...sortKey, ...logParams });
                const { annualFundingLogs } = this.props.projectReducer;
                let totalCount = annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.count : 0;
                this.setState({
                    log: annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.logs : [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        } else if (type == "cspSummary") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getCapitalSpendingPlanByChartLogs(id, { ...sortKey, ...logParams });
                const { getCapitalSpendingPlanByChartLogs } = this.props.siteReducer;
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                        this.props.siteReducer.getCapitalSpendingPlanByChartLogs.count) ||
                    0;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getCapitalSpendingPlanByChartLogs &&
                            this.props.siteReducer.getCapitalSpendingPlanByChartLogs.logs) ||
                        [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectCspSummaryDataLogs(id, { ...sortKey, ...logParams });
                const { cspSummaryLog } = this.props.projectReducer;
                let totalCount = cspSummaryLog && cspSummaryLog.logs ? cspSummaryLog.count : 0;
                this.setState({
                    log: cspSummaryLog && cspSummaryLog.logs ? cspSummaryLog.logs : [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        } else if (type == "annualFunding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getAnnualFundingCalculationByChartLogs(id, { ...sortKey, ...logParams });
                const { getAnnualFundingCalculationByChartLogs } = this.props.siteReducer;
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getAnnualFundingCalculationByChartLogs &&
                        this.props.siteReducer.getAnnualFundingCalculationByChartLogs.count) ||
                    0;

                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getAnnualFundingCalculationByChartLogs &&
                            this.props.siteReducer.getAnnualFundingCalculationByChartLogs.logs) ||
                        [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectAnnualFundingOptionLogs(id, { ...sortKey, ...logParams });
                const { annualFundingLogs } = this.props.projectReducer;
                let totalCount = annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.count : 0;
                this.setState({
                    log: annualFundingLogs && annualFundingLogs.logs ? annualFundingLogs.logs : [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        } else if (type == "annualEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.getAnnualEfciByChartLogs(id, { ...sortKey, ...logParams });
                const { getAnnualEfciByChartLogs } = this.props.siteReducer;
                let totalCount =
                    (this.props.siteReducer &&
                        this.props.siteReducer.getAnnualEfciByChartLogs &&
                        this.props.siteReducer.getAnnualEfciByChartLogs.count) ||
                    0;
                this.setState({
                    log:
                        (this.props.siteReducer &&
                            this.props.siteReducer.getAnnualEfciByChartLogs &&
                            this.props.siteReducer.getAnnualEfciByChartLogs.logs) ||
                        [],
                    logCount: totalCount,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            } else {
                await this.props.getProjectAnnualEfciLogs(id, { ...sortKey, ...logParams });
                const { annualEfciLogs } = this.props.projectReducer;
                let totalCount = annualEfciLogs && annualEfciLogs.logs ? annualEfciLogs.count : 0;
                this.setState({
                    log: annualEfciLogs && annualEfciLogs.logs ? annualEfciLogs.logs : [],
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
    totalFundingCost = async changeSet => {
        let data = {};
        data = { value: [changeSet.value[0] * this.state.noOfYears, changeSet.value[1] * this.state.noOfYears] };
        return data;
    };

    renderLog = () => {
        const { openRenderLog, changeSet, associated_changes } = this.state;
        if (!openRenderLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        onNo={() => this.setState({ openRenderLog: false })}
                        onYes={this.restoreLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openRenderLog: false })}
            />
        );
    };

    restoreLogs = async id => {
        this.setState({
            hasLoading: true,
            openRenderLog: false
        });
        const { restoreId, typeLog } = this.state;

        if (typeLog == "project funding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreFundingOptionByChartLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectFundingCostLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        }
        if (typeLog == "project_funding_total") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreFundingTotalByChartLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectFundingCostLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        } else if (typeLog == "fundingCostEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreFundingEfciByChartLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectFundingCostEfciLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        } else if (typeLog == "cspSummary") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreCapitalSpendingPlanByChartLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectCspSummaryDataLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        } else if (typeLog == "annualFunding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreAnnualFundingByChartCalculation(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectAnnualFundingOptionLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        } else if (typeLog == "annualEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreAnnualByChartEFCI(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectAnnualEfciLogs(restoreId);
                await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        }
        // await this.props.restoreSiteFundingEFCILog(this.state.restoreId);
        this.setState({
            openRenderLog: false,
            hasLoading: false,
            openRestore: false,
            openLogPanel: false
        });
    };

    deleteConfirmationModal = () => {
        const { showDeleteConfirmModal } = this.state;
        if (!showDeleteConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this log ?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showDeleteConfirmModal: false })}
                        onYes={this.deleteConfirmLog}
                    />
                }
                onCancel={() => this.setState({ showDeleteConfirmModal: false })}
            />
        );
    };

    deleteConfirmLog = async id => {
        this.setState({ hasLoading: true });
        await this.props.deleteEFCILog(this.state.deleteId);
        await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
        await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
        this.setState({
            hasLoading: false,
            showDeleteConfirmModal: false,
            openRenderLog: false,
            openLogPanel: false
        });
    };
    getAllSiteDropdowns = async () => {
        let role = localStorage.getItem("role") || "";
        await this.props.getAllConsultancyUsers();
        if (role === "consultancy_user") {
            await this.props.getAllClients();
        }
        await this.props.getAllConsultanciesDropdown();
    };

    showRestore = async (id, changeSet) => {
        let data = changeSet;
        const { typeLog } = this.state;
        if (typeLog == " project_funding_total") {
            data = await this.totalFundingCost(changeSet);
        }
        this.setState({
            openRenderLog: true,
            restoreId: id,
            changeSet: data
        });
    };

    totalSiteFundingCost = async changeSet => {
        let data = {};
        data = { value: [changeSet.value[0] * this.state.noOfYears, changeSet.value[1] * this.state.noOfYears] };
        return data;
    };

    forceUpdateData = async (value, index) => {
        this.setState({
            efciLoading: true
        });
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let params = {
            project_id: query.pid,
            site_id: this.props.match.params.id,
            fcis: [{ value: parseFloat(value), index: index }]
        };
        await this.props.forceUpdateProjectFundingCostEfci(params);
        await this.getEfciBasedOnSite();
        this.setState({
            efciLoading: false
        });
    };

    forceUpdateData = async (value, index, key) => {
        const { forcedChangeArray, tempArray } = this.state;
        let test = forcedChangeArray;
        this.setState({
            efciLoading: true,
            isValueChanged: true
        });
        let tempData = tempArray;
        tempData[key] = { value: parseFloat(value), index: index };
        // if (test.length) {
        let isElement = test.length && test.find(f => f.index == index);

        if (isElement) {
            test.length &&
                test.map((t, keyValue) => {
                    if (t.index == index) {
                        test[keyValue] = { value: parseFloat(value), index: index };
                    }
                });
            // test[value] = parseFloat(value)
        } else {
            test.push({ value: parseFloat(value), index: index });
        }
        // }
        this.setState({
            tempArray: tempData,
            forcedChangeArray: test
        });

        this.setState({
            efciLoading: false
        });
    };

    saveDataForce = async () => {
        const { forcedChangeArray, efciData, tempArray } = this.state;
        this.setState({
            efciLoading: true
        });

        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const projectId = query.pid;
        let params = {
            project_id: projectId,
            site_id: this.props.match.params.id,
            fcis: forcedChangeArray
        };
        await this.props.forceUpdateProjectFundingCostEfci(params);
        await this.getEfciBasedOnSite();
        this.setState({
            efciLoading: false,
            forcedChangeArray: [],
            isValueChanged: false
        });
    };

    handleDisableButtons = () => {
        let entity = JSON.parse(sessionStorage.getItem("bc-data"))?.[0]?.name;
        if (entity === "Energy Management" || entity === "Asset Management") {
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
            selectedSite,
            infoTabsData,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission,
            imageResponse
        } = this.state;
        const {
            match: {
                params: { section, tab }
            }
        } = this.props;
        return (
            // <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
            <LoadingOverlay active={tab === "basicdetails" ? false : this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                <>
                    {this.renderLogModal()}
                    {this.renderLog()}
                    {this.deleteConfirmationModal()}
                    {section === "add" || section === "edit" ? (
                        <Form
                            selectedSite={selectedSite}
                            refreshSiteList={this.refreshSiteList}
                            handleAddSite={this.handleAddSite}
                            handleUpdateSite={this.handleUpdateSite}
                            consultancy_users1={consultancy_users}
                            getAllSiteDropdowns={this.getAllSiteDropdowns}
                        />
                    ) : section === "siteinfo" ? (
                        <SiteInfo
                            keys={tableData.keys}
                            config={tableData.config}
                            futureCapitaldata={this.state.futureCapitalData}
                            proFutureCapitaldata={this.state.nonFutureCapitalData}
                            differedMaintenance={this.state.differedMaintenanceData}
                            proDifferedMaintenance={this.state.proDifferedMaintenanceData}
                            siteId={this.props.match.params.id}
                            infoTabsData={infoTabsData}
                            showInfoPage={this.showInfoPage}
                            getDataById={this.getDataById}
                            handleUpdateData={this.handleUpdateSite}
                            uploadImages={this.uploadImages}
                            getAllImageList={this.getAllImageList}
                            deleteImages={this.deleteImages}
                            updateSiteImageComment={this.updateSiteImageComment}
                            handleDeleteItem={this.handleDeleteSite}
                            efciSiteData={this.state.efciSiteData}
                            updateSiteCapitalSpending={this.updateSiteCapitalSpending}
                            updatePercentage={this.updatePercentage}
                            updateProjectAnnualFunding={this.updateProjectAnnualFunding}
                            updateSiteFundingOption={this.updateSiteFundingOption}
                            updateEfciInInitialFundingOptions={this.updateEfciInInitialFundingOptions}
                            updateAnnualEfciCalculation={this.updateAnnualEfciCalculation}
                            updateFcis={this.updateFcis}
                            updateAnnualFundingOptionCalculation={this.updateAnnualFundingOptionCalculation}
                            updateAnnualFundingOption1={this.updateAnnualFundingOption1}
                            updateFundingEfciData={this.updateFundingEfciData}
                            updateTotalProjectFunding={this.updateTotalProjectFunding}
                            updateHiddenFundingOption={this.updateHiddenFundingOption}
                            hiddenFundingOptionList={this.state.hiddenFundingOptionList}
                            updateBuildingEfciLock={this.updateBuildingEfciLock}
                            getEfciBasedOnSite={this.getEfciBasedOnSite}
                            loadData={this.loadData}
                            saveData={this.saveData}
                            getAllSitLogs={this.getLogData}
                            handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                            handlePageClickHistory={this.handlePageClickHistory}
                            handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                            globalSearchKeyHistory={
                                this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""
                            }
                            logData={logData}
                            handleDeleteLog={this.handleDeleteLog}
                            historyPaginationParams={historyPaginationParams}
                            HandleRestoreSiteLog={this.HandleRestoreRegionLog}
                            historyParams={historyParams}
                            updateLogSortFilters={this.updateLogSortFilters}
                            getAnnualEfciColumnLogs={this.getAnnualEfciColumnLogs}
                            annualEfciLog={this.state.annualEfciLog}
                            annualEfciLogsLoading={this.state.annualEfciLogsLoading}
                            getAnnualFundingCalculationColumnLogs={this.getAnnualFundingCalculationColumnLogs}
                            annualFundingOptionLogs={this.state.annualFundingOptionLogs}
                            restoreAnnualEfciCalculation={this.restoreAnnualEfciCalculation}
                            restoreAnnualFundingOption={this.restoreAnnualFundingOption}
                            getFundingOptionLogs={this.getFundingOptionLogs}
                            restoreFundingOptionLog={this.restoreFundingOptionLog}
                            getFundingEfciLog1={this.getFundingEfciLog1}
                            restoreFundingEFCILog={this.restoreFundingEFCILog}
                            getTotalFundingLogs={this.getTotalFundingLogs}
                            restoreTotalFundingLog={this.restoreTotalFundingLog}
                            getCSPLogs={this.getCSPLogs}
                            restoreCSP={this.restoreCSP}
                            deleteEfciLogData={this.deleteEfciLogData}
                            sortSiteEfciLog={this.sortSiteEfciLog}
                            getColorCode={this.getColorCode}
                            colorCodes={this.state.colorCodes}
                            efciLoading={this.state.efciLoading}
                            efciByRegion={this.state.efciByRegion}
                            handleRegionEfciFundingCost={this.handleRegionEfciFundingCost}
                            updateRegionEfciFundingCost={this.updateRegionEfciFundingCost}
                            handleRegionFundingCostEfci={this.handleRegionFundingCostEfci}
                            updateRegionFundingEfci={this.updateRegionFundingEfci}
                            handleRegionAnnualFundingOption={this.handleRegionAnnualFundingOption}
                            updateRegionAnnualFunding={this.updateRegionAnnualFunding}
                            handleRegionAnnualEfci={this.handleRegionAnnualEfci}
                            updateRegionAnnualEFCI={this.updateRegionAnnualEFCI}
                            permissions={permissions}
                            logPermission={logPermission}
                            imageResponse={imageResponse}
                            showLog={this.showLog}
                            updateSiteEfciLock={this.updateSiteEfciLock}
                            tempArray={this.state.tempArray}
                            resetData={this.resetData}
                            forceUpdateData={this.forceUpdateData}
                            saveDataForce={this.saveDataForce}
                            isValueChanged={this.state.isValueChanged}
                            logCount={this.state.logCount}
                            logPaginationParams={this.state.logPaginationParams}
                            handlePageClickLogs={this.handlePageClickLogs}
                            handlePerPageChangeLogs={this.handlePerPageChangeLogs}
                            hasEdit={this.handleDisableButtons() ? false : checkPermission("forms", "sites", "edit")}
                            hasDelete={this.handleDisableButtons() ? false : checkPermission("forms", "sites", "delete")}
                            hasLogView={this.handleDisableButtons() ? false : checkPermission("logs", "sites", "view")}
                            hasLogDelete={this.handleDisableButtons() ? false : checkPermission("logs", "sites", "delete")}
                            hasLogRestore={this.handleDisableButtons() ? false : checkPermission("logs", "sites", "restore")}
                            hasInfoPage={checkPermission("forms", "sites", "view")}
                            hasCreate={checkPermission("forms", "sites", "create")}
                            hasLock={checkPermission("forms", "recommendations", "lock")}
                            entity="sites"
                        />
                    ) : section === "efciinfo" ? (
                        <EfciInfo
                            keys={tableData.keys}
                            config={tableData.config}
                            futureCapitaldata={this.state.futureCapitalData}
                            proFutureCapitaldata={this.state.nonFutureCapitalData}
                            differedMaintenance={this.state.differedMaintenanceData}
                            proDifferedMaintenance={this.state.proDifferedMaintenanceData}
                            siteId={this.props.match.params.id}
                            infoTabsData={infoTabsData}
                            showInfoPage={this.showInfoPage}
                            getDataById={this.getDataById}
                            handleUpdateData={this.handleUpdateSite}
                            uploadImages={this.uploadImages}
                            getAllImageList={this.getAllImageList}
                            deleteImages={this.deleteImages}
                            updateSiteImageComment={this.updateSiteImageComment}
                            handleDeleteItem={this.handleDeleteSite}
                            efciSiteData={this.state.efciSiteData}
                            updateSiteCapitalSpending={this.updateSiteCapitalSpending}
                            updatePercentage={this.updatePercentage}
                            updateProjectAnnualFunding={this.updateProjectAnnualFunding}
                            updateSiteFundingOption={this.updateSiteFundingOption}
                            updateEfciInInitialFundingOptions={this.updateEfciInInitialFundingOptions}
                            updateAnnualEfciCalculation={this.updateAnnualEfciCalculation}
                            updateFcis={this.updateFcis}
                            updateAnnualFundingOptionCalculation={this.updateAnnualFundingOptionCalculation}
                            updateAnnualFundingOption1={this.updateAnnualFundingOption1}
                            // updateEfciInInitialFundingOptions={this.updateEfciInInitialFundingOptions}
                            updateFundingEfciData={this.updateFundingEfciData}
                            updateTotalProjectFunding={this.updateTotalProjectFunding}
                            updateHiddenFundingOption={this.updateHiddenFundingOption}
                            hiddenFundingOptionList={this.state.hiddenFundingOptionList}
                            updateBuildingEfciLock={this.updateBuildingEfciLock}
                            updateSiteEfciLock={this.updateSiteEfciLock}
                            getEfciBasedOnSite={this.getEfciBasedOnSite}
                            loadData={this.loadData}
                            saveData={this.saveData}
                            annualEfciLog={this.state.annualEfciLog}
                            getAnnualEfciColumnLogs={this.getAnnualEfciColumnLogs}
                            restoreAnnualEfciCalculation={this.restoreAnnualEfciCalculation}
                            deleteEfciLogData={this.deleteEfciLogData}
                            sortSiteEfciLog={this.sortSiteEfciLog}
                            getAnnualFundingCalculationColumnLogs={this.getAnnualFundingCalculationColumnLogs}
                            restoreAnnualFundingOption={this.restoreAnnualFundingOption}
                            getFundingOptionLogs={this.getFundingOptionLogs}
                            restoreFundingOptionLog={this.restoreFundingOptionLog}
                            getFundingEfciLog1={this.getFundingEfciLog1}
                            restoreFundingEFCILog={this.restoreFundingEFCILog}
                            getTotalFundingLogs={this.getTotalFundingLogs}
                            restoreTotalFundingLog={this.restoreTotalFundingLog}
                            getCSPLogs={this.getCSPLogs}
                            restoreCSP={this.restoreCSP}
                            getColorCode={this.getColorCode}
                            colorCodes={this.state.colorCodes}
                            efciByRegion={this.state.efciByRegion}
                            handleRegionEfciFundingCost={this.handleRegionEfciFundingCost}
                            updateRegionEfciFundingCost={this.updateRegionEfciFundingCost}
                            handleRegionFundingCostEfci={this.handleRegionFundingCostEfci}
                            updateRegionFundingEfci={this.updateRegionFundingEfci}
                            handleRegionAnnualFundingOption={this.handleRegionAnnualFundingOption}
                            updateRegionAnnualFunding={this.updateRegionAnnualFunding}
                            handleRegionAnnualEfci={this.handleRegionAnnualEfci}
                            updateRegionAnnualEFCI={this.updateRegionAnnualEFCI}
                            efciLoading={this.state.efciLoading}
                            showLog={this.showLog}
                            // updateSiteEfciLock={this.updateSiteEfciLock}
                            tempArray={this.state.tempArray}
                            resetData={this.resetData}
                            forceUpdateData={this.forceUpdateData}
                            saveDataForce={this.saveDataForce}
                            isValueChanged={this.state.isValueChanged}
                            logCount={this.state.logCount}
                            logPaginationParams={this.state.logPaginationParams}
                            handlePageClickLogs={this.handlePageClickLogs}
                            handlePerPageChangeLogs={this.handlePerPageChangeLogs}
                        />
                    ) : (
                        <SiteMain
                            showWildCardFilter={showWildCardFilter}
                            paginationParams={paginationParams}
                            currentViewAllUsers={currentViewAllUsers}
                            showViewModal={this.showViewModal}
                            tableData={tableData}
                            isColunmVisibleChanged={this.isColunmVisibleChanged}
                            handleGlobalSearch={this.handleGlobalSearch}
                            toggleWildCardFilter={this.toggleWildCardFilter}
                            updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                            handleDeleteSite={this.handleDeleteSite}
                            showEditPage={this.showEditPage}
                            handlePerPageChange={this.handlePerPageChange}
                            handlePageClick={this.handlePageClick}
                            showAddForm={this.showAddForm}
                            showInfoPage={this.showInfoPage}
                            updateSelectedRow={this.updateSelectedRow}
                            selectedRowId={selectedRowId}
                            globalSearchKey={this.state.params.search}
                            updateWildCardFilter={this.updateWildCardFilter}
                            wildCardFilter={this.state.params.filters}
                            handleHideColumn={this.handleHideColumn}
                            getListForCommonFilterSite={this.getListForCommonFilter}
                            updateCommonFilter={this.updateCommonFilter}
                            commonFilter={this.state.params.list}
                            resetAllFilters={this.resetAllFilters}
                            resetAll={this.resetAll}
                            updateTableSortFilters={this.updateTableSortFilters}
                            resetSort={this.resetSort}
                            tableParams={this.state.params}
                            exportSiteTable={this.exportSiteTable}
                            tableLoading={this.state.tableLoading}
                            permissions={permissions}
                            logPermission={logPermission}
                            hasExport={checkPermission("forms", "sites", "export")}
                            showAddButton={this.handleDisableButtons() ? false : checkPermission("forms", "sites", "create")}
                            hasEdit={this.handleDisableButtons() ? false : checkPermission("forms", "sites", "edit")}
                            hasDelete={this.handleDisableButtons() ? false : checkPermission("forms", "sites", "delete")}
                            hasActionColumn={!this.handleDisableButtons()}
                            hasInfoPage={checkPermission("forms", "sites", "view")}
                            entity="sites"
                        />
                    )}
                    {this.renderSiteModal()}
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
                </>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { siteReducer, buildingReducer, commonReducer, projectReducer, recommendationsReducer, regionReducer } = state;
    return { siteReducer, buildingReducer, commonReducer, projectReducer, recommendationsReducer, regionReducer };
};
let { getChartsDashboardPython } = dashboardActions;

export default withRouter(
    connect(mapStateToProps, {
        ...siteActions,
        ...buildingActions,
        ...CommonActions,
        ...projectActions,
        ...regionActions,
        getChartsDashboardPython
    })(index)
);
