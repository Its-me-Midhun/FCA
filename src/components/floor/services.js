import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getFloorsBasedOnBuilding = (building_id, params) =>
    fcaGateWay.get(`${serviceEndpoints.floorEndPoints.getFloorsBasedOnBuilding}/${building_id}/floors`, { params });
export const addFloor = (building_id, params) =>
    fcaGateWay.post(`${serviceEndpoints.floorEndPoints.addFloor}/${building_id}/floors`, params);
export const getFloorById = (building_id, floor_id) =>
    fcaGateWay.get(`${serviceEndpoints.floorEndPoints.getFloorById}/${building_id}/floors/${floor_id}`);
export const updateFloor = (building_id, floor_id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.floorEndPoints.updateFloor}/${building_id}/floors/${floor_id}`, params);
export const deleteFloor = (building_id, floor_id) =>
    fcaGateWay.delete(`${serviceEndpoints.floorEndPoints.deleteFloor}/${building_id}/floors/${floor_id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.floorEndPoints.getListForCommonFilter}/get_list`, {
        params
    });
export const exportFloorsByBuilding = (buildingId) => fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.exportBuildings}/${buildingId}/floors/export_xl`, { method: "GET", responseType: "blob" });
export const getAllFloorLogs = (id, params) => {
    return fcaGateWay.get(`${serviceEndpoints.floorEndPoints.getAllFloorLogs}/${id}/logs`, { params });
};
export const restoreFloorLog = (id) => fcaGateWay.patch(`${serviceEndpoints.floorEndPoints.restoreFloorLog}/${id}/restore`);
export const deleteFloorLog = id => fcaGateWay.delete(`${serviceEndpoints.floorEndPoints.deleteFloorLog}/${id}`);
export const getAllClientUsers = (params) => fcaGateWay.get(`${serviceEndpoints.floorEndPoints.getAllClientUsers}/client_users_dropdown`, { params });

export const getAllConsultancyUsers = (params) => fcaGateWay.get(`${serviceEndpoints.floorEndPoints.getAllConsultancyUsers}`, { params });

export const getAllConsultanciesDropdown = () => fcaGateWay.get(`${serviceEndpoints.floorEndPoints.getAllConsultanciesDropdown}/consultancies_dropdown`);

export const getAllClientss = (params) => fcaGateWay.get(`${serviceEndpoints.floorEndPoints.getAllClients}`, { params });
// export const getAllBuildingss = params =>
//     fcaGateWay.get(serviceEndpoints.floorEndPoints.getAllBuildings, { params });
export const getAllBuildingsDropdown = (params) => fcaGateWay.get(`${serviceEndpoints.floorEndPoints.getAllBuildingsDropdown}/buildings_dropdown`, { params });