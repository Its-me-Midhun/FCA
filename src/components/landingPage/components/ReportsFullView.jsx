import React from "react";
import BuildModalHeader from "../../common/components/BuildModalHeader";

function ReportsFullView({ selectedReport, onCancel }) {
    return (
        <React.Fragment>
            <div
                className="modal modal-region helper-modal"
                id="modalId"
                style={{ display: "block" }}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className={`modal-dialog`} role="document">
                    <div className="modal-content">
                        <BuildModalHeader title={selectedReport?.file_name} onCancel={onCancel} modalClass="helper-modal" />
                        <div className="modal-body region-otr">
                            <iframe title="helper-iframe" className="helper-iframe" src={selectedReport?.url} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ReportsFullView;
