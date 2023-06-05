import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getDashboard = params => fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getDashboard, { params });

export const getChartsDashboard = params => fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getChartsDashboard, { params });
export const getChartsDashboardPython = params => fcaReportGateway.post(serviceEndpoints.dashboardEndPoints.getChartsDashboardPython, params);

export const getFciChart = params => fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getFciChart, { params });

export const getMap = params => fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getMap, { params });

export const getHorizontalChart = params => fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getHorizontalChart, { params });

export const getMasterFilter = (params, key) => fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getMasterFilter[key], { params });

export const getAllLegents = params => fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getAllLegents, { params });

export const getFcaChartExcelExport = params =>
    fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getFcaChartExcelExport, { method: "GET", responseType: "blob", params });

export const getFciChartExcelExport = params =>
    fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getFciChartExcelExport, { method: "GET", responseType: "blob", params });

export const getHorizontalChartExport = params =>
    fcaGateWay.get(serviceEndpoints.dashboardEndPoints.getHorizontalChartExport, { method: "GET", responseType: "blob", params });

export const getLandingPageData = params => fcaGateWay.get(serviceEndpoints.dashboardEndPoints.landingPageData, { params });

export const getLandingPageReports = params =>
    fcaGateWay.get(`${serviceEndpoints.dashboardEndPoints.landingPageData}/capital_planning_report`, { params });

export const getWidgetData = params => fcaGateWay.get(serviceEndpoints.dashboardEndPoints.widgetData, { params });
