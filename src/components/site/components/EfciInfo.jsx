import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import regionActions from "../actions";
import siteActions from "../../site/actions";
import buildingActions from "../../building/actions";
import BasicDetails from "../../common/components/BasicDetails";
import InfoImages from "../../common/components/InfoImages";
import InfoMap from "../../common/components/InfoMap";
import InfoTabs from "../../common/components/InfoTabs";
import Loader from "../../common/components/Loader";
import Buildings from "../../building/index";
import FutureCapital from "./FutureCapital";
import DifferedMaintenance from "./DifferedMaintenance";
import Dashboard from "./Dashboard";
import EFCISite from "./EFCISite";
import Recommendations from "../../recommendations/index";
import EFCI from "../../common/components/EFCI/EFCI";

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
        this.setActiveTab = this.setActiveTab.bind(this);
    }

    componentDidMount() {
        const path = this.props.siteReducer.efciTabData && this.props.siteReducer.efciTabData.path || "";
        const siteId = this.props.match.params.id;
        const {
            location: { search }
        } = this.props;

        const query = qs.parse(search);
        if (path && path) {
            const data = path.split("/")[4].split("?")[0];
            const ds = qs.parse(data);
            if (data === "efci") {
                this.props.history.push(`/site/efciinfo/${siteId}/efci${search}`);
            }
        }
        this.setState({
            infoTabsData: [
                {
                    key: "dashboard",
                    name: "EFCI Sandbox",
                    path: `/site/efciinfo/${siteId}/dashboard${search}`
                },
                {
                    key: "efci",
                    name: "EFCI",
                    path: `/site/efciinfo/${siteId}/efci${search}`
                }
            ]
        });
        this.refreshinfoDetails();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            const path = this.props.siteReducer.efciTabData && this.props.siteReducer.efciTabData.path || "";
            const siteId = this.props.match.params.id;
            const {
                location: { search }
            } = this.props;

            const query = qs.parse(search);
            if (path && path) {
                const data = path.split("/")[4].split("?")[0];
                const ds = qs.parse(data);
                if (data === "efci") {
                    this.props.history.push(`/site/efciinfo/${siteId}/efci${search}`);
                }
            }
            this.setState({
                infoTabsData: [
                    {
                        key: "dashboard",
                        name: "EFCI Sandbox",
                        path: `/site/efciinfo/${siteId}/dashboard${search}`
                    },
                    {
                        key: "efci",
                        name: "EFCI",
                        path: `/site/efciinfo/${siteId}/efci${search}`
                    }
                ]
            });
            this.refreshinfoDetails();
        }

    }

    refreshinfoDetails = async () => {
        await this.props.getDataById(this.props.match.params.id);
        await this.props.getAllImageList(this.props.match.params.id);
        const {
            siteReducer: {
                getSiteByIdResponse: {
                    client,
                    users,
                    code,
                    comments,
                    name,
                    success,
                    place,
                    region,
                    created_at,
                    updated_at,
                    latitude: lat,
                    longitude: long
                },
                getAllImagesResponse: { images }
            }
        } = this.props;
        let imageResult = images ? images.filter((img, i) => {
            if (img.default_image) {
                img.index = i;
                return img;
            }
        }) : [];
        if (success) {
            await this.setState({
                basicDetails: {
                    client,
                    users,
                    name,
                    code,
                    comments,
                    region,
                    created_at,
                    updated_at
                },
                locationDetails: {
                    place,
                    lat,
                    long
                },
                imageList: images,
                selectedImage: { image: imageResult[0] || images[0], index: imageResult.length ? imageResult[0].index : 0 },
                // breadCrumbsData: [
                //     { key: "main", name: "Sites", path: "/site" },
                //     {
                //         key: "info",
                //         name: name,
                //         path: `/site/siteinfo/${this.props.match.params.id}/basicdetails`
                //     }
                // ],
                isloading: false
            });
        }
        return true;
    };

    setActiveTab(item) {
        this.props.efciTabData(item);
        this.setState({
        })
    }

    render() {
        const {
            // infoTabsData,
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
                            setActiveTab={this.setActiveTab} />
                        {tab === "dashboard" ? (
                            <Dashboard
                                dataView={"site"}
                                differedMaintenance={this.props.differedMaintenance}
                                proDifferedMaintenance={this.props.proDifferedMaintenance}
                                siteList={
                                    this.props.commonReducer &&
                                    this.props.commonReducer.getMenuItemsResponse &&
                                    this.props.commonReducer.getMenuItemsResponse.sites
                                }
                                siteId={this.props.match.params.id}
                                basicDetails={basicDetails}
                                efciSiteData={this.props.efciSiteData}
                                updatePercentage={this.props.updatePercentage}
                                updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                                updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                                updateSiteFundingOption={this.props.updateSiteFundingOption}
                                updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                updateFcis={this.props.updateFcis}
                                updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                updateFundingEfciData={this.props.updateFundingEfciData}
                                updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                updateBuildingEfciLock={this.props.updateBuildingEfciLock}
                                getEfciBasedOnSite={this.props.getEfciBasedOnSite}
                                loadData={this.props.loadData}
                                saveData={this.props.saveData}
                                showLog={this.props.showLog}
                                updateSiteEfciLock={this.props.updateSiteEfciLock}
                                efciByRegion={this.props.efciByRegion}
                                forceUpdateData={this.props.forceUpdateData}
                                tempArray={this.props.tempArray}
                                resetData={this.props.resetData}
                                saveDataForce={this.props.saveDataForce}
                                isValueChanged={this.props.isValueChanged}
                                colorCodes={this.props.colorCodes}
                                // -------------------efcisanbox page break fix-------
                                getFundingOptionLogs={this.props.getFundingOptionLogs}
                                annualEfciLog={this.props.annualEfciLog}
                                logPaginationParams={this.props.logPaginationParams}
                                getTotalFundingLogs={this.props.getTotalFundingLogs}
                                getAnnualFundingCalculationColumnLogs={this.props.getAnnualFundingCalculationColumnLogs}
                                deleteEfciLogData={this.props.deleteEfciLogData}
                                restoreFundingOptionLog={this.props.restoreFundingOptionLog}
                                restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                                restoreAnnualFundingOption={this.props.restoreAnnualFundingOption}
                                logCount={this.props.logCount}
                                getAnnualEfciColumnLogs={this.props.getAnnualEfciColumnLogs}
                                restoreAnnualEfciCalculation={this.props.restoreAnnualEfciCalculation}
                                // ---------------------
                                // ---------page break in other tabs-------
                                getCSPLogs={this.props.getCSPLogs}
                                restoreCSP={this.props.restoreCSP}
                                handleRegionAnnualEfci={this.props.handleRegionAnnualEfci}
                                updateRegionAnnualEFCI={this.props.updateRegionAnnualEFCI}
                                handleRegionAnnualFundingOption={this.props.handleRegionAnnualFundingOption}
                                updateRegionAnnualFunding={this.props.updateRegionAnnualFunding}
                                handleRegionEfciFundingCost={this.props.handleRegionEfciFundingCost}
                                updateRegionEfciFundingCost={this.props.updateRegionEfciFundingCost}
                                handleRegionFundingCostEfci={this.props.handleRegionFundingCostEfci}
                                efciLoading={this.props.efciLoading}
                            // ---------------------
                            />)
                            :
                            tab === "efci" ?
                                (
                                    <EFCISite
                                        efciSiteData={this.props.efciSiteData}
                                        basicDetails={basicDetails}
                                        updatePercentage={this.props.updatePercentage}
                                        updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                                        updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                                        updateSiteFundingOption={this.props.updateSiteFundingOption}
                                        updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                        updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                        updateFcis={this.props.updateFcis}
                                        updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                        updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                        updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                        updateFundingEfciData={this.props.updateFundingEfciData}
                                        updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                        updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                        hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                        annualEfciLog={this.props.annualEfciLog}
                                        getAnnualEfciColumnLogs={this.props.getAnnualEfciColumnLogs}
                                        restoreAnnualEfciCalculation={this.props.restoreAnnualEfciCalculation}
                                        deleteEfciLogData={this.props.deleteEfciLogData}
                                        sortSiteEfciLog={this.props.sortSiteEfciLog}
                                        getAnnualFundingCalculationColumnLogs={this.props.getAnnualFundingCalculationColumnLogs}
                                        restoreAnnualFundingOption={this.props.restoreAnnualFundingOption}
                                        getFundingOptionLogs={this.props.getFundingOptionLogs}
                                        restoreFundingOptionLog={this.props.restoreFundingOptionLog}
                                        getFundingEfciLog1={this.props.getFundingEfciLog1}
                                        restoreFundingEFCILog={this.props.restoreFundingEFCILog}
                                        getTotalFundingLogs={this.props.getTotalFundingLogs}
                                        restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                                        getCSPLogs={this.props.getCSPLogs}
                                        restoreCSP={this.props.restoreCSP}
                                        getColorCode={this.props.getColorCode}
                                        colorCodes={this.props.colorCodes}
                                        efciByRegion={this.props.efciByRegion}
                                        efciLoading={this.props.efciLoading}
                                        handleRegionEfciFundingCost={this.props.handleRegionEfciFundingCost}
                                        updateRegionEfciFundingCost={this.props.updateRegionEfciFundingCost}
                                        handleRegionFundingCostEfci={this.props.handleRegionFundingCostEfci}
                                        updateRegionFundingEfci={this.props.updateRegionFundingEfci}
                                        handleRegionAnnualFundingOption={this.props.handleRegionAnnualFundingOption}
                                        updateRegionAnnualFunding={this.props.updateRegionAnnualFunding}
                                        handleRegionAnnualEfci={this.props.handleRegionAnnualEfci}
                                        updateRegionAnnualEFCI={this.props.updateRegionAnnualEFCI}
                                        showLog={this.props.showLog}
                                        updateSiteEfciLock={this.props.updateSiteEfciLock}
                                        forceUpdateData={this.props.forceUpdateData}

                                        forceUpdateData={this.props.forceUpdateData}
                                        tempArray={this.props.tempArray}
                                        resetData={this.props.resetData}
                                        saveDataForce={this.props.saveDataForce}
                                        isValueChanged={this.props.isValueChanged}
                                        logCount={this.props.logCount}
                                        logPaginationParams={this.props.logPaginationParams}
                                        handlePageClickLogs={this.props.handlePageClickLogs}
                                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}

                                    />
                                )
                                :
                                <Dashboard
                                    dataView={"site"}
                                    differedMaintenance={this.props.differedMaintenance}
                                    proDifferedMaintenance={this.props.proDifferedMaintenance}
                                    siteList={
                                        this.props.commonReducer &&
                                        this.props.commonReducer.getMenuItemsResponse &&
                                        this.props.commonReducer.getMenuItemsResponse.sites
                                    }
                                    siteId={this.props.match.params.id}
                                    basicDetails={basicDetails}
                                    efciSiteData={this.props.efciSiteData}
                                    updatePercentage={this.props.updatePercentage}
                                    updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                                    updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                                    updateSiteFundingOption={this.props.updateSiteFundingOption}
                                    updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                    updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                                    updateFcis={this.props.updateFcis}
                                    updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                                    updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                                    updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                                    updateFundingEfciData={this.props.updateFundingEfciData}
                                    updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                    updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                    hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                    updateBuildingEfciLock={this.props.updateBuildingEfciLock}
                                    getEfciBasedOnSite={this.props.getEfciBasedOnSite}
                                    loadData={this.props.loadData}
                                    saveData={this.props.saveData}
                                    showLog={this.props.showLog}
                                    updateSiteEfciLock={this.props.updateSiteEfciLock}

                                    forceUpdateData={this.props.forceUpdateData}
                                    tempArray={this.props.tempArray}
                                    resetData={this.props.resetData}
                                    saveDataForce={this.props.saveDataForce}
                                    isValueChanged={this.props.isValueChanged}


                                />}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    const { regionReducer, siteReducer, buildingReducer, commonReducer } = state;
    return { regionReducer, siteReducer, buildingReducer, commonReducer };
};

// export default withRouter(EfciInfo);
export default withRouter(connect(mapStateToProps, {
    // ...regionActions,
    ...siteActions,
    ...buildingActions
})(EfciInfo));