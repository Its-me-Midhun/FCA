import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import SmartChartExportsList from "./SmartChartExportsList";
import Properties from "../properties/index";
import { SMART_CHART_TAB_VIEWS } from "../constants";
import Documents from "./Documents";

const SmartChartMain = ({
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
    handleClickTab,
    viewSmartChartProperty,
    handleEditSmartChartProperty,
    handleExportSmartReport,
    updateFiltersForMasterFilter,
    isModalView = false,
    viewReports,
    toggleSelectDownloadTypeModal,
    ...props
}) => {
    useEffect(() => {
        let previousProperty = sessionStorage.getItem("selectedProperty") || null;
        if (section === "reports" && previousProperty && !isModalView) {
            viewSmartChartProperty(previousProperty);
            sessionStorage.removeItem("selectedProperty");
        }
    }, [section]);
    return (
        <React.Fragment>
            <div className={`dtl-sec col-md-12`}>
                <div className="tab-dtl region-mng smchart-exp">
                    {!isModalView ? (
                        <ul className={`tab-data`}>
                            {SMART_CHART_TAB_VIEWS.map((tabView, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer ${section === tabView.key ? "active" : ""}`}
                                    onClick={() => handleClickTab(tabView)}
                                >
                                    {tabView.label}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                    {section === "reporttemplates" && !isModalView ? (
                        <Properties
                            // viewSmartChartProperty={viewSmartChartProperty}
                            handleEditSmartChartProperty={handleEditSmartChartProperty}
                            handleExportSmartReport={handleExportSmartReport}
                            updateFiltersForMasterFilter={updateFiltersForMasterFilter}
                            savedParams={mFilters}
                            showSmartChartDataEditModal={showSmartChartDataEditModal}
                            viewReports={viewReports}
                        />
                    ) : section === "documents" && !isModalView ? (
                        <Documents
                            getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                            updateMfilterForSmartChartList={updateMfilterForSmartChartList}
                            updateFiltersForMasterFilter={updateFiltersForMasterFilter}
                            savedParams={mFilters}
                        />
                    ) : section === "images" && !isModalView ? (
                        <Documents
                            isImage
                            getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                            updateMfilterForSmartChartList={updateMfilterForSmartChartList}
                            updateFiltersForMasterFilter={updateFiltersForMasterFilter}
                            savedParams={mFilters}
                        />
                    ) : (
                        <SmartChartExportsList
                            getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                            masterFilterList={masterFilterList}
                            mFilters={mFilters}
                            updateMfilterForSmartChartList={updateMfilterForSmartChartList}
                            paginationParams={paginationParams}
                            handlePageClick={handlePageClick}
                            handlePerPageChange={handlePerPageChange}
                            tableData={tableData}
                            hasEdit={hasEdit}
                            showAddButton={showAddButton}
                            refreshTableData={refreshTableData}
                            handleGlobalSearch={handleGlobalSearch}
                            globalSearchKey={globalSearchKey}
                            hasExport={hasExport}
                            hasDelete={hasDelete}
                            resetAllFilters={resetAllFilters}
                            showSmartChartDataEditModal={showSmartChartDataEditModal}
                            regenerateSmartChart={regenerateSmartChart}
                            deleteSmartChartReport={deleteSmartChartReport}
                            handleDownloadItem={handleDownloadItem}
                            showWildCardFilter={showWildCardFilter}
                            showEditPage={showEditPage}
                            showInfoPage={showInfoPage}
                            updateSelectedRow={updateSelectedRow}
                            selectedRowId={selectedRowId}
                            updateWildCardFilter={updateWildCardFilter}
                            wildCardFilter={wildCardFilter}
                            handleHideColumn={handleHideColumn}
                            getListForCommonFilter={getListForCommonFilterSite}
                            updateCommonFilter={updateCommonFilter}
                            commonFilter={commonFilter}
                            updateTableSortFilters={updateTableSortFilters}
                            tableParams={tableParams}
                            permissions={permissions}
                            hasInfoPage={hasInfoPage}
                            hasActionColumn={hasActionColumn}
                            viewSmartChartProperty={viewSmartChartProperty}
                            handleEditSmartChartProperty={handleEditSmartChartProperty}
                            isModalView={isModalView}
                            toggleSelectDownloadTypeModal={toggleSelectDownloadTypeModal}
                        />
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default withRouter(SmartChartMain);
