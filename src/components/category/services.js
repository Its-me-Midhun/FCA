import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/categories/get_list`, {
        params
    });
export const getCategorySettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getCategorySettingsData}/${id}/categories`, { params });
export const addCategory = (id, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addCategory}/${id}/categories`, params);
export const getCategoryById = (id, tradeId) =>
    fcaGateWay.get(
        `${serviceEndpoints.projectEndPoints.getCategoryById}/${id}/categories/${tradeId}`
    );
export const updateCategory = (id, tradeId, params) =>
    fcaGateWay.patch(
        `${serviceEndpoints.projectEndPoints.updateCategory}/${id}/categories/${tradeId}`,
        params
    );
export const deleteCategory = (id, tradeId) =>
    fcaGateWay.delete(
        `${serviceEndpoints.projectEndPoints.deleteTrade}/${id}/categories/${tradeId}`
    );
export const exportCategorySettings = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/${projectId}/categories/export_xl`, { method: "GET",responseType:"blob", params });
export const getAllCategoryLogs = (id,params,projectId) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllCategoryLogs}/${projectId}/categories/${id}/logs`,{params});
};
export const restoreSettingsLog = (id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);
export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);
