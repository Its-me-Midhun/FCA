/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { withRouter } from "react-router-dom";
import history from "../../../config/history";

function PageNotFound() {
    return (
        <>
            <div class="error-sec">
                <div class="col-md-12 navbarOtr">
                    <nav class="navbar navbar-expand-lg col-md-12">
                        <a class="navbar-brand" onClick={() => history.push("/dashboard")}>
                            <img src="/img/fca-logo.svg" alt="" />
                        </a>
                    </nav>
                </div>

                <div class="error-page">
                    <div class="error-otr">
                        <div class="error-img">
                            <img src="/img/404.png" alt="" />
                        </div>
                        <h3>Oops!</h3>
                        <h4>Page Not Found no service</h4>
                        <p>
                            The Link you followed is either outdated,inaccurate or the server has
                            been instructed not to let you have it
                        </p>
                        <button class="back-btn" onClick={() => history.push("/dashboard")}>
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(PageNotFound);
