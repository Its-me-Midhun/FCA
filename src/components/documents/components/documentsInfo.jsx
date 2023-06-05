import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import ReportsMainDetails from "./basicDetails";
import InfoTabs from "../../common/components/InfoTabs";
import HelperIcon from "../../helper/components/HelperIcon";

class ReportsInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            id: "",
            code: "",
            description: "",
            building: "",
            notes: "",
            identifier: "",
            file_name: "",
            code: "",
            file: "",
            document_type: "",
            file_type: "",
            consultancy: "",
            client: "",
            project: "",
            region: "",
            site: "",
            building: "",
            floor: "",
            recommendation: "",
            initiative: "",
            notes: "",
            status: "",
            created_at: "",
            updated_at: "",
            version_no: "",
            user: ""
        },
        imageList: []
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
        let documentData = await this.props.getDataById(this.props.match.params.id);
        if (documentData && documentData.success) {
            this.setState({
                basicDetails: {
                    id: documentData.id,
                    code: documentData.code,
                    description: documentData.description,
                    client: documentData.client,
                    consultancy: documentData.consultancy,
                    region: documentData.region,
                    site: documentData.site,
                    project: documentData.project,
                    building: documentData.building,
                    floor: documentData.floor,
                    identifier: documentData.identifier,
                    document_type: documentData.document_type,
                    file_type: documentData.file_type,
                    file_name: documentData.file_name,
                    recommendation: documentData.recommendation,
                    initiative: documentData.initiative,
                    file: documentData.url,
                    created_at: documentData.created_at,
                    updated_at: documentData.updated_at,
                    version_no: documentData.version_no,
                    notes: documentData.notes,
                    status: documentData.status,
                    user: documentData.user
                },

                isloading: false
            });
        }
        return true;
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
            entity
        } = this.props;

        const { basicDetails } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng lockset">
                        <InfoTabs infoTabsData={infoTabsData} />

                        <HelperIcon entity={entity} />
                        {tab === "maindetails" ? (
                            <ReportsMainDetails
                                keys={keys}
                                config={config}
                                basicDetails={basicDetails}
                                editClick={this.props.showEditPage}
                                handleDeleteReport={this.props.handleDeleteReport}
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
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                                hasLogDelete={hasLogDelete}
                                hasLogRestore={hasLogRestore}
                                hasInfoPage={hasInfoPage}
                                entity={entity}
                            />
                        ) : null}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(ReportsInfo);
