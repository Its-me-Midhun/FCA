import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Table from "../../../common/components/Table";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";

// import { tradesettingsTableData } from "../../../config/tableData";

class SystemSettings extends Component {
    state = {
        isloading: true
    };

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return null;
        }

        const {
            match: {
                params: { id: project_id }
            },
            systemSettingstableData,
            showAddModal,
            showEditPage,
            handleDeleteTrade,
            updateSelectedRow,
            selectedRowId,
            paginationParams,
            handlePerPageChange,
            handlePageClick,
            showInfoPage
        } = this.props;

        return (
            <React.Fragment>
                <div className="table-top-menu mt-2">
                    <div className="rgt" >
                        <button className="add-btn" onClick={() => showAddModal("System")}>
                            <i className="fas fa-plus" /> Add New System
                        </button>
                    </div>
                </div>
                <Table
                    tableData={systemSettingstableData}
                    showEditPage={showEditPage}
                    handleDeleteItem={handleDeleteTrade}
                    showInfoPage={showInfoPage}
                    updateSelectedRow={updateSelectedRow}
                    selectedRowId={selectedRowId}
                    hasColumnClose={false}
                    hasSort={false}
                />
                {systemSettingstableData.data && systemSettingstableData.data.length ? (
                            <div className="table-bottom d-flex">
                                <div className="count d-flex col-md-6">
                                    <div className="count-dtl">
                                        Total Count: <span>{paginationParams.totalCount}</span>
                                    </div>
                                    <div className="col-md-2 pr-2 selbx">
                                        <select
                                            className="form-control"
                                            value={paginationParams.perPage}
                                            onChange={e => handlePerPageChange(e)}
                                        >
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                            <option value="40">40</option>
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
            </React.Fragment>
        );
    }
}

export default withRouter(SystemSettings);
