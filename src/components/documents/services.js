import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllReports = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.reportEndPoints.getAllReports}`, {
        params
    });
export const addDocument = params => fcaGateWay.post(`${serviceEndpoints.reportEndPoints.getAllReports}`, params);
export const getDocumentById = id => fcaGateWay.get(`${serviceEndpoints.reportEndPoints.getAllReports}/${id}`);
export const updateDocument = (id, params) => fcaGateWay.patch(`${serviceEndpoints.reportEndPoints.getAllReports}/${id}`, params);
export const deleteDocument = id => fcaGateWay.delete(`${serviceEndpoints.reportEndPoints.getAllReports}/${id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.reportEndPoints.getAllReports}/get_list`, {
        params
    });
export const exportDocuments = params =>
    fcaGateWay.get(`${serviceEndpoints.reportEndPoints.getAllReports}/export_xl`, { method: "GET", responseType: "blob", params });
export const getAllDocumentLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.reportEndPoints.getAllReports}/${id}/logs`, { params });
};
export const restoreDocumentLog = id => fcaGateWay.patch(`${serviceEndpoints.reportEndPoints.restoreDocumentLog}/${id}/restore`);
export const deleteDocumentLog = id => fcaGateWay.delete(`${serviceEndpoints.reportEndPoints.deleteDocumentLog}/${id}`);

export const getInitiativeDropdown = params => fcaGateWay.get(`${serviceEndpoints.reportEndPoints.getInitiativeDropdown}`, { params });

export const getRecommendationDropdown = params => fcaGateWay.get(`${serviceEndpoints.reportEndPoints.getRecommendationDropdown}`, { params });

export const getAllRegionDropdownDocument = params => fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getRegionsBasedOnClient}`, { params });

export const getAllDocuments = params => fcaGateWay.get(`${serviceEndpoints.reportEndPoints.getDocumentTypeBased}`, { params });

export const getSitesByRegionInDocuments = id =>
    fcaGateWay.get(`${serviceEndpoints.reportEndPoints.getSitesByRegionInDocuments}/${id}/site_dropdown`);

export const getMasterFilterLists = (key, params) => fcaGateWay.get(`${serviceEndpoints.reportEndPoints.filterLists[key]}`, { params });
