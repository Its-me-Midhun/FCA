import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


class ImageView extends Component {

    render() {
        const { onCancel, imgSource } = this.props
        return (
            <div id="modalId"
                className="modal modal-region image-view"
                style={{ display: "block" }}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" onClick={onCancel}>
                                    <img src='/img/close.svg' alt="" />
                                    
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="image-section">
                               {/* <img src={imgSource} />*/}  
                               <TransformWrapper
                                    defaultScale={1}
                                >
                                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                <React.Fragment>
                                <div className="md-grp-btn">
                                    <button onClick={zoomIn}><img src='/img/zoom-in.svg'/></button>
                                    <button onClick={zoomOut}><img src='/img/zoom-out.svg'/></button>       
                                </div>
                                <TransformComponent>
                                    <img src={imgSource} />
                                </TransformComponent>
                                </React.Fragment>
                                )}
                                </TransformWrapper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ImageView);