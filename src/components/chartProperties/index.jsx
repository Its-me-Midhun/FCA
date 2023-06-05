import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import moment from "moment";

import actions from "./actions";
import Form from "./components/Form";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../common/components/Loader";
import Portal from "../common/components/Portal";
import PropertyInfo from "./components/PropertyInfo";
import PropertyMain from "./components/PropertyMain";
import { chartPropertiesTableData } from "../../config/tableData";
import ConfirmationModal from "../common/components/ConfirmationModal";
import { addToBreadCrumpData, checkPermission, findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose } from "../../config/utils";
import ViewModal from "../common/components/ViewModal";
import history from "../../config/history";

class Index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        PropertyList: [],
        paginationParams: this.props.chartPropertyReducer.entityParams.paginationParams,
        currentViewAllUsers: null,
        currentActions: null,
        showViewModal: false,
        showFormModal: false,
        showWildCardFilter: false,
        buildingTypeData: {},
        selectedRowId: this.props.chartPropertyReducer.entityParams.selectedRowId,
        params: this.props.chartPropertyReducer.entityParams.params,
        selectedProperty: this.props.isLocalSettings ? this.props.match.params.subId : this.props.match.params.id,
        tableData: {
            keys: chartPropertiesTableData.keys,
            config: this.props.chartPropertyReducer.entityParams.tableConfig || _.cloneDeep(chartPropertiesTableData.config)
        },
        alertMessage: "",
        wildCardFilterParams: this.props.chartPropertyReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.chartPropertyReducer.entityParams.filterParams,
        historyPaginationParams: this.props.chartPropertyReducer.entityParams.historyPaginationParams,
        historyParams: this.props.chartPropertyReducer.entityParams.historyParams,
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
        selectedDropdown: this.props.chartPropertyReducer.entityParams.selectedDropdown || "active",
        showRestoreConfirmModal: false
    };

    componentDidMount = async () => {
        await this.refreshReportPropertyList();
    };

    refreshReportPropertyList = async () => {
        this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const { clientId = null } = this.props;

        let propertyList = [];
        let totalCount = 0;
        params.client_id = clientId || null;
        const { filterKeys, limit, offset, search, order, template_filter } = params;
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .map(item => item.replace("property_name", "chart_properties__name"))
            .join(",");
        let templateParams = {
            ...filterKeys,
            search,
            ordering,
            template_filter
        };
        templateParams.client_id = clientId || null;
        await this.props.getProperties({ ...templateParams, per_page_count: params.limit, page_number: params.offset + 1 });
        const { getPropertyResponse } = this.props.chartPropertyReducer || {};
        propertyList = getPropertyResponse?.data || [];
        totalCount = getPropertyResponse?.count || 0;

        // go to previous page is the last record of the current page is deleted
        if (propertyList && !propertyList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getProperties(this.state.params);
            propertyList = getPropertyResponse?.settings || [];
            totalCount = getPropertyResponse?.count || 0;
        }
        if (!propertyList?.length && getPropertyResponse?.error) {
            this.setState({ alertMessage: getPropertyResponse.error }, () => this.showAlert());
        }

        propertyList.map(temp => {
            temp.updated_at = moment(temp.updated_at).format("MM-DD-YYYY h:mm A");
            temp.created_at = moment(temp.created_at).format("MM-DD-YYYY h:mm A");
        });

        this.setState({
            tableData: {
                ...tableData,
                data: propertyList,
                config: this.props.chartPropertyReducer.entityParams.tableConfig || tableData.config
            },
            propertyList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            showWildCardFilter: this.state.params.filters ? true : false,
            isLoading: false,
            selectedClient: clientId
        });
        this.updateEntityParams();
        return true;
    };

    // updateWildCardFilter = async newFilter => {
    //     const { params, paginationParams } = this.state;
    //     await this.setState({
    //         params: {
    //             ...params,
    //             offset: 0,
    //             filters: newFilter
    //         },
    //         paginationParams: {
    //             ...paginationParams,
    //             currentPage: 0
    //         }
    //     });
    //     this.updateEntityParams();
    //     await this.refreshReportPropertyList();
    // };

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
        await this.refreshReportPropertyList();
    };

    updateEntityParams = async () => {
        const {
            filterParams,
            tableData,
            historyParams,
            historyPaginationParams,
            selectedRowId,
            wildCardFilterParams,
            paginationParams,
            params,
            selectedDropdown
        } = this.state;
        let entityParams = {
            entity: "ReportProperty",
            paginationParams,
            params,
            wildCardFilterParams,
            filterParams,
            tableConfig: tableData.config,
            selectedRowId,
            historyPaginationParams,
            historyParams,
            selectedDropdown
        };
        await this.props.updatePropertyEntityParams(entityParams);
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
        await this.refreshReportPropertyList();
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
                client_id: null,
                filters: null,

                order: null,
                list: null
            },
            tableData: {
                ...this.state.tableData,
                config: _.cloneDeep(chartPropertiesTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshReportPropertyList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshReportPropertyList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, chartPropertiesTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    getListForCommonFilter = async params => {
        await this.props.getListForCommonFilter(params);
        return (
            (this.props.chartPropertyReducer.getListForCommonFilterResponse && this.props.chartPropertyReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshReportPropertyList();
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
        await this.refreshReportPropertyList();
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
        await this.refreshReportPropertyList();
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
        await this.refreshReportPropertyList();
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

    showEditPage = (propertyId,activeDetail) => {
        const { history } = this.props;
        this.setState({
            selectedProperty: propertyId
        });
        let tabKeyList = ["sortedRecommendations", "multiRecommendation"];
        let path 
        if(activeDetail !== "chart"){
            path = `/chartProperties/edit/${propertyId}/${tabKeyList.includes(activeDetail) ? activeDetail : null}`;
        }else{
            path =`/chartProperties/edit/${propertyId}`
        }
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Property",
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
        const { error, message } = this.props.chartPropertyReducer.addPropertyResponse;
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
            await this.refreshReportPropertyList();
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

    handleUpdateProperty = async data => {
        this.setState({
            isLoading: true
        });
        await this.props.updateProperty(data);
        const { updatePropertyResponse } = this.props.chartPropertyReducer;
        if (updatePropertyResponse.error) {
            this.setState({ alertMessage: updatePropertyResponse.error, isLoading: false }, () => this.showAlert());
        } else {
            await this.setState({
                alertMessage: (updatePropertyResponse && updatePropertyResponse.message) || "Chart Property updated successfully"
            });
            await this.refreshReportPropertyList();
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
        await this.refreshReportPropertyList();
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
                },
                {
                    key: "Chart Data Table",
                    name: "Chart Data Table",
                    path: `/chartProperties/info/${id}/basicdetails`
                },
                {
                    key: "Sorted Recommendations",
                    name: "Sorted Recommendations",
                    path: `/chartProperties/info/${id}/basicdetails`
                },
                {
                    key: "Multi Recommendations",
                    name: "Multi Recommendations",
                    path: `/chartProperties/info/${id}/basicdetails`
                }
            ]
        });
        history.push(`/chartProperties/info/${id}/basicdetails`);
    };

    getDataById = async () => {
        await this.props.getPropertyById(this.state.selectedProperty);
        return this.props.chartPropertyReducer.getPropertyByIdResponse;
    };

    getLogData = async () => {
        const { historyParams, historyPaginationParams, logData, selectedProperty } = this.state;
        await this.props.getAllPropertyLogs(selectedProperty, historyParams);
        const {
            chartPropertyReducer: {
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
        const { error, message, success } = this.props.chartPropertyReducer.deletePropertyLogResponse;
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
        const { error, message, success } = this.props.chartPropertyReducer.restorePropertyLogResponse;
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
        this.refreshReportPropertyList();
    };

    exportTableXl = async () => {
        this.setState({ tableLoading: true });
        const { filterKeys, search, order, template_filter } = this.state.params;
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .map(item => item.replace("property_name", "chart_properties__name"))
            .join(",");
        let templateParams = {
            ...filterKeys,
            search,
            ordering,
            username: localStorage.getItem("user"),
            template_filter
        };
        templateParams.client_id = this.props.match.params?.id || null;
        await this.props.exportChartProperty(templateParams);
        // await this.props.addUserActivityLog({ text: "Exported report template." });
        this.setState({ tableLoading: false });
        if (this.props.chartPropertyReducer.propertyExportResponse?.error) {
            this.setState({ alertMessage: this.props.chartPropertyReducer.propertyExportResponse.error }, () => this.showAlert());
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
        const { success, message } = this.props.chartPropertyReducer.checkIfPropertyMappedResponse;
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
        const { status, message } = this.props.chartPropertyReducer.deletePropertyResponse;

        if (!status) {
            await this.setState({
                alertMessage: message,
                showConfirmModal: false
            });
            this.showLongAlert();
        } else {
            await this.refreshReportPropertyList();
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
        await this.refreshReportPropertyList();
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
        const { error, message, success } = this.props.chartPropertyReducer.restorePropertyResponse;
        if (!success) {
            await this.setState({
                alertMessage: error,
                showRestoreConfirmModal: false
            });
            this.showAlert();
        } else {
            await this.refreshReportPropertyList();
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
                    <Form
                        selectedProperty={selectedProperty}
                        refreshReportPropertyList={this.refreshReportPropertyList}
                        handleAddProperty={this.handleAddProperty}
                        handleUpdateProperty={this.handleUpdateProperty}
                        getPropertyDataById={this.getDataById}
                        cancelForm={this.cancelForm}
                    />
                ) : section === "info" ? (
                    <PropertyInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        showEditPage={this.showEditPage}
                        updateData={this.handleUpdateProperty}
                        getAllPropertyLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        handleRestoreLog={this.handleRestoreLog}
                        historyPaginationParams={historyPaginationParams}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        selectedProperty={selectedProperty}
                        hasEdit={
                            isLocalSettings
                                ? checkPermission("forms", "client_chart_properties", "edit")
                                : checkPermission("forms", "global_chart_properties", "edit")
                        }
                        hasDelete={false}
                        hasLogView={
                            false
                            // isLocalSettings
                            //     ? checkPermission("logs", "client_chart_properties", "view")
                            //     : checkPermission("logs", "global_chart_properties", "view")
                        }
                        hasLogDelete={
                            isLocalSettings
                                ? checkPermission("logs", "client_chart_properties", "delete")
                                : checkPermission("logs", "global_chart_properties", "delete")
                        }
                        hasLogRestore={
                            isLocalSettings
                                ? checkPermission("logs", "client_chart_properties", "restore")
                                : checkPermission("logs", "global_chart_properties", "restore")
                        }
                        hasInfoPage={
                            isLocalSettings
                                ? checkPermission("forms", "client_chart_properties", "view")
                                : checkPermission("forms", "global_chart_properties", "view")
                        }
                        entity={isLocalSettings ? "client_chart_properties" : "global_chart_properties"}
                        cancelInfoPage={this.cancelInfoPage}
                        cancelForm={this.cancelForm}
                        isHistory={isHistory}
                        toggleHistory={this.toggleHistory}
                    />
                ) : (
                    <PropertyMain
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
                        showInfoPage={this.showInfoPage}
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
                        hasExport={
                            isLocalSettings
                                ? checkPermission("forms", "client_chart_properties", "export")
                                : checkPermission("forms", "global_chart_properties", "export")
                        }
                        showAddButton={
                            isLocalSettings
                                ? checkPermission("forms", "client_chart_properties", "create")
                                : checkPermission("forms", "global_chart_properties", "create")
                        }
                        hasEdit={
                            isLocalSettings
                                ? checkPermission("forms", "client_chart_properties", "edit")
                                : checkPermission("forms", "global_chart_properties", "edit")
                        }
                        hasDelete={
                            isLocalSettings
                                ? checkPermission("forms", "client_chart_properties", "delete")
                                : checkPermission("forms", "global_chart_properties", "delete")
                        }
                        hasInfoPage={
                            isLocalSettings
                                ? checkPermission("forms", "client_chart_properties", "edit")
                                : checkPermission("forms", "global_chart_properties", "edit")
                        }
                        isLocalSettings={isLocalSettings}
                        entity={isLocalSettings ? "project_fca_report_settings" : "global_fca_report_settings"}
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
    const { chartPropertyReducer } = state;
    return { chartPropertyReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Index)
);
