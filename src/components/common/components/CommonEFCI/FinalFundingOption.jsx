import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class FinalFundingOption extends Component {
    getFundingVarience = (total, actual) => {
        let data = 0;
        data = total - actual;
        return data;
    };
    render() {
        const {
            efciData: { funding_options = [], actual_fcis },
            actualFunding,
            totalCost,
            setColor
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
                        {funding_options.length ? (
                            funding_options.map((item, index) => (
                                <React.Fragment key={index}>
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
                                                    value={parseInt(actualFunding[index]) || 0}
                                                />
                                            }
                                        </td>
                                        <td>
                                            {
                                                <NumberFormat
                                                    prefix={"$ "}
                                                    className={`${this.getFundingVarience(
                                                        totalCost && totalCost[index],
                                                        actualFunding && actualFunding[index]
                                                    ) >= 0
                                                            ? "fc-no-dot"
                                                            : "fc-no-dot fc-neg"
                                                        }`}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    value={
                                                        this.getFundingVarience(
                                                            totalCost && totalCost[index],
                                                            actualFunding && actualFunding[index]
                                                        ) || 0
                                                    }
                                                />
                                            }
                                        </td>

                                        <td
                                            className={`${setColor(actual_fcis[index].value) ? "text-light" : ""}`}
                                            style={{ backgroundColor: `${setColor(actual_fcis[index].value) || ""}` }}
                                        >
                                            {actual_fcis[index].value}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                        ) : (
                                <td colSpan={4}>No data found</td>
                            )}
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(FinalFundingOption);
