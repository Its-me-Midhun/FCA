import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getChartData = params => {
    return fcaGateWay.get(serviceEndpoints.assetManagementEndpoints.getChart, { params });
};
export const getSfciChart = params => fcaGateWay.get(serviceEndpoints.assetManagementEndpoints.getSfciChart, { params });
export const getFilterLists = (key, params) => fcaGateWay.get(`${serviceEndpoints.assetManagementEndpoints.masterFilters[key]}`, { params });
export const exportDataTableToWord = params =>
    fcaReportGateway.post(`${serviceEndpoints.assetManagementEndpoints.exportDataTableToWord}`, params, { method: "POST", responseType: "blob" });
export const exportDataTableToExcel = params =>
    fcaReportGateway.post(`${serviceEndpoints.assetManagementEndpoints.exportDataTableToExcel}`, params, { method: "POST", responseType: "blob" });
