import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import ReactTooltip from "react-tooltip";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import Portal from "../../../common/components/Portal";
import ImageFullViewModal from "../../../common/components/ImageComponents/ImageViewModal";
import { addToBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrumpRecData, findPrevPathFromBreadCrumpData } from "../../../../config/utils";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import EditHistory from "../../../region/components/EditHistory";
import history from "../../../../config/history";
import ShowHelperModal from "../../../helper/components/ShowHelperModal";
import moment from "moment";
import { Dropdown } from "react-bootstrap";
import Loader from "../../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import ImageForm from "../../../common/components/ImageComponents/ImageForm";
import { getFutureCapitalBySite } from "../../../project/services";
import RecommendationNoteView from "../../../common/components/RecommendationNoteView";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { Band } from "./Band";
import { energy_fields } from "../Bands/EnergyBand";
import { water_fields } from "../Bands/WaterBand";

const editorConfiguration = {
    toolbar: [
        // "fontFamily",
        // "fontSize",
        // "|",
        // "bold",
        // "italic",
        // "underLine",
        // "|",
        // "alignment:left",
        // "alignment:right",
        // "alignment:center",
        // "alignment:justify",
        // "|",
        // "bulletedList",
        // "numberedList",
        // "|",
        // // "outdent",
        // // "indent",
        // "highlight",
        // "|",
        // "undo",
        // "redo"
        // "heading"
    ],
    removePlugins: ["Title", "ListStyle"],
    alignment: {
        options: ["left", "right", "center", "justify"]
    },
    highlight: {
        options: [
            { model: "yellowMarker", class: "marker-yellow", title: "Yellow marker", color: "var(--ck-highlight-marker-yellow)", type: "marker" },
            { model: "greenMarker", class: "marker-green", title: "Green marker", color: "#32CD32", type: "marker" },
            { model: "pinkMarker", class: "marker-pink", title: "Pink marker", color: "#FF00FF", type: "marker" },
            { model: "blueMarker", class: "marker-blue", title: "Blue marker", color: "#0000FF", type: "marker" }
        ]
    },
    placeholder: "Type Here..."
};

class BasicDetails extends Component {
    constructor(props) {
        super(props);
        this.templateRef = React.createRef();
        this.state = {
            showImageModal: false,
            isHistoryView: false,
            showConfirmModalLog: false,
            selectedLog: "",
            logChanges: {},
            associated_changes: [],
            showHelperModal: false,
            selectedHelperItem: {},
            showConfirmModal: false,
            selectedBudgetPriorityData: false,
            selectedFMP: false,
            showFMPConfirmModal: false,
            showIrConfirmModal: false,
            selectedIr: false,
            exportLoader: false,
            showRLConfirmModal: false,
            selectedRL: false,
            showImageEditModal: false,
            showNoteModal: false,
            editorHeight: this.props.basicDetails?.recommendation_type === "asset" ? "253" : "188",
            showBand: false
        };
    }

