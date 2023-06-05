import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";
import { PropertyValueEntities } from "./config";

export const getListForCommonFilter = (params, entity) =>
    fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${PropertyValueEntities[entity].key}/get_list`, {
        params
    });

export const getDataList = (params, entity) =>
    fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${PropertyValueEntities[entity].key}`, { params });

export const addData = (params, entity) =>
    fcaGateWay.post(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${PropertyValueEntities[entity].key}`, {
        [PropertyValueEntities[entity].apiBodyParam]: params
    });
export const getDataById = (id, entity) =>
    fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${PropertyValueEntities[entity].key}/${id}`);

export const updateData = (id, params, entity) =>
    fcaGateWay.patch(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${PropertyValueEntities[entity].key}/${id}`, {
        [PropertyValueEntities[entity].apiBodyParam]: params
    });

export const deleteData = (id, entity) =>
    fcaGateWay.delete(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${PropertyValueEntities[entity].key}/${id}`);

export const exportData = (params, entity) =>
    fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${PropertyValueEntities[entity].key}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });

export const getAllDataLogs = (id, params, entity) => {
    return fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${PropertyValueEntities[entity].key}/${id}/logs`, { params });
};

export const restoreDataLog = id => fcaGateWay.patch(`${serviceEndpoints.assetSettingsEndPoints.logs}/${id}/restore`);

export const deleteDataLog = id => fcaGateWay.delete(`${serviceEndpoints.assetSettingsEndPoints.logs}/${id}`);

export const getDropdownList = (level, params) => fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.dropdown[level]}`, { params });

export const checkValueMapped = (id, entity) =>
    fcaGateWay.get(`${serviceEndpoints.assetSettingsEndPoints.assetSettings}/${PropertyValueEntities[entity].key}/${id}/mapped_to_report_property`);
