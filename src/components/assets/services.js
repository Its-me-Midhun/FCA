import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.assetEndPoints.assets}/get_list`, {
        params
    });

export const getDataList = params => fcaGateWay.get(`${serviceEndpoints.assetEndPoints.assets}`, { params });
export const getChartAssetDataList = params => fcaGateWay.get(`${serviceEndpoints.assetEndPoints.chartAssets}`, { params });

export const addData = params => fcaGateWay.post(`${serviceEndpoints.assetEndPoints.assets}`, params);
export const getDataById = id => fcaGateWay.get(`${serviceEndpoints.assetEndPoints.assets}/${id}`);

export const updateData = (id, params) => fcaGateWay.patch(`${serviceEndpoints.assetEndPoints.assets}/${id}`, params);

export const deleteData = id => fcaGateWay.delete(`${serviceEndpoints.assetEndPoints.assets}/${id}`);

export const exportData = params =>
    fcaGateWay.get(`${serviceEndpoints.assetEndPoints.assets}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });

export const exportCustomExcel = params =>
    fcaGateWay.get(`${serviceEndpoints.assetEndPoints.assets}/custom_export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });

export const getAllDataLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.assetEndPoints.assets}/${id}/logs`, { params });
};

export const restoreDataLog = id => fcaGateWay.patch(`${serviceEndpoints.assetEndPoints.logs}/${id}/restore`);

export const deleteDataLog = id => fcaGateWay.delete(`${serviceEndpoints.assetEndPoints.logs}/${id}`);

export const getDropdownList = (level, params) =>
    level === "regions"
        ? fcaGateWay.get(`${serviceEndpoints.assetEndPoints.dropdown.clients}/${params.client_id}/regions`)
        : level === "sites"
        ? fcaGateWay.get(`${serviceEndpoints.assetEndPoints.dropdown.regions}/${params.region_id}/sites`)
        : level === "buildings"
        // ? fcaGateWay.get(`${serviceEndpoints.assetEndPoints.dropdown.sites}/${params.site_id}/buildings`)
        ? fcaGateWay.get(`${serviceEndpoints.assetEndPoints.dropdown.sites}/${params.site_id}/buildings_dropdown`)
        : level === "additions"
        ? fcaGateWay.get(`${serviceEndpoints.assetEndPoints.dropdown.buildings}/${params.building_id}/additions`)
        : level === "floors"
        ? fcaGateWay.get(`${serviceEndpoints.assetEndPoints.dropdown.buildings}/${params.building_id}/floors`)
        : fcaGateWay.get(`${serviceEndpoints.assetEndPoints.dropdown[level]}`, { params });

//Asset Image
export const getAllImages = (id, params) => fcaGateWay.get(`${serviceEndpoints.assetEndPoints.assets}/${id}/images`, { params });
export const uploadImage = (imageData, id) => fcaGateWay.post(`${serviceEndpoints.assetEndPoints.assets}/${id}/upload`, imageData);
export const updateAssetImage = imageData => fcaGateWay.patch(`${serviceEndpoints.assetEndPoints.assets}/${imageData.id}/update_image`, imageData);
export const deleteImages = id => fcaGateWay.delete(`${serviceEndpoints.assetEndPoints.assets}/${id}/remove_image`);
