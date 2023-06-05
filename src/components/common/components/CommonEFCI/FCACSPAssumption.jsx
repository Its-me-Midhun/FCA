import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import NumberFormat from "react-number-format";

class FCACSPAssumption extends Component {
    state = {};

    renderSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
        let grandTotal = 0;
        let dataValues = Object.values(this.props.efciData.capital_spending_plans);
        let dataKeys = Object.keys(this.props.efciData.capital_spending_plans);
        if (dataKeys && dataKeys.length) {
            dataKeys.map(key => {
                this.props.efciData.capital_spending_plans[key] &&
                    this.props.efciData.capital_spending_plans[key].length &&
                    this.props.efciData.capital_spending_plans[key].forEach(row => {
                        obj.push(row);
                    });
            });
            let yearHolder = {};
            obj.forEach(function (d) {
                if (yearHolder.hasOwnProperty(d.year)) {
                    yearHolder[d.year] = yearHolder[d.year] + parseInt(d.amount);
                } else {
                    yearHolder[d.year] = parseInt(d.amount);
                }
            });

            for (let prop in yearHolder) {
                subTotalByYear.push({ year: prop, amount: yearHolder[prop] });
            }
        }
        subTotalByYear.map(yeatData => {
            grandTotal += yeatData.amount;
        });
        return subTotalByYear;
    }

    render() {
        const { efciData, yearList, setTotal } = this.props;

        let cspData = Object.values(efciData && efciData.capital_spending_plans);
        let subTotalByYear = this.renderSubTotalRow();
        let wholeTotal = 0;
        subTotalByYear.map(yearData => {
            wholeTotal += parseInt(yearData.amount);
        });

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
                            {yearList &&
                                yearList.length &&
                                yearList.map(data => (
                                    <>
                                        <th className="build-year">
                                            {data}
                                            <i className="fas fa-sort"></i>
                                        </th>
                                    </>
                                ))}
                            <th className="action">Total Repair Costs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cspData &&
                            cspData.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <img src="/img/sq-box.png" alt="" />
                                    </td>
                                    <td className="pos-otr">{item[index].title}</td>
                                    {_.orderBy(item, "year", "asc").map((data, i) =>
                                        data.title === "deficiencies" ? (
                                            <td key={i} className="pos-otr">
                                                <NumberFormat
                                                    className="cursor-notallowed"
                                                    value={parseInt(data.amount) || 0}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                />
                                            </td>
                                        ) : (
                                            <React.Fragment key={i}>
                                                <td className={data.edited ? "pos-table-otr pos-otr" : "pos-otr"}>
                                                    <div className="pos-sec">
                                                        <NumberFormat
                                                            displayType={this.props.disableClick ? "text" : "input"}
                                                            className={`form-control fc-no-dot ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                            value={
                                                                data.id === this.state.selectedColumn
                                                                    ? parseInt(data.percentage) || 0
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
                                                                    await this.props.handleCspSummary(data.id, value, data.title);
                                                                }
                                                            }}
                                                            onFocus={
                                                                this.props.disableClick
                                                                    ? null
                                                                    : async () =>
                                                                          await this.setState({
                                                                              onClick: true,
                                                                              selectedColumn: data.id,
                                                                              initialPercentage: data.percentage,
                                                                              currentKey: data.title
                                                                          })
                                                            }
                                                            onBlur={async () => {
                                                                await this.props.handleCspSummary(
                                                                    data.id,
                                                                    this.state.initialPercentage,
                                                                    this.state.currentKey
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
                                                                    await this.props.updateCspSummary(data.id, data.percentage);
                                                                    await this.setState({
                                                                        onClick: false,
                                                                        selectedColumn: null,
                                                                        initialPercentage: data.percentage
                                                                    });
                                                                    this.state.target.blur();
                                                                }
                                                            }}
                                                        />
                                                        {data.id === this.state.selectedColumn ? (
                                                            <i className="fas fa-times cursor-pointer"></i>
                                                        ) : null}
                                                        {data.edited ? (
                                                            <i
                                                                className="fa fa-circle cursor-hand"
                                                                aria-hidden="true"
                                                                onClick={() => this.props.showLog && this.props.showLog(data.id, "cspSummary")}
                                                            ></i>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </React.Fragment>
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
                                    <NumberFormat prefix={"$ "} displayType={"text"} thousandSeparator={true} value={parseInt(wholeTotal)} />
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}
export default FCACSPAssumption;
