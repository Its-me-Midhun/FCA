import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getNarrativeTemplates = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getNarrativeTemplates}${dynamicUrl}`, { params });
export const addNarrativeTemplate = (params, dynamicUrl) =>
    fcaGateWay.post(`${serviceEndpoints.narrativeTemplateEndPoints.addNarrativeTemplate}${dynamicUrl}`, params);
export const getNarrativeTemplateById = (narrativeTemplate_id, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getNarrativeTemplateById}${dynamicUrl}/${narrativeTemplate_id}`);
export const updateNarrativeTemplate = (narrativeTemplate_id, params, dynamicUrl) =>
    fcaGateWay.patch(`${serviceEndpoints.narrativeTemplateEndPoints.updateNarrativeTemplate}${dynamicUrl}/${narrativeTemplate_id}`, params);
export const deleteNarrativeTemplate = (narrativeTemplate_id, dynamicUrl) =>
    fcaGateWay.delete(`${serviceEndpoints.narrativeTemplateEndPoints.deleteNarrativeTemplate}${dynamicUrl}/${narrativeTemplate_id}`);
export const getListForCommonFilter = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getListForCommonFilter}${dynamicUrl}/get_list`, {
        params
    });
export const exportNarrativeTemplates = (dynamicUrl, params) =>
    fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.exportNarrativeTemplate}${dynamicUrl}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllNarrativeTemplateLogs = (id, params) => {
    let dynamicUrl = localStorage.getItem("dynamicUrl");
    return fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getAllNarrativeTemplateLogs}${dynamicUrl}/${id}/logs`, { params });
};
export const restoreNarrativeTemplateLog = id => {
    return fcaGateWay.patch(`${serviceEndpoints.narrativeTemplateEndPoints.restoreNarrativeTemplateLog}/${id}/restore`);
};
export const deleteNarrativeTemplateLog = id => {
    return fcaGateWay.delete(`${serviceEndpoints.narrativeTemplateEndPoints.deleteNarrativeTemplateLog}/${id}`);
};
export const getAssignModalDetails = (id, type) => {
    return fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getAssignModalDetails}/${id}/${type}`);
};
export const assignItems = (id, params, type) => fcaGateWay.post(`${serviceEndpoints.narrativeTemplateEndPoints.assignItems}/${id}/${type}`, params);
