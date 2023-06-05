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
            properties: {},
            recommendation_props:{},
        },
        isHistory: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        associated_changes: [],
        activeDetail:"chart"
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
                    properties: propertyData.properties,
                    recommendation_props:propertyData.recommendation_props,
                    multi_recommendation_props:propertyData.multi_recommendation_props
                },
                isloading: false,
                isHistory: false
            });
        }
        return true;
    };
    setActiveTab = activeTab => {
        const {
            match:{params : {id}}
        } = this.props;
        this.setState({ activeDetail: activeTab });
        console.log("ui",activeTab)
        let tabKeyList = [ "sortedRecommendations", "multiRecommendation"];
        if(activeTab!=="chart"){
        this.props.history.push(`/chartProperties/info/${id}/${tabKeyList.includes(activeTab) ? activeTab : "chart"}`);
        }else
        {this.props.history.push(`/chartProperties/info/${id}`);}

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
            entity,
        } = this.props;
        const { basicDetails ,activeDetail} = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                        <li className={!this.props.match.params.tab || this.props.match.params.tab === "basicdetails" ? "cursor-pointer active pl-4" :"cursor-pointer"} onClick={() => this.setActiveTab("chart")}>Chart</li>
                            <li className={this.props.match.params.tab==="sortedRecommendations" ? "cursor-pointer active pl-4" :"cursor-pointer"}onClick={() => this.setActiveTab("sortedRecommendations")}>Sorted Recommendations</li>
                            <li className={this.props.match.params.tab==="multiRecommendation" ? "cursor-pointer active pl-4" :"cursor-pointer"} onClick={() => this.setActiveTab("multiRecommendation")}>Multi Recommendations</li>
                            {/* <li className={activeDetail==="chartDataTable" ? " cursor-pointer active pl-4" :"cursor-pointer"}onClick={() => this.setActiveTab("chartDataTable")}>Image Gallery</li> */}
                        </ul>
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
                                activeDetail={activeDetail}
                            />
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(PropertyInfo);
