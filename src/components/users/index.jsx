import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import buildingTypeActions from "./actions";
import siteActions from "../site/actions";
import buildingActions from "../building/actions";
import _ from "lodash";
import UserMain from "./components/UserMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { userTableData } from "../../config/tableData";
import UserInfo from "./components/UserInfo";
import {
    findPrevPathFromBreadCrumpData,
    resetBreadCrumpData,
    popBreadCrumpData,
    addToBreadCrumpData,
    checkPermission,
    popBreadCrumpOnPageClose
} from "../../config/utils";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        userList: [],
        paginationParams: this.props.userReducer.entityParams.paginationParams,
        currentViewAllUsers: null,
        currentActions: null,
        showViewModal: false,
        showFormModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        buildingTypeData: {},
        clients: [],
        regionList: [],
        consultancy_users: [],
        selectedRowId: this.props.userReducer.entityParams.selectedRowId,
        params: this.props.userReducer.entityParams.params,
        selectedClient: {},
        selectedBuildingType: this.props.match.params.id || this.props.userReducer.entityParams.selectedEntity,
        tableData: {
            keys: userTableData.keys,
            config: this.props.userReducer.entityParams.tableConfig || _.cloneDeep(userTableData.config)
        },
        alertMessage: "",
        wildCardFilterParams: this.props.userReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.userReducer.entityParams.filterParams,
        historyPaginationParams: this.props.userReducer.entityParams.historyPaginationParams,
        historyParams: this.props.userReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        tableLoading: false,
        permissions: {},
        logPermission: {}
    };

    componentDidMount = async () => {
        await this.refreshBuildingTypeList();
    };

    refreshBuildingTypeList = async () => {
        await this.setState({ isLoading: true });
        // await this.props.getAllProjectsDropdown();
        // await this.props.getAllBuildingsDropdown();
        // await this.props.getAllRolesDropdown();
        // await this.props.getAllGroupsDropdown();
        // await this.props.getMenuItems();
        const { params, paginationParams, tableData } = this.state;
        // using same componet for buildingType mangement and buildingType listing in info page
        let userList = [];
        let totalCount = 0;

        await this.props.getUsers(params);
        userList = this.props.userReducer.getUsersResponse ? this.props.userReducer.getUsersResponse.users || [] : [];
        totalCount = this.props.userReducer.getUsersResponse ? this.props.userReducer.getUsersResponse.count || 0 : 0;

        // go to previous page is the last record of the current page is deleted
        if (userList && !userList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getUsers(this.state.params);
            userList = this.props.userReducer.getUsersResponse ? this.props.userReducer.getUsersResponse.users || [] : [];
            totalCount = this.props.userReducer.getUsersResponse ? this.props.userReducer.getUsersResponse.count || 0 : 0;
        }

        if (userList && !userList.length && this.props.userReducer.getUsersResponse && this.props.userReducer.getUsersResponse.error) {
            await this.setState({ alertMessage: this.props.userReducer.getUsersResponse.error });
            this.showAlert();
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.users
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.users || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.user_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.user_logs || {}
                : {};

        this.setState({
            tableData: {
                ...tableData,
                data: userList,
                config: this.props.userReducer.entityParams.tableConfig || tableData.config
            },
            userList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
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
        await this.refreshBuildingTypeList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "User",
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
        await this.props.updateBuildingTypeEntityParams(entityParams);
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
        await this.refreshBuildingTypeList();
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
                config: _.cloneDeep(userTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshBuildingTypeList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshBuildingTypeList();
    };

    getListForCommonFilter = async params => {
        await this.props.getListForCommonFilter(params);
        return (this.props.userReducer.getListForCommonFilterResponse && this.props.userReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshBuildingTypeList();
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
        await this.refreshBuildingTypeList();
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
        await this.refreshBuildingTypeList();
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
        await this.refreshBuildingTypeList();
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

    showEditPage = userId => {
        const { history } = this.props;
        this.setState({
            selectedBuildingType: userId
        });
        // this.toggleShowFormModal();
        addToBreadCrumpData({ key: "edit", name: "Edit User", path: `/user/edit/${userId}` });
        history.push(`/user/edit/${userId}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedBuildingType: null
        });
        // this.toggleShowFormModal();
        addToBreadCrumpData({
            key: "add",
            name: "Add User",
            path: `/user/add`
        });
        history.push(`/user/add`);
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

    handleAddBuildingType = async client => {
        const { history } = this.props;
        await this.props.addUser(client);
        if (this.props.userReducer.addUserResponse && this.props.userReducer.addUserResponse.error) {
            await this.setState({
                alertMessage: this.props.userReducer.addUserResponse.error,
                selectedBuildingType: null
            });
            this.showAlert();
        } else {
            // await this.refreshBuildingTypeList();
            // await this.props.getMenuItems();
            await this.setState({
                alertMessage: this.props.userReducer.addUserResponse && this.props.userReducer.addUserResponse.message,
                selectedBuildingType: null
            });
            this.showAlert();
            await this.refreshBuildingTypeList();
            popBreadCrumpOnPageClose();
            history.push(findPrevPathFromBreadCrumpData() || "/settings/user");
        }
    };

    toggleShowFormModal = () => {
        this.setState({
            showFormModal: !this.state.showFormModal
        });
    };

    renderFormModal = () => {
        const { showFormModal } = this.state;
        if (!showFormModal) return null;
        return (
            <Portal
                body={
                    <Form
                        onCancel={this.toggleShowFormModal}
                        selectedBuildingType={this.state.selectedBuildingType}
                        refreshBuildingTypeList={this.refreshBuildingTypeList}
                        handleAddClient={this.handleAddBuildingType}
                        handleUpdateClient={this.handleUpdateBuildingType}
                        getDataById={this.getDataById}
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
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

    handleUpdateBuildingType = async (buildingType, image) => {
        const { history } = this.props;
        const { selectedBuildingType } = this.state;
        this.setState({ isLoading: true });
        await this.props.updateUser(buildingType, selectedBuildingType || this.props.match.params.id, image);
        if (this.props.userReducer.updateUserResponse && this.props.userReducer.updateUserResponse.error) {
            await this.setState({
                alertMessage: this.props.userReducer.updateUserResponse.error,
                selectedBuildingType: null
            });
            this.showAlert();
        } else {
            let userId = localStorage.getItem("userId");

            if (selectedBuildingType === userId) {
                localStorage.setItem("user", buildingType.name);
                localStorage.setItem("printed_name", buildingType.printed_name);
                localStorage.setItem("default_project", buildingType.default_project_id);
                await this.props.getUserById(userId);
                if (this.props.userReducer.getUserByIdResponse) {
                    localStorage.setItem("image", this.props.userReducer.getUserByIdResponse.image.url);
                    localStorage.setItem(
                        "asset_management_client",
                        JSON.stringify(this.props.userReducer.getUserByIdResponse.assetmanagement_client_id)
                    );
                    localStorage.setItem(
                        "energy_management_client",
                        JSON.stringify(this.props.userReducer.getUserByIdResponse.energymanagement_client_id)
                    );
                }

                // localStorage.setItem("image", image);
            }
            // await this.props.getMenuItems();
            await this.setState({
                alertMessage: this.props.userReducer.updateUserResponse && this.props.userReducer.updateUserResponse.message,
                selectedBuildingType: null
            });
            await this.refreshBuildingTypeList();
            this.showAlert();
            popBreadCrumpOnPageClose();
            history.push(findPrevPathFromBreadCrumpData() || `/settings/user`);
            if (selectedBuildingType == userId) {
                resetBreadCrumpData({
                    key: "main",
                    name: "User",
                    path: `/user/userinfo/${userId}/basicdetails`
                });
                window.location.reload();
            }
        }
        this.setState({ isLoading: false });
    };

    handleDeleteBuildingType = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedBuildingType: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this User?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteBuildingTypeOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteBuildingTypeOnConfirm = async () => {
        const { selectedBuildingType } = this.state;
        await this.props.deleteUser(selectedBuildingType);
        if (this.props.userReducer.deleteUserResponse && this.props.userReducer.deleteUserResponse.error) {
            await this.setState({ alertMessage: this.props.userReducer.deleteUserResponse.error });
            this.setState({
                showConfirmModal: false
                // selectedProject: null
            });
            this.showAlert();
        } else {
            // await this.props.getMenuItems();

            this.setState({
                showConfirmModal: false,
                selectedBuildingType: null
            });
            await this.refreshBuildingTypeList();
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                this.props.history.push(findPrevPathFromBreadCrumpData());
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
        await this.refreshBuildingTypeList();
    };

    showInfoPage = buildingTypeId => {
        const { history } = this.props;
        const {
            location: { search }
        } = this.props;
        let currentUser = this.props.match.params.id;
        let userId = localStorage.getItem("userId");
        let role = localStorage.getItem("role");
        let infoTabsData = [];
        if (currentUser == userId) {
            infoTabsData = [
                {
                    key: "basicdetails",
                    name: "User",
                    path: `/user/userinfo/${buildingTypeId}/basicdetails`
                },
                {
                    key: "settings",
                    name: "Settings",
                    path: `/user/userinfo/${buildingTypeId}/settings${search}`
                }
            ];
        } else {
            infoTabsData = [
                {
                    key: "basicdetails",
                    name: "User",
                    path: `/user/userinfo/${buildingTypeId}/basicdetails`
                },
                {
                    key: "projects",
                    name: "FCA Projects",
                    path: `/user/userinfo/${buildingTypeId}/projects${search}`
                },
                {
                    key: "buildings",
                    name: "Buildings",
                    path: `/user/userinfo/${buildingTypeId}/buildings${search}`
                },
                {
                    key: "settings",
                    name: "Settings",
                    path: `/user/userinfo/${buildingTypeId}/settings${search}`
                }
            ];
        }

        this.setState({
            selectedBuildingType: buildingTypeId,
            infoTabsData
        });
        let tabKeyList = ["basicdetails", "buildings", "projects", "settings"];
        history.push(
            `/user/userinfo/${buildingTypeId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
        // history.push(`/buildingType/buildingTypeinfo/${buildingTypeId}/basicdetails`);
    };

    getDataById = async regionId => {
        await this.props.getUserById(regionId);
        return this.props.userReducer.getUserByIdResponse;
    };

    getLogData = async buildingId => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllUserLogs(buildingId, historyParams);
        const {
            userReducer: {
                getAllUserLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.userReducer.getAllUserLogsResponse && this.props.userReducer.getAllUserLogsResponse.error) {
            await this.setState({ alertMessage: this.props.userReducer.getAllUserLogsResponse.error });
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
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, userTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.props.deleteUserLog(selectedLog);
        if (this.props.userReducer.deleteUserLogResponse && this.props.userReducer.deleteUserLogResponse.error) {
            await this.setState({ alertMessage: this.props.userReducer.deleteUserLogResponse.error });
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
        await this.props.restoreUserLog(id);
        await this.refreshBuildingTypeList();
        if (this.props.userReducer.restoreUserLogResponse && this.props.userReducer.restoreUserLogResponse.error) {
            await this.setState({ alertMessage: this.props.userReducer.restoreUserLogResponse.error });
            this.showAlert();
        }
    };

    exportTableXl = async () => {
        this.setState({ tableLoading: true });
        await this.props.exportUser({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({
            tableLoading: false
        });
        if (this.props.userReducer.userExportResponse && this.props.userReducer.userExportResponse.error) {
            await this.setState({ alertMessage: this.props.userReducer.userExportResponse.error });
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

    getAllUserDropdowns = async () => {
        await this.props.getAllProjectsDropdown();
        await this.props.getAllBuildingsDropdown();
        await this.props.getAllRolesDropdown();
        await this.props.getClientsBasedOnRole();
        await this.props.getConsultanciesBasedOnRole();
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            selectedRowId,
            infoTabsData,
            logData,
            historyPaginationParams,
            historyParams,
            selectedBuildingType,
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
                        selectedBuildingType={selectedBuildingType}
                        // refreshRegionList={this.refreshRegionList}
                        handleAddClient={this.handleAddBuildingType}
                        handleUpdateClient={this.handleUpdateBuildingType}
                        getDataById={this.getDataById}
                        getAllUserDropdowns={this.getAllUserDropdowns}
                    />
                ) : section === "userinfo" ? (
                    <UserInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        showEditPage={this.showEditPage}
                        updateData={this.handleUpdateBuildingType}
                        handleDeleteType={this.handleDeleteBuildingType}
                        getAllBuilTypeLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreBuildingTypeLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={checkPermission("forms", "users", "edit")}
                        hasDelete={checkPermission("forms", "users", "delete")}
                        hasLogView={checkPermission("logs", "users", "view")}
                        hasLogDelete={checkPermission("logs", "users", "delete")}
                        hasLogRestore={checkPermission("logs", "users", "restore")}
                        hasInfoPage={checkPermission("forms", "users", "view")}
                        entity="users"
                    />
                ) : (
                    <UserMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteBuildingType={this.handleDeleteBuildingType}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        showInfoPage={this.showInfoPage}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        globalSearchKey={this.state.params.search}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterBuildingType={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        updateTableSortFilters={this.updateTableSortFilters}
                        exportRegionTable={this.exportRegionTable}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasExport={checkPermission("forms", "users", "export")}
                        showAddButton={checkPermission("forms", "users", "create")}
                        hasEdit={checkPermission("forms", "users", "edit")}
                        hasDelete={checkPermission("forms", "users", "delete")}
                        hasInfoPage={checkPermission("forms", "users", "view")}
                        entity="users"
                    />
                )}
                {this.renderConfirmationModal()}
                {this.renderFormModal()}
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
    const { userReducer, siteReducer, buildingReducer, commonReducer } = state;
    return { userReducer, siteReducer, buildingReducer, commonReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...buildingTypeActions,
        ...siteActions,
        ...buildingActions,
        ...CommonActions
    })(index)
);
