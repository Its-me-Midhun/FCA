import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import axios from "axios";

import { REPORT_URL } from "./constants";

const firebaseConfig = {
    apiKey: "AIzaSyAZQSuuPakT6Xe3afozMQR9AKzAHt3p1QA",
    authDomain: "fca-tracker-70cc4.firebaseapp.com",
    projectId: "fca-tracker-70cc4",
    storageBucket: "fca-tracker-70cc4.appspot.com",
    messagingSenderId: "769003049672",
    appId: "1:769003049672:web:43ef5b66cd9a7fa9a98bfd",
    measurementId: "G-2Z0C6H1MZP"
};

const firebaseApp = initializeApp(firebaseConfig);

const messaging = isSupported() ? getMessaging(firebaseApp) : null;
export const getDeviceToken = async () => {
    if (messaging) {
        const currentToken = await getToken(messaging, {
            vapidKey: "BCMkuLC6gN7q46QeTGay4aEuC3tR5fU9oX350UE0_vazp6kj4UysAPWwPDEPJwfLf_aAqFFno2rj_zIjXqwc7x4"
        });
        if (currentToken) {
            return currentToken;
        }
        return null;
    } else {
        console.log("Not supported");
    }
};

export const onMessageListener = () =>
    new Promise(resolve => {
        onMessage(messaging, payload => {
            resolve(payload);
        });
    });

export const sendTokenToServer = async userId => {
    try {
        const currentToken = await getDeviceToken();
        if (!currentToken) return null;
        if (!isTokenSentToServer()) {
            const response = await axios.post(`${REPORT_URL}/fca/recommendation/notification/`, {
                device_id: currentToken,
                user_id: userId
            });
            if (response.status === 201) {
                setTokenSentToServer(true);
            } else {
                setTokenSentToServer(false);
            }
        } else {
            console.log("Token already sent to server , so won't sent it again");
        }
    } catch (error) {
        console.log(error);
    }
};

const isTokenSentToServer = () => {
    return window.localStorage.getItem("sentToServer") === "1";
};

const setTokenSentToServer = sent => {
    window.localStorage.setItem("sentToServer", sent ? "1" : "0");
};

export const unSubscribeDevice = async userId => {
    try {
        const currentToken = await getDeviceToken();
        if (!currentToken) return null;
        const response = await axios.delete(`${REPORT_URL}/fca/recommendation/notification/`, {
            data: {
                device_id: currentToken,
                user_id: userId
            }
        });
        if (response.status === 200) {
            console.log("Unsubscibing topic...");
        } else {
            console.log("error while unsubscibing..");
        }
    } catch (error) {
        console.log(error);
    }
};
