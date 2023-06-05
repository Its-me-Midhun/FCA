import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import AssignClientUserModal from "./components/AssignClientUserModal";
import AssignConsultancyUserModal from "./components/AssignConsultancyUserModal";
import buildingTypeActions from "./actions";
import siteActions from "../site/actions";
import buildingActions from "../building/actions";
import _ from "lodash";
import BuildingTypeMain from "./components/BuildingTypeMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { buildingTypeTableData } from "../../config/tableData";
import BuildingTypeInfo from "./components/BuildingTypeInfo";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrump,
    findPrevPathFromBreadCrumpData,
    popBreadCrumpData,
    checkPermission
} from "../../config/utils";
import MergeOrReplaceModalSelection from "./components/MergeOrReplaceModalSelection";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        buildingTypeList: [],
        paginationParams: this.props.buildingTypeReducer.entityParams.paginationParams,
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
        selectedRowId: this.props.buildingTypeReducer.entityParams.selectedRowId,
        params: this.props.buildingTypeReducer.entityParams.params,
        selectedClient: {},
        selectedBuildingType: this.props.match.params.id || this.props.buildingTypeReducer.entityParams.selectedEntity,
        tableData: {
            keys: buildingTypeTableData.keys,
            config: this.props.buildingTypeReducer.entityParams.tableConfig || _.cloneDeep(buildingTypeTableData.config)
        },
        alertMessage: "",
        wildCardFilterParams: this.props.buildingTypeReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.buildingTypeReducer.entityParams.filterParams,
        historyPaginationParams: this.props.buildingTypeReducer.entityParams.historyPaginationParams,
        historyParams: this.props.buildingTypeReducer.entityParams.historyParams,
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
        await this.refreshBuildingTypeList();
    };

    refreshBuildingTypeList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        // await this.props.getAllClients();
        // await this.props.getMenuItems();

        // using same componet for buildingType mangement and buildingType listing in info page
        let buildingTypeList = [];
        let totalCount = 0;

        await this.props.getAllBuildingTypes(params);
        buildingTypeList = this.props.buildingTypeReducer.getAllBuildingTypesResponse
            ? this.props.buildingTypeReducer.getAllBuildingTypesResponse.building_types || []
            : [];
        totalCount = this.props.buildingTypeReducer.getAllBuildingTypesResponse
            ? this.props.buildingTypeReducer.getAllBuildingTypesResponse.count || 0
            : 0;

        const {
            buildingTypeReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            }
        } = this.props;

        // go to previous page is the last record of the current page is deleted
        if (buildingTypeList && !buildingTypeList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getAllBuildingTypes(this.state.params);
            buildingTypeList = this.props.buildingTypeReducer.getAllBuildingTypesResponse
                ? this.props.buildingTypeReducer.getAllBuildingTypesResponse.building_types || []
                : [];
            totalCount = this.props.buildingTypeReducer.getAllBuildingTypesResponse
                ? this.props.buildingTypeReducer.getAllBuildingTypesResponse.count || 0
                : 0;
        }

        if (
            buildingTypeList &&
            !buildingTypeList.length &&
            this.props.buildingTypeReducer.getAllBuildingTypesResponse &&
            this.props.buildingTypeReducer.getAllBuildingTypesResponse.error
        ) {
            await this.setState({ alertMessage: this.props.buildingTypeReducer.getAllBuildingTypesResponse.error });
            this.showAlert();
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.main_building_types
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.main_building_types || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.main_building_type_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.main_building_type_logs || {}
                : {};
        this.setState({
            tableData: {
                ...tableData,
                data: buildingTypeList,
                config: this.props.buildingTypeReducer.entityParams.tableConfig || tableData.config
            },
            buildingTypeList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
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
        await this.refreshBuildingTypeList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Building_type",
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
                config:_.cloneDeep(buildingTypeTableData.config)
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
        return (
            (this.props.buildingTypeReducer.getListForCommonFilterResponse && this.props.buildingTypeReducer.getListForCommonFilterResponse.list) ||
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

    showEditPage = buildingTypeId => {
        this.setState({
            selectedBuildingType: buildingTypeId
        });
        this.toggleShowFormModal();
    };

    showAddForm = () => {
        this.setState({
            selectedBuildingType: null
        });
        this.toggleShowFormModal();
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
            buildingTypeReducer: {
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
            if (!_.isEqual(config[key]?.isVisible, buildingTypeTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    handleAddBuildingType = async buildingType => {
        await this.props.addBuildingType(buildingType);
        if (this.props.buildingTypeReducer.addBuildingTypeResponse && this.props.buildingTypeReducer.addBuildingTypeResponse.error) {
            this.toggleShowFormModal();
            await this.setState({
                alertMessage: this.props.buildingTypeReducer.addBuildingTypeResponse.error,
                selectedBuildingType: null
            });
            this.showAlert();
        } else {
            await this.refreshBuildingTypeList();
            // await this.props.getMenuItems();
            this.toggleShowFormModal();
            await this.setState({
                alertMessage:
                    this.props.buildingTypeReducer.addBuildingTypeResponse && this.props.buildingTypeReducer.addBuildingTypeResponse.message,
                selectedBuildingType: null
            });
            this.showAlert();
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
                        handleAddBuildingType={this.handleAddBuildingType}
                        handleUpdateBuildingType={this.handleUpdateBuildingType}
                        getSiteListBasedOnRegion={this.getSiteListBasedOnRegion}
                        getRegionListBasedOnClient={this.getRegionListBasedOnClient}
                        getDataById={this.getDataById}
                        getAllBuildingTypeDropdowns={this.getAllBuildingTypeDropdowns}
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

    handleUpdateBuildingType = async (buildingType, isInfo, id) => {
        const { selectedBuildingType } = this.state;
        if (!isInfo) {
            this.toggleShowFormModal();
        }
        await this.props.updateBuildingType(buildingType, selectedBuildingType || id);
        if (this.props.buildingTypeReducer.updateBuildingTypeResponse && this.props.buildingTypeReducer.updateBuildingTypeResponse.error) {
            await this.setState({
                alertMessage: this.props.buildingTypeReducer.updateBuildingTypeResponse.error,
                selectedBuildingType: null
            });
            if (!isInfo) {
                this.toggleShowFormModal();
            }
            this.showAlert();
        } else {
            await this.refreshBuildingTypeList();
            // await this.props.getMenuItems();
            // if (!isInfo) {
            //     this.toggleShowFormModal();
            // }
            await this.setState({
                alertMessage:
                    this.props.buildingTypeReducer.updateBuildingTypeResponse && this.props.buildingTypeReducer.updateBuildingTypeResponse.message,
                selectedBuildingType: null
            });
            this.showAlert();
            if (this.props.match.params.tab === "basicdetails") {
                this.props.history.push(`/buildingType/buildingTypeinfo/${this.props.match.params.id}/basicdetails`);
            }
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
                        heading={"Do you want to delete this Building Type?"}
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
        await this.props.deleteBuildingType(selectedBuildingType);
        if (this.props.buildingTypeReducer.deleteBuildingTypeResponse && this.props.buildingTypeReducer.deleteBuildingTypeResponse.error) {
            await this.setState({ alertMessage: this.props.buildingTypeReducer.deleteBuildingTypeResponse.error });
            this.setState({
                showConfirmModal: false
                // selectedProject: null
            });
            this.showAlert();
        } else {
            await this.refreshBuildingTypeList();
            // await this.props.getMenuItems();
            this.setState({
                showConfirmModal: false,
                selectedBuildingType: null
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

    showInfoPage = buildingTypeId => {
        const { history } = this.props;
        this.setState({
            selectedBuildingType: buildingTypeId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Building Type",
                    path: `/buildingType/buildingTypeinfo/${buildingTypeId}/basicdetails`
                },
                {
                    key: "color_code",
                    name: "FCI Color Codes",
                    path: `/buildingType/buildingTypeinfo/${buildingTypeId}/color_code`
                }
            ]
        });
        let tabKeyList = ["basicdetails", "color_code"];
        history.push(
            `/buildingType/buildingTypeinfo/${buildingTypeId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
        // history.push(`/buildingType/buildingTypeinfo/${buildingTypeId}/basicdetails`);
    };

    getDataById = async regionId => {
        await this.props.getBuildingTypeById(regionId);
        return this.props.buildingTypeReducer.getBuildingTypeByIdResponse;
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
        return this.props.buildingTypeReducer.getAllImagesResponse.images;
    };

    getLogData = async buildingId => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllBuildingTypeLogs(buildingId, historyParams);
        const {
            buildingTypeReducer: {
                getAllBuildingTypeLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.buildingTypeReducer.getAllBuildingTypeLogsResponse && this.props.buildingTypeReducer.getAllBuildingTypeLogsResponse.error) {
            await this.setState({ alertMessage: this.props.buildingTypeReducer.getAllBuildingTypeLogsResponse.error });
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
        await this.props.deleteBuildingTypeLog(selectedLog);
        if (this.props.buildingTypeReducer.deleteBuildingTypeLogResponse && this.props.buildingTypeReducer.deleteBuildingTypeLogResponse.error) {
            await this.setState({ alertMessage: this.props.buildingTypeReducer.deleteBuildingTypeLogResponse.error });
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
        const { selectedLog } = this.state;
        await this.props.restoreBuildingTypeLog(id);
        if (this.props.buildingTypeReducer.restoreBuildingTypeLogResponse && this.props.buildingTypeReducer.restoreBuildingTypeLogResponse.error) {
            await this.setState({ alertMessage: this.props.buildingTypeReducer.restoreBuildingTypeLogResponse.error });
            this.showAlert();
        }
        this.refreshBuildingTypeList();
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

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section, tab }
            }
        } = this.props;
        const {
            location: { search }
        } = this.props;
        // const query = qs.parse(search);
        await this.setState({ tableLoading: true });
        await this.props.exportBuildingType({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        }); // sidemenu
        await this.setState({ tableLoading: false });
        if (this.props.buildingTypeReducer.buildingTypeExportResponse && this.props.buildingTypeReducer.buildingTypeExportResponse.error) {
            await this.setState({ alertMessage: this.props.buildingTypeReducer.buildingTypeExportResponse.error });
            this.showAlert();
        }
    };

    getAllBuildingTypeDropdowns = async param => {
        await this.props.getAllClients(param);
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
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "buildingTypeinfo" ? (
                    <BuildingTypeInfo
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
                        getAllBuildingTypeDropdowns={this.getAllBuildingTypeDropdowns}
                        hasEdit={checkPermission("forms", "main_building_types", "edit")}
                        hasDelete={checkPermission("forms", "main_building_types", "delete")}
                        hasLogView={checkPermission("logs", "main_building_types", "view")}
                        hasLogDelete={checkPermission("logs", "main_building_types", "delete")}
                        hasLogRestore={checkPermission("logs", "main_building_types", "restore")}
                        hasInfoPage={checkPermission("forms", "main_building_types", "view")}
                        // handleDeleteItem={this.handleDeleteFloor}
                        entity="main_building_types"
                    />
                ) : (
                    <BuildingTypeMain
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
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
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
                        exportTableXl={this.exportTableXl}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasExport={checkPermission("forms", "main_building_types", "export")}
                        showAddButton={checkPermission("forms", "main_building_types", "create")}
                        hasEdit={checkPermission("forms", "main_building_types", "edit")}
                        hasDelete={checkPermission("forms", "main_building_types", "delete")}
                        hasInfoPage={checkPermission("forms", "main_building_types", "view")}
                        entity="main_building_types"
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
    const { buildingTypeReducer, siteReducer, buildingReducer, commonReducer } = state;
    return { buildingTypeReducer, siteReducer, buildingReducer, commonReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...buildingTypeActions,
        ...siteActions,
        ...buildingActions,
        ...CommonActions
    })(index)
);
