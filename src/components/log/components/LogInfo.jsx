import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import regionActions from "../actions";
import siteActions from "../../site/actions";
import buildingActions from "../../building/actions";
import BasicDetails from "../../common/components/BasicDetails";
import InfoTabs from "../../common/components/InfoTabs";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";

class RegionInfo extends Component {
    state = {
        breadCrumbsData: [{ key: "main", name: "Regions", path: "/region" }],
        isloading: true,
        basicDetails: {
            client: {},
            consultancy: {},
            users: [],
            client_users: [],
            name: "",
            code: "",
            comments: "",
            created_at: "",
            updated_at: "",
            projects: ""
        },
        locationDetails: {
            place: "",
            lat: "",
            long: ""
        },
        imageList: [],
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
        if (this.props.location.search !== prevProps.location.search || this.props.match.params.id !== prevProps.match.params.id) {
            this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        await this.props.getDataById(this.props.match.params.id);
        const {
            regionReducer: {
                getRegionByIdResponse: {
                    client,
                    consultancy,
                    users,
                    code,
                    comments,
                    name,
                    client_users,
                    success,
                    place,
                    created_at,
                    updated_at,
                    latitude: lat,
                    longitude: long,
                    projects
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                basicDetails: {
                    client,
                    consultancy,
                    users,
                    name,
                    client_users,
                    code,
                    comments,
                    created_at,
                    updated_at,
                    projects
                },
                locationDetails: {
                    place,
                    lat,
                    long
                },
                breadCrumbsData: [
                    { key: "main", name: "Regions", path: "/region" },
                    {
                        key: "info",
                        name: name,
                        path: `/region/info/${this.props.match.params.id}/basicdetails`
                    }
                ],
                isloading: false,
                isHistory: false
            });
        }
        return true;
    };

    setSelectedImage = async i => {
        const { imageList } = this.state;
        await this.setState({
            selectedImage: { image: imageList[i], index: i }
        });
    };

    handleUpdateLocation = async locationDetails => {
        this.setState({
            isloading: true
        });
        await this.props.handleUpdateData(locationDetails, true);
        await this.refreshinfoDetails();
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

    updateImage = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.updateRegionImageComment(imageData);
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
        const { showConfirmModalLog, isRestoreOrDelete, logChanges, associated_changes } = this.state;
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
        await this.props.HandleRestoreRegionLog(selectedLog);
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
            handleDeleteItem,
            keys,
            config,
            match: {
                params: { tab }
            },
            permissions,
            logPermission,
            hasDelete,
            hasEdit,
            hasLogView
        } = this.props;
        const { basicDetails, isHistory } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <InfoTabs infoTabsData={infoTabsData} />
                        {tab === "basicdetails" ? (
                            <BasicDetails
                                keys={keys}
                                config={config}
                                basicDetails={basicDetails}
                                handleDeleteItem={handleDeleteItem}
                                changeToHistory={this.changeToHistory}
                                isHistory={isHistory}
                                isHistoryView={true}
                                permissions={permissions}
                                logPermission={logPermission}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                            />
                        ) : (
                            <div className="tab-active pt-3 recomdn-table bg-grey-table"></div>
                        )}
                        {this.renderConfirmationModalLog()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { regionReducer, siteReducer, buildingReducer } = state;
    return { regionReducer, siteReducer, buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions, ...siteActions, ...buildingActions })(RegionInfo));
