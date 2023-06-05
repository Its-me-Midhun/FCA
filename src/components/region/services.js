import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllRegions = params => {
    if (params.project_id) {
        return fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getAllRegionsByProject}/${params.project_id}/regions`, { params });
    }
    return fcaGateWay.get(serviceEndpoints.regionEndPoints.getAllRegions, { params });
};
export const addRegion = params => fcaGateWay.post(serviceEndpoints.regionEndPoints.addRegion, params);
export const updateRegion = (params, id) => fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateRegion}/${id}`, params);
export const deleteRegion = id => fcaGateWay.delete(`${serviceEndpoints.regionEndPoints.deleteRegion}/${id}`);
export const getAllConsultancyUsers = params => fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getAllConsultancyUsers}`, { params });
export const getAllClients = params => fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getAllClients}`, { params });
export const getRegionById = (id, params) => fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getRegionById}/${id}`, { params });
export const uploadImage = (imageData, id) => fcaGateWay.post(`${serviceEndpoints.regionEndPoints.uploadImage}/${id}/upload`, imageData);
export const getAllImages = (id, params) => fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getAllImages}/${id}/images`, { params });
export const deleteImages = id => fcaGateWay.delete(`${serviceEndpoints.regionEndPoints.deleteImages}/${id}/remove_image`);
export const updateImageComment = imageData =>
    fcaGateWay.patch(
        `${serviceEndpoints.regionEndPoints.updateImageComment}/${imageData.id}/update_image`,
        imageData
        // imageData.default ? { default: imageData.default } : { description: imageData.description }
    );
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const exportRegion = params =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.exportRegion}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportRegionByProject = (projectId, params) =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.exportRegion}/export_xl`, { method: "GET", responseType: "blob", params });
export const getAllLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getAllLogs}/${id}/logs`, { params });
};
export const restoreRegionLog = id => fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.restoreRegionLog}/${id}/restore`);
export const deleteRegionLog = id => fcaGateWay.delete(`${serviceEndpoints.regionEndPoints.deleteRegionLog}/${id}`);
export const getChartsByRegion = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getAllRegions}/${chartParams.regionId}/charts`, { params });
export const getProjectsBasedOnClient = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getProjectsBasedOnClient}/projects_dropdown`, { params });
export const getEfciByRegion = (projectId, regionId) =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getEfciByRegion}/${projectId}/regions/${regionId}/efcis`);

//efci for chart
export const getChartEfciRegion = (regionId, projectId, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/regions/${regionId}/simulation`, { params });

export const saveDataEfciRegionChart = (regionId, projectId) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/regions/${regionId}/save_to_site`);
export const loadChartDataRegion = (regionId, projectId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/regions/${regionId}/load_data`);
export const updateRegionFundingCost = (value, id) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateEfciData}/${id}`, { main_funding_option: { value: value } });
export const updateRegionFundingCostEfci = (value, id) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateFCEfci}/${id}`, { main_fci: { value: value } });
export const updateRegionAnnualFundingOption = (amount, id) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateRegionAnnualFundingOption}/${id}`, { main_annual_funding: { amount: amount } });
export const updateRegionAnnualEfci = (id, value) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateRegionAnnualEfci}/${id}`, { main_annual_fci: { value: value } });
export const updateCspSummary = (id, percentage) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateCspSummary}/${id}`, { main_csp: { percentage: percentage } });
export const getCspLogById = id => fcaGateWay.get(`${serviceEndpoints.regionEndPoints.updateCspSummary}/${id}/logs`);

export const saveDataEfciChartRegion = (regionId, projectId) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/regions/${regionId}/save_data`);
export const getAllClientUsers = params => fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getAllClientUsers}/client_users_dropdown`, { params });

export const lockRegion = (id, regionId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${id}/regions/${regionId}/lock`, params);
export const lockRegionSandbox = (id, regionId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${id}/regions/${regionId}/temp_lock`, params);
export const getAllConsultanciesDropdown = () =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.getAllConsultanciesDropdown}/consultancies_dropdown`);
export const getChartExportRegion = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${chartParams.projectId}/regions/${chartParams.regionId}/export_chart`, {
        method: "GET",
        responseType: "blob",
        params
    });
