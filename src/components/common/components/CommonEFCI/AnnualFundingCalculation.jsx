import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class AnnualFundingCalculation extends Component {
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

    convertToMillion = value => {
        let data = 0;
        data = value / 1000000;
        return data.toFixed(1);
    };

    render() {

        const {
            efciData: { annual_fundings = [], funding_options, annual_fcis, capital_spending_plans = [], actual_fcis },
            hiddenFundingOptionList,
            actualFunding,
            setColor

        } = this.props;
        const { yearList } = this.state;
        let data = Object.values(annual_fundings && annual_fundings);
        let datas = Object.values(annual_fcis && annual_fcis)
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

                            {/* {console.log("fan",actualFunding)} */}
                            <th className="build-add">Title</th>
                            {yearList.length && yearList.map((item, index) => <th key={index} className="build-year">{item}</th>)}
                            <th className="action wid-more">Actual Funding/ EFCI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funding_options && funding_options.length ?
                            _.orderBy(sortFDByIndex, "year", "asc").map((item, index) => (
                                <>
                                    {hiddenFundingOptionList === undefined || !hiddenFundingOptionList.includes(item.id) ? (
                                        <>
                                            <tr className="first-tr">
                                                <td className="text-center">
                                                    <img src="/img/sq-box.png" alt="" />
                                                </td>

                                                <td>
                                                    {`Funding Option ${item.index}`}

                                                </td>

                                                {_.orderBy(sortByIndex[index], 'year', 'asc').map(amount => (

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
                                                                        return this.props.isApi ? "" : await this.props.handleAnnualFundingOption(amount.id, value, item.index);

                                                                    }}

                                                                    onKeyPress={async event => {
                                                                        if (event.key === "Enter") {
                                                                            await this.setState({
                                                                                target: event.target
                                                                            })
                                                                            await this.props.updateAnnualFundingOption(amount.id, amount.amount);
                                                                            await this.setState({
                                                                                selectedCell: null,
                                                                                initialCellAmount: null
                                                                            });
                                                                            this.state.target.blur();
                                                                        }
                                                                    }}

                                                                    onBlur={async () => {
                                                                        await this.props.handleAnnualFundingOption(this.state.selectedCell, this.state.initialCellAmount, item.index);
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
                                            <tr className="second-tr">
                                                <td className="text-center">
                                                    <img src="/img/sq-box.png" alt="" />
                                                </td>
                                                <td className="pos-otr">{`$ ${this.convertToMillion(actualFunding[index])} M Annual Funding`}</td>
                                                <React.Fragment >
                                                    {/* <td > */}
                                                    {_.orderBy(datas[index], 'year', 'asc').map((amount, index) => (
                                                        <td key={index}
                                                            className={`${amount.edited ? "close-otr-section" : ""} pos-otr`}
                                                            style={{ backgroundColor: `${setColor(amount.value) || ""}` }}
                                                        >
                                                            <div className="pos-sec">
                                                                <>
                                                                    <NumberFormat
                                                                        className={`${amount.value < 0 ? "fc-neg " : ""}form-control fc-no-dot ${setColor(amount.value) ? "text-light" : ""
                                                                            }  ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                                        style={{ backgroundColor: `${setColor(amount.value) || ""}` }}
                                                                        value={amount.value && amount.value || ""}
                                                                        displayType={this.props.disableClick ? "text" : "input"}
                                                                        onFocus={async () => {
                                                                            await this.setState({
                                                                                selectedCell: amount.id,
                                                                                initialCellValue: amount.value
                                                                            });
                                                                        }}
                                                                        onValueChange={async values => {
                                                                            const { value } = values;
                                                                            // await this.props.handleAnnualEfci(amount.id, value, amount.index);
                                                                            return this.props.isApi ? "" : await this.props.handleAnnualEfci(amount.id, value, amount.index);

                                                                        }}
                                                                        onKeyPress={async event => {
                                                                            if (event.key === "Enter") {
                                                                                await this.setState({
                                                                                    target: event.target
                                                                                })
                                                                                await this.props.updateAnnualEFCI(amount.id, amount.value);
                                                                                await this.setState({
                                                                                    selectedCell: null,
                                                                                    initialCellValue: amount.value
                                                                                });
                                                                                this.state.target.blur();
                                                                            }
                                                                        }}
                                                                        onBlur={async () => {
                                                                            await this.props.handleAnnualEfci(amount.id, this.state.initialCellValue, amount.index);
                                                                            await this.setState({
                                                                                selectedCell: null,
                                                                                initialCellValue: null
                                                                            });
                                                                        }}
                                                                    />
                                                                    {this.state.selectedCell === amount.id ? <i className="fas fa-times"></i> : null}
                                                                    {amount.edited ?
                                                                        <i className="fa fa-circle cursor-hand" aria-hidden="true"
                                                                            onClick={() => {
                                                                                this.props.showLog && this.props.showLog(amount.id, "annualEfci")
                                                                            }}
                                                                        ></i>
                                                                        : null
                                                                    }
                                                                </>
                                                            </div>
                                                        </td>
                                                    ))}
                                                    {/* </td> */}
                                                </React.Fragment>
                                                <td
                                                    className={`${setColor(actual_fcis[index].value) ? "text-light" : ""}`}
                                                    style={{ backgroundColor: `${setColor(actual_fcis[index].value) || ""}` }}
                                                >
                                                    <span className="tot-dtl">{actual_fcis[index].value}</span>
                                                </td>

                                            </tr>
                                        </>
                                    ) : null}</>
                            ))
                            :
                            <td colSpan={13}>No data</td>
                        }
                    </tbody>
                </table>
            </React.Fragment >
        );
    }
}

export default withRouter(AnnualFundingCalculation);
