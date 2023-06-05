import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getSmartChartMasterFilterDropDown = (key, params) =>
    fcaReportGateway.get(`${serviceEndpoints.smartChartEndPoints.masterFilters[key]}`, { params });
export const exportSmartChartData = params => fcaReportGateway.post(`${serviceEndpoints.smartChartEndPoints.exportSmartChartData}`, params);
export const saveSmartChartData = params => fcaReportGateway.post(`${serviceEndpoints.smartChartEndPoints.saveSmartChartData}`, params);
export const getExportedSmartChartList = params =>
    fcaReportGateway.get(`${serviceEndpoints.smartChartEndPoints.getExportedSmartChartList}`, { params });
export const deleteSmartChartReport = id =>
    fcaReportGateway.patch(`${serviceEndpoints.smartChartEndPoints.deleteSmartChartReport}${id}/soft-delete/`);
export const uploadDocsForSmartReport = params => fcaReportGateway.post(`${serviceEndpoints.smartChartEndPoints.uploadDocsForSmartReport}`, params);
export const getUploadedDocList = params => fcaReportGateway.get(`${serviceEndpoints.smartChartEndPoints.getUploadedDocList}`, { params });
export const updateSmartReportData = (id, params) =>
    fcaReportGateway.patch(`${serviceEndpoints.smartChartEndPoints.updateSmartReportData}${id}/`, params);
export const getTemplatePropertiesList = params =>
    fcaReportGateway.get(`${serviceEndpoints.smartChartEndPoints.getTemplatePropertiesList}`, { params });
export const getTemplateList = params => fcaReportGateway.get(`${serviceEndpoints.smartChartEndPoints.getTemplateList}`, { params });
export const deleteUserDocs = params => fcaReportGateway.delete(`${serviceEndpoints.smartChartEndPoints.deleteUserDocs}`, { params });
export const getClientDropDownData = params => fcaReportGateway.get(`${serviceEndpoints.smartChartEndPoints.getClientDropDownData}`, { params });
export const updateDocOrder = params => fcaReportGateway.post(`${serviceEndpoints.smartChartEndPoints.updateDocOrder}`, params);
export const updateUserDocData = (id, params) => fcaReportGateway.patch(`${serviceEndpoints.smartChartEndPoints.updateUserDocData}${id}/`, params);
export const updateSmartChartProperty = (id, params) =>
    fcaReportGateway.patch(`${serviceEndpoints.smartChartEndPoints.updateSmartChartProperty}${id}/`, params);
export const getSmartChartPropertyList = params =>
    fcaReportGateway.get(`${serviceEndpoints.smartChartEndPoints.getSmartChartPropertyList}`, { params });
export const getSmartChartPropertyById = id => fcaReportGateway.get(`${serviceEndpoints.smartChartEndPoints.getSmartChartPropertyById}${id}/`);
export const deleteSmartChartReportTemplate = params =>
    fcaReportGateway.post(`${serviceEndpoints.smartChartEndPoints.deleteSmartChartReportTemplate}`, params);
export const assignImagesToSmartCharts = params => fcaReportGateway.post(`${serviceEndpoints.smartChartEndPoints.assignImagesToSmartCharts}`, params);
export const lockSmartChartTemplate = params => fcaReportGateway.post(`${serviceEndpoints.smartChartEndPoints.lockSmartChartTemplate}`, params);
