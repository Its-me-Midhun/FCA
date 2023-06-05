import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import CspTable from "./CspTable";
import Loader from "../../common/components/Loader";
import FinalFundingOptionsTable from "./FinalFundingOptionsTable";
import AnnualEfciCalculationTable from "./AnnualEfciCalculationTable";
import InitialFundingOptionsTable from "./InitialFundingOptionsTable";
import AnnualFundingOptionsCalculationTable from "./AnnualFundingOptionsCalculationTable";

class FundingEFCIAnalysis extends Component {
    state = {
        loading: false,
        refreshData: false
    };

    handleHideFundingOptions = async id => {
        let tempList = this.props.hiddenFundingOptionList;
        if (tempList.includes(id)) {
            tempList = tempList.filter(item => item !== id);
        } else {
            tempList.push(id);
        }
        await this.props.updateHiddenFundingOption(tempList);
    };

    toggleLoader = async () => {
        await this.setState({
            loading: !this.state.loading
        });
    };

    render() {
        const {
            updateFcis,
            subTotalByYear,
            efciBuildingData,
            updateAnnualFunding,
            updateFundingOption,
            updateFundingOptionEfci,
            hiddenFundingOptionList,
            updateTotalProjectFunding,
            updateProjectAnnualFunding,
            updateAnnualEfciCalculation,
            updateEfciInInitialFundingOptions,
            updateAnnualFundingOptionCalculation
        } = this.props;

        return (
            <LoadingOverlay active={this.state.loading} spinner={<Loader />} fadeSpeed={10}>
                <div className="row">
                    <div className="col-md-7 pr-0">
                        <div className="table-topper efc-topr border-right-0">
                            <div className="col-md-12 otr-topr">
                                <h3>Initial Funding Options</h3>
                            </div>
                        </div>
                        <div className="table-section table-scroll build-fci funding table-small">
                            <InitialFundingOptionsTable
                                toggleLoader={this.toggleLoader}
                                efciBuildingData={efciBuildingData}
                                hiddenFundingOptionList={hiddenFundingOptionList}
                                updateFundingOptionEfci={updateFundingOptionEfci}
                                updateTotalProjectFunding={updateTotalProjectFunding}
                                updateFundingOption1={this.props.updateFundingOption1}
                                updateProjectAnnualFunding={updateProjectAnnualFunding}
                                handleHideFundingOptions={this.handleHideFundingOptions}
                                updateEfciInInitialFundingOptions={updateEfciInInitialFundingOptions}
                                showLogsTableFundingCost={this.props.showLogsTableFundingCost}
                                showLogsTableFundingCostEfci={this.props.showLogsTableFundingCostEfci}
                                showLogsTableTotalFundingCostEfci={this.props.showLogsTableTotalFundingCostEfci}
                                getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
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
                            <FinalFundingOptionsTable efciBuildingData={efciBuildingData} />
                        </div>
                    </div>
                </div>
                {/* <div className="efci-outer-table">
                    <div className="table-topper efc-topr">
                        <div className="col-md-12 otr-topr d-flex">
                            <h3>CSP </h3>
                        </div>
                    </div>
                    <div className="table-section table-scroll build-fci fc-capital-nw build-efci">
                        <table className="table table-common-outer">
                            <tr>
                                <td>
                                    <CspTable efciBuildingData={efciBuildingData} subTotalByYear={subTotalByYear} />
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
                                    <AnnualFundingOptionsCalculationTable
                                        toggleLoader={this.toggleLoader}
                                        efciBuildingData={efciBuildingData}
                                        updateAnnualFunding={updateAnnualFunding}
                                        hiddenFundingOptionList={hiddenFundingOptionList}
                                        updateAnnualFundingOptionCalculation={updateAnnualFundingOptionCalculation}
                                        showLogsTableAnnualFundingOption={this.props.showLogsTableAnnualFundingOption}
                                    />
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
                                    <AnnualEfciCalculationTable
                                        updateFcis={updateFcis}
                                        toggleLoader={this.toggleLoader}
                                        efciBuildingData={efciBuildingData}
                                        hiddenFundingOptionList={hiddenFundingOptionList}
                                        updateAnnualEfciCalculation={updateAnnualEfciCalculation}
                                        showLogsTableAnnualEfci={this.props.showLogsTableAnnualEfci}
                                    />
                                </td>
                            </tr>
                        </table>
                    </div>
                </div> */}
                <div className="efci-outer-table">
                    <div className="custom-table-scroll">
                        <div className="table-topper efc-topr">
                            <div className="col-md-12 otr-topr d-flex">
                                <h3>CSP </h3>
                            </div>
                        </div>
                        <div className="table-section table-scroll build-fci fc-capital-nw build-efci">
                            <table className="table table-common-outer">
                                <tr>
                                    <td>
                                        <CspTable efciBuildingData={efciBuildingData} subTotalByYear={subTotalByYear} />
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="table-topper efc-topr">
                            <div className="col-md-12 otr-topr d-flex">
                                <h3>Annual Funding Options Calculation & EFCI Calculation</h3>
                            </div>
                        </div>
                        <div className="table-section table-scroll build-fci fc-capital-nw build-efci">
                            <table className="table table-common-outer">
                                <tr>
                                    <td>
                                        <AnnualFundingOptionsCalculationTable
                                            toggleLoader={this.toggleLoader}
                                            efciBuildingData={efciBuildingData}
                                            updateAnnualFunding={updateAnnualFunding}
                                            hiddenFundingOptionList={hiddenFundingOptionList}
                                            updateAnnualFundingOptionCalculation={updateAnnualFundingOptionCalculation}
                                            showLogsTableAnnualFundingOption={this.props.showLogsTableAnnualFundingOption}
                                            //Annual Efci calculation table 
                                            updateFcis={updateFcis}
                                            updateAnnualEfciCalculation={updateAnnualEfciCalculation}
                                            showLogsTableAnnualEfci={this.props.showLogsTableAnnualEfci}
                                        />
                                    </td>
                                </tr>
                            </table>
                        </div>
                        {/* <div className="table-topper efc-topr">
                            <div className="col-md-12 otr-topr d-flex">
                                <h3>Annual EFCI Calculation</h3>
                            </div>
                        </div> */}
                        {/* <div className="table-section table-scroll build-fci fc-capital-nw build-efci">
                            <table className="table table-common-outer">
                                <tr>
                                    <td>
                                        <AnnualEfciCalculationTable
                                            updateFcis={updateFcis}
                                            toggleLoader={this.toggleLoader}
                                            efciBuildingData={efciBuildingData}
                                            hiddenFundingOptionList={hiddenFundingOptionList}
                                            updateAnnualEfciCalculation={updateAnnualEfciCalculation}
                                            showLogsTableAnnualEfci={this.props.showLogsTableAnnualEfci}
                                        />
                                    </td>
                                </tr>
                            </table>
                        </div> */}
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

export default withRouter(FundingEFCIAnalysis);
