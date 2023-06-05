import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getListForCommonFilter = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getListForCommonFilter}/${id}/departments/get_list`, {
        params
    });
export const getDepartmentSettingsData = (params, id) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getDepartmentSettingsData}/${id}/departments`, { params });
export const addDepartment = (id, params) =>
    fcaGateWay.post(`${serviceEndpoints.projectEndPoints.addDepartment}/${id}/departments`, params);
export const getDepartmentById = (id, departmentId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getDepartmentById}/${id}/departments/${departmentId}`);
export const updateDepartment = (id, departmentId, params) =>
    fcaGateWay.patch(
        `${serviceEndpoints.projectEndPoints.updateDepartment}/${id}/departments/${departmentId}`,
        params
    );
export const deleteDepartment = (id, departmentId) =>
    fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteDepartment}/${id}/departments/${departmentId}`);
export const exportDepartmentSettings = (projectId, params) => fcaGateWay.get(`${serviceEndpoints.projectEndPoints.exportProject}/${projectId}/departments/export_xl`, { method: "GET",responseType:"blob", params });
export const getAllDepartmentLogs = (id,params,projectId) => {
    return fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllDepartmentLogs}/${projectId}/departments/${id}/logs`,{params});
};
export const restoreSettingsLog = (id) => fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.restoreSettingsLog}/${id}/restore`);
export const deleteSettingsLog = id => fcaGateWay.delete(`${serviceEndpoints.projectEndPoints.deleteSettingsLog}/${id}`);
