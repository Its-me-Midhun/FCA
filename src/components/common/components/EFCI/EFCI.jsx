import React, { Component } from "react";
import CSPSummary from "./CSPSummary";
import FundingEFCIAnalysis from './FundingEFCIAnalysis';
// import CSPSummarySite from "./CSPSummarySite";
// import FundingEFCISite from "./FundingEFCISite";

class EFCI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: props.activeTab,
            grandTotal: null,
            isLocked: false,
            currentArea: props.currentEntity
        }
    }

    componentDidMount() {
        this.renderSubTotalRow();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.efciData !== this.props.efciData) {
            this.renderSubTotalRow();
        }
    }

    setActiveTab(name) {
        const { efciTab, parentEntity, currentEntity } = this.props;
        this.setState({
            activeTab: name,
            currentArea: name === efciTab[2] ? parentEntity : currentEntity
        });
    }

    renderSubTotalRow() {
        let obj = [];
        let grandTotal = 0;
        let subTotalByYear = [];
        const { efciData } = this.props;
        if (
            efciData &&
            efciData.capital_spending_plans &&
            efciData.capital_spending_plans.length
        ) {
            efciData.capital_spending_plans.forEach(function (row) {
                row.fundings &&
                    row.fundings.length &&
                    row.fundings.forEach(function (item) {
                        obj.push(item);
                    });
            });
            let yearHolder = {};
            obj.forEach(function (d) {
                if (yearHolder.hasOwnProperty(d.year)) {
                    yearHolder[d.year] = yearHolder[d.year] + parseInt(d.amount);
                } else {
                    yearHolder[d.year] = parseInt(d.amount);
                }
            });

            for (let prop in yearHolder) {
                subTotalByYear.push({ year: prop, amount: yearHolder[prop] });
            }
        }
        subTotalByYear.map(yeatData => {
            grandTotal += yeatData.amount;
        });

        this.setState({
            subTotalByYear: subTotalByYear,
            grandTotal: grandTotal
        });
    }

    unlock() {
        return (
            <div class={`locked-section unlock-sec ${this.state.isLocked === false ? "active" : ""}`}>
                <button class={`add-btn add-build-btn ${this.state.isLocked === false ? "unlocked" : ""}`}

                    onClick={() => {
                        this.setState({ isLocked: false });
                    }
                    }
                >
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsxlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        width="17.064px" height="15.289px" viewBox="0 0.147 17.064 15.289" enable-background="new 0 0.147 17.064 15.289"
                        xmlspace="preserve">
                        <g>
                            <g>
                                <path fill="none" d="M1.123,8.031v5.6c0.001,0.375,0.308,0.682,0.684,0.683h7.467c0.375-0.001,0.682-0.308,0.684-0.683v-5.6
C9.957,7.653,9.649,7.345,9.274,7.345H1.807C1.43,7.346,1.123,7.654,1.123,8.031z M5.54,8.09c0.994,0.001,1.805,0.811,1.807,1.804
c0,0.8-0.525,1.473-1.246,1.71v1.403C6.099,13.32,5.847,13.57,5.54,13.57H5.537c-0.309-0.001-0.56-0.254-0.558-0.563v-1.403
c-0.72-0.236-1.245-0.909-1.245-1.708C3.734,8.9,4.544,8.09,5.54,8.09z"/>
                                <circle fill="none" cx="5.54" cy="9.897" r="0.684" />
                                <path fill="#707070" d="M0,8.029v5.602c0.001,0.995,0.811,1.805,1.806,1.806h7.468c0.994-0.001,1.805-0.811,1.806-1.806V8.028
c-0.001-0.797-0.524-1.469-1.245-1.705H1.241C0.523,6.563,0.001,7.232,0,8.029z M9.274,7.345c0.375,0,0.683,0.308,0.684,0.686v5.6
c-0.002,0.375-0.309,0.682-0.684,0.683H1.807c-0.376-0.001-0.683-0.308-0.684-0.683v-5.6c0-0.377,0.307-0.685,0.684-0.686H9.274z"
                                />
                                <path fill="#707070" d="M4.979,11.604v1.403c-0.002,0.309,0.249,0.562,0.558,0.563H5.54c0.307,0,0.559-0.25,0.561-0.563v-1.403
c0.721-0.237,1.246-0.91,1.246-1.71C7.345,8.901,6.534,8.091,5.54,8.09c-0.996,0-1.806,0.81-1.806,1.806
C3.734,10.695,4.259,11.367,4.979,11.604z M5.54,9.213c0.377,0,0.684,0.307,0.684,0.682c0,0.377-0.308,0.685-0.684,0.686
c-0.376-0.001-0.683-0.308-0.683-0.685C4.857,9.52,5.164,9.213,5.54,9.213z"/>
                            </g>
                            <path fill="#707070" d="M9.596,4.442c0-1.749,1.424-3.173,3.173-3.173c1.75,0,3.173,1.423,3.173,3.173v1.881h1.123V4.442
c-0.003-2.365-1.93-4.292-4.295-4.295c-2.366,0.003-4.292,1.93-4.295,4.295v1.881h1.121V4.442z"/>
                        </g>
                    </svg>
                    <span class="txt-spn">Unlocked</span>
                </button>
            </div>
        );
    }

    lock() {
        return (
            <div class={`locked-section ${this.state.isLocked === true ? "green-active active" : ""}`}>

                <button class="add-btn add-build-btn" onClick={() => this.setState({ isLocked: true })}>
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsxlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        width="11.08px" height="15.436px" viewBox="0 0 11.08 15.436" enable-background="new 0 0 11.08 15.436" xmlspace="preserve">
                        <g>
                            <path fill="#707070" d="M9.835,6.322V4.295C9.832,1.93,7.905,0.003,5.54,0C3.174,0.003,1.248,1.93,1.245,4.295v2.026
C0.525,6.56,0.001,7.231,0,8.029v5.601c0.001,0.995,0.811,1.805,1.806,1.806h7.468c0.995-0.001,1.805-0.811,1.806-1.806V8.028
C11.079,7.231,10.555,6.559,9.835,6.322z M5.539,1.122c1.75,0,3.173,1.423,3.173,3.173v1.928H2.366V4.295
C2.366,2.546,3.79,1.122,5.539,1.122z M9.274,14.313H1.807c-0.376-0.001-0.683-0.308-0.684-0.683v-5.6
c0-0.376,0.307-0.684,0.684-0.685h7.468c0.375,0,0.682,0.308,0.683,0.685v5.6C9.956,14.005,9.649,14.312,9.274,14.313z"/>
                            <path fill="#707070" d="M5.54,8.09c-0.996,0-1.806,0.81-1.806,1.806c0,0.799,0.525,1.471,1.245,1.708v1.403
c-0.002,0.309,0.249,0.562,0.558,0.563h0.003c0.307,0,0.559-0.25,0.56-0.563v-1.403c0.721-0.238,1.246-0.91,1.246-1.71
C7.345,8.901,6.534,8.091,5.54,8.09z M4.857,9.896c0-0.376,0.307-0.683,0.683-0.683c0.377,0,0.684,0.307,0.684,0.682
c-0.001,0.377-0.308,0.684-0.684,0.685C5.164,10.579,4.857,10.273,4.857,9.896z M5.541,13.32L5.541,13.32L5.541,13.32L5.541,13.32z
"/>
                        </g>
                    </svg>
                    <span class="txt-spn">Locked</span>
                </button>
            </div>
        );
    }

    render() {
        const { efciData, basicDetails, efciTab, parentEntity } = this.props;
        const { activeTab, subTotalByYear } = this.state;
        var areaName = this.state.currentArea === parentEntity ?
            (basicDetails && basicDetails.region && basicDetails.region.name || "") :
            (basicDetails && basicDetails.name || "");
        return (
            <>
                <div class="tab-active location-sec image-sec tab-grey efci-otr fund-efci" id={"efciData"}>
                    <div class="dtl-sec col-md-12">
                        <div class="table-top-menu zoom-section">
                            <div class="lft">
                                {this.lock()}
                                {this.unlock()}
                            </div>

                            <div class="cent">
                                <div class="type-section margin-left transparent">
                                    <span class="type-des font-inc">
                                        {`${this.state.currentArea} - ${areaName}`}
                                    </span>
                                </div>
                            </div>
                            <div class="rgt">
                                {efciTab && efciTab.length && efciTab.map((tab, i) => (
                                    <button
                                        class={`${activeTab === tab ? "btn-fci active" : efciTab[i] === efciTab[efciTab.length - 1] ? "btn-fci btn-dif" : "btn-fci"} `}
                                        name={tab}
                                        onClick={event => this.setActiveTab(event.target.name)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {activeTab === efciTab[0] ? (
                            efciData && efciData.name ? (
                                <CSPSummary
                                    efciSiteData={efciData}
                                    updatePercentage={this.props.updatePercentage}
                                    updateSiteCapitalSpending={this.props.updateCapitalSpending}
                                />
                            ) : (
                                    <div class="table-topper efc-topr">
                                        <div class="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                        ) : activeTab === efciTab[1] ? (
                            efciData && efciData.name ? (
                                // <></>
                                <FundingEFCIAnalysis
                                    efciSiteData={efciData}
                                    subTotalByYear={subTotalByYear}
                                />
                                // <FundingEFCISite
                                //     efciSiteData={efciSiteData}
                                //     subTotalByYear={subTotalByYear}
                                //     updateFcis={this.props.updateFcis}
                                //     updateFundingEfciData={this.props.updateFundingEfciData}
                                //     updateSiteFundingOption={this.props.updateSiteFundingOption}
                                //     hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                //     updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                //     updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                //     updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                //     updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                                //     updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                //     updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                //     updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                //     updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                // />
                            ) : (
                                    <div class="table-topper efc-topr" >
                                        <div class="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                        ) : activeTab === efciTab[2] ? (
                            efciData && efciData.name ? (
                                // <></>
                                <FundingEFCIAnalysis
                                    efciSiteData={efciData}
                                    subTotalByYear={subTotalByYear}

                                />
                            ) : (
                                    <div class="table-topper efc-topr" >
                                        <div class="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                        ) : null}
                    </div>
                </div>
            </>
        );
    }
}
export default EFCI;
