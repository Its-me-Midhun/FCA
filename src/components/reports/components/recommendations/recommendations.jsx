import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import ReactTooltip from "react-tooltip";
import LoadingOverlay from "react-loading-overlay";

import Table from "../../../common/components/Table";
import recommendationsActions from "../../actions";
import TableTopIcons from "../../../common/components/TableTopIcons";
import Loader from "../../../common/components/Loader";

class RecommendationsMain extends Component {
    state = {
        idArray: [],
        selectedAll: false
    };

    resetSelect = async () => {
        await this.setState({
            selectedAll: false
        });
        localStorage.setItem("selectAllClicked", false);
    };

    assignContent = async () => {
        await this.props.assignProjectModal();
    };

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
            handleDeleteRecommendations,
            showEditPage,
            handlePerPageChange,
            handlePageClick,
            showAddForm,
            match: {
                params: { section, id }
            },
            showInfoPage,
            updateSelectedRow,
            selectedRowId,
            globalSearchKey,
            updateWildCardFilter,
            wildCardFilter,
            handleHideColumn,
            getListForCommonFilterRecommendation,
            updateCommonFilter,
            commonFilter,
            resetAllFilters,
            isColunmVisibleChanged,
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
            assignProject,
            selectFilterHandlerInitiative,
            selectedDropdownInitiaiveFirst,
            priorityElementsData = []
        } = this.props;
        let selectAll = localStorage.getItem("selectAll") ? JSON.parse(localStorage.getItem("selectAll")) : false;
        let selectAllClicked = localStorage.getItem("selectAllClicked") ? JSON.parse(localStorage.getItem("selectAllClicked")) : false;
        let recommendationIdCount = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];
        return (
            <LoadingOverlay active={this.props.isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div className={`${section !== "regioninfo" ? "dtl-sec" : ""} col-md-12`}>
                    <div className="table-top-menu allign-right">
                        <div className="lft">
                            {section !== "initiativeInfo" ? (
                                <select
                                    className={
                                        this.props.selectedDropdown == "active" && section !== "initiativeInfo"
                                            ? "form-control cstm-active"
                                            : "form-control"
                                    }
                                    value={this.props.selectedDropdown}
                                    onChange={e => selectFilterHandler(e)}
                                >
                                    <option value="all" className={"cstm-option"}>
                                        All
                                    </option>

                                    <option className={"cstm-option"} value="active">
                                        Active
                                    </option>
                                    <option className={"cstm-option"} value="on_hold">
                                        On hold
                                    </option>
                                    <option className={"cstm-option"} value="completed">
                                        Completed
                                    </option>
                                    <option value="deleted" className={"cstm-option"}>
                                        Deleted
                                    </option>
                                    <option className={"cstm-option"} value="locked">
                                        Locked
                                    </option>
                                    <option className={"cstm-option"} value="unlocked">
                                        Unlocked
                                    </option>
                                </select>
                            ) : (
                                <select
                                    className={
                                        this.props.selectedDropdownInitiaive == "active" && section !== "initiativeInfo"
                                            ? "form-control cstm-active"
                                            : "form-control"
                                    }
                                    value={this.props.selectedDropdownInitiaive}
                                    onChange={e => selectFilterHandlerInitiative(e)}
                                >
                                    <option value="all" className={"cstm-option"}>
                                        All
                                    </option>
                                    <option className={"cstm-option"} value="assigned">
                                        Assigned
                                    </option>
                                    <option className={"cstm-option"} value="unassigned">
                                        Unassigned
                                    </option>
                                </select>
                            )}
                        </div>
                        {section == "initiativeInfo" ? (
                            <div className="lft pl-2">
                                <select
                                    className={this.props.selectedDropdown == "active" ? "form-control cstm-active" : "form-control"}
                                    value={this.props.selectedDropdown}
                                    onChange={e => selectFilterHandlerInitiative(e)}
                                >
                                    <option className={"cstm-option"} value="allInitiative">
                                        All
                                    </option>
                                    <option className={"cstm-option"} value="active">
                                        Active
                                    </option>
                                    <option className={"cstm-option"} value="on_hold">
                                        On hold
                                    </option>
                                    <option className={"cstm-option"} value="completed">
                                        Completed
                                    </option>
                                    <option value="deleted" className={"cstm-option"}>
                                        Deleted
                                    </option>
                                    <option className={"cstm-option"} value="locked">
                                        Locked
                                    </option>
                                    <option className={"cstm-option"} value="unlocked">
                                        Unlocked
                                    </option>
                                </select>
                            </div>
                        ) : null}
                        {selectAll ? (
                            <div className={"count-dtl pl-3 cursor-pointer slctall mt-2"}>
                                <label className="container-check">
                                    Select all {paginationParams.totalCount} recommendation
                                    <input
                                        type="checkbox"
                                        checked={this.state.selectedAll}
                                        onClick={e => {
                                            if (e.target.checked) {
                                                this.setState({
                                                    selectedAll: true
                                                });
                                            } else {
                                                this.setState({
                                                    selectedAll: false
                                                });
                                            }
                                        }}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        ) : null}

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
                                isExport={permissions && permissions.export == false ? false : true}
                                exportTableXl={this.props.exportTableXl}
                                tableLoading={this.props.tableLoading}
                                selectFilterHandler={selectFilterHandler}
                                isSelectFilter={true}
                                showWildCardFilter={showWildCardFilter}
                            />
                            {/* {!this.props.isChartView && !isBuildingLocked ? (
                                permissions && permissions.create == false ? ("") : (section !== "initiativeInfo" ? <button
                                    className="add-btn"
                                    onClick={() => showAddForm()}>
                                    <i className="fas fa-plus" /> Add New Recommendation
                                </button> : <button
                                        className={!this.props.enableButton ? "add-btn mr-2 disabled-btn" : "add-btn mr-2"}
                                        disabled={!this.props.enableButton}
                                        onClick={() => this.assignContent()}>
                                        <i className="fas fa-plus" /> Assign Initiative
                                </button>)
                            ) : null} */}
                            {this.props.selectedDropdown == "assigned" && this.props.match.params.tab == "recommendation" ? (
                                <button
                                    className={!this.props.enableButton ? "add-btn disabled-btn" : "add-btn"}
                                    disabled={!this.props.enableButton}
                                    onClick={() => this.props.unAassignContent()}
                                >
                                    <i className="fas fa-minus" /> Unassign Initiative
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <div className="recommendations-table cnt-area">
                        <Table
                            updateCurrentViewAllUsers={updateCurrentViewAllUsers}
                            tableData={tableData}
                            currentViewAllUsers={currentViewAllUsers}
                            handleDeleteItem={handleDeleteRecommendations}
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
                            hasActionColumn={true}
                            updateTableSortFilters={updateTableSortFilters}
                            tableParams={tableParams}
                            isBuildingLocked={this.props.isBuildingLocked}
                            handleCutPaste={handleCutPaste}
                            summaryRowData={summaryRowData}
                            showRestoreModal={showRestoreModal}
                            permissions={permissions}
                            handleSelect={this.props.handleSelect}
                            handleSelectAll={this.props.handleSelectAll}
                            recomentationIds={this.props.recomentationIds}
                            currentPage={paginationParams.currentPage}
                            selectedAllClicked={this.state.selectedAll}
                            resetSelect={this.resetSelect}
                            hasDelete={false}
                            // hasInfoPage={false}
                            priorityElementsData={priorityElementsData}
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
                                    {section == "initiativeInfo" ? (
                                        <div className="count-dtl">
                                            Selected recommendations:{" "}
                                            <span>{this.state.selectedAll ? paginationParams.totalCount : recommendationIdCount.length}</span>
                                        </div>
                                    ) : null}
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
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { siteReducer } = state;
    return { siteReducer };
};

export default withRouter(connect(mapStateToProps, { ...recommendationsActions })(RecommendationsMain));
