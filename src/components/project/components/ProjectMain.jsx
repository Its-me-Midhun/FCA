import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import ReactTooltip from "react-tooltip";

import Table from "../../common/components/Table";
import projectActions from "../actions";
import TableTopIcons from "../../common/components/TableTopIcons";

class SiteMain extends Component {
    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            handleGlobalSearch,
            toggleWildCardFilter,
            updateCurrentViewAllUsers,
            handleDeleteProject,
            showEditPage,
            handlePerPageChange,
            handlePageClick,
            showAddForm,
            match: {
                params: { section }
            },
            showInfoPage,
            updateSelectedRow,
            selectedRowId,
            globalSearchKey,
            updateWildCardFilter,
            wildCardFilter,
            handleHideColumn,
            getListForCommonFilterProject,
            updateCommonFilter,
            commonFilter,
            isColunmVisibleChanged,
            resetAllFilters,
            resetAll,
            updateTableSortFilters,
            resetSort,
            tableParams,
            permissions = {},
            showAddButton,
            hasExport,
            hasEdit,
            hasDelete,
            hasInfoPage,
            isReportView,
            isEfciView,
            entity
        } = this.props;
        return (
            <React.Fragment>
                <div className={`${section !== "regioninfo" ? "dtl-sec" : ""} col-md-12`}>
                    <div className="table-top-menu allign-right">
                        <div className="rgt">
                            <TableTopIcons
                                tableData={tableData}
                                globalSearchKey={globalSearchKey}
                                handleGlobalSearch={handleGlobalSearch}
                                resetAllFilters={resetAllFilters}
                                isColunmVisibleChanged={isColunmVisibleChanged}
                                resetAll={resetAll}
                                toggleWildCardFilter={toggleWildCardFilter}
                                showViewModal={showViewModal}
                                resetSort={resetSort}
                                tableParams={tableParams}
                                exportTableXl={this.props.exportTableXl}
                                isExport={hasExport}
                                tableLoading={this.props.tableLoading}
                                entity={entity}
                                showWildCardFilter={showWildCardFilter}
                            />
                            {showAddButton && (
                                <button className="add-btn" onClick={() => showAddForm()}>
                                    <i className="fas fa-plus" />
                                    Add New Project
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={this.props.match.params.section == "userinfo" ? "recommendations-table" : "project-table"}>
                        <Table
                            updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                            tableData={tableData}
                            currentViewAllUsers={currentViewAllUsers}
                            handleDeleteItem={handleDeleteProject}
                            showWildCardFilter={showWildCardFilter}
                            showEditPage={showEditPage}
                            showInfoPage={showInfoPage}
                            updateSelectedRow={updateSelectedRow}
                            selectedRowId={selectedRowId}
                            updateWildCardFilter={updateWildCardFilter}
                            wildCardFilter={wildCardFilter}
                            handleHideColumn={handleHideColumn}
                            getListForCommonFilter={getListForCommonFilterProject}
                            updateCommonFilter={updateCommonFilter}
                            commonFilter={commonFilter}
                            updateTableSortFilters={updateTableSortFilters}
                            tableParams={tableParams}
                            hasPadding={true}
                            permissions={permissions}
                            hasActionColumn={isReportView || isEfciView || this.props.isUser ? false : true}
                            hasInfoPage={!this.props.isUser}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
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
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { siteReducer } = state;
    return { siteReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions })(SiteMain));
