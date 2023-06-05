import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class ConfirmationModal extends Component {
    render() {
        const { heading, paragraph, onOk, onCancel } = this.props;

        return (
            <React.Fragment>
                <div
                    id="modalId"
                    className="modal modal-region deleteModal"
                    style={{ display: "block" }}
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr p-3 pb-5">
                                <div className="deleteInner">
                                    <i className="far fa-check-circle" />
                                    <h2>{heading}</h2>
                                    <p>{paragraph}</p>
                                </div>

                                <div className="btnOtr">
                                    <button type="button" className="btn btn-secondary btnClr" onClick={() => onCancel()}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary btnRgion" onClick={() => onOk()}>
                                        OK
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

export default withRouter(ConfirmationModal);
