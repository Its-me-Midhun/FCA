import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getSubSystems = params => fcaGateWay.get(`${serviceEndpoints.subSystemEndPoints.getSubSystems}`, { params });
export const addSubSystem = params => fcaGateWay.post(`${serviceEndpoints.subSystemEndPoints.addSubSystem}`, params);
export const getSubSystemById = subSystem_id => fcaGateWay.get(`${serviceEndpoints.subSystemEndPoints.getSubSystemById}/${subSystem_id}`);
export const updateSubSystem = (subSystem_id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.subSystemEndPoints.updateSubSystem}/${subSystem_id}`, params);
export const deleteSubSystem = subSystem_id => fcaGateWay.delete(`${serviceEndpoints.subSystemEndPoints.deleteSubSystem}/${subSystem_id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.subSystemEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const exportSubSystems = params =>
    fcaGateWay.get(`${serviceEndpoints.subSystemEndPoints.exportSubSystem}`, { method: "GET", responseType: "blob", params });
export const getAllSubSystemLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.subSystemEndPoints.getAllSubSystemLogs}/${id}/logs`, { params });
};
export const restoreSubSystemLog = id => fcaGateWay.patch(`${serviceEndpoints.subSystemEndPoints.restoreSubSystemLog}/${id}/restore`);
export const deleteSubSystemLog = id => fcaGateWay.delete(`${serviceEndpoints.subSystemEndPoints.deleteSubSystemLog}/${id}`);
export const getTradeDropdown = () => fcaGateWay.get(`${serviceEndpoints.subSystemEndPoints.getTradeDropdown}`);
export const getSystemByTradeDropdown = id => fcaGateWay.get(`${serviceEndpoints.subSystemEndPoints.getSystemByTradeDropdown}?master_trade_id=${id}`);
