import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import buildingTypeActions from "../client/actions";
import _ from "lodash";
import ClientMain from "./components/ClientMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { manageLandingclientTableData } from "../../config/tableData";
import {
    findPrevPathFromBreadCrumpData,
    popBreadCrumpData,
    addToBreadCrumpData,
    findPrevPathFromBreadCrump,
    checkPermission
} from "../../config/utils";

import "../../assets/css/style-management.css";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        clientList: [],
        paginationParams: this.props.clientReducer.entityParams.paginationParams,
        currentViewAllUsers: null,
        currentActions: null,
        showViewModal: false,
        showFormModal: false,
        showWildCardFilter: false,
        buildingTypeData: {},
        selectedRowId: this.props.clientReducer.entityParams.selectedRowId,
        params: this.props.clientReducer.entityParams.params,
        selectedClient: {},
        selectedBuildingType: this.props.match.params.id || this.props.clientReducer.entityParams.selectedEntity,
        tableData: {
            keys: manageLandingclientTableData.keys,
            config: this.props.clientReducer.entityParams.tableConfig || _.cloneDeep(manageLandingclientTableData.config)
        },
        alertMessage: "",
        wildCardFilterParams: this.props.clientReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.clientReducer.entityParams.filterParams,
        historyPaginationParams: this.props.clientReducer.entityParams.historyPaginationParams,
        historyParams: this.props.clientReducer.entityParams.historyParams,
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
        const { params, paginationParams, tableData } = this.state;
        // using same componet for buildingType mangement and buildingType listing in info page
        let clientList = [];
        let totalCount = 0;
        // await this.props.getMenuItems();

        await this.props.getClients(params);
        clientList = this.props.clientReducer.getClientsResponse ? this.props.clientReducer.getClientsResponse.clients || [] : [];
        totalCount = this.props.clientReducer.getClientsResponse ? this.props.clientReducer.getClientsResponse.count || 0 : 0;

        // go to previous page is the last record of the current page is deleted
        if (clientList && !clientList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getClients(this.state.params);
            clientList = this.props.clientReducer.getClientsResponse ? this.props.clientReducer.getClientsResponse.clients || [] : [];
            totalCount = this.props.clientReducer.getClientsResponse ? this.props.clientReducer.getClientsResponse.count || 0 : 0;
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.clients
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.clients || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.client_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.client_logs || {}
                : {};
        if (clientList && !clientList.length && this.props.clientReducer.getClientsResponse && this.props.clientReducer.getClientsResponse.error) {
            await this.setState({ alertMessage: this.props.clientReducer.getClientsResponse.error });
            this.showAlert();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: clientList,
                config: this.props.clientReducer.entityParams.tableConfig || tableData.config
            },
            clientList,
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
            entity: "Client",
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
                config: _.cloneDeep(manageLandingclientTableData.config)
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
        return (this.props.clientReducer.getListForCommonFilterResponse && this.props.clientReducer.getListForCommonFilterResponse.list) || [];
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

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedBuildingType: null
        });
        addToBreadCrumpData({ key: "add", name: "Add Client", path: "/client/add" });
        history.push("/client/add");
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    getSiteListBasedOnRegion = async regionId => {
        await this.props.getSitesBasedOnRegion(regionId);
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
            clientReducer: {
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

    handleAssignConsultancyUsersModal = async buildingTypeData => {
        await this.setState({
            showAssignConsultancyUsers: true
        });
    };

    handleAssignClientUsersModal = async buildingTypeData => {
        await this.setState({
            showAssignClientUsers: true
        });
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, manageLandingclientTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    handleAddBuildingType = async client => {
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.addClient(client);
        if (this.props.clientReducer.addClientResponse && this.props.clientReducer.addClientResponse.error) {
            await this.setState({
                alertMessage: this.props.clientReducer.addClientResponse.error
            });
            this.showAlert();
            this.setState({
                isLoading: false
            });
        } else {
            this.setState({
                isLoading: true
            });

            await this.setState({
                alertMessage: this.props.clientReducer.addClientResponse && this.props.clientReducer.addClientResponse.message,
                selectedBuildingType: null
            });
            await this.refreshBuildingTypeList();
            this.setState({
                isLoading: false
            });
            this.showAlert();
            history.push(findPrevPathFromBreadCrump() || "/client");
        }
        this.setState({
            isLoading: false
        });
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
                        selectedClient={this.state.selectedBuildingType}
                        refreshBuildingTypeList={this.refreshBuildingTypeList}
                        handleAddClient={this.handleAddBuildingType}
                        handleUpdateClient={this.handleUpdateBuildingType}
                        getSiteListBasedOnRegion={this.getSiteListBasedOnRegion}
                        getRegionListBasedOnClient={this.getRegionListBasedOnClient}
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

    handleUpdateBuildingType = async (buildingType, selectedImage, isMap = false) => {
        const { selectedBuildingType } = this.state;
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.updateClient(buildingType, selectedBuildingType, selectedImage);
        if (this.props.clientReducer.updateClientResponse && this.props.clientReducer.updateClientResponse.error) {
            await this.setState({ alertMessage: this.props.clientReducer.updateClientResponse.error });
            this.showAlert();
            this.setState({
                isLoading: false
            });
        } else {
            this.setState({
                isLoading: true
            });
            await this.setState({
                alertMessage: this.props.clientReducer.updateClientResponse && this.props.clientReducer.updateClientResponse.message,
                selectedBuildingType: null
            });
            await this.refreshBuildingTypeList();
            this.setState({
                isLoading: false
            });
            this.showAlert();
            history.push(findPrevPathFromBreadCrump() || "/client");
        }
    };

    handleDeleteBuildingType = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedBuildingType: id
        });
    };

    showUploadDataModal = async id => {
        await this.setState({
            showUploadDataModal: true,
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
                        heading={"Do you want to delete this Client?"}
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
        this.setState({
            isLoading: true,
            showConfirmModal: false
        });
        await this.props.deleteClient(selectedBuildingType);
        if (this.props.clientReducer.deleteClientResponse && this.props.clientReducer.deleteClientResponse.error) {
            await this.setState({ alertMessage: this.props.clientReducer.deleteClientResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuildingType: null
            });
            this.setState({
                isLoading: false
            });
            this.showAlert();
        } else {
            this.setState({
                isLoading: true
            });
            // await this.props.getMenuItems();
            this.setState({
                showConfirmModal: false,
                selectedBuildingType: null
            });
            await this.refreshBuildingTypeList();
            this.setState({
                isLoading: false
            });
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

    uploadImages = async (imageData = {}) => {
        const { selectedBuildingType } = this.state;
        await this.props.uploadBuildingTypeImage(imageData, selectedBuildingType || this.props.match.params.id);
        await this.getAllImageList(selectedBuildingType);
        return true;
    };

    deleteImages = async imageId => {
        const { selectedBuildingType } = this.state;
        await this.props.deleteBuildingTypeImage(imageId);
        await this.getAllImageList(selectedBuildingType);
        return true;
    };

    getAllImageList = async regionId => {
        await this.props.getAllBuildingTypeImages(regionId);
        return this.props.clientReducer.getAllImagesResponse.images;
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllClientLogs(buildingId, historyParams);
        const {
            clientReducer: {
                getAllClientLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.clientReducer.getAllClientLogsResponse && this.props.clientReducer.getAllClientLogsResponse.error) {
            await this.setState({ alertMessage: this.props.clientReducer.getAllClientLogsResponse.error });
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
        await this.props.deleteClientLog(selectedLog);
        if (this.props.clientReducer.deleteClientLogResponse && this.props.clientReducer.deleteClientLogResponse.error) {
            await this.setState({ alertMessage: this.props.clientReducer.deleteClientLogResponse.error });
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
        await this.props.restoreClientLog(id);
        if (this.props.clientReducer.restoreClientLogResponse && this.props.clientReducer.restoreClientLogResponse.error) {
            await this.setState({ alertMessage: this.props.clientReducer.restoreClientLogResponse.error });
            this.showAlert();
        }
        this.refreshBuildingTypeList();
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        this.setState({ tableLoading: true });
        section === "projectinfo"
            ? await this.props.exportRegionByProject(entityId, {
                  project_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              })
            : await this.props.exportClient({
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              });
        this.setState({
            tableLoading: false
        });
        if (this.props.clientReducer.clientExportResponse && this.props.clientReducer.clientExportResponse.error) {
            await this.setState({ alertMessage: this.props.clientReducer.clientExportResponse.error });
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

    // -----------------------------------------------------------------------------------//

    showEditPage = clientId => {
        const { history } = this.props;
        addToBreadCrumpData({ key: "edit", name: "Edit Client", path: `/client/edit/${clientId}` });
        history.push(`/settings/manageLandingPage/edit/${clientId}`);
    };

    showInfoPage = clientId => {
        const { history } = this.props;
        addToBreadCrumpData({ key: "edit", name: "Edit Client", path: `/client/edit/${clientId}` });
        history.push(`/settings/manageLandingPage/edit/${clientId}`);
    };

    getLandingPageData = async id => {
        this.setState({
            isLoading: true
        });
        await this.props.getLandingPageData(id);
        const { error, message, success } = this.props.clientReducer.getLandingPageDataResponse;
        if (!success) {
            this.setState({ isLoading: false, alertMessage: error || "Something went wrong !" }, () => this.showAlert());
        } else {
            this.setState({ isLoading: false });
        }
        return this.props.clientReducer.getLandingPageDataResponse;
    };
    addLandingPageData = async (params, file_change) => {
        this.setState({
            isLoading: true
        });
        const { history } = this.props;
        await this.props.addLandingPageData(params, file_change);
        const { error, message, success } = this.props.clientReducer.addLandingPageDataResponse;
        if (!success) {
            this.setState({ isLoading: false, alertMessage: error || "Something went wrong !" }, () => this.showAlert());
        } else {
            this.setState({ isLoading: false, alertMessage: message }, () => this.showAlert());
            history.push(`/settings/manageLandingPage`);
        }
        return this.props.clientReducer.addLandingPageDataResponse;
    };
    updateLandingPageData = async (params, file_change) => {
        this.setState({
            isLoading: true
        });
        const { history } = this.props;
        await this.props.updateLandingPageData(params, file_change);
        const { error, message, success } = this.props.clientReducer.updateLandingPageDataResponse;
        if (!success) {
            this.setState({ isLoading: false, alertMessage: error || "Something went wrong !" }, () => this.showAlert());
        } else {
            this.setState({ isLoading: false, alertMessage: message }, () => this.showAlert());
            history.push(`/settings/manageLandingPage`);
        }
        return this.props.clientReducer.updateLandingPageDataResponse;
    };

    render() {
        const {
            history,
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
            permissions,
            logPermission
        } = this.state;
        const {
            match: {
                params: { section }
            }
        } = this.props;

        return (
            <React.Fragment>
                <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                    <div className="dtl-sec dshb">
                        {section === "edit" ? (
                            <Form
                                getLandingPageData={this.getLandingPageData}
                                addLandingPageData={this.addLandingPageData}
                                selectedClient={this.state.selectedBuildingType}
                                updateLandingPageData={this.updateLandingPageData}
                                history={history}
                            />
                        ) : (
                            <ClientMain
                                showWildCardFilter={showWildCardFilter}
                                paginationParams={paginationParams}
                                currentViewAllUsers={currentViewAllUsers}
                                showViewModal={this.showViewModal}
                                isColunmVisibleChanged={this.isColunmVisibleChanged}
                                tableData={tableData}
                                handleGlobalSearch={this.handleGlobalSearch}
                                toggleWildCardFilter={this.toggleWildCardFilter}
                                updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                                handleDeleteBuildingType={this.handleDeleteBuildingType}
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
                                entity="clients"
                                hasExport={false}
                                showAddButton={false}
                                hasEdit={checkPermission("forms", "landing_pages", "edit")}
                                hasDelete={false}
                                hasInfoPage={checkPermission("forms", "landing_pages", "edit")}
                            />
                        )}
                    </div>
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { clientReducer, commonReducer } = state;
    return { clientReducer, commonReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...buildingTypeActions,
        ...CommonActions
    })(index)
);
