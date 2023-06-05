import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../Loader";

class LogForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLog: "",
            sortOrder: null,
            flag: false
        }
    }

    sortTable = async () => {
        this.setState({
            sortOrder: !this.state.flag,
            flag: !this.state.flag
        })
        await this.props.sortCspTable();
    }

    render() {
        const { logs } = this.props;
        const { sortOrder } = this.state;
        return (<>
            <React.Fragment>
                <div
                    class="modal modal-region logs-modal"
                    style={{ display: "block" }}
                    id="modalId"
                    tabIndex="-1"
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
                                            <table class="table table-common">
                                                <thead>
                                                    <tr>
                                                        <th class="log-th">All Logs</th>
                                                        <th className="cursor-hand"
                                                            onClick={() => logs && logs.length && this.props.sortCspTable && this.sortTable()}
                                                        > Date
                                                        {logs && logs.length ?
                                                                sortOrder === true ?
                                                                    <i className={`fas fa-long-arrow-alt-down table-param-rep text-danger`}></i>
                                                                    : sortOrder === false ?
                                                                        <i className={`fas fa-long-arrow-alt-up table-param-rep text-danger`}></i>
                                                                        : null
                                                                : null
                                                            }
                                                        </th>
                                                        <th class="action-th">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        logs && logs.length ?
                                                            logs.map(log =>
                                                                <>
                                                                    <tr>
                                                                        <td>
                                                                            <b> {log.user}</b> changed {<b>percentage</b>} from <b>{log && log.changeset && log.changeset.percentage && log.changeset.percentage[0] || ""}</b> to <b>{log && log.changeset && log.changeset.percentage && log.changeset.percentage[1] || ""}</b>
                                                                        </td>
                                                                        <td>
                                                                            {log.created_at}
                                                                        </td>
                                                                        <td>
                                                                            <i className="fas fa-history cursor-hand"
                                                                                onClick={() => {
                                                                                    this.props.restoreAnnualEfci(log.id, log.changeset);
                                                                                }}></i>
                                                                            <span class="all-mid">
                                                                                <i className="fas fa-trash cursor-hand"
                                                                                    onClick={() =>
                                                                                        this.props.deleteLog(log.id)
                                                                                    }></i>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                </>)
                                                            :
                                                            <td className="wid-log" colSpan={3}>No logs found</td>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LoadingOverlay>
                </div>
            </React.Fragment>
        </>);
    }
}
export default LogForm;
