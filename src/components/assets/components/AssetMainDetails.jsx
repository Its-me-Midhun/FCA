import React, { Component } from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import NumberFormat from "react-number-format";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";

import { addToBreadCrumpData, popBreadCrumpRecData, popBreadCrumpOnPageClose, findPrevPathFromBreadCrumpData } from "../../../config/utils";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import EditHistory from "../../region/components/EditHistory";
import Portal from "../../common/components/Portal";
import qs from "query-string";
import ShowHelperModal from "../../helper/components/ShowHelperModal";
import ImageFullViewModal from "../../common/components/ImageFullViewModal";
// import helpIcon from "../../../assets/img/question-mark-icon.png";

class BasicDetails extends Component {
    state = {
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        showHelperModal: false,
        selectedHelperItem: {},
        showConfirmModal: false,
        showImageModal: false
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
                className={`txt-rcm ${name === "Installed Year" ? "wid-tw-rcm" : ""}`}
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

    setToolTip1(basicDetails, name) {
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

    findPriorityText = (element, options) => {
        let text = "-";
        let priorityObj = options.find(option => parseInt(option.value) === element);
        if (priorityObj) {
            text = priorityObj.name;
        }
        return text;
    };

    openImageModal = () => {
        this.setState({
            showImageModal: true
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
    render() {
        const { basicDetails, handleDeleteItem, hasEdit, hasDelete, hasLogView, showEditPage, history, isHistoryView, hasClose = true } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        return (
            <React.Fragment>
                <ReactTooltip id="Asset_details" effect="solid" />
                <div className="tab-active location-sec recom-sec">
                    {this.renderUploadHelperModal()}
                    <div className="otr-edit-delte col-md-12 text-right ed-dl view-narrative-report">
                        {isHistoryView
                            ? hasLogView && (
                                  <span
                                      onClick={() => {
                                          this.props.changeToHistory();
                                      }}
                                      className="edit-icn-bx"
                                  >
                                      <i className="fas fa-history"></i> View History
                                  </span>
                              )
                            : null}
                        {hasClose && !query.dashboardView ? (
                            <span
                                onClick={() => {
                                    popBreadCrumpOnPageClose();
                                    history.push(findPrevPathFromBreadCrumpData());
                                }}
                                className="edit-icn-bx"
                            >
                                <i className="fas fa-window-close"></i> Close
                            </span>
                        ) : null}
                        {hasEdit && (
                            <span
                                onClick={() => {
                                    if (showEditPage) {
                                        showEditPage(this.props.match.params.id);
                                    } else {
                                        addToBreadCrumpData({
                                            key: "edit",
                                            name: `Edit ${this.props.location.pathname.split("/")[1]}`,
                                            path: `/${this.props.location.pathname.split("/")[1]}/edit/${this.props.match.params.id}`
                                        });
                                        history.push(`/${this.props.location.pathname.split("/")[1]}/edit/${this.props.match.params.id}`);
                                    }
                                }}
                                className="edit-icn-bx"
                            >
                                <i className="fas fa-pencil-alt"></i> Edit
                            </span>
                        )}
                        {hasDelete && (
                            <span
                                onClick={() => {
                                    handleDeleteItem(this.props.match.params.id);
                                    history.push(`/assets`);
                                }}
                                className="edit-icn-bx"
                            >
                                <i className="fas fa-trash-alt"></i> Delete
                            </span>
                        )}
                        <span
                            className="view-inner help-icon"
                            onClick={() => {
                                this.showHelperModal("forms", "asset_management");
                            }}
                            data-for="Asset_details"
                            data-tip="Help"
                            // data-effect="solid"
                            data-place="bottom"
                            data-background-color="#007bff"
                        >
                            <img src="/img/question-mark-icon.png" alt="" className="fil-ico" />
                        </span>
                    </div>
                    <div className="col-md-12 detail-recom">
                        <div className="m-details-img-sec">
                            <div className="row align-items-stretch">
                                <div className="col-md-8 p-0 m-details-content-outer">
                                    <div className="m-details-content-block">
                                        <div className="d-flex content-block-2 mt-1">
                                            <div className="content-block-outer">
                                                <div className="content-block-card">
                                                    <p className="m-label">Asset Code</p>
                                                    <p className="m-details">{basicDetails.code || "-"}</p>
                                                </div>
                                            </div>

                                            <div className="content-block-outer br-left">
                                                {this.setToolTip1(basicDetails.asset_name, "Asset Name")}
                                            </div>

                                            <div className="content-block-outer br-left">
                                                {this.setToolTip1(basicDetails.asset_description, "Asset Description")}
                                            </div>
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Asset Type</p>
                                                    <p className="m-details">{basicDetails.asset_type?.name || "-"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex content-block-2 mt-1">
                                            <div className="content-block-outer">
                                                <div className="content-block-card">
                                                    <p className="m-label">Asset Status</p>
                                                    <p className="m-details">{basicDetails.asset_status?.name || "-"}</p>
                                                </div>
                                            </div>
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Asset Condition</p>
                                                    <p className="m-details">{basicDetails.client_asset_condition?.name || "-"}</p>
                                                </div>
                                            </div>
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Asset Condition Description</p>
                                                    <p className="m-details">{basicDetails?.client_asset_condition?.description || "-"}</p>
                                                </div>
                                            </div>
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Criticality</p>
                                                    <p className="m-details">{basicDetails.criticality || "-"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex content-block-2 mt-1">
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Asset Tag</p>
                                                    <p className="m-details">{basicDetails.asset_tag || "-"}</p>
                                                </div>
                                            </div>
                                            <div className="content-block-outer">{this.setToolTip1(basicDetails.guid, "GUID")}</div>
                                            <div className="content-block-outer br-left">
                                                {this.setToolTip1(basicDetails.model_number, "Model Number")}
                                            </div>
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Capacity</p>
                                                    <p className="m-details">{basicDetails.capacity || "-"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex content-block-2 mt-1">
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Capacity Unit</p>
                                                    <p className="m-details">{basicDetails.capacity_unit || "-"}</p>
                                                </div>
                                            </div>
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Capacity Status</p>
                                                    <p className="m-details">{basicDetails.capacity_status || "-"}</p>
                                                </div>
                                            </div>
                                            <div className="content-block-outer">
                                                <div className="content-block-card">
                                                    <p className="m-label">Serial Number</p>
                                                    <p className="m-details">{basicDetails.serial_number || "-"}</p>
                                                </div>
                                            </div>
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Asset Barcode</p>
                                                    <p className="m-details">{basicDetails.asset_barcode || "-"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex content-block-2 mt-1">
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Asset Client ID</p>
                                                    <p className="m-details">{basicDetails.asset_client_id || "-"}</p>
                                                </div>
                                            </div>
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Asset CMMS ID</p>
                                                    <p className="m-details">{basicDetails.asset_cmms_id || "-"}</p>
                                                </div>
                                            </div>
                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">Name Plate Status</p>
                                                    <p className="m-details">{basicDetails.name_plate_status || "-"}</p>
                                                </div>
                                            </div>

                                            <div className="content-block-outer br-left">
                                                <div className="content-block-card">
                                                    <p className="m-label">RTLS Tag</p>
                                                    <p className="m-details">{basicDetails.rtls_tag || "-"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {basicDetails?.image?.description ? (
                                    <Tooltip
                                        placement="top"
                                        overlay={basicDetails?.image?.description}
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
                                                basicDetails.image && basicDetails.image.url ? " imgCrsr" : ""
                                            }`}
                                            data-tip={basicDetails?.image?.description}
                                            data-for={basicDetails?.image?.description}
                                            data-multiline={true}
                                            data-effect="solid"
                                            data-place="top"
                                            data-background-color="#4991ff"
                                        >
                                            <div className="details-img-block" onClick={() => this.openImageModal()}>
                                                {basicDetails.image && basicDetails.image.url ? (
                                                    <>
                                                        <img src={`${basicDetails.image.url}`} alt="" />
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
                                            basicDetails.image && basicDetails?.image?.url ? " imgCrsr" : ""
                                        }`}
                                        data-tip={basicDetails?.image?.description}
                                        data-for={basicDetails?.image?.description}
                                        data-multiline={true}
                                        data-effect="solid"
                                        data-place="top"
                                        data-background-color="#4991ff"
                                    >
                                        <div className="details-img-block" onClick={() => this.openImageModal()}>
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
                                {basicDetails.image && basicDetails.image.url && this.state.showImageModal ? (
                                    <Portal
                                        body={
                                            <ImageFullViewModal
                                                imgSource={`${basicDetails.image.url}`}
                                                onCancel={() => this.setState({ showImageModal: false })}
                                            />
                                        }
                                        onCancel={() => this.setState({ showImageModal: false })}
                                    />
                                ) : null}
                            </div>
                        </div>

                        <div className="outer-rcm recommendations ">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Client</h4>
                                    <h3>{basicDetails?.client?.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Region</h4>
                                    <h3>{basicDetails.region?.name || "-"}</h3>
                                </div>
                            </div>
                            {this.setToolTip(basicDetails.site?.name, "Site")}
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Building</h4>
                                    <h3>{basicDetails.building?.name || "-"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations ">
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails?.building_type?.name?.toString().length > 20
                                        ? basicDetails.building_type?.name?.toString().substring(0, 20) + "..."
                                        : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-for="Asset_details"
                                data-effect="solid"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Building Type</h4>
                                    <h3>
                                        {basicDetails.building_type?.name?.toString().length > 20
                                            ? basicDetails.building_type?.name?.toString().substring(0, 20) + "..."
                                            : basicDetails.building_type?.name || "-"}
                                    </h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={basicDetails.addition?.name?.toString().length > 20 ? basicDetails?.addition?.name || "" : ""}
                                data-multiline={true}
                                data-for="Asset_details"
                                data-place="left"
                                data-effect="solid"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Addition</h4>
                                    <h3>{basicDetails?.addition?.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Floor</h4>
                                    <h3>{basicDetails.floor?.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Room Number</h4>
                                    <h3>{basicDetails.room_number || "-"}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="outer-rcm recommendations ">
                            <div
                                className="txt-rcm"
                                data-tip={basicDetails.room_name?.toString().length > 20 ? basicDetails.room_name || "" : ""}
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Room Name</h4>
                                    <h3>
                                        {basicDetails.room_name?.toString().length > 20
                                            ? basicDetails.room_name.toString().substring(0, 20) + "..."
                                            : basicDetails.room_name || "-"}
                                    </h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={basicDetails.location && basicDetails.location.toString().length > 20 ? basicDetails.location || "" : ""}
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Location</h4>
                                    <h3>
                                        {basicDetails.location && basicDetails.location.toString().length > 20
                                            ? basicDetails.location.toString().substring(0, 20) + "..."
                                            : basicDetails.location || "-"}
                                    </h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Architectural Room Number</h4>
                                    <h3>{(basicDetails && basicDetails.architectural_room_number) || "-"}</h3>
                                </div>
                            </div>
                            {this.setToolTip(basicDetails && basicDetails.additional_room_description, "Additional Room Description")}
                        </div>
                        <div className="outer-rcm recommendations top-margin">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Longitude</h4>
                                    <h3>
                                        {basicDetails.longitude && basicDetails.longitude.toString().length > 20
                                            ? basicDetails.longitude.toString().substring(0, 20) + "..."
                                            : basicDetails.longitude || "-"}
                                    </h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Latitude</h4>
                                    <h3>
                                        {basicDetails.latitude && basicDetails.latitude.toString().length > 20
                                            ? basicDetails.latitude.toString().substring(0, 20) + "..."
                                            : basicDetails.latitude || "-"}
                                    </h3>
                                </div>
                            </div>
                            <div className="txt-rcm"></div>
                            <div className="txt-rcm"></div>
                        </div>
                        {/* </div> */}
                        <div className="outer-rcm recommendations ">
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.manufacturer && basicDetails.manufacturer.toString().length > 20
                                        ? basicDetails.manufacturer || ""
                                        : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Manufacturer</h4>
                                    <h3>{(basicDetails && basicDetails.manufacturer) || "-"}</h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.year_manufactured && basicDetails.year_manufactured.toString().length > 20
                                        ? basicDetails.year_manufactured || ""
                                        : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-for="Asset_details"
                                data-effect="solid"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Year Manufactured</h4>
                                    <h3>{(basicDetails && basicDetails.year_manufactured) ?? "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Installed Year</h4>
                                    <h3>{(basicDetails && basicDetails.installed_year) ?? "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Install Year Status</h4>
                                    <h3>{(basicDetails && basicDetails.installed_year_status) ?? "-"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations ">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Current Age</h4>
                                    <h3>{basicDetails.current_age || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Service Life</h4>
                                    <h3>{(basicDetails && basicDetails.service_life) ?? "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Useful Life Remaining</h4>
                                    <h3>{(basicDetails && basicDetails.usefull_life_remaining) ?? "-"}</h3>
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
                        <div className="outer-rcm recommendations ">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Warranty Start</h4>
                                    <h3>{basicDetails?.warranty_start ? moment(basicDetails?.warranty_start).format("MM-DD-YYYY") || "-" : "-"} </h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Warranty End</h4>
                                    <h3>{basicDetails?.warranty_end ? moment(basicDetails?.warranty_end).format("MM-DD-YYYY") || "-" : "-"}</h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.install_date && basicDetails.install_date.toString().length > 20
                                        ? basicDetails.install_date || ""
                                        : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Install Date</h4>
                                    <h3>{basicDetails?.install_date ? moment(basicDetails?.install_date).format("MM-DD-YYYY") || "-" : "-"}</h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.startup_date && basicDetails.startup_date.toString().length > 20
                                        ? basicDetails.startup_date || ""
                                        : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Startup Date</h4>
                                    <h3>{basicDetails?.startup_date ? moment(basicDetails?.startup_date).format("MM-DD-YYYY") || "-" : "-"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations">
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.uniformat_level_1 && basicDetails?.uniformat_level_1?.name?.toString().length > 20
                                        ? basicDetails.uniformat_level_1.name || ""
                                        : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Uniformat Level 1</h4>
                                    <h3>{(basicDetails && basicDetails.uniformat_level_1 && basicDetails.uniformat_level_1.name) || "-"}</h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.uniformat_level_2 && basicDetails.uniformat_level_2?.name?.toString().length > 20
                                        ? basicDetails.uniformat_level_2.name || ""
                                        : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Uniformat Level 2</h4>
                                    <h3>{basicDetails.uniformat_level_2?.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Uniformat Level 3</h4>
                                    <h3>{basicDetails.uniformat_level_3?.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Uniformat Level 4</h4>
                                    <h3>{basicDetails.uniformat_level_4?.name || "-"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Uniformat Level 5</h4>
                                    <h3>{basicDetails.uniformat_level_5?.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Uniformat Level 6</h4>
                                    <h3>{basicDetails?.uniformat_level_6?.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Uniformat Level 6 Description</h4>
                                    <h3>{basicDetails?.uniformat_level_6?.uniformat_level_6_description || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Main Category</h4>
                                    <h3>{basicDetails?.main_category?.name || "-"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Sub Category 1</h4>
                                    <h3>{basicDetails?.sub_category_1?.name || "-"}</h3>{" "}
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Sub Category 2</h4>
                                    <h3>{basicDetails?.sub_category_2?.name || "-"}</h3>{" "}
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Sub Category 2 Description</h4>
                                    <h3>{basicDetails?.sub_category_2?.subcategory2_description || "-"}</h3>{" "}
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Sub Category 3</h4>
                                    <h3>{basicDetails?.sub_category_3?.name || "-"}</h3>{" "}
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations top-margin">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Trade</h4>
                                    <h3>{basicDetails.trade?.name || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>System</h4>
                                    <h3>{basicDetails.system?.name || "-"}</h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails?.system?.name?.toString().length > 20
                                        ? basicDetails.system?.name?.toString().substring(0, 20) + "..."
                                        : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-for="Asset_details"
                                data-effect="solid"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Sub-System </h4>
                                    <h3>
                                        {basicDetails.sub_system?.name?.toString().length > 20
                                            ? basicDetails.sub_system?.name?.toString().substring(0, 20) + "..."
                                            : basicDetails.sub_system?.name || "-"}
                                    </h3>
                                </div>
                            </div>
                            <div className="txt-rcm"></div>
                        </div>
                        <div className="outer-rcm recommendations ">
                            <div
                                className="txt-rcm"
                                data-tip={basicDetails.survey_id && basicDetails.survey_id.toString().length > 20 ? basicDetails.survey_id || "" : ""}
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Asset Survey Id</h4>
                                    <h3>{(basicDetails && basicDetails.survey_id) || "-"}</h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.survey_property_note && basicDetails.survey_property_note.toString().length > 20
                                        ? basicDetails.survey_property_note || ""
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
                                    <h3>{(basicDetails && basicDetails.survey_property_note) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Asset Survey QA/QC Notes</h4>
                                    <h3>{(basicDetails && basicDetails.qa_notes) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Capacity Status</h4>
                                    <h3>{(basicDetails && basicDetails.capacity_status) || "-"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations ">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Install Year Status</h4>
                                    <h3>{(basicDetails && basicDetails.installed_year_status) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Name Plate Status</h4>
                                    <h3>{(basicDetails && basicDetails.name_plate_status) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Asset Survey Additional QA/QC Notes</h4>
                                    <h3>{(basicDetails && basicDetails.additional_qa_notes) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Asset Survey Date Created</h4>
                                    <h3>{(basicDetails && basicDetails.survey_date_created) || "-"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Asset Survey Surveyor</h4>
                                    <h3>{(basicDetails && basicDetails.source_panel) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Asset Survey Date Edited</h4>
                                    <h3>{(basicDetails && basicDetails.survey_date_edited) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Asset Survey Editor</h4>
                                    <h3>{(basicDetails && basicDetails.editor) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Parent Global ID</h4>
                                    <h3>{(basicDetails && basicDetails.parent_global_id) || "-"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations top-margin">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Is This a New Asset</h4>
                                    <h3>{(basicDetails && basicDetails.new_asset) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm"></div>
                            <div className="txt-rcm"></div>
                            <div className="txt-rcm"></div>
                        </div>

                        {/* ----------- */}
                        <div className="outer-rcm recommendations  ">
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.area_served && basicDetails.area_served.toString().length > 20 ? basicDetails.area_served || "" : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Area Served</h4>
                                    <h3>{(basicDetails && basicDetails.area_served) || "-"}</h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.upstream_asset_barcode_number && basicDetails.upstream_asset_barcode_number.toString().length > 20
                                        ? basicDetails.upstream_asset_barcode_number || ""
                                        : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-for="Asset_details"
                                data-background-color="#4991ff"
                            >
                                <div className="txt-dtl">
                                    <h4>Upstream Asset Barcode Numbers</h4>
                                    <h3>{(basicDetails && basicDetails.upstream_asset_barcode_number) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Linked Asset Barcode Numbers</h4>
                                    <h3>{(basicDetails && basicDetails.linked_asset_barcode_number) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Source Panel Name</h4>
                                    <h3>{(basicDetails && basicDetails.source_panel_name) || "-"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="outer-rcm recommendations ">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Source Panel Barcode Number</h4>
                                    <h3>{(basicDetails && basicDetails.source_panel_barcode_number) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Source Panel Emergency/Normal</h4>
                                    <h3>{(basicDetails && basicDetails.source_panel) || "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Skysite Hyperlink</h4>
                                    <h3>{(basicDetails && basicDetails.skysite_hyperlink) || "-"}</h3>
                                </div>
                            </div>
                            <div
                                className="txt-rcm"
                                data-tip={
                                    basicDetails.asset_note && basicDetails.asset_note.toString().length > 20 ? basicDetails.asset_note || "" : ""
                                }
                                data-multiline={true}
                                data-place="left"
                                data-effect="solid"
                                data-background-color="#4991ff"
                                data-for="Asset_details"
                            >
                                <div className="txt-dtl">
                                    <h4>Asset Notes</h4>
                                    <h3>
                                        {basicDetails.asset_note && basicDetails.asset_note.toString().length > 20
                                            ? basicDetails.asset_note.toString().substring(0, 20) + "..."
                                            : basicDetails.asset_note || "-"}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* ---------------------- */}

                        <div className="outer-rcm recommendations top-margin ">
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Quantity</h4>
                                    <h3>{(basicDetails && basicDetails.quantity) ?? "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Created At</h4>
                                    <h3>{basicDetails?.created_at ? moment(basicDetails.created_at).format("MM-DD-YYYY h:mm A") : "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm">
                                <div className="txt-dtl">
                                    <h4>Updated At</h4>
                                    <h3>{basicDetails?.updated_at ? moment(basicDetails.updated_at).format("MM-DD-YYYY h:mm A") : "-"}</h3>
                                </div>
                            </div>
                            <div className="txt-rcm"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
