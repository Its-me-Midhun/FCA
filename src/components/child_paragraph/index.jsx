import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import childParagraphActions from "./actions";
import ChildParagraphMain from "./components/ChildParagraphMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { childParagraphTableData } from "./components/tableConfig";
import ChildParagraphInfo from "./components/ChildParagraphInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission, removeOwnEntityFromList } from "../../config/utils";

let dynamicUrl = localStorage.getItem("dynamicUrl");
if (dynamicUrl && dynamicUrl.split("_").length && dynamicUrl.split("_")[0] !== "/child") {
    let entityType = dynamicUrl.split("_")[0].replace("/", "");
    childParagraphTableData.config.special_report.searchKey = `${entityType}_special_reports.name`;
    childParagraphTableData.config.special_report.getListTable = `${entityType}_special_reports`;
    childParagraphTableData.config.special_report.commonSearchKey = `${entityType}_special_reports`;
    childParagraphTableData.config.report_paragraph.searchKey = `${entityType}_report_paragraphs.name`;
    childParagraphTableData.config.report_paragraph.getListTable = `${entityType}_report_paragraphs`;
    childParagraphTableData.config.report_paragraph.commonSearchKey = `${entityType}_report_paragraphs`;
}
class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.childParagraphReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.childParagraphReducer.entityParams.selectedRowId,
        params: this.props.childParagraphReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedChildParagraph: this.props.match.params.id || this.props.childParagraphReducer.entityParams.selectedEntity,
        tableData: {
            keys: childParagraphTableData.keys,
            config: this.props.childParagraphReducer.entityParams.tableConfig || _.cloneDeep(childParagraphTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.childParagraphReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.childParagraphReducer.entityParams.filterParams,
        historyPaginationParams: this.props.childParagraphReducer.entityParams.historyPaginationParams,
        historyParams: this.props.childParagraphReducer.entityParams.historyParams,
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
        await this.refreshChildParagraphList();
    };

    refreshChildParagraphList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let childParagraphList = [];
        let totalCount = 0;
        await this.props.getChildParagraphs(params, dynamicUrl);
        childParagraphList = this.props.childParagraphReducer.getChildParagraphsResponse
            ? this.props.childParagraphReducer.getChildParagraphsResponse.child_paragraphs || []
            : [];
        totalCount = this.props.childParagraphReducer.getChildParagraphsResponse
            ? this.props.childParagraphReducer.getChildParagraphsResponse.count || 0
            : 0;

        if (childParagraphList && !childParagraphList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getChildParagraphs(this.state.params, dynamicUrl);
            childParagraphList = this.props.childParagraphReducer.getChildParagraphsResponse
                ? this.props.childParagraphReducer.getChildParagraphsResponse.child_paragraphs || []
                : [];
            totalCount = this.props.childParagraphReducer.getChildParagraphsResponse
                ? this.props.childParagraphReducer.getChildParagraphsResponse.count || 0
                : 0;
        }

        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.childParagraphs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.childParagraphs || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.childParagraph_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.childParagraph_logs || {}
                : {};

        if (
            childParagraphList &&
            !childParagraphList.length &&
            this.props.childParagraphReducer.getChildParagraphsResponse &&
            this.props.childParagraphReducer.getChildParagraphsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.childParagraphReducer.getChildParagraphsResponse.error });
            this.showAlert();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: childParagraphList,
                config: this.props.childParagraphReducer.entityParams.tableConfig || tableData.config
            },
            childParagraphList,
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
        await this.refreshChildParagraphList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "ChildParagraph",
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
        await this.props.updateChildParagraphEntityParams(entityParams);
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
        await this.refreshChildParagraphList();
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
                config:  _.cloneDeep(childParagraphTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshChildParagraphList();
    };
    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshChildParagraphList();
    };

    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters,  list }, dynamicUrl);
        return (
            (this.props.childParagraphReducer.getListForCommonFilterResponse &&
                this.props.childParagraphReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshChildParagraphList();
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
        await this.refreshChildParagraphList();
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
        await this.refreshChildParagraphList();
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
        await this.refreshChildParagraphList();
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

    showEditPage = childParagraphId => {
        const { history } = this.props;
        this.setState({
            selectedChildParagraph: childParagraphId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Child Paragraph",
            path: `/childparagraph/edit/${childParagraphId}`
        });
        history.push(`/childparagraph/edit/${childParagraphId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedChildParagraph: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Child Paragraph",
            path: `/childparagraph/add`
        });
        history.push(`/childparagraph/add`);
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

    handleAddChildParagraph = async childParagraph => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.addChildParagraph({ child_paragraph: childParagraph }, dynamicUrl);
        if (this.props.childParagraphReducer.addChildParagraphResponse && this.props.childParagraphReducer.addChildParagraphResponse.error) {
            await this.setState({
                alertMessage: this.props.childParagraphReducer.addChildParagraphResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    this.props.childParagraphReducer.addChildParagraphResponse && this.props.childParagraphReducer.addChildParagraphResponse.message
            });
            this.showAlert();
            await this.refreshChildParagraphList();
            // history.push(`/childparagraph`);
            history.goBack();
        }
    };

    handleUpdateChildParagraph = async (childParagraph_id, childParagraph) => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.updateChildParagraph(childParagraph_id, { child_paragraph: childParagraph }, dynamicUrl);
        if (this.props.childParagraphReducer.updateChildParagraphResponse && this.props.childParagraphReducer.updateChildParagraphResponse.error) {
            await this.setState({ alertMessage: this.props.childParagraphReducer.updateChildParagraphResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.childParagraphReducer.updateChildParagraphResponse &&
                        this.props.childParagraphReducer.updateChildParagraphResponse.message) ||
                    "ChildParagraph updated successfully"
            });
            this.showAlert();
            await this.refreshChildParagraphList();
            // history.push(`/childparagraph`);
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

    handleDeleteChildParagraph = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedChildParagraph: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this ChildParagraph?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteChildParagraphOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteChildParagraphOnConfirm = async () => {
        const { selectedChildParagraph } = this.state;
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.deleteChildParagraph(selectedChildParagraph, dynamicUrl);
        if (this.props.childParagraphReducer.deleteChildParagraphResponse && this.props.childParagraphReducer.deleteChildParagraphResponse.error) {
            await this.setState({ alertMessage: this.props.childParagraphReducer.deleteChildParagraphResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshChildParagraphList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/childparagraph");
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
        await this.refreshChildParagraphList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Child Paragraph",
                    path: `/childparagraph/childparagraphinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/childparagraph/childparagraphinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async childParagraphId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getChildParagraphById(childParagraphId, dynamicUrl);
        return this.props.childParagraphReducer.getChildParagraphByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.setState({ tableLoading: true });
        await this.props.exportChildParagraphs(dynamicUrl, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (this.props.childParagraphReducer.childParagraphExportResponse && this.props.childParagraphReducer.childParagraphExportResponse.error) {
            await this.setState({ alertMessage: this.props.childParagraphReducer.childParagraphExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllChildParagraphLogs(buildingId, historyParams);
        const {
            childParagraphReducer: {
                getAllChildParagraphLogsResponse: { logs, count }
            }
        } = this.props;
        if (
            this.props.childParagraphReducer.getAllChildParagraphLogsResponse &&
            this.props.childParagraphReducer.getAllChildParagraphLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.childParagraphReducer.getAllChildParagraphLogsResponse.error });
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
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, childParagraphTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    deleteLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.deleteChildParagraphLog(selectedLog);
        if (
            this.props.childParagraphReducer.deleteChildParagraphLogResponse &&
            this.props.childParagraphReducer.deleteChildParagraphLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.childParagraphReducer.deleteChildParagraphLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreChildParagraphLog(id);
        if (
            this.props.childParagraphReducer.restoreChildParagraphLogResponse &&
            this.props.childParagraphReducer.restoreChildParagraphLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.childParagraphReducer.restoreChildParagraphLogResponse.error });
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
            selectedChildParagraph,
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
                        selectedChildParagraph={id || selectedChildParagraph}
                        handleAddChildParagraph={this.handleAddChildParagraph}
                        handleUpdateChildParagraph={this.handleUpdateChildParagraph}
                        getDataById={this.getDataById}
                    />
                ) : section === "childparagraphinfo" ? (
                    <ChildParagraphInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteChildParagraph}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreChildParagraphLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={hasEdit && checkPermission("forms", "child_paragraphs", "edit")}
                        hasDelete={checkPermission("forms", "child_paragraphs", "delete")}
                        hasLogView={checkPermission("logs", "child_paragraphs", "view")}
                        hasLogDelete={checkPermission("logs", "child_paragraphs", "delete")}
                        hasLogRestore={checkPermission("logs", "child_paragraphs", "restore")}
                        hasInfoPage={checkPermission("forms", "child_paragraphs", "view")}
                        entity="child_paragraphs"
                    />
                ) : (
                    <ChildParagraphMain
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
                        handleDeleteChildParagraph={this.handleDeleteChildParagraph}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterChildParagraph={this.getListForCommonFilter}
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
                        hasExport={checkPermission("forms", "child_paragraphs", "export")}
                        showAddButton={hasAdd && checkPermission("forms", "child_paragraphs", "create")}
                        hasEdit={hasEdit && checkPermission("forms", "child_paragraphs", "edit")}
                        hasDelete={checkPermission("forms", "child_paragraphs", "delete")}
                        hasInfoPage={checkPermission("forms", "child_paragraphs", "view")}
                        entity="child_paragraphs"
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
    const { projectReducer, commonReducer, childParagraphReducer } = state;
    return { projectReducer, commonReducer, childParagraphReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...childParagraphActions,
        ...CommonActions
    })(index)
);
