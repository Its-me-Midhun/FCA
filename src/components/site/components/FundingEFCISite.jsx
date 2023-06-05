import React, { Component } from "react";
import CSPSite from "./CSPSite";
import FinalFundingOptionSite from './FinalFundingOptionSite'
import InitialFundingOptionSite from "./InitialFundingOptionSite";
import AnnualEfciCalculationSite from "./AnnualEfciCalculationSite";
import AnnualFundingOptionCalculationSite from "./AnnualFundingOptionCalculationSite";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";

class FundingEFCISite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.toggleLoader = this.toggleLoader.bind(this);
    }

    toggleLoader() {
        this.setState({ loading: !this.state.loading })
    }

    handleHideFundingOptions = async id => {
        let tempList = this.props.hiddenFundingOptionList;
        if (tempList.includes(id)) {
            tempList = tempList.filter(item => item !== id);
        } else {
            tempList.push(id);
        }
        await this.props.updateHiddenFundingOption(tempList);
    };
    render() {
        const {
            efciSiteData,
            subTotalByYear,
            updateProjectAnnualFunding,
            updateSiteFundingOption,
            updateEfciInInitialFundingOptions
        } = this.props;
        return (
            <LoadingOverlay active={this.state.loading} spinner={<Loader />} fadeSpeed={10}>
                <div>
                    <div className="row">
                        <div className="col-md-7 pr-0">
                            <div className="table-topper efc-topr border-right-0">
                                <div className="col-md-12 otr-topr">
                                    <h3>Initial Funding Options</h3>
                                </div>
                            </div>
                            <div className="table-section table-scroll build-fci funding table-small">
                                < InitialFundingOptionSite
                                    efciSiteData={efciSiteData}
                                    toggleLoader={this.toggleLoader}
                                    updateSiteFundingOption={updateSiteFundingOption}
                                    updateProjectAnnualFunding={updateProjectAnnualFunding}
                                    updateFundingEfciData={this.props.updateFundingEfciData}
                                    handleHideFundingOptions={this.handleHideFundingOptions}
                                    updateHiddenFundingOption={this.updateHiddenFundingOption}
                                    hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                    updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                    updateEfciInInitialFundingOptions={updateEfciInInitialFundingOptions}
                                    updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                    showLogsTableFundingOption={this.props.showLogsTableFundingOption}
                                    getFundingEfciLog={this.props.getFundingEfciLog}
                                    showLogsTableFundingEfci={this.props.showLogsTableFundingEfci}
                                    showLogsTotalFundingOption={this.props.showLogsTotalFundingOption}
                                    disableClick={this.props.disableClick}
                                />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="table-topper efc-topr">
                                <div className="col-md-12 otr-topr">
                                    <h3>Final Funding Options</h3>
                                </div>
                            </div>
                            <div className="table-section table-scroll build-fci funding table-small">
                                <FinalFundingOptionSite
                                    efciSiteData={efciSiteData}
                                />
                            </div>
                        </div>
                    </div>

                    <div class="efci-outer-table">
                        <div class="table-topper efc-topr">
                            <div class="col-md-12 otr-topr d-flex">
                                <h3>CSP </h3>
                            </div>
                        </div>
                        <div class="table-section table-scroll build-fci fc-capital-nw build-efci">
                            <table class="table table-common-outer">
                                <tr>
                                    <td>
                                        <CSPSite
                                            efciSiteData={efciSiteData}
                                            subTotalByYear={subTotalByYear}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="frozen">
                                        <div class="table-topper efc-topr">
                                            <div class="col-md-12 otr-topr">
                                                <h3>Annual Funding Options Calculation & EFCI Calculation</h3>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="lef-td"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <AnnualFundingOptionCalculationSite
                                            efciSiteData={efciSiteData}
                                            toggleLoader={this.toggleLoader}
                                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                            updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                            updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                            updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                            getAnnualFundingCalculationColumnLogs={this.props.getAnnualFundingCalculationColumnLogs}
                                            annualFundingOptionLogs={this.props.annualFundingOptionLogs}
                                            showLogsTable={this.props.showLogsTable}
                                            showLogsTableFunding={this.props.showLogsTableFunding}
                                            disableClick={this.props.disableClick}
                                            //Annual Efci Calculation site
                                            updateFcis={this.props.updateFcis}
                                            getAnnualEfciColumnLogs={this.props.getAnnualEfciColumnLogs}
                                            updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                            annualEfciLog={this.props.annualEfciLog}
                                            annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                                            restoreAnnualEfciCalculation={this.props.restoreAnnualEfciCalculation}

                                        />
                                    </td>
                                </tr>
                                <tr>
                                    {/* <td class="frozen">
                                        <div class="table-topper efc-topr">
                                            <div class="col-md-12 otr-topr">
                                                <h3>Annual EFCI Calculation</h3>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="lef-td"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <AnnualEfciCalculationSite
                                            efciSiteData={efciSiteData}
                                            toggleLoader={this.toggleLoader}
                                            updateFcis={this.props.updateFcis}
                                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                            getAnnualEfciColumnLogs={this.props.getAnnualEfciColumnLogs}
                                            updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                            updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                            annualEfciLog={this.props.annualEfciLog}
                                            annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                                            showLogsTable={this.props.showLogsTable}
                                            restoreAnnualEfciCalculation={this.props.restoreAnnualEfciCalculation}
                                            disableClick={this.props.disableClick}

                                       />
                                    </td> */}
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }

}
export default FundingEFCISite;
