import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}/${id}/get_list`, {
        params
    });

export const getProperties = params => fcaGateWay.get(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}`, { params });

export const addProperty = params => fcaGateWay.post(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}`, { excel_settings: params });
export const getPropertyById = id => fcaGateWay.get(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}/${id}`);

export const updateProperty = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}/${id}`, { excel_settings: params });

export const deleteProperty = params =>
    params.hard_delete
        ? fcaGateWay.delete(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}/${params.id}?hard_delete=true`)
        : fcaGateWay.delete(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}/${params.id}`);

export const restoreProperty = id => fcaGateWay.patch(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}/${id}/restore`);

export const checkPropertyMapped = id => fcaGateWay.get(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}/${id}/mapped_to_template`);

export const exportProperty = params =>
    fcaGateWay.get(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });

export const getAllPropertyLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.reportPropertiesEndPoints.reportProperty}/${id}/logs`, { params });
};

export const restorePropertyLog = id => fcaGateWay.patch(`${serviceEndpoints.reportPropertiesEndPoints.logs}/${id}/restore`);

export const deletePropertyLog = id => fcaGateWay.delete(`${serviceEndpoints.reportPropertiesEndPoints.logs}/${id}`);

export const getDropdownList = level => fcaGateWay.get(`${serviceEndpoints.reportPropertiesEndPoints.dropdown[level]}`);
