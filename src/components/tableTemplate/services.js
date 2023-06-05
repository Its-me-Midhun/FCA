import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getTableTemplates = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.tableTemplateEndPoints.getTableTemplates}${dynamicUrl}`, { params });
export const addTableTemplate = (params, dynamicUrl) =>
    fcaGateWay.post(`${serviceEndpoints.tableTemplateEndPoints.addTableTemplate}${dynamicUrl}`, params);
export const getTableTemplateById = (tableTemplate_id, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.tableTemplateEndPoints.getTableTemplateById}${dynamicUrl}/${tableTemplate_id}`);
export const updateTableTemplate = (tableTemplate_id, params, dynamicUrl) =>
    fcaGateWay.patch(`${serviceEndpoints.tableTemplateEndPoints.updateTableTemplate}${dynamicUrl}/${tableTemplate_id}`, params);
export const deleteTableTemplate = (tableTemplate_id, dynamicUrl) =>
    fcaGateWay.delete(`${serviceEndpoints.tableTemplateEndPoints.deleteTableTemplate}${dynamicUrl}/${tableTemplate_id}`);
export const getListForCommonFilter = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.tableTemplateEndPoints.getListForCommonFilter}${dynamicUrl}/get_list`, {
        params
    });
export const exportTableTemplates = (dynamicUrl, params) =>
    fcaGateWay.get(`${serviceEndpoints.tableTemplateEndPoints.exportTableTemplate}${dynamicUrl}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllTableTemplateLogs = (id, params) => {
    let dynamicUrl = localStorage.getItem("dynamicUrl");
    return fcaGateWay.get(`${serviceEndpoints.tableTemplateEndPoints.getAllTableTemplateLogs}${dynamicUrl}/${id}/logs`, { params });
};
export const restoreTableTemplateLog = id => fcaGateWay.patch(`${serviceEndpoints.tableTemplateEndPoints.restoreTableTemplateLog}/${id}/restore`);
export const deleteTableTemplateLog = id => fcaGateWay.delete(`${serviceEndpoints.tableTemplateEndPoints.deleteTableTemplateLog}/${id}`);
export const getAssignModalDetails = (id, type) => {
    return fcaGateWay.get(`${serviceEndpoints.tableTemplateEndPoints.getAssignModalDetails}/${id}/${type}`);
};
export const assignItems = (id, params, type) => fcaGateWay.post(`${serviceEndpoints.tableTemplateEndPoints.assignItems}/${id}/${type}`, params);
