import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Portal from "../common/components/Portal";
import ViewModal from "../common/components/ViewModal";
import actions from "./actions";
import clientActions from "../client/actions";
import ClientMain from "./components/ClientMain";
import Loader from "../common/components/Loader";
import _ from "lodash";
import { clientTableData } from "./components/tableConfig";
import ClientInfo from "./components/ClientInfo";
import { addToBreadCrumpData, checkPermission } from "../../config/utils";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            logCount: 0,
            errorMessage: "",
            projectList: [],
            refreshProjectData: false,
            paginationParams: this.props.assetManagementReducer.entityParams.paginationParams,

            showViewModal: false,
            tableLoading: false,
            showWildCardFilter: false,
            selectedRowId: this.props.assetManagementReducer.entityParams.selectedRowId,
            params: this.props.assetManagementReducer.entityParams.params,
            selectedClient: {},
            tableData: {
                keys: clientTableData.keys,
                config: this.props.assetManagementReducer.entityParams.tableConfig || _.cloneDeep(clientTableData.config)
            },
            infoTabsData: [],
            wildCardFilterParams: this.props.assetManagementReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.assetManagementReducer.entityParams.filterParams,
            alertMessage: "",
            showConfirmModal: false
        };
        this.exportTableXl = this.exportTableXl.bind(this);
    }

    componentDidMount = async () => {
        await this.refreshClientList();
    };

    refreshClientList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let clientList = [];
        let totalCount = 0;
        await this.props.getClients({ ...params, order: this.state.params?.order ? this.state.params.order : { "clients.name": "asc" } });
        const { getClientsResponse } = this.props.clientReducer;
        clientList = getClientsResponse?.clients || [];
        totalCount = getClientsResponse?.count || 0;

        if (!clientList?.length && getClientsResponse.error) {
            await this.setState({ alertMessage: getClientsResponse.error });
            this.showAlerts();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: clientList,
                config: this.props.assetManagementReducer.entityParams.tableConfig || tableData.config
            },
            clientList,
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
        await this.refreshClientList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Client",
            selectedEntity: this.state.selectedClient,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId
        };
        await this.props.updateAssetManagementEntityParams(entityParams);
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
        await this.refreshClientList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshClientList();
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
                config: _.cloneDeep(clientTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshClientList();
    };
    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        await this.props.getListForCommonFilter(params);
        return this.props.clientReducer.getListForCommonFilterResponse?.list || [];
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
        await this.refreshClientList();
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
        await this.refreshClientList();
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

    refreshSettingsData = async () => {
        let tradeSettingsData = await this.props.getTradeSettingsData(this.props.match.params.id);
        let systemSettingsData = await this.props.getSystemSettingsData(this.props.match.params.id);
        let subsystemSettingsData = await this.props.getSubsystemSettingsData(this.props.match.params.id);
        let categorySettingsData = await this.props.getCategorySettingsData(this.props.match.params.id);

        if (tradeSettingsData && tradeSettingsData.success) {
            this.setState({
                tradeTableData: {
                    ...this.state.tradeTableData,
                    data: tradeSettingsData.trades || []
                }
            });
        }
        if (categorySettingsData && categorySettingsData.success) {
            this.setState({
                categoryTableData: {
                    ...this.state.categoryTableData,
                    data: categorySettingsData.categories || []
                }
            });
        }
        if (systemSettingsData && systemSettingsData.success) {
            this.setState({
                systemTableData: {
                    ...this.state.systemTableData,
                    data: systemSettingsData.categories || []
                }
            });
        }
        if (subsystemSettingsData && subsystemSettingsData.success) {
            this.setState({
                subsystemTableData: {
                    ...this.state.subsystemTableData,
                    data: subsystemSettingsData.sub_systems || []
                }
            });
        }
        return true;
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
        await this.refreshClientList();
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
        await this.refreshClientList();
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

    showEditPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedClient: projectId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Project",
            path: `/assetmanagement/edit/${projectId}`
        });
        history.push(`/assetmanagement/edit/${projectId}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedClient: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Project",
            path: `/assetmanagement/add`
        });
        history.push(`/assetmanagement/add`);
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

    showAlerts = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
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
        await this.refreshClientList();
    };

    showInfoPage = clientId => {
        const { history } = this.props;
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        this.setState({
            selectedClient: clientId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Client",
                    path: `/assetmanagement/assetinfo/${clientId}/basicdetails`
                },
                {
                    key: "regions",
                    name: "Regions",
                    path: `/assetmanagement/assetinfo/${clientId}/regions`
                },
                {
                    key: "sites",
                    name: "Sites",
                    path: `/assetmanagement/assetinfo/${clientId}/sites`
                },
                {
                    key: "buildings",
                    name: "Buildings",
                    path: `/assetmanagement/assetinfo/${clientId}/buildings`
                },

                {
                    key: "assets",
                    name: "Assets",
                    path: `/assetmanagement/assetinfo/${clientId}/assets`,
                    state: { isInitialView: true },
                    bcName: "Electricity"
                },
                {
                    key: "assetcharts",
                    name: "Charts & Graphs",
                    path: `/assetmanagement/assetinfo/${clientId}/assetcharts`
                }
            ]
        });
        let tabKeyList = ["basicdetails", "regions", "sites", "buildings", "assets", "assetcharts"];

        let path = `/assetmanagement/assetinfo/${clientId}/${tabKeyList.includes(tab) ? tab : "assetcharts"}`;
        history.push(path);
    };

    getDataById = async regionId => {
        await this.props.getClientById(regionId);
        return this.props.clientReducer.getClientByIdResponse;
    };

    exportTableXl = async () => {
        await this.setState({ tableLoading: true });
        await this.props.exportProject({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        await this.setState({ tableLoading: false });
        if (this.props.projectReducer.projectExportResponse && this.props.projectReducer.projectExportResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.projectExportResponse.error });
            this.showAlerts();
        }
    };

    showAlert = data => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = data;
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
            if (!_.isEqual(config[key]?.isVisible, clientTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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

    render() {
        const { showWildCardFilter, paginationParams, showViewModal, tableData, infoTabsData, selectedRowId, params } = this.state;
        const {
            match: {
                params: { section }
            }
        } = this.props;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "assetinfo" ? (
                    <ClientInfo
                        keys={tableData.keys}
                        projectId={this.props.match.params.id}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        updateSelectedRow={this.updateSelectedRow}
                        updateProjectEntityParams={this.props.updateProjectEntityParams}
                        selectedRowId={selectedRowId}
                        hasEdit={false}
                        hasDelete={false}
                        hasLogView={false}
                        hasLogDelete={false}
                        hasLogRestore={false}
                        hasInfoPage={checkPermission("forms", "clients", "view")}
                        entity="clients"
                    />
                ) : (
                    <ClientMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterProject={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        hasExport={checkPermission("forms", "clients", "export")}
                        showAddButton={false}
                        hasEdit={false}
                        hasDelete={false}
                        hasActionColumn={false}
                        hasInfoPage={checkPermission("forms", "clients", "view")}
                        entity="clients"
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
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { assetManagementReducer, clientReducer } = state;
    return { assetManagementReducer, clientReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions,
        ...clientActions
    })(Index)
);
