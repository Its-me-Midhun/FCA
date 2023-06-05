import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import chartsAndGraphsActions from "./actions";
import ChartsAndGraphsMain from "./components/ChartsAndGraphsMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { chartsAndGraphsTableData } from "./components/tableConfig";
import ChartsAndGraphsInfo from "./components/ChartsAndGraphsInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission } from "../../config/utils";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.chartsAndGraphsReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.chartsAndGraphsReducer.entityParams.selectedRowId,
        params: this.props.chartsAndGraphsReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedChartsAndGraphs: this.props.match.params.id || this.props.chartsAndGraphsReducer.entityParams.selectedEntity,
        tableData: {
            keys: chartsAndGraphsTableData.keys,
            config: this.props.chartsAndGraphsReducer.entityParams.tableConfig || _.cloneDeep(chartsAndGraphsTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.chartsAndGraphsReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.chartsAndGraphsReducer.entityParams.filterParams,
        historyPaginationParams: this.props.chartsAndGraphsReducer.entityParams.historyPaginationParams,
        historyParams: this.props.chartsAndGraphsReducer.entityParams.historyParams,
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
        await this.refreshChartsAndGraphsList();
    };

    refreshChartsAndGraphsList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let chartsAndGraphsList = [];
        let totalCount = 0;
        await this.props.getChartsAndGraphs(params, dynamicUrl);
        chartsAndGraphsList = this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse
            ? this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse.charts || []
            : [];
        totalCount = this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse
            ? this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse.count || 0
            : 0;

        if (chartsAndGraphsList && !chartsAndGraphsList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getChartsAndGraphs(this.state.params, dynamicUrl);
            chartsAndGraphsList = this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse
                ? this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse.charts || []
                : [];
            totalCount = this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse
                ? this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse.count || 0
                : 0;
        }

        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.chartsAndGraphss
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.chartsAndGraphss || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.chartsAndGraphs_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.chartsAndGraphs_logs || {}
                : {};

        if (
            chartsAndGraphsList &&
            !chartsAndGraphsList.length &&
            this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse &&
            this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.chartsAndGraphsReducer.getChartsAndGraphsResponse.error });
            this.showAlert();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: chartsAndGraphsList,
                config: this.props.chartsAndGraphsReducer.entityParams.tableConfig || tableData.config
            },
            chartsAndGraphsList,
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
        await this.refreshChartsAndGraphsList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "ChartsAndGraphs",
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
        await this.props.updateChartsAndGraphsEntityParams(entityParams);
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
        await this.refreshChartsAndGraphsList();
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
                config: _.cloneDeep(chartsAndGraphsTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshChartsAndGraphsList();
    };
    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshChartsAndGraphsList();
    };

    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters, list }, dynamicUrl);
        return (
            (this.props.chartsAndGraphsReducer.getListForCommonFilterResponse &&
                this.props.chartsAndGraphsReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshChartsAndGraphsList();
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
        await this.refreshChartsAndGraphsList();
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
        await this.refreshChartsAndGraphsList();
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
        await this.refreshChartsAndGraphsList();
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

    showEditPage = chartsAndGraphsId => {
        const { history } = this.props;
        this.setState({
            selectedChartsAndGraphs: chartsAndGraphsId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit ChartsAndGraphs",
            path: `/chartsandgraphs/edit/${chartsAndGraphsId}`
        });
        history.push(`/chartsandgraphs/edit/${chartsAndGraphsId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedChartsAndGraphs: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add ChartsAndGraphs",
            path: `/chartsandgraphs/add`
        });
        history.push(`/chartsandgraphs/add`);
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

    handleAddChartsAndGraphs = async chartsAndGraphs => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.addChartsAndGraphs({ special_report: chartsAndGraphs }, dynamicUrl);
        if (this.props.chartsAndGraphsReducer.addChartsAndGraphsResponse && this.props.chartsAndGraphsReducer.addChartsAndGraphsResponse.error) {
            await this.setState({
                alertMessage: this.props.chartsAndGraphsReducer.addChartsAndGraphsResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    this.props.chartsAndGraphsReducer.addChartsAndGraphsResponse &&
                    this.props.chartsAndGraphsReducer.addChartsAndGraphsResponse.message
            });
            this.showAlert();
            await this.refreshChartsAndGraphsList();
            // history.push(`/chartsandgraphs`);
            history.goBack();
        }
    };

    handleUpdateChartsAndGraphs = async (chartsAndGraphs_id, chartsAndGraphs) => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.updateChartsAndGraphs(chartsAndGraphs_id, { special_report: chartsAndGraphs }, dynamicUrl);
        if (
            this.props.chartsAndGraphsReducer.updateChartsAndGraphsResponse &&
            this.props.chartsAndGraphsReducer.updateChartsAndGraphsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.chartsAndGraphsReducer.updateChartsAndGraphsResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.chartsAndGraphsReducer.updateChartsAndGraphsResponse &&
                        this.props.chartsAndGraphsReducer.updateChartsAndGraphsResponse.message) ||
                    "ChartsAndGraphs updated successfully"
            });
            this.showAlert();
            await this.refreshChartsAndGraphsList();
            // history.push(`/chartsandgraphs`);
            history.goBack();
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

    handleDeleteChartsAndGraphs = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedChartsAndGraphs: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this ChartsAndGraphs?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteChartsAndGraphsOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteChartsAndGraphsOnConfirm = async () => {
        const { selectedChartsAndGraphs } = this.state;
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.deleteChartsAndGraphs(selectedChartsAndGraphs, dynamicUrl);
        if (
            this.props.chartsAndGraphsReducer.deleteChartsAndGraphsResponse &&
            this.props.chartsAndGraphsReducer.deleteChartsAndGraphsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.chartsAndGraphsReducer.deleteChartsAndGraphsResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshChartsAndGraphsList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/chartsandgraphs");
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
        await this.refreshChartsAndGraphsList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: `/chartsandgraphs/chartsandgraphsinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/chartsandgraphs/chartsandgraphsinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async chartsAndGraphsId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getChartsAndGraphsById(chartsAndGraphsId, dynamicUrl);
        return this.props.chartsAndGraphsReducer.getChartsAndGraphsByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.setState({ tableLoading: true });
        await this.props.exportChartsAndGraphss(dynamicUrl, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (
            this.props.chartsAndGraphsReducer.chartsAndGraphsExportResponse &&
            this.props.chartsAndGraphsReducer.chartsAndGraphsExportResponse.error
        ) {
            await this.setState({ alertMessage: this.props.chartsAndGraphsReducer.chartsAndGraphsExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllChartsAndGraphsLogs(buildingId, historyParams);
        const {
            chartsAndGraphsReducer: {
                getAllChartsAndGraphsLogsResponse: { logs, count }
            }
        } = this.props;
        if (
            this.props.chartsAndGraphsReducer.getAllChartsAndGraphsLogsResponse &&
            this.props.chartsAndGraphsReducer.getAllChartsAndGraphsLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.chartsAndGraphsReducer.getAllChartsAndGraphsLogsResponse.error });
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
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, chartsAndGraphsTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    deleteLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.deleteChartsAndGraphsLog(selectedLog);
        if (
            this.props.chartsAndGraphsReducer.deleteChartsAndGraphsLogResponse &&
            this.props.chartsAndGraphsReducer.deleteChartsAndGraphsLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.chartsAndGraphsReducer.deleteChartsAndGraphsLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreChartsAndGraphsLog(id);
        if (
            this.props.chartsAndGraphsReducer.restoreChartsAndGraphsLogResponse &&
            this.props.chartsAndGraphsReducer.restoreChartsAndGraphsLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.chartsAndGraphsReducer.restoreChartsAndGraphsLogResponse.error });
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

    handleChartsAndGraphsActions = (chartsAndGraphs_id, chartsAndGraphs) => {
        this.handleUpdateChartsAndGraphs(chartsAndGraphs_id, chartsAndGraphs);
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            infoTabsData,
            selectedChartsAndGraphs,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission
        } = this.state;
        const {
            match: {
                params: { section, id }
            },
            hasEdit = false,
            hasAdd = false
        } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedChartsAndGraphs={id || selectedChartsAndGraphs}
                        handleAddChartsAndGraphs={this.handleAddChartsAndGraphs}
                        handleUpdateChartsAndGraphs={this.handleUpdateChartsAndGraphs}
                        getDataById={this.getDataById}
                    />
                ) : section === "chartsandgraphsinfo" ? (
                    <ChartsAndGraphsInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteChartsAndGraphs}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreChartsAndGraphsLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={false}
                        hasDelete={false}
                        hasLogView={false}
                        hasLogDelete={false}
                        hasLogRestore={false}
                        hasInfoPage={false}
                        entity="charts_and_graphs"
                    />
                ) : (
                    <ChartsAndGraphsMain
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
                        handleDeleteChartsAndGraphs={this.handleDeleteChartsAndGraphs}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterChartsAndGraphs={this.getListForCommonFilter}
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
                        handleChartsAndGraphsActions={dynamicUrl === "/charts_and_graphs" ? this.handleChartsAndGraphsActions : null}
                        hasExport={checkPermission("forms", "charts_and_graphs", "export")}
                        showAddButton={false}
                        hasEdit={false}
                        hasDelete={false}
                        hasInfoPage={false}
                        entity="charts_and_graphs"
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
    const { projectReducer, commonReducer, chartsAndGraphsReducer } = state;
    return { projectReducer, commonReducer, chartsAndGraphsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...chartsAndGraphsActions,
        ...CommonActions
    })(index)
);
