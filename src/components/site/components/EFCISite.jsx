import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import SiteFundingEFCIAnalysis from "../../building/components/SiteFundingEFCIAnalysis";
import ColorCodedata from "../../common/components/ColoCodeData";
import FundingEFCIAnalysis from "../../common/components/CommonEFCI/FundingEFCIAnalysis";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import EFCILogs from "../../common/components/EFCILogs";
import Loader from "../../common/components/Loader";
import LogsInfo from "../../common/components/LogsInfo";
import Portal from "../../common/components/Portal";
import CSPSummarySite from "./CSPSummarySite";
import FundingEFCISite from "./FundingEFCISite";
import FundingOptionLog from "./FundingOptionLog";
import LogAnnualFunding from "./LogAnnualFunding";
import ForceUpdateSite from "./forceUpdateSIte";
import HelperIcon from "../../helper/components/HelperIcon";

class EFCISite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locked: false,
            activeTab: "Funding and EFCI Analysis",
            grandTotal: null,
            locked: false,
            currentArea: "Site",
            openSection: false,
            hasLoading: false,
            sortKey: "efci_versions.created_at",
            sortOrder: false,
            isOpenColorCode: false,
            showForceModal: false,
            showConfirmModal: false
        };
        this.showLogsTable = this.showLogsTable.bind(this);
    }

    componentDidMount() {
        this.renderSubTotalRow();
        // if (this.props.dataView == "building") {
        this.setState({
            locked: this.props.efciSiteData && this.props.efciSiteData.locked
        });
        // }
    }

    renderForceModal = () => {
        const { showForceModal } = this.state;
        if (!showForceModal) return null;

        return (
            <Portal
                body={
                    <ForceUpdateSite
                        toggleLoader={this.toggleLoader}
                        setColor={this.setColor}
                        efciSiteData={this.props.efciSiteData}
                        onCancel={async () => {
                            await this.setState({ showForceModal: false });
                            await this.props.resetData();
                        }}
                        updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                        disableClick={this.state.locked}
                        forceUpdateData={this.props.forceUpdateData}
                        tempArray={this.props.tempArray}
                        resetData={this.props.resetData}
                        isValueChanged={this.props.isValueChanged}
                        saveData={() => {
                            this.setState({ showConfirmModal: true });
                            // this.props.saveDataForce()
                        }}
                    />
                }
                onCancel={() => this.setState({ showForceModal: false })}
            />
        );
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Saving current data will OVERWRITE any existing data,"}
                        message={"for this entity and for any dependent entities.This action cannot be undone.Are you sure you want to continue?"}
                        onNo={async () => {
                            await this.setState({ showConfirmModal: false });
                            // await this.props.resetData()
                        }}
                        onYes={async () => {
                            await this.setState({ showForceModal: false, showConfirmModal: false });
                            await this.props.saveDataForce();
                        }}
                        type={"save"}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    componentDidUpdate(prevProps) {
        if (prevProps.efciSiteData !== this.props.efciSiteData) {
            this.renderSubTotalRow();
            if (this.props.dataView == "building") {
                this.setState({
                    locked: this.props.efciSiteData && this.props.efciSiteData.locked
                });
            } else {
                this.setState({
                    locked: this.props.efciSiteData && this.props.efciSiteData.locked
                });
            }
        }
    }

    setActiveTab(name) {
        this.setState({
            activeTab: name,
            currentArea: name === "Region Funding and EFCI Analysis" ? "Region" : "Site"
        });
    }

    renderSubTotalRow() {
        let obj = [];
        let subTotalByYear = [];
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
        if (this.props.dataView == "building") {
            await this.props.updateLock(this.state.locked);
        } else {
            await this.props.updateSiteEfciLock(this.state.locked);
        }
        await this.setState({ isloading: false });
    };

    unlock() {
        return (
            <div className={`locked-section unlock-sec ${this.state.locked === false ? "active" : ""}`}>
                <button
                    className={`add-btn add-build-btn ${this.state.locked === false ? "unlocked" : ""}`}
                    onClick={async () => {
                        await this.setState({ locked: false });
                        await this.updateBuildingEfciLock();
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

    lock() {
        return (
            <div className={`locked-section ${this.state.locked === true ? "green-active active" : ""}`}>
                <button
                    className="add-btn add-build-btn"
                    onClick={async () => {
                        await this.setState({ locked: true });
                        await this.updateBuildingEfciLock();
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

    showLogsTable = async id => {
        this.setState({
            openSection: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getAnnualEfciColumnLogs(id, this.state.sortKey);
        this.setState({ hasLoading: false });
    };

    showLogsTableFunding = async id => {
        this.setState({
            openSection1: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getAnnualFundingCalculationColumnLogs(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    showLogsTableFundingOption = async id => {
        const { sortKey } = this.state;
        this.setState({
            openSection2: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getFundingOptionLogs(id, sortKey);
        this.setState({
            hasLoading: false
        });
    };

    showLogsTableFundingEfci = async id => {
        this.setState({
            openSection3: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getFundingEfciLog1(id, this.state.sortKey);
        this.setState({
            hasLoading: false
        });
    };

    onCancel = () => {
        this.setState({
            openSection: false,
            openSection1: false,
            openSection2: false,
            openSection3: false,
            openSection4: false,
            openCSP: false
        });
    };
    restoreAnnualEfci = async id => {
        this.setState({
            hasLoading: true
        });
        // await updateFcis(data.id, { value: data.value });
        await this.props.restoreAnnualEfciCalculation(this.state.restoreId);
        this.setState({
            openSection: false,
            hasLoading: false,
            openAnnualEfciRestore: false
        });
    };

    restoreFundingEfci = async id => {
        this.setState({
            hasLoading: true
        });
        // await updateFcis(data.id, { value: data.value });
        await this.props.restoreFundingEFCILog(this.state.restoreId);
        this.setState({
            openSection3: false,
            hasLoading: false,
            openFundingCostEfciRestore: false
        });
    };

    restoreAnnualFunding = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreAnnualFundingOption(this.state.restoreId);
        this.setState({
            openSection1: false,
            hasLoading: false,
            openAnnualFundingOptionRestore: false
        });
    };

    restoreFundingOption = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreFundingOptionLog(this.state.restoreId);
        this.setState({
            openSection2: false,
            hasLoading: false,
            openFundingCostRestore: false
        });
    };

    renderFormModal = () => {
        const { openSection } = this.state;
        if (!openSection) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.annualEfciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelAnnualEfciOpen}
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

    renderFormModal3 = () => {
        const { openSection3 } = this.state;
        if (!openSection3) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.annualEfciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelFundingCostEfciOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortFundingEfci={this.sortFundingEfci}
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

    renderFormModal1 = () => {
        const { openSection1 } = this.state;
        if (!openSection1) return null;

        return (
            <Portal
                body={
                    <LogAnnualFunding
                        logs={this.props.annualEfciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelAnnualFundingOptionOpen}
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

    renderFormModal2 = () => {
        const { openSection2 } = this.state;
        if (!openSection2) return null;

        return (
            <Portal
                body={
                    <FundingOptionLog
                        logs={this.props.annualEfciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelFundingCostOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortFundingCost={this.sortFundingCost}
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

    // sortFundingCost = async (data) => {
    //     const { selectedColumnId, sortKey } = this.state;
    //     this.props.sortSiteEfciLog(selectedColumnId, sortKey, 2);
    // }

    showLogsTotalFundingOption = async (id, noOfYears) => {
        await this.setState({
            noOfYears: noOfYears,
            selectedColumnId: id,
            hasLoading: true,
            openSection4: true
        });
        await this.props.getTotalFundingLogs(id, this.state.sortKey);
        this.setState({ hasLoading: false });
    };

    restoreTotalFunding = async id => {
        this.setState({
            hasLoading: true
        });
        // await updateFcis(data.id, {value: data.value });
        await this.props.restoreTotalFundingLog(this.state.restoreId);
        this.setState({
            openSection4: false,
            hasLoading: false,
            openTotalFundingCostRestore: false
        });
    };

    renderFormModal4 = () => {
        const { openSection4 } = this.state;
        if (!openSection4) return null;

        return (
            <Portal
                body={
                    <EFCILogs
                        logs={this.props.annualEfciLog}
                        onCancel={this.onCancel}
                        // restoreAnnualEfci={this.restoreTotalFunding}
                        restoreAnnualEfci={this.showRestorePanelTotalFundingCostOpen}
                        hasLoading={this.state.hasLoading}
                        numberOfYears={this.state.noOfYears}
                        totalFunding={true}
                        deleteLog={this.deleteLog}
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

    showLogsCSP = async id => {
        const { sortKey } = this.state;
        this.setState({
            openCSP: true,
            selectedColumnId: id,
            hasLoading: true
        });
        await this.props.getCSPLogs(id, sortKey);
        this.setState({
            hasLoading: false
        });
    };

    renderFormModalCsp = () => {
        const { openCSP } = this.state;
        if (!openCSP) return null;

        return (
            <Portal
                body={
                    <LogsInfo
                        logs={this.props.annualEfciLog}
                        onCancel={this.onCancel}
                        restoreAnnualEfci={this.showRestorePanelOpen}
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

    // sortCspTable = async (data) => {
    //     const { selectedColumnId, sortKey } = this.state;
    //     this.props.getCSPLogs(selectedColumnId, sortKey);
    // }

    // sortFundingCost = async (data) => {
    //     const { selectedColumnId, sortKey } = this.state;
    //     this.props.getCSPLogs(selectedColumnId, sortKey);
    // }

    restoreCSp = async id => {
        this.setState({
            hasLoading: true
        });
        await this.props.restoreCSP(this.state.restoreId);
        this.setState({
            openCSP: false,
            hasLoading: false,
            showConfirmRestoreModalLog: false
        });
    };

    toggleLoader = () => {
        this.setState({
            hasLoading: !this.state.hasLoading
        });
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
            openSection: false,
            openSection1: false,
            openSection2: false,
            openSection3: false,
            openSection4: false,
            openCSP: false
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

    showRestorePanelOpen = (id, changeSet) => {
        this.setState({
            showConfirmRestoreModalLog: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderFundingCostRestoreModalLog = () => {
        const { openFundingCostRestore, changeSet, associated_changes } = this.state;
        if (!openFundingCostRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openFundingCostRestore: false })}
                        onYes={this.restoreFundingOption}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openFundingCostRestore: false })}
            />
        );
    };

    showRestorePanelFundingCostOpen = (id, changeSet) => {
        this.setState({
            openFundingCostRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderConfirmationRestoreModalLog = () => {
        const { showConfirmRestoreModalLog, changeSet, associated_changes } = this.state;
        if (!showConfirmRestoreModalLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ showConfirmRestoreModalLog: false })}
                        onYes={this.restoreCSp}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ showConfirmRestoreModalLog: false })}
            />
        );
    };

    renderFundingCostEfciRestoreModalLog = () => {
        const { openFundingCostEfciRestore, changeSet, associated_changes } = this.state;
        if (!openFundingCostEfciRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openFundingCostEfciRestore: false })}
                        onYes={this.restoreFundingEfci}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openFundingCostEfciRestore: false })}
            />
        );
    };

    showRestorePanelFundingCostEfciOpen = (id, changeSet) => {
        this.setState({
            openFundingCostEfciRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderFundingAnnualFundingRestoreModalLog = () => {
        const { openAnnualFundingOptionRestore, changeSet, associated_changes } = this.state;
        if (!openAnnualFundingOptionRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openAnnualFundingOptionRestore: false })}
                        onYes={this.restoreAnnualFunding}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openAnnualFundingOptionRestore: false })}
            />
        );
    };

    showRestorePanelAnnualFundingOptionOpen = (id, changeSet) => {
        this.setState({
            openAnnualFundingOptionRestore: true,
            restoreId: id,
            changeSet: changeSet
        });
    };

    renderFundingAnnualEfciRestoreModalLog = () => {
        const { openAnnualEfciRestore, changeSet, associated_changes } = this.state;
        if (!openAnnualEfciRestore) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={changeSet}
                        // associatedchanges={associated_changes}
                        onNo={() => this.setState({ openAnnualEfciRestore: false })}
                        onYes={this.restoreAnnualEfci}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ openAnnualEfciRestore: false })}
            />
        );
    };

    showRestorePanelAnnualEfciOpen = (id, changeSet) => {
        this.setState({
            openAnnualEfciRestore: true,
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
                        onYes={this.restoreTotalFunding}
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

    sortCspTable = async data => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortSiteEfciLog(selectedColumnId, sortKey, 1);
    };

    sortFundingCost = async data => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortSiteEfciLog(selectedColumnId, sortKey, 2);
    };

    sortFundingEfci = async data => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortSiteEfciLog(selectedColumnId, sortKey, 3);
    };

    sortTotalFundingCost = async data => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortSiteEfciLog(selectedColumnId, sortKey, 4);
    };

    sortAnnualFunding = async data => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortSiteEfciLog(selectedColumnId, sortKey, 5);
    };

    sortAnnualEfci = async data => {
        const { selectedColumnId, sortKey } = this.state;
        this.props.sortSiteEfciLog(selectedColumnId, sortKey, 6);
    };

    setColoCode = async () => {
        this.setState({
            isOpenColorCode: !this.state.isOpenColorCode
            // isCodeLoading: true
        });
        // await this.props.getColorCode();
        // this.setState({
        //     isCodeLoading: false
        // });
    };

    setColor = value => {
        const { colorCodes } = this.props;
        let colorCode = "";
        colorCodes &&
            colorCodes.length &&
            colorCodes.map(color => (value >= color.range_start && value <= color.range_end ? (colorCode = color.code) : ""));
        return colorCode;
    };

    render() {
        const { efciSiteData, basicDetails, isChartView, dataView } = this.props;
        const { activeTab, subTotalByYear, isOpenColorCode } = this.state;
        var areaName =
            this.state.currentArea === "Region"
                ? (basicDetails && basicDetails.region && basicDetails.region.name) || ""
                : (basicDetails && basicDetails.name) || "";

        return (
            <>
                <LoadingOverlay active={this.props.efciLoading} spinner={<Loader />} fadeSpeed={10}>
                    <div className="tab-active location-sec image-sec tab-grey efci-otr fund-efci" id={"efciData"}>
                        {this.renderConfirmationModal()}
                        <div className="dtl-sec col-md-12">
                            <HelperIcon type={"efci_and_sandbox"} entity={"site"} additoinalClass={"efci_and_sandbox"} />
                            <div className="table-top-menu zoom-section">
                                <div className="lft">
                                    {this.lock()}
                                    {this.unlock()}
                                    {this.renderForceModal()}
                                    {activeTab === "CSP Summary" ? null : (
                                        <div className="locked-section" onClick={() => this.setColoCode()}>
                                            <button className="add-btn add-build-btn lgd">
                                                <img src="/img/color-wheel.svg" alt="" className="img-whel" />
                                                <span className="txt-spn">Legend</span>
                                            </button>
                                        </div>
                                    )}
                                    {!isChartView ? (
                                        <button
                                            className="btn-fci"
                                            onClick={() => {
                                                this.setState({ showForceModal: true });
                                            }}
                                        >
                                            {/* <span className="txt-spn"  */}
                                            {/* onClick={() => { this.setState({ showForceModal: true }) }}> */}
                                            Force EFCI Update
                                        </button>
                                    ) : null}
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
                                            {`${dataView == "building" ? "Building" : this.state.currentArea} ${
                                                isChartView ? "EFCI Sandbox" : ""
                                            } - ${areaName}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="rgt">
                                    <button
                                        className={activeTab === "CSP Summary" ? "btn-fci active" : "btn-fci"}
                                        name="CSP Summary"
                                        onClick={event => this.setActiveTab(event.target.name)}
                                    >
                                        CSP Summary
                                    </button>
                                    <button
                                        className={activeTab === "Funding and EFCI Analysis" ? "btn-fci active" : "btn-fci"}
                                        name="Funding and EFCI Analysis"
                                        onClick={event => this.setActiveTab(event.target.name)}
                                    >
                                        Funding and EFCI Analysis
                                    </button>
                                    <button
                                        className={activeTab === "Region Funding and EFCI Analysis" ? "btn-fci active" : "btn-fci btn-dif"}
                                        name="Region Funding and EFCI Analysis"
                                        onClick={event => this.setActiveTab(event.target.name)}
                                    >
                                        Region : Funding and EFCI Analysis
                                    </button>
                                </div>
                            </div>
                            {activeTab === "CSP Summary" ? (
                                efciSiteData && efciSiteData.name ? (
                                    <CSPSummarySite
                                        efciSiteData={efciSiteData}
                                        updatePercentage={this.props.updatePercentage}
                                        updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                                        getCSPLogs={this.props.getCSPLogs}
                                        restoreCSP={this.props.restoreCSP}
                                        showLogsCSP={this.showLogsCSP}
                                        disableClick={this.state.locked}
                                    />
                                ) : (
                                    <div className="table-topper efc-topr no-data-efci">
                                        <div className="col-md-12 otr-topr">
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
                                        // updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
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
                                        disableClick={this.state.locked}
                                    />
                                ) : (
                                    <div className="table-topper efc-topr no-data-efci">
                                        <div className="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : activeTab === "Region Funding and EFCI Analysis" ? (
                                this.props.efciByRegion &&
                                this.props.efciByRegion.funding_options &&
                                this.props.efciByRegion.funding_options.length ? (
                                    <FundingEFCIAnalysis
                                        efciData={this.props.efciByRegion}
                                        efciBuildingData={this.props.efciBuildingData}
                                        setColor={this.setColor}
                                        handleFundingCostData={this.props.handleRegionEfciFundingCost}
                                        updateFundingCostData={this.props.updateRegionEfciFundingCost}
                                        handleFundingCostEfci={this.props.handleRegionFundingCostEfci}
                                        updateFundingCostEfci={this.props.updateRegionFundingEfci}
                                        handleAnnualFundingOption={this.props.handleRegionAnnualFundingOption}
                                        updateAnnualFundingOption={this.props.updateRegionAnnualFunding}
                                        handleAnnualEfci={this.props.handleRegionAnnualEfci}
                                        updateAnnualEFCI={this.props.updateRegionAnnualEFCI}
                                        showLog={this.props.showLog}
                                        disableClick={this.state.locked}
                                    />
                                ) : (
                                    <div class="table-topper efc-topr no-data-efci">
                                        <div class="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div class="table-topper efc-topr no-data-efci">
                                    <div class="col-md-12 otr-topr">
                                        <h3>No data found</h3>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {this.renderFormModal()}
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
                    {this.renderFundingTotalFundingCostRestoreModalLog()}
                </LoadingOverlay>
            </>
        );
    }
}
export default EFCISite;
