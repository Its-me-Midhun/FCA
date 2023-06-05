import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { addToBreadCrumpData } from "../../../config/utils";

class InfoTabs extends Component {
    handleTabClick = async item => {
        const {
            history,
            match: {
                params: { section }
            }
        } = this.props;
        switch (item.key) {
            case "all":
                addToBreadCrumpData({
                    key: "all",
                    name: "Dashboard",
                    path: item.path
                });
                break;
            case "trade":
                addToBreadCrumpData({
                    key: "trade",
                    name: "Trade",
                    path: item.path
                });
                break;
            case "category":
                addToBreadCrumpData({
                    key: "category",
                    name: "Category",
                    path: item.path
                });
                break;
            case "building":
                addToBreadCrumpData({
                    key: "building",
                    name: "Building",
                    path: item.path
                });
                break;
            case "funding_source":
                addToBreadCrumpData({
                    key: "funding_source",
                    name: "Funding Source",
                    path: item.path
                });
                break;
            case "proprity":
                addToBreadCrumpData({
                    key: "proprity",
                    name: "Proprity",
                    path: item.path
                });
                break;
            case "regions":
                addToBreadCrumpData({
                    key: "info",
                    name: "Regions",
                    path: item.path
                });
                break;
            case "recommendations":
                addToBreadCrumpData({
                    key: "info",
                    name: "Recommendations",
                    path: item.path
                });
                break;
            case "buildings":
                addToBreadCrumpData({
                    key: "info",
                    name: "Buildings",
                    path: item.path
                });
                break;
            case "csp&efci":
                addToBreadCrumpData({
                    key: "csp&efci",
                    name: "CSP & EFCI",
                    path: item.path
                });
                break;
            case "settings":
                addToBreadCrumpData({
                    key: "info",
                    name: "Settings",
                    path: item.path
                });
                break;
            case "clients":
                addToBreadCrumpData({
                    key: "info",
                    name: "Clients",
                    path: item.path
                });
                break;
            default:
                addToBreadCrumpData({
                    key: "all",
                    name: "Dashboard",
                    path: item.path
                });
                break;
        }

        history.push(item.path);
    };

    render() {
        const { infoSubTabs } = this.props;
        return (
            <React.Fragment>
                <ul>
                    {infoSubTabs && infoSubTabs.length
                        ? infoSubTabs.map((info, i) => (
                              <li
                                  className={`${this.props.match.params.subTab === info.key ? "active" : null}`}
                                  onClick={() => this.handleTabClick(info)}
                              >
                                  {info.name}
                              </li>
                          ))
                        : null}
                </ul>
            </React.Fragment>
        );
    }
}

export default withRouter(InfoTabs);
