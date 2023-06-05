import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllPermissions = params => fcaGateWay.get(serviceEndpoints.usersEndPoints.getUserPermissions, { params });

export const deletePermissions = param => fcaGateWay.delete(`${serviceEndpoints.usersEndPoints.getUserPermissions}/${param}`);

export const getPermissions = param => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.userPermissions}/forms`, param);

export const createPermissions = param => fcaGateWay.post(`${serviceEndpoints.usersEndPoints.userPermissions}`, param);

export const updatePermissions = param => fcaGateWay.patch(`${serviceEndpoints.usersEndPoints.userPermissions}/${param.id}`, param);

export const getAllTemplate = params => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getUserPermissions}/templates`, { params });

export const getDetailsTemplate = param => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.userPermissions}/${param}/template`);

export const getPermissionById = id => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.userPermissions}/${id}`);

export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.usersEndPoints.userPermissions}/get_list`, {
        params
    });

export const getAllConsultancyUser = params =>
    fcaGateWay.get(`${serviceEndpoints.usersEndPoints.userPermissions}/consultancies_dropdown`, { params });

export const exportPermissions = params =>
    fcaGateWay.get(`${serviceEndpoints.usersEndPoints.userPermissions}/export_xl`, { method: "GET", responseType: "blob", params });

export const getTemplateInitialValues = () => fcaGateWay.get(serviceEndpoints.usersEndPoints.getTemplateInitialValues);
export const getUserListForPermissions = params => fcaGateWay.get(serviceEndpoints.usersEndPoints.getUserListForPermissions, { params });
export const getUserPermissionsById = id => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getUserPermissions}/${id}`);
export const addUserPermissions = params => fcaGateWay.post(serviceEndpoints.usersEndPoints.getUserPermissions, params);
export const editUserPermissionsById = (params, id) => fcaGateWay.patch(`${serviceEndpoints.usersEndPoints.getUserPermissions}/${id}`, params);
