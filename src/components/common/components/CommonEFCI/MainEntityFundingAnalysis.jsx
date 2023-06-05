import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../Loader";
import CSPFundingTable from "./CSPFundingTable";
import FinalFundingOption from "./FinalFundingOption";
import InitialFundingTable from "./InitialFundingTable";
import AnnualEFCICalculation from "./AnnualEFCICalculation";
import AnnualFundingCalculation from "./AnnualFundingCalculation";
import MainInitialFundingOption from "./MainInitialFundingOption";
import MainAnnualEfciCalculation from "./MainAnnualEfciCalculation";
import MainEntityAnnualFunding from "./MainEntityAnnualFunding";

class MainEntityFundingAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "CSP Summary",
            grandTotal: null,
            locked: false,
            isloading: false,
            actualFunding: []
        };
        this.toggleLoader = this.toggleLoader.bind(this);
    }

    componentDidMount() {
        this.getActualFunding();
        this.getTotalFundingCost();
        this.getTotalFundingCostData();
        this.setYearList();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.efciData !== this.props.efciData) {
            this.getTotalFundingCostData();
            this.getTotalFundingCost();
        }
    }

    setYearList() {
        let yearList = [];
        this.props.efciData.annual_fundings && this.props.efciData.annual_fundings[1].map(i => (
            yearList = [...yearList, i.year]
        ))
        this.setState({
            yearList: yearList
        })
    }

    getActualFunding = () => {
        const { efciData } = this.props;
        let d = [];
        let length = Object.values(this.props.efciData.annual_fundings).length;
        let total = 0;
        efciData.funding_options.map(
            (item, index) => (
                (total = 0), Object.values(this.props.efciData.annual_fundings)[index].map(data => (total += parseInt(data.amount))), d.push(total)
            ),
        );
        return d;
    };

    getTotalFundingCost = () => {
        const {
            efciData: { funding_options }
        } = this.props;
        let totalCost = 0;
        let c = [];
        funding_options &&
            funding_options.length &&
            funding_options.map((item, index) => ((totalCost = 0), (totalCost = item.value * this.props.efciData.no_of_years), c.push(totalCost)));
        this.setState({
            totalCost: c
        });
    };

    getTotalFundingCostData = () => {
        const {
            efciData: { funding_options }
        } = this.props;
        let totalCost = 0;
        let c = [];
        funding_options &&
            funding_options.length &&
            funding_options.map((item, index) => ((totalCost = 0), (totalCost = item.value * this.props.efciData.no_of_years), c.push(totalCost)));
        // return c
        this.setState({
            totalCostData: c
        });
    };

    toggleLoader() {
        this.setState({
            loading: !this.state.loading
        });
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

    setTotal = data => {
        let total = 0;
        data && data.map(element => (total += parseInt(element.amount)));
        return total;
    };

    handLeTotalFundingCost = (index, value) => {
        let tempData = this.state.totalCostData;
        tempData[index] = value
        this.setState({
            totalCostData: tempData
        });
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
        let actualFunding = this.getActualFunding();

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
                                <MainInitialFundingOption
                                    setColor={this.props.setColor}
                                    efciData={this.props.efciData}
                                    efciBuildingData={this.props.efciBuildingData}
                                    disableClick={this.props.disableClick}
                                    totalProjectCost={this.state.totalCostData}
                                    handLeTotalFundingCost={this.handLeTotalFundingCost}
                                    handleMainEntityEfciFundingCost={this.props.handleMainEntityEfciFundingCost}
                                    updateMainEntityEfciFundingCost={this.props.updateMainEntityEfciFundingCost}
                                    handleMainEntityFundingCostEfci={this.props.handleMainEntityFundingCostEfci}
                                    updateMainEntityFundingEfci={this.props.updateMainEntityFundingEfci}
                                    showLog={this.props.showLog}

                                    handleHideFundingOptions={this.handleHideFundingOptions}
                                    hiddenFundingOptionList={this.props.hiddenFundingOptionList}
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
                                <FinalFundingOption
                                    actualFunding={actualFunding}
                                    efciData={this.props.efciData}
                                    setColor={this.props.setColor}
                                    totalCost={this.state.totalCost}
                                />
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
                                <tbody>
                                    <tr>
                                        <td>
                                            <CSPFundingTable
                                                efciData={this.props.efciData}

                                                handleHideFundingOptions={this.handleHideFundingOptions}
                                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                            />
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
                                            <MainEntityAnnualFunding
                                                setTotal={this.setTotal}
                                                efciData={this.props.efciData}
                                                disableClick={this.props.disableClick}
                                                handleMainEntityAnnualFundingOption={this.props.handleMainEntityAnnualFundingOption}
                                                updateMainEntityAnnualFunding={this.props.updateMainEntityAnnualFunding}
                                                showLog={this.props.showLog}

                                                handleHideFundingOptions={this.handleHideFundingOptions}
                                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}

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
                                            <MainAnnualEfciCalculation
                                                actualFunding={actualFunding}
                                                efciData={this.props.efciData}
                                                setColor={this.props.setColor}
                                                handleMainEntityAnnualEfci={this.props.handleMainEntityAnnualEfci}
                                                updateMainEntityAnnualEFCI={this.props.updateMainEntityAnnualEFCI}
                                                disableClick={this.props.disableClick}
                                                showLog={this.props.showLog}

                                                handleHideFundingOptions={this.handleHideFundingOptions}
                                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}

                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </LoadingOverlay >
        );
    }
}
export default MainEntityFundingAnalysis;
