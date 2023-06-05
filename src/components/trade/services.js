import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/trades/get_list`, {
        params
    });
export const getTradeSettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getTradeSettingsData}/${id}/trades`, { params });
export const addTrade = (id, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addTrade}/${id}/trades`, params);
export const getTradeById = (id, tradeId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getTradeById}/${id}/trades/${tradeId}`);
export const updateTrade = (id, tradeId, params) =>
    fcaGateWay.put(
        `${serviceEndpoints.projectEndPoints.updateTrade}/${id}/trades/${tradeId}`,
        params
    );
export const deleteTrade = (id, tradeId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteTrade}/${id}/trades/${tradeId}`);
export const exportTradeSettings = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/${projectId}/trades/export_xl`, { method: "GET",responseType:"blob", params });
export const getAllTradeLogs = (id,params,projectId) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllTradeLogs}/${projectId}/trades/${id}/logs`,{params});
};
export const restoreSettingsLog = (id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);
export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);
