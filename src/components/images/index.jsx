import React, { Component } from "react";
import ImageMain from "./components/ImageMain";

import "../../assets/css/image-management.css";
import "../../assets/css/image-management-listing.css";
import { withRouter } from "react-router-dom";
import Recommendations from "../recommendations";
import Assets from "../assets";
export class Images extends Component {
    render() {
        const {
            match: {
                params: { section, id, tab }
            }
        } = this.props;
        return (
            <>
                {section === "imageInfo" && tab === "recommendations" ? (
                    <Recommendations imageId={id} isImageView />
                ) : section === "imageInfo" && tab === "assets" ? (
                    <Assets imageId={id} isImageView />
                ) : (
                    <ImageMain {...this.props} />
                )}
            </>
        );
    }
}

export default withRouter(Images);
