import React from "react";
import TableTopIcons from "../../common/components/TableTopIcons";
import Table from "../../common/components/Table";
import ReactTooltip from "react-tooltip";
import ReactPaginate from "react-paginate";

const TradeUserView = ({
    data,
    showAddForm,
    isColunmVisibleChanged,
    paginationParams,
    handlePerPageChange,
    toggleWildCardFilter,
    showWildCardFilter,
    resetAllFilters,
    updateWildCardFilter,
    handleDeleteItem,
    updateSelectedRow,
    showEditPage
}) => {
    return (
        <>
            <div className={`col-md-12 dtl-sec`}>
                <div className="table-top-menu allign-right">
                    <div className="rgt">
                        <TableTopIcons
                            tableData={data}
                            isColunmVisibleChanged={isColunmVisibleChanged}
                            // globalSearchKey={globalSearchKey}
                            // handleGlobalSearch={handleGlobalSearch}
                            resetAllFilters={resetAllFilters}
                            // resetAll={resetAll}
                            toggleWildCardFilter={toggleWildCardFilter}
                            // showViewModal={true}
                            // resetSort={resetSort}
                            // tableParams={tableParams}
                            // isExport={true}
                            // exportTableXl={this.props.exportTableXl}
                            // entity={entity}
                            showWildCardFilter={showWildCardFilter}
                        />
                        <button className="add-btn" onClick={showAddForm}>
                            <i className="fas fa-plus" /> Add New User Permissions
                        </button>
                    </div>
                </div>
                <div className="building-type-table">
                    <Table
                        // updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                        tableData={data}
                        // currentViewAllUsers={currentViewAllUsers}
                        handleDeleteItem={handleDeleteItem}
                        showWildCardFilter={showWildCardFilter}
                        showEditPage={showEditPage}
                        // showInfoPage={showInfoPage}
                        // hasInfoPage={false}
                        updateSelectedRow={updateSelectedRow}
                        // selectedRowId={selectedRowId}
                        updateWildCardFilter={updateWildCardFilter}
                        // wildCardFilter={wildCardFilter}
                        // handleHideColumn={handleHideColumn}
                        // getListForCommonFilter={getListForCommonFilterBuildingType}
                        // updateCommonFilter={updateCommonFilter}
                        // commonFilter={commonFilter}
                        // updateTableSortFilters={updateTableSortFilters}
                        // tableParams={tableParams}
                        hasEdit={true}
                        hasDelete={true}
                        hasInfoPage={false}
                    />
                    {data.data && data.data.length ? (
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
                                    // onPageChange={handlePageClick}
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
        </>
    );
};

export default TradeUserView;
