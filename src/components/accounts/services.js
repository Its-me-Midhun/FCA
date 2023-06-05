import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAccounts = (params, dynamicUrl) => fcaGateWay.get(`${serviceEndpoints.accountEndPoints.getAccounts}`, { params });
export const addAccount = (params, dynamicUrl) => fcaGateWay.post(`${serviceEndpoints.accountEndPoints.addAccount}`, params);
export const getAccountById = (account_id, dynamicUrl) => fcaGateWay.get(`${serviceEndpoints.accountEndPoints.getAccountById}/${account_id}`);
export const updateAccount = (account_id, params, dynamicUrl) =>
    fcaGateWay.patch(`${serviceEndpoints.accountEndPoints.updateAccount}/${account_id}`, params);
export const deleteAccount = (account_id, dynamicUrl) => fcaGateWay.delete(`${serviceEndpoints.accountEndPoints.deleteAccount}/${account_id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.accountEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const exportAccounts = (dynamicUrl, params) =>
    fcaGateWay.get(`${serviceEndpoints.accountEndPoints.exportAccount}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllAccountLogs = (id, params) => {
    let dynamicUrl = localStorage.getItem("dynamicUrl");
    return fcaGateWay.get(`${serviceEndpoints.accountEndPoints.getAllAccountLogs}/${id}/logs`, { params });
};
export const restoreAccountLog = id => {
    return fcaGateWay.patch(`${serviceEndpoints.narrativeTemplateEndPoints.restoreNarrativeTemplateLog}/${id}/restore`);
};
export const deleteAccountLog = id => {
    return fcaGateWay.delete(`${serviceEndpoints.narrativeTemplateEndPoints.deleteNarrativeTemplateLog}/logs/${id}`);
};
export const getAssignModalDetails = (id, type) => {
    return fcaGateWay.get(`${serviceEndpoints.accountEndPoints.getAssignModalDetails}/${id}/${type}`);
};
export const assignItems = (id, params, type) => fcaGateWay.post(`${serviceEndpoints.accountEndPoints.assignItems}/${id}/${type}`, params);
