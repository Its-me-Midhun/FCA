/* eslint-disable no-unused-vars */
import axios from "axios";
import { API_ROUTE, ORIGIN_URL, REPORT_URL } from "../config/constants";
import {unSubscribeDevice} from "../config/firebase"

export const fcaGateWay = axios.create({
    baseURL: API_ROUTE,
    timeout: 300000,
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": ORIGIN_URL
        // "Accept-Encoding": "gzip"
    }
});

fcaGateWay.interceptors.response.use(
    res => {
        return res;
    },
    function (res) {
        if (res.response && res.response.status === 401) {
            //unsubscribing fcm
            let userId = localStorage.getItem("userId");
            unSubscribeDevice(userId);
            localStorage.clear();
            window.location.href = "/";
        }
        return res;
    }
);

fcaGateWay.interceptors.request.use(function (config) {
    const token = localStorage.getItem("fca-token");
    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": ORIGIN_URL
    };
    return config;
});

export const restCountriesGateWay = axios.create({
    baseURL: "https://restcountries.eu",
    timeout: 20000
});

export const fcaReportGateway = axios.create({
    baseURL: REPORT_URL,
    // timeout: 300000,
    headers: {
        // "Content-Type": "application/json",
        // "accept": "application/json",
        // "Access-Control-Allow-Origin": ORIGIN_URL,
        // "Accept-Encoding": "gzip"
    }
});
