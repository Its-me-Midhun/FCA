import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAdditionsBasedOnBuilding = (building_id, params) =>
    fcaGateWay.get(`${serviceEndpoints.additionEndPoints.getAdditionsBasedOnBuilding}/${building_id}/additions`, { params });
export const addAddition = (building_id, params) => fcaGateWay.post(`${serviceEndpoints.additionEndPoints.addAddition}/${building_id}/additions`, params);
export const getAdditionById = (building_id, floor_id) =>
    fcaGateWay.get(`${serviceEndpoints.additionEndPoints.getAdditionById}/${building_id}/additions/${floor_id}`);
export const updateAddition = (building_id, floor_id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.additionEndPoints.updateAddition}/${building_id}/additions/${floor_id}`, params);
export const deleteAddition = (building_id, floor_id) =>
    fcaGateWay.delete(`${serviceEndpoints.additionEndPoints.deleteAddition}/${building_id}/additions/${floor_id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.additionEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const exportAdditionsByBuilding = buildingId =>
    fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.exportBuildings}/${buildingId}/additions/export_xl`, { method: "GET", responseType: "blob" });
export const getAllAdditionLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.additionEndPoints.getAllAdditionLogs}/${id}/logs`, { params });
};
export const restoreAdditionLog = id => fcaGateWay.patch(`${serviceEndpoints.additionEndPoints.restoreAdditionLog}/${id}/restore`);
export const deleteAdditionLog = id => fcaGateWay.delete(`${serviceEndpoints.additionEndPoints.deleteAdditionLog}/${id}`);
export const getAllClientUsers = params => fcaGateWay.get(`${serviceEndpoints.additionEndPoints.getAllClientUsers}/client_users_dropdown`, { params });

export const getAllConsultancyUsers = params => fcaGateWay.get(`${serviceEndpoints.additionEndPoints.getAllConsultancyUsers}`, { params });

export const getAllConsultanciesDropdown = () =>
    fcaGateWay.get(`${serviceEndpoints.additionEndPoints.getAllConsultanciesDropdown}/consultancies_dropdown`);

export const getAllClientss = params => fcaGateWay.get(`${serviceEndpoints.additionEndPoints.getAllClients}`, { params });
// export const getAllBuildingss = params =>
//     fcaGateWay.get(serviceEndpoints.additionEndPoints.getAllBuildings, { params });
export const getAllBuildingsDropdown = params =>
    fcaGateWay.get(`${serviceEndpoints.additionEndPoints.getAllBuildingsDropdown}/buildings_dropdown`, { params });
