import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const uploadMultiImage = (data, config) => fcaReportGateway.post(`${serviceEndpoints.imageEndPoints.upload}`, data, config);
export const uploadMultiImageAsset = (data, config) => fcaReportGateway.post(`${serviceEndpoints.imageEndPoints.uploadAssetImage}`, data, config);
export const updateImage = data => fcaGateWay.patch(`${serviceEndpoints.imageEndPoints.update}`, data);
export const checkDuplicateImages = data => fcaReportGateway.post(`${serviceEndpoints.imageEndPoints.checkDuplicate}`, data);
export const checkDuplicateImagesAsset = data => fcaReportGateway.post(`${serviceEndpoints.imageEndPoints.checkDuplicateAsset}`, data);

//Get dropdowns
export const getProjectList = params => fcaGateWay.get(`${serviceEndpoints.imageEndPoints.projectList}`, { params });
export const getBuildingList = params =>
    fcaGateWay.get(`${serviceEndpoints.imageEndPoints.buildingList}`, { params: { project_id: params.project_id } });
export const getTradeList = params =>
    fcaGateWay.get(`${serviceEndpoints.imageEndPoints.tradeList}/${params.project_id}/trades_dropdown`, {
        params: { project_id: params.project_id }
    });
export const getSystemList = params =>
    fcaGateWay.get(`${serviceEndpoints.imageEndPoints.systemList}/${params.project_id}/systems_dropdown`, {
        params: { project_id: params.project_id, trade_id: params.trade_id }
    });
export const getSubsystemList = params =>
    fcaGateWay.get(`${serviceEndpoints.imageEndPoints.subsystemList}/${params.project_id}/sub_systems_dropdown`, { params });

export const getAllImages = params => fcaGateWay.get(`${serviceEndpoints.imageEndPoints.allImages}`, { params });
export const getFilterLists = (key, params) => fcaGateWay.get(`${serviceEndpoints.imageEndPoints.filterLists[key]}`, { params });
export const getAllImagesByRecommendation = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.imageEndPoints.getImagesByRecommendations}/${id}/master_images`, { params });
export const getAllImagesByNarrative = params => fcaGateWay.get(`${serviceEndpoints.imageEndPoints.getImagesByNarrative}`, { params });
export const checkImageMapped = id => fcaGateWay.get(`${serviceEndpoints.imageEndPoints.checkImageMapped}/${id}/mapped_to_recommendation`);
export const deleteImage = params => fcaGateWay.delete(`${serviceEndpoints.imageEndPoints.deleteImage}`, { params });
export const addToFav = params => fcaGateWay.patch(`${serviceEndpoints.imageEndPoints.addToFav}`, params);
export const getUserDefaultTrade = id => fcaGateWay.get(`${serviceEndpoints.imageEndPoints.getUserDefaultTrade}/${id}/trades/user_trade`);
export const getImageLogs = params => fcaReportGateway.get(`${serviceEndpoints.imageEndPoints.imageLogs}`, { params });
export const getSelectedProject = id => fcaGateWay.get(`${serviceEndpoints.imageEndPoints.getSelectedProject}/${id}`);
export const getLabelList = params => fcaGateWay.get(`${serviceEndpoints.imageEndPoints.getAllLabels}`, { params });
//export images
export const exportImages = params => fcaReportGateway.post(`${serviceEndpoints.imageEndPoints.export}`, params, { responseType: "blob" });
export const exportImagesPdf = params => fcaReportGateway.post(`${serviceEndpoints.imageEndPoints.exportPdf}`, params, { responseType: "blob" });
//crop and rotated images
export const rotateImages = params => fcaReportGateway.post(`${serviceEndpoints.imageEndPoints.rotateImages}`, params);
export const saveEditedImage = data => fcaReportGateway.post(`${serviceEndpoints.imageEndPoints.saveEditedImage}`, data);
export const restoreEditedImage = data => fcaReportGateway.post(`${serviceEndpoints.imageEndPoints.restoreEditedImage}`, data);
