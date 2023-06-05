import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import actions from "./actions";
import Form from "./components/Form";
import LevelForm from "./components/LevelForm";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../common/components/Loader";
import _ from "lodash";
import Portal from "../common/components/Portal";
import InfoPage from "./components/Info";
import DataMain from "./components/DataMain";
import ConfirmationModal from "../common/components/ConfirmationModal";
import { addToBreadCrumpData, checkPermission, findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose } from "../../config/utils";
import ViewModal from "../common/components/ViewModal";
import history from "../../config/history";
import { AssetSettingsEntities } from "./config";
import CategoryForm from "./components/CategoryForm";
import PieChartForm from "./components/PieChartForm";

class AssetSettings extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        dataList: [],
        paginationParams: this.props.assetSettingsReducer[this.props.match.params.settingType]?.entityParams?.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        selectedRowId: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.selectedRowId,
        params: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.params,
        selectedData: this.props.match.params.id,
        tableData: {
            keys: AssetSettingsEntities[this.props.match.params.settingType].tableConfig.keys,
            config:
                this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.tableConfig ||
                _.cloneDeep(AssetSettingsEntities[this.props.match.params.settingType].tableConfig.config)
        },
        alertMessage: "",
        wildCardFilterParams: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.wildCardFilterParams,
        filterParams: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.filterParams,
        historyPaginationParams: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.historyPaginationParams,
        historyParams: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        tableLoading: false,
        infoTabsData: [],
        showForm: false,
        showInfoPage: false,
        isHistory: false,
        showConfirmModal: false
    };

    componentDidMount = async () => {
        await this.refreshDataList();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.settingType !== this.props.match.params.settingType) {
            await this.setState({
                paginationParams: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.paginationParams,
                selectedRowId: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.selectedRowId,
                params: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.params,
                tableData: {
                    keys: AssetSettingsEntities[this.props.match.params.settingType].tableConfig.keys,
                    config:
                        this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.tableConfig ||
                        AssetSettingsEntities[this.props.match.params.settingType].tableConfig.config
                },
                wildCardFilterParams: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.wildCardFilterParams,
                filterParams: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.filterParams,
                historyPaginationParams: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.historyPaginationParams,
                historyParams: this.props.assetSettingsReducer[this.props.match.params.settingType].entityParams.historyParams
            });
            await this.refreshDataList();
        }
    };

    refreshDataList = async () => {
        this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id, settingType }
            }
        } = this.props;
        let dataList = [];
        let totalCount = 0;

        await this.props.getDataList(params, settingType);
        const { getDataResponse } = this.props.assetSettingsReducer[settingType] || {};
        dataList = getDataResponse[AssetSettingsEntities[settingType].responseKey] || [];
        totalCount = getDataResponse?.count || 0;

        // go to previous page is the last record of the current page is deleted
        if (dataList && !dataList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getDataList(this.state.params, settingType);
            dataList = getDataResponse[AssetSettingsEntities[settingType].key] || [];
            totalCount = getDataResponse?.count || 0;
        }
        if (!dataList?.length && getDataResponse?.error) {
            this.setState({ alertMessage: getDataResponse.error }, () => this.showAlert());
        }

        // const arrWithColor = dataList.map(object => {
        //     return {...object, color_code:  "#ffa105",expired : "ff12000"}
        //   });

        this.setState({
            tableData: {
                ...tableData,
                data: dataList,
                config: this.props.assetSettingsReducer[settingType].entityParams.tableConfig || tableData.config
            },
            dataList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            showWildCardFilter: this.state.params.filters ? true : false,
            isLoading: false
        });
        this.updateEntityParams();
        return true;
    };

    updateWildCardFilter = async newFilter => {
        const { params, paginationParams } = this.state;
        await this.setState({
            params: {
                ...params,
                offset: 0,
                filters: newFilter
            },
            paginationParams: {
                ...paginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        await this.refreshDataList();
    };

    updateEntityParams = async () => {
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        const { filterParams, tableData, historyParams, historyPaginationParams, selectedRowId, wildCardFilterParams, paginationParams, params } =
            this.state;
        let entityParams = {
            entity: settingType,
            paginationParams,
            params,
            wildCardFilterParams,
            filterParams,
            tableConfig: tableData.config,
            selectedRowId,
            historyPaginationParams,
            historyParams
        };
        await this.props.updateDataEntityParams(entityParams, settingType);
    };

    resetAllFilters = async () => {
        await this.setState({
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
        await this.refreshDataList();
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
                config: _.cloneDeep(AssetSettingsEntities[this.props.match.params.settingType].tableConfig.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshDataList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshDataList();
    };

    getListForCommonFilter = async params => {
        const { settingType } = this.props.match.params;
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        await this.props.getListForCommonFilter(params, settingType);
        return (
            (this.props.assetSettingsReducer[settingType].getListForCommonFilterResponse &&
                this.props.assetSettingsReducer[settingType].getListForCommonFilterResponse.list) ||
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
        await this.refreshDataList();
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
        await this.refreshDataList();
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
        await this.refreshDataList();
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
        await this.refreshDataList();
    };

    showEditPage = dataId => {
        const {
            match: {
                params: { settingType }
            },
            history
        } = this.props;
        this.setState({
            selectedData: dataId
        });
        let path = `/asset-settings/${settingType}/edit/${dataId}`;
        addToBreadCrumpData({
            key: "edit",
            name: `Edit ${AssetSettingsEntities[settingType].name}`,
            path
        });
        history.push(path);
    };

    showAddForm = () => {
        const {
            match: {
                params: { settingType }
            },

            history
        } = this.props;
        this.setState({
            selectedData: null
        });
        addToBreadCrumpData({
            key: "Name",
            name: `Add ${AssetSettingsEntities[settingType].name}`,
            path: `/asset-settings/${settingType}/add`
        });
        history.push(`/asset-settings/${settingType}/add`);
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

    handleAddData = async data => {
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.addData(data, settingType);
        const { error, message } = this.props.assetSettingsReducer[settingType].addDataResponse;
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
            await this.refreshDataList();
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
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, AssetSettingsEntities[this.props.match.params.settingType].tableConfig.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    handleUpdateData = async data => {
        const {
            match: {
                params: { id, settingType }
            }
        } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.updateData(id, data, settingType);
        const { updateDataResponse } = this.props.assetSettingsReducer[settingType];
        if (updateDataResponse.error) {
            this.setState({ alertMessage: updateDataResponse.error, isLoading: false }, () => this.showAlert());
        } else {
            await this.setState({
                alertMessage: updateDataResponse && updateDataResponse.message
            });
            await this.refreshDataList();
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
        await this.refreshDataList();
    };

    showInfoPage = (id, projectId, rowData) => {
        const { history } = this.props;
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        this.setState({
            selectedData: id
        });
        if (rowData) {
            addToBreadCrumpData({
                key: "Name",
                name: settingType==="pie_chart" ? rowData?.client : rowData?.name,
                path: `/asset-settings/${settingType}/info/${id}/basicdetails`
            });
            addToBreadCrumpData({
                key: "info",
                name: "Basic Details",
                path: `/asset-settings/${settingType}/info/${id}/basicdetails`
            });
        }
        history.push(`/asset-settings/${settingType}/info/${id}/basicdetails`);
    };

    getDataById = async () => {
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        await this.props.getDataById(this.state.selectedData, settingType);
        return this.props.assetSettingsReducer[settingType].getDataByIdResponse;
    };

    getLogData = async () => {
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        const { historyParams, historyPaginationParams, logData, selectedData } = this.state;
        await this.props.getAllDataLogs(selectedData, historyParams, settingType);
        const {
            getDataLogsResponse: { logs, count, error }
        } = this.props.assetSettingsReducer[settingType];
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
        const { settingType } = this.props.match.params;
        await this.props.deleteDataLog(selectedLog, settingType);
        const { error, message, success } = this.props.assetSettingsReducer[settingType].deleteDataLogResponse;
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

    restoreLogOnConfirm = async id => {
        const { settingType } = this.props.match.params;
        await this.props.restoreDataLog(id, settingType);
        const { error, message, success } = this.props.assetSettingsReducer[settingType].restoreDataLogResponse;
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
    };

    exportTableXl = async () => {
        this.setState({ tableLoading: true });
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        const {
            params: { search, filters, list, order, deleted, active }
        } = this.state;
        const {
            tableData: { keys, config }
        } = this.state;
        let hide_columns = [];
        keys.map((keyItem, i) => {
            if (config && !config[keyItem]?.isVisible) {
                hide_columns.push(config[keyItem]?.label);
            }
        });
        let exportParams = { search, filters, list, order, deleted, active, hide_columns };
        await this.props.exportData(exportParams, settingType);
        this.setState({
            tableLoading: false
        });
        if (
            this.props.assetSettingsReducer[settingType].dataExportResponse &&
            this.props.assetSettingsReducer[settingType].dataExportResponse.error
        ) {
            await this.setState({ alertMessage: this.props.assetSettingsReducer[settingType].dataExportResponse.error });
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

    cancelForm = () => {
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData());
    };

    cancelInfoPage = () => {
        const { settingType } = this.props.match.params;
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData() || `/asset-settings/${settingType}`);
    };

    toggleHistory = async () => {
        this.setState({ isHistory: !this.state.isHistory });
    };

    handleDeleteData = async id => {
        this.setState({
            showConfirmModal: true,
            selectedData: id
        });
    };

    renderConfirmationModal = () => {
        const { settingType } = this.props.match.params;
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={`Do you want to delete this ${settingType} ?`}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteDataOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteDataOnConfirm = async () => {
        const { selectedData } = this.state;
        const { settingType } = this.props.match.params;
        this.setState({
            showConfirmModal: false,
            isLoading: true
        });
        await this.props.deleteData(selectedData, settingType);

        const { success, message, error } = this.props.assetSettingsReducer[settingType].deleteDataResponse;

        if (!success) {
            await this.setState({
                alertMessage: message || error,
                showConfirmModal: false
            });
            this.showLongAlert();
        } else {
            await this.refreshDataList();
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

    render() {
        const {
            showViewModal,
            showWildCardFilter,
            paginationParams,
            tableData,
            selectedRowId,
            infoTabsData,
            logData,
            historyPaginationParams,
            historyParams,
            selectedData,
            isHistory
        } = this.state;
        const {
            match: {
                params: { section, settingType }
            }
        } = this.props;
        const selectedSetting = AssetSettingsEntities[settingType];
        console.log("dfg",settingType)
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <>
                        {settingType === "status" || settingType === "type" || settingType === "condition" ? (
                            <Form
                                selectedData={selectedData}
                                refreshDataList={this.refreshDataList}
                                handleAddData={this.handleAddData}
                                handleUpdateData={this.handleUpdateData}
                                getSettingDataById={this.getDataById}
                                cancelForm={this.cancelForm}
                            />
                        ) : settingType === "mainCategory" ||
                          settingType === "subCategory1" ||
                          settingType === "subCategory2" ||
                          settingType === "subCategory3" ? (
                            <CategoryForm
                                selectedData={selectedData}
                                refreshDataList={this.refreshDataList}
                                handleAddData={this.handleAddData}
                                handleUpdateData={this.handleUpdateData}
                                getData={this.getDataById}
                                cancelForm={this.cancelForm}
                            />
                        ) :settingType === "pie_chart"? (
                            <PieChartForm
                            selectedData={selectedData}
                            refreshDataList={this.refreshDataList}
                            // handleAddData={this.handleAddData}
                            handleUpdateData={this.handleUpdateData}
                            getSettingDataById={this.getDataById}
                            cancelForm={this.cancelForm}
                            />
                        ) : 
                        (
                            <LevelForm
                                selectedData={selectedData}
                                refreshDataList={this.refreshDataList}
                                handleAddData={this.handleAddData}
                                handleUpdateData={this.handleUpdateData}
                                getData={this.getDataById}
                                cancelForm={this.cancelForm}
                            />
                        )}
                    </>
                ) : section === "info" ? (
                    <InfoPage
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        showEditPage={this.showEditPage}
                        updateData={this.handleUpdateData}
                        handleDeleteItem={this.handleDeleteData}
                        getAllDataLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        restoreLog={this.restoreLogOnConfirm}
                        historyPaginationParams={historyPaginationParams}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        selectedData={selectedData}
                        hasEdit={checkPermission("forms", selectedSetting.permissionKey, "edit")}
                        hasDelete={settingType !== "pie_chart" && checkPermission("forms", selectedSetting.permissionKey, "delete")}
                        hasLogView={checkPermission("logs", selectedSetting.permissionKey, "view")}
                        hasLogDelete={checkPermission("logs", selectedSetting.permissionKey, "delete")}
                        hasLogRestore={checkPermission("logs", selectedSetting.permissionKey, "restore")}
                        hasInfoPage={checkPermission("forms", selectedSetting.permissionKey, "view")}
                        entity={selectedSetting.key}
                        cancelInfoPage={this.cancelInfoPage}
                        cancelForm={this.cancelForm}
                        isHistory={isHistory}
                        toggleHistory={this.toggleHistory}
                    />
                ) : (
                    <DataMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterFloor={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        showViewModal={this.showViewModal}
                        handleDelete={this.handleDeleteData}
                        hasExport={settingType !== "pie_chart" && checkPermission("forms", selectedSetting.permissionKey, "export")}
                        showAddButton={settingType !== "pie_chart" && checkPermission("forms", selectedSetting.permissionKey, "create")}
                        hasEdit={checkPermission("forms", selectedSetting.permissionKey, "edit")}
                        hasDelete={settingType !== "pie_chart" && checkPermission("forms", selectedSetting.permissionKey, "delete")}
                        hasInfoPage={checkPermission("forms", selectedSetting.permissionKey, "edit")}
                        entity={selectedSetting.key}
                        selectedSetting={selectedSetting}
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
            </LoadingOverlay>
        );
    }
}
const mapStateToProps = state => {
    const { assetSettingsReducer } = state;
    return { assetSettingsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(AssetSettings)
);
