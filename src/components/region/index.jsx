import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import LoadingOverlay from "react-loading-overlay";
import _, { keys } from "lodash";
import Loader from "../common/components/Loader";
import CommonActions from "../common/actions";
import Portal from "../common/components/Portal";
import ViewModal from "../common/components/ViewModal";
import ConfirmationModal from "../common/components/ConfirmationModal";
import AssignConsultancyUserModal from "./components/AssignConsultancyUserModal";
import AssignClientUserModal from "./components/AssignClientUserModal";
import regionActions from "./actions";
import projectActions from "../project/actions";
import RegionMain from "./components/RegionMain";
import RegionInfo from "./components/RegionInfo";
import Form from "./components/Form";
import { regionTableData } from "../../config/tableData";
import recommendationActions from "../recommendations/actions";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrumpRecData,
    findPrevPathFromBreadCrump,
    popBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    checkPermission
} from "../../config/utils";
import EfciInfo from "./components/EfciInfo";
import EFCILogs from "../common/components/CommonEFCI/EfciLogs";
import siteAction from "../site/actions";
import dashboardActions from "../dashboard/actions";
class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        regionList: [],
        hiddenFundingOptionList: [],
        paginationParams: this.props.regionReducer.entityParams.paginationParams,
        currentViewAllUsers: null,
        currentActions: null,
        efciLoading: false,
        showRegionModal: false,
        efciRegionData: [],
        showViewModal: false,
        tableLoading: false,
        colorCodes: [],
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        clients: [],
        consultancy_users: [],
        selectedRowId: this.props.regionReducer.entityParams.selectedRowId,
        params: this.props.regionReducer.entityParams.params,
        isDashboardFiltered: this.props.regionReducer.entityParams.isDashboardFiltered,
        tableData: {
            keys: regionTableData.keys,
            config: this.props.regionReducer.entityParams.tableConfig || _.cloneDeep(regionTableData.config)
        },
        selectedRegion: this.props.match.params.id || this.props.regionReducer.entityParams.selectedEntity,
        infoTabsData: [],
        filterParams: this.props.regionReducer.entityParams.filterParams,
        alertMessage: "",
        historyPaginationParams: this.props.regionReducer.entityParams.historyPaginationParams,
        historyParams: this.props.regionReducer.entityParams.historyParams,
        building_ids: this.props.regionReducer.entityParams.building_ids,
        start_year: this.props.regionReducer.entityParams.start_year,
        end_year: this.props.regionReducer.entityParams.end_year,
        region_ids: this.props.regionReducer.entityParams.region_ids,
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
        logs: "",
        typeLog: "",
        noOfYears: null,
        openRenderLog: false,
        openLogPanel: false,
        deleteId: null,
        restoreId: null,
        showDeleteConfirmModal: false,
        sortParams: {
            order: {
                "efci_versions.created_at": "desc"
            }
        },
        isValueChanged: false,
        forcedChangeArray: [],
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
        logCount: 0,
        dashboardFilterParams: this.props.regionReducer.entityParams.dashboardFilterParams
    };

    renderLogData = async (id, type) => {
        const { sortParams, logParams, logPaginationParams } = this.state;
        let params = { ...sortParams, ...logParams };
        if (type === "project funding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab == "dashboard" || tab === "efcisandbox") {
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
        if (type === "project_funding_total") {
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
            if (tab == "dashboard" || tab === "efcisandbox") {
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
            if (tab == "dashboard" || tab === "efcisandbox") {
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
            if (tab == "dashboard" || tab === "efcisandbox") {
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
            if (tab == "dashboard" || tab === "efcisandbox") {
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

    handlePerPageChangeLogs = async e => {
        const { logPaginationParams, typeLog, selectedColumnId, logParams, noOfYears } = this.state;
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
        await this.showLog(selectedColumnId, typeLog, noOfYears);
    };

    handlePageClickLogs = async page => {
        const { logPaginationParams, logParams, typeLog, selectedColumnId, noOfYears } = this.state;
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
        await this.showLog(selectedColumnId, typeLog, noOfYears);
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
        const { openLogPanel, typeLog, noOfYears, logPaginationParams, logCount } = this.state;
        if (!openLogPanel) return null;
        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.state.log}
                        logCount={logCount}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestore}
                        logPaginationParams={logPaginationParams}
                        handlePageClickLogs={this.handlePageClickLogs}
                        handlePerPageChangeLogs={this.handlePerPageChangeLogs}
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
            if (tab == "dashboard" || tab === "efcisandbox") {
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
        if (type === "project_funding_total") {
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
        } else if (type === "fundingCostEfci") {
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
        } else if (type === "cspSummary") {
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
        } else if (type === "annualFunding") {
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
        const { openRenderLog, changeSet } = this.state;
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

        if (typeLog === "project funding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreFundingOptionByChartLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectFundingCostLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        }
        if (typeLog === "project_funding_total") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreFundingTotalByChartLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectFundingCostLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        } else if (typeLog === "fundingCostEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreFundingEfciByChartLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectFundingCostEfciLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        } else if (typeLog === "cspSummary") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreCapitalSpendingPlanByChartLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectCspSummaryDataLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        } else if (typeLog === "annualFunding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab == "dashboard") {
                await this.props.restoreAnnualFundingByChartCalculation(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectAnnualFundingOptionLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            }
        } else if (typeLog === "annualEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreAnnualByChartEFCI(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
                await this.renderLogData(this.state.selectedColumnId, this.state.typeLog);
            } else {
                await this.props.restoreProjectAnnualEfciLogs(restoreId);
                await this.getEfciBasedOnRegion(
                    this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
                );
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
        await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true });
        this.setState({
            hasLoading: false,
            showDeleteConfirmModal: false,
            openRenderLog: false,
            openLogPanel: false
        });
    };

    showRestore = async (id, changeSet) => {
        let data = changeSet;
        const { typeLog } = this.state;
        if (typeLog === " project_funding_total") {
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

    componentDidMount = async () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;

        if (section !== "efciinfo") {
            await this.refreshRegionList();
            this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true });
            this.getEfciByProject();
        } else {
            this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true });
            this.getEfciByProject();
            this.setState({ isLoading: false });
        }
    };

    componentDidUpdate = async prevProps => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (prevProps.match.params.tab !== tab) {
            await this.getEfciBasedOnRegion(
                this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true }
            );
            this.getEfciByProject();
        } else if (tab === "efci" && prevProps.match.params.tab !== tab) {
            this.getEfciBasedOnRegion();
            this.getEfciByProject();
        }
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getEfciBasedOnRegion();
            this.getEfciByProject();
        }
    };

    getEfciByProject = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const projectId = query.pid;
        this.setState({
            efciLoading: true
        });

        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.getChartEfciProject(projectId);
            this.setState({
                efciProjectData: this.props.projectReducer.getEfciBySiteGraph ? this.props.projectReducer.getEfciBySiteGraph.region || {} : {},
                efciLoading: false
            });
        } else if (tab === "efci") {
            await this.props.getEfciByProject(projectId);
            this.setState({
                efciProjectData: (this.props.projectReducer.getEfciByProject && this.props.projectReducer.getEfciByProject.project) || {},
                efciLoading: false
            });
        }
    };

    getEfciBasedOnRegion = async tempParams => {
        this.setState({
            efciLoading: true
        });
        const regionId = this.props.match.params.id;
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

            let chartParams = {
                regionId: regionId,
                projectId: query.pid
            };
            let tempData = {
                ...tempParams,
                ...this.state.filterValues,
                project_id: query.pid
            };

            await this.props.getTradeSettingsDropdown(query.pid);
            const { trades } = this.props.projectReducer.getTradeSettingsDropdownResponse || {};
            const trade_ids = trades?.length ? [trades[0]?.id] : [];
            const systemParams = {
                chart_type: "proj_fca_chart",
                export_type: "system",
                trade_ids,
                project_ids: [query.pid],
                region_ids: [regionId],
                user_id: localStorage.getItem("userId")
            };
            await Promise.all([
                this.getColorCode(),
                this.props.getMiscSettings(query.pid),
                this.props.getChartsByRegion(chartParams, tempData),
                this.props.getChartsDashboardPython(systemParams)
            ]);

            let siteChecked = [];
            if (siteDatas && this.props.match.params.id === siteDatas.id) {
                siteChecked = siteDatas ? (siteDatas.region ? siteDatas.region : []) : [];
            }
            let param = { reset: true };
            if (siteChecked && siteChecked.length) {
                param = {
                    ...param,
                    site_ids: siteChecked
                };
            }
            await this.props.getChartEfciRegion(regionId, query.pid, param);
            await this.setState({
                efciRegionData: this.props.regionReducer.getEfciBySiteGraph ? this.props.regionReducer.getEfciBySiteGraph.region || {} : {},
                efciSiteData: this.props.regionReducer.getEfciBySiteGraph ? this.props.regionReducer.getEfciBySiteGraph.region || {} : {},
                efciLoading: false
            });
        } else if (tab === "efci") {
            await this.getColorCode();

            await this.props.getEfciByRegion(projectId, regionId);
            this.setState(
                {
                    efciRegionData: this.props.regionReducer.getEfciByRegion.region || {},
                    efciLoading: false
                },
                () => this.resetData()
            );
        }
    };

    resetData = () => {
        let tempArray = [];
        const { efciRegionData } = this.state;
        if (efciRegionData && efciRegionData.funding_options && efciRegionData.funding_options.length) {
            efciRegionData.funding_options.map((item, index) =>
                tempArray.push({ value: parseFloat(efciRegionData.expected_fcis[index].value), index: item.index })
            );
        }
        this.setState({
            tempArray
        });
    };

    loadDataRegion = async params => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const regionId = this.props.match.params.id;
        await this.props.loadChartDataRegion(regionId, query.pid);
        await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true });
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, regionTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    saveData = async params => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const regionId = this.props.match.params.id;
        await this.props.saveDataEfciChartRegion(regionId, query.pid);
        await this.getEfciBasedOnRegion();
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

    refreshRegionList = async () => {
        await this.setState({ isLoading: true });
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name === "Dashboard" ? true : false;
        }
        const { paginationParams, tableData, dashboardFilterParams } = this.state;
        const {
            location: { search },
            match: {
                params: { section }
            }
        } = this.props;
        const query = qs.parse(search);
        await this.setState({
            params: {
                ...this.state.params,
                project_id: null,
                region_ids: (isDashboardFiltered ? this.state.region_ids : null) || null,
                building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                end_year: (isDashboardFiltered ? this.state.end_year : null) || null
            }
        });
        if (query.pid && query.pid.trim().length) {
            await this.setInFoPage(this.props.match.params.id);
            await this.setState({
                params: {
                    ...this.state.params,
                    project_id: query.pid || null
                }
            });
        }
        if (this.props.projectId) {
            await this.setState({
                params: {
                    ...this.state.params,
                    project_id: this.props.projectId
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

        await this.props.getAllRegions({
            ...this.state.params,
            ...(isDashboardFiltered && { ...dashboardFilterParams })
        });

        // go to previous page is the last record of the current page is deleted
        if (
            this.props.regionReducer.getAllRegionsResponse.regions &&
            !this.props.regionReducer.getAllRegionsResponse.regions.length &&
            paginationParams.currentPage
        ) {
            this.setState({
                params: {
                    ...this.state.params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getAllRegions(this.state.params);
        }
        if (
            this.props.regionReducer.getAllRegionsResponse.regions &&
            !this.props.regionReducer.getAllRegionsResponse.regions.length &&
            this.props.regionReducer.getAllRegionsResponse &&
            this.props.regionReducer.getAllRegionsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.regionReducer.getAllRegionsResponse.error });
            this.showAlerts();
        }

        const {
            regionReducer: {
                getAllRegionsResponse: { regions, count },
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            }
        } = this.props;
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.regions
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.regions || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.region_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.region_logs || {}
                : {};

        this.setState({
            tableData: {
                ...tableData,
                data: regions,
                config: this.props.regionReducer.entityParams.tableConfig || tableData.config
            },
            regionList: regions,
            paginationParams: {
                ...paginationParams,
                totalCount: count,
                totalPages: Math.ceil(count / paginationParams.perPage)
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
        await this.refreshRegionList();
    };

    updateEntityParams = async () => {
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name === "Dashboard" ? true : false;
        }
        let entityParams = {
            entity: "Region",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            region_ids: (isDashboardFiltered ? this.state.region_ids : null) || null,
            building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
            start_year: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.start_year,
            end_year: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.end_year,
            dashboardFilterParams: this.state.dashboardFilterParams
        };
        await this.props.updateRegionEntityParams(entityParams);
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
        await this.refreshRegionList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshRegionList();
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
                config: _.cloneDeep(regionTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });

        this.updateEntityParams();
        await this.refreshRegionList();
    };

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;

        const {
            match: {
                params: { section }
            }
        } = this.props;

        const project_id = this.state.params.project_id;

        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name === "Dashboard" ? true : false;
        }
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        params.start_year = (isDashboardFiltered ? this.state.start_year : null) || null;
        params.end_year = (isDashboardFiltered ? this.state.end_year : null) || null;

        if (section === "energyinfo" || section === "assetinfo") {
            params.client_id = this.props.clientId;
            await this.props.getListForCommonFilter(params);
            return (this.props.regionReducer.getListForCommonFilterResponse && this.props.regionReducer.getListForCommonFilterResponse.list) || [];
        }

        params.project_id = project_id;
        params.region_ids = isDashboardFiltered ? this.state.region_ids : null;
        params.building_ids = (isDashboardFiltered ? this.state.building_ids : null) || null;

        await this.props.getListForCommonFilter({ ...params, ...(isDashboardFiltered && { ...this.state.dashboardFilterParams }) });

        return (this.props.regionReducer.getListForCommonFilterResponse && this.props.regionReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshRegionList();
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
        await this.refreshRegionList();
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
        await this.refreshRegionList();
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
        await this.refreshRegionList();
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

    showEditPage = regionId => {
        const { history } = this.props;
        this.setState({
            selectedRegion: regionId
        });
        addToBreadCrumpData({ key: "edit", name: "Edit Region", path: `/region/edit/${regionId}` });
        history.push(`/region/edit/${regionId}`);
    };

    getDataById = async regionId => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const project_id = query.pid;
        await this.props.getRegionById(regionId, { project_id });
        return true;
    };

    setInFoPage = regionId => {
        const {
            location: { search },
            match: {
                params: { section, id }
            }
        } = this.props;

        let query = qs.parse(search);
        if (section === "projectinfo") {
            query.pid = id;
        }
        let tempSearch = "?" + qs.stringify(query);
        this.setState({
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Region",
                    path: `/region/regioninfo/${regionId}/basicdetails${tempSearch}`
                },
                {
                    key: "sites",
                    name: "Sites",
                    path: `/region/regioninfo/${regionId}/sites${tempSearch}`
                },
                {
                    key: "buildings",
                    name: "Buildings",
                    path: `/region/regioninfo/${regionId}/buildings${tempSearch}`
                },
                {
                    key: "recommendations",
                    name: "Recommendations",
                    path: `/region/regioninfo/${regionId}/recommendations${tempSearch}`
                },
                {
                    key: "infoimages",
                    name: "Images",
                    path: `/region/regioninfo/${regionId}/infoimages${tempSearch}`
                },
                {
                    key: "dashboard",
                    name: "Charts & Graphs",
                    path: `/region/regioninfo/${regionId}/dashboard${tempSearch}`,
                    show: checkPermission("charts_and_graph", "region", "view")
                },
                {
                    key: "infomap",
                    name: "Map",
                    path: `/region/regioninfo/${regionId}/infomap${tempSearch}`
                },
                {
                    key: "efcisandbox",
                    name: "EFCI Sandbox",
                    path: `/region/regioninfo/${regionId}/efcisandbox${tempSearch}`
                },
                {
                    key: "efci",
                    name: "EFCI",
                    path: `/region/regioninfo/${regionId}/efci${tempSearch}`
                },
                // {
                //     key: "reports",
                //     name: "Reports",
                //     path: `/region/regioninfo/${regionId}/reports/specialReports${tempSearch}`,
                //     bcName: "Special Reports"
                // },
                {
                    key: "softCosts",
                    name: "Soft Costs",
                    path: `/region/regioninfo/${regionId}/softCosts${tempSearch}`
                },
                {
                    key: "documents",
                    name: "Documents",
                    path: `/region/regioninfo/${regionId}/documents${tempSearch}`
                }
            ]
        });
    };

    showInfoPage = regionId => {
        const { history } = this.props;
        const {
            location: { search },
            match: {
                params: { tab, section, id, subTab }
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
                selectedRegion: regionId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Region",
                        path: `/region/regioninfo/${regionId}/basicdetails${tempSearch}`
                    },
                    {
                        key: "sites",
                        name: "Sites",
                        path: `/region/regioninfo/${regionId}/sites${tempSearch}`
                    },
                    {
                        key: "infoimages",
                        name: "Images",
                        path: `/region/regioninfo/${regionId}/infoimages${tempSearch}`
                    },
                    { key: "infomap", name: "Map", path: `/region/regioninfo/${regionId}/infomap${tempSearch}` },
                    {
                        key: "softCosts",
                        name: "Soft Costs",
                        path: `/region/regioninfo/${regionId}/softCosts${tempSearch}`
                    },
                    {
                        key: "documents",
                        name: "Documents",
                        path: `/region/regioninfo/${regionId}/documents${tempSearch}`
                    }
                ]
            });
        }

        const tabFilter = JSON.parse(sessionStorage.getItem("bc-data"))[0].name;

        let tabKeyList = [];

        if (tabFilter === "Energy Management") {
            tabKeyList = ["basicdetails", "sites", "buildings", "Electricity", "Water", "Gas", "Sewer", "energydashboard", "energyStar"];
            this.setState({
                selectedRegion: regionId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Basic Details",
                        path: `/region/regioninfo/${regionId}/basicdetails${tempSearch}`
                    },
                    {
                        key: "sites",
                        name: "Sites",
                        path: `/region/regioninfo/${regionId}/sites${tempSearch}`
                    },
                    {
                        key: "buildings",
                        name: "Building",
                        path: `/region/regioninfo/${regionId}/buildings${tempSearch}`
                    },
                    {
                        key: "Electricity",
                        name: "Electricity",
                        path: `/region/regioninfo/${regionId}/Electricity${tempSearch}`
                    },
                    {
                        key: "Gas",
                        name: "Gas",
                        path: `/region/regioninfo/${regionId}/Gas${tempSearch}`
                    },
                    {
                        key: "Water",
                        name: "Water",
                        path: `/region/regioninfo/${regionId}/Water${tempSearch}`
                    },
                    {
                        key: "Sewer",
                        name: "Sewer",
                        path: `/region/regioninfo/${regionId}/Sewer${tempSearch}`
                    },
                    {
                        key: "energyStarRating",
                        name: "Energy Star",
                        path: `/region/regioninfo/${regionId}/energyStarRating${tempSearch}`,
                        bcName: "energyStarRating"
                    },
                    {
                        key: "energydashboard",
                        name: "Charts & Graphs",
                        path: `/region/regioninfo/${regionId}/energydashboard`
                    },
                    {
                        key: "energyStar",
                        name: "Portfolio Manager",
                        path: `/region/regioninfo/${regionId}/energyStar`
                    }
                ]
            });
        } else if (tabFilter === "Asset Management") {
            tabKeyList = ["basicdetails", "sites", "buildings", "assets", "assetcharts"];
            this.setState({
                selectedRegion: regionId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Basic Details",
                        path: `/region/regioninfo/${regionId}/basicdetails${tempSearch}`
                    },
                    {
                        key: "sites",
                        name: "Sites",
                        path: `/region/regioninfo/${regionId}/sites${tempSearch}`
                    },
                    {
                        key: "buildings",
                        name: "Building",
                        path: `/region/regioninfo/${regionId}/buildings${tempSearch}`
                    },
                    {
                        key: "assets",
                        name: "Assets",
                        path: `/region/regioninfo/${regionId}/assets${tempSearch}`
                    },
                    {
                        key: "assetcharts",
                        name: "Charts & Graphs",
                        path: `/region/regioninfo/${regionId}/assetcharts`
                    }
                ]
            });
        } else {
            tabKeyList = [
                "basicdetails",
                "sites",
                "buildings",
                "infoimages",
                "infomap",
                "dashboard",
                "recommendations",
                "reports",
                "softCosts",
                "documents",
                "efci",
                "efcisandbox"
            ];
        }
        let path = `/region/regioninfo/${regionId}/${
            this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
        }`;
        path += tab === "reports" ? `${subTab ? `/${subTab}` : ""}` : "";

        history.push(`${path}${tempSearch}`);
    };

    showAddForm = regionId => {
        const { history } = this.props;
        const selectedproject = this.props.match.params.id;
        let selectedRegion = "";
        let selectedClient = "";
        let selectedConsultancy = "";
        if (this.props.basicDetails) {
            selectedClient = this.props.basicDetails.client.id;
            selectedConsultancy = this.props.basicDetails.consultancy.id;
        }
        this.setState({
            selectedRegion: null
        });
        addToBreadCrumpData({ key: "add", name: "Add Region", path: "/region/add" });
        if (selectedproject) {
            history.push(`/region/add?r_id=${selectedRegion}&c_id=${selectedClient}&cty_id=${selectedConsultancy}`);
        } else {
            history.push("/region/add");
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

    handleAddRegion = async region => {
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.addRegion(region);
        if (this.props.regionReducer.addRegionResponse && this.props.regionReducer.addRegionResponse.error) {
            await this.setState({
                alertMessage: this.props.regionReducer.addRegionResponse.error
            });
            this.showAlerts();
            this.setState({
                isLoading: false
            });
        } else {
            await this.setState({
                alertMessage: this.props.regionReducer.addRegionResponse && this.props.regionReducer.addRegionResponse.message
            });
            await this.refreshRegionList();
            this.setState({
                isLoading: false
            });
            this.showAlerts();
            history.push(findPrevPathFromBreadCrump() || "/region");
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

    handleUpdateRegion = async (region, isMap = false) => {
        const { selectedRegion } = this.state;
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.updateRegion(region, selectedRegion || region.id);
        if (this.props.regionReducer.updateRegionResponse && this.props.regionReducer.updateRegionResponse.error) {
            await this.setState({ alertMessage: this.props.regionReducer.updateRegionResponse.error });
            this.showAlerts();
        } else {
            await this.setState({
                alertMessage: this.props.regionReducer.updateRegionResponse && this.props.regionReducer.updateRegionResponse.message,
                currentActions: null
            });
            await this.refreshRegionList();
            this.showAlerts();

            history.push(findPrevPathFromBreadCrump() || "/region");
            if (!isMap) {
                history.push(findPrevPathFromBreadCrump() || "/region");
            }
        }
        this.setState({
            isLoading: false
        });
    };

    handleDeleteRegion = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedRegion: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this region?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteRegionOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteRegionOnConfirm = async () => {
        const { selectedRegion } = this.state;
        const { history } = this.props;
        this.setState({
            isLoading: true,
            showConfirmModal: false
        });
        await this.props.deleteRegion(selectedRegion);

        if (this.props.regionReducer.deleteRegionResponse && this.props.regionReducer.deleteRegionResponse.error) {
            await this.setState({ alertMessage: this.props.regionReducer.deleteRegionResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedRegion: null
            });
            this.showAlerts();

            await this.setState({
                isLoading: false
            });
        } else {
            // await this.props.getMenuItems();
            this.setState({
                showConfirmModal: false,
                selectedRegion: null
            });
            await this.refreshRegionList();
            this.setState({
                isLoading: false
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/Region");
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
        await this.refreshRegionList();
    };

    uploadImages = async (imageData = {}) => {
        const { selectedRegion } = this.state;
        await this.props.uploadRegionImage(imageData, selectedRegion || this.props.match.params.id);
        return true;
    };

    deleteImages = async imageId => {
        await this.props.deleteRegionImage(imageId);
        return true;
    };

    updateImageComment = async imageData => {
        await this.props.updateRegionImageComment(imageData);
        return true;
    };

    getAllImageList = async (regionId, params) => {
        await this.props.getAllRegionImages(regionId, params);
        const {
            regionReducer: { getAllImagesResponse }
        } = this.props;
        await this.setState({
            imageResponse: getAllImagesResponse
        });
        return true;
    };

    exportTableXl = async () => {
        const {
            location: { search }
        } = this.props;
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name === "Dashboard" ? true : false;
        }
        this.setState({ tableLoading: true });
        section === "projectinfo"
            ? await this.props.exportRegionByProject(entityId, {
                  project_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  region_ids: this.state.region_ids,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year,
                  ...(isDashboardFiltered && { ...this.state.dashboardFilterParams })
              })
            : section === "assetinfo"
            ? await this.props.exportRegion({
                  client_id: this.props.clientId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              })
            : section === "energyinfo"
            ? await this.props.exportRegion({
                  client_id: this.props.clientId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              })
            : await this.props.exportRegion({
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  region_ids: this.state.region_ids,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              });
        this.setState({
            tableLoading: false
        });
        if (this.props.regionReducer.regionExportResponse && this.props.regionReducer.regionExportResponse.error) {
            await this.setState({ alertMessage: this.props.regionReducer.regionExportResponse.error });
            this.showAlerts();
        }
    };

    getLogData = async regionId => {
        const { historyParams } = this.state;
        await this.props.getAllLogs(regionId, historyParams);
        const {
            regionReducer: {
                getAllLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.regionReducer.getAllLogsResponse && this.props.regionReducer.getAllLogsResponse.error) {
            await this.setState({ alertMessage: this.props.regionReducer.getAllLogsResponse.error });
            this.showAlerts();
        } else {
            await this.setState({
                ...this.state,
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
        await this.props.deleteRegionLog(selectedLog);
        if (this.props.regionReducer.deleteRegionLogResponse && this.props.regionReducer.deleteRegionLogResponse.error) {
            await this.setState({ alertMessage: this.props.regionReducer.deleteRegionLogResponse.error });
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
        await this.props.restoreRegionLog(id);
        if (this.props.regionReducer.restoreRegionLogResponse && this.props.regionReducer.restoreRegionLogResponse.error) {
            await this.setState({ alertMessage: this.props.regionReducer.restoreRegionLogResponse.error });
            this.showAlerts();
        }
        await this.refreshRegionList();
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

    handleRegionEfciFundingCost = async (id, value) => {
        let tempRegionEfciFC = this.state.efciRegionData;
        tempRegionEfciFC &&
            tempRegionEfciFC.funding_options.length &&
            tempRegionEfciFC.funding_options.map(fo => {
                if (fo.id === id) {
                    fo.value = value;
                }
            });
        this.setState({
            efciRegionData: tempRegionEfciFC
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
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateRegionFundingCost(value, id);
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleRegionFundingCostEfci = async (id, value) => {
        let tempRegionEfciFC = this.state.efciRegionData;
        tempRegionEfciFC &&
            tempRegionEfciFC.expected_fcis.length &&
            tempRegionEfciFC.expected_fcis.map(efci => {
                if (efci.id === id) {
                    efci.value = value;
                }
            });
        this.setState({
            efciRegionData: tempRegionEfciFC
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
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateRegionFundingCostEfci(value, id);
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleRegionAnnualFundingOption = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciRegionData;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fundings &&
            tempRegionEfciFC.annual_fundings[index].map(item => {
                if (item.id === id) {
                    item.amount = amount;
                }
            });
        this.setState({
            efciRegionData: tempRegionEfciFC
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
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateRegionAnnualFundingOption(amount, id);
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleRegionAnnualEfci = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciRegionData;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fcis &&
            tempRegionEfciFC.annual_fcis[index].map(item => {
                if (item.id === id) {
                    item.value = amount;
                }
            });
        this.setState({
            efciRegionData: tempRegionEfciFC
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
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateRegionAnnualEfci(id, amount);
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleRegionCspSummary = async (id, percentage, title) => {
        let tempRegionEfciFC = this.state.efciRegionData;
        tempRegionEfciFC &&
            tempRegionEfciFC.capital_spending_plans &&
            tempRegionEfciFC.capital_spending_plans[title] &&
            tempRegionEfciFC.capital_spending_plans[title].length &&
            tempRegionEfciFC.capital_spending_plans[title].map(item => {
                if (item.id === id) {
                    item.percentage = percentage;
                }
            });
        this.setState({
            efciRegionData: tempRegionEfciFC
        });
    };

    updateRegionCspSummary = async (id, percentage) => {
        this.setState({
            efciLoading: true
        });
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.updateCapitalSpendingPlanChart(id, { percentage });
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateCspSummary(id, percentage);
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        }
    };
    getAllDropdowns = async () => {
        let role = localStorage.getItem("role") || "";
        await this.props.getAllConsultancyUsers();
        if (role === "consultancy_user") {
            await this.props.getAllClients();
        }
        await this.props.getAllConsultanciesDropdown();
    };

    handleProjectAnnualEfci = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciProjectData;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fcis &&
            tempRegionEfciFC.annual_fcis[index].map(item => {
                if (item.id === id) {
                    item.value = amount;
                }
            });
        this.setState({
            efciProjectData: tempRegionEfciFC
        });
    };

    updateProjectAnnualEFCI = async (id, amount) => {
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
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateProjectAnnualEfci(id, amount);
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleProjectAnnualFundingOption = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciProjectData;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fundings &&
            tempRegionEfciFC.annual_fundings[index].map(item => {
                if (item.id === id) {
                    item.amount = amount;
                }
            });
        this.setState({
            efciProjectData: tempRegionEfciFC
        });
    };

    updateProjectAnnualFunding = async (id, amount) => {
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
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateProjectAnnualFundingOption(amount, id);
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleProjectEfciFundingCost = async (id, value) => {
        let tempRegionEfciFC = this.state.efciProjectData;
        tempRegionEfciFC &&
            tempRegionEfciFC.funding_options.length &&
            tempRegionEfciFC.funding_options.map(fo => {
                if (fo.id === id) {
                    fo.value = value;
                }
            });
        this.setState({
            efciProjectData: tempRegionEfciFC
        });
    };

    updateProjectEfciFundingCost = async (id, value) => {
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
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateProjectFundingCost(value, id);
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleProjectFundingCostEfci = async (id, value) => {
        let tempRegionEfciFC = this.state.efciProjectData;
        tempRegionEfciFC &&
            tempRegionEfciFC.expected_fcis.length &&
            tempRegionEfciFC.expected_fcis.map(efci => {
                if (efci.id === id) {
                    efci.value = value;
                }
            });
        this.setState({
            efciProjectData: tempRegionEfciFC
        });
    };

    updateProjectFundingEfci = async (id, value) => {
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
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateProjectFundingCostEfci(value, id);
            await this.getEfciBasedOnRegion();
            await this.getEfciByProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    updateRegionEfciLock = async lock => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        const regionId = this.props.match.params.id;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const projectId = query.pid;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.lockRegionSandbox(projectId, regionId, { lock });
            await this.getEfciBasedOnRegion();
        } else {
            await this.props.lockRegion(projectId, regionId, { lock });
            await this.getEfciBasedOnRegion();
        }
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
        let isElement = test.length && test.find(f => f.index == index);
        if (isElement) {
            test.length &&
                test.map((t, keyValue) => {
                    if (t.index == index) {
                        test[keyValue] = { value: parseFloat(value), index: index };
                    }
                });
        } else {
            test.push({ value: parseFloat(value), index: index });
        }
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
            region_id: this.props.match.params.id,
            fcis: forcedChangeArray
        };
        await this.props.forceUpdateProjectFundingCostEfci(params);
        await this.getEfciBasedOnRegion();
        await this.getEfciByProject();
        this.setState({
            efciLoading: false,
            forcedChangeArray: [],
            isValueChanged: false
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
            await this.setState({
                hiddenFundingOptionList: this.props.regionReducer.hiddenFundingOptionListChart || []
            });
        } else {
            await this.props.hideFundingOption(hiddenFundingOptionList);
            await this.setState({
                hiddenFundingOptionList: this.props.regionReducer.hiddenFundingOptionList || []
            });
        }
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
            tableData,
            showWildCardFilter,
            selectedRegion,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            showAssignConsultancyUsers,
            showAssignClientUsers,
            clients,

            consultancy_users,
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
                params: { section }
            }
        } = this.props;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {this.renderLogModal()}
                {this.renderLog()}
                {this.deleteConfirmationModal()}
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedRegion={selectedRegion}
                        refreshRegionList={this.refreshRegionList}
                        handleAddRegion={this.handleAddRegion}
                        handleUpdateRegion={this.handleUpdateRegion}
                        getDataById={this.getDataById}
                        getAllDropdowns={this.getAllDropdowns}
                    />
                ) : section === "regioninfo" ? (
                    <RegionInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        showInfoPage={this.showInfoPage}
                        getDataById={this.getDataById}
                        handleUpdateData={this.handleUpdateRegion}
                        uploadImages={this.uploadImages}
                        getAllImageList={this.getAllImageList}
                        deleteImages={this.deleteImages}
                        updateImageComment={this.updateImageComment}
                        handleDeleteItem={this.handleDeleteRegion}
                        getAllRegionLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreRegionLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        regionId={this.props.match.params.id}
                        tableLoading={this.state.tableLoading}
                        efciRegionData={this.state.efciRegionData}
                        colorCodes={this.state.colorCodes}
                        efciLoading={this.state.efciLoading}
                        loadDataRegion={this.loadDataRegion}
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
                        handleRegionCspSummary={this.handleRegionCspSummary}
                        updateRegionCspSummary={this.updateRegionCspSummary}
                        efciProjectData={this.state.efciProjectData}
                        getEfciBasedOnRegion={this.getEfciBasedOnRegion}
                        imageResponse={imageResponse}
                        updateProjectAnnualEFCI={this.updateProjectAnnualEFCI}
                        handleProjectAnnualEfci={this.handleProjectAnnualEfci}
                        handleProjectAnnualFundingOption={this.handleProjectAnnualFundingOption}
                        updateProjectAnnualFunding={this.updateProjectAnnualFunding}
                        handleProjectEfciFundingCost={this.handleProjectEfciFundingCost}
                        updateProjectEfciFundingCost={this.updateProjectEfciFundingCost}
                        handleProjectFundingCostEfci={this.handleProjectFundingCostEfci}
                        updateProjectFundingEfci={this.updateProjectFundingEfci}
                        saveData={this.saveData}
                        showLog={this.showLog}
                        updateRegionEfciLock={this.updateRegionEfciLock}
                        tempArray={this.state.tempArray}
                        resetData={this.resetData}
                        forceUpdateData={this.forceUpdateData}
                        saveDataForce={this.saveDataForce}
                        isValueChanged={this.state.isValueChanged}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                        updateHiddenFundingOption={this.updateHiddenFundingOption}
                        hiddenFundingOptionList={this.state.hiddenFundingOptionList}
                        hasEdit={this.handleDisableButtons() ? false : checkPermission("forms", "regions", "edit")}
                        hasDelete={this.handleDisableButtons() ? false : checkPermission("forms", "regions", "delete")}
                        hasLogView={this.handleDisableButtons() ? false : checkPermission("logs", "regions", "view")}
                        hasLogDelete={this.handleDisableButtons() ? false : checkPermission("logs", "regions", "delete")}
                        hasLogRestore={this.handleDisableButtons() ? false : checkPermission("logs", "regions", "restore")}
                        hasInfoPage={checkPermission("forms", "regions", "view")}
                        hasCreate={checkPermission("forms", "regions", "create")}
                        hasLock={checkPermission("forms", "recommendations", "lock")}
                        entity="regions"
                    />
                ) : section == "efciinfo" ? (
                    <>
                        <EfciInfo
                            keys={tableData.keys}
                            config={tableData.config}
                            infoTabsData={infoTabsData}
                            showInfoPage={this.showInfoPage}
                            getDataById={this.getDataById}
                            handleUpdateData={this.handleUpdateRegion}
                            uploadImages={this.uploadImages}
                            getAllImageList={this.getAllImageList}
                            deleteImages={this.deleteImages}
                            updateRegionImageComment={this.updateImageComment}
                            handleDeleteItem={this.handleDeleteRegion}
                            efciRegionData={this.state.efciRegionData}
                            colorCodes={this.state.colorCodes}
                            efciLoading={this.state.efciLoading}
                            handleRegionEfciFundingCost={this.handleRegionEfciFundingCost}
                            updateRegionEfciFundingCost={this.updateRegionEfciFundingCost}
                            handleRegionFundingCostEfci={this.handleRegionFundingCostEfci}
                            updateRegionFundingEfci={this.updateRegionFundingEfci}
                            handleRegionAnnualFundingOption={this.handleRegionAnnualFundingOption}
                            updateRegionAnnualFunding={this.updateRegionAnnualFunding}
                            handleRegionAnnualEfci={this.handleRegionAnnualEfci}
                            updateRegionAnnualEFCI={this.updateRegionAnnualEFCI}
                            handleRegionCspSummary={this.handleRegionCspSummary}
                            updateRegionCspSummary={this.updateRegionCspSummary}
                            efciProjectData={this.state.efciProjectData}
                            updateProjectAnnualEFCI={this.updateProjectAnnualEFCI}
                            handleProjectAnnualEfci={this.handleProjectAnnualEfci}
                            handleProjectAnnualFundingOption={this.handleProjectAnnualFundingOption}
                            updateProjectAnnualFunding={this.updateProjectAnnualFunding}
                            handleProjectEfciFundingCost={this.handleProjectEfciFundingCost}
                            updateProjectEfciFundingCost={this.updateProjectEfciFundingCost}
                            handleProjectFundingCostEfci={this.handleProjectFundingCostEfci}
                            updateProjectFundingEfci={this.updateProjectFundingEfci}
                            showLog={this.showLog}
                            updateRegionEfciLock={this.updateRegionEfciLock}
                            loadDataRegion={this.loadDataRegion}
                            getEfciBasedOnRegion={this.getEfciBasedOnRegion}
                            saveData={this.saveData}
                            tempArray={this.state.tempArray}
                            resetData={this.resetData}
                            forceUpdateData={this.forceUpdateData}
                            saveDataForce={this.saveDataForce}
                            isValueChanged={this.state.isValueChanged}
                            logCount={this.props.logCount}
                            logPaginationParams={this.props.logPaginationParams}
                            handlePageClickLogs={this.props.handlePageClickLogs}
                            handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                            regionId={this.props.match.params.id}
                            updateHiddenFundingOption={this.updateHiddenFundingOption}
                            hiddenFundingOptionList={this.state.hiddenFundingOptionList}
                        />
                    </>
                ) : (
                    <RegionMain
                        tableData={tableData}
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        showViewModal={this.showViewModal}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteRegion={this.handleDeleteRegion}
                        showEditPage={this.showEditPage}
                        showInfoPage={this.showInfoPage}
                        showAddForm={this.showAddForm}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilter={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportRegionTable={this.exportRegionTable}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        isValueChanged={this.state.isValueChanged}
                        hasExport={checkPermission("forms", "regions", "export")}
                        showAddButton={this.handleDisableButtons() ? false : checkPermission("forms", "regions", "create")}
                        hasEdit={this.handleDisableButtons() ? false : checkPermission("forms", "regions", "edit")}
                        hasDelete={this.handleDisableButtons() ? false : checkPermission("forms", "regions", "delete")}
                        hasInfoPage={checkPermission("forms", "regions", "view")}
                        hasActionColumn={!this.handleDisableButtons()}
                        entity="regions"
                    />
                )}
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
        );
    }
}

const mapStateToProps = state => {
    const { regionReducer, commonReducer, siteReducer, recommendationsReducer, projectReducer } = state;
    return { regionReducer, commonReducer, projectReducer, siteReducer, recommendationsReducer };
};
let { getChartsDashboardPython } = dashboardActions;

export default withRouter(
    connect(mapStateToProps, { ...regionActions, ...CommonActions, ...projectActions, ...siteAction, getChartsDashboardPython })(index)
);
