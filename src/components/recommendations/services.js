import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllRecommendations = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllRecommendationsById}/${id}/recommendations`, { params });
export const getAllRecommendationsRegion = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllRecommendationsByIdRegion}`, { params });
export const addRecommendation = params => fcaGateWay.post(serviceEndpoints.recommendationEndPoints.addRecommendation, params);
export const updateRecommendation = (params, id) =>
    fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.updateRecommendation}/${id}`, params);
export const deleteRecommendation = (id, param = false) =>
    param
        ? fcaGateWay.delete(`${serviceEndpoints.recommendationEndPoints.deleteRecommendation}/${id}?hard_delete=true`)
        : fcaGateWay.delete(`${serviceEndpoints.recommendationEndPoints.deleteRecommendation}/${id}`);
export const getRegionsBasedOnClient = id => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getRegionsBasedOnClient}/${id}/regions`);
export const getBuildingsBasedOnSite = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getBuildingsBasedOnSite}/${id}/buildings_dropdown`);
export const getFloorBasedOnBuilding = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getFloorBasedOnBuilding}/${id}/floors_dropdown`);
export const getAdditionBasedOnBuilding = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAdditionBasedOnBuilding}/${id}/additions_dropdown`);
export const getAllConsultancyUsers = () => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllConsultancyUsers}`);
export const getAllClients = () => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllClients}`);
export const getRecommendationById = id => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getRecommendationById}/${id}`);
export const uploadImage = (imageData, id) => fcaGateWay.post(`${serviceEndpoints.recommendationEndPoints.uploadImage}/${id}/upload`, imageData);
export const getAllImages = (id, params) => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllImages}/${id}/images`, { params });
export const deleteImages = id => fcaGateWay.delete(`${serviceEndpoints.recommendationEndPoints.deleteImages}/${id}/remove_image`);
export const updateImageComment = imageData =>
    fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.updateImageComment}/${imageData.id}/update_image`, imageData);
export const getSystemBasedOnProject = (id, tradeId) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getSystemBasedOnProject}/${id}/systems_dropdown?trade_id=${tradeId}`);
export const getTradeBasedOnProject = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getSystemBasedOnProject}/${id}/trades_dropdown`);
export const getSubSystemBasedOnProject = (id, systemId) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getSubSystemBasedOnProject}/${id}/sub_systems_dropdown?system_id=${systemId}`);

export const getCategoryBasedOnProject = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getCategoryBasedOnProject}/${id}/categories_dropdown`);

export const getCapitalTypeBasedOnProject = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getCapitalTypeBasedOnProject}/${id}/capital_types_dropdown`);

export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const getCostYearByProject = (projectId, siteId) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getCostYearByProject}/${projectId}/maintenance_year_limit?site_id=${siteId}`);

export const getFundingSourceByProject = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getFundingSourceByProject}/${id}/funding_sources_dropdown`);
// getFundingSourceByProject
export const updateMaintenanceYearCutPaste = params =>
    fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.updateMaintenanceYearCutPaste}/move_year_values`, params);
export const exportRecommendations = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.exportRecommendations}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportRecommendationByRegion = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.exportRecommendations}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportRecommendationBySite = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.exportRecommendations}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportRecommendationByBuilding = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.exportRecommendations}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportAllTrades = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.exportAllTrades}/export_all_trades`, { method: "GET", responseType: "blob", params });

export const recoverRecommendation = id => fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.recoverRecommendation}/${id}/restore`);
export const getConditionBasedOnProject = id =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getSystemBasedOnProject}/${id}/asset_conditions_dropdown`);
export const getAllRecommendationLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllRecommendationLogs}/${id}/logs`, { params });
};
export const restoreRecommendationLog = id => fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.restoreRecommendationLog}/${id}/restore`);
export const deleteRecommendationLog = id => fcaGateWay.delete(`${serviceEndpoints.recommendationEndPoints.deleteRecommendationLog}/${id}`);

export const getReportNoteTemplates = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getReportNoteTemplates}${dynamicUrl}`, { params });
export const addUserActivityLog = text => fcaGateWay.post(`${serviceEndpoints.logEndPoints.addLog}`, text);
export const getInitiativeDropdown = params => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getInitiativeDropdown}`, { params });

export const downloadPdfReport = params => fcaReportGateway.get(`${serviceEndpoints.recommendationEndPoints.downloadPdfReport}`, { params });

export const assignImagesToRecom = (data, id) =>
    fcaGateWay.post(`${serviceEndpoints.recommendationEndPoints.assignImagesToRecom}/${id}/assign_master_images`, data);
export const unAssignImage = params =>
    fcaGateWay.delete(`${serviceEndpoints.recommendationEndPoints.unAssignImage}/${params.id}/remove_from_recommendations`, { params });
//budgetpriority
export const updateBudgetPriority = (params, id) =>
    fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.updateBudgetPriority}/${id}/update_budget_priority`, params);
