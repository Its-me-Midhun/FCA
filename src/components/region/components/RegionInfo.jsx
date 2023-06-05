import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import regionActions from "../actions";
import siteActions from "../../site/actions";
import buildingActions from "../../building/actions";
import BasicDetails from "../../common/components/BasicDetails";
import Recommendations from "../../recommendations/index";
import InfoImages from "../../common/components/InfoImages1";
import InfoMap from "../../common/components/InfoMap";
import InfoTabs from "../../common/components/InfoTabs";
import Sites from "../../site/index";
import EditHistory from "./EditHistory";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import Dashboard from "../../project/components/dashboard";
import EFCIRegion from "./EFCIRegion";
import EFCIMain from "../../common/components/CommonEFCI/EFCIMain";
import Buildings from "../../building/index";
import { checkPermission } from "../../../config/utils";
import HelperIcon from "../../helper/components/HelperIcon";
import RegionReports from "./RegionReports";

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

class RegionInfo extends Component {
    state = {
        breadCrumbsData: [{ key: "main", name: "Regions", path: "/region" }],
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
            projects: "",
            color_code: "",
            locked: false,
            partial_locked: false
        },
        locationDetails: {
            place: "",
            lat: "",
            long: ""
        },
        imageList: [],
        isHistory: false,
        showConfirmModalLog: false,
        selectedLog: "",
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
            regionReducer: {
                getRegionByIdResponse: {
                    client,
                    consultancy,
                    users,
                    code,
                    comments,
                    name,
                    client_users,
                    success,
                    place,
                    created_at,
                    updated_at,
                    latitude: lat,
                    longitude: long,
                    projects,
                    color_code,
                    lock_status
                }
                // getAllImagesResponse: { images }
            }
        } = this.props;
        // let imageResult = images
        //     ? images.filter((img, i) => {
        //         if (img.default_image) {
        //             img.index = i;
        //             return img;
        //         }
        //     })
        //     : [];
        if (success) {
            await this.setState({
                basicDetails: {
                    client,
                    consultancy,
                    users,
                    name,
                    client_users,
                    code,
                    comments,
                    created_at,
                    updated_at,
                    projects,
                    color_code,
                    locked: lock_status === LOCK_STATUS.LOCKED,
                    partial_locked: lock_status === LOCK_STATUS.PARTIALLY_LOCKED
                },
                locationDetails: {
                    place,
                    lat,
                    long
                },
                // imageList: images,
                // selectedImage: {
                //     image: (imageResult && imageResult[0]) || (images && images[0]),
                //     index: imageResult && imageResult.length ? imageResult[0].index : 0
                // },
                breadCrumbsData: [
                    { key: "main", name: "Regions", path: "/region" },
                    {
                        key: "info",
                        name: name,
                        path: `/region/info/${this.props.match.params.id}/basicdetails`
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
        await this.props.updateRegionImageComment(imageData);
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
        await this.props.HandleRestoreRegionLog(selectedLog);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null,
            isHistory: false
        });
        this.setState({
            isloading: true
        });
        await this.refreshinfoDetails();
        // await this.getLogData(this.props.match.params.id)
        // await this.props.getMenuItems();
    };

    lockRegion = lock => {
        const regionId = this.props.match.params.id;
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
        this.props.lockRegion(projectId, regionId, { lock });
    };

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return null;
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
            getAllRegionLogs,
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
            getAllImageList,
            imageResponse,
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
        const { breadCrumbsData, basicDetails, locationDetails, imageList, selectedImage, isHistory } = this.state;
        const query = qs.parse(search);
        let spReportEntityData = { project_id: query.pid, region_id: this.props.regionId };
        return (
            <React.Fragment>
                <div className="dtl-sec system-building col-md-12">
                    <div className="tab-dtl region-mng">
                        {!settingType && <InfoTabs infoTabsData={infoTabsData} />}
                        {tab === "basicdetails" ? (
                            <HelperIcon isHistory={isHistory} entity={isHistory ? "general" : entity} additionalSpanClass={"help-top"} />
                        ) : null}
                        {isHistory && tab === "basicdetails" ? (
                            <EditHistory
                                handleDeleteItem={handleDeleteItem}
                                getAllRegionLogs={getAllRegionLogs}
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
                                handleDeleteItem={handleDeleteItem}
                                changeToHistory={this.changeToHistory}
                                isHistory={isHistory}
                                isHistoryView={true}
                                permissions={permissions}
                                logPermission={logPermission}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                                entity={entity}
                                hasLock={hasLock}
                                lockRegion={this.lockRegion}
                            />
                        ) : tab === "infoimages" ? (
                            <InfoImages
                                setSelectedImage={this.setSelectedImage}
                                selectedImage={selectedImage}
                                uploadImages={this.uploadImages}
                                imageList={imageList}
                                deleteImage={this.deleteImage}
                                updateImage={this.updateImage}
                                permissions={permissions}
                                getAllImageList={getAllImageList}
                                refreshinfoDetails={this.refreshinfoDetails}
                                updateImageComment={this.props.updateImageComment}
                                deleteImages={this.props.deleteImages}
                                imageResponse={imageResponse}
                                hasEdit={hasEdit}
                                hasCreate={hasCreate}
                            />
                        ) : tab === "dashboard" || tab === "efcisandbox" ? (
                            <Dashboard
                                dataView={"region"}
                                isEfciSandbox={tab === "efcisandbox"}
                                regionId={this.props.regionId}
                                setSelectedImage={this.setSelectedImage}
                                selectedImage={selectedImage}
                                uploadImages={this.uploadImages}
                                imageList={imageList}
                                deleteImage={this.deleteImage}
                                updateImage={this.updateImage}
                                loadDataRegion={this.props.loadDataRegion}
                                getEfciBasedOnRegion={this.props.getEfciBasedOnRegion}
                                saveData={this.props.saveData}
                                entity={"Region"}
                                mainEntity={"Project"}
                                entityName={basicDetails.name}
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
                                tempArray={this.props.tempArray}
                                resetData={this.props.resetData}
                                forceUpdateData={this.props.forceUpdateData}
                                saveDataForce={this.props.saveDataForce}
                                logCount={this.props.logCount}
                                logPaginationParams={this.props.logPaginationParams}
                                handlePageClickLogs={this.props.handlePageClickLogs}
                                handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                hasChartExport={checkPermission("charts_and_graph", "region", "export")}
                            />
                        ) : tab === "infomap" ? (
                            <InfoMap
                                handleUpdateLocation={this.handleUpdateLocation}
                                locationDetails={locationDetails}
                                basicDetails={basicDetails}
                                permissions={permissions}
                            />
                        ) : tab === "sites" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Sites basicDetails={basicDetails} regionId={this.props.regionId} />
                            </div>
                        ) : tab === "buildings" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Buildings basicDetails={basicDetails} regionId={this.props.regionId} />
                            </div>
                        ) : tab === "efci" ? (
                            <EFCIMain
                                entity={"Region"}
                                mainEntity={"Project"}
                                entityName={basicDetails.name}
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
                                tempArray={this.props.tempArray}
                                resetData={this.props.resetData}
                                forceUpdateData={this.props.forceUpdateData}
                                saveDataForce={this.props.saveDataForce}
                                isValueChanged={this.props.isValueChanged}
                                logCount={this.props.logCount}
                                logPaginationParams={this.props.logPaginationParams}
                                handlePageClickLogs={this.props.handlePageClickLogs}
                                handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                regionId={this.props.match.params.id}
                                updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                            />
                        ) : tab === "reports" ? (
                            <div className="tab-active region-reports">
                                <RegionReports spReportEntityData={spReportEntityData} />
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
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Assets basicDetails={basicDetails} regionId={this.props.regionId} />
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
                                regionId={this.props.regionId}
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
                                <Documents regionId={this.props.match.params.id} basicDetails={basicDetails} />
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
    const { regionReducer, siteReducer, buildingReducer } = state;
    return { regionReducer, siteReducer, buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions, ...siteActions, ...buildingActions })(RegionInfo));
