import React, { useState, useEffect } from "react";

import { IMAGE_BAND_CONFIG_TYPES } from "../constants";

const ImageBandConfigModal = ({ setSmartChartData, configData = {}, onCancel, isView = false }) => {
    const [selectedImageBandConfig, setSelectedImageBandConfig] = useState(configData?.selectedChartConfig?.config?.type || null);

    const updateImageBandConfig = () => {
        setSmartChartData("config_image_band", {
            ...configData,
            imageBandConfig: { config: { type: selectedImageBandConfig } }
        });
        onCancel();
    };

    return (
        <div
            class="modal modal-region smart-chart-popup smart-dtl-pop add-image-modal img-pop-sing"
            id="modalId"
            tabindex="-1"
            style={{ display: "block" }}
        >
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <div class="txt-hed">Image Band Configuration</div>
                        </h5>
                        <button type="button" class="close" onClick={() => onCancel()}>
                            <span aria-hidden="true">
                                <img src="/img/close.svg" alt="" />
                            </span>
                        </button>
                    </div>
                    <div class="modal-body region-otr">
                        <div class="img-repr col-12 d-flex">
                            {IMAGE_BAND_CONFIG_TYPES.map((configType, i) => (
                                <div class={`img-rep-otr d-flex ${configType.key === 3 ? "col-12" : "col-6"}`} key={i}>
                                    <div class={`img-rep-item col-md-12 ${configType.key === 3 ? "mt-3" : ""}`}>
                                        <div class="top-sec">
                                            <div class="icon">
                                                <img src="/img/icon-squre.svg" />
                                            </div>
                                            <div class="checkbox">
                                                <label class={`container-check ${isView ? "cursor-diabled" : ""}`}>
                                                    <input
                                                        type="checkbox"
                                                        name="is_bold"
                                                        checked={selectedImageBandConfig === configType.key}
                                                        onClick={e =>
                                                            !isView && setSelectedImageBandConfig(!e.target.checked ? null : configType.key)
                                                        }
                                                    />
                                                    <span class="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="cont-sec">
                                            <div class="img-sec">
                                                <img src={configType.icon} />
                                            </div>
                                            <h3>{configType.label}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="footer-otr col-12">
                            <div class="btn-otrr">
                                {!isView ? (
                                    <button class="btn-img-rpt mr-2" onClick={() => updateImageBandConfig()}>
                                        Save
                                    </button>
                                ) : null}
                                <button class="btn-cancel" onClick={() => onCancel()}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageBandConfigModal;
