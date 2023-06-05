import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import RecommendationMainDetails from "./InfoPages/RecommendationMainDetails";
import InfoTabs from "../../common/components/InfoTabs";
import InfoImages from "../../common/components/InfoImages1";
import { LOCK_STATUS, entities } from "../../common/constants";
import RecommendationAssetDetails from "../../common/components/RecommendationAssetDetails";
import { addToBreadCrumpData, popBreadCrumpRecData } from "../../../config/utils";
import ReactTooltip from "react-tooltip";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import Documents from "../../documents/index";

class RecommendationsInfo extends Component {
    state = {
        loading: true,
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
            addition: "",
            department: "",
            hospital_name: "",
            category: "",
            room: "",
            asset_name: "",
            asset_tag: "",
            asset_notes: "",
            installed_year: "",
            notes: "",
            note_html: "",
            condition: "",
            priority: "",
            funding: "",
            deffered_maintenance: "",
            future_capital: "",
            inspection_date: "",
            project_total: "",
            surveyor: "",
            status: "",
            image: "",
            capital_type_display_name: "",
            capital_type: "",
            initiative: "",
            budget_priority: "",
            infrastructure_request: "",
            serial_number: "",
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
            asset: {},
            recommendation_type: "",
            fmp: "",
            fmp_id: "",
            fmp_project: "",
            fmp_track: "",
            red_line: "",
            criticality: "",
            source: "",
            energy_band: {},
            water_band: {},
            energy_band_show: "no",
            water_band_show: "no",
            locked: false
        },
        imageList: [],
        infoTabsData: [
            {
                key: "maindetails",
                name: "Main Details",
                path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/maindetails`
            },
            {
                key: "infoimages",
                name: "Images",
                path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/infoimages`
            },
            {
                key: "documents",
                name: "Documents",
                path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/documents`
            }
        ]
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

    setTabs = () => {
        if (this.state.basicDetails.recommendation_type === "asset") {
            this.setState({
                infoTabsData: [
                    {
                        key: "maindetails",
                        name: "Recommendation",
                        path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/maindetails`
                    },
                    {
                        key: "assetdetails",
                        name: "Asset Details",
                        path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/assetdetails`
                    },
                    {
                        key: "infoimages",
                        name: "Images",
                        path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/infoimages`
                    },
                    {
                        key: "documents",
                        name: "Documents",
                        path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/documents`
                    }
                ]
            });
        } else {
            this.setState({
                infoTabsData: [
                    {
                        key: "maindetails",
                        name: "Recommendation",
                        path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/maindetails`
                    },
                    {
                        key: "infoimages",
                        name: "Images",
                        path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/infoimages`
                    },
                    {
                        key: "documents",
                        name: "Documents",
                        path: `/recommendations/recommendationsinfo/${this.props.match.params.id}/documents`
                    }
                ]
            });
        }
    };

    refreshinfoDetails = async () => {
        this.setState({
            loading: true
        });
        let recommendationsData = await this.props.getDataById(this.props.match.params.id);
        let priorityElementsData = await this.props.getPriorityElementDropDownData(recommendationsData.project?.id || "");

        if (recommendationsData && recommendationsData.success) {
            this.setState(
                {
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
                        addition: recommendationsData.addition,
                        hospital_name: recommendationsData.building.hospital_name,
                        department: recommendationsData.department,
                        category: recommendationsData.category,
                        room: recommendationsData.room,
                        asset_name: recommendationsData.asset_name,
                        asset_tag: recommendationsData.asset_tag,
                        asset_notes: recommendationsData.asset_notes,
                        installed_year: recommendationsData.installed_year,
                        notes: recommendationsData.notes,
                        note_html: recommendationsData.note_html || recommendationsData.notes?.replace(/\n/g, "<br />"),
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
                        capital_type_display_name: recommendationsData.capital_type_display_name,
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
                        locked: recommendationsData.lock_status === LOCK_STATUS.LOCKED,
                        deleted: recommendationsData.deleted,
                        essential: recommendationsData.essential,
                        manufacturer: recommendationsData.manufacturer,
                        quantity: recommendationsData.quantity,
                        unit: recommendationsData.unit,
                        cost_per_unit: recommendationsData.cost_per_unit,
                        options_cost: recommendationsData.options_cost,
                        budget_priority: recommendationsData.budget_priority,
                        asset: recommendationsData.asset,
                        recommendation_type: recommendationsData.recommendation_type || "building",
                        fmp: recommendationsData.fmp,
                        fmp_id: recommendationsData.fmp_id,
                        fmp_project: recommendationsData.fmp_project,
                        fmp_track: recommendationsData.fmp_track,
                        infrastructure_request: recommendationsData.infrastructure_request,
                        red_line: recommendationsData.red_line,
                        criticality: recommendationsData.criticality || "-",
                        source: recommendationsData.source || "-",
                        energy_band: recommendationsData.energy_band,
                        water_band: recommendationsData.water_band,
                        energy_band_show: recommendationsData.energy_band_show,
                        water_band_show: recommendationsData.water_band_show
                    },
                    isloading: false
                },
                () => this.setTabs()
            );
        }
        this.setState({
            loading: false
        });
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

    handleAssignToRecom = async imgData => {
        let res = await this.props.assignImagesToRecom(imgData);
        await this.refreshinfoDetails();
        return res;
    };
    updateBudgetPriority = async (params, id) => {
        this.props.updateBudget(params, id);
        this.setState({ basicDetails: { ...this.state.basicDetails, budget_priority: params.budget_priority } });
    };
    updateFMP = (params, id) => {
        this.props.updateFMP(params, id);
        this.setState({ basicDetails: { ...this.state.basicDetails, fmp: params.fmp } });
    };
    updateIR = (params, id) => {
        this.props.updateIR(params, id);
        this.setState({ basicDetails: { ...this.state.basicDetails, infrastructure_request: params.infrastructure_request } });
    };
    updateRL = (params, id) => {
        this.props.updateRL(params, id);
        this.setState({ basicDetails: { ...this.state.basicDetails, red_line: params.red_line } });
    };
    handleNext = id => {
        const {
            location: { search = "" }
        } = this.props;
        let current_index = this.props.tableData?.findIndex(item => item.id === id);
        popBreadCrumpRecData();
        addToBreadCrumpData({
            key: "Name",
            name: this.props.tableData[current_index + 1].code,
            path: `/recommendations/recommendationsinfo/${this.props.tableData[current_index + 1].id}/maindetails${search}`
        });
        addToBreadCrumpData({
            key: "info",
            name: "Main Details",
            path: `/recommendations/recommendationsinfo/${this.props.tableData[current_index + 1].id}/maindetails${search}`
        });
        this.props.history.push(`/recommendations/recommendationsinfo/${this.props.tableData[current_index + 1].id}/${this.props.match.params.tab}`);
        this.props.updateSelectedRow(this.props.tableData[current_index + 1].id);
    };
    handlePrev = id => {
        const {
            location: { search = "" }
        } = this.props;
        let current_index = this.props.tableData?.findIndex(item => item.id === id);
        popBreadCrumpRecData();
        addToBreadCrumpData({
            key: "Name",
            name: this.props.tableData[current_index - 1].code,
            path: `/recommendations/recommendationsinfo/${this.props.tableData[current_index - 1].id}/maindetails${search}`
        });
        addToBreadCrumpData({
            key: "info",
            name: "Main Details",
            path: `/recommendations/recommendationsinfo/${this.props.tableData[current_index - 1].id}/maindetails${search}`
        });
        this.props.history.push(`/recommendations/recommendationsinfo/${this.props.tableData[current_index - 1].id}/${this.props.match.params.tab}`);
        this.props.updateSelectedRow(this.props.tableData[current_index - 1].id);
    };

    lockRecommendation = () => {
        const { basicDetails } = this.state;
        this.setState({
            basicDetails: { ...basicDetails, locked: !basicDetails.locked }
        });
        this.props.lockRecommendation(!basicDetails.locked);
    };

    addClick = (basicDetails, type = "Regular") => {
        if (this.props.match.params.id && basicDetails?.project?.id) {
            if (type !== "Regular") {
                sessionStorage.setItem("currentRecommendationData", JSON.stringify(basicDetails));
            }
            addToBreadCrumpData({
                key: "add",
                name: `Add Recommendation`,
                path: `/recommendations/add?p_id=${basicDetails.project.id}&c_id=${basicDetails.client.id}&type=${type}`
            });
            this.props.history.push(`/recommendations/add?p_id=${basicDetails.project.id}&c_id=${basicDetails.client.id}&type=${type}`);
        }
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) {
            return null;
        }

        const {
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
            globalSearchKeyHistory,
            handleDeleteLog,
            historyPaginationParams,
            handleRestoreLog,
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
            downloadPdfReport,
            entity,
            postExport
        } = this.props;

        const { basicDetails, infoTabsData } = this.state;

        return (
            <LoadingOverlay active={this.state.loading} spinner={<Loader />} fadeSpeed={10}>
                <React.Fragment>
                    <div className="dtl-sec col-md-12">
                        <div className="tab-dtl region-mng lockset">
                            <InfoTabs
                                infoTabsData={infoTabsData}
                                basicDetails={basicDetails}
                                lockItem={this.lockRecommendation}
                                createNewData={this.addClick}
                                hasCreate={hasCreate}
                                isRecommendation
                            />
                            {tab === "maindetails" ? (
                                <RecommendationMainDetails
                                    keys={keys}
                                    config={config}
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
                                    hasDelete={hasDelete}
                                    hasEdit={hasEdit}
                                    hasLogView={hasLogView}
                                    hasLogDelete={hasLogDelete}
                                    hasLogRestore={hasLogRestore}
                                    hasInfoPage={hasInfoPage}
                                    downloadPdfReport={downloadPdfReport}
                                    entity={entity}
                                    updateBudget={this.updateBudgetPriority}
                                    updateFMP={this.updateFMP}
                                    updateIR={this.updateIR}
                                    updateRL={this.updateRL}
                                    postExport={postExport}
                                    exportLoader={this.props.exportLoader}
                                    updateImageComment={this.props.updateRecommendationImageComment}
                                />
                            ) : tab === "assetdetails" ? (
                                <RecommendationAssetDetails
                                    keys={keys}
                                    config={config}
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
                                    hasDelete={hasDelete}
                                    hasEdit={hasEdit}
                                    hasLogView={hasLogView}
                                    hasLogDelete={hasLogDelete}
                                    hasLogRestore={hasLogRestore}
                                    hasInfoPage={hasInfoPage}
                                    downloadPdfReport={downloadPdfReport}
                                    entity={entity}
                                    updateBudget={this.updateBudgetPriority}
                                    updateFMP={this.updateFMP}
                                    updateIR={this.updateIR}
                                    updateRL={this.updateRL}
                                />
                            ) : tab === "documents" ? (
                                <div className="tab-active recomdn-table bg-grey-table">
                                    <Documents recommendationId={this.props.match.params.id} basicDetails={basicDetails} />
                                </div>
                            ) : (
                                <InfoImages
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
                                    hasCreate={hasCreate}
                                    hasEdit={hasEdit}
                                    hasPullFromMasterImages={true}
                                    handleAssignImagesFromMaster={this.handleAssignToRecom}
                                    entity={entities.RECOMMENDATIONS}
                                    basicDetails={basicDetails}
                                    hasDelete={hasDelete}
                                />
                            )}
                            <div className="button-slide-outer">
                                <button
                                    className={`prev-btn ${
                                        !this.props.tableData?.length ||
                                        (this.props.tableData && this.state.basicDetails?.id === this.props.tableData[0]?.id)
                                            ? "cursor-diabled"
                                            : ""
                                    }`}
                                    disabled={
                                        !this.props.tableData?.length ||
                                        (this.props.tableData && this.state.basicDetails?.id === this.props.tableData[0]?.id)
                                    }
                                    onClick={() => this.handlePrev(basicDetails.id)}
                                    data-place="top"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                    data-tip="Previous"
                                    data-for="prv-nxt"
                                >
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button
                                    className={`next-btn ${
                                        !this.props.tableData?.length ||
                                        (this.props.tableData &&
                                            this.state.basicDetails?.id === this.props.tableData[this.props.tableData?.length - 1]?.id)
                                            ? "cursor-diabled"
                                            : ""
                                    }`}
                                    disabled={
                                        !this.props.tableData?.length ||
                                        (this.props.tableData &&
                                            this.state.basicDetails?.id === this.props.tableData[this.props.tableData?.length - 1]?.id)
                                    }
                                    onClick={() => this.handleNext(basicDetails.id)}
                                    data-place="top"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                    data-tip="Next"
                                    data-for="prv-nxt"
                                >
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                                <ReactTooltip id="prv-nxt" />
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            </LoadingOverlay>
        );
    }
}

export default withRouter(RecommendationsInfo);
