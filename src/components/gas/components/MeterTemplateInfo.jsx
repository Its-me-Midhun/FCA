import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import BasicDetails from "../../common/components/BasicDetails";
import InfoTabs from "../../common/components/InfoTabs";
import Recommendations from "../../recommendations/index";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import EditHistory from "../../region/components/EditHistory";

class MeterTemplateInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {},
        isHistory: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        associated_changes: []
    };

    componentDidMount = async () => {
        // this.props.showInfoPage(this.props.match.params.id);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        // if (prevProps.match.params.id !== this.props.match.params.id) {
        //     this.props.showInfoPage(this.props.match.params.id);
        //     await this.refreshinfoDetails();
        // }
    };

    refreshinfoDetails = async () => {
        let meterTemplateData = await this.props.getDataById(this.props.selectedMeterTemplate);
        if (meterTemplateData && meterTemplateData.success) {
            this.setState({
                basicDetails: {
                    client: meterTemplateData?.client?.name,
                    region: meterTemplateData?.region?.name,
                    site: meterTemplateData?.site?.name,
                    building: meterTemplateData?.building?.name,
                    account: meterTemplateData?.account?.number,
                    account_description: meterTemplateData?.account?.description,
                    meter: meterTemplateData?.meter?.meter,
                    meter_description: meterTemplateData?.meter?.description,
                    meter_type: meterTemplateData?.meter_type,
                    year: meterTemplateData?.year,
                    month: meterTemplateData?.month,
                    mmbtu_usage: meterTemplateData?.mmbtu_usage,
                    kw_usage: meterTemplateData?.kw_usage,
                    ccf_usage: meterTemplateData?.ccf_usage,
                    meter_read: meterTemplateData?.meter_read,
                    billing_days: meterTemplateData?.billing_days,
                    mmbtu_transport_cost: `$ ${meterTemplateData?.mmbtu_transport_cost}`,
                    mmbtu_well_head_cost: `$ ${meterTemplateData?.mmbtu_well_head_cost}`,
                    mmbtu_total_gas_cost: `$ ${meterTemplateData?.mmbtu_total_gas_cost}`,
                    created_at: meterTemplateData?.created_at,
                    updated_at: meterTemplateData?.updated_at
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
        await this.props.HandleRestoreNarrativeTemplateLog(selectedLog);
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
                params: { tab, id, settingType }
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
            entity,
            handleEdit
        } = this.props;
        const { basicDetails, isHistory } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <InfoTabs infoTabsData={infoTabsData} />
                        {isHistory && settingType === "basicdetails" ? (
                            <EditHistory
                                handleEditItem={() => handleEdit(this.props.selectedMeterTemplate)}
                                handleDeleteItem={() => handleDeleteItem(this.props.selectedMeterTemplate)}
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
                        ) : settingType === "basicdetails" ? (
                            <BasicDetails
                                keys={keys}
                                config={config}
                                basicDetails={basicDetails}
                                isHistoryView={true}
                                changeToHistory={this.changeToHistory}
                                isHistory={isHistory}
                                permissions={permissions}
                                logPermission={logPermission}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                                entity={entity}
                                handleEditItem={() => handleEdit(this.props.selectedMeterTemplate)}
                                handleDeleteItem={() => handleDeleteItem(this.props.selectedMeterTemplate)}
                            />
                        ) : (
                            <div className="tab-active pt-3 recomdn-table">
                                <Recommendations basicDetails={basicDetails} />
                            </div>
                        )}
                        {this.renderConfirmationModalLog()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(MeterTemplateInfo);
