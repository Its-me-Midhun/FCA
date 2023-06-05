import React, { Component } from "react";
import NumberFormat from "react-number-format";

class CSPSummaryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { efciSiteData, totalRepairCost } = this.props;
        return (
            <>


                <table className="table table-common table-froze">
                    <thead>
                        <tr>
                            <th className="img-sq-box">
                                <img src="/img/sq-box.png" alt="" />
                            </th>
                            <th className="build-add">Site Name</th>
                            {efciSiteData.efcis &&
                                efciSiteData.efcis.length &&
                                efciSiteData.efcis.map(item => (
                                    <>
                                        <th className="build-year">{item.year}</th>
                                    </>
                                ))}
                            <th className="action">Total Repair Costs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {efciSiteData.efcis && efciSiteData.efcis.length ? (
                                <>
                                    <td className="text-center">
                                        <img src="/img/sq-box.png" alt="" />
                                    </td>
                                    <td>{efciSiteData.name || null}</td>
                                    {efciSiteData.efcis &&
                                        efciSiteData.efcis.length &&
                                        efciSiteData.efcis.map(item => (
                                            <td>
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
                            ) : ("")}
                        </tr>
                    </tbody>
                </table>

            </>
        );
    }
}

export default CSPSummaryTable;
