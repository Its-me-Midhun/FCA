import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class FinalFundingOptionBuildingSite extends Component {

    render() {
        const {
            efciSiteData: { funding_options = [] }
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
                                                    prefix={"$ "}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    value={parseInt((item && item.actual_cost) || 0)}
                                                />
                                            }
                                        </td>
                                        <td>
                                            {
                                                <NumberFormat
                                                    prefix={"$ "}
                                                    className={
                                                        parseInt(item.expected_cost - item.actual_cost) >= 0 ? "fc-no-dot" : "fc-no-dot fc-neg"
                                                    }
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    value={parseInt(item.expected_cost - item.actual_cost || 0)}
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

export default withRouter(FinalFundingOptionBuildingSite);
