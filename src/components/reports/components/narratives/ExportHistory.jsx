import moment from "moment";
import React, { Component } from "react";
import LogForm from "./LogForm";
import Portal from "../../../common/components/Portal";
import ReactTooltip from "react-tooltip";
export default class ExportHistory extends Component {
    state = {
        selectedTab: "",
        tabList: [],
        logForm: {
            show: false,
            data: {}
        }
    };
    componentDidMount = async () => {
        let tabList = [];
        if (this.props.currentSection === "SubSystem") {
            tabList = [
                { label: "Completed Report", key: "local_complete" },
                { label: "Exported Report", key: "partial" }
            ];
        } else {
            tabList = [
                { label: "Completed Report (Global)", key: "complete" },
                { label: "Completed Report (Local)", key: "local_complete" },
                { label: "Whole Report", key: "whole" },
                { label: "Partial Report", key: "partial" }
            ];
        }
        this.setState({ tabList, selectedTab: tabList[0].key });
        await this.getExportHistory();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevState.selectedTab !== this.state.selectedTab) {
            await this.getExportHistory();
        }
    };

    getExportHistory = async () => {
        await this.props.getExportHistory(this.state.selectedTab);
    };

    handleTabClick = tab => {
        this.setState({ selectedTab: tab });
    };

    updateNote = async data => {
        await this.props.updateExportHistoryNote(data);
        this.getExportHistory();
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
        const { logData, globalCompleted } = this.props;
        const { tabList, selectedTab } = this.state;
        return (
            <>
                {this.renderFormModal()}
                <div className="basic-dtl-otr export-history ">
                    <div className="dtl-sec col-md-12 ">
                        <div className="tab-dtl region-mng lockset log">
                            <div className="table-top-menu">
                                <div className="lft">
                                    <h2>Export History</h2>
                                    <div class="closee" onClick={() => this.props.toggleExportHistory()}>
                                        <span aria-hidden="true">×</span>
                                    </div>
                                </div>
                            </div>
                            <ul className={this.props.isTabClass ? "tab-data" : null}>
                                {tabList.map(tab => (
                                    <li
                                        className={`cursor-pointer ${selectedTab === tab.key ? "active" : ""}`}
                                        onClick={() => this.handleTabClick(tab.key)}
                                    >
                                        {tab.label}
                                        {!globalCompleted && tab.key === "complete" && (
                                            <>
                                                <img
                                                    src="/img/warning.svg"
                                                    data-tip="Latest report not generated"
                                                    data-for="narr-child-check1"
                                                    className="not-latest-icon"
                                                />
                                                <ReactTooltip id="narr-child-check1" effect="solid" backgroundColor="#1383D9" />
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="tab-active buildng-tb">
                                <div className="table-section table-scroll build-table">
                                    <table className="table table-common">
                                        <thead>
                                            <tr>
                                                <th className="img-sq-box">
                                                    <img src="/img/bell.svg" />
                                                </th>
                                                <th>User</th>
                                                <th>Notes</th>
                                                <th>Date and Time</th>
                                                <th className="type-dtl action-fl"> Action </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logData?.length ? (
                                                <>
                                                    {logData.map((item, i) => (
                                                        <tr key={i}>
                                                            <td className="text-center">
                                                                <img src="/img/bell.svg" />
                                                            </td>
                                                            <td>{item.created_user || "-"}</td>
                                                            <td>{item.notes || "-"}</td>
                                                            <td>
                                                                <div className="date">
                                                                    <span>{moment(item.created_at).format("MM-DD-YYYY h:mm A")}</span>
                                                                </div>
                                                            </td>
                                                            <td>
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
                                                                    >
                                                                        <i className="fas fa-edit cursor-hand" title={`Edit`}></i>
                                                                    </a>
                                                                    {item.doc_url && (
                                                                        <a className="del" href={item.doc_url} download={item.doc_url}>
                                                                            <i
                                                                                className="fas fa-solid fa-file-word cursor-hand"
                                                                                title={`Download Word`}
                                                                            ></i>
                                                                        </a>
                                                                    )}
                                                                    {item.pdf_url && (
                                                                        <a className="del" href={item.pdf_url} target="_blank">
                                                                            <i
                                                                                className="fas fa-solid fa-file-pdf cursor-hand"
                                                                                title={`Download PDF`}
                                                                            ></i>
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </>
                                            ) : (
                                                <tr>
                                                    <td className="noRecordsColumn" colSpan={5}>
                                                        No records found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
