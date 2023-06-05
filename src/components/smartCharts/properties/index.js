import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../../common/components/Loader";
import { smartChartPropertiesTableData } from "../../../config/tableData";
import actions from "../actions";
import "../../../assets/css/smart-chart.css";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { checkPermission } from "../../../config/utils";
import { permissions } from "../../../config/permissions";
import PropertiesMain from "./components/PropertyMain";
import LockPasswordModal from "../components/LockPasswordModal";
import ViewPropertyModal from "../components/ViewPropertyModal";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            paginationParams: this.props.smartChartReducer.propertyEntityParams.paginationParams,
            showFormModal: false,
            showWildCardFilter: false,
            selectedRowId: this.props.smartChartReducer.propertyEntityParams.selectedRowId,
            params: this.props.smartChartReducer.propertyEntityParams.params,
            tableData: {
                keys: smartChartPropertiesTableData.keys,
                config: this.props.smartChartReducer.propertyEntityParams.tableConfig || _.cloneDeep(smartChartPropertiesTableData.config)
            },
            alertMessage: "",
            wildCardFilterParams: this.props.smartChartReducer.propertyEntityParams.wildCardFilterParams,
            filterParams: this.props.smartChartReducer.propertyEntityParams.filterParams,
            showConfirmModal: false,
            selectedReportTemplate: "",
            selectedSmartChartData: null,
            isRegenerate: false,
            mFilters: {},
            defaultFilterParams: {},
            showLockTemplateModal: false,
            showViewPropertyModal: false,
            selectedProperty: null,
            isLockLoading: false
        };
    }

    componentDidMount = async () => {
        let currentUser = localStorage.getItem("userId") || "";
        let previousProperty = sessionStorage.getItem("selectedProperty") || null;
        if (previousProperty) {
            this.viewSmartChartProperty(previousProperty);
            sessionStorage.removeItem("selectedProperty");
        }
        await this.props.getSmartChartMasterFilterDropDown("clients", "smart_report_list_filter", { user_id: currentUser });
        let clientList = this.props.smartChartReducer.masterFilterList?.smart_report_list_filter?.clients || [];
        if (clientList.length) {
            let defaultClient = clientList.find(client => client.default == true);
            if (defaultClient) {
                await this.setState({
                    mFilters: {
                        client_ids: this.props.savedParams?.client_ids ? [...this.props.savedParams?.client_ids] : [defaultClient.id]
                    },
                    defaultFilterParams: {
                        client_ids: [defaultClient.id]
                    }
                });
            }
        }
        await this.refreshSmartChartPropertyList();
    };

    refreshSmartChartPropertyList = async () => {
        let currentUser = localStorage.getItem("userId") || "";
        this.setState({ isLoading: true });
        const { params, paginationParams, tableData, mFilters } = this.state;
        let smartChartPropertyList = [];
        let totalCount = 0;
        const { filterKeys, limit, offset, search, order, template_filter } = params;
        // let ordering = [];
        // ordering = Object.entries(order || [])
        //     .map(([key, value]) => (value === "asc" ? key : `-${key}`))
        //     .map(item => item.replace("setting_name", "setting_id__name"))
        //     .join(",");
        let templateParams = {
            ...filterKeys,
            limit,
            offset
            // search,
            // ordering,
            // per_page_count: limit,
            // page_number: offset + 1
        };
        // if (mFilters?.project_ids?.length) {
        //     templateParams.project_id = [...mFilters.project_ids];
        // }
        if (mFilters?.client_ids?.length) {
            templateParams.client_id = mFilters.client_ids[0];
        }
        // if (!mFilters?.project_ids?.length && !mFilters?.client_ids?.length) {
        //     templateParams.user_id = currentUser;
        // }
        await this.props.getSmartChartPropertyList(templateParams);
        const { getSmartChartPropertiesListResponse } = this.props.smartChartReducer;
        smartChartPropertyList = getSmartChartPropertiesListResponse?.data || [];
        totalCount = getSmartChartPropertiesListResponse?.count || 0;

        // go to previous page if no data found in the current page
        if (smartChartPropertyList && !smartChartPropertyList.length && paginationParams.currentPage) {
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
            return await this.refreshSmartChartPropertyList();
        }

        if (
            smartChartPropertyList &&
            !smartChartPropertyList.length &&
            getSmartChartPropertiesListResponse &&
            getSmartChartPropertiesListResponse.error
        ) {
            this.showAlert(getSmartChartPropertiesListResponse.error);
        }

        smartChartPropertyList.map(temp => {
            temp.created_at = moment(temp.created_date).format("MM-DD-YYYY h:mm A");
        });
        this.setState({
            tableData: {
                ...tableData,
                data: smartChartPropertyList
                // config: tableData.config
            },
            smartChartPropertyList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            isLoading: false
        });
        // this.updateEntityParams();
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
        await this.refreshSmartChartPropertyList();
    };

    // updateEntityParams = async () => {
    //     const {
    //         filterParams,
    //         tableData,
    //         historyParams,
    //         historyPaginationParams,
    //         selectedRowId,
    //         wildCardFilterParams,
    //         paginationParams,
    //         params,
    //         selectedDropdown
    //     } = this.state;
    //     let entityParams = {
    //         entity: "ReportProperty",
    //         paginationParams,
    //         params,
    //         wildCardFilterParams,
    //         filterParams,
    //         tableConfig: tableData.config,
    //         selectedRowId,
    //         historyPaginationParams,
    //         historyParams,
    //         selectedDropdown
    //     };
    //     // await this.props.updatePropertyEntityParams(entityParams);
    // };

    resetAllFilters = async () => {
        const { defaultFilterParams } = this.state;
        await this.setState({
            mFilters: {
                ...defaultFilterParams
            }
        });
        // this.updateEntityParams();
        await this.refreshSmartChartPropertyList();
        this.props.updateFiltersForMasterFilter({ ...defaultFilterParams });
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
                config: _.cloneDeep(smartChartPropertiesTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        // this.updateEntityParams();
        await this.refreshSmartChartPropertyList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        // this.updateEntityParams();
        await this.refreshSmartChartPropertyList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, smartChartPropertiesTableData.config[key]?.isVisible)) {
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
        await this.refreshSmartChartPropertyList();
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
        await this.refreshSmartChartPropertyList();
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
        await this.refreshSmartChartPropertyList();
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
        await this.refreshSmartChartPropertyList();
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    updateMfilterForSmartChartList = async params => {
        let updateFilterParams = {};
        if (params.mfilterKey === "client_ids") {
            updateFilterParams = {
                [params.mfilterKey]: params.filterValues
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
                this.refreshSmartChartPropertyList();
            }
        );
        this.props.updateFiltersForMasterFilter({ ...updateFilterParams });
    };

    deleteReportTemplate = template => {
        this.setState({
            showConfirmModal: true,
            selectedReportTemplate: template
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, selectedReportTemplate } = this.state;
        if (!showConfirmModal) return null;
        let alertMsg = "This action cannot be reverted, are you sure that you need to delete this item?";
        if (selectedReportTemplate?.smart_export_count > 0) {
            alertMsg = (
                <>
                    <span className="badge-red-circled">{selectedReportTemplate.smart_export_count}</span>{" "}
                    {`Report${selectedReportTemplate.smart_export_count > 1 ? "s" : ""} ${
                        selectedReportTemplate.smart_export_count > 1 ? "are" : "is"
                    } already connected to this Report Template.`}
                    <p className="sm-charts-template-del-confirm">
                        <b>Deleting a template will delete all the reports connected to this template !</b>
                    </p>{" "}
                    This action cannot be reverted, are you sure that you need to delete this item?`
                </>
            );
        }
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this report template?"}
                        message={alertMsg}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteReportTemplateConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteReportTemplateConfirm = async () => {
        const { selectedReportTemplate } = this.state;
        this.setState({
            isLoading: true,
            showConfirmModal: false
        });
        await this.props.deleteSmartChartReportTemplate({ property_id: selectedReportTemplate.id, is_delete: true });
        if (this.props.smartChartReducer.deleteSmartChartReportTemplateResponse?.error) {
            this.showAlert("Oops..! failed to delete");
        } else {
            this.showAlert("Deleted successfully");
            await this.refreshSmartChartPropertyList();
        }
        this.setState({
            showConfirmModal: false,
            selectedReportTemplate: null,
            isLoading: false
        });
    };

    lockOrUnlockReportTemplate = async template => {
        console.log("template", template);
        let userRole = localStorage.getItem("role");
        if (userRole !== "super_admin") {
            if (!template.password && template.is_locked) {
                this.showAlert("This template is locked by system admin. please contact admin to unlock it.");
            } else {
                this.setState({ showLockTemplateModal: true, selectedReportTemplate: template });
            }
        } else {
            this.setState({
                isLoading: true
            });
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
            await this.refreshSmartChartPropertyList();
        }
    };

    viewSmartChartProperty = async (propertyId, fromExport = false) => {
        this.setState({ showViewPropertyModal: true, selectedProperty: propertyId });
    };

    renderSmartChartViewPropertyModal = () => {
        const { showViewPropertyModal, selectedProperty, isLockLoading } = this.state;
        const { handleEditSmartChartProperty, showSmartChartDataEditModal, viewReports } = this.props;
        if (!showViewPropertyModal) return null;
        let smartChartPropertyByIdData = this.props.smartChartReducer.getSmartChartPropertyByIdResponse;
        return (
            <Portal
                body={
                    <ViewPropertyModal
                        getSmartChartPropertyById={this.props.getSmartChartPropertyById}
                        smartChartPropertyByIdData={smartChartPropertyByIdData}
                        currentPropertyId={selectedProperty}
                        onCancel={() => this.setState({ showViewPropertyModal: false, selectedProperty: null })}
                        handleEditSmartChartProperty={handleEditSmartChartProperty}
                        currentTab={"reporttemplates"}
                        showSmartChartDataEditModal={showSmartChartDataEditModal}
                        viewReports={viewReports}
                        lockOrUnlockReportTemplate={this.lockOrUnlockReportTemplate}
                        isLockLoading={isLockLoading}
                    />
                }
                onCancel={() => this.setState({ showViewPropertyModal: false, selectedProperty: null })}
            />
        );
    };

    render() {
        const {
            getSmartChartMasterFilterDropDown,
            // viewSmartChartProperty,
            handleEditSmartChartProperty,
            handleExportSmartReport,
            showSmartChartDataEditModal
        } = this.props;
        const { showWildCardFilter, paginationParams, tableData, selectedRowId, mFilters } = this.state;
        let masterFilterList = this.props.smartChartReducer.masterFilterList;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                <>
                    <PropertiesMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        tableData={tableData}
                        // handleGlobalSearch={this.handleGlobalSearch}
                        // globalSearchKey={this.state.params.search}
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
                        refreshTableData={this.refreshSmartChartPropertyList}
                        regenerateSmartChart={this.regenerateSmartChart}
                        getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                        masterFilterList={masterFilterList}
                        mFilters={mFilters}
                        updateMfilterForSmartChartList={this.updateMfilterForSmartChartList}
                        hasActionColumn={false}
                        viewSmartChartProperty={this.viewSmartChartProperty}
                        handleEditSmartChartProperty={handleEditSmartChartProperty}
                        handleExportSmartReport={handleExportSmartReport}
                        showSmartChartDataEditModal={showSmartChartDataEditModal}
                        deleteReportTemplate={this.deleteReportTemplate}
                        lockOrUnlockReportTemplate={this.lockOrUnlockReportTemplate}
                    />
                    {this.renderConfirmationModal()}
                    {this.renderLockPasswordModal()}
                    {this.renderSmartChartViewPropertyModal()}
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
