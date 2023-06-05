import React, { Component } from "react";
import CSPSummary from "./CSPSummary";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import FundingEFCIAnalysis from "./FundingEFCIAnalysis";
import SiteFundingEFCIAnalysis from "./SiteFundingEFCIAnalysis";
import LogsInfo from "../../common/components/LogsInfo";
import Portal from "../../common/components/Portal";
import EFCILogs from "../../common/components/EFCILogs";
import LogAnnualFunding from "../../site/components/LogAnnualFunding";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import ColorCodedata from "../../common/components/ColoCodeData";
import HelperIcon from "../../helper/components/HelperIcon";
class EFCI extends Component {
    state = {
        locked: false,
        grandTotal: null,
        isloading: false,
        currentArea: "Building",
        activeTab: "Funding and EFCI Analysis",
        sortKey: "efci_versions.created_at",
        sortOrder: false,
        isOpenColorCode: false
    };

    componentDidMount() {
        this.renderSubTotalRow();
        this.renderSubTotalSiteRow();
        if (this.props.dataView == "building") {
            this.setState({
                locked: this.props.efciBuildingData.locked === true ? true : this.props.efciBuildingData.locked === false ? false : false
            });
        } else {
            this.setState({
                locked: this.props.efciBuildingData.locked === true ? true : this.props.efciBuildingData.locked === false ? false : false
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.efciBuildingData !== this.props.efciBuildingData) {
            this.renderSubTotalRow();
            this.renderSubTotalSiteRow();
            if (this.props.dataView == "building") {
                this.setState({
                    locked: this.props.efciBuildingData.locked === true ? true : this.props.efciBuildingData.locked === false ? false : false
                });
            } else {
                this.setState({
                    locked: this.props.efciBuildingData.locked === true ? true : this.props.efciBuildingData.locked === false ? false : false
                });
            }
        }
        if (prevProps.efciSiteData !== this.props.efciSiteData) {
            this.renderSubTotalSiteRow();
        }
    }

    setActiveTab(name) {
        this.setState({
            activeTab: name,
            currentArea: name === "Site Funding and EFCI Analysis" ? "Site" : "Building"
        });
    }

    renderSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
        let grandTotal = 0;
        if (
            this.props.efciBuildingData &&
            this.props.efciBuildingData.capital_spending_plans &&
            this.props.efciBuildingData.capital_spending_plans.length
        ) {
            this.props.efciBuildingData.capital_spending_plans.forEach(function (row) {
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

    updateBuildingEfciLock = async () => {
        await this.setState({ isloading: true });
        await this.props.updatelockloading(this.state.isloading); //lock delay fix
        await this.props.updateBuildingEfciLock(this.state.locked);
        await this.setState({ isloading: false });
        await this.props.updatelockloading(this.state.isloading); //lock delay fix
    };

    renderSubTotalSiteRow() {
        let obj = [];
        let subTotalSiteByYear = [];
        let grandTotal = 0;
        if (this.props.efciSiteData && this.props.efciSiteData.capital_spending_plans && this.props.efciSiteData.capital_spending_plans.length) {
            this.props.efciSiteData.capital_spending_plans.forEach(function (row) {
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
                subTotalSiteByYear.push({ year: prop, amount: yearHolder[prop] });
            }
        }
        subTotalSiteByYear.map(yeatData => {
            grandTotal += yeatData.amount;
        });

        this.setState({
            subTotalSiteByYear: subTotalSiteByYear,
            grandTotal: grandTotal
        });
    }

    unlockButton() {
        return (
            <div className={`locked-section unlock-sec ${this.state.locked === false ? "active" : ""}`}>
                <button
                    className={`add-btn add-build-btn ${this.state.locked === false ? "unlocked" : ""}`}
                    onClick={async () => {
                        await this.setState({
                            locked: false
                        });
                        await this.updateBuildingEfciLock();
                    }}
                >
                    {/* <LoadingOverlay active={this.state.isloading && this.state.locked === false ? true : false} spinner={<Loader />} fadeSpeed={10}> */}
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
                        xmlspace="preserve"
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
                    {/* </LoadingOverlay> */}
                </button>
            </div>
        );
    }

    lockButton() {
        return (
            <div className={`locked-section ${this.state.locked === true ? "green-active active" : ""}`}>
                <button
                    className={`add-btn add-build-btn ${this.state.locked === true ? "locked" : ""}`}
                    onClick={async () => {
                        await this.setState({ locked: true });
                        await this.updateBuildingEfciLock();
                    }}
                >
                    {/* <LoadingOverlay
                        active={this.state.isloading && this.state.locked === true ? this.state.isloading : false}
                        spinner={<Loader />}
                        fadeSpeed={10}
                    > */}
                    <svg
                        className={`${this.state.locked === true ? "color-white" : ""}`}
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
                        xmlspace="preserve"
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
                    <span className={`txt-spn ${this.state.locked === true ? "color-white" : ""}`}>Locked</span>
                    {/* </LoadingOverlay> */}
                </button>
            </div>
        );
    }

    showLogsTableCSP = async id => {
        const { sortKey } = this.state;
        this.setState({
            openCspPanel: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getCSPLogs(id, sortKey);
        this.setState({
            hasLoading: false
        });
    };

    onCancel = () => {
        this.setState({
            openCspPanel: false,
            openFdPanel: false,
            openFdEfci: false,
            openTotalFdEfci: false,
            openAnnualefci: false,
            openSiteAnnualefci: false,
            openSiteAnnualFdOption: false,
            openSiteFdOption: false,
            openSiteFdOptionEfci: false,
            openSiteTotalFdOptionEfci: false,
            openAnnualFD: false
        });
    };

    renderFormModalCSP = () => {
        const { openCspPanel } = this.state;
        if (!openCspPanel) return null;

        return (
            <Portal
                body={
                    <LogsInfo
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelCSPLogOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortCspTable={this.sortCspTable}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    restoreCSPLog = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreCSP(this.state.restoreId);
        this.setState({
            openCspPanel: false,
            hasLoading: false,
            openCSPLogRestore: false
        });
    };
    // getFundingCostLogs={this.props.getFundingCostLogs}
    // restoreFundingCostLog={this.props.restoreFundingCostLog}
    showLogsTableFundingCost = async id => {
        this.setState({
            openFdPanel: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getFundingCostLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    restoreFundingCostLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreFundingCostLog(this.state.restoreId);
        this.setState({
            openFdPanel: false,
            hasLoading: false,
            openFundingCostLogRestore: false
        });
    };

    renderFormModalFdCost = () => {
        const { openFdPanel } = this.state;
        if (!openFdPanel) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelProjectFundingCostLogOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortFundingEfci={this.sortFundingCostLog}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    // getFundingCostEfciLogs = { this.props.getFundingCostEfciLogs }
    // restoreFundingCostEfciLog = { this.props.restoreFundingCostEfciLog }

    showLogsTableFundingCostEfci = async id => {
        this.setState({
            openFdEfci: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getFundingCostEfciLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    renderFormModalFdCostEfci = () => {
        const { openFdEfci } = this.state;
        if (!openFdEfci) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelProjectFundingEfciLogOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortFundingEfci={this.sortFundingEfci}
                        value={"value"}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    restoreFundingCostEfciLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreFundingCostEfciLog(this.state.restoreId);
        this.setState({
            openFdEfci: false,
            hasLoading: false,
            openFundingEfciLogRestore: false
        });
    };

    // getFundingCostEfciLogs = { this.props.getFundingCostEfciLogs }
    // restoreTotalFundingCostEfciLog = { this.props.restoreTotalFundingCostEfciLog }
    showLogsTableTotalFundingCostEfci = async (id, noOfYears) => {
        this.setState({
            openTotalFdEfci: true,
            selectedColumnId: id,
            hasLoading: true,
            noOfYears: noOfYears
        });
        await this.props.getTotalFundingCostEfciLogs(id, this.state.sortKey);
        this.setState({ hasLoading: false });
    };

    restoreTotalFundingCostEfciLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreTotalFundingCostEfciLog(this.state.restoreId);
        this.setState({
            openTotalFdEfci: false,
            hasLoading: false,
            openTotalFundingCostRestore: false
        });
    };

    renderFormModalTotalFdCostEfci = () => {
        const { openTotalFdEfci } = this.state;
        if (!openTotalFdEfci) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelTotalFundingCostOpen}
                        hasLoading={this.state.hasLoading}
                        numberOfYears={this.state.noOfYears}
                        totalFunding={true}
                        sortFundingEfci={this.sortTotalFundingCost}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    // getAnnualFundingOptionLogs = { this.props.getAnnualFundingOptionLogs }
    // restoreAnnualFundingOptionLog = { this.props.restoreAnnualFundingOptionLog }

    renderFormModalAnnualFundingOption = () => {
        const { openAnnualFD } = this.state;
        if (!openAnnualFD) return null;

        return (
            <Portal
                body={
                    <LogAnnualFunding
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelAnnualFundingLogOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortAnnualFunding={this.sortAnnualFunding}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    showLogsTableAnnualFundingOption = async id => {
        this.setState({
            openAnnualFD: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getAnnualFundingOptionLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    restoreAnnualFundingOptionLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreAnnualFundingOptionLog(this.state.restoreId);
        this.setState({
            openAnnualFD: false,
            hasLoading: false,
            openAnnualFundingLogRestore: false
        });
    };
    // getAnnualEFCILogs = { this.props.getAnnualEFCILogs }
    // restoreAnnualEFCILogs = { this.props.restoreAnnualEFCILogs }
    showLogsTableAnnualEfci = async id => {
        this.setState({
            openAnnualefci: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getAnnualEFCILogs(id, this.state.sortKey);
        this.setState({ hasLoading: false });
    };

    restoreAnnualEfciLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreAnnualEFCILogs(this.state.restoreId);
        this.setState({
            openAnnualefci: false,
            hasLoading: false,
            openAnnualEfciLogRestore: false
        });
    };

    renderFormModalAnnualEfci = () => {
        const { openAnnualefci } = this.state;
        if (!openAnnualefci) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelAnnualEfciLogOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortFundingEfci={this.sortAnnualEfci}
                        value="value"
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    // getSiteAnnualEfciColumnLogs = { this.getSiteAnnualEfciColumnLogs }
    // restoreSiteAnnualEfciCalculation = { this.restoreSiteAnnualEfciCalculation }
    showSiteLogsTableAnnualEfci = async id => {
        this.setState({
            openSiteAnnualefci: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getSiteAnnualEfciColumnLogs(id, this.state.sortKey);
        this.setState({ hasLoading: false });
    };

    restoreSiteAnnualEfciLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreSiteAnnualEfciCalculation(this.state.restoreId);
        this.setState({
            openSiteAnnualefci: false,
            hasLoading: false,
            openSiteAnnualEfciLogRestore: false
        });
    };

    renderFormModalSiteAnnualEfci = () => {
        const { openSiteAnnualefci } = this.state;
        if (!openSiteAnnualefci) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelSiteAnnualEfciLogOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        value="value"
                        sortFundingEfci={this.sortSiteFundingEfci}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };
    // getSiteAnnualFundingCalculationColumnLogs = { this.getSiteAnnualFundingCalculationColumnLogs }
    // restoreSiteAnnualFundingOption = { this.restoreSiteAnnualFundingOption }
    showSiteLogsTableAnnualFundingOption = async id => {
        this.setState({
            openSiteAnnualFdOption: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getSiteAnnualFundingCalculationColumnLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    restoreSiteAnnualFundingLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreSiteAnnualFundingOption(this.state.restoreId);
        this.setState({
            openSiteAnnualFdOption: false,
            hasLoading: false,
            openSiteAnnualFundingLogRestore: false
        });
    };

    renderFormModalSiteAnnualFundingOption = () => {
        const { openSiteAnnualFdOption } = this.state;
        if (!openSiteAnnualFdOption) return null;

        return (
            <Portal
                body={
                    <LogAnnualFunding
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelSiteAnnualFundingLogOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortAnnualFunding={this.sortSiteAnnualFunding}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    // getSiteFundingOptionLogs={this.getSiteFundingOptionLogs}
    // restoreSiteFundingOptionLog={this.restoreSiteFundingOptionLog
    showSiteLogsTableFundingOption = async id => {
        this.setState({
            openSiteFdOption: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getSiteFundingOptionLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    restoreSiteFundingLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreSiteFundingOptionLog(this.state.restoreId);
        this.setState({
            openSiteFdOption: false,
            hasLoading: false,
            openSiteFundingCostLogRestore: false
        });
    };

    renderFormModalSiteFundingOption = () => {
        const { openSiteFdOption } = this.state;
        if (!openSiteFdOption) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelSiteFundingCostLogOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortFundingEfci={this.sortSiteFundingCost}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    // getSiteFundingEfciLog={this.getSiteFundingEfciLog}
    // restoreSiteFundingEFCILog={this.restoreSiteFundingEFCILog}
    showSiteLogsTableFundingOptionEfci = async id => {
        this.setState({
            openSiteFdOptionEfci: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getSiteFundingEfciLog(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    restoreSiteFundingEfciLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreSiteFundingEFCILog(this.state.restoreId);
        this.setState({
            openSiteFdOptionEfci: false,
            hasLoading: false,
            openSiteFundingCostEfciLogRestore: false
        });
    };

    renderFormModalSiteFundingOptionEfci = () => {
        const { openSiteFdOptionEfci } = this.state;
        if (!openSiteFdOptionEfci) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestoreSiteFundingCostEfci}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        value="value"
                        sortFundingEfci={this.sortSiteFundingCostEfci}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };
    // getSiteTotalFundingLogs = { this.getSiteTotalFundingLogs }
    // restoreSiteTotalFundingLog = { this.restoreSiteTotalFundingLog }
    showSiteLogsTableTotalFundingOptionEfci = async (id, noOfYears) => {
        this.setState({
            openSiteTotalFdOptionEfci: true,
            selectedColumnId: id,
            hasLoading: true,
            noOfYears: noOfYears
        });
        await this.props.getSiteTotalFundingLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    restoreSiteTotalFundingEfciLogs = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreSiteTotalFundingLog(this.state.restoreId);
        this.setState({
            openSiteTotalFdOptionEfci: false,
            hasLoading: false,
            openSiteTotalFundingCostRestore: false
        });
    };

    renderFormModalSiteTotalFundingOptionEfci = () => {
        const { openSiteTotalFdOptionEfci } = this.state;
        if (!openSiteTotalFdOptionEfci) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.efciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestoreSiteTotalFundingCost}
                        hasLoading={this.state.hasLoading}
                        numberOfYears={this.state.noOfYears}
                        sortFundingEfci={this.sortSiteTotalFundingCost}
                        totalFunding={true}
                        logCount={this.props.logCount}
                        logPaginationParams={this.props.logPaginationParams}
                        handlePageClickLogs={this.props.handlePageClickLogs}
                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    deleteLog = async id => {
        this.setState({
            showDeleteConfirmModal: true,
            deleteId: id
        });
    };

    deleteConfirmLog = async id => {
        this.setState({ hasLoading: true });
        await this.props.deleteEfciLogData(this.state.deleteId);
        this.setState({
            hasLoading: false,
            showDeleteConfirmModal: false,
            openCspPanel: false,
            openFdPanel: false,
            openFdEfci: false,
            openTotalFdEfci: false,
            openAnnualefci: false,
            openSiteAnnualefci: false,
            openSiteAnnualFdOption: false,
            openSiteFdOption: false,
            openSiteFdOptionEfci: false,
            openSiteTotalFdOptionEfci: false,
            openAnnualFD: false
        });
    };

    deleteConfirmationModal = () => {
        const { showDeleteConfirmModal } = this.state;
        if (!showDeleteConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this log ?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showDeleteConfirmModal: false })}
                        onYes={this.deleteConfirmLog}
                    />
                }
                onCancel={() => this.setState({ showDeleteConfirmModal: false })}
            />
        );
    };

    renderCSPRestoreModalLog = () => {
        const { openCSPLogRestore, changeSet, associated_changes } = this.state;
        if (!openCSPLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openCSPLogRestore: false })}
                        onYes={this.restoreCSPLog}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openCSPLogRestore: false })}
            />
        );
    };

    showRestorePanelCSPLogOpen = (id, changeSet) => {
        this.setState({
            openCSPLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderProjectFundingCostRestoreModalLog = () => {
        const { openFundingCostLogRestore, changeSet, associated_changes } = this.state;
        if (!openFundingCostLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openFundingCostLogRestore: false })}
                        onYes={this.restoreFundingCostLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openFundingCostLogRestore: false })}
            />
        );
    };

    showRestorePanelProjectFundingCostLogOpen = (id, changeSet) => {
        this.setState({
            openFundingCostLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderProjectFundingEfciRestoreModalLog = () => {
        const { openFundingEfciLogRestore, changeSet, associated_changes } = this.state;
        if (!openFundingEfciLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openFundingEfciLogRestore: false })}
                        onYes={this.restoreFundingCostEfciLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openFundingEfciLogRestore: false })}
            />
        );
    };

    showRestorePanelProjectFundingEfciLogOpen = (id, changeSet) => {
        this.setState({
            openFundingEfciLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderProjectAnnualFundingRestoreModalLog = () => {
        const { openAnnualFundingLogRestore, changeSet, associated_changes } = this.state;
        if (!openAnnualFundingLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openAnnualFundingLogRestore: false })}
                        onYes={this.restoreAnnualFundingOptionLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openAnnualFundingLogRestore: false })}
            />
        );
    };

    showRestorePanelAnnualFundingLogOpen = (id, changeSet) => {
        this.setState({
            openAnnualFundingLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderProjectAnnualEfciRestoreModalLog = () => {
        const { openAnnualEfciLogRestore, changeSet, associated_changes } = this.state;
        if (!openAnnualEfciLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openAnnualEfciLogRestore: false })}
                        onYes={this.restoreAnnualEfciLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openAnnualEfciLogRestore: false })}
            />
        );
    };

    showRestorePanelAnnualEfciLogOpen = (id, changeSet) => {
        this.setState({
            openAnnualEfciLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderProjectAnnualEfciRestoreModalLog = () => {
        const { openAnnualEfciLogRestore, changeSet, associated_changes } = this.state;
        if (!openAnnualEfciLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openAnnualEfciLogRestore: false })}
                        onYes={this.restoreAnnualEfciLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openAnnualEfciLogRestore: false })}
            />
        );
    };

    showRestorePanelAnnualEfciLogOpen = (id, changeSet) => {
        this.setState({
            openAnnualEfciLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderFundingTotalFundingCostRestoreModalLog = () => {
        const { openTotalFundingCostRestore, changeSet, associated_changes } = this.state;
        if (!openTotalFundingCostRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openTotalFundingCostRestore: false })}
                        onYes={this.restoreTotalFundingCostEfciLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openTotalFundingCostRestore: false })}
            />
        );
    };

    totalFundingCost = async changeSet => {
        let data = {};
        data = { value: [changeSet.value[0] * this.state.noOfYears, changeSet.value[1] * this.state.noOfYears] };
        return data;
    };

    showRestorePanelTotalFundingCostOpen = async (id, changeSet) => {
        let data = await this.totalFundingCost(changeSet);
        this.setState({
            openTotalFundingCostRestore: true,
            restoreId: id,
            changeSet: data
        });
    };

    renderSiteProjectAnnualEfciRestoreModalLog = () => {
        const { openSiteAnnualEfciLogRestore, changeSet, associated_changes } = this.state;
        if (!openSiteAnnualEfciLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        onNo={() => this.setState({ openSiteAnnualEfciLogRestore: false })}
                        onYes={this.restoreSiteAnnualEfciLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openSiteAnnualEfciLogRestore: false })}
            />
        );
    };

    showRestorePanelSiteAnnualEfciLogOpen = (id, changeSet) => {
        this.setState({
            openSiteAnnualEfciLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderSiteProjectAnnualFundingRestoreModalLog = () => {
        const { openSiteAnnualFundingLogRestore, changeSet, associated_changes } = this.state;
        if (!openSiteAnnualFundingLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        onNo={() => this.setState({ openSiteAnnualFundingLogRestore: false })}
                        onYes={this.restoreSiteAnnualFundingLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openSiteAnnualFundingLogRestore: false })}
            />
        );
    };

    showRestorePanelSiteAnnualFundingLogOpen = (id, changeSet) => {
        this.setState({
            openSiteAnnualFundingLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderSiteProjectFundingCostRestoreModalLog = () => {
        const { openSiteFundingCostLogRestore, changeSet, associated_changes } = this.state;
        if (!openSiteFundingCostLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        onNo={() => this.setState({ openSiteFundingCostLogRestore: false })}
                        onYes={this.restoreSiteFundingLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openSiteFundingCostLogRestore: false })}
            />
        );
    };

    showRestorePanelSiteFundingCostLogOpen = (id, changeSet) => {
        this.setState({
            openSiteFundingCostLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderSiteProjectFundingCostEfciRestoreModalLog = () => {
        const { openSiteFundingCostEfciLogRestore, changeSet, associated_changes } = this.state;
        if (!openSiteFundingCostEfciLogRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        onNo={() => this.setState({ openSiteFundingCostEfciLogRestore: false })}
                        onYes={this.restoreSiteFundingEfciLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openSiteFundingCostEfciLogRestore: false })}
            />
        );
    };

    showRestoreSiteFundingCostEfci = (id, changeSet) => {
        this.setState({
            openSiteFundingCostEfciLogRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderSiteTotalFundingCostRestoreModalLog = () => {
        const { openSiteTotalFundingCostRestore, changeSet, associated_changes } = this.state;
        if (!openSiteTotalFundingCostRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openSiteTotalFundingCostRestore: false })}
                        onYes={this.restoreSiteTotalFundingEfciLogs}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openSiteTotalFundingCostRestore: false })}
            />
        );
    };

    totalSiteFundingCost = async changeSet => {
        let data = {};
        data = { value: [changeSet.value[0] * this.state.noOfYears, changeSet.value[1] * this.state.noOfYears] };
        return data;
    };

    showRestoreSiteTotalFundingCost = async (id, changeSet) => {
        let data = await this.totalSiteFundingCost(changeSet);
        this.setState({
            openSiteTotalFundingCostRestore: true,
            restoreId: id,
            changeSet: data
        });
    };

    sortCspTable = async data => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 1);
    };

    sortFundingCostLog = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 2);
    };

    sortFundingEfci = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 3);
    };

    sortTotalFundingCost = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 4);
    };

    sortAnnualFunding = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 5);
    };

    sortAnnualEfci = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 6);
    };

    sortSiteFundingEfci = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 7);
    };

    sortSiteAnnualFunding = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 8);
    };

    sortSiteFundingCost = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 9);
    };

    sortSiteFundingCostEfci = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 10);
    };

    sortSiteTotalFundingCost = async () => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortBuildingEfciLog(selectedColumnId, sortKey, 11);
    };

    setColoCode = async () => {
        this.setState({
            isOpenColorCode: !this.state.isOpenColorCode
        });
    };

    render() {
        const { activeTab, isloading, grandTotal, subTotalByYear, subTotalSiteByYear, isOpenColorCode } = this.state;

        const {
            efciBuildingData,
            updateCapitalSpendingPercent,
            loading,
            updateAnnualFundingOption,
            updateFcis,
            updateFundingOption,
            updateFundingOptionEfci,
            updateFundingPercentage,
            updateHiddenFundingOption,
            hiddenFundingOptionList,
            updateProjectAnnualFunding,
            updateEfciInInitialFundingOptions,
            updateTotalProjectFunding,
            updateAnnualFundingOptionCalculation,
            updateAnnualEfciCalculation,
            efciSiteData,
            basicDetails,
            isChartView,
            deleteEfciLogData
        } = this.props;
        var areaName = this.state.currentArea === "Site" ? (basicDetails && basicDetails.site.name) || "" : (basicDetails && basicDetails.name) || "";

        return (
            <>
                <LoadingOverlay active={this.props.efciLoading} spinner={<Loader />} fadeSpeed={10}>
                    <div class="tab-active location-sec image-sec tab-grey efci-otr fund-efci" id={"efciData"}>
                        <div class="dtl-sec col-md-12">
                            <HelperIcon type={"efci_and_sandbox"} entity={"building"} additoinalClass={"efci_and_sandbox"} />
                            <div class="table-top-menu zoom-section">
                                <div class="lft">
                                    {efciBuildingData && efciBuildingData.name ? (
                                        <>
                                            {this.lockButton()}
                                            {this.unlockButton()}
                                        </>
                                    ) : (
                                        ""
                                    )}
                                    {activeTab === "CSP Summary" ? null : (
                                        <div className="locked-section" onClick={() => this.setColoCode()}>
                                            <button className="add-btn add-build-btn lgd">
                                                <img src="/img/color-wheel.svg" alt="" className="img-whel" />
                                                <span className="txt-spn">Legend</span>
                                            </button>
                                        </div>
                                    )}
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
                                <div class="cent">
                                    <div class="type-section margin-left transparent">
                                        <span class="type-des font-inc">
                                            {`${this.state.currentArea} ${isChartView ? "EFCI Sandbox" : ""} - ${areaName}`}
                                        </span>
                                    </div>
                                </div>

                                <div class="rgt">
                                    <button
                                        class={activeTab === "CSP Summary" ? "btn-fci active" : "btn-fci"}
                                        name="CSP Summary"
                                        onClick={event => this.setActiveTab(event.target.name)}
                                    >
                                        CSP Summary
                                    </button>
                                    <button
                                        class={activeTab === "Funding and EFCI Analysis" ? "btn-fci active" : "btn-fci"}
                                        name="Funding and EFCI Analysis"
                                        onClick={event => this.setActiveTab(event.target.name)}
                                    >
                                        Funding and EFCI Analysis
                                    </button>
                                    <button
                                        class={activeTab === "Site Funding and EFCI Analysis" ? "btn-fci active" : "btn-fci btn-dif"}
                                        name="Site Funding and EFCI Analysis"
                                        onClick={event => this.setActiveTab(event.target.name)}
                                    >
                                        Site : Funding and EFCI Analysis
                                    </button>
                                </div>
                            </div>
                            {activeTab === "CSP Summary" ? (
                                efciBuildingData && efciBuildingData.name ? (
                                    <CSPSummary
                                        loading={loading}
                                        efciBuildingData={this.props.efciBuildingData}
                                        updateFundingPercentage={updateFundingPercentage}
                                        updateCapitalSpendingPercent={updateCapitalSpendingPercent}
                                        efciLog={this.props.efciLog}
                                        getCSPLogs={this.props.getCSPLogs}
                                        restoreCSP={this.props.restoreCSP}
                                        showLogsTableCSP={this.showLogsTableCSP}
                                    />
                                ) : (
                                    <div class="table-topper efc-topr no-data-efci">
                                        <div class="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : activeTab === "Funding and EFCI Analysis" ? (
                                efciBuildingData && efciBuildingData.funding_options && efciBuildingData.funding_options.length ? (
                                    <FundingEFCIAnalysis
                                        loading={loading}
                                        grandTotal={grandTotal}
                                        updateFcis={updateFcis}
                                        grandTotal={this.state.grandTotal}
                                        efciBuildingData={efciBuildingData}
                                        subTotalByYear={this.state.subTotalByYear}
                                        updateAnnualFunding={updateAnnualFundingOption}
                                        updateFundingOptionEfci={updateFundingOptionEfci}
                                        hiddenFundingOptionList={hiddenFundingOptionList}
                                        updateTotalProjectFunding={updateTotalProjectFunding}
                                        updateHiddenFundingOption={updateHiddenFundingOption}
                                        updateFundingOption1={this.props.updateFundingOption1}
                                        updateProjectAnnualFunding={updateProjectAnnualFunding}
                                        updateAnnualEfciCalculation={updateAnnualEfciCalculation}
                                        updateEfciInInitialFundingOptions={updateEfciInInitialFundingOptions}
                                        updateAnnualFundingOptionCalculation={updateAnnualFundingOptionCalculation}
                                        showLogsTableFundingCost={this.showLogsTableFundingCost}
                                        showLogsTableFundingCostEfci={this.showLogsTableFundingCostEfci}
                                        showLogsTableTotalFundingCostEfci={this.showLogsTableTotalFundingCostEfci}
                                        showLogsTableAnnualFundingOption={this.showLogsTableAnnualFundingOption}
                                        showLogsTableAnnualEfci={this.showLogsTableAnnualEfci}
                                        getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
                                    />
                                ) : (
                                    <div class="table-topper efc-topr no-data-efci">
                                        <div class="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : activeTab === "Site Funding and EFCI Analysis" ? (
                                efciSiteData && efciSiteData.funding_options && efciSiteData.funding_options.length ? (
                                    <SiteFundingEFCIAnalysis
                                        grandTotal={grandTotal}
                                        efciSiteData={efciSiteData}
                                        hiddenFundingOptionList={[]}
                                        efciBuildingData={efciBuildingData}
                                        subTotalByYear={subTotalSiteByYear}
                                        updateFcisSite={this.props.updateFcisSite}
                                        updateFundingEfciData={this.props.updateFundingEfciData}
                                        hideFundingOptionSite={this.props.hideFundingOptionSite}
                                        hideFundingOptionSiteList={this.props.hideFundingOptionSiteList}
                                        updateSiteFundingOptionSite={this.props.updateSiteFundingOptionSite}
                                        updateAnnualFundingOptionSite={this.props.updateAnnualFundingOptionSite}
                                        updateTotalProjectFundingSite={this.props.updateTotalProjectFundingSite}
                                        updateProjectAnnualFundingSite={this.props.updateProjectAnnualFundingSite}
                                        updateAnnualEfciCalculationSite={this.props.updateAnnualEfciCalculationSite}
                                        updateEfciInInitialFundingOptionsSite={this.props.updateEfciInInitialFundingOptionsSite}
                                        updateAnnualFundingOptionCalculationSite={this.props.updateAnnualFundingOptionCalculationSite}
                                        showSiteLogsTableAnnualEfci={this.showSiteLogsTableAnnualEfci}
                                        showSiteLogsTableAnnualFundingOption={this.showSiteLogsTableAnnualFundingOption}
                                        showSiteLogsTableFundingOption={this.showSiteLogsTableFundingOption}
                                        showSiteLogsTableFundingOptionEfci={this.showSiteLogsTableFundingOptionEfci}
                                        showSiteLogsTableTotalFundingOptionEfci={this.showSiteLogsTableTotalFundingOptionEfci}
                                        getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
                                    />
                                ) : (
                                    <div class="table-topper efc-topr no-data-efci">
                                        <div class="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : null}
                        </div>
                        {this.renderFormModalCSP()}
                        {this.renderFormModalFdCost()}
                        {this.renderFormModalFdCostEfci()}
                        {this.renderFormModalTotalFdCostEfci()}
                        {this.renderFormModalAnnualFundingOption()}
                        {this.renderFormModalAnnualEfci()}
                        {this.renderFormModalSiteAnnualEfci()}
                        {this.renderFormModalSiteAnnualFundingOption()}
                        {this.renderFormModalSiteFundingOption()}
                        {this.renderFormModalSiteFundingOptionEfci()}
                        {this.renderFormModalSiteTotalFundingOptionEfci()}
                        {this.deleteConfirmationModal()}
                        {this.renderCSPRestoreModalLog()}
                        {this.renderProjectFundingCostRestoreModalLog()}
                        {this.renderProjectFundingEfciRestoreModalLog()}
                        {this.renderProjectAnnualFundingRestoreModalLog()}
                        {this.renderProjectAnnualEfciRestoreModalLog()}
                        {this.renderFundingTotalFundingCostRestoreModalLog()}
                        {this.renderSiteProjectAnnualEfciRestoreModalLog()}
                        {this.renderSiteProjectAnnualFundingRestoreModalLog()}
                        {this.renderSiteProjectFundingCostRestoreModalLog()}
                        {this.renderSiteProjectFundingCostEfciRestoreModalLog()}
                        {this.renderSiteTotalFundingCostRestoreModalLog()}
                    </div>
                </LoadingOverlay>
            </>
        );
    }
}
export default EFCI;
