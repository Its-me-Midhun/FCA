import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import ReactTooltip from "react-tooltip";


import buildingActions from "../actions";
import Table from "../../common/components/Table";
import TableTopIcons from "../../common/components/TableTopIcons";
import GlobalSearch from "../../common/components/GlobalSearch";

class BuildingMain extends Component {

    componentDidMount=async()=>{
        const projectId=this.props.match.params.id;
        await this.props.getAllImportHistoryLogs(projectId);
    }
    render() {
        const {
            showImportWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewImportModal,
            tableData,
            handleGlobalSearchHistory,
            toggleImportWildCardFilter,
            showAddForm,
            showEditPage,
            updateCurrentViewAllUsers,
            handleDeleteHistory,
            handlePerPageChange,
            handlePageClick,
            showInfoPage,
            updateSelectedRow,
            selectedRowId,
            globalSearchKeyHistory,
            updateImportWildCardFilter,
            wildCardFilter,
            handleHideColumn,
            getListForCommonFilterBuilding,
            updateCommonFilter,
            commonFilter,
            showWildCardFilter,
            resetAllImportFilters,
            updateImportTableSortFilters,
            resetImportSort,
            tableParams,
            summaryRowData,
            importHistoryTableData,
            importHistoryParams,
            handleGlobalSearchimportHistory,
            globalSearchKeyimportHistory,
            handleDownloadItem,
            importhistoryPaginationParams,
            handlePerPageChangeImportHistory,
            handlePageClickImportHistory,
        } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="table-top-menu allign-right">
                        <div className="rgt">
                            <TableTopIcons
                                globalSearchKey={globalSearchKeyimportHistory}
                                handleGlobalSearch={handleGlobalSearchimportHistory}
                                resetAllFilters={resetAllImportFilters}
                                toggleWildCardFilter={toggleImportWildCardFilter}
                                showViewModal={showViewImportModal}
                                resetSort={resetImportSort}
                                tableParams={importHistoryParams}
                                exportTableXl={this.props.exportImportTableXl}
                                isExport={true}
                                isIconsShow={false}
                                tableLoading={this.props.tableLoading}
                                showWildCardFilter={showWildCardFilter}
                            />
                            {/* <GlobalSearch handleGlobalSearch={handleGlobalSearchHistory} globalSearchKey={globalSearchKeyHistory} /> */}
                        </div>
                    </div>
                    <div className="table-section build-table">
                      <Table
                            updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                            tableData={importHistoryTableData}
                            currentViewAllUsers={currentViewAllUsers}
                            handleDeleteItem={handleDeleteHistory}
                            showWildCardFilter={showImportWildCardFilter}
                            showEditPage={showEditPage}
                            showInfoPage={showInfoPage}
                            updateSelectedRow={updateSelectedRow}
                            selectedRowId={selectedRowId}
                            updateWildCardFilter={updateImportWildCardFilter}
                            wildCardFilter={wildCardFilter}
                            handleHideColumn={handleHideColumn}
                            getListForCommonFilter={getListForCommonFilterBuilding}
                            updateCommonFilter={updateCommonFilter}
                            commonFilter={commonFilter}
                            updateTableSortFilters={updateImportTableSortFilters}
                            tableParams={importHistoryParams}
                            summaryRowData={summaryRowData}
                            isImportHistory={true}
                            hasInfoPage={false}
                            handleDownloadItem={handleDownloadItem}
                        />
                        {importHistoryTableData.data && importHistoryTableData.data.length ? (
                            <div className="table-bottom d-flex">
                                <div className="count d-flex col-md-6">
                                    <div className="count-dtl">
                                        Total Count: <span>{importhistoryPaginationParams.totalCount}</span>
                                    </div>
                                    <div className="col-md-2 pr-2 selbx">
                                        <select className="form-control" value={importhistoryPaginationParams.perPage} onChange={e => handlePerPageChangeImportHistory(e)}>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                            <option value="40">40</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pagination-sec col-md-6">
                                    <ReactPaginate
                                         previousLabel={<span
                                            data-place="top"
                                            data-effect="solid"
                                            data-tip={`Previous`}
                                            data-background-color="#007bff"
                                        >&lt;</span>}
                                        nextLabel={<span
                                            data-place="top"
                                            data-effect="solid"
                                            data-tip={`Next`}
                                            data-background-color="#007bff"
                                        >&gt;</span>}
                                        breakLabel={"..."}
                                        breakClassName={"break-me"}
                                        pageCount={importhistoryPaginationParams.totalPages}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageClickImportHistory}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"}
                                        activeLinkClassName={"active"}
                                        forcePage={importhistoryPaginationParams.currentPage}
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
    const { buildingReducer } = state;
    return { buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...buildingActions })(BuildingMain));
