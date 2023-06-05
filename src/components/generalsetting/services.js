import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/year_limits/get_list`, {
        params
    });
export const addLimit = (id, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addLimit}/${id}/year_limits`, params);
export const getaddLimit = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getaddLimit}/${id}/year_limits`, { params });
export const getGeneralById = (id, limitId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getGeneralById}/${id}/year_limits/${limitId}`);
export const updateGeneral = (id, departmentId, params) =>
    fcaGateWay.patch(
        `${serviceEndpoints.projectEndPoints.updateGeneral}/${id}/year_limits/${departmentId}`,
        params
    );
export const deleteGeneral = (id, departmentId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteGeneral}/${id}/year_limits/${departmentId}`);
export const exportGeneralSettings = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/${projectId}/year_limits/export_xl`, { method: "GET",responseType:"blob", params });
export const getAllGeneralLogs = (id,params,projectId) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllGeneralLogs}/${projectId}/year_limits/${id}/logs`,{params});
};
export const restoreSettingsLog = (id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);
export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);
