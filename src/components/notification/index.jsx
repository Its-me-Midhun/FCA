import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import moment from "moment";

import CommonActions from "../common/actions";
import notificationActions from "./actions";
import _ from "lodash";
import NotificationMain from "./components/NotificationMain";
import Loader from "../common/components/Loader";
import { notificationTableData } from "../../config/tableData";
import { checkPermission } from "../../config/utils";

class index extends Component {
    state = {
        isLoading: true,
        errorMessage: "",
        notificationList: [],
        paginationParams: this.props.notificationReducer.entityParams.paginationParams,
        currentViewAllUsers: null,
        currentActions: null,
        showFormModal: false,
        showWildCardFilter: false,
        buildingTypeData: {},
        selectedRowId: this.props.notificationReducer.entityParams.selectedRowId,
        params: this.props.notificationReducer.entityParams.params,
        selectedNotification: {},
        selectedBuildingType: this.props.match.params.id || this.props.notificationReducer.entityParams.selectedEntity,
        tableData: {
            keys: notificationTableData.keys,
            config: this.props.notificationReducer.entityParams.tableConfig || _.cloneDeep(notificationTableData.config)
        },
        alertMessage: "",
        wildCardFilterParams: this.props.notificationReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.notificationReducer.entityParams.filterParams,
        historyPaginationParams: this.props.notificationReducer.entityParams.historyPaginationParams,
        historyParams: this.props.notificationReducer.entityParams.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        tableLoading: false,
        permissions: {}
    };

    componentDidMount = async () => {
        await this.refreshNotificationList();
    };

    refreshNotificationList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const { filterKeys, limit, offset, search, order, template_filter } = params;
        let notificationList = [];
        let totalCount = 0;
        let currentUserId = localStorage.getItem("userId");
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .map(item => {
                let tempItem = item;
                if (item.includes("title")) {
                    tempItem = item.replace("title", "data__title");
                }
                if (item.includes("body")) {
                    tempItem = item.replace("body", "data__body");
                }
                if (item.includes("user_name")) {
                    tempItem = item.replace("user_name", "user");
                }
                return tempItem;
            })
            .join(",");
        let notificationParams = {
            ...filterKeys,
            // limit,
            // offset,
            search,
            ordering,
            per_page_count: limit,
            page_number: offset + 1
        };

        let userRole = localStorage.getItem("role");
        if (userRole !== "super_admin") {
            notificationParams.user_id = currentUserId;
        }

        await this.props.getNotifications(notificationParams);
        notificationList = this.props.notificationReducer.getNotificationsResponse?.data || [];
        totalCount = this.props.notificationReducer.getNotificationsResponse?.count || 0;

