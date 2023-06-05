import React, { Component } from "react";
import CSPSummary from "./CSPSummary";
import FundingEFCIAnalysis from "./FundingEFCIAnalysis";
import Loader from "../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import InitialFundingOptionSite from "../../site/components/InitialFundingOptionSite";
import FinalFundingOptionSite from "../../site/components/FinalFundingOptionSite";
import CSPSite from "../../site/components/CSPSite";
import AnnualFundingOptionCalculationSite from "../../site/components/AnnualFundingOptionCalculationSite";
import AnnualEfciCalculationSite from "../../site/components/AnnualEfciCalculationSite";
import InitialFundingOptionBuildingSite from "./InitialFundingOptionBuildingSite";
import FinalFundingOptionBuildingSite from "./FinalFundingOptionBuildingSite";
import CSPBuildingSite from "./CSPBuildingSite";
import AnnualFundingOptionCalculationBuildingSite from "./AnnualFundingOptionCalculationBuildingSite";
import AnnualEfciCalculationBuildingSite from "./AnnualEfciCalculationBuildingSite";

class SiteFundingEFCIAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "CSP Summary",
            grandTotal: null,
            locked: false,
            isloading: false,
            loading: false
        };
        this.toggleLoader = this.toggleLoader.bind(this);
    }

    toggleLoader() {
        this.setState({
            loading: !this.state.loading
        })
    }

    handleHideFundingOptionsSite = async id => {
        let tempList = this.props.hideFundingOptionSiteList;
        if (tempList.includes(id)) {
            tempList = tempList.filter(item => item !== id);
        } else {
            tempList.push(id);
        }
        await this.props.hideFundingOptionSite(tempList);
    };

    render() {
        const { efciSiteData, grandTotal, subTotalByYear, efciBuildingData } = this.props;
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
                                < InitialFundingOptionBuildingSite
                                    efciSiteData={efciSiteData}
                                    toggleLoader={this.toggleLoader}
                                    efciBuildingData={efciBuildingData}
                                    updateProjectAnnualFundingSite={this.props.updateProjectAnnualFundingSite}
                                    updateSiteFundingOptionSite={this.props.updateSiteFundingOptionSite}
                                    updateEfciInInitialFundingOptionsSite={this.props.updateEfciInInitialFundingOptionsSite}
                                    updateFundingEfciData={this.props.updateFundingEfciData}
                                    updateTotalProjectFundingSite={this.props.updateTotalProjectFundingSite}
                                    hideFundingOptionSite={this.handleHideFundingOptionsSite}
                                    hideFundingOptionSiteList={this.props.hideFundingOptionSiteList}
                                    showSiteLogsTableFundingOption={this.props.showSiteLogsTableFundingOption}
                                    showSiteLogsTableFundingOptionEfci={this.props.showSiteLogsTableFundingOptionEfci}
                                    showSiteLogsTableTotalFundingOptionEfci={this.props.showSiteLogsTableTotalFundingOptionEfci}
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
                                <FinalFundingOptionBuildingSite
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
                                        <CSPBuildingSite
                                            efciSiteData={efciSiteData}
                                            subTotalByYear={subTotalByYear}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="frozen">
                                        <div class="table-topper efc-topr">
                                            <div class="col-md-12 otr-topr">
                                                <h3>Annual Funding Options Calculation</h3>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="lef-td"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <AnnualFundingOptionCalculationBuildingSite
                                            efciSiteData={efciSiteData}
                                            efciBuildingData={efciBuildingData}
                                            toggleLoader={this.toggleLoader}
                                            updateAnnualFundingOptionSite={this.props.updateAnnualFundingOptionSite}
                                            hideFundingOptionSiteList={this.props.hideFundingOptionSiteList}
                                            updateAnnualFundingOptionCalculationSite={this.props.updateAnnualFundingOptionCalculationSite}
                                            showSiteLogsTableAnnualFundingOption={this.props.showSiteLogsTableAnnualFundingOption}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="frozen">
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
                                        <AnnualEfciCalculationBuildingSite
                                            efciSiteData={efciSiteData}
                                            toggleLoader={this.toggleLoader}
                                            efciBuildingData={efciBuildingData}
                                            updateFcisSite={this.props.updateFcisSite}
                                            hideFundingOptionSiteList={this.props.hideFundingOptionSiteList}
                                            updateAnnualEfciCalculationSite={this.props.updateAnnualEfciCalculationSite}
                                            showSiteLogsTableAnnualEfci={this.props.showSiteLogsTableAnnualEfci}
                                        />
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}
export default SiteFundingEFCIAnalysis;