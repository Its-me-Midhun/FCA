import React, { Component } from "react";
import NumberFormat from "react-number-format";
import _, { uniqBy } from "lodash";

import { withRouter } from "react-router-dom";

class InitialFundingOptionsTable extends Component {
    setCapitalTotal(data) {
        let capitalTotal = 0;
        this.props.subTotalByYear && this.props.subTotalByYear.map(element => (capitalTotal += parseInt(element.amount)));
        return capitalTotal;
    }

    render() {
        const {
            efciBuildingData: { funding_options = [], capital_spending_plans },
            subTotalByYear
        } = this.props;

        let filteredData = uniqBy(capital_spending_plans && capital_spending_plans.length && capital_spending_plans[0].fundings, "year");
        return (
            <>
                <table className="table table-common table-froze">
                    <thead>
                        <tr>
                            <th className="img-sq-box">
                                <img src="/img/sq-box.png" alt="" />
                            </th>
                            <th className="build-add">
                                Title<i className="fas fa-sort"></i>
                            </th>
                            {funding_options.length &&
                                funding_options[0].annual_efcis &&
                                filteredData.map(item => (
                                    <th className="build-year">
                                        {item.year} <i className="fas fa-sort"></i>
                                    </th>
                                ))}
                            <th className="action">Total Repair Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">
                                <img src="/img/sq-box.png" alt="" />
                            </td>
                            <td className="pos-otr">{"Deficiencies"}</td>
                            {subTotalByYear &&
                                subTotalByYear.map(data => (
                                    <td>
                                        {<NumberFormat value={parseInt(data.amount)} thousandSeparator={true} displayType={"text"} prefix={"$ "} />}
                                    </td>
                                ))}
                            <td>
                                {
                                    <NumberFormat
                                        value={parseInt(this.setCapitalTotal())}
                                        thousandSeparator={true}
                                        displayType={"text"}
                                        prefix={"$ "}
                                    />
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(InitialFundingOptionsTable);
