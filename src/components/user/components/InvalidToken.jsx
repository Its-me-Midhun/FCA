import React, { Component } from "react";
import history from "../../../config/history";

export class InvalidToken extends Component {
    render() {
        return (
            <div class="error-sec">
                <div class="col-md-12 navbarOtr">
                    <nav class="navbar navbar-expand-lg col-md-12">
                        <a class="navbar-brand" onClick={() => history.push("/")}>
                            <img src="/img/fca-logo.svg" alt="" />
                        </a>
                    </nav>
                </div>
                <div class="dtl-sec col-md-12">
                    <div class="tab-dtl region-mng">
                        <div class="tab-active location-sec image-sec">
                            <div class="dtl-sec col-md-12">
                                <div class="wrong-page-otr">
                                    <div class="img-sec text-center">
                                        <img src="/img/wrong-icn.svg" />
                                    </div>
                                    <div class="text-secn text-center">
                                        <h3>Invalid Token</h3>
                                        <h4>
                                            The request to reset your password has expired or the link has already been used. Please try again
                                        </h4>
                                        <div class="btn-otr">
                                            <button class="btn-bl-w" onClick={() => history.push("/login")}>
                                                Go to Login page
                                            </button>
                                            <button class="btn-bl" onClick={() => history.push("/forgot_password")}>
                                                Request new link
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
