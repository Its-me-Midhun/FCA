import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/trades/get_list`, {
        params
    });
export const getTemplates = params => fcaReportGateway.get(`${serviceEndpoints.reportTemplateEndPoints.template}`, { params });

export const addTemplate = params => fcaReportGateway.post(serviceEndpoints.reportTemplateEndPoints.template, params);

export const getTemplateById = id => fcaReportGateway.get(`${serviceEndpoints.reportTemplateEndPoints.template}${id}`);

export const updateTemplate = params => fcaReportGateway.patch(`${serviceEndpoints.reportTemplateEndPoints.template}${params.id}/`, params);

export const deleteTemplate = id => fcaReportGateway.post(`${serviceEndpoints.reportTemplateEndPoints.template}delete/${id}/`);

export const restoreTemplate = id => fcaReportGateway.post(`${serviceEndpoints.reportTemplateEndPoints.template}revoke/${id}/`);

export const exportReportTemplate = params =>
    fcaReportGateway.get(`${serviceEndpoints.reportTemplateEndPoints.exportExcel}`, { responseType: "blob", method: "GET", params });

// export const getAllTradeLogs = (id, params, projectId) => {
//     return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllTradeLogs}/${projectId}/trades/${id}/logs`, { params });
// };
// export const restoreSettingsLog = id => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);

// export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);

export const getPropertyDropdown = params => fcaGateWay.get(`${serviceEndpoints.reportPropertiesEndPoints.reportPropertyDropdown}`, { params });

export const addUserActivityLog = text => fcaGateWay.post(`${serviceEndpoints.logEndPoints.addLog}`, text);
