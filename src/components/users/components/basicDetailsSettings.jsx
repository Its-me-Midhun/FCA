import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
    popBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    resetBreadCrumpData,
    addToBreadCrumpData,
    popBreadCrumpOnPageClose
} from "../../../config/utils";
import Portal from "../../common/components/Portal";
import ImageFullViewModal from "../../common/components/ImageFullViewModal";
import Tooltip from "rc-tooltip";
import NumberFormat from "react-number-format";

class BasicDetails extends Component {
    state = {
        showImageModal: false
    };

    openImageModal = () => {
        this.setState({
            showImageModal: true
        });
    };
    componentDidMount = () => {
        let currentUser = this.props.match.params.id;
        let userId = localStorage.getItem("userId");
    };

    render() {
        const {
            basicDetails,
            keys,
            config,
            history,
            match: {
                params: { section }
            },
            isHistoryView = false,
            permissions,
            logPermission,
            hasDelete = true,
            hasEdit = true,
            hasLogView = true
        } = this.props;
        const { showImageModal } = this.state;
        let currentUser = this.props.match.params.id;
        let userId = localStorage.getItem("userId");
        let role = localStorage.getItem("role");
        return (
            <React.Fragment>
                <div className="tab-active location-sec recom-sec main-dtl p-0">
                    <div className="otr-edit-delte col-md-12 text-right">
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
                                popBreadCrumpOnPageClose();
                                history.push(findPrevPathFromBreadCrumpData() || "/dashboard");
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
                                // onClick={() => {
                                //     this.props.showEditPage(this.props.match.params.id)
                                // }}
                                className="edit-icn-bx"
                            >
                                <i className="fas fa-pencil-alt"></i> Edit
                            </span>
                        )}
                        {currentUser == userId
                            ? null
                            : hasDelete && (
                                  <span onClick={() => this.props.handleDeleteType(this.props.match.params.id)} className="edit-icn-bx">
                                      <i className="fas fa-trash-alt"></i> Delete
                                  </span>
                              )}
                    </div>
                    <div className="row m-0 mb-3">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="basic-dtl-otr">
                                    <div className="col-md-6 basic-box">
                                        <div className="codeOtr">
                                            <h4>Email</h4>
                                            <h3>{basicDetails.email || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-6 basic-box">
                                        <div className="codeOtr">
                                            <h4>User Name</h4>
                                            <h3>{basicDetails.name || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>First Name</h4>
                                            <h3>{basicDetails.first_name || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>Last Name</h4>
                                            <h3>{basicDetails.last_name || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>Printed Name</h4>
                                            <h3>{basicDetails.printed_name || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-3 basic-box"></div>
                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>Role</h4>
                                            <h3>{(basicDetails.role && basicDetails.role.name) || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>Consultancy</h4>
                                            <h3>{(basicDetails.consultancy && basicDetails.consultancy.name) || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>Client</h4>
                                            {basicDetails?.role?.name !== "consultancy_user" && <h3>{basicDetails?.client?.name || "-"}</h3>}
                                        </div>
                                    </div>
                                    <div className="col-md-3 basic-box"></div>
                                    {currentUser !== userId && (
                                        <>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>User Permission</h4>
                                                    <h3>{(basicDetails.group && basicDetails.group.name) || "-"}</h3>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Associated Projects</h4>
                                                    <h3>{basicDetails?.projects?.length || "-"}</h3>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Buildings</h4>
                                                    <h3>{basicDetails?.buildings?.length || "-"}</h3>
                                                </div>
                                            </div>
                                            {basicDetails?.role?.name === "client_user" ? (
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Infrastructure Request User</h4>
                                                        <h3>{basicDetails.infrastructure_request || "-"}</h3>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>FMP User</h4>
                                                        <h3>{basicDetails.fmp || "-"}</h3>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>Default Project</h4>
                                            <h3>{(basicDetails.default_project ? basicDetails.default_project.name : "-") || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>Has Landing Page</h4>
                                            <h3>{basicDetails.landing_page_lock ? "Yes" : "No"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>Asset Mgmt. Client</h4>
                                            <h3>{basicDetails.assetmanagement_client?.name || "-"}</h3>
                                        </div>
                                    </div>

                                    <div className="col-md-3 basic-box">
                                        <div className="codeOtr">
                                            <h4>Energy Mgmt. Client</h4>
                                            <h3>{basicDetails.energymanagement_client?.name || "-"}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                        className={`details-img-block basic-box ${basicDetails.image && basicDetails.image.url ? "imgCrsr" : null}`}
                                        onClick={() => this.openImageModal()}
                                    >
                                        {/* <div className="details-img-block basic-box imgCrsr" onClick={() => this.openImageModal()}> */}
                                        <div className={"img-view"}>
                                            {basicDetails.image && basicDetails.image.url ? (
                                                <img src={`${basicDetails.image.url}`} alt="" />
                                            ) : (
                                                <img src="/img/no-image.png" alt="" />
                                            )}
                                        </div>
                                    </div>
                                </Tooltip>
                            ) : (
                                <div
                                    className={`details-img-block basic-box ${basicDetails.image && basicDetails.image.url ? "imgCrsr" : null}`}
                                    onClick={() => this.openImageModal()}
                                >
                                    {/* <div className="details-img-block basic-box imgCrsr" onClick={() => this.openImageModal()}> */}
                                    <div className={"img-view"}>
                                        {basicDetails.image && basicDetails.image.url ? (
                                            <img src={`${basicDetails.image.url}`} alt="" />
                                        ) : (
                                            <img src="/img/no-image.png" alt="" />
                                        )}
                                    </div>
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
                    <div className="basic-dtl-otr">
                        {currentUser == userId ? null : (
                            <>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Title</h4>
                                        <h3>{basicDetails.title || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Credentials</h4>
                                        <h3>{basicDetails.credentials || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Department</h4>
                                        <h3>{basicDetails.department || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Work Phone</h4>
                                        <h3>
                                            <NumberFormat
                                                autoComplete="nope"
                                                displayType="text"
                                                value={basicDetails.work_phone || ""}
                                                decimalScale={0}
                                                format="(###) ###-####"
                                            />
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Cell Phone</h4>
                                        <h3>
                                            <NumberFormat
                                                autoComplete="nope"
                                                displayType="text"
                                                value={basicDetails.cell_phone || ""}
                                                decimalScale={0}
                                                format="(###) ###-####"
                                            />
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Building Name</h4>
                                        <h3>{basicDetails.building_name || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Floor</h4>
                                        <h3>{basicDetails.floor || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Room Number</h4>
                                        <h3>{basicDetails.room_number || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Room Name</h4>
                                        <h3>{basicDetails.room_name || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Address</h4>
                                        <h3>{basicDetails.address || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>City</h4>
                                        <h3>{basicDetails.city || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>State</h4>
                                        <h3>{basicDetails.state || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Zip Code</h4>
                                        <h3>{basicDetails.zip_code || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Location</h4>
                                        <h3>{basicDetails.location || "-"}</h3>
                                    </div>
                                </div>

                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Emergency Contact Name</h4>
                                        <h3>{basicDetails.emergency_contact_name || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Emergency Contact Number</h4>
                                        <h3>
                                            <NumberFormat
                                                autoComplete="nope"
                                                displayType="text"
                                                value={basicDetails.emergency_contact_no || ""}
                                                decimalScale={0}
                                                format="(###) ###-####"
                                            />
                                        </h3>
                                    </div>
                                </div>
                                <div className={`col-md-${userId === currentUser ? "6" : "9"} basic-box`}>
                                    <div className="codeOtr">
                                        <h4>Notes</h4>
                                        <h3>{basicDetails.notes || "-"}</h3>
                                    </div>
                                </div>
                            </>
                        )}

                        {currentUser != userId ? (
                            <>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Last Seen</h4>
                                        <h3>{basicDetails.last_seen_at || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Last Sign in</h4>
                                        <h3>{basicDetails.last_sign_in_at || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Last Sign out</h4>
                                        <h3>{basicDetails.last_sign_out_at || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Created at</h4>
                                        <h3>{basicDetails.created_at || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Updated At</h4>
                                        <h3>{basicDetails.updated_at || "-"}</h3>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                    <div className="col-md-12 otr-user-cmnt"></div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
