import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import BasicDetails from "./basicDetailsSettings";
import InfoTabs from "../../common/components/InfoTabs";
import Recommendations from "../../recommendations/index";
import Portal from "../../common/components/Portal";
import Form from "./Form";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import EditHistory from "../../region/components/EditHistory";
import Buildings from "../../building/index";
import Projects from "../../project/index";
import HelperIcon from "../../helper/components/HelperIcon";
import UserSettings from "./UserSettings";
import project from "../../project/index";

class ProjectInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            code: "",
            client: {},
            name: "",
            email: "",
            role: "",
            consultancy: "",
            last_seen_at: "",
            description: "",
            first_name: "",
            last_name: "",
            title: "",
            work_phone: "",
            cell_phone: "",
            room_number: "",
            room_name: "",
            emergency_contact_no: "",
            emergency_contact_name: "",
            notes: "",
            address: "",
            printed_name: "",
            created_at: "",
            updated_at: "",
            projects: [],
            buildings: [],
            group: "",
            department: "",
            credentials: "",
            city: "",
            last_sign_in_at: "",
            last_sign_out_at: "",
            location: "",
            state: "",
            zip_code: "",
            image: "",
            building_name: "",
            floor: "",
            default_project: "",
            landing_page_lock: false,
            assetmanagement_client: "",
            energymanagement_client: "",
            infrastructure_request: "",
            fmp: ""
        },
        selectedBuildingType: this.props.match.params.id,
        isHistory: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {}
    };

    componentDidMount = async () => {
        this.props.showInfoPage(this.props.match.params.id);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let projectData = await this.props.getDataById(this.props.match.params.id);
        if (projectData && projectData.success) {
            this.setState({
                basicDetails: {
                    code: projectData.code,
                    client: projectData.client,
                    name: projectData.name,
                    description: projectData.description,
                    last_seen_at: projectData.last_seen_at,
                    email: projectData.email,
                    role: projectData.role,
                    created_at: projectData.created_at,
                    updated_at: projectData.updated_at,
                    first_name: projectData.first_name,
                    last_name: projectData.last_name,
                    title: projectData.title,
                    work_phone: projectData.work_phone,
                    cell_phone: projectData.cell_phone,
                    room_number: projectData.room_number,
                    room_name: projectData.room_name,
                    emergency_contact_no: projectData.emergency_contact_no,
                    emergency_contact_name: projectData.emergency_contact_name,
                    notes: projectData.notes,
                    address: projectData.address,
                    printed_name: projectData.printed_name,
                    projects: projectData.projects,
                    buildings: projectData.buildings,
                    group: projectData.group,
                    department: projectData.department,
                    credentials: projectData.credentials,
                    city: projectData.city,
                    last_sign_in_at: projectData.last_sign_in_at,
                    last_sign_out_at: projectData.last_sign_out_at,
                    location: projectData.location,
                    state: projectData.state,
                    zip_code: projectData.zip_code,
                    image: projectData.image,
                    building_name: projectData.building_name,
                    floor: projectData.floor,
                    consultancy: projectData.consultancy,
                    default_project: projectData.default_project,
                    landing_page_lock: projectData.landing_page_lock,
                    master_trade_id: projectData.master_trade.id,
                    assetmanagement_client: projectData.assetmanagement_client_id,
                    energymanagement_client: projectData.energymanagement_client_id,
                    infrastructure_request: projectData.infrastructure_request,
                    fmp: projectData.fmp
                },
                isloading: false,
                isHistory: false
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

    showEditPage = async buildingTypeId => {
        await this.setState({
            selectedBuildingType: buildingTypeId
        });
        this.toggleShowFormModal();
    };
    toggleShowFormModal = () => {
        this.setState({
            showFormModal: !this.state.showFormModal
        });
    };

    renderFormModal = () => {
        const { showFormModal } = this.state;
        if (!showFormModal) return null;
        return (
            <Portal
                body={
                    <Form
                        onCancel={this.toggleShowFormModal}
                        selectedBuildingType={this.state.selectedBuildingType}
                        handleUpdateClient={this.updateDataItem}
                        getDataById={this.props.getDataById}
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
    };
    updateDataItem = async id => {
        await this.props.updateData(id, "info");
        this.toggleShowFormModal();
        this.refreshinfoDetails();
    };

    changeToHistory = async () => {
        await this.setState({ isHistory: !this.state.isHistory });
    };
    handleRestoreLog = async (id, choice, changes) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            logChanges: changes
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, logChanges } = this.state;
        if (!showConfirmModalLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={logChanges}
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
        await this.props.HandleRestoreBuildingTypeLog(selectedLog);
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

    handleChangeBasicDetails = (name, value) => {
        this.setState({
            basicDetails: {
                ...this.state.basicDetails,
                [name]: value
            }
        });
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
            handleDeleteType,
            match: {
                params: { tab }
            },
            getAllBuilTypeLogs,
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
            entity
        } = this.props;
        const { basicDetails, isHistory } = this.state;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng usr-pg">
                        <InfoTabs infoTabsData={infoTabsData} />

                        {tab === "basicdetails" ? <HelperIcon isHistory={isHistory} entity={isHistory ? "general" : entity} /> : null}
                        {isHistory && tab === "basicdetails" ? (
                            <EditHistory
                                handleDeleteItem={handleDeleteType}
                                getAllRegionLogs={getAllBuilTypeLogs}
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
                                showEditPage={this.showEditPage}
                                // isBuildingType={true}
                                historyParams={historyParams}
                                updateLogSortFilters={updateLogSortFilters}
                                permissions={permissions}
                                logPermission={logPermission}
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
                                showEditPage={this.showEditPage}
                                handleDeleteType={handleDeleteType}
                                isHistoryView={true}
                                changeToHistory={this.changeToHistory}
                                isHistory={isHistory}
                                permissions={permissions}
                                logPermission={logPermission}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                                entity={entity}
                            />
                        ) : tab === "buildings" ? (
                            <div
                                className={
                                    this.props.match.params.section == "userinfo" ? "tab-active bg-grey-table" : "tab-active bg-grey-table pt-3"
                                }
                            >
                                <Buildings
                                    isUser={true}
                                    dontShowAddButton={true}
                                    // basicDetails={basicDetails}
                                />{" "}
                            </div>
                        ) : tab === "projects" ? (
                            <div
                                className={
                                    this.props.match.params.section == "userinfo" ? "tab-active bg-grey-table" : "tab-active bg-grey-table pt-3"
                                }
                            >
                                <Projects
                                    isUser={true}
                                    dontShowAddButton={true}
                                    // basicDetails={basicDetails}
                                />{" "}
                            </div>
                        ) : tab === "settings" ? (
                            <div className="tab-active pt-3 recomdn-table p-3">
                                <UserSettings basicDetails={basicDetails} handleChangeBasicDetails={this.handleChangeBasicDetails} />
                            </div>
                        ) : null}
                    </div>
                </div>
                {this.renderFormModal()}
                {this.renderConfirmationModalLog()}
            </React.Fragment>
        );
    }
}

export default withRouter(ProjectInfo);
