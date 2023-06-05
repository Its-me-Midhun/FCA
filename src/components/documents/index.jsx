import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { documentTableData } from "../../config/tableData";
import qs from "query-string";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import Loader from "../common/components/Loader";
import actions from "./actions";
import ReportMain from "./components/documentsMain";
import { addToBreadCrumpData, popBreadCrumpRecData, popBreadCrumpData, findPrevPathFromBreadCrumpData, checkPermission } from "../../config/utils";
import Form from "./components/form";
import Reportinfo from "./components/documentsInfo";
import Portal from "../common/components/Portal";
import ConfirmationModal from "../common/components/ConfirmationModal";
import ViewModal from "../common/components/ViewModal";
import { MASTER_FILTER_KEYS } from "./constants";

class Index extends Component {
    state = {
        isLoading: false,
        historyPaginationParams: this.props.reportReducer.entityParams.historyPaginationParams,
        historyParams: this.props.reportReducer.entityParams.historyParams,
        tableData: {
            keys: documentTableData.keys,
            config: this.props.reportReducer.entityParams.tableConfig || _.cloneDeep(documentTableData.config)
        },
        sortParams: {
            order: {
                "efci_versions.created_at": "desc"
            }
        },
        params: this.props.reportReducer.entityParams.params,
        reportData: [],
        alertMessage: "",
        showWildCardFilter: false,
        selectedRowId: this.props.reportReducer.entityParams.selectedRowId,
        showViewModal: false,
        permissions: {},
        paginationParams: this.props.reportReducer.entityParams.paginationParams,
        selectedDocument: null,
        infoTabsData: [
            {
                key: "maindetails",
                name: "Main Details",
                path: `/documents/reportinfo/${this.props.match.params.id}/maindetails`
            }
        ],
        logData: {
            count: "",
            data: []
        },
        tableLoading: false,
        masterFilters: this.props.reportReducer.entityParams.masterFilters
    };

    componentDidMount = async () => {
        if (!this.isMasterFiltered() && this.props.match.path === "/documents") {
            await this.setDefaultFilter();
        }
        await this.refreshReportList();
    };

    refreshReportList = async () => {
        await this.setState({ isLoading: true });
        let docParams = this.state.params;
        let updatedDocParams = this.getParamsForDocument(docParams);
        await this.props.getAllReports(updatedDocParams);

        if (
            this.props.reportReducer.getAllReports.documents &&
            !this.props.reportReducer.getAllReports.documents.length &&
            this.props.reportReducer.getAllReports &&
            this.props.reportReducer.getAllReports.error
        ) {
            await this.setState({ alertMessage: this.props.reportReducer.getAllReports.error });
            this.showAlerts();
        }

        this.setState({
            tableData: {
                ...this.state.tableData,
                data: this.props.reportReducer.getAllReports.documents,
                config: this.props.reportReducer.entityParams.tableConfig || this.state.tableData.config
            },
            reportList: this.props.reportReducer.getAllReports.documents,
            paginationParams: {
                ...this.state.paginationParams,
                totalCount: this.props.reportReducer.getAllReports.count,
                totalPages: Math.ceil(this.props.reportReducer.getAllReports.count / this.state.paginationParams.perPage)
            },
            showWildCardFilter: this.state.params.filters ? true : false
        });
        await this.setState({ isLoading: false });
    };

