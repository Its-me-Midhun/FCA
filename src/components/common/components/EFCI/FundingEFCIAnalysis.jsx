import React, { Component } from "react";
// import CSPSite from "./CSPSite";
// import FinalFundingOptionSite from './FinalFundingOptionSite'
// import InitialFundingOptionSite from "./InitialFundingOptionSite";
// import AnnualEfciCalculationSite from "./AnnualEfciCalculationSite";
// import AnnualFundingOptionCalculationSite from "./AnnualFundingOptionCalculationSite";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../Loader";
import InitialFundingOption from "./InitialFundingOption";
import FinalFundingOption from "./FinalFundingOption";
import CSPSite from "./CSPSite";
import AnnualFundingOptionCalculation from "./AnnualFundingOptionCalculation";
import AnnualEfciCalculation from "./AnnualEfciCalculation";

class FundingEFCISite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        this.toggleLoader = this.toggleLoader.bind(this);
    }

    toggleLoader() {
        this.setState({ loading: !this.state.loading });
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
        const { efciSiteData, subTotalByYear, updateProjectAnnualFunding, updateSiteFundingOption, updateEfciInInitialFundingOptions } = this.props;
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
                                <InitialFundingOption efciSiteData={efciSiteData} toggleLoader={this.toggleLoader} />
                                {/* < InitialFundingOptionSite
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
                                /> */}
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="table-topper efc-topr">
                                <div className="col-md-12 otr-topr">
                                    <h3>Final Funding Options</h3>
                                </div>
                            </div>
                            <div className="table-section table-scroll build-fci funding table-small">
                                <FinalFundingOption efciSiteData={efciSiteData} />
                            </div>
                        </div>
                    </div>

                    <div className="efci-outer-table">
                        <div className="table-topper efc-topr">
                            <div className="col-md-12 otr-topr d-flex">
                                <h3>CSP </h3>
                            </div>
                        </div>
                        <div className="table-section table-scroll build-fci fc-capital-nw build-efci">
                            <table className="table table-common-outer">
                                <tr>
                                    <td>
                                        <CSPSite efciSiteData={efciSiteData} subTotalByYear={subTotalByYear} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="frozen">
                                        <div className="table-topper efc-topr">
                                            <div className="col-md-12 otr-topr">
                                                <h3>Annual Funding Options Calculation</h3>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="lef-td"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <AnnualFundingOptionCalculation
                                            efciSiteData={efciSiteData}
                                            toggleLoader={this.toggleLoader}
                                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                            // updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                            // updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                            // updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                        />
                                        {/* <AnnualFundingOptionCalculationSite
                                            efciSiteData={efciSiteData}
                                            toggleLoader={this.toggleLoader}
                                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                            updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                            updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                            updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                        /> */}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="frozen">
                                        <div className="table-topper efc-topr">
                                            <div className="col-md-12 otr-topr">
                                                <h3>Annual EFCI Calculation</h3>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="lef-td"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <AnnualEfciCalculation
                                            efciSiteData={efciSiteData}
                                            toggleLoader={this.toggleLoader}
                                            // updateFcis={this.props.updateFcis}
                                            // hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                            // updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                            // updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                        />
                                        {/* <AnnualEfciCalculationSite
                                            efciSiteData={efciSiteData}
                                            toggleLoader={this.toggleLoader}
                                            updateFcis={this.props.updateFcis}
                                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                            updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                            updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                        /> */}
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
export default FundingEFCISite;
