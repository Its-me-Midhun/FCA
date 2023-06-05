import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import qs from "query-string";

import { addToBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrumpData } from "../../../config/utils";
import { LockUnlock } from "../../common/components/LockUnlock";
import Portal from "../../common/components/Portal";
import { MultiSelectionModal } from "../../common/components/MultiSelectionModal";

class BuildingDetails extends Component {
    state = {
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

    render() {
        const {
            basicDetails,
            history,
            handleDeleteItem,
            isBuildingLocked,
            isHistoryView = false,
            hasDelete = true,
            hasEdit = true,
            hasLogView = true,
            hasLock,
            lockBuilding
        } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        return (
            <React.Fragment>
                <div className="tab-active build-dtl fund-efci">
                    {this.renderMultiSelectionModal()}
                    <div className="otr-edit-delte col-md-12 text-right">
                        <div className={hasLock ? "otr-common-lck" : ""}>
                            <div className="lft ml-2">
                                {hasLock && (
                                    <LockUnlock
                                        locked={basicDetails.locked}
                                        lockProject={lockBuilding}
                                        partial_locked={basicDetails.partial_locked}
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
                                {!isBuildingLocked ? (
                                    <>
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
                                            <span onClick={() => handleDeleteItem(this.props.match.params.id)} className="edit-icn-bx">
                                                <i className="fas fa-trash-alt"></i> Delete
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="basic-otr">
                        <div className="col-md-12 hed-dtl">
                            <div className="col-md-12 basic-dtl">
                                <h3>Basic Details</h3>
                                <div className="edit-icn-bx text-right">{/* <i className="fas fa-pencil-alt"></i> Edit */}</div>
                            </div>
                        </div>
                        <div className="basic-dtl-otr basic-sec">
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Building Code</h4>
                                    <h3>{basicDetails.code || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Building Name</h4>
                                    <h3>{basicDetails.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Parent Building</h4>
                                    <h3>{basicDetails.hospital_name || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Consultancy</h4>
                                    <h3>{basicDetails.consultancy.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Client</h4>
                                    <h3>{basicDetails.client.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Building Type</h4>
                                    <h3>{(basicDetails.building_type && basicDetails.building_type.name) || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Region</h4>
                                    <h3>{basicDetails.region.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Site</h4>
                                    <h3>{basicDetails.site.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Description</h4>
                                    <h3>{basicDetails.description || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Building Number</h4>
                                    <h3>{basicDetails.number || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
                                <div className="codeOtr">
                                    <h4>Associated Projects</h4>
                                    <h3>
                                        {basicDetails.projects
                                            ? basicDetails.projects.length
                                                ? basicDetails.projects.map((projectItem, i) => (
                                                      <span key={i}>
                                                          {projectItem.name}
                                                          {basicDetails.projects.length - 1 !== i ? " | " : null}
                                                      </span>
                                                  ))
                                                : "-"
                                            : "-"}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Consultancy Users</h4>
                                    <div
                                        class="custom-selecbox select-multi-box view-user"
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
                                        <div class="badge-num"> {basicDetails.users?.length}</div>
                                        <div class="badge-sub-txt">View Users</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Client Users</h4>
                                    <div
                                        class="custom-selecbox select-multi-box view-user"
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
                                        <div class="badge-num"> {basicDetails.client_users?.length}</div>
                                        <div class="badge-sub-txt">View Users</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box">
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
                            <div className="col-md-3 basic-box ">
                                <div className="codeOtr">
                                    <h4>Export Sort Order</h4>
                                    <h3>
                                        {basicDetails.sort_order ? (
                                            <NumberFormat
                                                value={parseInt(basicDetails.sort_order)}
                                                thousandSeparator={true}
                                                displayType={"text"}
                                                // prefix={"$ "}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="basic-otr">
                        <div className="col-md-12 hed-dtl">
                            <div className="col-md-12 basic-dtl">
                                <h3>More Details</h3>
                                <div className="edit-icn-bx text-right">{/* <i className="fas fa-pencil-alt"></i> Edit */}</div>
                            </div>
                        </div>
                        <div className="basic-dtl-otr more-sec">
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Area (Sq Ft)</h4>
                                    <h3>
                                        {basicDetails.area ? (
                                            <NumberFormat value={parseInt(basicDetails.area)} thousandSeparator={true} displayType={"text"} />
                                        ) : (
                                            "-"
                                        )}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Cost</h4>
                                    <h3>
                                        {basicDetails.area ? (
                                            <NumberFormat
                                                value={parseInt(basicDetails.cost)}
                                                thousandSeparator={true}
                                                displayType={"text"}
                                                prefix={"$ "}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>CRV</h4>
                                    <h3>
                                        {basicDetails.area ? (
                                            <NumberFormat
                                                value={parseInt(basicDetails.crv) || "-"}
                                                thousandSeparator={true}
                                                displayType={"text"}
                                                prefix={"$ "}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Year Built</h4>
                                    <h3>{basicDetails.year || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Year of Major Renovation</h4>
                                    <h3>{basicDetails.major_renovation_year || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Enterprise Index</h4>
                                    <h3>{basicDetails.enterprise_index || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Ownership</h4>
                                    <h3>{basicDetails.ownership || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Ownership Type</h4>
                                    <h3>{basicDetails.ownership_type || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Manager</h4>
                                    <h3>{basicDetails.manager || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Ministry</h4>
                                    <h3>{basicDetails.ministry || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Primary Use</h4>
                                    <h3>{basicDetails.use || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Secondary Use</h4>
                                    <h3>{basicDetails.secondary_use || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Sector</h4>
                                    <h3>{basicDetails.sector || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Internal Group</h4>
                                    <h3>{basicDetails.internal_group || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-4 basic-box">
                                <div className="codeOtr">
                                    <h4>Division</h4>
                                    <h3>{basicDetails.division || "-"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="basic-otr">
                        <div className="col-md-12 hed-dtl">
                            <div className="col-md-12 basic-dtl">
                                <h3>Address</h3>
                                <div className="edit-icn-bx text-right">{/* <i className="fas fa-pencil-alt"></i> Edit */}</div>
                            </div>
                        </div>
                        <div className="basic-dtl-otr adr-sec">
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>Location</h4>
                                    <h3>{basicDetails.place || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>Street</h4>
                                    <h3>{basicDetails.street || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>City</h4>
                                    <h3>{basicDetails.city || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>State</h4>
                                    <h3>{basicDetails.state || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>Country</h4>
                                    <h3>{basicDetails.country || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>Zip Code</h4>
                                    <h3>{basicDetails.zip_code || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>Latitude</h4>
                                    <h3>{basicDetails.latitude || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>Longitude</h4>
                                    <h3>{basicDetails.longitude || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>Comments</h4>
                                </div>
                                <pre>
                                    <p>{basicDetails.comments || "-"}</p>
                                </pre>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>Created At</h4>
                                    <h3>{basicDetails.created_at || "-"}</h3>
                                </div>
                            </div>
                            <div className="col-md-3 basic-box adr-2">
                                <div className="codeOtr">
                                    <h4>Updated At</h4>
                                    <h3>{basicDetails.updated_at || "-"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BuildingDetails);
