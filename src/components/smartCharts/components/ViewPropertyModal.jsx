import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import Draggable from "react-draggable";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import { connect } from "react-redux";

import ViewChartMainForModal from "./ViewChartMainForModal";
import ChartItemConfigModal from "./ChartItemConfigModal";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import actions from "../actions";
import ImageBandConfigModal from "./ImageBandConfigModal";
import ImageListForBandModal from "./ImageListForBandModal";

const ViewPropertyModal = ({
    getSmartChartPropertyById,
    smartChartPropertyByIdData = {},
    currentPropertyId = null,
    currentTab,
    showSmartChartDataEditModal,
    viewReports,
    lockOrUnlockReportTemplate,
    isLockLoading = false,
    ...props
}) => {
    const [propertyData, setPropertyData] = useState({
        user: localStorage.getItem("userId"),
        name: "",
        notes: "",
        client_name: "",
        template_property_name: "",
        template_name: "",
        properties_text: {},
        is_mapped: false,
        created_by: "",
        modified_by: "",
        created_date: "",
        modified_date: "",
        is_locked: true,
        client_id: ""
    });
    const [showChartItemConfigModal, setShowChartItemConfigModal] = useState(false);
    const [selectedChartConfigData, setSelectedChartConfigData] = useState({});
    const [showEditConfirmationModal, setShowEditConfirmationModal] = useState(false);
    const [showImageBandConfigModal, setShowImageBandConfigModal] = useState(false);
    const [showImageListForBandModal, setShowImageListForBandModal] = useState(false);

    useEffect(() => {
        let propertyId = props.match.params?.id || currentPropertyId || "";
        getSmartChartPropertyById(propertyId);
    }, []);

    useEffect(() => {
        if (smartChartPropertyByIdData.success) {
            setViewPropertyData(smartChartPropertyByIdData.data);
        }
    }, [smartChartPropertyByIdData]);

    useEffect(() => {
        if (propertyData.name) {
            ReactTooltip.rebuild();
        }
    }, [propertyData]);

    const setViewPropertyData = property => {
        let tempProperties = JSON.parse(property.properties_text);
        let selectedProperties = {};
        selectedProperties = Object.keys(tempProperties).reduce((resultData, currentProp, index) => {
            if (!tempProperties[currentProp].band1.hasOwnProperty("type") || _.isEmpty(tempProperties[currentProp].band1.type)) {
                return resultData;
            }
            return { ...resultData, [currentProp]: tempProperties[currentProp] };
        }, {});

        setPropertyData(prevPropertyData => {
            return {
                ...prevPropertyData,
                name: property.name,
                notes: property.notes,
                client_name: property.client_name,
                template_property_name: property.template_property_name,
                template_name: property.template_name,
                properties_text: { ...selectedProperties },
                is_mapped: property.is_mapped,
                created_by: property.user,
                modified_by: property.modified_by,
                created_date: property.created_date,
                modified_date: property.modified_date,
                is_locked: property.is_locked,
                client_id: property.client_id
            };
        });
    };

    const renderChartItemConfigModal = () => {
        if (!showChartItemConfigModal) return null;
        return (
            <Portal
                body={<ChartItemConfigModal configData={selectedChartConfigData} onCancel={() => setShowChartItemConfigModal(false)} isView={true} />}
                onCancel={() => setShowChartItemConfigModal(false)}
            />
        );
    };

    const openChartItemConfigModal = params => {
        const { entity, chartKey, bandName, isImageBand = false } = params;
        let selectedChartConfig = propertyData?.properties_text?.[entity]?.[bandName]?.type?.[chartKey]
            ? { ...propertyData?.properties_text?.[entity]?.[bandName]?.type?.[chartKey] }
            : {};
        setSelectedChartConfigData({ ...params, selectedChartConfig });
        if (isImageBand) {
            setShowImageBandConfigModal(true);
        } else {
            setShowChartItemConfigModal(true);
        }
    };

    const editProperty = (isConfirm = false) => {
        if (!isConfirm && smartChartPropertyByIdData?.data?.is_mapped) {
            setShowEditConfirmationModal(true);
        } else {
            setShowEditConfirmationModal(false);
            props.onCancel();
            props.handleEditSmartChartProperty(smartChartPropertyByIdData.data, true);
        }
    };

    const exportSmartChart = async () => {
        let selectedProperty = smartChartPropertyByIdData.data || {};
        showSmartChartDataEditModal(
            { ...selectedProperty, smart_export_props: selectedProperty.id },
            selectedProperty.is_mapped ? "Regenerate" : "Export"
        );
    };

    const renderConfirmationModal = () => {
        if (!showEditConfirmationModal) return null;
        let generatedSmartReportCount = smartChartPropertyByIdData?.data?.smart_export_count || 0;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to edit this Report Template ?"}
                        type="cancel"
                        message={
                            <>
                                <span className="badge-red-circled">{generatedSmartReportCount}</span>{" "}
                                {`Report${generatedSmartReportCount > 1 ? "s" : ""} ${
                                    generatedSmartReportCount > 1 ? "are" : "is"
                                } already connected to this Report Template`}
                            </>
                        }
                        onNo={() => setShowEditConfirmationModal(false)}
                        onYes={() => {
                            editProperty(true);
                        }}
                    />
                }
                onCancel={() => setShowEditConfirmationModal(false)}
            />
        );
    };

    const renderImageBandConfigModal = () => {
        if (!showImageBandConfigModal) return null;
        return (
            <Portal
                body={<ImageBandConfigModal onCancel={() => setShowImageBandConfigModal(false)} configData={selectedChartConfigData} isView={true} />}
                onCancel={() => setShowImageBandConfigModal(false)}
            />
        );
    };

    const toggleImageListForBandModal = params => {
        const { entity, chartKey, bandName } = params;
        let selectedChartConfig = propertyData?.properties_text?.[entity]?.[bandName]?.type?.[chartKey]
            ? { ...propertyData?.properties_text?.[entity]?.[bandName]?.type?.[chartKey] }
            : {};
        setSelectedChartConfigData({ ...params, selectedChartConfig });
        setShowImageListForBandModal(true);
    };

    const renderImageListForBandModal = () => {
        if (!showImageListForBandModal) return null;
        return (
            <Portal
                body={
                    <ImageListForBandModal
                        onCancel={() => setShowImageListForBandModal(false)}
                        selectedClient={propertyData.client_id}
                        configData={selectedChartConfigData}
                        isView={true}
                        isTemplateView={true}
                    />
                }
                onCancel={() => setShowImageListForBandModal(false)}
            />
        );
    };

    let connectedReportsCount = smartChartPropertyByIdData?.data?.smart_export_count || 0;
    return (
        <div class="modal modal-region smart-chart-popup smart-dtl-pop" id="modalId" tabIndex="-1" style={{ display: "block" }}>
            <ReactTooltip id="edit-report-template-modal" effect="solid" place="bottom" backgroundColor="#007bff" />
            <Draggable handle=".modal-header">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div class="modal-header draggable">
                            <h5 class="modal-title" id="exampleModalLabel">
                                <div class="txt-hed">Smart Chart Report Template Details</div>
                                <div class="btn-mod-headotr">
                                    {connectedReportsCount > 0 ? (
                                        <button
                                            className="btn-edit view-prop-edit-btn view-report-btn"
                                            onClick={() => viewReports(smartChartPropertyByIdData?.data?.id)}
                                        >
                                            View <span>{connectedReportsCount}</span> {`Connected Report${connectedReportsCount > 1 ? "s" : ""}`}
                                        </button>
                                    ) : null}
                                    <button
                                        className={`btn-cancel ${propertyData.is_locked ? "btn-pop-green" : "btn-rd-active"}`}
                                        data-tip={propertyData.is_locked ? "Unlock Report Template" : "Lock Report Template"}
                                        data-for="edit-report-template-modal"
                                        onClick={() => lockOrUnlockReportTemplate(smartChartPropertyByIdData?.data)}
                                    >
                                        {isLockLoading ? (
                                            <span className="spinner-border spinner-border-sm pl-2 ml-2" role="status"></span>
                                        ) : // <img src={`/img/${propertyData.is_locked ? "sm-charts-lock.svg" : "sm-charts-unlock.svg"}`} />
                                        propertyData.is_locked ? (
                                            <svg
                                                version="1.1"
                                                id="Layer_1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                x="0px"
                                                y="0px"
                                                width="11.08px"
                                                height="15.436px"
                                                viewBox="0 0 11.08 15.436"
                                                enable-background="new 0 0 11.08 15.436"
                                                xmlSpace="preserve"
                                            >
                                                <g>
                                                    <path
                                                        fill="#707070"
                                                        d="M9.835,6.322V4.295C9.832,1.93,7.905,0.003,5.54,0C3.174,0.003,1.248,1.93,1.245,4.295v2.026
C0.525,6.56,0.001,7.231,0,8.029v5.601c0.001,0.995,0.811,1.805,1.806,1.806h7.468c0.995-0.001,1.805-0.811,1.806-1.806V8.028
C11.079,7.231,10.555,6.559,9.835,6.322z M5.539,1.122c1.75,0,3.173,1.423,3.173,3.173v1.928H2.366V4.295
C2.366,2.546,3.79,1.122,5.539,1.122z M9.274,14.313H1.807c-0.376-0.001-0.683-0.308-0.684-0.683v-5.6
c0-0.376,0.307-0.684,0.684-0.685h7.468c0.375,0,0.682,0.308,0.683,0.685v5.6C9.956,14.005,9.649,14.312,9.274,14.313z"
                                                    ></path>
                                                    <path
                                                        fill="#707070"
                                                        d="M5.54,8.09c-0.996,0-1.806,0.81-1.806,1.806c0,0.799,0.525,1.471,1.245,1.708v1.403
c-0.002,0.309,0.249,0.562,0.558,0.563h0.003c0.307,0,0.559-0.25,0.56-0.563v-1.403c0.721-0.238,1.246-0.91,1.246-1.71
C7.345,8.901,6.534,8.091,5.54,8.09z M4.857,9.896c0-0.376,0.307-0.683,0.683-0.683c0.377,0,0.684,0.307,0.684,0.682
c-0.001,0.377-0.308,0.684-0.684,0.685C5.164,10.579,4.857,10.273,4.857,9.896z M5.541,13.32L5.541,13.32L5.541,13.32L5.541,13.32z
"
                                                    ></path>
                                                </g>
                                            </svg>
                                        ) : (
                                            <svg
                                                version="1.1"
                                                id="Layer_1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                x="0px"
                                                y="0px"
                                                width="17.064px"
                                                height="15.289px"
                                                viewBox="0 0.147 17.064 15.289"
                                                enable-background="new 0 0.147 17.064 15.289"
                                                xmlSpace="preserve"
                                                style={{ width: "20px", height: "20px" }}
                                            >
                                                <g>
                                                    <g>
                                                        <path
                                                            fill="none"
                                                            d="M1.123,8.031v5.6c0.001,0.375,0.308,0.682,0.684,0.683h7.467c0.375-0.001,0.682-0.308,0.684-0.683v-5.6
C9.957,7.653,9.649,7.345,9.274,7.345H1.807C1.43,7.346,1.123,7.654,1.123,8.031z M5.54,8.09c0.994,0.001,1.805,0.811,1.807,1.804
c0,0.8-0.525,1.473-1.246,1.71v1.403C6.099,13.32,5.847,13.57,5.54,13.57H5.537c-0.309-0.001-0.56-0.254-0.558-0.563v-1.403
c-0.72-0.236-1.245-0.909-1.245-1.708C3.734,8.9,4.544,8.09,5.54,8.09z"
                                                        ></path>
                                                        <circle fill="none" cx="5.54" cy="9.897" r="0.684"></circle>
                                                        <path
                                                            fill="#707070"
                                                            d="M0,8.029v5.602c0.001,0.995,0.811,1.805,1.806,1.806h7.468c0.994-0.001,1.805-0.811,1.806-1.806V8.028
c-0.001-0.797-0.524-1.469-1.245-1.705H1.241C0.523,6.563,0.001,7.232,0,8.029z M9.274,7.345c0.375,0,0.683,0.308,0.684,0.686v5.6
c-0.002,0.375-0.309,0.682-0.684,0.683H1.807c-0.376-0.001-0.683-0.308-0.684-0.683v-5.6c0-0.377,0.307-0.685,0.684-0.686H9.274z"
                                                        ></path>
                                                        <path
                                                            fill="#707070"
                                                            d="M4.979,11.604v1.403c-0.002,0.309,0.249,0.562,0.558,0.563H5.54c0.307,0,0.559-0.25,0.561-0.563v-1.403
c0.721-0.237,1.246-0.91,1.246-1.71C7.345,8.901,6.534,8.091,5.54,8.09c-0.996,0-1.806,0.81-1.806,1.806
C3.734,10.695,4.259,11.367,4.979,11.604z M5.54,9.213c0.377,0,0.684,0.307,0.684,0.682c0,0.377-0.308,0.685-0.684,0.686
c-0.376-0.001-0.683-0.308-0.683-0.685C4.857,9.52,5.164,9.213,5.54,9.213z"
                                                        ></path>
                                                    </g>
                                                    <path
                                                        fill="#707070"
                                                        d="M9.596,4.442c0-1.749,1.424-3.173,3.173-3.173c1.75,0,3.173,1.423,3.173,3.173v1.881h1.123V4.442
c-0.003-2.365-1.93-4.292-4.295-4.295c-2.366,0.003-4.292,1.93-4.295,4.295v1.881h1.121V4.442z"
                                                    ></path>
                                                </g>
                                            </svg>
                                        )}
                                    </button>
                                    {!propertyData.is_locked ? (
                                        <button
                                            class="btn-edit btn-exp"
                                            data-tip={
                                                propertyData.is_mapped
                                                    ? `Generate an update to this report definition, on the most current data set, while providing a new report name`
                                                    : `Generate a report, using this template, on the current data set`
                                            }
                                            data-for="edit-report-template-modal"
                                            onClick={() => exportSmartChart()}
                                        >
                                            {propertyData.is_mapped ? "Regenerate" : "Export"}
                                        </button>
                                    ) : null}
                                    {!propertyData.is_locked ? (
                                        <button
                                            class="btn-edit view-prop-edit-btn"
                                            data-tip="Edit Report Template"
                                            data-for="edit-report-template-modal"
                                            onClick={() => editProperty()}
                                        >
                                            Edit
                                        </button>
                                    ) : null}
                                    <button class="btn-cancel" onClick={() => props.onCancel()}>
                                        Close
                                    </button>
                                </div>
                            </h5>
                        </div>
                        <div class="modal-body region-otr">
                            <div class="tab-dtl region-mng chart-drage-area">
                                <div class="col-md-12 view-content-bx-outer">
                                    <div class="view-dtl-inner">
                                        <div class="txt-det-lbl">
                                            <div class="text-label">Template Name</div>
                                            <div class="text-label-dtl">{propertyData.name || "-"}</div>
                                        </div>
                                        <div class="txt-det-lbl">
                                            <div class="text-label">Client</div>
                                            <div class="text-label-dtl">{propertyData.client_name || "-"}</div>
                                        </div>
                                        <div class="txt-det-lbl">
                                            <div class="text-label">Export Property</div>
                                            <div class="text-label-dtl">{propertyData.template_property_name || ""}</div>
                                        </div>
                                        <div class="txt-det-lbl">
                                            <div class="text-label">Export Template</div>
                                            <div class="text-label-dtl">{propertyData.template_name || "-"}</div>
                                        </div>
                                        <div class="txt-det-lbl">
                                            <div class="text-label">Created By</div>
                                            <div class="text-label-dtl">{propertyData.created_by || "-"}</div>
                                        </div>
                                        <div class="txt-det-lbl">
                                            <div class="text-label">Last Modified By</div>
                                            <div class="text-label-dtl">{propertyData.modified_by || "-"}</div>
                                        </div>
                                        <div class="txt-det-lbl">
                                            <div class="text-label">Created Date & Time</div>
                                            <div class="text-label-dtl">
                                                {propertyData.created_date ? moment(propertyData.created_date).format("MM-DD-YYYY h:mm A") : "-"}
                                            </div>
                                        </div>
                                        <div class="txt-det-lbl">
                                            <div class="text-label">Modified Date & Time</div>
                                            <div class="text-label-dtl">
                                                {propertyData.modified_date ? moment(propertyData.modified_date).format("MM-DD-YYYY h:mm A") : "-"}
                                            </div>
                                        </div>
                                        <div class="txt-det-lbl notes-wid">
                                            <div class="text-label">Template Notes</div>
                                            <div class="text-label-desc">{propertyData.notes || "-"}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-active location-sec">
                                    <div class="row m-0">
                                        <div class="col-md-12">
                                            <div id="accordion">
                                                {Object.keys(propertyData.properties_text).map((entity, index) => (
                                                    <ViewChartMainForModal
                                                        chartData={propertyData?.properties_text}
                                                        entity={entity}
                                                        openChartItemConfigModal={openChartItemConfigModal}
                                                        toggleImageListForBandModal={toggleImageListForBandModal}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
            {renderConfirmationModal()}
            {renderChartItemConfigModal()}
            {renderImageBandConfigModal()}
            {renderImageListForBandModal()}
        </div>
    );
};
const mapStateToProps = state => {
    const { smartChartReducer } = state;
    return { smartChartReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(ViewPropertyModal));
