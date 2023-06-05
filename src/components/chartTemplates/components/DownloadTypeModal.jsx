import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class SelectDownloadTypeModal extends Component {
    state = {
        export_type: "with_header"
    };
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
                    <div className="modal-dialog select-export-type download-template-type" role="document">
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

                                    <div class="d-flex hedd-otrr">
                                        <div className="formInp mr-3">
                                            <label className="container-check">
                                                With Client Chart Header
                                                <input
                                                    type="radio"
                                                    name="double_header"
                                                    onClick={e =>
                                                        this.setState({
                                                            export_type: this.state.export_type === "with_header" ? "without_header" : "with_header"
                                                        })
                                                    }
                                                    checked={this.state.export_type === "with_header"}
                                                />
                                                <span className="checkmark white" />
                                            </label>
                                        </div>
                                        <div className="formInp">
                                            <label className="container-check">
                                                With Consultant Report Header
                                                <input
                                                    type="radio"
                                                    name="double_header"
                                                    onClick={e =>
                                                        this.setState({
                                                            export_type:
                                                                this.state.export_type === "without_header" ? "with_header" : "without_header"
                                                        })
                                                    }
                                                    checked={this.state.export_type === "without_header"}
                                                />
                                                <span className="checkmark white" />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="btnOtr">
                                    <button type="button" className="btn btn-secondary btnClr" onClick={() => onCancel()}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary btnRgion" onClick={() => onOk(this.state.export_type)}>
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

export default withRouter(SelectDownloadTypeModal);
