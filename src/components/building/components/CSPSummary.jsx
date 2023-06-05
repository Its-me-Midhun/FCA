import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import NumberFormat from "react-number-format";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../../common/components/Loader";
import { withRouter } from "react-router-dom";

class CSPSummary extends Component {
    state = {
        totalRepairCost: null,
        subTotalByYear: [],
        selectedColumn: null,
        loading: true
    };

    componentDidMount() {
        this.setTotalRepairCost();
        this.renderSubTotalRow();
        this.setState({ loading: false });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setTotalRepairCost();
        }
    }

    setTotalRepairCost() {
        let totalRepairCost = 0;
        const { efciBuildingData } = this.props;
        console.log("efciBuildingData",efciBuildingData);
        efciBuildingData &&
            efciBuildingData.efcis &&
            efciBuildingData.efcis.length &&
            efciBuildingData.efcis.map(item => (totalRepairCost += parseInt(item.amount) || 0));
        // this.setState({ totalRepairCost: totalRepairCost });
        return totalRepairCost;
    }

    setTotal(data) {
        let total = 0;
        data.fundings.map(element => (total += parseInt(element.amount)));
        return total;
    }

    renderSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
        let grandTotal = 0;
        if (
            this.props.efciBuildingData &&
            this.props.efciBuildingData.capital_spending_plans &&
            this.props.efciBuildingData.capital_spending_plans.length
        ) {
            this.props.efciBuildingData.capital_spending_plans.forEach(function (row) {
                row.fundings &&
                    row.fundings.length &&
                    row.fundings.forEach(function (item) {
                        obj.push(item);
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
        const data = this.setTotalRepairCost();
        const { efciBuildingData = {}, updateCapitalSpendingPercent } = this.props;
        let grandTotal = 0;
        const subTotalByYear = this.renderSubTotalRow();
        subTotalByYear.map(yeatData => {
            grandTotal += yeatData.amount;
        });
        const { totalRepairCost } = this.state;
        let filteredData = uniqBy(
            efciBuildingData.capital_spending_plans &&
            efciBuildingData.capital_spending_plans.length &&
            efciBuildingData.capital_spending_plans[0].fundings,
            "year"
        );
        let sortByTitleData = _.orderBy(
            efciBuildingData.capital_spending_plans && efciBuildingData.capital_spending_plans.length && efciBuildingData.capital_spending_plans,
            "title",
            "asc"
        );

        return (
            <LoadingOverlay active={this.state.loading} spinner={<Loader />} fadeSpeed={10}>
                <>
                    <div className="table-topper efc-topr">
                        <div className="col-md-12 otr-topr">
                            <h3>Basic Building Information</h3>
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
                                            value={parseInt((efciBuildingData && efciBuildingData.area) || 0)}
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
                                            value={parseInt((efciBuildingData && efciBuildingData.cost) || 0)}
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
                                            value={parseInt(efciBuildingData.replacement_cost || 0)}
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
                                    <h4>{(efciBuildingData.csp_percentage && efciBuildingData.csp_percentage + "%") || 0 + "%"}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* add extra div 'custom-table-scroll' for scroll issue */}
                    <div className="custom-table-scroll">
                        <div className="table-topper efc-topr">
                            <div className="col-md-12 otr-topr d-flex">
                                <h3>FCA Capital Spending Plan Summary</h3>
                            </div>
                        </div>
                        <div className="table-section table-scroll build-fci fc-capital-nw build-efci">
                            <table className="table table-common-outer">
                                <tbody>
                                    <tr>
                                        <td>

                                            <table className="table table-common table-froze">
                                                <thead>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add">Building Name</th>
                                                        {efciBuildingData.efcis &&
                                                            efciBuildingData.efcis.length &&
                                                            efciBuildingData.efcis.map(item => (
                                                                <>
                                                                    <th className="build-year">{item.year}</th>
                                                                </>
                                                            ))}
                                                        <th className="action">Total Repair Costs</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {efciBuildingData.efcis && efciBuildingData.efcis.length ? (
                                                            <>
                                                                <td className="text-center">
                                                                    <img src="/img/sq-box.png" alt="" />
                                                                </td>
                                                                <td>{efciBuildingData.name || null}</td>
                                                                {efciBuildingData.efcis &&
                                                                    efciBuildingData.efcis.length &&
                                                                    efciBuildingData.efcis.map(item => (
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
                                                                                // value={parseInt(totalRepairCost || 0)}
                                                                                value={parseInt((data && data) || 0)}
                                                                                thousandSeparator={true}
                                                                                displayType={"text"}
                                                                                prefix={"$ "}
                                                                            />
                                                                        }
                                                                    </span>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <div>No data found</div>
                                                        )}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>

                            </table>
                        </div>

                        <div className="table-topper efc-topr">
                            <div className="col-md-12 otr-topr d-flex">
                                <h3>FCA Capital Spending Plan Assumptions</h3>
                            </div>
                        </div>
                        <div className="table-section table-scroll build-fci fc-capital-nw build-efci">
                            <table className="table table-common-outer">
                                <tbody>
                                    <tr>
                                        <td>

                                            <table className="table table-common table-froze">
                                                <thead>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add">
                                                            Title<i className="fas fa-sort"></i>
                                                        </th>
                                                        {efciBuildingData.capital_spending_plans &&
                                                            efciBuildingData.capital_spending_plans.length &&
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
                                                                                    className="cursor-notallowed"
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
                                                                                            id={data.id}
                                                                                            className={`${efciBuildingData.locked
                                                                                                ? "form-control fc-no-dot cursor-notallowed"
                                                                                                : "form-control fc-no-dot"
                                                                                                }`}
                                                                                            displayType={efciBuildingData.locked ? "text" : "input"}
                                                                                            value={
                                                                                                data.id === this.state.selectedColumn
                                                                                                    ? data.percentage || ""
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
                                                                                                    await this.props.updateFundingPercentage(data.id, value);
                                                                                                }
                                                                                            }}
                                                                                            onClick={async () =>
                                                                                                !efciBuildingData.locked
                                                                                                    ? await this.setState({
                                                                                                        onClick: true,
                                                                                                        selectedColumn: data.id,
                                                                                                        initialPercentage: data.percentage
                                                                                                    })
                                                                                                    : null
                                                                                            }
                                                                                            onBlur={async event => {
                                                                                                await this.props.updateFundingPercentage(
                                                                                                    data.id,
                                                                                                    this.state.initialPercentage
                                                                                                );
                                                                                                await this.setState({
                                                                                                    selectedColumn: null
                                                                                                    // initialPercentage: null
                                                                                                });
                                                                                            }}
                                                                                            onKeyPress={async event => {
                                                                                                if (event.key === "Enter") {
                                                                                                    await this.setState({
                                                                                                        target: event.target
                                                                                                    });
                                                                                                    await this.setState({ loading: true });
                                                                                                    await updateCapitalSpendingPercent(data.id, data.percentage);
                                                                                                    await this.setState({
                                                                                                        onClick: false,
                                                                                                        selectedColumn: null,
                                                                                                        initialPercentage: data.percentage,
                                                                                                        loading: false
                                                                                                    });
                                                                                                    this.state.target.blur();
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                        {data.id === this.state.selectedColumn ? (
                                                                                            <i
                                                                                                className="fas fa-times cursor-pointer"
                                                                                                onClick={event => {
                                                                                                    event.preventDefault();
                                                                                                    event.stopPropagation();
                                                                                                }}
                                                                                            ></i>
                                                                                        ) : null}
                                                                                        {data.edited ? (
                                                                                            <i
                                                                                                className="fa fa-circle cursor-hand"
                                                                                                aria-hidden="true"
                                                                                                onClick={() =>
                                                                                                    this.props.showLogsTableCSP && this.props.showLogsTableCSP(data.id)
                                                                                                }
                                                                                            ></i>
                                                                                        ) : null}
                                                                                    </div>
                                                                                </td>
                                                                            </>
                                                                        )
                                                                    )}
                                                                    <td>
                                                                        <span className="tot-dtl">
                                                                            {
                                                                                <NumberFormat
                                                                                    value={parseInt(this.setTotal(item) || 0)}
                                                                                    thousandSeparator={true}
                                                                                    displayType={"text"}
                                                                                    prefix={"$ "}
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
                                                                            value={parseInt(total.amount || 0)}
                                                                            thousandSeparator={true}
                                                                            displayType={"text"}
                                                                            prefix={"$ "}
                                                                        />
                                                                    </span>
                                                                </td>
                                                            ))}
                                                        <td>
                                                            <span className="tot-dl">
                                                                <NumberFormat value={parseInt(grandTotal)} thousandSeparator={true} displayType={"text"} prefix={"$ "} />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>

                            </table>
                        </div>
                    </div>
                </>
            </LoadingOverlay>
        );
    }
}
export default withRouter(CSPSummary);
