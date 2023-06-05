import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import InfoTabs from "../../common/components/InfoTabs";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import EditHistory from "../../region/components/EditHistory";
import InfoImages1 from "../../common/components/InfoImages1";
import AssetMainDetails from "./AssetMainDetails";
import Recommendations from "../../recommendations";
import { PrevNext } from "./PrevNext";
import { popBreadCrumpRecData } from "../../../config/utils";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
class TradeInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            id: "",
            code: "",
            asset_name: "",
            asset_tag: "",
            asset_note: "",
            client_asset_condition: "",
            description: "",
            installed_year: "",
            service_life: "",
            usefull_life_remaining: "",
            crv: "",
            manufacturer: "",
            year_manufactured: "",
            model_number: "",
            serial_number: "",
            capacity: "",
            capacity_unit: "",
            area_served: "",
            region: "",
            site: "",
            building: "",
            building_type: "",
            addition: "",
            floor: "",
            room_number: "",
            room_name: "",
            architectural_room_number: "",
            additional_room_description: "",
            uniformat_level_1: "",
            uniformat_level_2: "",
            uniformat_level_3: "",
            uniformat_level_4: "",
            uniformat_level_5: "",
            uniformat_level_6: "",
            uniformat_level_6_description: "",
            asset_type: "",
            asset_description: "",
            asset_barcode: "",
            asset_client_id: "",
            asset_cmms_id: "",
            warranty_start: new Date(),
            warranty_end: new Date(),
            install_date: new Date(),
            startup_date: new Date(),
            upstream_asset_barcode_number: "",
            linked_asset_barcode_number: "",
            source_panel_barcode_number: "",
            source_panel: "",
            status: "",
            notes: "",
            created_at: "",
            updated_at: "",
            guid: "",
            skysite_hyperlink: "",
            source_panel_name: "",
            main_category: "",
            sub_category_1: "",
            sub_category_2: "",
            subcategory2_description: "",
            sub_category_3: "",
            trade: "",
            system: "",
            sub_system: "",
            quantity: "",

            rtls_tag: "",
            latitude: "",
            longitude: "",
            current_age: "",
            age: "",
            new_asset: "",
            parent_global_id: "",
            survey_global_id: "",
            survey_id: "",
            survey_property_note: "",
            capacity_status: "",
            installed_year_status: "",
            name_plate_status: "",
            qa_notes: "",
            additional_qa_notes: "",
            surveyor: "",
            editor: "",
            survey_date_created: "",
            survey_date_edited: "",
            asset_condition_notes: ""
        },
        isHistory: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        associated_changes: [],
        imageList: []
    };

    componentDidMount = async () => {
        await this.showInfoPage(this.props.match.params.id);
    };

    // componentDidUpdate = async (prevProps, prevState) => {
    //     if (prevProps.match.params.id !== this.props.match.params.id) {
    //         await this.showInfoPage(this.props.match.params.id);
    //     }
    // };

    showInfoPage = async (id, data = null, isNextPrev = false) => {
        isNextPrev && popBreadCrumpRecData();
        this.setState({ isloading: true });
        await this.props.showInfoPage(id, null, data);
        await this.refreshinfoDetails();
    };

    refreshinfoDetails = async () => {
        let resData = await this.props.getDataById(this.props.match.params.id);
        if (resData && resData.success) {
            this.setState({
                basicDetails: {
                    id: resData.id,
                    code: resData.code,
                    asset_name: resData.asset_name,
                    asset_tag: resData.asset_tag,
                    asset_note: resData.asset_note,
                    client_asset_condition: resData.client_asset_condition,
                    description: resData?.client_asset_condition?.description,
                    installed_year: resData.installed_year,
                    service_life: resData.service_life,
                    usefull_life_remaining: resData.usefull_life_remaining,
                    crv: resData.crv,
                    manufacturer: resData.manufacturer,
                    model_number: resData.model_number,
                    serial_number: resData.serial_number,
                    capacity: resData.capacity,
                    capacity_unit: resData.capacity_unit,
                    area_served: resData.area_served,
                    client: resData.client,
                    region: resData.region,
                    site: resData.site,
                    building: resData.building,
                    building_type: resData.building_type,
                    addition: resData.addition,
                    floor: resData.floor,
                    room_number: resData.room_number,
                    room_name: resData.room_name,
                    architectural_room_number: resData.architectural_room_number,
                    additional_room_description: resData.additional_room_description,
                    uniformat_level_1: resData.uniformat_level_1,
                    uniformat_level_2: resData.uniformat_level_2,
                    uniformat_level_3: resData.uniformat_level_3,
                    uniformat_level_4: resData.uniformat_level_4,
                    uniformat_level_5: resData.uniformat_level_5,
                    uniformat_level_6: resData.uniformat_level_6,
                    uniformat_level_6_description: resData.uniformat_level_6_description,
                    asset_type: resData.asset_type,
                    asset_description: resData.asset_description,
                    asset_barcode: resData.asset_barcode,
                    asset_client_id: resData.asset_client_id,
                    asset_cmms_id: resData.asset_cmms_id,
                    warranty_start: resData.warranty_start,
                    warranty_end: resData.warranty_end,
                    install_date: resData.install_date,
                    startup_date: resData.startup_date,
                    upstream_asset_barcode_number: resData.upstream_asset_barcode_number,
                    linked_asset_barcode_number: resData.linked_asset_barcode_number,
                    source_panel_barcode_number: resData.source_panel_barcode_number,
                    source_panel: resData.source_panel,
                    asset_status: resData.asset_status,
                    notes: resData.notes,
                    created_at: resData.created_at,
                    updated_at: resData.updated_at,
                    image: resData.image,
                    location: resData.location,
                    criticality: resData.criticality,
                    year_manufactured: resData.year_manufactured,
                    guid: resData.guid,
                    skysite_hyperlink: resData.skysite_hyperlink,
                    source_panel_name: resData.source_panel_name,
                    main_category: resData.main_category,
                    sub_category_1: resData.sub_category_1,
                    sub_category_2: resData.sub_category_2,
                    sub_category_3: resData.sub_category_3,
                    subcategory2_description: resData?.sub_category_2?.subcategory2_description,
                    trade: resData.trade,
                    system: resData.system,
                    sub_system: resData.sub_system,
                    quantity: resData.quantity,
                    rtls_tag: resData?.rtls_tag,
                    latitude: resData?.latitude,
                    longitude: resData?.longitude,
                    current_age: resData?.current_age,
                    age: resData?.age,
                    new_asset: resData?.new_asset,
                    parent_global_id: resData?.parent_global_id,
                    survey_global_id: resData?.survey_global_id,
                    survey_id: resData?.survey_id,
                    survey_property_note: resData?.survey_property_note,
                    capacity_status: resData?.capacity_status,
                    installed_year_status: resData?.installed_year_status,
                    name_plate_status: resData?.name_plate_status,
                    qa_notes: resData?.qa_notes,
                    additional_qa_notes: resData?.additional_qa_notes,
                    surveyor: resData?.surveyor,
                    editor: resData?.editor,
                    survey_date_created: resData?.survey_date_created,
                    survey_date_edited: resData?.survey_date_edited
                },
                isloading: false,
                isHistory: false
            });
        }
        return true;
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
        await this.props.restoreLog(selectedLog);
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

    setSelectedImage = async i => {
        const { imageList } = this.state;
        await this.setState({
            selectedImage: { image: imageList[i], index: i }
        });
    };
    updateImage = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.updateAssetImages(imageData);
        await this.refreshinfoDetails();
    };

    deleteImage = async imageId => {
        this.setState({
            isloading: true
        });
        await this.props.deleteImages(imageId);
        await this.refreshinfoDetails();
    };
    uploadImages = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.uploadImages(imageData);
        await this.refreshinfoDetails();
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
            getAllDataLogs,
            logData,
            handlePerPageChangeHistory,
            handlePageClickHistory,
            handleGlobalSearchHistory,
            globalSearchKeyHistory,
            handleDeleteLog,
            historyPaginationParams,
            historyParams,
            updateLogSortFilters,
            hasDelete,
            hasEdit,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasInfoPage,
            entity,
            showEditPage,
            getAllImageList,
            imageResponse,
            tableData
        } = this.props;
        const { basicDetails, isHistory, selectedImage, imageList, isloading } = this.state;
        return (
            <React.Fragment>
                <LoadingOverlay active={isloading} spinner={<Loader />} fadeSpeed={10}>
                    <div className="dtl-sec col-md-12">
                        <div className="tab-dtl region-mng">
                            <InfoTabs infoTabsData={infoTabsData} />
                            {isHistory && tab === "basicdetails" ? (
                                <EditHistory
                                    handleDeleteItem={handleDeleteItem}
                                    getAllRegionLogs={getAllDataLogs}
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
                                    hasLogDelete={hasLogDelete}
                                    hasLogRestore={hasLogRestore}
                                    hasEdit={hasEdit}
                                    hasDelete={hasDelete}
                                    hasInfoPage={hasInfoPage}
                                    showEditPage={showEditPage}
                                    entity={entity}
                                />
                            ) : tab === "basicdetails" ? (
                                <AssetMainDetails
                                    keys={keys}
                                    config={config}
                                    basicDetails={basicDetails}
                                    handleDeleteItem={handleDeleteItem}
                                    isHistoryView={true}
                                    changeToHistory={this.changeToHistory}
                                    isHistory={isHistory}
                                    hasEdit={hasEdit}
                                    hasDelete={hasDelete}
                                    hasLogView={hasLogView}
                                    showEditPage={showEditPage}
                                    entity={entity}
                                />
                            ) : tab === "recommendations" ? (
                                <div className="tab-active pt-3 recomdn-table bg-grey-table">
                                    <Recommendations isAssetView />
                                </div>
                            ) : (
                                <InfoImages1
                                    setSelectedImage={this.setSelectedImage}
                                    selectedImage={selectedImage}
                                    uploadImages={this.uploadImages}
                                    imageList={imageList}
                                    deleteImage={this.deleteImage}
                                    updateImage={this.updateImage}
                                    refreshinfoDetails={this.refreshinfoDetails}
                                    imageResponse={imageResponse}
                                    getAllImageList={getAllImageList}
                                    updateImageComment={this.props.updateAssetImages}
                                    deleteImages={this.props.deleteImages}
                                    hasEdit={hasEdit}
                                />
                            )}
                            <PrevNext showInfoPage={this.showInfoPage} currentId={basicDetails.id} tableData={tableData} />
                            {this.renderConfirmationModalLog()}
                        </div>
                    </div>
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

export default withRouter(TradeInfo);
