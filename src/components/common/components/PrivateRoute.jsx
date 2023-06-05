import React, { Fragment, Suspense } from "react";
import { Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { APP_MODE } from "../../../config/constants";
import ErrorBoundary from "./ErrorBoundary";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";
import { onMessageListener } from "../../../config/firebase";
import { ToastContainer } from "react-toastify";
import ToastMsg from "./ToastMessage";
import notificationActions from "../../notification/actions";

class PrivateRoute extends React.Component {
    state = {
        showNav: true
    };

    handleShowNa = () => {
        this.setState({
            showNav: !this.state.showNav
        });
    };

    render() {
        const { component: Component, ...rest } = this.props;
        onMessageListener()
            .then(payload => {
                this.props.getUnreadNotifications();
                if (payload?.notification?.title) {
                    ToastMsg({ title: payload.notification.title, body: payload.notification.body });
                }
            })
            .catch(err => console.log("failed: ", err));
        return (
            <Route
                {...rest}
                render={props =>
                    localStorage.getItem("fca-token") ? (
                        <Fragment>
                            {props.match.path === "/home" ? (
                                <ErrorBoundary>
                                    <Suspense fallback={<></>}>
                                        <Component {...props} />
                                    </Suspense>
                                </ErrorBoundary>
                            ) : (
                                <div className="dashboard-outer">
                                    <div className="outer-detail drop-nav">
                                        <SideMenu handleShowNa={this.handleShowNa} showNav={this.state.showNav} />
                                        <div className={`right-panel-section ${APP_MODE === "training" ? "right-common-blue-outer" : ""}`} id="main">
                                            {props.match.path === "/dashboard" ? null : (
                                                <TopBar handleShowNa={this.handleShowNa} showNav={this.state.showNav} />
                                            )}
                                            <ErrorBoundary>
                                                <Suspense fallback={<></>}>
                                                    <Component {...props} />
                                                </Suspense>
                                            </ErrorBoundary>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    ) : (
                        <Redirect to={{ pathname: "/" }} />
                    )
                }
            />
        );
    }
}
export default withRouter(connect(null, { ...notificationActions })(PrivateRoute));
