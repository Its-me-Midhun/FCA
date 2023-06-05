import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import ReactTooltip from "react-tooltip";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import Portal from "../../common/components/Portal";
import ImageFullViewModal from "../../common/components/ImageFullViewModal";
import {
    addToBreadCrumpData,
    popBreadCrumpRecData,
    popBreadCrumpData,
    findPrevPathFromBreadCrumpRecData,
    findPrevPathFromBreadCrumpData
} from "../../../config/utils";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import EditHistory from "../../region/components/EditHistory";
import history from "../../../config/history";
import Iframe from "react-iframe";

class BasicDetails extends Component {
    state = {
        showImageModal: false,
        isHistoryView: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        associated_changes: [],
        numPages: null,
        pageNumber: null
    };

    openImageModal = () => {
        if (this.props.basicDetails && ["png", "jpg", "ttf", "jpeg", "svg"].includes(this.props.basicDetails.file_type.toLowerCase())) {
            this.setState({
                showImageModal: true
            });
        }
    };

    onDocumentLoadSuccess({ numPages }) {
        this.setState({
            numPages
        });
    }

    setToolTip(basicDetails, name) {
        return basicDetails && basicDetails.length > 20 ? (
            <Tooltip
                placement="left"
                overlay={basicDetails && basicDetails.length > 20 ? basicDetails || "" : ""}
                animation="zoom"
                defaultVisible={false}
                trigger={["hover"]}
                overlayInnerStyle={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "11px 17px ",
                    fontSize: "13px",
                    border: "none"
                }}
            >
                <div
                    className="content-block-card"
                    data-tip={basicDetails && basicDetails.length > 20 ? basicDetails || "" : ""}
                    data-multiline={true}
                    data-place="left"
                    data-effect="solid"
                    data-background-color="#4991ff"
                >
                    <p className="m-label">{name}</p>
                    <p className="m-details">
                        {basicDetails && basicDetails.length > 20 ? basicDetails.substring(0, 20) + "..." : basicDetails || "-"}
                    </p>
                </div>
            </Tooltip>
        ) : (
            <div
                className="content-block-card"
                data-tip={basicDetails && basicDetails.length > 20 ? basicDetails || "" : ""}
                data-multiline={true}
                data-place="left"
                data-effect="solid"
                data-background-color="#4991ff"
            >
                <p className="m-label">{name}</p>
                <p className="m-details">{basicDetails && basicDetails.length > 20 ? basicDetails.substring(0, 20) + "..." : basicDetails || "-"}</p>
            </div>
        );
    }

    setToolTipRecommentation(basicDetails, name) {
        return basicDetails && basicDetails.length > 65 ? (
            <Tooltip
                placement="left"
                overlay={basicDetails && basicDetails.length > 65 ? basicDetails || "" : ""}
                animation="zoom"
                defaultVisible={false}
                trigger={["hover"]}
                overlayInnerStyle={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "11px 17px ",
                    fontSize: "13px",
                    border: "none"
                }}
            >
                <div
                    className="content-block-card"
                    data-tip={basicDetails && basicDetails.length > 65 ? basicDetails || "" : ""}
                    data-multiline={true}
                    data-place="left"
                    data-effect="solid"
                    data-background-color="#4991ff"
                >
                    <p className="m-label">{name}</p>
                    <p className="m-details">
                        {basicDetails && basicDetails.length > 65 ? basicDetails.substring(0, 65) + "..." : basicDetails || "-"}
                    </p>
                </div>
            </Tooltip>
        ) : (
            <div
                className="content-block-card"
                data-tip={basicDetails && basicDetails.length > 65 ? basicDetails || "" : ""}
                data-multiline={true}
                data-place="left"
                data-effect="solid"
                data-background-color="#4991ff"
            >
                <p className="m-label">{name}</p>
                <p className="m-details">{basicDetails && basicDetails.length > 65 ? basicDetails.substring(0, 65) + "..." : basicDetails || "-"}</p>
            </div>
        );
    }

    setToolTipData(basicDetails, name) {
        return (
            <div
                className="txt-rcm"
                data-tip={basicDetails && basicDetails.length > 20 ? basicDetails || "" : ""}
                data-multiline={true}
                data-place="left"
                data-effect="solid"
                data-background-color="#4991ff"
            >
                <div className="txt-dtl">
                    <h4>{name}</h4>
                    <h3>{basicDetails && basicDetails.length > 20 ? basicDetails.substring(0, 20) + "..." : basicDetails || "-"}</h3>
                </div>
            </div>
        );
    }
    setToolTipDescription(basicDetails, name) {
        return basicDetails && basicDetails.length > 60 ? (
            <Tooltip
                placement="left"
                overlay={basicDetails && basicDetails.length > 60 ? basicDetails || "" : ""}
                animation="zoom"
                defaultVisible={false}
                trigger={["hover"]}
                overlayInnerStyle={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "11px 17px ",
                    fontSize: "13px",
                    border: "none"
                }}
            >
                <div className="txt-rcm">
                    <div className="txt-dtl">
                        <h4>{name}</h4>
                        <h3>{basicDetails && basicDetails.length > 60 ? basicDetails.substring(0, 60) + "..." : basicDetails || "-"}</h3>
                    </div>
                </div>
            </Tooltip>
        ) : (
            <div className="txt-rcm">
                <div className="txt-dtl">
                    <h4>{name}</h4>
                    <h3>{basicDetails || "-"}</h3>
                </div>
            </div>
        );
    }

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
        await this.props.HandleRestoreSettingsLog(selectedLog);
        await this.props.refreshinfoDetails();
        // await this.getLogData(this.props.match.params.id)
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null,
            isHistoryView: !this.state.isHistoryView
        });
    };

    editClick = basicDetails => {
        // if (this.props.match.params.id && basicDetails.project && basicDetails.project.id) {
        addToBreadCrumpData({
            key: "edit",
            name: `Edit ${this.props.location.pathname.split("/")[1]}`,
            path: `/${this.props.location.pathname.split("/")[1]}/edit/${this.props.match.params.id}`
        });
        this.props.history.push(`/${this.props.location.pathname.split("/")[1]}/edit/${this.props.match.params.id}`);
        // }
    };
    componentDidMount() {
        ReactTooltip.rebuild();
    }
    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

    render() {
        const {
            basicDetails,
            getAllSettingsLogs,
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
            hasDelete = true,
            hasEdit = true,
            hasLogView = true,
            hasLogDelete = true,
            hasLogRestore = true,
            hasInfoPage = true
        } = this.props;
        const { showImageModal, isHistoryView } = this.state;
        let isDashboardFiltered = false;
        let breadcrumbdata = findPrevPathFromBreadCrumpRecData();
        if (breadcrumbdata && breadcrumbdata[0]) {
            isDashboardFiltered = breadcrumbdata[0].name == "Dashboard" ? true : false;
        }
        console.log("basicDetails.initiative", basicDetails);
        return (
            <React.Fragment>
                {/* <ReactTooltip id={basicDetails.image.description} /> */}
                <div className="tab-active location-sec recom-sec main-dtl">
                    {console.log("basicDetails-->", basicDetails)}
                    <div className="otr-edit-delte col-md-12 text-right ed-dl">
                        {basicDetails && basicDetails.locked === true
                            ? ""
                            : hasLogView && (
                                  <span
                                      onClick={() => {
                                          this.setState({ isHistoryView: !this.state.isHistoryView });
                                      }}
                                      className="edit-icn-bx ml-3"
                                  >
                                      <i className="fas fa-history"></i> {isHistoryView ? "View Details" : "View History"}
                                  </span>
                              )}
                        <span
                            onClick={async () => {
                                await popBreadCrumpData();
                                await popBreadCrumpData();
                                await history.push(findPrevPathFromBreadCrumpData());
                            }}
                            className="edit-icn-bx"
                        >
                            <i className="fas fa-window-close"></i> Close
                        </span>
                        {hasEdit && (
                            <span className="edit-icn-bx" onClick={() => this.editClick(basicDetails)}>
                                <i className="fas fa-pencil-alt"></i> Edit
                            </span>
                        )}
                        {hasDelete && (
                            <span onClick={() => this.props.handleDeleteReport(basicDetails.id)} className="edit-icn-bx">
                                <i className="fas fa-trash-alt"></i> Delete
                            </span>
                        )}
                    </div>
                    {isHistoryView ? (
                        <EditHistory
                            getAllRegionLogs={getAllSettingsLogs}
                            // changeToHistory={this.changeToHistory}
                            handlePerPageChangeHistory={handlePerPageChangeHistory}
                            handlePageClickHistory={handlePageClickHistory}
                            handleGlobalSearchHistory={handleGlobalSearchHistory}
                            globalSearchKeyHistory={globalSearchKeyHistory}
                            logData={logData}
                            handleDeleteLog={handleDeleteLog}
                            historyPaginationParams={historyPaginationParams}
                            isProjectSettings={true}
                            handleRestoreLog={this.handleRestoreLog}
                            historyParams={historyParams}
                            updateLogSortFilters={updateLogSortFilters}
                            permissions={permissions}
                            logPermission={logPermission}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasInfoPage={hasInfoPage}
                        />
                    ) : (
                        <div className="col-md-12 detail-recom">
                            <div className="m-details-img-sec">
                                <div className="row align-items-stretch">
                                    <div className="col-md-8 p-0 m-details-content-outer">
                                        <div className="m-details-content-block">
                                            <div className="d-flex content-block-2 mt-1">
                                                {/* <div className="content-block-outer br-btm">
                                          {this.setToolTip(basicDetails && basicDetails.code, "Code")}
                                       </div> */}
                                                <div className="content-block-outer br-btm cstm-length-identifier">
                                                    {this.setToolTip(basicDetails && basicDetails.identifier, "Document Identifier")}
                                                </div>
                                                <div className="content-block-outer br-left br-btm cstm-length-recmntn">
                                                    {this.setToolTipRecommentation(basicDetails && basicDetails.file_name, "File Name")}
                                                </div>
                                            </div>
                                            <div className="d-flex content-block-2 mt-1">
                                                <div className="content-block-outer br-left br-btm">
                                                    {this.setToolTip(basicDetails && basicDetails.file_type && basicDetails.file_type, "File Type")}
                                                </div>
                                                <div className="content-block-outer br-left br-btm">
                                                    {this.setToolTip(basicDetails && basicDetails.document_type, "Document Type")}
                                                </div>
                                                <div className="content-block-outer br-left br-btm">
                                                    {this.setToolTip(basicDetails && basicDetails.client && basicDetails.client.name, "Client")}
                                                </div>
                                            </div>

                                            <div className="d-flex content-block-2 mt-1">
                                                <div className="content-block-outer br-left br-btm">
                                                    {this.setToolTip(
                                                        basicDetails && basicDetails.consultancy && basicDetails.consultancy.name,
                                                        "Consultancy"
                                                    )}
                                                </div>
                                                <div className="content-block-outer br-btm ">
                                                    {this.setToolTip(
                                                        basicDetails && basicDetails.project && basicDetails.project.name,
                                                        "Project Name"
                                                    )}
                                                </div>
                                                <div className="content-block-outer br-left br-btm">
                                                    {this.setToolTip(basicDetails && basicDetails.region && basicDetails.region.name, "Region")}
                                                </div>
                                            </div>

                                            <div className="d-flex content-block-2 mt-1">
                                                <div className="content-block-outer br-left br-btm">
                                                    {this.setToolTip(basicDetails && basicDetails.site && basicDetails.site.name, "Site")}
                                                </div>
                                                <div className="content-block-outer br-left br-btm">
                                                    {this.setToolTip(basicDetails && basicDetails.building && basicDetails.building.name, "Building")}
                                                </div>
                                                <div className="content-block-outer br-left br-btm">
                                                    {this.setToolTip(
                                                        basicDetails && basicDetails.floor && basicDetails.floor.name && basicDetails.floor.name,
                                                        "Floor"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex content-block-2 mt-1">
                                            <div className="content-block-outer br-left br-btm cstm-length-identifier">
                                                {this.setToolTip(
                                                    basicDetails &&
                                                        basicDetails.initiative &&
                                                        basicDetails.initiative.name &&
                                                        basicDetails.initiative.name,
                                                    "Initiative"
                                                )}
                                            </div>
                                            <div className="content-block-outer br-left br-btm cstm-length-recmntn">
                                                {this.setToolTipRecommentation(
                                                    basicDetails &&
                                                        basicDetails.recommendation &&
                                                        basicDetails.recommendation.name &&
                                                        basicDetails.recommendation.name,
                                                    "Recommendation"
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {basicDetails && basicDetails.image && basicDetails.image.description ? (
                                        <Tooltip
                                            placement="top"
                                            overlay={basicDetails && basicDetails.image && basicDetails.image.description}
                                            animation="zoom"
                                            defaultVisible={false}
                                            trigger={["hover"]}
                                            overlayInnerStyle={{
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                padding: "11px 17px ",
                                                fontSize: "13px",
                                                border: "none"
                                            }}
                                        >
                                            <div
                                                className={`col-md-4 m-details-img-outer main-image-outer2${
                                                    basicDetails && basicDetails.image && basicDetails.image.url ? " imgCrsr" : ""
                                                }`}
                                                data-tip={basicDetails && basicDetails.image && basicDetails.image.description}
                                                data-for={basicDetails && basicDetails.image && basicDetails.image.description}
                                                data-multiline={true}
                                                data-effect="solid"
                                                data-place="top"
                                                data-background-color="#4991ff"
                                            >
                                                <div className="details-img-block download-icn" onClick={() => this.openImageModal()}>
                                                    {basicDetails && basicDetails.file ? (
                                                        <>
                                                            <img src={`${basicDetails.file}`} alt="" />
                                                        </>
                                                    ) : (
                                                        <img src="/img/no-image.png" alt="" />
                                                    )}
                                                </div>
                                            </div>
                                        </Tooltip>
                                    ) : (
                                        <div
                                            className={`col-md-4 m-details-img-outer main-image-outer2${
                                                basicDetails.image && basicDetails.image.url ? " imgCrsr edit-addtn" : ""
                                            }`}
                                            data-tip={basicDetails && basicDetails.image && basicDetails.image.description}
                                            data-for={basicDetails && basicDetails.image && basicDetails.image.description}
                                            data-multiline={true}
                                            data-effect="solid"
                                            data-place="top"
                                            data-background-color="#4991ff"
                                        >
                                            <div className="details-img-block download-icn" onClick={() => this.openImageModal()}>
                                                {console.log("documentData-->", basicDetails)}
                                                {basicDetails.file &&
                                                basicDetails.file_type &&
                                                ["png", "jpg", "ttf", "jpeg", "svg"].includes(basicDetails.file_type.toLowerCase()) ? (
                                                    <>
                                                        <img src={`${basicDetails.file}`} alt="" />
                                                    </>
                                                ) : basicDetails.file &&
                                                  basicDetails.file_type &&
                                                  (basicDetails.file_type == "pdf" || basicDetails.file_type == "PDF") ? (
                                                    <>
                                                        <div class="download-icon">
                                                            <a href={basicDetails.file} target="_blank" download>
                                                                <i class="fas fa-book-open"></i>
                                                            </a>
                                                        </div>
                                                        <Iframe
                                                            url={basicDetails.file}
                                                            width="100%"
                                                            height="100%"
                                                            display="initial"
                                                            position="relative"
                                                            className="pdf-view"
                                                            overflow="hidden"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div class="download-icon">
                                                            <a href={basicDetails.file} target="_blank" download>
                                                                <i class="fas fa-download"></i>
                                                            </a>
                                                        </div>
                                                        <img src="/img/docIcon.webp"></img>
                                                    </>
                                                )}

                                                {/* : (
                                             <img src="/img/no-image.png" alt="" />
                                          ) */}
                                            </div>
                                        </div>
                                    )}
                                    {basicDetails && basicDetails.file && showImageModal ? (
                                        <Portal
                                            body={
                                                <ImageFullViewModal
                                                    imgSource={`${basicDetails.file}`}
                                                    onCancel={() => this.setState({ showImageModal: false })}
                                                />
                                            }
                                            onCancel={() => this.setState({ showImageModal: false })}
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <div className="outer-rcm mt-1">
                                {this.setToolTipDescription(basicDetails && basicDetails.description && basicDetails.description, "Description")}
                                {this.setToolTipDescription(basicDetails && basicDetails.notes && basicDetails.notes, "Notes")}
                            </div>
                            <div className="outer-rcm mt-1">
                                {this.setToolTipData(basicDetails && basicDetails.version_no && basicDetails.version_no, "Version")}
                                {this.setToolTipData(basicDetails && basicDetails.user && basicDetails.user, "Uploaded by")}
                                {this.setToolTipData(basicDetails && basicDetails.created_at && basicDetails.created_at, "Created At")}
                                {this.setToolTipData(basicDetails && basicDetails.updated_at && basicDetails.updated_at, "Updated At")}
                            </div>
                        </div>
                    )}
                    {this.renderConfirmationModalLog()}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
