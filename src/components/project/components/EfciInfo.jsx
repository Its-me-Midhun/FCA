import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";

// import regionActions from "../actions";
// import siteActions from "../../site/actions";
// import buildingActions from "../../building/actions";
// import BasicDetails from "../../common/components/BasicDetails";
// import InfoImages from "../../common/components/InfoImages";
// import InfoMap from "../../common/components/InfoMap";
import InfoTabs from "../../common/components/InfoTabs";
import Loader from "../../common/components/Loader";
import EFCIMain from "../../common/components/CommonEFCI/EFCIMain";
// import Buildings from "../../building/index";
// import FutureCapital from "./FutureCapital";
// import DifferedMaintenance from "./DifferedMaintenance";
// // import Dashboard from "./Dashboard";
// import EFCISite from "./EFCISite";
// import Recommendations from "../../recommendations/index";
// import EFCI from "../../common/components/EFCI/EFCI";
import Dashboard from "../../project/components/dashboard"


class EfciInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            breadCrumbsData: [{ key: "main", name: "Sites", path: "/site" }],
            isloading: true,
            basicDetails: {
                client: {},
                users: [],
                name: "",
                code: "",
                comments: "",
                created_at: "",
                updated_at: "",
                region: {}
            },
            locationDetails: {
                place: "",
                lat: "",
                long: ""
            },
            imageList: [],
            efciTab: ["CSP Summary", "EFCI Funding EFCi Analysis", "Region: EFCI Funding Analysis"]
        };
    }

    componentDidMount() {
        const siteId = this.props.match.params.id;
        const {
            location: { search }
        } = this.props;

        const query = qs.parse(search);
        this.setState({
            infoTabsData: [
                {
                    key: "dashboard",
                    name: "EFCI Sandbox",
                    path: `/efci/efciinfo/${siteId}/dashboard${search}`
                },
                {
                    key: "efci",
                    name: "EFCI",
                    path: `/efci/efciinfo/${siteId}/efci${search}`
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

            const query = qs.parse(search);
            this.setState({
                infoTabsData: [
                    {
                        key: "dashboard",
                        name: "EFCI Sandbox",
                        path: `/efci/efciinfo/${siteId}/dashboard${search}`
                    },
                    {
                        key: "efci",
                        name: "EFCI",
                        path: `/efci/efciinfo/${siteId}/efci${search}`
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
                <div class="coming-soon bg-wh">
                    <div class="coming-soon-img">
                        <img src="/img/coming-soon.svg" />
                    </div>
                    <h3>COMING SOON</h3>
                </div>
            </>
        );
    }

    render() {
        const {
            handleDeleteItem,
            keys,
            config,
            match: {
                params: { tab }
            },
            location: { search }
        } = this.props;
        const { basicDetails, locationDetails, imageList, selectedImage, infoTabsData } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12 ">
                    <div className="tab-dtl region-mng total-view-graph">
                        <InfoTabs
                            infoTabsData={infoTabsData}
                            setActiveTab={this.setActiveTab}
                        />
                        {tab === "dashboard" ?
                            <>
                                {/* {this.commingSoonPic()} */}
                                <Dashboard
                                    dataView={"project"}
                                    // basicDetails={basicDetails}
                                    projectId={this.props.projectId}
                                    loadData={this.props.loadData}
                                    getEfciBasedOnProject={this.props.getEfciBasedOnProject}
                                    saveData={this.props.saveData}

                                    efciRegionData={this.props.efciData}
                                    // entityName={basicDetails.name}
                                    efciLoading={this.props.efciLoading}
                                    colorCodes={this.props.colorCodes}
                                    entity={"Project"}
                                    mainEntity={""}
                                    hideMainEntity={true}
                                    handleCspSummary={this.props.handleProjectCspSummary}
                                    updateCspSummary={this.props.updateProjectCspSummary}
                                    handleAnnualEfci={this.props.handleProjectAnnualEfci}
                                    updateAnnualEFCI={this.props.updateProjectAnnualEFCI}
                                    updateAnnualFundingOption={this.props.updateProjectAnnualFunding}
                                    handleAnnualFundingOption={this.props.handleProjectAnnualFundingOption}
                                    handleFundingCostEfci={this.props.handleProjectFundingCostEfci}
                                    updateFundingCostEfci={this.props.updateProjectFundingEfci}
                                    handleFundingCostData={this.props.handleProjectEfciFundingCost}
                                    updateFundingCostData={this.props.updateProjectEfciFundingCost}
                                    showLog={this.props.showLog}
                                    updateEfciLock={this.props.updateProjectEfciLock}
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
                                <>
                                    <EFCIMain
                                        efciRegionData={this.props.efciData}
                                        colorCodes={this.props.colorCodes}
                                        efciLoading={this.props.efciLoading}
                                        entity={"Project"}
                                        // mainEntity={""}
                                        hideMainEntity={true}
                                        handleCspSummary={this.props.handleProjectCspSummary}
                                        updateCspSummary={this.props.updateProjectCspSummary}
                                        handleAnnualEfci={this.props.handleProjectAnnualEfci}
                                        updateAnnualEFCI={this.props.updateProjectAnnualEFCI}
                                        updateAnnualFundingOption={this.props.updateProjectAnnualFunding}
                                        handleAnnualFundingOption={this.props.handleProjectAnnualFundingOption}
                                        handleFundingCostEfci={this.props.handleProjectFundingCostEfci}
                                        updateFundingCostEfci={this.props.updateProjectFundingEfci}
                                        handleFundingCostData={this.props.handleProjectEfciFundingCost}
                                        updateFundingCostData={this.props.updateProjectEfciFundingCost}
                                        updateEfciLock={this.props.updateProjectEfciLock}
                                        showLog={this.props.showLog}
                                        isValueChanged={this.props.isValueChanged}

                                        forceUpdateData={this.props.forceUpdateData}
                                        tempArray={this.props.tempArray}
                                        resetData={this.props.resetData}
                                        saveDataForce={this.props.saveDataForce}

                                        updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                        hiddenFundingOptionList={this.props.hiddenFundingOptionList}

                                    />
                                </>
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
    const { projectReducer } = state;
    return { projectReducer };
};

export default withRouter(connect(mapStateToProps)(EfciInfo));
// export default withRouter(EfciInfo);