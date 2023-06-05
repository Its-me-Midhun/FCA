import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import ViewModal from "../common/components/ViewModal";
import actions from "./actions";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { reportTemplateTableData } from "../../config/tableData";
import { checkPermission } from "../../config/utils";
import TemplatesMain from "./components/TemplatesMain";
import TemplateInfo from "./components/TemplateInfo";
import moment from "moment";

class Index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.reportTemplateReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        tableLoading: false,
        showMergeOrReplaceModal: false,
        projectData: {},
        selectedRowId: this.props.reportTemplateReducer.entityParams.selectedRowId,
        params: this.props.reportTemplateReducer.entityParams.params,
        selectedProject: this.props.match.params.id || null,
        selectedTemplate: {},
        tableData: {
            keys: reportTemplateTableData.keys,
            config: _.cloneDeep(reportTemplateTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        showFormModal: false,
        historyPaginationParams: this.props.reportTemplateReducer.entityParams.historyPaginationParams,
        historyParams: this.props.reportTemplateReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        selectedMainItem: "",
        permissions: {},
        logPermission: {},
        showTemplateInfo: false,
        selectedTemplateId: ""
    };

    componentDidMount = async () => {
        await this.refreshTemplateList();
    };

    refreshTemplateList = async () => {
        this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id }
            },
            isLocalSettings
        } = this.props;
        let templateList = [];
        let totalCount = 0;
        let project_id = null;
        if (isLocalSettings) {
            project_id = id;
        }
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
            search,
            ordering,
            template_filter
        };
        await this.props.getTemplates(templateParams, project_id);
        await this.props.addUserActivityLog({ text: "Visited report templates." });
        const { getTemplatesResponse, entityParams } = this.props.reportTemplateReducer;
        templateList = getTemplatesResponse?.results || [];
        totalCount = getTemplatesResponse?.count || 0;

        // go to previous page if no data found in the current page
        if (templateList && !templateList.length && paginationParams.currentPage) {
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
            return await this.refreshTemplateList();
        }

        if (templateList && !templateList.length && getTemplatesResponse && getTemplatesResponse.error) {
            this.setState({ alertMessage: getTemplatesResponse.error }, () => this.showAlert());
        }

        templateList.map(temp => {
            temp.uploaded_at = moment(temp.uploaded_at).format("MM-DD-YYYY h:mm A");
            temp.updated_at = moment(temp.updated_at).format("MM-DD-YYYY h:mm A");
        });
        this.setState({
            tableData: {
                ...tableData,
                data: templateList
                // config: tableData.config
            },
            templateList,
            showWildCardFilter: this.state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            isLoading: false
        });
        this.updateEntityParams();
        return true;
    };

    updateWildCardFilter = async (wildCardFilter, filterKeys) => {
        console.log(wildCardFilter, filterKeys);
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
        await this.refreshTemplateList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateTemplateEntityParams(entityParams);
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
                filterKeys: {}
            },
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshTemplateList();
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
                config: _.cloneDeep(reportTemplateTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshTemplateList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshTemplateList();
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
        await this.refreshTemplateList();
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
        await this.refreshTemplateList();
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
        await this.refreshTemplateList();
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
                offset: page.selected * paginationParams.perPage
                // offset: page.selected + 1
            }
        });
        await this.refreshTemplateList();
    };

    showEditPage = params => {
        this.setState({
            selectedTemplate: params
        });
        this.toggleShowFormModal();
    };

    showAddForm = () => {
        this.setState({
            selectedTemplate: {}
        });
        this.toggleShowFormModal();
    };

    toggleShowFormModal = () => {
        this.setState({
            showFormModal: !this.state.showFormModal
        });
    };

    renderFormModal = () => {
        const { showFormModal } = this.state;
        if (!showFormModal) return null;

        return (
            <Portal
                body={
                    <Form
                        onCancel={this.toggleShowFormModal}
                        addTemplate={this.handleAddTemplate}
                        updateTemplate={this.updateTemplate}
                        selectedTemplate={this.state.selectedTemplate}
                        getPropertyDropdown={this.getReportPropertyDropdown}
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
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

    handleAddTemplate = async template => {
        this.toggleShowFormModal();
        this.setState({ isLoading: true });
        const {
            isLocalSettings,
            match: {
                params: { id }
            }
        } = this.props;
        if (isLocalSettings) {
            template.project_id = id;
        }
        await this.props.addTemplate(template);
        await this.props.addUserActivityLog({ text: "Added report template." });
        const {
            addTemplateResponse: { success, error, message }
        } = this.props.reportTemplateReducer;
        if (!success) {
            this.setState(
                {
                    alertMessage: error || "Something went wrong !"
                    // selectedTrade: null
                },
                () => this.showAlert()
            );
        } else {
            this.setState(
                {
                    alertMessage: message || "Template uploaded successfully"
                    // selectedTrade: null
                },
                async () => {
                    // this.toggleShowFormModal();
                    this.showAlert();
                    await this.refreshTemplateList();
                }
            );
            // await this.props.getMenuItems();
        }
        this.setState({ isLoading: false });
    };

    updateTemplate = async params => {
        this.setState({ isLoading: true, showFormModal: false });
        const {
            isLocalSettings,
            match: {
                params: { id }
            }
        } = this.props;
        if (isLocalSettings) {
            params.project_id = id;
        }
        if (params.active === false) {
            this.setState(
                {
                    alertMessage: "Oops..! One template must be active",
                    isLoading: false
                },
                () => this.showAlert()
            );
            return false;
        }
        await this.props.updateTemplate(params);
        await this.props.addUserActivityLog({ text: "Updated report template." });
        const { updateTemplateResponse } = this.props.reportTemplateReducer;
        if (updateTemplateResponse.success) {
            await this.refreshTemplateList();
            this.setState(
                {
                    alertMessage: updateTemplateResponse.message || "Template updated successfully"
                },
                () => this.showAlert()
            );
        } else {
            this.setState(
                {
                    alertMessage: updateTemplateResponse.error || "Something went wrong !"
                },
                () => this.showAlert()
            );
        }
        this.setState({ isLoading: false });
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

    handleDeleteTemplate = async id => {
        this.setState({
            showConfirmModal: true,
            selectedTemplateId: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Template ?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteTemplateOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteTemplateOnConfirm = async () => {
        const { selectedTemplateId } = this.state;
        this.setState({
            isLoading: true,
            showConfirmModal: false
        });
        await this.props.deleteTemplate(selectedTemplateId);
        await this.props.addUserActivityLog({ text: "Deleted report template." });
        const { success, message, error } = this.props.reportTemplateReducer.deleteTemplateResponse;
        if (!success) {
            await this.setState({
                alertMessage: error || "Something went wrong"
            });
            this.showAlert();
        } else {
            await this.refreshTemplateList();
            await this.setState({
                alertMessage: message || "Template deleted successfully"
            });
            this.showAlert();
        }
        this.setState({
            isLoading: false
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
        await this.refreshTemplateList();
    };

    showInfoPage = id => {
        this.setState({
            showTemplateInfo: true,
            selectedTemplate: id
        });
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, reportTemplateTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    getDataById = async () => {
        const { selectedTemplate } = this.state;
        await this.props.getTemplateById(selectedTemplate);
        return this.props.reportTemplateReducer.getTemplateByIdResponse;
    };

    exportTableXl = async () => {
        this.setState({ tableLoading: true });
        const { filterKeys, search, order, template_filter } = this.state.params;
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .map(item => item.replace("setting_name", "setting_id__name"))
            .join(",");
        let templateParams = {
            ...filterKeys,
            search,
            ordering,
            username: localStorage.getItem("user"),
            template_filter
        };
        if (this.props.isLocalSettings) {
            templateParams.project_id = this.props.match.params.id;
        }
        await this.props.exportReportTemplate(templateParams);
        await this.props.addUserActivityLog({ text: "Exported report template." });
        this.setState({ tableLoading: false });
        if (this.props.reportTemplateReducer.templateExportResponse && this.props.reportTemplateReducer.templateExportResponse.error) {
            this.setState({ alertMessage: this.props.reportTemplateReducer.templateExportResponse.error }, () => this.showAlert());
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

    getReportPropertyDropdown = async () => {
        if (this.props.isLocalSettings) {
            let project_id = this.props.match.params.id || null;
            await this.props.getPropertyDropdown({ project_id });
        } else {
            await this.props.getPropertyDropdown();
        }
        return this.props.reportTemplateReducer.propertyDropdownResponse?.report_properties || [];
    };

    showRestoreModal = async id => {
        this.setState({
            showRestoreConfirmModal: true,
            selectedTemplateId: id
        });
    };

    renderRestoreConfirmationModal = () => {
        const { showRestoreConfirmModal } = this.state;
        if (!showRestoreConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this Template ?"}
                        message={"This action cannot be reverted, are you sure that you need to restore this item?"}
                        onNo={() => this.setState({ showRestoreConfirmModal: false })}
                        onYes={this.restoreTemplateOnConfirm}
                        type={"restore"}
                        isRestore={true}
                    />
                }
                onCancel={() => this.setState({ showRestoreConfirmModal: false })}
            />
        );
    };

    restoreTemplateOnConfirm = async () => {
        const { selectedTemplateId } = this.state;
        this.setState({
            isLoading: true,
            showRestoreConfirmModal: false
        });
        await this.props.restoreTemplate(selectedTemplateId);
        await this.props.addUserActivityLog({ text: "Restored report template." });
        const { success, message, error } = this.props.reportTemplateReducer.restoreTemplateResponse;
        if (!success) {
            await this.setState({
                alertMessage: error || "Something went wrong"
            });
            this.showAlert();
        } else {
            await this.refreshTemplateList();
            await this.setState({
                alertMessage: message || "Template restored successfully"
            });
            this.showAlert();
        }
        this.setState({
            isLoading: false
        });
    };

    selectFilterHandler = async e => {
        await this.setState({
            params: {
                ...this.state.params,
                template_filter: e.target.value
            }
        });
        await this.refreshTemplateList();
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            selectedTemplate,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission
        } = this.state;
        const {
            match: {
                params: { section }
            },
            isLocalSettings = false
        } = this.props;
        const { showTemplateInfo } = this.state;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {showTemplateInfo ? (
                    <TemplateInfo
                        selectedOne={selectedRowId}
                        getDataById={this.getDataById}
                        activetab="trade"
                        showEditPage={this.showEditPage}
                        updateData={this.handleUpdateFloor}
                        handleDeleteTrade={this.handleDeleteFloor}
                        handleCloseItem={this.HandleExit}
                        permissions={permissions}
                        hasEdit={checkPermission("forms", "trades", "edit")}
                        hasDelete={checkPermission("forms", "trades", "delete")}
                        hasLogView={checkPermission("logs", "trades", "view")}
                        hasLogDelete={checkPermission("logs", "trades", "delete")}
                        hasLogRestore={checkPermission("logs", "trades", "restore")}
                        hasInfoPage={checkPermission("forms", "trades", "view")}
                        entity={isLocalSettings ? "project_report_templates" : "global_report_templates"}
                    />
                ) : (
                    <TemplatesMain
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
                        handleDelete={this.handleDeleteTemplate}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handleDownloadItem={this.handleDownloadItem}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params}
                        handleHideColumn={this.handleHideColumn}
                        updateCommonFilter={this.updateCommonFilter}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        logPermission={logPermission}
                        showRestoreModal={this.showRestoreModal}
                        selectFilterHandler={this.selectFilterHandler}
                        selectedDropdown={this.state.params.template_filter}
                        hasExport={
                            isLocalSettings
                                ? checkPermission("forms", "project_report_templates", "export")
                                : checkPermission("forms", "global_report_templates", "export")
                        }
                        showAddButton={
                            isLocalSettings
                                ? checkPermission("forms", "project_report_templates", "create")
                                : checkPermission("forms", "global_report_templates", "create")
                        }
                        hasEdit={
                            isLocalSettings
                                ? checkPermission("forms", "project_report_templates", "edit")
                                : checkPermission("forms", "global_report_templates", "edit")
                        }
                        hasDelete={
                            isLocalSettings
                                ? checkPermission("forms", "project_report_templates", "delete")
                                : checkPermission("forms", "global_report_templates", "delete")
                        }
                        hasInfoPage={false}
                        handleToggleSlider={this.updateTemplate}
                        isLocalSettings={isLocalSettings}
                        entity={isLocalSettings ? "project_report_templates" : "global_report_templates"}
                    />
                )}
                {this.renderFormModal()}
                {this.renderConfirmationModal()}
                {this.renderRestoreConfirmationModal()}
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
    const { reportTemplateReducer } = state;
    return { reportTemplateReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Index)
);
