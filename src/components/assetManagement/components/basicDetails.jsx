import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    findPrevPathFromBreadCrumpRecData,
    popBreadCrumpOnPageClose
} from "../../../config/utils";

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
            hasDelete = false,
            hasEdit = false,
            hasLogView = false,
            isReportView
        } = this.props;
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name === "Dashboard" ? true : false;
        }

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
                        {!isDashboardFiltered ? (
                            <span
                                onClick={() => {
                                    popBreadCrumpOnPageClose();
                                    history.push(findPrevPathFromBreadCrumpData() || "/energyManagement");
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
                    <div className="basic-dtl-otr">
                        {keys && keys.length
                            ? keys.map((keyItem, i) => {
                                  return keyItem !== "users" && keyItem !== "comments" ? (
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
                                                  ) : keyItem === "client_users" ? (
                                                      <h3 className="rgn">
                                                          {basicDetails[keyItem] && basicDetails[keyItem].length
                                                              ? basicDetails[keyItem].map((item, i) => (
                                                                    <React.Fragment key={i}>
                                                                        <span key={i} className="badge-otr">
                                                                            <img src={item.url ? item.url : "/img/user-icon.png"} alt="" />
                                                                            <span className="nme">{item.name}</span>
                                                                        </span>
                                                                        {i < basicDetails[keyItem].length - 1 ? (
                                                                            <span className="line-txt">|</span>
                                                                        ) : null}
                                                                    </React.Fragment>
                                                                ))
                                                              : null}
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
                        {basicDetails.users ? (
                            <div className="col-md-6 user">
                                <h3>Consultancy Users</h3>
                                <div className="col-md-12 cons-user">
                                    {basicDetails.users.length
                                        ? basicDetails.users.map((user, i) => (
                                              <span key={i} className="badge-otr">
                                                  <img src={user.url ? user.url : "/img/user-icon.png"} alt="" />
                                                  <span className="nme">{user.name}</span>
                                              </span>
                                          ))
                                        : "_"}
                                </div>
                            </div>
                        ) : null}
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
