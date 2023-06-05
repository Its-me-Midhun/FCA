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
import additionActions from "./actions";
import AdditionMain from "./components/BuildingAdditionMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { buildingAdditionTableData } from "../../config/tableData";
import AdditionInfo from "./components/AdditionInfo";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    popBreadCrumpData,
    checkPermission,
    popBreadCrumpOnPageClose
} from "../../config/utils";

class BuildingAddition extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.buildingAdditionReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.buildingAdditionReducer.entityParams.selectedRowId,
        params: this.props.buildingAdditionReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedAddition: this.props.match.params.id || this.props.buildingAdditionReducer.entityParams.selectedEntity,
        tableData: {
            keys: buildingAdditionTableData.keys,
            config: this.props.buildingAdditionReducer.entityParams.tableConfig || buildingAdditionTableData.config
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.buildingAdditionReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.buildingAdditionReducer.entityParams.filterParams,
        historyPaginationParams: this.props.buildingAdditionReducer.entityParams.historyPaginationParams,
        historyParams: this.props.buildingAdditionReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        summaryRowData: {
            cost_total: "",
            crv_total: "",
            total_sf: ""
        }
    };

    componentDidMount = async () => {
        await this.refreshAdditionList();
    };

    refreshAdditionList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id: buildingId }
            }
        } = this.props;
        // await this.props.getMenuItems();
        let additionList = [];
        let totalCount = 0;
        let cost_total = "";
        let crv_total = "";
        let total_sf = "";
        await this.props.getAdditionsBasedOnBuilding(buildingId, params);
        additionList = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.additions || [];
        totalCount = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.count || 0;
        cost_total = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.cost_total || 0;
        crv_total = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.crv_total || 0;
        total_sf = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.total_sf || 0;

        if (additionList && !additionList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getAdditionsBasedOnBuilding(buildingId, this.state.params);
            additionList = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.additions || [];
            totalCount = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.count || 0;
            cost_total = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.cost_total || 0;
            crv_total = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.crv_total || 0;
            total_sf = this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse?.total_sf || 0;
        }

        if (
            additionList &&
            !additionList.length &&
            this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse &&
            this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse.error
        ) {
            await this.setState({ alertMessage: this.props.buildingAdditionReducer.getAdditionsBasedOnBuildingResponse.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...tableData,
                data: additionList,
                config: this.props.buildingAdditionReducer.entityParams.tableConfig || tableData.config
            },
            additionList,
            showWildCardFilter: this.state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            summaryRowData: {
                ...this.state.summaryRowData,
                cost_total: cost_total,
                crv_total: crv_total,
                total_sf: total_sf
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
        await this.refreshAdditionList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Addition",
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
        await this.props.updateAdditionEntityParams(entityParams);
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
        await this.refreshAdditionList();
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
                list:null,
                
            },
            tableData: {
                ...this.state.tableData,
                config: buildingAdditionTableData.config
            },
             wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshAdditionList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshAdditionList();
    };

    getListForCommonFilter = async params => {
        await this.props.getListForCommonFilter(params);
        return (
            (this.props.buildingAdditionReducer.getListForCommonFilterResponse &&
                this.props.buildingAdditionReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshAdditionList();
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
        await this.refreshAdditionList();
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
        await this.refreshAdditionList();
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
        await this.refreshAdditionList();
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

    showEditPage = additionId => {
        const { history } = this.props;
        const { selectedBuilding } = this.state;
        this.setState({
            selectedAddition: additionId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Addition",
            path: `/buildingAddition/edit/${additionId}`
        });
        history.push(`/buildingAddition/edit/${additionId}?b_id=${selectedBuilding}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        const { selectedBuilding } = this.state;

        this.setState({
            selectedAddition: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Addition",
            path: `/buildingAddition/add`
        });
        history.push(`/buildingAddition/add?b_id=${selectedBuilding}`);
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

    handleAddAddition = async (building_id, addition) => {
        const { history } = this.props;
        await this.props.addAddition(building_id, addition);
        if (this.props.buildingAdditionReducer.addAdditionResponse && this.props.buildingAdditionReducer.addAdditionResponse.error) {
            await this.setState({
                alertMessage: this.props.buildingAdditionReducer.addAdditionResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage: this.props.buildingAdditionReducer.addAdditionResponse && this.props.buildingAdditionReducer.addAdditionResponse.message
            });
            await this.refreshAdditionList;
            this.showAlert();
            popBreadCrumpOnPageClose();
            history.push(findPrevPathFromBreadCrumpData() || `/building/buildinginfo/${building_id}/buildingAddition`);
        }
    };

    handleUpdateAddition = async (building_id, addition_id, addition) => {
        const { history } = this.props;
        await this.props.updateAddition(building_id, addition_id, addition);
        if (this.props.buildingAdditionReducer.updateAdditionResponse && this.props.buildingAdditionReducer.updateAdditionResponse.error) {
            await this.setState({ alertMessage: this.props.buildingAdditionReducer.updateAdditionResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.buildingAdditionReducer.updateAdditionResponse &&
                        this.props.buildingAdditionReducer.updateAdditionResponse.message) ||
                    "Addition updated successfully"
            });
            this.showAlert();
            await this.refreshAdditionList();
            if (building_id) {
                popBreadCrumpOnPageClose();
                history.push(findPrevPathFromBreadCrumpData() || `/building/buildinginfo/${building_id}/buildingAddition`);
            }
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

    handleDeleteAddition = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedAddition: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Addition?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteAdditionOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteAdditionOnConfirm = async () => {
        const { selectedBuilding, selectedAddition } = this.state;
        const { history } = this.props;
        await this.props.deleteAddition(selectedBuilding, selectedAddition);
        if (this.props.buildingAdditionReducer.deleteAdditionResponse && this.props.buildingAdditionReducer.deleteAdditionResponse.error) {
            await this.setState({ alertMessage: this.props.buildingAdditionReducer.deleteAdditionResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshAdditionList();
            // await this.props.getMenuItems();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/addition");
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
        await this.refreshAdditionList();
    };

    showInfoPage = additionId => {
        const { history } = this.props;
        this.setState({
            selectedAddition: additionId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Building Addition",
                    path: `/buildingAddition/additioninfo/${additionId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/buildingAddition/additioninfo/${additionId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async additionId => {
        const { selectedBuilding } = this.state;
        await this.props.getAdditionById(selectedBuilding, additionId);
        return this.props.buildingAdditionReducer.getAdditionByIdResponse;
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
        await this.props.exportAdditionsByBuilding(entityId);
        this.setState({ tableLoading: false });
        if (this.props.buildingAdditionReducer.additionExportResponse && this.props.buildingAdditionReducer.additionExportResponse.error) {
            await this.setState({ alertMessage: this.props.buildingAdditionReducer.additionExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllAdditionLogs(buildingId, historyParams);
        const {
            buildingAdditionReducer: {
                getAllAdditionLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.buildingAdditionReducer.getAllAdditionLogsResponse && this.props.buildingAdditionReducer.getAllAdditionLogsResponse.error) {
            await this.setState({ alertMessage: this.props.buildingAdditionReducer.getAllAdditionLogsResponse.error });
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
        await this.props.deleteAdditionLog(selectedLog);
        if (this.props.buildingAdditionReducer.deleteAdditionLogResponse && this.props.buildingAdditionReducer.deleteAdditionLogResponse.error) {
            await this.setState({ alertMessage: this.props.buildingAdditionReducer.deleteAdditionLogResponse.error });
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
        await this.props.restoreAdditionLog(id);
        if (this.props.buildingAdditionReducer.restoreAdditionLogResponse && this.props.buildingAdditionReducer.restoreAdditionLogResponse.error) {
            await this.setState({ alertMessage: this.props.buildingAdditionReducer.restoreAdditionLogResponse.error });
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
            selectedAddition,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            summaryRowData
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
                        selectedAddition={selectedAddition}
                        handleAddAddition={this.handleAddAddition}
                        handleUpdateAddition={this.handleUpdateAddition}
                        getDataById={this.getDataById}
                    />
                ) : section === "additioninfo" ? (
                    <AdditionInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteAddition}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreAdditionLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        hasEdit={checkPermission("forms", "building_additions", "edit")}
                        hasDelete={checkPermission("forms", "building_additions", "delete")}
                        hasLogView={checkPermission("logs", "building_additions", "view")}
                        hasLogDelete={checkPermission("logs", "building_additions", "delete")}
                        hasLogRestore={checkPermission("logs", "building_additions", "restore")}
                        hasInfoPage={checkPermission("forms", "building_additions", "view")}
                        entity="additions"
                    />
                ) : (
                    <AdditionMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        summaryRowData={summaryRowData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteAddition={this.handleDeleteAddition}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterAddition={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        tableLoading={this.state.tableLoading}
                        exportTableXl={this.exportTableXl}
                        hasExport={checkPermission("forms", "building_additions", "export")}
                        showAddButton={checkPermission("forms", "building_additions", "create")}
                        hasEdit={checkPermission("forms", "building_additions", "edit")}
                        hasDelete={checkPermission("forms", "building_additions", "delete")}
                        hasInfoPage={checkPermission("forms", "building_additions", "view")}
                        entity="additions"
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
    const { commonReducer, buildingAdditionReducer } = state;
    return { commonReducer, buildingAdditionReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...additionActions,
        ...CommonActions
    })(BuildingAddition)
);