    openImageModal = () => {
        this.setState({
            showImageModal: true
        });
    };
    openReportNote = () => {
        this.setState({
            showNoteModal: true
        });
    };

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
                    className="codeOtr"
                    data-tip={basicDetails && basicDetails.length > 20 ? basicDetails || "" : ""}
                    data-multiline={true}
                    data-place="left"
                    data-effect="solid"
                    data-background-color="#4991ff"
                >
                    <h4>{name}</h4>
                    <h3>{basicDetails && basicDetails.length > 20 ? basicDetails.substring(0, 20) + "..." : basicDetails || "-"}</h3>
                </div>
            </Tooltip>
        ) : (
            <div
                className="codeOtr"
                data-tip={basicDetails && basicDetails.length > 20 ? basicDetails || "" : ""}
                data-multiline={true}
                data-place="left"
                data-effect="solid"
                data-background-color="#4991ff"
            >
                <h4>{name}</h4>
                <h3>{basicDetails && basicDetails.length > 20 ? basicDetails.substring(0, 20) + "..." : basicDetails || "-"}</h3>
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
        this.setState({ showConfirmModalLog: false, isHistoryView: false });
        const { selectedLog } = this.state;
        await this.props.HandleRestoreSettingsLog(selectedLog);
        await this.props.refreshinfoDetails();
        // await this.getLogData(this.props.match.params.id)
        // await this.props.getMenuItems();
        this.setState({
            selectedLog: null
        });
    };

    editClick = basicDetails => {
        if (this.props.match.params.id && basicDetails.project && basicDetails.project.id) {
            addToBreadCrumpData({
                key: "edit",
                name: `Edit ${this.props.location.pathname.split("/")[1]}`,
                path: `/recommendations/edit/${this.props.match.params.id}?p_id=${basicDetails.project.id}&c_id=${basicDetails.client.id}`
            });
            this.props.history.push(
                `/recommendations/edit/${this.props.match.params.id}?p_id=${basicDetails.project.id}&c_id=${basicDetails.client.id}`
            );
        }
    };
    editClick_one = async basicDetails => {
        await this.props.showEditPage(basicDetails.id);
        await this.props.updateSelectedRow(basicDetails.id);
    };

    componentDidMount() {
        ReactTooltip.rebuild();
    }
    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

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
                                ? "Do you want to remove from Infrastructure Request ?"
                                : "Do you want to add to Infrastructure Request ?"
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

    findPriorityText = (value, options = []) => {
        let text = "-";
        let priorityObj = options.find(option => option.id === value);
        if (priorityObj) {
            text = priorityObj.name;
        } else if (value) {
            text = value;
        }
        return text;
    };

    renderPriorityElementToolTip = (name, options = [], notes, index = "") => {
        let tootTipData = "";
        if (options.length) {
            tootTipData = `<h4>${name ? name : `Priority Element ${index + 1}`}</h4>`;
            if (notes) {
                tootTipData = tootTipData + `<p>${notes}</p>`;
            }
            options.map((option, i) => {
                tootTipData = tootTipData + `<p>${option.name}</p>`;
            });
        }
        return tootTipData || null;
    };

    exportRecommendation = basicDetails => {
        let params = {};
        params.recommendation_id = basicDetails.id;
        params.username = localStorage.getItem("user");
        if (basicDetails.fmp === "yes") {
            params.fmp = "True";
        }
        if (basicDetails.budget_priority === "yes") {
            params.budget_priority = "True";
        }
        if (basicDetails.infrastructure_request === "yes") {
            params.ir = "True";
        }
        this.props.postExport(params);
    };

    updateImage = async imageData => {
        await this.props.updateImageComment(imageData);
        if (this.props.refreshinfoDetails) {
            await this.props.refreshinfoDetails();
        }
    };

    handleEditImage = () => {
        this.setState({ showImageEditModal: true });
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.showBand !== this.state.showBand || prevProps.basicDetails !== this.props.basicDetails) {
            setTimeout(() => {
                let height = this.templateRef?.current?.clientHeight - 340;
                this.setState({ editorHeight: height });
            }, 500);
        }
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
            updateLogSortFilters,
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
        const { showImageModal, isHistoryView } = this.state;
        const is_infrastructure_request_user = localStorage.getItem("infrastructure_request_user") === "yes" ? true : false;
        const is_fmp_user = localStorage.getItem("fmp_user") === "yes" ? true : false;
        return (
            // <LoadingOverlay active={this.state.exportLoader} spinner={<Loader />} fadeSpeed={10}>
            <React.Fragment>
                {/* <div className="tab-active location-sec recom-sec main-dtl recommendation-form add-recommendation"> */}
                <ReactTooltip id="recommandation_detils" place="bottom" effect="solid" backgroundColor="#007bff" />
                <div
                    className={`tab-active location-sec recom-sec main-dtl recommendation-form add-recommendation ${
                        basicDetails?.recommendation_type === "asset" ? " " : "building-type"
                    }`}
                >
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
                            <div className="budget-pr mr-2">
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
                            <div className="budget-pr mr-0">
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
                            {/* <div >
                               
                                   <button onClick={()=>this.props.postExport({recommendation_id:this.props.match.params.id})}>
                                    export
                                   </button>
                            </div> */}
                            {this.props.exportLoader ? (
                                <span className="edit-icn-bx icon-btn-sec">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </span>
                            ) : (
                                <span
                                    onClick={() => {
                                        this.exportRecommendation(basicDetails);
                                    }}
                                    className="edit-icn-bx icon-btn-sec"
                                    data-tip="Export"
                                    data-for="recommandation_detils"
                                    data-place="bottom"
                                >
                                    <img src="/img/export-rec.svg" alt="" />
                                </span>
                            )}

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
                                        data-for="recommandation_detils"
                                        data-place="top"
                                    >
                                        <img src="/img/narrative-rec.svg" alt="" />
                                    </span> */}
                                    <span
                                        className="edit-icn-bx icon-btn-sec"
                                        onClick={() => this.editClick_one(basicDetails)}
                                        data-tip="Edit"
                                        data-for="recommandation_detils"
                                        data-place="bottom"
                                    >
                                        <img src="/img/edit-rec.svg" alt="" />
                                    </span>
                                    <span
                                        onClick={closeInfoPage}
                                        className="edit-icn-bx icon-btn-sec"
                                        data-tip="Close"
                                        data-for="recommandation_detils"
                                        data-place="bottom"
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
                                        data-for="recommandation_detils"
                                        data-place="top"
                                    >
                                        <img src="/img/narrative-rec.svg" alt="" />
                                    </span> */}
                                    {hasLogView && (
                                        <span
                                            onClick={() => {
                                                this.setState({ isHistoryView: !this.state.isHistoryView });
                                            }}
                                            className="edit-icn-bx icon-btn-sec"
                                            data-tip={isHistoryView ? "View Details" : "View History"}
                                            data-for="recommandation_detils"
                                            data-place="bottom"
                                        >
                                            <img src="/img/history-rec.svg" alt="" />
                                        </span>
                                    )}
                                    <span
                                        onClick={async () => {
                                            await popBreadCrumpData();
                                            await popBreadCrumpData();
                                            await history.push(findPrevPathFromBreadCrumpData());
                                        }}
                                        className="edit-icn-bx icon-btn-sec"
                                        data-tip="Close"
                                        data-for="recommandation_detils"
                                        data-place="bottom"
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
                                                          onClick={() => this.editClick(basicDetails)}
                                                          data-tip="Edit"
                                                          data-for="recommandation_detils"
                                                          data-place="bottom"
                                                      >
                                                          <img src="/img/edit-rec.svg" alt="" />
                                                      </span>
                                                  )
                                                : hasEdit && (
                                                      <span
                                                          onClick={() => this.props.restoreRecommendation()}
                                                          className="edit-icn-bx icon-btn-sec"
                                                          data-tip="Restore"
                                                          data-for="recommandation_detils"
                                                          data-place="bottom"
                                                      >
                                                          <img src="/img/restore-reco.svg" alt="" />
                                                      </span>
                                                  )}
                                            {hasDelete && (
                                                <span
                                                    onClick={() => this.props.deleteRecommendation(basicDetails.deleted || false)}
                                                    className="edit-icn-bx icon-btn-sec del"
                                                    data-tip="Delete"
                                                    data-for="recommandation_detils"
                                                    data-place="bottom"
                                                >
                                                    <img src="/img/delete-icon.svg" alt="" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                    <span
                                        className="view-inner help-icon"
                                        data-tip={`Help`}
                                        data-for="recommandation_detils"
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
                            <div class="outer-rcm recommendations">
                                <div class="cnt-sec">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <div id="accordion" ref={this.templateRef}>
                                                <div class="card">
                                                    <div class="card-header" id="headingOne">
                                                        <div className="otr-recom-div">
                                                            <button
                                                                class="btn btn-link"
                                                                data-toggle="collapse"
                                                                onClick={() => this.setState({ showBand: !this.state.showBand })}
                                                                data-target="#collapseOne"
                                                                aria-expanded="true"
                                                                aria-controls="collapseOne"
                                                            >
                                                                Recommendation
                                                            </button>

                                                            <div class="col-md-3 basic-box">
                                                                {this.setToolTip(
                                                                    basicDetails && basicDetails.trade.name && basicDetails.trade.name,
                                                                    "Trade"
                                                                )}{" "}
                                                            </div>
                                                            <div class="col-md-3 basic-box">
                                                                {this.setToolTip(
                                                                    basicDetails &&
                                                                        basicDetails.system &&
                                                                        basicDetails.system.name &&
                                                                        basicDetails.system.name,
                                                                    "System"
                                                                )}
                                                            </div>
                                                            <div class="col-md-3 basic-box">
                                                                {this.setToolTip(
                                                                    basicDetails &&
                                                                        basicDetails.sub_system &&
                                                                        basicDetails.sub_system.name &&
                                                                        basicDetails.sub_system.name,
                                                                    "Sub-System"
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne">
                                                        <div class="card-body">
                                                            <div class="outer-rcm mt-1 basic-dtl-otr p-0">
                                                                <div class="col-md-12 basic-box">
                                                                    <div class="codeOtr">
                                                                        <h4>Recommendation</h4>
                                                                        <h3>{(basicDetails && basicDetails.description) || "-"}</h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="card">
                                                    <div class="card-header" id="headingtwo">
                                                        <div className="otr-recom-div">
                                                            <button
                                                                class="btn btn-link"
                                                                data-toggle="collapse"
                                                                onClick={() => this.setState({ showBand: !this.state.showBand })}
                                                                data-target="#collapseTwo"
                                                                aria-expanded="true"
                                                                aria-controls="collapseOne"
                                                            >
                                                                Geo Hierarchy
                                                            </button>

                                                            <div class="col-md-3 basic-box">
                                                                {this.setToolTip(basicDetails.region && basicDetails.region.name, "Region")}
                                                            </div>
                                                            <div class="col-md-3 basic-box">
                                                                {this.setToolTip(basicDetails.site && basicDetails.site.name, "Site")}
                                                            </div>
                                                            <div class="col-md-3 basic-box">
                                                                <Tooltip
                                                                    placement="left"
                                                                    overlay={`${basicDetails?.building?.name || ""} (${
                                                                        basicDetails?.building?.building_description || ""
                                                                    })`}
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
                                                                        className="codeOtr"
                                                                        data-tip={basicDetails?.building?.building_description || ""}
                                                                        data-multiline={true}
                                                                        data-place="left"
                                                                        data-effect="solid"
                                                                        data-background-color="#4991ff"
                                                                    >
                                                                        <h4>Building</h4>
                                                                        <h3>
                                                                            {basicDetails?.building?.name?.length > 20
                                                                                ? basicDetails?.building?.name?.substring(0, 20) + "..."
                                                                                : basicDetails?.building?.name || "-"}
                                                                        </h3>
                                                                    </div>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="collapseTwo" class="collapse show" aria-labelledby="headingtwo">
                                                        <div class="card-body">
                                                            <div class="outer-rcm basic-dtl-otr p-0">
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(
                                                                        basicDetails.building && basicDetails.building.building_type,
                                                                        "Building Type"
                                                                    )}
                                                                </div>{" "}
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails?.addition?.name, "Addition")}
                                                                </div>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(
                                                                        basicDetails.floor && basicDetails.floor.name && basicDetails.floor.name,
                                                                        "Floor"
                                                                    )}
                                                                </div>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails && basicDetails.room && basicDetails.room, "Room")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {basicDetails.project?.display_unit ? (
                                                    <div class="card">
                                                        <div class="card-header" id="headingTre">
                                                            <div className="otr-recom-div">
                                                                <button
                                                                    class="btn btn-link"
                                                                    data-toggle="collapse"
                                                                    onClick={() => this.setState({ showBand: !this.state.showBand })}
                                                                    data-target="#collapseTre"
                                                                    aria-expanded="false"
                                                                    aria-controls="collapseOne"
                                                                >
                                                                    Capital Spending Plan
                                                                </button>
                                                                <div class="txt-rcm ">
                                                                    <div class="content-inp-card blue-sec">
                                                                        <h3 class="p-name">Project Total</h3>
                                                                        <h3 class="value">
                                                                            <NumberFormat
                                                                                className="color-white"
                                                                                value={parseInt(basicDetails.project_total || 0)}
                                                                                thousandSeparator={true}
                                                                                displayType={"text"}
                                                                                prefix={"$ "}
                                                                            />
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                                {basicDetails.project?.display_unit && (
                                                                    <>
                                                                        <div className="txt-rcm">
                                                                            <div class="content-inp-card">
                                                                                <div class="form-group text-center">
                                                                                    <h4>Unit</h4>
                                                                                    <h3>{basicDetails.unit || "-"}</h3>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="txt-rcm">
                                                                            <div class="content-inp-card">
                                                                                <div class="form-group text-center">
                                                                                    <h4>Cost per Unit</h4>
                                                                                    <h3>
                                                                                        <NumberFormat
                                                                                            value={parseInt(basicDetails.cost_per_unit || 0)}
                                                                                            thousandSeparator={true}
                                                                                            displayType={"text"}
                                                                                            prefix={"$ "}
                                                                                        />
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div id="collapseTre" class="collapse" aria-labelledby="headingTre">
                                                            <div class="card-body add-sec">
                                                                <div class="outer-rcm mt-1">
                                                                    <div class="txt-rcm">
                                                                        <div class="content-inp-card">
                                                                            <div class="form-group text-center">
                                                                                <h4>Quantity</h4>
                                                                                <h3>
                                                                                    <NumberFormat
                                                                                        value={parseInt(basicDetails.quantity || 0)}
                                                                                        thousandSeparator={true}
                                                                                        displayType={"text"}
                                                                                    />
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="txt-rcm ">
                                                                        <div class="content-inp-card">
                                                                            <div class="form-group text-center">
                                                                                <h4>Opinions of Cost</h4>
                                                                                <h3>
                                                                                    <NumberFormat
                                                                                        value={parseInt(basicDetails.options_cost || 0)}
                                                                                        thousandSeparator={true}
                                                                                        displayType={"text"}
                                                                                        prefix={"$ "}
                                                                                    />
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {basicDetails.maintenance_years.map((item, i) => (
                                                                        <div class="txt-rcm ">
                                                                            <div class="content-inp-card">
                                                                                <div class="form-group text-center">
                                                                                    <h4>{item.year}</h4>
                                                                                    <h3>
                                                                                        <NumberFormat
                                                                                            value={parseInt(item.amount || 0)}
                                                                                            thousandSeparator={true}
                                                                                            displayType={"text"}
                                                                                            prefix={"$ "}
                                                                                        />
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div class="card">
                                                        <div class="card-header" id="headingTre">
                                                            <div className="otr-recom-div">
                                                                <button
                                                                    class="btn btn-link"
                                                                    data-toggle="collapse"
                                                                    onClick={() => this.setState({ showBand: !this.state.showBand })}
                                                                    data-target="#collapseTre"
                                                                    aria-expanded="false"
                                                                    aria-controls="collapseOne"
                                                                >
                                                                    Capital Spending Plan
                                                                </button>
                                                                <div class="txt-rcm ">
                                                                    <div class="content-inp-card blue-sec">
                                                                        <h3 class="p-name">Project Total</h3>
                                                                        <h3 class="value">
                                                                            <NumberFormat
                                                                                className="color-white"
                                                                                value={parseInt(basicDetails.project_total || 0)}
                                                                                thousandSeparator={true}
                                                                                displayType={"text"}
                                                                            />
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                                {basicDetails.maintenance_years.map((item, i) => {
                                                                    return (
                                                                        <>
                                                                            {(i === 0 || i === 1) && (
                                                                                <div class="txt-rcm ">
                                                                                    <div class="content-inp-card">
                                                                                        <div class="form-group text-center">
                                                                                            <h4>{item.year}</h4>
                                                                                            <h3>
                                                                                                <NumberFormat
                                                                                                    value={parseInt(item.amount || 0)}
                                                                                                    thousandSeparator={true}
                                                                                                    displayType={"text"}
                                                                                                    prefix={"$ "}
                                                                                                />
                                                                                            </h3>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        <div id="collapseTre" class="collapse" aria-labelledby="headingTre">
                                                            <div class="card-body add-sec">
                                                                <div class="outer-rcm mt-1">
                                                                    {basicDetails.maintenance_years.map((item, i) => {
                                                                        return (
                                                                            <>
                                                                                {i !== 0 && i !== 1 && (
                                                                                    <div class="txt-rcm ">
                                                                                        <div class="content-inp-card">
                                                                                            <div class="form-group text-center">
                                                                                                <h4>{item.year}</h4>
                                                                                                <h3>
                                                                                                    <NumberFormat
                                                                                                        value={parseInt(item.amount || 0)}
                                                                                                        thousandSeparator={true}
                                                                                                        displayType={"text"}
                                                                                                        prefix={"$ "}
                                                                                                    />
                                                                                                </h3>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div class="card">
                                                    <div class="card-header" id="headingFour">
                                                        <div className="otr-recom-div">
                                                            <button
                                                                class="btn btn-link"
                                                                data-toggle="collapse"
                                                                onClick={() => this.setState({ showBand: !this.state.showBand })}
                                                                data-target="#collapseFour"
                                                                aria-expanded="false"
                                                                aria-controls="collapseOne"
                                                            >
                                                                Priority
                                                            </button>
                                                            <div class="txt-rcm ">
                                                                <div class="content-inp-card blue-sec">
                                                                    <h3 class="p-name">Priority Total</h3>
                                                                    <h3 class="value">{(basicDetails && basicDetails.priority) || 0}</h3>
                                                                </div>
                                                            </div>

                                                            {basicDetails.priority_elements_data?.map((item, i) => {
                                                                return (
                                                                    <>
                                                                        {(i === 0 || i === 1) && (
                                                                            <div key={i} className="col-md-3 basic-box">
                                                                                {item.options?.length ? (
                                                                                    <div
                                                                                        className="codeOtr"
                                                                                        data-tip={this.renderPriorityElementToolTip(
                                                                                            item.display_name,
                                                                                            item.options,
                                                                                            item.notes,
                                                                                            i
                                                                                        )}
                                                                                        data-for="recommandation_detils"
                                                                                        data-place="top"
                                                                                        data-html={true}
                                                                                    >
                                                                                        <h4 className="fs-13">
                                                                                            {item.display_name || `Priority Element ${i + 1}`}
                                                                                        </h4>
                                                                                        <h3 className="fs-13">
                                                                                            {this.findPriorityText(
                                                                                                basicDetails.priority_elements[i]?.option_id,
                                                                                                item.options
                                                                                            )}
                                                                                        </h3>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="codeOtr">
                                                                                        <h4 className="fs-13">
                                                                                            {item.display_name || `Priority Element ${i + 1}`}
                                                                                        </h4>
                                                                                        <h3 className="fs-13">
                                                                                            {parseInt(basicDetails.priority_elements[i]?.element) ||
                                                                                                "-"}
                                                                                        </h3>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                );
                                                            })}
                                                            {!basicDetails.priority_elements_data?.length ? (
                                                                <div className="col-md-3 basic-box border-right-last">
                                                                    <div
                                                                        className="codeOtr"
                                                                        data-for="recommandation_detils"
                                                                        data-place="top"
                                                                        data-html={true}
                                                                    >
                                                                        <h4 className="fs-13">Criticality</h4>
                                                                        <h3 className="fs-13">{basicDetails?.criticality?.name || "-"}</h3>
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div id="collapseFour" class="collapse" aria-labelledby="headingFour">
                                                        <div class="card-body">
                                                            <div class="outer-rcm mt-1 basic-dtl-otr p-0">
                                                                {basicDetails.priority_elements_data?.map((item, i) => {
                                                                    return (
                                                                        <>
                                                                            {i !== 0 && i !== 1 && (
                                                                                <div key={i} className="col-md-3 basic-box">
                                                                                    {item.options?.length ? (
                                                                                        <div
                                                                                            className="codeOtr"
                                                                                            data-tip={this.renderPriorityElementToolTip(
                                                                                                item.display_name,
                                                                                                item.options,
                                                                                                item.notes,
                                                                                                i
                                                                                            )}
                                                                                            data-for="recommandation_detils"
                                                                                            data-place="top"
                                                                                            data-html={true}
                                                                                        >
                                                                                            <h4 className="fs-13">
                                                                                                {item.display_name || `Priority Element ${i + 1}`}
                                                                                            </h4>
                                                                                            <h3 className="fs-13">
                                                                                                {this.findPriorityText(
                                                                                                    basicDetails.priority_elements[i]?.option_id,
                                                                                                    item.options
                                                                                                )}
                                                                                            </h3>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="codeOtr">
                                                                                            <h4 className="fs-13">
                                                                                                {item.display_name || `Priority Element ${i + 1}`}
                                                                                            </h4>
                                                                                            <h3 className="fs-13">
                                                                                                {parseInt(
                                                                                                    basicDetails.priority_elements[i]?.element
                                                                                                ) || "-"}
                                                                                            </h3>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    );
                                                                })}
                                                                {basicDetails.priority_elements_data?.length ? (
                                                                    <div className="col-md-3 basic-box">
                                                                        <div
                                                                            className="codeOtr"
                                                                            data-for="recommandation_detils"
                                                                            data-place="top"
                                                                            data-html={true}
                                                                        >
                                                                            <h4 className="fs-13">Criticality</h4>
                                                                            <h3 className="fs-13">{basicDetails?.criticality?.name || "-"}</h3>
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {basicDetails?.recommendation_type === "asset" && (
                                                    <div class="card">
                                                        <div class="card-header" id="headingFive">
                                                            <div className="otr-recom-div">
                                                                <button
                                                                    class="btn btn-link"
                                                                    data-toggle="collapse"
                                                                    onClick={() => this.setState({ showBand: !this.state.showBand })}
                                                                    data-target="#collapseFive"
                                                                    aria-expanded="false"
                                                                    aria-controls="collapseOne"
                                                                >
                                                                    Asset
                                                                </button>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails?.asset?.asset_name, "Asset Name")}
                                                                </div>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails?.asset?.asset_condition?.name, "Asset Condition")}
                                                                </div>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails?.asset?.asset_tag, "Asset Tag")}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div id="collapseFive" class="collapse" aria-labelledby="headingFive">
                                                            <div class="card-body">
                                                                <div class="outer-rcm mt-1  basic-dtl-otr p-0">
                                                                    {/* <div class="col-md-3 basic-box">
                                                                        {this.setToolTip(basicDetails.asset?.manufacturer, "Manufacturer")}
                                                                    </div> */}
                                                                    <div className="col-md-3 basic-box">
                                                                        <div class="codeOtr">
                                                                            <h4>Serial Number</h4>
                                                                            {basicDetails && basicDetails.asset?.serial_number ? (
                                                                                <h3>{basicDetails.asset?.serial_number || "-"}</h3>
                                                                            ) : (
                                                                                "-"
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3 basic-box">
                                                                        <div class="codeOtr">
                                                                            <h4>Installed Year</h4>
                                                                            {basicDetails && basicDetails.asset?.installed_year ? (
                                                                                <h3>{basicDetails.asset?.installed_year || "-"}</h3>
                                                                            ) : (
                                                                                "-"
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-3 basic-box">
                                                                        {this.setToolTip(basicDetails.asset?.service_life, "Service Life")}
                                                                    </div>
                                                                    <div class="col-md-3 basic-box">
                                                                        <div
                                                                            className="codeOtr"
                                                                            data-tip={
                                                                                basicDetails.asset?.usefull_life_remaining
                                                                                    ? `Year= ${
                                                                                          new Date().getFullYear() +
                                                                                          basicDetails.asset?.usefull_life_remaining
                                                                                      }`
                                                                                    : ""
                                                                            }
                                                                            data-for="recommandation_detils"
                                                                            data-place="top"
                                                                            data-html={true}
                                                                        >
                                                                            <h4>Useful Life Remaining</h4>
                                                                            <h3>{basicDetails.asset?.usefull_life_remaining}</h3>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="col-md-3 basic-box"></div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {basicDetails?.fmp === "yes" && (
                                                    <div class="card">
                                                        <div class="card-header" id="headingSeven">
                                                            <div className="otr-recom-div">
                                                                <button
                                                                    class="btn btn-link"
                                                                    data-toggle="collapse"
                                                                    onClick={() => this.setState({ showBand: !this.state.showBand })}
                                                                    data-target="#collapseSeven"
                                                                    aria-expanded="false"
                                                                    aria-controls="collapseOne"
                                                                >
                                                                    Facility Master Plan
                                                                </button>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails?.fmp_id, "FMP ID")}
                                                                </div>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails?.fmp_project, "FMP Project")}
                                                                </div>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails?.fmp_track, "FMP Track")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div id="collapseSeven" class="collapse" aria-labelledby="headingSeven">
                                                            <div class="card-body"></div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div class="card">
                                                    <div class="card-header" id="headingSix">
                                                        <div className="otr-recom-div">
                                                            <button
                                                                class="btn btn-link"
                                                                data-toggle="collapse"
                                                                onClick={() => this.setState({ showBand: !this.state.showBand })}
                                                                data-target="#collapseSix"
                                                                aria-expanded="false"
                                                                aria-controls="collapseOne"
                                                            >
                                                                Additional Details
                                                            </button>
                                                            {basicDetails?.recommendation_type === "building" ? (
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails && basicDetails.condition?.name, "Condition")}
                                                                </div>
                                                            ) : (
                                                                <div class="col-md-3 basic-box">
                                                                    <div class="codeOtr">
                                                                        <h4>Status</h4>
                                                                        <h3>
                                                                            {basicDetails &&
                                                                            basicDetails.status &&
                                                                            basicDetails.status === "in_progress"
                                                                                ? "In Progress"
                                                                                : basicDetails.status === "on_hold"
                                                                                ? "On Hold"
                                                                                : basicDetails.status.charAt(0).toUpperCase() +
                                                                                  basicDetails.status.slice(1)}
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div class="col-md-3 basic-box">
                                                                {this.setToolTip(
                                                                    basicDetails &&
                                                                        basicDetails.category &&
                                                                        basicDetails.category.name &&
                                                                        basicDetails.category.name,
                                                                    "Category"
                                                                )}
                                                            </div>
                                                            <div className="col-md-3 basic-box">
                                                                <div class="codeOtr">
                                                                    <h4>Capital Type</h4>

                                                                    {basicDetails && basicDetails.capital_type_display_name ? (
                                                                        <h3>{basicDetails.capital_type_display_name}</h3>
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="collapseSix" class="collapse" aria-labelledby="headingSix">
                                                        <div class="card-body">
                                                            <div class="outer-rcm mt-1  basic-dtl-otr p-0">
                                                                {basicDetails && basicDetails.recommendation_type === "building" && (
                                                                    <>
                                                                        <div class="col-md-3 basic-box">
                                                                            <div class="codeOtr">
                                                                                <h4>Status</h4>
                                                                                <h3>
                                                                                    {basicDetails &&
                                                                                    basicDetails.status &&
                                                                                    basicDetails.status === "in_progress"
                                                                                        ? "In Progress"
                                                                                        : basicDetails.status === "on_hold"
                                                                                        ? "On Hold"
                                                                                        : basicDetails.status.charAt(0).toUpperCase() +
                                                                                          basicDetails.status.slice(1)}
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-md-3 basic-box">
                                                                            {this.setToolTip(
                                                                                basicDetails && basicDetails.installed_year,
                                                                                "Installed Year"
                                                                            )}
                                                                        </div>
                                                                        <div class="col-md-3 basic-box">
                                                                            {this.setToolTip(
                                                                                basicDetails && basicDetails.service_life,
                                                                                "Service Life"
                                                                            )}
                                                                        </div>
                                                                        <div class="col-md-3 basic-box">
                                                                            <div
                                                                                className="codeOtr"
                                                                                data-tip={
                                                                                    basicDetails?.usefull_life_remaining
                                                                                        ? `Year= ${
                                                                                              new Date().getFullYear() +
                                                                                              basicDetails?.usefull_life_remaining
                                                                                          }`
                                                                                        : ""
                                                                                }
                                                                                data-for="recommandation_detils"
                                                                                data-place="top"
                                                                                data-html={true}
                                                                            >
                                                                                <h4>Useful Life Remaining</h4>
                                                                                <h3>{basicDetails?.usefull_life_remaining}</h3>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-3 basic-box">
                                                                            <div class="codeOtr">
                                                                                <h4>CRV</h4>
                                                                                <h3>
                                                                                    <NumberFormat
                                                                                        value={parseInt(basicDetails?.crv || 0)}
                                                                                        thousandSeparator={true}
                                                                                        displayType={"text"}
                                                                                        prefix={"$ "}
                                                                                    />
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(
                                                                        basicDetails &&
                                                                            basicDetails.department &&
                                                                            basicDetails.department.name &&
                                                                            basicDetails.department.name,
                                                                        "Department"
                                                                    )}
                                                                </div>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(
                                                                        basicDetails && basicDetails.initiative.name,
                                                                        "Inititative Name"
                                                                    )}
                                                                </div>

                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(
                                                                        basicDetails &&
                                                                            basicDetails.funding_source &&
                                                                            basicDetails.funding_source.name,
                                                                        "Funding"
                                                                    )}
                                                                </div>
                                                                <div class="col-md-3 basic-box">
                                                                    {this.setToolTip(basicDetails && basicDetails.project?.name, "Project")}
                                                                </div>
                                                                {basicDetails && basicDetails.recommendation_type === "building" && (
                                                                    <div class="col-md-9 basic-box"></div>
                                                                )}
                                                            </div>

                                                            <div class="form-row m-0">
                                                                <div class="col-md-3 p-0">
                                                                    <div class="outer-rcm">
                                                                        <div class="txt-rcm w-100">
                                                                            <div>
                                                                                <img src="/img/icn1.png" alt="" />
                                                                            </div>
                                                                            <div class="txt-secn">
                                                                                <h4>Surveyor</h4>
                                                                                <h3>{(basicDetails && basicDetails.surveyor) || "-"}</h3>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-3 p-0">
                                                                    <div class="outer-rcm">
                                                                        <div class="txt-rcm w-100">
                                                                            <div>
                                                                                <img src="/img/icn-2.png" alt="" />
                                                                            </div>
                                                                            <div class="txt-secn">
                                                                                <h4>Inspection Date</h4>
                                                                                <h3>
                                                                                    {(basicDetails.inspection_date &&
                                                                                        moment(basicDetails.inspection_date).format("MM-DD-YYYY")) ||
                                                                                        "-"}
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-3 p-0">
                                                                    <div class="outer-rcm">
                                                                        <div class="txt-rcm w-100">
                                                                            <div>
                                                                                <img src="/img/icn-3.png" alt="" />
                                                                            </div>
                                                                            <div class="txt-secn">
                                                                                <h4>Created At</h4>
                                                                                <h3>
                                                                                    {moment(basicDetails.created_at).format("MM-DD-YYYY h:mm A") ||
                                                                                        "-"}
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-3 p-0">
                                                                    <div class="outer-rcm">
                                                                        <div class="txt-rcm w-100">
                                                                            <div>
                                                                                <img src="/img/icn-3.png" alt="" />
                                                                            </div>
                                                                            <div class="txt-secn">
                                                                                <h4>Updated At</h4>
                                                                                <h3>
                                                                                    {moment(basicDetails.updated_at).format("MM-DD-YYYY h:mm A") ||
                                                                                        "-"}
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {basicDetails.energy_band_show === "yes" && (
                                                    <Band
                                                        bandName="Energy"
                                                        bandId="energyBand"
                                                        setToolTip={this.setToolTip}
                                                        data={basicDetails.energy_band}
                                                        fields={energy_fields}
                                                        handleBandClick={() => this.setState({ showBand: !this.state.showBand })}
                                                    />
                                                )}
                                                {basicDetails.water_band_show === "yes" && (
                                                    <Band
                                                        bandName="Water"
                                                        bandId="waterBand"
                                                        setToolTip={this.setToolTip}
                                                        data={basicDetails.water_band}
                                                        fields={water_fields}
                                                        handleBandClick={() => this.setState({ showBand: !this.state.showBand })}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div class="col-md-4 back-set">
                                            {basicDetails.image.description ? (
                                                <Tooltip
                                                    placement="top"
                                                    overlay={basicDetails.image.description}
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
                                                        data-tip={basicDetails.image.description}
                                                        data-for={basicDetails.image.description}
                                                        data-multiline={true}
                                                        data-effect="solid"
                                                        data-place="top"
                                                        data-background-color="#4991ff"
                                                    >
                                                        <div
                                                            className="details-img-block details-img-new"
                                                            style={{ height: "250px" }}
                                                            onClick={() => this.openImageModal()}
                                                        >
                                                            {basicDetails.image && basicDetails.image.url ? (
                                                                <>
                                                                    <img src={`${basicDetails.image.url}`} alt="" />
                                                                    <div className="sub-cont-img-sec">
                                                                        <h4>{basicDetails.image.description || "-"}</h4>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <img src="/img/no-image.png" alt="" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            ) : (
                                                <div
                                                    data-tip={basicDetails.image.description}
                                                    data-for={basicDetails.image.description}
                                                    data-multiline={true}
                                                    data-effect="solid"
                                                    data-place="top"
                                                    data-background-color="#4991ff"
                                                >
                                                    <div
                                                        className="details-img-block details-img-new"
                                                        style={{ height: "250px" }}
                                                        onClick={() => this.openImageModal()}
                                                    >
                                                        {basicDetails.image && basicDetails.image.url ? (
                                                            <>
                                                                <img src={`${basicDetails.image.url}`} alt="" />
                                                            </>
                                                        ) : (
                                                            <img src="/img/no-image.png" alt="" />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {basicDetails.image && basicDetails.image.url && showImageModal ? (
                                                <Portal
                                                    body={
                                                        <ImageFullViewModal
                                                            image={basicDetails.image}
                                                            handleEdit={this.handleEditImage}
                                                            onCancel={() => this.setState({ showImageModal: false })}
                                                            isRecommendationView={true}
                                                        />
                                                    }
                                                    onCancel={() => this.setState({ showImageModal: false })}
                                                />
                                            ) : null}
                                            {this.state.showImageEditModal && (
                                                <Portal
                                                    body={
                                                        <ImageForm
                                                            // imageUrl={basicDetails.image}
                                                            images={basicDetails.image}
                                                            updateImage={this.updateImage}
                                                            onCancel={() => this.setState({ showImageEditModal: false })}
                                                            isRecommendationView={true}
                                                        />
                                                    }
                                                    onCancel={() => this.setState({ showImageEditModal: false })}
                                                />
                                            )}
                                            {this.state.showNoteModal && (
                                                <Portal
                                                    body={
                                                        <RecommendationNoteView
                                                            notes={basicDetails?.note_html || ""}
                                                            onCancel={() => this.setState({ showNoteModal: false })}
                                                            isRecommendationView={true}
                                                        />
                                                    }
                                                    onCancel={() => this.setState({ showNoteModal: false })}
                                                />
                                            )}
                                            <div class="template">
                                                <div class="heading">
                                                    <h3>Report Notes</h3>
                                                    <img
                                                        data-tip="Click to Expand Report Notes"
                                                        data-for="recommandation_detils"
                                                        data-class="rc-tooltip-custom-class"
                                                        data-place="left"
                                                        // data-html={true}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => this.openReportNote()}
                                                        src="/img/expand1.svg"
                                                    />
                                                </div>
                                                <div
                                                    class="cnt-temp-area notes-outer-area content-break overflow-ht-outer"
                                                    style={{ maxHeight: `${this.state.editorHeight}px` }}
                                                >
                                                    {" "}
                                                    <CKEditor
                                                        config={editorConfiguration}
                                                        editor={Editor}
                                                        disabled={true}
                                                        data={basicDetails.note_html || ""}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {this.renderConfirmationModalLog()}
                    {this.renderConfirmationModal()}
                    {this.renderFMPConfirmationModal()}
                    {this.renderIrConfirmationModal()}
                    {this.renderRLConfirmationModal()}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
