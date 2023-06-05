import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import tradeActions from "./actions";
import TradeMain from "./components/TradeMain";
import _ from "lodash";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { tradeTableData } from "./components/tableConfig";
import TradeInfo from "./components/TradeInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission } from "../../config/utils";
import qs from "query-string";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.masterTradeReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.masterTradeReducer.entityParams.selectedRowId,
        params: this.props.masterTradeReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedTrade: this.props.match.params.id || this.props.masterTradeReducer.entityParams.selectedEntity,
        tableData: {
            keys: tradeTableData.keys,
            config: this.props.masterTradeReducer.entityParams.tableConfig || _.cloneDeep(tradeTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.masterTradeReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.masterTradeReducer.entityParams.filterParams,
        historyPaginationParams: this.props.masterTradeReducer.entityParams.historyPaginationParams,
        historyParams: this.props.masterTradeReducer.entityParams.historyParams,
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
        await this.refreshTradeList();
    };

    refreshTradeList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id: buildingId }
            }
        } = this.props;
        let tradeList = [];
        let totalCount = 0;
        await this.props.getTrades(params);
        tradeList = this.props.masterTradeReducer.getTradesResponse ? this.props.masterTradeReducer.getTradesResponse.trades || [] : [];
        totalCount = this.props.masterTradeReducer.getTradesResponse ? this.props.masterTradeReducer.getTradesResponse.count || 0 : 0;

        if (tradeList && !tradeList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getTrades(buildingId, this.state.params);
            tradeList = this.props.masterTradeReducer.getTradesResponse ? this.props.masterTradeReducer.getTradesResponse.trades || [] : [];
            totalCount = this.props.masterTradeReducer.getTradesResponse ? this.props.masterTradeReducer.getTradesResponse.count || 0 : 0;
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.trades
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.trades || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.trade_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.trade_logs || {}
                : {};

        if (
            tradeList &&
            !tradeList.length &&
            this.props.masterTradeReducer.getTradesResponse &&
            this.props.masterTradeReducer.getTradesResponse.error
        ) {
            await this.setState({ alertMessage: this.props.masterTradeReducer.getTradesResponse.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...tableData,
                data: tradeList,
                config: this.props.masterTradeReducer.entityParams.tableConfig || tableData.config
            },
            tradeList,
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
        await this.refreshTradeList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Trade",
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
        await this.props.updateTradeEntityParams(entityParams);
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
        await this.refreshTradeList();
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
                config: _.cloneDeep(tradeTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshTradeList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshTradeList();
    };

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters, list });
        return (
            (this.props.masterTradeReducer.getListForCommonFilterResponse && this.props.masterTradeReducer.getListForCommonFilterResponse.list) || []
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
        await this.refreshTradeList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, tradeTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.refreshTradeList();
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
        await this.refreshTradeList();
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
        await this.refreshTradeList();
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

    showEditPage = tradeId => {
        const { history } = this.props;
        this.setState({
            selectedTrade: tradeId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Trade",
            path: `/trade/edit/${tradeId}`
        });
        history.push(`/trade/edit/${tradeId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedTrade: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Trade",
            path: `/trade/add`
        });
        history.push(`/trade/add`);
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
        const { history } = this.props;
        await this.props.addTrade({ trade });
        if (this.props.masterTradeReducer.addTradeResponse && this.props.masterTradeReducer.addTradeResponse.error) {
            await this.setState({
                alertMessage: this.props.masterTradeReducer.addTradeResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage: this.props.masterTradeReducer.addTradeResponse && this.props.masterTradeReducer.addTradeResponse.message
            });
            this.showAlert();
            await this.refreshTradeList();
            history.push(`/trade`);
        }
    };

    handleUpdateTrade = async (trade_id, trade) => {
        const { history } = this.props;
        await this.props.updateTrade(trade_id, { trade });
        if (this.props.masterTradeReducer.updateTradeResponse && this.props.masterTradeReducer.updateTradeResponse.error) {
            await this.setState({ alertMessage: this.props.masterTradeReducer.updateTradeResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.masterTradeReducer.updateTradeResponse && this.props.masterTradeReducer.updateTradeResponse.message) ||
                    "Trade updated successfully"
            });
            this.showAlert();
            await this.refreshTradeList();
            history.push(`/trade`);
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

    handleDeleteTrade = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedTrade: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Trade?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteTradeOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteTradeOnConfirm = async () => {
        const { selectedTrade } = this.state;
        const { history } = this.props;
        await this.props.deleteTrade(selectedTrade);
        if (this.props.masterTradeReducer.deleteTradeResponse && this.props.masterTradeReducer.deleteTradeResponse.error) {
            await this.setState({ alertMessage: this.props.masterTradeReducer.deleteTradeResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshTradeList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/trade");
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
        await this.refreshTradeList();
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
                    name: "Trade",
                    path: `/trade/tradeinfo/${projectId}/basicdetails${search}`
                },
                // showing report related tabs only in report settings
                ...(query?.general !== "true"
                    ? [
                          {
                              key: "assignednarrativetemplate",
                              name: "Assigned Narrative Template",
                              path: `/trade/tradeinfo/${projectId}/assignednarrativetemplate${search}`
                          }
                      ]
                    : []),
                ...(query?.general !== "true"
                    ? [
                          {
                              key: "assignedtabletemplate",
                              name: "Assigned Table Template",
                              path: `/trade/tradeinfo/${projectId}/assignedtabletemplate${search}`
                          }
                      ]
                    : [])
            ]
        });
        let tabKeyList = ["basicdetails", "assignednarrativetemplate", "assignedtabletemplate"];
        history.push(
            `/trade/tradeinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }${search}`
        );
    };

    getDataById = async tradeId => {
        await this.props.getTradeById(tradeId);
        return this.props.masterTradeReducer.getTradeByIdResponse;
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        await this.setState({ tableLoading: true });
        await this.props.exportTrades({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (this.props.masterTradeReducer.tradeExportResponse && this.props.masterTradeReducer.tradeExportResponse.error) {
            await this.setState({ alertMessage: this.props.masterTradeReducer.tradeExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllTradeLogs(buildingId, historyParams);
        const {
            masterTradeReducer: {
                getAllTradeLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.masterTradeReducer.getAllTradeLogsResponse && this.props.masterTradeReducer.getAllTradeLogsResponse.error) {
            await this.setState({ alertMessage: this.props.masterTradeReducer.getAllTradeLogsResponse.error });
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
        await this.props.deleteTradeLog(selectedLog);
        if (this.props.masterTradeReducer.deleteTradeLogResponse && this.props.masterTradeReducer.deleteTradeLogResponse.error) {
            await this.setState({ alertMessage: this.props.masterTradeReducer.deleteTradeLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreTradeLog(id);
        if (this.props.masterTradeReducer.restoreTradeLogResponse && this.props.masterTradeReducer.restoreTradeLogResponse.error) {
            await this.setState({ alertMessage: this.props.masterTradeReducer.restoreTradeLogResponse.error });
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
            selectedTrade,
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
                        selectedTrade={selectedTrade}
                        handleAddTrade={this.handleAddTrade}
                        handleUpdateTrade={this.handleUpdateTrade}
                        getDataById={this.getDataById}
                    />
                ) : section === "tradeinfo" ? (
                    <TradeInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteTrade}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreTradeLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={checkPermission("forms", "master_trades", "edit")}
                        hasDelete={checkPermission("forms", "master_trades", "delete")}
                        hasLogView={checkPermission("logs", "master_trades", "view")}
                        hasLogDelete={checkPermission("logs", "master_trades", "delete")}
                        hasLogRestore={checkPermission("logs", "master_trades", "restore")}
                        hasInfoPage={checkPermission("forms", "master_trades", "view")}
                        entity="master_trades"
                    />
                ) : (
                    <TradeMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteTrade={this.handleDeleteTrade}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterTrade={this.getListForCommonFilter}
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
                        hasExport={checkPermission("forms", "master_trades", "export")}
                        showAddButton={checkPermission("forms", "master_trades", "create")}
                        hasEdit={checkPermission("forms", "master_trades", "edit")}
                        hasDelete={checkPermission("forms", "master_trades", "delete")}
                        hasInfoPage={checkPermission("forms", "master_trades", "view")}
                        entity="master_trades"
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
    const { projectReducer, commonReducer, masterTradeReducer } = state;
    return { projectReducer, commonReducer, masterTradeReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...tradeActions,
        ...CommonActions
    })(index)
);
