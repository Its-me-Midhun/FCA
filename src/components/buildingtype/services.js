import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllBuildingTypes = params => fcaGateWay.get(serviceEndpoints.buildingTypeEndPoints.getAllBuildingTypes, { params });
export const addBuildingType = params => fcaGateWay.post(serviceEndpoints.buildingTypeEndPoints.addBuildingType, params);
export const parseFca = (params, id) => fcaGateWay.post(`${serviceEndpoints.buildingTypeEndPoints.parseFca}/${id}/parse_fca`, params);
export const updateBuildingType = (params, id) => fcaGateWay.patch(`${serviceEndpoints.buildingTypeEndPoints.updateBuildingType}/${id}`, params);
export const deleteBuildingType = id => fcaGateWay.delete(`${serviceEndpoints.buildingTypeEndPoints.deleteBuildingType}/${id}`);
export const getRegionsBasedOnClient = params => fcaGateWay.get(`${serviceEndpoints.buildingTypeEndPoints.getRegionsBasedOnClient}`, { params });
export const getAllConsultancyUsers = () => fcaGateWay.get(`${serviceEndpoints.buildingTypeEndPoints.getAllConsultancyUsers}`);
export const getAllClients = param => fcaGateWay.get(`${serviceEndpoints.buildingTypeEndPoints.getAllClients}`, { param });
export const getBuildingTypeById = id => fcaGateWay.get(`${serviceEndpoints.buildingTypeEndPoints.getBuildingTypeById}/${id}`);
export const uploadImage = (imageData, id) => fcaGateWay.post(`${serviceEndpoints.buildingTypeEndPoints.uploadImage}/${id}/upload`, imageData);
export const getAllImages = id => fcaGateWay.get(`${serviceEndpoints.buildingTypeEndPoints.getAllImages}/${id}/images`);
export const deleteImages = id => fcaGateWay.delete(`${serviceEndpoints.buildingTypeEndPoints.deleteImages}/${id}/remove_image`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingTypeEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const getAllBuildingTypeLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.buildingTypeEndPoints.getAllBuildingTypeLogs}/${id}/logs`, { params });
};
export const restoreBuildingTypeLog = id => fcaGateWay.patch(`${serviceEndpoints.buildingTypeEndPoints.restoreBuildingTypeLog}/${id}/restore`);
export const deleteBuildingTypeLog = id => fcaGateWay.delete(`${serviceEndpoints.buildingTypeEndPoints.deleteBuildingTypeLog}/${id}`);
export const exportBuildingType = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingTypeEndPoints.exportBuildingType}/export_xl`, { method: "GET", responseType: "blob", params });

export const getColorCodesBuildingType = (buildilgTypeId, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingTypeEndPoints.colorCodeBuildingType}/${buildilgTypeId}/fci_color_codes`, { method: "GET", params });
export const addColorCodeBuildingType = (buildilgTypeId, params) =>
    fcaGateWay.post(`${serviceEndpoints.buildingTypeEndPoints.colorCodeBuildingType}/${buildilgTypeId}/fci_color_codes`, params);
export const updateColorCodeBuildingType = (buildilgTypeId, id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.buildingTypeEndPoints.colorCodeBuildingType}/${buildilgTypeId}/fci_color_codes/${id}`, params);
export const deleteColorCodeBuildingType = (buildilgTypeId, id) =>
    fcaGateWay.delete(`${serviceEndpoints.buildingTypeEndPoints.colorCodeBuildingType}/${buildilgTypeId}/fci_color_codes/${id}`);
