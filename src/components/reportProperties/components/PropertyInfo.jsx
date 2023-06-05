import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import BasicDetails from "./BasicDetails";
import InfoTabs from "../../common/components/InfoTabs";
import EditHistory from "./EditHistory";
import HelperIcon from "../../helper/components/HelperIcon";

class PropertyInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            name: "",
            description: "",
            notes: "",
            created_at: "",
            updated_at: "",
            header_style1: {},
            header_style2: {},
            para_style: {},
            caption_style: {},
            caption_style1: {},
            table_style: {}
        },
        isHistory: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        associated_changes: []
    };

    componentDidMount = async () => {
        await this.refreshinfoDetails();
    };

    refreshinfoDetails = async () => {
        let propertyData = await this.props.getDataById();
        if (propertyData && propertyData.success) {
            this.setState({
                basicDetails: {
                    name: propertyData.name,
                    description: propertyData.description,
                    notes: propertyData.notes,
                    created_at: propertyData.created_at,
                    updated_at: propertyData.updated_at,
                    header_style1: propertyData.header_style1,
                    header_style2: propertyData.header_style2,
                    para_style: propertyData.para_style,
                    caption_style: propertyData.caption_style,
                    caption_style1: propertyData.caption_style1,
                    table_style: propertyData.table_style
                },
                isloading: false,
                isHistory: false
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
            getAllPropertyLogs,
            logData,
            handlePerPageChangeHistory,
            handlePageClickHistory,
            handleGlobalSearchHistory,
            globalSearchKeyHistory,
            handleDeleteLog,
            handleRestoreLog,
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
            selectedProperty,
            showEditPage,
            cancelForm,
            cancelInfoPage,
            isHistory,
            toggleHistory,
            entity
        } = this.props;
        const { basicDetails } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <InfoTabs infoTabsData={infoTabsData} />
                        <HelperIcon isHistory={isHistory} entity={isHistory ? "general" : entity} />
                        {isHistory ? (
                            <EditHistory
                                // handleDeleteItem={handleDeleteType}
                                getAllPropertyLogs={getAllPropertyLogs}
                                changeToHistory={toggleHistory}
                                handlePerPageChangeHistory={handlePerPageChangeHistory}
                                handlePageClickHistory={handlePageClickHistory}
                                handleGlobalSearchHistory={handleGlobalSearchHistory}
                                globalSearchKeyHistory={globalSearchKeyHistory}
                                logData={logData}
                                handleDeleteLog={handleDeleteLog}
                                historyPaginationParams={historyPaginationParams}
                                handleRestoreLog={handleRestoreLog}
                                isHistory={isHistory}
                                showEditPage={showEditPage}
                                historyParams={historyParams}
                                updateLogSortFilters={updateLogSortFilters}
                                logPermission={logPermission}
                                permissions={permissions}
                                hasLogDelete={hasLogDelete}
                                hasLogRestore={hasLogRestore}
                                hasEdit={hasEdit}
                                hasDelete={false}
                                hasInfoPage={hasInfoPage}
                                selectedProperty={selectedProperty}
                                cancelInfoPage={cancelInfoPage}
                                entity={entity}
                            />
                        ) : (
                            <BasicDetails
                                keys={keys}
                                config={config}
                                basicDetails={basicDetails}
                                showEditPage={showEditPage}
                                isHistoryView={true}
                                changeToHistory={toggleHistory}
                                isHistory={isHistory}
                                permissions={permissions}
                                logPermission={logPermission}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                                selectedProperty={selectedProperty}
                                cancelForm={cancelForm}
                                cancelInfoPage={cancelInfoPage}
                                entity={entity}
                            />
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(PropertyInfo);
