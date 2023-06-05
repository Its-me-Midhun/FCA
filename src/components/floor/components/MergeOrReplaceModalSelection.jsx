import React, { Component } from "react";

class AddOrExistingConfirmModal extends Component {
    render() {
        const { onCancel, onSelection, message, buttonYes, buttonNo } = this.props;

        return (
            <React.Fragment>
                <div
                    class="modal modal-region project-modl"
                    id="modalId"
                    style={{ display: "block" }}
                    tabindex="-1"
                    aria-hidden="true"
                >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" onClick={onCancel}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div class="modal-body region-otr">
                                <div class="deleteInner">
                                    <h2>{message}</h2>
                                </div>
                                <div class="btnOtr">
                                    <button
                                        type="button"
                                        class="btn btn-primary btnRgion"
                                        onClick={() => onSelection(buttonYes.value)}
                                    >
                                        {buttonYes.label}
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-secondary btnRgion ml-2"
                                        onClick={() => onSelection(buttonNo.value)}
                                    >
                                        {buttonNo.label}
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

export default AddOrExistingConfirmModal;
