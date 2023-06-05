import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class CSPSite extends Component {

    setCapitalTotal() {
        let capitalTotal = 0;
        this.props.subTotalByYear &&
            this.props.subTotalByYear.map(element => (capitalTotal += parseInt(element.amount)));
        return capitalTotal;
    }

    render() {
        const {
            efciSiteData: { funding_options = [], capital_spending_plans },
            subTotalByYear
        } = this.props;

        let filteredData = uniqBy(
            capital_spending_plans &&
            capital_spending_plans.length &&
            capital_spending_plans[0].fundings, "year");
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
                                        {<NumberFormat
                                            prefix={"$ "}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            value={parseInt(data.amount)}
                                        />}
                                    </td>
                                ))}
                            <td>
                                {
                                    <NumberFormat
                                        prefix={"$ "}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        value={parseInt(this.setCapitalTotal())}
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

export default withRouter(CSPSite);
