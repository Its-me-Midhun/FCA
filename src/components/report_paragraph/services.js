import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getReportParagraphs = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(`${serviceEndpoints.reportParagraphEndPoints.getReportParagraphs}${dynamicUrl}${spReportEntityData || ""}`, { params });
};
export const addReportParagraph = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.post(`${serviceEndpoints.reportParagraphEndPoints.addReportParagraph}${dynamicUrl}${spReportEntityData || ""}`, params);
};
export const getReportParagraphById = (reportParagraph_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(
        `${serviceEndpoints.reportParagraphEndPoints.getReportParagraphById}${dynamicUrl}/${reportParagraph_id}${spReportEntityData || ""}`
    );
};
export const updateReportParagraph = (reportParagraph_id, params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.patch(
        `${serviceEndpoints.reportParagraphEndPoints.updateReportParagraph}${dynamicUrl}/${reportParagraph_id}${spReportEntityData || ""}`,
        params
    );
};
export const deleteReportParagraph = (reportParagraph_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.delete(
        `${serviceEndpoints.reportParagraphEndPoints.deleteReportParagraph}${dynamicUrl}/${reportParagraph_id}${spReportEntityData || ""}`
    );
};
export const getListForCommonFilter = (params, url) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : "/report_paragraphs/get_list";
    if (dynamicUrl === "/report") {
        dynamicUrl = `/report_paragraphs/get_list`;
    } else {
        dynamicUrl = `${dynamicUrl}_report_paragraphs/get_list${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.reportParagraphEndPoints.getListForCommonFilter}${dynamicUrl}`, {
        params
    });
};
export const exportReportParagraphs = (url, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : "/report_paragraphs/export_xl";
    if (dynamicUrl === "/report") {
        dynamicUrl = `/report_paragraphs/export_xl`;
    } else {
        dynamicUrl = `${dynamicUrl}_report_paragraphs/export_xl${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.reportParagraphEndPoints.exportReportParagraph}${dynamicUrl}`, {
        method: "GET",
        responseType: "blob",
        params
    });
};
export const getAllReportParagraphLogs = (id, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/report_paragraphs/${id}/logs`;
    if (dynamicUrl === "/report") {
        dynamicUrl = `/report_paragraphs/${id}/logs`;
    } else {
        dynamicUrl = `${dynamicUrl}_report_paragraphs/${id}/logs${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.reportParagraphEndPoints.getAllReportParagraphLogs}${dynamicUrl}`, { params });
};
export const restoreReportParagraphLog = id =>
    fcaGateWay.patch(`${serviceEndpoints.reportParagraphEndPoints.restoreReportParagraphLog}/${id}/restore`);
export const deleteReportParagraphLog = id => fcaGateWay.delete(`${serviceEndpoints.reportParagraphEndPoints.deleteReportParagraphLog}/${id}`);
export const getSpecialReportsDropdown = () => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/special_reports/dropdown`;
    if (dynamicUrl === "/report") {
        dynamicUrl = `/special_reports/dropdown`;
    } else {
        dynamicUrl = `${dynamicUrl}_special_reports/dropdown${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.reportParagraphEndPoints.getSpecialReportsDropdown}${dynamicUrl}`);
};
