import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/priorities/get_list`, {
        params
    });
export const addPriority = (id, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addPriority}/${id}/priorities`, params);
export const getPriority = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getPriority}/${id}/priorities`, { params });
export const getPriorityById = (id, limitId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getPriorityById}/${id}/priorities/${limitId}`);
export const updatePriority = (id, departmentId, params) =>
    fcaGateWay.patch(
        `${serviceEndpoints.projectEndPoints.updatePriority}/${id}/priorities/${departmentId}`,
        params
    );
export const deletePriority = (id, departmentId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deletePriority}/${id}/priorities/${departmentId}`);
export const exportPrioritySettings = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/${projectId}/priorities/export_xl`, { method: "GET",responseType:"blob", params },);
export const getAllPriorityLogs = (id,params,projectId) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllPriorityLogs}/${projectId}/priorities/${id}/logs`,{params});
};
export const restoreSettingsLog = (id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);
export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);
export const getSitesByRegionInPriority = (id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSitesByRegionInPriority}/${id}/site_dropdown`);

