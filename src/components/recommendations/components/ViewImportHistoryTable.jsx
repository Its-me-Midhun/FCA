import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import TableTopIcons from "../../common/components/TableTopIcons";
import { importModalTableData } from "../../../config/tableData";
import Table from "../../reportTemplates/components/TableComponents/Table";
import Portal from "../../common/components/Portal";
import ViewModal from "../../common/components/ViewModal";
import recommendationsActions from "../actions";
import qs from "query-string";
import ViewImportNoteModal from "./ViewImportNoteModal";
import refreshIcon from "../../../assets/img/img-refresh.svg";
class ViewImportHistoryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            alertMessage: "",
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                per_page_count: 100,
                page_number: 0,
                search: "",
                order: "",
                filters: null,
                filterKeys: {}
            },
            logs: [],
            tableData: {
                keys: importModalTableData.keys,
                config: importModalTableData.config
            },
            showWildCardFilter: false,
            showViewModal: false,
            selectedRowId: null,
            showEditExportPage: false,
            basic_details: {
                id: "",
                notes: ""
            },
            exportExcelHistoryLoading: false
        };
    }
    componentDidMount = () => {
        this.refreshImportHistory();
    };
    refreshImportHistory = async () => {
        const { paginationParams, params, tableData } = this.state;
        const { order, per_page_count, page_number, search, filters, filterKeys } = params;
        this.setState({
            isLoading: true
        });
        const { location } = this.props;
        const query = qs.parse(location.search);
        let ordering = [];
        ordering = Object.entries(order || [])
            .map(([key, value]) => (value === "asc" ? key : `-${key}`))
            .join(",");
        let param = {
            ...filterKeys,
            per_page_count,
            page_number,
            search,
            filters,
            ordering,
            project_id: query.pid || this.props.match.params.id
        };
        await this.props.getImportViewTableModal(param);
        this.setState({
            isLoading: false
        });
        const { exportWordTableResponse } = this.props.recommendationsReducer;
        let totalCount = exportWordTableResponse.count || 0;
        let ResData = exportWordTableResponse?.data;
        // exportWordTableResponse?.message && this.setState({ alertMessage: exportWordTableResponse.message }, () => this.showAlerts());
        ResData &&
            ResData.map(temp => {
                temp.updated_at = moment(temp.updated_at).format("MM-DD-YYYY h:mm A");
                temp.created_at = moment(temp.created_at).format("MM-DD-YYYY h:mm A");
            });
        this.setState({
            tableData: {
                ...tableData,
                data: ResData
            },
            showWildCardFilter: this.state.params.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount || "",
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            }
        });
    };
    updateWildCardFilter = async (wildCardFilter, filterKeys) => {
        await this.setState({
            params: {
                ...this.state.params,
                page_number: 0,
                filters: wildCardFilter,
                filterKeys
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        await this.refreshImportHistory();
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
                per_page_count: 100,
                page_number: 0,
                search: "",
                project_id: null,
                filters: null,
                filterKeys: {}
            },
            selectedRowId: null
        });
        await this.refreshImportHistory();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        await this.refreshImportHistory();
    };

    updateCommonFilter = async commonFilters => {
        await this.setState({
            params: {
                ...this.state.params,
                page_number: 0,
                list: commonFilters
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        await this.refreshImportHistory();
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
        await this.refreshImportHistory();
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
                perPage: Number(e.target.value),
                currentPage: 0
            },
            params: {
                ...this.state.params,
                page_number: 0,
                per_page_count: e.target.value
            }
        });
        await this.refreshImportHistory();
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
                page_number: page.selected * paginationParams.perPage
            }
        });
        await this.refreshImportHistory();
    };
    handleGlobalSearch = async search => {
        const { params } = this.state;
        await this.setState({
            params: {
                ...params,
                page_number: 0,
                search
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        await this.refreshImportHistory();
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

    handleDownloadItemImport = async (url, file) => {
        if (!url) {
            this.setState({ alertMessage: "Oops..! File url not found." }, () => this.showAlerts());
        } else {
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${file}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
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

    showEditExportPage = data => {
        this.setState({
            basic_details: { ...this.state.basic_details, notes: data.export_notes, id: data.id },
            showEditExportPage: true
        });
    };

    exportToExcel = async sort_type => {
        this.setState({ exportExcelHistoryLoading: true });
        const userId = localStorage.getItem("userId");
        const { params } = this.state;
        let param = {
            ...params,
            sort_type: sort_type
        };
        const {
            location: { search }
        } = this.props;

        const query = qs.parse(search);
        await this.props.exportToExcel({ project_id: query.pid || this.props.match.params.id, ...param });
        this.setState({ exportExcelHistoryLoading: false });
        // const res = this.props.recommendationsReducer.exportWordDataResponse;
        // await this.setState({
        //     alertMessage: res?.message_status ? res.message_status : res.message || "Some thing Went Wrong"
        // });
        // this.showAlert();
    };
    render() {
        const {
            paginationParams,
            exportExcelHistoryLoading,
            showEditExportPage,
            isLoading,
            showViewModal,
            showWildCardFilter,
            tableData,
            params,
            selectedRowId
        } = this.state;
        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div className="dtl-sec col-md-12">
                    <div className="table-top-menu allign-right">
                        <button
                            className="btn btn-edit refresh-btn"
                            onClick={e => {
                                e.preventDefault();
                                this.refreshImportHistory();
                            }}
                        >
                            <span className="icon mr-1">
                                <img src={refreshIcon} alt="" />
                            </span>
                            <span className="text">Refresh</span>
                        </button>
                        <div className="rgt">
                            <TableTopIcons
                                globalSearchKey={params.search}
                                handleGlobalSearch={this.handleGlobalSearch}
                                resetAllFilters={this.resetAllFilters}
                                toggleWildCardFilter={this.toggleWildCardFilter}
                                showViewModal={this.showViewModal}
                                resetSort={this.resetSort}
                                tableParams={params}
                                showWildCardFilter={showWildCardFilter}
                                exportToExcelFromExportHistory={this.exportToExcel}
                                exportExcelHistoryLoading={exportExcelHistoryLoading}
                            />
                        </div>
                    </div>
                    <div className="table-section build-table">
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
                            hasTableImport={true}
                            hasDelete={false}
                            hasInfoPage={false}
                            hasEdit={false}
                            handleDownloadItemImport={this.handleDownloadItemImport}
                            showEditExportPage={this.showEditExportPage}
                        />
                        {tableData.data && tableData.data.length ? (
                            <div className="table-bottom d-flex">
                                <div className="count d-flex col-md-6">
                                    <div className="count-dtl">
                                        Total Count: <span>{paginationParams.totalCount}</span>
                                    </div>
                                    <div className="col-md-2 pr-2 selbx">
                                        <select className="form-control" value={paginationParams.perPage} onChange={e => this.handlePerPageChange(e)}>
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
                                            <span data-place="top" data-effect="solid" data-tip={`Previous`} data-background-color="#007bff">
                                                &lt;
                                            </span>
                                        }
                                        nextLabel={
                                            <span data-place="top" data-effect="solid" data-tip={`Next`} data-background-color="#007bff">
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
                        {showEditExportPage ? (
                            <Portal
                                body={
                                    <ViewImportNoteModal
                                        refreshImportHistory={this.refreshImportHistory}
                                        basic_details={this.state.basic_details}
                                        onCancel={() => this.setState({ showEditExportPage: false })}
                                    />
                                }
                                onCancel={() => this.setState({ showEditExportPage: false })}
                            />
                        ) : null}

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
            </LoadingOverlay>
        );
    }
}
const mapStateToProps = state => {
    const { recommendationsReducer } = state;
    return { recommendationsReducer };
};

export default withRouter(connect(mapStateToProps, { ...recommendationsActions })(ViewImportHistoryTable));
