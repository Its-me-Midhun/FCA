import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllProjects = params => fcaGateWay.get(serviceEndpoints.projectEndPoints.getAllProjects, { params });
export const addProject = params => fcaGateWay.post(serviceEndpoints.projectEndPoints.addProject, params);
export const parseFca = (params, id) => fcaGateWay.post(`${serviceEndpoints.projectEndPoints.parseFca}/${id}/parse_fca`, params);
export const updateProject = (params, id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateProject}/${id}`, params);
export const deleteProject = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteProject}/${id}`);
export const getRegionsBasedOnClient = id => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getRegionsBasedOnClient}/${id}/regions`);
export const getAllConsultancyUsers = params => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllConsultancyUsers}`, { params });
export const getAllClients = params => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllClients}`, { params });
export const getProjectById = id => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getProjectById}/${id}`);
export const getBuildingTypeSettingsData = id =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getBuildingTypeSettingsData}/${id}/building_types`);
export const updateBuildingTypeSettings = (projectId, param) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateBuildingTypeSettings}/${projectId}/building_types`, { building_type: param });
export const uploadImage = (imageData, id) => fcaGateWay.post(`${serviceEndpoints.projectEndPoints.uploadImage}/${id}/upload`, imageData);
export const getAllImages = id => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllImages}/${id}/images`);
export const deleteImages = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteImages}/${id}/remove_image`);
export const getTradeSettingsData = id => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getTradeSettingsData}/${id}/trades`);
export const addTrade = (id, params) => fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addTrade}/${id}/trades`, params);
export const getTradeById = (id, tradeId) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getTradeById}/${id}/trades/${tradeId}`);
export const updateTrade = (id, tradeId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateTrade}/${id}/trades/${tradeId}`, params);
export const deleteTrade = (id, tradeId) => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteTrade}/${id}/trades/${tradeId}`);
export const getCategorySettingsData = id => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getCategorySettingsData}/${id}/categories`);
export const addCategory = (id, params) => fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addCategory}/${id}/categories`, params);
export const getCategoryById = (id, tradeId) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getCategoryById}/${id}/categories/${tradeId}`);
export const updateCategory = (id, tradeId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateCategory}/${id}/categories/${tradeId}`, params);
export const deleteCategory = (id, tradeId) => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteTrade}/${id}/categories/${tradeId}`);
export const getFutureCapitalBySite = (projectId, siteId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getFutureCapitalBySite}/${projectId}/sites/${siteId}/future_capitals`);
export const getDifferedMaintenanceBySite = (projectId, siteId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getDifferedMaintenanceBySite}/${projectId}/sites/${siteId}/differed_maintenances`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const getSystemSettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSystemSettingsData}/${id}/systems`, { params });
export const addSystem = (id, params) => fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addSystem}/${id}/systems`, params);
export const getSystemById = (id, systemId) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSystemById}/${id}/systems/${systemId}`);
export const updateSystem = (id, systemId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateSystem}/${id}/systems/${systemId}`, params);
export const deleteSystem = (id, systemId) => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSystem}/${id}/systems/${systemId}`);
export const getSubsystemSettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSubsystemSettingsData}/${id}/sub_systems`, { params });
export const addSubsystem = (id, params) => fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addSubsystem}/${id}/sub_systems`, params);
export const getSubsystemById = (id, subsystemId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSubsystemById}/${id}/sub_systems/${subsystemId}`);
export const updateSubsystem = (id, subsystemId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateSubsystem}/${id}/sub_systems/${subsystemId}`, params);
export const deleteSubsystem = (id, subsystemId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSubsystem}/${id}/sub_systems/${subsystemId}`);
export const getDepartmentSettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getDepartmentSettingsData}/${id}/departments`, { params });
export const addDepartment = (id, params) => fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addDepartment}/${id}/departments`, params);
export const getDepartmentById = (id, departmentId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getDepartmentById}/${id}/departments/${departmentId}`);
export const updateDepartment = (id, departmentId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateDepartment}/${id}/departments/${departmentId}`, params);
export const deleteDepartment = (id, departmentId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteDepartment}/${id}/departments/${departmentId}`);
export const addLimit = (id, params) => fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addLimit}/${id}/year_limits`, params);
export const getaddLimit = id => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getaddLimit}/${id}/year_limits`);
export const getGeneralById = (id, limitId) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getGeneralById}/${id}/year_limits/${limitId}`);
export const updateGeneral = (id, departmentId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateGeneral}/${id}/year_limits/${departmentId}`, params);
export const deleteGeneral = (id, departmentId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteGeneral}/${id}/year_limits/${departmentId}`);
export const getTradeSettingsDropdown = id => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getTradeSettingsDropdown}/${id}/trades_dropdown`);
export const getSystemSettingsDropdown = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getSystemSettingsDropdown}/${id}/systems_dropdown`, { params });
export const exportProject = params =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/export_xl`, { method: "GET", responseType: "blob", params });
export const getColorCodes = (projectId, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/color_codes`, { method: "GET", params });
export const addColorCode = (projectId, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/color_codes`, params);
export const updateColorCode = (projectId, id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/color_codes/${id}`, params);
export const deleteColorCode = (projectId, id) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/color_codes/${id}`);
export const getColorCodeLogs = (projectId, id, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/color_codes/${id}/logs`, { method: "GET", params });

