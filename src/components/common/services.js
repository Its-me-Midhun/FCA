import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getMenuItems = params => fcaGateWay.get(serviceEndpoints.userEndPoints.getMenuItems);

export const getSideMenuItems = (entity, params) => fcaGateWay.get(`${serviceEndpoints.menuEndPoints.getSideMenuItems}/${entity}`, { params });

export const exportChartToWord = params =>
    fcaReportGateway.post(`${serviceEndpoints.commonEndPoints.exportChartsWord}`, params, { method: "POST", responseType: "blob" });
export const exportChartToPdf = params =>
    fcaReportGateway.post(`${serviceEndpoints.commonEndPoints.exportChartsToPdf}`, params, { method: "POST", responseType: "blob" });
export const exportChartToPpt = params =>
    fcaReportGateway.post(`${serviceEndpoints.commonEndPoints.exportChartsPpt}`, params, { method: "POST", responseType: "blob" });
export const getActiveChartProperties = params => fcaReportGateway.get(`${serviceEndpoints.commonEndPoints.getActiveChartProperties}`, { params });

export const getLinkEmail = params => fcaReportGateway.get(`${serviceEndpoints.commonEndPoints.getLinkEmail}`, { params });
export const exportDataTableToWord = params =>
    fcaReportGateway.post(`${serviceEndpoints.commonEndPoints.exportDataTableToWord}`, params, { method: "POST", responseType: "blob" });
export const exportDataTableToExcel = params =>
    fcaReportGateway.post(`${serviceEndpoints.commonEndPoints.exportDataTableToExcel}`, params, { method: "POST", responseType: "blob" });
export const exportEFCIDataTableToExcel = params =>
    fcaReportGateway.post(`${serviceEndpoints.commonEndPoints.exportEFCIDataTableToExcel}`, params, { method: "POST", responseType: "blob" });
export const exportEfciToWord = params =>
    fcaReportGateway.post(`${serviceEndpoints.commonEndPoints.exportEfciDataTableToWord}`, params, { method: "POST", responseType: "blob" });