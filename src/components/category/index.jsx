import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import CategoryInfo from "../project/components/settings/settingsInfo";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import categoryActions from "./actions";
import CategoryMain from "./components/CategoryMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { categorysettingsTableData } from "../../config/tableData";
import { addToBreadCrumpData, checkPermission, findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose } from "../../config/utils";
import history from "../../config/history";

class Index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.categoryReducer.entityParams.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        tableLoading: false,
        selectedRowId: this.props.categoryReducer.entityParams.selectedRowId,
        params: this.props.categoryReducer.entityParams.params,
        selectedProject: this.props.match.params.id || null,
        selectedCategory: this.props.match.params.subId || this.props.categoryReducer.entityParams.selectedEntity,
        tableData: {
            keys: categorysettingsTableData.keys,
            config: this.props.categoryReducer.entityParams.tableConfig || _.cloneDeep(categorysettingsTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.categoryReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.categoryReducer.entityParams.filterParams,
        showFormModal: false,
        historyPaginationParams: this.props.categoryReducer.entityParams.historyPaginationParams,
        historyParams: this.props.categoryReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        selectedMainItem: "",
        permissions: {},
        logPermission: {}
    };

    componentDidMount = async () => {
        await this.refreshcategoryList();
    };

    refreshcategoryList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id: projectId }
            }
        } = this.props;
        let categoryList = [];
        let totalCount = 0;
        await this.props.getCategorySettingsData(params, projectId);
        categoryList = this.props.categoryReducer.getCategorySettingsDataResponse
            ? this.props.categoryReducer.getCategorySettingsDataResponse.categories || []
            : [];
        totalCount = this.props.categoryReducer.getCategorySettingsDataResponse
            ? this.props.categoryReducer.getCategorySettingsDataResponse.count || 0
            : 0;

        if (categoryList && !categoryList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getCategorySettingsData(projectId, this.state.params);
            categoryList = this.props.categoryReducer.getCategorySettingsDataResponse
                ? this.props.categoryReducer.getCategorySettingsDataResponse.categories || []
                : [];
            totalCount = this.props.categoryReducer.getCategorySettingsDataResponse
                ? this.props.categoryReducer.getCategorySettingsDataResponse.count || 0
                : 0;
        }
        if (
            categoryList &&
            !categoryList.length &&
            this.props.categoryReducer.getCategorySettingsDataResponse &&
            this.props.categoryReducer.getCategorySettingsDataResponse.error
        ) {
            await this.setState({ alertMessage: this.props.categoryReducer.getCategorySettingsDataResponse.error });
            this.showAlert();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: categoryList,
                config: this.props.categoryReducer.entityParams.tableConfig || tableData.config
            },
            categoryList,
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
        await this.refreshcategoryList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Category",
            selectedEntity: this.state.selectedCategory,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateCategoryEntityParams(entityParams);
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
        await this.refreshcategoryList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshcategoryList();
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
                config: _.cloneDeep(categorysettingsTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshcategoryList();
    };
    getListForCommonFilter = async params => {
        await this.props.getListForCommonFilter(params, this.props.match.params.id);
        return (this.props.categoryReducer.getListForCommonFilterResponse && this.props.categoryReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshcategoryList();
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
        await this.refreshcategoryList();
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
        await this.refreshcategoryList();
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
        await this.refreshcategoryList();
    };

    showEditPage = categoryId => {
        this.setState({
            selectedCategory: categoryId
        });
        this.toggleShowFormModal();
    };

    showAddForm = () => {
        this.setState({
            selectedCategory: null
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
                        selectedItem={this.state.selectedCategory}
                        handleAddCategory={this.handleAddCategory}
                        handleUpdateCategory={this.handleUpdateCategory}
                        getCategoryByOne={this.getDataById}
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

    handleAddCategory = async category => {
        const projectId = this.props.match.params.id;
        await this.props.addCategory(projectId, category);
        if (this.props.categoryReducer.addCategoryResponse && this.props.categoryReducer.addCategoryResponse.error) {
            this.toggleShowFormModal();
            await this.setState({
                alertMessage: this.props.categoryReducer.addCategoryResponse.error,
                selectedCategory: null
            });
            this.showAlert();
        } else {
            await this.setState({
                alertMessage: this.props.categoryReducer.addCategoryResponse && this.props.categoryReducer.addCategoryResponse.message,
                selectedCategory: null
            });
            this.toggleShowFormModal();
            this.showAlert();
            await this.refreshcategoryList();
        }
    };

    handleUpdateCategory = async (category, selectedone) => {
        const { selectedProject, selectedCategory } = this.state;
        await this.props.updateCategory(selectedProject, selectedone || selectedCategory, category);
        if (this.props.categoryReducer.updateCategoryResponse && this.props.categoryReducer.updateCategoryResponse.error) {
            await this.setState({
                alertMessage: this.props.categoryReducer.updateCategoryResponse.error,
                selectedCategory: null
            });
            if (!selectedone) {
                this.toggleShowFormModal();
            }
            this.showAlert();
        } else {
            await this.refreshcategoryList();
            await this.setState({
                alertMessage: this.props.categoryReducer.updateCategoryResponse && this.props.categoryReducer.updateCategoryResponse.message
                // selectedCategory: null
            });
            if (!selectedone) {
                this.toggleShowFormModal();
            }
            this.showAlert();
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

    handleDeleteCategory = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedCategory: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Category?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteCategoryOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteCategoryOnConfirm = async () => {
        const { selectedProject, selectedCategory } = this.state;
        await this.props.deleteCategory(selectedProject, selectedCategory);
        if (this.props.categoryReducer.deleteCategoryResponse && this.props.categoryReducer.deleteCategoryResponse.error) {
            await this.setState({ alertMessage: this.props.categoryReducer.deleteCategoryResponse.error });
            this.setState({
                showConfirmModal: false
            });
            this.showAlert();
        } else {
            await this.refreshcategoryList();
            this.setState({
                showConfirmModal: false
            });
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
        await this.refreshcategoryList();
    };

    showInfoPage = (id, projectId, rowData) => {
        const { history } = this.props;
        const {
            match: { url }
        } = this.props;
        this.setState({
            selectedCategory: id
        });
        addToBreadCrumpData({
            key: "Name",
            name: rowData?.name,
            path: `${url}/info/${id}/basicdetails`,
            isInnerTab: true
        });
        addToBreadCrumpData({
            key: "info",
            name: "Basic Details",
            path: `${url}/info/${id}/basicdetails`,
            isInnerTab: true
        });
        history.push(`${url}/info/${id}/basicdetails`);
    };

    getDataById = async () => {
        const { selectedProject, selectedCategory } = this.state;
        console.log("selectedCategory", selectedCategory);
        await this.props.getCategoryById(selectedProject, selectedCategory);
        return this.props.categoryReducer.getCategoryByIdResponse;
    };
    HandleExit = async () => {
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData());
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        await this.setState({ tableLoading: true });
        await this.props.exportCategorySettings(entityId, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        await this.setState({ tableLoading: false });
        if (this.props.categoryReducer.categoryExportResponse && this.props.categoryReducer.categoryExportResponse.error) {
            await this.setState({ alertMessage: this.props.categoryReducer.categoryExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const projectId = this.props.match.params.id;
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllCategoryLogs(buildingId, historyParams, projectId);
        const {
            categoryReducer: {
                getAllCategoryLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.categoryReducer.getAllCategoryLogsResponse && this.props.categoryReducer.getAllCategoryLogsResponse.error) {
            await this.setState({ alertMessage: this.props.categoryReducer.getAllCategoryLogsResponse.error });
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

    handlePerPageChangeHistory = async (e, item) => {
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
        await this.getLogData(item);
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, categorysettingsTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    handlePageClickHistory = async (page, item) => {
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
        await this.getLogData(item);
    };

    handleGlobalSearchHistory = async (search, item) => {
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
        await this.getLogData(item);
    };

    handleDeleteLog = async (id, item, choice = "delete") => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            isRestoreOrDelete: choice,
            selectedMainItem: item
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
        const { selectedLog, selectedMainItem } = this.state;
        await this.props.deleteSettingsLog(selectedLog);
        if (this.props.categoryReducer.deleteSettingsLogResponse && this.props.categoryReducer.deleteSettingsLogResponse.error) {
            await this.setState({ alertMessage: this.props.categoryReducer.deleteSettingsLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(selectedMainItem);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreSettingsLog(id);
        if (this.props.categoryReducer.restoreSettingsLogResponse && this.props.categoryReducer.restoreSettingsLogResponse.error) {
            await this.setState({ alertMessage: this.props.categoryReducer.restoreSettingsLogResponse.error });
            this.showAlert();
        }
    };

    updateLogSortFilters = async (searchKey, item) => {
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
        await this.getLogData(item);
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission,
            infoTabsData
        } = this.state;
        const {
            match: {
                params: { subSection }
            }
        } = this.props;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {subSection === "info" ? (
                    <CategoryInfo
                        selectedOne={selectedRowId}
                        getDataById={this.getDataById}
                        activetab="category"
                        showEditPage={this.showEditPage}
                        updateData={this.handleUpdateCategory}
                        handleDeleteTrade={this.handleDeleteCategory}
                        handleCloseItem={this.HandleExit}
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
                        permissions={permissions}
                        logPermission={logPermission}
                        infoTabsData={infoTabsData}
                        hasEdit={checkPermission("forms", "categories", "edit")}
                        hasDelete={checkPermission("forms", "categories", "delete")}
                        hasLogView={checkPermission("logs", "categories", "view")}
                        hasLogDelete={checkPermission("logs", "categories", "delete")}
                        hasLogRestore={checkPermission("logs", "categories", "restore")}
                        hasInfoPage={checkPermission("forms", "categories", "view")}
                        entity="categories"
                    />
                ) : (
                    <CategoryMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        resetAll={this.resetAll}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        handleDeleteFloor={this.handleDeleteCategory}
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
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasExport={checkPermission("forms", "categories", "export")}
                        showAddButton={checkPermission("forms", "categories", "create")}
                        hasEdit={checkPermission("forms", "categories", "edit")}
                        hasDelete={checkPermission("forms", "categories", "delete")}
                        hasInfoPage={checkPermission("forms", "categories", "view")}
                        entity="categories"
                    />
                )}
                {this.renderConfirmationModal()}
                {this.renderFormModal()}
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
    const { categoryReducer } = state;
    return { categoryReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...categoryActions,
        ...CommonActions
    })(Index)
);
