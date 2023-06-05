import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import ColorCodedata from "../../common/components/ColoCodeData";
import CSPSummary from "../../common/components/CommonEFCI/CSPSummary";
import FundingEFCIAnalysis from "../../common/components/CommonEFCI/FundingEFCIAnalysis";
import Loader from "../../common/components/Loader";
// import SiteFundingEFCIAnalysis from "../../building/components/SiteFundingEFCIAnalysis";
// import ColorCodedata from "../../common/components/ColoCodeData";
// import FundingEFCIAnalysis from "../../common/components/CommonEFCI/FundingEFCIAnalysis";
// import ConfirmationModal from "../../common/components/ConfirmationModal";
// import EFCILogs from "../../common/components/EFCILogs";
// import Loader from "../../common/components/Loader";
// import LogsInfo from "../../common/components/LogsInfo";
// import Portal from "../../common/components/Portal";
// import CSPSummarySite from "./CSPSummarySite";
// import FundingEFCISite from "./FundingEFCISite";
// import FundingOptionLog from "./FundingOptionLog";
// import LogAnnualFunding from "./LogAnnualFunding";
import HelperIcon from "../../helper/components/HelperIcon";
class EFCIRegion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locked: false,
            activeTab: "2",
            grandTotal: null,
            locked: false,
            currentArea: "Region",
            openSection: false,
            hasLoading: false,
            sortKey: "efci_versions.created_at",
            sortOrder: false,
            isOpenColorCode: false
        };
    }

    lock() {
        return (
            <div className={`locked-section ${this.state.locked === true ? "green-active active" : ""}`}>
                <button
                    className="add-btn add-build-btn"
                    onClick={async () => {
                        await this.setState({ locked: true });
                        // await this.updateBuildingEfciLock();
                    }}
                >
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="11.08px"
                        height="15.436px"
                        viewBox="0 0 11.08 15.436"
                        enableBackground="new 0 0 11.08 15.436"
                        xmlSpace="preserve"
                    >
                        <g>
                            <path
                                fill="#707070"
                                d="M9.835,6.322V4.295C9.832,1.93,7.905,0.003,5.54,0C3.174,0.003,1.248,1.93,1.245,4.295v2.026
C0.525,6.56,0.001,7.231,0,8.029v5.601c0.001,0.995,0.811,1.805,1.806,1.806h7.468c0.995-0.001,1.805-0.811,1.806-1.806V8.028
C11.079,7.231,10.555,6.559,9.835,6.322z M5.539,1.122c1.75,0,3.173,1.423,3.173,3.173v1.928H2.366V4.295
C2.366,2.546,3.79,1.122,5.539,1.122z M9.274,14.313H1.807c-0.376-0.001-0.683-0.308-0.684-0.683v-5.6
c0-0.376,0.307-0.684,0.684-0.685h7.468c0.375,0,0.682,0.308,0.683,0.685v5.6C9.956,14.005,9.649,14.312,9.274,14.313z"
                            />
                            <path
                                fill="#707070"
                                d="M5.54,8.09c-0.996,0-1.806,0.81-1.806,1.806c0,0.799,0.525,1.471,1.245,1.708v1.403
c-0.002,0.309,0.249,0.562,0.558,0.563h0.003c0.307,0,0.559-0.25,0.56-0.563v-1.403c0.721-0.238,1.246-0.91,1.246-1.71
C7.345,8.901,6.534,8.091,5.54,8.09z M4.857,9.896c0-0.376,0.307-0.683,0.683-0.683c0.377,0,0.684,0.307,0.684,0.682
c-0.001,0.377-0.308,0.684-0.684,0.685C5.164,10.579,4.857,10.273,4.857,9.896z M5.541,13.32L5.541,13.32L5.541,13.32L5.541,13.32z
"
                            />
                        </g>
                    </svg>
                    <span className="txt-spn">Locked</span>
                </button>
            </div>
        );
    }

    unlock() {
        return (
            <div className={`locked-section unlock-sec ${this.state.locked === false ? "active" : ""}`}>
                <button
                    className={`add-btn add-build-btn ${this.state.locked === false ? "unlocked" : ""}`}
                    onClick={async () => {
                        await this.setState({ locked: false });
                        // await this.updateBuildingEfciLock();
                    }}
                >
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="17.064px"
                        height="15.289px"
                        viewBox="0 0.147 17.064 15.289"
                        enableBackground="new 0 0.147 17.064 15.289"
                        xmlSpace="preserve"
                    >
                        <g>
                            <g>
                                <path
                                    fill="none"
                                    d="M1.123,8.031v5.6c0.001,0.375,0.308,0.682,0.684,0.683h7.467c0.375-0.001,0.682-0.308,0.684-0.683v-5.6
C9.957,7.653,9.649,7.345,9.274,7.345H1.807C1.43,7.346,1.123,7.654,1.123,8.031z M5.54,8.09c0.994,0.001,1.805,0.811,1.807,1.804
c0,0.8-0.525,1.473-1.246,1.71v1.403C6.099,13.32,5.847,13.57,5.54,13.57H5.537c-0.309-0.001-0.56-0.254-0.558-0.563v-1.403
c-0.72-0.236-1.245-0.909-1.245-1.708C3.734,8.9,4.544,8.09,5.54,8.09z"
                                />
                                <circle fill="none" cx="5.54" cy="9.897" r="0.684" />
                                <path
                                    fill="#707070"
                                    d="M0,8.029v5.602c0.001,0.995,0.811,1.805,1.806,1.806h7.468c0.994-0.001,1.805-0.811,1.806-1.806V8.028
c-0.001-0.797-0.524-1.469-1.245-1.705H1.241C0.523,6.563,0.001,7.232,0,8.029z M9.274,7.345c0.375,0,0.683,0.308,0.684,0.686v5.6
c-0.002,0.375-0.309,0.682-0.684,0.683H1.807c-0.376-0.001-0.683-0.308-0.684-0.683v-5.6c0-0.377,0.307-0.685,0.684-0.686H9.274z"
                                />
                                <path
                                    fill="#707070"
                                    d="M4.979,11.604v1.403c-0.002,0.309,0.249,0.562,0.558,0.563H5.54c0.307,0,0.559-0.25,0.561-0.563v-1.403
c0.721-0.237,1.246-0.91,1.246-1.71C7.345,8.901,6.534,8.091,5.54,8.09c-0.996,0-1.806,0.81-1.806,1.806
C3.734,10.695,4.259,11.367,4.979,11.604z M5.54,9.213c0.377,0,0.684,0.307,0.684,0.682c0,0.377-0.308,0.685-0.684,0.686
c-0.376-0.001-0.683-0.308-0.683-0.685C4.857,9.52,5.164,9.213,5.54,9.213z"
                                />
                            </g>
                            <path
                                fill="#707070"
                                d="M9.596,4.442c0-1.749,1.424-3.173,3.173-3.173c1.75,0,3.173,1.423,3.173,3.173v1.881h1.123V4.442
c-0.003-2.365-1.93-4.292-4.295-4.295c-2.366,0.003-4.292,1.93-4.295,4.295v1.881h1.121V4.442z"
                            />
                        </g>
                    </svg>
                    <span className="txt-spn">Unlocked</span>
                </button>
            </div>
        );
    }

    setActiveTab(name) {
        this.setState({
            activeTab: name,
            // currentArea: name === "${} Funding and EFCI Analysis" ? "Project" : "Region"
            currentArea: `${name === "3" ? this.props.mainEntity : this.props.entity}`
        });
    }

    setColor = value => {
        const { colorCodes } = this.props;
        let colorCode = "";
        colorCodes &&
            colorCodes.length &&
            colorCodes.map(color => (value >= color.range_start && value <= color.range_end ? (colorCode = color.code) : ""));
        return colorCode;
    };

    setColoCode = async () => {
        this.setState({
            isOpenColorCode: !this.state.isOpenColorCode
        });
    };

    render() {
        const {
            efciSiteData,
            basicDetails,
            isChartView,
            dataView,
            entity = "",
            mainEntity,
            getFundingOptionLogs,
            restoreFundingOptionLog,
            getFundingEfciLog,
            restoreFundingEFCILog,
            deleteEfciLogData,
            efciRegionData,
            efciLoading,
            entityName
        } = this.props;
        const { activeTab, subTotalByYear, isOpenColorCode, currentArea } = this.state;
        var areaName =
            this.state.currentArea === this.props.mainEntity
                ? (efciRegionData && efciRegionData.project_name) || ""
                : (efciRegionData && efciRegionData.name) || "";
        return (
            <>
                <LoadingOverlay active={this.props.efciLoading} spinner={<Loader />} fadeSpeed={10}>
                    <div class="tab-active location-sec image-sec tab-grey efci-otr fund-efci">
                        <div className="dtl-sec col-md-12">
                            <HelperIcon
                                type={"efci_and_sandbox"}
                                entity={entity ? entity.toLowerCase() : "region"}
                                additoinalClass={"efci_and_sandbox"}
                            />
                            <div className="table-top-menu zoom-section">
                                <div class="lft">
                                    {this.lock()}
                                    {this.unlock()}
                                    <div className="locked-section" onClick={() => this.setColoCode()}>
                                        <button className="add-btn add-build-btn lgd">
                                            <img src="/img/color-wheel.svg" alt="" className="img-whel" />
                                            <span className="txt-spn">Legend</span>
                                        </button>
                                    </div>
                                    {isOpenColorCode ? (
                                        <>
                                            <ColorCodedata
                                                isCodeLoading={this.state.isCodeLoading}
                                                isOpenColorCode={isOpenColorCode}
                                                colorCodes={this.props.colorCodes}
                                            />
                                        </>
                                    ) : null}
                                </div>
                                <div className="cent">
                                    <div className="type-section margin-left transparent">
                                        <span className="type-des font-inc">
                                            {`${dataView == "building" ? "Building" : currentArea} ${
                                                isChartView ? "EFCI Sandbox" : ""
                                            } - ${areaName}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="rgt">
                                    <button
                                        className={activeTab == 1 ? "btn-fci active" : "btn-fci"}
                                        name={1}
                                        onClick={event => this.setActiveTab(event.target.name)}
                                    >
                                        CSP Summary
                                    </button>
                                    <button
                                        className={activeTab == 2 ? "btn-fci active" : "btn-fci"}
                                        name={2}
                                        onClick={event => this.setActiveTab(event.target.name)}
                                    >
                                        Funding and EFCI Analysis
                                    </button>
                                    <button
                                        // class={activeTab === "Project Funding and EFCI Analysis" ? "btn-fci active" : "btn-fci btn-dif"}
                                        className={`${activeTab == 3 ? "btn-fci active" : "btn-fci btn-dif"}`}
                                        // class={`${activeTab === mainEntity} Funding and EFCI Analysis`}
                                        name={3}
                                        onClick={event => this.setActiveTab(event.target.name, 1)}
                                    >
                                        {mainEntity} : Funding and EFCI Analysis
                                    </button>
                                </div>
                            </div>
                            {activeTab === "2" ? (
                                this.props.efciRegionData &&
                                this.props.efciRegionData.funding_options &&
                                this.props.efciRegionData.funding_options.length ? (
                                    <FundingEFCIAnalysis
                                        efciData={this.props.efciRegionData}
                                        // efciBuildingData={this.props.efciBuildingData}
                                        setColor={this.setColor}
                                    />
                                ) : (
                                    <div className="table-topper efc-topr">
                                        <div className="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : activeTab === "1" ? (
                                this.props.efciRegionData && this.props.efciRegionData.name ? (
                                    <CSPSummary efciData={this.props.efciRegionData} />
                                ) : (
                                    <div className="table-topper efc-topr">
                                        <div className="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : activeTab === `${mainEntity} Funding and EFCI Analysis` ? (
                                <div className="table-topper efc-topr">
                                    <div className="col-md-12 otr-topr">
                                        <h3>No data found</h3>
                                    </div>
                                </div>
                            ) : (
                                <div className="table-topper efc-topr">
                                    <div className="col-md-12 otr-topr">
                                        <h3>No data found</h3>
                                    </div>
                                </div>
                            )}

                            {/* {activeTab === "CSP Summary" ? (
                                efciSiteData && efciSiteData.name ? (
                                    <CSPSummarySite
                                        efciSiteData={efciSiteData}
                                        updatePercentage={this.props.updatePercentage}
                                        updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                                        getCSPLogs={this.props.getCSPLogs}
                                        restoreCSP={this.props.restoreCSP}
                                        showLogsCSP={this.showLogsCSP}
                                    />
                                ) : (
                                        <div class="table-topper efc-topr">
                                            <div class="col-md-12 otr-topr">
                                                <h3>No data found</h3>
                                            </div>
                                        </div>
                                    )
                            ) : activeTab === "Funding and EFCI Analysis" ? (
                                efciSiteData && efciSiteData.name ? (
                                    <FundingEFCISite
                                        efciSiteData={efciSiteData}
                                        subTotalByYear={subTotalByYear}
                                        updateFcis={this.props.updateFcis}
                                        updateFundingEfciData={this.props.updateFundingEfciData}
                                        getAnnualEfciColumnLogs={this.props.getAnnualEfciColumnLogs}
                                        updateSiteFundingOption={this.props.updateSiteFundingOption}
                                        hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                        updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                        updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                        updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                        updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                                        updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                        updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                        updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                        updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                        annualEfciLog={this.props.annualEfciLog}
                                        annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                                        getAnnualFundingCalculationColumnLogs={this.props.getAnnualFundingCalculationColumnLogs}
                                        annualFundingOptionLogs={this.props.annualFundingOptionLogs}
                                        showLogsTable={this.showLogsTable}
                                        showLogsTableFunding={this.showLogsTableFunding}
                                        restoreAnnualEfciCalculation={this.props.restoreAnnualEfciCalculation}
                                        showLogsTableFundingOption={this.showLogsTableFundingOption}
                                        getFundingEfciLog={this.props.getFundingEfciLog}
                                        showLogsTableFundingEfci={this.showLogsTableFundingEfci}
                                        getTotalFundingLog={this.props.getTotalFundingLog}
                                        restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                                        showLogsTotalFundingOption={this.showLogsTotalFundingOption}
                                    />
                                ) : (
                                        <div class="table-topper efc-topr" >
                                            <div class="col-md-12 otr-topr">
                                                <h3>No data found</h3>
                                            </div>
                                        </div>
                                    )
                            ) : activeTab === "Region Funding and EFCI Analysis" ? (
                                this.props.efciByRegion && this.props.efciByRegion.funding_options.length ?
                                    <FundingEFCIAnalysis
                                        efciData={this.props.efciByRegion}
                                        efciBuildingData={this.props.efciBuildingData}
                                        setColor={this.setColor}
                                    />
                                    :
                                    < div class="table-topper efc-topr">
                                        <div class="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                            ) : null} */}
                        </div>
                    </div>
                    {/* {this.renderFormModal()}
                    {this.renderFormModal1()}
                    {this.renderFormModal2()}
                    {this.renderFormModal3()}
                    {this.renderFormModal4()}
                    {this.renderFormModalCsp()}
                    {this.deleteConfirmationModal()}
                    {this.renderConfirmationRestoreModalLog()}
                    {this.renderFundingCostRestoreModalLog()}
                    {this.renderFundingCostEfciRestoreModalLog()}
                    {this.renderFundingAnnualFundingRestoreModalLog()}
                    {this.renderFundingAnnualEfciRestoreModalLog()}
                    {this.renderFundingTotalFundingCostRestoreModalLog()} */}
                </LoadingOverlay>
            </>
        );
    }
}
export default EFCIRegion;
