import React, { Component } from "react";
import PropTypes from "prop-types";
import LeftSideMenue from "./LeftSideMenue";
import ReactPaginate from "react-paginate";
import TableTopIcon from "./TableTopIcon";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../actions";
import Table from "../../reportTemplates/components/TableComponents/Table";
import ReactTooltip from "react-tooltip";
import TableTopIcons from "../../reportTemplates/components/TableComponents/TableTopIcons";
import refreshIcon from "../../../assets/img/img-refresh.svg";
class Inbox extends Component {
    static propTypes = {
        prop: PropTypes
    };

    render() {
        const {
            tableData,
            handlePerPageChange,
            handlePageClick,
            paginationParams,
            updateSelectedRow,
            showInfoPage,
            hasInfoPage,
            updateCommonFilter,
            resetAllFilters,
            handleGlobalSearch,
            toggleWildCardFilter,
            globalSearchKey,
            isColunmVisibleChanged,
            wildCardFilter,
            updateWildCardFilter,
            selectedRowId,
            commonFilter,
            resetAll,
            showWildCardFilter,
            showViewModal,
            tableParams,
            updateTableSortFilters,
            handleHideColumn,
            resetSort
        } = this.props;
        return (
            <React.Fragment>
                <div class="dtl-in-list">
                    <div className="table-top-menu allign-right">
                        <button
                            className="btn btn-edit refresh-btn"
                            onClick={e => {
                                e.preventDefault();
                                this.props.getEmailData();
                            }}
                        >
                            <span className="icon mr-1">
                                <img src={refreshIcon} alt="" />
                            </span>
                            <span className="text">Refresh</span>
                        </button>
                        <div className="rgt">
                            <TableTopIcons
                                tableData={tableData}
                                globalSearchKey={globalSearchKey}
                                handleGlobalSearch={handleGlobalSearch}
                                resetAllFilters={resetAllFilters}
                                resetAll={resetAll}
                                toggleWildCardFilter={toggleWildCardFilter}
                                showViewModal={showViewModal}
                                isColunmVisibleChanged={isColunmVisibleChanged}
                                resetSort={resetSort}
                                tableParams={tableParams}
                                exportTableXl={this.props.exportTableXl}
                                tableLoading={this.props.tableLoading}
                                showWildCardFilter={showWildCardFilter}
                            />
                        </div>
                    </div>
                    <Table
                        tableData={tableData}
                        hasActionColumn={false}
                        selectedRowId={selectedRowId}
                        updateSelectedRow={updateSelectedRow}
                        showInfoPage={showInfoPage}
                        wildCardFilter={wildCardFilter}
                        commonFilter={commonFilter}
                        handleHideColumn={handleHideColumn}
                        showWildCardFilter={showWildCardFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        tableParams={tableParams}
                        updateWildCardFilter={updateWildCardFilter}
                        updateTableSortFilters={updateTableSortFilters}
                        hasInfoPage={hasInfoPage}
                    />
                    {tableData.data && tableData.data.length ? (
                        <div className="table-bottom d-flex">
                            <div className="count d-flex col-md-6">
                                <div className="count-dtl">
                                    Total Count: <span>{paginationParams.totalCount}</span>
                                </div>
                                <div className="col-md-2 pr-2 selbx">
                                    <select className="form-control" value={paginationParams.perPage} onChange={e => handlePerPageChange(e)}>
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
                                    onPageChange={handlePageClick}
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
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    const { emailReducer } = state;
    return { emailReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(Inbox));
