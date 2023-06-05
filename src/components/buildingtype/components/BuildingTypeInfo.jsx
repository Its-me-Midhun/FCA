import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import BasicDetails from "./basicDetailsSettings";
import InfoTabs from "../../common/components/InfoTabs";
import Recommendations from "../../recommendations/index";
import Portal from "../../common/components/Portal";
import Form from "./Form";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import EditHistory from "../../region/components/EditHistory";
import HelperIcon from "../../helper/components/HelperIcon";

import ColorCode from "./colorCodeList";

class ProjectInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            client: {},
            consultancy: {},
            name: "",
            description: "",
            created_at: "",
            updated_at: "",
            display_in_stats: ""
        },
        selectedBuildingType: this.props.match.params.id,
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
                    client: projectData.client,
                    consultancy: projectData.consultancy,
                    name: projectData.name,
                    description: projectData.description,
                    created_at: projectData.created_at,
                    updated_at: projectData.updated_at,
                    display_in_stats: projectData.display_in_stats
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
                        handleUpdateBuildingType={this.updateDataItem}
                        getDataById={this.props.getDataById}
                        getAllBuildingTypeDropdowns={this.props.getAllBuildingTypeDropdowns}
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
    };
    updateDataItem = async id => {
        await this.props.updateData(id, "info", this.state.selectedBuildingType);
        this.toggleShowFormModal();
        this.refreshinfoDetails();
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
                    <div className="tab-dtl region-mng">
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
                                isBuildingType={true}
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
                        ) : tab === "color_code" ? (
                            <ColorCode />
                        ) : (
                            <div className="tab-active pt-3 recomdn-table">
                                <Recommendations basicDetails={basicDetails} />
                            </div>
                        )}
                    </div>
                </div>
                {this.renderFormModal()}
                {this.renderConfirmationModalLog()}
            </React.Fragment>
        );
    }
}

export default withRouter(ProjectInfo);
