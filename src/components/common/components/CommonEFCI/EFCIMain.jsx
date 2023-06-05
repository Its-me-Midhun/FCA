import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../Loader";
import CSPSummary from "./CSPSummary";
import ColorCodedata from "../ColoCodeData";
import FundingEFCIAnalysis from "./FundingEFCIAnalysis";
import Portal from "../Portal";
import LogForm from "./LogForm";
import MainEntityFundingAnalysis from "./MainEntityFundingAnalysis";
import ForceUpdate from "./forceUpdate";
import ConfirmationModal from "../ConfirmationModal";
import HelperIcon from "../../../helper/components/HelperIcon";
import { LockUnlock } from "../LockUnlock";
import { LOCK_STATUS } from "../../constants";

class EFCIMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locked: false,
            partial_locked: false,
            activeTab: "2",
            grandTotal: null,
            currentArea: this.props.entity || "",
            openSection: false,
            hasLoading: false,
            sortKey: "efci_versions.created_at",
            sortOrder: false,
            isOpenColorCode: false,
            showForceModal: false,
            showConfirmModal: false
        };
    }

    componentDidUpdate = async prevProps => {
        if (prevProps.efciRegionData !== this.props.efciRegionData) {
            this.setState({
                locked: this.props.efciRegionData?.lock_status === LOCK_STATUS.LOCKED,
                partial_locked: this.props.efciRegionData?.lock_status === LOCK_STATUS.PARTIALLY_LOCKED
            });
        }
    };

    setActiveTab(name) {
        this.setState({
            activeTab: name,
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

    openLogPanel = async id => {
        this.setState({
            openLogPanel: true,
            selectedColumnId: id,
            hasLoading: true
        });
    };

    cancelLogPanel = () => {
        this.setState({
            openLogPanel: false
        });
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
                        onYes={this.confirmSubmit}
                        type={"save"}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    confirmSubmit = async () => {
        this.setState({ showConfirmModal: false });
        await this.props.saveDataForce();
    };

    renderForceModal = () => {
        const { showForceModal } = this.state;
        if (!showForceModal) return null;

        return (
            <Portal
                body={
                    <ForceUpdate
                        setColor={this.setColor}
                        efciData={this.props.efciRegionData}
                        onCancel={async () => {
                            await this.setState({ showForceModal: false });
                            await this.props.resetData();
                        }}
                        handleFundingCostData={this.props.handleFundingCostData}
                        updateFundingCostData={this.props.updateFundingCostData}
                        handleFundingCostEfci={this.props.handleFundingCostEfci}
                        updateFundingCostEfci={this.props.updateFundingCostEfci}
                        disableClick={this.props.disableClick}
                        totalProjectCost={this.state.totalCostData}
                        handLeTotalFundingCost={this.handLeTotalFundingCost}
                        showLog={this.props.showLog}
                        forceUpdateData={this.props.forceUpdateData}
                        saveData={() => this.setState({ showConfirmModal: true })}
                        // saveData={this.props.saveDataForce}
                        tempArray={this.props.tempArray}
                        isValueChanged={this.props.isValueChanged}
                    />
                }
                onCancel={() => this.setState({ showForceModal: false })}
            />
        );
    };

    renderLogPanel = () => {
        const { openLogPanel } = this.state;
        if (!openLogPanel) return null;

        return (
            <Portal
                body={
                    <LogForm
                        logs={[]}
                        onCancel={this.cancelLogPanel}
                        restoreAnnualEfci={this.showRestorePanelOpen}
                        hasLoading={this.state.hasLoading}
                        deleteLog={this.deleteLog}
                        sortCspTable={this.sortCspTable}
                    />
                }
                onCancel={this.cancelLogPanel}
            />
        );
    };

    restoreLogPanel = async () => {
        // const { openTotalFundingCostRestore, changeSet, openLogPanel } = this.state;
        // if (!openTotalFundingCostRestore) return null;
        // return (
        //     <Portal
        //         body={
        //             <ConfirmationModal
        //                 heading={"Do you want to restore this log?"}
        //                 message={changeSet}
        //                 // associatedchanges={associated_changes}
        //                 onNo={() => this.setState({ openTotalFundingCostRestore: false })}
        //                 onYes={this.restoreTotalFunding}
        //                 isRestore={true}
        //                 type={"restore"}
        //                 isLogChange={true}
        //             />
        //         }
        //         onCancel={() => this.setState({ openTotalFundingCostRestore: false })}
        //     />
        // );
    };

    render() {
        const { dataView, mainEntity, isChartView, efciRegionData, entity = "" } = this.props;
        const { activeTab, currentArea, isOpenColorCode, locked, partial_locked } = this.state;
        var areaName =
            this.state.currentArea === this.props.mainEntity
                ? (efciRegionData && efciRegionData.project_name) || ""
                : (efciRegionData && efciRegionData.name) || "";
        let cspData = Object.values((efciRegionData && efciRegionData.capital_spending_plans) || {});
        return (
            <>
                <LoadingOverlay active={this.props.efciLoading} spinner={<Loader />} fadeSpeed={10}>
                    {this.renderConfirmationModal()}
                    <div className="tab-active location-sec image-sec tab-grey efci-otr fund-efci">
                        <div className="dtl-sec col-md-12">
                            <HelperIcon
                                type={"efci_and_sandbox"}
                                entity={entity === "Project" ? "fca_projects" : entity ? entity.toLowerCase() : ""}
                                additoinalClass={"efci_and_sandbox"}
                            />
                            <div className="table-top-menu zoom-section otr-common-lck">
                                <div className="lft">
                                    <LockUnlock locked={locked} partial_locked={partial_locked} lockProject={this.props.updateEfciLock} />
                                    {this.renderForceModal()}
                                    {activeTab === "1" ? null : (
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
                                    {this.props.hideMainEntity ? null : (
                                        <button
                                            className={`${activeTab == 3 ? "btn-fci active" : "btn-fci btn-dif"}`}
                                            name={3}
                                            onClick={event => this.setActiveTab(event.target.name, 1)}
                                        >
                                            {mainEntity} : Funding and EFCI Analysis
                                        </button>
                                    )}
                                </div>
                            </div>
                            {activeTab === "2" ? (
                                this.props.efciRegionData &&
                                this.props.efciRegionData.funding_options &&
                                this.props.efciRegionData.funding_options.length ? (
                                    <FundingEFCIAnalysis
                                        setColor={this.setColor}
                                        efciData={this.props.efciRegionData}
                                        handleAnnualEfci={this.props.handleAnnualEfci}
                                        updateAnnualEFCI={this.props.updateAnnualEFCI}
                                        handleAnnualFundingOption={this.props.handleAnnualFundingOption}
                                        updateAnnualFundingOption={this.props.updateAnnualFundingOption}
                                        updateFundingCostData={this.props.updateFundingCostData}
                                        handleFundingCostData={this.props.handleFundingCostData}
                                        handleFundingCostEfci={this.props.handleFundingCostEfci}
                                        updateFundingCostEfci={this.props.updateFundingCostEfci}
                                        disableClick={this.state.locked}
                                        showLog={this.props.showLog}
                                        updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                        hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                    />
                                ) : (
                                    <div className="table-topper efc-topr no-data-efci">
                                        <div className="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : activeTab === "1" ? (
                                cspData && cspData.length ? (
                                    <CSPSummary
                                        efciData={this.props.efciRegionData}
                                        handleCspSummary={this.props.handleCspSummary}
                                        updateCspSummary={this.props.updateCspSummary}
                                        openLogPanel={this.openLogPanel}
                                        showLog={this.props.showLog}
                                        disableClick={this.state.locked}
                                        hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                    />
                                ) : (
                                    <div className="table-topper efc-topr no-data-efci">
                                        <div className="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : activeTab === "3" ? (
                                this.props.efciMainEntityData &&
                                this.props.efciMainEntityData.funding_options &&
                                this.props.efciMainEntityData.funding_options.length ? (
                                    <MainEntityFundingAnalysis
                                        setColor={this.setColor}
                                        efciData={this.props.efciMainEntityData}
                                        handleMainEntityAnnualEfci={this.props.handleMainEntityAnnualEfci}
                                        updateMainEntityAnnualEFCI={this.props.updateMainEntityAnnualEFCI}
                                        handleMainEntityAnnualFundingOption={this.props.handleMainEntityAnnualFundingOption}
                                        updateMainEntityAnnualFunding={this.props.updateMainEntityAnnualFunding}
                                        handleMainEntityEfciFundingCost={this.props.handleMainEntityEfciFundingCost}
                                        updateMainEntityEfciFundingCost={this.props.updateMainEntityEfciFundingCost}
                                        handleMainEntityFundingCostEfci={this.props.handleMainEntityFundingCostEfci}
                                        updateMainEntityFundingEfci={this.props.updateMainEntityFundingEfci}
                                        showLog={this.props.showLog}
                                        disableClick={this.state.locked}
                                        updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                        hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                    />
                                ) : (
                                    <div className="table-topper efc-topr no-data-efci">
                                        <div className="col-md-12 otr-topr">
                                            <h3>No data found</h3>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="table-topper efc-topr no-data-efci">
                                    <div className="col-md-12 otr-topr">
                                        <h3>No data found</h3>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </LoadingOverlay>
                {this.renderLogPanel()}
            </>
        );
    }
}
export default EFCIMain;
