import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllConsultancies = params => {
    return fcaGateWay.get(serviceEndpoints.consultancyEndPoints.getAllConsultancies, { params });
};
export const addConsultancy = params => fcaGateWay.post(serviceEndpoints.consultancyEndPoints.addConsultancy, params);
export const updateConsultancy = (params, id) => fcaGateWay.patch(`${serviceEndpoints.consultancyEndPoints.updateConsultancy}/${id}`, params);
export const deleteConsultancy = id => fcaGateWay.delete(`${serviceEndpoints.consultancyEndPoints.deleteConsultancy}/${id}`);
export const getAllConsultancyUsers = () => fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.getAllConsultancyUsers}`);
export const getAllClients = () => fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.getAllClients}`);
export const getConsultancyById = id => fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.getConsultancyById}/${id}`);
export const uploadImage = (imageData, id) => fcaGateWay.post(`${serviceEndpoints.consultancyEndPoints.uploadImage}/${id}/upload`, imageData);
export const getAllImages = id => fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.getAllImages}/${id}/images`);
export const deleteImages = id => fcaGateWay.delete(`${serviceEndpoints.consultancyEndPoints.deleteImages}/${id}/remove_image`);
export const updateImageComment = imageData =>
    fcaGateWay.patch(`${serviceEndpoints.consultancyEndPoints.updateImageComment}/${imageData.id}/update_image`, imageData);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const exportConsultancy = (params) => fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.exportConsultancy}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportRegionByProject = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.exportRegion}/export_xl`, { method: "GET", responseType: "blob", params });
export const getAllConsultancyLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.getAllConsultancyLogs}/${id}/logs`, { params });
};
export const restoreConsultancyLog = (id) => fcaGateWay.patch(`${serviceEndpoints.consultancyEndPoints.restoreConsultancyLog}/${id}/restore`);
export const deleteConsultancyLog = id => fcaGateWay.delete(`${serviceEndpoints.consultancyEndPoints.deleteConsultancyLog}/${id}`);
export const getChartsByRegion = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.getAllRegions}/${chartParams.regionId}/charts`, { params });
export const getProjectsBasedOnClient = id =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getProjectsBasedOnClient}/${id}/projects_dropdown`);
export const getEfciByRegion = (projectId, regionId) => fcaGateWay.get(`${serviceEndpoints.consultancyEndPoints.getEfciByRegion}/${projectId}/regions/${regionId}/efcis`);

//efci for chart
export const getChartEfciRegion = (regionId, projectId, params) =>
fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/regions/${regionId}/simulation`, { params });

export const saveDataEfciRegionChart = (regionId, projectId) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/regions/${regionId}/save_to_site`);
export const loadChartDataRegion = (regionId, projectId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/regions/${regionId}/load_data`);
export const updateRegionFundingCost = (value, id) => fcaGateWay.patch(`${serviceEndpoints.consultancyEndPoints.updateEfciData}/${id}`, { main_funding_option: { value: value } });
export const updateRegionFundingCostEfci = (value, id) => fcaGateWay.patch(`${serviceEndpoints.consultancyEndPoints.updateFCEfci}/${id}`, { main_fci: { value: value } });
export const updateRegionAnnualFundingOption = (amount, id) => fcaGateWay.patch(`${serviceEndpoints.consultancyEndPoints.updateRegionAnnualFundingOption}/${id}`, { main_annual_funding: { amount: amount } });
export const updateRegionAnnualEfci = (id, value) => fcaGateWay.patch(`${serviceEndpoints.consultancyEndPoints.updateRegionAnnualEfci}/${id}`, { main_annual_fci: { value: value } });

