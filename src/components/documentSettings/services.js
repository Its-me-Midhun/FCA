import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";
import { DocumentSettingsEntities } from "./config";

export const getDataList = (params, entity) =>
    fcaGateWay.get(`${serviceEndpoints.documentSettingEndPoints.documentSetting}/${DocumentSettingsEntities[entity].key}`, { params });

export const addData = (params, entity) =>
    fcaGateWay.post(`${serviceEndpoints.documentSettingEndPoints.documentSetting}/${DocumentSettingsEntities[entity].key}`, {
        [DocumentSettingsEntities[entity].apiBodyParam]: params
    });

export const getDataById = (id, entity) =>
    fcaGateWay.get(`${serviceEndpoints.documentSettingEndPoints.documentSetting}/${DocumentSettingsEntities[entity].key}/${id}`);

export const updateData = (id, params, entity) =>
    fcaGateWay.patch(`${serviceEndpoints.documentSettingEndPoints.documentSetting}/${DocumentSettingsEntities[entity].key}/${id}`, {
        [DocumentSettingsEntities[entity].apiBodyParam]: params
    });

export const getListForCommonFilter = (params, entity) =>
    fcaGateWay.get(`${serviceEndpoints.documentSettingEndPoints.documentSetting}/${DocumentSettingsEntities[entity].key}/get_list`, {
        params
    });

export const deleteData = (id, entity) =>
    fcaGateWay.delete(`${serviceEndpoints.documentSettingEndPoints.documentSetting}/${DocumentSettingsEntities[entity].key}/${id}`);

export const exportData = (params, entity) =>
    fcaGateWay.get(`${serviceEndpoints.documentSettingEndPoints.documentSetting}/${DocumentSettingsEntities[entity].key}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllDataLogs = (id, params, entity) => {
    return fcaGateWay.get(`${serviceEndpoints.documentSettingEndPoints.documentSetting}/${DocumentSettingsEntities[entity].key}/${id}/logs`, {
        params
    });
};

export const restoreDataLog = id => fcaGateWay.patch(`${serviceEndpoints.documentSettingEndPoints.logs}/${id}/restore`);

export const deleteDataLog = id => fcaGateWay.delete(`${serviceEndpoints.documentSettingEndPoints.logs}/${id}`);

//all clients ine formile dropdownil kittan
export const getDropdownList = (level, params) => fcaGateWay.get(`${serviceEndpoints.documentSettingEndPoints.dropdown[level]}`, { params });
