import { fcaGateWay,fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getNotifications = params =>
    fcaReportGateway.get(serviceEndpoints.notificationEndPoints.getNotifications, { params });
export const getUnreadNotifications = params =>
    fcaReportGateway.get(serviceEndpoints.notificationEndPoints.getUnreadNotifications, { params });
    export const updateNotifications = params =>
    fcaReportGateway.post(serviceEndpoints.notificationEndPoints.updateNotifications,  params );
export const exportNotification = params =>
    fcaReportGateway.get(`${serviceEndpoints.notificationEndPoints.exportExcel}`, { responseType: "blob", method: "GET", params });

export const parseFca = (params, id) =>
    fcaGateWay.post(`${serviceEndpoints.buildingTypeEndPoints.parseFca}/${id}/parse_fca`, params);
export const updateClient = (params, id) =>
    fcaGateWay.patch(`${serviceEndpoints.clientEndPoints.updateClient}/${id}`, params);
export const deleteClient = id =>
    fcaGateWay.delete(`${serviceEndpoints.clientEndPoints.deleteClient}/${id}`);
export const getClientById = id =>
    fcaGateWay.get(`${serviceEndpoints.clientEndPoints.getClientById}/${id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.clientEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const getAllClientLogs = (id,params) => {
        return fcaGateWay.get(`${serviceEndpoints.clientEndPoints.getAllClientLogs}/${id}/logs`,{params});
    };
export const restoreClientLog = (id) => fcaGateWay.patch(`${serviceEndpoints.clientEndPoints.restoreClientLog}/${id}/restore`);
export const deleteClientLog = id => fcaGateWay.delete(`${serviceEndpoints.clientEndPoints.deleteClientLog}/${id}`);
export const getLandingPageData = params => fcaGateWay.get(serviceEndpoints.landingPageEndPoints.getLandingPageData, {params});
export const addLandingPageData = params => fcaGateWay.post(serviceEndpoints.landingPageEndPoints.getLandingPageData, params);
export const updateLandingPageData = params => fcaGateWay.patch(serviceEndpoints.landingPageEndPoints.getLandingPageData, params);
export const copyGlobalChartTemplates = params => fcaReportGateway.post(`${serviceEndpoints.clientEndPoints.copyGlobalChartTemplates}`, params);

