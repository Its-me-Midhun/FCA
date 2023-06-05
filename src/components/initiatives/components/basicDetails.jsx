import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { popBreadCrumpData, findPrevPathFromBreadCrumpData, resetBreadCrumpData, addToBreadCrumpData } from "../../../config/utils";
import Portal from "../../common/components/Portal";
import ImageFullViewModal from "../../common/components/ImageFullViewModal"
import NumberFormat from "react-number-format";


class BasicDetails extends Component {
    state = {
        showImageModal: false
    }

    openImageModal = () => {
        this.setState({
            showImageModal: true
        })
    }
    componentDidMount = () => {
        let currentUser = this.props.match.params.id
        let userId = localStorage.getItem("userId");
        if (currentUser == userId) {
            resetBreadCrumpData({
                key: "main",
                name: "User",
                path: `/user/userinfo/${userId}/basicdetails"
             }`
            });
        }
    }

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
            logPermission
        } = this.props;
        const { showImageModal } = this.state;
        let currentUser = this.props.match.params.id
        let userId = localStorage.getItem("userId");
        let role = localStorage.getItem("role");

        return (
            <React.Fragment>
                <div className="tab-active location-sec recom-sec main-dtl p-0 build-dtl">
                    <div className="otr-edit-delte col-md-12 text-right">
                        {isHistoryView ? logPermission && logPermission.view == false ? ("") : <span
                            onClick={() => {
                                this.props.changeToHistory()
                            }
                            }
                            className="edit-icn-bx"
                        >
                            <i className="fas fa-history"></i> View History
                        </span> : null}
                        <span
                            onClick={() => {
                                popBreadCrumpData();
                                popBreadCrumpData();
                                history.push(findPrevPathFromBreadCrumpData() || '/initiatives');
                            }}
                            className="edit-icn-bx"
                        >
                            <i className="fas fa-window-close"></i> Close
                        </span>
                        {permissions && permissions.edit == false ? ("") : <span
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
                        </span>}
                        {(currentUser == userId) ? null : ((permissions && permissions.delete == false) ? ("") : <span
                            onClick={() => this.props.handleDeleteInitiatives(this.props.match.params.id)}
                            className="edit-icn-bx"
                        >
                            <i className="fas fa-trash-alt"></i> Delete
                        </span>)}
                    </div>

                    <div className="row m-0 mb-3">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="basic-otr col-md-12">
                                    <div className="basic-dtl-otr">
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Initiative Code</h4>
                                                <h3>{basicDetails.code || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Initiative Identifier</h4>
                                                <h3>{basicDetails.identifier || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Initiative Name</h4>
                                                <h3>{basicDetails.name || "-"}</h3>
                                            </div>
                                        </div>

                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Project</h4>
                                                <h3>{basicDetails.project && basicDetails.project.name || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Performed By</h4>
                                                <h3>{basicDetails.performed_by || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Initiative Type</h4>
                                                <h3>{basicDetails.initiative_type
                                                    && basicDetails.initiative_type.length
                                                    ? basicDetails.initiative_type.map((type, key) => {
                                                        return `${type} ${key < basicDetails.initiative_type.length - 1 ? `, ` : ""}`
                                                    }) : "-"}
                                                </h3>

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
                                                <h4>Status</h4>
                                                <h3>{basicDetails.status || "-"}</h3>
                                            </div>
                                        </div>

                                    </div>
                                    {/* <div className="basic-dtl-otr">
                                   
                                </div> */}
                                </div>
                                <div className="basic-otr col-md-12">
                                    <div className="basic-dtl-otr ">
                                        <div className="col-md-6 basic-box">
                                            <div className="codeOtr">
                                                <h4>Recommendation cost</h4>
                                                <h3>{basicDetails.recommendations_cost && <NumberFormat
                                                    prefix={"$ "}
                                                    value={parseInt(basicDetails.recommendations_cost)}
                                                    thousandSeparator={true} displayType={"text"} /> || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-6 basic-box">
                                            <div className="codeOtr">
                                                <h4>Recommendation count</h4>
                                                <h3>{basicDetails.recommendations_count || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Actual Cost</h4>
                                                <h3>


                                                    {(basicDetails.actual_cost &&
                                                        <NumberFormat
                                                            prefix={"$ "}
                                                            value={parseInt(basicDetails.actual_cost)}
                                                            thousandSeparator={true} displayType={"text"} />
                                                    ) || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Funding</h4>
                                                <h3>{basicDetails.funding && <NumberFormat
                                                    prefix={"$ "}
                                                    value={parseInt(basicDetails.funding)}

                                                    thousandSeparator={true} displayType={"text"} /> || "-"}</h3>

                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Total SF</h4>
                                                <h3>{basicDetails.total_sf && <NumberFormat
                                                    value={parseInt(basicDetails.total_sf)}

                                                    thousandSeparator={true} displayType={"text"} /> || "-"}</h3>
                                            </div>
                                        </div>


                                       
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Created At</h4>
                                                <h3>{basicDetails.created_at || "-"}</h3>
                                            </div>
                                        </div> <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Updated At</h4>
                                                <h3>{basicDetails.updated_at || "-"}</h3>
                                            </div>
                                        </div>

                                        {/* <div class="col-md-6 comment mt-2">
                                        <h3>Description</h3>
                                        <pre>
                                            <div className="contDtl">{basicDetails.description || "-"}</div>
                                        </pre>
                                    </div>
                                    <div class="col-md-6 comment mt-2">
                                        <h3>Notes</h3>
                                        <pre>
                                            <div className="contDtl">{basicDetails.note || "-"}</div>
                                        </pre>
                                    </div> */}

                                    </div>
                                </div>
                                <div className="basic-otr col-md-12">
                                <div className="basic-dtl-otr adr-sec">
                                    <div className="col-md-6 basic-box adr-2">
                                        <div className="codeOtr">
                                            <h3>Description</h3>
                                        </div>
                                        <pre>
                                            <p>{basicDetails.description || "-"}</p>
                                        </pre>
                                    </div>
                                    <div className="col-md-6 basic-box adr-2">
                                        <div className="codeOtr">
                                            <h3>Notes</h3>
                                        </div>
                                        <pre>
                                            <p>{basicDetails.note || "-"}</p>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                            </div>
                           
                        </div>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
