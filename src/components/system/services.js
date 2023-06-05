import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/systems/get_list`, {
        params
    });
export const getSystemSettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSystemSettingsData}/${id}/systems`, { params });
export const addSystem = (id, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addSystem}/${id}/systems`, params);
export const getSystemById = (id, systemId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSystemById}/${id}/systems/${systemId}`);
export const updateSystem = (id, systemId, params) =>
    fcaGateWay.patch(
        `${serviceEndpoints.projectEndPoints.updateSystem}/${id}/systems/${systemId}`,
        params
    );
export const deleteSystem = (id, systemId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSystem}/${id}/systems/${systemId}`);
export const getTradeSettingsDropdown = id =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getTradeSettingsDropdown}/${id}/trades_dropdown`);
export const exportSystemSettings = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/${projectId}/systems/export_xl`, { method: "GET",responseType:"blob", params });
export const getAllSystemLogs = (id,params,projectId) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllSystemLogs}/${projectId}/systems/${id}/logs`,{params});
};
export const restoreSettingsLog = (id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);
export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);
