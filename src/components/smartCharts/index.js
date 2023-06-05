import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../common/components/Loader";
import CreateSmartChart from "./components/CreateSmartChart";
import { smartChartTableData } from "../../config/tableData";
import actions from "./actions";
import "../../assets/css/smart-chart.css";
import SmartChartMain from "./components/smartChartMain";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import { checkPermission, addToBreadCrumpData, resetBreadCrumpData, bulkResetBreadCrumpData } from "../../config/utils";
import { permissions } from "../../config/permissions";
import SmartChartDataEditForm from "./components/SmartChartDataEditForm";
import ViewPropertyModal from "./components/ViewPropertyModal";
import ReportsByTemplateModal from "./components/ReportsByTemplateModal";
import LockPasswordModal from "./components/LockPasswordModal";
import SelectDownloadTypeModal from "../common/components/SelectExportTypeWordModal";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            paginationParams: this.props.smartChartReducer.entityParams.paginationParams,
            showFormModal: false,
            showWildCardFilter: false,
            selectedRowId: this.props.smartChartReducer.entityParams.selectedRowId,
            params: this.props.smartChartReducer.entityParams.params,
            tableData: {
                keys: smartChartTableData.keys,
                config: this.props.smartChartReducer.entityParams.tableConfig || _.cloneDeep(smartChartTableData.config)
            },
            alertMessage: "",
            wildCardFilterParams: this.props.smartChartReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.smartChartReducer.entityParams.filterParams,
            showConfirmModal: false,
            selectedSmartChartReport: "",
            showSmartChartDataEditModal: false,
            selectedSmartChartData: null,
            mFilters: {},
            defaultFilterParams: {},
            selectedProperty: null,
            showViewPropertyModal: false,
            showViewReportsModal: false,
            showLockTemplateModal: false,
            selectedReportTemplate: null,
            isLockLoading: false,
            actionTypeForModal: "",
            showSelectDownloadTypeModal: false,
            selectedReport: ""
        };
    }

    componentDidMount = async () => {
        const { isModalView = false } = this.props;
        if (!isModalView) {
            let currentUser = localStorage.getItem("userId") || "";
            await this.props.getSmartChartMasterFilterDropDown("clients", "smart_report_list_filter", { user_id: currentUser });
            let clientList = this.props.smartChartReducer.masterFilterList?.smart_report_list_filter?.clients || [];
            if (clientList.length) {
                let defaultClient = clientList.find(client => client.default == true);
                if (defaultClient) {
                    await this.props.getSmartChartMasterFilterDropDown("projects", "smart_report_list_filter", {
                        client_id: defaultClient.id,
                        user_id: currentUser
                    });
                    await this.setState({
                        mFilters: {
                            client_ids: [defaultClient.id]
                        },
                        defaultFilterParams: {
                            client_ids: [defaultClient.id]
                        }
                    });
                    await this.updateEntityParams();
                }
            }
        }
        await this.refreshExportedSmartChartList();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.match.params.section !== this.props.match.params.section && this.props.match.params.section === "reports") {
            await this.refreshExportedSmartChartList();
        }
    };

    refreshExportedSmartChartList = async () => {
        const { isModalView = false } = this.props;
        let currentUser = localStorage.getItem("userId") || "";
        this.setState({ isLoading: true });
        const { params, paginationParams, tableData, mFilters } = this.state;
        let exportedSmartChartList = [];
        let totalCount = 0;
        const { filterKeys, limit, offset, search, order, template_filter } = params;
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .map(item => item.replace("setting_name", "setting_id__name"))
            .join(",");
        let templateParams = {
            ...filterKeys,
            limit,
            offset,
            search_query: search
            // ordering,
            // per_page_count: limit,
            // page_number: offset + 1
        };
        if (mFilters?.project_ids?.length) {
            templateParams.project_id = [...mFilters.project_ids];
        }
        if (mFilters?.client_ids?.length) {
            templateParams.client_id = mFilters.client_ids[0];
        }
        if (!mFilters?.project_ids?.length && !mFilters?.client_ids?.length) {
            templateParams.user_id = currentUser;
        }

        if (!isModalView) {
            await this.props.getExportedSmartChartList(templateParams);
        } else {
            await this.props.getReportsByTemplateList({ property_id: this.props.currentPropertyId });
        }
        const { exportedSmartChartListResponse, reportsByTemplateListResponse } = this.props.smartChartReducer;
        exportedSmartChartList = !isModalView ? exportedSmartChartListResponse?.data : reportsByTemplateListResponse?.data || [];
        totalCount = !isModalView ? exportedSmartChartListResponse?.count : reportsByTemplateListResponse?.count || 0;

        // go to previous page if no data found in the current page
        if (exportedSmartChartList && !exportedSmartChartList.length && paginationParams.currentPage) {
            await this.setState({
                paginationParams: {
                    ...paginationParams,
                    currentPage: this.state.paginationParams.currentPage - 1
                },
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            return await this.refreshExportedSmartChartList();
        }

        if (exportedSmartChartList && !exportedSmartChartList.length && exportedSmartChartListResponse && exportedSmartChartListResponse.error) {
            this.showAlert(exportedSmartChartListResponse.error);
        }

        exportedSmartChartList.map(temp => {
            temp.created_at = moment(temp.created_date).format("MM-DD-YYYY h:mm A");
        });
        this.setState({
            tableData: {
                ...tableData,
                data: exportedSmartChartList
                // config: tableData.config
            },
            exportedSmartChartList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            isLoading: false
        });
        return true;
    };

    showAlert = msg => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = msg;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
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
        // this.updateEntityParams();
        await this.refreshExportedSmartChartList();
    };

    updateEntityParams = async () => {
        const { mFilters } = this.state;
        await this.props.updateSmartReportsEntityParams({ ...mFilters });
    };

    resetAllFilters = async () => {
        const { defaultFilterParams } = this.state;
        await this.setState({
            mFilters: {
                ...defaultFilterParams
            }
        });
        this.updateEntityParams();
        await this.refreshExportedSmartChartList();
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
                config: _.cloneDeep(smartChartTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        // this.updateEntityParams();
        await this.refreshExportedSmartChartList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        // this.updateEntityParams();
        await this.refreshExportedSmartChartList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, smartChartTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    getListForCommonFilter = async params => {
        // await this.props.getListForCommonFilter(params);
        // return (
        //     (this.props.reportPropertyReducer.getListForCommonFilterResponse &&
        //         this.props.reportPropertyReducer.getListForCommonFilterResponse.list) ||
        //     []
        // );
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
        // this.updateEntityParams();
        await this.refreshExportedSmartChartList();
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
        // this.updateEntityParams();
        await this.refreshExportedSmartChartList();
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
        // await this.updateEntityParams();
        return true;
    };

    updateSelectedRow = async rowId => {
        await this.setState({
            selectedRowId: rowId
        });
        // await this.updateEntityParams();
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
        await this.refreshExportedSmartChartList();
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
                offset: page.selected
            }
        });
        await this.refreshExportedSmartChartList();
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
        await this.refreshExportedSmartChartList();
    };

    showLongAlert = msg => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = msg;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
        }
    };

    handleDownloadItem = async url => {
        const link = document.createElement("a");
        link.href = url;
        link.download = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    deleteSmartChartReport = id => {
        this.setState({
            showConfirmModal: true,
            selectedSmartChartReport: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this smart report?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteSmartChartReportConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteSmartChartReportConfirm = async () => {
        const { selectedSmartChartReport } = this.state;
        this.setState({
            isLoading: true,
            showConfirmModal: false
        });
        await this.props.deleteSmartChartReport(selectedSmartChartReport);
        if (this.props.smartChartReducer.deleteSmartChartReportResponse?.error) {
            this.showAlert("Oops..! failed to delete");
        } else {
            this.showAlert("Deleted successfully");
            await this.refreshExportedSmartChartList();
        }
        this.setState({
            showConfirmModal: false,
            selectedSmartChartReport: null,
            isLoading: false
        });
    };

    regenerateSmartChart = async params => {
        const {
            exportSmartChartData,
            match: {
                params: { section = "" }
            }
        } = this.props;
        await exportSmartChartData(params);
        await this.setState({ showViewPropertyModal: false, selectedProperty: null });
        if (section === "reports") {
            this.refreshExportedSmartChartList();
        } else {
            this.props.history.push("/smartcharts/reports");
        }
    };

    toggleSmartChartDataEditModal = (data, type) => {
        this.setState({
            showSmartChartDataEditModal: !this.state.showSmartChartDataEditModal,
            selectedSmartChartData: data,
            actionTypeForModal: type
        });
    };

    renderSmartChartDataEditModal = () => {
        const { showSmartChartDataEditModal, selectedSmartChartData, actionTypeForModal } = this.state;
        if (!showSmartChartDataEditModal) return null;
        return (
            <Portal
                body={
                    <SmartChartDataEditForm
                        onCancel={() => this.toggleSmartChartDataEditModal()}
                        selectedData={selectedSmartChartData}
                        updateData={this.updateSmartReportData}
                        heading={`${actionTypeForModal || "Update"} Smart Chart Report`}
                        regenerateSmartChart={this.regenerateSmartChart}
                        exportSmartChart={this.handleExportSmartReport}
                        buttonText={actionTypeForModal || "Update"}
                        hasExportType={actionTypeForModal === "Regenerate" || actionTypeForModal === "Export" ? true : false}
                        actionType={actionTypeForModal}
                    />
                }
                onCancel={() => this.toggleSmartChartDataEditModal()}
            />
        );
    };

    updateSmartReportData = async (params, id) => {
        await this.props.updateSmartReportData(id, params);
        await this.refreshExportedSmartChartList();
        if (this.props.smartChartReducer.updateSmartChartDataResponse?.success) {
            this.showAlert("Updated successfully");
        }
    };

    updateMfilterForSmartChartList = async params => {
        let currentUser = localStorage.getItem("userId") || "";
        let updateFilterParams = {};
        if (params.mfilterKey === "client_ids") {
            await this.props.getSmartChartMasterFilterDropDown("projects", "smart_report_list_filter", {
                client_id: params.filterValues?.[0],
                user_id: currentUser
            });
            // let projectList = this.props.smartChartReducer.masterFilterList?.smart_report_list_filter?.projects || [];
            updateFilterParams = {
                [params.mfilterKey]: params.filterValues,
                project_ids: []
                // project_ids: projectList?.length && params.filterValues?.[0] ? [projectList[0].id] : []
            };
        } else {
            updateFilterParams = { [params.mfilterKey]: params.filterValues };
        }
        this.setState(
            {
                mFilters: {
                    ...this.state.mFilters,
                    ...updateFilterParams
                }
            },
            () => {
                this.updateEntityParams();
                this.refreshExportedSmartChartList();
            }
        );
    };

    handleClickTab = tab => {
        if (tab.key === "reporttemplates" || tab.key === "reports" || tab.key === "documents" || tab.key === "images") {
            this.props.history.push(tab.url);
            bulkResetBreadCrumpData([
                { key: "main", name: "Smart Charts", path: `/smartcharts/${tab.key}` },
                {
                    key: tab.key,
                    name: tab.label,
                    path: `/smartcharts/${tab.key}`
                }
            ]);
        }
    };

    viewSmartChartProperty = async (propertyId, fromExport = false) => {
        this.setState({ showViewPropertyModal: true, selectedProperty: propertyId });
    };

    exportSmartChartFromView = async id => {
        //temp fxn,will remove in future
        await this.props.exportSmartChartData({ property_id: id });
        this.props.history.push("/smartcharts/reports");
        this.showLongAlert("Export initiated. The file will be sent to your email");
        this.refreshExportedSmartChartList();
    };

    renderSmartChartViewPropertyModal = () => {
        const { showViewPropertyModal, selectedProperty, isLockLoading } = this.state;
        if (!showViewPropertyModal) return null;
        let smartChartPropertyByIdData = this.props.smartChartReducer.getSmartChartPropertyByIdResponse;
        const {
            match: {
                params: { section = "" }
            }
        } = this.props;
        return (
            <Portal
                body={
                    <ViewPropertyModal
                        getSmartChartPropertyById={this.props.getSmartChartPropertyById}
                        smartChartPropertyByIdData={smartChartPropertyByIdData}
                        currentPropertyId={selectedProperty}
                        onCancel={() => this.setState({ showViewPropertyModal: false, selectedProperty: null })}
                        handleEditSmartChartProperty={this.handleEditSmartChartProperty}
                        currentTab={section}
                        showSmartChartDataEditModal={this.toggleSmartChartDataEditModal}
                        viewReports={this.toggleViewReportsModal}
                        lockOrUnlockReportTemplate={this.lockOrUnlockReportTemplate}
                        isLockLoading={isLockLoading}
                    />
                }
                onCancel={() => this.setState({ showViewPropertyModal: false, selectedProperty: null })}
            />
        );
    };

    handleEditSmartChartProperty = (propertyData, fromModal = false) => {
        if (fromModal) {
            sessionStorage.setItem("selectedProperty", propertyData.id);
        }
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Report Template",
            path: `/smartcharts/reporttemplates/edit/${propertyData.id}`
        });
        this.props.history.push(`/smartcharts/reporttemplates/edit/${propertyData.id}`, {
            property: propertyData
        });
    };

    handleExportSmartReport = async (params, refreshReports = false) => {
        await this.props.exportSmartChartData(params);
        this.showLongAlert("Export initiated. The file will be sent to your email");
        this.props.history.push("/smartcharts/reports");
        if (refreshReports) {
            this.refreshExportedSmartChartList();
        }
    };

    //temporary fix
    updateFiltersForMasterFilter = async filterValues => {
        await this.setState({
            mFilters: filterValues
        });
    };

    toggleViewReportsModal = propertyId => {
        this.setState({
            showViewReportsModal: true,
            selectedProperty: propertyId
        });
    };

    renderViewReportsModal = () => {
        const { showViewReportsModal, selectedProperty, mFilters } = this.state;
        if (!showViewReportsModal) return null;
        let clientId = mFilters?.client_ids?.[0] || "";
        return (
            <Portal
                body={
                    <ReportsByTemplateModal
                        currentPropertyId={selectedProperty}
                        clientId={clientId}
                        onCancel={() => this.setState({ showViewReportsModal: false, selectedProperty: null })}
                    />
                }
                onCancel={() => this.setState({ showViewReportsModal: false, selectedProperty: null })}
            />
        );
    };

    lockOrUnlockReportTemplate = async template => {
        let userRole = localStorage.getItem("role");
        if (userRole !== "super_admin") {
            if (!template.password && template.is_locked) {
                this.showAlert("This template is locked by system admin. please contact admin to unlock it.");
            } else {
                this.setState({ showLockTemplateModal: true, selectedReportTemplate: template });
            }
        } else {
            this.lockUpdateConfirm(template);
        }
    };

    renderLockPasswordModal = () => {
        const { showLockTemplateModal, selectedReportTemplate, isLockLoading } = this.state;
        if (!showLockTemplateModal) return null;
        return (
            <Portal
                body={
                    <LockPasswordModal
                        onCancel={() => this.setState({ showLockTemplateModal: false })}
                        updateLockPassword={this.lockUpdateConfirm}
                        selectedReportTemplate={selectedReportTemplate}
                        isLockLoading={isLockLoading}
                    />
                }
                onCancel={() => this.setState({ showLockTemplateModal: false })}
            />
        );
    };

    lockUpdateConfirm = async templateParams => {
        let userRole = localStorage.getItem("role");
        let currentUser = localStorage.getItem("userId") || "";
        this.setState({ isLockLoading: true });

        let lockParams = {
            is_locked: !templateParams.is_locked,
            property_id: templateParams.id,
            user_id: currentUser
        };
        if (templateParams.password) {
            lockParams.password = templateParams.password;
        }
        await this.props.lockSmartChartTemplate(lockParams);
        if (this.props.smartChartReducer.lockSmartChartTemplateResponse.success === false && templateParams.is_locked && userRole !== "super_admin") {
            this.setState({ isLockLoading: false });
            this.showAlert("Wrong password !!!");
        } else {
            if (this.state.showViewPropertyModal) {
                this.props.getSmartChartPropertyById(templateParams.id);
            }
            this.setState({ showLockTemplateModal: false, isLockLoading: false });
        }
    };

    toggleSelectDownloadTypeModal = item => {
        this.setState({
            showSelectDownloadTypeModal: true,
            selectedReport: item
        });
    };

    renderSelectDownloadTypeModal = () => {
        const { showSelectDownloadTypeModal } = this.state;
        if (!showSelectDownloadTypeModal) return null;
        return (
            <Portal
                body={
                    <SelectDownloadTypeModal
                        onCancel={() => this.setState({ showSelectDownloadTypeModal: false })}
                        isSmartChart={true}
                        isBuildingAddition={false}
                        isWordExcel={false}
                        onOk={this.selectDownloadTypeConfirm}
                    />
                }
                onCancel={() => this.setState({ showSelectDownloadTypeModal: false, selectedReport: "" })}
            />
        );
    };

    selectDownloadTypeConfirm = (sortType, fileType) => {
        const { selectedReport } = this.state;
        this.setState({ showSelectDownloadTypeModal: false });
        this.handleDownloadItem(fileType === "pdf" ? selectedReport?.pdf_url : selectedReport?.doc_url);
    };

    render() {
        const {
            match: {
                params: { section = "", viewType = "" }
            },
            getSmartChartMasterFilterDropDown,
            exportSmartChartData,
            saveSmartChartData,
            getSmartChartPropertyById,
            isModalView
        } = this.props;
        const { showWildCardFilter, paginationParams, tableData, selectedRowId, mFilters } = this.state;
        let projectsDropdownData = this.props.smartChartReducer.getprojectsInMasterDropdownData?.data || [];
        let exportSmartChartDataResponse = this.props.smartChartReducer.exportSmartChartDataResponse;
        let masterFilterList = this.props.smartChartReducer.masterFilterList;
        let saveSmartChartResponse = this.props.smartChartReducer.saveSmartChartDataResponse;
        let smartChartPropertyByIdData = this.props.smartChartReducer.getSmartChartPropertyByIdResponse;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                <>
                    {(viewType === "edit" || section === "new") && !isModalView ? (
                        <CreateSmartChart
                            getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                            projectsDropdownData={projectsDropdownData}
                            exportSmartChartData={exportSmartChartData}
                            exportSmartChartDataResponse={exportSmartChartDataResponse}
                            masterFilterList={masterFilterList}
                            saveSmartChartData={saveSmartChartData}
                            saveSmartChartResponse={saveSmartChartResponse}
                            refreshTableData={this.refreshExportedSmartChartList}
                            viewReports={this.toggleViewReportsModal}
                        />
                    ) : (
                        <SmartChartMain
                            showWildCardFilter={showWildCardFilter}
                            paginationParams={paginationParams}
                            tableData={tableData}
                            handleGlobalSearch={this.handleGlobalSearch}
                            globalSearchKey={this.state.params.search}
                            updateSelectedRow={this.updateSelectedRow}
                            selectedRowId={selectedRowId}
                            isColunmVisibleChanged={this.isColunmVisibleChanged}
                            toggleWildCardFilter={this.toggleWildCardFilter}
                            handlePerPageChange={this.handlePerPageChange}
                            handlePageClick={this.handlePageClick}
                            updateWildCardFilter={this.updateWildCardFilter}
                            wildCardFilter={this.state.params.filters}
                            handleHideColumn={this.handleHideColumn}
                            updateCommonFilter={this.updateCommonFilter}
                            commonFilter={this.state.params.list}
                            resetAllFilters={this.resetAllFilters}
                            resetAll={this.resetAll}
                            updateTableSortFilters={this.updateTableSortFilters}
                            resetSort={this.resetSort}
                            tableParams={this.state.params}
                            // showRestoreModal={this.showRestoreModal}
                            hasExport={checkPermission("forms", permissions.SMART_CHARTS, "export")}
                            showAddButton={checkPermission("forms", permissions.SMART_CHARTS, "create")}
                            hasEdit={checkPermission("forms", permissions.SMART_CHARTS, "edit")}
                            hasDelete={checkPermission("forms", permissions.SMART_CHARTS, "delete")}
                            hasInfoPage={false}
                            entity={"exported_smart_charts"}
                            handleDownloadItem={this.handleDownloadItem}
                            refreshTableData={this.refreshExportedSmartChartList}
                            deleteSmartChartReport={this.deleteSmartChartReport}
                            regenerateSmartChart={this.regenerateSmartChart}
                            showSmartChartDataEditModal={this.toggleSmartChartDataEditModal}
                            showEditPage={this.toggleSmartChartDataEditModal}
                            getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                            masterFilterList={masterFilterList}
                            mFilters={mFilters}
                            updateMfilterForSmartChartList={this.updateMfilterForSmartChartList}
                            handleClickTab={this.handleClickTab}
                            viewSmartChartProperty={this.viewSmartChartProperty}
                            handleEditSmartChartProperty={this.handleEditSmartChartProperty}
                            handleExportSmartReport={this.handleExportSmartReport}
                            updateFiltersForMasterFilter={this.updateFiltersForMasterFilter}
                            isModalView={isModalView}
                            viewReports={this.toggleViewReportsModal}
                            toggleSelectDownloadTypeModal={this.toggleSelectDownloadTypeModal}
                        />
                    )}
                    {this.renderConfirmationModal()}
                    {this.renderSmartChartDataEditModal()}
                    {this.renderSmartChartViewPropertyModal()}
                    {this.renderViewReportsModal()}
                    {this.renderLockPasswordModal()}
                    {this.renderSelectDownloadTypeModal()}
                </>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { smartChartReducer } = state;
    return { smartChartReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Index)
);
