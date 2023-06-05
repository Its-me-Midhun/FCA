import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import qs from "query-string";
import LoadingOverlay from "react-loading-overlay";
import TradeSettingsInfo from "../project/components/settings/settingsInfo";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import floorActions from "./actions";
import FloorMain from "./components/FloorMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { departmentsettingsTableData } from "../../config/tableData";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, checkPermission, popBreadCrumpOnPageClose } from "../../config/utils";
import history from "../../config/history";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.departmentReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.departmentReducer.entityParams.selectedRowId,
        params: this.props.departmentReducer.entityParams.params,
        selectedProject: this.props.match.params.id || null,
        selectedSetting: this.props.match.params.subId || this.props.departmentReducer.entityParams.selectedEntity,
        tableData: {
            keys: departmentsettingsTableData.keys,
            config: this.props.departmentReducer.entityParams.tableConfig || _.cloneDeep(departmentsettingsTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.departmentReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.departmentReducer.entityParams.filterParams,
        showFormModal: false,
        historyPaginationParams: this.props.departmentReducer.entityParams.historyPaginationParams,
        historyParams: this.props.departmentReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        selectedMainItem: "",
        permissions: {},
        logPermission: {}
    };

    componentDidMount = async () => {
        await this.refreshdepartmentList();
    };

    refreshdepartmentList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id: projectId }
            }
        } = this.props;
        let departmentList = [];
        let totalCount = 0;
        await this.props.getDepartmentSettingsData(params, projectId);
        departmentList = this.props.departmentReducer.getDepartmentSettingsDataResponse
            ? this.props.departmentReducer.getDepartmentSettingsDataResponse.departments || []
            : [];
        totalCount = this.props.departmentReducer.getDepartmentSettingsDataResponse
            ? this.props.departmentReducer.getDepartmentSettingsDataResponse.count || 0
            : 0;

        if (departmentList && !departmentList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getDepartmentSettingsData(this.state.params, projectId);
            departmentList = this.props.departmentReducer.getDepartmentSettingsDataResponse
                ? this.props.departmentReducer.getDepartmentSettingsDataResponse.departments || []
                : [];
            totalCount = this.props.departmentReducer.getDepartmentSettingsDataResponse
                ? this.props.departmentReducer.getDepartmentSettingsDataResponse.count || 0
                : 0;
        }
        if (
            departmentList &&
            !departmentList.length &&
            this.props.departmentReducer.getDepartmentSettingsDataResponse &&
            this.props.departmentReducer.getDepartmentSettingsDataResponse.error
        ) {
            await this.setState({ alertMessage: this.props.departmentReducer.getDepartmentSettingsDataResponse.error });
            this.showAlert();
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.departments
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.departments || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.department_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.department_logs || {}
                : {};
        this.setState({
            tableData: {
                ...tableData,
                data: departmentList,
                config: this.props.departmentReducer.entityParams.tableConfig || tableData.config
            },
            departmentList,
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
        await this.refreshdepartmentList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Trade",
            selectedEntity: this.state.selectedSetting,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateDepartmentEntityParams(entityParams);
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
        await this.refreshdepartmentList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshdepartmentList();
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
                config: _.cloneDeep(departmentsettingsTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });

        this.updateEntityParams();
        await this.refreshdepartmentList();
    };
    getListForCommonFilter = async params => {
        await this.props.getListForCommonFilter(params, this.props.match.params.id);
        return (
            (this.props.departmentReducer.getListForCommonFilterResponse && this.props.departmentReducer.getListForCommonFilterResponse.list) || []
        );
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, departmentsettingsTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.refreshdepartmentList();
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
        await this.refreshdepartmentList();
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
        await this.refreshdepartmentList();
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
        await this.refreshdepartmentList();
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
        this.setState({
            selectedSetting: floorId
        });
        this.toggleShowFormModal();
    };

    showAddForm = () => {
        this.setState({
            selectedSetting: null
        });
        this.toggleShowFormModal();
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
                        selectedProject={this.state.selectedSetting}
                        addNewData={this.handleAddTrade}
                        updateTradeData={this.handleUpdateFloor}
                        selectedTrade={this.state.selectedSetting}
                        getCategoryByOne={this.getDataById}
                        addNewCategoryData={this.addNewCategory}
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
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

    handleAddTrade = async trade => {
        const projectId = this.props.match.params.id;
        await this.props.addDepartment(projectId, trade);
        if (this.props.departmentReducer.addDepartmentResponse && this.props.departmentReducer.addDepartmentResponse.error) {
            this.toggleShowFormModal();
            await this.setState({
                alertMessage: this.props.departmentReducer.addDepartmentResponse.error,
                selectedSetting: null
            });
            this.showAlert();
        } else {
            await this.setState({
                alertMessage: this.props.departmentReducer.addDepartmentResponse && this.props.departmentReducer.addDepartmentResponse.message,
                selectedSetting: null
            });
            this.toggleShowFormModal();
            this.showAlert();
            await this.refreshdepartmentList();
            // await this.props.getMenuItems();
        }
    };

    handleUpdateFloor = async (trade, selectedone) => {
        const { selectedProject, selectedSetting } = this.state;
        await this.props.updateDepartment(selectedProject, selectedone || selectedSetting, trade);
        if (this.props.departmentReducer.updateDepartmentResponse && this.props.departmentReducer.updateDepartmentResponse.error) {
            await this.setState({
                alertMessage: this.props.departmentReducer.updateDepartmentResponse.error,
                selectedSetting: null
            });
            if (!selectedone) {
                this.toggleShowFormModal();
            }
            this.showAlert();
        } else {
            await this.refreshdepartmentList();
            await this.setState({
                alertMessage: this.props.departmentReducer.updateDepartmentResponse && this.props.departmentReducer.updateDepartmentResponse.message,
                selectedSetting: null
            });
            if (!selectedone) {
                this.toggleShowFormModal();
            }
            this.showAlert();
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
            selectedSetting: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Department?"}
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
        const { selectedProject, selectedSetting } = this.state;
        const { history } = this.props;
        await this.props.deleteDepartment(selectedProject, selectedSetting);
        if (this.props.departmentReducer.deleteDepartmentResponse && this.props.departmentReducer.deleteDepartmentResponse.error) {
            await this.setState({ alertMessage: this.props.departmentReducer.deleteDepartmentResponse.error });
            this.setState({
                showConfirmModal: false
                // selectedProject: null
            });
            this.showAlert();
        } else {
            await this.refreshdepartmentList();
            // await this.props.getMenuItems();
            this.setState({
                showConfirmModal: false,
                selectedProject: null
            });
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
        await this.refreshdepartmentList();
    };

    showInfoPage = (id, projectId, rowData) => {
        const { history } = this.props;
        const {
            match: { url }
        } = this.props;
        this.setState({
            selectedSetting: id
        });
        addToBreadCrumpData({
            key: "Name",
            name: rowData?.name,
            path: `${url}/info/${id}/basicdetails`,
            isInnerTab: true
        });
        addToBreadCrumpData({
            key: "info",
            name: "Basic Details",
            path: `${url}/info/${id}/basicdetails`,
            isInnerTab: true
        });
        history.push(`${url}/info/${id}/basicdetails`);
    };

    getDataById = async tradeId => {
        const { selectedProject, selectedSetting } = this.state;
        await this.props.getDepartmentById(selectedProject, selectedSetting);
        return this.props.departmentReducer.getDepartmentByIdResponse;
    };
    HandleExit = async () => {
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData());
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        await this.setState({ tableLoading: true });
        await this.props.exportDepartmentSettings(entityId, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        await this.setState({ tableLoading: false });
        if (this.props.departmentReducer.departmentExportResponse && this.props.departmentReducer.departmentExportResponse.error) {
            await this.setState({ alertMessage: this.props.departmentReducer.departmentExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const projectId = this.props.match.params.id;
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllDepartmentLogs(buildingId, historyParams, projectId);
        const {
            departmentReducer: {
                getAllDepartmentLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.departmentReducer.getAllDepartmentLogsResponse && this.props.departmentReducer.getAllDepartmentLogsResponse.error) {
            await this.setState({ alertMessage: this.props.departmentReducer.getAllDepartmentLogsResponse.error });
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

    handlePerPageChangeHistory = async (e, item) => {
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
        await this.getLogData(item);
    };

    handlePageClickHistory = async (page, item) => {
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
        await this.getLogData(item);
    };

    handleGlobalSearchHistory = async (search, item) => {
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
        await this.getLogData(item);
    };

    handleDeleteLog = async (id, item, choice = "delete") => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            isRestoreOrDelete: choice,
            selectedMainItem: item
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
        const { selectedLog, selectedMainItem } = this.state;
        await this.props.deleteSettingsLog(selectedLog);
        if (this.props.departmentReducer.deleteSettingsLogResponse && this.props.departmentReducer.deleteSettingsLogResponse.error) {
            await this.setState({ alertMessage: this.props.departmentReducer.deleteSettingsLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(selectedMainItem);
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreSettingsLog(id);
        if (this.props.departmentReducer.restoreSettingsLogResponse && this.props.departmentReducer.restoreSettingsLogResponse.error) {
            await this.setState({ alertMessage: this.props.departmentReducer.restoreSettingsLogResponse.error });
            this.showAlert();
        }
    };

    updateLogSortFilters = async (searchKey, item) => {
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
        await this.getLogData(item);
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            infoTabsData,
            selectedSetting,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission
        } = this.state;
        const {
            match: {
                params: { subSection }
            }
        } = this.props;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {subSection === "info" ? (
                    <TradeSettingsInfo
                        selectedOne={selectedRowId}
                        getDataById={this.getDataById}
                        activetab="department"
                        showEditPage={this.showEditPage}
                        updateData={this.handleUpdateFloor}
                        handleDeleteTrade={this.handleDeleteFloor}
                        handleCloseItem={this.HandleExit}
                        getAllSettingsLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        handleRestoreLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        infoTabsData={infoTabsData}
                        hasEdit={checkPermission("forms", "consultancies", "edit")}
                        hasDelete={checkPermission("forms", "consultancies", "delete")}
                        hasLogView={checkPermission("logs", "consultancies", "view")}
                        hasLogDelete={checkPermission("logs", "consultancies", "delete")}
                        hasLogRestore={checkPermission("logs", "consultancies", "restore")}
                        hasInfoPage={checkPermission("forms", "consultancies", "view")}
                        entity="departments"
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
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
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
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        resetAll={this.resetAll}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasExport={checkPermission("forms", "consultancies", "export")}
                        showAddButton={checkPermission("forms", "consultancies", "create")}
                        hasEdit={checkPermission("forms", "consultancies", "edit")}
                        hasDelete={checkPermission("forms", "consultancies", "delete")}
                        hasInfoPage={checkPermission("forms", "consultancies", "view")}
                        entity="departments"
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
    const { commonReducer, departmentReducer } = state;
    return { commonReducer, departmentReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...floorActions,
        ...CommonActions
    })(index)
);