export const getAllProjectLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjectLogs}/${id}/logs`, { params });
};
export const restoreProjectLog = id => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreProjectLog}/${id}/restore`);
export const deleteProjectLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteProjectLog}/${id}`);
export const getChartByProject = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${chartParams.projectId}/charts`, { params });
export const getProjectImportHistory = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getProjectImportHistory}/${id}/fca_sheets`, { params });
};
export const deleteProjectHistory = (id, projectId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteProjectHistory}/${projectId}/fca_sheets/${id}`);
export const exportImportProject = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportImportProject}/${id}/fca_sheets/export_xl`, { method: "GET", params });
export const getEfciByProject = projectId => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getEfciByProject}/${projectId}/efcis`);

//efci for chart
export const getChartEfciProject = (projectId, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/simulation`, { params });
export const updateCapitalSpendingPlanChartProject = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateCapitalSpendingPlanChart}/${id}`, params);
export const updateFundingOptionChartProject = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}`, params);
export const updateAnnualEfciChartProject = (id, params) => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualEfciChart}/${id}`, params);
export const updateAnnualFundingChartProject = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualFundingChart}/${id}`, { temp_annual_funding: { amount: params.amount } });
export const updateFundingSiteEfciChartProject = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingSiteEfciChart}/${id}`, { temp_fci: { value: params } });
export const saveDataEfciChartProject = projectId => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/save_data`);
export const loadChartDataProject = projectId => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/load_data`);

//chart logs
export const getFundingOptionByChartProjectLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}/logs`, { method: "GET", params });
export const restoreFundingOptionByChartProjectLogs = id =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}/restore`);
export const getFundingSiteEfciByChartProjectLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateFundingSiteEfciChart}/${id}/logs`, { method: "GET", params });
export const restoreFundingEfciByChartProjectLogs = id =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingSiteEfciChart}/${id}/restore`);

export const getTotalFundingByChartProjectLog = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}/logs`, { method: "GET", params });
export const restoreFundingTotalByChartProjectLogs = id =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateFundingOptionChart}/${id}/restore`);
export const getCapitalSpendingPlanByChartProjectLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateCapitalSpendingPlanChart}/${id}/logs`, { method: "GET", params });
export const restoreCapitalSpendingPlanByChartProjectLogs = id =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateCapitalSpendingPlanChart}/${id}/restore`);
export const deleteEFCIByChartProjectLog = id => fcaGateWay.delete(`${serviceEndpoints.siteEndPoints.deleteEfciLog}/${id}`);

export const getAllSiteByChartProjectLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getAllSiteLogs}/${id}/logs`, { params });
};
export const restoreSiteByChartProjectLog = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.restoreSiteLog}/${id}/restore`);
export const deleteSiteByChartProjectLog = id => fcaGateWay.delete(`${serviceEndpoints.siteEndPoints.deleteSiteLog}/${id}`);
{
}
export const getAnnualEfciByChartProjectLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateAnnualEfciChart}/${id}/logs`, { method: "GET", params });
export const getAnnualFundingCalculationByChartProjectLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.siteEndPoints.updateAnnualFundingChart}/${id}/logs`, { method: "GET", params });

