import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import BasicDetails from "../../common/components/BasicDetails";
import InfoTabs from "../../common/components/InfoTabs";
import Recommendations from "../../recommendations/index";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import EditHistory from "../../region/components/EditHistory";
import NarrativeTemplate from "../../narrativeTemplate";
import TableTemplate from "../../tableTemplate";
import ReportNoteTemplate from "../../reportNoteTemplate";

class SystemInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            name: "",
            display_name: "",
            trade:"",
            description: "",
            narrative_required: "",
            created_at: "",
            updated_at: ""
        },
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
        let systemData = await this.props.getDataById(this.props.match.params.id);
        if (systemData && systemData.success) {
            this.setState({
                basicDetails: {
                    name: systemData.name,
                    trade: systemData.trade,
                    display_name: systemData.display_name,
                    description: systemData.description,
                    narrative_required: systemData.narrative_required,
                    created_at: systemData.created_at,
                    updated_at: systemData.updated_at
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
        await this.props.HandleRestoreSystemLog(selectedLog);
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
                params: { tab, id }
            },
            getAllFlooLogs,
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
                        {isHistory && tab === "basicdetails" ? (
                            <EditHistory
                                handleDeleteItem={handleDeleteItem}
                                getAllRegionLogs={getAllFlooLogs}
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
                        ) : tab === "assignednarrativetemplate" ? (
                            <div className="tab-active p-3 recomdn-table">
                                {localStorage.setItem("dynamicUrl", `/master_systems/${id}/narrative_templates`)}
                                <NarrativeTemplate hasAssign={false} dynamicUrl={`/master_systems/${id}/narrative_templates`} />
                            </div>
                        ) : tab === "assignedtabletemplate" ? (
                            <div className="tab-active p-3 recomdn-table">
                                {localStorage.setItem("dynamicUrl", `/master_systems/${id}/table_templates`)}
                                <TableTemplate hasAssign={false} dynamicUrl={`/master_systems/${id}/table_templates`} />
                            </div>
                        ) : tab === "assignedreportnotetemplate" ? (
                            <div className="tab-active p-3 recomdn-table">
                                {localStorage.setItem("dynamicUrl", `/master_systems/${id}/report_note_templates`)}
                                <ReportNoteTemplate hasAssign={false} dynamicUrl={`/master_systems/${id}/report_note_templates`} />
                            </div>
                        ) : (
                            <div className="tab-active pt-3 recomdn-table"></div>
                        )}
                        {this.renderConfirmationModalLog()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(SystemInfo);
