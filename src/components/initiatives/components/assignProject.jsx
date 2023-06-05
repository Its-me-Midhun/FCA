
import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import ModalHeader from "../../common/components/modalHeader";

import buildingTypeActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import {
    addToBreadCrumpData,
    popBreadCrumpData,
    findPrevPathFromBreadCrump
} from "../../../config/utils";
import InitiativeMain from "./InitiativeMain"
import LoadingOverlay from "react-loading-overlay";



class From extends Component {
    state = {
        // isLoading: false
    }

    componentDidMount = async () => {

    };



    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            tableData,
            infoTabsData,
            selectedRowId,
            summaryRowData,
            permissions,
            logPermission,
            selectedInitiative,
            basicDetails,
            isHistory,
            infosubTabsData,
            logData,
            historyPaginationParams,
            historyParams,
            globalSearchKey,
            initiativeIds,
            isLoading
        } = this.props;
        let countRecommendation = localStorage.getItem('recommendationCount') ? localStorage.getItem('recommendationCount') :
            this.props.recomentationIds.length

        return (
            <React.Fragment>
                {/* <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}> */}
                <div
                    className="modal assign-init-modal"
                    style={{ display: "block" }}
                    id="modalId"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog assignModal" role="document">
                        <div className="modal-content">
                            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                                {/* <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Assign Initiative
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => this.props.onCancel()}
                                >
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div> */}
                                <ModalHeader title="Assign Initiative"
                                    onCancel={this.props.onCancel}
                                    modalClass="assignModal" />

                                <form autoComplete="nope">
                                    <div className="modal-body ">
                                        <div className="form-group">
                                            <div className="formInp">
                                                <label>Recommendations selected : {countRecommendation}</label>
                                                <div className="dashboard-outer">
                                                    <div className="outer-detail">
                                                        <div className="right-panel-section">
                                                            <div className="dtl-sec">
                                                                <div className="dtl-sec system-building col-md-12 ">
                                                                    <div className="tab-dtl region-mng"  >
                                                                        <div className="tab-active recomdn-table bg-grey-table">
                                                                            <InitiativeMain
                                                                                showWildCardFilter={showWildCardFilter}
                                                                                paginationParams={paginationParams}
                                                                                showViewModal={this.props.showViewModal}
                                                                                tableData={tableData}
                                                                                handleGlobalSearch={this.props.handleGlobalSearch}
                                                                                globalSearchKey={globalSearchKey}
                                                                                updateSelectedRow={this.props.updateSelectedRow}
                                                                                selectedRowId={selectedRowId}
                                                                                toggleWildCardFilter={this.props.toggleWildCardFilter}
                                                                                handleDeleteInitiatives={this.props.handleDeleteInitiatives}
                                                                                showEditPage={this.props.showEditPage}
                                                                                handlePerPageChange={this.props.handlePerPageChange}
                                                                                handlePageClick={this.props.handlePageClick}
                                                                                showAddForm={this.props.showAddForm}
                                                                                showInfoPage={this.props.showInfoPage}
                                                                                updateWildCardFilter={this.props.updateWildCardFilter}
                                                                                wildCardFilter={this.props.wildCardFilter}
                                                                                handleHideColumn={this.props.handleHideColumn}
                                                                                getListForCommonFilterRecommendation={this.props.getListForCommonFilterRecommendation}
                                                                                updateCommonFilter={this.props.updateCommonFilter}
                                                                                commonFilter={this.props.commonFilter}
                                                                                isChartView={this.props.isChartView}
                                                                                resetAllFilters={this.props.resetAllFilters}
                                                                                updateTableSortFilters={this.props.updateTableSortFilters}
                                                                                resetSort={this.props.resetSort}
                                                                                tableParams={this.props.tableParams}
                                                                                isChartView={this.props.isChartView}
                                                                                isBuildingLocked={this.props.isBuildingLocked}
                                                                                handleCutPaste={this.props.handleCutPaste}
                                                                                summaryRowData={summaryRowData}
                                                                                exportTableXl={this.props.exportTableXl}
                                                                                tableLoading={this.props.tableLoading}
                                                                                showRestoreModal={this.props.showRestoreModal}
                                                                                selectFilterHandler={this.props.selectFilterHandler}
                                                                                selectedDropdown={this.props.selectedDropdown}
                                                                                permissions={permissions}
                                                                                logPermission={logPermission}
                                                                                handleSelect={this.props.handleSelect}
                                                                                handleSelectAll={this.props.handleSelectAll}
                                                                                initiativeIds={this.props.initiativeIds}
                                                                                isAssignProject={true}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-12 p-0 text-right btnOtr">
                                                {this.props.submitAssign ? (
                                                    <button type="button" className="btn btn-primary btnRgion col-md-2">
                                                        <div className="button-loader d-flex justify-content-center align-items-center">
                                                            <div className="spinner-border text-white" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ) :
                                                    <button
                                                        disabled={!this.props.initiativeIds.length}
                                                        type="button"
                                                        onClick={() => this.props.handleAssign()}
                                                        className="btn btn-primary btnRgion col-md-2"
                                                    >
                                                        Assign
                                                </button>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </LoadingOverlay>
                        </div>

                    </div>

                </div>
                {/* </LoadingOverlay> */}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { buildingTypeReducer, buildingReducer } = state;
    return { buildingTypeReducer, buildingReducer };
};

export default withRouter(
    connect(mapStateToProps, { ...buildingTypeActions, ...buildingActions })(From)
);
