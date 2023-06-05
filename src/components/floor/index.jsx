import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import qs from "query-string";
import LoadingOverlay from "react-loading-overlay";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import floorActions from "./actions";
import FloorMain from "./components/FloorMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { floorTableData } from "../../config/tableData";
import FloorInfo from "./components/FloorInfo";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrump,
    findPrevPathFromBreadCrumpData,
    popBreadCrumpData,
    checkPermission
} from "../../config/utils";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.floorReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.floorReducer.entityParams.selectedRowId,
        params: this.props.floorReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedFloor: this.props.match.params.id || this.props.floorReducer.entityParams.selectedEntity,
        tableData: {
            keys: floorTableData.keys,
            config: this.props.floorReducer.entityParams.tableConfig || floorTableData.config
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.floorReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.floorReducer.entityParams.filterParams,
        historyPaginationParams: this.props.floorReducer.entityParams.historyPaginationParams,
        historyParams: this.props.floorReducer.entityParams.historyParams,
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
        await this.refreshFloorList();
    };

    refreshFloorList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id: buildingId }
            }
        } = this.props;
        // await this.props.getMenuItems();
        let floorList = [];
        let totalCount = 0;
        await this.props.getFloorsBasedOnBuilding(buildingId, params);
        floorList = this.props.floorReducer.getFloorsBasedOnBuildingResponse
            ? this.props.floorReducer.getFloorsBasedOnBuildingResponse.floors || []
            : [];
        totalCount = this.props.floorReducer.getFloorsBasedOnBuildingResponse
            ? this.props.floorReducer.getFloorsBasedOnBuildingResponse.count || 0
            : 0;

        if (floorList && !floorList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getFloorsBasedOnBuilding(buildingId, this.state.params);
            floorList = this.props.floorReducer.getFloorsBasedOnBuildingResponse
                ? this.props.floorReducer.getFloorsBasedOnBuildingResponse.floors || []
                : [];
            totalCount = this.props.floorReducer.getFloorsBasedOnBuildingResponse
                ? this.props.floorReducer.getFloorsBasedOnBuildingResponse.count || 0
                : 0;
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.floors
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.floors || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.floor_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.floor_logs || {}
                : {};

        if (
            floorList &&
            !floorList.length &&
            this.props.floorReducer.getFloorsBasedOnBuildingResponse &&
            this.props.floorReducer.getFloorsBasedOnBuildingResponse.error
        ) {
            await this.setState({ alertMessage: this.props.floorReducer.getFloorsBasedOnBuildingResponse.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...tableData,
                data: floorList,
                config: this.props.floorReducer.entityParams.tableConfig || tableData.config
            },
            floorList,
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
    getAllDropdowns = async () => {
        let role = localStorage.getItem("role") || "";
        //await this.props.getAllConsultancyUsers();

        if (role === "consultancy_user") {
            await this.props.getAllClientss();
        }
        await this.props.getAllConsultanciesDropdown();
        await this.props.getAllBuildingsDropdown();
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
        await this.refreshFloorList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Floor",
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
        await this.props.updateFloorEntityParams(entityParams);
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
        await this.refreshFloorList();
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
                config: floorTableData.config
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshFloorList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshFloorList();
    };

    getListForCommonFilter = async params => {
        await this.props.getListForCommonFilter(params);
        return (this.props.floorReducer.getListForCommonFilterResponse && this.props.floorReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshFloorList();
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
        await this.refreshFloorList();
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
        await this.refreshFloorList();
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
        await this.refreshFloorList();
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

    showEditPage = floorId => {
        const { history } = this.props;
        const { selectedBuilding } = this.state;
        this.setState({
            selectedFloor: floorId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Floor",
            path: `/floor/edit/${floorId}`
        });
        history.push(`/floor/edit/${floorId}?b_id=${selectedBuilding}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        const { selectedBuilding } = this.state;

        let selectedClient = "";
        let selectedConsultancy = "";

        if (this.props.basicDetails) {
            selectedClient = this.props.basicDetails.client && this.props.basicDetails.client.id;
            selectedConsultancy = this.props.basicDetails.consultancy && this.props.basicDetails.consultancy.id;
        }
        this.setState({
            selectedFloor: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Floor",
            path: `/floor/add`
        });
        history.push(`/floor/add?b_id=${selectedBuilding}&c_id=${selectedClient}&cty_id=${selectedConsultancy}`, {
            client_users: this.props.basicDetails.client_users,
            consultancy_users: this.props.basicDetails.users
        });
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

    handleAddFloor = async (building_id, floor) => {
        const { history } = this.props;
        await this.props.addFloor(building_id, floor);
        if (this.props.floorReducer.addFloorResponse && this.props.floorReducer.addFloorResponse.error) {
            await this.setState({
                alertMessage: this.props.floorReducer.addFloorResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage: this.props.floorReducer.addFloorResponse && this.props.floorReducer.addFloorResponse.message
            });
            this.showAlert();
            await this.refreshFloorList;
            // await this.props.getMenuItems();
            history.push(`/building/buildinginfo/${building_id}/floors`);
        }
    };

    handleUpdateFloor = async (building_id, floor_id, floor) => {
        const { history } = this.props;
        await this.props.updateFloor(building_id, floor_id, floor);
        if (this.props.floorReducer.updateFloorResponse && this.props.floorReducer.updateFloorResponse.error) {
            await this.setState({ alertMessage: this.props.floorReducer.updateFloorResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.floorReducer.updateFloorResponse && this.props.floorReducer.updateFloorResponse.message) ||
                    "Floor updated successfully"
            });
            this.showAlert();
            await this.refreshFloorList();
            // await this.props.getMenuItems();
            if (building_id) {
                history.push(`/building/buildinginfo/${building_id}/floors`);
            }
            // else{
            //     history.push(findPrevPathFromBreadCrump() || "/floors");
            // }
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

    handleDeleteFloor = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedFloor: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Floor?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteFloorOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteFloorOnConfirm = async () => {
        const { selectedBuilding, selectedFloor } = this.state;
        const { history } = this.props;
        await this.props.deleteFloor(selectedBuilding, selectedFloor);
        if (this.props.floorReducer.deleteFloorResponse && this.props.floorReducer.deleteFloorResponse.error) {
            await this.setState({ alertMessage: this.props.floorReducer.deleteFloorResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshFloorList();
            // await this.props.getMenuItems();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/floor");
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
        await this.refreshFloorList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Floor",
                    path: `/floor/floorinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/floor/floorinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async floorId => {
        const { selectedBuilding } = this.state;
        await this.props.getFloorById(selectedBuilding, floorId);
        return this.props.floorReducer.getFloorByIdResponse;
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        await this.setState({ tableLoading: true });
        await this.props.exportFloorsByBuilding(entityId);
        this.setState({ tableLoading: false });
        if (this.props.floorReducer.floorExportResponse && this.props.floorReducer.floorExportResponse.error) {
            await this.setState({ alertMessage: this.props.floorReducer.floorExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllFloorLogs(buildingId, historyParams);
        const {
            floorReducer: {
                getAllFloorLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.floorReducer.getAllFloorLogsResponse && this.props.floorReducer.getAllFloorLogsResponse.error) {
            await this.setState({ alertMessage: this.props.floorReducer.getAllFloorLogsResponse.error });
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
        await this.props.deleteFloorLog(selectedLog);
        if (this.props.floorReducer.deleteFloorLogResponse && this.props.floorReducer.deleteFloorLogResponse.error) {
            await this.setState({ alertMessage: this.props.floorReducer.deleteFloorLogResponse.error });
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
        await this.props.restoreFloorLog(id);
        if (this.props.floorReducer.restoreFloorLogResponse && this.props.floorReducer.restoreFloorLogResponse.error) {
            await this.setState({ alertMessage: this.props.floorReducer.restoreFloorLogResponse.error });
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
            selectedFloor,
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
                        selectedFloor={selectedFloor}
                        handleAddFloor={this.handleAddFloor}
                        handleUpdateFloor={this.handleUpdateFloor}
                        getDataById={this.getDataById}
                        getAllDropdowns={this.getAllDropdowns}
                    />
                ) : section === "floorinfo" ? (
                    <FloorInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteFloor}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreFloorLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={checkPermission("forms", "floors", "edit")}
                        hasDelete={checkPermission("forms", "floors", "delete")}
                        hasLogView={checkPermission("logs", "floors", "view")}
                        hasLogDelete={checkPermission("logs", "floors", "delete")}
                        hasLogRestore={checkPermission("logs", "floors", "restore")}
                        hasInfoPage={checkPermission("forms", "floors", "view")}
                        entity="floors"
                    />
                ) : (
                    <FloorMain
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
                        handleDeleteFloor={this.handleDeleteFloor}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterFloor={this.getListForCommonFilter}
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
                        hasExport={checkPermission("forms", "floors", "export")}
                        showAddButton={checkPermission("forms", "floors", "create")}
                        hasEdit={checkPermission("forms", "floors", "edit")}
                        hasDelete={checkPermission("forms", "floors", "delete")}
                        hasInfoPage={checkPermission("forms", "floors", "view")}
                        entity="floors"
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
    const { projectReducer, commonReducer, floorReducer } = state;
    return { projectReducer, commonReducer, floorReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...floorActions,
        ...CommonActions
    })(index)
);
