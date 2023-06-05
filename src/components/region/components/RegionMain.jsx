import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";

import Table from "../../common/components/Table";
import TableTopIcons from "../../common/components/TableTopIcons";

class RegionMain extends Component {
    render() {
        const {
            tableData,
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            handleGlobalSearch,
            toggleWildCardFilter,
            showViewModal,
            updateCurrentViewAllUsers,
            handleDeleteRegion,
            showEditPage,
            showInfoPage,
            showAddForm,
            handlePerPageChange,
            handlePageClick,
            updateSelectedRow,
            selectedRowId,
            globalSearchKey,
            updateWildCardFilter,
            wildCardFilter,
            handleHideColumn,
            getListForCommonFilter,
            updateCommonFilter,
            commonFilter,
            isColunmVisibleChanged,
            resetAllFilters,
            resetAll,
            updateTableSortFilters,
            resetSort,
            tableParams,
            exportRegionTable,
            permissions,
            showAddButton,
            hasExport,
            hasEdit,
            hasDelete,
            hasInfoPage,
            entity,
            hasActionColumn
        } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="table-top-menu allign-right">
                        <div className="rgt">
                            <TableTopIcons
                                globalSearchKey={globalSearchKey}
                                handleGlobalSearch={handleGlobalSearch}
                                resetAllFilters={resetAllFilters}
                                resetAll={resetAll}
                                tableData={tableData}
                                isColunmVisibleChanged={isColunmVisibleChanged}
                                toggleWildCardFilter={toggleWildCardFilter}
                                showViewModal={showViewModal}
                                resetSort={resetSort}
                                tableParams={tableParams}
                                isExport={hasExport}
                                exportTableXl={this.props.exportTableXl}
                                tableLoading={this.props.tableLoading}
                                entity={entity}
                                showWildCardFilter={showWildCardFilter}
                            />
                            {showAddButton && (
                                <button className="add-btn" onClick={() => showAddForm()}>
                                    <i className="fas fa-plus" /> Add New Region
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="table-region">
                        <Table
                            updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                            tableData={tableData}
                            currentViewAllUsers={currentViewAllUsers}
                            handleDeleteItem={handleDeleteRegion}
                            showWildCardFilter={showWildCardFilter}
                            showEditPage={showEditPage}
                            showInfoPage={showInfoPage}
                            updateSelectedRow={updateSelectedRow}
                            selectedRowId={selectedRowId}
                            updateWildCardFilter={updateWildCardFilter}
                            wildCardFilter={wildCardFilter}
                            handleHideColumn={handleHideColumn}
                            getListForCommonFilter={getListForCommonFilter}
                            updateCommonFilter={updateCommonFilter}
                            commonFilter={commonFilter}
                            updateTableSortFilters={updateTableSortFilters}
                            globalSearchKey={globalSearchKey}
                            tableParams={tableParams}
                            hasPadding={true}
                            permissions={permissions}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasInfoPage={hasInfoPage}
                            hasActionColumn={hasActionColumn}
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

export default withRouter(RegionMain);
