import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getSpecialReports = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(`${serviceEndpoints.specialReportEndPoints.getSpecialReports}${dynamicUrl}${spReportEntityData || ""}`, { params });
};
export const addSpecialReport = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.post(`${serviceEndpoints.specialReportEndPoints.addSpecialReport}${dynamicUrl}${spReportEntityData || ""}`, params);
};
export const getSpecialReportById = (specialReport_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(
        `${serviceEndpoints.specialReportEndPoints.getSpecialReportById}${dynamicUrl}/${specialReport_id}${spReportEntityData || ""}`
    );
};
export const updateSpecialReport = (specialReport_id, params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.patch(
        `${serviceEndpoints.specialReportEndPoints.updateSpecialReport}${dynamicUrl}/${specialReport_id}${spReportEntityData || ""}`,
        params
    );
};
export const deleteSpecialReport = (specialReport_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.delete(
        `${serviceEndpoints.specialReportEndPoints.deleteSpecialReport}${dynamicUrl}/${specialReport_id}${spReportEntityData || ""}`
    );
};
export const getListForCommonFilter = (params, url) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/special_reports/get_list`;
    if (dynamicUrl === "/special") {
        dynamicUrl = `/special_reports/get_list`;
    } else {
        dynamicUrl = `${dynamicUrl}_special_reports/get_list${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.specialReportEndPoints.getListForCommonFilter}${dynamicUrl}`, {
        params
    });
};
export const exportSpecialReports = (url, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/special_reports/export_xl`;
    if (dynamicUrl === "/special") {
        dynamicUrl = `/special_reports/export_xl`;
    } else {
        dynamicUrl = `${dynamicUrl}_special_reports/export_xl${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.specialReportEndPoints.exportSpecialReport}${dynamicUrl}`, {
        method: "GET",
        responseType: "blob",
        params
    });
};
export const getAllSpecialReportLogs = (id, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/special_reports/${id}/logs`;
    if (dynamicUrl === "/special") {
        dynamicUrl = `/special_reports/${id}/logs`;
    } else {
        dynamicUrl = `${dynamicUrl}_special_reports/${id}/logs${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.specialReportEndPoints.getAllSpecialReportLogs}${dynamicUrl}`, { params });
};
export const restoreSpecialReportLog = id => fcaGateWay.patch(`${serviceEndpoints.specialReportEndPoints.restoreSpecialReportLog}/${id}/restore`);
export const deleteSpecialReportLog = id => fcaGateWay.delete(`${serviceEndpoints.specialReportEndPoints.deleteSpecialReportLog}/${id}`);
