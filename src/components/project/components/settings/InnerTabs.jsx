import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { addToBreadCrumpData } from "../../../../config/utils";

class InnerTabs extends Component {
    handleTabClick = async item => {
        const { history } = this.props;
        addToBreadCrumpData({
            key: "info",
            name: item.name,
            path: item.path,
            isInnerTab: true
        });
        history.push(item.path);
    };

    lockIcon(basicDetails) {
        return (
            <div className={`${basicDetails === true ? "locking-center locked" : "locking-center unlocked"}`}>
                {this.props.lockloading1 || this.props.lockloading ? (
                    <span className="spinner-border spinner-border-sm pl-2" role="status"></span>
                ) : (
                    <img src="/img/lock-whi.svg" alt="" className="export" />
                )}
            </div>
        );
    }

    unlockIcon(basicDetails) {
        return (
            <div className={`${basicDetails === true ? "locking-center locked" : "locking-center unlocked"} `}>
                {this.props.lockloading1 || this.props.lockloading ? (
                    <span className="spinner-border spinner-border-sm pl-2" role="status"></span>
                ) : (
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="17.064px"
                        height="15.289px"
                        viewBox="0 0.147 17.064 15.289"
                        enableBackground="new 0 0.147 17.064 15.289"
                        xmlSpace="preserve"
                    >
                        <g>
                            <g>
                                <path
                                    fill="none"
                                    d="M1.123,8.031v5.6c0.001,0.375,0.308,0.682,0.684,0.683h7.467c0.375-0.001,0.682-0.308,0.684-0.683v-5.6
C9.957,7.653,9.649,7.345,9.274,7.345H1.807C1.43,7.346,1.123,7.654,1.123,8.031z M5.54,8.09c0.994,0.001,1.805,0.811,1.807,1.804
c0,0.8-0.525,1.473-1.246,1.71v1.403C6.099,13.32,5.847,13.57,5.54,13.57H5.537c-0.309-0.001-0.56-0.254-0.558-0.563v-1.403
c-0.72-0.236-1.245-0.909-1.245-1.708C3.734,8.9,4.544,8.09,5.54,8.09z"
                                />
                                <circle fill="none" cx="5.54" cy="9.897" r="0.684" />
                                <path
                                    fill="#707070"
                                    d="M0,8.029v5.602c0.001,0.995,0.811,1.805,1.806,1.806h7.468c0.994-0.001,1.805-0.811,1.806-1.806V8.028
c-0.001-0.797-0.524-1.469-1.245-1.705H1.241C0.523,6.563,0.001,7.232,0,8.029z M9.274,7.345c0.375,0,0.683,0.308,0.684,0.686v5.6
c-0.002,0.375-0.309,0.682-0.684,0.683H1.807c-0.376-0.001-0.683-0.308-0.684-0.683v-5.6c0-0.377,0.307-0.685,0.684-0.686H9.274z"
                                />
                                <path
                                    fill="#707070"
                                    d="M4.979,11.604v1.403c-0.002,0.309,0.249,0.562,0.558,0.563H5.54c0.307,0,0.559-0.25,0.561-0.563v-1.403
c0.721-0.237,1.246-0.91,1.246-1.71C7.345,8.901,6.534,8.091,5.54,8.09c-0.996,0-1.806,0.81-1.806,1.806
C3.734,10.695,4.259,11.367,4.979,11.604z M5.54,9.213c0.377,0,0.684,0.307,0.684,0.682c0,0.377-0.308,0.685-0.684,0.686
c-0.376-0.001-0.683-0.308-0.683-0.685C4.857,9.52,5.164,9.213,5.54,9.213z"
                                />
                            </g>
                            <path
                                fill="#707070"
                                d="M9.596,4.442c0-1.749,1.424-3.173,3.173-3.173c1.75,0,3.173,1.423,3.173,3.173v1.881h1.123V4.442
c-0.003-2.365-1.93-4.292-4.295-4.295c-2.366,0.003-4.292,1.93-4.295,4.295v1.881h1.121V4.442z"
                            />
                        </g>
                    </svg>
                )}
            </div>
        );
    }
    render() {
        const { infoTabsData, basicDetails } = this.props;
        return (
            <React.Fragment>
                <ul className={this.props.isTabClass ? "tab-data" : null}>
                    {infoTabsData && infoTabsData.length
                        ? infoTabsData.map((item, i) => {
                              {
                                  let show = true;
                                  if (item.hasOwnProperty("show")) {
                                      show = item.show;
                                  }
                                  return (
                                      show && (
                                          <li
                                              className={`cursor-pointer ${this.props.match.params.subTab === item.key ? "active" : ""}`}
                                              key={i}
                                              onClick={() => this.handleTabClick(item)}
                                          >
                                              {item.name}
                                          </li>
                                      )
                                  );
                              }
                          })
                        : null}
                </ul>
                {basicDetails && basicDetails ? (
                    <div className="lock-main">
                        {basicDetails && basicDetails.locked === true ? this.lockIcon(basicDetails.locked) : this.unlockIcon(basicDetails.locked)}
                    </div>
                ) : (
                    ""
                )}
            </React.Fragment>
        );
    }
}

export default withRouter(InnerTabs);
