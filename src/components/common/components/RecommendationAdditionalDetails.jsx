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
import { priorityTooltips, priorityConfig } from "../../../config/utils";
import ShowHelperModal from "../../helper/components/ShowHelperModal";

class BasicDetails extends Component {
    state = {
        isHistoryView: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        showHelperModal: false,
        selectedHelperItem: {},
        budget_priority: false,
        showConfirmModal: false,
        selectedBudgetPriorityData: false
    };

    componentDidMount = async () => {
        await this.setState({
            budget_priority: this.props.basicDetails.budget_priority === "yes" ? true : false
        });
    };

    componentDidUpdate = prevProps => {
        if (prevProps.basicDetails !== this.props.basicDetails) {
            this.setState({
                budget_priority: this.props.basicDetails.budget_priority === "yes" ? true : false
            });
        }
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
                    className={`txt-rcm`}
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
            </Tooltip>
        ) : (
            <div
                className={`txt-rcm`}
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
        this.setState({ budget_priority: selectedBudgetPriorityData });
        this.props.updateBudget({ budget_priority: selectedBudgetPriorityData ? "yes" : "no" }, this.props.match.params.id);
    };

    showConfirmation = e => {
        this.setState({ showConfirmModal: true, selectedBudgetPriorityData: e.target.checked });
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
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.updateBudgetPriority}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
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
            hasInfoPage = true
        } = this.props;
        const { isHistoryView } = this.state;
        return (
            <React.Fragment>
                <ReactTooltip id="recommandation_detils" effect="solid" />
                <div className="tab-active location-sec recom-sec">
                    <div className="otr-edit-delte col-md-12 text-right ed-dl view-narrative-report">
                        <div class="check-area-top mr-3">
                            <label>Budget Priority</label>
                            <input type="checkbox" checked={this.state.budget_priority} onChange={this.showConfirmation}></input>
                        </div>
                        {isNarrativeRecommendation ? (
                            <>
                                <span
                                    onClick={() => {
                                        this.props.downloadPdfReport({
                                            project_id: basicDetails?.project?.id,
                                            building_id: basicDetails?.building?.id,
                                            subsystem_id: basicDetails?.sub_system?.id
                                        });
                                    }}
                                    className="edit-icn-bx"
                                >
                                    <i className="fas fa-file-pdf"></i> View Narrative Report
                                </span>
                                <span onClick={closeInfoPage} className="edit-icn-bx">
                                    <i className="fas fa-window-close"></i> Close
                                </span>
                            </>
                        ) : (
                            <>
                                <span
                                    onClick={() => {
                                        this.props.downloadPdfReport({
                                            project_id: basicDetails?.project?.id,
                                            building_id: basicDetails?.building?.id,
                                            subsystem_id: basicDetails?.sub_system?.id
                                        });
                                    }}
                                    className="edit-icn-bx"
                                >
                                    <i className="fas fa-file-pdf"></i> View Narrative Report
                                </span>
                                {basicDetails && basicDetails.locked === true
                                    ? ""
                                    : hasLogView && (
                                          <span
                                              onClick={() => {
                                                  this.setState({ isHistoryView: !this.state.isHistoryView });
                                              }}
                                              className="edit-icn-bx "
                                          >
                                              <i className="fas fa-history"></i> {isHistoryView ? "View Details" : "View History"}
                                          </span>
                                      )}
                                <span
                                    onClick={() => {
                                        popBreadCrumpData();
                                        popBreadCrumpData();
                                        this.props.history.push(findPrevPathFromBreadCrumpData());
                                    }}
                                    className="edit-icn-bx"
                                >
                                    <i className="fas fa-window-close"></i> Close
                                </span>
                                {basicDetails && basicDetails.locked === true ? (
                                    ""
                                ) : (
                                    <>
                                        {!basicDetails.deleted
                                            ? hasEdit && (
                                                  <span
                                                      className="edit-icn-bx"
                                                      onClick={() => {
                                                          addToBreadCrumpData({
                                                              key: "edit",
                                                              name: `Edit ${this.props.location.pathname.split("/")[1]}`,
                                                              path: `/${this.props.location.pathname.split("/")[1]}/edit/${
                                                                  this.props.match.params.id
                                                              }`
                                                          });
                                                          this.props.history.push(
                                                              `/${this.props.location.pathname.split("/")[1]}/edit/${
                                                                  this.props.match.params.id
                                                              }?p_id=${basicDetails?.project?.id}&c_id=${
                                                                  basicDetails?.client?.id
                                                              }&active_tab=additional`
                                                          );
                                                      }}
                                                  >
                                                      <i className="fas fa-pencil-alt"></i> Edit
                                                  </span>
                                              )
                                            : hasEdit && (
                                                  <span onClick={() => this.props.restoreRecommendation()} className="edit-icn-bx">
                                                      <i className="fas fa-undo"></i> Restore
                                                  </span>
                                              )}
                                        {hasDelete && (
                                            <span
                                                className="edit-icn-bx"
                                                onClick={() => this.props.deleteRecommendation(basicDetails.deleted || false)}
                                            >
                                                <i className="fas fa-trash-alt"></i> Delete
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
                            <div className="outer-rcm recommendations top-margin">
                                {this.setToolTip(basicDetails && basicDetails.trade.name && basicDetails.trade.name, "Trade")}
                                {this.setToolTip(
                                    basicDetails && basicDetails.system && basicDetails.system.name && basicDetails.system.name,
                                    "System"
                                )}
                                {this.setToolTip(
                                    basicDetails && basicDetails.sub_system && basicDetails.sub_system.name && basicDetails.sub_system.name,
                                    "Sub-System"
                                )}
                                {this.setToolTip(
                                    basicDetails && basicDetails.category && basicDetails.category.name && basicDetails.category.name,
                                    "Category"
                                )}
                            </div>

                            {basicDetails.recommendation_type === "building" && (
                                <div className="outer-rcm recommendations top-margin">
                                    {this.setToolTip(basicDetails && basicDetails.installed_year && basicDetails.installed_year, "Installed Year")}
                                    <div
                                        className="txt-rcm"
                                        data-tip={
                                            basicDetails.service_life && basicDetails.service_life.toString().length > 20
                                                ? basicDetails.service_life || ""
                                                : ""
                                        }
                                        data-multiline={true}
                                        data-place="left"
                                        data-effect="solid"
                                        data-background-color="#4991ff"
                                    >
                                        <div className="txt-dtl">
                                            <h4>Service Life</h4>
                                            <h3>
                                                {basicDetails.service_life && basicDetails.service_life.toString().length > 20
                                                    ? basicDetails.service_life.toString().substring(0, 20) + "..."
                                                    : basicDetails.service_life || "-"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="txt-rcm">
                                        <div className="txt-dtl">
                                            <h4>Useful Life Remaining</h4>
                                            <h3>{basicDetails.usefull_life_remaining || "-"}</h3>
                                        </div>
                                    </div>
                                    <div className="txt-rcm">
                                        <div className="txt-dtl">
                                            <h4>CRV</h4>
                                            <h3>
                                                <NumberFormat
                                                    value={parseInt(basicDetails.crv || 0)}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                />
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="outer-rcm recommendations top-margin prior-outer">
                                {basicDetails.priority_elements.map((item, i) => (
                                    <div key={i} className="txt-rcm">
                                        {priorityConfig && priorityConfig[i] ? (
                                            <div
                                                className="txt-dtl"
                                                data-tip={priorityTooltips[i] || ""}
                                                data-for="recommandation_detils"
                                                data-place="top"
                                                data-html={true}
                                            >
                                                <h4 className="fs-13">{priorityConfig[i].label}</h4>
                                                <h3 className="fs-13">{this.findPriorityText(parseInt(item.element), priorityConfig[i].options)}</h3>
                                            </div>
                                        ) : (
                                            <div
                                                className="txt-dtl"
                                                data-tip={priorityTooltips[i] || ""}
                                                data-for="recommandation_detils"
                                                data-place="top"
                                                data-html={true}
                                            >
                                                <h4 className="fs-13">Priority {item.index}</h4>
                                                <h3 className="fs-13">{parseInt(item.element) || "-"}</h3>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="outer-rcm top-margin">
                                {/* {this.setToolTip(basicDetails.building && basicDetails.building.ministry, "Ministry")} */}
                                {this.setToolTip(basicDetails && basicDetails.priority && basicDetails.priority, "Priority Total")}
                                {/* {this.setToolTip(basicDetails && basicDetails.capital_type && basicDetails.capital_type, "Capital Type")} */}
                                <div className="txt-rcm ">
                                    <div
                                        data-tip={
                                            basicDetails.consultancy && basicDetails.consultancy.name ? basicDetails.consultancy.name || "" : ""
                                        }
                                        data-multiline={true}
                                        data-place="left"
                                        data-effect="solid"
                                        data-background-color="#4991ff"
                                    >
                                        <div className="txt-dtl">
                                            <h4>Capital Type</h4>
                                            {basicDetails && basicDetails.capital_type ? (
                                                <h3>
                                                    {basicDetails.capital_type === "NI"
                                                        ? "Non-Infrastructure"
                                                        : basicDetails.capital_type === "DM"
                                                        ? "Deferred Maintenance"
                                                        : basicDetails.capital_type === "FC"
                                                        ? "Future Capital"
                                                        : "-"}
                                                </h3>
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {this.setToolTip(
                                    basicDetails && basicDetails.funding_source && basicDetails.funding_source && basicDetails.funding_source.name,
                                    "Funding"
                                )}
                                <div className="txt-rcm ">
                                    <div
                                        data-tip={
                                            basicDetails.consultancy && basicDetails.consultancy.name ? basicDetails.consultancy.name || "" : ""
                                        }
                                        data-multiline={true}
                                        data-place="left"
                                        data-effect="solid"
                                        data-background-color="#4991ff"
                                    >
                                        <div className="txt-dtl">
                                            <h4>Consultancy</h4>
                                            <h3>{basicDetails.consultancy ? basicDetails.consultancy.name : ""}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row top-margin last-row-main">
                                <div className="outer-rcm">
                                    <div
                                        className="txt-rcm"
                                        data-tip={basicDetails.surveyor && basicDetails.surveyor.length > 20 ? basicDetails.surveyor || "" : ""}
                                        data-multiline={true}
                                        data-place="left"
                                        data-effect="solid"
                                        data-background-color="#4991ff"
                                    >
                                        <div>
                                            <img src="/img/icn1.png" alt="" />
                                        </div>
                                        <div className="txt-secn">
                                            <h4>Surveyor</h4>
                                            <h3>
                                                {basicDetails && basicDetails.surveyor && basicDetails.surveyor.length > 20
                                                    ? basicDetails.surveyor.substring(0, 20) + "..."
                                                    : basicDetails.surveyor || "-"}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="outer-rcm">
                                    <div className="txt-rcm">
                                        <div>
                                            <img src="/img/icn-2.png" alt="" />
                                        </div>
                                        <div className="txt-secn">
                                            <h4>Inspection Date</h4>
                                            <h3>
                                                {(basicDetails.inspection_date && moment(basicDetails.inspection_date).format("MM-DD-YYYY")) || "-"}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="outer-rcm">
                                    <div className="txt-rcm">
                                        <div>
                                            <img src="/img/icn-3.png" alt="" />
                                        </div>
                                        <div className="txt-secn">
                                            <h4>Inspection Time</h4>
                                            <h3>{basicDetails.inspection_time || "-"}</h3>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-md-3 add-dtl-rcm">
                                    <div className="outer-rcm">
                                        <div
                                            className="txt-rcm notes-height"
                                            data-tip={
                                                basicDetails.essential && basicDetails.essential.length > 20 ? basicDetails.essential || "" : ""
                                            }
                                            data-multiline={true}
                                            data-place="left"
                                            data-effect="solid"
                                            data-background-color="#4991ff"
                                        >
                                            <div className="txt-dtl">
                                                <h4>Essential</h4>
                                                <h3>
                                                    {basicDetails.essential && basicDetails.essential.length > 20
                                                        ? basicDetails.essential.substring(0, 20) + "..."
                                                        : basicDetails.essential || "-"}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="outer-rcm">
                                    <div className="txt-rcm">
                                        <div>
                                            <img src="/img/icn-3.png" alt="" />
                                        </div>
                                        <div className="txt-secn">
                                            <h4>Created At</h4>
                                            <h3>{moment(basicDetails.created_at).format("MM-DD-YYYY h:mm A") || "-"}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="outer-rcm">
                                    <div className="txt-rcm">
                                        <div>
                                            <img src="/img/icn-3.png" alt="" />
                                        </div>
                                        <div className="txt-secn">
                                            <h4>Updated At</h4>
                                            <h3>{moment(basicDetails.updated_at).format("MM-DD-YYYY h:mm A") || "-"}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {this.renderConfirmationModalLog()}
                    {this.renderConfirmationModal()}
                </div>
                {/* <ReactTooltip /> */}
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
