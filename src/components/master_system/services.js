import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getSystems = params => fcaGateWay.get(`${serviceEndpoints.systemEndPoints.getSystems}`, { params });
export const addSystem = params => fcaGateWay.post(`${serviceEndpoints.systemEndPoints.addSystem}`, params);
export const getSystemById = system_id => fcaGateWay.get(`${serviceEndpoints.systemEndPoints.getSystemById}/${system_id}`);
export const updateSystem = (system_id, params) => fcaGateWay.patch(`${serviceEndpoints.systemEndPoints.updateSystem}/${system_id}`, params);
export const deleteSystem = system_id => fcaGateWay.delete(`${serviceEndpoints.systemEndPoints.deleteSystem}/${system_id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.systemEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const exportSystems = params =>
    fcaGateWay.get(`${serviceEndpoints.systemEndPoints.exportSystem}`, { method: "GET", responseType: "blob", params });
export const getAllSystemLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.systemEndPoints.getAllSystemLogs}/${id}/logs`, { params });
};
export const restoreSystemLog = id => fcaGateWay.patch(`${serviceEndpoints.systemEndPoints.restoreSystemLog}/${id}/restore`);
export const deleteSystemLog = id => fcaGateWay.delete(`${serviceEndpoints.systemEndPoints.deleteSystemLog}/${id}`);
export const getTradeDropdown = () => fcaGateWay.get(`${serviceEndpoints.systemEndPoints.getTradeDropdown}`);
