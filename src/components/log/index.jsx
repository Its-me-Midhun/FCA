import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import Loader from "../common/components/Loader";
import Portal from "../common/components/Portal";
import ViewModal from "../common/components/ViewModal";
import logActions from "./actions";
import LogMain from "./components/LogMain";
import { logTableData } from "./components/tableData";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        logList: [],
        paginationParams: this.props.logReducer.entityParams.paginationParams,
        efciLoading: false,
        showLogModal: false,
        efciLogData: [],
        showViewModal: false,
        tableLoading: false,
        colorCodes: [],
        showWildCardFilter: false,
        selectedRowId: this.props.logReducer.entityParams.selectedRowId,
        params: this.props.logReducer.entityParams.params,
        tableData: {
            keys: logTableData.keys,
            config: this.props.logReducer.entityParams.tableConfig || _.cloneDeep(logTableData.config)
        },
        filterParams: this.props.logReducer.entityParams.filterParams,
        alertMessage: "",
        logPaginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        logParams: {
            limit: 40,
            offset: 0
        },
        loghistoryPaginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        logCount: 0
    };

    handlePerPageChangeLogs = async e => {
        const { logPaginationParams, typeLog, selectedColumnId, noOfYears } = this.state;
        await this.setState({
            logPaginationParams: {
                ...logPaginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            logParams: {
                ...this.state.logParams,
                offset: 0,
                limit: e.target.value
            }
        });
        await this.showLog(selectedColumnId, typeLog, noOfYears);
    };

    handlePageClickLogs = async page => {
        const { logPaginationParams, logParams, typeLog, selectedColumnId, noOfYears } = this.state;
        await this.setState({
            logPaginationParams: {
                ...logPaginationParams,
                currentPage: page.selected
            },
            logParams: {
                ...logParams,
                // offset: page.selected * paginationParams.perPage
                offset: page.selected + 1
            }
        });
        await this.showLog(selectedColumnId, typeLog, noOfYears);
    };

    componentDidMount = async () => {
        await this.refreshLogList();
    };

    refreshLogList = async () => {
        await this.setState({ isLoading: true });
        let isDashboardFiltered = false;
        const { paginationParams, tableData } = this.state;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        await this.setState({
            params: {
                ...this.state.params,
                project_id: null,
                log_ids: (isDashboardFiltered ? this.state.log_ids : null) || null,
                building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null,
                start_year: (isDashboardFiltered ? this.state.start_year : null) || null,
                end_year: (isDashboardFiltered ? this.state.end_year : null) || null
            }
        });
        if (query.pid && query.pid.trim().length) {
            await this.setInFoPage(this.props.match.params.id);
            await this.setState({
                params: {
                    ...this.state.params,
                    project_id: query.pid || null
                }
            });
        }
        if (this.props.projectId) {
            await this.setState({
                params: {
                    ...this.state.params,
                    project_id: this.props.projectId
                }
            });
        }
        const { params } = this.state;

        let tempParams = {
            code: (params.filters && params.filters["logs.code"]?.key) || null,
            client: (params.filters && params.filters["logs.client"]?.key) || null,
            consultancy: (params.filters && params.filters["logs.consultancy"]?.key) || null,
            name: (params.filters && params.filters["logs.name"]?.key) || null,
            email: (params.filters && params.filters["logs.email"]?.key) || null,
            text: (params.filters && params.filters["logs.text"]?.key) || null,
            start_date: (params.filters && params.filters["logs.created_at"]?.key?.from) || null,
            end_date: (params.filters && params.filters["logs.created_at"]?.key?.to) || null,
            search: params.search,
            limit: params.limit,
            offset: params.offset
        };

        await this.props.getAllLogs(tempParams);

        if (
            this.props.logReducer.getAllLogsResponse.logs &&
            !this.props.logReducer.getAllLogsResponse.logs.length &&
            this.props.logReducer.getAllLogsResponse &&
            this.props.logReducer.getAllLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.logReducer.getAllLogsResponse.error });
            this.showAlerts();
        }

        const {
            logReducer: {
                getAllLogsResponse: { activity_logs, count }
            }
        } = this.props;

        this.setState({
            tableData: {
                ...tableData,
                data: activity_logs,
                config: this.props.logReducer.entityParams.tableConfig || tableData.config
            },
            paginationParams: {
                ...paginationParams,
                totalCount: count,
                totalPages: Math.ceil(count / paginationParams.perPage)
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
        await this.refreshLogList();
    };

    updateEntityParams = async () => {
        let isDashboardFiltered = false;
        let entityParams = {
            entity: "Log",
            selectedEntity: this.state.selectedLog,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            log_ids: (isDashboardFiltered ? this.state.log_ids : null) || null,
            building_ids: (isDashboardFiltered ? this.state.building_ids : null) || null
        };
        await this.props.updateLogEntityParams(entityParams);
    };

    resetAllFilters = async () => {
        await this.setState({
            selectedLog: null,
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
                list: null
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshLogList();
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
                config: _.cloneDeep(logTableData.config)
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshLogList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshLogList();
    };

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        const project_id = this.state.params.project_id;
        let isDashboardFiltered = false;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        params.project_id = project_id;
        params.log_ids = isDashboardFiltered ? this.state.log_ids : null;
        params.building_ids = (isDashboardFiltered ? this.state.building_ids : null) || null;
        params.start_year = (isDashboardFiltered ? this.state.start_year : null) || null;
        params.end_year = (isDashboardFiltered ? this.state.end_year : null) || null;

        await this.props.getListForCommonFilter(params);

        return (this.props.logReducer.getListForCommonFilterResponse && this.props.logReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshLogList();
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
        await this.refreshLogList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, logTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.refreshLogList();
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
        await this.refreshLogList();
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
        await this.refreshLogList();
    };

    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        this.setState({ tableLoading: true });
        section === "projectinfo"
            ? await this.props.exportLogByProject(entityId, {
                  project_id: entityId,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  log_ids: this.state.log_ids,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              })
            : await this.props.exportLog({
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order,
                  log_ids: this.state.log_ids,
                  building_ids: this.state.building_ids,
                  start_year: this.state.start_year,
                  end_year: this.state.end_year
              });
        this.setState({
            tableLoading: false
        });
        if (this.props.logReducer.logExportResponse && this.props.logReducer.logExportResponse.error) {
            await this.setState({ alertMessage: this.props.logReducer.logExportResponse.error });
            this.showAlerts();
        }
    };

    render() {
        const { tableData, showWildCardFilter, paginationParams, currentViewAllUsers, showViewModal, selectedRowId, permissions } = this.state;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                <LogMain
                    tableData={tableData}
                    showWildCardFilter={showWildCardFilter}
                    paginationParams={paginationParams}
                    currentViewAllUsers={currentViewAllUsers}
                    handleGlobalSearch={this.handleGlobalSearch}
                    globalSearchKey={this.state.params.search}
                    updateSelectedRow={this.updateSelectedRow}
                    selectedRowId={selectedRowId}
                    toggleWildCardFilter={this.toggleWildCardFilter}
                    showViewModal={this.showViewModal}
                    updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                    handleDeleteLog={this.handleDeleteLog}
                    showEditPage={this.showEditPage}
                    showInfoPage={this.showInfoPage}
                    showAddForm={this.showAddForm}
                    handlePerPageChange={this.handlePerPageChange}
                    isColunmVisibleChanged={this.isColunmVisibleChanged}
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
                    exportLogTable={this.exportLogTable}
                    exportTableXl={this.exportTableXl}
                    tableLoading={this.state.tableLoading}
                    permissions={permissions}
                    isValueChanged={this.state.isValueChanged}
                    hasExport={false}
                    showAddButton={false}
                    hasEdit={false}
                    hasDelete={false}
                    hasActionColumn={false}
                    hasInfoPage={false}
                    hasSort={false}
                    hasWildCardOptions={false}
                />
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
    const { logReducer } = state;
    return { logReducer };
};

export default withRouter(connect(mapStateToProps, { ...logActions })(index));
