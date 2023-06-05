import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import meterActions from "./actions";
import MeterTemplateMain from "./components/MeterTemplateMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { electricTableData } from "./components/tableConfig";
import MeterTemplateInfo from "./components/MeterTemplateInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission, removeOwnEntityFromList } from "../../config/utils";
import AssignModal from "../common/components/AssignPopups/assign";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.electricReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.electricReducer.entityParams.selectedRowId,
        params: this.props.electricReducer.entityParams.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedMeterTemplate: this.props.match.params.id || this.props.electricReducer.entityParams.selectedEntity,
        tableData: {
            keys: electricTableData.keys,
            config: this.props.electricReducer.entityParams.tableConfig || electricTableData.config
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.electricReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.electricReducer.entityParams.filterParams,
        historyPaginationParams: this.props.electricReducer.entityParams.historyPaginationParams,
        historyParams: this.props.electricReducer.entityParams.historyParams,
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
        },
        summaryRowData: {
            kw_cost: "",
            kw_usage: "",
            kwh_cost: "",
            kwh_usage: "",
            mmbtu_usage: "",
            total_electric_cost: ""
        }
    };

    componentDidMount = async () => {
        await this.refreshMeterList();
    };

    refreshMeterList = async () => {
        await this.setState({ isLoading: true });

        const {
            match: {
                params: { id, tab, section, settingType }
            }
        } = this.props;

        const { params, paginationParams, tableData } = this.state;

        const subParams = {};
        switch (section) {
            case "energyinfo":
                subParams.client_id = id;
                break;
            case "regioninfo":
                subParams.region_id = id;
                break;
            case "siteinfo":
                subParams.site_id = id;
                break;
            case "buildinginfo":
                subParams.building_id = id;
                break;

            default:
                break;
        }

        let meterList = [];
        let totalCount = 0;
        let totals = {};
        await this.props.getAllReadings({ ...params, ...subParams, meter_type: tab });
        meterList = this.props.electricReducer.getAllMeterReadingsResponse ? this.props.electricReducer?.getAllMeterReadingsResponse?.readings : [];
        totalCount = this.props.electricReducer.getAllMeterReadingsResponse ? this.props.electricReducer.getAllMeterReadingsResponse?.count : 0;
        totals = this.props.electricReducer.getAllMeterReadingsResponse ? this.props.electricReducer.getAllMeterReadingsResponse?.totals : {};

        if (meterList && !meterList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getAllReadings({ ...params, ...subParams, meter_type: tab });
            meterList = this.props.electricReducer.getAllMeterReadingsResponse ? this.props.electricReducer?.getAllMeterReadingsResponse : [];
            totalCount = this.props.electricReducer.getAllMeterReadingsResponse ? this.props.electricReducer.getAllMeterReadingsResponse?.count : 0;
        }

        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.meter_readings
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.meter_readings || {}
                : {};
        // let region_logs = {};
        // region_logs =
        //     this.props.commonReducer.getMenuItemsResponse &&
        //     this.props.commonReducer.getMenuItemsResponse.user_permissions &&
        //     this.props.commonReducer.getMenuItemsResponse.user_permissions.narrativeTemplate_logs
        //         ? this.props.commonReducer.getMenuItemsResponse.user_permissions.narrativeTemplate_logs || {}
        //         : {};

        if (
            meterList &&
            !meterList.length &&
            this.props.electricReducer.getAllMeterReadingsResponse &&
            this.props.electricReducer.getAllMeterReadingsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.electricReducer.getAllMeterReadingsResponse.error });
            this.showAlert();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: meterList,
                config: this.props.electricReducer.entityParams.tableConfig || tableData.config
            },
            meterList,
            showWildCardFilter: this.state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            summaryRowData: {
                kw_cost: totals?.kw_cost || 0,
                kw_usage: totals?.kw_usage || 0,
                kwh_cost: totals?.kwh_cost || 0,
                kwh_usage: totals?.kwh_usage || 0,
                mmbtu_usage: totals?.mmbtu_usage || 0,
                total_electric_cost: totals?.total_electric_cost || 0
            },
            permissions: project_permission,
            // logPermission: region_logs,
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
        await this.refreshMeterList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Electricity",
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
        await this.refreshMeterList();
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
                ...this.state.tableData
            },

            wildCardFilterParams: {},
            filterParams: {}
        });
        this.updateEntityParams();
        await this.refreshMeterList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshMeterList();
    };

    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");

        const {
            match: {
                params: { id, section, tab }
            }
        } = this.props;
        const subParams = {};
        switch (section) {
            case "energyinfo":
                subParams.client_id = id;
                break;
            case "regioninfo":
                subParams.region_id = id;
                break;
            case "siteinfo":
                subParams.site_id = id;
                break;
            case "buildinginfo":
                subParams.building_id = id;
                break;

            default:
                break;
        }
        const { search, filters, list } = this.state.params;

        await this.props.getListForCommonFilter({ ...params, ...subParams, search, filters, list, meter_type: tab });
        return (this.props.electricReducer.getListForCommonFilterResponse && this.props.electricReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshMeterList();
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
        await this.refreshMeterList();
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
        await this.refreshMeterList();
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
        await this.refreshMeterList();
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

    showEditPage = meterTemplateId => {
        const { history } = this.props;
        const { location } = history;

        this.setState({
            selectedMeterTemplate: meterTemplateId
        });

        if (location.pathname.substr(location.pathname.lastIndexOf("/") + 1) === "basicdetails") {
            let path = location.pathname;
            path = path.slice(0, path.lastIndexOf("/"));
            history.push(`${path}/edit`);

            addToBreadCrumpData({
                key: "edit",
                name: "Edit Electricity Reading",
                path: `${path}/edit`
            });
            return;
        }

        history.push(`${location.pathname}/edit`);

        addToBreadCrumpData({
            key: "edit",
            name: "Edit Electricity Values",
            path: `${location.pathname}/edit`
        });
    };

    showAddForm = () => {
        const { history } = this.props;

        const { location } = history;

        history.push(`${location.pathname}/add`);
        this.setState({
            selectedMeterTemplate: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Electricity Values",
            path: `${location.pathname}/add`
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

    handleAddMeterTemplate = async narrativeTemplate => {
        const { history } = this.props;
        const { location } = history;
        let path = location.pathname;
        path = path.slice(0, path.lastIndexOf("/"));

        await this.props.addMeterTemplate(narrativeTemplate);
        if (this.props.electricReducer.addMeterTemplateResponse && this.props.electricReducer.addMeterTemplateResponse.error) {
            await this.setState({
                alertMessage: this.props.electricReducer.addMeterTemplateResponse.error
            });
            this.showAlert();
        } else {
            await this.setState({
                alertMessage: this.props.electricReducer.addMeterTemplateResponse && this.props.electricReducer.addMeterTemplateResponse.message
            });
            this.showAlert();
            await this.refreshMeterList();
            history.push(path);
        }

        this.setState({ isLoading: false });
    };

    handleUpdateMeterTemplate = async (meterTemplate_id, meterTemplate) => {
        const { history } = this.props;
        const { location } = history;
        let path = location.pathname;
        path = path.slice(0, path.lastIndexOf("/"));

        await this.props.updateMeterTemplate(meterTemplate_id, { ...meterTemplate });
        if (this.props.electricReducer.updateMeterTemplateResponse && this.props.electricReducer.updateMeterTemplateResponse.error) {
            await this.setState({ alertMessage: this.props.electricReducer.updateMeterTemplateResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.electricReducer.updateMeterTemplateResponse && this.props.electricReducer.updateMeterTemplateResponse.message) ||
                    "Values updated successfully"
            });
            this.showAlert();
            await this.refreshMeterList();
            history.push(path);
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

    handleDeleteMeterTemplate = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedMeterTemplate: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Meter Reading?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteMeterTemplateOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteMeterTemplateOnConfirm = async () => {
        const { selectedMeterTemplate } = this.state;
        const { history } = this.props;
        const { location } = history;
        let path = location.pathname;

        await this.props.deleteMeterTemplate(selectedMeterTemplate);
        if (this.props.electricReducer.deleteMeterTemplateResponse && this.props.electricReducer.deleteMeterTemplateResponse.error) {
            await this.setState({ alertMessage: this.props.electricReducer.deleteMeterTemplateResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.setState({ alertMessage: this.props.electricReducer.deleteMeterTemplateResponse.message || "Deleted successfully" });
            await this.refreshMeterList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
            if (location.pathname.substr(location.pathname.lastIndexOf("/") + 1) === "basicdetails") {
                path = path.slice(0, path.lastIndexOf("/"));
                history.push(path);
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
        await this.refreshMeterList();
    };

    showInfoPage = async meterTemplateId => {
        const { history } = this.props;

        const { location } = history;
        await this.setState({
            selectedMeterTemplate: meterTemplateId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Electric Reading Details",
                    path: `${location.pathname}/${"basicdetails"}`
                }
            ]
        });

        history.push(`${location.pathname}/${"basicdetails"}`);
    };

    getDataById = async meterTemplateId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getMeterTemplateById(meterTemplateId);
        return this.props.electricReducer.getMeterTemplateByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { params } = this.state;
        await this.setState({ tableLoading: true });
        const {
            match: {
                params: { id, section }
            }
        } = this.props;
        const subParams = {};
        switch (section) {
            case "energyinfo":
                subParams.client_id = id;
                break;
            case "regioninfo":
                subParams.region_id = id;
                break;
            case "siteinfo":
                subParams.site_id = id;
                break;
            case "buildinginfo":
                subParams.building_id = id;
                break;

            default:
                break;
        }
        const {
            tableData: { keys, config }
        } = this.state;
        let hide_columns = [""];
        keys.map((keyItem, i) => {
            if (config && !config[keyItem]?.isVisible) {
                hide_columns.push(config[keyItem]?.label);
            }
        });
        await this.props.exportNarrativeTemplates({
            meter_type: "Electricity",
            hide_columns,
            ...params,
            ...subParams
        });
        this.setState({ tableLoading: false });
        if (this.props.electricReducer.narrativeTemplateExportResponse && this.props.electricReducer.narrativeTemplateExportResponse.error) {
            await this.setState({ alertMessage: this.props.electricReducer.narrativeTemplateExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async () => {
        const { historyParams } = this.state;
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        await this.props.getAllNarrativeTemplateLogs(this.state.selectedMeterTemplate, { ...historyParams, meter_type: tab });
        const {
            electricReducer: {
                getAllNarrativeTemplateLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.electricReducer.getAllNarrativeTemplateLogsResponse && this.props.electricReducer.getAllNarrativeTemplateLogsResponse.error) {
            await this.setState({ alertMessage: this.props.electricReducer.getAllNarrativeTemplateLogsResponse.error });
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
        if (this.props.electricReducer.deleteNarrativeTemplateLogResponse && this.props.electricReducer.deleteNarrativeTemplateLogResponse.error) {
            await this.setState({ alertMessage: this.props.electricReducer.deleteNarrativeTemplateLogResponse.error });
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
        if (this.props.electricReducer.restoreNarrativeTemplateLogResponse && this.props.electricReducer.restoreNarrativeTemplateLogResponse.error) {
            await this.setState({ alertMessage: this.props.electricReducer.restoreNarrativeTemplateLogResponse.error });
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
            electricReducer: {
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
            electricReducer: {
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
            electricReducer: {
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
            electricReducer: {
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
            selectedMeterTemplate,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission,
            summaryRowData,
            isLoading
        } = this.state;
        const {
            match: {
                params: { section, id, settingType }
            },
            hasAssign = true,
            hasEdit = true,
            hasAdd = true
        } = this.props;

        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                {settingType === "add" || settingType === "edit" ? (
                    <Form
                        selectedMeterTemplate={selectedMeterTemplate}
                        handleAddMeterTemplate={this.handleAddMeterTemplate}
                        handleUpdateMeterTemplate={this.handleUpdateMeterTemplate}
                        getDataById={this.getDataById}
                        permissions={permissions}
                        type={settingType}
                        sect={section}
                        sectId={id}
                    />
                ) : settingType === "basicdetails" ? (
                    <MeterTemplateInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        selectedMeterTemplate={selectedMeterTemplate}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleEdit={this.showEditPage}
                        handleDeleteItem={this.handleDeleteMeterTemplate}
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
                        hasEdit={checkPermission("forms", "meter_readings", "edit")}
                        hasDelete={checkPermission("forms", "meter_readings", "delete")}
                        hasLogView={checkPermission("logs", "meter_readings", "view")}
                        hasLogDelete={checkPermission("logs", "meter_readings", "delete")}
                        hasLogRestore={checkPermission("logs", "meter_readings", "restore")}
                        hasInfoPage={checkPermission("forms", "meter_readings", "view")}
                        entity="meter_readings"
                    />
                ) : (
                    <div className="tab-active recomdn-table bg-grey-table">
                        <MeterTemplateMain
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
                            handleDeleteNarrativeTemplate={this.handleDeleteMeterTemplate}
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
                            hasExport={checkPermission("forms", "meter_readings", "export")}
                            showAddButton={checkPermission("forms", "meter_readings", "create")}
                            hasEdit={checkPermission("forms", "meter_readings", "edit")}
                            hasDelete={checkPermission("forms", "meter_readings", "delete")}
                            hasInfoPage={checkPermission("forms", "meter_readings", "view")}
                            entity="meter_readings"
                            summaryRowData={summaryRowData}
                        />
                    </div>
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
    const { projectReducer, commonReducer, electricReducer } = state;
    return { projectReducer, commonReducer, electricReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...meterActions,
        ...CommonActions
    })(index)
);
