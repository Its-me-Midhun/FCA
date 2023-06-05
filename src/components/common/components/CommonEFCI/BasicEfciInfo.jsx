import React, { Component } from "react";
import NumberFormat from "react-number-format";

class BasicEfciInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { efciData } = this.props;
        return (
            <>
                <div className="table-topper efc-topr">
                    <div className="col-md-12 otr-topr">
                        <h3>Basic Site Information</h3>
                    </div>
                </div>
                <div className="basic-info">
                    <div className="col-md-3 basic-info-otr">
                        <div className="col-md-12 basic-info-inner">
                            <div className="img-basic">
                                <img src="/img/total-sf.png" alt="" />
                            </div>
                            <div className="txt-basic">
                                <h3>Total SF</h3>
                                <h4>
                                    <NumberFormat
                                        value={parseInt((efciData && efciData.area) || 0)}
                                        thousandSeparator={true}
                                        displayType={"text"}
                                    />
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 basic-info-otr">
                        <div className="col-md-12 basic-info-inner">
                            <div className="img-basic">
                                <img src="/img/sf-cost-icon.PNG" alt="" />
                            </div>
                            <div className="txt-basic">
                                <h3>$/SF</h3>
                                <h4>
                                    <NumberFormat
                                        value={parseInt((efciData && efciData.cost) || 0)}
                                        thousandSeparator={true}
                                        displayType={"text"}
                                        prefix={"$ "}
                                    />
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 basic-info-otr">
                        <div className="col-md-12 basic-info-inner">
                            <div className="img-basic">
                                <img src="/img/rep-value-icon.PNG" alt="" />
                            </div>
                            <div className="txt-basic">
                                <h3>Replacement Value</h3>
                                <h4>
                                    <NumberFormat
                                        value={parseInt(efciData.replacement_cost || 0)}
                                        thousandSeparator={true}
                                        displayType={"text"}
                                        prefix={"$ "}
                                    />
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 basic-info-otr">
                        <div className="col-md-12 basic-info-inner">
                            <div className="img-basic">
                                <img src="/img/csp-value-icon.PNG" alt="" />
                            </div>
                            <div className="txt-basic">
                                <h3>CSP Value</h3>
                                <h4>{(efciData.csp_percentage && efciData.csp_percentage + "%") || 0 + "%"}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default BasicEfciInfo;
