import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";
import SubSystemInfo from "../project/components/settings/settingsInfo";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import floorActions from "./actions";
import SubSystemMain from "./components/FloorMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { subsystemsettingsTableData } from "../../config/tableData";
import { addToBreadCrumpData, checkPermission, findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose } from "../../config/utils";
import history from "../../config/history";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.subsystemReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.subsystemReducer.entityParams.selectedRowId,
        params: this.props.subsystemReducer.entityParams.params,
        selectedProject: this.props.match.params.id || null,
        selectedSubSystem: this.props.match.params.subId || this.props.subsystemReducer.entityParams.selectedEntity,
        tableData: {
            keys: subsystemsettingsTableData.keys,
            config: this.props.subsystemReducer.entityParams.tableConfig || _.cloneDeep(subsystemsettingsTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.subsystemReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.subsystemReducer.entityParams.filterParams,
        showFormModal: false,
        historyPaginationParams: this.props.subsystemReducer.entityParams.historyPaginationParams,
        historyParams: this.props.subsystemReducer.entityParams.historyParams,
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
        await this.setState({
            selectedSubSystem: this.props.match.params.subId
        });
        await this.refreshSubsystemList();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.subId !== this.props.match.params.subId) {
            await this.setState({
                selectedSubSystem: this.props.match.params.subId
            });
        }
    };

    refreshSubsystemList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id: projectId = null }
            }
        } = this.props;
        let subsytemList = [];
        let totalCount = 0;
        await this.props.getSubsystemSettingsData(params, projectId);
        subsytemList = this.props.subsystemReducer.getSubsystemSettingsDataResponse
            ? this.props.subsystemReducer.getSubsystemSettingsDataResponse.sub_systems || []
            : [];
        totalCount = this.props.subsystemReducer.getSubsystemSettingsDataResponse
            ? this.props.subsystemReducer.getSubsystemSettingsDataResponse.count || 0
            : 0;

        if (subsytemList && !subsytemList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getSubsystemSettingsData(this.state.params, projectId);
            subsytemList = this.props.subsystemReducer.getSubsystemSettingsDataResponse
                ? this.props.subsystemReducer.getSubsystemSettingsDataResponse.sub_systems || []
                : [];
            totalCount = this.props.subsystemReducer.getSubsystemSettingsDataResponse
                ? this.props.subsystemReducer.getSubsystemSettingsDataResponse.count || 0
                : 0;
        }
        if (
            subsytemList &&
            !subsytemList.length &&
            this.props.subsystemReducer.getSubsystemSettingsDataResponse &&
            this.props.subsystemReducer.getSubsystemSettingsDataResponse.error
        ) {
            await this.setState({ alertMessage: this.props.subsystemReducer.getSubsystemSettingsDataResponse.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...tableData,
                data: subsytemList,
                config: this.props.subsystemReducer.entityParams.tableConfig || tableData.config
            },
            subsytemList,
            showWildCardFilter: this.state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
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
        await this.refreshSubsystemList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Subystem",
            selectedEntity: this.state.selectedSubSystem,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateSubsystemEntityParams(entityParams);
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
        await this.refreshSubsystemList();
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
                config: _.cloneDeep(subsystemsettingsTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshSubsystemList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshDataList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshSubsystemList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, subsystemsettingsTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        await this.props.getListForCommonFilter(params, this.props.match.params.id);
        return (this.props.subsystemReducer.getListForCommonFilterResponse && this.props.subsystemReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshSubsystemList();
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
        await this.refreshSubsystemList();
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
        await this.refreshSubsystemList();
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
        await this.refreshSubsystemList();
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
            selectedSubSystem: floorId
        });
        this.toggleShowFormModal();
    };

    showAddForm = () => {
        this.setState({
            selectedSubSystem: null
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
                        selectedProject={this.state.selectedSubSystem}
                        addNewData={this.handeleAddSubSystem}
                        updateTradeData={this.handleUpdateSubSystem}
                        selectedTrade={this.state.selectedSubSystem}
                        getSubsystemByOne={this.getDataById}
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

    handeleAddSubSystem = async trade => {
        const projectId = this.props.match.params.id;
        await this.props.addSubsystem(projectId, trade);
        if (this.props.subsystemReducer.addSubsystemResponse && this.props.subsystemReducer.addSubsystemResponse.error) {
            this.toggleShowFormModal();
            await this.setState({
                alertMessage: this.props.subsystemReducer.addSubsystemResponse.error,
                selectedSubSystem: null
            });
            this.showAlert();
        } else {
            await this.setState({
                alertMessage: this.props.subsystemReducer.addSubsystemResponse && this.props.subsystemReducer.addSubsystemResponse.message,
                selectedSubSystem: null
            });
            this.toggleShowFormModal();
            this.showAlert();
            await this.refreshSubsystemList();
        }
    };

    handleUpdateSubSystem = async (trade, selectedone) => {
        const { selectedProject, selectedSubSystem } = this.state;
        await this.props.updateSubsystem(selectedProject, selectedone || selectedSubSystem, trade);
        if (this.props.subsystemReducer.updateSubsystemResponse && this.props.subsystemReducer.updateSubsystemResponse.error) {
            await this.setState({
                alertMessage: this.props.subsystemReducer.updateSubsystemResponse.error,
                // selectedSubSystem: null
            });
            if (!selectedone) {
                this.toggleShowFormModal();
            }
            this.showAlert();
        } else {
            await this.refreshSubsystemList();
            
            await this.setState({
                alertMessage: this.props.subsystemReducer.updateSubsystemResponse && this.props.subsystemReducer.updateSubsystemResponse.message,
                // selectedSubSystem: null
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
                        heading={"Do you want to delete this Subsystem?"}
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
        const { selectedProject, selectedSubSystem } = this.state;
        const { history } = this.props;
        await this.props.deleteSubsystem(selectedProject, selectedSubSystem);
        if (this.props.subsystemReducer.deleteSubsystemResponse && this.props.subsystemReducer.deleteSubsystemResponse.error) {
            await this.setState({ alertMessage: this.props.subsystemReducer.deleteSubsystemResponse.error });
            this.setState({
                showConfirmModal: false
                // selectedProject: null
            });
            this.showAlert();
        } else {
            await this.refreshSubsystemList();
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
        await this.refreshSubsystemList();
    };

    showInfoPage = (id, projectId, rowData) => {
        const { history } = this.props;
        const {
            match: { url }
        } = this.props;
        this.setState({
            selectedSubSystem: id
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

    getDataById = async () => {
        const { selectedProject, selectedSubSystem } = this.state;
        await this.props.getSubsystemById(selectedProject, selectedSubSystem);
        return this.props.subsystemReducer.getSubsystemByIdResponse;
    };
    HandleExit = async () => {
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData());
    };

    exportSubSystemSettings;
    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        await this.setState({ tableLoading: true });
        await this.props.exportSubSystemSettings(entityId, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        await this.setState({ tableLoading: false });
        if (this.props.subsystemReducer.subsystemExportResponse && this.props.subsystemReducer.subsystemExportResponse.error) {
            await this.setState({ alertMessage: this.props.subsystemReducer.subsystemExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const projectId = this.props.match.params.id;
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllSubSystemLogs(buildingId, historyParams, projectId);
        const {
            subsystemReducer: {
                getAllSubSystemLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.subsystemReducer.getAllSubSystemLogsResponse && this.props.subsystemReducer.getAllSubSystemLogsResponse.error) {
            await this.setState({ alertMessage: this.props.subsystemReducer.getAllSubSystemLogsResponse.error });
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
        if (this.props.subsystemReducer.deleteSettingsLogResponse && this.props.subsystemReducer.deleteSettingsLogResponse.error) {
            await this.setState({ alertMessage: this.props.subsystemReducer.deleteSettingsLogResponse.error });
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
        if (this.props.subsystemReducer.restoreSettingsLogResponse && this.props.subsystemReducer.restoreSettingsLogResponse.error) {
            await this.setState({ alertMessage: this.props.subsystemReducer.restoreSettingsLogResponse.error });
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
                params: { subSection }
            }
        } = this.props;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {subSection === "info" ? (
                    <SubSystemInfo
                        selectedOne={selectedRowId}
                        getDataById={this.getDataById}
                        activetab="subsystem"
                        showEditPage={this.showEditPage}
                        updateData={this.handleUpdateSubSystem}
                        handleDeleteTrade={this.handleDeleteSubSystem}
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
                        hasEdit={checkPermission("forms", "sub_systems", "edit")}
                        hasDelete={checkPermission("forms", "sub_systems", "delete")}
                        hasLogView={checkPermission("logs", "sub_systems", "view")}
                        hasLogDelete={checkPermission("logs", "sub_systems", "delete")}
                        hasLogRestore={checkPermission("logs", "sub_systems", "restore")}
                        hasInfoPage={checkPermission("forms", "sub_systems", "view")}
                        entity="sub_systems"
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
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteFloor={this.handleDeleteSubSystem}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterFloor={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetAll={this.resetAll}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasExport={checkPermission("forms", "sub_systems", "export")}
                        showAddButton={checkPermission("forms", "sub_systems", "create")}
                        hasEdit={checkPermission("forms", "sub_systems", "edit")}
                        hasDelete={checkPermission("forms", "sub_systems", "delete")}
                        hasInfoPage={checkPermission("forms", "sub_systems", "view")}
                        entity="sub_systems"
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
    const { commonReducer, subsystemReducer } = state;
    return { commonReducer, subsystemReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...floorActions,
        ...CommonActions
    })(index)
);
