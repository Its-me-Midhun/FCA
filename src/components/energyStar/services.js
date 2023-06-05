import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

// Get

export const getAllMeterReadings = params => fcaGateWay.get(serviceEndpoints.energyStarEndpoints.getReadingDetails, { params });

export const getMeterList = params => fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropdown}`, { params });
export const getMeterClients = () => fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropDowns}/client_dropdown`);
export const getMeterRegion = id => fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropDowns}/${id}/region_dropdown`);
export const getMeterSite = (id, params) => fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropDowns}/${id}/site_dropdown`, { params });

export const getMeterBuilding = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropDowns}/${id}/building_dropdown`, { params });

export const getMeterAccounts = params => fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getAccountDetails}/accounts_dropdown`, { params });

export const addMeterTemplate = payload => fcaGateWay.post(`${serviceEndpoints.energyStarEndpoints?.postReadingDetails}`, payload);

export const getMeterTemplateById = meterTemplate_id =>
    fcaGateWay.get(`${serviceEndpoints.energyStarEndpoints.getReadingDetails}/${meterTemplate_id}`);

export const updateMeterTemplate = (meterTemplate_id, payload) =>
    fcaGateWay.patch(`${serviceEndpoints.energyStarEndpoints.patchReadingDetails}/${meterTemplate_id}`, payload);
export const deleteMeterTemplate = meterTemplate_id =>
    fcaGateWay.delete(`${serviceEndpoints.energyStarEndpoints.deleteReadingDetails}/${meterTemplate_id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getListForCommonFilter}/energy_management/energy_star_ratings/get_list`, {
        params
    });
export const exportNarrativeTemplates = params =>
    fcaGateWay.get(`${serviceEndpoints.energyManagementEndponts.getReadingDetails}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getSiteById = id => fcaGateWay.get(`${serviceEndpoints.siteEndPoints.getSiteById}/${id}`);
export const getBuildingById = id => fcaGateWay.get(`${serviceEndpoints.buildingEndPoints.getBuildingById}/${id}`);
export const getAllNarrativeTemplateLogs = (id, params) => {
    let dynamicUrl = localStorage.getItem("dynamicUrl");
    return fcaGateWay.get(`${serviceEndpoints.energyStarEndpoints.getReadingDetails}/${id}/logs`, { params });
};
export const restoreNarrativeTemplateLog = id => {
    return fcaGateWay.patch(`${serviceEndpoints.narrativeTemplateEndPoints.restoreNarrativeTemplateLog}/${id}/restore`);
};
export const deleteNarrativeTemplateLog = id => {
    return fcaGateWay.delete(`${serviceEndpoints.narrativeTemplateEndPoints.deleteNarrativeTemplateLog}/logs/${id}`);
};
// export const getAssignModalDetails = (id, type) => {
//     return fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getAssignModalDetails}/${id}/${type}`);
// };
// export const assignItems = (id, params, type) => fcaGateWay.post(`${serviceEndpoints.narrativeTemplateEndPoints.assignItems}/${id}/${type}`, params);
