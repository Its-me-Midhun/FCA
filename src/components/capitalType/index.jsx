import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";

import CapitalTypeInfo from "../project/components/settings/settingsInfo";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import capitalTypeActions from "./actions";
import CapitalTypeMain from "./components/FloorMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { capitalTypeTableData } from "../../config/tableData";
import { addToBreadCrumpData, checkPermission, findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose } from "../../config/utils";
import history from "../../config/history";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.assetCapitalTypeListconditionReducer?.entityParams.paginationParams || 0,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        tableLoading: false,
        showMergeOrReplaceModal: false,
        projectData: {},
        selectedRowId: this.props.capitalTypeReducer.entityParams.selectedRowId,
        params: this.props.capitalTypeReducer.entityParams.params,
        selectedProject: this.props.match.params.id || null,
        selectedSetting: this.props.match.params.subId || this.props.capitalTypeReducer.entityParams.selectedEntity,
        tableData: {
            keys: capitalTypeTableData.keys,
            config: this.props.capitalTypeReducer.entityParams.tableConfig || _.cloneDeep(capitalTypeTableData.config)
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.capitalTypeReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.capitalTypeReducer.entityParams.filterParams,
        showFormModal: false,
        historyPaginationParams: this.props.capitalTypeReducer.entityParams.historyPaginationParams,
        historyParams: this.props.capitalTypeReducer.entityParams.historyParams,
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
        await this.refreshCapitalTypeList();
    };

    refreshCapitalTypeList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { id: projectId }
            }
        } = this.props;
        let capitalTypeList = [];
        let totalCount = 0;
        await this.props.getCapitalTypeSettingsData(params, projectId);
        capitalTypeList = this.props.capitalTypeReducer.getCapitalTypeSettingsDataResponse
            ? this.props.capitalTypeReducer.getCapitalTypeSettingsDataResponse.capital_types || []
            : [];
        totalCount = this.props.capitalTypeReducer.getCapitalTypeSettingsDataResponse
            ? this.props.capitalTypeReducer.getCapitalTypeSettingsDataResponse.count || 0
            : 0;
        totalCount = this.props.capitalTypeReducer.getCapitalTypeSettingsDataResponse
            ? this.props.capitalTypeReducer.getCapitalTypeSettingsDataResponse.count || 0
            : 0;

        // if (
        //     capitalTypeList &&
        //     !capitalTypeList.length &&
        //     this.props.capitalTypeReducer.getCapitalTypeSettingsDataResponse &&
        //     this.props.capitalTypeReducer.getCapitalTypeSettingsDataResponse.error
        // ) {
        //     await this.setState({ alertMessage: this.props.capitalTypeReducer.getCapitalTypeSettingsDataResponse.error });
        //     this.showAlert();
        // }
        // let project_permission = {};
        // project_permission =
        //     this.props.commonReducer.getMenuItemsResponse &&
        //     this.props.commonReducer.getMenuItemsResponse.user_permissions &&
        //     this.props.commonReducer.getMenuItemsResponse.user_permissions.asset_conditions
        //         ? this.props.commonReducer.getMenuItemsResponse.user_permissions.asset_conditions || {}
        //         : {};
        // let region_logs = {};
        // region_logs =
        //     this.props.commonReducer.getMenuItemsResponse &&
        //     this.props.commonReducer.getMenuItemsResponse.user_permissions &&
        //     this.props.commonReducer.getMenuItemsResponse.user_permissions.asset_condition_logs
        //         ? this.props.commonReducer.getMenuItemsResponse.user_permissions.asset_condition_logs || {}
        //         : {};
        this.setState({
            tableData: {
                ...tableData,
                data: capitalTypeList,
                config: this.props.capitalTypeReducer.entityParams.tableConfig || tableData.config
            },
            capitalTypeList,
            showWildCardFilter: this.state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            // permissions: project_permission,
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
        await this.refreshCapitalTypeList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "capitaltype",
            selectedEntity: this.state.selectedSetting,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateAssetConditionEntityParams(entityParams);
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
        await this.refreshCapitalTypeList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshCapitalTypeList();
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
                config: _.cloneDeep(capitalTypeTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });

        this.updateEntityParams();
        await this.refreshCapitalTypeList();
    };

    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, capitalTypeTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.refreshCapitalTypeList();
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
        await this.refreshCapitalTypeList();
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
        await this.refreshCapitalTypeList();
    };

    // updateCurrentActions = async key => {
    //     const { currentActions } = this.state;
    //     await this.setState({
    //         currentActions: currentActions === key ? null : key
    //     });
    //     return true;
    // };

    // updateCurrentViewAllUsers = async key => {
    //     const { currentViewAllUsers } = this.state;
    //     await this.setState({
    //         currentViewAllUsers: currentViewAllUsers === key ? null : key
    //     });
    //     return true;
    // };

    showEditPage = floorId => {
        this.setState({
            selectedSetting: floorId
        });
        this.toggleShowFormModal();
    };

    showAddForm = () => {
        this.setState({
            selectedSetting: null
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
                        selectedItem={this.state.selectedSetting}
                        addNewData={this.handleAddTrade}
                        handleUpdateCapitalType={this.handleUpdateCapitalType}
                        selectedTrade={this.state.selectedSetting}
                        getCapitalTypeByOne={this.getDataById}
                        addNewCategoryData={this.addNewCategory}
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

    // handleAddTrade = async trade => {
    //     const projectId = this.props.match.params.id;
    //     await this.props.addAssetCondition(projectId, trade);
    //     if (this.props.capitalTypeReducer.addAssetConditionResponse && this.props.capitalTypeReducer.addAssetConditionResponse.error) {
    //         this.toggleShowFormModal();
    //         await this.setState({
    //             alertMessage: this.props.capitalTypeReducer.addAssetConditionResponse.error,
    //             selectedSetting: null
    //         });
    //         this.showAlert();
    //     } else {
    //         await this.setState({
    //             alertMessage:
    //                 this.props.capitalTypeReducer.addAssetConditionResponse && this.props.capitalTypeReducer.addAssetConditionResponse.message,
    //             selectedSetting: null
    //         });
    //         this.toggleShowFormModal();
    //         this.showAlert();
    //         await this.refreshCapitalTypeList();
    //         // await this.props.getMenuItems();
    //     }
    // };

    handleUpdateCapitalType = async (trade, selectedone = "") => {
        const { selectedProject, selectedSetting } = this.state;
        await this.props.updateCapitalType(selectedProject, selectedone || selectedSetting, trade);
        if (this.props.capitalTypeReducer.updateCapitalTypeResponse && this.props.capitalTypeReducer.updateCapitalTypeResponse.error) {
            await this.setState({
                alertMessage: this.props.capitalTypeReducer.updateCapitalTypeResponse.error
                // selectedSetting: null
            });
            if (!selectedone) {
                this.toggleShowFormModal();
            }
            this.showAlert();
        } else {
            await this.refreshCapitalTypeList();
            await this.setState({
                alertMessage:
                    this.props.capitalTypeReducer.updateCapitalTypeResponse && this.props.capitalTypeReducer.updateCapitalTypeResponse.message
                // selectedSetting: null
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
        await this.refreshCapitalTypeList();
    };

    showInfoPage = (id, projectId, rowData) => {
        const { history } = this.props;
        const {
            match: { url }
        } = this.props;
        this.setState({
            selectedSetting: id
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

    getDataById = async tradeId => {
        const { selectedProject, selectedSetting } = this.state;
        await this.props.getCapitalTypeById(selectedProject, selectedSetting);
        return this.props.capitalTypeReducer.getCapitalTypeByIdResponse;
    };
    HandleExit = async () => {
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData());
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        await this.setState({ tableLoading: true });
        await this.props.exportAssetConditionSettings(entityId, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        await this.setState({ tableLoading: false });
        if (this.props.capitalTypeReducer.assetconditionExportResponse && this.props.capitalTypeReducer.assetconditionExportResponse.error) {
            await this.setState({ alertMessage: this.props.capitalTypeReducer.assetconditionExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const projectId = this.props.match.params.id;
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllAssetConditionLogs(buildingId, historyParams, projectId);
        const {
            capitalTypeReducer: {
                getAllAssetConditionLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.capitalTypeReducer.getAllAssetConditionLogsResponse && this.props.capitalTypeReducer.getAllAssetConditionLogsResponse.error) {
            await this.setState({ alertMessage: this.props.capitalTypeReducer.getAllAssetConditionLogsResponse.error });
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
        // return this.props.regionReducer.getAllLogsResponse;
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

    // handleDeleteLog = async (id, item, choice = "delete") => {
    //     await this.setState({
    //         showConfirmModalLog: true,
    //         selectedLog: id,
    //         isRestoreOrDelete: choice,
    //         selectedMainItem: item
    //     });
    // };

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

    // deleteLogOnConfirm = async () => {
    //     const { selectedLog, selectedMainItem } = this.state;
    //     await this.props.deleteSettingsLog(selectedLog);
    //     if (this.props.capitalTypeReducer.deleteSettingsLogResponse && this.props.capitalTypeReducer.deleteSettingsLogResponse.error) {
    //         await this.setState({ alertMessage: this.props.capitalTypeReducer.deleteSettingsLogResponse.error });
    //         this.showAlert();
    //     }
    //     await this.getLogData(selectedMainItem);
    //     // await this.props.getMenuItems();
    //     this.setState({
    //         showConfirmModalLog: false,
    //         selectedLog: null
    //     });
    // };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreSettingsLog(id);
        if (this.props.capitalTypeReducer.restoreSettingsLogResponse && this.props.capitalTypeReducer.restoreSettingsLogResponse.error) {
            await this.setState({ alertMessage: this.props.capitalTypeReducer.restoreSettingsLogResponse.error });
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
            logPermission
        } = this.state;
        const {
            match: {
                params: { subSection }
            }
        } = this.props;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {subSection === "info" ? (
                    <CapitalTypeInfo
                        selectedOne={selectedRowId}
                        getDataById={this.getDataById}
                        activetab="capitalType"
                        showEditPage={this.showEditPage}
                        updateData={this.handleUpdateCapitalType}
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
                        exportTableXl={this.exportTableXl}
                        hasEdit={true}
                        hasDelete={false}
                        hasLogView={false}
                        hasLogDelete={false}
                        hasLogRestore={false}
                        hasInfoPage={true}
                        entity="capital_types"
                    />
                ) : (
                    <CapitalTypeMain
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
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        resetAll={this.resetAll}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        resetAllFilters={this.resetAllFilters}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasExport={true}
                        showAddButton={true}
                        hasEdit={true}
                        hasDelete={false}
                        hasInfoPage={true}
                        entity="capital_types"
                    />
                )}
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
    const { commonReducer, capitalTypeReducer } = state;
    return { commonReducer, capitalTypeReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...capitalTypeActions,
        ...CommonActions
    })(index)
);
