import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import systemActions from "./actions";
import SystemMain from "./components/SystemMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { systemTableData } from "./components/tableConfig";
import SystemInfo from "./components/SystemInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission } from "../../config/utils";
import qs from "query-string";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.masterSystemReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.masterSystemReducer.entityParams.selectedRowId,
        params: this.props.masterSystemReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedSystem: this.props.match.params.id || this.props.masterSystemReducer.entityParams.selectedEntity,
        tableData: {
            keys: systemTableData.keys,
            config: this.props.masterSystemReducer.entityParams.tableConfig || _.cloneDeep(systemTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.masterSystemReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.masterSystemReducer.entityParams.filterParams,
        historyPaginationParams: this.props.masterSystemReducer.entityParams.historyPaginationParams,
        historyParams: this.props.masterSystemReducer.entityParams.historyParams,
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
        await this.refreshSystemList();
    };

    refreshSystemList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id: buildingId }
            }
        } = this.props;
        let systemList = [];
        let totalCount = 0;
        await this.props.getSystems(params);
        systemList = this.props.masterSystemReducer.getSystemsResponse ? this.props.masterSystemReducer.getSystemsResponse.systems || [] : [];
        totalCount = this.props.masterSystemReducer.getSystemsResponse ? this.props.masterSystemReducer.getSystemsResponse.count || 0 : 0;

        if (systemList && !systemList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getSystems(buildingId, this.state.params);
            systemList = this.props.masterSystemReducer.getSystemsResponse ? this.props.masterSystemReducer.getSystemsResponse.systems || [] : [];
            totalCount = this.props.masterSystemReducer.getSystemsResponse ? this.props.masterSystemReducer.getSystemsResponse.count || 0 : 0;
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.systems
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.systems || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.system_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.system_logs || {}
                : {};

        if (
            systemList &&
            !systemList.length &&
            this.props.masterSystemReducer.getSystemsResponse &&
            this.props.masterSystemReducer.getSystemsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.masterSystemReducer.getSystemsResponse.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...tableData,
                data: systemList,
                config: this.props.masterSystemReducer.entityParams.tableConfig || tableData.config
            },
            systemList,
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
        await this.refreshSystemList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "System",
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
        await this.props.updateSystemEntityParams(entityParams);
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
        await this.refreshSystemList();
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
                config: _.cloneDeep(systemTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshSystemList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, systemTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshSystemList();
    };

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        let updatedList = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        await this.props.getListForCommonFilter({ ...params, search, filters, list: updatedList });
        return (
            (this.props.masterSystemReducer.getListForCommonFilterResponse && this.props.masterSystemReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshSystemList();
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
        await this.refreshSystemList();
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
        await this.refreshSystemList();
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
        await this.refreshSystemList();
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

    showEditPage = systemId => {
        const { history } = this.props;
        this.setState({
            selectedSystem: systemId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit System",
            path: `/system/edit/${systemId}`
        });
        history.push(`/system/edit/${systemId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedSystem: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add System",
            path: `/system/add`
        });
        history.push(`/system/add`);
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

    handleAddSystem = async system => {
        const { history } = this.props;
        await this.props.addSystem({ system });
        if (this.props.masterSystemReducer.addSystemResponse && this.props.masterSystemReducer.addSystemResponse.error) {
            await this.setState({
                alertMessage: this.props.masterSystemReducer.addSystemResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage: this.props.masterSystemReducer.addSystemResponse && this.props.masterSystemReducer.addSystemResponse.message
            });
            this.showAlert();
            await this.refreshSystemList();
            history.push(`/system`);
        }
    };

    handleUpdateSystem = async (system_id, system) => {
        const { history } = this.props;
        await this.props.updateSystem(system_id, { system });
        if (this.props.masterSystemReducer.updateSystemResponse && this.props.masterSystemReducer.updateSystemResponse.error) {
            await this.setState({ alertMessage: this.props.masterSystemReducer.updateSystemResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.masterSystemReducer.updateSystemResponse && this.props.masterSystemReducer.updateSystemResponse.message) ||
                    "System updated successfully"
            });
            this.showAlert();
            await this.refreshSystemList();
            history.push(`/system`);
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

    handleDeleteSystem = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedSystem: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this System?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteSystemOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteSystemOnConfirm = async () => {
        const { selectedSystem } = this.state;
        const { history } = this.props;
        await this.props.deleteSystem(selectedSystem);
        if (this.props.masterSystemReducer.deleteSystemResponse && this.props.masterSystemReducer.deleteSystemResponse.error) {
            await this.setState({ alertMessage: this.props.masterSystemReducer.deleteSystemResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshSystemList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/system");
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
        await this.refreshSystemList();
    };

    showInfoPage = projectId => {
        const {
            location: { search },
            history
        } = this.props;
        const query = qs.parse(search);
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "System",
                    path: `/system/systeminfo/${projectId}/basicdetails${search}`
                },
                // showing report related tabs only in report settings
                ...(query?.general !== "true"
                    ? [
                          {
                              key: "assignednarrativetemplate",
                              name: "Assigned Narrative Template",
                              path: `/system/systeminfo/${projectId}/assignednarrativetemplate${search}`
                          }
                      ]
                    : []),
                ...(query?.general !== "true"
                    ? [
                          {
                              key: "assignedtabletemplate",
                              name: "Assigned Table Template",
                              path: `/system/systeminfo/${projectId}/assignedtabletemplate${search}`
                          }
                      ]
                    : [])
                // {
                //     key: "assignedreportnotetemplate",
                //     name: "Assigned Report Note Template",
                //     path: `/system/systeminfo/${projectId}/assignedreportnotetemplate`
                // }
            ]
        });
        let tabKeyList = ["basicdetails", "assignednarrativetemplate", "assignedtabletemplate"];
        history.push(
            `/system/systeminfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }${search}`
        );
    };

    getDataById = async systemId => {
        await this.props.getSystemById(systemId);
        return this.props.masterSystemReducer.getSystemByIdResponse;
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        await this.setState({ tableLoading: true });
        await this.props.exportSystems({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (this.props.masterSystemReducer.systemExportResponse && this.props.masterSystemReducer.systemExportResponse.error) {
            await this.setState({ alertMessage: this.props.masterSystemReducer.systemExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllSystemLogs(buildingId, historyParams);
        const {
            masterSystemReducer: {
                getAllSystemLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.masterSystemReducer.getAllSystemLogsResponse && this.props.masterSystemReducer.getAllSystemLogsResponse.error) {
            await this.setState({ alertMessage: this.props.masterSystemReducer.getAllSystemLogsResponse.error });
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
        await this.props.deleteSystemLog(selectedLog);
        if (this.props.masterSystemReducer.deleteSystemLogResponse && this.props.masterSystemReducer.deleteSystemLogResponse.error) {
            await this.setState({ alertMessage: this.props.masterSystemReducer.deleteSystemLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreSystemLog(id);
        if (this.props.masterSystemReducer.restoreSystemLogResponse && this.props.masterSystemReducer.restoreSystemLogResponse.error) {
            await this.setState({ alertMessage: this.props.masterSystemReducer.restoreSystemLogResponse.error });
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
            selectedSystem,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission
        } = this.state;
        const {
            match: {
                params: { section }
            }
        } = this.props;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedSystem={selectedSystem}
                        handleAddSystem={this.handleAddSystem}
                        handleUpdateSystem={this.handleUpdateSystem}
                        getDataById={this.getDataById}
                    />
                ) : section === "systeminfo" ? (
                    <SystemInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteSystem}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreSystemLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={checkPermission("forms", "master_systems", "edit")}
                        hasDelete={checkPermission("forms", "master_systems", "delete")}
                        hasLogView={checkPermission("logs", "master_systems", "view")}
                        hasLogDelete={checkPermission("logs", "master_systems", "delete")}
                        hasLogRestore={checkPermission("logs", "master_systems", "restore")}
                        hasInfoPage={checkPermission("forms", "master_systems", "view")}
                        entity="master_systems"
                    />
                ) : (
                    <SystemMain
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
                        handleDeleteSystem={this.handleDeleteSystem}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterSystem={this.getListForCommonFilter}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
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
                        hasExport={checkPermission("forms", "master_systems", "export")}
                        showAddButton={checkPermission("forms", "master_systems", "create")}
                        hasEdit={checkPermission("forms", "master_systems", "edit")}
                        hasDelete={checkPermission("forms", "master_systems", "delete")}
                        hasInfoPage={checkPermission("forms", "master_systems", "view")}
                        entity="master_systems"
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
    const { projectReducer, commonReducer, masterSystemReducer } = state;
    return { projectReducer, commonReducer, masterSystemReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...systemActions,
        ...CommonActions
    })(index)
);
