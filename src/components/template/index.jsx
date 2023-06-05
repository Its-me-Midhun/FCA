import React, { Component } from "react";
import qs from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../common/components/Loader";
import userActions from "../userPermissions/actions";
import templateActions from "./actions";
import commonActions from "../common/actions";
import TemplateMain from "./components/templateMain";
import TemplateInfo from "./components/templateInfo";
import { templateTableData } from "../../config/tableData";
import Portal from "../common/components/Portal";
import ConfirmationModal from "../common/components/ConfirmationModal";
import ViewModal from "../common/components/ViewModal";
import { addToBreadCrumpData, findPrevPathFromBreadCrump, popBreadCrumpData, findPrevPathFromBreadCrumpData } from "../../config/utils";

class index extends Component {
    state = {
        infoTabsData: [],
        tabData: "form",
        activeUser: [],
        availableUser: [],
        activeUserId: [],
        formArray: {},
        logArray: {},
        efciArray: {},
        graphArray: {},
        menuArray: {},
        availableUsers: [],
        permissionArray: [],
        searchKeyWord: null,
        showErrorBorder: false,
        alertMessage: "",
        showUsers: false,
        consultancyUserId: "",
        fullChecked: {
            form: { view: false, create: false, edit: false, delete: false, export: false },
            log: { view: false, restore: false, delete: false },
            efci: { view: false, simulation: false, edit: false },
            menu: { view: false },
            charts_graphs: { view: false, export: false }
        },
        templateId: null,
        prevTemplate: null,
        isCancel: false, // to avoid loader while cancel

        //table
        isLoading: true,
        errorMessage: "",
        templateList: [],
        paginationParams: this.props.templateReducer.entityParams.paginationParams,
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
        selectedRowId: this.props.templateReducer.entityParams.selectedRowId,
        params: this.props.templateReducer.entityParams.params,
        selectedClient: {},
        selectedGroupType: this.props.match.params.id || this.props.templateReducer.entityParams.selectedEntity,
        tableData: {
            keys: templateTableData.keys,
            config: this.props.templateReducer.entityParams.tableConfig || _.cloneDeep(templateTableData.config)
        },
        alertMessage: "",
        wildCardFilterParams: this.props.templateReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.templateReducer.entityParams.filterParams,
        historyPaginationParams: this.props.templateReducer.entityParams.historyPaginationParams,
        historyParams: this.props.templateReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        tableLoading: false,
        groupData: {}
    };
    componentDidMount = async () => {
        // await this.props.getAllPermissions()
        // await this.props.getPermissions();
        await this.refreshTemplateList();
    };

    // componentDidUpdate = async (prevProps, prevState) => {
    //     const {
    //         match: {
    //             params: { section }
    //         }
    //     } = this.props;
    //     // if (section !== prevProps.match.params.section || this.props.match.params.id !== prevProps.match.params.id) {
    //     //     await this.refreshTemplateList();
    //     //     this.setState({ isCancel: false });
    //     // }
    // };

    //test

