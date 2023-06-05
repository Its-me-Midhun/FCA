import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import reportParagraphActions from "./actions";
import ReportParagraphMain from "./components/ReportParagraphMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { reportParagraphTableData } from "./components/tableConfig";
import ReportParagraphInfo from "./components/ReportParagraphInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission, removeOwnEntityFromList } from "../../config/utils";

let dynamicUrl = localStorage.getItem("dynamicUrl");
if (dynamicUrl && dynamicUrl.split("_").length && dynamicUrl.split("_")[0] !== "/report") {
    let entityType = dynamicUrl.split("_")[0].replace("/", "");
    reportParagraphTableData.config.special_report.searchKey = `${entityType}_special_reports.name`;
    reportParagraphTableData.config.special_report.getListTable = `${entityType}_special_reports`;
    reportParagraphTableData.config.special_report.commonSearchKey = `${entityType}_special_reports`;
}
class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.reportParagraphReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.reportParagraphReducer.entityParams.selectedRowId,
        params: this.props.reportParagraphReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedReportParagraph: this.props.match.params.id || this.props.reportParagraphReducer.entityParams.selectedEntity,
        tableData: {
            keys: reportParagraphTableData.keys,
            config: this.props.reportParagraphReducer.entityParams.tableConfig || _.cloneDeep(reportParagraphTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.reportParagraphReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.reportParagraphReducer.entityParams.filterParams,
        historyPaginationParams: this.props.reportParagraphReducer.entityParams.historyPaginationParams,
        historyParams: this.props.reportParagraphReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        permissions: {},
        logPermission: {}
    };

    componentDidMount = async () => {
        await this.refreshReportParagraphList();
    };

    refreshReportParagraphList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let reportParagraphList = [];
        let totalCount = 0;
        await this.props.getReportParagraphs(params, dynamicUrl);
        reportParagraphList = this.props.reportParagraphReducer.getReportParagraphsResponse
            ? this.props.reportParagraphReducer.getReportParagraphsResponse.report_paragraphs || []
            : [];
        totalCount = this.props.reportParagraphReducer.getReportParagraphsResponse
            ? this.props.reportParagraphReducer.getReportParagraphsResponse.count || 0
            : 0;

        if (reportParagraphList && !reportParagraphList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getReportParagraphs(this.state.params, dynamicUrl);
            reportParagraphList = this.props.reportParagraphReducer.getReportParagraphsResponse
                ? this.props.reportParagraphReducer.getReportParagraphsResponse.report_paragraphs || []
                : [];
            totalCount = this.props.reportParagraphReducer.getReportParagraphsResponse
                ? this.props.reportParagraphReducer.getReportParagraphsResponse.count || 0
                : 0;
        }

        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.reportParagraphs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.reportParagraphs || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.reportParagraph_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.reportParagraph_logs || {}
                : {};

        if (
            reportParagraphList &&
            !reportParagraphList.length &&
            this.props.reportParagraphReducer.getReportParagraphsResponse &&
            this.props.reportParagraphReducer.getReportParagraphsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportParagraphReducer.getReportParagraphsResponse.error });
            this.showAlert();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: reportParagraphList,
                config: this.props.reportParagraphReducer.entityParams.tableConfig || tableData.config
            },
            reportParagraphList,
            showWildCardFilter: this.state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
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
        await this.refreshReportParagraphList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "ReportParagraph",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateReportParagraphEntityParams(entityParams);
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
        await this.refreshReportParagraphList();
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
                config:_.cloneDeep(reportParagraphTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshReportParagraphList();
    };
    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshReportParagraphList();
    };

    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters,  list: removeOwnEntityFromList(list, params.field) }, dynamicUrl);
        return (
            (this.props.reportParagraphReducer.getListForCommonFilterResponse &&
                this.props.reportParagraphReducer.getListForCommonFilterResponse.list) ||
            []
        );
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
        await this.refreshReportParagraphList();
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
        await this.refreshReportParagraphList();
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
        await this.refreshReportParagraphList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, reportParagraphTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.refreshReportParagraphList();
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

    showEditPage = reportParagraphId => {
        const { history } = this.props;
        this.setState({
            selectedReportParagraph: reportParagraphId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Report Paragraph",
            path: `/reportparagraph/edit/${reportParagraphId}`
        });
        history.push(`/reportparagraph/edit/${reportParagraphId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedReportParagraph: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Report Paragraph",
            path: `/reportparagraph/add`
        });
        history.push(`/reportparagraph/add`);
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

    handleAddReportParagraph = async reportParagraph => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.addReportParagraph({ report_paragraph: reportParagraph }, dynamicUrl);
        if (this.props.reportParagraphReducer.addReportParagraphResponse && this.props.reportParagraphReducer.addReportParagraphResponse.error) {
            await this.setState({
                alertMessage: this.props.reportParagraphReducer.addReportParagraphResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    this.props.reportParagraphReducer.addReportParagraphResponse &&
                    this.props.reportParagraphReducer.addReportParagraphResponse.message
            });
            this.showAlert();
            await this.refreshReportParagraphList();
            // history.push(`/reportparagraph`);
            history.goBack();
        }
    };

    handleUpdateReportParagraph = async (reportParagraph_id, reportParagraph) => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.updateReportParagraph(reportParagraph_id, { report_paragraph: reportParagraph }, dynamicUrl);
        if (
            this.props.reportParagraphReducer.updateReportParagraphResponse &&
            this.props.reportParagraphReducer.updateReportParagraphResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportParagraphReducer.updateReportParagraphResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.reportParagraphReducer.updateReportParagraphResponse &&
                        this.props.reportParagraphReducer.updateReportParagraphResponse.message) ||
                    "ReportParagraph updated successfully"
            });
            this.showAlert();
            await this.refreshReportParagraphList();
            // history.push(`/reportparagraph`);
            history.goBack();
        }
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

    handleDeleteReportParagraph = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedReportParagraph: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this ReportParagraph?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteReportParagraphOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteReportParagraphOnConfirm = async () => {
        const { selectedReportParagraph } = this.state;
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.deleteReportParagraph(selectedReportParagraph, dynamicUrl);
        if (
            this.props.reportParagraphReducer.deleteReportParagraphResponse &&
            this.props.reportParagraphReducer.deleteReportParagraphResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportParagraphReducer.deleteReportParagraphResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshReportParagraphList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/reportparagraph");
            }
        }
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
        await this.refreshReportParagraphList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Report Paragraph",
                    path: `/reportparagraph/reportparagraphinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/reportparagraph/reportparagraphinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async reportParagraphId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getReportParagraphById(reportParagraphId, dynamicUrl);
        return this.props.reportParagraphReducer.getReportParagraphByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.setState({ tableLoading: true });
        await this.props.exportReportParagraphs(dynamicUrl, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (
            this.props.reportParagraphReducer.reportParagraphExportResponse &&
            this.props.reportParagraphReducer.reportParagraphExportResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportParagraphReducer.reportParagraphExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllReportParagraphLogs(buildingId, historyParams);
        const {
            reportParagraphReducer: {
                getAllReportParagraphLogsResponse: { logs, count }
            }
        } = this.props;
        if (
            this.props.reportParagraphReducer.getAllReportParagraphLogsResponse &&
            this.props.reportParagraphReducer.getAllReportParagraphLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportParagraphReducer.getAllReportParagraphLogsResponse.error });
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
        await this.props.deleteReportParagraphLog(selectedLog);
        if (
            this.props.reportParagraphReducer.deleteReportParagraphLogResponse &&
            this.props.reportParagraphReducer.deleteReportParagraphLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportParagraphReducer.deleteReportParagraphLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreReportParagraphLog(id);
        if (
            this.props.reportParagraphReducer.restoreReportParagraphLogResponse &&
            this.props.reportParagraphReducer.restoreReportParagraphLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportParagraphReducer.restoreReportParagraphLogResponse.error });
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

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            infoTabsData,
            selectedReportParagraph,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission
        } = this.state;
        const {
            match: {
                params: { section, id }
            },
            hasAssign = true,
            hasEdit = true,
            hasAdd = true
        } = this.props;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedReportParagraph={id || selectedReportParagraph}
                        handleAddReportParagraph={this.handleAddReportParagraph}
                        handleUpdateReportParagraph={this.handleUpdateReportParagraph}
                        getDataById={this.getDataById}
                    />
                ) : section === "reportparagraphinfo" ? (
                    <ReportParagraphInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteReportParagraph}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreReportParagraphLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={hasEdit && checkPermission("forms", "report_paragraphs", "edit")}
                        hasDelete={checkPermission("forms", "report_paragraphs", "delete")}
                        hasLogView={checkPermission("logs", "report_paragraphs", "view")}
                        hasLogDelete={checkPermission("logs", "report_paragraphs", "delete")}
                        hasLogRestore={checkPermission("logs", "report_paragraphs", "restore")}
                        hasInfoPage={checkPermission("forms", "report_paragraphs", "view")}
                        entity="report_paragraphs"
                    />
                ) : (
                    <ReportParagraphMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteReportParagraph={this.handleDeleteReportParagraph}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterReportParagraph={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        tableLoading={this.state.tableLoading}
                        exportTableXl={this.exportTableXl}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasExport={checkPermission("forms", "report_paragraphs", "export")}
                        showAddButton={hasAdd && checkPermission("forms", "report_paragraphs", "create")}
                        hasEdit={hasEdit && checkPermission("forms", "report_paragraphs", "edit")}
                        hasDelete={checkPermission("forms", "report_paragraphs", "delete")}
                        hasInfoPage={checkPermission("forms", "report_paragraphs", "view")}
                        entity="report_paragraphs"
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
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { projectReducer, commonReducer, reportParagraphReducer } = state;
    return { projectReducer, commonReducer, reportParagraphReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...reportParagraphActions,
        ...CommonActions
    })(index)
);
