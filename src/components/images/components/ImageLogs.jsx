import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";
import actions from "../actions";
import moment from "moment";
import TableTopIcons from "../../common/components/TableTopIcons";
import { imageLogsTableData } from "../../../config/tableData";
import Table from "../../reportTemplates/components/TableComponents/Table";
import BuildModalHeader from "../../common/components/BuildModalHeader";
import Portal from "../../common/components/Portal";
import ViewModal from "../../common/components/ViewModal";
import { renderFileSize } from "../../../config/utils";
class ImageLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                limit: 100,
                offset: 0,
                search: "",
                filters: null,
                list: null,
                filterKeys: {
                    // only logs of images which is uploaded to s3
                    upload_type: "CMP"
                },
                order: { upload_date: "desc" }
            },
            logs: [],
            tableData: {
                keys: imageLogsTableData.keys,
                config: imageLogsTableData.config
            },
            showWildCardFilter: false,
            showViewModal: false,
            selectedRowId: null
        };
    }
    componentDidMount = () => {
        this.refreshLogs();
    };
    refreshLogs = async () => {
        const { paginationParams, params, tableData } = this.state;
        this.setState({
            isLoading: true
        });
        const { filterKeys, limit, offset, search, order } = params;
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .join(",");
        let logParams = {
            ...filterKeys,
            limit,
            offset,
            search,
            ordering
        };
        await this.props.getImageLogs(logParams);
        this.setState({
            isLoading: false
        });
        const { imageLogsResponse } = this.props.imageReducer;
        const logs = imageLogsResponse.results || [];
        let totalCount = imageLogsResponse.count || 0;
        logs.map(temp => {
            temp.upload_date = moment(temp.upload_date).format("MM-DD-YYYY h:mm A");
            // temp.upload_type = temp.upload_type === "Real" ? "Local Server" : "AWS S3";
            temp.file_size = renderFileSize(temp.file_size);
            temp.overwrite = temp.overwrite ? "Yes" : "No";
        });
        this.setState({
            tableData: {
                ...tableData,
                data: logs
            },
            logs,
            showWildCardFilter: this.state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            }
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
        await this.refreshLogs();
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
        await this.refreshLogs();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        await this.refreshLogs();
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
        await this.refreshLogs();
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
        await this.refreshLogs();
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
        return true;
    };

    updateSelectedRow = async rowId => {
        await this.setState({
            selectedRowId: rowId
        });
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
        await this.refreshLogs();
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
            }
        });
        await this.refreshLogs();
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
        await this.refreshLogs();
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
    render() {
        const { paginationParams, isLoading, showViewModal, showWildCardFilter, tableData, params, selectedRowId } = this.state;
        return (
            <div
                class="modal assign-init-modal image-pull-modal img-logs"
                style={{ display: "block" }}
                id="modalId"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog assignModal" role="document">
                    <div class="modal-content">
                        <BuildModalHeader title="Logs" onCancel={this.props.onCancel} modalClass="assignModal" />
                        <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                            <form autoComplete="nope">
                                <div className="modal-body ">
                                    <div className="form-group">
                                        <div className="formInp">
                                            <div className="dashboard-outer">
                                                <div className="outer-detail">
                                                    <div className="right-panel-section">
                                                        <div className="dtl-sec">
                                                            <div className="dtl-sec system-building col-md-12 ">
                                                                <div className="tab-dtl region-mng">
                                                                    <div className="tab-active recomdn-table bg-grey-table">
                                                                        <div className={`dtl-sec `}>
                                                                            <div className="table-top-menu allign-right">
                                                                                <div className="rgt">
                                                                                    <TableTopIcons
                                                                                        globalSearchKey={params.search}
                                                                                        handleGlobalSearch={this.handleGlobalSearch}
                                                                                        resetAllFilters={this.resetAllFilters}
                                                                                        toggleWildCardFilter={this.toggleWildCardFilter}
                                                                                        showViewModal={this.showViewModal}
                                                                                        resetSort={this.resetSort}
                                                                                        tableParams={params}
                                                                                        isExport={false}
                                                                                        // entity={entity}
                                                                                        showWildCardFilter={showWildCardFilter}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <Table
                                                                                tableData={tableData}
                                                                                showWildCardFilter={showWildCardFilter}
                                                                                updateSelectedRow={this.updateSelectedRow}
                                                                                selectedRowId={selectedRowId}
                                                                                updateWildCardFilter={this.updateWildCardFilter}
                                                                                wildCardFilter={params}
                                                                                handleHideColumn={this.handleHideColumn}
                                                                                updateTableSortFilters={this.updateTableSortFilters}
                                                                                tableParams={params}
                                                                                hasExport={false}
                                                                                hasActionColumn={false}
                                                                                hasInfoPage={false}
                                                                            />
                                                                            {tableData.data && tableData.data.length ? (
                                                                                <div className="table-bottom d-flex">
                                                                                    <div className="count d-flex col-md-6">
                                                                                        <div className="count-dtl">
                                                                                            Total Count: <span>{paginationParams.totalCount}</span>
                                                                                        </div>
                                                                                        <div className="col-md-2 pr-2 selbx">
                                                                                            <select
                                                                                                className="form-control"
                                                                                                value={paginationParams.perPage}
                                                                                                onChange={e => this.handlePerPageChange(e)}
                                                                                            >
                                                                                                <option value="10">10</option>
                                                                                                <option value="20">20</option>
                                                                                                <option value="30">30</option>
                                                                                                <option value="40">40</option>
                                                                                                <option value="50">50</option>
                                                                                                <option value="100">100</option>
                                                                                                <option value="150">150</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="pagination-sec col-md-6">
                                                                                        <ReactPaginate
                                                                                            previousLabel={
                                                                                                <span
                                                                                                    data-place="top"
                                                                                                    data-effect="solid"
                                                                                                    data-tip={`Previous`}
                                                                                                    data-background-color="#007bff"
                                                                                                >
                                                                                                    &lt;
                                                                                                </span>
                                                                                            }
                                                                                            nextLabel={
                                                                                                <span
                                                                                                    data-place="top"
                                                                                                    data-effect="solid"
                                                                                                    data-tip={`Next`}
                                                                                                    data-background-color="#007bff"
                                                                                                >
                                                                                                    &gt;
                                                                                                </span>
                                                                                            }
                                                                                            breakLabel={"..."}
                                                                                            breakClassName={"break-me"}
                                                                                            pageCount={paginationParams.totalPages}
                                                                                            marginPagesDisplayed={2}
                                                                                            pageRangeDisplayed={5}
                                                                                            onPageChange={this.handlePageClick}
                                                                                            containerClassName={"pagination"}
                                                                                            subContainerClassName={"pages pagination"}
                                                                                            activeClassName={"active"}
                                                                                            activeLinkClassName={"active"}
                                                                                            forcePage={paginationParams.currentPage}
                                                                                        />
                                                                                        <ReactTooltip />
                                                                                    </div>
                                                                                </div>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </LoadingOverlay>
                    </div>
                </div>
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
        );
    }
}
const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(ImageLogs));
