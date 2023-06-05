import React from "react";
import { withRouter } from "react-router-dom";

import NumberFormat from "react-number-format";
import _ from "lodash";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import dashboardAction from "../../dashboard/actions";
class SidePanel extends React.Component {
    render() {
        const { sidePanelValues, totalCsp, filterValues, activeSection, activeBuildingType } = this.props;
        let disableButton = sidePanelValues && sidePanelValues.project_ids && sidePanelValues.project_ids.length === 1 ? false : true;
        return (
            <>
                <div className="dash-side">
                    <ReactTooltip id="filter-icons" />

                    <div className="bld-brk">
                        <div className="table-sec">
                            <div className="head">
                                <h2>Building Statistics</h2>
                            </div>
                            <div className="list-ara">
                                <div className="lst">
                                    <div className="sm-hed">Total CSP</div>

                                    <div className="val-hed">
                                        <span>
                                            {sidePanelValues ? (
                                                <NumberFormat
                                                    value={parseFloat((totalCsp ? totalCsp : 1) / 1000000).toFixed(2)}
                                                    suffix={"M"}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                />
                                            ) : (
                                                0
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="lst">
                                    <div className="sm-hed">Total SF</div>
                                    <div className="val-hed">
                                        <span>
                                            {sidePanelValues ? (
                                                <NumberFormat
                                                    value={sidePanelValues.total_sf ? sidePanelValues.total_sf : 0}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                />
                                            ) : (
                                                0
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="lst">
                                    <div className="sm-hed">Total CRV</div>
                                    <div className="val-hed">
                                        <span>
                                            {sidePanelValues ? (
                                                <NumberFormat
                                                    value={parseFloat(
                                                        (sidePanelValues.total_replacement_cost ? sidePanelValues.total_replacement_cost : 1) /
                                                            1000000
                                                    ).toFixed(2)}
                                                    suffix={"M"}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                />
                                            ) : (
                                                0
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        !disableButton && sidePanelValues.recommendations
                                            ? activeSection === "recommendation"
                                                ? "lst cursor-pointer active-sectn"
                                                : "lst cursor-pointer "
                                            : "lst"
                                    }`}
                                    data-delay-show="500"
                                    data-tip={`Click To View Recommendations`}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="right"
                                    data-background-color="#007bff"
                                    onClick={!disableButton && sidePanelValues.recommendations ? () => this.props.handleRecommentationView() : null}
                                >
                                    <div>
                                        <div className="sm-hed">Recommendations</div>
                                        <div className="val-hed">
                                            <span>
                                                {sidePanelValues ? (
                                                    <NumberFormat
                                                        value={sidePanelValues.recommendations ? sidePanelValues.recommendations : 0}
                                                        thousandSeparator={true}
                                                        displayType={"text"}
                                                    />
                                                ) : (
                                                    0
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="list-ara mt-2">
                                <div
                                    className={`${
                                        !disableButton && sidePanelValues.projects
                                            ? activeSection === "project"
                                                ? "lst cursor-pointer d-flex active-sectn"
                                                : "lst cursor-pointer d-flex"
                                            : "lst d-flex"
                                    }`}
                                    data-delay-show="500"
                                    data-tip={!disableButton && sidePanelValues.projects !== 0 ? `Click To View Projects` : ""}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="bottom"
                                    data-background-color="#007bff"
                                    onClick={
                                        !disableButton && sidePanelValues.projects !== 0 ? () => this.props.handleView("projects", "Projects") : null
                                    }
                                >
                                    <div className="cursor-hand">
                                        <div className="sm-hed mr-2 flex-grow-1">FCA Projects</div>
                                        <div className="val-hed">{sidePanelValues ? sidePanelValues.projects : 0}</div>
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        !disableButton && sidePanelValues.regions !== 0
                                            ? activeSection === "region"
                                                ? "lst cursor-pointer d-flex active-sectn"
                                                : "lst cursor-pointer d-flex"
                                            : "lst d-flex"
                                    }`}
                                    data-delay-show="500"
                                    data-tip={`Click To View Regions `}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="right"
                                    data-background-color="#007bff"
                                    onClick={!disableButton && sidePanelValues.regions !== 0 ? () => this.props.handleRegionView() : null}
                                >
                                    <div>
                                        <div
                                            className="sm-hed mr-2 flex-grow-1"
                                            onClick={() => this.props.handleView("regions", "Regions", { region_ids: sidePanelValues.region_ids })}
                                        >
                                            Regions
                                        </div>
                                        <div className="val-hed">{sidePanelValues ? sidePanelValues.regions : 0}</div>
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        !disableButton && sidePanelValues.sites !== 0
                                            ? activeSection === "site"
                                                ? "lst cursor-pointer d-flex active-sectn"
                                                : "lst cursor-pointer d-flex"
                                            : "lst d-flex"
                                    }`}
                                    data-delay-show="500"
                                    data-tip={`Click To View Sites `}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="bottom"
                                    data-background-color="#007bff"
                                    onClick={!disableButton && sidePanelValues.sites !== 0 ? () => this.props.handleSiteView() : null}
                                >
                                    <div>
                                        <div className="sm-hed mr-2 flex-grow-1">Sites</div>
                                        <div className="val-hed">{sidePanelValues ? sidePanelValues.sites : 0}</div>
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        !disableButton && sidePanelValues.buildings !== 0
                                            ? activeSection === "building"
                                                ? "lst cursor-pointer d-flex active-sectn"
                                                : "lst cursor-pointer d-flex"
                                            : "lst d-flex"
                                    }`}
                                    data-delay-show="500"
                                    data-tip={`Click To View Buildings `}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="right"
                                    data-background-color="#007bff"
                                    onClick={!disableButton && sidePanelValues.buildings !== 0 ? () => this.props.handleBuildingView() : null}
                                >
                                    <div>
                                        <div className="sm-hed mr-2 flex-grow-1" onClick={() => this.props.handleBuildingView()}>
                                            Bulidings
                                        </div>
                                        <div className="val-hed">{sidePanelValues ? sidePanelValues.buildings : 0}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={!_.isEmpty(filterValues) ? "bld-brk scrol-side" : "bld-brk"}>
                        <div className="table-sec">
                            <div className="head">
                                <h2>Building Breakdown ({sidePanelValues ? sidePanelValues.buildings : 0})</h2>
                            </div>
                            <div className="list-ara bid-break ">
                                {sidePanelValues &&
                                    sidePanelValues.building_types &&
                                    Object.keys(sidePanelValues.building_types)
                                        .sort()
                                        .map(test => {
                                            return (
                                                <div
                                                    className={`${
                                                        !disableButton
                                                            ? activeSection === test
                                                                ? "lst cursor-pointer active-sectn"
                                                                : "lst cursor-pointer"
                                                            : "lst"
                                                    }`}
                                                    data-delay-show="500"
                                                    data-tip={activeBuildingType === test ? `` : `Click To View Selected Building Types`}
                                                    data-effect="solid"
                                                    data-for="filter-icons"
                                                    data-place="right"
                                                    data-background-color="#007bff"
                                                    key={test}
                                                >
                                                    <div>
                                                        <div
                                                            onClick={
                                                                !disableButton
                                                                    ? async e =>
                                                                          await this.props.handleBuildingType(
                                                                              sidePanelValues.building_types[test],
                                                                              test,
                                                                              e
                                                                          )
                                                                    : null
                                                            }
                                                        >
                                                            <div className="sm-hed">{test}</div>

                                                            <div className="val-hed">{sidePanelValues.building_types[test].length}</div>
                                                        </div>

                                                        {activeBuildingType === test ? (
                                                            <button
                                                                type="button"
                                                                class="close"
                                                                data-dismiss="modal"
                                                                aria-label="Close"
                                                                onClick={e => this.props.clearBuildingFilter(e, test)}
                                                            >
                                                                <div
                                                                    className="cursor-hand"
                                                                    data-delay-show="500"
                                                                    data-tip={`Clear Building Types `}
                                                                    data-effect="solid"
                                                                    data-for="filter-icons"
                                                                    data-place="right"
                                                                    data-background-color="#007bff"
                                                                >
                                                                    <span aria-hidden="true">
                                                                        <img src="/img/close.svg" alt="" />
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            );
                                        })}
                            </div>
                        </div>
                    </div>
                    {!_.isEmpty(filterValues) ? (
                        <div className="tag-ara">
                            <div className={"tag-scrol"}>
                                {Object.values(filterValues).map((f, key) => {
                                    return f.name !== "Years" ? (
                                        f.value && f.value.length ? (
                                            <>
                                                <span className="tag active">{f.name} </span>
                                                {f.value.map(item => {
                                                    return (
                                                        <span className="tag">
                                                            {item}
                                                            {/* <button
                                            type="button"
                                            class="close"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={(e) => this.props.handleClearFilterData(f,item)}
                                        >
                                            <span aria-hidden="true">
                                                <img src="/img/close.svg" alt="" />
                                            </span>
                                        </button> */}
                                                        </span>
                                                    );
                                                })}
                                                <br />
                                            </>
                                        ) : null
                                    ) : (
                                        <>
                                            <span className="tag active">{f.name} </span>
                                            <span className="tag">
                                                Start : {f.value.start}
                                                {/* <button
                                        type="button"
                                        class="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        onClick={(e) => this.props.handleClearFilterData(filterValues[f])}
                                    >
                                        <span aria-hidden="true">
                                            <img src="/img/close.svg" alt="" />
                                        </span>
                                    </button>  */}
                                            </span>
                                            <span className="tag">
                                                End : {f.value.end}
                                                {/* <button
                                                type="button"
                                                class="close"
                                                data-dismiss="modal"
                                                aria-label="Close"
                                                onClick={(e) => this.props.handleClearFilterData(filterValues[f])}
                                            >
                                                <span aria-hidden="true">
                                                    <img src="/img/close.svg" alt="" />
                                                </span>
                                            </button>  */}
                                            </span>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}
                </div>
            </>
        );
    }
}
const mapStateToProps = state => {
    const { dashboardReducer } = state;
    return { dashboardReducer };
};
export default withRouter(
    connect(mapStateToProps, {
        ...dashboardAction
    })(SidePanel)
);
