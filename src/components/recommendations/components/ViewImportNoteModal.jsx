import React, { Component } from "react";
import _ from "lodash";

import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import recommendationsActions from "../actions";


class ViewImportNoteModal extends Component {
    state = {
        isLoading: false,
        errorMessage: "",
        notes:this.props.basic_details.notes,
        id:"",
        initialValues: {},
        showConfirmModal: false,
        showErrorBorder: false,
        uploadError: ""
    };


    handleChange = e => {
        const {  value } = e.target;
        this.setState({
            notes:value
        });
    };

   
    // validate = () => {
    //     const { templateData } = this.state;
    //     const {
    //         selectedTemplate: { id }
    //     } = this.props;
    //     this.setState({
    //         showErrorBorder: false
    //     });
    //     return true;
    // };

    

    updateNote = async () => {
        const { notes } = this.state;
        const { updateNoteImportViewTableModal } = this.props;
            await updateNoteImportViewTableModal(notes,this.props.basic_details.id);
            this.props.refreshImportHistory()
            this.props.onCancel()
    };

    // renderConfirmationModal = () => {
    //     const { showConfirmModal } = this.state;
    //     if (!showConfirmModal) return null;
    //     return (
    //         <Portal
    //             body={
    //                 <ConfirmationModal
    //                     type="cancel"
    //                     heading={"Do you want to clear and lose all changes?"}
    //                     message={"This action cannot be reverted, are you sure that you need to cancel?"}
    //                     onNo={() => this.setState({ showConfirmModal: false })}
    //                     onYes={this.clearForm}
    //                 />
    //             }
    //             onCancel={() => this.setState({ showConfirmModal: false })}
    //         />
    //     );
    // };

    cancelForm = () => {
        // if (_.isEqual(this.state.initialValues, this.state.templateData)) {
        //     this.clearForm();
        // } else {
        //     this.setState({
        //         showConfirmModal: true
        //     });
        // }
        this.clearForm()
    };

    clearForm = async () => {
        // this.setState({
        //     templateData: {
        //         id: "",
        //         name: "",
        //         chart_propertie_id: "",
        //         uploaded_by: localStorage.getItem("user"),
        //         description: "",
        //         template: null,
        //         notes: "",
        //         active: true
        //     }
        // });
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
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                   Edit Export Note
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
                                            <label>Notes </label>
                                            <textarea
                                                autoComplete="off"
                                                placeholder="Notes"
                                                className={`form-control`}
                                                name="notes"
                                                value={this.state.notes}
                                                onChange={this.handleChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </form>
                                <div className="col-md-12 p-0 text-right btnOtr">
                                        <button type="button" onClick={() => this.updateNote()} className="btn btn-primary btnRgion col-md-2">
                                            Update
                                        </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { recommendationsReducer } = state;
    return { recommendationsReducer };
};

export default withRouter(connect(mapStateToProps, { ...recommendationsActions })(ViewImportNoteModal)); 