export const restoreAnnualByChartEFCIProject = id => fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualEfciChart}/${id}/restore`);
export const restoreAnnualFundingByChartCalculationProject = id =>
    fcaGateWay.patch(`${serviceEndpoints.siteEndPoints.updateAnnualFundingChart}/${id}/restore`);
export const getChartExport = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${chartParams.projectId}/sites/${chartParams.siteId}/export_chart`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getChartExportProject = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${chartParams.projectId}/export_chart`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const updateProjectCspSummaryData = (id, percentage) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateCspSummary}/${id}`, { main_csp: { percentage: percentage } });
export const updateProjectAnnualEfci = (id, value) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateRegionAnnualEfci}/${id}`, { main_annual_fci: { value: value } });
export const updateProjectAnnualFundingOption = (amount, id) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateRegionAnnualFundingOption}/${id}`, { main_annual_funding: { amount: amount } });
export const updateProjectFundingCostEfci = (value, id) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateFCEfci}/${id}`, { main_fci: { value: value } });
export const updateProjectFundingCost = (value, id) =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateEfciData}/${id}`, { main_funding_option: { value: value } });

export const forceUpdateProjectFundingCostEfci = params => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.forceUpdate}`, params);

//efci logs

export const getProjectCspSummaryDataLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.updateCspSummary}/${id}/logs`, { params });
export const getProjectAnnualEfciLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.updateRegionAnnualEfci}/${id}/logs`, { params });
export const getProjectAnnualFundingOptionLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.updateRegionAnnualFundingOption}/${id}/logs`, { params });
export const getProjectFundingCostEfciLogs = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.regionEndPoints.updateFCEfci}/${id}/logs`, { params });
export const getProjectFundingCostLogs = (id, params) => fcaGateWay.get(`${serviceEndpoints.regionEndPoints.updateEfciData}/${id}/logs`, { params });

export const restoreProjectCspSummaryDataLogs = id => fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateCspSummary}/${id}/restore`);
export const restoreProjectAnnualEfciLogs = id => fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateRegionAnnualEfci}/${id}/restore`);
export const restoreProjectAnnualFundingOptionLogs = id =>
    fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateRegionAnnualFundingOption}/${id}/restore`);
export const restoreProjectFundingCostEfciLogs = id => fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateFCEfci}/${id}/restore`);
export const restoreProjectFundingCostLogs = id => fcaGateWay.patch(`${serviceEndpoints.regionEndPoints.updateEfciData}/${id}/restore`);
export const getAllClientUsers = params => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllClientUsers}/client_users_dropdown`, { params });

export const lockProject = (id, params) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${id}/lock`, params);
export const lockProjectSandbox = (id, params) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${id}/temp_lock`, params);
export const getAllConsultanciesDropdown = () =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllConsultanciesDropdown}/consultancies_dropdown`);

export const copyGlobalReportTemplates = body => fcaReportGateway.post(`${serviceEndpoints.projectEndPoints.copyGlobalReportTemplates}`, body);

export const addUserActivityLog = text => fcaGateWay.post(`${serviceEndpoints.logEndPoints.addLog}`, text);

export const getMiscSettings = id => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getMiscSettings}/${id}/miscellaneous`);
export const updateMiscSettings = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getMiscSettings}/${id}/update_miscellaneous`, params);

export const updateDisplayOrder = (entity, projectId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateDisplayOrder}/${projectId}/${entity}/update_display_order`, params);

export const initializeSpecialReport = projectId =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.initializeSpecialReport}/${projectId}/initialize_special_reports`);

//sfcilegends
export const getColorCodeSfci = (projectId, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/sfci_color_codes`, { method: "GET", params });
export const addColorCodeSfci = (projectId, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/sfci_color_codes`, params);
export const updateColorCodeSfci = (projectId, id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/sfci_color_codes/${id}`, params);
export const deleteColorCodeSfci = (projectId, id) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/sfci_color_codes/${id}`);
// export const getColorCodeLogsSfci = (projectId, id, params) =>
//     fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getColorCodes}/${projectId}/color_codes/${id}/logs`, { method: "GET", params });

export const getRecommendationPriorityData = params =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getRecommendationPriorityData}`, { params });
export const updateRecommendationPriority = params => fcaGateWay.post(`${serviceEndpoints.projectEndPoints.updateRecommendationPriority}`, params);
export const getCriticalityData = params =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getCriticalityData}/${params.project_id}/criticalities`);
export const addCriticality = (params, project_id) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addCriticality}/${project_id}/criticalities`, params);
export const updateCriticality = (id, params, project_id) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.updateCriticality}/${project_id}/criticalities/${id}`, params);
export const deleteCriticality = (id, project_id) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteCriticality}/${project_id}/criticalities/${id}`);
export const recalculateCriticality = project_id =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.recalculate}/${project_id}/refresh_calculations`);
