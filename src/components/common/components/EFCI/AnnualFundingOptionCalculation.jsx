import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class AnnualFundingOptionCalculation extends Component {
    state = {
        selectedCell: null,
        initialCellAmount: null
    };

    setTotal(data) {
        let total = 0;
        data.annual_funding_options.map(element => (total += parseInt(element.amount)));
        return total;
    }

    render() {
        const {
            efciSiteData: { funding_options = [], capital_spending_plans = [] },
            updateAnnualFundingOptionCalculation,
            toggleLoader,
            updateAnnualFundingOption1,
            hiddenFundingOptionList
        } = this.props;

        let filteredData = uniqBy(
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
                            <th className="build-add">Title</th>
                            {funding_options.length && filteredData.map(item => <th className="build-year">{item.year}</th>)}
                            <th className="action">Actual Funding</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funding_options.length &&
                            uniqBy(funding_options, "funding").map(item => (
                                <>
                                    {hiddenFundingOptionList === undefined || !hiddenFundingOptionList.includes(item.id) ? (
                                        <tr>
                                            <td className="text-center">
                                                <img src="/img/sq-box.png" alt="" />
                                            </td>
                                            <td>{item.funding}</td>
                                            {uniqBy(item.annual_funding_options, "year").map(data => (
                                                <>
                                                    <td className={`${data.edited ? "close-otr-section" : ""} pos-otr`}>
                                                        <div className="pos-sec">
                                                            <NumberFormat
                                                                className="form-control fc-no-dot"
                                                                value={parseInt(data.amount || 0)}
                                                                thousandSeparator={true}
                                                                prefix={"$ "}
                                                                onFocus={async () => {
                                                                    await this.setState({
                                                                        selectedCell: data.id,
                                                                        initialCellAmount: data.amount
                                                                    });
                                                                }}
                                                                onValueChange={async values => {
                                                                    const { value } = values;
                                                                    // await updateAnnualFundingOptionCalculation(data.id, value);
                                                                }}
                                                                onKeyPress={async event => {
                                                                    if (event.key === "Enter") {
                                                                        await this.setState({
                                                                            target: event.target
                                                                        })
                                                                        await toggleLoader();
                                                                        // await this.props.updateAnnualFundingOption1(data.id, { amount: data.amount });
                                                                        await this.setState({
                                                                            selectedCell: data.id,
                                                                            initialCellAmount: data.amount
                                                                        });
                                                                        await toggleLoader();
                                                                        this.state.target.blur();
                                                                    }
                                                                }}
                                                                onBlur={async () => {
                                                                    // await updateAnnualFundingOptionCalculation(data.id, this.state.initialCellAmount);
                                                                    await this.setState({
                                                                        selectedCell: null,
                                                                        initialCellAmount: null
                                                                    });
                                                                }}
                                                            />
                                                            {data.id === this.state.selectedCell ? <i className="fas fa-times"></i> : null}
                                                            {data.edited ? <i className="fa fa-circle" aria-hidden="true"></i> : ""}
                                                        </div>
                                                    </td>
                                                </>
                                            ))}
                                            <td>
                                                <span className="tot-dtl">
                                                    {
                                                        <NumberFormat
                                                            value={parseInt(this.setTotal(item))}
                                                            thousandSeparator={true}
                                                            displayType={"text"}
                                                            prefix={"$ "}
                                                        />
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    ) : null}
                                </>
                            ))}
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(AnnualFundingOptionCalculation);
