import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getReportNoteTemplates = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.reportNoteTemplateEndPoints.getReportNoteTemplates}${dynamicUrl}`, { params });
export const addReportNoteTemplate = (params, dynamicUrl) =>
    fcaGateWay.post(`${serviceEndpoints.reportNoteTemplateEndPoints.addReportNoteTemplate}${dynamicUrl}`, params);
export const getReportNoteTemplateById = (reportNoteTemplate_id, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.reportNoteTemplateEndPoints.getReportNoteTemplateById}${dynamicUrl}/${reportNoteTemplate_id}`);
export const updateReportNoteTemplate = (reportNoteTemplate_id, params, dynamicUrl) =>
    fcaGateWay.patch(`${serviceEndpoints.reportNoteTemplateEndPoints.updateReportNoteTemplate}${dynamicUrl}/${reportNoteTemplate_id}`, params);
export const deleteReportNoteTemplate = (reportNoteTemplate_id, dynamicUrl) =>
    fcaGateWay.delete(`${serviceEndpoints.reportNoteTemplateEndPoints.deleteReportNoteTemplate}${dynamicUrl}/${reportNoteTemplate_id}`);
export const getListForCommonFilter = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.reportNoteTemplateEndPoints.getListForCommonFilter}${dynamicUrl}/get_list`, {
        params
    });
export const exportReportNoteTemplates = (dynamicUrl, params) =>
    fcaGateWay.get(`${serviceEndpoints.reportNoteTemplateEndPoints.exportReportNoteTemplate}${dynamicUrl}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllReportNoteTemplateLogs = (id, params) => {
    let dynamicUrl = localStorage.getItem("dynamicUrl");
    return fcaGateWay.get(`${serviceEndpoints.reportNoteTemplateEndPoints.getAllReportNoteTemplateLogs}${dynamicUrl}/${id}/logs`, { params });
};
export const restoreReportNoteTemplateLog = id =>
    fcaGateWay.patch(`${serviceEndpoints.reportNoteTemplateEndPoints.restoreReportNoteTemplateLog}/${id}/restore`);
export const deleteReportNoteTemplateLog = id =>
    fcaGateWay.delete(`${serviceEndpoints.reportNoteTemplateEndPoints.deleteReportNoteTemplateLog}/${id}`);
export const getAssignModalDetails = (id, type) => {
    return fcaGateWay.get(`${serviceEndpoints.reportNoteTemplateEndPoints.getAssignModalDetails}/${id}/${type}`);
};
export const assignItems = (id, params, type) => fcaGateWay.post(`${serviceEndpoints.reportNoteTemplateEndPoints.assignItems}/${id}/${type}`, params);
