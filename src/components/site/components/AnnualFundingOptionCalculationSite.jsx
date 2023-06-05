import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class AnnualFundingOptionCalculationSite extends Component {
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
            hiddenFundingOptionList,
            getAnnualFundingCalculationColumnLogs,
            updateAnnualEfciCalculation,
            updateFcis,
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
                            <th className="action">Actual Funding/EFCI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funding_options.length &&
                            uniqBy(funding_options, "funding").map(item => (
                                <>
                                    {hiddenFundingOptionList === undefined || !hiddenFundingOptionList.includes(item.id) ? (
                                    <>
                                        <tr className="first-tr">
                                            <td className="text-center">
                                                <img src="/img/sq-box.png" alt="" />
                                            </td>
                                            <td>{item.funding}</td>
                                            {uniqBy(item.annual_funding_options, "year").map(data => (
                                                <>
                                                    <td className={`${data.edited ? "close-otr-section" : ""} pos-otr`}>
                                                        <div className="pos-sec">
                                                            <NumberFormat
                                                                className={`form-control fc-no-dot ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                                displayType={this.props.disableClick ? "text" : "input"}
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
                                                                    await updateAnnualFundingOptionCalculation(data.id, value);
                                                                }}
                                                                onKeyPress={async event => {
                                                                    if (event.key === "Enter") {
                                                                        await this.setState({
                                                                            target: event.target
                                                                        })
                                                                        await toggleLoader();
                                                                        await this.props.updateAnnualFundingOption1(data.id, { amount: data.amount });
                                                                        await this.setState({
                                                                            selectedCell: data.id,
                                                                            initialCellAmount: data.amount
                                                                        });
                                                                        await toggleLoader();
                                                                        this.state.target.blur();
                                                                    }
                                                                }}
                                                                onBlur={async () => {
                                                                    await updateAnnualFundingOptionCalculation(data.id, this.state.initialCellAmount);
                                                                    await this.setState({
                                                                        selectedCell: null,
                                                                        initialCellAmount: null
                                                                    });
                                                                }}
                                                            />
                                                            {data.id === this.state.selectedCell ? <i className="fas fa-times"></i> : null}
                                                            {data.edited ?
                                                                <i className="fa fa-circle cursor-hand" aria-hidden="true"
                                                                    onClick={() => {
                                                                        this.props.showLogsTableFunding && this.props.showLogsTableFunding(data.id)
                                                                    }
                                                                    }></i>
                                                                : ""
                                                            }
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
                                        <tr className="second-tr">
                                           <td className="text-center">
                                               <img src="/img/sq-box.png" alt="" />
                                           </td>
                                           <td className="pos-otr">{item.efci_title}</td>
                                           {uniqBy(item.annual_efcis, "year").map(data => (
                                               <td className={`${data.edited ? "close-otr-section" : ""} pos-otr`} style={{ backgroundColor: `${data.color || ""}` }} >
                                                   <div className="pos-sec" >
                                                       <>
                                                           <NumberFormat
                                                               className={`${data.value < 0 ? "fc-neg " : ""}form-control fc-no-dot ${data.color ? "text-light" : ""} ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                               displayType={this.props.disableClick ? "text" : "input"}
                                                               style={{ backgroundColor: `${data.color || ""}` }}
                                                               value={data.value && data.value || ""}
                                                               onFocus={async () => {
                                                                   await this.setState({
                                                                       selectedCell: data.id,
                                                                       initialCellValue: data.value
                                                                   });
                                                               }}
                                                               onValueChange={async values => {
                                                                   const { value } = values;
                                                                   await this.props.updateAnnualEfciCalculation(data.id, value);
                                                               }}
                                                               onKeyPress={async event => {
                                                                   if (event.key === "Enter") {
                                                                       await this.setState({
                                                                           target: event.target
                                                                       })
                                                                       await toggleLoader();
                                                                       await updateFcis(data.id, { value: data.value });
                                                                       await this.setState({
                                                                           selectedCell: null,
                                                                           initialCellValue: data.value
                                                                       });
                                                                       await toggleLoader();
                                                                       this.state.target.blur();
                                                                   }
                                                               }}
                                                               onBlur={async () => {
                                                                   await updateAnnualEfciCalculation(data.id, this.state.initialCellValue);
                                                                   await this.setState({
                                                                       selectedCell: null,
                                                                       initialCellValue: null
                                                                   });
                                                               }}
                                                           />
                                                           {this.state.selectedCell === data.id ? <i className="fas fa-times"></i> : null}
                                                           {data.edited ?
                                                               <i className="fa fa-circle cursor-hand" aria-hidden="true"
                                                                   onClick={() => {
                                                                       this.props.showLogsTable && this.props.showLogsTable(data.id)
                                                                   }
                                                                   }
                                                               ></i>
                                                               : null
                                                           }
                                                       </>
                                                   </div>
                                               </td>
                                           ))}
                                           <td class={`${item.actual_color ? "text-light" : ""}`}
                                               style={{ backgroundColor: `${item.actual_color || ""}` }}
                                           >
                                               <span className="tot-dtl">{item.actual_efci}</span>
                                           </td>
                                       </tr>
                                    </>
                                    ) : null}
                                </>
                            ))}
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(AnnualFundingOptionCalculationSite);
