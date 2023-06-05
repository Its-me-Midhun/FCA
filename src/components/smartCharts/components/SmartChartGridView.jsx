import React, { useEffect } from "react";
import moment from "moment";
import ReactTooltip from "react-tooltip";

const SmartChartGridView = ({
    gridData = [],
    handleDownloadItem,
    deleteSmartChartReport,
    regenerateSmartChart,
    hasDelete,
    hasExport,
    hasRegenerate,
    showSmartChartDataEditModal,
    hasEdit,
    menu = "",
    viewSmartChartProperty,
    handleEditSmartChartProperty,
    handleExportSmartReport,
    deleteReportTemplate,
    isModalView = false,
    lockOrUnlockReportTemplate,
    toggleSelectDownloadTypeModal,
    ...props
}) => {
    useEffect(() => {
        if (gridData?.data?.length) {
            ReactTooltip.rebuild();
        }
    }, [gridData]);
    return (
        <div class="tab-dtl region-mng">
            <div class="tab-active location-sec chart-smart">
                <div class="dtl-sec">
                    <ReactTooltip
                        id={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                        effect="solid"
                        place="bottom"
                        backgroundColor="#007bff"
                    />
                    {gridData?.data?.length ? (
                        <div class="row m-0">
                            {gridData.data.map((gridItem, i) =>
                                menu === "reporttemplates" ? (
                                    <div class="col-md-3 smart-lst-outr">
                                        <div class="itms">
                                            <div class="heading-sec">
                                                <div class="head-area">
                                                    <label>Name</label>
                                                    <h3>{gridItem.name || "-"}</h3>
                                                </div>
                                                <div class="btn-view">
                                                    <button
                                                        class="btn btn-edit"
                                                        onClick={() => viewSmartChartProperty(gridItem.id)}
                                                        data-tip="View/Edit Report Template"
                                                        data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                    >
                                                        <img src="/img/view-eye-smart-chart.svg" />
                                                    </button>
                                                    {hasEdit && !gridItem.is_locked ? (
                                                        <button
                                                            class="btn btn-edit"
                                                            data-tip="Edit Report Template"
                                                            data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                            onClick={() => handleEditSmartChartProperty(gridItem)}
                                                        >
                                                            <img src="/img/Icon-material-mode-edit.svg" />
                                                        </button>
                                                    ) : null}
                                                    {hasDelete && !gridItem.is_locked && (
                                                        <button
                                                            class="btn btn-del sm-charts-report-delete"
                                                            data-tip="Delete Report Template"
                                                            data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                            onClick={() => deleteReportTemplate(gridItem)}
                                                        >
                                                            <img src="/img/blue-delete.svg" />
                                                        </button>
                                                    )}
                                                    <button
                                                        className={`btn btn-del ${gridItem.is_locked ? "btn-lock-green" : "btn-lock-red"}`}
                                                        data-tip={gridItem.is_locked ? "Unlock Report Template" : "Lock Report Template"}
                                                        data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                        onClick={() => lockOrUnlockReportTemplate(gridItem)}
                                                    >
                                                        {/* <img src={`/img/${gridItem.is_locked ? "sm-charts-lock.svg" : "sm-charts-unlock.svg"}`} /> */}
                                                        {gridItem.is_locked ? (
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
                                                </div>
                                            </div>
                                            <div class="content-sec">
                                                <div class="cnt-area">
                                                    <label>Client</label>
                                                    <h3
                                                        data-tip={gridItem.client_name?.length > 15 ? gridItem.client_name : null}
                                                        data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                    >
                                                        {gridItem.client_name}
                                                    </h3>
                                                </div>
                                                <div class="cnt-area">
                                                    <label>Created By</label>
                                                    <h3>{gridItem.user || "-"}</h3>
                                                </div>

                                                <div class="cnt-area">
                                                    <label>Created Date & Time</label>
                                                    <h3>{gridItem.created_date ? moment(gridItem.created_date).format("MM-DD-YYYY h:mm A") : "-"}</h3>
                                                </div>
                                                <div class="cnt-area">
                                                    <label>Modified Date & Time</label>
                                                    <h3>
                                                        {gridItem.modified_date ? moment(gridItem.modified_date).format("MM-DD-YYYY h:mm A") : "-"}
                                                    </h3>
                                                </div>
                                                <div class="cnt-area">
                                                    <label>Notes</label>
                                                    <h3>{gridItem.notes || "-"}</h3>
                                                </div>
                                            </div>
                                            <div class="botm-sec">
                                                {hasExport && (
                                                    <button
                                                        class={`btn ${gridItem.is_mapped ? "btn-reg" : "btn-dwn"}`}
                                                        data-tip={
                                                            gridItem.is_mapped
                                                                ? `Generate an update to this report definition, on the most current data set, while providing a new report name`
                                                                : `Generate a report, using this template, on the current data set`
                                                        }
                                                        data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                        onClick={() =>
                                                            showSmartChartDataEditModal(
                                                                { ...gridItem, smart_export_props: gridItem.id },
                                                                gridItem.is_mapped ? "Regenerate" : "Export"
                                                            )
                                                        }
                                                    >
                                                        {gridItem.is_mapped ? (
                                                            <>
                                                                <img src="/img/export.svg" /> Regenerate{" "}
                                                            </>
                                                        ) : (
                                                            "Export"
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div class="col-md-3 smart-lst-outr">
                                        <div class="itms">
                                            <div class="heading-sec">
                                                <div class="head-area">
                                                    <label>Name</label>
                                                    <h3>{gridItem.name || "-"}</h3>
                                                </div>

                                                <div class="btn-view">
                                                    {!isModalView ? (
                                                        <button
                                                            class="btn btn-edit"
                                                            data-tip="View/Edit Report Template"
                                                            data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                            onClick={() => viewSmartChartProperty(gridItem.smart_export_props, true)}
                                                        >
                                                            <img src="/img/view-eye-smart-chart.svg" />
                                                        </button>
                                                    ) : null}
                                                    {hasEdit && !isModalView ? (
                                                        <button
                                                            class="btn btn-edit"
                                                            data-tip="Edit Report Name"
                                                            data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                            onClick={() => showSmartChartDataEditModal(gridItem)}
                                                        >
                                                            <img src="/img/Icon-material-mode-edit.svg" />
                                                        </button>
                                                    ) : null}
                                                    {hasDelete && !isModalView && (
                                                        <button
                                                            class="btn btn-del"
                                                            data-tip="Delete Report"
                                                            data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                            onClick={() => deleteSmartChartReport(gridItem.id)}
                                                        >
                                                            <img src="/img/blue-delete.svg" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div class="content-sec">
                                                <div class="cnt-area">
                                                    <label>Client</label>
                                                    <h3
                                                        data-tip={gridItem.client_name?.length > 18 ? gridItem.client_name : null}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                    >
                                                        {gridItem.client_name || "-"}
                                                    </h3>
                                                </div>
                                                <div class="cnt-area">
                                                    <label>Project</label>
                                                    <h3
                                                        data-tip={gridItem.project_name?.length > 18 ? gridItem.project_name : null}
                                                        data-effect="solid"
                                                        data-place="bottom"
                                                        data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                    >
                                                        {gridItem.project_name}
                                                    </h3>
                                                </div>
                                                <div class="cnt-area">
                                                    <label>Exported By</label>
                                                    <h3>{gridItem.user || "-"}</h3>
                                                </div>
                                                <div class="cnt-area">
                                                    <label>Export Date & Time</label>
                                                    <h3>{gridItem.created_date ? moment(gridItem.created_date).format("MM-DD-YYYY h:mm A") : "-"}</h3>
                                                </div>
                                                <div class="cnt-area col-md-12 p-0">
                                                    <label>Notes</label>
                                                    <h3>{gridItem.notes || "-"}</h3>
                                                </div>
                                            </div>
                                            <div class="botm-sec">
                                                {hasExport && (
                                                    <button
                                                        class={`btn btn-dwn ${
                                                            !gridItem.doc_url && !gridItem.ppt_url && !gridItem.pdf_url ? "disabled-btn" : ""
                                                        }`}
                                                        data-tip={`Download an existing report that was generated  on: ${
                                                            gridItem.created_date ? moment(gridItem.created_date).format("MM-DD-YYYY h:mm A") : "-"
                                                        }`}
                                                        data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            if (gridItem.pdf_url) {
                                                                // toggleSelectDownloadTypeModal(gridItem);
                                                                handleDownloadItem(gridItem.pdf_url);
                                                            } else if (gridItem.ppt_url) {
                                                                handleDownloadItem(gridItem.ppt_url);
                                                            } else {
                                                                gridItem.doc_url && handleDownloadItem(gridItem.doc_url);
                                                            }
                                                        }}
                                                    >
                                                        <img src="/img/material-file-download.svg" alt="" />
                                                        {`Download ${
                                                            gridItem.pdf_url ? "(PDF)" : gridItem.ppt_url ? "(PPT)" : gridItem.doc_url ? "(Word)" : ""
                                                        }`}
                                                    </button>
                                                )}
                                                {/* {hasExport && gridItem.pdf_url && (
                                                    <button
                                                        class={`btn btn-dwn`}
                                                        data-tip={`Download an existing report that was generated  on: ${
                                                            gridItem.created_date ? moment(gridItem.created_date).format("MM-DD-YYYY h:mm A") : "-"
                                                        }`}
                                                        data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            handleDownloadItem(gridItem.pdf_url);
                                                        }}
                                                    >
                                                        <img src="/img/sm-charts-pdf-download.svg" /> Download PDF
                                                    </button>
                                                )} */}
                                                {hasRegenerate && !isModalView && (
                                                    <button
                                                        className={`btn btn-reg ${
                                                            !gridItem.doc_url && !gridItem.ppt_url && !gridItem.pdf_url ? "disabled-btn" : ""
                                                        }`}
                                                        data-tip={`Generate an update to this report definition, on the most current data set, while providing a new report name`}
                                                        data-for={`smart-chart-grid-view${isModalView ? "modal-view" : ""}`}
                                                        onClick={() =>
                                                            (gridItem.doc_url || gridItem.pdf_url || gridItem.ppt_url) &&
                                                            showSmartChartDataEditModal(gridItem, "Regenerate")
                                                        }
                                                    >
                                                        <img src="/img/export.svg" /> Regenerate
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div class="no-data-section">
                            <img src="/img/no-data.svg" alt="no-data-img" />
                            <h3>No Data Found</h3>
                            <p>There is no data to show you right now!!!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartChartGridView;
