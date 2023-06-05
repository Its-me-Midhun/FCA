import React, { Component } from "react";
import qs from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import regionActions from '../actions';
import InfoTabs from "../../common/components/InfoTabs";
import EFCIMain from "../../common/components/CommonEFCI/EFCIMain";

class EfciInfo extends Component {
    state = {};

    componentDidMount() {
        const siteId = this.props.match.params.id;
        const {
            location: { search }
        } = this.props;

        const query = qs.parse(search);
        this.setState({
            infoTabsData: [
                {
                    key: "dashboard",
                    name: "EFCI Sandbox",
                    path: `/region/efciinfo/${siteId}/dashboard${search}`
                },
                {
                    key: "efci",
                    name: "EFCI",
                    path: `/region/efciinfo/${siteId}/efci${search}`
                }
            ]
        });
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            const siteId = this.props.match.params.id;
            const {
                location: { search }
            } = this.props;

            const query = qs.parse(search);
            this.setState({
                infoTabsData: [
                    {
                        key: "dashboard",
                        name: "EFCI Sandbox",
                        path: `/region/efciinfo/${siteId}/dashboard${search}`
                    },
                    {
                        key: "efci",
                        name: "EFCI",
                        path: `/region/efciinfo/${siteId}/efci${search}`
                    }
                ]
            });
        }

    }

    setActiveTab(item) {
        // this.props.efciTabData(item);
    }

    commingSoonPic = () => {
        return (
            <>
                <div className="coming-soon bg-wh">
                    <div className="coming-soon-img">
                        <img src="/img/coming-soon.svg" />
                    </div>
                    <h3>COMING SOON</h3>
                </div>
            </>
        );
    };

    render() {
        const {
            match: {
                params: { tab }
            },
            location: { search }
        } = this.props;
        const {
            infoTabsData
        } = this.state;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12 ">
                    <div className="tab-dtl region-mng total-view-graph">
                        <InfoTabs infoTabsData={infoTabsData} setActiveTab={this.setActiveTab} />
                        {tab === "dashboard" ?
                            <>
                                {this.commingSoonPic()}
                            </>
                            :
                            tab === "efci" ?
                                <EFCIMain
                                    entity={"Region"}
                                    mainEntity={"Project"}
                                    colorCodes={this.props.colorCodes}
                                    efciLoading={this.props.efciLoading}
                                    efciRegionData={this.props.efciRegionData}
                                    handleAnnualEfci={this.props.handleRegionAnnualEfci}
                                    updateAnnualEFCI={this.props.updateRegionAnnualEFCI}
                                    updateAnnualFundingOption={this.props.updateRegionAnnualFunding}
                                    handleAnnualFundingOption={this.props.handleRegionAnnualFundingOption}
                                    handleFundingCostEfci={this.props.handleRegionFundingCostEfci}
                                    updateFundingCostEfci={this.props.updateRegionFundingEfci}
                                    handleFundingCostData={this.props.handleRegionEfciFundingCost}
                                    updateFundingCostData={this.props.updateRegionEfciFundingCost}
                                />
                                :
                                <>
                                    {this.commingSoonPic()}
                                </>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { regionReducer } = state;
    return { regionReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions })(EfciInfo));
// export default withRouter(EfciInfo);

