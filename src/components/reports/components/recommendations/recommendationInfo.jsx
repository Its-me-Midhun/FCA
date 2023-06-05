import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import RecommendationMainDetails from "../../../recommendations/components/InfoPages/RecommendationMainDetails";
import RecommendationAdditionalDetails from "../../../common/components/RecommendationAdditionalDetails";
import InfoTabs from "../../../common/components/InfoTabs";
import InfoImages from "../../../common/components/InfoImages1";
// import InfoImages from "../../common/components/InfoImages";
import recommendationsActions from "../../../recommendations/actions";
import { connect } from "react-redux";
import { entities } from "../../../common/constants";
class RecommendationsInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            id: "",
            code: "",
            description: "",
            trade: "",
            system: "",
            sub_system: "",
            building: "",
            floor: "",
            department: "",
            hospital_name: "",
            category: "",
            room: "",
            asset_name: "",
            asset_tag: "",
            asset_notes: "",
            installed_year: "",
            notes: "",
            condition: "",
            priority: "",
            funding: "",
            deffered_maintenance: "",
            future_capital: "",
            inspection_date: "",
            project_total: "",
            surveyor: "",
            status: "",
            recommendation_type: "",
            image: "",
            capital_type: "",
            initiative: "",
            priority_elements: [
                { index: "1", element: "" },
                { index: "2", element: "" },
                { index: "3", element: "" },
                { index: "4", element: "" },
                { index: "5", element: "" },
                { index: "6", element: "" },
                { index: "7", element: "" },
                { index: "8", element: "" }
            ],
            priority_elements_data: [],
            maintenance_years: [],
            fmp: "",
            fmp_id: "",
            fmp_project: "",
            fmp_track: ""
        },
        imageList: [],
        selectedTab: "maindetails"
    };

    componentDidMount = async () => {
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let recommendationsData = await this.props.getDataById();
        // let imageList = await this.props.getAllImageList(this.props.match.params.id);
        // let imageResult = imageList.filter((img, i) => {
        //     if (img.default_image) {
        //         img.index = i;
        //         return img;
        //     }
        // })
        let priorityElementsData = await this.props.getAllPriorityElementDropDownData(recommendationsData.project?.id || "");
        if (recommendationsData && recommendationsData.success) {
            this.setState({
                basicDetails: {
                    id: recommendationsData.id,
                    code: recommendationsData.code,
                    description: recommendationsData.description,
                    trade: recommendationsData.trade,
                    system: recommendationsData.system,
                    sub_system: recommendationsData.sub_system,
                    client: recommendationsData.client,
                    consultancy: recommendationsData.consultancy,
                    region: recommendationsData.region,
                    site: recommendationsData.site,
                    project: recommendationsData.project,
                    building: recommendationsData.building,
                    floor: recommendationsData.floor,
                    hospital_name: recommendationsData.building.hospital_name,
                    department: recommendationsData.department,
                    category: recommendationsData.category,
                    room: recommendationsData.room,
                    asset_name: recommendationsData.asset_name,
                    asset_tag: recommendationsData.asset_tag,
                    asset_notes: recommendationsData.asset_notes,
                    installed_year: recommendationsData.installed_year,
                    notes: recommendationsData.notes,
                    condition: recommendationsData.condition,
                    priority: recommendationsData.priority,
                    funding: recommendationsData.funding,
                    deffered_maintenance: recommendationsData.deffered_maintenance,
                    future_capital: recommendationsData.future_capital,
                    inspection_date: recommendationsData.inspection_date,
                    inspection_time: recommendationsData.inspection_time,
                    project_total: recommendationsData.project_total,
                    surveyor: recommendationsData.surveyor,
                    status: recommendationsData.status,
                    initiative: recommendationsData.initiative,
                    capital_type: recommendationsData.capital_type,
                    priority_elements: recommendationsData.priority_elements,
                    priority_elements_data: [
                        ...priorityElementsData.priority_elements,
                        ...recommendationsData.priority_elements.slice(
                            priorityElementsData.priority_elements.length,
                            recommendationsData.priority_elements.length
                        )
                    ],
                    maintenance_years: recommendationsData.maintenance_years,
                    image: recommendationsData.image,
                    capacity: recommendationsData.capacity,
                    service_life: recommendationsData.service_life,
                    usefull_life_remaining: recommendationsData.usefull_life_remaining,
                    crv: recommendationsData.crv,
                    serial_number: recommendationsData.serial_number,
                    model_number: recommendationsData.model_number,
                    created_at: recommendationsData.created_at,
                    updated_at: recommendationsData.updated_at,
                    area_served: recommendationsData.area_served,
                    funding_source: recommendationsData.funding_source,
                    locked: recommendationsData.locked,
                    deleted: recommendationsData.deleted,
                    essential: recommendationsData.essential,
                    manufacturer: recommendationsData.manufacturer,
                    recommendation_type: recommendationsData.recommendation_type,
                    fmp: recommendationsData.fmp,
                    fmp_id: recommendationsData.fmp_id,
                    fmp_project: recommendationsData.fmp_project,
                    fmp_track: recommendationsData.fmp_track
                },
                // imageList,
                // selectedImage: { image: (imageResult[0] && imageResult[0]) || (imageList[0] && imageList[0]), index: imageResult.length ? imageResult[0].index : 0 },
                isloading: false
            });
        }
        return true;
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
        await this.props.updateRecommendationImageComment(imageData);
        await this.refreshinfoDetails();
    };
    setSelectedImage = async i => {
        const { imageList } = this.state;
        await this.setState({
            selectedImage: { image: imageList[i], index: i }
        });
    };

    handleTabClick = tab => {
        this.setState({ selectedTab: tab });
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    downloadPdfReport = async params => {
        this.setState({ isLoading: true });
        await this.props.downloadPdfReport(params);
        await this.props.addUserActivityLog({ text: "Downloaded pdf report." });
        this.setState({ isLoading: false });
        const { success, PDF_URL, Result, Error } = this.props.recommendationsReducer.pdfReportResponse || {};
        if (!success) {
            this.setState(
                {
                    alertMessage: "Narrative Report Not Found"
                },
                () => this.showAlert()
            );
            return false;
        }
        const link = document.createElement("a");
        link.href = PDF_URL;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    handleAssignToRecom = async imgData => {
        let res = await this.props.assignImagesToRecom(imgData);
        await this.refreshinfoDetails();
        return res;
    };

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return null;
        }

        const {
            infoTabsData,
            keys,
            config,
            match: {
                params: { tab }
            },
            getAllSettingsLogs,
            logData,
            handlePerPageChangeHistory,
            handlePageClickHistory,
            handleGlobalSearchHistory,
            showEditPage,
            globalSearchKeyHistory,
            handleDeleteLog,
            historyPaginationParams,
            handleRestoreLog,
            historyParams,
            updateSelectedRow,
            updateLogSortFilters,
            permissions,
            logPermission,
            imageResponse,
            getAllImageList,
            closeInfoPage
            // hasCreate,
            // hasEdit
        } = this.props;

        const { basicDetails, selectedTab } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng lockset">
                        {/* <InfoTabs infoTabsData={infoTabsData} /> */}
                        <ul className={this.props.isTabClass ? "tab-data" : null}>
                            <li
                                className={`cursor-pointer ${selectedTab === "maindetails" ? "active" : ""}`}
                                onClick={() => this.handleTabClick("maindetails")}
                            >
                                Main Details
                            </li>
                            {/* <li
                                className={`cursor-pointer ${selectedTab === "additionaldetails" ? "active" : ""}`}
                                onClick={() => this.handleTabClick("additionaldetails")}
                            >
                                Additional Details
                            </li> */}
                            <li
                                className={`cursor-pointer ${selectedTab === "images" ? "active" : ""}`}
                                onClick={() => this.handleTabClick("images")}
                            >
                                Images
                            </li>
                        </ul>
                        {selectedTab === "maindetails" ? (
                            <RecommendationMainDetails
                                keys={keys}
                                config={config}
                                showEditPage={showEditPage}
                                updateSelectedRow={updateSelectedRow}
                                basicDetails={basicDetails}
                                deleteRecommendation={this.props.showDeleteBox}
                                restoreRecommendation={this.props.showRestoreBox}
                                getAllSettingsLogs={getAllSettingsLogs}
                                handlePerPageChangeHistory={handlePerPageChangeHistory}
                                handlePageClickHistory={handlePageClickHistory}
                                handleGlobalSearchHistory={handleGlobalSearchHistory}
                                globalSearchKeyHistory={globalSearchKeyHistory}
                                logData={logData}
                                handleDeleteLog={handleDeleteLog}
                                historyPaginationParams={historyPaginationParams}
                                HandleRestoreSettingsLog={handleRestoreLog}
                                refreshinfoDetails={this.refreshinfoDetails}
                                historyParams={historyParams}
                                updateLogSortFilters={updateLogSortFilters}
                                permissions={permissions}
                                logPermission={logPermission}
                                isNarrativeRecommendation
                                closeInfoPage={closeInfoPage}
                                downloadPdfReport={this.downloadPdfReport}
                            />
                        ) : (
                            // ) : selectedTab === "additionaldetails" ? (
                            //     <RecommendationAdditionalDetails
                            //         keys={keys}
                            //         config={config}
                            //         basicDetails={basicDetails}
                            //         deleteRecommendation={this.props.showDeleteBox}
                            //         restoreRecommendation={this.props.showRestoreBox}
                            //         getAllSettingsLogs={getAllSettingsLogs}
                            //         handlePerPageChangeHistory={handlePerPageChangeHistory}
                            //         handlePageClickHistory={handlePageClickHistory}
                            //         handleGlobalSearchHistory={handleGlobalSearchHistory}
                            //         globalSearchKeyHistory={globalSearchKeyHistory}
                            //         logData={logData}
                            //         handleDeleteLog={handleDeleteLog}
                            //         historyPaginationParams={historyPaginationParams}
                            //         HandleRestoreSettingsLog={handleRestoreLog}
                            //         refreshinfoDetails={this.refreshinfoDetails}
                            //         historyParams={historyParams}
                            //         updateLogSortFilters={updateLogSortFilters}
                            //         permissions={permissions}
                            //         logPermission={logPermission}
                            //         isNarrativeRecommendation
                            //         closeInfoPage={closeInfoPage}
                            //         downloadPdfReport={this.downloadPdfReport}
                            //     />
                            <InfoImages
                                // imageResponse={imageResponse}
                                // getAllImageList={getAllImageList}
                                // isRecommendation
                                noCheckbox
                                closeInfoPage={closeInfoPage}
                                setSelectedImage={this.setSelectedImage}
                                selectedImage={this.state.selectedImage}
                                uploadImages={this.uploadImages}
                                imageList={this.state.imageList}
                                deleteImage={this.deleteImage}
                                updateImage={this.updateImage}
                                refreshinfoDetails={this.refreshinfoDetails}
                                locked={basicDetails.locked}
                                isBuildingLocked={this.props.isBuildingLocked}
                                isDeleted={basicDetails.deleted}
                                permissions={permissions}
                                imageResponse={imageResponse}
                                getAllImageList={getAllImageList}
                                updateImageComment={this.props.updateRecommendationImageComment}
                                deleteImages={this.props.deleteImages}
                                // hasCreate={true}
                                hasEdit={true}
                                hasPullFromMasterImages={true}
                                handleAssignImagesFromMaster={this.handleAssignToRecom}
                                entity={entities.NARRATIVES}
                                basicDetails={basicDetails}
                            />
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { recommendationsReducer } = state;
    return { recommendationsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...recommendationsActions
    })(RecommendationsInfo)
);
