import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import ReactTooltip from "react-tooltip";

import Table from "./TableComponents/Table";
import projectActions from "../actions";
import TableTopIcons from "./TableComponents/TableTopIcons";

class TemplatesMain extends Component {
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
            isColunmVisibleChanged,
            hasEdit,
            hasDelete,
            hasInfoPage,
            handleDownloadItem,
            handleToggleSlider,
            isLocalSettings,
            showRestoreModal,
            selectFilterHandler,
            entity,
            hasDefaultTemplateDownload
        } = this.props;
        return (
            <React.Fragment>
                <div className={`dtl-sec`}>
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
                                toggleWildCardFilter={toggleWildCardFilter}
                                showViewModal={showViewModal}
                                isColunmVisibleChanged={isColunmVisibleChanged}
                                resetSort={resetSort}
                                tableParams={tableParams}
                                exportTableXl={this.props.exportTableXl}
                                tableLoading={this.props.tableLoading}
                                isExport={false}
                                entity={entity}
                                showWildCardFilter={showWildCardFilter}
                                hasDefaultTemplateDownload={hasDefaultTemplateDownload}
                            />
                            {showAddButton && (
                                <button className="add-btn" onClick={() => showAddForm()}>
                                    <i className="fas fa-plus" /> Add New Template
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
                        handleDownloadItem={handleDownloadItem}
                        isReportTemplate
                        handleToggleSlider={handleToggleSlider}
                        hasExport={hasExport}
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

export default withRouter(TemplatesMain);
