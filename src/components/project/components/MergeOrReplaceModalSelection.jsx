import React, { Component } from "react";

class AddOrExistingConfirmModal extends Component {
    render() {
        const {
            onCancel,
            onSelection,
            message,
            buttonYes,
            buttonNo,
            subMessage,
            hasCancelButton,
            subMessage1,
            viewReports,
            isSmartChart = false,
            smartChartBtnText
        } = this.props;

        return (
            <React.Fragment>
                <div class="modal modal-region project-modl dupl-img-modl" id="modalId" style={{ display: "block" }} tabindex="-1" aria-hidden="true">
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
                                    {subMessage && <h5>{subMessage}</h5>}
                                    {subMessage1 && <h5>{subMessage1}</h5>}
                                </div>
                                {isSmartChart ? (
                                    <div className="sm-chart-view-reports-cont">
                                        <button className="btn btn-primary view-report-btn" onClick={() => viewReports()}>
                                            {smartChartBtnText}
                                        </button>
                                    </div>
                                ) : null}
                                <div class="btnOtr d-flex flex-wrap">
                                    <button type="button" class="btn btn-primary ml-2" onClick={() => onSelection(buttonYes.value)}>
                                        {buttonYes.label}
                                        {buttonYes.note && <span>{buttonYes.note}</span>}
                                    </button>
                                    <button type="button" class="btn btn-primary ml-2" onClick={() => onSelection(buttonNo.value)}>
                                        {buttonNo.label}
                                        {buttonNo.note && <span>{buttonNo.note}</span>}
                                    </button>
                                    {hasCancelButton && (
                                        <button type="button" class="btn btn-secondary" onClick={onCancel}>
                                            Cancel
                                        </button>
                                    )}
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
