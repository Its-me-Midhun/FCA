import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getBuildingMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getBuildingMenu}`, {
        params
    });

export const getTradeMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getTradeMenu}`, {
        params
    });

export const getSystemMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getSystemMenu}`, {
        params
    });

export const getSubsystemMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getSubsystemMenu}`, {
        params
    });

export const getBuildingReportPrargraphsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getBuildingReportPrargraphsMenu}`, {
        params
    });

export const getBuildingChildPrargraphsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getBuildingChildPrargraphsMenu}`, {
        params
    });

export const getSiteReportPrargraphsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getSiteReportPrargraphsMenu}`, {
        params
    });

export const getSiteChildPrargraphsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getSiteChildPrargraphsMenu}`, {
        params
    });

export const getRegionReportPrargraphsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getRegionReportPrargraphsMenu}`, {
        params
    });

export const getRegionChildPrargraphsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getRegionChildPrargraphsMenu}`, {
        params
    });

export const getProjectReportPrargraphsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getProjectReportPrargraphsMenu}`, {
        params
    });

export const getProjectChildPrargraphsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getProjectChildPrargraphsMenu}`, {
        params
    });

export const getSiteMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getSiteMenu}`, {
        params
    });

export const getRegionMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getRegionMenu}`, {
        params
    });

export const getProjectMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getProjectMenu}`, {
        params
    });

export const getSiteBuildings = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getSiteBuildings}`, {
        params
    });

export const getProjectsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getProjectsMenu}`, {
        params
    });

export const getRegionsMenu = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getRegionsMenu}`, {
        params
    });

export const getAllImages = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getAllImages}`, {
        params
    });
export const getNarrativeChart = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getNarrativeChart}`, {
        params
    });
export const getChartDetails = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getChartDetails}`, {
        params
    });

export const uploadImage = imageData => fcaGateWay.post(`${serviceEndpoints.fcaReportEndPoints.uploadImage}`, imageData);

export const deleteImage = params =>
    fcaGateWay.delete(`${serviceEndpoints.fcaReportEndPoints.deleteImage}/${params.id}/remove_image`, {
        params: { narratable_type: params.narratable_type }
    });

export const updateImageComment = params =>
    fcaGateWay.put(`${serviceEndpoints.fcaReportEndPoints.updateImageComment}/${params.id}/update_image`, params);

export const addNarrative = params => fcaGateWay.post(`${serviceEndpoints.fcaReportEndPoints.addNarrative}`, params);

export const getNarrative = params => fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getNarrative}`, { params });

export const getNarrativeRecommendationsImage = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getNarrativeRecommendationsImage}`, {
        params
    });

export const getAllRecommendationNotes = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getAllRecommendationNotes}`, {
        params
    });

export const updateRecomImage = params => fcaGateWay.put(`${serviceEndpoints.fcaReportEndPoints.updateNarrativeRecomImage}/${params.id}`, params);

export const getNarrativeRecommendations = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getNarrativeRecommendations}`, {
        params
    });

export const getRecommendationById = id => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllRecommendations}/${id}`);

export const getListForCommonFilterNarrativeRecommendation = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getNarrativeRecommendations}/get_list`, {
        params
    });

export const exportRecommendations = params =>
    fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getNarrativeRecommendations}/export_xl`, { method: "GET", responseType: "blob", params });

export const exportReport = params => fcaReportGateway.post(`${serviceEndpoints.fcaReportEndPoints.exportReport}`, params);

export const uploadInsert = insertData => fcaGateWay.post(`${serviceEndpoints.fcaReportEndPoints.uploadInsert}`, insertData);

export const getInserts = params => fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getInserts}`, { params });

export const updateInsert = (id, insertData) => fcaGateWay.put(`${serviceEndpoints.fcaReportEndPoints.updateInsert}/${id}/update_insert`, insertData);

export const deleteInsert = params =>
    fcaGateWay.delete(`${serviceEndpoints.fcaReportEndPoints.deleteInsert}/${params.id}/remove_insert`, {
        params: { narratable_type: params.narratable_type }
    });

export const markAsCompletePython = params => fcaReportGateway.post(`${serviceEndpoints.fcaReportEndPoints.markAsComplete}/`, params);
export const markAsCompleteRuby = params =>
    fcaGateWay.put(`${serviceEndpoints.fcaReportEndPoints.markAsCompleteRuby}/${params.id}/mark_as_complete`, params);

export const getSelectedRecomImages = (id,params) => fcaGateWay.get(`${serviceEndpoints.recommendationEndPoints.getAllRecommendations}/${id}/images`,{params});

export const deleteNarrative = params =>
    fcaGateWay.delete(`${serviceEndpoints.fcaReportEndPoints.deleteNarrative}/${params.id}`, { params: { narratable_type: params.narratable_type } });

export const getPdfReport = params => fcaReportGateway.get(`${serviceEndpoints.fcaReportEndPoints.getLatestPdfReport}`, { params });

export const getExportHistory = params => fcaReportGateway.get(`${serviceEndpoints.fcaReportEndPoints.getExportHistory}`, { params });

export const getAllLogs = params => fcaGateWay.get(`${serviceEndpoints.fcaReportEndPoints.getAllLogs}/${params.id}/logs`, { params });

export const updateLog = data => fcaGateWay.put(`${serviceEndpoints.fcaReportEndPoints.updateLog}/${data.id}`, data);

export const updateExportHistory = data => fcaReportGateway.post(`${serviceEndpoints.fcaReportEndPoints.updateExportHistory}`, data);

export const getNarrativeTemplates = (params, dynamicUrl) =>
    fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getNarrativeTemplates}${dynamicUrl}`, { params });

export const autoPopulateTableTemplates = params => fcaGateWay.post(`${serviceEndpoints.fcaReportEndPoints.autoPopulateTableTemplates}`, params);

export const addUserActivityLog = text => fcaGateWay.post(`${serviceEndpoints.logEndPoints.addLog}`, text);

export const assignImagesFromMaster = data => fcaGateWay.post(`${serviceEndpoints.fcaReportEndPoints.assignImagesFromMaster}`, data);