    showAlerts = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
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
        await this.refreshReportList();
    };

    updateSelectedRow = async rowId => {
        await this.setState({
            selectedRowId: rowId
        });
        await this.updateEntityParams();
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    handleDeleteReport = async (id, isDeleted) => {
        await this.setState({
            showConfirmModal: true,
            selectedDocument: id,
            isDeleted: isDeleted
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, isDeleted } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Document?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteDocumentOnConfirm}
                        isDeleted={isDeleted}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteDocumentOnConfirm = async (ishardDelete = false) => {
        const { selectedDocument } = this.state;
        const {
            match: {
                params: { section = "" }
            }
        } = this.props;

        this.setState({
            showConfirmModal: false,
            isLoading: true
        });
        await this.props.deleteDocument(selectedDocument);
        if (this.props.reportReducer.deleteDocumentsResponse && this.props.reportReducer.deleteDocumentsResponse.error) {
            await this.setState({
                alertMessage: this.props.reportReducer.deleteDocumentsResponse.error,
                showConfirmModal: false,
                isRedirectionOnDelete: false,
                selectedDocument: null
            });
            this.showAlerts();
        } else {
            if (this.props.reportReducer.deleteDocumentsResponse && this.props.reportReducer.deleteDocumentsResponse.success) {
                await this.setState({
                    alertMessage: this.props.reportReducer.deleteDocumentsResponse.message
                });
                this.showAlerts();
            }
            await this.refreshReportList();
            // await this.props.getMenuItems();

            if (this.props.match.params.id && section === "reportinfo") {
                popBreadCrumpRecData();
                this.props.history.push(findPrevPathFromBreadCrumpData() || "/documents");
                // this.props.history.push(redirectionurl[2].path || "/recommendations");
            }
            this.setState({
                showConfirmModal: false,
                selectedDocument: null
            });
        }
        this.setState({
            isLoading: false
        });
    };

    showEditPage = reportId => {
        const { history } = this.props;
        this.setState({
            selectedDocument: reportId
        });
        addToBreadCrumpData({ key: "edit", name: "Edit Report", path: `/documents/edit/${reportId}` });

        history.push(`/documents/edit/${reportId}`);
        // let editUrl = this.getAddorEditDocumentUrl("", this.props.basicDetails);
        // addToBreadCrumpData({ key: "edit", name: "Edit Report", path: `/documents/edit/${reportId}${editUrl}` });
        // history.push(`/documents/edit/${reportId}${editUrl}`);
    };

    showInfoPage = documentId => {
        const { history } = this.props;
        this.setState({
            selectedDocument: documentId,
            infoTabsData: [
                {
                    key: "Document",
                    name: "Document",
                    path: `/documents/reportinfo/${documentId}/maindetails`
                }
            ]
        });
        history.push(`/documents/reportinfo/${documentId}/maindetails`);
    };

    showAddForm = regionId => {
        const { history } = this.props;
        const selectedDocument = this.props.match.params.id;
        this.setState({
            selectedDocument: null
        });
        let addUrl = this.getAddorEditDocumentUrl(selectedDocument, this.props.basicDetails);
        addToBreadCrumpData({ key: "add", name: "Add Document", path: `/documents/add${addUrl}` });
        history.push(`/documents/add${addUrl}`);
    };

    getAddorEditDocumentUrl = (currentEntity, parentData) => {
        const {
            match: {
                params: { section = "" }
            },
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let selectedConsultancy = parentData?.consultancy?.id || "";
        let selectedClient = parentData?.client?.id || "";
        let selectedRegion = parentData?.region?.id || "";
        let selectedSite = parentData?.site?.id || "";
        let selectedProject = query.pid || parentData?.project?.id || "";
        let selectedBuilding = parentData?.building?.id || "";
        let selectedFloor = parentData?.floor?.id || "";
        switch (section) {
            case "clientinfo":
                return `?cty_id=${selectedConsultancy}&c_id=${currentEntity}`;
            case "regioninfo":
                return `?cty_id=${selectedConsultancy}&c_id=${selectedClient}&r_id=${currentEntity}&p_id=${selectedProject}`;
            case "siteinfo":
                return `?cty_id=${selectedConsultancy}&c_id=${selectedClient}&s_id=${currentEntity}&r_id=${selectedRegion}&p_id=${selectedProject}`;
            case "buildinginfo":
                return `?cty_id=${selectedConsultancy}&c_id=${selectedClient}&s_id=${selectedSite}&b_id=${currentEntity}&r_id=${selectedRegion}&p_id=${selectedProject}`;
            case "projectinfo":
                return `?cty_id=${selectedConsultancy}&c_id=${selectedClient}&p_id=${currentEntity}`;
            case "initiativeInfo":
                return `?cty_id=${selectedConsultancy}&c_id=${selectedClient}&s_id=${selectedSite}&i_id=${currentEntity}&r_id=${selectedRegion}&p_id=${selectedProject}`;
            case "recommendationsinfo":
                return `?cty_id=${selectedConsultancy}&c_id=${selectedClient}&s_id=${selectedSite}&rec_id=${currentEntity}&r_id=${selectedRegion}&p_id=${selectedProject}&b_id=${selectedBuilding}&f_id=${selectedFloor}`;
            default:
                if (currentEntity) {
                    return `?d_id=${currentEntity}`;
                } else {
                    return "";
                }
        }
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
        await this.refreshReportList();
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
        await this.refreshReportList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.forEach(key => {
            if (!_.isEqual(config[key]?.isVisible, documentTableData.config[key]?.isVisible)) {
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
        await this.refreshReportList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Reports",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            masterFilters: this.state.masterFilters
        };
        await this.props.updateReportEntityParams(entityParams);
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
            this.state.tableData.keys.forEach(item => {
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

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        const { masterFilters } = this.state;
        params.search = search;
        params.filters = filters;
        params = { ...params, ...masterFilters };
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field)) : null;
        let commonFilterParams = this.getParamsForDocument(params);
        await this.props.getListForCommonFilter(commonFilterParams);
        return (this.props.reportReducer.getListForCommonFilterResponse && this.props.reportReducer.getListForCommonFilterResponse.list) || [];
    };

    getParamsForDocument = params => {
        const {
            match: {
                params: { section }
            }
        } = this.props;
        switch (section) {
            case "clientinfo":
                return { ...params, client_id: this.props.clientId };
            case "regioninfo":
                return { ...params, region_id: this.props.regionId };
            case "siteinfo":
                return { ...params, site_id: this.props.siteId };
            case "buildinginfo":
                return { ...params, building_id: this.props.buildingId };
            case "projectinfo":
                return { ...params, project_id: this.props.projectId };
            case "initiativeInfo":
                return { ...params, initiative_id: this.props.initiativeId };
            case "recommendationsinfo":
                return { ...params, recommendation_id: this.props.recommendationId };
            default:
                return { ...params };
        }
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
        await this.refreshReportList();
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
                project_id: null,
                filters: null,
                list: null
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshReportList();
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
        await this.refreshReportList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshReportList();
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
                config: _.cloneDeep(documentTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshReportList();
    };
    exportTableXl = async () => {
        let exportParams = {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...this.state.masterFilters
        };
        let updatedExportParams = this.getParamsForDocument(exportParams);
        await this.setState({ tableLoading: true });
        await this.props.exportDocuments({
            ...updatedExportParams
        });
        await this.setState({ tableLoading: false });
    };

    handleUpdateDocument = async (data, documentChanged) => {
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.updateDocument(this.props.match.params.id, data, documentChanged);
        if (this.props.reportReducer.updateDocumentsResponse && this.props.reportReducer.updateDocumentsResponse.error) {
            await this.setState({
                alertMessage: this.props.reportReducer.updateDocumentsResponse.error
            });
            popBreadCrumpData();
            history.push(findPrevPathFromBreadCrumpData() || "/documents");
            this.showAlerts();
        } else {
            if (this.props.reportReducer.updateDocumentsResponse && this.props.reportReducer.updateDocumentsResponse.success) {
                await this.setState({
                    alertMessage: this.props.reportReducer.updateDocumentsResponse.message
                });
                this.showAlerts();
            }
            await this.refreshReportList();
            popBreadCrumpData();
            history.push(findPrevPathFromBreadCrumpData() || "/documents");
        }
        this.setState({
            isLoading: false
        });
    };

    handleAddDocument = async data => {
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.addDocument(data);
        if (this.props.reportReducer.addDocumentsResponse && this.props.reportReducer.addDocumentsResponse.error) {
            await this.setState({
                alertMessage: this.props.reportReducer.addDocumentsResponse.error
            });
            popBreadCrumpData();
            history.push(findPrevPathFromBreadCrumpData() || "/documents");
            this.showAlerts();
        } else {
            if (this.props.reportReducer.addDocumentsResponse && this.props.reportReducer.addDocumentsResponse.success) {
                await this.setState({
                    alertMessage: this.props.reportReducer.addDocumentsResponse.message
                });
                this.showAlerts();
            }
            popBreadCrumpData();
            await this.refreshReportList();
            history.push(findPrevPathFromBreadCrumpData() || "/documents");
        }
        this.setState({
            isLoading: false
        });
    };

    getDataById = async documentId => {
        // --------------avoid loader while edit cancel -------------
        const {
            match: {
                params: { section }
            }
        } = this.props;

        if (section === "edit") {
            this.setState({
                isLoading: true
            });
        }
        //    -------------------------------------
        // this.setState({
        //     isLoading: true
        // })
        await this.props.getDocumentById(documentId);
        this.setState({
            isLoading: false
        });

        return this.props.reportReducer.getDocumentsByIdResponse;
    };

    openDeleteBox = (isDeleted = false) => {
        this.setState({
            showConfirmModal: true,
            isRedirectionOnDelete: true,
            isDeleted: isDeleted
        });
    };
    openRestoreBox = () => {
        this.setState({
            showRestoreConfirmModal: true,
            isRedirectionOnDelete: true
        });
    };

    getLogData = async reportId => {
        const { historyParams } = this.state;
        await this.props.getAllDocumentLogs(reportId, historyParams);
        const {
            reportReducer: {
                getAllDocumentsLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.reportReducer.getAllDocumentsLogsResponse && this.props.reportReducer.getAllDocumentsLogsResponse.error) {
            await this.setState({ alertMessage: this.props.reportReducer.getAllDocumentsLogsResponse.error });
            this.showAlerts();
        } else {
            await this.setState({
                logData: {
                    ...this.state.logData,
                    data: logs
                },
                historyPaginationParams: {
                    ...this.state.historyPaginationParams,
                    totalCount: count,
                    totalPages: this.state.historyPaginationParams && Math.ceil(count / this.state.historyPaginationParams.perPage)
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
                // offset: page.selected * historyPaginationParams.perPage
                offset: page.selected + historyPaginationParams.perPage
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

    handleDeleteLog = async (id, choice = "delete") => {
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
        await this.props.deleteDocumentLog(selectedLog);
        if (this.props.reportReducer.deleteDocumentsLogResponse && this.props.reportReducer.deleteDocumentsLogResponse.error) {
            await this.setState({ alertMessage: this.props.reportReducer.deleteDocumentsLogResponse.error });
            this.showAlerts();
        }
        await this.getLogData(this.props.match.params.id);
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreDocumentLog(id);
        if (this.props.reportReducer.restoreDocumentsLogResponse && this.props.reportReducer.restoreDocumentsLogResponse.error) {
            await this.setState({ alertMessage: this.props.reportReducer.restoreDocumentsLogResponse.error });
            this.showAlerts();
        }
        await this.refreshReportList();
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
        await this.props.deleteDocumentLog(selectedLog);
        if (this.props.reportReducer.deleteDocumentsLogResponse && this.props.reportReducer.deleteDocumentsLogResponse.error) {
            await this.setState({ alertMessage: this.props.reportReducer.deleteDocumentsLogResponse.error });
            this.showAlerts();
        }
        await this.getLogData(this.props.match.params.id);
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreReportLog = async id => {
        await this.props.restoreDocumentLog(id);
        if (this.props.reportReducer.restoreDocumentLog && this.props.reportReducer.restoreDocumentLog.error) {
            await this.setState({ alertMessage: this.props.reportReducer.restoreDocumentLog.error });
            this.showAlerts();
        }
        await this.refreshReportList();
    };

    setDefaultFilter = async () => {
        await this.props.getMasterFilterLists("clients");
        const { defaultClient } = this.props.reportReducer.masterFilterList || {};
        if (defaultClient) {
            await this.setState({
                params: {
                    ...this.state.params,
                    client_ids: [defaultClient]
                },
                masterFilters: { ...this.state.masterFilters, client_ids: [defaultClient] }
            });
        }
    };

    isMasterFiltered = () => {
        let flag = false;
        MASTER_FILTER_KEYS.forEach(item => {
            if (this.state.params[item.paramKey]?.length) {
                flag = true;
                return;
            }
        });
        return flag;
    };

    updateMasterFilters = masterFilters => {
        this.setState(
            {
                params: {
                    ...this.state.params,
                    ...masterFilters,
                    offset: 1
                },
                masterFilters
            },
            () => {
                this.updateEntityParams();
                this.refreshReportList();
            }
        );
    };

    render() {
        const {
            tableData,
            showWildCardFilter,
            paginationParams,
            selectedRowId,
            permissions,
            selectedDocument,
            infoTabsData,
            logData,
            historyPaginationParams,
            showViewModal,
            historyParams,
            masterFilters
        } = this.state;
        const {
            match: {
                params: { section },
                path
            },
            reportReducer: { masterFilterList }
        } = this.props;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedDocument={selectedDocument}
                        handleAddDocument={this.handleAddDocument}
                        handleUpdateDocument={this.handleUpdateDocument}
                        getDataById={this.getDataById}
                    />
                ) : section === "reportinfo" ? (
                    <Reportinfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        handleUpdateData={this.handleUpdateDocument}
                        showInfoPage={this.showInfoPage}
                        showRestoreBox={this.openRestoreBox}
                        getAllSettingsLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        handleRestoreLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        handleDeleteReport={this.handleDeleteReport}
                        showEditPage={this.showEditPage}
                        // permissions={permissions}
                        // logPermission={logPermission}
                        hasEdit={checkPermission("forms", "documents", "edit")}
                        hasDelete={checkPermission("forms", "documents", "delete")}
                        hasLogView={checkPermission("logs", "documents", "view")}
                        hasLogDelete={checkPermission("logs", "documents", "delete")}
                        hasLogRestore={checkPermission("logs", "documents", "restore")}
                        hasInfoPage={checkPermission("forms", "documents", "view")}
                        entity="documents"
                    />
                ) : (
                    <ReportMain
                        tableData={tableData}
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        showViewModal={this.showViewModal}
                        handleDeleteReport={this.handleDeleteReport}
                        showEditPage={this.showEditPage}
                        showInfoPage={this.showInfoPage}
                        showAddForm={this.showAddForm}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilter={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        isValueChanged={this.state.isValueChanged}
                        hasExport={checkPermission("forms", "documents", "export")}
                        showAddButton={checkPermission("forms", "documents", "create")}
                        hasEdit={checkPermission("forms", "documents", "edit")}
                        hasDelete={checkPermission("forms", "documents", "delete")}
                        hasInfoPage={checkPermission("forms", "documents", "view")}
                        entity="documents"
                        hasMasterFilter={path === "/documents"}
                        updateMasterFilters={this.updateMasterFilters}
                        masterFilters={masterFilters}
                        masterFilterList={masterFilterList}
                        getFilterLists={this.props.getMasterFilterLists}
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
    const { reportReducer } = state;
    return { reportReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Index)
);
