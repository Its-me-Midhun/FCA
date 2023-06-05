import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class InitialFundingTable extends Component {
    state = {
        selectedProjectAnnualFunding: null,
        initialProjectAnnualFunding: null,
        selectedEfci: null,
        initialEfci: null,
        selectedTotalProjectFunding: null,
        initialTotalProjectFunding: null
    };

    handleTotalFundingCost = (value) => {
        const { efciData } = this.props;
        let total = 0;
        total = value * efciData.no_of_years;
        return parseInt(total);
    }

    setValue = (value) => {
        this.setState({
            totalFD: value
        })
    }



    render() {
        const {
            efciData,
            setColor,
            hiddenFundingOptionList,
            handleHideFundingOptions,
            isDashboard
        } = this.props;
        let sortByIndex = _.orderBy(
            this.props.efciData && this.props.efciData.funding_options &&
            this.props.efciData.funding_options.length &&
            this.props.efciData.funding_options,
            "index",
            "asc"
        );

        return (
            <>
                <table className={`${isDashboard ? "table table-common table-bordered" : "table table-common"}`}>
                    <thead>
                        <tr>
                            {!isDashboard ? <th className="img-sq-box">
                                <img src="/img/sq-box.png" alt="" />
                            </th> : null}
                            <th className={`${!isDashboard ? 'f-name' : 'wdthChartfo'}`} >Funding</th>
                            {!isDashboard ? <th className="f-cost">Project Annual Funding</th> : null}
                            <th className={`${!isDashboard ? 'f-efci' : 'table-widjet-width'}`}>EFCI</th>
                            <th className={`${!isDashboard ? 'f-total' : 'wdthChartfo'}`}>Total Project Funding</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.efciData &&
                            this.props.efciData.funding_options &&
                            this.props.efciData.funding_options.length ?
                            //                             this.props.efciData.funding_options.map((item, index) => (
                            //                                 <React.Fragment key={index}>
                            //                                     <tr >
                            sortByIndex.map((item, index) => (
                                <React.Fragment >
                                    <tr>
                                        {!isDashboard ? <td className="text-center cursor-hand">
                                            <i
                                                className={hiddenFundingOptionList && hiddenFundingOptionList.includes(item.id) ? "fa fa-eye-slash" : "fa fa-eye"}
                                            onClick={() =>
                                                handleHideFundingOptions(item.id)}
                                            />
                                        </td> : null}
                                        <td>{!isDashboard ? `Funding Option ${item.index}` : `FO-${item.index}`}</td>

                                        {!isDashboard ? <td className="pos-table-otr-sec pos-otr">
                                            <div className="pos-sec">
                                                <>
                                                    <NumberFormat
                                                        //className={`${this.props.efciBuildingData && !this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot cursor-notallowed"}`}
                                                        className={`${this.props.disableClick ? "form-control fc-no-dot cursor-notallowed" : "form-control fc-no-dot"}`}
                                                        // displayType={this.props.efciBuildingData && this.props.efciBuildingData.locked ? "text" : "input"}
                                                        displayType={this.props.disableClick ? "text" : "input"}
                                                        value={item.value}
                                                        thousandSeparator={true}
                                                        prefix={"$ "}
                                                        onValueChange={async values => {
                                                            const { value } = values;
                                                            return this.props.disableClick ? "" : await this.props.handleFundingCostData(item.id, value);
                                                        }}

                                                        onFocus={async () => {
                                                            await this.setState({
                                                                selectedFCostId: item.id,
                                                                initialFundingCost: item.value
                                                            });
                                                        }}

                                                        onKeyPress={async event => {
                                                            if (event.key === "Enter") {
                                                                await this.setState({
                                                                    target: event.target
                                                                }, async () => {
                                                                    await this.props.updateFundingCostData(item.id, item.value);
                                                                });
                                                                await this.setState({
                                                                    selectedFCostId: item.id,
                                                                    // initialFundingCost: item.funding_cost
                                                                });
                                                                this.state.target.blur();
                                                            }
                                                        }}
                                                        onBlur={async () => {
                                                            await this.props.handleFundingCostData(item.id, this.state.initialFundingCost);
                                                            await this.setState({
                                                                selectedFCostId: null,
                                                                initialFundingCost: null
                                                            });
                                                        }}
                                                    />
                                                    {this.state.selectedFCostId === item.id ? (
                                                        <i className="fas fa-times cursor-pointer"></i>
                                                    ) : null}
                                                    {item.edited ? <i className="fa fa-circle edited-dot cursor-hand" aria-hidden="true"
                                                        onClick={() => this.props.showLog && this.props.showLog(item.id, "project funding")}
                                                    ></i> : null}
                                                </>
                                            </div>
                                        </td> : null}

                                        <td className={`pos-table-otr-sec pos-otr`} style={{ backgroundColor: `${setColor(efciData.expected_fcis[index].value) || ""}` }} >
                                            <div className="pos-sec">
                                                <>
                                                    <NumberFormat
                                                        // className={`${!this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot cursor-notallowed"} ${item.efci_color ? "text-light" : ""}`}
                                                        className={`form-control fc-no-dot ${setColor(efciData.expected_fcis[index].value) ? "text-light" : ""} ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                        // displayType={this.props.efciBuildingData && this.props.efciBuildingData.locked ? "text" : "input"}
                                                        displayType={this.props.disableClick ? "text" : "input"}
                                                        style={{ backgroundColor: `${setColor(efciData.expected_fcis[index].value) || ""}` }}
                                                        value={efciData.expected_fcis[index].value}
                                                        onValueChange={async values => {
                                                            const { value } = values;
                                                            return this.props.isApi ? "" : await this.props.handleFundingCostEfci(efciData.expected_fcis[index].id, value);
                                                            // await this.props.handleFundingCostEfci(efciData.expected_fcis[index].id, value);
                                                        }}

                                                        onFocus={async () => {
                                                            await this.setState({
                                                                selectedEfci: efciData.expected_fcis[index].id,
                                                                initialEfci: efciData.expected_fcis[index].value
                                                            });
                                                        }}

                                                        onKeyPress={async event => {
                                                            if (event.key === "Enter") {
                                                                await this.setState({
                                                                    target: event.target
                                                                }, async () => {
                                                                    await this.props.updateFundingCostEfci(efciData.expected_fcis[index].id, efciData.expected_fcis[index].value);
                                                                });
                                                                this.state.target.blur();
                                                                this.setState({
                                                                    selectedEfci: null
                                                                })
                                                            }
                                                        }}
                                                        onBlur={async () => {
                                                            await this.props.handleFundingCostEfci(efciData.expected_fcis[index].id, this.state.initialEfci);
                                                            await this.setState({
                                                                selectedEfci: null,
                                                                initialEfci: null
                                                            });
                                                        }}
                                                    />
                                                    {this.state.selectedEfci === efciData.expected_fcis[index].id ? <i className="fas fa-times"></i> : null}
                                                    {efciData.expected_fcis[index].edited ? <i className="fa fa-circle edited-dot cursor-hand" aria-hidden="true"
                                                        onClick={() => this.props.showLog && this.props.showLog(efciData.expected_fcis[index].id, "fundingCostEfci")}
                                                    ></i> : null}
                                                </>
                                            </div>
                                        </td>

                                        <td className="pos-table-otr-sec pos-otr">
                                            <div className="pos-sec">
                                                <>
                                                    <NumberFormat
                                                        // className={`${!this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot cursor-notallowed"}`}
                                                        className={`form-control fc-no-dot ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                        // displayType={this.props.efciBuildingData && this.props.efciBuildingData.locked ? "text" : "input"}
                                                        displayType={this.props.disableClick ? "text" : "input"}
                                                        // value={this.handleTotalFundingCost(item.value)}
                                                        value={this.props.totalProjectCost && this.props.totalProjectCost[index] && this.props.totalProjectCost[index]}
                                                        thousandSeparator={true}
                                                        prefix={"$ "}
                                                        onFocus={async () => {
                                                            await this.setState({
                                                                selectedTotalProjectFundingId: item.id,
                                                                initialTotalProjectFunding: this.props.totalProjectCost && this.props.totalProjectCost[index] && this.props.totalProjectCost[index]
                                                            });
                                                        }}
                                                        onValueChange={async values => {
                                                            const { value } = values;
                                                            await this.props.handLeTotalFundingCost(index, value);
                                                        }}

                                                        onKeyPress={async event => {
                                                            const data = parseInt(this.props.totalProjectCost[index] / this.props.efciData.no_of_years);
                                                            if (event.key === "Enter") {
                                                                await this.setState({
                                                                    target: event.target
                                                                }, async () => {
                                                                    await this.props.updateFundingCostData(item.id, data);
                                                                });
                                                                this.state.target.blur();
                                                                this.setState({
                                                                    selectedTotalProjectFundingId: null
                                                                })
                                                            }
                                                        }}
                                                        onBlur={async () => {
                                                            await this.props.handLeTotalFundingCost(index, this.state.initialTotalProjectFunding);
                                                            await this.setState({
                                                                selectedTotalProjectFundingId: null,
                                                                initialTotalProjectFunding: null
                                                            });
                                                        }}
                                                    />
                                                    {this.state.selectedTotalProjectFundingId === item.id ? <i className="fas fa-times"></i> : null}
                                                    {item.edited || item.efci_edited ? (
                                                        <i className="fa fa-circle edited-dot cursor-hand" aria-hidden="true"
                                                            onClick={() => this.props.showLog && this.props.showLog(item.id, "project_funding_total", this.props.efciData.no_of_years)}
                                                        // onClick={() => this.props.showSiteLogsTableTotalFundingOptionEfci && this.props.showSiteLogsTableTotalFundingOptionEfci(item.id, efciSiteData.no_of_years)}
                                                        ></i>
                                                    ) : null}
                                                </>
                                            </div>
                                        </td>

                                    </tr>
                                </React.Fragment>
                            ))
                            :
                            <td colSpan={!isDashboard ? 5 : 3}>No data found</td>
                        }
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(InitialFundingTable);
