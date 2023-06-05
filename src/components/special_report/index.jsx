import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import specialReportActions from "./actions";
import SpecialReportMain from "./components/SpecialReportMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { specialReportTableData } from "./components/tableConfig";
import SpecialReportInfo from "./components/SpecialReportInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission } from "../../config/utils";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.specialReportReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.specialReportReducer.entityParams.selectedRowId,
        params: this.props.specialReportReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedSpecialReport: this.props.match.params.id || this.props.specialReportReducer.entityParams.selectedEntity,
        tableData: {
            keys: specialReportTableData.keys,
            config: this.props.specialReportReducer.entityParams.tableConfig || _.cloneDeep(specialReportTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.specialReportReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.specialReportReducer.entityParams.filterParams,
        historyPaginationParams: this.props.specialReportReducer.entityParams.historyPaginationParams,
        historyParams: this.props.specialReportReducer.entityParams.historyParams,
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
        await this.refreshSpecialReportList();
    };

    refreshSpecialReportList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let specialReportList = [];
        let totalCount = 0;
        await this.props.getSpecialReports(params, dynamicUrl);
        specialReportList = this.props.specialReportReducer.getSpecialReportsResponse
            ? this.props.specialReportReducer.getSpecialReportsResponse.special_reports || []
            : [];
        totalCount = this.props.specialReportReducer.getSpecialReportsResponse
            ? this.props.specialReportReducer.getSpecialReportsResponse.count || 0
            : 0;

        if (specialReportList && !specialReportList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getSpecialReports(this.state.params, dynamicUrl);
            specialReportList = this.props.specialReportReducer.getSpecialReportsResponse
                ? this.props.specialReportReducer.getSpecialReportsResponse.special_reports || []
                : [];
            totalCount = this.props.specialReportReducer.getSpecialReportsResponse
                ? this.props.specialReportReducer.getSpecialReportsResponse.count || 0
                : 0;
        }

        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.specialReports
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.specialReports || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.specialReport_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.specialReport_logs || {}
                : {};

        if (
            specialReportList &&
            !specialReportList.length &&
            this.props.specialReportReducer.getSpecialReportsResponse &&
            this.props.specialReportReducer.getSpecialReportsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.specialReportReducer.getSpecialReportsResponse.error });
            this.showAlert();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: specialReportList,
                config: this.props.specialReportReducer.entityParams.tableConfig || tableData.config
            },
            specialReportList,
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
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, specialReportTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.refreshSpecialReportList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "SpecialReport",
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
        await this.props.updateSpecialReportEntityParams(entityParams);
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
        await this.refreshSpecialReportList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshSpecialReportList();
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
                config:_.cloneDeep(specialReportTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshSpecialReportList();
    };
    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters, list }, dynamicUrl);
        return (
            (this.props.specialReportReducer.getListForCommonFilterResponse && this.props.specialReportReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshSpecialReportList();
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
        await this.refreshSpecialReportList();
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
        await this.refreshSpecialReportList();
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
        await this.refreshSpecialReportList();
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

    showEditPage = specialReportId => {
        const { history } = this.props;
        this.setState({
            selectedSpecialReport: specialReportId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit SpecialReport",
            path: `/specialreport/edit/${specialReportId}`
        });
        history.push(`/specialreport/edit/${specialReportId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedSpecialReport: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add SpecialReport",
            path: `/specialreport/add`
        });
        history.push(`/specialreport/add`);
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

    handleAddSpecialReport = async specialReport => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.addSpecialReport({ special_report: specialReport }, dynamicUrl);
        if (this.props.specialReportReducer.addSpecialReportResponse && this.props.specialReportReducer.addSpecialReportResponse.error) {
            await this.setState({
                alertMessage: this.props.specialReportReducer.addSpecialReportResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    this.props.specialReportReducer.addSpecialReportResponse && this.props.specialReportReducer.addSpecialReportResponse.message
            });
            this.showAlert();
            await this.refreshSpecialReportList();
            // history.push(`/specialreport`);
            history.goBack();
        }
    };

    handleUpdateSpecialReport = async (specialReport_id, specialReport) => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.updateSpecialReport(specialReport_id, { special_report: specialReport }, dynamicUrl);
        if (this.props.specialReportReducer.updateSpecialReportResponse && this.props.specialReportReducer.updateSpecialReportResponse.error) {
            await this.setState({ alertMessage: this.props.specialReportReducer.updateSpecialReportResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.specialReportReducer.updateSpecialReportResponse &&
                        this.props.specialReportReducer.updateSpecialReportResponse.message) ||
                    "SpecialReport updated successfully"
            });
            this.showAlert();
            await this.refreshSpecialReportList();
            // history.push(`/specialreport`);
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

    handleDeleteSpecialReport = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedSpecialReport: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this SpecialReport?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteSpecialReportOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteSpecialReportOnConfirm = async () => {
        const { selectedSpecialReport } = this.state;
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.deleteSpecialReport(selectedSpecialReport, dynamicUrl);
        if (this.props.specialReportReducer.deleteSpecialReportResponse && this.props.specialReportReducer.deleteSpecialReportResponse.error) {
            await this.setState({ alertMessage: this.props.specialReportReducer.deleteSpecialReportResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshSpecialReportList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/specialreport");
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
        await this.refreshSpecialReportList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Special Report",
                    path: `/specialreport/specialreportinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/specialreport/specialreportinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async specialReportId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getSpecialReportById(specialReportId, dynamicUrl);
        return this.props.specialReportReducer.getSpecialReportByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.setState({ tableLoading: true });
        await this.props.exportSpecialReports(dynamicUrl, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (this.props.specialReportReducer.specialReportExportResponse && this.props.specialReportReducer.specialReportExportResponse.error) {
            await this.setState({ alertMessage: this.props.specialReportReducer.specialReportExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllSpecialReportLogs(buildingId, historyParams);
        const {
            specialReportReducer: {
                getAllSpecialReportLogsResponse: { logs, count }
            }
        } = this.props;
        if (
            this.props.specialReportReducer.getAllSpecialReportLogsResponse &&
            this.props.specialReportReducer.getAllSpecialReportLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.specialReportReducer.getAllSpecialReportLogsResponse.error });
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
        await this.props.deleteSpecialReportLog(selectedLog);
        if (this.props.specialReportReducer.deleteSpecialReportLogResponse && this.props.specialReportReducer.deleteSpecialReportLogResponse.error) {
            await this.setState({ alertMessage: this.props.specialReportReducer.deleteSpecialReportLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreSpecialReportLog(id);
        if (
            this.props.specialReportReducer.restoreSpecialReportLogResponse &&
            this.props.specialReportReducer.restoreSpecialReportLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.specialReportReducer.restoreSpecialReportLogResponse.error });
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

    handleSpecialReportActions = (specialReport_id, specialReport) => {
        this.handleUpdateSpecialReport(specialReport_id, specialReport);
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            infoTabsData,
            selectedSpecialReport,
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
            hasEdit = true,
            hasAdd = true
        } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedSpecialReport={id || selectedSpecialReport}
                        handleAddSpecialReport={this.handleAddSpecialReport}
                        handleUpdateSpecialReport={this.handleUpdateSpecialReport}
                        getDataById={this.getDataById}
                    />
                ) : section === "specialreportinfo" ? (
                    <SpecialReportInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteSpecialReport}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreSpecialReportLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={hasEdit && checkPermission("forms", "special_reports", "edit")}
                        hasDelete={checkPermission("forms", "special_reports", "delete")}
                        hasLogView={checkPermission("logs", "special_reports", "view")}
                        hasLogDelete={checkPermission("logs", "special_reports", "delete")}
                        hasLogRestore={checkPermission("logs", "special_reports", "restore")}
                        hasInfoPage={checkPermission("forms", "special_reports", "view")}
                        entity="special_reports"
                    />
                ) : (
                    <SpecialReportMain
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
                        handleDeleteSpecialReport={this.handleDeleteSpecialReport}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterSpecialReport={this.getListForCommonFilter}
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
                        handleSpecialReportActions={dynamicUrl === "/special_reports" ? this.handleSpecialReportActions : null}
                        hasExport={checkPermission("forms", "special_reports", "export")}
                        showAddButton={hasAdd && checkPermission("forms", "special_reports", "create")}
                        hasEdit={hasEdit && checkPermission("forms", "special_reports", "edit")}
                        hasDelete={checkPermission("forms", "special_reports", "delete")}
                        hasInfoPage={checkPermission("forms", "special_reports", "view")}
                        entity="special_reports"
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
    const { projectReducer, commonReducer, specialReportReducer } = state;
    return { projectReducer, commonReducer, specialReportReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...specialReportActions,
        ...CommonActions
    })(index)
);
