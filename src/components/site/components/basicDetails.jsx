import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { popBreadCrumpData, findPrevPathFromBreadCrumpData, addToBreadCrumpData } from "../../../config/utils";
import Portal from "../../common/components/Portal";
import ImageFullViewModal from "../../common/components/ImageFullViewModal";
import Tooltip from "rc-tooltip";
import qs from "query-string";

import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import { LockUnlock } from "../../common/components/LockUnlock";
import { MultiSelectionModal } from "../../common/components/MultiSelectionModal";

class BasicDetails extends Component {
    state = {
        showImageModal: false,
        multiSelectionModalParams: {}
    };

    renderMultiSelectionModal = () => {
        const { multiSelectionModalParams } = this.state;
        if (!multiSelectionModalParams.show) return null;
        const { heading, selectedValues } = multiSelectionModalParams || {};
        return (
            <Portal
                body={<MultiSelectionModal viewOnly currentSelection={selectedValues} heading={heading} onCancel={this.cancelMultiSelectionModal} />}
                onCancel={this.cancelMultiSelectionModal}
            />
        );
    };
    cancelMultiSelectionModal = () => {
        this.setState({
            multiSelectionModalParams: { show: false }
        });
    };
    openImageModal = () => {
        this.setState({
            showImageModal: true
        });
    };
    render() {
        const {
            isloading,
            basicDetails,
            history,
            isHistoryView = false,
            hasDelete = true,
            hasEdit = true,
            hasLogView = true,
            hasLock,
            lockSite
        } = this.props;
        const { showImageModal } = this.state;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);

        return (
            <React.Fragment>
                <LoadingOverlay active={isloading} spinner={<Loader />} fadeSpeed={10}>
                    {this.renderMultiSelectionModal()}
                    <div className="tab-active main-dtl p-0 fund-efci">
                        <div className="otr-edit-delte col-md-12 text-right">
                            <div className={hasLock ? "otr-common-lck" : ""}>
                                <div className="lft ml-2">
                                    {hasLock && (
                                        <LockUnlock
                                            locked={basicDetails.locked}
                                            partial_locked={basicDetails.partial_locked}
                                            lockProject={lockSite}
                                        />
                                    )}
                                </div>
                                <div className="right-end-icon">
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
                                    {!query.dashboardView ? (
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
                                    ) : null}
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
                                        <span onClick={() => this.props.handleDeleteType(this.props.match.params.id)} className="edit-icn-bx">
                                            <i className="fas fa-trash-alt"></i> Delete
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row m-0 mb-3">
                            <div className="col-md-8">
                                <div className="row">
                                    <div className="basic-dtl-otr">
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Site Code</h4>
                                                <h3>{basicDetails.code || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Site Name</h4>
                                                <h3>{basicDetails.name || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Region</h4>
                                                <h3>{(basicDetails.region && basicDetails.region.name) || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Consultancy</h4>
                                                <h3>{(basicDetails.consultancy && basicDetails.consultancy.name) || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Client</h4>
                                                <h3>{(basicDetails.client && basicDetails.client.name) || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Associated Projects</h4>

                                                <h3>
                                                    {" "}
                                                    {basicDetails.projects && basicDetails.projects.length
                                                        ? basicDetails.projects.map((item, i) => (
                                                              <React.Fragment key={i}>
                                                                  <span key={i} className="rg-txt">
                                                                      {item.name}
                                                                  </span>
                                                                  {i < basicDetails.projects.length - 1 ? <span className="line-txt">|</span> : null}
                                                              </React.Fragment>
                                                          ))
                                                        : null}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Consultancy Users</h4>
                                                <div
                                                    className="custom-selecbox select-multi-box view-user ml-2"
                                                    onClick={() =>
                                                        this.setState({
                                                            multiSelectionModalParams: {
                                                                show: true,
                                                                heading: "Consultancy Users",
                                                                selectedValues: basicDetails.users
                                                            }
                                                        })
                                                    }
                                                >
                                                    <div className="badge-num"> {basicDetails.users?.length}</div>
                                                    <div className="badge-sub-txt">View Users</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Client Users</h4>
                                                <div
                                                    className="custom-selecbox select-multi-box view-user"
                                                    onClick={() =>
                                                        this.setState({
                                                            multiSelectionModalParams: {
                                                                show: true,
                                                                heading: "Client Users",
                                                                selectedValues: basicDetails.client_users
                                                            }
                                                        })
                                                    }
                                                >
                                                    <div className="badge-num"> {basicDetails.client_users?.length}</div>
                                                    <div className="badge-sub-txt">View Users</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Color</h4>

                                                <h3 className="d-flex align-items-center">
                                                    {basicDetails.color_code}
                                                    <span
                                                        className="color-box-common"
                                                        style={{
                                                            background: basicDetails.color_code ? `${basicDetails?.color_code}` : "#fff"
                                                        }}
                                                    ></span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Export Sort Order</h4>
                                                <h3>{(basicDetails.sort_order && basicDetails.sort_order) || "-"}</h3>
                                            </div>
                                        </div>

                                        <div className="col-md-8 basic-box">
                                            <div className="codeOtr">
                                                <h4>Comments</h4>
                                                <h3>{basicDetails.comments || "-"}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2"></div>
                            </div>

                            <div className="col-md-4 pl-0 basic-dtl-otr">
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
                                            className={`details-img-block basic-box ${
                                                basicDetails.image && basicDetails.image.url ? "imgCrsr" : null
                                            }`}
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
                        <div className="basic-dtl-otr pb-4">
                            <div className="basic-otr build-dtl mt-2 w-100">
                                <div className="col-md-12 hed-dtl">
                                    <div className="col-md-12 basic-dtl">
                                        <h3>Address</h3>
                                        <div className="edit-icn-bx text-right"></div>
                                    </div>
                                </div>
                                <div className="basic-dtl-otr more-sec">
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>Location</h4>
                                            <h3>{basicDetails.place || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>Street</h4>
                                            <h3>{basicDetails.street || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>City</h4>
                                            <h3>{basicDetails.city || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>State</h4>
                                            <h3>{basicDetails.state || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>Country</h4>
                                            <h3>{basicDetails.country || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>ZipCode</h4>
                                            <h3>{basicDetails.zip_code || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>Latitude</h4>
                                            <h3>{basicDetails.latitude || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>Longitude</h4>
                                            <h3>{basicDetails.longitude || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>Created At</h4>
                                            <h3>{basicDetails.created_at || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4 basic-box">
                                        <div className="codeOtr">
                                            <h4>Updated At</h4>
                                            <h3>{basicDetails.updated_at || "-"}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
