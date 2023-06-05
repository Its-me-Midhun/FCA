import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Tooltip from "rc-tooltip";

import { popBreadCrumpData, findPrevPathFromBreadCrumpData, addToBreadCrumpData } from "../../../config/utils";
import ImageFullViewModal from "../../common/components/ImageFullViewModal";
import Portal from "../../common/components/Portal";
class BasicDetails extends Component {
    state = {
        showImageModal: false
    };

    openImageModal = () => {
        this.setState({
            showImageModal: true
        });
    };

    render() {
        const {
            basicDetails,
            history,
            isHistoryView = false,
            hasDelete = true,
            hasEdit = true,
            hasLogView = true,
        } = this.props
        const { showImageModal } = this.state;
        return (
            <React.Fragment>
                <div class="tab-active location-sec recom-sec main-dtl p-0">
                    <div class="otr-edit-delte col-md-12 text-right">
                        {isHistoryView
                            ? hasLogView && (
                                  <span
                                      onClick={() => {
                                          this.props.changeToHistory();
                                      }}
                                      className="edit-icn-bx"
                                  >
                                      <i className="fas fa-history"></i> View History
                                  </span>
                              )
                            : null}
                        <span
                            onClick={() => {
                                popBreadCrumpData();
                                popBreadCrumpData();
                                history.push(findPrevPathFromBreadCrumpData());
                            }}
                            className="edit-icn-bx"
                        >
                            <i className="fas fa-window-close"></i> Close
                        </span>
                        {hasEdit && (
                            <span
                                onClick={() => {
                                    addToBreadCrumpData({
                                        key: "edit",
                                        name: `Edit ${this.props.location.pathname.split("/")[1]}`,
                                        path: `/${this.props.location.pathname.split("/")[1]}/edit/${this.props.match.params.id}`
                                    });
                                    history.push(`/${this.props.location.pathname.split("/")[1]}/edit/${this.props.match.params.id}`);
                                }}
                               
                                className="edit-icn-bx"
                            >
                                <i className="fas fa-pencil-alt"></i> Edit
                            </span>
                        )}
                        {hasDelete && (
                            <span onClick={() => this.props.handleDeleteItem(this.props.match.params.id)} className="edit-icn-bx">
                                <i className="fas fa-trash-alt"></i> Delete
                            </span>
                        )}
                    </div>
                    <div class="row m-0 mb-3">
                        <div class="col-md-8">
                            <div class="row">
                                <div class="basic-dtl-otr">
                                    <div class="col-md-4 basic-box">
                                        <div class="codeOtr">
                                            <h4>Consultancy Code</h4>
                                            <h3>{basicDetails.code || "-"}</h3>
                                        </div>
                                    </div>
                                    <div class="col-md-4 basic-box">
                                        <div class="codeOtr">
                                            <h4>Consultancy Name</h4>
                                            <h3>{basicDetails.name || "-"}</h3>
                                        </div>
                                    </div>
                                    <div class="col-md-4 basic-box">
                                        <div class="codeOtr">
                                            <h4>Created At</h4>
                                            <h3>{basicDetails.created_at || "-"}</h3>
                                        </div>
                                    </div>
                                    <div class="col-md-4 basic-box">
                                        <div class="codeOtr">
                                            <h4>Updated At</h4>
                                            <h3>{basicDetails.updated_at || "-"}</h3>
                                        </div>
                                    </div>
                                    <div class="col-md-12 comment mt-2">
                                        <h3>Comments</h3>
                                        <pre>
                                            <div className="contDtl">{basicDetails.comments || "-"}</div>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-2"></div>
                        </div>
                        <div class="col-md-4 pl-0 basic-dtl-otr">
                            {basicDetails.image && basicDetails.image.url && basicDetails.image.description ? (
                                <Tooltip
                                    placement="top"
                                    overlay={basicDetails.image.description}
                                    animation="zoom"
                                    defaultVisible={false}
                                    trigger={["hover"]}
                                    overlayInnerStyle={{
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        padding: "11px 17px ",
                                        fontSize: "13px",
                                        border: "none"
                                    }}
                                >
                                    <div
                                        className={`details-img-block basic-box ${basicDetails.image && basicDetails.image.url ? "imgCrsr" : null}`}
                                        onClick={() => this.openImageModal()}
                                    >
                                        {basicDetails.image && basicDetails.image.url ? (
                                            <img src={`${basicDetails.image.url}`} alt="" />
                                        ) : (
                                            <img src="/img/no-image.png" alt="" />
                                        )}
                                    </div>
                                </Tooltip>
                            ) : (
                                <div
                                    className={`details-img-block basic-box ${basicDetails.image && basicDetails.image.url ? "imgCrsr" : null}`}
                                    onClick={() => this.openImageModal()}
                                >
                                    {basicDetails.image && basicDetails.image.url ? (
                                        <img src={`${basicDetails.image.url}`} alt="" />
                                    ) : (
                                        <img src="/img/no-image.png" alt="" />
                                    )}
                                </div>
                            )}
                        </div>
                        {basicDetails.image && basicDetails.image.url && showImageModal ? (
                            <Portal
                                body={
                                    <ImageFullViewModal
                                        imgSource={`${basicDetails.image.url}`}
                                        onCancel={() => this.setState({ showImageModal: false })}
                                    />
                                }
                                onCancel={() => this.setState({ showImageModal: false })}
                            />
                        ) : null}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
