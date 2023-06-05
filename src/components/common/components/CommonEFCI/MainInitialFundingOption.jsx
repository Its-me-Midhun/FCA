import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";

class MainInitialFundingOption extends Component {
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
            handleHideFundingOptions
        } = this.props;
        let sortByIndex = _.orderBy(
            this.props.efciData.funding_options &&
            this.props.efciData.funding_options.length &&
            this.props.efciData.funding_options,
            "index",
            "asc"
        );
        return (
            <>
                <table className="table table-common">
                    <thead>
                        <tr>
                            <th className="img-sq-box">
                                <img src="/img/sq-box.png" alt="" />
                            </th>
                            <th className="f-name">Funding</th>
                            <th className="f-cost">Project Annual Funding</th>
                            <th className="f-efci">EFCI</th>
                            <th className="f-total">Total Project Funding</th>
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
                                        <td className="text-center cursor-hand">
                                            <i
                                                className={hiddenFundingOptionList && hiddenFundingOptionList.includes(item.id) ? "fa fa-eye-slash" : "fa fa-eye"}
                                                onClick={() =>
                                                    handleHideFundingOptions(item.id)}
                                            />
                                        </td>
                                        <td>
                                            {`Funding Option ${item.index}`}
                                        </td>
                                        <td className="pos-table-otr-sec pos-otr">
                                            <div className="pos-sec">
                                                <>
                                                    <NumberFormat
                                                        // className={`${this.props.efciBuildingData && !this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot cursor-notallowed"}`}
                                                        className={`${this.props.efciBuildingData && !this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot"} ${this.props.disableClick ? "cursor-notallowed" : ""}`}
                                                        // displayType={this.props.efciBuildingData && this.props.efciBuildingData.locked ? "text" : "input"}
                                                        displayType={this.props.disableClick ? "text" : "input"}
                                                        value={item.value}
                                                        thousandSeparator={true}
                                                        prefix={"$ "}
                                                        onValueChange={async values => {
                                                            const { value } = values;
                                                            return this.props.disableClick ? "" : await this.props.handleMainEntityEfciFundingCost(item.id, value);
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
                                                                    await this.props.updateMainEntityEfciFundingCost(item.id, item.value);
                                                                });
                                                                await this.setState({
                                                                    selectedFCostId: item.id,
                                                                    // initialFundingCost: item.funding_cost
                                                                });
                                                                this.state.target.blur();
                                                            }
                                                        }}
                                                        onBlur={async () => {
                                                            await this.props.handleMainEntityEfciFundingCost(item.id, this.state.initialFundingCost);
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
                                        </td>

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
                                                            return this.props.isApi ? "" : await this.props.handleMainEntityFundingCostEfci(efciData.expected_fcis[index].id, value);
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
                                                                    await this.props.updateMainEntityFundingEfci(efciData.expected_fcis[index].id, efciData.expected_fcis[index].value);
                                                                });
                                                                this.state.target.blur();
                                                                this.setState({
                                                                    selectedEfci: null
                                                                })
                                                            }
                                                        }}
                                                        onBlur={async () => {
                                                            await this.props.handleMainEntityFundingCostEfci(efciData.expected_fcis[index].id, this.state.initialEfci);
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
                                                        className={`${this.props.efciBuildingData && !this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot"} ${this.props.disableClick ? "cursor-notallowed" : ""}`}
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
                                                                    await this.props.updateMainEntityEfciFundingCost(item.id, data);
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
                                                            onClick={() => this.props.showLog ? this.props.showLog(item.id, "project_funding_total", this.props.efciData.no_of_years) :
                                                                this.props.showSiteLogsTableTotalFundingOptionEfci && this.props.showSiteLogsTableTotalFundingOptionEfci(item.id, this.props.efciData.no_of_years)}
                                                        ></i>
                                                    ) : null}
                                                </>
                                            </div>
                                        </td>

                                    </tr>
                                </React.Fragment>
                            ))
                            :
                            <td colSpan={5}>No data found</td>
                        }
                        {/* {efciSiteData.funding_options && efciSiteData.funding_options.length ?
                            uniqBy(efciSiteData.funding_options, "funding").map(item => (
                                <tr>
                                    <td className="text-center cursor-hand">
                                        <i
                                            className={hideFundingOptionSiteList && hideFundingOptionSiteList.includes(item.id) ? "fa fa-eye-slash" : "fa fa-eye"}
                                            onClick={() =>
                                                hideFundingOptionSite(item.id)}
                                        />
                                    </td>
                                    <td>{item.funding}</td>
                                    <td className="pos-table-otr-sec pos-otr">
                                        <div className="pos-sec">
                                            <>
                                                <NumberFormat
                                                   
                                                    className={`${!this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot cursor-notallowed"}`}
                                                    displayType={this.props.efciBuildingData.locked ? "text" : "input"}
                                                    value={item.funding_cost}
                                                    thousandSeparator={true}
                                                    prefix={"$ "}
                                                    onValueChange={async values => {
                                                    const { value } = values;
                                                    await this.props.updateProjectAnnualFundingSite(item.id, value);

                                                }}
                                                    onFocus={async () => {
                                                    await this.setState({
                                                        selectedProjectAnnualFunding: item.id,
                                                        initialFundingCost: item.funding_cost
                                                    });
                                                }}

                                                    onKeyPress={async event => {
                                                    if (event.key === "Enter") {
                                                        await this.setState({
                                                            site_fci: {
                                                                value: item.funding_cost
                                                            },
                                                            target: event.target
                                                        }, async () => {
                                                            await toggleLoader();
                                                            await this.props.updateSiteFundingOptionSite(this.state.selectedProjectAnnualFunding, this.state.site_fci);
                                                        });

                                                        await this.setState({
                                                            selectedProjectAnnualFunding: item.id,
                                                            initialFundingCost: item.funding_cost
                                                        });
                                                        await toggleLoader();
                                                        this.state.target.blur();
                                                    }
                                                }}
                                                    onBlur={async () => {
                                                    await this.props.updateProjectAnnualFundingSite(item.id, this.state.initialFundingCost);
                                                    await this.setState({
                                                        selectedProjectAnnualFunding: null,
                                                        initialFundingCost: null
                                                    });
                                                }}
                                                />
                                                {this.state.selectedProjectAnnualFunding === item.id ? (
                                                    <i className="fas fa-times cursor-pointer"></i>
                                                ) : null}
                                                {item.edited ? <i className="fa fa-circle edited-dot cursor-hand" aria-hidden="true"
                                                    onClick={() => this.props.showSiteLogsTableFundingOption && this.props.showSiteLogsTableFundingOption(item.id)}

                                                ></i> : null}
                                            </>
                                        </div>
                                    </td>
                                    <td className={`pos-table-otr-sec pos-otr`} style={{ backgroundColor: `${item.efci_color || ""}` }} >

                                        <div className="pos-sec">
                                            <>
                                                <NumberFormat

                                                    className={`${!this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot cursor-notallowed"} ${item.efci_color ? "text-light" : ""}`}
                                                    displayType={this.props.efciBuildingData.locked ? "text" : "input"}
                                                    style={{ backgroundColor: `${item.efci_color || ""}` }}
                                                    value={item.efci}
                                                    onValueChange={async values => {

                                                        const { value } = values;
                                                        await this.props.updateEfciInInitialFundingOptionsSite(item.efci_id, value);
                                                    }}
                                                    onFocus={async () => {
                                                        await this.setState({
                                                            selectedEfci: item.efci_id,
                                                            initialEfci: item.efci
                                                        });
                                                    }}
                                                    onKeyPress={async event => {
                                                        if (event.key === "Enter") {
                                                            this.setState({
                                                                target: event.target,
                                                                efciValue: event.target.value
                                                            }, async () => {
                                                                await toggleLoader();
                                                                console.log("this.state.efciValue", this.state.efciValue)
                                                                await updateFundingEfciData(item.efci_id, { value: this.state.efciValue });
                                                                await this.setState({
                                                                    selectedEfci: item.efci_id,
                                                                    initialEfci: this.state.efciValue
                                                                });
                                                                await toggleLoader();
                                                                this.state.target.blur();
                                                            });

                                                        }
                                                    }}
                                                    onBlur={async () => {
                                                        await this.props.updateEfciInInitialFundingOptionsSite(item.efci_id, this.state.initialEfci);
                                                        await this.setState({
                                                            selectedEfci: null,
                                                            initialEfci: null
                                                        });
                                                    }}
                                                />
                                                {this.state.selectedEfci === item.efci_id ? <i className="fas fa-times"></i> : null}
                                                {item.efci_edited ? <i className="fa fa-circle edited-dot cursor-hand" aria-hidden="true"
                                                    onClick={() => this.props.showSiteLogsTableFundingOptionEfci && this.props.showSiteLogsTableFundingOptionEfci(item.efci_id)}
                                                ></i> : null}
                                            </>
                                        </div>
                                    </td>
                                    <td className="pos-table-otr-sec pos-otr">
                                        <div className="pos-sec">
                                            <>
                                                <NumberFormat
                                                    className={`${!this.props.efciBuildingData.locked ? "form-control fc-no-dot" : "form-control fc-no-dot cursor-notallowed"}`}
                                                    displayType={this.props.efciBuildingData.locked ? "text" : "input"}
                                                    value={parseInt(item.expected_cost)}
                                                    thousandSeparator={true}
                                                    prefix={"$ "}
                                                    onFocus={async () => {
                                                        await this.setState({
                                                            selectedTotalProjectFunding: item.id,
                                                            initialTotalProjectFunding: item.expected_cost
                                                        });
                                                    }}
                                                    onValueChange={async values => {
                                                        const { value } = values;
                                                        await this.props.updateTotalProjectFundingSite(item.id, value);
                                                    }}
                                                    onKeyPress={async event => {
                                                        const total = parseInt(parseInt(item.expected_cost) / (efciSiteData.no_of_years ? efciSiteData.no_of_years : 1));
                                                        if (event.key === "Enter") {
                                                            this.setState({
                                                                target: event.target
                                                            });
                                                            await toggleLoader();
                                                            await this.props.updateSiteFundingOptionSite(this.state.selectedTotalProjectFunding, {
                                                                value: total
                                                            });
                                                            await this.props.updateTotalProjectFundingSite(item.id, item.expected_cost);
                                                            await this.setState({
                                                                selectedTotalProjectFunding: item.id,
                                                                initialTotalProjectFunding: item.expected_cost
                                                            });
                                                            await toggleLoader();
                                                            this.state.target.blur();
                                                        }
                                                    }}
                                                    onBlur={async () => {
                                                        await this.props.updateTotalProjectFundingSite(item.id, this.state.initialTotalProjectFunding);
                                                        await this.setState({
                                                            selectedTotalProjectFunding: null,
                                                            initialTotalProjectFunding: null
                                                        });
                                                    }}
                                                />
                                                {this.state.selectedTotalProjectFunding === item.id ? <i className="fas fa-times"></i> : null}
                                                {item.edited || item.efci_edited ? (
                                                    <i className="fa fa-circle edited-dot cursor-hand" aria-hidden="true"
                                                        onClick={() => this.props.showSiteLogsTableTotalFundingOptionEfci && this.props.showSiteLogsTableTotalFundingOptionEfci(item.id, efciSiteData.no_of_years)}
                                                    ></i>
                                                ) : null}
                                            </>
                                        </div>
                                    </td>
                                </tr>
                            )) : null} */}
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(MainInitialFundingOption);
