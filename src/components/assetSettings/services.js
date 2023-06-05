import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";
import { AssetSettingsEntities } from "./config";

export const getListForCommonFilter = (params, entity) =>
    fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${AssetSettingsEntities[entity].key}/get_list`, {
        params
    });

export const getDataList = (params, entity) =>
    fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${AssetSettingsEntities[entity].key}`, { params });

export const addData = (params, entity) =>
    fcaGateWay.post(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${AssetSettingsEntities[entity].key}`, {
        [AssetSettingsEntities[entity].apiBodyParam]: params
    });
export const getDataById = (id, entity) =>
    fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${AssetSettingsEntities[entity].key}/${id}`);

export const updateData = (id, params, entity) =>
    fcaGateWay.patch(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${AssetSettingsEntities[entity].key}/${id}`, {
        [AssetSettingsEntities[entity].apiBodyParam]: params
    });
// export const updateDataPiechart = (id, params, entity) =>
//     fcaGateWay.patch(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${AssetSettingsEntities[entity].key}/${id}`, 
//      params
//     );

export const deleteData = (id, entity) =>
    fcaGateWay.delete(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${AssetSettingsEntities[entity].key}/${id}`);

export const exportData = (params, entity) =>
    fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${AssetSettingsEntities[entity].key}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });

export const getAllDataLogs = (id, params, entity) => {
    return fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${AssetSettingsEntities[entity].key}/${id}/logs`, { params });
};

export const restoreDataLog = id => fcaGateWay.patch(`${serviceEndpoints.assetSettingsEndPoints.logs}/${id}/restore`);

export const deleteDataLog = id => fcaGateWay.delete(`${serviceEndpoints.assetSettingsEndPoints.logs}/${id}`);

export const getDropdownList = (level, params) => fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.dropdown[level]}`, { params });
