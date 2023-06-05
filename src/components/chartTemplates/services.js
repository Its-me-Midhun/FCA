import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

// export const getListForCommonFilter = (params, id) =>
//     fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/trades/get_list`, {
//         params
//     });
export const getChartTemplates = params => fcaReportGateway.get(`${serviceEndpoints.chartTemplateEndPoints.chartTemplates}`, { params });

export const addChartTemplate = params => fcaReportGateway.post(serviceEndpoints.chartTemplateEndPoints.chartTemplates, params);

export const getChartTemplateById = id => fcaReportGateway.get(`${serviceEndpoints.chartTemplateEndPoints.chartTemplates}${id}`);

export const updateChartTemplate = (params,id) => fcaReportGateway.patch(`${serviceEndpoints.chartTemplateEndPoints.chartTemplates}${id}/`, params);

export const deleteChartTemplate = params => fcaReportGateway.delete(`${serviceEndpoints.chartTemplateEndPoints.chartTemplates}soft_delete/`,{params});

// export const restoreTemplate = id => fcaReportGateway.post(`${serviceEndpoints.reportTemplateEndPoints.template}revoke/${id}/`);

export const exportChartTemplate = params =>
    fcaReportGateway.get(`${serviceEndpoints.chartTemplateEndPoints.exportExcel}`, { responseType: "blob", method: "GET", params });

export const getChartPropertyDropdown = params => fcaReportGateway.get(`${serviceEndpoints.chartTemplateEndPoints.getChartPropertyDropdown}`, { params });

// export const addUserActivityLog = text => fcaGateWay.post(`${serviceEndpoints.logEndPoints.addLog}`, text);
export const updateTemplateStatus = (params) => fcaReportGateway.post(`${serviceEndpoints.chartTemplateEndPoints.chartTemplates}set_status/`, params);
export const updateTemplateSmartChartStatus = (params) => fcaReportGateway.post(`${serviceEndpoints.chartTemplateEndPoints.chartTemplates}set-sm-status/`, params);
