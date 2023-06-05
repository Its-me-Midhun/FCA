import { fcaGateWay, restCountriesGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllBuildings = params => fcaGateWay.get(serviceEndpoints.buildingEndPoints.getAllBuildings, { params });
export const addBuilding = params => fcaGateWay.post(serviceEndpoints.buildingEndPoints.addBuilding, params);
export const updateBuilding = (params, id) => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateBuilding}/${id}`, params);
export const deleteBuilding = id => fcaGateWay.delete(`${serviceEndpoints.buildingEndPoints.deleteBuilding}/${id}`);
export const getRegionsBasedOnClient = id => fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getRegionsBasedOnClient}/${id}/regions`);
export const getSitesBasedOnRegion = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getSitesBasedOnRegion}/${id}/sites`, {
        params
    });
export const getSitesBasedOnRegionDropdown = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getSitesBasedOnRegion}/${id}/site_dropdown`, {
        params
    });
export const getCategoryBasedOnProject = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getCategoryBasedOnProject}/categories_dropdown`);
export const getAllBuldingConsultancyUsers = params => fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getAllConsultancyUsers}`, { params });
export const getDepartmentByProject = id => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getDepartmentByProject}/${id}/departments_dropdown`);
export const BuildinggetAllClients = params => fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getAllClients}`, { params });

// export const getBuildingById = id =>
//     fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getBuildingById}/${id}`);
export const getBuildingById = (id, projectId) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getBuildingById}/${id}?project_id=${projectId}`);

export const getBuildingsBasedOnSite = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getBuildingsBasedOnSite}/${id}/buildings`, { params });
export const uploadImage = (imageData, id) => fcaGateWay.post(`${serviceEndpoints.buildingEndPoints.uploadImage}/${id}/upload`, imageData);
export const getAllImages = (id, params) => fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getAllImages}/${id}/images`, { params });
export const deleteImages = id => fcaGateWay.delete(`${serviceEndpoints.buildingEndPoints.deleteImages}/${id}/remove_image`);
export const updateImageComment = imageData =>
    fcaGateWay.patch(
        `${serviceEndpoints.buildingEndPoints.updateImageComment}/${imageData.id}/update_image`,
        imageData
        // imageData.default ? { default: imageData.default } : { description: imageData.description }
    );

export const getSystemBasedOnProject = id => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getSystemBasedOnProject}/systems_dropdown`);
export const getTradeBasedOnProject = id => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getSystemBasedOnProject}/trades_dropdown`);
export const getSubSystemBasedOnProject = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getSubSystemBasedOnProject}/sub_systems_dropdown`);

// To get all country list (Public API)
export const getAllCountries = () => restCountriesGateWay.get(serviceEndpoints.buildingEndPoints.getAllCountries);
export const getProjectsBasedOnClient = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getProjectsBasedOnClient}/projects_dropdown`, { params });
export const getEfciBasedOnProject = (
    projectId,
    buildingId // Get EFCI based on Building under Project
) => fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getEfciBasedOnProject}/${projectId}/buildings/${buildingId}/efcis`);
export const updateCapitalSpendingPercentage = (id, capitalSpending) =>
    fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateCapitalSpendingPercentage}/${id}`, capitalSpending);

export const updateFundingCost = (id, fundingOption) =>
    fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateFundingCost}/${id}`, fundingOption);
export const updateAnnualFundingOption = (id, annualFunding) =>
    fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateAnnualFundingOption}/${id}`, annualFunding);
export const updateFci = (id, fci) => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateFci}/${id}`, fci);

export const updateFundingEfci = (id, fundingEfci) => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateFundingEfci}/${id}`, fundingEfci);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const getBuildingTypesBasedOnClient = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getBuildingTypesBasedOnClient}/building_types_dropdown`, { params });
export const updateBuildingLock = (id, buildingEfci) =>
    fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateBuildingLock}/${id}/lock`, buildingEfci);

export const getChartsBuilding = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getChart}/${chartParams.projectId}/buildings/${chartParams.buildingId}/charts`, { params });

export const getChartEfciBuilding = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getChart}/${chartParams.projectId}/buildings/${chartParams.buildingId}/simulation`, { params });
export const loadChartDataBuilding = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getChart}/${chartParams.projectId}/buildings/${chartParams.buildingId}/load_data`, { params });
export const saveDataEfciChartBuilding = (chartParams, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.getChart}/${chartParams.projectId}/buildings/${chartParams.buildingId}/save_data`, { params });
export const dashboardBuildingLock = (chartParams, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.getChart}/${chartParams.projectId}/buildings/${chartParams.buildingId}/temp_lock`, params);
export const exportBuildings = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.exportBuildings}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportBuildingsBySite = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.exportBuildings}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportBuildingsUnderSite = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.exportBuildings}/export_xl`, { method: "GET", responseType: "blob", params });
export const getAllBuildingLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getAllBuildingLogs}/${id}/logs`, { params });
};
export const restoreBuildingLog = id => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.restoreBuildingLog}/${id}/restore`);
export const deleteBuildingLog = id => fcaGateWay.delete(`${serviceEndpoints.buildingEndPoints.deleteBuildingLog}/${id}`);
export const getCSPLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.updateCapitalSpendingPercentage}/${id}/logs`, { method: "GET", params });
export const restoreCSPLog = id => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateCapitalSpendingPercentage}/${id}/restore`);
export const getFundingCostLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.updateFundingCost}/${id}/logs`, { method: "GET", params });
export const restoreFundingCost = id => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateFundingCost}/${id}/restore`);
export const getFundingEfciLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.updateFundingEfci}/${id}/logs`, { method: "GET", params });
export const restoreFundingEfciLog = id => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateFundingEfci}/${id}/restore`);
export const getTotalFundingCostLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.updateFundingCost}/${id}/logs`, { method: "GET", params });
export const restoreTotalFundingCost = id => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateFundingCost}/${id}/restore`);
export const getAnnualFundingOptionLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.updateAnnualFundingOption}/${id}/logs`, { method: "GET", params });
export const restoreAnnualFundingCost = id => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateAnnualFundingOption}/${id}/restore`);
export const getAnnualEFCILog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.updateFci}/${id}/logs`, { method: "GET", params });
export const restoreAnnualEFCILog = id => fcaGateWay.patch(`${serviceEndpoints.buildingEndPoints.updateFci}/${id}/restore`);

export const getChartExportBuilding = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${chartParams.projectId}/buildings/${chartParams.buildingId}/export_chart`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllClientUsers = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getAllClientUsers}/client_users_dropdown`, { params });
export const getAllConsultanciesDropdown = () =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getAllConsultanciesDropdown}/consultancies_dropdown`);
