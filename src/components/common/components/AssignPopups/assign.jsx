import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Highlighter from "react-highlight-words";
import _ from "lodash";

import Portal from "../Portal";
import ChangeConfirmationModal from "../ChangeConfirmationModal";

class assignTrade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            consultancy: null,
            assigned: [],
            inactive: [],
            initial_assigned: [],
            available: [],
            currentAssignments: [],
            item_ids: [],
            showConfirmation: false,
            availableSearchKey: "",
            inactiveSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignTradePopupDetails();
    };

    getAssignTradePopupDetails = async () => {
        const { availableItems, assignedItems } = this.props;
        let consultancy = {};
        let assigned = assignedItems || [];
        let available = availableItems || [];

        await this.setState({
            consultancy,
            assigned,
            available,
            initial_assigned: assigned.map(item => item.id),
            item_ids: assigned.map(item => item.id)
        });
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const { availableItems } = this.props;

        const { assigned } = this.state;
        let assignedActivityIds = assigned.map(item => item.id);
        let result = availableItems.filter(item => !assignedActivityIds.includes(item.id));

        if (availableSearchKey.trim().length) {
            result = result.filter(
                ({ name, trade = null, system = null }) =>
                    (name && name.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (trade && trade.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (system && system.toLowerCase().includes(availableSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            availableSearchKey,
            available: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const { assignedItems } = this.props;

        const { available } = this.state;
        let availableActivityIds = available.map(item => item.id);
        let result = assignedItems.filter(item => !availableActivityIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(
                ({ name, trade = null, system = null }) =>
                    (name && name.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (trade && trade.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (system && system.toLowerCase().includes(assignedSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned: result
        });
    };

    updateAsigned = async () => {
        const { initial_assigned, item_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned.sort(), item_ids.sort())) {
            onCancel();
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedsConfrim = async () => {
        const { onAssign } = this.props;
        const { initial_assigned, item_ids } = this.state;
        if (!_.isEqual(initial_assigned.sort(), item_ids.sort())) {
            this.togglShowConfirmation();
            onAssign(item_ids);
        }
        return true;
    };

    togglShowConfirmation = () => {
        const { showConfirmation } = this.state;
        this.setState({
            showConfirmation: !showConfirmation
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmation } = this.state;
        if (!showConfirmation) return null;

        return (
            <Portal
                body={
                    <ChangeConfirmationModal
                        onCancel={this.togglShowConfirmation}
                        onOk={this.onUpdateAssignedsConfrim}
                        heading={"Update Assignment?"}
                        paragraph={"Are you sure that you need to assign?"}
                    />
                }
                onCancel={this.togglShowConfirmation}
            />
        );
    };

    updateAssignedList = async (type, id) => {
        const { assigned, available } = this.state;
        let itemObj = {};
        let tempAssigned = assigned;
        let tempAvailable = available;
        let tempActivityIds = [];

        if (id === "all") {
            if (type === "add") {
                tempAvailable.map(item => tempAssigned.push(item));
                tempAvailable = [];
            } else {
                tempAssigned.map(item => tempAvailable.push(item));
                tempAssigned = [];
            }
        } else {
            if (type === "add") {
                itemObj = available.find(item => item.id === id);
                tempAssigned.push(itemObj);
                tempAvailable = tempAvailable.filter(item => item.id !== id);
            } else {
                itemObj = assigned.find(item => item.id === id);
                tempAvailable.push(itemObj);
                tempAssigned = tempAssigned.filter(item => item.id !== id);
            }
        }
        tempAssigned = _.uniqBy(tempAssigned, "id");
        tempAvailable = _.uniqBy(tempAvailable, "id");
        tempActivityIds = tempAssigned.map(item => item.id);

        await this.setState({
            assigned: tempAssigned,
            available: tempAvailable,
            item_ids: tempActivityIds
        });
    };

    cancelModal = () => {
        const { initial_assigned, item_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned.sort(), item_ids.sort())) {
            this.setState({ showCancelConfirmModal: true });
        } else {
            this.props.onCancel();
        }
    };

    renderCancelConfirmationModal = () => {
        const { showCancelConfirmModal } = this.state;
        if (!showCancelConfirmModal) return null;
        return (
            <Portal
                body={
                    <ChangeConfirmationModal
                        heading={"Do you want to clear and lose all changes?"}
                        paragraph={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onCancel={() => this.setState({ showCancelConfirmModal: false })}
                        onOk={this.cancelModal}
                    />
                }
                onCancel={() => this.setState({ showCancelConfirmModal: false })}
            />
        );
    };

    render() {
        const { activeTab, assigned, available, availableSearchKey, assignedSearchKey } = this.state;
        const { onCancel, assignTo = "", itemDetails, type } = this.props;
        return (
            <React.Fragment>
                <div className="modal assigned-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Assign {assignTo}
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h5>{itemDetails.name || "-"}</h5>
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem1">
                                        <h4>Available </h4>
                                        <div className="outer-avl-bind">
                                            <div className="sr-sec search-section">
                                                <div className="sr-out">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        onChange={e => this.searchInAvailable(e.target.value)}
                                                        placeholder="Search"
                                                        value={availableSearchKey}
                                                    />
                                                    <span
                                                        className="clear-btn"
                                                        onClick={() => (availableSearchKey.trim().length ? this.searchInAvailable("") : null)}
                                                    >
                                                        Clear
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="table-section">
                                                <table className="table table-bordered file-system-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="img-sq-box">
                                                                <i
                                                                    className="fas fa-arrows-alt-h"
                                                                    onClick={() => this.updateAssignedList("add", "all")}
                                                                ></i>
                                                            </th>
                                                            {type === "trade" ? (
                                                                <th className="sel-all">Trade</th>
                                                            ) : type === "system" ? (
                                                                <>
                                                                    <th className="sel-all">System</th>
                                                                    <th className="sel-all">Trade</th>
                                                                </>
                                                            ) : type === "subsystem" ? (
                                                                <>
                                                                    <th className="sel-all">Sub System</th>
                                                                    <th className="sel-all">System</th>
                                                                    <th className="sel-all">Trade</th>
                                                                </>
                                                            ) : type === "specialreport" ? (
                                                                <th className="sel-all">Special Report</th>
                                                            ) : type === "reportparagraph" ? (
                                                                <th className="sel-all">Report Paragraph</th>
                                                            ) : type === "childparagraph" ? (
                                                                <th className="sel-all">Child paragraph</th>
                                                            ) : null}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {available && available.length ? (
                                                            available.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <i
                                                                            className="fas fa-arrows-alt-h"
                                                                            onClick={() => this.updateAssignedList("add", item.id)}
                                                                        ></i>
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.name}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    {type === "system" ? (
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${availableSearchKey}`]}
                                                                                textToHighlight={item.trade || "-"}
                                                                                className="highlighter"
                                                                            />
                                                                        </td>
                                                                    ) : type === "subsystem" ? (
                                                                        <>
                                                                            <td>
                                                                                <Highlighter
                                                                                    searchWords={[`${availableSearchKey}`]}
                                                                                    textToHighlight={item.system || "-"}
                                                                                    className="highlighter"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Highlighter
                                                                                    searchWords={[`${availableSearchKey}`]}
                                                                                    textToHighlight={item.trade || "-"}
                                                                                    className="highlighter"
                                                                                />
                                                                            </td>
                                                                        </>
                                                                    ) : null}
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td
                                                                    colSpan={
                                                                        type === "trade" ||
                                                                        type === "specialreport" ||
                                                                        type === "reportparagraph" ||
                                                                        type === "childparagraph"
                                                                            ? 2
                                                                            : type === "system"
                                                                            ? 3
                                                                            : 4
                                                                    }
                                                                    className="text-center"
                                                                >
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {available ? available.length : 0}</div>
                                    </div>
                                    <div className="build-tem3">
                                        <h4>Assigned </h4>
                                        <div className="outer-avl-bind">
                                            <div className="sr-sec search-section">
                                                <div className="sr-out">
                                                    <input
                                                        type="text"
                                                        onChange={e => this.searchInAssigned(e.target.value)}
                                                        className="form-control"
                                                        placeholder="Search"
                                                        value={assignedSearchKey}
                                                    />
                                                    <span
                                                        className="clear-btn"
                                                        onClick={() => (assignedSearchKey.trim().length ? this.searchInAssigned("") : null)}
                                                    >
                                                        Clear
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="table-section">
                                                <table className="table table-bordered file-system-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="img-sq-box">
                                                                <i
                                                                    className="fas fa-arrows-alt-h"
                                                                    onClick={() => this.updateAssignedList("remove", "all")}
                                                                ></i>
                                                            </th>
                                                            {type === "trade" ? (
                                                                <th className="sel-all">Trade</th>
                                                            ) : type === "system" ? (
                                                                <>
                                                                    <th className="sel-all">System</th>
                                                                    <th className="sel-all">Trade</th>
                                                                </>
                                                            ) : type === "subsystem" ? (
                                                                <>
                                                                    <th className="sel-all">Sub System</th>
                                                                    <th className="sel-all">System</th>
                                                                    <th className="sel-all">Trade</th>
                                                                </>
                                                            ) : type === "specialreport" ? (
                                                                <th className="sel-all">Special Report</th>
                                                            ) : type === "reportparagraph" ? (
                                                                <th className="sel-all">Report Paragraph</th>
                                                            ) : type === "childparagraph" ? (
                                                                <th className="sel-all">Child paragraph</th>
                                                            ) : null}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {assigned && assigned.length ? (
                                                            assigned.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <i
                                                                            className="fas fa-arrows-alt-h"
                                                                            onClick={() => this.updateAssignedList("remove", item.id)}
                                                                        ></i>
                                                                    </td>
                                                                    <td className="title-tip title-tip-up" tooltip-content={item.name}>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.name}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    {type === "system" ? (
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${availableSearchKey}`]}
                                                                                textToHighlight={item.trade || "-"}
                                                                                className="highlighter"
                                                                            />
                                                                        </td>
                                                                    ) : type === "subsystem" ? (
                                                                        <>
                                                                            <td>
                                                                                <Highlighter
                                                                                    searchWords={[`${availableSearchKey}`]}
                                                                                    textToHighlight={item.system || "-"}
                                                                                    className="highlighter"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Highlighter
                                                                                    searchWords={[`${availableSearchKey}`]}
                                                                                    textToHighlight={item.trade || "-"}
                                                                                    className="highlighter"
                                                                                />
                                                                            </td>
                                                                        </>
                                                                    ) : null}
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td
                                                                    colSpan={
                                                                        type === "trade" ||
                                                                        type === "specialreport" ||
                                                                        type === "reportparagraph" ||
                                                                        type === "childparagraph"
                                                                            ? 2
                                                                            : type === "system"
                                                                            ? 3
                                                                            : 4
                                                                    }
                                                                    className="text-center"
                                                                >
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {assigned ? assigned.length : 0}</div>
                                    </div>
                                </div>

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                    <div className="btn-out-1 text-right">
                                        <button type="button" className="btn btn-primary btnRgion mr-1" onClick={() => this.updateAsigned()}>
                                            Update
                                        </button>
                                        <button type="button" className="btn btn-secondary btnClr" onClick={() => this.cancelModal()}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.renderConfirmationModal()}
                    {this.renderCancelConfirmationModal()}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(assignTrade);
