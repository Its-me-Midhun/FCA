import React, { useState } from "react";

const LockPasswordModal = ({ selectedReportTemplate, isLockLoading = false, ...props }) => {
    const [formParams, setFormParams] = useState({
        password: ""
    });
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const validate = () => {
        setShowErrorBorder(false);
        if (!formParams.password && !formParams.password.trim().length) {
            setShowErrorBorder(true);
            return false;
        }
        return true;
    };

    const updateLockPassword = async () => {
        if (validate()) {
            props.updateLockPassword({ ...selectedReportTemplate, password: formParams.password });
            // props.onCancel();
        }
    };
    return (
        <React.Fragment>
            <div className="modal modal-region modal-view inbox-modal" id="modalId" tabIndex="-1" style={{ display: "block" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                <div className="txt-hed">{`${selectedReportTemplate?.is_locked ? "Unlock" : "Lock"} Report Template`}</div>
                            </h5>
                            <button type="button" className="close" onClick={props.onCancel}>
                                <span aria-hidden="true">
                                    <img src="/img/close.svg" alt="" />
                                </span>
                            </button>
                        </div>
                        <div className="modal-body region-otr sm-chart-upload">
                            <div className="upload-area not-draggable">
                                <div className="upload-sec cursor-hand" role="button" tabIndex="0">
                                    <input type="file" multiple="" autocomplete="off" tabIndex="-1" style={{ display: "none" }} />
                                </div>
                            </div>
                            <div className="col-md-12 main-sec">
                                <div className="form-row">
                                    <div className="form-group col-12 mb-4">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            value={formParams.password}
                                            onChange={e => {
                                                let value = e.target.value;
                                                setFormParams(prevParams => {
                                                    return {
                                                        ...prevParams,
                                                        password: value
                                                    };
                                                });
                                            }}
                                            className={`form-control ${
                                                showErrorBorder && !formParams.password && !formParams.password.trim().length ? "error-border" : ""
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="btn-sec">
                                <div className="text-right btnOtr edit-cmn-btn">
                                    <button
                                        type="button"
                                        className="btn btn-primary btnRgion "
                                        class="btn btn-create save"
                                        onClick={() => updateLockPassword()}
                                    >
                                        {`${selectedReportTemplate?.is_locked ? "Unlock" : "Lock"}`}
                                        {isLockLoading ? <span className="spinner-border spinner-border-sm pl-2 ml-2" role="status"></span> : ""}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary btnClr mr-1"
                                        data-dismiss="modal"
                                        onClick={() => props.onCancel()}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default LockPasswordModal;
