import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { updateBreadCrumpData } from "../../../config/utils";

class BreadCrumbs extends Component {
    handleBreadCrumpsClick = async breadCrumbData => {
        await updateBreadCrumpData(breadCrumbData.index);
        breadCrumbData.path && this.props.history.push(breadCrumbData.path);
    };

    render() {
        const breadCrumbsData = JSON.parse(sessionStorage.getItem("bc-data"));
        const mainEntities = ["sites", "recommendations", "buildings", "floors", "regions", "clients", "consultancies", "documents"];

        return (
            <React.Fragment>
                <ul className="bread-crumb">
                    {breadCrumbsData && breadCrumbsData.length
                        ? breadCrumbsData.map((item, i) => {
                              return breadCrumbsData.length !== i + 1 ? (
                                  <li className="cursor-pointer" key={i} onClick={() => this.handleBreadCrumpsClick(item)}>
                                      <span
                                          className={
                                              item.key === "dashboard"
                                                  ? "main-entity dshb-menu"
                                                  : item.key === "main" || mainEntities.includes(item.name && item.name.toLowerCase())
                                                  ? "main-entity"
                                                  : breadCrumbsData[breadCrumbsData.length - 2] === breadCrumbsData[i]
                                                  ? "border-active active-col"
                                                  : ""
                                          }
                                      >
                                          {item.key === "dashboard" ? (
                                              <>
                                                  <i className="fa fa-home ml-0 mr-1"></i> {item && item.name}
                                              </>
                                          ) : (
                                              item && item.name
                                          )}
                                      </span>
                                      <i className="fas fa-chevron-right"></i>
                                  </li>
                              ) : (
                                  <li className="active cursor-pointer" key={i} onClick={() => this.handleBreadCrumpsClick(item)}>
                                      <span
                                          className={
                                              item.key === "dashboard"
                                                  ? " main-entity dshb-menu"
                                                  : item.key === "main" || mainEntities.includes(item.name && item.name.toLowerCase())
                                                  ? "main-entity"
                                                  : ""
                                          }
                                      >
                                          {item.key === "dashboard" ? (
                                              <>
                                                  <i className="fa fa-home ml-0 mr-1"></i> {item && item.name}
                                              </>
                                          ) : (
                                              item && item.name
                                          )}
                                      </span>
                                  </li>
                              );
                          })
                        : null}
                </ul>
            </React.Fragment>
        );
    }
}

export default withRouter(BreadCrumbs);
