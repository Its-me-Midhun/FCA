import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import regionActions from "../actions";
import siteActions from "../../site/actions";
import buildingActions from "../../building/actions";
import BuildingDetails from "./BuildingDetails";
import InfoImages from "../../common/components/InfoImages1";
import InfoMap from "../../common/components/InfoMap";
import InfoTabs from "../../common/components/InfoTabs";
import Loader from "../../common/components/Loader";
import Floor from "../../floor/index";
import EFCI from "./EFCI";
import Recommendations from "../../recommendations/index";
import Dashboard from "../../site/components/Dashboard";
import EditHistory from "../../region/components/EditHistory";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { checkPermission } from "../../../config/utils";
import HelperIcon from "../../helper/components/HelperIcon";
import BuildingAddition from "../../buildingAddition";
import BuildingReports from "./BuildingReports";

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
        lockloading1: false, // lock delay fix
        lockloading: false, // lock delay fix
        breadCrumbsData: [{ key: "main", name: "Sites", path: "/site" }],
        isloading: true,
        efciSiteData: {},
        basicDetails: {
            code: "",
            name: "",
            building_type: "",
            client: {},
            region: {},
            site: {},
            consultancy: {},
            fca: "",
            users: [],
            area: "",
            cost: "",
            enterprise_index: "",
            ownership: "",
            ownership_type: "",
            use: "",
            division: "",
            manager: "",
            year: "",
            ministry: "",
            hospital_name: "",
            number: "",
            street: "",
            city: "",
            state: "",
            zip_code: "",
            country: "",
            description: "",
            comments: "",
            created_at: "",
            updated_at: "",
            projects: [],
            client_users: [],
            color_code: "",
            sort_order: "",
            locked: false,
            crv: "",
            major_renovation_year: "",
            secondary_use: "",
            sector: "",
            internal_group: "",
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
        isHistory: false,
        logChanges: {},
        associated_changes: []
    };

    componentDidMount = async () => {
        this.props.showInfoPage(this.props.match.params.id);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (
            this.props.location.search !== prevProps.location.search ||
            this.props.match.params.id !== prevProps.match.params.id ||
            (prevProps.match.params.tab !== this.props.match.params.tab && this.props.match.params.tab === "basicdetails")
        ) {
            this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
        if (prevProps.refreshData !== this.props.refreshData) {
            this.setState({ lockloading1: true }); //lock delay fix
            this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        await this.props.getDataById(this.props.match.params.id);
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
                    consultancy,
                    cost,
                    enterprise_index,
                    ownership,
                    ownership_type,
                    use,
                    division,
                    manager,
                    year,
                    ministry,
                    hospital_name,
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
                    projects,
                    client_users,
                    color_code,
                    sort_order,
                    crv,
                    major_renovation_year,
                    secondary_use,
                    sector,
                    internal_group,
                    lock_status
                }
            }
        } = this.props;
        if (success) {
            await this.setState(
                {
                    basicDetails: {
                        code,
                        name,
                        building_type,
                        client,
                        region,
                        site,
                        fca,
                        users,
                        consultancy,
                        area,
                        cost,
                        enterprise_index,
                        ownership,
                        ownership_type,
                        use,
                        division,
                        manager,
                        year,
                        ministry,
                        hospital_name,
                        number,
                        street,
                        city,
                        state,
                        locked: lock_status === LOCK_STATUS.LOCKED,
                        partial_locked: lock_status === LOCK_STATUS.PARTIALLY_LOCKED,
                        zip_code,
                        country,
                        description,
                        comments,
                        projects,
                        client_users,
                        created_at,
                        updated_at,
                        color_code,
                        sort_order,
                        crv,
                        major_renovation_year,
                        secondary_use,
                        sector,
                        internal_group,
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
                        { key: "main", name: "Buildings", path: "/building" },
                        {
                            key: "info",
                            name: name,
                            path: `/building/buildinginfo/${this.props.match.params.id}/basicdetails`
                        }
                    ],
                    isloading: false,
                    isHistory: false
                },
                () => this.setState({ lockloading1: false })
            ); //lock delay fix
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
        await this.props.updateBuildingImageComment(imageData);
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
        const { showConfirmModalLog, logChanges, associated_changes } = this.state;
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
        await this.props.HandleRestoreBuildingLog(selectedLog);
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
    // ----------lock delay fix-----
    updatelockloading = value => {
        this.setState({
            lockloading: value
        });
    };
    // ---------------------

    lockBuilding = lock => {
        const building_id = this.props.match.params.id;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const project_id = query.pid;
        this.setState({
            basicDetails: {
                ...this.state.basicDetails,
                locked: lock,
                partial_locked: false
            }
        });
        this.props.updateBuildingLock(building_id, { building_id, project_id, lock });
    };
    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return <Loader />;
        }

        const {
            infoTabsData,
            keys,
            config,
            match: {
                params: { tab, settingType }
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
            loading,
            getAllBuildLogs,
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

        const { basicDetails, locationDetails, imageList, selectedImage, isHistory } = this.state;
        const query = qs.parse(search);
        let spReportEntityData = { project_id: query.pid, building_id: this.props.match.params.id };
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng lockset">
                        {!settingType && (
                            <InfoTabs
                                infoTabsData={infoTabsData}
                                // basicDetails={basicDetails}
                                efciBuildingData={efciBuildingData}
                                isTabClass={true}
                                lockloading={this.state.lockloading} // lock delay fix
                                lockloading1={this.state.lockloading1} // lock delay fix
                            />
                        )}
                        {tab === "basicdetails" ? (
                            <HelperIcon isHistory={isHistory} entity={isHistory ? "general" : entity} additionalSpanClass={"help-top"} />
                        ) : null}
                        {isHistory && tab === "basicdetails" ? (
                            <EditHistory
                                handleDeleteItem={handleDeleteItem}
                                getAllRegionLogs={getAllBuildLogs}
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
                            <BuildingDetails
                                keys={keys}
                                config={config}
                                basicDetails={basicDetails}
                                // isHistory && tab === "basicdetails" ? (<EditHistory
                                handleDeleteItem={handleDeleteItem}
                                getAllRegionLogs={getAllBuildLogs}
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
                                isHistoryView={true}
                                permissions={permissions}
                                logPermission={logPermission}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                                entity={entity}
                                hasLock={hasLock}
                                lockBuilding={this.lockBuilding}
                            />
                        ) : // :
                        //     tab === "basicdetails" ? (
                        //         <BuildingDetails
                        //             keys={keys} config={config}
                        //             basicDetails={basicDetails}
                        //             handleDeleteItem={handleDeleteItem}
                        //             isBuildingLocked={efciBuildingData.locked}
                        //             isHistoryView={true}
                        //             changeToHistory={this.changeToHistory}
                        //             isHistory={isHistory}
                        //         />
                        //     )
                        tab === "infoimages" ? (
                            <InfoImages
                                setSelectedImage={this.setSelectedImage}
                                selectedImage={selectedImage}
                                uploadImages={this.uploadImages}
                                imageList={imageList}
                                deleteImage={this.deleteImage}
                                updateImage={this.updateImage}
                                isBuildingLocked={efciBuildingData.locked}
                                permissions={permissions}
                                imageResponse={imageResponse}
                                getAllImageList={getAllImageList}
                                updateImageComment={this.props.updateBuildingImageComment}
                                deleteImages={this.props.deleteImages}
                                // uploadImages={this.props.uploadImages}
                                hasEdit={hasEdit}
                                hasCreate={hasCreate}
                            />
                        ) : tab === "infomap" ? (
                            <InfoMap
                                basicDetails={basicDetails}
                                locationDetails={locationDetails}
                                isBuildingLocked={efciBuildingData.locked}
                                handleUpdateLocation={this.handleUpdateLocation}
                                permissions={permissions}
                            />
                        ) : tab === "dashboard" || tab === "efcisandbox" ? (
                            <Dashboard
                                buildingId={this.props.match.params.id}
                                isEfciSandbox={tab === "efcisandbox"}
                                dataView={"building"}
                                loading={loading}
                                updateFcis={updateFcis}
                                basicDetails={basicDetails}
                                loadDataBuilding={this.props.loadData}
                                saveDataBuilding={this.props.saveData}
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
                                efciLog={this.props.efciLog}
                                getCSPLogs={this.props.getCSPLogs}
                                restoreCSP={this.props.restoreCSP}
                                getFundingCostLogs={this.props.getFundingCostLogs}
                                restoreFundingCostLog={this.props.restoreFundingCostLog}
                                getFundingCostEfciLogs={this.props.getFundingCostEfciLogs}
                                restoreFundingCostEfciLog={this.props.restoreFundingCostEfciLog}
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
                                getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
                                deleteEfciLogData={this.props.deleteEfciLogData}
                                sortBuildingEfciLog={this.props.sortBuildingEfciLog}
                                restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                                efciLoading={this.props.efciLoading}
                                colorCodes={this.props.colorCodes}
                                logCount={this.props.logCount}
                                logPaginationParams={this.props.logPaginationParams}
                                handlePageClickLogs={this.props.handlePageClickLogs}
                                handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                hasChartExport={checkPermission("charts_and_graph", "building", "export")}
                            />
                        ) : tab === "efci" ? (
                            <EFCI
                                updatelockloading={this.updatelockloading} //lock delay fix
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
                                efciLog={this.props.efciLog}
                                getCSPLogs={this.props.getCSPLogs}
                                restoreCSP={this.props.restoreCSP}
                                getFundingCostLogs={this.props.getFundingCostLogs}
                                restoreFundingCostLog={this.props.restoreFundingCostLog}
                                getFundingCostEfciLogs={this.props.getFundingCostEfciLogs}
                                restoreFundingCostEfciLog={this.props.restoreFundingCostEfciLog}
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
                                getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
                                deleteEfciLogData={this.props.deleteEfciLogData}
                                sortBuildingEfciLog={this.props.sortBuildingEfciLog}
                                efciLoading={this.props.efciLoading}
                                colorCodes={this.props.colorCodes}
                                logCount={this.props.logCount}
                                logPaginationParams={this.props.logPaginationParams}
                                handlePageClickLogs={this.props.handlePageClickLogs}
                                handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                            />
                        ) : tab === "buildingAddition" ? (
                            <div className="tab-active bg-grey-table">
                                <BuildingAddition basicDetails={basicDetails} />
                            </div>
                        ) : tab === "floors" ? (
                            <div className="tab-active bg-grey-table">
                                <Floor basicDetails={basicDetails} />
                            </div>
                        ) : tab === "reports" ? (
                            <div className="tab-active region-reports">
                                <BuildingReports spReportEntityData={spReportEntityData} />
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
                                <Assets basicDetails={basicDetails} buildingId={this.props.match.params.id} />
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
                                buildingId={this.props.match.params.id}
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
                                <Documents buildingId={this.props.match.params.id} basicDetails={basicDetails} />
                            </div>
                        ) : (
                            <div className="tab-active bg-grey-table">
                                <Recommendations
                                    basicDetails={basicDetails}
                                    projectId={query.pid}
                                    projectIdDashboard={query.pid}
                                    isBuildingLocked={efciBuildingData.locked}
                                    isBuildingEFCI={efciBuildingData}
                                />
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
    const { regionReducer, siteReducer, buildingReducer } = state;
    return { regionReducer, siteReducer, buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions, ...siteActions, ...buildingActions })(SiteInfo));
