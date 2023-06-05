import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/sub_systems/get_list`, {
        params
    });
export const getSubsystemSettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSubsystemSettingsData}/${id}/sub_systems`, { params });
export const addSubsystem = (id, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addSubsystem}/${id}/sub_systems`, params);
export const getSubsystemById = (id, subsystemId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSubsystemById}/${id}/sub_systems/${subsystemId}`);
export const updateSubsystem = (id, subsystemId, params) =>
    fcaGateWay.patch(
        `${serviceEndpoints.projectEndPoints.updateSubsystem}/${id}/sub_systems/${subsystemId}`,
        params
    );
export const deleteSubsystem = (id, subsystemId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSubsystem}/${id}/sub_systems/${subsystemId}`);
export const getTradeSettingsDropdown = id =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getTradeSettingsDropdown}/${id}/trades_dropdown`);
export const getSystemSettingsDropdown = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSystemSettingsDropdown}/${id}/systems_dropdown`, { params });
export const exportSubSystemSettings = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/${projectId}/sub_systems/export_xl`, { method: "GET",responseType:"blob", params });
export const getAllSubSystemLogs = (id,params,projectId) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllSubSystemLogs}/${projectId}/sub_systems/${id}/logs`,{params});
};
export const restoreSettingsLog = (id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);
export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);

