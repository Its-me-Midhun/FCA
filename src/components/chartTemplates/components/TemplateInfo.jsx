import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import InfoTabs from "../../common/components/InfoTabs";
import BasicDetails from "./TemplateBasicDetails";
import HelperIcon from "../../helper/components/HelperIcon";

class ReportsInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            id: "",
            description: "",
            uploaded_by: "",
            file: null,
            uploaded_at: ""
        }
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
        let tempData = await this.props.getDataById();
        if (tempData && tempData.success) {
            this.setState({
                basicDetails: { ...tempData },
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
                            <BasicDetails
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
