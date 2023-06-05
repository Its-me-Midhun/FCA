import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import systemTablesActions from "./actions";
import SystemTablesMain from "./components/SystemTablesMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { systemTablesTableData } from "./components/tableConfig";
import SystemTablesInfo from "./components/SystemTablesInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission } from "../../config/utils";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.systemTablesReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.systemTablesReducer.entityParams.selectedRowId,
        params: this.props.systemTablesReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedSystemTables: this.props.match.params.id || this.props.systemTablesReducer.entityParams.selectedEntity,
        tableData: {
            keys: systemTablesTableData.keys,
            config: this.props.systemTablesReducer.entityParams.tableConfig || _.cloneDeep(systemTablesTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.systemTablesReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.systemTablesReducer.entityParams.filterParams,
        historyPaginationParams: this.props.systemTablesReducer.entityParams.historyPaginationParams,
        historyParams: this.props.systemTablesReducer.entityParams.historyParams,
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
        await this.refreshSystemTablesList();
    };

    refreshSystemTablesList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let systemTablesList = [];
        let totalCount = 0;
        await this.props.getSystemTables(params, dynamicUrl);
        systemTablesList = this.props.systemTablesReducer.getSystemTablesResponse
            ? this.props.systemTablesReducer.getSystemTablesResponse.system_tables || []
            : [];
        totalCount = this.props.systemTablesReducer.getSystemTablesResponse ? this.props.systemTablesReducer.getSystemTablesResponse.count || 0 : 0;

        if (systemTablesList && !systemTablesList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getSystemTables(this.state.params, dynamicUrl);
            systemTablesList = this.props.systemTablesReducer.getSystemTablesResponse
                ? this.props.systemTablesReducer.getSystemTablesResponse.system_tables || []
                : [];
            totalCount = this.props.systemTablesReducer.getSystemTablesResponse
                ? this.props.systemTablesReducer.getSystemTablesResponse.count || 0
                : 0;
        }

        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.systemTabless
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.systemTabless || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.systemTables_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.systemTables_logs || {}
                : {};

        if (
            systemTablesList &&
            !systemTablesList.length &&
            this.props.systemTablesReducer.getSystemTablesResponse &&
            this.props.systemTablesReducer.getSystemTablesResponse.error
        ) {
            await this.setState({ alertMessage: this.props.systemTablesReducer.getSystemTablesResponse.error });
            this.showAlert();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: systemTablesList,
                config: this.props.systemTablesReducer.entityParams.tableConfig || tableData.config
            },
            systemTablesList,
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
        await this.refreshSystemTablesList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "SystemTables",
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
        await this.props.updateSystemTablesEntityParams(entityParams);
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
        await this.refreshSystemTablesList();
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
                config: _.cloneDeep(systemTablesTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshSystemTablesList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshSystemTablesList();
    };

    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters, list }, dynamicUrl);
        return (
            (this.props.systemTablesReducer.getListForCommonFilterResponse && this.props.systemTablesReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshSystemTablesList();
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
        await this.refreshSystemTablesList();
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
        await this.refreshSystemTablesList();
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
        await this.refreshSystemTablesList();
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

    showEditPage = systemTablesId => {
        const { history } = this.props;
        this.setState({
            selectedSystemTables: systemTablesId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit SystemTables",
            path: `/systemtables/edit/${systemTablesId}`
        });
        history.push(`/systemtables/edit/${systemTablesId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedSystemTables: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add SystemTables",
            path: `/systemtables/add`
        });
        history.push(`/systemtables/add`);
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

    handleAddSystemTables = async systemTables => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.addSystemTables({ special_report: systemTables }, dynamicUrl);
        if (this.props.systemTablesReducer.addSystemTablesResponse && this.props.systemTablesReducer.addSystemTablesResponse.error) {
            await this.setState({
                alertMessage: this.props.systemTablesReducer.addSystemTablesResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage: this.props.systemTablesReducer.addSystemTablesResponse && this.props.systemTablesReducer.addSystemTablesResponse.message
            });
            this.showAlert();
            await this.refreshSystemTablesList();
            // history.push(`/systemtables`);
            history.goBack();
        }
    };

    handleUpdateSystemTables = async (systemTables_id, systemTables) => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.updateSystemTables(systemTables_id, { special_report: systemTables }, dynamicUrl);
        if (this.props.systemTablesReducer.updateSystemTablesResponse && this.props.systemTablesReducer.updateSystemTablesResponse.error) {
            await this.setState({ alertMessage: this.props.systemTablesReducer.updateSystemTablesResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.systemTablesReducer.updateSystemTablesResponse &&
                        this.props.systemTablesReducer.updateSystemTablesResponse.message) ||
                    "SystemTables updated successfully"
            });
            this.showAlert();
            await this.refreshSystemTablesList();
            // history.push(`/systemtables`);
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

    handleDeleteSystemTables = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedSystemTables: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this SystemTables?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteSystemTablesOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteSystemTablesOnConfirm = async () => {
        const { selectedSystemTables } = this.state;
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.deleteSystemTables(selectedSystemTables, dynamicUrl);
        if (this.props.systemTablesReducer.deleteSystemTablesResponse && this.props.systemTablesReducer.deleteSystemTablesResponse.error) {
            await this.setState({ alertMessage: this.props.systemTablesReducer.deleteSystemTablesResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshSystemTablesList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/systemtables");
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
        await this.refreshSystemTablesList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: `/systemtables/systemtablesinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/systemtables/systemtablesinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async systemTablesId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getSystemTablesById(systemTablesId, dynamicUrl);
        return this.props.systemTablesReducer.getSystemTablesByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.setState({ tableLoading: true });
        await this.props.exportSystemTabless(dynamicUrl, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (this.props.systemTablesReducer.systemTablesExportResponse && this.props.systemTablesReducer.systemTablesExportResponse.error) {
            await this.setState({ alertMessage: this.props.systemTablesReducer.systemTablesExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllSystemTablesLogs(buildingId, historyParams);
        const {
            systemTablesReducer: {
                getAllSystemTablesLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.systemTablesReducer.getAllSystemTablesLogsResponse && this.props.systemTablesReducer.getAllSystemTablesLogsResponse.error) {
            await this.setState({ alertMessage: this.props.systemTablesReducer.getAllSystemTablesLogsResponse.error });
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
            if (!_.isEqual(config[key]?.isVisible, systemTablesTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    deleteLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.deleteSystemTablesLog(selectedLog);
        if (this.props.systemTablesReducer.deleteSystemTablesLogResponse && this.props.systemTablesReducer.deleteSystemTablesLogResponse.error) {
            await this.setState({ alertMessage: this.props.systemTablesReducer.deleteSystemTablesLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreSystemTablesLog(id);
        if (this.props.systemTablesReducer.restoreSystemTablesLogResponse && this.props.systemTablesReducer.restoreSystemTablesLogResponse.error) {
            await this.setState({ alertMessage: this.props.systemTablesReducer.restoreSystemTablesLogResponse.error });
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

    handleSystemTablesActions = (systemTables_id, systemTables) => {
        this.handleUpdateSystemTables(systemTables_id, systemTables);
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            infoTabsData,
            selectedSystemTables,
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
            hasEdit = false,
            hasAdd = false
        } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedSystemTables={id || selectedSystemTables}
                        handleAddSystemTables={this.handleAddSystemTables}
                        handleUpdateSystemTables={this.handleUpdateSystemTables}
                        getDataById={this.getDataById}
                    />
                ) : section === "systemtablesinfo" ? (
                    <SystemTablesInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteSystemTables}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreSystemTablesLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={false}
                        hasDelete={false}
                        hasLogView={false}
                        hasLogDelete={false}
                        hasLogRestore={false}
                        hasInfoPage={false}
                        entity="charts_and_graphs"
                    />
                ) : (
                    <SystemTablesMain
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
                        handleDeleteSystemTables={this.handleDeleteSystemTables}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterSystemTables={this.getListForCommonFilter}
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
                        handleSystemTablesActions={dynamicUrl === "/charts_and_graphs" ? this.handleSystemTablesActions : null}
                        hasExport={checkPermission("forms", "charts_and_graphs", "export")}
                        showAddButton={false}
                        hasEdit={false}
                        hasDelete={false}
                        hasInfoPage={false}
                        entity="charts_and_graphs"
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
    const { projectReducer, commonReducer, systemTablesReducer } = state;
    return { projectReducer, commonReducer, systemTablesReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...systemTablesActions,
        ...CommonActions
    })(index)
);
