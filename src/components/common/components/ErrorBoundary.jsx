/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import history from "../../../config/history";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    onClick = e => {
        e.preventDefault();
        history.push("/dashboard");
        window.location.reload();
    };
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
        console.log({ error, info });
        this.setState({
            error: error,
            errorInfo: info
        });
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <div className="tab-active location-sec image-sec">
                            <div className="dtl-sec col-md-12">
                                <div className="wrong-page-otr">
                                    <div className="img-sec text-center">
                                        <img src="/img/wrong-icn.svg" alt=""/>
                                    </div>
                                    <div className="text-secn text-center">
                                        <h3>Something went wrong</h3>
                                        <h4>
                                            Don't worry though. Our best man is on the case.
                                            <br />
                                            Report Error or back to home page
                                        </h4>
                                        <div className="btn-otr">
                                            <button className="btn-bl-w" onClick={this.onClick}>
                                                Back to Dashboard
                                            </button>
                                            <button className="btn-bl" onClick={() => window.location.reload()}>
                                                Refresh Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
