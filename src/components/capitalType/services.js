import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/asset_conditions/get_list`, {
        params
    });
export const getCapitalTypeSettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getCapitalTypeSettingsData}/${id}/capital_types`, { params });
export const getCapitalTypeById = (id, capitalTypeId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getCapitalTypeSettingsData}/${id}/capital_types/${capitalTypeId}`);
export const updateCapitalType = (id, AssetConditionId, params) =>
    fcaGateWay.patch(
        `${serviceEndpoints.projectEndPoints.getCapitalTypeSettingsData}/${id}/capital_types/${AssetConditionId}`,
        params
    );
export const deleteAssetCondition = (id, AssetConditionId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteAssetCondition}/${id}/asset_conditions/${AssetConditionId}`);
export const exportAssetConditionSettings = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/${projectId}/asset_conditions/export_xl`, { method: "GET",responseType:"blob", params });
export const getAllAssetConditionLogs = (id,params,projectId) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllAssetConditionLogs}/${projectId}/asset_conditions/${id}/logs`,{params});
};
export const restoreSettingsLog = (id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);
export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);
