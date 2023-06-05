import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getHelperData = params => fcaGateWay.get(`${serviceEndpoints.helperEndPoints.getHelperData}`, { params });
export const uploadHelperDocToAWS = params => fcaGateWay.post(`${serviceEndpoints.helperEndPoints.uploadHelperDocToAWS}`, params);
export const updateHelper = params => fcaGateWay.post(`${serviceEndpoints.helperEndPoints.updateHelper}`, params);
