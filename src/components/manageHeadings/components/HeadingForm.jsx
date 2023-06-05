import _ from "lodash";
import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { v4 as uuid } from "uuid";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import headingActions from "../actions";
import { copy, ITEMS, move, reorder } from "./utils";
import PreviewModal from "./PreviewModal";
import { DraggableLine } from "./DraggableLine";

class HeadingForm extends Component {
    state = {
        lines: { [uuid()]: [] },
        isSubmitting: false,
        initialValues: {},
        showConfirmModal: false,
        headingData: {
            name: "",
            notes: ""
        },
        showPreviewModal: false,
        items: []
    };

    componentDidMount = () => {
        this.setInitialData();
    };

    setInitialData = async () => {
        await this.props.getHeadingDataById(this.props.match.params.id);
        const { headingDataByIdResponse } = this.props.manageHeadingReducer;

        if (headingDataByIdResponse.success) {
            let items = ITEMS && ITEMS?.filter(elem => elem?.allowed_export_types?.includes(headingDataByIdResponse.export_type));
            let prevData = JSON.parse(headingDataByIdResponse.display) || {};
            if (!Object.keys(prevData)?.length) {
                prevData = { [uuid()]: [] };
            }
            this.setState({
                lines: prevData,
                initialValues: _.cloneDeep(prevData),
                items,
                headingData: { name: headingDataByIdResponse.name, notes: headingDataByIdResponse.notes }
            });
        }
    };

    addList = e => {
        const { lines } = this.state;
        this.setState({ lines: { ...lines, [uuid()]: [] } });
    };

    addRow = e => {
        const { lines } = this.state;
        this.setState({
            lines: {
                ...lines,
                [uuid()]: [
                    {
                        id: uuid(),
                        content: "Row",
                        type: "row",
                        value: "{{{ROW}}}"
                    }
                ]
            }
        });
    };
    deleteLine = elem => {
        const { lines } = this.state;
        let temp = lines;
        temp = Object.keys(temp)
            .filter(key => key !== elem)
            .reduce((cur, key) => {
                return Object.assign(cur, { [key]: temp[key] });
            }, {});
        this.setState({ lines: temp });
    };

    deleteItem = (lineKey, index) => {
        const { lines } = this.state;
        this.setState({ lines: { ...lines, [lineKey]: lines[lineKey].filter((elem, idx) => idx !== index) } });
    };
    handlechange = e => {
        const { name, value } = e.target;
        this.setState({
            headingData: {
                ...this.state.headingData,
                [name]: value
            }
        });
    };

    handleChangeInput = (e, lineKey, colIndex) => {
        const { value } = e.target;
        const { lines } = this.state;
        let tempLine = lines[lineKey];
        lines[lineKey][colIndex].value = value;
        this.setState({ lines: { ...lines, [lineKey]: tempLine } });
    };
    onDragEnd = result => {
        const { source, destination } = result;
        // dropped outside the list
        console.log("============>", result);
        if (!destination) {
            return;
        }
        const { lines, items } = this.state;
        switch (source.droppableId) {
            case destination.droppableId:
                //************* */ to reorder the line itselt
                if (source.droppableId === "list") {
                    let lineArr = Object.keys(lines);
                    lineArr = reorder(lineArr, source.index, destination.index);
                    let orderedLines = {};
                    lineArr.forEach(elem => (orderedLines[elem] = lines[elem]));
                    this.setState({ lines: orderedLines });
                } else {
                    //******* */ to reorder the items in a line
                    this.setState({
                        lines: { ...lines, [destination.droppableId]: reorder(lines[source.droppableId], source.index, destination.index) }
                    });
                }
                break;
            case "ITEMS":
                this.setState({
                    lines: { ...lines, [destination.droppableId]: copy(items, lines[destination.droppableId], source, destination) }
                });
                break;
            default:
                // let line = move(lines[source.droppableId], lines[destination.droppableId], source, destination);
                // this.setState({ lines: { ...lines, line } });
                break;
        }
    };

    handleSubmit = async () => {
        const { headingData } = this.state;
        this.setState({ isSubmitting: true });
        const { lines } = this.state;
        const data = this.formatLines();
        let params = {
            properties: data,
            display: JSON.stringify(lines),
            ...headingData
        };
        await this.props.updateHeading(params, this.props.match.params.id);
        this.setState({ isSubmitting: false });
    };

