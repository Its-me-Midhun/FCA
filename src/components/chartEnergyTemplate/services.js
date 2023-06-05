import { fcaGateWay, fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

// Dash
export const getDashboard = params => {
    return fcaGateWay.get(serviceEndpoints.energyChartEndpoints.getDashboard, { params });
};

// Client
export const getClientsId = id => fcaGateWay.get(`${serviceEndpoints.energyChartEndpoints.getClients}/${id}`);
// Building
export const getBuildingById = id => fcaGateWay.get(`${serviceEndpoints.energyChartEndpoints.getBuildingById}/${id}`);
// Region
export const getRegionById = id => fcaGateWay.get(`${serviceEndpoints.energyChartEndpoints.getRegionById}/${id}`);
// Site
export const getSiteById = id => fcaGateWay.get(`${serviceEndpoints.energyChartEndpoints.getSiteById}/${id}`);

// Region Filter

export const getRegionFilter = params => fcaGateWay.get(serviceEndpoints.energyChartEndpoints.getRegionFilter, { params });

// Site Filter
export const getSiteFilter = params => fcaGateWay.get(serviceEndpoints.energyChartEndpoints.getSiteFilter, { params });

// Building
export const getBuildingTypeFilter = params => fcaGateWay.get(serviceEndpoints.energyChartEndpoints.getBuildingTypeFilter, { params });

export const getBuildingFilter = params => fcaGateWay.get(serviceEndpoints.energyChartEndpoints.getBuildingFilter, { params });

// Year Filter
export const getYearFilter = params => fcaGateWay.get(serviceEndpoints.energyChartEndpoints.getYearFilter, { params });

export const exportDataTableToWord = params =>
    fcaReportGateway.post(`${serviceEndpoints.energyChartEndpoints.exportDataTableToWord}`, params, { method: "POST", responseType: "blob" });
export const exportDataTableToExcel = params =>
    fcaReportGateway.post(`${serviceEndpoints.energyChartEndpoints.exportDataTableToExcel}`, params, { method: "POST", responseType: "blob" });