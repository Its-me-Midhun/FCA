import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import NumberFormat from "react-number-format";

import projectActions from "../../actions";
import Loader from "../../../common/components/Loader";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";

class RecommendationPriority extends Component {
    state = {
        isLoading: false,
        priorities: [],
        isSubmitted: false,
        initialData: [],
        removed_ids: [],
        showConfirmModal: false,
        confirmationType: "cancel",
        optionParam: {
            action: "",
            priorityIndex: "",
            optionIndex: ""
        }
    };

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        await this.props.getRecommendationPriorityData({ project_id: this.props.match.params.id });
        let priority_elements = this.props.projectReducer.priorityElementsData?.priority_elements || [];
        let updatedPriorityElementsData = this.setInitialPriorityElementsData(priority_elements);
        this.setState({
            initialData: _.cloneDeep(updatedPriorityElementsData),
            priorities: [...updatedPriorityElementsData],
            isLoading: false
        });
    };

    setInitialPriorityElementsData = priority_elements => {
        let updatedData = priority_elements.map(element => {
            element.deleted_options = [];
            element.options =
                (element.options &&
                    element.options.map(op => {
                        if (!op.hasOwnProperty("id")) {
                            op.id = "nil";
                        }
                        return op;
                    })) ||
                [];
            return element;
        });
        return updatedData;
    };

    handlePriorityData = (action, selectedPriority, selectedOption, field, value, optionKey) => {
        const { priorities, removed_ids } = this.state;
        let tempPriorities = [...priorities];
        let removedPriorities = [...removed_ids];
        switch (action) {
            case "addPriority":
                let newPriority = {
                    name: "",
                    display_name: "",
                    notes: "",
                    project_id: this.props.match.params.id,
                    recommendation_required: false,
                    options: [],
                    deleted_options: []
                };
                tempPriorities.push(newPriority);
                break;
            case "removePriority":
                if (tempPriorities[selectedPriority]?.id) {
                    removedPriorities.push(tempPriorities[selectedPriority].id);
                }

                tempPriorities = tempPriorities.filter((item, index) => index !== selectedPriority);

                break;
            case "addOption":
                tempPriorities = tempPriorities.map((priority, index) => {
                    if (index === selectedPriority) {
                        let newOption = {
                            id: "nil",
                            name: "",
                            value: ""
                        };
                        priority.options.push(newOption);
                    }
                    return priority;
                });
                break;
            case "removeOption":
                tempPriorities = tempPriorities.map((priority, index) => {
                    if (index === selectedPriority) {
                        let currentItem = priority.options.find((option, index) => index == selectedOption);
                        priority.deleted_options = [...new Set([...priority.deleted_options, currentItem.id])];
                        priority.options = priority.options.filter((option, index) => index !== selectedOption);
                    }
                    return priority;
                });
                break;
            case "updatePriority":
                tempPriorities = tempPriorities.map((priority, index) => {
                    if (index === selectedPriority) {
                        priority[field] = this.setPriorityData(field, value, priority.options, selectedOption, optionKey);
                    }
                    return priority;
                });
                break;
        }
        this.setState({
            priorities: tempPriorities,
            removed_ids: [...new Set(removedPriorities)]
        });
    };

    setPriorityData = (field, value, options = [], selectedOption, optionKey) => {
        switch (field) {
            case "recommendation_required":
                return !value;
            case "options":
                options = options.map((op, i) => {
                    if (selectedOption === i) {
                        op[optionKey] = optionKey === "name" ? value : parseInt(value);
                    }
                    return op;
                });
                return [...options];
            default:
                return value;
        }
    };

    geFinalPriorityElementData = () => {
        const { priorities } = this.state;
        let newPriorirtyElementData = priorities.map((data, index) => {
            return {
                name: "Priority Element " + (index + 1),
                index: index + 1,
                display_name: data.display_name,
                notes: data.notes,
                project_id: this.props.match.params.id,
                recommendation_required: data.recommendation_required,
                options: [
                    ...data.options.filter(o => o.name && o.name.trim().length && (o.value || o.value == 0) && o.value.toString().trim().length)
                ],
                deleted_options: data.deleted_options
            };
        });
        return newPriorirtyElementData;
    };

    addPriorities = async () => {
        let priorityElemets = this.geFinalPriorityElementData();
        await this.setState({ isLoading: true });
        await this.props.updateRecommendationPriority({ priority_elements: priorityElemets, removed_ids: this.state.removed_ids });
        await this.setState({ isLoading: false });
        if (this.props.projectReducer.updatePriorityElementsResponse && this.props.projectReducer.updatePriorityElementsResponse.error) {
            this.showAlert(this.props.projectReducer.updatePriorityElementsResponse.error);
        } else {
            this.setState({
                initialData: [...priorityElemets]
            });
            this.showAlert(this.props.projectReducer.updatePriorityElementsResponse.message);
        }
    };

    cancelPriorityData = () => {
        const { initialData, priorities } = this.state;
        if (!_.isEqual(initialData, priorities)) {
            this.setState({
                showConfirmModal: true,
                confirmationType: "cancel"
            });
        }
    };

    showAlert = message => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = message;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    onConfirmYesInModal = async () => {
        const {
            confirmationType,
            initialData,
            optionParam: { action, priorityIndex, optionIndex }
        } = this.state;
        if (confirmationType === "cancel") {
            this.setState({ priorities: initialData, removed_ids: [], showConfirmModal: false });
        } else {
            await this.setState({ showConfirmModal: false });
            this.handlePriorityData(action, priorityIndex, optionIndex);
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, confirmationType } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type={confirmationType}
                        heading={confirmationType === "cancel" ? "Do you want to clear and lose all changes?" : "Do you want to delete this item?"}
                        message={`This action cannot be reverted, are you sure that you need to ${confirmationType}?`}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => this.onConfirmYesInModal()}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    handleRemoveItem = async (action, priorityIndex, optionIndex, optionId = "") => {
        if (optionId && optionId !== "nil") {
            await this.setState({
                showConfirmModal: true,
                confirmationType: "delete",
                optionParam: {
                    action,
                    priorityIndex,
                    optionIndex
                }
            });
        } else {
            this.handlePriorityData(action, priorityIndex, optionIndex);
        }
    };

    render() {
        const { priorities, isSubmitted, isLoading, initialData } = this.state;
        return (
            <>
                <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                    <div class="table-top-menu allign-right">
                        <div class="rgt">
                            <button class="btn btn-add" onClick={() => this.handlePriorityData("addPriority")}>
                                <i class="fas fa-plus"></i>Add
                            </button>
                            <div class="view">
                                <div class="view-inner help-icon" data-tip="Help" data-for="table-top-icons" currentitem="false">
                                    <img src="/img/question-mark-icon.png" alt="" class="fil-ico" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-section miscellaneous-cnt-sec">
                        {priorities.map((priority, idx) => {
                            return (
                                <div class="col-sec">
                                    <div class="requre-recommod">
                                        <label class="container-check">
                                            Required in Recommendations
                                            <input
                                                type="checkbox"
                                                checked={priority.recommendation_required}
                                                onClick={() =>
                                                    this.handlePriorityData(
                                                        "updatePriority",
                                                        idx,
                                                        null,
                                                        "recommendation_required",
                                                        priority.recommendation_required
                                                    )
                                                }
                                            />
                                            <span class="checkmark"></span>
                                        </label>
                                        <button class="btn btn-delete" onClick={() => this.handleRemoveItem("removePriority", idx)}>
                                            <i class="far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                    <div class="form-group">
                                        <div class="formInp name">
                                            <label>Name</label>
                                            <input
                                                autocomplete="nope"
                                                type="text"
                                                className="form-control"
                                                placeholder="Name"
                                                value={"Priority Element " + (idx + 1)}
                                                readOnly="true"
                                            />
                                        </div>
                                        <div class="formInp">
                                            <label>Display Name</label>
                                            <input
                                                autocomplete="nope"
                                                type="text"
                                                class="form-control"
                                                placeholder="Display Name"
                                                value={priority.display_name}
                                                onChange={e => this.handlePriorityData("updatePriority", idx, null, "display_name", e.target.value)}
                                            />
                                            <label>Notes</label>
                                            <input
                                                autocomplete="nope"
                                                type="text"
                                                class="form-control"
                                                placeholder="Notes"
                                                value={priority.notes}
                                                onChange={e => this.handlePriorityData("updatePriority", idx, null, "notes", e.target.value)}
                                            />
                                            {priority.options.map((option, index) => {
                                                return (
                                                    <div class="input-area cm-area-sec">
                                                        <input
                                                            autocomplete="nope"
                                                            type="text"
                                                            className={`${
                                                                isSubmitted && !option.name.trim().length ? "error-border " : ""
                                                            }form-control`}
                                                            value={option.name}
                                                            placeholder={"option " + (index + 1)}
                                                            onChange={e =>
                                                                this.handlePriorityData(
                                                                    "updatePriority",
                                                                    idx,
                                                                    index,
                                                                    "options",
                                                                    e.target.value,
                                                                    "name"
                                                                )
                                                            }
                                                        />
                                                        <NumberFormat
                                                            autoComplete={"nope"}
                                                            className="form-control"
                                                            placeholder={"value " + (index + 1)}
                                                            value={option.value}
                                                            displayType={"input"}
                                                            allowNegative={false}
                                                            onValueChange={values => {
                                                                const { formattedValue } = values;
                                                                this.handlePriorityData(
                                                                    "updatePriority",
                                                                    idx,
                                                                    index,
                                                                    "options",
                                                                    formattedValue,
                                                                    "value"
                                                                );
                                                            }}
                                                        />
                                                        <button
                                                            class="btn rmove-sec"
                                                            // onClick={() => this.handlePriorityData("removeOption", idx, index)}
                                                            onClick={() => this.handleRemoveItem("removeOption", idx, index, option.id)}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="8.121"
                                                                height="8.428"
                                                                viewBox="0 0 8.121 8.428"
                                                            >
                                                                <g id="Group_17894" data-name="Group 17894" transform="translate(-874.44 -835.132)">
                                                                    <line
                                                                        id="Line_249"
                                                                        data-name="Line 249"
                                                                        x1="6"
                                                                        y2="6.308"
                                                                        transform="translate(875.5 836.192)"
                                                                        fill="none"
                                                                        stroke="#c5c5c5"
                                                                        stroke-linecap="round"
                                                                        stroke-width="1.5"
                                                                    />
                                                                    <line
                                                                        id="Line_250"
                                                                        data-name="Line 250"
                                                                        x2="6"
                                                                        y2="6.308"
                                                                        transform="translate(875.5 836.192)"
                                                                        fill="none"
                                                                        stroke="#c5c5c5"
                                                                        stroke-linecap="round"
                                                                        stroke-width="1.5"
                                                                    />
                                                                </g>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div class="add-btn-sec" onClick={() => this.handlePriorityData("addOption", idx)}>
                                        <button class="btn btn-add">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div class="col-md-12 text-right btnOtr pt-4 edit-cmn-btn misc-otr-btn">
                        <button
                            type="button"
                            className={`btn btn-secondary btnClr col-md-2 mr-1 ${_.isEqual(initialData, priorities) ? "cursor-diabled" : ""}`}
                            data-dismiss="modal"
                            onClick={() => this.cancelPriorityData()}
                            disabled={_.isEqual(initialData, priorities)}
                        >
                            Cancel
                        </button>
                        <button type="button" class="btn btn-primary btnRgion col-md-2" onClick={() => this.addPriorities()}>
                            Update Priority
                        </button>
                    </div>
                    {this.renderConfirmationModal()}
                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = state => {
    const { projectReducer } = state;
    return { projectReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...projectActions
    })(RecommendationPriority)
);
