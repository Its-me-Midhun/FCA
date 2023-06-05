import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { CompactPicker } from "react-color";
import LoadingOverlay from "react-loading-overlay";
import Loader from "./Loader";
import NumberFormat from "react-number-format";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";

class EFCILogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortOrder: null,
            flag: false
        };
    }
    sortTable = async () => {
        this.setState({
            sortOrder: !this.state.flag,
            flag: !this.state.flag
        });
        await this.props.sortFundingEfci();
    };

    setTotalProjectCost = data => {
        const { numberOfYears } = this.props;
        let value = 0;
        value = data * numberOfYears;
        return value;
    };

    render() {
        const { logs, numberOfYears, totalFunding, sortFundingEfci } = this.props;
        const { sortOrder } = this.state;
        return (
            <>
                <React.Fragment>
                    <div
                        class="modal modal-region logs-modal"
                        style={{ display: "block" }}
                        id="modalId"
                        tabindex="-1"
                        role="dialog"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <LoadingOverlay active={this.props.hasLoading} spinner={<Loader />} fadeSpeed={10}>
                            <div class="modal-dialog log-width" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">
                                            Logs
                                        </h5>
                                        <button
                                            type="button"
                                            class="close"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={() => this.props.onCancel()}
                                        >
                                            <span aria-hidden="true">
                                                <img src="/img/close.svg" alt="" />
                                            </span>
                                        </button>
                                    </div>
                                    <div class="modal-body region-otr build-type-mod">
                                        <div class="clr-list tab-clr">
                                            <div class="table-section">
                                                <div class="log-table">
                                                    <table class="table table-common">
                                                        <thead>
                                                            <tr>
                                                                <th class="log-th">All Logs</th>
                                                                <th
                                                                    className="cursor-hand"
                                                                    onClick={() =>
                                                                        logs && logs.length && this.props.sortFundingEfci && this.sortTable()
                                                                    }
                                                                >
                                                                    {" "}
                                                                    Date
                                                                    {logs && logs.length ? (
                                                                        sortOrder === true ? (
                                                                            <i
                                                                                className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}
                                                                            ></i>
                                                                        ) : sortOrder === false ? (
                                                                            <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                                                                        ) : null
                                                                    ) : null}
                                                                </th>
                                                                <th class="action-th">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {logs && logs.length ? (
                                                                logs.map(log => (
                                                                    <>
                                                                        <tr>
                                                                            <td>
                                                                                {totalFunding ? (
                                                                                    <>
                                                                                        <b> {log.user}</b> changed {<b>value</b>} from{" "}
                                                                                        <b>
                                                                                            {
                                                                                                <NumberFormat
                                                                                                    prefix={"$ "}
                                                                                                    displayType={"text"}
                                                                                                    thousandSeparator={true}
                                                                                                    value={
                                                                                                        this.setTotalProjectCost(
                                                                                                            log &&
                                                                                                                log.changeset &&
                                                                                                                log.changeset.value &&
                                                                                                                log.changeset.value[0]
                                                                                                        ) || 0
                                                                                                    }
                                                                                                />
                                                                                            }
                                                                                        </b>{" "}
                                                                                        to{" "}
                                                                                        <b>
                                                                                            {
                                                                                                <NumberFormat
                                                                                                    prefix={"$ "}
                                                                                                    displayType={"text"}
                                                                                                    thousandSeparator={true}
                                                                                                    value={
                                                                                                        this.setTotalProjectCost(
                                                                                                            log &&
                                                                                                                log.changeset &&
                                                                                                                log.changeset.value &&
                                                                                                                log.changeset.value[1]
                                                                                                        ) || 0
                                                                                                    }
                                                                                                />
                                                                                            }
                                                                                        </b>
                                                                                    </>
                                                                                ) : this.props.value === "value" ? (
                                                                                    <>
                                                                                        <b> {log.user}</b> changed {<b>value</b>} from{" "}
                                                                                        <b>
                                                                                            {
                                                                                                <NumberFormat
                                                                                                    displayType={"text"}
                                                                                                    thousandSeparator={true}
                                                                                                    value={
                                                                                                        (log &&
                                                                                                            log.changeset &&
                                                                                                            log.changeset.value &&
                                                                                                            log.changeset.value[0]) ||
                                                                                                        0
                                                                                                    }
                                                                                                />
                                                                                            }
                                                                                        </b>{" "}
                                                                                        to{" "}
                                                                                        <b>
                                                                                            {
                                                                                                <NumberFormat
                                                                                                    displayType={"text"}
                                                                                                    thousandSeparator={true}
                                                                                                    value={
                                                                                                        (log &&
                                                                                                            log.changeset &&
                                                                                                            log.changeset.value &&
                                                                                                            log.changeset.value[1]) ||
                                                                                                        0
                                                                                                    }
                                                                                                />
                                                                                            }
                                                                                        </b>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <b> {log.user}</b> changed {<b>value</b>} from{" "}
                                                                                        <b>
                                                                                            {
                                                                                                <NumberFormat
                                                                                                    displayType={"text"}
                                                                                                    prefix={"$ "}
                                                                                                    thousandSeparator={true}
                                                                                                    value={
                                                                                                        (log &&
                                                                                                            log.changeset &&
                                                                                                            log.changeset.value &&
                                                                                                            log.changeset.value[0]) ||
                                                                                                        0
                                                                                                    }
                                                                                                />
                                                                                            }
                                                                                        </b>{" "}
                                                                                        to{" "}
                                                                                        <b>
                                                                                            {
                                                                                                <NumberFormat
                                                                                                    displayType={"text"}
                                                                                                    prefix={"$ "}
                                                                                                    thousandSeparator={true}
                                                                                                    value={
                                                                                                        (log &&
                                                                                                            log.changeset &&
                                                                                                            log.changeset.value &&
                                                                                                            log.changeset.value[1]) ||
                                                                                                        0
                                                                                                    }
                                                                                                />
                                                                                            }
                                                                                        </b>
                                                                                    </>
                                                                                )}
                                                                            </td>
                                                                            <td>{log.created_at}</td>
                                                                            <td>
                                                                                <i
                                                                                    className="fas fa-history cursor-hand"
                                                                                    onClick={() => {
                                                                                        this.props.restoreAnnualEfci(log.id, log.changeset);
                                                                                    }}
                                                                                ></i>
                                                                                <span class="all-mid">
                                                                                    <i
                                                                                        className="fas fa-trash cursor-hand"
                                                                                        onClick={() => this.props.deleteLog(log.id)}
                                                                                    ></i>
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                ))
                                                            ) : (
                                                                <td className="wid-log" colSpan={3}>
                                                                    <div>No logs found</div>
                                                                </td>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {logs && logs.length ? (
                                                    <div className="table-bottom d-flex">
                                                        <div className="count d-flex col-md-6">
                                                            <div className="count-dtl">
                                                                Total Count: <span>{this.props.logCount}</span>
                                                            </div>
                                                            <div className="col-md-2 pr-2 selbx">
                                                                <select
                                                                    className="form-control"
                                                                    value={this.props.logPaginationParams.perPage}
                                                                    onChange={e => this.props.handlePerPageChangeLogs(e)}
                                                                >
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
                                                                previousLabel={
                                                                    <span
                                                                        data-place="top"
                                                                        data-effect="solid"
                                                                        data-tip={`Previous`}
                                                                        data-background-color="#007bff"
                                                                    >
                                                                        &lt;
                                                                    </span>
                                                                }
                                                                nextLabel={
                                                                    <span
                                                                        data-place="top"
                                                                        data-effect="solid"
                                                                        data-tip={`Next`}
                                                                        data-background-color="#007bff"
                                                                    >
                                                                        &gt;
                                                                    </span>
                                                                }
                                                                breakLabel={"..."}
                                                                breakClassName={"break-me"}
                                                                pageCount={this.props.logPaginationParams.totalPages}
                                                                marginPagesDisplayed={2}
                                                                pageRangeDisplayed={5}
                                                                onPageChange={this.props.handlePageClickLogs}
                                                                containerClassName={"pagination"}
                                                                subContainerClassName={"pages pagination"}
                                                                activeClassName={"active"}
                                                                activeLinkClassName={"active"}
                                                                forcePage={this.props.logPaginationParams.currentPage}
                                                            />
                                                            <ReactTooltip />
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LoadingOverlay>
                    </div>
                </React.Fragment>
            </>
        );
    }
}
export default EFCILogs;
