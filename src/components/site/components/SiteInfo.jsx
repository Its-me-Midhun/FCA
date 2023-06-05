import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import regionActions from "../actions";
import siteActions from "../../site/actions";
import buildingActions from "../../building/actions";
// import BasicDetails from "../../common/components/BasicDetails";
import BasicDetails from "./basicDetails";
import InfoImages from "../../common/components/InfoImages1";
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
import EditHistory from "../../region/components/EditHistory";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { checkPermission } from "../../../config/utils";
import HelperIcon from "../../helper/components/HelperIcon";
import SiteReports from "./SiteReports";

import EnergyStarTab from "../../energyStar/index";
import ElectricityTab from "../../electricity/index";
import WaterTab from "../../water/index";
import GasTab from "../../gas/index";
import SewerTab from "../../sewer/index";
import Assets from "../../assets";
import AssetCharts from "../../assetManagement/components/charts/AssetCharts";
import ChartDashboard from "../../chartEnergyTemplate/components/dashboard";
import Documents from "../../documents/index";
import SoftCosts from "../../softCosts/SoftCosts";
import { LOCK_STATUS } from "../../common/constants";

class SiteInfo extends Component {
    state = {
        breadCrumbsData: [{ key: "main", name: "Sites", path: "/site" }],
        isloading: true,
        basicDetails: {
            client: {},
            consultancy: {},
            users: [],
            client_users: [],
            name: "",
            code: "",
            comments: "",
            created_at: "",
            updated_at: "",
            region: {},
            projects: "",
            image: "",
            city: "",
            country: "",
            state: "",
            street: "",
            zip_code: "",
            color_code: "",
            sort_order: "",
            locked: false,
            partial_locked: false,
            latitude: "",
            longitude: "",
            place: ""
        },
        locationDetails: {
            place: "",
            lat: "",
            long: "",
            street: "",
            city: "",
            state: "",
            country: "",
            zip_code: ""
        },
        imageList: [],
        efciTab: ["CSP Summary", "EFCI Funding EFCi Analysis", "Region: EFCI Funding Analysis"],
        isHistory: false,
        logChanges: {},
        associated_changes: []
    };

    componentDidMount = async () => {
        this.props.showInfoPage(this.props.match.params.id);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.location.search !== prevProps.location.search || this.props.match.params.id !== prevProps.match.params.id) {
            this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        await this.props.getDataById(this.props.match.params.id);
        // await this.props.getAllImageList(this.props.match.params.id);
        const {
            siteReducer: {
                getSiteByIdResponse: {
                    client,
                    users,
                    code,
                    comments,
                    consultancy,
                    name,
                    success,
                    place,
                    region,
                    client_users,
                    created_at,
                    updated_at,
                    latitude: lat,
                    longitude: long,
                    projects,
                    image,
                    city,
                    country,
                    state,
                    street,
                    zip_code,
                    color_code,
                    sort_order,
                    lock_status
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                basicDetails: {
                    client,
                    users,
                    name,
                    consultancy,
                    code,
                    comments,
                    client_users,
                    region,
                    created_at,
                    updated_at,
                    projects,
                    image,
                    city,
                    country,
                    state,
                    street,
                    zip_code,
                    color_code,
                    sort_order,
                    locked: lock_status === LOCK_STATUS.LOCKED,
                    partial_locked: lock_status === LOCK_STATUS.PARTIALLY_LOCKED,
                    latitude: lat,
                    longitude: long,
                    place
                },
                locationDetails: {
                    place,
                    lat,
                    long,
                    street,
                    city,
                    state,
                    country,
                    zip_code
                },
                breadCrumbsData: [
                    { key: "main", name: "Sites", path: "/site" },
                    {
                        key: "info",
                        name: name,
                        path: `/site/siteinfo/${this.props.match.params.id}/basicdetails`
                    }
                ],
                isloading: false,
                isHistory: false
            });
        }
        return true;
    };

    setSelectedImage = async i => {
        const { imageList } = this.state;
        await this.setState({
            selectedImage: { image: imageList[i], index: i }
        });
    };

    handleUpdateLocation = async locationDetails => {
        this.setState({
            isloading: true
        });
        await this.props.handleUpdateData(locationDetails, true);
        await this.refreshinfoDetails();
    };

