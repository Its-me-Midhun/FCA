import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import NumberFormat from "react-number-format";

class CSPAssumptions extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {
            setTotal,
            grandTotal,
            filteredData,
            efciSiteData,
            subTotalByYear,
            sortByTitleData } = this.props;
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
                            {efciSiteData.capital_spending_plans &&
                                efciSiteData.capital_spending_plans.length &&
                                filteredData.map(data => (
                                    <>
                                        <th className="build-year">
                                            {data.year}
                                            <i className="fas fa-sort"></i>
                                        </th>
                                    </>
                                ))}
                            <th className="action">Total Repair Costs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortByTitleData &&
                            sortByTitleData.map(item => (
                                <>
                                    <tr>
                                        <td className="text-center">
                                            <img src="/img/sq-box.png" alt="" />
                                        </td>
                                        <td className="pos-otr">{item.title}</td>
                                        {uniqBy(item.fundings, "year").map(data =>
                                            item.title === "deficiencies" ? (
                                                <td className="pos-otr">
                                                    <NumberFormat
                                                        className={`form-control fc-no-dot ${this.props.efciSiteData && this.props.efciSiteData.locked ? "cursor-notallowed" : ""}`}
                                                        value={parseInt(data.amount) || 0}
                                                        thousandSeparator={true}
                                                        displayType={"text"}
                                                        prefix={"$ "}
                                                    />
                                                </td>
                                            ) : (
                                                <>
                                                    <td className={data.edited ? "pos-table-otr pos-otr" : "pos-otr"}>
                                                        <div className="pos-sec">
                                                            <NumberFormat
                                                                className={`form-control fc-no-dot ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                                displayType={this.props.disableClick ? "text" : "input"}
                                                                value={
                                                                    data.id === this.state.selectedColumn
                                                                        ? data.percentage || 0
                                                                        : data.amount
                                                                            ? parseInt(data.amount)
                                                                            : ""
                                                                }
                                                                thousandSeparator={true}
                                                                suffix={data.id === this.state.selectedColumn ? " %" : ""}
                                                                prefix={data.id === this.state.selectedColumn ? "" : "$ "}
                                                                onValueChange={async values => {
                                                                    const { value } = values;
                                                                    if (data.percentage !== value && parseFloat(value) <= 1000) {
                                                                        await this.props.updatePercentage(data.id, value);
                                                                    }
                                                                }}
                                                                onClick={this.props.disableClick ? null : async () =>
                                                                    await this.setState({
                                                                        onClick: true,
                                                                        selectedColumn: data.id,
                                                                        initialPercentage: data.percentage
                                                                    })
                                                                }

                                                                // onFocus={async () => {
                                                                //     await this.setState({
                                                                //         onClick: true,
                                                                //         selectedColumn: data.id,
                                                                //         initialPercentage: data.percentage
                                                                //     })
                                                                // }}

                                                                onBlur={async () => {
                                                                    await this.props.updatePercentage(
                                                                        data.id,
                                                                        this.state.initialPercentage
                                                                    );
                                                                    await this.setState({
                                                                        selectedColumn: null
                                                                    });
                                                                }}
                                                                onKeyPress={async event => {
                                                                    if (event.key === "Enter") {
                                                                        await this.setState({
                                                                            target: event.target
                                                                        });
                                                                        // await this.setState({ loading: true });
                                                                        await this.props.toggleLoader(true);
                                                                        await this.props.updateSiteCapitalSpending(data.id, data.percentage);
                                                                        await this.props.toggleLoader(false);
                                                                        await this.setState({
                                                                            onClick: false,
                                                                            selectedColumn: null,
                                                                            initialPercentage: data.percentage,
                                                                            loading: false
                                                                        });

                                                                    }
                                                                }}
                                                            />
                                                            {data.id === this.state.selectedColumn ? (
                                                                <i className="fas fa-times cursor-pointer"></i>
                                                            ) : null}
                                                            {data.edited ? <i className="fa fa-circle cursor-hand" aria-hidden="true"
                                                                onClick={() => this.props.showLogsCSP && this.props.showLogsCSP(data.id)}
                                                            ></i> : null}
                                                        </div>
                                                    </td>
                                                </>
                                            )
                                        )}
                                        <td>
                                            <span className="tot-dtl">
                                                {
                                                    <NumberFormat
                                                        prefix={"$ "}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                        value={parseInt(setTotal(item) || 0)}
                                                    />
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                </>
                            ))}

                        <tr className="subtotal">
                            <td className="text-center">
                                <img src="/img/sq-box.png" alt="" />
                            </td>
                            <td className="tot-dl">Total All Costs</td>
                            {subTotalByYear &&
                                subTotalByYear.length &&
                                subTotalByYear.map(total => (
                                    <td>
                                        <span className="tot-dtl">
                                            <NumberFormat
                                                prefix={"$ "}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                value={parseInt(total.amount || 0)}
                                            />
                                        </span>
                                    </td>
                                ))}
                            <td>
                                <span className="tot-dl">
                                    <NumberFormat
                                        prefix={"$ "}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        value={parseInt(grandTotal)}
                                    />
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </>
        );
    }
}
export default CSPAssumptions;
