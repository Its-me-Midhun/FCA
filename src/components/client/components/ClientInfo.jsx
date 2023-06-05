import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import BasicDetails from "./basicDetailsSettings";
import InfoTabs from "../../common/components/InfoTabs";
import Portal from "../../common/components/Portal";
import Form from "./Form";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import EditHistory from "../../region/components/EditHistory";
import HelperIcon from "../../helper/components/HelperIcon";
import Documents from "../../documents/index";
import ChartTemplates from "../../chartTemplates/index";
import ChartProperties from "../../chartProperties";
import ClientSettings from "../components/clientSettings";
class ClientInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            code: "",
            name: "",
            consultancy: "",
            created_at: "",
            updated_at: "",
            image: null,
            comments: ""
        },
        selectedClient: this.props.match.params.id,
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
        let clientData = await this.props.getDataById(this.props.match.params.id);
        if (clientData && clientData.success) {
            this.setState({
                basicDetails: {
                    code: clientData.code,
                    name: clientData.name,
                    consultancy: clientData.consultancy,
                    created_at: clientData.created_at,
                    updated_at: clientData.updated_at,
                    image: clientData.image,
                    comments: clientData.comments
                },
                isloading: false,
                isHistory: false
            });
        }
        return true;
    };

    showEditPage = async buildingTypeId => {
        await this.setState({
            selectedClient: buildingTypeId
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
                        selectedClient={this.state.selectedClient}
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
            entity,
            hasHelp = true
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
                        ) : tab === "chart_templates" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <ChartTemplates clientId={this.props.match.params.id} basicDetails={basicDetails} isLocalSettings={true} />
                            </div>
                        ) : tab === "passwordsettings" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <ClientSettings isLocalSettings={true} />
                            </div>
                        ) : tab === "chartProperties" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <ChartProperties clientId={this.props.match.params.id} basicDetails={basicDetails} isLocalSettings={true} />
                            </div>
                        ) : (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Documents clientId={this.props.match.params.id} basicDetails={basicDetails} />
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

export default withRouter(ClientInfo);
