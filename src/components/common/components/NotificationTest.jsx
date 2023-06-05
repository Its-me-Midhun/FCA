import React from "react";
import axios from "axios";

import { REPORT_URL } from "../../../config/constants";
import { getDeviceToken } from "../../../config/firebase";

export default function NotificationTest() {
    const onNotificationTest = async () => {
        const currentToken = await getDeviceToken();
        const response = await axios.post(`${REPORT_URL}/fca/recommendation/notification_view/notification_test/`, {
            device_id: currentToken
        });
    };

    return (
        <div style={{ textAlign: "center", paddingTop: "30px" }}>
            <button className="btn btn-primary" onClick={() => onNotificationTest()}>
                Click Here to Test the Notification
            </button>
        </div>
    );
}