    formatLines = () => {
        const { lines } = this.state;
        let formattedLines = [];
        let list = _.cloneDeep(lines);
        Object.keys(list).forEach(elem => {
            if (!list[elem].length) {
                list[elem] = [{ value: "{{{BLANK}}}" }];
            }
            formattedLines.push(list[elem].map(line => line.value).join(""));
        });
        return formattedLines;
    };

    splitArray = (array, splitValue) => {
        const splitArrays = [];
        let currentArray = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i] === splitValue) {
                splitArrays.push(currentArray);
                currentArray = [];
            } else {
                currentArray.push(array[i]);
            }
        }
        splitArrays.push(currentArray);
        return splitArrays;
    };

    renderPreview = () => {
        const { lines } = this.state;
        let result = [];
        let temp = Object.keys(lines).map(line => lines[line].map(li => li.sample || li.value).join(""));
        result = this.splitArray(temp, "{{{ROW}}}");
        return result;
    };

    cancelForm = () => {
        const { initialValues, lines } = this.state;
        if (_.isEqual(initialValues, lines)) {
            this.props.cancelForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };
    renderPreviewModal = () => {
        const { showPreviewModal } = this.state;
        if (!showPreviewModal) return null;
        return (
            <Portal
                body={<PreviewModal previewData={this.renderPreview} onCancel={() => this.setState({ showPreviewModal: false })} />}
                onCancel={() => this.setState({ showPreviewModal: false })}
            />
        );
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
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.clearForm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    clearForm = async () => {
        this.setState({ showConfirmModal: false });
        this.props.cancelForm();
    };
    render() {
        const { lines, isSubmitting, items, headingData } = this.state;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="dtl-sec col-md-12">
                    <div className="table-top-menu"></div>

                    <div className="edt-mng-dflex">
                        <div className="top-area">
                            <Droppable droppableId="ITEMS" isDropDisabled={true} type="item">
                                {(provided, snapshot) => (
                                    <div className="lft-area" ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                                        {items.map((elem, index) => (
                                            <Draggable key={elem.id} draggableId={elem.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <>
                                                        <div
                                                            className="item"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            isDragging={snapshot.isDragging}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <div className="item-txt">{elem.content}</div>
                                                        </div>
                                                        {snapshot.isDragging && (
                                                            <div className="item">
                                                                <div className="item-txt">{elem.content}</div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </Draggable>
                                        ))}
                                    </div>
                                )}
                            </Droppable>
                            <div className="right-area">
                                <div class="form-top-area">
                                    <div class="input-txt col-md-6">
                                        <div className="codeOtr">
                                            <label>Name</label>
                                            <input
                                                autoComplete={"nope"}
                                                type="text"
                                                className="form-control cursor-diabled"
                                                value={headingData.name}
                                                name="name"
                                                disabled="true"
                                                placeholder=" Name"
                                            />
                                        </div>
                                    </div>
                                    <div class="input-txt col-md-6">
                                        <div className="codeOtr">
                                            <label>Notes</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                autoComplete={"nope"}
                                                value={headingData.notes}
                                                onChange={this.handlechange}
                                                name="notes"
                                                placeholder="Notes"
                                            />
                                        </div>
                                    </div>
                                </div>{" "}
                                <div class="main-area">
                                    <div class="rgt btn-area">
                                        <button className="btn btn-add mr-2" onClick={() => this.addRow()}>
                                            Add Row Break
                                        </button>
                                        <button className="btn btn-add" onClick={() => this.addList()}>
                                            Add Line
                                        </button>
                                    </div>
                                    <Droppable droppableId={"list"}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef}>
                                                {Object.keys(lines).map((list, i) => (
                                                    <DraggableLine
                                                        lines={lines}
                                                        list={list}
                                                        index={i}
                                                        deleteItem={this.deleteItem}
                                                        deleteLine={this.deleteLine}
                                                        handleChangeInput={this.handleChangeInput}
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        </div>
                        <div className="form-fot">
                            <button className="btn btn-cancel btn-preview" onClick={() => this.setState({ showPreviewModal: true })}>
                                preview
                            </button>
                            <button className="btn btn-cancel" onClick={() => this.cancelForm()}>
                                Cancel
                            </button>
                            <button onClick={() => this.handleSubmit()} className="btn btn-submit">
                                Submit {isSubmitting && <span className="spinner-border spinner-border-sm pl-2" role="status"></span>}
                            </button>
                        </div>
                    </div>
                </div>
                {this.renderPreviewModal()}
                {this.renderConfirmationModal()}
            </DragDropContext>
        );
    }
}
const mapStateToProps = state => {
    const { manageHeadingReducer } = state;
    return { manageHeadingReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...headingActions
    })(HeadingForm)
);
