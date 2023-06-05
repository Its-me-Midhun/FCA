import React  from "react";
import { withRouter } from "react-router-dom";
import "./Loader.css";

const Loader = props => {
    return (
        <div className="loader">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
            <div className="bar4"></div>
            <div className="bar5"></div>
            <div className="bar6"></div>
        </div>
    );
};

export default withRouter(Loader);
