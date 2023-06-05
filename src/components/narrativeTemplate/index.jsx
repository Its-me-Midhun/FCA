import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import narrativeTemplateActions from "./actions";
import NarrativeTemplateMain from "./components/NarrativeTemplateMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { narrativeTemplateTableData } from "./components/tableConfig";
import NarrativeTemplateInfo from "./components/NarrativeTemplateInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission } from "../../config/utils";
import AssignModal from "../common/components/AssignPopups/assign";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.narrativeTemplateReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.narrativeTemplateReducer.entityParams.selectedRowId,
        params: this.props.narrativeTemplateReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedNarrativeTemplate: this.props.match.params.id || this.props.narrativeTemplateReducer.entityParams.selectedEntity,
        tableData: {
            keys: narrativeTemplateTableData.keys,
            config: this.props.narrativeTemplateReducer.entityParams.tableConfig ||_.cloneDeep(narrativeTemplateTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.narrativeTemplateReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.narrativeTemplateReducer.entityParams.filterParams,
        historyPaginationParams: this.props.narrativeTemplateReducer.entityParams.historyPaginationParams,
        historyParams: this.props.narrativeTemplateReducer.entityParams.historyParams,
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
        await this.refreshNarrativeTemplateList();
    };

    refreshNarrativeTemplateList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let narrativeTemplateList = [];
        let totalCount = 0;
        await this.props.getNarrativeTemplates(params, dynamicUrl);
        narrativeTemplateList = this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse
            ? this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse.narrative_templates || []
            : [];
        totalCount = this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse
            ? this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse.count || 0
            : 0;

        if (narrativeTemplateList && !narrativeTemplateList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getNarrativeTemplates(this.state.params, dynamicUrl);
            narrativeTemplateList = this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse
                ? this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse.narrative_templates || []
                : [];
            totalCount = this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse
                ? this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse.count || 0
                : 0;
        }

        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.narrativeTemplates
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.narrativeTemplates || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.narrativeTemplate_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.narrativeTemplate_logs || {}
                : {};

        if (
            narrativeTemplateList &&
            !narrativeTemplateList.length &&
            this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse &&
            this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse.error
        ) {
            await this.setState({ alertMessage: this.props.narrativeTemplateReducer.getNarrativeTemplatesResponse.error });
            this.showAlert();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: narrativeTemplateList,
                config: this.props.narrativeTemplateReducer.entityParams.tableConfig || tableData.config
            },
            narrativeTemplateList,
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
        await this.refreshNarrativeTemplateList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "NarrativeTemplate",
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
        await this.props.updateNarrativeTemplateEntityParams(entityParams);
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
        await this.refreshNarrativeTemplateList();
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
                config: _.cloneDeep(narrativeTemplateTableData.config)
            },
             wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshNarrativeTemplateList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshNarrativeTemplateList();
    };

    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters, list }, dynamicUrl);
        return (
            (this.props.narrativeTemplateReducer.getListForCommonFilterResponse &&
                this.props.narrativeTemplateReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshNarrativeTemplateList();
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
        await this.refreshNarrativeTemplateList();
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
        await this.refreshNarrativeTemplateList();
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
        await this.refreshNarrativeTemplateList();
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

    showEditPage = narrativeTemplateId => {
        const { history } = this.props;
        this.setState({
            selectedNarrativeTemplate: narrativeTemplateId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit NarrativeTemplate",
            path: `/narrativetemplate/edit/${narrativeTemplateId}`
        });
        history.push(`/narrativetemplate/edit/${narrativeTemplateId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedNarrativeTemplate: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add NarrativeTemplate",
            path: `/narrativetemplate/add`
        });
        history.push(`/narrativetemplate/add`);
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

    handleAddNarrativeTemplate = async narrativeTemplate => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.addNarrativeTemplate({ narrative_template: narrativeTemplate }, dynamicUrl);
        if (
            this.props.narrativeTemplateReducer.addNarrativeTemplateResponse &&
            this.props.narrativeTemplateReducer.addNarrativeTemplateResponse.error
        ) {
            await this.setState({
                alertMessage: this.props.narrativeTemplateReducer.addNarrativeTemplateResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    this.props.narrativeTemplateReducer.addNarrativeTemplateResponse &&
                    this.props.narrativeTemplateReducer.addNarrativeTemplateResponse.message
            });
            this.showAlert();
            await this.refreshNarrativeTemplateList();
            history.push(`/narrativetemplate`);
        }
    };

    handleUpdateNarrativeTemplate = async (narrativeTemplate_id, narrativeTemplate) => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.updateNarrativeTemplate(narrativeTemplate_id, { narrative_template: narrativeTemplate }, dynamicUrl);
        if (
            this.props.narrativeTemplateReducer.updateNarrativeTemplateResponse &&
            this.props.narrativeTemplateReducer.updateNarrativeTemplateResponse.error
        ) {
            await this.setState({ alertMessage: this.props.narrativeTemplateReducer.updateNarrativeTemplateResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.narrativeTemplateReducer.updateNarrativeTemplateResponse &&
                        this.props.narrativeTemplateReducer.updateNarrativeTemplateResponse.message) ||
                    "NarrativeTemplate updated successfully"
            });
            this.showAlert();
            await this.refreshNarrativeTemplateList();
            history.push(`/narrativetemplate`);
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

    handleDeleteNarrativeTemplate = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedNarrativeTemplate: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this NarrativeTemplate?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteNarrativeTemplateOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteNarrativeTemplateOnConfirm = async () => {
        const { selectedNarrativeTemplate } = this.state;
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.deleteNarrativeTemplate(selectedNarrativeTemplate, dynamicUrl);
        if (
            this.props.narrativeTemplateReducer.deleteNarrativeTemplateResponse &&
            this.props.narrativeTemplateReducer.deleteNarrativeTemplateResponse.error
        ) {
            await this.setState({ alertMessage: this.props.narrativeTemplateReducer.deleteNarrativeTemplateResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshNarrativeTemplateList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/narrativetemplate");
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
        await this.refreshNarrativeTemplateList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Narrative Template",
                    path: `/narrativetemplate/narrativetemplateinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        history.push(
            `/narrativetemplate/narrativetemplateinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async narrativeTemplateId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getNarrativeTemplateById(narrativeTemplateId, dynamicUrl);
        return this.props.narrativeTemplateReducer.getNarrativeTemplateByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.setState({ tableLoading: true });
        await this.props.exportNarrativeTemplates(dynamicUrl, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({ tableLoading: false });
        if (
            this.props.narrativeTemplateReducer.narrativeTemplateExportResponse &&
            this.props.narrativeTemplateReducer.narrativeTemplateExportResponse.error
        ) {
            await this.setState({ alertMessage: this.props.narrativeTemplateReducer.narrativeTemplateExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllNarrativeTemplateLogs(buildingId, historyParams);
        const {
            narrativeTemplateReducer: {
                getAllNarrativeTemplateLogsResponse: { logs, count }
            }
        } = this.props;
        if (
            this.props.narrativeTemplateReducer.getAllNarrativeTemplateLogsResponse &&
            this.props.narrativeTemplateReducer.getAllNarrativeTemplateLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.narrativeTemplateReducer.getAllNarrativeTemplateLogsResponse.error });
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
        await this.props.deleteNarrativeTemplateLog(selectedLog);
        if (
            this.props.narrativeTemplateReducer.deleteNarrativeTemplateLogResponse &&
            this.props.narrativeTemplateReducer.deleteNarrativeTemplateLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.narrativeTemplateReducer.deleteNarrativeTemplateLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreNarrativeTemplateLog(id);
        if (
            this.props.narrativeTemplateReducer.restoreNarrativeTemplateLogResponse &&
            this.props.narrativeTemplateReducer.restoreNarrativeTemplateLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.narrativeTemplateReducer.restoreNarrativeTemplateLogResponse.error });
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
            narrativeTemplateReducer: {
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
            narrativeTemplateReducer: {
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
            narrativeTemplateReducer: {
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
            narrativeTemplateReducer: {
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

    hasAssignToReportParagraph = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "report_paragraphs");
        const {
            narrativeTemplateReducer: {
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
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible,narrativeTemplateTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    hasAssignToChildParagraph = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "child_paragraphs");
        const {
            narrativeTemplateReducer: {
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
            narrativeTemplateReducer: {
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
            selectedNarrativeTemplate,
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
            hasAdd = true,
            dynamicUrl
        } = this.props;

        console.log(`dynamixccUrl`, dynamicUrl);

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedNarrativeTemplate={id || selectedNarrativeTemplate}
                        handleAddNarrativeTemplate={this.handleAddNarrativeTemplate}
                        handleUpdateNarrativeTemplate={this.handleUpdateNarrativeTemplate}
                        getDataById={this.getDataById}
                    />
                ) : section === "narrativetemplateinfo" ? (
                    <NarrativeTemplateInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteNarrativeTemplate}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreNarrativeTemplateLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={hasEdit && checkPermission("forms", "narrative_templates", "edit")}
                        hasDelete={checkPermission("forms", "narrative_templates", "delete")}
                        hasLogView={checkPermission("logs", "narrative_templates", "view")}
                        hasLogDelete={checkPermission("logs", "narrative_templates", "delete")}
                        hasLogRestore={checkPermission("logs", "narrative_templates", "restore")}
                        hasInfoPage={checkPermission("forms", "narrative_templates", "view")}
                        entity="narrative_templates"
                    />
                ) : (
                    <NarrativeTemplateMain
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
                        handleDeleteNarrativeTemplate={this.handleDeleteNarrativeTemplate}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterNarrativeTemplate={this.getListForCommonFilter}
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
                        hasExport={checkPermission("forms", "narrative_templates", "export")}
                        showAddButton={hasAdd && checkPermission("forms", "narrative_templates", "create")}
                        hasEdit={hasEdit && checkPermission("forms", "narrative_templates", "edit")}
                        hasDelete={checkPermission("forms", "narrative_templates", "delete")}
                        hasInfoPage={checkPermission("forms", "narrative_templates", "view")}
                        entity="narrative_templates"
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
    const { projectReducer, commonReducer, narrativeTemplateReducer } = state;
    return { projectReducer, commonReducer, narrativeTemplateReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...narrativeTemplateActions,
        ...CommonActions
    })(index)
);
