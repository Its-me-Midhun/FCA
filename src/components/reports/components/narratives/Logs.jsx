import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";
import LogForm from "./LogForm";
import ViewOnlyNarrative from "./viewOnlyNarrative";
import Portal from "../../../common/components/Portal";
import HelperIcon from "../../../helper/components/HelperIcon";
export default class Logs extends Component {
    state = {
        narrativeView: false,
        params: {
            limit: 40,
            offset: 0,
            search: ""
        },
        paginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        logForm: {
            show: false,
            data: {}
        }
    };
    componentDidMount = () => {
        this.getAllLogs();
    };

    getAllLogs = async () => {
        const { params, paginationParams } = this.state;
        await this.props.getLogs(params);
        const { count } = this.props;
        if (count) {
            this.setState({
                paginationParams: {
                    ...paginationParams,
                    totalCount: count,
                    totalPages: Math.ceil(count / paginationParams.perPage)
                }
            });
        }
    };

    handleNarrativeView = data => {
        this.setState({ narrativeView: true, narratives: JSON.parse(data) });
    };

    handlePageClick = page => {
        const { params, paginationParams } = this.state;
        this.setState(
            {
                paginationParams: {
                    ...paginationParams,
                    currentPage: page.selected
                },
                params: {
                    ...params,
                    offset: page.selected + 1
                }
            },
            () => this.getAllLogs()
        );
    };
    handlePerPageChange = e => {
        const { params, paginationParams } = this.state;
        this.setState(
            {
                paginationParams: {
                    ...paginationParams,
                    perPage: e.target.value,
                    currentPage: 0
                },
                params: {
                    ...params,
                    offset: 0,
                    limit: e.target.value
                }
            },
            () => this.getAllLogs()
        );
    };
    handleClose = () => {
        if (this.state.narrativeView) {
            this.setState({ narrativeView: false });
        } else {
            this.props.toggleLogs();
        }
    };

    renderLogMessage = (event, user) => {
        let msg = "";
        switch (event) {
            case "delete":
                msg = `The narrative has been deleted by ${user}`;
                break;
            case "update":
                msg = `The narrative has been updated by ${user} `;
                break;
            case "complete":
                msg = `The narrative has been completed by ${user} `;
                break;
            default:
                msg = `The narrative has been updated by ${user} `;
        }
        return msg;
    };

    updateNote = async data => {
        await this.props.updateLogNote(data);
        this.getAllLogs();
    };

    renderFormModal = () => {
        const { logForm } = this.state;
        if (!logForm.show) return null;
        return (
            <Portal
                body={<LogForm onCancel={this.closeLogForm} updateNote={this.updateNote} logData={logForm.data} />}
                onCancel={this.closeLogForm}
            />
        );
    };
    closeLogForm = () => {
        this.setState({ logForm: { show: false, data: {} } });
    };
    render() {
        const { logData } = this.props;
        const { narratives, narrativeView, paginationParams, logForm } = this.state;
        return (
            <>
                {this.renderFormModal()}
                <div>
                    <div className="basic-dtl-otr">
                        <div className="dtl-sec col-md-12 log">
                            <HelperIcon isHistory={true} entity={"narratives"} additoinalClass={"is-narrative-view"} />
                            <div className="table-top-menu justify-content-between">
                                <div className="lft">
                                    <h2>Narrative Editing History</h2>
                                </div>
                                <div class="closee" onClick={() => this.handleClose()}>
                                    <span aria-hidden="true">×</span>
                                </div>
                            </div>
                            {narrativeView ? (
                                <ViewOnlyNarrative narratives={narratives} />
                            ) : (
                                <div className="tab-dtl region-mng">
                                    <div className="tab-active buildng-tb flex-wrap">
                                        <div className="table-section table-scroll build-table">
                                            <table className="table table-common">
                                                <thead>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <img src="/img/bell.svg" alt="" />
                                                        </th>
                                                        <th>All Logs</th>
                                                        <th className="notes">Notes</th>
                                                        <th className="date-fld">Date and Time</th>
                                                        <th className="type-dtl"> Action </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {logData?.length ? (
                                                        <>
                                                            {logData.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="text-center">
                                                                        <img src="/img/bell.svg" alt="" />
                                                                    </td>
                                                                    <td>{this.renderLogMessage(item.event, item.user)}</td>
                                                                    <td>{item.notes || "-"}</td>
                                                                    <td>
                                                                        <div className="date">
                                                                            <span>{item.created_at}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="type-dtl">
                                                                        <li className="dropdown dot-icn-arw">
                                                                            <a
                                                                                className="del"
                                                                                onClick={() =>
                                                                                    this.setState({
                                                                                        logForm: {
                                                                                            show: true,
                                                                                            data: { id: item.id, notes: item.notes || "" }
                                                                                        }
                                                                                    })
                                                                                }
                                                                                data-place="left"
                                                                                data-effect="solid"
                                                                                data-tip={`Edit Notes`}
                                                                            >
                                                                                <i className="fas fa-edit cursor-hand"></i>
                                                                            </a>
                                                                            {item &&
                                                                            item.changeset &&
                                                                            item.changeset.text_format &&
                                                                            item.changeset.text_format[1] ? (
                                                                                <a
                                                                                    className="del"
                                                                                    onClick={() =>
                                                                                        this.handleNarrativeView(item.changeset?.text_format[1])
                                                                                    }
                                                                                    data-place="right"
                                                                                    data-effect="solid"
                                                                                    data-tip={`View Version`}
                                                                                >
                                                                                    <i className="fas fa-eye cursor-hand"></i>
                                                                                </a>
                                                                            ) : null}
                                                                        </li>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <tr>
                                                            <td className="noRecordsColumn" style={{ textAlign: "center" }} colSpan={5}>
                                                                No records found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        {logData && logData.length ? (
                                            <div className="table-bottom d-flex">
                                                <div className="count d-flex col-md-6">
                                                    <div className="count-dtl">
                                                        Total Count: <span>{paginationParams.totalCount}</span>
                                                    </div>
                                                    <div className="col-md-2 pr-2 selbx">
                                                        <select
                                                            className="form-control"
                                                            value={paginationParams.perPage}
                                                            onChange={e => this.handlePerPageChange(e)}
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
                                                        pageCount={paginationParams.totalPages}
                                                        marginPagesDisplayed={2}
                                                        pageRangeDisplayed={5}
                                                        onPageChange={this.handlePageClick}
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
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
