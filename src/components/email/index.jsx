import React, { Component } from "react";
import PropTypes from "prop-types";
import Loader from "../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import "../../assets/css/inbox.css";
import _ from "lodash";
import Portal from "../common/components/Portal";
import EmailSendModal from "./components/EmailSendModal";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import actions from "./actions";
import TableTopIcon from "./components/TableTopIcon";
import EmailMain from "./components/EmailMain";
import LeftSideMenue from "./components/LeftSideMenue";

import { emailTableData } from "../../config/tableData";
import { inboxTableData } from "../../config/tableData";
import { sentTableData } from "../../config/tableData";
import history from "../../config/history";
import moment from "moment/moment";
import { addToBreadCrumpData, checkPermission } from "../../config/utils";
import EmailSingleView from "./components/EmailSingleView";
import ViewModal from "../common/components/ViewModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmation: false,

            sentEmailList: [],
            emailDetails: null,
            section: "allsent",
            isViewInfo: false,
            singleData: {},
            showWildCardFilter: false,
            isLoading: true,
            errorMessage: "",
            inboxEmailList: [],
            paginationParams: this.props.emailReducer.entityParams.paginationParams,
            showViewModal: false,

            tableLoading: false,
            selectedRowId: this.props.emailReducer.entityParams.selectedRowId,
            params: this.props.emailReducer.entityParams.params,
            // selectedProject: this.props.match.params.id || null,
            selectedEmail: this.props.match.params.subId || this.props.emailReducer.entityParams.selectedEntity,
            tablename: null,
            tableData: {
                keys: emailTableData.keys,
                config: this.props.emailReducer.entityParams.tableConfig || _.cloneDeep(emailTableData.config)
            },
            infoTabsData: [],
            alertMessage: "",
            wildCardFilterParams: this.props.emailReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.emailReducer.entityParams.filterParams,
            // showFormModal: false,
            historyPaginationParams: this.props.emailReducer.entityParams.historyPaginationParams,
            historyParams: this.props.emailReducer.entityParams.historyParams,
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
    }

    componentDidMount = async () => {
        this.getEmailData();
        let path = `/settings/email/${this.state.section}`;
        addToBreadCrumpData({
            key: "emailinfo",
            name: `${this.state.section}`,
            path
        });
        history.push(path);
    };
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevState.section !== this.state.section) {
            this.setState({
                tableData:
                    this.state.section == "inbox"
                        ? {
                              keys: inboxTableData.keys,
                              config: this.props.emailReducer.entityParams.tableConfig || _.cloneDeep(inboxTableData.config)
                          }
                        : this.state.section == "allsent"
                        ? {
                              keys: emailTableData.keys,
                              config: this.props.emailReducer.entityParams.tableConfig || _.cloneDeep(emailTableData.config)
                          }
                        : {
                              keys: sentTableData.keys,
                              config: this.props.emailReducer.entityParams.tableConfig || _.cloneDeep(sentTableData.config)
                          }
            });
            this.getEmailData();
            this.setState({ isViewInfo: false });
        }
    };
    showInfoPage = (id, projectId, rowData) => {
        const { history } = this.props;
        const {
            match: { url }
        } = this.props;
        this.setState({
            selectedEmail: id
        });
        this.setState({
            isViewInfo: true
        });
        this.setState({
            singleData: rowData
        });
        // addToBreadCrumpData({
        //     key: "Name",
        //     name: rowData?.name,
        //     path: `${url}/info/${id}/basicdetails`,
        //     isInnerTab: true
        // });

        // addToBreadCrumpData({
        //     key: "info",
        //     name: "",
        //     path: `${url}/info/basicdetails`,
        //     // isInnerTab: true
        // });
        //  history.push(`${url}/info/${id}/basicdetails`);
    };
    getEmailData = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData, section } = this.state;

        const { filterKeys, limit, offset, search, order, template_filter } = params;

        let inboxList = [];
        let totalCount = 0;

        let currentUserId = localStorage.getItem("userId");
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .map(item => {
                let tempItem = item;
                if (item.includes("from_mail")) {
                    tempItem = item.replace("from_mail", "from_user");
                }
                if (item.includes("content")) {
                    tempItem = item.replace("content", "description");
                }
                if (item.includes("to_user")) {
                    tempItem = item.replace("to_user", "to_user");
                }
                if (item.includes("created_at")) {
                    tempItem = item.replace("created_at", "created_at");
                }
                return tempItem;
            })
            .join(",");
        const emailparams = {
            ...filterKeys,
            // limit,
            // offset,
            search,
            ordering,
            per_page_count: limit,
            page_number: offset + 1
        };
        switch (section) {
            case "allsent": {
                emailparams.user_id = currentUserId;
                emailparams.inbox_id = null;
                emailparams.sent_id = null;
                break;
            }
            case "inbox": {
                emailparams.inbox_id = currentUserId;
                emailparams.user_id = null;

                emailparams.sent_id = null;
                break;
            }

            case "sent": {
                emailparams.sent_id = currentUserId;
                emailparams.user_id = null;
                emailparams.inbox_id = null;

                break;
            }
            default:
                emailparams.user_id = currentUserId;
        }

        await this.props.getAllMail(emailparams);

        inboxList = this.props.emailReducer.allEmailListResponse ? this.props.emailReducer.allEmailListResponse.data || [] : [];
        totalCount = this.props.emailReducer.allEmailListResponse ? this.props.emailReducer.allEmailListResponse.count || 0 : 0;
        console.log(this.state.inboxList);
        if (inboxList && !inboxList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getAllMail();
            inboxList = this.props.emailReducer.allEmailListResponse ? this.props.emailReducer.allEmailListResponse.data || [] : [];
            totalCount = this.props.emailReducer.allEmailListResponse ? this.props.emailReducer.allEmailListResponse.count || 0 : 0;
        }
        if (inboxList && !inboxList.length && this.props.emailReducer.allEmailListResponse && this.props.emailReducer.allEmailListResponse.error) {
            await this.setState({ alertMessage: this.props.emailReducer.allEmailListResponse.error });
            this.showAlert();
        }
        inboxList.map(temp => {
            temp.created_at = moment(temp.created_at).format("MM-DD-YYYY h:mm A");
        });
        this.setState({
            tableData: {
                ...tableData,
                data: inboxList,
                config: this.props.emailReducer.entityParams.tableConfig || tableData.config
            },
            inboxList,
            showWildCardFilter: this.state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            isLoading: false
        });
        this.updateEmailEntityParams();
        return true;
    };

    updateSelectedRow = async rowId => {
        await this.setState({
            selectedRowId: rowId
        });
        await this.updateEmailEntityParams();
    };
    //pagination
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
        await this.getEmailData();
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
        this.updateEmailEntityParams();
        await this.getEmailData();
    };

    //sort
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
        this.updateEmailEntityParams();
        await this.getEmailData();
    };
    resetAll = async () => {
        await this.setState({
            selectedEmail: null,
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

                config: _.cloneDeep(emailTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEmailEntityParams();
        await this.getEmailData();
    };

    resetAllFilters = async () => {
        await this.setState({
            selectedEmail: null,
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
        this.updateEmailEntityParams();
        await this.getEmailData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });

        this.updateEmailEntityParams();
        await this.getEmailData();
    };
    updateEmailEntityParams = async () => {
        let entityParams = {
            entity: "Notification",
            selectedEntity: this.state.selectedEmail,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.EmailEntityParams(entityParams);
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
        await this.getEmailData();
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
        await this.getEmailData();
    };

    chooseMessage = async data => {
        this.setState({ section: data });
        this.getEmailData();
        let path = `/settings/email/${data}`;
        addToBreadCrumpData({
            key: "emailinfo",
            name: `${data}`,
            path
        });
        history.push(path);

        if (this.state.isViewInfo == true) {
            this.setState({
                isViewInfo: false
            });
        }
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
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
        this.updateEmailEntityParams();
        await this.getEmailData();
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
        await this.updateEmailEntityParams();
        return true;
    };
    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, emailTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    render() {
        const { section, inboxEmailList, tableData, paginationParams, isViewInfo, singleData, selectedRowId, showWildCardFilter, showViewModal } =
            this.state;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div class="dtl-sec col-md-12 inbox">
                    <div class="tab-dtl region-mng">
                        <div class="tab-active inbox-listing">
                            <div class="dtl-sec col-md-12">
                                <LeftSideMenue getSection={this.chooseMessage} section={this.state.section} />
                                {isViewInfo == true ? (
                                    <EmailSingleView singleData={singleData} section={this.state.section} />
                                ) : (
                                    <EmailMain
                                        showWildCardFilter={showWildCardFilter}
                                        tableData={tableData}
                                        selectedRowId={selectedRowId}
                                        handleHideColumn={this.handleHideColumn}
                                        handleGlobalSearch={this.handleGlobalSearch}
                                        globalSearchKey={this.state.params.search}
                                        paginationParams={paginationParams}
                                        getEmailData={this.getEmailData}
                                        showViewModal={this.showViewModal}
                                        resetAll={this.resetAll}
                                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                                        resetAllFilters={this.resetAllFilters}
                                        wildCardFilter={this.state.params}
                                        handlePerPageChange={this.handlePerPageChange}
                                        updateWildCardFilter={this.updateWildCardFilter}
                                        handlePageClick={this.handlePageClick}
                                        updateSelectedRow={this.updateSelectedRow}
                                        showInfoPage={this.showInfoPage}
                                        toggleWildCardFilter={this.toggleWildCardFilter}
                                        updateTableSortFilters={this.updateTableSortFilters}
                                        hasInfoPage={true}
                                        resetSort={this.resetSort}
                                        tableParams={this.state.params}
                                        // currentViewAllUsers={currentViewAllUsers}
                                        updateCommonFilter={this.updateCommonFilter}
                                        commonFilter={this.state.params.list}
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
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}
const mapStateToProps = state => {
    const { emailReducer } = state;
    return { emailReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
