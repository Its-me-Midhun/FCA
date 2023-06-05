import React, { Component } from "react";
import _, { uniqBy } from "lodash";
import NumberFormat from "react-number-format";
import { withRouter } from "react-router-dom";

class InitialFundingOptionSite extends Component {
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
            updateEfciInInitialFundingOptions,
            updateFundingEfciData,
            handleHideFundingOptions,
        } = this.props;
        return (
            <>
                <table className="table table-common allign-item">
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
                                            className={hiddenFundingOptionList && hiddenFundingOptionList.includes(item.id) ? "fa fa-eye-slash" : "fa fa-eye"}
                                            // onClick={() =>
                                            //     handleHideFundingOptions(item.id)}
                                        />
                                    </td>
                                    <td>{item.funding}</td>
                                    <td className="pos-table-otr-sec pos-otr">
                                        <div className="pos-sec">
                                            <>
                                                <NumberFormat
                                                    // id="input"
                                                    className="form-control fc-no-dot"
                                                    value={item.funding_cost}
                                                    thousandSeparator={true}
                                                    prefix={"$ "}
                                                    onValueChange={async values => {
                                                        const { value } = values;
                                                        // await this.props.updateProjectAnnualFunding(item.id, value);

                                                    }}
                                                    onFocus={async () => {
                                                        await this.setState({
                                                            selectedProjectAnnualFunding: item.id,
                                                            initialFundingCost: item.funding_cost
                                                        });
                                                    }}

                                                    onKeyPress={async event => {
                                                        if (event.key === "Enter") {
                                                            await this.setState({ target: event.target })
                                                            await this.setState({
                                                                site_fci: {
                                                                    value: item.funding_cost,
                                                                }
                                                            });
                                                            await toggleLoader();
                                                            // await this.props.updateSiteFundingOption(this.state.selectedProjectAnnualFunding, this.state.site_fci);
                                                            await this.setState({
                                                                selectedProjectAnnualFunding: item.id,
                                                                initialFundingCost: item.funding_cost
                                                            });
                                                            await toggleLoader();
                                                            this.state.target.blur();
                                                        }
                                                    }}
                                                    onBlur={async () => {
                                                        // await this.props.updateProjectAnnualFunding(item.id, this.state.initialFundingCost);
                                                        await this.setState({
                                                            selectedProjectAnnualFunding: null,
                                                            initialFundingCost: null
                                                        });
                                                    }}
                                                />
                                                {this.state.selectedProjectAnnualFunding === item.id ? (
                                                    <i className="fas fa-times cursor-pointer"></i>
                                                ) : null}
                                                {item.edited ? <i className="fa fa-circle edited-dot" aria-hidden="true"></i> : null}
                                            </>
                                        </div>
                                    </td>
                                    <td className="pos-table-otr-sec pos-otr">
                                        <div className="pos-sec">
                                            <>
                                                <NumberFormat
                                                    id="input"
                                                    className="form-control fc-no-dot"
                                                    value={item.efci}
                                                    onValueChange={async values => {
                                                        const { value } = values;
                                                        // await this.props.updateEfciInInitialFundingOptions(item.efci_id, value);
                                                    }}
                                                    onFocus={async () => {
                                                        await this.setState({
                                                            selectedEfci: item.efci_id,
                                                            initialEfci: item.efci
                                                        });
                                                    }}
                                                    onKeyPress={async event => {
                                                        if (event.key === "Enter") {
                                                            await this.setState({
                                                                target: event.target
                                                            })
                                                            // await toggleLoader();
                                                            // await updateFundingEfciData(item.efci_id, { value: item.efci });
                                                            await this.setState({
                                                                selectedEfci: null,
                                                                initialEfci: item.efci
                                                            });
                                                            // await toggleLoader();
                                                            this.state.target.blur();
                                                        }
                                                    }}
                                                    onBlur={async () => {
                                                        // await this.props.updateEfciInInitialFundingOptions(item.efci_id, this.state.initialEfci);
                                                        await this.setState({
                                                            selectedEfci: null,
                                                            initialEfci: null
                                                        });
                                                    }}
                                                />
                                                {this.state.selectedEfci === item.efci_id ? <i className="fas fa-times"></i> : null}
                                                {item.efci_edited ? <i className="fa fa-circle edited-dot" aria-hidden="true"></i> : null}
                                            </>
                                        </div>
                                    </td>
                                    <td className="pos-table-otr-sec pos-otr">
                                        <div className="pos-sec">
                                            <>
                                                <NumberFormat
                                                    // id="input1"
                                                    className="form-control fc-no-dot"
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
                                                        // await this.props.updateTotalProjectFunding(item.id, value);
                                                    }}
                                                    onKeyPress={async event => {
                                                        const total = parseInt(parseInt(item.expected_cost) / (efciSiteData.no_of_years ? efciSiteData.no_of_years : 1));
                                                        if (event.key === "Enter") {
                                                            await this.setState({
                                                                target: event.target
                                                            })
                                                            // await toggleLoader();
                                                            // await this.props.updateSiteFundingOption(this.state.selectedTotalProjectFunding, {
                                                            //     value: total
                                                            // });
                                                            // await this.props.updateTotalProjectFunding(item.id, item.expected_cost);
                                                            await this.setState({
                                                                selectedTotalProjectFunding: item.id,
                                                                initialTotalProjectFunding: item.expected_cost
                                                            });
                                                            // await toggleLoader();
                                                            this.state.target.blur();
                                                        }
                                                    }}
                                                    onBlur={async () => {
                                                        // await this.props.updateTotalProjectFunding(item.id, this.state.initialTotalProjectFunding);
                                                        await this.setState({
                                                            selectedTotalProjectFunding: null,
                                                            initialTotalProjectFunding: null
                                                        });
                                                    }}
                                                />
                                                {this.state.selectedTotalProjectFunding === item.id ? <i className="fas fa-times"></i> : null}
                                                {item.edited || item.efci_edited ? (
                                                    <i className="fa fa-circle edited-dot" aria-hidden="true"></i>
                                                ) : null}
                                            </>
                                        </div>
                                    </td>
                                </tr>
                            )):null}
                    </tbody>
                </table>
            </>
        );
    }
}

 export default withRouter(InitialFundingOptionSite);
