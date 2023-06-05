import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import subSystemActions from "./actions";
import SubSystemMain from "./components/SubSystemMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { subSystemTableData } from "./components/tableConfig";
import SubSystemInfo from "./components/SubSystemInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission } from "../../config/utils";
import qs from "query-string";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.masterSubSystemReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.masterSubSystemReducer.entityParams.selectedRowId,
        params: this.props.masterSubSystemReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedSubSystem: this.props.match.params.id || this.props.masterSubSystemReducer.entityParams.selectedEntity,
        tableData: {
            keys: subSystemTableData.keys,
            config: this.props.masterSubSystemReducer.entityParams.tableConfig || _.cloneDeep(subSystemTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.masterSubSystemReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.masterSubSystemReducer.entityParams.filterParams,
        historyPaginationParams: this.props.masterSubSystemReducer.entityParams.historyPaginationParams,
        historyParams: this.props.masterSubSystemReducer.entityParams.historyParams,
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
        await this.refreshSubSystemList();
    };

    refreshSubSystemList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id: buildingId }
            }
        } = this.props;
        let subSystemList = [];
        let totalCount = 0;
        await this.props.getSubSystems(params);
        subSystemList = this.props.masterSubSystemReducer.getSubSystemsResponse
            ? this.props.masterSubSystemReducer.getSubSystemsResponse.sub_systems || []
            : [];
        totalCount = this.props.masterSubSystemReducer.getSubSystemsResponse ? this.props.masterSubSystemReducer.getSubSystemsResponse.count || 0 : 0;
        if (subSystemList && !subSystemList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getSubSystems(buildingId, this.state.params);
            subSystemList = this.props.masterSubSystemReducer.getSubSystemsResponse
                ? this.props.masterSubSystemReducer.getSubSystemsResponse.sub_systems || []
                : [];
            totalCount = this.props.masterSubSystemReducer.getSubSystemsResponse
                ? this.props.masterSubSystemReducer.getSubSystemsResponse.count || 0
                : 0;
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.subSystems
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.subSystems || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.subSystem_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.subSystem_logs || {}
                : {};

        if (
            subSystemList &&
            !subSystemList.length &&
            this.props.masterSubSystemReducer.getSubSystemsResponse &&
            this.props.masterSubSystemReducer.getSubSystemsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.masterSubSystemReducer.getSubSystemsResponse.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...tableData,
                data: subSystemList,
                config: this.props.masterSubSystemReducer.entityParams.tableConfig || tableData.config
            },
            subSystemList,
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
        await this.refreshSubSystemList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "SubSystem",
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
        await this.props.updateSubSystemEntityParams(entityParams);
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
        await this.refreshSubSystemList();
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
                config: _.cloneDeep(subSystemTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshSubSystemList();
    };
    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshSubSystemList();
    };

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        let updatedList = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        await this.props.getListForCommonFilter({ ...params, search, filters, list: updatedList });
        return (
            (this.props.masterSubSystemReducer.getListForCommonFilterResponse &&
                this.props.masterSubSystemReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshSubSystemList();
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
        await this.refreshSubSystemList();
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
        await this.refreshSubSystemList();
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
        await this.refreshSubSystemList();
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

    showEditPage = subSystemId => {
        const { history } = this.props;
        this.setState({
            selectedSubSystem: subSystemId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit SubSystem",
            path: `/subSystem/edit/${subSystemId}`
        });
        history.push(`/subSystem/edit/${subSystemId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedSubSystem: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Sub System",
            path: `/subSystem/add`
        });
        history.push(`/subSystem/add`);
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

    handleAddSubSystem = async subSystem => {
        const { history } = this.props;
        await this.props.addSubSystem({ sub_system: subSystem });
        if (this.props.masterSubSystemReducer.addSubSystemResponse && this.props.masterSubSystemReducer.addSubSystemResponse.error) {
            await this.setState({
                alertMessage: this.props.masterSubSystemReducer.addSubSystemResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage: this.props.masterSubSystemReducer.addSubSystemResponse && this.props.masterSubSystemReducer.addSubSystemResponse.message
            });
            this.showAlert();
            await this.refreshSubSystemList();
            history.push(`/subSystem`);
        }
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, subSystemTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    handleUpdateSubSystem = async (subSystem_id, subSystem) => {
        const { history } = this.props;
        await this.props.updateSubSystem(subSystem_id, { sub_system: subSystem });
        if (this.props.masterSubSystemReducer.updateSubSystemResponse && this.props.masterSubSystemReducer.updateSubSystemResponse.error) {
            await this.setState({ alertMessage: this.props.masterSubSystemReducer.updateSubSystemResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.masterSubSystemReducer.updateSubSystemResponse &&
                        this.props.masterSubSystemReducer.updateSubSystemResponse.message) ||
                    "SubSystem updated successfully"
            });
            this.showAlert();
            await this.refreshSubSystemList();
            history.push(`/subSystem`);
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

    handleDeleteSubSystem = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedSubSystem: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this SubSystem?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteSubSystemOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteSubSystemOnConfirm = async () => {
        const { selectedSubSystem } = this.state;
        const { history } = this.props;
        await this.props.deleteSubSystem(selectedSubSystem);
        if (this.props.masterSubSystemReducer.deleteSubSystemResponse && this.props.masterSubSystemReducer.deleteSubSystemResponse.error) {
            await this.setState({ alertMessage: this.props.masterSubSystemReducer.deleteSubSystemResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshSubSystemList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/subSystem");
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
        await this.refreshSubSystemList();
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
                    name: "Sub System",
                    path: `/subSystem/subSysteminfo/${projectId}/basicdetails${search}`
                },
                // showing report related tabs only in report settings
                ...(query?.general !== "true"
                    ? [
                          {
                              key: "assignednarrativetemplate",
                              name: "Assigned Narrative Template",
                              path: `/subSystem/subSysteminfo/${projectId}/assignednarrativetemplate${search}`
                          }
                      ]
                    : []),
                ...(query?.general !== "true"
                    ? [
                          {
                              key: "assignedtabletemplate",
                              name: "Assigned Table Template",
                              path: `/subSystem/subSysteminfo/${projectId}/assignedtabletemplate${search}`
                          }
                      ]
                    : []),
                ...(query?.general !== "true"
                    ? [
                          {
                              key: "assignedreportnotetemplate",
                              name: "Assigned Report Note Template",
                              path: `/subSystem/subSysteminfo/${projectId}/assignedreportnotetemplate${search}`
                          }
                      ]
                    : []),
                ...(query?.general === "true"
                    ? [
                          {
                              key: "assignedrecommendationtemplate",
                              name: "Assigned Recommendation Template",
                              path: `/subSystem/subSysteminfo/${projectId}/assignedrecommendationtemplate${search}`
                          }
                      ]
                    : [])
            ]
        });
        let tabKeyList = [
            "basicdetails",
            "assignednarrativetemplate",
            "assignedtabletemplate",
            "assignedreportnotetemplate",
            "assignedrecommendationtemplate"
        ];
        history.push(
            `/subSystem/subSysteminfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }${search}`
        );
    };

    getDataById = async subSystemId => {
        await this.props.getSubSystemById(subSystemId);
        return this.props.masterSubSystemReducer.getSubSystemByIdResponse;
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        await this.setState({ tableLoading: true });
        await this.props.exportSubSystems({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (this.props.masterSubSystemReducer.subSystemExportResponse && this.props.masterSubSystemReducer.subSystemExportResponse.error) {
            await this.setState({ alertMessage: this.props.masterSubSystemReducer.subSystemExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllSubSystemLogs(buildingId, historyParams);
        const {
            masterSubSystemReducer: {
                getAllSubSystemLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.masterSubSystemReducer.getAllSubSystemLogsResponse && this.props.masterSubSystemReducer.getAllSubSystemLogsResponse.error) {
            await this.setState({ alertMessage: this.props.masterSubSystemReducer.getAllSubSystemLogsResponse.error });
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
        await this.props.deleteSubSystemLog(selectedLog);
        if (this.props.masterSubSystemReducer.deleteSubSystemLogResponse && this.props.masterSubSystemReducer.deleteSubSystemLogResponse.error) {
            await this.setState({ alertMessage: this.props.masterSubSystemReducer.deleteSubSystemLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreSubSystemLog(id);
        if (this.props.masterSubSystemReducer.restoreSubSystemLogResponse && this.props.masterSubSystemReducer.restoreSubSystemLogResponse.error) {
            await this.setState({ alertMessage: this.props.masterSubSystemReducer.restoreSubSystemLogResponse.error });
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

    handleUpdateBenchmark = async (subSystem_id, subSystem) => {
        await this.props.updateSubSystem(subSystem_id, { sub_system: subSystem });
        if (this.props.masterSubSystemReducer.updateSubSystemResponse && this.props.masterSubSystemReducer.updateSubSystemResponse.error) {
            await this.setState({ alertMessage: this.props.masterSubSystemReducer.updateSubSystemResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.masterSubSystemReducer.updateSubSystemResponse &&
                        this.props.masterSubSystemReducer.updateSubSystemResponse.message) ||
                    "SubSystem updated successfully"
            });
            this.showAlert();
            await this.refreshSubSystemList();
        }
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            infoTabsData,
            selectedSubSystem,
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
                        selectedSubSystem={selectedSubSystem}
                        handleAddSubSystem={this.handleAddSubSystem}
                        handleUpdateSubSystem={this.handleUpdateSubSystem}
                        getDataById={this.getDataById}
                    />
                ) : section === "subSysteminfo" ? (
                    <SubSystemInfo
                        showEditPage={this.showEditPage}
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteSubSystem}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreSubSystemLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={checkPermission("forms", "master_sub_systems", "edit")}
                        hasDelete={checkPermission("forms", "master_sub_systems", "delete")}
                        hasLogView={checkPermission("logs", "master_sub_systems", "view")}
                        hasLogDelete={checkPermission("logs", "master_sub_systems", "delete")}
                        hasLogRestore={checkPermission("logs", "master_sub_systems", "restore")}
                        hasInfoPage={checkPermission("forms", "master_sub_systems", "view")}
                        entity="master_sub_systems"
                        handleUpdateBenchmark={this.handleUpdateBenchmark}
                    />
                ) : (
                    <SubSystemMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteSubSystem={this.handleDeleteSubSystem}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterSubSystem={this.getListForCommonFilter}
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
                        hasExport={checkPermission("forms", "master_sub_systems", "export")}
                        showAddButton={checkPermission("forms", "master_sub_systems", "create")}
                        hasEdit={checkPermission("forms", "master_sub_systems", "edit")}
                        hasDelete={checkPermission("forms", "master_sub_systems", "delete")}
                        hasInfoPage={checkPermission("forms", "master_sub_systems", "view")}
                        entity="master_sub_systems"
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
    const { projectReducer, commonReducer, masterSubSystemReducer } = state;
    return { projectReducer, commonReducer, masterSubSystemReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...subSystemActions,
        ...CommonActions
    })(index)
);
