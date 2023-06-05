import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { addToBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrumpData } from "../../../config/utils";

class BasicDetails extends Component {
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
            permissions,
            logPermission,
            hasDelete = true,
            hasEdit = true,
            hasLogView = true
        } = this.props;
        return (
            <React.Fragment>
                <div className="tab-active">
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
                                    this.props.showEditPage(this.props.match.params.id);
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
                    <div className="basic-dtl-otr">
                        {keys && keys.length
                            ? keys.map((keyItem, i) => {
                                  return keyItem !== "users" && keyItem !== "comments" ? (
                                      <React.Fragment key={i}>
                                          {section === "buildinginfo" && i === 0 ? (
                                              <div className="col-12 mt-3 addTxt">
                                                  <h3>
                                                      <div class="nme"> Basic Details</div>
                                                      <div class="line"></div>
                                                  </h3>
                                              </div>
                                          ) : null}
                                          <div key={i} className="col-md-4 basic-box">
                                              <div className="codeOtr">
                                                  <h4>{config[keyItem].label}</h4>
                                                  {keyItem === "client" ||
                                                  keyItem === "consultancy" ||
                                                  keyItem === "region" ||
                                                  keyItem === "systems" ||
                                                  keyItem === "trades" ||
                                                  keyItem === "project" ||
                                                  keyItem === "site" ? (
                                                      <h3>{(basicDetails[keyItem] && basicDetails[keyItem].name) || "-"}</h3>
                                                  ) : keyItem === "regions" || keyItem === "sites" || keyItem === "projects" ? (
                                                      <h3 class="rgn">
                                                          {basicDetails[keyItem] && basicDetails[keyItem].length
                                                              ? basicDetails[keyItem].map((item, i) => (
                                                                    <>
                                                                        <span key={i} class="rg-txt">
                                                                            {item.name}
                                                                        </span>
                                                                        {i < basicDetails[keyItem].length - 1 ? (
                                                                            <span class="line-txt">|</span>
                                                                        ) : null}
                                                                    </>
                                                                ))
                                                              : null}
                                                      </h3>
                                                  ) : (
                                                      <h3>{basicDetails[keyItem] ? basicDetails[keyItem] : "-"}</h3>
                                                  )}
                                              </div>
                                          </div>
                                          {section === "recommendationsinfo" && i !== 0 && i % 6 === 0 ? <div className="col-12 mt-3"></div> : null}
                                          {section === "buildinginfo" && (i === 6 || i === 16) ? (
                                              <div className="col-12 mt-3 addTxt">
                                                  <h3>
                                                      <div class="nme">{i === 6 ? "More Details" : "Address"}</div>
                                                      <div class="line"></div>
                                                  </h3>
                                              </div>
                                          ) : null}
                                      </React.Fragment>
                                  ) : null;
                              })
                            : null}
                    </div>
                    <div className="col-md-12 otr-user-cmnt">
                        {basicDetails.users ? (
                            <div className="col-md-6 user">
                                <h3>Consultancy Users</h3>
                                <div className="col-md-12 cons-user">
                                    {basicDetails.users.length
                                        ? basicDetails.users.map((user, i) => (
                                              <span key={i} className="badge-otr">
                                                  <img src="/img/user-icon.png" alt="" />
                                                  <span className="nme">
                                                      {user.name}
                                                      {/* <span aria-hidden="true">×</span> */}
                                                  </span>
                                              </span>
                                          ))
                                        : "_"}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
