import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getTrades = params => fcaGateWay.get(`${serviceEndpoints.tradeEndPoints.getTrades}`, { params });
export const addTrade = params => fcaGateWay.post(`${serviceEndpoints.tradeEndPoints.addTrade}`, params);
export const getTradeById = trade_id => fcaGateWay.get(`${serviceEndpoints.tradeEndPoints.getTradeById}/${trade_id}`);
export const updateTrade = (trade_id, params) => fcaGateWay.patch(`${serviceEndpoints.tradeEndPoints.updateTrade}/${trade_id}`, params);
export const deleteTrade = trade_id => fcaGateWay.delete(`${serviceEndpoints.tradeEndPoints.deleteTrade}/${trade_id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.tradeEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const exportTrades = params =>
    fcaGateWay.get(`${serviceEndpoints.tradeEndPoints.exportTrade}`, { method: "GET", responseType: "blob", params });
export const getAllTradeLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.tradeEndPoints.getAllTradeLogs}/${id}/logs`, { params });
};
export const restoreTradeLog = id => fcaGateWay.patch(`${serviceEndpoints.tradeEndPoints.restoreTradeLog}/${id}/restore`);
export const deleteTradeLog = id => fcaGateWay.delete(`${serviceEndpoints.tradeEndPoints.deleteTradeLog}/${id}`);
