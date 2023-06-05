import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import regionActions from "../actions";
import siteActions from "../../site/actions";
import buildingActions from "../../building/actions";
import BuildingDetails from "./BuildingDetails";
import InfoImages from "../../common/components/InfoImages";
import InfoMap from "../../common/components/InfoMap";
import InfoTabs from "../../common/components/InfoTabs";
import Loader from "../../common/components/Loader";
import Floor from "../../floor/index";
import EFCI from "./EFCI";
import Recommendations from "../../recommendations/index";
import Dashboard from "../../site/components/Dashboard"

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

    componentDidMount = async () => {
        const path = this.props.siteReducer.efciTabData && this.props.siteReducer.efciTabData.path || "";

        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const buildingId = this.props.match.params.id;
        if (path && path) {
            const data = path.split("/")[4].split("?")[0];
            if (data === "efci") {
                this.props.history.push(`/building/efciinfo/${buildingId}/efci${search}`);
            }
        }
        this.setState({
            infoTabsData: [
                {
                    key: "dashboard",
                    name: "EFCI Sandbox",
                    path: `/building/efciinfo/${buildingId}/dashboard${search}`
                },
                {
                    key: "efci",
                    name: "EFCI",
                    path: `/building/efciinfo/${buildingId}/efci${search}`
                }
            ]
        });
        await this.refreshinfoDetails()
    }
    componentDidUpdate = async (prevProps) => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const siteId = this.props.match.params.id;
        if (this.props.location.search !== prevProps.location.search || this.props.match.params.id !== prevProps.match.params.id) {
            const path = this.props.siteReducer.efciTabData && this.props.siteReducer.efciTabData.path || "";

            // const {
            //     location: { search }
            // } = this.props;
            // const query = qs.parse(search);
            const buildingId = this.props.match.params.id;
            if (path && path) {
                const data = path.split("/")[4].split("?")[0];
                if (data === "efci") {
                    this.props.history.push(`/building/efciinfo/${buildingId}/efci${search}`);
                }
            }
            await this.setState({
                infoTabsData: [
                    {
                        key: "dashboard",
                        name: "EFCI Sandbox",
                        path: `/building/efciinfo/${buildingId}/dashboard${search}`
                    },
                    {
                        key: "efci",
                        name: "EFCI",
                        path: `/building/efciinfo/${buildingId}/efci${search}`
                    }
                ]
            });
            await this.refreshinfoDetails();
        }
        if (prevProps.refreshData !== this.props.refreshData) {
            await this.refreshinfoDetails();
        }
    }

    refreshinfoDetails = async () => {
        await this.props.getDataById(this.props.match.params.id);
        await this.props.getAllImageList(this.props.match.params.id);
        const {
            buildingReducer: {
                getBuildingByIdResponse: {
                    code,
                    name,
                    building_type,
                    client,
                    region,
                    site,
                    fca,
                    users,
                    area,
                    cost,
                    enterprise_index,
                    ownership,
                    ownership_type,
                    use,
                    manager,
                    year,
                    ministry,
                    number,
                    street,
                    city,
                    state,
                    zip_code,
                    country,
                    description,
                    comments,
                    success,
                    place,
                    created_at,
                    updated_at,
                    latitude: lat,
                    longitude: long,
                    locked,
                    projects
                },
                getAllImagesResponse: { images }
            }
        } = this.props;
        let imageResult = images
            ? images.filter((img, i) => {
                if (img.default_image) {
                    img.index = i;
                    return img;
                }
            })
            : [];
        if (success) {
            await this.setState({
                basicDetails: {
                    code,
                    name,
                    building_type,
                    client,
                    region,
                    site,
                    fca,
                    users,
                    area,
                    cost,
                    enterprise_index,
                    ownership,
                    ownership_type,
                    use,
                    manager,
                    year,
                    ministry,
                    number,
                    street,
                    city,
                    state,
                    locked: locked,
                    zip_code,
                    country,
                    description,
                    comments,
                    projects,
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
                //     { key: "main", name: "Buildings", path: "/building" },
                //     {
                //         key: "info",
                //         name: name,
                //         path: `/building/buildinginfo/${this.props.match.params.id}/basicdetails`
                //     }
                // ],
                isloading: false
            });

        }
        return true;
    };

    setActiveTab = async (item) => {
        await this.props.efciTabData(item);
        await this.setState({ currentTab: item.key })
    }

    render() {
        const {
            // infoTabsData,
            keys,
            config,
            match: {
                params: { tab }
            },
            location: { search },
            handleDeleteItem,
            efciBuildingData,
            updateCapitalSpendingPercent,
            updateAnnualFundingOptions,
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
            loading
        } = this.props;

        const { basicDetails, locationDetails, imageList, selectedImage, infoTabsData } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12 ">
                    <div className="tab-dtl region-mng total-view-graph lockset">
                        <InfoTabs
                            infoTabsData={infoTabsData}
                            basicDetails={basicDetails}
                            setActiveTab={this.setActiveTab} />
                        {tab === "dashboard" ? (
                            // <>Data</>
                            <Dashboard
                                buildingId={this.props.match.params.id}
                                dataView={"building"}
                                loading={loading}
                                updateFcis={updateFcis}
                                basicDetails={basicDetails}
                                efciBuildingData={efciBuildingData}
                                efciSiteData={this.props.efciSiteData}
                                updateFundingOption={updateFundingOption}
                                updateFcisSite={this.props.updateFcisSite}
                                updateFundingPercentage={updateFundingPercentage}
                                updateFundingOptionEfci={updateFundingOptionEfci}
                                hiddenFundingOptionList={hiddenFundingOptionList}
                                updateTotalProjectFunding={updateTotalProjectFunding}
                                updateHiddenFundingOption={updateHiddenFundingOption}
                                updateFundingOption1={this.props.updateFundingOption1}
                                updateAnnualFundingOptions={updateAnnualFundingOptions}
                                updateProjectAnnualFunding={updateProjectAnnualFunding}
                                hideFundingOptionSite={this.props.hideFundingOptionSite}
                                updateFundingEfciData={this.props.updateFundingEfciData}
                                updateAnnualEfciCalculation={updateAnnualEfciCalculation}
                                updateBuildingEfciLock={this.props.updateBuildingEfciLock}
                                updateCapitalSpendingPercent={updateCapitalSpendingPercent}
                                hideFundingOptionSiteList={this.props.hideFundingOptionSiteList}
                                updateSiteFundingOptionSite={this.props.updateSiteFundingOptionSite}
                                updateEfciInInitialFundingOptions={updateEfciInInitialFundingOptions}
                                updateTotalProjectFundingSite={this.props.updateTotalProjectFundingSite}
                                updateAnnualFundingOptionSite={this.props.updateAnnualFundingOptionSite}
                                updateProjectAnnualFundingSite={this.props.updateProjectAnnualFundingSite}
                                updateAnnualFundingOptionCalculation={updateAnnualFundingOptionCalculation}
                                updateAnnualEfciCalculationSite={this.props.updateAnnualEfciCalculationSite}
                                updateEfciInInitialFundingOptionsSite={this.props.updateEfciInInitialFundingOptionsSite}
                                logCount={this.props.logCount}
                                getAnnualEFCILogs={this.props.getAnnualEFCILogs}
                                logPaginationParams={this.props.logPaginationParams}
                                handlePageClickLogs={this.props.handlePageClickLogs}
                                handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                updateAnnualFundingOptionCalculationSite={this.props.updateAnnualFundingOptionCalculationSite}
                                colorCodes={this.props.colorCodes}
                                // --------------sanbox pagebreak fix-----
                                getFundingCostLogs={this.props.getFundingCostLogs}
                                efciLog={this.props.efciLog}
                                deleteEfciLogData={this.props.deleteEfciLogData}
                                getAnnualFundingOptionLogs={this.props.getAnnualFundingOptionLogs}
                                restoreFundingCostLog={this.props.restoreFundingCostLog}
                                restoreAnnualFundingOptionLog={this.props.restoreAnnualFundingOptionLog}
                                restoreAnnualEFCILogs={this.props.restoreAnnualEFCILogs}
                                restoreTotalFundingCostEfciLog={this.props.restoreTotalFundingCostEfciLog}
                                restoreFundingCostEfciLog={this.props.restoreFundingCostEfciLog}
                                sortBuildingEfciLog={this.props.sortBuildingEfciLog}

                                // ----------------------
                                // -----------page break in other two tabs-----------
                                getCSPLogs={this.props.getCSPLogs}
                                restoreCSP={this.props.restoreCSP}
                                getSiteFundingOptionLogs={this.props.getSiteFundingOptionLogs}
                                getSiteAnnualFundingCalculationColumnLogs={this.props.getSiteAnnualFundingCalculationColumnLogs}
                                getSiteAnnualEfciColumnLogs={this.props.getSiteAnnualEfciColumnLogs}
                                getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
                                getSiteTotalFundingLogs={this.props.getSiteTotalFundingLogs}
                                getSiteFundingEfciLog={this.props.getSiteFundingEfciLog}
                                restoreSiteFundingEFCILog={this.props.restoreSiteFundingEFCILog}
                                restoreSiteTotalFundingLog={this.props.restoreSiteTotalFundingLog}
                                getFundingCostEfciLogs={this.props.getFundingCostEfciLogs}
                                restoreSiteAnnualEfciCalculation={this.props.restoreSiteAnnualEfciCalculation}
                                restoreSiteAnnualFundingOption={this.props.restoreSiteAnnualFundingOption}
                                restoreSiteFundingOptionLog={this.props.restoreSiteFundingOptionLog}

                            // ---------------------
                            />
                        )
                            :
                            tab === "efci" ?
                                (
                                    <EFCI
                                        loading={loading}
                                        updateFcis={updateFcis}
                                        basicDetails={basicDetails}
                                        efciBuildingData={efciBuildingData}
                                        efciSiteData={this.props.efciSiteData}
                                        updateFundingOption={updateFundingOption}
                                        updateFcisSite={this.props.updateFcisSite}
                                        updateFundingPercentage={updateFundingPercentage}
                                        updateFundingOptionEfci={updateFundingOptionEfci}
                                        hiddenFundingOptionList={hiddenFundingOptionList}
                                        updateTotalProjectFunding={updateTotalProjectFunding}
                                        updateHiddenFundingOption={updateHiddenFundingOption}
                                        updateFundingOption1={this.props.updateFundingOption1}
                                        updateAnnualFundingOption={updateAnnualFundingOptions}
                                        updateProjectAnnualFunding={updateProjectAnnualFunding}
                                        hideFundingOptionSite={this.props.hideFundingOptionSite}
                                        updateFundingEfciData={this.props.updateFundingEfciData}
                                        updateAnnualEfciCalculation={updateAnnualEfciCalculation}
                                        updateBuildingEfciLock={this.props.updateBuildingEfciLock}
                                        updateCapitalSpendingPercent={updateCapitalSpendingPercent}
                                        hideFundingOptionSiteList={this.props.hideFundingOptionSiteList}
                                        updateSiteFundingOptionSite={this.props.updateSiteFundingOptionSite}
                                        updateEfciInInitialFundingOptions={updateEfciInInitialFundingOptions}
                                        updateTotalProjectFundingSite={this.props.updateTotalProjectFundingSite}
                                        updateAnnualFundingOptionSite={this.props.updateAnnualFundingOptionSite}
                                        updateProjectAnnualFundingSite={this.props.updateProjectAnnualFundingSite}
                                        updateAnnualFundingOptionCalculation={updateAnnualFundingOptionCalculation}
                                        updateAnnualEfciCalculationSite={this.props.updateAnnualEfciCalculationSite}
                                        updateEfciInInitialFundingOptionsSite={this.props.updateEfciInInitialFundingOptionsSite}
                                        updateAnnualFundingOptionCalculationSite={this.props.updateAnnualFundingOptionCalculationSite}
                                        getCSPLogs={this.props.getCSPLogs}
                                        restoreCSP={this.props.restoreCSP}
                                        efciLog={this.props.efciLog}
                                        sortBuildingEfciLog={this.props.sortBuildingEfciLog}
                                        getFundingCostLogs={this.props.getFundingCostLogs}
                                        restoreFundingCostLog={this.props.restoreFundingCostLog}
                                        getFundingCostEfciLogs={this.props.getFundingCostEfciLogs}
                                        restoreFundingCostEfciLog={this.props.restoreFundingCostEfciLog}
                                        getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
                                        restoreTotalFundingCostEfciLog={this.props.restoreTotalFundingCostEfciLog}
                                        getAnnualFundingOptionLogs={this.props.getAnnualFundingOptionLogs}
                                        restoreAnnualFundingOptionLog={this.props.restoreAnnualFundingOptionLog}
                                        getAnnualEFCILogs={this.props.getAnnualEFCILogs}
                                        restoreAnnualEFCILogs={this.props.restoreAnnualEFCILogs}
                                        getSiteAnnualEfciColumnLogs={this.props.getSiteAnnualEfciColumnLogs}
                                        restoreSiteAnnualEfciCalculation={this.props.restoreSiteAnnualEfciCalculation}
                                        getSiteAnnualFundingCalculationColumnLogs={this.props.getSiteAnnualFundingCalculationColumnLogs}
                                        restoreSiteAnnualFundingOption={this.props.restoreSiteAnnualFundingOption}
                                        getSiteFundingOptionLogs={this.props.getSiteFundingOptionLogs}
                                        restoreSiteFundingOptionLog={this.props.restoreSiteFundingOptionLog}
                                        getSiteFundingEfciLog={this.props.getSiteFundingEfciLog}
                                        restoreSiteFundingEFCILog={this.props.restoreSiteFundingEFCILog}
                                        getSiteTotalFundingLogs={this.props.getSiteTotalFundingLogs}
                                        restoreSiteTotalFundingLog={this.props.restoreSiteTotalFundingLog}
                                        colorCodes={this.props.colorCodes}
                                        logCount={this.props.logCount}
                                        logPaginationParams={this.props.logPaginationParams}
                                        handlePageClickLogs={this.props.handlePageClickLogs}
                                        handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                        deleteEfciLogData={this.props.deleteEfciLogData}
                                    />
                                )
                                :
                                <Dashboard
                                    buildingId={this.props.match.params.id}
                                    dataView={"building"}
                                    loading={loading}
                                    updateFcis={updateFcis}
                                    basicDetails={basicDetails}
                                    efciBuildingData={efciBuildingData}
                                    efciSiteData={this.props.efciSiteData}
                                    updateFundingOption={updateFundingOption}
                                    updateFcisSite={this.props.updateFcisSite}
                                    updateFundingPercentage={updateFundingPercentage}
                                    updateFundingOptionEfci={updateFundingOptionEfci}
                                    hiddenFundingOptionList={hiddenFundingOptionList}
                                    updateTotalProjectFunding={updateTotalProjectFunding}
                                    updateHiddenFundingOption={updateHiddenFundingOption}
                                    updateFundingOption1={this.props.updateFundingOption1}
                                    updateAnnualFundingOptions={updateAnnualFundingOptions}
                                    updateProjectAnnualFunding={updateProjectAnnualFunding}
                                    hideFundingOptionSite={this.props.hideFundingOptionSite}
                                    updateFundingEfciData={this.props.updateFundingEfciData}
                                    updateAnnualEfciCalculation={updateAnnualEfciCalculation}
                                    updateBuildingEfciLock={this.props.updateBuildingEfciLock}
                                    updateCapitalSpendingPercent={updateCapitalSpendingPercent}
                                    hideFundingOptionSiteList={this.props.hideFundingOptionSiteList}
                                    updateSiteFundingOptionSite={this.props.updateSiteFundingOptionSite}
                                    updateEfciInInitialFundingOptions={updateEfciInInitialFundingOptions}
                                    updateTotalProjectFundingSite={this.props.updateTotalProjectFundingSite}
                                    updateAnnualFundingOptionSite={this.props.updateAnnualFundingOptionSite}
                                    updateProjectAnnualFundingSite={this.props.updateProjectAnnualFundingSite}
                                    updateAnnualFundingOptionCalculation={updateAnnualFundingOptionCalculation}
                                    updateAnnualEfciCalculationSite={this.props.updateAnnualEfciCalculationSite}
                                    updateEfciInInitialFundingOptionsSite={this.props.updateEfciInInitialFundingOptionsSite}
                                    updateAnnualFundingOptionCalculationSite={this.props.updateAnnualFundingOptionCalculationSite}
                                    logCount={this.props.logCount}
                                    getAnnualEFCILogs={this.props.getAnnualEFCILogs}
                                    logPaginationParams={this.props.logPaginationParams}
                                    handlePageClickLogs={this.props.handlePageClickLogs}
                                    handlePerPageChangeLogs={this.props.handlePerPageChangeLogs} />}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
// export default EfciInfo;
const mapStateToProps = state => {
    const { regionReducer, siteReducer, buildingReducer } = state;
    return { regionReducer, siteReducer, buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions, ...siteActions, ...buildingActions })(EfciInfo));