import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import reportNoteTemplateActions from "./actions";
import ReportNoteTemplateMain from "./components/ReportNoteTemplateMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { reportNoteTemplateTableData } from "./components/tableConfig";
import ReportNoteTemplateInfo from "./components/ReportNoteTemplateInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission, removeOwnEntityFromList } from "../../config/utils";
import AssignModal from "../common/components/AssignPopups/assign";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.reportNoteTemplateReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.reportNoteTemplateReducer.entityParams.selectedRowId,
        params: this.props.reportNoteTemplateReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedReportNoteTemplate: this.props.match.params.id || this.props.reportNoteTemplateReducer.entityParams.selectedEntity,
        tableData: {
            keys: reportNoteTemplateTableData.keys,
            config: this.props.reportNoteTemplateReducer.entityParams.tableConfig || _.cloneDeep(reportNoteTemplateTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.reportNoteTemplateReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.reportNoteTemplateReducer.entityParams.filterParams,
        historyPaginationParams: this.props.reportNoteTemplateReducer.entityParams.historyPaginationParams,
        historyParams: this.props.reportNoteTemplateReducer.entityParams.historyParams,
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
        await this.refreshReportNoteTemplateList();
    };

    refreshReportNoteTemplateList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let reportNoteTemplateList = [];
        let totalCount = 0;
        await this.props.getReportNoteTemplates(params, dynamicUrl);
        reportNoteTemplateList = this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse
            ? this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse.report_note_templates || []
            : [];
        totalCount = this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse
            ? this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse.count || 0
            : 0;

        if (reportNoteTemplateList && !reportNoteTemplateList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getReportNoteTemplates(this.state.params, dynamicUrl);
            reportNoteTemplateList = this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse
                ? this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse.report_note_templates || []
                : [];
            totalCount = this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse
                ? this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse.count || 0
                : 0;
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.reportNoteTemplates
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.reportNoteTemplates || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.reportNoteTemplate_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.reportNoteTemplate_logs || {}
                : {};

        if (
            reportNoteTemplateList &&
            !reportNoteTemplateList.length &&
            this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse &&
            this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportNoteTemplateReducer.getReportNoteTemplatesResponse.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...tableData,
                data: reportNoteTemplateList,
                config: this.props.reportNoteTemplateReducer.entityParams.tableConfig || tableData.config
            },
            reportNoteTemplateList,
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
        await this.refreshReportNoteTemplateList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "ReportNoteTemplate",
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
        await this.props.updateReportNoteTemplateEntityParams(entityParams);
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
        await this.refreshReportNoteTemplateList();
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
                config: _.cloneDeep(reportNoteTemplateTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshReportNoteTemplateList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshReportNoteTemplateList();
    };

    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters,  list }, dynamicUrl);
        return (
            (this.props.reportNoteTemplateReducer.getListForCommonFilterResponse &&
                this.props.reportNoteTemplateReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshReportNoteTemplateList();
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
        await this.refreshReportNoteTemplateList();
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
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, reportNoteTemplateTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.refreshReportNoteTemplateList();
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
        await this.refreshReportNoteTemplateList();
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

    showEditPage = async reportNoteTemplateId => {
        const { history } = this.props;
        await this.setState({
            selectedReportNoteTemplate: reportNoteTemplateId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit ReportNoteTemplate",
            path: `/reportNotetemplate/edit/${reportNoteTemplateId}`,
            isInnerTab: true
        });
        history.push(`/reportNotetemplate/edit/${reportNoteTemplateId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedReportNoteTemplate: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add ReportNoteTemplate",
            path: `/reportNotetemplate/add`
        });
        history.push(`/reportNotetemplate/add`);
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

    handleAddReportNoteTemplate = async reportNoteTemplate => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.addReportNoteTemplate({ report_note_template: reportNoteTemplate }, dynamicUrl);
        if (
            this.props.reportNoteTemplateReducer.addReportNoteTemplateResponse &&
            this.props.reportNoteTemplateReducer.addReportNoteTemplateResponse.error
        ) {
            await this.setState({
                alertMessage: this.props.reportNoteTemplateReducer.addReportNoteTemplateResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    this.props.reportNoteTemplateReducer.addReportNoteTemplateResponse &&
                    this.props.reportNoteTemplateReducer.addReportNoteTemplateResponse.message
            });
            this.showAlert();
            await this.refreshReportNoteTemplateList();
            history.push(`/reportNotetemplate`);
        }
    };

    handleUpdateReportNoteTemplate = async (reportNoteTemplate_id, reportNoteTemplate) => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.updateReportNoteTemplate(reportNoteTemplate_id, { report_note_template: reportNoteTemplate }, dynamicUrl);
        if (
            this.props.reportNoteTemplateReducer.updateReportNoteTemplateResponse &&
            this.props.reportNoteTemplateReducer.updateReportNoteTemplateResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportNoteTemplateReducer.updateReportNoteTemplateResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.reportNoteTemplateReducer.updateReportNoteTemplateResponse &&
                        this.props.reportNoteTemplateReducer.updateReportNoteTemplateResponse.message) ||
                    "ReportNoteTemplate updated successfully"
            });
            this.showAlert();
            await this.refreshReportNoteTemplateList();
            // history.push(`/reportNotetemplate`);
            history.push(findPrevPathFromBreadCrumpData() || `/subSystem/subSysteminfo/${dynamicUrl.split("/")[2]}/reportNotetemplate`);
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

    handleDeleteReportNoteTemplate = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedReportNoteTemplate: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this ReportNoteTemplate?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteReportNoteTemplateOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteReportNoteTemplateOnConfirm = async () => {
        const { selectedReportNoteTemplate } = this.state;
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.deleteReportNoteTemplate(selectedReportNoteTemplate, dynamicUrl);
        if (
            this.props.reportNoteTemplateReducer.deleteReportNoteTemplateResponse &&
            this.props.reportNoteTemplateReducer.deleteReportNoteTemplateResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportNoteTemplateReducer.deleteReportNoteTemplateResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshReportNoteTemplateList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/reportNotetemplate");
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
        await this.refreshReportNoteTemplateList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Reportnote Template",
                    path: `/reportNotetemplate/reportNotetemplateinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/reportNotetemplate/reportNotetemplateinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async reportNoteTemplateId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getReportNoteTemplateById(reportNoteTemplateId, dynamicUrl);
        return this.props.reportNoteTemplateReducer.getReportNoteTemplateByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.setState({ tableLoading: true });
        await this.props.exportReportNoteTemplates(dynamicUrl, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (
            this.props.reportNoteTemplateReducer.reportNoteTemplateExportResponse &&
            this.props.reportNoteTemplateReducer.reportNoteTemplateExportResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportNoteTemplateReducer.reportNoteTemplateExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllReportNoteTemplateLogs(buildingId, historyParams);
        const {
            reportNoteTemplateReducer: {
                getAllReportNoteTemplateLogsResponse: { logs, count }
            }
        } = this.props;
        if (
            this.props.reportNoteTemplateReducer.getAllReportNoteTemplateLogsResponse &&
            this.props.reportNoteTemplateReducer.getAllReportNoteTemplateLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportNoteTemplateReducer.getAllReportNoteTemplateLogsResponse.error });
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
        await this.props.deleteReportNoteTemplateLog(selectedLog);
        if (
            this.props.reportNoteTemplateReducer.deleteReportNoteTemplateLogResponse &&
            this.props.reportNoteTemplateReducer.deleteReportNoteTemplateLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportNoteTemplateReducer.deleteReportNoteTemplateLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreReportNoteTemplateLog(id);
        if (
            this.props.reportNoteTemplateReducer.restoreReportNoteTemplateLogResponse &&
            this.props.reportNoteTemplateReducer.restoreReportNoteTemplateLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.reportNoteTemplateReducer.restoreReportNoteTemplateLogResponse.error });
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
            reportNoteTemplateReducer: {
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
            reportNoteTemplateReducer: {
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
            reportNoteTemplateReducer: {
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

    onAssignItem = async data => {
        const { assignToDetails } = this.state;
        if (assignToDetails.type === "trade") {
            await this.props.assignItems(assignToDetails.details.id, { master_trade_ids: data }, "assign_trades");
        } else if (assignToDetails.type === "system") {
            await this.props.assignItems(assignToDetails.details.id, { master_system_ids: data }, "assign_systems");
        } else if (assignToDetails.type === "subsystem") {
            await this.props.assignItems(assignToDetails.details.id, { master_sub_system_ids: data }, "assign_sub_systems");
        }
        const {
            reportNoteTemplateReducer: {
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
            selectedReportNoteTemplate,
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
                        selectedReportNoteTemplate={id || selectedReportNoteTemplate}
                        handleAddReportNoteTemplate={this.handleAddReportNoteTemplate}
                        handleUpdateReportNoteTemplate={this.handleUpdateReportNoteTemplate}
                        getDataById={this.getDataById}
                    />
                ) : section === "reportNotetemplateinfo" ? (
                    <ReportNoteTemplateInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteReportNoteTemplate}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreReportNoteTemplateLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={hasEdit && checkPermission("forms", "report_note_templates", "edit")}
                        hasDelete={checkPermission("forms", "report_note_templates", "delete")}
                        hasLogView={checkPermission("logs", "report_note_templates", "view")}
                        hasLogDelete={checkPermission("logs", "report_note_templates", "delete")}
                        hasLogRestore={checkPermission("logs", "report_note_templates", "restore")}
                        hasInfoPage={checkPermission("forms", "report_note_templates", "view")}
                        entity="report_note_templates"
                    />
                ) : (
                    <ReportNoteTemplateMain
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
                        handleDeleteReportNoteTemplate={this.handleDeleteReportNoteTemplate}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterReportNoteTemplate={this.getListForCommonFilter}
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
                        hasAssignToTrade={false}
                        hasAssignToSystem={false}
                        hasAssignToSubSystem={hasAssign}
                        handleAssignToTrade={this.handleAssignToTrade}
                        handleAssignToSystem={this.handleAssignToSystem}
                        handleAssignToSubSystem={this.handleAssignToSubSystem}
                        hasExport={checkPermission("forms", "report_note_templates", "export")}
                        showAddButton={hasAdd && checkPermission("forms", "report_note_templates", "create")}
                        hasEdit={hasEdit && checkPermission("forms", "report_note_templates", "edit")}
                        hasDelete={checkPermission("forms", "report_note_templates", "delete")}
                        hasInfoPage={checkPermission("forms", "report_note_templates", "view")}
                        entity="report_note_templates"
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
    const { projectReducer, commonReducer, reportNoteTemplateReducer } = state;
    return { projectReducer, commonReducer, reportNoteTemplateReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...reportNoteTemplateActions,
        ...CommonActions
    })(index)
);
