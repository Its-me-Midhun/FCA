import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllTemplateData = params => fcaGateWay.get(`${serviceEndpoints.usersEndPoints.getUserPermissions}/templates`, { params });

export const getListForCommonFilterTemplate = params =>
    fcaGateWay.get(`${serviceEndpoints.usersEndPoints.userPermissions}/get_list`, {
        params
    });