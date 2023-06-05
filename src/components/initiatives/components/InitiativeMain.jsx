import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import ReactTooltip from "react-tooltip";

import Table from "../../common/components/Table";
import recommendationsActions from "../actions";
import TableTopIcons from "../../common/components/TableTopIcons";

class RecommendationsMain extends Component {
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
            handleDeleteInitiatives,
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
            isColunmVisibleChanged,
            globalSearchKey,
            updateWildCardFilter,
            wildCardFilter,
            handleHideColumn,
            getListForCommonFilterRecommendation,
            updateCommonFilter,
            commonFilter,
            resetAllFilters,
            resetAll,
            updateTableSortFilters,
            resetSort,
            tableParams,
            isBuildingLocked,
            handleCutPaste,
            summaryRowData,
            showRestoreModal,
            selectFilterHandler,
            permissions,
            entity
        } = this.props;
        return (
            <React.Fragment>
                <div className={`${section !== "regioninfo" ? "dtl-sec" : ""} col-md-12`}>
                    <div className="table-top-menu allign-right">
                        <div className="lft">
                            <select className="form-control" value={this.props.selectedDropdown} onChange={e => selectFilterHandler(e)}>
                                <option value="all">All</option>
                                <option value="assigned">Assigned</option>
                                <option value="unassigned">Unassigned</option>
                            </select>
                        </div>
                        <div className="rgt">
                            <TableTopIcons
                                globalSearchKey={globalSearchKey}
                                tableData={tableData}
                                handleGlobalSearch={handleGlobalSearch}
                                isColunmVisibleChanged={isColunmVisibleChanged}
                                resetAllFilters={resetAllFilters}
                                resetAll={resetAll}
                                toggleWildCardFilter={toggleWildCardFilter}
                                showViewModal={showViewModal}
                                resetSort={resetSort}
                                tableParams={tableParams}
                                isExport={permissions && permissions.export == false ? false : true}
                                exportTableXl={this.props.exportTableXl}
                                tableLoading={this.props.tableLoading}
                                selectFilterHandler={selectFilterHandler}
                                isSelectFilter={true}
                                entity={entity}
                                showWildCardFilter={showWildCardFilter}
                            />
                            {this.props.match.params.tab == "recommendations" ||
                            this.props.match.params.tab == "recommendation" ? null : permissions && permissions.create == false ? (
                                ""
                            ) : (
                                <button className="add-btn" onClick={() => showAddForm()}>
                                    <i className="fas fa-plus" /> Add New Initiative
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="recommendations-table">
                        <Table
                            updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                            tableData={tableData}
                            currentViewAllUsers={currentViewAllUsers}
                            handleDeleteItem={handleDeleteInitiatives}
                            showWildCardFilter={showWildCardFilter}
                            showEditPage={showEditPage}
                            showInfoPage={showInfoPage}
                            updateSelectedRow={updateSelectedRow}
                            selectedRowId={selectedRowId}
                            updateWildCardFilter={updateWildCardFilter}
                            wildCardFilter={wildCardFilter}
                            handleHideColumn={handleHideColumn}
                            getListForCommonFilter={getListForCommonFilterRecommendation}
                            updateCommonFilter={updateCommonFilter}
                            commonFilter={commonFilter}
                            hasActionColumn={!this.props.isChartView}
                            updateTableSortFilters={updateTableSortFilters}
                            tableParams={tableParams}
                            isBuildingLocked={this.props.isBuildingLocked}
                            handleCutPaste={handleCutPaste}
                            summaryRowData={summaryRowData}
                            showRestoreModal={showRestoreModal}
                            permissions={permissions}
                            handleSelect={this.props.handleSelect}
                            handleSelectAll={this.props.handleSelectAll}
                            recomentationIds={this.props.initiativeIds}
                            isAssignProject={this.props.isAssignProject}
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

export default withRouter(connect(mapStateToProps, { ...recommendationsActions })(RecommendationsMain));
