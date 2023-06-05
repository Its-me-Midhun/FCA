import React, { Component } from "react";
import NumberFormat from "react-number-format";
import _, { uniqBy } from "lodash";

import { withRouter } from "react-router-dom";

class InitialFundingOptionsTable extends Component {
    state = {
        selectedProjectAnnualFunding: null,
        initialProjectAnnualFunding: null,
        selectedEfci: null,
        initialEfci: null,
        selectedTotalProjectFunding: null,
        initialTotalProjectFunding: null,
        refreshData: false,
        onFocus: ""
    };

    render() {
        const {
            efciBuildingData: { funding_options = [], no_of_years },
            handleHideFundingOptions,
            updateFundingOption,
            updateFundingOptionEfci,
            hiddenFundingOptionList,
            toggleLoader,
            isDashboard
        } = this.props;

        return (
            <>
                <table className={`${isDashboard ? "table table-common table-bordered" : "table table-common"}`}>
                    <thead>
                        <tr>
                            {!isDashboard ? (
                                <th className="img-sq-box">
                                    <img src="/img/sq-box.png" alt="" />
                                </th>
                            ) : null}
                            <th className={`${!isDashboard ? "f-name" : "wdthChartfo"}`}>Funding</th>
                            {!isDashboard ? <th className="f-cost">Project Annual Funding</th> : null}
                            {/* <th className="f-efci">EFCI</th>
                            <th className="f-total">Total Project Funding</th> */}
                            <th className={`${!isDashboard ? "f-efci" : "table-widjet-width"}`}>EFCI</th>
                            <th className={`${!isDashboard ? "f-total" : "wdthChartfo"}`}>Total Project Funding</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funding_options.length &&
                            uniqBy(funding_options, "funding").map((item, key) => (
                                <tr>
                                    {!isDashboard ? (
                                        <td className="text-center cursor-hand">
                                            <i
                                                className={hiddenFundingOptionList.includes(item.id) ? "fa fa-eye-slash" : "fa fa-eye"}
                                                onClick={() => handleHideFundingOptions(item.id)}
                                            />
                                        </td>
                                    ) : null}
                                    <td>{!isDashboard ? item.funding : `FO ${key + 1}`}</td>
                                    {!isDashboard ? (
                                        <td className="pos-table-otr-sec pos-otr">
                                            <div className="pos-sec">
                                                <>
                                                    <NumberFormat
                                                        className={`${
                                                            !this.props.efciBuildingData.locked
                                                                ? "form-control fc-no-dot"
                                                                : "form-control fc-no-dot cursor-notallowed"
                                                        }`}
                                                        displayType={this.props.efciBuildingData.locked ? "text" : "input"}
                                                        value={item.funding_cost}
                                                        thousandSeparator={true}
                                                        prefix={"$ "}
                                                        onValueChange={async values => {
                                                            const { value } = values;
                                                            await this.props.updateProjectAnnualFunding(item.id, value);
                                                        }}
                                                        onFocus={async event => {
                                                            await this.setState({
                                                                selectedProjectAnnualFunding: item.id,
                                                                initialFundingCost: item.funding_cost
                                                            });
                                                        }}
                                                        onKeyPress={async event => {
                                                            if (event.key === "Enter") {
                                                                this.setState({
                                                                    target: event.target
                                                                });
                                                                await toggleLoader();
                                                                await this.props.updateFundingOption1(this.state.selectedProjectAnnualFunding, {
                                                                    value: item.funding_cost
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
                                                            await this.props.updateProjectAnnualFunding(item.id, this.state.initialFundingCost);
                                                            await this.setState({
                                                                selectedProjectAnnualFunding: null,
                                                                initialFundingCost: null
                                                            });
                                                        }}
                                                    />
                                                    {this.state.selectedProjectAnnualFunding === item.id ? (
                                                        <i className="fas fa-times cursor-pointer"></i>
                                                    ) : null}
                                                    {item.edited ? (
                                                        <i
                                                            className="fa fa-circle edited-dot cursor-hand"
                                                            aria-hidden="true"
                                                            onClick={() =>
                                                                this.props.showLogsTableFundingCost && this.props.showLogsTableFundingCost(item.id)
                                                            }
                                                        ></i>
                                                    ) : null}
                                                </>
                                            </div>
                                        </td>
                                    ) : null}
                                    <td className="pos-table-otr-sec pos-otr" style={{ backgroundColor: `${item.efci_color || ""}` }}>
                                        <div className="pos-sec">
                                            <>
                                                <NumberFormat
                                                    className={`${
                                                        !this.props.efciBuildingData.locked
                                                            ? "form-control fc-no-dot"
                                                            : "form-control fc-no-dot cursor-notallowed"
                                                    } ${item.efci_color ? "text-light" : ""}`}
                                                    style={{ backgroundColor: `${item.efci_color || ""}` }}
                                                    displayType={this.props.efciBuildingData.locked ? "text" : "input"}
                                                    value={item.efci}
                                                    onValueChange={async values => {
                                                        const { value } = values;
                                                        await this.props.updateEfciInInitialFundingOptions(item.efci_id, value);
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
                                                                target: event.target
                                                            });
                                                            await toggleLoader();
                                                            await updateFundingOptionEfci(item.efci_id, { value: item.efci });
                                                            await this.setState({
                                                                selectedEfci: null,
                                                                initialEfci: item.efci
                                                            });
                                                            await toggleLoader();
                                                            this.state.target.blur();
                                                        }
                                                    }}
                                                    onBlur={async () => {
                                                        await this.props.updateEfciInInitialFundingOptions(item.efci_id, this.state.initialEfci);
                                                        await this.setState({
                                                            selectedEfci: item.efci_id,
                                                            initialEfci: null
                                                        });
                                                    }}
                                                />
                                                {this.state.selectedEfci === item.efci_id ? <i className="fas fa-times"></i> : null}
                                                {item.efci_edited ? (
                                                    <i
                                                        className="fa fa-circle edited-dot cursor-hand"
                                                        aria-hidden="true"
                                                        onClick={() =>
                                                            this.props.showLogsTableFundingCostEfci &&
                                                            this.props.showLogsTableFundingCostEfci(item.efci_id)
                                                        }
                                                    ></i>
                                                ) : null}
                                            </>
                                        </div>
                                    </td>
                                    <td className="pos-table-otr-sec pos-otr">
                                        <div className="pos-sec">
                                            <>
                                                <NumberFormat
                                                    id="input1"
                                                    className={`${
                                                        !this.props.efciBuildingData.locked
                                                            ? "form-control fc-no-dot"
                                                            : "form-control fc-no-dot cursor-notallowed"
                                                    }`}
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
                                                        await this.props.updateTotalProjectFunding(item.id, value);
                                                    }}
                                                    onKeyPress={async event => {
                                                        const total = parseInt(parseInt(item.expected_cost) / no_of_years);
                                                        if (event.key === "Enter") {
                                                            this.setState({
                                                                target: event.target
                                                            });
                                                            await toggleLoader();
                                                            await this.props.updateFundingOption1(this.state.selectedTotalProjectFunding, {
                                                                value: total
                                                            });
                                                            await this.props.updateTotalProjectFunding(item.id, item.expected_cost);
                                                            await this.setState({
                                                                selectedTotalProjectFunding: item.id,
                                                                initialTotalProjectFunding: item.expected_cost
                                                            });
                                                            await toggleLoader();
                                                            this.state.target.blur();
                                                        }
                                                    }}
                                                    onBlur={async () => {
                                                        await this.props.updateTotalProjectFunding(item.id, this.state.initialTotalProjectFunding);
                                                        await this.setState({
                                                            selectedTotalProjectFunding: null,
                                                            initialTotalProjectFunding: null
                                                        });
                                                    }}
                                                />
                                                {this.state.selectedTotalProjectFunding === item.id ? <i className="fas fa-times"></i> : null}
                                                {item.edited || item.efci_edited ? (
                                                    <i
                                                        className="fa fa-circle edited-dot cursor-hand"
                                                        aria-hidden="true"
                                                        onClick={() =>
                                                            this.props.showLogsTableTotalFundingCostEfci &&
                                                            this.props.showLogsTableTotalFundingCostEfci(item.id, no_of_years)
                                                        }
                                                    ></i>
                                                ) : null}
                                            </>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </>
        );
    }
}

export default withRouter(InitialFundingOptionsTable);
