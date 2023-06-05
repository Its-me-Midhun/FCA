import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    findPrevPathFromBreadCrumpRecData,
    popBreadCrumpOnPageClose
} from "../../../config/utils";
import { LockUnlock } from "../../common/components/LockUnlock";
import Portal from "../../common/components/Portal";
import { MultiSelectionModal } from "../../common/components/MultiSelectionModal";
class BasicDetails extends Component {
    state = { multiSelectionModalParams: {} };

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
            keys,
            config,
            history,
            match: {
                params: { section }
            },
            handleDeleteItem,
            isHistoryView = false,
            hasDelete = true,
            hasEdit = true,
            hasLogView = true,
            isReportView,
            lockProject,
            hasLock,
            showUploadDataModal,
            hasUpload
        } = this.props;
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name === "Dashboard" ? true : false;
        }
        return (
            <React.Fragment>
                <div className="tab-active fund-efci">
                    {this.renderMultiSelectionModal()}
                    <div className="otr-edit-delte col-md-12 text-right">
                        <div className={hasLock || hasUpload ? "otr-common-lck" : ""}>
                            <div className="lft ml-2">
                                {hasLock && (
                                    <LockUnlock locked={basicDetails.locked} lockProject={lockProject} partial_locked={basicDetails.partial_locked} />
                                )}
                                {hasUpload && (
                                    <button
                                        className="add-btn upload-button position-relative btn-bl-nw"
                                        title="Upload"
                                        onClick={() => showUploadDataModal()}
                                    >
                                        <i class="fas fa-upload"></i>
                                    </button>
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
                                {!isDashboardFiltered ? (
                                    <span
                                        onClick={() => {
                                            popBreadCrumpOnPageClose();
                                            history.push(findPrevPathFromBreadCrumpData() || (isReportView ? "/reports" : "/project"));
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
                                    <span onClick={() => handleDeleteItem(this.props.match.params.id)} className="edit-icn-bx">
                                        <i className="fas fa-trash-alt"></i> Delete
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="basic-dtl-otr">
                        {keys && keys.length
                            ? keys.map((keyItem, i) => {
                                  return keyItem !== "comments" ? (
                                      <React.Fragment key={i}>
                                          {section === "buildinginfo" && i === 0 ? (
                                              <div className="col-12 mt-3 addTxt">
                                                  <h3>
                                                      <div className="nme"> Basic Details</div>
                                                      <div className="line"></div>
                                                  </h3>
                                              </div>
                                          ) : null}
                                          <div key={i} className="col-md-4 basic-box">
                                              <div className="codeOtr">
                                                  <h4>{config[keyItem].label}</h4>
                                                  {keyItem === "client" || keyItem === "region" || keyItem === "site" || keyItem === "consultancy" ? (
                                                      <h3>{(basicDetails[keyItem] && basicDetails[keyItem].name) || "-"}</h3>
                                                  ) : keyItem === "regions" || keyItem === "sites" || keyItem === "projects" ? (
                                                      <h3 className="rgn">
                                                          {basicDetails[keyItem] && basicDetails[keyItem].length
                                                              ? basicDetails[keyItem].map((item, i) => (
                                                                    <React.Fragment key={i}>
                                                                        <span key={i} className="rg-txt">
                                                                            {item.name}
                                                                        </span>
                                                                        {i < basicDetails[keyItem].length - 1 ? (
                                                                            <span className="line-txt">|</span>
                                                                        ) : null}
                                                                    </React.Fragment>
                                                                ))
                                                              : null}
                                                      </h3>
                                                  ) : keyItem === "users" ? (
                                                      <div
                                                          class="custom-selecbox select-multi-box view-user"
                                                          onClick={() =>
                                                              this.setState({
                                                                  multiSelectionModalParams: {
                                                                      show: true,
                                                                      heading: "Consultancy Users",
                                                                      selectedValues: basicDetails[keyItem]
                                                                  }
                                                              })
                                                          }
                                                      >
                                                          <div class="badge-num"> {basicDetails[keyItem]?.length}</div>
                                                          <div class="badge-sub-txt">View Users</div>
                                                      </div>
                                                  ) : keyItem === "client_users" ? (
                                                      <div
                                                          class="custom-selecbox select-multi-box view-user"
                                                          onClick={() =>
                                                              this.setState({
                                                                  multiSelectionModalParams: {
                                                                      show: true,
                                                                      heading: "Client Users",
                                                                      selectedValues: basicDetails[keyItem]
                                                                  }
                                                              })
                                                          }
                                                      >
                                                          <div class="badge-num"> {basicDetails[keyItem]?.length}</div>
                                                          <div class="badge-sub-txt">View Users</div>
                                                      </div>
                                                  ) : keyItem === "color_code" ? (
                                                      <h3 className="d-flex align-items-center">
                                                          {basicDetails.color_code}
                                                          <span
                                                              className="color-box-common"
                                                              style={{
                                                                  background: basicDetails.color_code ? `${basicDetails?.color_code}` : "#fff"
                                                              }}
                                                          ></span>
                                                      </h3>
                                                  ) : (
                                                      <h3>{(basicDetails[keyItem] && basicDetails[keyItem]) || "-"}</h3>
                                                  )}
                                              </div>
                                          </div>
                                          {section === "recommendationsinfo" && i !== 0 && i % 6 === 0 ? <div className="col-12 mt-3"></div> : null}
                                          {section === "buildinginfo" && (i === 6 || i === 16) ? (
                                              <div className="col-12 mt-3 addTxt">
                                                  <h3>
                                                      <div className="nme">{i === 6 ? "More Details" : "Address"}</div>
                                                      <div className="line"></div>
                                                  </h3>
                                              </div>
                                          ) : null}
                                      </React.Fragment>
                                  ) : null;
                              })
                            : null}
                    </div>

                    <div className="col-md-12 otr-user-cmnt">
                        <div className={`col comment p-0`}>
                            <h3>Comments</h3>
                            <pre>
                                <div className="contDtl">{basicDetails.comments || "-"}</div>
                            </pre>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
