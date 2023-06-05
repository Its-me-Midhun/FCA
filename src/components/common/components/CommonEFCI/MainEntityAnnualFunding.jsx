import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class MainEntityAnnualFunding extends Component {
    state = {
        selectedCell: null,
        initialCellAmount: null,
        yearList: []
    };

    componentDidMount() {
        let yearList = [];
        this.props.efciData.annual_fundings && _.orderBy(this.props.efciData.annual_fundings[1], 'year', 'asc').map(i => (
            yearList = [...yearList, i.year]
        ))
        this.setState({
            yearList: yearList
        })
    }

    setTotal(data) {
        let total = 0;
        data && data.map(element => (total += parseInt(element.amount)));
        return total;
    }

    render() {

        const {
            efciData: { annual_fundings = [], funding_options, capital_spending_plans = [] },
            hiddenFundingOptionList
        } = this.props;
        const { yearList } = this.state;
        let data = Object.values(annual_fundings && annual_fundings);
        let sortByIndex = _.orderBy(
            data,
            "index",
            "asc"
        );
        let sortFDByIndex = _.orderBy(
            funding_options,
            "index",
            "asc"
        );

        return (
            <React.Fragment>
                <table className="table table-common table-froze">
                    <thead>
                        <tr>
                            <th className="img-sq-box">
                                <img src="/img/sq-box.png" alt="" />
                            </th>
                            <th className="build-add">Title</th>
                            {yearList.length && yearList.map((item, index) => <th key={index} className="build-year">{item}</th>)}
                            <th className="action">Actual Funding</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funding_options && funding_options.length ?
                            _.orderBy(sortFDByIndex, "year", "asc").map((item, index) => (
                                <>
                                    {hiddenFundingOptionList === undefined || !hiddenFundingOptionList.includes(item.id) ? (
                                        <tr >
                                            <td className="text-center">
                                                <img src="/img/sq-box.png" alt="" />
                                            </td>
                                            <td>
                                                {`Funding Option ${item.index}`}
                                            </td>
                                            { _.orderBy(sortByIndex[index], 'year', 'asc').map(amount => (
                                                <React.Fragment >
                                                    <td className={`${amount.edited ? "close-otr-section" : ""} pos-otr`}>
                                                        <div className="pos-sec">
                                                            <NumberFormat
                                                                // className="form-control fc-no-dot"
                                                                className={`form-control fc-no-dot ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                                value={amount && amount.amount && parseInt(amount.amount)}
                                                                thousandSeparator={true}
                                                                prefix={"$ "}
                                                                displayType={this.props.disableClick ? "text" : "input"}
                                                                onFocus={async () => {
                                                                    await this.setState({
                                                                        selectedCell: amount.id,
                                                                        initialCellAmount: amount.amount
                                                                    });
                                                                }}

                                                                onValueChange={async values => {
                                                                    const { value } = values;
                                                                    // await this.props.handleAnnualFundingOption(amount.id, value, item.index);
                                                                    return this.props.isApi ? "" : await this.props.handleMainEntityAnnualFundingOption(amount.id, value, item.index);

                                                                }}

                                                                onKeyPress={async event => {
                                                                    if (event.key === "Enter") {
                                                                        await this.setState({
                                                                            target: event.target
                                                                        })
                                                                        await this.props.updateMainEntityAnnualFunding(amount.id, amount.amount);
                                                                        await this.setState({
                                                                            selectedCell: null,
                                                                            initialCellAmount: null
                                                                        });
                                                                        this.state.target.blur();
                                                                    }
                                                                }}

                                                                onBlur={async () => {
                                                                    await this.props.handleMainEntityAnnualFundingOption(this.state.selectedCell, this.state.initialCellAmount, item.index);
                                                                    await this.setState({
                                                                        selectedCell: null,
                                                                        initialCellAmount: null
                                                                    });
                                                                }}
                                                            />
                                                            {amount.id === this.state.selectedCell ? <i className="fas fa-times"></i> : null}
                                                            {amount.edited ?
                                                                <i className="fa fa-circle cursor-hand" aria-hidden="true"
                                                                    onClick={() => {
                                                                        this.props.showLog && this.props.showLog(amount.id, "annualFunding")
                                                                    }
                                                                    }></i>
                                                                : ""
                                                            }
                                                        </div>
                                                    </td>
                                                </React.Fragment>
                                            ))
                                            }
                                            < td >
                                                <span className="tot-dtl">
                                                    {
                                                        <NumberFormat
                                                            value={parseInt(this.props.setTotal(data[index]))}
                                                            thousandSeparator={true}
                                                            displayType={"text"}
                                                            prefix={"$ "}
                                                        />
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    ) : null}</>))
                            :
                            <td colSpan={13}>No data</td>
                        }
                    </tbody>
                </table>
            </React.Fragment >
        );
    }
}

export default withRouter(MainEntityAnnualFunding);
