import React,{Suspense} from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }) => {
    let hasLandingPage = localStorage.getItem("hasLandingPage") === "true" ? true : false;
    return (
        <Route
            {...rest}
            render={props =>
                localStorage.getItem("fca-token") ? <Redirect to={{ pathname: hasLandingPage ? "/home" : "/dashboard" }} /> :<Suspense fallback={<></>}> <Component {...props} /></Suspense>
            }
        />
    );
};
export default PublicRoute;
