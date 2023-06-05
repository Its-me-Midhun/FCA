import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllLogs = params => fcaGateWay.get(serviceEndpoints.logEndPoints.getAllLogs, { params });
export const addLog = params => fcaGateWay.post(serviceEndpoints.logEndPoints.addLog, params);
export const updateLog = (params, id) => fcaGateWay.patch(`${serviceEndpoints.logEndPoints.updateLog}/${id}`, params);
export const deleteLog = id => fcaGateWay.delete(`${serviceEndpoints.logEndPoints.deleteLog}/${id}`);
export const getAllConsultancyUsers = params => fcaGateWay.get(`${serviceEndpoints.logEndPoints.getAllConsultancyUsers}`, { params });
export const getAllClients = params => fcaGateWay.get(`${serviceEndpoints.logEndPoints.getAllClients}`, { params });
export const getLogById = id => fcaGateWay.get(`${serviceEndpoints.logEndPoints.getLogById}/${id}`);
export const uploadImage = (imageData, id) => fcaGateWay.post(`${serviceEndpoints.logEndPoints.uploadImage}/${id}/upload`, imageData);
export const getAllImages = id => fcaGateWay.get(`${serviceEndpoints.logEndPoints.getAllImages}/${id}/images`);
export const deleteImages = id => fcaGateWay.delete(`${serviceEndpoints.logEndPoints.deleteImages}/${id}/remove_image`);
export const updateImageComment = imageData =>
    fcaGateWay.patch(
        `${serviceEndpoints.logEndPoints.updateImageComment}/${imageData.id}/update_image`,
        imageData
        // imageData.default ? { default: imageData.default } : { description: imageData.description }
    );
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.logEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const exportLog = params =>
    fcaGateWay.get(`${serviceEndpoints.logEndPoints.exportLog}/export_xl`, { method: "GET", responseType: "blob", params });
export const exportLogByProject = (projectId, params) =>
    fcaGateWay.get(`${serviceEndpoints.logEndPoints.exportLog}/export_xl`, { method: "GET", responseType: "blob", params });
// export const getAllLogs = (id, params) => {
//     return fcaGateWay.get(`${serviceEndpoints.logEndPoints.getAllLogs}/${id}/logs`, { params });
// };
export const restoreLogLog = id => fcaGateWay.patch(`${serviceEndpoints.logEndPoints.restoreLogLog}/${id}/restore`);
export const deleteLogLog = id => fcaGateWay.delete(`${serviceEndpoints.logEndPoints.deleteLogLog}/${id}`);
export const getChartsByLog = (chartParams, params) =>
    fcaGateWay.get(`${serviceEndpoints.logEndPoints.getAllLogs}/${chartParams.logId}/charts`, { params });
export const getProjectsBasedOnClient = params =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getProjectsBasedOnClient}/projects_dropdown`, { params });
export const getEfciByLog = (projectId, logId) => fcaGateWay.get(`${serviceEndpoints.logEndPoints.getEfciByLog}/${projectId}/logs/${logId}/efcis`);

//efci for chart
export const getChartEfciLog = (logId, projectId, params) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/logs/${logId}/simulation`, { params });

export const saveDataEfciLogChart = (logId, projectId) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/logs/${logId}/save_to_site`);
export const loadChartDataLog = (logId, projectId) =>
    fcaGateWay.get(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/logs/${logId}/load_data`);
export const updateLogFundingCost = (value, id) =>
    fcaGateWay.patch(`${serviceEndpoints.logEndPoints.updateEfciData}/${id}`, { main_funding_option: { value: value } });
export const updateLogFundingCostEfci = (value, id) =>
    fcaGateWay.patch(`${serviceEndpoints.logEndPoints.updateFCEfci}/${id}`, { main_fci: { value: value } });
export const updateLogAnnualFundingOption = (amount, id) =>
    fcaGateWay.patch(`${serviceEndpoints.logEndPoints.updateLogAnnualFundingOption}/${id}`, { main_annual_funding: { amount: amount } });
export const updateLogAnnualEfci = (id, value) =>
    fcaGateWay.patch(`${serviceEndpoints.logEndPoints.updateLogAnnualEfci}/${id}`, { main_annual_fci: { value: value } });
export const updateCspSummary = (id, percentage) =>
    fcaGateWay.patch(`${serviceEndpoints.logEndPoints.updateCspSummary}/${id}`, { main_csp: { percentage: percentage } });
export const getCspLogById = id => fcaGateWay.get(`${serviceEndpoints.logEndPoints.updateCspSummary}/${id}/logs`);

export const saveDataEfciChartLog = (logId, projectId) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${projectId}/logs/${logId}/save_data`);
export const getAllClientUsers = params => fcaGateWay.get(`${serviceEndpoints.logEndPoints.getAllClientUsers}/client_users_dropdown`, { params });

export const lockLog = (id, logId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${id}/logs/${logId}/lock`, params);
export const lockLogSandbox = (id, logId, params) =>
    fcaGateWay.patch(`${serviceEndpoints.projectEndPoints.getAllProjects}/${id}/logs/${logId}/temp_lock`, params);
export const getAllConsultanciesDropdown = () =>
    fcaGateWay.get(`${serviceEndpoints.logEndPoints.getAllConsultanciesDropdown}/consultancies_dropdown`);
