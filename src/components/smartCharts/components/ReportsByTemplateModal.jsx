import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import BuildModalHeader from "../../common/components/BuildModalHeader";
import actions from "../actions";
import SmartChartExportsList from "../index";

const ReportsByTemplateModal = ({ currentPropertyId, clientId, ...props }) => {
    const [isLoading, setLoading] = useState(false);
    return (
        <>
            <div
                className="modal assign-init-modal image-pull-modal"
                style={{ display: "block" }}
                id="modalId"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog assignModal" role="document">
                    <div className="modal-content">
                        <BuildModalHeader title="View Connected Reports" onCancel={props.onCancel} modalClass="assignModal" />

                        <form autoComplete="nope">
                            <div className="modal-body ">
                                <div className="form-group">
                                    <div className="formInp">
                                        <div className="dashboard-outer">
                                            <div className="outer-detail">
                                                <div className="right-panel-section">
                                                    <div className="dtl-sec">
                                                        <div className="dtl-sec system-building col-md-12 ">
                                                            <div className="tab-dtl region-mng">
                                                                <div className="tab-active recomdn-table bg-grey-table">
                                                                    <SmartChartExportsList isModalView={true} currentPropertyId={currentPropertyId} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-12 p-0 text-right btnOtr">
                                        {props.submitAssign ? (
                                            <button type="button" className="btn btn-primary btnRgion col-md-2">
                                                <div className="button-loader d-flex justify-content-center align-items-center">
                                                    <div className="spinner-border text-white" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ) : (
                                            <button
                                                disabled={!selectedImages?.length || isLoading}
                                                type="button"
                                                onClick={() => handleAssign()}
                                                className="btn btn-primary btnRgion col-md-2"
                                            >
                                                Assign {isLoading && <span className="spinner-border spinner-border-sm pl-2" role="status"></span>}
                                            </button>
                                        )}
                                    </div> */}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};

export default connect(mapStateToProps, { ...actions })(ReportsByTemplateModal);