    uploadImages = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.uploadImages(imageData);
        await this.refreshinfoDetails();
    };

    deleteImage = async imageId => {
        this.setState({
            isloading: true
        });
        await this.props.deleteImages(imageId);
        await this.refreshinfoDetails();
    };

    updateImage = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.updateSiteImageComment(imageData);
        await this.refreshinfoDetails();
    };

    changeToHistory = async () => {
        await this.setState({ isHistory: !this.state.isHistory });
    };
    handleRestoreLog = async (id, choice, changes, associated_changes) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            logChanges: changes,
            associated_changes: associated_changes
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, isRestoreOrDelete, logChanges, associated_changes } = this.state;
        if (!showConfirmModalLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={logChanges}
                        associatedchanges={associated_changes}
                        onNo={() => this.setState({ showConfirmModalLog: false })}
                        onYes={this.restoreLogOnConfirm}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalLog: false })}
            />
        );
    };

    restoreLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.HandleRestoreSiteLog(selectedLog);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null,
            isHistory: false
        });
        this.setState({
            isloading: true
        });
        await this.refreshinfoDetails();
    };

    lockSite = lock => {
        const siteId = this.props.match.params.id;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const projectId = query.pid;
        this.setState({
            basicDetails: {
                ...this.state.basicDetails,
                locked: lock,
                partial_locked: false
            }
        });
        this.props.lockSite(projectId, siteId, { lock });
    };

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return <Loader />;
        }

        const {
            infoTabsData,
            handleDeleteItem,
            keys,
            config,
            match: {
                params: { tab, settingType }
            },
            location: { search },
            getAllSitLogs,
            logData,
            handlePerPageChangeHistory,
            handlePageClickHistory,
            handleGlobalSearchHistory,
            globalSearchKeyHistory,
            handleDeleteLog,
            historyPaginationParams,
            historyParams,
            updateLogSortFilters,
            permissions,
            logPermission,
            imageResponse,
            getAllImageList,
            hasDelete,
            hasEdit,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasInfoPage,
            hasCreate,
            entity,
            hasHelp = true,
            hasLock
        } = this.props;
        const { basicDetails, locationDetails, imageList, selectedImage, isHistory, isloading } = this.state;
        const query = qs.parse(search);
        let spReportEntityData = { project_id: query.pid, site_id: this.props.match.params.id };
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12 ">
                    <div className="tab-dtl region-mng total-view-graph">
                        {!settingType && <InfoTabs infoTabsData={infoTabsData} />}
                        {tab === "basicdetails" ? (
                            <HelperIcon isHistory={isHistory} entity={isHistory ? "general" : entity} additionalSpanClass={"help-top"} />
                        ) : null}
                        {isHistory && tab === "basicdetails" ? (
                            <EditHistory
                                handleDeleteItem={handleDeleteItem}
                                getAllRegionLogs={getAllSitLogs}
                                changeToHistory={this.changeToHistory}
                                handlePerPageChangeHistory={handlePerPageChangeHistory}
                                handlePageClickHistory={handlePageClickHistory}
                                handleGlobalSearchHistory={handleGlobalSearchHistory}
                                globalSearchKeyHistory={globalSearchKeyHistory}
                                logData={logData}
                                handleDeleteLog={handleDeleteLog}
                                historyPaginationParams={historyPaginationParams}
                                handleRestoreLog={this.handleRestoreLog}
                                isHistory={isHistory}
                                historyParams={historyParams}
                                updateLogSortFilters={updateLogSortFilters}
                                logPermission={logPermission}
                                permissions={permissions}
                                hasLogDelete={hasLogDelete}
                                hasLogRestore={hasLogRestore}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasInfoPage={hasInfoPage}
                                entity={entity}
                            />
                        ) : tab === "basicdetails" ? (
                            <BasicDetails
                                keys={keys}
                                config={config}
                                basicDetails={basicDetails}
                                handleDeleteType={handleDeleteItem}
                                isHistoryView={true}
                                changeToHistory={this.changeToHistory}
                                isHistory={isHistory}
                                permissions={permissions}
                                logPermission={logPermission}
                                isloading={isloading}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                                entity={entity}
                                hasLock={hasLock}
                                lockSite={this.lockSite}
                            />
                        ) : tab === "infoimages" ? (
                            <InfoImages
                                setSelectedImage={this.setSelectedImage}
                                selectedImage={selectedImage}
                                uploadImages={this.uploadImages}
                                imageList={imageList}
                                deleteImage={this.deleteImage}
                                updateImage={this.updateImage}
                                refreshinfoDetails={this.refreshinfoDetails}
                                permissions={permissions}
                                imageResponse={imageResponse}
                                getAllImageList={getAllImageList}
                                updateImageComment={this.props.updateSiteImageComment}
                                deleteImages={this.props.deleteImages}
                                hasCreate={hasCreate}
                                hasEdit={hasEdit}
                            />
                        ) : tab === "infomap" ? (
                            <InfoMap
                                handleUpdateLocation={this.handleUpdateLocation}
                                locationDetails={locationDetails}
                                basicDetails={basicDetails}
                                permissions={permissions}
                            />
                        ) : tab === "futurecapital" ? (
                            <FutureCapital
                                tableData={this.props.futureCapitaldata}
                                profutureCapital={this.props.proFutureCapitaldata}
                                siteList={
                                    this.props.commonReducer &&
                                    this.props.commonReducer.getMenuItemsResponse &&
                                    this.props.commonReducer.getMenuItemsResponse.sites
                                }
                                siteId={this.props.match.params.id}
                            />
                        ) : tab === "deferredmaintenance" ? (
                            <DifferedMaintenance
                                differedMaintenance={this.props.differedMaintenance}
                                proDifferedMaintenance={this.props.proDifferedMaintenance}
                                siteList={
                                    this.props.commonReducer &&
                                    this.props.commonReducer.getMenuItemsResponse &&
                                    this.props.commonReducer.getMenuItemsResponse.sites
                                }
                                siteId={this.props.match.params.id}
                            />
                        ) : tab === "dashboard" || tab === "efcisandbox" ? (
                            <Dashboard
                                dataView={"site"}
                                isEfciSandbox={tab === "efcisandbox"}
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
                                updateFundingEfciData={this.props.updateFundingEfciData}
                                updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                getAnnualEfciColumnLogs={this.props.getAnnualEfciColumnLogs}
                                annualEfciLog={this.props.annualEfciLog}
                                annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                                getAnnualFundingCalculationColumnLogs={this.props.getAnnualFundingCalculationColumnLogs}
                                annualFundingOptionLogs={this.props.annualFundingOptionLogs}
                                restoreAnnualEfciCalculation={this.props.restoreAnnualEfciCalculation}
                                restoreAnnualFundingOption={this.props.restoreAnnualFundingOption}
                                getFundingOptionLogs={this.props.getFundingOptionLogs}
                                restoreFundingOptionLog={this.props.restoreFundingOptionLog}
                                getFundingEfciLog1={this.props.getFundingEfciLog1}
                                restoreFundingEFCILog={this.props.restoreFundingEFCILog}
                                getTotalFundingLogs={this.props.getTotalFundingLogs}
                                restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                                getCSPLogs={this.props.getCSPLogs}
                                restoreCSP={this.props.restoreCSP}
                                deleteEfciLogData={this.props.deleteEfciLogData}
                                getEfciBasedOnSite={this.props.getEfciBasedOnSite}
                                loadData={this.props.loadData}
                                saveData={this.props.saveData}
                                updateBuildingEfciLock={this.props.updateBuildingEfciLock}
                                updateSiteEfciLock={this.props.updateSiteEfciLock}
                                sortSiteEfciLog={this.props.sortSiteEfciLog}
                                efciByRegion={this.props.efciByRegion}
                                getColorCode={this.props.getColorCode}
                                colorCodes={this.props.colorCodes}
                                efciLoading={this.props.efciLoading}
                                showLog={this.props.showLog}
                                handleRegionEfciFundingCost={this.props.handleRegionEfciFundingCost}
                                updateRegionEfciFundingCost={this.props.updateRegionEfciFundingCost}
                                handleRegionFundingCostEfci={this.props.handleRegionFundingCostEfci}
                                updateRegionFundingEfci={this.props.updateRegionFundingEfci}
                                handleRegionAnnualFundingOption={this.props.handleRegionAnnualFundingOption}
                                updateRegionAnnualFunding={this.props.updateRegionAnnualFunding}
                                handleRegionAnnualEfci={this.props.handleRegionAnnualEfci}
                                updateRegionAnnualEFCI={this.props.updateRegionAnnualEFCI}
                                forceUpdateData={this.props.forceUpdateData}
                                tempArray={this.props.tempArray}
                                resetData={this.props.resetData}
                                saveDataForce={this.props.saveDataForce}
                                logCount={this.props.logCount}
                                logPaginationParams={this.props.logPaginationParams}
                                handlePageClickLogs={this.props.handlePageClickLogs}
                                handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                hasChartExport={checkPermission("charts_and_graph", "site", "export")}
                            />
                        ) : tab === "efci" ? (
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
                                updateFundingEfciData={this.props.updateFundingEfciData}
                                updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                                updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                getAnnualEfciColumnLogs={this.props.getAnnualEfciColumnLogs}
                                annualEfciLog={this.props.annualEfciLog}
                                annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                                getAnnualFundingCalculationColumnLogs={this.props.getAnnualFundingCalculationColumnLogs}
                                annualFundingOptionLogs={this.props.annualFundingOptionLogs}
                                restoreAnnualEfciCalculation={this.props.restoreAnnualEfciCalculation}
                                restoreAnnualFundingOption={this.props.restoreAnnualFundingOption}
                                getFundingOptionLogs={this.props.getFundingOptionLogs}
                                restoreFundingOptionLog={this.props.restoreFundingOptionLog}
                                getFundingEfciLog1={this.props.getFundingEfciLog1}
                                restoreFundingEFCILog={this.props.restoreFundingEFCILog}
                                getTotalFundingLogs={this.props.getTotalFundingLogs}
                                restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                                getCSPLogs={this.props.getCSPLogs}
                                restoreCSP={this.props.restoreCSP}
                                deleteEfciLogData={this.props.deleteEfciLogData}
                                sortSiteEfciLog={this.props.sortSiteEfciLog}
                                getColorCode={this.props.getColorCode}
                                colorCodes={this.props.colorCodes}
                                efciLoading={this.props.efciLoading}
                                efciByRegion={this.props.efciByRegion}
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
                                tempArray={this.props.tempArray}
                                resetData={this.props.resetData}
                                saveDataForce={this.props.saveDataForce}
                                isValueChanged={this.props.isValueChanged}
                                logCount={this.props.logCount}
                                logPaginationParams={this.props.logPaginationParams}
                                handlePageClickLogs={this.props.handlePageClickLogs}
                                handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                            />
                        ) : tab === "buildings" ? (
                            <div className="tab-active bg-grey-table">
                                <Buildings basicDetails={basicDetails} siteId={this.props.match.params.id} />{" "}
                            </div>
                        ) : tab === "reports" ? (
                            <div className="tab-active region-reports">
                                <SiteReports spReportEntityData={spReportEntityData} />
                            </div>
                        ) : tab === "Electricity" ? (
                            <>
                                <ElectricityTab />
                            </>
                        ) : tab === "Water" ? (
                            <>
                                <WaterTab />
                            </>
                        ) : tab === "Gas" ? (
                            <>
                                <GasTab />
                            </>
                        ) : tab === "Sewer" ? (
                            <>
                                <SewerTab />
                            </>
                        ) : tab === "energyStarRating" ? (
                            <>
                                <EnergyStarTab />
                            </>
                        ) : tab === "assets" ? (
                            <div className="tab-active bg-grey-table">
                                <Assets basicDetails={basicDetails} siteId={this.props.match.params.id} />{" "}
                            </div>
                        ) : tab === "assetcharts" && basicDetails.name ? (
                            <AssetCharts basicDetails={basicDetails} />
                        ) : tab === "energydashboard" && basicDetails.name ? (
                            <ChartDashboard
                                dataView={"project"}
                                basicDetails={basicDetails}
                                projectId={this.props.projectId}
                                loadData={this.props.loadData}
                                getEfciBasedOnProject={this.props.getEfciBasedOnProject}
                                saveData={this.props.saveData}
                                efciRegionData={this.props.efciData}
                                entityName={basicDetails.name}
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
                                saveDataForce={this.props.saveDataForce}
                                tempArray={this.props.tempArray}
                                resetData={this.props.resetData}
                                logCount={this.props.logCount}
                                logPaginationParams={this.props.logPaginationParams}
                                handlePageClickLogs={this.props.handlePageClickLogs}
                                handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                hasChartExport={checkPermission("charts_and_graph", "fca_projects", "export")}
                                siteId={this.props.match.params.id}
                            />
                        ) : tab === "energyStar" ? (
                            <iframe
                                src="https://portfoliomanager.energystar.gov/pm/login.html"
                                width="100%"
                                height="770"
                                allowfullscreen
                                sandbox
                            ></iframe>
                        ) : tab === "softCosts" ? (
                            <SoftCosts />
                        ) : tab === "documents" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Documents siteId={this.props.match.params.id} basicDetails={basicDetails} />
                            </div>
                        ) : (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Recommendations basicDetails={basicDetails} projectId={query.pid} projectIdDashboard={query.pid} />
                            </div>
                        )}
                        {this.renderConfirmationModalLog()}
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

export default withRouter(connect(mapStateToProps, { ...regionActions, ...siteActions, ...buildingActions })(SiteInfo));
