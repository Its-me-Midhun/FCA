import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";
import { withRouter } from "react-router-dom";

import Table from "../../common/components/Table";
import refreshIcon from "../../../assets/img/img-refresh.svg";
import SmartChartGridView from "./SmartChartGridView";
import MasterFilter from "./MasterFilterForSmartChartList";
import GlobalSearch from "../../common/components/GlobalSearch";

const SmartChartExportsList = ({
    history,
    smartChartTableData,
    showWildCardFilter,
    paginationParams,
    currentViewAllUsers,
    showViewModal,
    tableData,
    handleGlobalSearch,
    toggleWildCardFilter,
    updateCurrentViewAllUsers,
    handleDeleteSite,
    showEditPage,
    handlePerPageChange,
    handlePageClick,
    showAddForm,
    updateSelectedRow,
    selectedRowId,
    globalSearchKey,
    match: {
        params: { section }
    },
    showInfoPage,
    updateWildCardFilter,
    wildCardFilter,
    handleHideColumn,
    getListForCommonFilterSite,
    updateCommonFilter,
    commonFilter,
    resetAllFilters,
    isColunmVisibleChanged,
    resetAll,
    updateTableSortFilters,
    resetSort,
    tableParams,
    exportSiteTable,
    permissions,
    showAddButton,
    hasExport,
    hasEdit,
    hasDelete,
    hasInfoPage,
    entity,
    hasActionColumn,
    handleDownloadItem,
    refreshTableData,
    deleteSmartChartReport,
    regenerateSmartChart,
    showSmartChartDataEditModal,
    getSmartChartMasterFilterDropDown,
    masterFilterList,
    mFilters,
    updateMfilterForSmartChartList,
    viewSmartChartProperty,
    isModalView = false,
    toggleSelectDownloadTypeModal,
    ...props
}) => {
    const [view, setView] = useState("grid");

    const handleClickView = (e, viewKey) => {
        e.preventDefault();
        setView(viewKey);
    };
    return (
        <>
            <div class="tab-active">
                <div className="table-top-menu allign-right align-items-center">
                    {!isModalView ? (
                        <MasterFilter
                            getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                            masterFilterList={masterFilterList?.smart_report_list_filter}
                            selectedFiltersList={mFilters}
                            updateMfilterForSmartChartList={updateMfilterForSmartChartList}
                            filterEntity={"smart_report_list_filter"}
                        />
                    ) : null}
                    <div className="rgt">
                        {!isModalView ? (
                            <button className="btn btn-edit refresh-btn mr-1" onClick={() => refreshTableData()}>
                                <span className="icon mr-1">
                                    <img src={refreshIcon} alt="" />
                                </span>
                                <span className="text">Refresh</span>
                            </button>
                        ) : null}
                        {!isModalView ? (
                            <GlobalSearch handleGlobalSearch={handleGlobalSearch} globalSearchKey={globalSearchKey} customClass={"search-sm-chrt"} />
                        ) : null}
                        {!isModalView ? (
                            <button
                                data-for="table-top-icons"
                                data-tip={`Reset Filters`}
                                class="btn btn-grid filtr-grid"
                                onClick={() => resetAllFilters()}
                            >
                                <img src="/img/refresh-dsh.svg" alt="" class="fil-ico" />
                            </button>
                        ) : null}
                        <button
                            className={`btn btn-grid ${view === "grid" ? "active-grid" : ""}`}
                            data-for="table-top-icons"
                            data-place="bottom"
                            data-tip={`Grid View`}
                            onClick={e => handleClickView(e, "grid")}
                        >
                            <img src="/img/grid-view.svg" alt="" />
                        </button>
                        <button
                            className={`btn btn-line ${view === "list" ? "active-grid" : ""}`}
                            data-for="table-top-icons"
                            data-tip={`Table View`}
                            onClick={e => handleClickView(e, "list")}
                        >
                            <img src="/img/options-lines.svg" alt="" />
                        </button>
                    </div>
                </div>
                {view === "list" ? (
                    <div className="table-section">
                        <Table
                            tableData={tableData}
                            handleDeleteItem={deleteSmartChartReport}
                            showWildCardFilter={showWildCardFilter}
                            showEditPage={showEditPage}
                            showInfoPage={showInfoPage}
                            updateSelectedRow={updateSelectedRow}
                            selectedRowId={selectedRowId}
                            globalSearchKey={globalSearchKey}
                            updateWildCardFilter={updateWildCardFilter}
                            wildCardFilter={wildCardFilter}
                            handleHideColumn={handleHideColumn}
                            getListForCommonFilter={getListForCommonFilterSite}
                            updateCommonFilter={updateCommonFilter}
                            commonFilter={commonFilter}
                            updateTableSortFilters={updateTableSortFilters}
                            tableParams={tableParams}
                            hasPadding={true}
                            permissions={permissions}
                            hasEdit={hasEdit && !isModalView}
                            hasDelete={hasDelete && !isModalView}
                            hasInfoPage={hasInfoPage}
                            hasActionColumn={false}
                            isReportTemplate={true}
                            hasExport={hasExport}
                            handleDownloadItem={handleDownloadItem}
                            hasSort={false}
                            hasTabActive={false}
                        />

                        {tableData.data && tableData.data.length && !isModalView ? (
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
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <>
                        <SmartChartGridView
                            gridData={tableData}
                            handleDownloadItem={handleDownloadItem}
                            deleteSmartChartReport={deleteSmartChartReport}
                            regenerateSmartChart={regenerateSmartChart}
                            hasDelete={hasDelete}
                            hasExport={hasExport}
                            hasRegenerate={showAddButton}
                            showSmartChartDataEditModal={showSmartChartDataEditModal}
                            hasEdit={hasEdit}
                            viewSmartChartProperty={viewSmartChartProperty}
                            isModalView={isModalView}
                            toggleSelectDownloadTypeModal={toggleSelectDownloadTypeModal}
                        />
                        {tableData.data && tableData.data.length && !isModalView ? (
                            <div className="table-bottom d-flex mt-3">
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
                                </div>
                            </div>
                        ) : null}
                    </>
                )}
                <ReactTooltip
                    id="table-top-icons"
                    effect="solid"
                    place="bottom"
                    backgroundColor="#007bff"
                    // className="rc-tooltip-custom-class"
                />
            </div>
        </>
    );
};
export default withRouter(SmartChartExportsList);