        // go to previous page is the last record of the current page is deleted
        if (notificationList && !notificationList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getClients(this.state.params);
            notificationList = this.props.notificationReducer.getNotificationsResponse?.data || [];
            totalCount = this.props.notificationReducer.getNotificationsResponse?.count || 0;
        }
        if (
            notificationList &&
            !notificationList.length &&
            this.props.notificationReducer.getNotificationsResponse &&
            this.props.notificationReducer.getNotificationsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.notificationReducer.getNotificationsResponse.error });
            this.showAlert();
        }

        notificationList.map(notification => {
            notification.updated_at = moment(notification.updated_at).format("MM-DD-YYYY h:mm A");
            notification.created_at = moment(notification.created_at).format("MM-DD-YYYY h:mm A");
            notification.read_at = notification.read_at ? moment(notification.read_at).format("MM-DD-YYYY h:mm A") : "-";
            notification.seen_at = notification.seen_at ? moment(notification.seen_at).format("MM-DD-YYYY h:mm A") : "-";
        });

        this.setState({
            tableData: {
                ...tableData,
                data: notificationList,
                config: this.props.notificationReducer.entityParams.tableConfig || tableData.config
            },
            notificationList,
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

    updateWildCardFilter = async (wildCardFilter, filterKeys) => {
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
        await this.refreshNotificationList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Notification",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateNotificationsEntityParams(entityParams);
    };

    resetAllFilters = async () => {
        await this.setState({
            selectedNotification: null,
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
                client_id: null,
                filters: null,
                filterKeys: {}
            },
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshNotificationList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshNotificationList();
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
                filterKeys: {},
                order: null,
                list: null,
                key: null,
                config: null
            },
            tableData: {
                ...this.state.tableData,
                config: _.cloneDeep(notificationTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshNotificationList();
    };

    getListForCommonFilter = async params => {
        await this.props.getListForCommonFilter(params);
        return (
            (this.props.notificationReducer.getListForCommonFilterResponse && this.props.notificationReducer.getListForCommonFilterResponse.list) ||
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
        await this.refreshNotificationList();
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
        await this.refreshNotificationList();
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
        await this.refreshNotificationList();
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
        await this.refreshNotificationList();
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, notificationTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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
        await this.refreshNotificationList();
    };

    exportTableXl = async () => {
        this.setState({ tableLoading: true });
        const { filterKeys, search, order } = this.state.params;
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .map(item => {
                let tempItem = item;
                if (item.includes("title")) {
                    tempItem = item.replace("title", "data__title");
                }
                if (item.includes("body")) {
                    tempItem = item.replace("body", "data__body");
                }
                if (item.includes("user_name")) {
                    tempItem = item.replace("user_name", "user");
                }
                return tempItem;
            })
            .join(",");
        let templateParams = {
            ...filterKeys,
            search,
            ordering
        };
        let currentUserId = localStorage.getItem("userId");
        let userRole = localStorage.getItem("role");
        if (userRole !== "super_admin") {
            templateParams.user_id = currentUserId;
        }
        await this.props.exportNotification(templateParams);
        // // await this.props.addUserActivityLog({ text: "Exported report template." });
        this.setState({ tableLoading: false });
        if (this.props.notificationReducer.notificationExportResponse?.error) {
            this.setState({ alertMessage: this.props.chartTemplateReducer.notificationExportResponse.error }, () => this.showAlert());
        }
    };

    render() {
        const { showWildCardFilter, paginationParams, currentViewAllUsers, tableData, selectedRowId, permissions } = this.state;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                <NotificationMain
                    showWildCardFilter={showWildCardFilter}
                    paginationParams={paginationParams}
                    currentViewAllUsers={currentViewAllUsers}
                    tableData={tableData}
                    handleGlobalSearch={this.handleGlobalSearch}
                    toggleWildCardFilter={this.toggleWildCardFilter}
                    handlePerPageChange={this.handlePerPageChange}
                    handlePageClick={this.handlePageClick}
                    isColunmVisibleChanged={this.isColunmVisibleChanged}
                    updateSelectedRow={this.updateSelectedRow}
                    selectedRowId={selectedRowId}
                    globalSearchKey={this.state.params.search}
                    updateWildCardFilter={this.updateWildCardFilter}
                    wildCardFilter={this.state.params}
                    handleHideColumn={this.handleHideColumn}
                    getListForCommonFilterBuildingType={this.getListForCommonFilter}
                    updateCommonFilter={this.updateCommonFilter}
                    commonFilter={this.state.params.list}
                    resetAllFilters={this.resetAllFilters}
                    resetAll={this.resetAll}
                    resetSort={this.resetSort}
                    tableParams={this.state.params}
                    updateTableSortFilters={this.updateTableSortFilters}
                    exportRegionTable={this.exportRegionTable}
                    exportTableXl={this.exportTableXl}
                    tableLoading={this.state.tableLoading}
                    permissions={permissions}
                    entity="Notifications"
                    hasExport={checkPermission("forms", "notifications", "export")}
                    showAddButton={false}
                    hasEdit={false}
                    hasDelete={false}
                    hasInfoPage={false}
                />
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { notificationReducer, commonReducer } = state;
    return { notificationReducer, commonReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...notificationActions,
        ...CommonActions
    })(index)
);