export const getAllBudgetPriorityRecommendations = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllBudgetPriorityRecommendations}`, { params });

export const exportBudgetPriorityRecommendations = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.exportBudgetPriority}`, { method: "GET", responseType: "blob", params });

export const getListForBudgetPriorityFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getListForBudgetPriorityFilter}`, {
        params
    });
export const getRecommendationTemplates = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getRecommendationTemplates}${dynamicUrl}`, { params });
export const getUserDefaultTrade = id => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getUserDefaultTrade}/${id}/trades/user_trade`);
export const updateMultipleRecommendations = (data, ids) =>
    fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.updateMultipleRecommendations}`, {
        recommendation: { ...data },
        recommendation_ids: ids
    });
export const updateFMP = (params, id) => fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.updateFMP}/${id}/update_fmp`, params);
export const getRecommendationCommonDataByIds = params =>
    fcaGateWay.post(`${serviceEndpoints.recommendationEndPoints.getRecommendationCommonDataByIds}`, params);
export const getAllRecommendationIds = params => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllRecommendationIds}`, { params });
export const getPriorityElementDropDownData = projectId =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getPriorityElementDropDownData}/${projectId}/priority_elements_dropdown`);
// update IR
export const updateIR = (params, id) =>
    fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.updateIR}/${id}/update_infrastructure_request`, params);
export const updateRL = (params, id) => fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.updateIR}/${id}/update_red_line`, params);
//reportpdfexport
export const exportReportPdf = params =>
    fcaReportGateway.post(`${serviceEndpoints.recommendationEndPoints.getPdfforReport}`, params, { method: "POST", responseType: "blob" });

export const exportSelectedRecomWord = params =>
    fcaReportGateway.post(`${serviceEndpoints.recommendationEndPoints.exportSelectedRecomWord}`, params, { method: "POST", responseType: "blob" });

export const exportSelectedRecomPDF = params =>
    fcaReportGateway.post(`${serviceEndpoints.recommendationEndPoints.exportSelectedRecomPDF}`, params, { method: "POST", responseType: "blob" });
export const getCriticalityDropDownData = projectId =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getCriticalityDropDownData}/${projectId}/criticalities_dropdown`);
export const exportToWord = params => fcaReportGateway.post(`${serviceEndpoints.recommendationEndPoints.exportToWord}`, params);
export const getCapitalTypeDropDownData = projectId =>
    fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getCapitalTypeDropDownData}/${projectId}/capital_types_dropdown`);
export const getImportViewTableModal = params => fcaReportGateway.get(`${serviceEndpoints.recommendationEndPoints.getImportTableWord}`, { params });
export const updateNoteImportViewTableModal = (params, id) =>
    fcaReportGateway.patch(`${serviceEndpoints.recommendationEndPoints.updateNoteImportTableWord}${id}/`, { export_notes: params });
export const getExportExcelFromExport = params =>
    fcaReportGateway.get(`${serviceEndpoints.recommendationEndPoints.getExportExcelFromExport}`, { responseType: "blob", method: "GET", params });
export const exportToExcelFile = params =>
    fcaReportGateway.post(`${serviceEndpoints.recommendationEndPoints.exportToExcelFile}`, params, { method: "POST", responseType: "blob" });

// for export settings
export const getExportRecom = params => fcaReportGateway.get(`${serviceEndpoints.recommendationEndPoints.getExportColumns}`, { params });
export const getExportPropertyDropdown = params =>
    fcaReportGateway.get(`${serviceEndpoints.recommendationEndPoints.getExportPropertyDropdown}`, { params });
export const postExportRecom = (params, file) =>
    fcaReportGateway.post(`${serviceEndpoints.recommendationEndPoints.postExportColumns}`, params, { method: "POST", responseType: "blob" });
export const lockRecommendation = (id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.recommendationEndPoints.lockRecommendation}/${id}/lock`, params);
