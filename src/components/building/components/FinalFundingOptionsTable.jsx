import React, { Component } from "react";
import NumberFormat from "react-number-format";
import _, { uniqBy } from "lodash";

import { withRouter } from "react-router-dom";

class InitialFundingOptionsTable extends Component {
    render() {
        const {
            efciBuildingData: { funding_options = [] }
        } = this.props;

        return (
            <>
                <table className="table table-common">
                    <thead>
                        <tr>
                            <th className="img-sq-box">
                                <img src="/img/sq-box.png" alt="" />
                            </th>
                            <th className="act-fund"> Actual Funding</th>
                            <th className="fund-vari"> Funding Variance</th>
                            <th className="efci-fund"> EFCI </th>
                        </tr>
                    </thead>
                    <tbody>
                        {funding_options.length &&
                            uniqBy(funding_options, "funding").map(item => (
                                <>
                                    <tr>
                                        <td className="text-center">
                                            <img src="/img/sq-box.png" alt="" />
                                        </td>
                                        <td>
                                            {
                                                <NumberFormat
                                                    value={parseInt((item && item.actual_cost) || 0)}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                />
                                            }
                                        </td>
                                        <td>
                                            {
                                                <NumberFormat
                                                    className={
                                                        parseInt(item.expected_cost - item.actual_cost) >= 0 ? "fc-no-dot" : "fc-no-dot fc-neg"
                                                    }
                                                    value={parseInt(item.expected_cost - item.actual_cost || 0)}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                />
                                            }
                                        </td>

                                        <td class={`${item.actual_color ? "text-light" : ""}`} style={{ backgroundColor: `${item.actual_color || ""}` }}>{item && item.actual_efci}</td>
                                    </tr>
                                </>
                            ))}
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(InitialFundingOptionsTable);
