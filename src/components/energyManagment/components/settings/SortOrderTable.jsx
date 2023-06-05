import React, { Component } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reorderArray } from "../../../../config/utils";
import systemActions from "../../../system/actions";
import subSystemActions from "../../../subsystem/actions";
import projectActions from "../../actions";
import Loader from "../../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";
import _ from "lodash";

import sortIcon from "../../../../assets/img/icon-sort-order.svg";
import ReactTooltip from "react-tooltip";

const itemStyle = {
    padding: "16px",
    margin: "0 0 8px 0",
    background: "#e5ecef",
    cursor: "move",
    width: 250
};
class SortOrderTable extends Component {
    state = {
        isUpdating: false,
        itemList: [],
        initialList: [],
        params: {
            limit: 100,
            offset: 0
        },
        alertMessage: "",
        showConfirmModal: false
    };

    componentDidMount = async () => {
        const {
            match: {
                params: { id }
            },
            entity
        } = this.props;
        const { params } = this.state;
        let itemList = [];
        if (entity === "systems") {
            params.trade_id = this.props.match.params.subId;
            await this.props.getSystemSettingsData(params, id);
            itemList = this.props.systemReducer.getSystemSettingsDataResponse?.systems || [];
        } else if (entity === "sub_systems") {
            params.system_id = this.props.match.params.subId;
            await this.props.getSubsystemSettingsData(params, id);
            itemList = this.props.subsystemReducer.getSubsystemSettingsDataResponse?.sub_systems || [];
        }
        this.setState({ itemList, initialList: itemList });
    };

    updateSortOrder = async () => {
        this.setState({ isUpdating: true });
        const {
            match: {
                params: { id }
            },
            entity
        } = this.props;
        const { itemList } = this.state;
        let order_details = [];
        itemList.map((item, idx) => {
            order_details.push({ id: item.id, order: idx });
        });
        await this.props.updateDisplayOrder(entity, id, { order_details });
        const { success, message, error } = this.props.projectReducer.updateDisplayOrder;
        if (success) {
            this.setState(
                {
                    initialList: this.state.itemList,
                    isUpdating: false,
                    alertMessage: message
                },
                () => {
                    this.showAlert();
                }
            );
        } else {
            this.setState(
                {
                    isUpdating: false,
                    alertMessage: error
                },
                () => {
                    this.showAlert();
                }
            );
        }
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };
    onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        const itemList = reorderArray(this.state.itemList, result.source.index, result.destination.index);
        this.setState({
            itemList
        });
    };

    isDirty = () => !_.isEqual(this.state.initialList, this.state.itemList);

    onDiscardChanges = () => {
        this.setState({ itemList: this.state.initialList });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to discard changes?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => {
                            this.setState({ showConfirmModal: false });
                            this.onDiscardChanges();
                        }}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    getItemStyle = (isDragging, draggableStyle) => ({
        display: isDragging ? "table" : "",
        // styles we need to apply on draggables
        ...draggableStyle
    });
    getTdStyle = (isDragging, draggableStyle) => ({
        width: isDragging ? "123px" : ""
    });

    render() {
        const { itemList, isUpdating } = this.state;
        const btnDisabled = !this.isDirty();
        return (
            <LoadingOverlay active={false} spinner={<Loader />} fadeSpeed={10}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className={`table-section table-scroll overflow-hght sort-order`}>
                        <table className="table table-common table-min-height">
                            <thead>
                                <tr>
                                    <th className="th-sl-no">Sl No.</th>
                                    <th>Name</th>
                                    <th className={`action th-act`}>Action</th>
                                </tr>
                            </thead>
                            <Droppable droppableId="droppable-2">
                                {(provided, snapshot) => (
                                    <tbody id="common-table-body" {...provided.droppableProps} ref={provided.innerRef}>
                                        {itemList.length ? (
                                            <>
                                                {itemList.map((item, idx) => (
                                                    <Draggable key={idx} draggableId={`draggable-${idx}`} index={idx}>
                                                        {(provided, snapshot) => (
                                                            <>
                                                                <tr
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    key={`tr-${idx}`}
                                                                    style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                                >
                                                                    <td
                                                                        className="text-center"
                                                                        style={this.getTdStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                                    >
                                                                        {idx + 1}
                                                                    </td>
                                                                    <td className={`overflow-txt`}>{item.name}</td>
                                                                    <td
                                                                        data-tip={`Move`}
                                                                        data-for={`table-row${item.id}`}
                                                                        className="text-center"
                                                                        style={this.getTdStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                                    >
                                                                        <img alt="" src={sortIcon} />
                                                                    </td>
                                                                </tr>
                                                                <ReactTooltip
                                                                    id={`table-row${item.id}`}
                                                                    effect="solid"
                                                                    place="bottom"
                                                                    delayShow={500}
                                                                    backgroundColor="#007bff"
                                                                />
                                                            </>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </>
                                        ) : (
                                            <tr className="text-center">
                                                <td className="noRecordsColumn" colSpan={3}>
                                                    No records found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                )}
                            </Droppable>
                        </table>
                    </div>
                    <div className="sort-btn">
                        <button
                            disabled={btnDisabled}
                            className={`btn btn-discard ${btnDisabled ? "cursor-diabled" : ""}`}
                            onClick={() => this.setState({ showConfirmModal: true })}
                        >
                            Discard Changes
                        </button>
                        <button
                            disabled={btnDisabled}
                            className={`btn btn-primary ${btnDisabled ? "cursor-diabled" : ""}`}
                            onClick={this.updateSortOrder}
                        >
                            Save
                            {isUpdating && <span className="spinner-border spinner-border-sm pl-2" role="status"></span>}
                        </button>
                    </div>
                    {this.renderConfirmationModal()}
                </DragDropContext>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { systemReducer, projectReducer, subsystemReducer } = state;
    return { systemReducer, projectReducer, subsystemReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...systemActions,
        ...projectActions,
        ...subSystemActions
    })(SortOrderTable)
);
