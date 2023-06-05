import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class TopBar extends Component {
    render() {
        const { infoTabsData, handleTab } = this.props;
        return (
            <div className="tab-lnk">
                <ul>
                    {infoTabsData?.length
                        ? infoTabsData?.map(info => {
                              return (
                                  <li
                                      key={info.key}
                                      className={`cursor-pointer${this.props.match.params.tab === info.key ? " active" : ""}`}
                                      onClick={() => handleTab(info)}
                                  >
                                      {info.name}
                                  </li>
                              );
                          })
                        : null}
                </ul>
            </div>
        );
    }
}

export default withRouter(TopBar);
