import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllSites = params => fcaGateWay.get(serviceEndpoints.siteEndPoints.getAllSites, { params });
export const addSite = params => fcaGateWay.post(serviceEndpoints.siteEndPoints.addSite, params);
export const updateSite = (params, id) => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateSite}/${id}`, params);
export const deleteSite = id => fcaGateWay.delete(`${serviceEndpoints.siteEndPoints.deleteSite}/${id}`);
export const getRegionsBasedOnClient = params => fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getRegionsBasedOnClient}/`, { params });
export const getAllConsultancyUsers = params => fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getAllConsultancyUsers}`, { params });
export const getAllClients = params => fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getAllClients}`, { params });
export const getSiteById = (id, params) => fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getSiteById}/${id}`, { params });
export const uploadImage = (imageData, id) => fcaGateWay.post(`${serviceEndpoints.siteEndPoints.uploadImage}/${id}/upload`, imageData);
export const getAllImages = (id, params) => fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getAllImages}/${id}/images`, { params });
export const deleteImages = id => fcaGateWay.delete(`${serviceEndpoints.siteEndPoints.deleteImages}/${id}/remove_image`);
export const updateImageComment = imageData =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateImageComment}/${imageData.id}/update_image`, imageData);
export const getChartData = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getChart}/${chartParams.projectId}/sites/${chartParams.siteId}/charts`, { params });
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const getEfciBySite = (siteId, projectId) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getEfci}/${siteId}/efcis?project_id=${projectId.project_id}`);
export const updateCapitalSpendingPlan = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateCapitalSpendingPlan}/${id}`, params);
export const updateFundingOption = (id, params) => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingOption}/${id}`, params);
export const updateAnnualEfci = (id, params) => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualEfci}/${id}`, params);
export const updateAnnualFunding = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualFunding}/${id}`, { site_annual_funding: { amount: params.amount } });
// fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualFunding}/${id}?site_annual_funding: { amount: ${params.amount} } `);

export const updateFundingSiteEfci = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingSiteEfci}/${id}`, { site_fci: { value: params } });
export const resetEfciData = params => fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getChart}/${params.projectId}/sites/${params.siteId}/reset`);

//efci for chart
export const getChartEfci = (siteId, projectId, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getEfci}/${siteId}/simulation?project_id=${projectId.project_id}`, { params });
export const updateCapitalSpendingPlanChart = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateCapitalSpendingPlanChart}/${id}`, params);
export const updateFundingOptionChart = (id, params) => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}`, params);
export const updateAnnualEfciChart = (id, params) => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualEfciChart}/${id}`, params);
export const updateAnnualFundingChart = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualFundingChart}/${id}`, { temp_annual_funding: { amount: params.amount } });
export const updateFundingSiteEfciChart = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingSiteEfciChart}/${id}`, { temp_fci: { value: params } });
export const saveDataEfciChart = (siteId, projectId) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.getChart}/${projectId}/sites/${siteId}/save_to_site`);
export const loadChartData = (siteId, projectId) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getChart}/${projectId}/sites/${siteId}/load_data`);
export const exportSite = params =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.exportSite}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportSiteByRegion = params =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.exportSite}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportSiteUnderRegion = params =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.exportSite}/export_xl`, { method: "GET", responseType: "blob", params });
export const getAllSiteLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getAllSiteLogs}/${id}/logs`, { params });
};
export const restoreSiteLog = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.restoreSiteLog}/${id}/restore`);
export const deleteSiteLog = id => fcaGateWay.delete(`${serviceEndpoints.siteEndPoints.deleteSiteLog}/${id}`);
export const getAnnualEfciLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateAnnualEfci}/${id}/logs`, { method: "GET", params });
export const getAnnualFundingCalculationLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateAnnualFunding}/${id}/logs`, { method: "GET", params });
export const restoreAnnualEFCI = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualEfci}/${id}/restore`);
export const restoreAnnualFundingCalculation = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualFunding}/${id}/restore`);

export const getFundingOptionLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateFundingOption}/${id}/logs`, { method: "GET", params });
export const restoreFundingOptionLogs = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingOption}/${id}/restore`);
export const getFundingSiteEfciLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateFundingSiteEfci}/${id}/logs`, { method: "GET", params });
export const restoreFundingEfciLogs = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingSiteEfci}/${id}/restore`);

export const getTotalFundingLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateFundingOption}/${id}/logs`, { method: "GET", params });
export const restoreFundingTotalLogs = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingOption}/${id}/restore`);
export const getCapitalSpendingPlanLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateCapitalSpendingPlan}/${id}/logs`, { method: "GET", params });
export const restoreCapitalSpendingPlanLogs = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateCapitalSpendingPlan}/${id}/restore`);
export const deleteEFCILog = id => fcaGateWay.delete(`${serviceEndpoints.siteEndPoints.deleteEfciLog}/${id}`);

//chart logs
export const getFundingOptionByChartLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}/logs`, { method: "GET", params });
export const restoreFundingOptionByChartLogs = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}/restore`);
export const getFundingSiteEfciByChartLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateFundingSiteEfciChart}/${id}/logs`, { method: "GET", params });
export const restoreFundingEfciByChartLogs = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingSiteEfciChart}/${id}/restore`);

export const getTotalFundingByChartLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}/logs`, { method: "GET", params });
export const restoreFundingTotalByChartLogs = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}/restore`);
export const getCapitalSpendingPlanByChartLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateCapitalSpendingPlanChart}/${id}/logs`, { method: "GET", params });
export const restoreCapitalSpendingPlanByChartLogs = id =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateCapitalSpendingPlanChart}/${id}/restore`);
export const deleteEFCIByChartLog = id => fcaGateWay.delete(`${serviceEndpoints.siteEndPoints.deleteEfciLog}/${id}`);

export const getAllSiteByChartLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getAllSiteLogs}/${id}/logs`, { params });
};
export const restoreSiteByChartLog = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.restoreSiteLog}/${id}/restore`);
export const deleteSiteByChartLog = id => fcaGateWay.delete(`${serviceEndpoints.siteEndPoints.deleteSiteLog}/${id}`);
{
}
export const getAnnualEfciByChartLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateAnnualEfciChart}/${id}/logs`, { method: "GET", params });
export const getAnnualFundingCalculationByChartLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateAnnualFundingChart}/${id}/logs`, { method: "GET", params });

export const restoreAnnualByChartEFCI = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualEfciChart}/${id}/restore`);
export const restoreAnnualFundingByChartCalculation = id =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualFundingChart}/${id}/restore`);
export const getChartExport = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${chartParams.projectId}/sites/${chartParams.siteId}/export_chart`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getProjectsBasedOnClient = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getProjectsBasedOnClient}/projects_dropdown`, { params });
export const getAllClientUsers = params => fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getAllClientUsers}/client_users_dropdown`, { params });

export const lockSite = (id, siteId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${id}/sites/${siteId}/lock`, params);
export const lockSiteSandbox = (id, siteId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${id}/sites/${siteId}/temp_lock`, params);

export const getAllConsultanciesDropdown = () =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getAllConsultanciesDropdown}/consultancies_dropdown`);
