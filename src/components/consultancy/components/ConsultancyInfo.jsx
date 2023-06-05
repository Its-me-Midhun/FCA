import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import regionActions from "../actions";
import siteActions from "../../site/actions";
import buildingActions from "../../building/actions";
import BasicDetails from "./basicDetailsSettings";
import Recommendations from "../../recommendations/index";
import InfoImages from "../../common/components/InfoImages";
import InfoMap from "../../common/components/InfoMap";
import InfoTabs from "../../common/components/InfoTabs";
import Sites from "../../site/index";
import EditHistory from "./EditHistory";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import Dashboard from "../../project/components/dashboard";
import EFCIMain from "../../common/components/CommonEFCI/EFCIMain";
import HelperIcon from "../../helper/components/HelperIcon";

class RegionInfo extends Component {
    state = {
        breadCrumbsData: [{ key: "main", name: "Consultancies", path: "/consultancy" }],
        isloading: true,
        basicDetails: {
            client: {},
            name: "",
            code: "",
            comments: "",
            created_at: "",
            updated_at: "",
            image: null
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
            consultancyReducer: {
                getConsultancyByIdResponse: { code, comments, name, success, created_at, updated_at, image }
            }
        } = this.props;
        if (success) {
            await this.setState({
                basicDetails: {
                    name,
                    code,
                    comments,
                    created_at,
                    updated_at,
                    image
                },
                breadCrumbsData: [
                    { key: "main", name: "Consultancies", path: "/consultancy" },
                    {
                        key: "info",
                        name: name,
                        path: `/consultancy/consultancyinfo/${this.props.match.params.id}/basicdetails`
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
                params: { tab }
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
            hasDelete,
            hasEdit,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasInfoPage,
            entity = null,
            hasHelp = true
        } = this.props;
        const { basicDetails, locationDetails, imageList, selectedImage, isHistory } = this.state;
        const query = qs.parse(search);
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <InfoTabs infoTabsData={infoTabsData} />
                        {tab === "basicdetails" ? <HelperIcon isHistory={isHistory} entity={isHistory ? "general" : entity} /> : null}
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
                            />
                        ) : tab === "infoimages" ? (
                            <InfoImages
                                setSelectedImage={this.setSelectedImage}
                                selectedImage={selectedImage}
                                uploadImages={this.uploadImages}
                                imageList={imageList}
                                deleteImage={this.deleteImage}
                                updateImage={this.updateImage}
                            />
                        ) : tab === "dashboard" ? (
                            <Dashboard
                                dataView={"region"}
                                regionId={this.props.regionId}
                                setSelectedImage={this.setSelectedImage}
                                selectedImage={selectedImage}
                                uploadImages={this.uploadImages}
                                imageList={imageList}
                                deleteImage={this.deleteImage}
                                updateImage={this.updateImage}
                                loadDataRegion={this.props.loadDataRegion}
                            />
                        ) : tab === "infomap" ? (
                            <InfoMap handleUpdateLocation={this.handleUpdateLocation} locationDetails={locationDetails} basicDetails={basicDetails} />
                        ) : tab === "sites" ? (
                            <div className="tab-active pt-3 recomdn-table bg-grey-table">
                                <Sites basicDetails={basicDetails} />
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
                            />
                        ) : (
                            <div className="tab-active pt-3 recomdn-table bg-grey-table">
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
    const { consultancyReducer, siteReducer, buildingReducer } = state;
    return { consultancyReducer, siteReducer, buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions, ...siteActions, ...buildingActions })(RegionInfo));
