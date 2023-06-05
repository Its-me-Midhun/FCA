import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import tableTemplateActions from "./actions";
import TableTemplateMain from "./components/TableTemplateMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { tableTemplateTableData } from "./components/tableConfig";
import TableTemplateInfo from "./components/TableTemplateInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission } from "../../config/utils";
import AssignModal from "../common/components/AssignPopups/assign";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.tableTemplateReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.tableTemplateReducer.entityParams.selectedRowId,
        params: this.props.tableTemplateReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedTableTemplate: this.props.match.params.id || this.props.tableTemplateReducer.entityParams.selectedEntity,
        tableData: {
            keys: tableTemplateTableData.keys,
            config: this.props.tableTemplateReducer.entityParams.tableConfig || _.cloneDeep(tableTemplateTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.tableTemplateReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.tableTemplateReducer.entityParams.filterParams,
        historyPaginationParams: this.props.tableTemplateReducer.entityParams.historyPaginationParams,
        historyParams: this.props.tableTemplateReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        permissions: {},
        logPermission: {},
        showAssignModal: false,
        assignToDetails: {
            type: "",
            label: "",
            details: null,
            assignedItems: [],
            availableItems: []
        }
    };

    componentDidMount = async () => {
        await this.refreshTableTemplateList();
    };

    refreshTableTemplateList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let tableTemplateList = [];
        let totalCount = 0;
        await this.props.getTableTemplates(params, dynamicUrl);
        tableTemplateList = this.props.tableTemplateReducer.getTableTemplatesResponse
            ? this.props.tableTemplateReducer.getTableTemplatesResponse.table_templates || []
            : [];
        totalCount = this.props.tableTemplateReducer.getTableTemplatesResponse
            ? this.props.tableTemplateReducer.getTableTemplatesResponse.count || 0
            : 0;

        if (tableTemplateList && !tableTemplateList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getTableTemplates(this.state.params, dynamicUrl);
            tableTemplateList = this.props.tableTemplateReducer.getTableTemplatesResponse
                ? this.props.tableTemplateReducer.getTableTemplatesResponse.table_templates || []
                : [];
            totalCount = this.props.tableTemplateReducer.getTableTemplatesResponse
                ? this.props.tableTemplateReducer.getTableTemplatesResponse.count || 0
                : 0;
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.tableTemplates
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.tableTemplates || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.tableTemplate_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.tableTemplate_logs || {}
                : {};

        if (
            tableTemplateList &&
            !tableTemplateList.length &&
            this.props.tableTemplateReducer.getTableTemplatesResponse &&
            this.props.tableTemplateReducer.getTableTemplatesResponse.error
        ) {
            await this.setState({ alertMessage: this.props.tableTemplateReducer.getTableTemplatesResponse.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...tableData,
                data: tableTemplateList,
                config: this.props.tableTemplateReducer.entityParams.tableConfig || tableData.config
            },
            tableTemplateList,
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
        await this.refreshTableTemplateList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "TableTemplate",
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
        await this.props.updateTableTemplateEntityParams(entityParams);
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
        await this.refreshTableTemplateList();
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
                config: _.cloneDeep(tableTemplateTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshTableTemplateList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshTableTemplateList();
    };

    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters, list }, dynamicUrl);
        return (
            (this.props.tableTemplateReducer.getListForCommonFilterResponse && this.props.tableTemplateReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshTableTemplateList();
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
        await this.refreshTableTemplateList();
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
        await this.refreshTableTemplateList();
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
        await this.refreshTableTemplateList();
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

    showEditPage = tableTemplateId => {
        const { history } = this.props;
        this.setState({
            selectedTableTemplate: tableTemplateId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit TableTemplate",
            path: `/tabletemplate/edit/${tableTemplateId}`
        });
        history.push(`/tabletemplate/edit/${tableTemplateId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedTableTemplate: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add TableTemplate",
            path: `/tabletemplate/add`
        });
        history.push(`/tabletemplate/add`);
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

    handleAddTableTemplate = async tableTemplate => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.addTableTemplate(tableTemplate, dynamicUrl);
        if (this.props.tableTemplateReducer.addTableTemplateResponse && this.props.tableTemplateReducer.addTableTemplateResponse.error) {
            await this.setState({
                alertMessage: this.props.tableTemplateReducer.addTableTemplateResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    this.props.tableTemplateReducer.addTableTemplateResponse && this.props.tableTemplateReducer.addTableTemplateResponse.message
            });
            this.showAlert();
            await this.refreshTableTemplateList();
            history.push(`/tabletemplate`);
        }
    };

    handleUpdateTableTemplate = async (tableTemplate_id, tableTemplate) => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.updateTableTemplate(tableTemplate_id, tableTemplate, dynamicUrl);
        if (this.props.tableTemplateReducer.updateTableTemplateResponse && this.props.tableTemplateReducer.updateTableTemplateResponse.error) {
            await this.setState({ alertMessage: this.props.tableTemplateReducer.updateTableTemplateResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.tableTemplateReducer.updateTableTemplateResponse &&
                        this.props.tableTemplateReducer.updateTableTemplateResponse.message) ||
                    "TableTemplate updated successfully"
            });
            this.showAlert();
            await this.refreshTableTemplateList();
            history.push(`/tabletemplate`);
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

    handleDeleteTableTemplate = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedTableTemplate: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this TableTemplate?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteTableTemplateOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteTableTemplateOnConfirm = async () => {
        const { selectedTableTemplate } = this.state;
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.deleteTableTemplate(selectedTableTemplate, dynamicUrl);
        if (this.props.tableTemplateReducer.deleteTableTemplateResponse && this.props.tableTemplateReducer.deleteTableTemplateResponse.error) {
            await this.setState({ alertMessage: this.props.tableTemplateReducer.deleteTableTemplateResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshTableTemplateList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/tabletemplate");
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
        await this.refreshTableTemplateList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Table Template",
                    path: `/tabletemplate/tabletemplateinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/tabletemplate/tabletemplateinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async tableTemplateId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getTableTemplateById(tableTemplateId, dynamicUrl);
        return this.props.tableTemplateReducer.getTableTemplateByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.setState({ tableLoading: true });
        await this.props.exportTableTemplates(dynamicUrl, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (this.props.tableTemplateReducer.tableTemplateExportResponse && this.props.tableTemplateReducer.tableTemplateExportResponse.error) {
            await this.setState({ alertMessage: this.props.tableTemplateReducer.tableTemplateExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllTableTemplateLogs(buildingId, historyParams);
        const {
            tableTemplateReducer: {
                getAllTableTemplateLogsResponse: { logs, count }
            }
        } = this.props;
        if (
            this.props.tableTemplateReducer.getAllTableTemplateLogsResponse &&
            this.props.tableTemplateReducer.getAllTableTemplateLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.tableTemplateReducer.getAllTableTemplateLogsResponse.error });
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
        await this.props.deleteTableTemplateLog(selectedLog);
        if (this.props.tableTemplateReducer.deleteTableTemplateLogResponse && this.props.tableTemplateReducer.deleteTableTemplateLogResponse.error) {
            await this.setState({ alertMessage: this.props.tableTemplateReducer.deleteTableTemplateLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreTableTemplateLog(id);
        if (
            this.props.tableTemplateReducer.restoreTableTemplateLogResponse &&
            this.props.tableTemplateReducer.restoreTableTemplateLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.tableTemplateReducer.restoreTableTemplateLogResponse.error });
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

    renderAssignModalLog = () => {
        const { showAssignModal, assignToDetails } = this.state;
        if (!showAssignModal) return null;
        return (
            <Portal
                body={
                    <AssignModal
                        assignTo={assignToDetails.label}
                        type={assignToDetails.type}
                        itemDetails={assignToDetails.details}
                        availableItems={assignToDetails.availableItems}
                        assignedItems={assignToDetails.assignedItems}
                        onCancel={() => this.setState({ showAssignModal: false })}
                        onAssign={this.onAssignItem}
                    />
                }
                onCancel={() => this.setState({ showAssignModal: false })}
            />
        );
    };

    handleAssignToTrade = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "trades");
        const {
            tableTemplateReducer: {
                getAssignModalDetailsResponse: { trades }
            }
        } = this.props;

        await this.setState({
            assignToDetails: {
                ...assignToDetails,
                type: "trade",
                label: "Trades",
                details: item,
                availableItems: trades && (trades.available_trades || []),
                assignedItems: trades && (trades.assigned_trades || [])
            },
            showAssignModal: true
        });
    };

    handleAssignToSystem = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "systems");
        const {
            tableTemplateReducer: {
                getAssignModalDetailsResponse: { systems }
            }
        } = this.props;
        await this.setState({
            assignToDetails: {
                ...assignToDetails,
                type: "system",
                label: "Systems",
                details: item,
                availableItems: systems && (systems.available_systems || []),
                assignedItems: systems && (systems.assigned_systems || [])
            },
            showAssignModal: true
        });
    };

    handleAssignToSubSystem = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "sub_systems");
        const {
            tableTemplateReducer: {
                getAssignModalDetailsResponse: { sub_systems }
            }
        } = this.props;
        await this.setState({
            assignToDetails: {
                ...assignToDetails,
                type: "subsystem",
                label: "Sub Systems",
                details: item,
                availableItems: sub_systems && (sub_systems.available_sub_systems || []),
                assignedItems: sub_systems && (sub_systems.assigned_sub_systems || [])
            },
            showAssignModal: true
        });
    };

    hasAssignToSpecialReport = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "special_reports");
        const {
            tableTemplateReducer: {
                getAssignModalDetailsResponse: { special_reports }
            }
        } = this.props;
        await this.setState({
            assignToDetails: {
                ...assignToDetails,
                type: "specialreport",
                label: "Special Reports",
                details: item,
                availableItems: special_reports && (special_reports.available_special_reports || []),
                assignedItems: special_reports && (special_reports.assigned_special_reports || [])
            },
            showAssignModal: true
        });
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, tableTemplateTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    hasAssignToReportParagraph = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "report_paragraphs");
        const {
            tableTemplateReducer: {
                getAssignModalDetailsResponse: { report_paragraphs }
            }
        } = this.props;
        await this.setState({
            assignToDetails: {
                ...assignToDetails,
                type: "reportparagraph",
                label: "Report Paragraphs",
                details: item,
                availableItems: report_paragraphs && (report_paragraphs.available_report_paragraphs || []),
                assignedItems: report_paragraphs && (report_paragraphs.assigned_report_paragraphs || [])
            },
            showAssignModal: true
        });
    };

    hasAssignToChildParagraph = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "child_paragraphs");
        const {
            tableTemplateReducer: {
                getAssignModalDetailsResponse: { child_paragraphs }
            }
        } = this.props;
        await this.setState({
            assignToDetails: {
                ...assignToDetails,
                type: "childparagraph",
                label: "Child Paragraphs",
                details: item,
                availableItems: child_paragraphs && (child_paragraphs.available_child_paragraphs || []),
                assignedItems: child_paragraphs && (child_paragraphs.assigned_child_paragraphs || [])
            },
            showAssignModal: true
        });
    };

    onAssignItem = async data => {
        const { assignToDetails } = this.state;
        if (assignToDetails.type === "trade") {
            await this.props.assignItems(assignToDetails.details.id, { master_trade_ids: data }, "assign_trades");
        } else if (assignToDetails.type === "system") {
            await this.props.assignItems(assignToDetails.details.id, { master_system_ids: data }, "assign_systems");
        } else if (assignToDetails.type === "subsystem") {
            await this.props.assignItems(assignToDetails.details.id, { master_sub_system_ids: data }, "assign_sub_systems");
        } else if (assignToDetails.type === "specialreport") {
            await this.props.assignItems(assignToDetails.details.id, { special_report_ids: data }, "assign_special_reports");
        } else if (assignToDetails.type === "reportparagraph") {
            await this.props.assignItems(assignToDetails.details.id, { report_paragraph_ids: data }, "assign_report_paragraphs");
        } else if (assignToDetails.type === "childparagraph") {
            await this.props.assignItems(assignToDetails.details.id, { child_paragraph_ids: data }, "assign_child_paragraphs");
        }
        const {
            tableTemplateReducer: {
                assignItemsResponse: { success, message }
            }
        } = this.props;
        await this.setState({ alertMessage: message });
        this.showAlert();
        if (success) {
            this.setState({
                showAssignModal: false
            });
        }
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            infoTabsData,
            selectedTableTemplate,
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
            hasAssign = true,
            hasEdit = true,
            hasAdd = true
        } = this.props;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedTableTemplate={id || selectedTableTemplate}
                        handleAddTableTemplate={this.handleAddTableTemplate}
                        handleUpdateTableTemplate={this.handleUpdateTableTemplate}
                        getDataById={this.getDataById}
                    />
                ) : section === "tabletemplateinfo" ? (
                    <TableTemplateInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteTableTemplate}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreTableTemplateLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={hasEdit && checkPermission("forms", "table_templates", "edit")}
                        hasDelete={checkPermission("forms", "table_templates", "delete")}
                        hasLogView={checkPermission("logs", "table_templates", "view")}
                        hasLogDelete={checkPermission("logs", "table_templates", "delete")}
                        hasLogRestore={checkPermission("logs", "table_templates", "restore")}
                        hasInfoPage={checkPermission("forms", "table_templates", "view")}
                        entity="table_templates"
                    />
                ) : (
                    <TableTemplateMain
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
                        handleDeleteTableTemplate={this.handleDeleteTableTemplate}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterTableTemplate={this.getListForCommonFilter}
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
                        hasAssignToTrade={hasAssign}
                        hasAssignToSystem={hasAssign}
                        hasAssignToSubSystem={hasAssign}
                        handleAssignToTrade={this.handleAssignToTrade}
                        handleAssignToSystem={this.handleAssignToSystem}
                        handleAssignToSubSystem={this.handleAssignToSubSystem}
                        hasAssignToSpecialReport={this.hasAssignToSpecialReport}
                        hasAssignToReportParagraph={this.hasAssignToReportParagraph}
                        hasAssignToChildParagraph={this.hasAssignToChildParagraph}
                        hasExport={checkPermission("forms", "table_templates", "export")}
                        showAddButton={hasAdd && checkPermission("forms", "table_templates", "create")}
                        hasEdit={hasEdit && checkPermission("forms", "table_templates", "edit")}
                        hasDelete={checkPermission("forms", "table_templates", "delete")}
                        hasInfoPage={checkPermission("forms", "table_templates", "view")}
                        entity="table_templates"
                    />
                )}
                {this.renderConfirmationModal()}
                {this.renderConfirmationModalLog()}
                {this.renderAssignModalLog()}
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
    const { projectReducer, commonReducer, tableTemplateReducer } = state;
    return { projectReducer, commonReducer, tableTemplateReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...tableTemplateActions,
        ...CommonActions
    })(index)
);