    refreshTemplateList = async () => {
        // ------------ to avoid loader while cancel----
        if (this.state.isCancel) {
            await this.setState({ isLoading: false });
        }
        // -------------------
        else {
            await this.setState({ isLoading: true });
        }

        // await this.props.getPermissions();

        const { history } = this.props;
        const { params, paginationParams, tableData } = this.state;

        this.setState({
            logArray: {},
            formArray: {},
            efciArray: {},
            graphArray: {},
            menuArray: {},
            groupData: {},
            activeUserId: [],
            activeUser: [],
            templateId: "",
            consultancyUserId: "",
            prevTemplate: "",
            fullChecked: {
                form: { view: false, create: false, edit: false, delete: false, export: false },
                log: { view: false, restore: false, delete: false },
                efci: { view: false, simulation: false, edit: false },
                menu: { view: false },
                charts_graphs: { view: false, export: false }
            },
            isEdit: false,
            searchKeyWord: null,
            tabData: "form"
        });
        await this.props.getAllTemplateData(params);
        if (this.props.templateReducer.getAllTemplateList && this.props.templateReducer.getAllTemplateList.success) {
            let templateList = [];
            let availableUsers = [];
            let totalCount = 0;
            templateList = this.props.templateReducer.getAllTemplateList ? this.props.templateReducer.getAllTemplateList.templates || [] : [];
            availableUsers = this.props.userPermissionReducer.getPermissions ? this.props.userPermissionReducer.getPermissions.users || [] : [];
            totalCount = this.props.templateReducer.getAllTemplateList ? this.props.templateReducer.getAllTemplateList.count || 0 : 0;

            this.setState({
                availableUsers
            });
            if (templateList && !templateList.length && paginationParams.currentPage) {
                this.setState({
                    params: {
                        ...params,
                        offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                    }
                });
                await this.props.getAllPermissions(this.state.params);
                templateList = this.props.templateReducer.getAllTemplateList ? this.props.templateReducer.getAllTemplateList.templates || [] : [];
                totalCount = this.props.templateReducer.getAllTemplateList ? this.props.templateReducer.getAllTemplateList.count || 0 : 0;
            }

            this.setState({
                tableData: {
                    ...tableData,
                    data: templateList,
                    config: this.props.templateReducer.entityParams.tableConfig || tableData.config
                },
                templateList,
                paginationParams: {
                    ...paginationParams,
                    totalCount: totalCount,
                    totalPages: Math.ceil(totalCount / paginationParams.perPage)
                },
                // clients,
                // consultancy_users,
                showWildCardFilter: this.state.params.filters ? true : false,
                isLoading: false
            });

            let logArray = {};
            let formArray = {};
            let efciArray = {};
            let graphArray = {};
            let menuArray = {};
            if (this.props.userPermissionReducer.getPermissions && this.props.userPermissionReducer.getPermissions.routes) {
                Object.keys(this.props.userPermissionReducer.getPermissions.routes).map(fc => {
                    if (fc.includes("_logs")) {
                        logArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                    } else if (fc.includes("_efcis")) {
                        efciArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                    } else if (fc.includes("_charts_and_graphs")) {
                        graphArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                    } else if (fc == "menu") {
                        Object.keys(this.props.userPermissionReducer.getPermissions.routes[fc]).map(
                            menuValue => (menuArray[menuValue] = { view: this.props.userPermissionReducer.getPermissions.routes[fc][menuValue] })
                        );
                    } else {
                        formArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                    }
                });

                this.setState({
                    logArray,
                    formArray,
                    efciArray,
                    graphArray,
                    menuArray,
                    groupData: {
                        name: ""
                    },
                    consultancyUserId: "",
                    activeUser: [],
                    activeUserId: []
                });
            }

            if (this.props.match.params && this.props.match.params.id) {
                await this.props.getPermissionById(this.props.match.params.id);
                if (this.props.userPermissionReducer.getPermissionById && this.props.userPermissionReducer.getPermissionById.success) {
                    if (
                        this.props.userPermissionReducer.getPermissionById &&
                        this.props.userPermissionReducer.getPermissionById.groups &&
                        this.props.userPermissionReducer.getPermissionById.groups.permissions &&
                        this.props.userPermissionReducer.getPermissionById.groups.permissions.length
                    ) {
                        this.props.userPermissionReducer.getPermissionById.groups.permissions.map((fc, key) => {
                            if (fc.name.includes("_logs")) {
                                logArray[fc.name] = fc.actions;
                            } else if (fc.name.includes("_efcis")) {
                                efciArray[fc.name] = fc.actions;
                            } else if (fc.name.includes("_charts_and_graphs")) {
                                graphArray[fc.name] = fc.actions;
                            } else if (fc.name == "menu") {
                                Object.keys(fc.actions).map(menuValue => (menuArray[menuValue] = { view: fc.actions[menuValue] }));
                            } else {
                                formArray[fc.name] = fc.actions;
                            }
                        });
                        let activeUserId = [];
                        let tempAvailableUsers = this.props.userPermissionReducer.getPermissions
                            ? this.props.userPermissionReducer.getPermissions.users || []
                            : [];

                        if (
                            this.props.userPermissionReducer.getPermissionById.groups.users &&
                            this.props.userPermissionReducer.getPermissionById.groups.users.length
                        ) {
                            this.props.userPermissionReducer.getPermissionById.groups.users.map(user => {
                                activeUserId.push(user.id);
                                if (tempAvailableUsers && tempAvailableUsers.length) {
                                    tempAvailableUsers = tempAvailableUsers.filter(availableUser => availableUser.id !== user.id);
                                }
                            });
                        }
                        this.setState({
                            logArray,
                            formArray,
                            menuArray,
                            availableUsers: tempAvailableUsers,
                            activeUserId
                        });
                    }
                    this.setState({
                        groupData: this.props.userPermissionReducer.getPermissionById.groups,
                        activeUser: this.props.userPermissionReducer.getPermissionById.groups
                            ? this.props.userPermissionReducer.getPermissionById.groups.users
                            : [],
                        consultancyUserId:
                            this.props.userPermissionReducer.getPermissionById.groups &&
                            this.props.userPermissionReducer.getPermissionById.groups.consultancy
                                ? this.props.userPermissionReducer.getPermissionById.groups.consultancy.id
                                : ""
                    });
                } else {
                    popBreadCrumpData();
                    history.push("/settings/templates");
                }
            }

            this.updateEntityParams();
            return true;
        } else {
            await this.setState({
                isLoading: false,
                alertMessage:
                    this.props.templateReducer.getAllTemplateList && this.props.templateReducer.getAllTemplateList.error
                        ? this.props.templateReducer.getAllTemplateList.error
                        : "Something went wrong !!",
                groupData: null
            });
            this.showAlert();
        }
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
        await this.refreshTemplateList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Templates",
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
        await this.props.updateTemplateEntityParams(entityParams);
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
        await this.refreshTemplateList();
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
                config: _.cloneDeep(templateTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshTemplateList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshTemplateList();
    };

    getListForCommonFilter = async params => {
        await this.props.getListForCommonFilterTemplate(params);
        return (this.props.templateReducer.getListForCommonFilterResponse && this.props.templateReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshTemplateList();
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
        await this.refreshTemplateList();
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
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, templateTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.refreshTemplateList();
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
        await this.refreshTemplateList();
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

    showEditPage = async groupId => {
        const { history } = this.props;
        this.setState({
            selectedGroupType: groupId
        });

        addToBreadCrumpData({ key: "edit", name: "Edit Template", path: `/settings/templates/edit/${groupId}` });
        history.push(`/settings/templates/edit/${groupId}`);
    };

    handleTab = tab => {
        this.setState({
            tabData: tab
        });
    };

    exportTableXl = async () => {
        this.setState({ tableLoading: true });
        await this.props.exportPermissions({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            template: true
        });
        this.setState({
            tableLoading: false
        });
        if (this.props.userPermissionReducer.permissionExportResponse && this.props.userPermissionReducer.permissionExportResponse.error) {
            await this.setState({ alertMessage: this.props.userPermissionReducer.permissionExportResponse.error });
            this.showAlert();
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
        await this.refreshTemplateList();
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    refreshGroupList = () => {
        let logArray = {};
        let formArray = {};
        let efciArray = {};
        let graphArray = {};
        let menuArray = {};
        if (this.props.userPermissionReducer.getPermissions && this.props.userPermissionReducer.getPermissions.routes) {
            Object.keys(this.props.userPermissionReducer.getPermissions.routes).map(fc => {
                if (fc.includes("_logs")) {
                    logArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                } else if (fc == "menu") {
                    Object.keys(this.props.userPermissionReducer.getPermissions.routes[fc]).map(
                        menuValue => (menuArray[menuValue] = { view: this.props.userPermissionReducer.getPermissions.routes[fc][menuValue] })
                    );
                } else if (fc.includes("_efcis")) {
                    efciArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                } else if (fc.includes("_charts_and_graphs")) {
                    graphArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                } else {
                    formArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                }
            });

            this.setState({
                logArray,
                formArray,
                efciArray,
                graphArray,
                menuArray,
                groupData: {
                    name: ""
                },
                activeUser: []
            });
        }
    };
    showAddForm = async () => {
        const { history } = this.props;

        addToBreadCrumpData({ key: "add", name: "Add Template", path: "/settings/templates/add" });
        history.push(`/settings/templates/add`);
    };

    handleDeleteGroup = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedGroup: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this group?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteGroupOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteGroupOnConfirm = async () => {
        const { selectedGroup } = this.state;
        const { history } = this.props;
        await this.props.deletePermissions(selectedGroup);
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModal: false,
            selectedGroup: null
        });
        if (this.props.match.params.section === "edit") {
            popBreadCrumpData();
            history.push("/settings/templates");
        }
        await this.refreshTemplateList();
    };

    handleCancel = async () => {
        // ------------------------
        this.setState({
            showErrorBorder: false,
            isCancel: true
        });
        // -----------------------------
        const { history } = this.props;
        popBreadCrumpData();
        history.push("/settings/templates");
        await this.refreshTemplateList();
    };

    showInfoPage = groupId => {
        const { history } = this.props;
        this.setState({
            selectedGroup: groupId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: `/settings/templates/${groupId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/settings/templates/${groupId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
        // history.push(`/buildingType/buildingTypeinfo/${buildingTypeId}/basicdetails`);
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    renderConfirmationLoad = () => {
        const { showConfirmModalLoad, prevTemplate } = this.state;
        if (!showConfirmModalLoad) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Loading current Production data will OVERWRITE any existing data,"}
                        message={"for this entity and for any dependent entities.This action cannot be undone.Are you sure you want to continue?"}
                        onNo={() => this.setState({ showConfirmModalLoad: false, templateId: prevTemplate ? prevTemplate : "" })}
                        onYes={this.handleTemplateChangeConfirm}
                        type={"load"}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalLoad: false, templateId: prevTemplate ? prevTemplate : "" })}
            />
        );
    };

    handleTemplateChangeConfirm = async () => {
        this.setState({
            isLoading: true
        });
        await this.props.getDetailsTemplate(this.state.templateId);
        this.setState({
            showConfirmModalLoad: false,
            isLoading: false
        });
        let logArray = {};
        let formArray = {};
        let efciArray = {};
        let graphArray = {};
        let menuArray = {};
        if (this.props.userPermissionReducer.getPermissions && this.props.userPermissionReducer.getPermissions.routes) {
            Object.keys(this.props.userPermissionReducer.getPermissions.routes).map(fc => {
                if (fc.includes("_logs")) {
                    logArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                } else if (fc == "menu") {
                    Object.keys(this.props.userPermissionReducer.getPermissions.routes[fc]).map(
                        menuValue => (menuArray[menuValue] = { view: this.props.userPermissionReducer.getPermissions.routes[fc][menuValue] })
                    );
                } else if (fc.includes("_efcis")) {
                    efciArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                } else if (fc.includes("_charts") || fc.includes("_graphs")) {
                    graphArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                } else {
                    formArray[fc] = this.props.userPermissionReducer.getPermissions.routes[fc];
                }
            });
        }
        if (
            this.props.userPermissionReducer.getDetailsTemplate &&
            this.props.userPermissionReducer.getDetailsTemplate.group_permissions &&
            this.props.userPermissionReducer.getDetailsTemplate.group_permissions.permissions &&
            this.props.userPermissionReducer.getDetailsTemplate.group_permissions.permissions.length
        ) {
            this.props.userPermissionReducer.getDetailsTemplate.group_permissions.permissions.map((fc, key) => {
                if (fc.name.includes("_logs")) {
                    logArray[fc.name] = fc.actions;
                } else if (fc.name == "menu") {
                    Object.keys(fc.actions).map(menuValue => (menuArray[menuValue] = { view: fc.actions[menuValue] }));
                } else if (fc.name.includes("_efcis")) {
                    efciArray[fc.name] = fc.actions;
                } else if (fc.name.includes("_charts_and_graphs")) {
                    graphArray[fc.name] = fc.actions;
                } else {
                    formArray[fc.name] = fc.actions;
                }
            });
        }

        this.setState({
            logArray,
            formArray,
            efciArray,
            graphArray,
            menuArray
            // groupData: this.props.userPermissionReducer.getDetailsTemplate.group_permissions
        });
    };

    handleTemplateChange = async e => {
        let prevTemplate = this.state.templateId;
        this.setState({
            prevTemplate,
            templateId: e.target.value,
            showConfirmModalLoad: true
        });
    };

    handleConsultancyUser = async e => {
        this.setState({
            consultancyUserId: e.target.value
        });
    };

    handleChange = e => {
        this.setState({
            groupData: {
                ...this.state.groupData,
                name: e.target.value
            }
        });
    };

    handleCheck = (e, permission, action) => {
        const { formArray, logArray, menuArray, fullChecked, graphArray, efciArray, permissionArray } = this.state;
        let tempFormArray = formArray;
        let tempEfciArray = efciArray;
        let tempLogArray = logArray;
        let tempMenuArray = menuArray;
        let tempGraphArray = graphArray;
        let tempFullChecked = fullChecked;
        if (e.target.checked) {
            if (permission.includes("_logs")) {
                tempLogArray[permission][action] = true;
            } else if (permission.includes("_efcis")) {
                tempEfciArray[permission][action] = true;
            } else if (permission.includes("_charts") || permission.includes("_graphs")) {
                tempGraphArray[permission][action] = true;
            } else if (this.state.tabData == "menu") {
                tempMenuArray[permission][action] = true;
            } else {
                tempFormArray[permission][action] = true;
            }
            let isObject = permissionArray.length && permissionArray.find(pa => pa[permission]);
            if (this.state.tabData == "menu") {
                let isMenu = permissionArray["menu"];
                if (isMenu) {
                    permissionArray["menu"][permission] = tempMenuArray[permission]["view"];
                } else {
                    permissionArray["menu"] = { [permission]: tempMenuArray[permission]["view"] };
                }
            } else if (!isObject) {
                if (permission.includes("_logs")) {
                    permissionArray[permission] = tempLogArray[permission];
                } else if (permission.includes("_efcis")) {
                    permissionArray[permission] = tempEfciArray[permission];
                } else if (permission.includes("_charts") || permission.includes("_graphs")) {
                    permissionArray[permission] = tempGraphArray[permission];
                } else {
                    permissionArray[permission] = tempFormArray[permission];
                }
            } else {
                if (permission.includes("_logs")) {
                    permissionArray.length && permissionArray.map(pa => (pa[permission] = tempLogArray[permission]));
                } else if (permission.includes("_efcis")) {
                    permissionArray.length && permissionArray.map(pa => (pa[permission] = tempEfciArray[permission]));
                } else if (permission.includes("_charts") || permission.includes("_graphs")) {
                    permissionArray.length && permissionArray.map(pa => (pa[permission] = tempGraphArray[permission]));
                } else {
                    permissionArray.length && permissionArray.map(pa => (pa[permission] = tempFormArray[permission]));
                }
            }
        } else {
            tempFullChecked[this.state.tabData][action] = false;
            if (permission.includes("_logs")) {
                tempLogArray[permission][action] = false;
            } else if (permission.includes("_efcis")) {
                tempEfciArray[permission][action] = false;
            } else if (this.state.tabData == "form") {
                tempFormArray[permission][action] = false;
            } else if (permission.includes("_charts") || permission.includes("_graphs")) {
                tempGraphArray[permission][action] = false;
            } else if (this.state.tabData == "menu") {
                tempMenuArray[permission][action] = false;
            }

            let isObject = permissionArray.length && permissionArray.find(pa => pa[permission]);
            if (this.state.tabData == "menu") {
                let isMenu = permissionArray["menu"];

                if (isMenu) {
                    permissionArray["menu"][permission] = tempMenuArray[permission]["view"];
                } else {
                    permissionArray["menu"] = { [permission]: tempMenuArray[permission]["view"] };
                }
            } else if (!isObject) {
                if (permission.includes("_logs")) {
                    permissionArray[permission] = tempLogArray[permission];
                } else if (permission.includes("_efcis")) {
                    permissionArray[permission] = tempEfciArray[permission];
                } else if (permission.includes("_charts") || permission.includes("_graphs")) {
                    permissionArray[permission] = tempGraphArray[permission];
                } else {
                    permissionArray[permission] = tempFormArray[permission];
                }
            } else {
                if (permission.includes("_logs")) {
                    permissionArray.length && permissionArray.map(pa => (pa[permission] = tempLogArray[permission]));
                } else if (permission.includes("_efcis")) {
                    permissionArray.length && permissionArray.map(pa => (pa[permission] = tempEfciArray[permission]));
                } else if (permission.includes("_charts") || permission.includes("_graphs")) {
                    permissionArray.length && permissionArray.map(pa => (pa[permission] = tempGraphArray[permission]));
                } else if (this.state.tabData == "menu") {
                    // permissionArray.length && permissionArray.map(pa => pa['menu'] = Object.keys(tempMenuArray).map(tm => permissionArray['menu'][tm] = tempMenuArray[tm]))
                } else {
                    permissionArray.length && permissionArray.map(pa => (pa[permission] = tempFormArray[permission]));
                }
            }
        }
        this.setState({
            formArray: tempFormArray,
            logArray: tempLogArray,
            efciArray: tempEfciArray,
            graphArray: tempGraphArray,
            menuArray: tempMenuArray,
            permissionArray,
            fullChecked: tempFullChecked
        });
    };

    onDrag = (event, user) => {
        event.preventDefault();
        this.setState({
            draggedUser: user
        });
    };

    onDragOver = event => {
        event.preventDefault();
    };

    onDropActiveUsers = event => {
        const { activeUser, activeUserId, draggedUser, availableUsers } = this.state;
        this.setState({
            isLoading: true
        });

        let isElement = activeUser && activeUser.length && activeUser.find(au => au.id == draggedUser.id);
        let tempId = activeUserId;
        tempId.push(draggedUser.id);
        this.setState({
            activeUser: isElement ? activeUser : [...activeUser, draggedUser],
            availableUsers: availableUsers.filter(user => user.id !== draggedUser.id),
            activeUserId: tempId,
            draggedUser: {},
            isLoading: false
        });
    };

    onDoubleClickData = (event, userData, method) => {
        const { activeUser, activeUserId, draggedUser, availableUsers } = this.state;
        if (method == "available") {
            let isElement = activeUser && activeUser.length && activeUser.find(au => au.id == userData.id);
            let tempId = activeUserId;
            tempId.push(userData.id);
            this.setState({
                activeUser: isElement ? activeUser : [...activeUser, userData],
                availableUsers: availableUsers.filter(user => user.id !== userData.id),
                activeUserId: tempId,
                draggedUser: {}
            });
        } else {
            let isElement = availableUsers && availableUsers.length && availableUsers.find(au => au.id == userData.id);
            let tempId = activeUserId;
            tempId = tempId.filter(ti => ti != userData.id);
            this.setState({
                availableUsers: isElement ? availableUsers : [...availableUsers, userData],
                activeUser: activeUser.filter(user => user.id !== userData.id),
                activeUserId: tempId,
                draggedUser: {}
            });
        }
    };

    onDropAvailableUsers = event => {
        const { activeUser, activeUserId, draggedUser, availableUsers } = this.state;
        this.setState({
            isLoading: true
        });

        let isElement = availableUsers && availableUsers.length && availableUsers.find(au => au.id == draggedUser.id);
        let tempId = activeUserId;
        tempId = tempId.filter(ti => ti != draggedUser.id);

        this.setState({
            availableUsers: isElement ? availableUsers : [...availableUsers, draggedUser],
            activeUser: activeUser.filter(user => user.id !== draggedUser.id),
            activeUserId: tempId,
            draggedUser: {},
            isLoading: false
        });
    };

    handleSearch = e => {
        const { activeUser, availableUsers } = this.state;
        let tempUsers =
            this.props.userPermissionReducer.getPermissions &&
            this.props.userPermissionReducer.getPermissions.users &&
            this.props.userPermissionReducer.getPermissions.users.length &&
            this.props.userPermissionReducer.getPermissions.users.filter(
                au =>
                    au.name.toLowerCase().includes(e.target.value && e.target.value.toLowerCase()) ||
                    au.email.toLowerCase().includes(e.target.value && e.target.value.toLowerCase()) ||
                    (au.group_name && au.group_name.toLowerCase().includes(e.target.value && e.target.value.toLowerCase())) ||
                    (au.role_name && au.role_name.toLowerCase().includes(e.target.value && e.target.value.toLowerCase()))
            );
        this.setState({
            searchKeyWord: e.target.value,
            availableUsers: tempUsers
        });
    };

    handleSelectAll = (e, type, name) => {
        const { formArray, logArray, fullChecked, graphArray, menuArray, efciArray, permissionArray } = this.state;
        let temp = permissionArray;
        let tempFormArray = formArray;
        let tempLogArray = logArray;
        let tempEfciArray = efciArray;
        let tempGraphArray = graphArray;
        let tempMenuArray = menuArray;
        let tempFullChecked = fullChecked;
        if (e.target.checked) {
            tempFullChecked[name][type] = true;

            if (name == "form" && tempFormArray) {
                Object.keys(tempFormArray).map(pa =>
                    tempFormArray[pa] && tempFormArray[pa].hasOwnProperty(type) ? (tempFormArray[pa][type] = true) : null
                );
                let isObject = permissionArray.length && permissionArray.find(pa => pa[type]);
                if (!isObject) {
                    Object.keys(tempFormArray).map(pa => (permissionArray[pa] = tempFormArray[pa]));
                } else {
                    permissionArray.length && permissionArray.map(pa => (pa[type] = tempFormArray[type]));
                }
            } else if (name == "log" && tempLogArray) {
                Object.keys(tempLogArray).map(pa =>
                    tempLogArray[pa] && tempLogArray[pa].hasOwnProperty(type) ? (tempLogArray[pa][type] = true) : null
                );
                let isObject = permissionArray.length && permissionArray.find(pa => pa[type]);
                // if (!isObject) {
                //     Object.keys(tempLogArray).map(pa =>
                //         permissionArray[pa] = tempLogArray[pa])
                // }
                // else {
                //     permissionArray.length && permissionArray.map(pa => pa[type] = tempLogArray[type])
                // }
            } else if (name == "efci" && tempEfciArray) {
                Object.keys(tempEfciArray).map(pa =>
                    tempEfciArray[pa] && tempEfciArray[pa].hasOwnProperty(type) ? (tempEfciArray[pa][type] = true) : null
                );
                let isObject = permissionArray.length && permissionArray.find(pa => pa[type]);
                // if (!isObject) {
                //     Object.keys(tempEfciArray).map(pa =>
                //         permissionArray[pa] = tempEfciArray[pa])
                // }
                // else {
                //     permissionArray.length && permissionArray.map(pa => pa[type] = tempEfciArray[type])
                // }
            } else if (name == "menu" && tempMenuArray) {
                Object.keys(tempMenuArray).map(pa =>
                    tempMenuArray[pa] && tempMenuArray[pa].hasOwnProperty(type) ? (tempMenuArray[pa][type] = true) : null
                );
                let isMenu = permissionArray["menu"];

                // if (isMenu) {
                //     Object.keys(tempMenuArray).map(pa =>
                //         permissionArray['menu'][pa] = tempMenuArray[pa]['view'])
                // }
                // else {
                //     Object.keys(tempMenuArray).map(pa =>
                //         permissionArray['menu'] = { [pa]: tempMenuArray[pa]['view'] })
                // }
            } else if (name == "charts_graphs" && tempGraphArray) {
                Object.keys(tempGraphArray).map(pa =>
                    tempGraphArray[pa] && tempGraphArray[pa].hasOwnProperty(type) ? (tempGraphArray[pa][type] = true) : null
                );
                let isMenu = permissionArray["menu"];

                // if (isMenu) {
                //     Object.keys(tempMenuArray).map(pa =>
                //         permissionArray['menu'][pa] = tempMenuArray[pa]['view'])
                // }
                // else {
                //     Object.keys(tempMenuArray).map(pa =>
                //         permissionArray['menu'] = { [pa]: tempMenuArray[pa]['view'] })
                // }
            }
        } else {
            tempFullChecked[name][type] = false;
            if (name == "form" && tempFormArray) {
                Object.keys(tempFormArray).map(pa =>
                    tempFormArray[pa] && tempFormArray[pa].hasOwnProperty(type) ? (tempFormArray[pa][type] = false) : null
                );

                // let isObject = permissionArray.length && permissionArray.find(pa => console.log("formArray:permission", pa[type]))

                // if (!isObject) {
                //     Object.keys(tempFormArray).map(pa =>
                //         permissionArray[pa] = tempFormArray[pa])
                // }
                // else {
                //     permissionArray.length && permissionArray.map(pa => pa[type] = tempFormArray[type])
                // }
            } else if (name == "log" && tempLogArray) {
                Object.keys(tempLogArray).map(pa =>
                    tempLogArray[pa] && tempLogArray[pa].hasOwnProperty(type) ? (tempLogArray[pa][type] = false) : null
                );
                let isObject = permissionArray.length && permissionArray.find(pa => pa[type]);
                // if (!isObject) {
                //     Object.keys(tempLogArray).map(pa =>
                //         permissionArray[pa] = tempLogArray[pa])
                // }
                // else {
                //     permissionArray.length && permissionArray.map(pa => pa[type] = tempLogArray[type])
                // }
            } else if (name == "menu" && tempLogArray) {
                Object.keys(tempMenuArray).map(pa =>
                    tempMenuArray[pa] && tempMenuArray[pa].hasOwnProperty(type) ? (tempMenuArray[pa][type] = false) : null
                );
                let isMenu = permissionArray["menu"];

                // if (isMenu) {
                //     Object.keys(tempMenuArray).map(pa =>
                //         permissionArray['menu'][pa] = tempMenuArray[pa]['view'])
                // }
                // else {
                //     Object.keys(tempMenuArray).map(pa =>
                //         permissionArray['menu'] = { [pa]: tempMenuArray[pa]['view'] })
                // }
            } else if (name == "charts_graphs" && tempGraphArray) {
                Object.keys(tempGraphArray).map(pa =>
                    tempGraphArray[pa] && tempGraphArray[pa].hasOwnProperty(type) ? (tempGraphArray[pa][type] = false) : null
                );

                // if (isMenu) {
                //     Object.keys(tempMenuArray).map(pa =>
                //         permissionArray['menu'][pa] = tempMenuArray[pa]['view'])
                // }
                // else {
                //     Object.keys(tempMenuArray).map(pa =>
                //         permissionArray['menu'] = { [pa]: tempMenuArray[pa]['view'] })
                // }
                // console.log("tempMenuArray:after", tempMenuArray, permissionArray)
            } else if (name == "efci" && tempEfciArray) {
                Object.keys(tempEfciArray).map(pa =>
                    tempEfciArray[pa] && tempEfciArray[pa].hasOwnProperty(type) ? (tempEfciArray[pa][type] = false) : null
                );

                let isObject = permissionArray.length && permissionArray.find(pa => pa[type]);
                // if (!isObject) {
                //     Object.keys(tempEfciArray).map(pa =>
                //         permissionArray[pa] = tempEfciArray[pa])
                // }
                // else {
                //     permissionArray.length && permissionArray.map(pa => pa[type] = tempEfciArray[type])
                // }
            }
        }
        this.setState({
            formArray: tempFormArray,
            logArray: tempLogArray,
            efciArray: tempEfciArray,
            graphArray: tempGraphArray,
            menuArray: tempMenuArray,
            permissionArray,
            fullChecked: tempFullChecked
        });
    };

    handleIsTemplate = e => {
        if (e.target.checked) {
            this.setState({
                groupData: {
                    ...this.state.groupData,
                    is_template: true
                }
            });
        } else {
            this.setState({
                groupData: {
                    ...this.state.groupData,
                    is_template: false
                }
            });
        }
    };

    handleSubmit = async (isEdit = false) => {
        let temp = [];
        const { history } = this.props;
        const { permissionArray, consultancyUserId, groupData, activeUserId, formArray, menuArray, logArray, graphArray, efciArray } = this.state;

        // let tempArray = [];
        // if (formArray) {
        //     formArray && Object.keys(formArray).map(pa => (tempArray[pa] = formArray[pa]));
        // }
        // if (logArray) {
        //     logArray && Object.keys(logArray).map(pa => (tempArray[pa] = logArray[pa]));
        // }
        // if (graphArray) {
        //     graphArray && Object.keys(graphArray).map(pa => (tempArray[pa] = graphArray[pa]));
        // }
        // if (menuArray) {
        //     // let isMenu = tempArray['menu']
        //     // if (isMenu) {
        //     //     Object.keys(menuArray).map(pa =>
        //     //         tempArray['menu'][pa] = tempMenuArray[pa]['view'])
        //     // }
        //     // else {
        //     //     Object.keys(menuArray).map(pa =>
        //     //         tempArray['menu'] = { [pa]: menuArray[pa]['view'] })
        //     // }
        //     Object.keys(menuArray).map(pa => (tempArray["menu"] = { ...tempArray["menu"], [pa]: menuArray[pa]["view"] }));
        // }
        // if (efciArray) {
        //     efciArray && Object.keys(efciArray).map(pa => (tempArray[pa] = efciArray[pa]));
        // }
        // tempArray && Object.keys(tempArray).map(pa => temp.push({ name: pa, actions: tempArray[pa] }));

        const {
            match: {
                params: { section }
            }
        } = this.props;
        // let data = {
        //     name: groupData.name,
        //     is_template: true,
        //     user_ids: activeUserId,
        //     permissions: temp,
        //     id: groupData.id,
        //     consultancy_id: consultancyUserId
        // };

        // if (this.validate()) {
        // if (section == "add") {
        //     await this.props.createPermission(data);
        // } else {
        //     await this.props.updatePermissions(data);
        // }
        // this.setState({
        //     logArray: {},
        //     formArray: {},
        //     efciArray: {},
        //     graphArray: {},
        //     menuArray: {},
        //     groupData: {},
        //     activeUserId: [],
        //     activeUser: [],
        //     templateId: "",
        //     consultancyUserId: "",
        //     prevTemplate: "",
        //     fullChecked: {
        //         form: { view: false, create: false, edit: false, delete: false, export: false },
        //         log: { view: false, restore: false, delete: false },
        //         efci: { view: false, simulation: false, edit: false },
        //         menu: { view: false },
        //         charts_graphs: { view: false, export: false }
        //     },
        //     isEdit: false,
        //     searchKeyWord: null,
        //     tabData: "form"
        // });
        await this.refreshTemplateList();
        popBreadCrumpData();
        history.push("/settings/templates");
        if (isEdit) {
            await this.setState({
                alertMessage:
                    this.props.userPermissionReducer.editUserPermissionsById && this.props.userPermissionReducer.editUserPermissionsById.message
                        ? this.props.userPermissionReducer.editUserPermissionsById.message
                        : "Something went wrong !!"
                // groupData: null
            });
        } else {
            await this.setState({
                alertMessage:
                    this.props.userPermissionReducer.addUserPermissionsData && this.props.userPermissionReducer.addUserPermissionsData.message
                        ? this.props.userPermissionReducer.addUserPermissionsData.message
                        : "Something went wrong !!"
                // groupData: null
            });
        }
        this.showAlert();
        // }
    };

    validate = () => {
        const { permissionArray, groupData, activeUserId, consultancyUserId } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!groupData.name && !groupData.name.trim().length) {
            this.setState({
                errorMessage: "Please enter  name",
                showErrorBorder: true
            });
            return false;
        }
        return true;
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

    handleViewUser = () => {
        this.setState({
            showUsers: !this.state.showUsers
        });
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
            selectedRowId,
            showErrorBorder,
            infoTabsData,
            logData,
            historyPaginationParams,
            historyParams,
            tabData,
            activeUser,
            availableUsers,
            logArray,
            formArray,
            groupData,
            searchKeyWord,
            fullChecked,
            menuArray,
            efciArray,
            graphArray,
            templateId,
            showUsers,
            consultancyUserId
        } = this.state;
        const {
            userPermissionReducer: { getAllTemplate, getPermissions, consultancyUser },
            match: {
                params: { section }
            }
        } = this.props;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {this.renderConfirmationModal()}
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
                {this.renderConfirmationLoad()}
                {section == "add" ? (
                    <TemplateInfo
                        handleTab={this.handleTab}
                        tabData={tabData}
                        getAllTemplate={getAllTemplate}
                        getPermissions={getPermissions}
                        activeUser={activeUser}
                        logArray={logArray}
                        formArray={formArray}
                        groupData={groupData}
                        templateId={templateId}
                        handleTemplateChange={this.handleTemplateChange}
                        handleChange={this.handleChange}
                        handleCheck={this.handleCheck}
                        onDragUser={this.onDrag}
                        efciArray={efciArray}
                        graphArray={graphArray}
                        onDropActiveUsers={this.onDropActiveUsers}
                        onDropAvailableUsers={this.onDropAvailableUsers}
                        fullChecked={fullChecked}
                        onDragOverUser={this.onDragOver}
                        availableUsers={this.state.availableUsers}
                        handleSearch={this.handleSearch}
                        searchKeyWord={searchKeyWord}
                        handleIsTemplate={this.handleIsTemplate}
                        handleSubmit={this.handleSubmit}
                        handleDeleteGroup={this.handleDeleteGroup}
                        handleSelectAll={this.handleSelectAll}
                        showErrorBorder={showErrorBorder}
                        menuArray={menuArray}
                        handleCancel={this.handleCancel}
                        onDoubleClickData={this.onDoubleClickData}
                        showUsers={showUsers}
                        handleViewUser={this.handleViewUser}
                        consultancyUser={consultancyUser}
                        handleConsultancyUser={this.handleConsultancyUser}
                        consultancyUserId={consultancyUserId}
                    />
                ) : section == "edit" ? (
                    <TemplateInfo
                        handleTab={this.handleTab}
                        tabData={tabData}
                        getAllTemplate={getAllTemplate}
                        getPermissions={getPermissions}
                        logArray={logArray}
                        formArray={formArray}
                        groupData={groupData}
                        graphArray={graphArray}
                        efciArray={efciArray}
                        activeUser={activeUser}
                        templateId={templateId}
                        consultancyUser={consultancyUser}
                        handleConsultancyUser={this.handleConsultancyUser}
                        consultancyUserId={consultancyUserId}
                        handleTemplateChange={this.handleTemplateChange}
                        handleChange={this.handleChange}
                        handleCheck={this.handleCheck}
                        onDragUser={this.onDrag}
                        onDropActiveUsers={this.onDropActiveUsers}
                        onDropAvailableUsers={this.onDropAvailableUsers}
                        handleSelectAll={this.handleSelectAll}
                        fullChecked={fullChecked}
                        onDragOverUser={this.onDragOver}
                        availableUsers={this.state.availableUsers}
                        handleSearch={this.handleSearch}
                        searchKeyWord={searchKeyWord}
                        handleIsTemplate={this.handleIsTemplate}
                        handleSubmit={this.handleSubmit}
                        handleDeleteGroup={this.handleDeleteGroup}
                        isEdit={true}
                        showErrorBorder={showErrorBorder}
                        menuArray={menuArray}
                        handleCancel={this.handleCancel}
                        onDoubleClickData={this.onDoubleClickData}
                        showUsers={showUsers}
                        handleViewUser={this.handleViewUser}
                    />
                ) : (
                    <TemplateMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteGroup={this.handleDeleteGroup}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showEditPage}
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
                        exportTableXl={this.exportTableXl}
                    />
                )}
            </LoadingOverlay>
        );
    }
}
const mapStateToProps = state => {
    const { userPermissionReducer, templateReducer } = state;
    return { userPermissionReducer, templateReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...userActions,
        ...commonActions,
        ...templateActions
    })(index)
);
