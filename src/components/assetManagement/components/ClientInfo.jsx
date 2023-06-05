import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import BasicDetails from "./basicDetails";
import InfoTabs from "../../common/components/InfoTabs";
import Regions from "../../region";
import Sites from "../../site/index";
import Buildings from "../../building/index";
import Loader from "../../common/components/Loader";
import HelperIcon from "../../helper/components/HelperIcon";
import Assets from "../../assets";
import AssetCharts from "./charts/AssetCharts";
class ProjectInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            code: "",
            consultancy: "",
            name: "",
            comments: "",
            created_at: "",
            updated_at: ""
        }
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
        if (prevProps.refreshProjectData !== this.props.refreshProjectData) {
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let projectData = await this.props.getDataById(this.props.match.params.id);
        if (projectData && projectData.success) {
            this.setState({
                basicDetails: {
                    name: projectData.name,
                    code: projectData.code,
                    comments: projectData.comments,
                    created_at: projectData.created_at,
                    updated_at: projectData.updated_at,
                    consultancy: projectData.consultancy
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
            return <Loader />;
        }

        const {
            infoTabsData,
            keys,
            config,
            match: {
                params: { tab }
            },
            hasDelete,
            hasEdit,
            hasLogView,
            entity
        } = this.props;

        const { basicDetails } = this.state;

        return (
            <React.Fragment>
                <ReactTooltip id={`init-sp-rep-btn`} />
                <div className="dtl-sec system-building col-md-12">
                    <div className="tab-dtl region-mng">
                        <InfoTabs infoTabsData={infoTabsData} isTabClass={true} />
                        {tab === "basicdetails" && <HelperIcon entity={entity} />}
                        {tab === "basicdetails" ? (
                            <BasicDetails
                                keys={keys}
                                config={config}
                                basicDetails={basicDetails}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                                entity={entity}
                            />
                        ) : tab === "regions" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Regions clientId={this.props.match.params.id} basicDetails={basicDetails} />
                            </div>
                        ) : tab === "sites" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Sites clientId={this.props.match.params.id} isProjectView={true} basicDetails={basicDetails} />
                            </div>
                        ) : tab === "buildings" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Buildings clientId={this.props.match.params.id} basicDetails={basicDetails} />
                            </div>
                        ) : tab === "assets" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Assets clientId={this.props.match.params.id} basicDetails={basicDetails} />
                            </div>
                        ) : tab === "assetcharts" && basicDetails.name ? (
                            <AssetCharts
                             clientId={this.props.match.params.id}
                             basicDetails={basicDetails} 
                             />
                        ) : null}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { energyManagmentReducer } = state;
    return { energyManagmentReducer };
};

export default withRouter(connect(mapStateToProps)(ProjectInfo));
