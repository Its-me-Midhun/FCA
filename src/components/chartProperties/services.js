import { fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaReportGateway.get(`${serviceEndpoints.chartPropertiesEntPoints.chartProperty}/${id}/get_list`, {
        params
    });

export const getProperties = params => fcaReportGateway.get(`${serviceEndpoints.chartPropertiesEntPoints.getProperties}`, { params });

export const addProperty = params => fcaReportGateway.post(`${serviceEndpoints.chartPropertiesEntPoints.addProperty}`, params);
export const getPropertyById = params => fcaReportGateway.get(`${serviceEndpoints.chartPropertiesEntPoints.getPropertyById}/`,{params});

export const updateProperty = (id, params) => fcaReportGateway.patch(`${serviceEndpoints.chartPropertiesEntPoints.updateProperty}`, params);

export const deleteProperty = params =>
    params.hard_delete
        ? fcaReportGateway.delete(`${serviceEndpoints.chartPropertiesEntPoints.deleteProperty}/delete_properties/`,{params})
        : fcaReportGateway.delete(`${serviceEndpoints.chartPropertiesEntPoints.deleteProperty}/softdel_properties/`,{params});

export const restoreProperty = id => fcaReportGateway.patch(`${serviceEndpoints.chartPropertiesEntPoints.chartProperty}/${id}/restore`);

export const checkPropertyMapped = params => fcaReportGateway.get(`${serviceEndpoints.chartPropertiesEntPoints.checkPropertyMapped}`,{params});

export const exportChartProperty = params =>
    fcaReportGateway.get(`${serviceEndpoints.chartPropertiesEntPoints.exportExcel}`, { responseType: "blob", method: "GET", params });

export const getAllPropertyLogs = (id, params) => {
    return fcaReportGateway.get(`${serviceEndpoints.chartPropertiesEntPoints.chartProperty}/${id}/logs`, { params });
};

export const restorePropertyLog = id => fcaReportGateway.patch(`${serviceEndpoints.chartPropertiesEntPoints.logs}/${id}/restore`);

export const deletePropertyLog = id => fcaReportGateway.delete(`${serviceEndpoints.chartPropertiesEntPoints.logs}/${id}`);

export const getDropdownList = level => fcaReportGateway.get(`${serviceEndpoints.chartPropertiesEntPoints.dropdown[level]}`);

export const updateRecommendationSortProperty = (id, params) => fcaReportGateway.patch(`${serviceEndpoints.chartPropertiesEntPoints.updateRecommendationSortProperty}`, params);
