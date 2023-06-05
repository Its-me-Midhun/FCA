import React, { Component } from "react";
import _ from "lodash";

import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { Multiselect } from "multiselect-react-dropdown";

class DropDownModal extends Component {
    state = {
        selectedBuildings: this.props.selectedBuildings,
        selectedProjects: this.props.selectedProjects
    };

    onSelectBuildings = selectedBuildings => {
        this.setState({
            selectedBuildings
        });
    };
    onSelectProjects = selectedProjects => {
        this.setState({
            selectedProjects
        });
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

    handleSelect = async () => {
        const { selectedBuildings, selectedProjects } = this.state;
        if (this.props.typeOfModal === "Buildings") {
            this.props.handleBuildingSelect(selectedBuildings);
        } else {
            this.props.handleProjectSelect(selectedProjects);
        }
    };
    cancelForm = () => {
        if (
            _.isEqual(this.state.selectedBuildings, this.props.selectedBuildings) &&
            _.isEqual(this.state.selectedProjects, this.props.selectedProjects)
        ) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        this.setState({
            selectedBuildings: this.props.selectedBuildings,
            selectedProjects: this.props.selectedProjects
        });
        this.props.onCancel();
    };

    render() {
        return (
            <React.Fragment>
                <div
                    className="modal modal-region add-new-template"
                    style={{ display: "block" }}
                    id="modalId"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog build-multi-modal" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    {this.props.typeOfModal}
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.cancelForm()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>

                            <div className="modal-body region-otr build-type-mod">
                                <form autoComplete={"nope"}>
                                    <div className="form-group">
                                        <div className="formInp bgInp">
                                            <label>Selected {this.props.typeOfModal}</label>
                                            <Multiselect
                                                autoComplete="nope"
                                                options={this.props.typeOfModal === "Buildings" ? this.props.buildings : this.props.projects}
                                                selectedValues={
                                                    this.props.typeOfModal === "Buildings"
                                                        ? this.props.selectedBuildings
                                                        : this.props.selectedProjects
                                                }
                                                onSelect={this.props.typeOfModal === "Buildings" ? this.onSelectBuildings : this.onSelectProjects}
                                                onRemove={this.props.typeOfModal === "Buildings" ? this.onSelectBuildings : this.onSelectProjects}
                                                displayValue="name"
                                            />
                                        </div>
                                    </div>
                                </form>
                                <div className="col-md-12 p-0 text-right btnOtr">
                                    <button type="button" onClick={this.cancelForm} className="btn btn-primary btnRgion col-md-2 btncancel">
                                        Cancel
                                    </button>

                                    <button type="button" onClick={() => this.handleSelect()} className="btn btn-primary btnRgion col-md-2">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default DropDownModal;
