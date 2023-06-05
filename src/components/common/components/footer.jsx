import React, { Component } from "react";
import { withRouter } from "react-router-dom";
class Footer extends Component {
    render() {
        return (
            <footer>
                <div className="ft-txt">© 2023 FCA Tracker All Rights Reserved </div>
                <div className="ft-txt ft-policy">
                    Version 5.1.3 |
                    <span onClick={() => window.open("/privacypolicy", "_blank")} className="cursor-hand">
                        Privacy Policy
                    </span>
                </div>
            </footer>
        );
    }
}

export default withRouter(Footer);
