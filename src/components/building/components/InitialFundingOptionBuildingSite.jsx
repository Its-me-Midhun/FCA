import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import NumberFormat from "react-number-format";
import { withRouter } from "react-router-dom";

class InitialFundingOptionBuildingSite extends Component {
    state = {
        selectedProjectAnnualFunding: null,
        initialProjectAnnualFunding: null,
        selectedEfci: null,
        initialEfci: null,
        selectedTotalProjectFunding: null,
        initialTotalProjectFunding: null
    };

    render() {
        const {
            // efciSiteData: { funding_options = [], no_of_years },
            efciSiteData,
            hiddenFundingOptionList,
            toggleLoader,
            efciBuildingData,
            updateEfciInInitialFundingOptions,
            updateFundingEfciData,
            handleHideFundingOptions,
            hideFundingOptionSite,
            hideFundingOptionSiteList,
            isDashboard
        } = this.props;
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
                        {efciSiteData.funding_options && efciSiteData.funding_options.length ?
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
                                                    // id="input"
                                                    // className="form-control fc-no-dot"
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
                                                            // await this.setState({
                                                            //     site_fci: {
                                                            //         value: item.funding_cost
                                                            //     },
                                                            //     target: event.target
                                                            // }, async () => {
                                                            //     await toggleLoader();
                                                            //     await this.props.updateSiteFundingOptionSite(this.state.selectedProjectAnnualFunding, this.state.site_fci);
                                                            // });
                                                            // ---------------------to fix loader issue------
                                                            await this.setState({
                                                                site_fci: {
                                                                    value: item.funding_cost
                                                                },
                                                                target: event.target
                                                            })
                                                            await toggleLoader();
                                                            await this.props.updateSiteFundingOptionSite(this.state.selectedProjectAnnualFunding, this.state.site_fci);
                                                            // ---------------------------------------
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
                                    {/* <td className="pos-table-otr-sec pos-otr"> */}
                                    <td className={`pos-table-otr-sec pos-otr`} style={{ backgroundColor: `${item.efci_color || ""}` }} >

                                        <div className="pos-sec">
                                            <>
                                                <NumberFormat
                                                    // id="input"
                                                    // className="form-control fc-no-dot"
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
                                                    // id="input1"
                                                    // className="form-control fc-no-dot"
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
                            )) : null}
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(InitialFundingOptionBuildingSite);
