import React from "react";
import NumberFormat from "react-number-format";
import ReactTooltip from "react-tooltip";
function Widget({ widgetData, history }) {
    return (
        <div className="build-stati cursor-pointer" onClick={() => history.push("/dashboard")}>
            <ReactTooltip id="landing_page" />
            <div
                className="cursor-hand"
                data-delay-show="500"
                data-tip={`Go To FCA Dashboard`}
                data-effect="solid"
                data-for="landing_page"
                data-place="right"
                data-background-color="#007bff"
            >
                <h3>FCA Statistics</h3>
                <div className="static-form d-flex flex-wrap">
                    <div className="form-inp col-6 p-0">
                        <label>Total CSP</label>
                        <NumberFormat
                            value={parseFloat((widgetData?.total_csp || 1) / 1000000).toFixed(2)}
                            suffix={"M"}
                            thousandSeparator={true}
                            className="form-control"
                            placeholder="Total CSP"
                            displayType={"text"}
                            prefix={"$ "}
                        />
                    </div>
                    <div className="form-inp col-6 p-0  pl-2">
                        <label>Total SF</label>
                        <NumberFormat
                            value={widgetData?.total_sf || 0}
                            thousandSeparator={true}
                            className="form-control"
                            placeholder="Total SF"
                            displayType={"text"}
                        />
                    </div>
                    <div className="form-inp col-6 p-0">
                        <label>Total CRV</label>
                        <NumberFormat
                            value={parseFloat((widgetData?.total_replacement_cost || 1) / 1000000).toFixed(2)}
                            suffix={"M"}
                            thousandSeparator={true}
                            className="form-control"
                            placeholder="Total CRV"
                            displayType={"text"}
                            prefix={"$ "}
                        />
                    </div>
                    <div className="form-inp col-6 p-0 pl-2">
                        <label>Recommendations</label>
                        <input style={{ cursor: "pointer" }} type="text" readOnly value={widgetData?.recommendations || 0} className="form-control" />
                    </div>
                    <div className="form-inp col-6 p-0">
                        <label>FCA Projects</label>
                        <input style={{ cursor: "pointer" }} type="text" readOnly value={widgetData?.projects || 0} className="form-control" />
                    </div>
                    <div className="form-inp col-6 p-0 pl-2">
                        <label>Regions</label>
                        <input style={{ cursor: "pointer" }} type="text" readOnly value={widgetData?.regions || 0} className="form-control" />
                    </div>
                    <div className="form-inp col-6 p-0">
                        <label>Sites</label>
                        <input style={{ cursor: "pointer" }} type="text" readOnly value={widgetData?.sites || 0} className="form-control" />
                    </div>
                    <div className="form-inp col-6 p-0 pl-2">
                        <label>Bulidings</label>
                        <input style={{ cursor: "pointer" }} type="text" readOnly value={widgetData?.buildings || 0} className="form-control" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Widget;
