import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getUsers = params => fcaGateWay.get(serviceEndpoints.usersEndPoints.getAllUsers, { params });
export const addUser = params => fcaGateWay.post(serviceEndpoints.usersEndPoints.addUser, params);
export const updateUser = (params, id) => fcaGateWay.patch(`${serviceEndpoints.usersEndPoints.updateUser}/${id}`, params);
export const deleteUser = id => fcaGateWay.delete(`${serviceEndpoints.usersEndPoints.deleteUser}/${id}`);
export const getUserById = id => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getUserById}/${id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const getAllUserLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getAllUserLogs}/${id}/logs`, { params });
};
export const restoreUserLog = id => fcaGateWay.patch(`${serviceEndpoints.usersEndPoints.restoreUserLog}/${id}/restore`);
export const deleteUserLog = id => fcaGateWay.delete(`${serviceEndpoints.usersEndPoints.deleteUserLog}/${id}`);
export const exportUser = params =>
    fcaGateWay.get(`${serviceEndpoints.usersEndPoints.exportUser}/export_xl`, { method: "GET", responseType: "blob", params });
export const getAllProjectsDropdown = () => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getAllProjectsDropdown}/projects_dropdown`);
export const getAllBuildingsDropdown = params =>
    fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getAllBuildingsDropdown}/buildings_dropdown`, { params });
export const getAllRolesDropdown = () => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getAllRolesDropdown}/roles_dropdown`);
export const getAllGroupsDropdown = params => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getUserPermissions}/templates_dropdown`, { params });
export const getConsultanciesBasedOnRole = () =>
    fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getConsultanciesBasedOnRole}/consultancies_dropdown`);
export const getClientsBasedOnRole = params => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getClientsBasedOnRole}`, { params });
