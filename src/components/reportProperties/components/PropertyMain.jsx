import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";

import Table from "../../common/components/Table";
import TableTopIcons from "../../common/components/TableTopIcons";
export default class PropertyMain extends Component {
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
            handleDelete,
            showEditPage,
            handlePerPageChange,
            isColunmVisibleChanged,
            handlePageClick,
            showAddForm,
            showInfoPage,
            updateSelectedRow,
            selectedRowId,
            globalSearchKey,
            updateWildCardFilter,
            wildCardFilter,
            handleHideColumn,
            getListForCommonFilterFloor,
            updateCommonFilter,
            commonFilter,
            resetAllFilters,
            resetAll,
            updateTableSortFilters,
            resetSort,
            tableParams,
            permissions,
            showAddButton,
            hasExport,
            hasEdit,
            hasDelete,
            hasInfoPage,
            isLocalSettings,
            selectFilterHandler,
            showRestoreModal,
            entity
        } = this.props;

        return (
            <React.Fragment>
                <div className={`dtl-sec  ${isLocalSettings ? "floor-detail" : ""}`}>
                    <div className="table-top-menu allign-right">
                        <div className="lft">
                            <select
                                className={this.props.selectedDropdown === "active" ? "form-control cstm-active" : "form-control"}
                                value={this.props.selectedDropdown}
                                onChange={e => selectFilterHandler(e)}
                            >
                                <option value="all" className={"cstm-option"}>
                                    All
                                </option>
                                <option value="active" className={"cstm-option"}>
                                    Active
                                </option>
                                <option value="deleted" className={"cstm-option"}>
                                    Deleted
                                </option>
                            </select>
                        </div>
                        <div className="rgt">
                            <TableTopIcons
                                tableData={tableData}
                                globalSearchKey={globalSearchKey}
                                handleGlobalSearch={handleGlobalSearch}
                                resetAllFilters={resetAllFilters}
                                resetAll={resetAll}
                                isColunmVisibleChanged={isColunmVisibleChanged}
                                toggleWildCardFilter={toggleWildCardFilter}
                                showViewModal={showViewModal}
                                resetSort={resetSort}
                                tableParams={tableParams}
                                exportTableXl={this.props.exportTableXl}
                                tableLoading={this.props.tableLoading}
                                isExport={hasExport}
                                entity={entity}
                                showWildCardFilter={showWildCardFilter}
                            />
                            {showAddButton && (
                                <button className="add-btn" onClick={() => showAddForm()}>
                                    <i className="fas fa-plus" /> Add New Property
                                </button>
                            )}
                        </div>
                    </div>
                    <Table
                        updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                        tableData={tableData}
                        currentViewAllUsers={currentViewAllUsers}
                        handleDeleteItem={handleDelete}
                        showWildCardFilter={showWildCardFilter}
                        showEditPage={showEditPage}
                        showInfoPage={showInfoPage}
                        updateSelectedRow={updateSelectedRow}
                        selectedRowId={selectedRowId}
                        updateWildCardFilter={updateWildCardFilter}
                        wildCardFilter={wildCardFilter}
                        handleHideColumn={handleHideColumn}
                        getListForCommonFilter={getListForCommonFilterFloor}
                        updateCommonFilter={updateCommonFilter}
                        commonFilter={commonFilter}
                        updateTableSortFilters={updateTableSortFilters}
                        tableParams={tableParams}
                        permissions={permissions}
                        hasEdit={hasEdit}
                        hasDelete={hasDelete}
                        hasInfoPage={hasInfoPage}
                        showRestoreModal={showRestoreModal}
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
