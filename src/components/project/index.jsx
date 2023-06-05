import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import qs from "query-string";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import AssignClientUserModal from "./components/AssignClientUserModal";
import AssignConsultancyUserModal from "./components/AssignConsultancyUserModal";
import projectActions from "./actions";
import siteActions from "../site/actions";
import buildingActions from "../building/actions";
import _ from "lodash";
import ProjectMain from "./components/ProjectMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import {
    projectTableData,
    tradesettingsTableData,
    categorysettingsTableData,
    systemsettingsTableData,
    subsystemsettingsTableData,
    importHistoryTableData
} from "../../config/tableData";
import ProjectInfo from "./components/ProjectInfo";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrump,
    popBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    checkPermission
} from "../../config/utils";
import MergeOrReplaceModalSelection from "./components/MergeOrReplaceModalSelection";
import UploadDataModal from "./components/UploadDataModal";
import EfciInfo from "./components/EfciInfo";
import EFCILogs from "../common/components/CommonEFCI/EfciLogs";
import ColorCodeLog from "./components/ColorCodeLog";
import dashboardActions from "../dashboard/actions";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            logCount: 0,
            errorMessage: "",
            projectList: [],
            refreshProjectData: false,
            paginationParams: this.props.projectReducer.entityParams.paginationParams,
            // paginationParamsLog: this.props.projectReducer.entityParams.paginationParams,
            currentViewAllUsers: null,
            currentActions: null,
            showViewModal: false,
            codeLoading: false,
            tableLoading: false,
            showWildCardFilter: false,
            showAssignConsultancyUsers: false,
            showUploadDataModal: false,
            showMergeOrReplaceModal: false,
            projectData: {},
            clients: [],
            colorCodes: [],
            regionList: [],
            consultancy_users: [],
            selectedRowId: this.props.projectReducer.entityParams.selectedRowId,
            params: this.props.projectReducer.entityParams.params,
            selectedClient: {},
            selectedProject: this.props.match.params.id || this.props.projectReducer.entityParams.selectedEntity,
            tableData: {
                keys: projectTableData.keys,
                config: this.props.projectReducer.entityParams.tableConfig || _.cloneDeep(projectTableData.config)
            },
            infoTabsData: [],
            wildCardFilterParams: this.props.projectReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.projectReducer.entityParams.filterParams,
            alertMessage: "",
            showConfirmModal: false,
            showConfirmModalCategory: false,
            showFormModal: false,
            showFormModalCategory: false,
            selectedTrade: null,
            selectedCategory: null,
            tradeTableData: tradesettingsTableData,
            categoryTableData: categorysettingsTableData,
            systemTableData: systemsettingsTableData,
            subsystemTableData: subsystemsettingsTableData,
            settingType: "",
            historyPaginationParams: this.props.projectReducer.entityParams.historyPaginationParams,
            historyParams: this.props.projectReducer.entityParams.historyParams,
            logData: {
                count: "",
                data: []
            },
            logDataColorCode: {
                count: "",
                data: []
            },
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            importHistoryData: {
                count: "",
                data: []
            },
            importHistoryTableData: {
                keys: importHistoryTableData.keys,

                config: this.props.projectReducer.entityParams.importtableConfig || importHistoryTableData.config,
                data: []
            },
            showConfirmModalimportHistory: false,
            selectedHistory: "",
            importhistoryPaginationParams: this.props.projectReducer.entityParams.importhistoryPaginationParams,
            importhistoryParams: this.props.projectReducer.entityParams.importhistoryParams,
            showViewImportModal: false,
            showImportWildCardFilter: false,
            filterValues: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || {
                active: true
            },
            permissions: {},
            logPermission: {},
            logs: "",
            typeLog: "",
            noOfYears: null,
            openRenderLog: false,
            openLogPanel: false,
            // --------------------colorcodelog---
            openColorcodeLogPanel: false,
            // -----------------------colorcodelog--
            deleteId: null,
            restoreId: null,
            tempArray: [],
            showDeleteConfirmModal: false,
            sortParams: {
                order: {
                    "efci_versions.created_at": "desc"
                }
            },
            forcedChangeArray: [],
            isValueChanged: false,
            building_ids: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.building_ids,
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
            hiddenFundingOptionList: [],
            isInitializingSpecialReport: false
        };
        this.exportTableXl = this.exportTableXl.bind(this);
    }

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
        const { sortKey, order, sortParams, logPaginationParams, logParams } = this.state;
        this.setState({
            openLogPanel: true,
            selectedColumnId: id,
            hasLoading: true,
            typeLog: type,
            noOfYears: noOfYears,
            efciLoading: true,
            // ---------to avoid previous logs-----
            log: [],
            logCount: 0
            // ------------------
        });
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

                const { annualEfciLogs } = this.props.projectReducer;
                let totalCount = annualEfciLogs && annualEfciLogs.logs ? annualEfciLogs.count : 0;
                this.setState({
                    log: annualEfciLogs && annualEfciLogs.logs ? annualEfciLogs.logs : [],
                    logCount: annualEfciLogs && annualEfciLogs.logs ? annualEfciLogs.count : 0,
                    logPaginationParams: {
                        ...logPaginationParams,
                        totalCount: totalCount,
                        totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
                    }
                });
            }
        }

        this.setState({
            hasLoading: false,
            efciLoading: false
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
                        logCount={logCount}
                        onCancel={this.onCancel}
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
    // ---------------------------------------------colorcodelog--------------------------
    renderColorCodeLogModal = () => {
        const { openColorcodeLogPanel, logCount, logPaginationParams } = this.state;
        if (!openColorcodeLogPanel) return null;

        return (
            <Portal
                body={
                    <ColorCodeLog
                        logs={this.state.log}
                        logCount={logCount}
                        onCancel={this.onCancel}
                        logPaginationParams={logPaginationParams}
                        handlePageClickLogs={this.handlePageClickColorCode}
                        handlePerPageChangeLogs={this.handlePerPageChangeColorCodeHistory}
                        restoreAnnualEfci={this.showColorcodeRestore}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.handleDeleteLog}
                        hasLogDelete={checkPermission("logs", "efci_colors", "delete")}
                        hasLogRestore={checkPermission("logs", "efci_colors", "restore")}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };
    showColorcodeLog = async id => {
        const { sortKey, order, sortParams, logPaginationParams, logParams } = this.state;
        const projectId = this.props.match.params.id;
        this.setState({
            openColorcodeLogPanel: true,
            selectedColumnId: id
        });
        let params = { ...sortParams, ...logParams };

        await this.props.getColorCodeLogs(projectId, id, params);

        const { colorCodeLogs } = this.props.projectReducer;
        let totalCount = colorCodeLogs && colorCodeLogs.logs ? colorCodeLogs.count : 0;
        this.setState({
            log: colorCodeLogs && colorCodeLogs.logs ? colorCodeLogs.logs : [],
            logCount: colorCodeLogs && colorCodeLogs.logs ? colorCodeLogs.count : 0,
            logPaginationParams: {
                ...logPaginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / logPaginationParams.perPage)
            }
        });
    };
    showColorcodeRestore = async (id, changeSet) => {
        const projectId = this.props.match.params.id;
        let data = changeSet;
        const { typeLog } = this.state;
        // await this.props.restoreProjectLog(id);
        // if (this.props.projectReducer.restoreProjectLogResponse && this.props.projectReducer.restoreProjectLogResponse.error) {
        //     await this.setState({ alertMessage: this.props.projectReducer.restoreProjectLogResponse.error });
        //     this.showAlerts();
        // }
        // await this.props.getColorCodeLogs(projectId, id)
        this.setState({
            openRenderLog: true,
            restoreId: id,
            changeSet: data
        });
    };

    // ----------------------------------------------colorcodelog--------------------
    onCancel = () => {
        this.setState({
            openLogPanel: false,
            // -----------------------colorcodelog---
            openColorcodeLogPanel: false
            // -----------------------colorcodelog-----
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
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            } else {
                await this.props.restoreProjectFundingCostLogs(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
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
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            } else {
                await this.props.restoreProjectFundingCostLogs(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            }
        } else if (typeLog == "fundingCostEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreFundingEfciByChartLogs(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            } else {
                await this.props.restoreProjectFundingCostEfciLogs(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            }
        } else if (typeLog == "cspSummary") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreCapitalSpendingPlanByChartLogs(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            } else {
                await this.props.restoreProjectCspSummaryDataLogs(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            }
        } else if (typeLog == "annualFunding") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreAnnualFundingByChartCalculation(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            } else {
                await this.props.restoreProjectAnnualFundingOptionLogs(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            }
        } else if (typeLog == "annualEfci") {
            const {
                match: {
                    params: { tab }
                }
            } = this.props;
            if (tab === "dashboard" || tab === "efcisandbox") {
                await this.props.restoreAnnualByChartEFCI(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            } else {
                await this.props.restoreProjectAnnualEfciLogs(restoreId);
                await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            }
        }
        // ----------------------------------------colorcodelog--
        else {
            const projectId = this.props.match.params.id;
            await this.props.restoreProjectLog(this.state.restoreId);
            if (this.props.projectReducer.restoreProjectLogResponse && this.props.projectReducer.restoreProjectLogResponse.error) {
                await this.setState({ alertMessage: this.props.projectReducer.restoreProjectLogResponse.error });
                this.showAlerts();
            }
            await this.props.getColorCodeLogs(projectId, this.state.selectedColumnId);
            await this.props.getColorCodes(projectId);
            const colorCodes =
                (this.props.projectReducer && this.props.projectReducer.getColorCodes && this.props.projectReducer.getColorCodes.color_codes) || [];
            this.setState({
                colorCodes: colorCodes
            });
        }
        // ---------------------------------colorcodelog-

        this.setState({
            openRenderLog: false,
            hasLoading: false,
            openRestore: false,
            openLogPanel: false,
            // ---------------------------
            openColorcodeLogPanel: false
            // ------------------------colorcodelog----
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
        await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
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

    componentDidMount = async () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;
        if (section !== "efciinfo" && section !== "projectinfo" && section !== "add" && section !== "edit") {
            await this.refreshProjectList();
            await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
        } else {
            await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            this.setState({ isLoading: false });
        }
    };

    componentDidUpdate = async prevProps => {
        const {
            match: {
                params: { section, id, tab }
            }
        } = this.props;
        if (prevProps.match.params.tab !== tab) {
            this.setState({
                efciLoading: true
            });
            await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
            this.setState({ efciLoading: false });
        }
        if (prevProps.match.params.id !== this.props.match.params.id) {
            await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
        }
        if (
            prevProps.match.params.section !== this.props.match.params.section &&
            section !== "projectinfo" &&
            section !== "add" &&
            section !== "edit"
        ) {
            await this.refreshProjectList();
            await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
        }
    };

    loadData = async params => {
        const {
            location: { search }
        } = this.props;
        const projectId = this.props.match.params.id;
        await this.props.loadChartDataProject(projectId);
        await this.getEfciBasedOnProject();
    };

    getEfciBasedOnProject = async tempParams => {
        const projectId = this.props.match.params.id;

        this.setState({
            efciLoading: true
        });
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab === "dashboard" || tab === "efcisandbox") {
            let projectDatas = JSON.parse(localStorage.getItem(projectId));
            let chartParams = {
                projectId: projectId
            };
            let params = {
                ...this.state.filterValues,
                ...tempParams,
                project_id: projectId
                // building_ids: this.state.building_ids || null
            };
            await this.props.getTradeSettingsDropdown(projectId);
            const { trades } = this.props.projectReducer.getTradeSettingsDropdownResponse || {};
            const trade_ids = trades?.length ? [trades[0]?.id] : [];
            const systemParams = {
                chart_type: "proj_fca_chart",
                export_type: "system",
                trade_ids,
                project_ids: [projectId],
                user_id: localStorage.getItem("userId")
            };
            let efciParams = { reset: true, ...tempParams };
            let regionChecked = [];
            if (projectDatas && projectId === projectDatas.id) {
                regionChecked = projectDatas ? (projectDatas.project ? projectDatas.project : []) : [];
            }
            if (regionChecked && regionChecked.length) {
                efciParams = {
                    ...efciParams,
                    region_ids: regionChecked
                };
            }
            await Promise.all([
                this.props.getChartByProject(chartParams, params),
                this.props.getChartsDashboardPython(systemParams),
                this.props.getMiscSettings(projectId),
                this.getEFCIColorCode(),
                this.props.getChartEfciProject(projectId, efciParams)
            ]);

            await this.setState({
                efciSiteData: this.props.projectReducer.getEfciBySiteGraph ? this.props.projectReducer.getEfciBySiteGraph.region || {} : {},
                efciData: this.props.projectReducer.getEfciBySiteGraph ? this.props.projectReducer.getEfciBySiteGraph.region || {} : {},
                efciLoading: false
            });
        } else if (tab === "efci") {
            await this.getEFCIColorCode();
            await this.props.getEfciByProject(projectId);
            this.setState(
                {
                    efciData: this.props.projectReducer.getEfciByProject.project || {},
                    efciLoading: false
                },
                () => this.resetData()
            );
        } else if (tab === "settings") {
            await this.getEFCIColorCode();
        }
    };

    loadDataProject = async params => {
        const {
            location: { search }
        } = this.props;
        const projectId = this.props.match.params.id;
        await this.props.loadChartDataProject(projectId);
        await this.getEfciBasedOnProject(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
    };

    refreshProjectList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        // await this.props.getAllConsultancyUsers();
        // await this.props.getAllClients();
        // await this.props.getMenuItems();
        const {
            match: {
                params: { section }
            }
        } = this.props;
        // using same componet for project mangement and project listing in info page
        let projectList = [];
        let totalCount = 0;
        if (section === "userinfo") {
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
            await this.props.getAllProjects(userParams);
            projectList = this.props.projectReducer.getAllProjectsResponse ? this.props.projectReducer.getAllProjectsResponse.projects || [] : [];
            totalCount = this.props.projectReducer.getAllProjectsResponse ? this.props.projectReducer.getAllProjectsResponse.count || 0 : 0;
        } else {
            await this.props.getAllProjects(params);
            projectList = this.props.projectReducer.getAllProjectsResponse ? this.props.projectReducer.getAllProjectsResponse.projects || [] : [];
            totalCount = this.props.projectReducer.getAllProjectsResponse ? this.props.projectReducer.getAllProjectsResponse.count || 0 : 0;
        }
        const {
            projectReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            }
        } = this.props;

        // go to previous page is the last record of the current page is deleted
        if (projectList && !projectList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getAllProjects(this.state.params);
        }
        if (
            projectList &&
            !projectList.length &&
            this.props.projectReducer.getAllProjectsResponse &&
            this.props.projectReducer.getAllProjectsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.projectReducer.getAllProjectsResponse.error });
            this.showAlerts();
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.projects
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.projects || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.project_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.project_logs || {}
                : {};
        this.setState({
            tableData: {
                ...tableData,
                data: projectList,
                config: this.props.projectReducer.entityParams.tableConfig || tableData.config
            },
            projectList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            clients,
            consultancy_users,
            showWildCardFilter: this.state.params.filters ? true : false,
            permissions: project_permission || {},
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
        await this.refreshProjectList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Project",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            importhistoryPaginationParams: this.state.importhistoryPaginationParams,
            importhistoryParams: this.state.importhistoryParams,
            importtableConfig: this.state.importHistoryTableData.config
        };
        await this.props.updateProjectEntityParams(entityParams);
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
        await this.refreshProjectList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshProjectList();
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
                config: _.cloneDeep(projectTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshProjectList();
    };
    getListForCommonFilter = async params => {
        const {
            match: {
                params: { section, tab }
            }
        } = this.props;
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        // params.project_id=
        if (section === "userinfo") {
            params.user_id = this.props.match.params.id;
        }
        await this.props.getListForCommonFilterproject(params);
        return (this.props.projectReducer.getListForCommonFilterResponse && this.props.projectReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshProjectList();
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
        await this.refreshProjectList();
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

    refreshSettingsData = async () => {
        let tradeSettingsData = await this.props.getTradeSettingsData(this.props.match.params.id);
        let systemSettingsData = await this.props.getSystemSettingsData(this.props.match.params.id);
        let subsystemSettingsData = await this.props.getSubsystemSettingsData(this.props.match.params.id);
        let categorySettingsData = await this.props.getCategorySettingsData(this.props.match.params.id);

        if (tradeSettingsData && tradeSettingsData.success) {
            this.setState({
                tradeTableData: {
                    ...this.state.tradeTableData,
                    data: tradeSettingsData.trades || []
                }
            });
        }
        if (categorySettingsData && categorySettingsData.success) {
            this.setState({
                categoryTableData: {
                    ...this.state.categoryTableData,
                    data: categorySettingsData.categories || []
                }
            });
        }
        if (systemSettingsData && systemSettingsData.success) {
            this.setState({
                systemTableData: {
                    ...this.state.systemTableData,
                    data: systemSettingsData.categories || []
                }
            });
        }
        if (subsystemSettingsData && subsystemSettingsData.success) {
            this.setState({
                subsystemTableData: {
                    ...this.state.subsystemTableData,
                    data: subsystemSettingsData.sub_systems || []
                }
            });
        }
        return true;
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
        await this.refreshProjectList();
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
        await this.refreshProjectList();
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

    showEditPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedProject: projectId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Project",
            path: `/project/edit/${projectId}`
        });
        history.push(`/project/edit/${projectId}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedProject: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Project",
            path: `/project/add`
        });
        history.push(`/project/add`);
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    getSiteListBasedOnRegion = async (projectId, params) => {
        await this.props.getSitesBasedOnRegionDropdown(projectId, params);
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
            projectReducer: {
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

    handleAssignConsultancyUsersModal = async projectData => {
        await this.setState({
            showAssignConsultancyUsers: true
        });
    };

    handleAssignClientUsersModal = async projectData => {
        await this.setState({
            showAssignClientUsers: true
        });
    };

    handleAddProject = async project => {
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.addProject(project);
        if (this.props.projectReducer.addProjectResponse && this.props.projectReducer.addProjectResponse.is_existing) {
            this.toggleShowMergeOrReplaceModal();
            this.setState({
                isLoading: false
            });
        } else if (this.props.projectReducer.addProjectResponse && this.props.projectReducer.addProjectResponse.error) {
            await this.setState({
                alertMessage: this.props.projectReducer.addProjectResponse.error
            });
            this.showAlerts();
            this.setState({
                isLoading: false
            });
        } else {
            // calling python backend for copying global report templates to project level
            let project_id = this.props.projectReducer.addProjectResponse.id || "";
            await this.props.copyGlobalReportTemplates({ project_id });
            await this.props.addUserActivityLog({ text: "Copied global report templates" });
            const { success, error } = this.props.projectReducer.reportTemplateCopyResponse;
            if (!success) {
                this.setState(
                    {
                        alertMessage: error || "Oops..! Failed to copy report templates to the project level."
                    },
                    () => this.showAlerts()
                );
                this.setState({
                    isLoading: false
                });
            } else {
                await this.setState({
                    alertMessage: this.props.projectReducer.addProjectResponse && this.props.projectReducer.addProjectResponse.message
                });
                this.showAlerts();
                await this.refreshProjectList();
                this.setState({
                    isLoading: true
                });
                // await this.props.getMenuItems();
                this.setState({
                    isLoading: false
                });
                history.push(findPrevPathFromBreadCrumpData() || "/project");
            }
        }
        this.setState({
            isLoading: false
        });
    };

    handleUploadData = async project => {
        const { history } = this.props;

        let projectParseParams = {
            id: project.project_id,
            site_id: project.site_id,
            region_id: project.region_id,
            fca_sheet: project.fca_sheet
        };
        await this.props.parseFca(projectParseParams);
        if (this.props.projectReducer.parseFcaResponse && this.props.projectReducer.parseFcaResponse.is_existing) {
            this.toggleShowMergeOrReplaceModal();
        } else if (this.props.projectReducer.parseFcaResponse && this.props.projectReducer.parseFcaResponse.error) {
            await this.setState({
                alertMessage: "Something went wrong. please check the import history for more details",
                showUploadDataModal: false
            });
            this.showAlerts();
        } else {
            await this.setState({
                alertMessage:
                    this.props.projectReducer?.parseFcaResponse?.message || "Something went wrong. please check the import history for more details",
                showUploadDataModal: false
            });
            this.showAlerts();
            await this.refreshProjectList();
            this.setState({ refreshProjectData: !this.state.refreshProjectData });
            // await this.props.getMenuItems();
            history.push(findPrevPathFromBreadCrump() || "/project");
        }
    };

    onMergeOrReplaceModalSelection = async type => {
        this.setState({
            showMergeOrReplaceModal: false
        });
        let projectParseParams = {
            replace: type === "replace" ? "true" : "false",
            id: this.props.projectReducer.parseFcaResponse && this.props.projectReducer.parseFcaResponse.project_id,
            site_id: this.props.projectReducer.parseFcaResponse && this.props.projectReducer.parseFcaResponse.site_id
        };
        await this.props.parseFca(projectParseParams);
        await this.setState({
            alertMessage:
                this.props.projectReducer?.parseFcaResponse?.message || "Something went wrong. please check the import history for more details",
            selectedProject: null,
            showUploadDataModal: false
        });
        this.showAlerts();
        await this.refreshProjectList();
        this.setState({ refreshProjectData: !this.state.refreshProjectData });
        // await this.props.getMenuItems();
        this.props.history.push(findPrevPathFromBreadCrump() || "/project");
    };

    toggleShowMergeOrReplaceModal = () => {
        this.setState({
            showMergeOrReplaceModal: !this.state.showMergeOrReplaceModal
        });
    };

    toggleShowUploadDataModal = () => {
        this.setState({
            showUploadDataModal: !this.state.showUploadDataModal
        });
    };

    renderMergeOrReplaceModalSelection = () => {
        const { showMergeOrReplaceModal } = this.state;
        if (!showMergeOrReplaceModal) return null;
        return (
            <Portal
                body={
                    <MergeOrReplaceModalSelection
                        onCancel={this.toggleShowMergeOrReplaceModal}
                        message={"Building already exist?"}
                        buttonYes={{ label: "Replace", value: "replace" }}
                        buttonNo={{ label: "Merge", value: "merge" }}
                        onSelection={this.onMergeOrReplaceModalSelection}
                    />
                }
                onCancel={this.toggleShowMergeOrReplaceModal}
            />
        );
    };

    showAlerts = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
        }
    };

    handleUpdateProject = async project => {
        const { history } = this.props;
        const { selectedProject } = this.state;
        this.setState({
            isLoading: true
        });
        await this.props.updateProject(project, selectedProject);
        if (this.props.projectReducer.updateProjectResponse && this.props.projectReducer.updateProjectResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.updateProjectResponse.error });
            this.showAlerts();
            this.setState({
                isLoading: false
            });
        } else {
            await this.setState({
                alertMessage: this.props.projectReducer.updateProjectResponse && this.props.projectReducer.updateProjectResponse.message,
                currentActions: null
            });
            this.showAlerts();
            await this.refreshProjectList();
            this.setState({
                isLoading: true
            });
            // await this.props.getMenuItems();
            this.setState({
                isLoading: false
            });
            history.push(findPrevPathFromBreadCrump() || "/project");
        }
    };

    handleDeleteProject = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedProject: id
        });
    };

    showUploadDataModal = async id => {
        await this.setState({
            showUploadDataModal: true,
            selectedProject: id
        });
    };

    renderUploadDataModal = () => {
        const { showUploadDataModal } = this.state;
        if (!showUploadDataModal) return null;
        return (
            <Portal
                body={
                    <UploadDataModal
                        getDataById={this.getDataById}
                        getRegionListBasedOnClient={this.getRegionListBasedOnClient}
                        handleUploadData={this.handleUploadData}
                        getSiteListBasedOnRegion={this.getSiteListBasedOnRegion}
                        onCancel={() => this.setState({ showUploadDataModal: false })}
                    />
                }
                onCancel={() => this.setState({ showUploadDataModal: false })}
            />
        );
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Project?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteProjectOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
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
                hiddenFundingOptionList: this.props.projectReducer.hiddenFundingOptionListChart || []
            });
        } else {
            await this.props.hideFundingOption(hiddenFundingOptionList);
            await this.setState({
                hiddenFundingOptionList: this.props.projectReducer.hiddenFundingOptionList || []
            });
        }
    };

    deleteProjectOnConfirm = async () => {
        const { selectedProject } = this.state;
        const { history } = this.props;
        await this.setState({
            showConfirmModal: false,
            isLoading: true
        });
        await this.props.deleteProject(selectedProject);
        if (this.props.projectReducer.deleteProjectResponse && this.props.projectReducer.deleteProjectResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.deleteProjectResponse.error });
            this.showAlerts();
            await this.setState({
                isLoading: false
            });
        } else {
            await this.refreshProjectList();
            this.setState({
                isLoading: true
            });
            // await this.props.getMenuItems();
            await this.setState({
                selectedProject: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/Project");
            }
            await this.setState({
                isLoading: false
            });
        }
        await this.setState({
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
        await this.refreshProjectList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        const {
            location: { search },
            match: {
                params: { tab, settingType, subTab, subId, subSection },
                path
            }
        } = this.props;
        const query = qs.parse(search);
        let tempSearch = "";
        if (query.dashboardView) {
            tempSearch = search;
        }
        if (this.props.isReportView) {
            this.setState({
                selectedProject: projectId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Project",
                        path: `/reports/projectinfo/${projectId}/basicdetails${tempSearch}`
                    },
                    {
                        key: "settings",
                        name: "Settings",
                        path: `/reports/projectinfo/${projectId}/settings/exportReport`,
                        bcName: "Report Properties"
                    }
                ]
            });
        } else {
            this.setState({
                selectedProject: projectId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Project",
                        path: `/project/projectinfo/${projectId}/basicdetails${tempSearch}`
                    },
                    {
                        key: "regions",
                        name: "Regions",
                        path: `/project/projectinfo/${projectId}/regions`
                    },
                    {
                        key: "sites",
                        name: "Sites",
                        path: `/project/projectinfo/${projectId}/sites`
                    },
                    {
                        key: "buildings",
                        name: "Buildings",
                        path: `/project/projectinfo/${projectId}/buildings`
                    },
                    {
                        key: "recommendations",
                        name: "Recommendations",
                        path: `/project/projectinfo/${projectId}/recommendations`
                    },
                    {
                        key: "dashboard",
                        name: "Charts & Graphs",
                        path: `/project/projectinfo/${projectId}/dashboard`,
                        show: checkPermission("charts_and_graph", "fca_projects", "view")
                    },
                    {
                        key: "settings",
                        name: "Settings",
                        path: `/project/projectinfo/${projectId}/settings/building_type`,
                        bcName: "Building Type"
                    },
                    // {
                    //     key: "reports",
                    //     name: "Reports",
                    //     path: `/project/projectinfo/${projectId}/reports/specialReports`,
                    //     bcName: "Reports"
                    // },
                    {
                        key: "efcisandbox",
                        name: "EFCI Sandbox",
                        path: `/project/projectinfo/${projectId}/efcisandbox`
                    },
                    {
                        key: "efci",
                        name: "EFCI",
                        path: `/project/projectinfo/${projectId}/efci`
                    },
                    {
                        key: "softCosts",
                        name: "Soft Costs",
                        path: `/project/projectinfo/${projectId}/softCosts`
                    },
                    // {
                    //     key: "history",
                    //     name: "Import History",
                    //     path: `/project/projectinfo/${projectId}/history`
                    // },
                    {
                        key: "exporthistory",
                        name: "Export History",
                        path: `/project/projectinfo/${projectId}/exporthistory`
                    },

                    {
                        key: "documents",
                        name: "Documents",
                        path: `/project/projectinfo/${projectId}/documents`
                    }
                ]
            });
        }
        let tabKeyList = [
            "basicdetails",
            "recommendations",
            "regions",
            "sites",
            "buildings",
            "dashboard",
            "settings",
            "softCosts",
            "history",
            "exportHistory",
            "documents",
            "efci",
            "efcisandbox"
        ];
        if (path === "/efci") {
            history.push(`/efci/efciinfo/${projectId}/dashboard`);
        } else {
            let path = `/${this.props.isReportView ? "reports" : "project"}/projectinfo/${projectId}/${
                tabKeyList.includes(tab) ? tab : "basicdetails"
            }`;
            path +=
                tab === "settings"
                    ? `${settingType ? `/${settingType}` : ""}${subSection ? `/${subSection}` : ""}${subId ? `/${subId}` : ""}${
                          subTab ? `/${subTab}` : ""
                      }`
                    : tab === "reports"
                    ? `${settingType ? `/${settingType}` : ""}`
                    : "";

            history.push(path);
        }
    };

    getDataById = async projectId => {
        await this.props.getProjectById(projectId);
        return this.props.projectReducer.getProjectByIdResponse;
    };

    getBuildingTypeSettingsData = async projectId => {
        await this.props.getBuildingTypeSettingsData(projectId);
        return this.props.projectReducer.getBuildingTypeSettingsDataResponse;
    };
    getTradeSettingsData = async projectId => {
        await this.props.getTradeSettingsData(projectId);
        return this.props.projectReducer.getTradeSettingsDataResponse;
    };
    getCategorySettingsData = async projectId => {
        await this.props.getCategorySettingsData(projectId);
        return this.props.projectReducer.getCategorySettingsDataResponse;
    };
    getDepartmentSettingsData = async (params, projectId) => {
        await this.props.getDepartmentSettingsData(params, projectId);
        return this.props.projectReducer.getDepartmentSettingsDataResponse;
    };
    getSystemSettingsData = async (params, projectId) => {
        await this.props.getSystemSettingsData(params, projectId);
        return this.props.projectReducer.getSystemSettingsDataResponse;
    };
    getSubsystemSettingsData = async (params, projectId) => {
        await this.props.getSubsystemSettingsData(params, projectId);
        return this.props.projectReducer.getSubsystemSettingsDataResponse;
    };
    getGeneralSettingsData = async projectId => {
        await this.props.getaddLimit(projectId);
        return this.props.projectReducer.getaddLimitResponse;
    };

    updateBuildingTypeSettings = async (projectId, params) => {
        await this.props.updateBuildingTypeSettings(projectId, params);
    };

    uploadImages = async (imageData = {}) => {
        const { selectedProject } = this.state;
        await this.props.uploadProjectImage(imageData, selectedProject || this.props.match.params.id);
        await this.getAllImageList(selectedProject);
        return true;
    };

    deleteImages = async imageId => {
        const { selectedProject } = this.state;
        await this.props.deleteProjectImage(imageId);
        await this.getAllImageList(selectedProject);
        return true;
    };

    getAllImageList = async projectId => {
        await this.props.getAllProjectImages(projectId);
        return this.props.projectReducer.getAllImagesResponse.images;
    };
    addNewTrade = async (type, trade) => {
        const projectId = this.props.match.params.id;
        switch (type) {
            case "Trade":
                await this.props.addTrade(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addTradeResponse && this.props.projectReducer.addTradeResponse.message,
                    selectedTrade: null
                });
                break;
            case "Category":
                await this.props.addCategory(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addCategoryResponse && this.props.projectReducer.addCategoryResponse.message,
                    selectedTrade: null
                });
                break;
            case "System":
                await this.props.addSystem(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addSystemResponse && this.props.projectReducer.addSystemResponse.message,
                    selectedTrade: null
                });
                break;
            case "Subsystem":
                await this.props.addSubsystem(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addSubsystemResponse && this.props.projectReducer.addSubsystemResponse.message,
                    selectedTrade: null
                });
                break;
            case "Department":
                await this.props.addDepartment(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addDepartmentResponse && this.props.projectReducer.addDepartmentResponse.message,
                    selectedTrade: null
                });
                break;
            case "Limit":
                await this.props.addLimit(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addLimitResponse && this.props.projectReducer.addLimitResponse.message,
                    selectedTrade: null
                });
                break;

            default:
                break;
        }
        await this.refreshSettingsData();
        this.showAlerts();
    };
    updateTrade = async (type, trade, selectedtrade) => {
        const projectId = this.props.match.params.id;
        switch (type) {
            case "trade":
                await this.props.updateTrade(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateTradeResponse && this.props.projectReducer.updateTradeResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "category":
                await this.props.updateCategory(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateCategoryResponse && this.props.projectReducer.updateCategoryResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "system":
                await this.props.updateSystem(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateSystemResponse && this.props.projectReducer.updateSystemResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "subsystem":
                await this.props.updateSubsystem(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateSubsystemResponse && this.props.projectReducer.updateSubsystemResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "department":
                await this.props.updateDepartment(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateDepartmentResponse && this.props.projectReducer.updateDepartmentResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "limit":
                await this.props.updateGeneral(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateGeneralResponse && this.props.projectReducer.updateGeneralResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            default:
                break;
        }
    };
    getTradeById = async (tradeId, type) => {
        const projectId = this.props.match.params.id;
        switch (type) {
            case "trade":
                await this.props.getTradeById(projectId, tradeId);
                return this.props.projectReducer.getTradeByIdResponse;

            case "category":
                await this.props.getCategoryById(projectId, tradeId);
                return this.props.projectReducer.getCategoryByIdResponse;
            case "system":
                await this.props.getSystemById(projectId, tradeId);
                return this.props.projectReducer.getSystemByIdResponse;
            case "subsystem":
                await this.props.getSubsystemById(projectId, tradeId);
                return this.props.projectReducer.getSubsystemByIdResponse;
            case "department":
                await this.props.getDepartmentById(projectId, tradeId);
                return this.props.projectReducer.getDepartmentByIdResponse;
            case "limit":
                await this.props.getGeneralById(projectId, tradeId);
                return this.props.projectReducer.getGeneralByIdResponse;
            default:
                break;
        }
    };
    deleteTradeOnConfirm = async (trade, type) => {
        const projectId = this.props.match.params.id;
        switch (type) {
            case "category":
                await this.props.deleteCategory(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "trade":
                await this.props.deleteTrade(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "system":
                await this.props.deleteSystem(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "subsystem":
                await this.props.deleteSubsystem(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "department":
                await this.props.deleteDepartment(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "limit":
                await this.props.deleteGeneral(projectId, trade);
                await this.refreshSettingsData();
                break;
            default:
                break;
        }
    };
    handleAddLimit = async limit => {
        const projectId = this.props.match.params.id;
        await this.props.addLimit(projectId, limit);
    };

    exportTableXl = async () => {
        const {
            match: {
                params: { section, tab }
            }
        } = this.props;
        await this.setState({ tableLoading: true });
        section === "userinfo"
            ? await this.props.exportProject({
                  user_id: this.props.match.params.id,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              })
            : await this.props.exportProject({
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              });
        await this.setState({ tableLoading: false });
        if (this.props.projectReducer.projectExportResponse && this.props.projectReducer.projectExportResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.projectExportResponse.error });
            this.showAlerts();
        }
    };

    getEFCIColorCode = async params => {
        const projectId = this.props.match.params.id;
        if (projectId) {
            await this.props.getColorCodes(projectId);
            const colorCodes =
                (this.props.projectReducer && this.props.projectReducer.getColorCodes && this.props.projectReducer.getColorCodes.color_codes) || [];
            this.setState({
                colorCodes: colorCodes
            });
        }
    };

    addColor = async (name, from, to, code) => {
        this.setState({ codeLoading: true });
        const projectId = this.props.match.params.id;
        await this.props.addColorCode(projectId, {
            name: name,
            range_start: from,
            range_end: to,
            code: code
        });
        await this.getEFCIColorCode(projectId);
        this.setState({ codeLoading: false });
        const data = this.props.projectReducer && this.props.projectReducer.addColorCode && this.props.projectReducer.addColorCode.message;
        this.showAlert(data);
    };

    updateColors = async (id, name, from, to, code) => {
        this.setState({ codeLoading: true });
        const projectId = this.props.match.params.id;
        await this.props.updateColorCode(projectId, id, {
            name: name,
            range_start: from,
            range_end: to,
            code: code
        });
        await this.getEFCIColorCode(projectId);
        this.setState({ codeLoading: false });
        const data = this.props.projectReducer && this.props.projectReducer.updateColorCode && this.props.projectReducer.updateColorCode.message;
        this.showAlert(data);
    };

    deleteColors = async id => {
        this.setState({ codeLoading: true });
        const projectId = this.props.match.params.id;
        await this.props.deleteColorCode(projectId, id);
        await this.getEFCIColorCode(projectId);
        this.setState({ codeLoading: false });
        const data = this.props.projectReducer && this.props.projectReducer.deleteColorCode && this.props.projectReducer.deleteColorCode.message;
        this.showAlert(data);
    };

    showAlert = data => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = data;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, projectTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    getLogData = async buildingId => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllProjectLogs(buildingId, historyParams);
        const {
            projectReducer: {
                getAllProjectLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.projectReducer.getAllProjectLogsResponse && this.props.projectReducer.getAllProjectLogsResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.getAllProjectLogsResponse.error });
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
        // return this.props.regionReducer.getAllLogsResponse;
    };

    getColorCodeLogData = async id => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getColorCodeLogs(id, historyParams);
        const {
            projectReducer: {
                colorCodeLogs: { logs, count }
            }
        } = this.props;
        if (this.props.projectReducer.colorCodeLogs && this.props.projectReducer.colorCodeLogs.error) {
            await this.setState({ alertMessage: this.props.projectReducer.colorCodeLogs.error });
            this.showAlerts();
        } else {
            await this.setState({
                logDataColorCode: {
                    ...this.state.logDataColorCode,
                    data: logs
                },
                historyPaginationParams: {
                    ...this.state.historyPaginationParams,
                    totalCount: count,
                    totalPages: Math.ceil(count / this.state.historyPaginationParams.perPage)
                }
            });
        }
        // return this.props.regionReducer.getAllLogsResponse;
    };

    handlePerPageChangeColorCodeHistory = async e => {
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
        await this.getColorCodeLogData(this.props.match.params.id);
    };

    handlePageClickColorCodeHistory = async page => {
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
        await this.getColorCodeLogData(this.props.match.params.id);
    };
    // -------------------------------------colorcodelog-
    handlePageClickColorCode = async page => {
        const { logPaginationParams, logParams, selectedColumnId } = this.state;
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
        await this.showColorcodeLog(selectedColumnId);
    };
    // -----------------------------------colorcodelog---
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
        await this.props.deleteProjectLog(selectedLog);

        if (this.props.projectReducer.deleteProjectLogResponse && this.props.projectReducer.deleteProjectLogResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.deleteProjectLogResponse.error });
            this.showAlerts();
        }
        await this.getLogData(this.props.match.params.id);
        // ------------------------------colorcodelog--
        await this.showColorcodeLog(this.state.selectedColumnId);
        // ---------------------------------colorcodelog---

        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreProjectLog(id);
        if (this.props.projectReducer.restoreProjectLogResponse && this.props.projectReducer.restoreProjectLogResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.restoreProjectLogResponse.error });
            this.showAlerts();
        }
        await this.refreshProjectList();
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

    getProjectImportHistory = async buildingId => {
        const { importhistoryParams, importhistoryPaginationParams, importHistoryTableData } = this.state;
        await this.props.getProjectImportHistory(buildingId, importhistoryParams);
        const {
            projectReducer: {
                getAllProjectImportHistoryResponse: { fca_sheets, count }
            }
        } = this.props;
        if (this.props.projectReducer.getAllProjectImportHistoryResponse && this.props.projectReducer.getAllProjectImportHistoryResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.getAllProjectImportHistoryResponse.error });
            this.showAlerts();
        }
        await this.setState({
            importHistoryTableData: {
                ...this.state.importHistoryTableData,
                data: fca_sheets
            },
            importhistoryPaginationParams: {
                ...this.state.importhistoryPaginationParams,
                totalCount: count,
                totalPages: Math.ceil(count / this.state.importhistoryPaginationParams.perPage)
            },
            showImportWildCardFilter: this.state.importhistoryParams.filters ? true : false
        });
        //console.log(this.state.importHistoryTableData);
        // return this.props.regionReducer.getAllLogsResponse;
    };

    handleDeleteHistory = async id => {
        await this.setState({
            showConfirmModalimportHistory: true,
            selectedHistory: id
        });
    };

    renderConfirmationModalimportHistory = () => {
        const { showConfirmModalimportHistory } = this.state;
        if (!showConfirmModalimportHistory) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this History?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModalimportHistory: false })}
                        onYes={this.deleteProjectHistoryOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalimportHistory: false })}
            />
        );
    };

    deleteProjectHistoryOnConfirm = async () => {
        const { selectedHistory } = this.state;
        const { history } = this.props;
        await this.setState({
            showConfirmModalimportHistory: false,
            isLoading: true
        });
        await this.props.deleteProjectHistory(selectedHistory, this.props.match.params.id);
        await this.getProjectImportHistory(this.props.match.params.id);
        await this.setState({
            selectedHistory: null,
            isLoading: false
        });
    };

    handleGlobalSearchimportHistory = async search => {
        const { importhistoryParams } = this.state;
        await this.setState({
            importhistoryParams: {
                ...importhistoryParams,
                offset: 0,
                search
            },
            importhistoryPaginationParams: {
                ...this.state.importhistoryPaginationParams,
                currentPage: 0
            }
        });
        await this.getProjectImportHistory(this.props.match.params.id);
    };
    handleDownloadItem = async (url, file, type = "") => {
        if (!url) {
            this.setState({ alertMessage: "Oops..! File url not found." }, () => this.showAlerts());
        } else {
            const link = document.createElement("a");
            if (type === "logDownload") {
                // to download the file
                let blob = await fetch(url).then(r => r.blob());
                const downloadUrl = window.URL.createObjectURL(blob);
                link.href = downloadUrl;
                link.setAttribute("download", `${file}`);
            } else if (type === "logView") {
                // to open in new browser tab
                link.href = url;
                link.target = "_blank";
            } else {
                link.href = url;
                link.setAttribute("download", `${file}`);
            }
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };
    handlePerPageChangeImportHistory = async e => {
        const { importhistoryPaginationParams } = this.state;
        await this.setState({
            importhistoryPaginationParams: {
                ...importhistoryPaginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            importHistoryParams: {
                ...this.state.importHistoryParams,
                offset: 0,
                limit: e.target.value
            }
        });
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    handlePageClickImportHistory = async page => {
        const { importhistoryPaginationParams, importHistoryParams } = this.state;
        await this.setState({
            importhistoryPaginationParams: {
                ...importhistoryPaginationParams,
                currentPage: page.selected
            },
            importHistoryParams: {
                ...importHistoryParams,
                offset: page.selected * importhistoryPaginationParams.perPage
            }
        });
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    updateImportTableSortFilters = async searchKey => {
        if (this.state.importhistoryParams.order) {
            await this.setState({
                importhistoryParams: {
                    ...this.state.importhistoryParams,
                    order: {
                        ...this.state.importhistoryParams.order,
                        [searchKey]: this.state.importhistoryParams.order[searchKey] === "desc" ? "asc" : "desc"
                    }
                }
            });
        } else {
            await this.setState({
                importhistoryParams: {
                    ...this.state.importhistoryParams,
                    order: { [searchKey]: "asc" }
                }
            });
        }
        this.updateEntityParams();
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    resetAllImportFilters = async () => {
        await this.setState({
            // selectedRegion: null,
            importhistoryPaginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            importhistoryParams: {
                ...this.state.importhistoryParams,
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
        await this.getProjectImportHistory(this.props.match.params.id);
    };
    resetImportSort = async () => {
        await this.setState({
            importhistoryParams: {
                ...this.state.importhistoryParams,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    showViewImportModal = () => {
        this.setState({
            showViewImportModal: true
        });
    };

    handleImportHideColumn = async keyItem => {
        if (keyItem !== "selectAll" && keyItem !== "deselectAll") {
            await this.setState({
                importHistoryTableData: {
                    ...this.state.importHistoryTableData,
                    config: {
                        ...this.state.importHistoryTableData.config,
                        [keyItem]: {
                            ...this.state.importHistoryTableData.config[keyItem],
                            isVisible: !this.state.importHistoryTableData.config[keyItem].isVisible
                        }
                    }
                }
            });
        } else {
            let tempConfig = this.state.importHistoryTableData.config;
            this.state.importHistoryTableData.keys.map(item => {
                if (keyItem === "selectAll") {
                    tempConfig[item].isVisible = true;
                } else {
                    tempConfig[item].isVisible = false;
                }
            });
            await this.setState({
                importHistoryTableData: {
                    ...this.state.importHistoryTableData,
                    config: tempConfig
                }
            });
        }
        await this.updateEntityParams();
        return true;
    };

    toggleImportWildCardFilter = () => {
        const { showImportWildCardFilter } = this.state;
        this.setState({
            showImportWildCardFilter: !showImportWildCardFilter
        });
    };

    updateImportWildCardFilter = async newFilter => {
        await this.setState({
            importhistoryParams: {
                ...this.state.importhistoryParams,
                offset: 0,
                filters: newFilter
            },
            importhistoryPaginationParams: {
                ...this.state.importhistoryPaginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    exportImportTableXl = async () => {
        const projectId = this.props.match.params.id;
        await this.setState({ tableLoading: true });
        await this.props.exportImportProject(
            {
                search: this.state.importhistoryParams.search,
                filters: this.state.importhistoryParams.filters,
                list: this.state.importhistoryParams.list,
                order: this.state.importhistoryParams.order
            },
            projectId
        );
        await this.setState({ tableLoading: false });
        if (this.props.projectReducer.projectExportResponse && this.props.projectReducer.projectExportResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.projectExportResponse.error });
            this.showAlerts();
        }
    };

    handleProjectCspSummary = async (id, percentage, title) => {
        if (!id || !percentage || !title) return null;
        let tempEfciFC = this.state.efciData;
        tempEfciFC &&
            tempEfciFC.capital_spending_plans &&
            tempEfciFC.capital_spending_plans[title].map(item => {
                if (item.id === id) {
                    item.percentage = percentage;
                }
            });
        this.setState({
            efciData: tempEfciFC
        });
    };

    updateProjectCspSummary = async (id, percentage) => {
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
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
        } else if (tab == "efci") {
            await this.props.updateProjectCspSummaryData(id, percentage);
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleProjectAnnualEfci = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciData;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fcis &&
            tempRegionEfciFC.annual_fcis[index].map(item => {
                if (item.id === id) {
                    item.value = amount;
                }
            });
        this.setState({
            efciData: tempRegionEfciFC
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
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateProjectAnnualEfci(id, amount);
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleProjectAnnualFundingOption = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciData;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fundings &&
            tempRegionEfciFC.annual_fundings[index].map(item => {
                if (item.id === id) {
                    item.amount = amount;
                }
            });
        this.setState({
            efciData: tempRegionEfciFC
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
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateProjectAnnualFundingOption(amount, id);
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
        }
    };

    handleProjectFundingCostEfci = async (id, value, type) => {
        let tempRegionEfciFC = this.state.efciData;
        tempRegionEfciFC &&
            tempRegionEfciFC.expected_fcis.length &&
            tempRegionEfciFC.expected_fcis.map(efci => {
                if (efci.id === id) {
                    efci.value = value;
                }
            });
        this.setState({
            efciData: tempRegionEfciFC
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
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateProjectFundingCostEfci(value, id);
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
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
        let params = {
            project_id: this.props.match.params.id,
            fcis: forcedChangeArray
        };
        await this.props.forceUpdateProjectFundingCostEfci(params);
        await this.getEfciBasedOnProject();
        this.setState({
            efciLoading: false,
            forcedChangeArray: [],
            isValueChanged: false
        });
    };

    handleProjectEfciFundingCost = async (id, value) => {
        let tempRegionEfciFC = this.state.efciData;
        tempRegionEfciFC &&
            tempRegionEfciFC.funding_options.length &&
            tempRegionEfciFC.funding_options.map(fo => {
                if (fo.id === id) {
                    fo.value = value;
                }
            });
        this.setState({
            efciData: tempRegionEfciFC
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
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
        } else {
            await this.props.updateProjectFundingCost(value, id);
            await this.getEfciBasedOnProject();
            this.setState({
                efciLoading: false
            });
        }
    };
    getAllProjectDropdowns = async () => {
        let role = localStorage.getItem("role") || "";
        await this.props.getAllConsultancyUsers();
        if (role === "consultancy_user") {
            await this.props.getAllClients();
        }
        await this.props.getAllConsultanciesDropdown();
    };

    saveData = async params => {
        const {
            location: { search }
        } = this.props;
        const projectId = this.props.match.params.id;
        await this.props.saveDataEfciChartProject(projectId);
        await this.getEfciBasedOnProject();
    };

    updateProjectEfciLock = async lock => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        const projectId = this.props.match.params.id;
        if (tab === "dashboard" || tab === "efcisandbox") {
            await this.props.lockProjectSandbox(projectId, { lock });
            await this.getEfciBasedOnProject();
        } else {
            await this.props.lockProject(projectId, { lock });
            await this.getEfciBasedOnProject();
        }
    };

    resetData = () => {
        let tempArray = [];
        const { efciData } = this.state;
        if (efciData && efciData.funding_options && efciData.funding_options.length) {
            efciData.funding_options.map((item, index) =>
                // console.log("item-->", item, efciData.expected_fcis[index])
                tempArray.push({ value: parseFloat(efciData.expected_fcis[index].value), index: item.index })
            );
        }
        this.setState({
            tempArray
        });
    };

    initializeSpecialReport = async projectId => {
        await this.setState({ isInitializingSpecialReport: true });
        await this.props.initializeSpecialReport(projectId);
        if (this.props.projectReducer.initializeSpecialReportRes && this.props.projectReducer.initializeSpecialReportRes.message) {
            await this.setState({ alertMessage: this.props.projectReducer.initializeSpecialReportRes.message });
        } else if (this.props.projectReducer.initializeSpecialReportRes && this.props.projectReducer.initializeSpecialReportRes.error) {
            await this.setState({ alertMessage: this.props.projectReducer.initializeSpecialReportRes.error });
        } else {
            await this.setState({ alertMessage: "Failed" });
        }
        this.showAlerts();
        await this.setState({ isInitializingSpecialReport: false });
    };

    lockProject = lock => {
        this.props.lockProject(this.props.match.params.id, { lock });
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
            selectedProject,
            infoTabsData,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            importHistoryData,
            importHistoryTableData,
            handleGlobalSearchimportHistory,
            importhistoryPaginationParams,
            showViewImportModal,
            showImportWildCardFilter,
            permissions,
            logPermission,
            isInitializingSpecialReport
        } = this.state;
        const {
            match: {
                params: { section },
                path
            }
        } = this.props;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {this.renderLogModal()}
                {this.renderLog()}
                {this.deleteConfirmationModal()}
                {/* ------------------------colorcodelog----------- */}
                {this.renderColorCodeLogModal()}
                {/* --------------------colorcodelog----------------- */}
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedProject={selectedProject}
                        refreshProjectList={this.refreshProjectList}
                        handleAddProject={this.handleAddProject}
                        handleUpdateProject={this.handleUpdateProject}
                        getSiteListBasedOnRegion={this.getSiteListBasedOnRegion}
                        getRegionListBasedOnClient={this.getRegionListBasedOnClient}
                        consultancy_users1={consultancy_users}
                        getDataById={this.getDataById}
                        permissions={permissions}
                        getAllProjectDropdowns={this.getAllProjectDropdowns}
                    />
                ) : section === "projectinfo" ? (
                    <ProjectInfo
                        keys={tableData.keys}
                        projectId={this.props.match.params.id}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        resetAll={this.resetAll}
                        handleUpdateData={this.handleUpdateProject}
                        uploadImages={this.uploadImages}
                        getAllImageList={this.getAllImageList}
                        deleteImages={this.deleteImages}
                        showInfoPage={this.showInfoPage}
                        showUploadDataModal={this.showUploadDataModal}
                        getBuildingTypeSettingsData={this.getBuildingTypeSettingsData}
                        updateBuildingTypeSettings={this.updateBuildingTypeSettings}
                        getTradeSettingsData={this.getTradeSettingsData}
                        getCategorySettingsData={this.getCategorySettingsData}
                        getDepartmentSettingsData={this.getDepartmentSettingsData}
                        getSystemSettingsData={this.getSystemSettingsData}
                        getSubsystemSettingsData={this.getSubsystemSettingsData}
                        getGeneralSettingsData={this.getGeneralSettingsData}
                        addNewData={this.addNewTrade}
                        getItem={this.getTradeById}
                        refreshProjectData={this.state.refreshProjectData}
                        updateData={this.updateTrade}
                        deleteItem={this.deleteTradeOnConfirm}
                        handleDeleteItem={this.handleDeleteProject}
                        updateSelectedRow={this.updateSelectedRow}
                        updateProjectEntityParams={this.props.updateProjectEntityParams}
                        selectedRowId={selectedRowId}
                        handleAddLimit={this.handleAddLimit}
                        colorCodes={this.state.colorCodes}
                        addColor={this.addColor}
                        codeLoading={this.state.codeLoading}
                        updateColors={this.updateColors}
                        deleteColors={this.deleteColors}
                        getEFCIColorCode={this.getEFCIColorCode}
                        getAllProjLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreProjectLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        importHistoryData={importHistoryData}
                        getAllImportHistoryLogs={this.getProjectImportHistory}
                        importHistoryTableData={importHistoryTableData}
                        handleDeleteHistory={this.handleDeleteHistory}
                        importHistoryParams={this.state.importhistoryParams}
                        handleGlobalSearchimportHistory={this.handleGlobalSearchimportHistory}
                        globalSearchKeyimportHistory={this.state.importhistoryParams.search}
                        handleDownloadItem={this.handleDownloadItem}
                        importhistoryPaginationParams={importhistoryPaginationParams}
                        handlePerPageChangeImportHistory={this.handlePerPageChangeImportHistory}
                        handlePageClickImportHistory={this.handlePageClickImportHistory}
                        updateImportTableSortFilters={this.updateImportTableSortFilters}
                        resetAllImportFilters={this.resetAllImportFilters}
                        resetImportSort={this.resetImportSort}
                        showViewImportModal={this.showViewImportModal}
                        toggleImportWildCardFilter={this.toggleImportWildCardFilter}
                        showImportWildCardFilter={showImportWildCardFilter}
                        updateImportWildCardFilter={this.updateImportWildCardFilter}
                        exportImportTableXl={this.exportImportTableXl}
                        tableLoading={this.state.tableLoading}
                        efciData={this.state.efciData}
                        efciLoading={this.state.efciLoading}
                        loadDataProject={this.loadDataProject}
                        loadData={this.loadData}
                        permissions={permissions}
                        logPermission={logPermission}
                        getEfciBasedOnProject={this.getEfciBasedOnProject}
                        saveData={this.saveData}
                        handleProjectCspSummary={this.handleProjectCspSummary}
                        updateProjectCspSummary={this.updateProjectCspSummary}
                        handleProjectAnnualEfci={this.handleProjectAnnualEfci}
                        updateProjectAnnualEFCI={this.updateProjectAnnualEFCI}
                        handleProjectAnnualFundingOption={this.handleProjectAnnualFundingOption}
                        updateProjectAnnualFunding={this.updateProjectAnnualFunding}
                        handleProjectFundingCostEfci={this.handleProjectFundingCostEfci}
                        updateProjectFundingEfci={this.updateProjectFundingEfci}
                        handleProjectEfciFundingCost={this.handleProjectEfciFundingCost}
                        updateProjectEfciFundingCost={this.updateProjectEfciFundingCost}
                        updateProjectEfciLock={this.updateProjectEfciLock}
                        initializeSpecialReport={this.initializeSpecialReport}
                        isInitializingSpecialReport={isInitializingSpecialReport}
                        showLog={this.showLog}
                        // --------------------colorcodelog-------
                        showColorcodeLog={this.showColorcodeLog}
                        // --------------colorcodelog-------------------
                        isValueChanged={this.state.isValueChanged}
                        tempArray={this.state.tempArray}
                        resetData={this.resetData}
                        forceUpdateData={this.forceUpdateData}
                        saveDataForce={this.saveDataForce}
                        updateHiddenFundingOption={this.updateHiddenFundingOption}
                        hiddenFundingOptionList={this.state.hiddenFundingOptionList}
                        hasEdit={this.props.isReportView ? false : checkPermission("forms", "fca_projects", "edit")}
                        hasDelete={this.props.isReportView ? false : checkPermission("forms", "fca_projects", "delete")}
                        hasLogView={this.props.isReportView ? false : checkPermission("logs", "fca_projects", "view")}
                        hasLogDelete={this.props.isReportView ? false : checkPermission("logs", "fca_projects", "delete")}
                        hasLogRestore={this.props.isReportView ? false : checkPermission("logs", "fca_projects", "restore")}
                        hasInfoPage={checkPermission("forms", "fca_projects", "view")}
                        isReportView={this.props.isReportView}
                        entity="fca_projects"
                        lockProject={this.lockProject}
                        hasLock={checkPermission("forms", "recommendations", "lock")}
                    />
                ) : section === "efciinfo" ? (
                    <EfciInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        getDataById={this.getDataById}
                        handleUpdateData={this.handleUpdateProject}
                        uploadImages={this.uploadImages}
                        getAllImageList={this.getAllImageList}
                        deleteImages={this.deleteImages}
                        showInfoPage={this.showInfoPage}
                        showUploadDataModal={this.showUploadDataModal}
                        getBuildingTypeSettingsData={this.getBuildingTypeSettingsData}
                        updateBuildingTypeSettings={this.updateBuildingTypeSettings}
                        getTradeSettingsData={this.getTradeSettingsData}
                        getCategorySettingsData={this.getCategorySettingsData}
                        getDepartmentSettingsData={this.getDepartmentSettingsData}
                        getSystemSettingsData={this.getSystemSettingsData}
                        getSubsystemSettingsData={this.getSubsystemSettingsData}
                        getGeneralSettingsData={this.getGeneralSettingsData}
                        addNewData={this.addNewTrade}
                        getItem={this.getTradeById}
                        refreshProjectData={this.state.refreshProjectData}
                        updateData={this.updateTrade}
                        deleteItem={this.deleteTradeOnConfirm}
                        handleDeleteItem={this.handleDeleteProject}
                        updateSelectedRow={this.updateSelectedRow}
                        updateProjectEntityParams={this.props.updateProjectEntityParams}
                        selectedRowId={selectedRowId}
                        handleAddLimit={this.handleAddLimit}
                        efciData={this.state.efciData}
                        efciLoading={this.state.efciLoading}
                        colorCodes={this.state.colorCodes}
                        handleProjectCspSummary={this.handleProjectCspSummary}
                        updateProjectCspSummary={this.updateProjectCspSummary}
                        handleProjectAnnualEfci={this.handleProjectAnnualEfci}
                        updateProjectAnnualEFCI={this.updateProjectAnnualEFCI}
                        handleProjectAnnualFundingOption={this.handleProjectAnnualFundingOption}
                        updateProjectAnnualFunding={this.updateProjectAnnualFunding}
                        handleProjectFundingCostEfci={this.handleProjectFundingCostEfci}
                        updateProjectFundingEfci={this.updateProjectFundingEfci}
                        handleProjectEfciFundingCost={this.handleProjectEfciFundingCost}
                        updateProjectEfciFundingCost={this.updateProjectEfciFundingCost}
                        saveData={this.saveData}
                        loadData={this.loadData}
                        resetData={this.resetData}
                        saveDataForce={this.saveDataForce}
                        updateProjectEfciLock={this.updateProjectEfciLock}
                        showLog={this.showLog}
                        isValueChanged={this.state.isValueChanged}
                        tempArray={this.state.tempArray}
                        // resetData={this.resetData}
                        forceUpdateData={this.forceUpdateData}
                        // saveDataForce={this.saveDataForce}
                        getEfciBasedOnProject={this.getEfciBasedOnProject}
                        projectId={this.props.match.params.id}
                        updateHiddenFundingOption={this.updateHiddenFundingOption}
                        hiddenFundingOptionList={this.state.hiddenFundingOptionList}
                    />
                ) : path === "/efci" ? (
                    <ProjectMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteProject={this.handleDeleteProject}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterProject={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        logPermission={logPermission}
                        isEfciView
                        entity="fca_projects"
                        hasExport={checkPermission("forms", "fca_projects", "export")}
                    />
                ) : (
                    <ProjectMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteProject={this.handleDeleteProject}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterProject={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        logPermission={logPermission}
                        isUser={this.props.isUser || false}
                        hasExport={checkPermission("forms", "fca_projects", "export")}
                        showAddButton={
                            this.props.isReportView || this.props.dontShowAddButton ? false : checkPermission("forms", "fca_projects", "create")
                        }
                        hasEdit={this.props.isReportView ? false : checkPermission("forms", "fca_projects", "edit")}
                        hasDelete={this.props.isReportView ? false : checkPermission("forms", "fca_projects", "delete")}
                        hasInfoPage={checkPermission("forms", "fca_projects", "view")}
                        isReportView={this.props.isReportView}
                        entity="fca_projects"
                    />
                )}
                {this.renderConfirmationModal()}
                {this.renderUploadDataModal()}
                {this.renderMergeOrReplaceModalSelection()}
                {this.renderConfirmationModalLog()}
                {this.renderConfirmationModalimportHistory()}
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
                {showViewImportModal ? (
                    <Portal
                        body={
                            <ViewModal
                                keys={importHistoryTableData.keys}
                                config={importHistoryTableData.config}
                                handleHideColumn={this.handleImportHideColumn}
                                onCancel={() => this.setState({ showViewImportModal: false })}
                            />
                        }
                        onCancel={() => this.setState({ showViewImportModal: false })}
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
    const { projectReducer, recommendationsReducer, siteReducer, buildingReducer, commonReducer, dashboardReducer } = state;
    return { projectReducer, siteReducer, recommendationsReducer, buildingReducer, commonReducer, dashboardReducer };
};
let { getChartsDashboardPython } = dashboardActions;

export default withRouter(
    connect(mapStateToProps, {
        ...projectActions,
        ...siteActions,
        ...buildingActions,
        ...CommonActions,
        getChartsDashboardPython
    })(Index)
);
