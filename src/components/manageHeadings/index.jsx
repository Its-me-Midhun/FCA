import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import "../../assets/css/edit-manage.css";
import actions from "./actions";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../common/components/Loader";
import Portal from "../common/components/Portal";
import HeadingMain from "./components/HeadingMain";
import { manageHeadingsTableData } from "../../config/tableData";
import ConfirmationModal from "../common/components/ConfirmationModal";
import { addToBreadCrumpData, checkPermission, findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose } from "../../config/utils";
import ViewModal from "../common/components/ViewModal";
import history from "../../config/history";
import HeadingForm from "./components/HeadingForm";
import moment from "moment";

class Index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        PropertyList: [],
        paginationParams: this.props.manageHeadingReducer.entityParams.paginationParams,
        currentViewAllUsers: null,
        currentActions: null,
        showViewModal: false,
        showFormModal: false,
        showWildCardFilter: false,
        buildingTypeData: {},
        selectedRowId: this.props.manageHeadingReducer.entityParams.selectedRowId,
        params: this.props.manageHeadingReducer.entityParams.params,
        selectedProperty: this.props.isLocalSettings ? this.props.match.params.subId : this.props.match.params.id,
        tableData: {
            keys: manageHeadingsTableData.keys,
            config: this.props.manageHeadingReducer.entityParams.tableConfig || _.cloneDeep(manageHeadingsTableData.config)
        },
       
        alertMessage: "",
        wildCardFilterParams: this.props.manageHeadingReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.manageHeadingReducer.entityParams.filterParams,
        historyPaginationParams: this.props.manageHeadingReducer.entityParams.historyPaginationParams,
        historyParams: this.props.manageHeadingReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        tableLoading: false,
        infoTabsData: [],
        selectedClient: null,
        showForm: false,
        showInfoPage: false,
        isHistory: false,
        showConfirmModal: false,
        isDeleted: false,
        selectedDropdown: this.props.manageHeadingReducer.entityParams.selectedDropdown || "active",
        showRestoreConfirmModal: false
    };

    componentDidMount = async () => {
        await this.refreshManageHeadingList();
    };

    refreshManageHeadingList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const { filterKeys, limit, offset, search, order, template_filter } = params;
        let headingList = [];
        let totalCount = 0;
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
             .join(",");
        let templateParams = {
            ...filterKeys,
             limit,
            offset,
            search,
            ordering,
            template_filter,
            per_page_count: limit,
            page_number: offset + 1
        };
        console.log(templateParams);
        await this.props.getAllExportHeading(templateParams);
        headingList = this.props.manageHeadingReducer.getAllHeadingResponse.data
            ? this.props.manageHeadingReducer.getAllHeadingResponse.data || []
            : [];
        totalCount = this.props.manageHeadingReducer.getAllHeadingResponse.count
            ? this.props.manageHeadingReducer.getAllHeadingResponse.count || 0
            : 0;
        // go to previous page is the last record of the current page is deleted
        if (headingList && !headingList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
          
            console.log(this.state.params);
             await this.props.getAllExportHeading(this.state.params);
            headingList = this.props.manageHeadingReducer.getAllHeadingResponse.data
                ? this.props.manageHeadingReducer.getAllHeadingResponse.data || []
                : [];

            totalCount = this.props.manageHeadingReducer.getAllHeadingResponse.count
                ? this.props.manageHeadingReducer.getAllHeadingResponse.count || 0
                : 0;
        }

      {};
        if (
            headingList &&
            !headingList.length &&
            this.props.manageHeadingReducer.getAllHeadingResponse &&
            this.props.manageHeadingReducer.getAllHeadingResponse.error
        ) {
            await this.setState({ alertMessage: this.props.manageHeadingReducer.getAllHeadingResponse.error });
            this.showAlert();
        }
        headingList.map(temp => {
            
            temp.updated_at = moment(temp.updated_at).format("MM-DD-YYYY h:mm A");
            temp.created_at = moment(temp.created_at).format("MM-DD-YYYY h:mm A");
        });
        this.setState({
            tableData: {
                ...tableData,
                data: headingList,
                config: this.props.manageHeadingReducer.entityParams.tableConfig || tableData.config
            },
            headingList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            showWildCardFilter: this.state.params.filters ? true : false,
            // permissions: project_permission,
            // logPermission: region_logs,
            isLoading: false
        });
        this.updateEntityParams();
        return true;
    };

    
    updateWildCardFilter = async (wildCardFilter, filterKeys) => {
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                filters: wildCardFilter,
                filterKeys
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        await this.refreshManageHeadingList();
    };
   

    updateEntityParams = async () => {
        let entityParams = {
           
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
        await this.props.updateHeadingEntityParams(entityParams);
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
                client_id: null,
                filters: null,
                filterKeys: {}
            },
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshManageHeadingList();
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
                filterKeys: {},
                order: null,
                list: null,
                key: null,
                config: null
            },
            tableData: {
                ...this.state.tableData,
                config: _.cloneDeep(manageHeadingsTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshManageHeadingList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshManageHeadingList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, manageHeadingsTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    getListForCommonFilter = async params => {
        await this.props.getListForCommonFilter(params);
        return (
            (this.props.manageHeadingReducer.getListForCommonFilterResponse && this.props.manageHeadingReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshManageHeadingList();
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
        await this.refreshManageHeadingList();
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
        const { paginationParams, params } = this.state;
        await this.setState({
            paginationParams: {
                ...paginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            params: {
                ...params,
                offset: 0,
                limit: e.target.value
            }
        });
        await this.refreshManageHeadingList();
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
        await this.refreshManageHeadingList();
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

    showEditPage = propertyId => {
        const { history } = this.props;
        this.setState({
            selectedProperty: propertyId
        });
        let path = `/settings/manageHeadings/edit/${propertyId}`;
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Heading",
            path
        });
        history.push(path);
    };

    showAddForm = () => {
        const { history, clientId } = this.props;
        this.setState({
            selectedProperty: null
        });
        const path = clientId ? `/chartProperties/add?client_id=${clientId}` : `/chartProperties/add`;
        addToBreadCrumpData({
            key: "Name",
            name: "Add Property",
            path
        });
        history.push(path);
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

    handleAddProperty = async data => {
        this.setState({
            isLoading: true
        });
        await this.props.addProperty(data);
        const { error, message } = this.props.manageHeadingReducer.addPropertyResponse;
        if (error) {
            this.setState(
                {
                    alertMessage: error,
                    isLoading: false
                },
                () => this.showAlert()
            );
        } else {
            await this.setState({
                alertMessage: message,
                isLoading: false
            });
            await this.refreshManageHeadingList();
            this.showAlert();
            this.cancelForm();
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

    handleUpdateHeading = async (params, id) => {
        await this.props.updateExportHeading(params, id);
        const { updateHeadingResponse } = this.props.manageHeadingReducer;
        if (updateHeadingResponse.error) {
            this.setState({ alertMessage: updateHeadingResponse.error, isLoading: false }, () => this.showAlert());
        } else {
            await this.setState({
                alertMessage: (updateHeadingResponse && updateHeadingResponse.message) || "Heading updated successfully"
            });
            await this.refreshManageHeadingList();
            this.setState({
                isLoading: false
            });
            this.showAlert();
            this.cancelForm();
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
        await this.refreshManageHeadingList();
    };

    showInfoPage = (id, projectId, rowData) => {
        const { history } = this.props;
        const {
            match: { url }
        } = this.props;
        this.setState({
            selectedProperty: id,
            infoTabsData: [
                {
                    key: "chartProperties",
                    name: "Chart Properties",
                    path: `/chartProperties/info/${id}/basicdetails`
                }
            ]
        });
        history.push(`/chartProperties/info/${id}/basicdetails`);
    };

    getDataById = async () => {
        await this.props.getPropertyById(this.state.selectedProperty);
        return this.props.manageHeadingReducer.getPropertyByIdResponse;
    };

    getLogData = async () => {
        const { historyParams, historyPaginationParams, logData, selectedProperty } = this.state;
        await this.props.getAllPropertyLogs(selectedProperty, historyParams);
        const {
            manageHeadingReducer: {
                getPropertyLogsResponse: { logs, count, error }
            }
        } = this.props;
        if (error) {
            this.setState({ alertMessage: error }, () => this.showAlert());
        } else {
            this.setState({
                logData: {
                    ...logData,
                    data: logs
                },
                historyPaginationParams: {
                    ...historyPaginationParams,
                    totalCount: count,
                    totalPages: Math.ceil(count / historyPaginationParams.perPage)
                }
            });
        }
    };

    handlePerPageChangeHistory = async e => {
        const { historyPaginationParams, historyParams } = this.state;
        await this.setState({
            historyPaginationParams: {
                ...historyPaginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            historyParams: {
                ...historyParams,
                offset: 0,
                limit: e.target.value
            }
        });
        await this.getLogData();
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
        await this.getLogData();
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
        await this.getLogData();
    };

    handleDeleteLog = async (id, choice) => {
        this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            isRestoreOrDelete: choice
        });
    };
    handleRestoreLog = async (id, choice) => {
        this.setState({
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
        await this.props.deletePropertyLog(selectedLog);
        const { error, message, success } = this.props.manageHeadingReducer.deletePropertyLogResponse;
        if (!success) {
            this.setState({ alertMessage: error || "Something went wrong !" }, () => this.showAlert());
        } else {
            this.setState({ alertMessage: message }, () => this.showAlert());
        }
        await this.getLogData();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    restoreLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.restorePropertyLog(selectedLog);
        const { error, message, success } = this.props.manageHeadingReducer.restorePropertyLogResponse;
        if (!success) {
            this.setState({ alertMessage: error || "Something went wrong !" }, () => this.showAlert());
        } else {
            this.setState({ alertMessage: message }, () => this.showAlert());
        }
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null,
            isHistory: false
        });
        this.refreshManageHeadingList();
    };

    exportTableXl = async () => {
        this.setState({ tableLoading: true });
        const { filterKeys, search, order, template_filter } = this.state.params;
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .join(",");
        let templateParams = {
            ...filterKeys,
            search,
            ordering,
            username: localStorage.getItem("user"),
            template_filter
        };
        templateParams.client_id = this.props.match.params?.id || null;
        await this.props.exportHeadings(templateParams);
        // await this.props.addUserActivityLog({ text: "Exported report template." });
        this.setState({ tableLoading: false });
        if (this.props.manageHeadingReducer.propertyExportResponse?.error) {
            this.setState({ alertMessage: this.props.manageHeadingReducer.propertyExportResponse.error }, () => this.showAlert());
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

    cancelForm = () => {
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData());
    };

    cancelInfoPage = () => {
        // this.setState({ showInfoPage: false, isHistory: false });
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData());
    };

    toggleHistory = async () => {
        this.setState({ isHistory: !this.state.isHistory });
    };

    handleDeleteProperty = async (id, isDeleted) => {
        this.setState({ isLoading: true });
        // checking if the selected property mapped to any report template
        await this.props.checkPropertyMapped(id);
        const { success, message } = this.props.manageHeadingReducer.checkIfPropertyMappedResponse;
        this.setState({ isLoading: false });
        if (!success) {
            this.setState({ alertMessage: message }, () => this.showLongAlert());
        } else {
            this.setState({
                showConfirmModal: true,
                selectedProperty: id,
                isDeleted: isDeleted
            });
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, isDeleted } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Property ?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deletePropertyOnConfirm}
                        onHardDelete={this.deletePropertyOnConfirm}
                        isHard={true}
                        isDeleted={isDeleted}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deletePropertyOnConfirm = async (ishardDelete = false) => {
        const { selectedProperty } = this.state;
        if (ishardDelete) {
            this.setState({
                showConfirmModal: false,
                isLoading: true
            });
            await this.props.deleteProperty({ id: selectedProperty, hard_delete: true });
        } else {
            this.setState({
                showConfirmModal: false,
                isLoading: true
            });
            await this.props.deleteProperty({ id: selectedProperty, hard_delete: false });
        }
        const { status, message } = this.props.manageHeadingReducer.deletePropertyResponse;

        if (!status) {
            await this.setState({
                alertMessage: message,
                showConfirmModal: false
            });
            this.showLongAlert();
        } else {
            await this.refreshManageHeadingList();
            await this.setState({
                showConfirmModal: false,
                alertMessage: message
            });
            this.showAlert();
        }
        this.setState({
            isLoading: false
        });
    };

    showLongAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
        }
    };

    selectFilterHandler = async e => {
        switch (e.target.value) {
            case "deleted":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: true,
                        active: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "active":
                await this.setState({
                    params: {
                        ...this.state.params,
                        active: true,
                        deleted: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "all":
                await this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
        }
        await this.updateEntityParams();
        await this.refreshManageHeadingList();
    };

    showRestoreModal = async id => {
        this.setState({
            showRestoreConfirmModal: true,
            selectedProperty: id
        });
    };

    renderRestoreConfirmationModal = () => {
        const { showRestoreConfirmModal } = this.state;
        if (!showRestoreConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this Property ?"}
                        message={"This action cannot be reverted, are you sure that you need to restore this item?"}
                        onNo={() => this.setState({ showRestoreConfirmModal: false })}
                        onYes={this.restorePropertyOnConfirm}
                        type={"restore"}
                        isRestore={true}
                    />
                }
                onCancel={() => this.setState({ showRestoreConfirmModal: false })}
            />
        );
    };

    restorePropertyOnConfirm = async () => {
        const { selectedProperty } = this.state;
        this.setState({
            isLoading: true,
            showRestoreConfirmModal: false
        });
        await this.props.restoreProperty(selectedProperty);
        const { error, message, success } = this.props.manageHeadingReducer.restorePropertyResponse;
        if (!success) {
            await this.setState({
                alertMessage: error,
                showRestoreConfirmModal: false
            });
            this.showAlert();
        } else {
            await this.refreshManageHeadingList();
            await this.setState({
                showRestoreConfirmModal: false,
                alertMessage: message
            });
            this.showAlert();
        }
        this.setState({
            isLoading: false
        });
    };

    render() {
        const {
            showViewModal,
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            tableData,
            selectedRowId,
            infoTabsData,
            logData,
            historyPaginationParams,
            historyParams,
            selectedProperty,
            showForm,
            showInfoPage,
            isHistory,
            selectedDropdown
        } = this.state;
        const {
            match: {
                params: { section, subSection }
            },
            isLocalSettings
        } = this.props;
        let isFormView = section === "add" || section === "edit";
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {isFormView ? (
                    <HeadingForm
                        selectedProperty={selectedProperty}
                        refreshManageHeadingList={this.refreshManageHeadingList}
                        handleAddProperty={this.handleAddProperty}
                        updateHeading={this.handleUpdateHeading}
                        getPropertyDataById={this.getDataById}
                        cancelForm={this.cancelForm}
                    />
                ) : (
                    <HeadingMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showEditPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterFloor={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        showViewModal={this.showViewModal}
                        handleDelete={this.handleDeleteProperty}
                        selectFilterHandler={this.selectFilterHandler}
                        showRestoreModal={this.showRestoreModal}
                        selectedDropdown={selectedDropdown}
                        hasExport={checkPermission("forms", "manage_headings", "export")}
                        showAddButton={false}
                        hasEdit={checkPermission("forms", "manage_headings", "edit")}
                        hasDelete={false}
                        hasInfoPage={checkPermission("forms", "manage_headings", "edit")}
                        entity={"manage_headings"}
                    />
                )}
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
                {this.renderConfirmationModalLog()}
                {this.renderConfirmationModal()}
                {this.renderRestoreConfirmationModal()}
            </LoadingOverlay>
        );
    }
}
const mapStateToProps = state => {
    const { manageHeadingReducer } = state;
    return { manageHeadingReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Index)
);
