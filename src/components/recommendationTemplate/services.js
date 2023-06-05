import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getRecommendationTemplates = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationTemplateEndPoints.getRecommendationTemplates}${dynamicUrl}`, { params });
export const addRecommendationTemplate = (params, dynamicUrl) =>
    fcaGateWay.post(`${serviceEndpoints.recommendationTemplateEndPoints.addRecommendationTemplate}${dynamicUrl}`, params);
export const getRecommendationTemplateById = (reportNoteTemplate_id, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationTemplateEndPoints.getRecommendationTemplateById}${dynamicUrl}/${reportNoteTemplate_id}`);
export const updateRecommendationTemplate = (reportNoteTemplate_id, params, dynamicUrl) =>
    fcaGateWay.patch(`${serviceEndpoints.recommendationTemplateEndPoints.updateRecommendationTemplate}${dynamicUrl}/${reportNoteTemplate_id}`, params);
export const deleteRecommendationTemplate = (reportNoteTemplate_id, dynamicUrl) =>
    fcaGateWay.delete(`${serviceEndpoints.recommendationTemplateEndPoints.deleteRecommendationTemplate}${dynamicUrl}/${reportNoteTemplate_id}`);
export const getListForCommonFilter = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationTemplateEndPoints.getListForCommonFilter}${dynamicUrl}/get_list`, {
        params
    });
export const exportRecommendationTemplates = (dynamicUrl, params) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationTemplateEndPoints.exportRecommendationTemplate}${dynamicUrl}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllRecommendationTemplateLogs = (id, params) => {
    let dynamicUrl = localStorage.getItem("dynamicUrl");
    return fcaGateWay.get(`${serviceEndpoints.recommendationTemplateEndPoints.getAllRecommendationTemplateLogs}${dynamicUrl}/${id}/logs`, { params });
};
export const restoreRecommendationTemplateLog = id =>
    fcaGateWay.patch(`${serviceEndpoints.recommendationTemplateEndPoints.restoreRecommendationTemplateLog}/${id}/restore`);
export const deleteRecommendationTemplateLog = id =>
    fcaGateWay.delete(`${serviceEndpoints.recommendationTemplateEndPoints.deleteRecommendationTemplateLog}/${id}`);
export const getAssignModalDetails = (id, type) => {
    return fcaGateWay.get(`${serviceEndpoints.recommendationTemplateEndPoints.getAssignModalDetails}/${id}/${type}`);
};
export const assignItems = (id, params, type) => fcaGateWay.post(`${serviceEndpoints.recommendationTemplateEndPoints.assignItems}/${id}/${type}`, params);
