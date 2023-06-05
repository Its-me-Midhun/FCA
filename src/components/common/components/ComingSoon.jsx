/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { withRouter } from "react-router-dom";
import history from "../../../config/history";

function PageNotFound() {
    return (
        <div class="dtl-sec col-md-12 fc-new">
            <div class="tab-dtl">
                <div className="coming-soon bg-wh">
                    <div className="coming-soon-img">
                        <img src="/img/coming-soon.svg" alt="" />
                    </div>
                    <h3>COMING SOON</h3>
                </div>
            </div>
        </div>
    );
}

export default withRouter(PageNotFound);
