import moment from "moment";
import React from "react";
import { renderFileSize } from "../../../config/utils";

function SummaryModal(props) {
    let size = 0;
    props.images.map(img => (size = size + img.size));
    return (
        <div id="modalId" className="modal modal-region mod-summary" style={{ display: "block" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Upload Summary</h3>
                        <button type="button" className="close" data-dismiss="modal" onClick={props.onCancel} aria-label="Close">
                            <span aria-hidden="true">
                                <img src="/img/close.svg" alt="" />
                            </span>
                        </button>
                    </div>
                    <div className="modal-body region-otr">
                        <div className="cnt-img-se">
                            <div className="details">
                                {/* <div className="content-des">
                                    <span className="cont-txt">Total Selected Images</span>
                                    <span className="cont-del">{props.images?.length || 0}</span>
                                </div> */}
                                <div className="content-des">
                                    <span className="cont-txt">Successfully Uploaded Images</span>
                                    <span className="cont-del">{props.uploadedFiles?.imagesCount || 0}</span>
                                </div>
                                <div className="content-des">
                                    <span className="cont-txt">Overwrite Images</span>
                                    <span className="cont-del">{props.uploadedFiles?.overWriteCount || 0}</span>
                                </div>
                                <div className="content-des">
                                    <span className="cont-txt">Duplicate Images</span>
                                    <span className="cont-del">{props.duplicateImages?.length}</span>
                                </div>
                                {props.uploadedFiles?.lockedImagesCount > 0 && (
                                    <div className="content-des">
                                        <span className="cont-txt">Locked Images</span>
                                        <span className="cont-del">{props.uploadedFiles?.lockedImagesCount}</span>
                                    </div>
                                )}
                                <div className="content-des">
                                    <span className="cont-txt">Time Taken</span>
                                    <span className="cont-del">
                                        {moment.utc(moment(props.endTime).diff(props.startTime)).format("HH:mm:ss") || 0} {"Hours"}
                                    </span>
                                </div>
                                <div className="content-des">
                                    <span className="cont-txt">Total Size</span>
                                    <span className="cont-del">{`${(size / (1024 * 1024)).toFixed(2)} MB`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SummaryModal;
