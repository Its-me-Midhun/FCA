import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/funding_sources/get_list`, {
        params
    });
export const getFundingsourceSettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getFundingsourceSettingsData}/${id}/funding_sources`, { params });
export const addFundingsource = (id, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addFundingsource}/${id}/funding_sources`, params);
export const getFundingsourceById = (id, tradeId) =>
    fcaGateWay.get(
        `${serviceEndpoints.projectEndPoints.getFundingsourceById}/${id}/funding_sources/${tradeId}`
    );
export const updateFundingsource = (id, tradeId, params) =>
    fcaGateWay.patch(
        `${serviceEndpoints.projectEndPoints.updateFundingsource}/${id}/funding_sources/${tradeId}`,
        params
    );
export const deleteFundingsource = (id, tradeId) =>
    fcaGateWay.delete(
        `${serviceEndpoints.projectEndPoints.deleteFundingsource}/${id}/funding_sources/${tradeId}`
    );
export const exportFundingSource = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/${projectId}/funding_sources/export_xl`, { method: "GET",responseType:"blob", params });
export const getAllFundingSourceLogs = (id,params,projectId) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllFundingSourceLogs}/${projectId}/funding_sources/${id}/logs`,{params});
};
export const restoreSettingsLog = (id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);
export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);

