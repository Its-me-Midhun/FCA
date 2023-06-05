import React, { Component } from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import NumberFormat from "react-number-format";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";

import { addToBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrumpData } from "../../../config/utils";
import ConfirmationModal from "./ConfirmationModal";
import EditHistory from "../../region/components/EditHistory";
import Portal from "./Portal";
import ShowHelperModal from "../../helper/components/ShowHelperModal";
import ImageFullViewModal from "./ImageFullViewModal";
import { Dropdown } from "react-bootstrap";

class BasicDetails extends Component {
    state = {
        isHistoryView: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        showHelperModal: false,
        selectedHelperItem: {},
        showConfirmModal: false,
        selectedBudgetPriorityData: false,
        showImageModal: false,
        selectedFMP: false,
        showFMPConfirmModal: false,
        showIrConfirmModal: false,
        selectedIr: false,
        showRLConfirmModal: false,
        selectedRL: false
    };

    setToolTip(basicDetails, name) {
        return basicDetails && basicDetails.length > 20 ? (
            <Tooltip
                placement="left"
                overlay={basicDetails && basicDetails.length > 20 ? basicDetails || "" : ""}
                animation="zoom"
                overlayInnerStyle={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "11px 17px ",
                    fontSize: "13px",
                    border: "none"
                }}
            >
                <div
                    className={`txt-rcm ${name === "Installed Year" ? "wid-tw-rcm" : ""}`}
                    data-tip={basicDetails && basicDetails.length > 20 ? basicDetails || "" : ""}
                    data-multiline={true}
                    data-place="left"
                    data-effect="solid"
                    data-background-color="#007bff"
                >
                    <div className="txt-dtl">
                        <h4>{name}</h4>
                        <h3>{basicDetails && basicDetails.length > 20 ? basicDetails.substring(0, 20) + "..." : basicDetails || "-"}</h3>
                    </div>
                </div>
            </Tooltip>
        ) : (
            <div
                className={`txt-rcm ${name === "Installed Year" ? "wid-tw-rcm" : ""}`}
                data-tip={basicDetails && basicDetails.length > 20 ? basicDetails || "" : ""}
                data-multiline={true}
                data-place="left"
                data-effect="solid"
                data-background-color="#007bff"
            >
                <div className="txt-dtl">
                    <h4>{name}</h4>
                    <h3>{basicDetails && basicDetails.length > 20 ? basicDetails.substring(0, 20) + "..." : basicDetails || "-"}</h3>
                </div>
            </div>
        );
    }

    handleRestoreLog = async (id, choice, changes) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            logChanges: changes
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, logChanges } = this.state;
        if (!showConfirmModalLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={logChanges}
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

    showHelperModal = async (item, subItem) => {
        await this.setState({
            showHelperModal: true,
            selectedHelperItem: {
                item,
                subItem
            }
        });
    };

    renderUploadHelperModal = () => {
        const { showHelperModal, selectedHelperItem } = this.state;
        if (!showHelperModal) return null;
        return (
            <Portal
                body={<ShowHelperModal selectedHelperItem={selectedHelperItem} onCancel={() => this.setState({ showHelperModal: false })} />}
                onCancel={() => this.setState({ showHelperModal: false })}
            />
        );
    };

    findPriorityText = (element, options) => {
        let text = "-";
        let priorityObj = options.find(option => parseInt(option.value) === element);
        if (priorityObj) {
            text = priorityObj.name;
        }
        return text;
    };

    updateBudgetPriority = () => {
        const { selectedBudgetPriorityData } = this.state;
        this.setState({ showConfirmModal: false });
        this.props.updateBudget({ budget_priority: selectedBudgetPriorityData ? "yes" : "no" }, this.props.match.params.id);
    };

    updateFMP = () => {
        const { selectedFMP } = this.state;
        this.setState({ showFMPConfirmModal: false });
        this.props.updateFMP({ fmp: selectedFMP ? "yes" : "no" }, this.props.match.params.id);
    };
    updateIr = () => {
        const { selectedIr } = this.state;
        this.setState({ showIrConfirmModal: false });
        this.props.updateIR({ infrastructure_request: selectedIr ? "yes" : "no" }, this.props.match.params.id);
    };
    updateRL = () => {
        const { selectedRL } = this.state;
        this.setState({ showRLConfirmModal: false });
        this.props.updateRL({ red_line: selectedRL ? "yes" : "no" }, this.props.match.params.id);
    };

    showConfirmation = e => {
        this.setState({ showConfirmModal: true, selectedBudgetPriorityData: e.target.checked });
    };

    showFMPConfirmation = e => {
        this.setState({ showFMPConfirmModal: true, selectedFMP: e.target.checked });
    };
    showIrConfirmation = e => {
        this.setState({ showIrConfirmModal: true, selectedIr: e.target.checked });
    };

    showRLConfirmation = e => {
        this.setState({ showRLConfirmModal: true, selectedRL: e.target.checked });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, selectedBudgetPriorityData } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={
                            selectedBudgetPriorityData === false
                                ? "Do you want to remove from Budget Priority?"
                                : "Do you want to add to Budget Priority "
                        }
                        // message={"This action cannot be reverted, are you sure ?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.updateBudgetPriority}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    renderFMPConfirmationModal = () => {
        const { showFMPConfirmModal, selectedFMP } = this.state;
        if (!showFMPConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={
                            selectedFMP === false
                                ? "Do you want to remove from Facility Master Plan ?"
                                : "Do you want to add to Facility Master Plan ?"
                        }
                        onNo={() => this.setState({ showFMPConfirmModal: false })}
                        onYes={this.updateFMP}
                    />
                }
                onCancel={() => this.setState({ showFMPConfirmModal: false })}
            />
        );
    };
    renderIrConfirmationModal = () => {
        const { showIrConfirmModal, selectedIr } = this.state;
        if (!showIrConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={
                            selectedIr === false
                                ? "Do you want to remove from Facility Master Plan ?"
                                : "Do you want to add to Facility Master Plan ?"
                        }
                        onNo={() => this.setState({ showIrConfirmModal: false })}
                        onYes={this.updateIr}
                    />
                }
                onCancel={() => this.setState({ showIrConfirmModal: false })}
            />
        );
    };

    renderRLConfirmationModal = () => {
        const { showRLConfirmModal, selectedRL } = this.state;
        if (!showRLConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={selectedRL === false ? "Do you want to remove from Redlining ?" : "Do you want to add to Redlining ?"}
                        onNo={() => this.setState({ showRLConfirmModal: false })}
                        onYes={this.updateRL}
                    />
                }
                onCancel={() => this.setState({ showRLConfirmModal: false })}
            />
        );
    };

    openImageModal = () => {
        this.setState({
            showImageModal: true
        });
    };

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
            permissions,
            logPermission,
            isNarrativeRecommendation,
            closeInfoPage,
            hasDelete = true,
            hasEdit = true,
            hasLogView = true,
            hasLogDelete = true,
            hasLogRestore = true,
            hasInfoPage = true,
            hasCreate = true
        } = this.props;
        const { isHistoryView } = this.state;
        const is_infrastructure_request_user = localStorage.getItem("infrastructure_request_user") === "yes" ? true : false;
        const is_fmp_user = localStorage.getItem("fmp_user") === "yes" ? true : false;

        return (
            <React.Fragment>
                <ReactTooltip id="recommandation_Asset" effect="solid" />
                <div className="tab-active location-sec recom-sec ">
                    <div className="recom-top-nav-sec">
                        <div className="check-area-top mr-3">
                            <label htmlFor="">
                                <span className="label-txt"> ID:</span> <span className="label-detl">{basicDetails.code || "-"}</span>{" "}
                            </label>
                            <label htmlFor="">
                                <span className="label-txt"> Type: </span>
                                <span className="label-detl">
                                    {basicDetails.recommendation_type
                                        ? basicDetails.recommendation_type?.charAt(0)?.toUpperCase() + basicDetails.recommendation_type?.slice(1)
                                        : "-"}
                                </span>
                            </label>
                        </div>
                        <div className="otr-edit-delte text-right ed-dl d-flex align-items-center view-narrative-report">
                            <div className="budget-pr mr-2">
                                <label class={`container-check ${basicDetails?.locked ? "cursor-diabled" : ""}`}>
                                    <input
                                        type="checkbox"
                                        disabled={basicDetails?.locked}
                                        checked={basicDetails.red_line === "yes" ? true : false}
                                        onChange={this.showRLConfirmation}
                                    ></input>
                                    <span class="checkmark"></span>Redlining
                                </label>
                            </div>
                            <div className="budget-pr mr-2">
                                <label class={`container-check ${is_infrastructure_request_user || basicDetails?.locked ? "cursor-diabled" : ""}`}>
                                    <input
                                        type="checkbox"
                                        checked={basicDetails.infrastructure_request === "yes" ? true : false}
                                        onChange={this.showIrConfirmation}
                                        disabled={is_infrastructure_request_user || basicDetails?.locked}
                                    ></input>
                                    <span class="checkmark"></span>Infrastructure Request
                                </label>
                            </div>
                            <div className="budget-pr mr-3">
                                <label class={`container-check ${basicDetails?.locked ? "cursor-diabled" : ""}`}>
                                    <input
                                        type="checkbox"
                                        disabled={basicDetails?.locked}
                                        checked={basicDetails.budget_priority === "yes" ? true : false}
                                        onChange={this.showConfirmation}
                                    ></input>
                                    <span class="checkmark"></span>Budget Priority
                                </label>
                            </div>
                            <div className="budget-pr mr-3">
                                <label class={`container-check ${is_fmp_user || basicDetails?.locked ? "cursor-diabled" : ""}`}>
                                    <input
                                        type="checkbox"
                                        disabled={is_fmp_user || basicDetails?.locked}
                                        checked={basicDetails.fmp === "yes" ? true : false}
                                        onChange={this.showFMPConfirmation}
                                    ></input>
                                    <span class="checkmark"></span>Facility Master Plan
                                </label>
                            </div>
                            {isNarrativeRecommendation ? (
                                <>
                                    {/* <span
                                        onClick={() => {
                                            this.props.downloadPdfReport({
                                                project_id: basicDetails?.project?.id,
                                                building_id: basicDetails?.building?.id,
                                                subsystem_id: basicDetails?.sub_system?.id
                                            });
                                        }}
                                        className="edit-icn-bx icon-btn-sec"
                                        data-tip=" View Narrative Report"
                                        data-for="recommandation_Asset"
                                        data-place="top"
                                    >
                                        <img src="/img/narrative-rec.svg" alt="" />
                                    </span> */}
                                    <span
                                        onClick={closeInfoPage}
                                        className="edit-icn-bx icon-btn-sec"
                                        data-tip="Close"
                                        data-for="recommandation_Asset"
                                        data-place="top"
                                    >
                                        <img src="/img/close-rec.svg" alt="" />
                                    </span>
                                </>
                            ) : (
                                <>
                                    {/* <span
                                        onClick={() => {
                                            this.props.downloadPdfReport({
                                                project_id: basicDetails?.project?.id,
                                                building_id: basicDetails?.building?.id,
                                                subsystem_id: basicDetails?.sub_system?.id
                                            });
                                        }}
                                        className="edit-icn-bx icon-btn-sec"
                                        data-tip=" View Narrative Report"
                                        data-for="recommandation_Asset"
                                        data-place="top"
                                    >
                                        <img src="/img/narrative-rec.svg" alt="" />
                                    </span> */}
                                    {basicDetails && basicDetails.locked === true
                                        ? ""
                                        : hasLogView && (
                                              <span
                                                  onClick={() => {
                                                      this.setState({ isHistoryView: !this.state.isHistoryView });
                                                  }}
                                                  className="edit-icn-bx icon-btn-sec"
                                                  data-tip={isHistoryView ? "View Details" : "View History"}
                                                  data-for="recommandation_Asset"
                                                  data-place="top"
                                              >
                                                  <img src="/img/history-rec.svg" alt="" />
                                              </span>
                                          )}
                                    <span
                                        onClick={() => {
                                            popBreadCrumpData();
                                            popBreadCrumpData();
                                            this.props.history.push(findPrevPathFromBreadCrumpData());
                                        }}
                                        className="edit-icn-bx icon-btn-sec"
                                        data-tip="Close"
                                        data-for="recommandation_Asset"
                                        data-place="top"
                                    >
                                        <img src="/img/close-rec.svg" alt="" />
                                    </span>
                                    {basicDetails && basicDetails.locked === true ? (
                                        ""
                                    ) : (
                                        <>
                                            {!basicDetails.deleted
                                                ? hasEdit && (
                                                      <span
                                                          className="edit-icn-bx icon-btn-sec"
                                                          onClick={() => {
                                                              addToBreadCrumpData({
                                                                  key: "edit",
                                                                  name: `Edit ${this.props.location.pathname.split("/")[1]}`,
                                                                  path: `/${this.props.location.pathname.split("/")[1]}/edit/${
                                                                      this.props.match.params.id
                                                                  }?p_id=${basicDetails?.project?.id}&c_id=${
                                                                      basicDetails?.client?.id
                                                                  }&active_tab=asset`
                                                              });
                                                              this.props.history.push(
                                                                  `/${this.props.location.pathname.split("/")[1]}/edit/${
                                                                      this.props.match.params.id
                                                                  }?p_id=${basicDetails?.project?.id}&c_id=${
                                                                      basicDetails?.client?.id
                                                                  }&active_tab=asset`
                                                              );
                                                          }}
                                                          data-tip="Edit"
                                                          data-for="recommandation_Asset"
                                                          data-place="top"
                                                      >
                                                          <img src="/img/edit-rec.svg" alt="" />
                                                      </span>
                                                  )
                                                : hasEdit && (
                                                      <span
                                                          onClick={() => this.props.restoreRecommendation()}
                                                          className="edit-icn-bx icon-btn-sec"
                                                          data-tip="Restore"
                                                          data-for="recommandation_Asset"
                                                          data-place="top"
                                                      >
                                                          <img src="/img/restore-reco.svg" alt="" />
                                                      </span>
                                                  )}
                                            {hasDelete && (
                                                <span
                                                    className="edit-icn-bx icon-btn-sec del"
                                                    onClick={() => this.props.deleteRecommendation(basicDetails.deleted || false)}
                                                    data-tip="Delete"
                                                    data-for="recommandation_Asset"
                                                    data-place="top"
                                                >
                                                    <img src="/img/delete-icon.svg" alt="" />
                                                </span>
                                            )}

                                            <span
                                                className="view-inner help-icon"
                                                data-tip={`Help`}
                                                data-effect="solid"
                                                data-place="bottom"
                                                data-background-color="#007bff"
                                                onClick={() => {
                                                    this.showHelperModal("forms", "recommendations");
                                                }}
                                            >
                                                <img src="/img/question-mark-icon.png" alt="" className="fil-ico" />
                                            </span>
                                            {this.renderUploadHelperModal()}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
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
                                            <div className="outer-rcm recommendations">
                                                {this.setToolTip(basicDetails.asset?.code, "Asset Code")}
                                                {this.setToolTip(basicDetails.asset?.asset_name, "Asset Name")}
                                                {this.setToolTip(basicDetails.asset?.asset_description, "Asset Description")}
                                                {this.setToolTip(basicDetails.asset?.asset_type?.name, "Asset Type")}
                                            </div>

                                            <div className="outer-rcm recommendations">
                                                {this.setToolTip(basicDetails.asset?.asset_status?.name, "Asset Status")}
                                                {this.setToolTip(basicDetails.asset?.client_asset_condition?.name, "Asset Condition")}
                                                {this.setToolTip(
                                                    basicDetails.asset?.client_asset_condition?.description,
                                                    "Asset Condition Description"
                                                )}
                                                {this.setToolTip(basicDetails.asset?.criticality, "Criticality")}
                                            </div>

                                            <div className="outer-rcm recommendations">
                                                {this.setToolTip(basicDetails.asset?.asset_tag, "Asset Tag")}
                                                <div className="txt-rcm">
                                                    <div className="txt-dtl">
                                                        <h4>GUID</h4>
                                                        <h3>{basicDetails.asset?.guid || "-"}</h3>
                                                    </div>
                                                </div>
                                                {this.setToolTip(basicDetails.asset?.model_number, "Model Number")}
                                                <div
                                                    className="txt-rcm"
                                                    data-tip={
                                                        basicDetails.asset?.capacity?.toString().length > 20 ? basicDetails.asset?.capacity || "" : ""
                                                    }
                                                    data-multiline={true}
                                                    data-place="left"
                                                    data-for="recommandation_Asset"
                                                    data-effect="solid"
                                                    data-background-color="#007bff"
                                                >
                                                    <div className="txt-dtl">
                                                        <h4>Capacity</h4>
                                                        <h3>
                                                            {basicDetails.asset?.capacity?.toString().length > 20
                                                                ? basicDetails.asset?.capacity?.toString().substring(0, 20) + "..."
                                                                : basicDetails.asset?.capacity || "-"}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="outer-rcm recommendations">
                                                <div
                                                    className="txt-rcm"
                                                    data-tip={
                                                        basicDetails.asset?.capacity_unit?.toString().length > 20
                                                            ? basicDetails.asset?.capacity_unit || ""
                                                            : ""
                                                    }
                                                    data-multiline={true}
                                                    data-place="left"
                                                    data-for="recommandation_Asset"
                                                    data-effect="solid"
                                                    data-background-color="#007bff"
                                                >
                                                    <div className="txt-dtl">
                                                        <h4>Capacity Unit</h4>
                                                        <h3>
                                                            {basicDetails.asset?.capacity_unit?.toString().length > 20
                                                                ? basicDetails.asset?.capacity_unit?.toString().substring(0, 20) + "..."
                                                                : basicDetails.asset?.capacity_unit || "-"}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div
                                                    className="txt-rcm"
                                                    data-tip={
                                                        basicDetails.asset?.capacity_status?.toString().length > 20
                                                            ? basicDetails.asset?.capacity_status || ""
                                                            : ""
                                                    }
                                                    data-multiline={true}
                                                    data-place="left"
                                                    data-for="recommandation_Asset"
                                                    data-effect="solid"
                                                    data-background-color="#007bff"
                                                >
                                                    <div className="txt-dtl">
                                                        <h4>Capacity Status</h4>
                                                        <h3>
                                                            {basicDetails.asset?.capacity_status?.toString().length > 20
                                                                ? basicDetails.asset?.capacity_status?.toString().substring(0, 20) + "..."
                                                                : basicDetails.asset?.capacity_status || "-"}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div
                                                    className="txt-rcm "
                                                    data-tip={
                                                        basicDetails.asset?.serial_number?.toString().length > 20
                                                            ? basicDetails.asset?.serial_number || ""
                                                            : ""
                                                    }
                                                    data-multiline={true}
                                                    data-for="recommandation_Asset"
                                                    data-place="left"
                                                    data-effect="solid"
                                                    data-background-color="#007bff"
                                                >
                                                    <div className="txt-dtl">
                                                        <h4>Serial Number</h4>
                                                        <h3>
                                                            {basicDetails.asset?.serial_number?.toString().length > 20
                                                                ? basicDetails.asset?.serial_number?.toString().substring(0, 20) + "..."
                                                                : basicDetails.asset?.serial_number || "-"}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div
                                                    className="txt-rcm "
                                                    data-tip={
                                                        basicDetails.asset?.asset_barcode?.toString().length > 20
                                                            ? basicDetails.asset?.asset_barcode || ""
                                                            : ""
                                                    }
                                                    data-multiline={true}
                                                    data-for="recommandation_Asset"
                                                    data-place="left"
                                                    data-effect="solid"
                                                    data-background-color="#007bff"
                                                >
                                                    <div className="txt-dtl">
                                                        <h4>Asset Barcode</h4>
                                                        <h3>
                                                            {basicDetails.asset?.asset_barcode?.toString().length > 20
                                                                ? basicDetails.asset?.asset_barcode?.toString().substring(0, 20) + "..."
                                                                : basicDetails.asset?.asset_barcode || "-"}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="outer-rcm recommendation top-margin">
                                                {this.setToolTip(basicDetails.asset?.asset_client_id, "Asset Client ID")}
                                                {this.setToolTip(basicDetails.asset?.asset_cmms_id, "Asset CMMS ID")}
                                                {this.setToolTip(basicDetails.asset?.name_plate_status, "Name Plate Status")}
                                                {this.setToolTip(basicDetails.asset?.rtls_tag, "RTLS Tag")}
                                            </div>
                                        </div>
                                    </div>
                                    {basicDetails?.asset?.image?.description ? (
                                        <Tooltip
                                            placement="top"
                                            overlay={basicDetails?.asset?.image?.description}
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
                                                    basicDetails.asset.image && basicDetails.asset.image.url ? " imgCrsr" : ""
                                                }`}
                                                data-tip={basicDetails?.asset?.image?.description}
                                                data-for={basicDetails?.asset?.image?.description}
                                                data-multiline={true}
                                                data-effect="solid"
                                                data-place="top"
                                                data-background-color="#007bff"
                                            >
                                                <div className="details-img-block" onClick={() => this.openImageModal()}>
                                                    {basicDetails?.asset?.image && basicDetails?.asset?.image.url ? (
                                                        <>
                                                            <img src={`${basicDetails?.asset?.image.url}`} alt="" />
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
                                                basicDetails?.asset?.image && basicDetails?.image?.url ? " imgCrsr" : ""
                                            }`}
                                            data-tip={basicDetails?.image?.description}
                                            data-for={basicDetails?.image?.description}
                                            data-multiline={true}
                                            data-effect="solid"
                                            data-place="top"
                                            data-background-color="#007bff"
                                        >
                                            <div className="details-img-block" onClick={() => this.openImageModal()}>
                                                {basicDetails?.asset?.image && basicDetails?.asset?.image.url ? (
                                                    <>
                                                        <img src={`${basicDetails?.asset?.image.url}`} alt="" />
                                                    </>
                                                ) : (
                                                    <img src="/img/no-image.png" alt="" />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {basicDetails?.asset?.image && basicDetails?.asset?.image.url && this.state.showImageModal ? (
                                        <Portal
                                            body={
                                                <ImageFullViewModal
                                                    imgSource={`${basicDetails?.asset?.image.url}`}
                                                    onCancel={() => this.setState({ showImageModal: false })}
                                                />
                                            }
                                            onCancel={() => this.setState({ showImageModal: false })}
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <div className="outer-rcm recommendations ">
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails?.asset?.client?.name?.toString().length > 20 ? basicDetails?.asset?.client?.name || "" : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="recommandation_Asset"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Client</h4>
                                        <h3>{basicDetails.asset?.client?.name || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={basicDetails.asset?.region?.name?.toString().length > 20 ? basicDetails.asset?.region?.name || "" : ""}
                                    data-multiline={true}
                                    data-place="left"
                                    data-for="recommandation_Asset"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Region</h4>
                                        <h3>{basicDetails.asset?.region?.name || "-"}</h3>
                                    </div>
                                </div>
                                {this.setToolTip(basicDetails.asset?.site?.name, "Site")}
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Building</h4>
                                        <h3>{basicDetails.asset?.building?.name || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations">
                                {this.setToolTip(basicDetails.asset?.building_type?.name, "Building Type")}
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Addition</h4>
                                        <h3>{basicDetails.asset?.addition?.name || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={basicDetails.asset?.floor?.name?.toString().length > 20 ? basicDetails.asset?.floor?.name || "" : ""}
                                    data-multiline={true}
                                    data-place="left"
                                    data-for="recommandation_Asset"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Floor</h4>
                                        <h3>{basicDetails.asset?.floor?.name || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={basicDetails.asset?.room_number?.toString().length > 20 ? basicDetails.asset?.room_number || "" : ""}
                                    data-multiline={true}
                                    data-place="left"
                                    data-for="recommandation_Asset"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Room Number</h4>
                                        <h3>{basicDetails.asset?.room_number || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations ">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Room Name</h4>
                                        <h3>{basicDetails.asset?.room_name || "-"}</h3>
                                    </div>
                                </div>
                                {this.setToolTip(basicDetails.asset?.location, "Location")}
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Architectural Room number</h4>
                                        <h3>{basicDetails.asset?.architectural_room_number || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Additional Room Description</h4>
                                        <h3>{basicDetails.asset?.additional_room_description || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations top-margin">
                                {this.setToolTip(basicDetails.asset?.longitude, "Longitude")}
                                {this.setToolTip(basicDetails.asset?.latitude, "Latitude")}
                                <div className="txt-rcm"></div>
                                <div className="txt-rcm"></div>
                            </div>
                            <div className="outer-rcm recommendations">
                                <div
                                    className="txt-rcm"
                                    data-tip={basicDetails.asset?.manufacturer?.toString().length > 20 ? basicDetails.asset?.manufacturer || "" : ""}
                                    data-multiline={true}
                                    data-place="left"
                                    data-for="recommandation_Asset"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Manufacturer</h4>
                                        <h3>{basicDetails.asset?.manufacturer || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Year Manufactured</h4>
                                        <h3>{basicDetails.asset?.year_manufactured || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails.asset?.installed_year?.toString().length > 20 ? basicDetails.asset?.installed_year || "" : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-for="recommandation_Asset"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Installed Year</h4>
                                        <h3>{basicDetails.asset?.installed_year || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails.asset?.installed_year_status?.toString().length > 20
                                            ? basicDetails.asset?.installed_year_status || ""
                                            : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-for="recommandation_Asset"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Installed Year Status</h4>
                                        <h3>{basicDetails.asset?.installed_year_status || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations ">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Current Age</h4>
                                        <h3>{basicDetails.asset?.current_age || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Service Life</h4>
                                        <h3>{basicDetails.asset?.service_life || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails.asset?.usefull_life_remaining
                                            ? `Year= ${new Date().getFullYear() + basicDetails.asset?.usefull_life_remaining}`
                                            : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-for="recommandation_Asset"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Useful Life Remaining</h4>
                                        <h3>{basicDetails.asset?.usefull_life_remaining || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>CRV</h4>
                                        <h3>
                                            <NumberFormat
                                                value={parseInt(basicDetails.asset?.crv || 0)}
                                                thousandSeparator={true}
                                                displayType={"text"}
                                                prefix={"$ "}
                                            />
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="outer-rcm recommendations ">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Warranty Start</h4>
                                        {basicDetails.asset?.warranty_start
                                            ? moment(basicDetails.asset?.warranty_start).format("MM-DD-YYYY") || "-"
                                            : "-"}
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Warranty End</h4>
                                        {basicDetails.asset?.warranty_end
                                            ? moment(basicDetails.asset?.warranty_end).format("MM-DD-YYYY") || "-"
                                            : "-"}
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={basicDetails.asset.install_date?.toString().length > 20 ? basicDetails.asset?.install_date || "" : ""}
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="recommandation_Asset"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Install Date</h4>
                                        <h3>
                                            {basicDetails.asset?.install_date
                                                ? moment(basicDetails.asset?.install_date).format("MM-DD-YYYY") || "-"
                                                : "-"}
                                        </h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={basicDetails.asset?.startup_date?.toString().length > 20 ? basicDetails.asset?.startup_date || "" : ""}
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="recommandation_Asset"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Startup Date</h4>
                                        <h3>
                                            {basicDetails.asset?.startup_date
                                                ? moment(basicDetails.asset?.startup_date).format("MM-DD-YYYY") || "-"
                                                : "-"}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="outer-rcm recommendations ">
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails.asset?.uniformat_level_1?.name?.toString().length > 20
                                            ? basicDetails.asset?.uniformat_level_1?.name || ""
                                            : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="recommandation_Asset"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Uniformat Level 1</h4>
                                        <h3>{basicDetails.asset?.uniformat_level_1?.name || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails.asset?.uniformat_level_2?.name?.toString().length > 20
                                            ? basicDetails.asset?.uniformat_level_2?.name || ""
                                            : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="recommandation_Asset"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Uniformat Level 2</h4>
                                        <h3>{basicDetails.asset?.uniformat_level_2?.name || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Uniformat Level 3</h4>
                                        <h3> {basicDetails.asset?.uniformat_level_3?.name || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Uniformat Level 4</h4>
                                        <h3> {basicDetails.asset?.uniformat_level_4?.name || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Uniformat Level 5</h4>
                                        <h3> {basicDetails.asset?.uniformat_level_5?.name || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Uniformat Level 6</h4>
                                        <h3> {basicDetails.asset?.uniformat_level_6?.name || "-"}</h3>
                                    </div>
                                </div>
                                {this.setToolTip(
                                    basicDetails.asset?.uniformat_level_6?.uniformat_level_6_description,
                                    "Uniformat Level 6 Description"
                                )}

                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Main Category</h4>
                                        <h3>{basicDetails.asset?.main_category?.name || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Sub Category 1</h4>
                                        <h3>{basicDetails.asset?.sub_category_1?.name || "-"}</h3>{" "}
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Sub Category 2</h4>
                                        <h3>{basicDetails.asset?.sub_category_2?.name || "-"}</h3>{" "}
                                    </div>
                                </div>
                                {this.setToolTip(basicDetails?.asset?.sub_category_2?.subcategory2_description, "Sub Category 2 Description")}

                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Sub Category 3</h4>
                                        <h3>{basicDetails.asset?.sub_category_3?.name || "-"}</h3>{" "}
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations top-margin">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Trade</h4>
                                        <h3>{basicDetails.asset?.trade?.name || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>System</h4>
                                        <h3>{basicDetails.asset?.system?.name || "-"}</h3>{" "}
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Sub-System</h4>
                                        <h3>{basicDetails.asset?.sub_system?.name || "-"}</h3>{" "}
                                    </div>
                                </div>
                                <div className="txt-rcm"></div>
                            </div>

                            <div className="outer-rcm recommendations ">
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails?.asset?.survey_id && basicDetails?.asset?.survey_id.toString().length > 20
                                            ? basicDetails?.asset?.survey_id || ""
                                            : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="Asset_details"
                                    data-background-color="#4991ff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Asset Survey Id</h4>
                                        <h3>{basicDetails?.asset?.survey_id || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails?.asset?.survey_property_note && basicDetails?.asset?.survey_property_note.toString().length > 20
                                            ? basicDetails?.asset?.survey_property_note || ""
                                            : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="Asset_details"
                                    data-background-color="#4991ff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Asset Survey Property Notes</h4>
                                        <h3>{basicDetails?.asset?.survey_property_note || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Asset Survey QA/QC Notes</h4>
                                        <h3>{basicDetails?.asset?.qa_notes || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Capacity Status</h4>
                                        <h3>{basicDetails?.asset?.capacity_status || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations ">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Install Year Status</h4>
                                        <h3>{basicDetails?.asset?.installed_year_status || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Name Plate Status</h4>
                                        <h3>{basicDetails?.asset?.name_plate_status || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Asset Survey Additional QA/QC Notes</h4>
                                        <h3>{basicDetails?.asset?.additional_qa_notes || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Asset Survey Date Created</h4>
                                        <h3>{basicDetails?.asset?.survey_date_created || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Asset Survey Surveyor</h4>
                                        <h3>{basicDetails?.asset?.source_panel || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Asset Survey Date Edited</h4>
                                        <h3>{basicDetails?.asset?.survey_date_edited || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Asset Survey Editor</h4>
                                        <h3>{basicDetails?.asset?.editor || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Parent Global ID</h4>
                                        <h3>{basicDetails?.asset?.parent_global_id || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations top-margin">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Is This a New Asset</h4>
                                        <h3>{basicDetails?.asset?.new_asset || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm"></div>
                                <div className="txt-rcm"></div>
                                <div className="txt-rcm"></div>
                            </div>

                            <div className="outer-rcm recommendations  ">
                                <div
                                    className="txt-rcm"
                                    data-tip={basicDetails.asset?.area_served?.toString().length > 20 ? basicDetails.asset?.area_served || "" : ""}
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="recommandation_Asset"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Area Served</h4>
                                        <h3>
                                            {basicDetails.asset?.area_served?.toString().length > 20
                                                ? basicDetails.asset?.area_served?.toString().substring(0, 20) + "..."
                                                : basicDetails.asset?.area_served || "-"}
                                        </h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails.asset?.upstream_asset_barcode_number?.toString().length > 20
                                            ? basicDetails.asset?.upstream_asset_barcode_number || ""
                                            : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="recommandation_Asset"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Upstream Asset Barcode Number</h4>
                                        <h3>{(basicDetails.asset && basicDetails.asset.upstream_asset_barcode_number) || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails.asset.linked_asset_barcode_number &&
                                        basicDetails.asset.linked_asset_barcode_number.toString().length > 20
                                            ? basicDetails.asset.linked_asset_barcode_number || ""
                                            : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="recommandation_Asset"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Linked Asset Barcode Number</h4>
                                        <h3>{(basicDetails.asset && basicDetails.asset.linked_asset_barcode_number) || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Source Panel Name</h4>
                                        <h3>{(basicDetails.asset && basicDetails.asset.source_panel_name) || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations ">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Source Panel Barcode Number</h4>
                                        <h3>{(basicDetails.asset && basicDetails.asset.source_panel_barcode_number) || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Source Panel Emergency/ Normal</h4>
                                        <h3>{(basicDetails.asset && basicDetails.asset.source_panel) || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Skysite Hyperlink</h4>
                                        <h3>{(basicDetails.asset && basicDetails.asset.skysite_hyperlink) || "-"}</h3>
                                    </div>
                                </div>
                                <div
                                    className="txt-rcm"
                                    data-tip={
                                        basicDetails.asset.asset_note && basicDetails.asset.asset_note.toString().length > 20
                                            ? basicDetails.asset.asset_note || ""
                                            : ""
                                    }
                                    data-multiline={true}
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="recommandation_Asset"
                                    data-background-color="#007bff"
                                >
                                    <div className="txt-dtl">
                                        <h4>Asset Notes</h4>
                                        <h3>{(basicDetails.asset && basicDetails.asset.asset_note) || "-"}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="outer-rcm recommendations top-margin">
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Quantity</h4>
                                        <h3>{basicDetails?.asset?.quantity ?? "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Created At</h4>
                                        <h3>{moment(basicDetails.asset.created_at).format("MM-DD-YYYY h:mm A") || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm">
                                    <div className="txt-dtl">
                                        <h4>Updated At</h4>
                                        <h3>{moment(basicDetails.asset.updated_at).format("MM-DD-YYYY h:mm A") || "-"}</h3>
                                    </div>
                                </div>
                                <div className="txt-rcm"></div>
                            </div>
                        </div>
                    )}

                    {this.renderConfirmationModalLog()}
                    {this.renderConfirmationModal()}
                    {this.renderFMPConfirmationModal()}
                    {this.renderIrConfirmationModal()}
                    {this.renderRLConfirmationModal()}
                </div>
                {/* <ReactTooltip /> */}
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
