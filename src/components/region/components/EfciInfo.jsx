import React, { Component } from "react";
import qs from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import regionActions from '../actions';
import InfoTabs from "../../common/components/InfoTabs";
import EFCIMain from "../../common/components/CommonEFCI/EFCIMain";
import Dashboard from "../../project/components/dashboard"

class EfciInfo extends Component {
    state = {};

    componentDidMount() {
        const siteId = this.props.match.params.id;
        const {
            location: { search }
        } = this.props;
        this.setState({
            infoTabsData: [
                {
                    key: "dashboard",
                    name: "EFCI Sandbox",
                    path: `/region/efciinfo/${siteId}/dashboard${search}`
                },
                {
                    key: "efci",
                    name: "EFCI",
                    path: `/region/efciinfo/${siteId}/efci${search}`
                }
            ]
        });
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            const siteId = this.props.match.params.id;
            const {
                location: { search }
            } = this.props;
            this.setState({
                infoTabsData: [
                    {
                        key: "dashboard",
                        name: "EFCI Sandbox",
                        path: `/region/efciinfo/${siteId}/dashboard${search}`
                    },
                    {
                        key: "efci",
                        name: "EFCI",
                        path: `/region/efciinfo/${siteId}/efci${search}`
                    }
                ]
            });
        }

    }

    setActiveTab(item) {
        // this.props.efciTabData(item);
    }

    commingSoonPic = () => {
        return (
            <>
                <div className="coming-soon bg-wh">
                    <div className="coming-soon-img">
                        <img src="/img/coming-soon.svg" alt= ""/>
                    </div>
                    <h3>COMING SOON</h3>
                </div>
            </>
        );
    };

    render() {
        const {
            match: {
                params: { tab }
            },
            location: { search }
        } = this.props;
        const {
            infoTabsData
        } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12 ">
                    <div className="tab-dtl region-mng total-view-graph">
                        <InfoTabs infoTabsData={infoTabsData} setActiveTab={this.setActiveTab} />
                        {tab === "dashboard" ?
                            <>
                                <Dashboard
                                    dataView={"region"}
                                    regionId={this.props.regionId}
                                    loadDataRegion={this.props.loadDataRegion}
                                    getEfciBasedOnRegion={this.props.getEfciBasedOnRegion}
                                    saveData={this.props.saveData}


                                    entity={"Region"}
                                    mainEntity={"Project"}
                                    // entityName={this.props.entityName.name}
                                    colorCodes={this.props.colorCodes}
                                    efciLoading={this.props.efciLoading}
                                    efciRegionData={this.props.efciRegionData}
                                    handleAnnualEfci={this.props.handleRegionAnnualEfci}
                                    updateAnnualEFCI={this.props.updateRegionAnnualEFCI}
                                    updateAnnualFundingOption={this.props.updateRegionAnnualFunding}
                                    handleAnnualFundingOption={this.props.handleRegionAnnualFundingOption}
                                    handleFundingCostEfci={this.props.handleRegionFundingCostEfci}
                                    updateFundingCostEfci={this.props.updateRegionFundingEfci}
                                    handleFundingCostData={this.props.handleRegionEfciFundingCost}
                                    updateFundingCostData={this.props.updateRegionEfciFundingCost}
                                    handleCspSummary={this.props.handleRegionCspSummary}
                                    updateCspSummary={this.props.updateRegionCspSummary}
                                    efciMainEntityData={this.props.efciProjectData}
                                    updateMainEntityAnnualEFCI={this.props.updateProjectAnnualEFCI}
                                    handleMainEntityAnnualEfci={this.props.handleProjectAnnualEfci}
                                    handleMainEntityAnnualFundingOption={this.props.handleProjectAnnualFundingOption}
                                    updateMainEntityAnnualFunding={this.props.updateProjectAnnualFunding}
                                    handleMainEntityEfciFundingCost={this.props.handleProjectEfciFundingCost}
                                    updateMainEntityEfciFundingCost={this.props.updateProjectEfciFundingCost}
                                    handleMainEntityFundingCostEfci={this.props.handleProjectFundingCostEfci}
                                    updateMainEntityFundingEfci={this.props.updateProjectFundingEfci}
                                    showLog={this.props.showLog}
                                    updateEfciLock={this.props.updateRegionEfciLock}
                                    forceUpdateData={this.props.forceUpdateData}
                                    tempArray={this.props.tempArray}
                                    resetData={this.props.resetData}
                                    saveDataForce={this.props.saveDataForce}

                                    updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                    hiddenFundingOptionList={this.props.hiddenFundingOptionList}



                                />
                            </>
                            :
                            tab === "efci" ?
                                <EFCIMain
                                    entity={"Region"}
                                    mainEntity={"Project"}
                                    colorCodes={this.props.colorCodes}
                                    efciLoading={this.props.efciLoading}
                                    efciRegionData={this.props.efciRegionData}
                                    handleAnnualEfci={this.props.handleRegionAnnualEfci}
                                    updateAnnualEFCI={this.props.updateRegionAnnualEFCI}
                                    updateAnnualFundingOption={this.props.updateRegionAnnualFunding}
                                    handleAnnualFundingOption={this.props.handleRegionAnnualFundingOption}
                                    handleFundingCostEfci={this.props.handleRegionFundingCostEfci}
                                    updateFundingCostEfci={this.props.updateRegionFundingEfci}
                                    handleFundingCostData={this.props.handleRegionEfciFundingCost}
                                    updateFundingCostData={this.props.updateRegionEfciFundingCost}
                                    handleCspSummary={this.props.handleRegionCspSummary}
                                    updateCspSummary={this.props.updateRegionCspSummary}
                                    efciMainEntityData={this.props.efciProjectData}
                                    updateMainEntityAnnualEFCI={this.props.updateProjectAnnualEFCI}
                                    handleMainEntityAnnualEfci={this.props.handleProjectAnnualEfci}
                                    handleMainEntityAnnualFundingOption={this.props.handleProjectAnnualFundingOption}
                                    updateMainEntityAnnualFunding={this.props.updateProjectAnnualFunding}
                                    handleMainEntityEfciFundingCost={this.props.handleProjectEfciFundingCost}
                                    updateMainEntityEfciFundingCost={this.props.updateProjectEfciFundingCost}
                                    handleMainEntityFundingCostEfci={this.props.handleProjectFundingCostEfci}
                                    updateMainEntityFundingEfci={this.props.updateProjectFundingEfci}
                                    showLog={this.props.showLog}
                                    updateEfciLock={this.props.updateRegionEfciLock}
                                    forceUpdateData={this.props.forceUpdateData}
                                    tempArray={this.props.tempArray}
                                    resetData={this.props.resetData}
                                    saveDataForce={this.props.saveDataForce}
                                    isValueChanged={this.props.isValueChanged}

                                    updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                    hiddenFundingOptionList={this.props.hiddenFundingOptionList}


                                />
                                :
                                <>
                                    {this.commingSoonPic()}
                                </>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { regionReducer } = state;
    return { regionReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions })(EfciInfo));
// export default withRouter(EfciInfo);

