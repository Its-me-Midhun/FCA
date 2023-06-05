import React, { Component } from "react";
import { BandTypes } from "../constants";
import Draggable from "react-draggable";

class ImageBrandModal extends Component {
    render() {
        return (
            <div
                class="modal slt-img-modl"
                id="Modal-region-one"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                style={{ display: "block" }}
            >
                <Draggable positionOffset={{ x: "0%", y: "30%" }}>
                    <div>
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">
                                        Select Image Band
                                    </h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body region-otr build-type-mod">
                                    <div class="img-sec single">
                                        <div class="single-img">
                                            <h3>Single image Band (Square)</h3>
                                            <div
                                                class="img-sec slted justify-content-center"
                                                onClick={() => this.props.insertNarrativeBand(BandTypes.singleImageBand, "square")}
                                            >
                                                <div class="img-container square">
                                                    <img src="/img/image-photography.svg" />
                                                </div>
                                            </div>

                                            <h3>Single image Band (Rectangle)</h3>
                                            <div
                                                class="img-sec slted"
                                                onClick={() => this.props.insertNarrativeBand(BandTypes.singleImageBand, "rectangle")}
                                            >
                                                <div class="img-container rectangle">
                                                    <img src="/img/image-photography.svg" />
                                                </div>
                                            </div>

                                            <div class="single-img double">
                                                <h3>Double image Band</h3>
                                                <div class="img-sec slted" onClick={() => this.props.insertNarrativeBand(BandTypes.doubleImageBand)}>
                                                    <div class="img-container">
                                                        <img src="/img/image-photography.svg" />
                                                    </div>
                                                    <div class="img-container">
                                                        <img src="/img/image-photography.svg" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            </div>
        );
    }
}

export default ImageBrandModal;
