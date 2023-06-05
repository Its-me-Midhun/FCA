/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
// import history from "../../../config/history";
import commonActions from "../actions";
import Loader from "./Loader";

const ExportLinkRoutingPage = props => {
    const tabsOpen = localStorage.getItem("tabsOpen");
    const [loader, setLoader] = useState(false);
    const history = useHistory();
    useEffect(() => {
        refreshExport();
    }, [props.match.params.id]);

    const refreshExport = async () => {
        setLoader(true);
        await props.getLinkEmail({ id: props.match.params.id });

        setLoader(false);
    };

    const handleDownload = s3_url => {
        const link = document.createElement("a");
        link.href = s3_url;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
    const ResData = props.commonReducer.getEmailItemResponse || {};
    const { status, s3_url } = ResData;
    return (
        <>
            <LoadingOverlay active={loader} spinner={<Loader />} fadeSpeed={10}>
                <div className="error-sec">
                    <div className="col-md-12 navbarOtr">
                        <nav className="navbar navbar-expand-lg col-md-12">
                            {tabsOpen !== null && tabsOpen <= 1 ? (
                                <a
                                    role="button"
                                    className="navbar-brand"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        history.push("/dashboard");
                                    }}
                                    // data-place="top"
                                    // data-tip={"Go to Dashboard"}
                                    // data-for="export-link"
                                >
                                    <img src="/img/fca-logo.svg" alt="" />
                                    {/* <ReactTooltip id="export-link" effect="solid" /> */}
                                </a>
                            ) : (
                                <a className="navbar-brand">
                                    <img src="/img/fca-logo.svg" alt="" />
                                </a>
                            )}
                        </nav>
                    </div>
                    {status === true ? (
                        <div class="error-page expired-outer">
                            <div class="error-otr">
                                <div class="error-img">
                                    <img src="/img/download-smiely.svg" alt="" />
                                </div>
                                <h4>Your Download Has Been Initiated</h4>
                                <h5>Your Report Should Download Automatically, If Not, Click The Button Below to Download Your  Recommendation Report</h5>
                                <button onClick={() => handleDownload(s3_url)} class="btn-blue-dwnlod">
                                    Download Recommendation report
                                </button>
                            </div>
                        </div>
                    ) : status === false ? (
                        <div class="error-page expired-outer">
                            <div class="error-otr">
                                <div class="error-img">
                                    <img src="/img/expired-smiely.svg" alt="" />
                                </div>
                                <h4>Your Export Link Has Expired</h4>
                                <h5>Please contact our team or initiate new Sorted Recommendation Report.</h5>
                            </div>
                        </div>
                    ) : (
                        <div class="error-page expired-outer">
                            <div class="error-otr">
                                <div class="error-img"></div>
                            </div>
                        </div>
                    )}
                </div>
            </LoadingOverlay>
        </>
    );
};

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default connect(mapStateToProps, { ...commonActions })(ExportLinkRoutingPage);
