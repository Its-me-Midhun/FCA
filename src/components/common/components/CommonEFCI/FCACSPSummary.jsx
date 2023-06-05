import React, { Component } from "react";
import NumberFormat from "react-number-format";

class FCACSPSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {
            efciData,
            yearList,
            tableTitle,
            sortedDefeciency,
            totalRepairCost } = this.props;

        return (
            <>
                <table className="table table-common table-froze">
                    <thead>
                        <tr>
                            <th className="img-sq-box">
                                <img src="/img/sq-box.png" alt="" />
                            </th>
                            <th className="build-add">{tableTitle}</th>
                            {efciData.capital_spending_plans &&
                                efciData.capital_spending_plans &&
                                yearList.map((item, i) => (

                                    <th key={i} className="build-year">{item}</th>

                                ))}
                            <th className="action">Total Repair Costs</th>
                        </tr>
                    </thead>



                    <tbody>
                        <tr>
                            {sortedDefeciency && sortedDefeciency.length ? (
                                <>
                                    <td className="text-center">
                                        <img src="/img/sq-box.png" alt="" />
                                    </td>
                                    <td>{efciData.name || null}</td>
                                    {sortedDefeciency &&
                                        sortedDefeciency.length &&
                                        sortedDefeciency.map((item, i) => (
                                            <td key={i}>
                                                <NumberFormat
                                                    value={parseInt(item.amount || 0)}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                />
                                            </td>
                                        ))}
                                    <td>
                                        <span className="tot-dtl">
                                            {
                                                <NumberFormat
                                                    value={parseInt(totalRepairCost || 0)}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                />
                                            }
                                        </span>
                                    </td>
                                </>
                            ) : <td colSpan={13}> No data found.</td>}
                        </tr>
                    </tbody>
                </table>

            </>
        );
    }
}

export default FCACSPSummary;
