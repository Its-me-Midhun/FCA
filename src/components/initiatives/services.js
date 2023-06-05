import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllInitiatives = params => fcaGateWay.get(serviceEndpoints.initiativeEndPoints.getInitiatives, { params });

export const getListForCommonFilterInitiatives = params =>
    fcaGateWay.get(`${serviceEndpoints.initiativeEndPoints.getInitiatives}/get_list`, {
        params
    });

export const exportInitative = (params) => fcaGateWay.get(`${serviceEndpoints.initiativeEndPoints.getInitiatives}/export_xl`, { method: "GET", responseType: "blob", params });

export const getAllProjectsDropdown = (params) => fcaGateWay.get(`${serviceEndpoints.initiativeEndPoints.getAllProjectDropdown}`, { params });

export const addInitiatives = param => fcaGateWay.post(serviceEndpoints.initiativeEndPoints.getInitiatives, param);

export const updateInitiatives = (param, id) => fcaGateWay.patch(`${serviceEndpoints.initiativeEndPoints.getInitiatives}/${id}`, param);

export const deleteInitiatives = id => fcaGateWay.delete(`${serviceEndpoints.initiativeEndPoints.getInitiatives}/${id}`);

export const getInitiativeById = id => fcaGateWay.get(`${serviceEndpoints.initiativeEndPoints.getInitiatives}/${id}`);

export const getInitiativeLogs = (id, params) => fcaGateWay.get(`${serviceEndpoints.initiativeEndPoints.getInitiatives}/${id}/logs`, { params });
export const restoreInitiativeLog = (id) => fcaGateWay.patch(`${serviceEndpoints.initiativeEndPoints.logDetails}/${id}/restore`);
export const deleteInitiativeLog = id => fcaGateWay.delete(`${serviceEndpoints.initiativeEndPoints.logDetails}/${id}`);


export const assignProject = ( id, params) => fcaGateWay.get(`${serviceEndpoints.initiativeEndPoints.getInitiatives}/${id}/assign`, { params });

export const unAssignProject = (params, id) => fcaGateWay.get(`${serviceEndpoints.initiativeEndPoints.getInitiatives}/${id}/unassign`, { params });
