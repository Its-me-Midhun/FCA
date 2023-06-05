import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const loginUser = param => fcaGateWay.post(serviceEndpoints.userEndPoints.loginUser, param);
export const logoutUser = param => fcaGateWay.delete(serviceEndpoints.userEndPoints.logoutUser, param);

export const forgotPassword = param => fcaGateWay.post(serviceEndpoints.userEndPoints.forgotPassword, param);
export const resetPassword = param => fcaGateWay.post(serviceEndpoints.userEndPoints.resetPassword, param);

export const validateToken = token => fcaGateWay.get(`${serviceEndpoints.userEndPoints.verifyToken}`, { params: { token } });

export const resetPasswordProfile = (id, param) =>
    fcaGateWay.patch(`${serviceEndpoints.userEndPoints.resetPasswordProfile}/${id}/update_password`, param);
