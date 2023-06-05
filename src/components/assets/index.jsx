import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import actions from "./actions";
import Form from "./components/Form";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../common/components/Loader";
import Portal from "../common/components/Portal";
import InfoPage from "./components/Info";
import DataMain from "./components/DataMain";
import ConfirmationModal from "../common/components/ConfirmationModal";
import { addToBreadCrumpData, checkPermission, findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose } from "../../config/utils";
import ViewModal from "../common/components/ViewModal";
import history from "../../config/history";
import { assetTableData } from "./components/tableConfig";
import qs from "query-string";
class Assets extends Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
        this.state = {
            isLoading: false,
            errorMessage: "",
            dataList: [],
            paginationParams: this.props.assetReducer.entityParams.paginationParams,
            showViewModal: false,
            showWildCardFilter: false,
            selectedRowId: this.props.assetReducer.entityParams.selectedRowId,
            params: this.props.assetReducer.entityParams.params,
            selectedData: this.props.match.params.id,
            tableData: {
                keys: assetTableData.keys,
                config: this.props.assetReducer.entityParams.tableConfig || _.cloneDeep(assetTableData.config)
            },
            alertMessage: "",
            wildCardFilterParams: this.props.assetReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.assetReducer.entityParams.filterParams,
            historyPaginationParams: this.props.assetReducer.entityParams.historyPaginationParams,
            historyParams: this.props.assetReducer.entityParams.historyParams,
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
            showConfirmModal: false,
            imageResponse: [],
            customExcelExportLoading: false,
            summaryRowData: {
                crv_total: "",
                fca_cost_total: ""
            },
            locationState: this.props.location.state || this.props.assetReducer.entityParams.locationState
        };
    }

    componentDidMount = async () => {
        this.handleScrollPosition();
        this.props.handleSelectAsset(null, false);
        if (this.props.location?.state?.isInitialView || this.props.isAssignView) {
            this.setState({ locationState: false });
        }
        if (this.props.match.params.tab === "assets" || this.props.isAssignView) {
            await this.refreshDataList();
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.path !== this.props.match.path && this.props.match.path === "/assets") {
            this.handleScrollPosition();
        }
    };

    refreshDataList = async () => {
        this.setState({ isLoading: true });
        const { params, paginationParams, tableData, locationState } = this.state;
        const {
            match: {
                params: { id, section }
            },
            location: { state }
        } = this.props;
        let dataList = [];
        let totalCount = 0;
        let crv_total = 0;
        let fca_cost_total = 0;
        const subParams = {};
        if (this.props.isAssignView) {
            params.client_id = this.props.clientId;
        } else {
            switch (section) {
                case "assetinfo":
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
                case "imageInfo":
                    subParams.image_id = id;
                    break;

                default:
                    subParams.client_id = id;
            }
        }
        if (locationState && !locationState.isInitialView && !this.props.isAssignView && section !== "imageInfo") {
            await this.props.getChartAssetDataList({ ...params, ...subParams, ...locationState });
        } else {
            await this.props.getDataList({ ...params, ...subParams });
        }
        const { getDataResponse } = this.props.assetReducer || {};
        dataList = getDataResponse?.assets || [];
        totalCount = getDataResponse?.count || 0;
        crv_total = getDataResponse?.crv || 0;
        fca_cost_total = getDataResponse?.fca_cost_total || 0;
        // go to previous page is the last record of the current page is deleted
        if (dataList && !dataList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getDataList(this.state.params);
            dataList = getDataResponse?.assets || [];
            totalCount = getDataResponse?.count || 0;
            crv_total = getDataResponse?.crv || 0;
            fca_cost_total = getDataResponse?.fca_cost_total || 0;
        }
        if (!dataList?.length && getDataResponse?.error) {
            this.setState({ alertMessage: getDataResponse.error }, () => this.showAlert());
        }

        this.setState({
            tableData: {
                ...tableData,
                data: dataList,
                config: this.props.assetReducer.entityParams.tableConfig || tableData.config
            },
            dataList,
            summaryRowData: {
                crv_total,
                fca_cost_total
            },
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

    handleScrollPosition = () => {
        const scrollPosition = this.props.assetReducer.scrollPosition;
        if (scrollPosition && this.tableRef?.current) {
            this.tableRef.current.scrollTo(0, parseInt(scrollPosition));
            this.props.setAssetScrollPosition(0);
        }
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
            filterParams,
            tableData,
            historyParams,
            historyPaginationParams,
            selectedRowId,
            wildCardFilterParams,
            paginationParams,
            params,
            locationState
        } = this.state;
        let entityParams = {
            entity: "assets",
            paginationParams,
            params,
            wildCardFilterParams,
            filterParams,
            tableConfig: tableData.config,
            selectedRowId,
            historyPaginationParams,
            historyParams,
            locationState
        };
        await this.props.updateDataEntityParams(entityParams);
    };

    resetAllFilters = async () => {
        await this.setState({
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
                list: null,
                recommendation_assigned_true: null
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
                recommendation_assigned_true: null,
                order: null,
                list: null
            },
            tableData: {
                ...this.state.tableData,
                config: _.cloneDeep(assetTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshDataList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, assetTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };

    getListForCommonFilter = async params => {
        const { search, filters, list, recommendation_assigned_true } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.recommendation_assigned_true = recommendation_assigned_true;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        if (this.props.isAssignView) {
            params.client_id = this.props.clientId;
        }
        const { section, id } = this.props.match.params;
        let subParams = {};
        switch (section) {
            case "assetinfo":
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
        await this.props.getListForCommonFilter({ ...params, ...subParams, ...this.state.locationState });
        return (this.props.assetReducer.getListForCommonFilterResponse && this.props.assetReducer.getListForCommonFilterResponse.list) || [];
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
        if (this.tableRef?.current?.scrollTop) {
            this.props.setAssetScrollPosition(this.tableRef.current.scrollTop);
        }
        const { history } = this.props;
        this.setState({
            selectedData: dataId
        });
        let path = `/assets/edit/${dataId}`;
        addToBreadCrumpData({
            key: "edit",
            name: `Edit Asset`,
            path
        });
        history.push(path);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedData: null
        });
        let selectedClient = "";
        let selectedRegion = "";
        let selectedSite = "";
        let selectedBuilding = "";
        if (this.props.clientId) {
            selectedClient = this.props.clientId;
        }
        if (this.props.regionId) {
            selectedClient = this.props.basicDetails?.client?.id;
            selectedRegion = this.props.regionId;
        }
        if (this.props.siteId) {
            selectedClient = this.props.basicDetails?.client?.id;
            selectedRegion = this.props.basicDetails?.region?.id;
            selectedSite = this.props.siteId;
        }
        if (this.props.buildingId) {
            selectedClient = this.props.basicDetails?.client?.id;
            selectedRegion = this.props.basicDetails?.region?.id;
            selectedSite = this.props.basicDetails?.site?.id;
            selectedBuilding = this.props.buildingId;
        }
        addToBreadCrumpData({ key: "add", name: "Add Asset", path: "/assets/add" });
        history.push(`/assets/add?r_id=${selectedRegion}&c_id=${selectedClient}&b_id=${selectedBuilding}&s_id=${selectedSite}`);
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
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        this.setState({
            isLoading: true
        });
        await this.props.addData(data);
        const { error, message, asset_id } = this.props.assetReducer.addDataResponse;
        if (error) {
            this.setState(
                {
                    alertMessage: error,
                    isLoading: false
                },
                () => this.showAlert()
            );
        } else {
            if (query?.isRecomAsset) {
                sessionStorage.setItem("lastCreatedAssetId", asset_id);
            }
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

    handleUpdateData = async data => {
        const {
            match: {
                params: { id }
            },
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        this.setState({
            isLoading: true
        });
        await this.props.updateData(id, data);
        const { updateDataResponse } = this.props.assetReducer;
        if (updateDataResponse.error) {
            this.setState({ alertMessage: updateDataResponse.error, isLoading: false }, () => this.showAlert());
        } else {
            if (query?.isRecomAsset) {
                sessionStorage.setItem("lastCreatedAssetId", id);
            }
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
        if (this.tableRef?.current?.scrollTop) {
            this.props.setAssetScrollPosition(this.tableRef.current.scrollTop);
        }
        const { history } = this.props;
        this.setState({
            selectedData: id,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Asset",
                    path: `/assets/assetInfo/${this.props.match.params.id}/basicdetails`
                },
                {
                    key: "recommendations",
                    name: "Recommendations",
                    path: `/assets/assetInfo/${this.props.match.params.id}/recommendations`
                },
                {
                    key: "infoimages",
                    name: "Images",
                    path: `/assets/assetInfo/${this.props.match.params.id}/infoimages`
                }
            ]
        });
        if (rowData) {
            addToBreadCrumpData({
                key: "Name",
                name: rowData?.asset_name,
                path: `/assets/assetInfo/${id}/basicdetails`
            });
            addToBreadCrumpData({
                key: "info",
                name: "Basic Details",
                path: `/assets/assetInfo/${id}/basicdetails`
            });
        }
        this.updateSelectedRow(id);
        let tabKeyList = ["basicdetails", "recommendations", "infoimages"];
        history.push(`/assets/assetInfo/${id}/${tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"}`);
    };

    getDataById = async () => {
        await this.props.getAssetDataById(this.state.selectedData);
        return this.props.assetReducer.getDataByIdResponse;
    };

    getLogData = async () => {
        const { historyParams, historyPaginationParams, logData, selectedData } = this.state;
        await this.props.getAllDataLogs(selectedData, historyParams);
        const {
            getDataLogsResponse: { logs, count, error }
        } = this.props.assetReducer;
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
        await this.props.deleteDataLog(selectedLog);
        const { error, message, success } = this.props.assetReducer.deleteDataLogResponse;
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

    restoreLogOnConfirm = async selectedLog => {
        await this.props.restoreDataLog(selectedLog);
        const { error, message, success } = this.props.assetReducer.restoreDataLogResponse;
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
        this.refreshDataList();
    };

    exportTableXl = async () => {
        this.setState({ tableLoading: true });
        const {
            params: { search, filters, list, order, deleted, active, recommendation_assigned_true }
        } = this.state;
        const {
            tableData: { keys, config }
        } = this.state;
        let hide_columns = [""];
        keys.map((keyItem, i) => {
            if (config && !config[keyItem]?.isVisible) {
                hide_columns.push(config[keyItem]?.label);
            }
        });
        let exportParams = { search, filters, list, order, deleted, active, hide_columns, recommendation_assigned_true };
        if (this.props.isAssignView) {
            exportParams.client_id = this.props.clientId;
        }
        const { section, id } = this.props.match.params;
        let subParams = {};
        switch (section) {
            case "assetinfo":
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
        await this.props.exportData({ ...exportParams, ...subParams, ...this.state.locationState });
        this.setState({
            tableLoading: false
        });
        if (this.props.assetReducer.dataExportResponse && this.props.assetReducer.dataExportResponse.error) {
            await this.setState({ alertMessage: this.props.assetReducer.dataExportResponse.error });
            this.showAlert();
        }
    };

    exportCustomExcel = async () => {
        this.setState({ customExcelExportLoading: true });
        const {
            params: { search, filters, list, order, deleted, active, recommendation_assigned_true }
        } = this.state;
        const {
            tableData: { keys, config }
        } = this.state;
        let hide_columns = [""];
        keys.map((keyItem, i) => {
            if (config && !config[keyItem]?.isVisible) {
                hide_columns.push(config[keyItem]?.label);
            }
        });
        let exportParams = { search, filters, list, order, deleted, active, hide_columns, recommendation_assigned_true };
        const { section, id } = this.props.match.params;
        let subParams = {};
        switch (section) {
            case "assetinfo":
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
        await this.props.exportCustomExcel({ ...exportParams, ...subParams, ...this.state.locationState });
        this.setState({
            customExcelExportLoading: false
        });
        if (this.props.assetReducer.dataExportResponse && this.props.assetReducer.dataExportResponse.error) {
            await this.setState({ alertMessage: this.props.assetReducer.dataExportResponse.error });
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
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData() || `/assets`);
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
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={`Do you want to delete this Asset ?`}
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
        this.setState({
            showConfirmModal: false,
            isLoading: true
        });
        await this.props.deleteData(selectedData);

        const { success, message, error } = this.props.assetReducer.deleteDataResponse;

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
    getAllImageList = async (assetId, params) => {
        await this.props.getAllImages(assetId, params);
        const {
            assetReducer: { getAllImagesResponse }
        } = this.props;
        await this.setState({
            imageResponse: getAllImagesResponse
        });
        return true;
    };

    uploadImages = async (imageData = {}) => {
        const { selectedData } = this.state;
        await this.props.uploadAssetImage(imageData, selectedData || this.props.match.params.id);
        return true;
    };
    updateAssetImages = async imageData => {
        await this.props.updateAssetImage(imageData);
        return true;
    };

    deleteImages = async imageId => {
        await this.props.deleteAssetImage(imageId);
        return true;
    };

    handleSelectAsset = (data, isChecked) => {
        this.props.handleSelectAsset(data, isChecked);
    };

    filterByRecommendationAssigned = async () => {
        const { recommendation_assigned_true } = this.state.params;
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                recommendation_assigned_true:
                    recommendation_assigned_true === "true" ? "false" : recommendation_assigned_true === "false" ? null : "true"
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        await this.refreshDataList();
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
            isHistory,
            imageResponse,
            summaryRowData,
            locationState
        } = this.state;
        const {
            match: {
                params: { section }
            },
            isAssignView,
            isImageView
        } = this.props;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {!isAssignView && (section === "add" || section === "edit") ? (
                    <Form
                        selectedData={selectedData}
                        refreshDataList={this.refreshDataList}
                        handleAddData={this.handleAddData}
                        handleUpdateData={this.handleUpdateData}
                        getAssetById={this.getDataById}
                        cancelForm={this.cancelForm}
                    />
                ) : section === "assetInfo" ? (
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
                        hasEdit={checkPermission("forms", "asset_management", "edit")}
                        hasDelete={checkPermission("forms", "asset_management", "delete")}
                        hasLogView={checkPermission("logs", "asset_management", "view")}
                        hasLogDelete={checkPermission("logs", "asset_management", "delete")}
                        hasLogRestore={checkPermission("logs", "asset_management", "restore")}
                        hasInfoPage={checkPermission("forms", "asset_management", "view")}
                        // hasCreate={checkPermission("forms", "asset_management", "create")}
                        cancelInfoPage={this.cancelInfoPage}
                        cancelForm={this.cancelForm}
                        isHistory={isHistory}
                        toggleHistory={this.toggleHistory}
                        entity={"assets"}
                        getAllImageList={this.getAllImageList}
                        uploadImages={this.uploadImages}
                        imageResponse={imageResponse}
                        updateAssetImages={this.updateAssetImages}
                        deleteImages={this.deleteImages}
                        tableData={this.props.assetReducer.getDataResponse?.assets}
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
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
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
                        exportTableXl={this.exportTableXl}
                        exportCustomExcel={this.exportCustomExcel}
                        tableLoading={this.state.tableLoading}
                        customExcelExportLoading={this.state.customExcelExportLoading}
                        showViewModal={this.showViewModal}
                        summaryRowData={summaryRowData}
                        handleDelete={this.handleDeleteData}
                        hasExport={checkPermission("forms", "asset_management", "export")}
                        showAddButton={!isAssignView && !isImageView && checkPermission("forms", "asset_management", "create")}
                        hasEdit={checkPermission("forms", "asset_management", "edit")}
                        hasDelete={checkPermission("forms", "asset_management", "delete")}
                        hasInfoPage={!isAssignView && checkPermission("forms", "asset_management", "view")}
                        hasActionColumn={!isAssignView}
                        isAssignAsset={isAssignView}
                        entity={"assets"}
                        handleSelectAsset={this.handleSelectAsset}
                        selectedAsset={this.props.assetReducer.selectedAsset}
                        tableRef={this.tableRef}
                        filterByRecommendationAssigned={this.filterByRecommendationAssigned}
                        isAssetsChartsFiltered={Object.keys(locationState).length > 0}
                        hasViewIcon={!isAssignView && checkPermission("forms", "asset_management", "view")}
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
    const { assetReducer } = state;
    return { assetReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Assets)
);
