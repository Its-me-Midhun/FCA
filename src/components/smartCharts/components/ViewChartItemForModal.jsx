import React from "react";
import ReactTooltip from "react-tooltip";

import { getDisplayNameFromKey } from "../utils";

const ViewChartItemForModal = ({
    item,
    chartItemData = null,
    mainEntity,
    currentBand,
    openChartItemConfigModal,
    provided,
    index,
    entity,
    toggleImageListForBandModal,
    ...props
}) => {
    return (
        <div className="drag-item">
            <div className="top-sec">
                <div className="icon">
                    <img src="/img/icon-squre.svg" />
                </div>
                <div className="icon-rght-b">
                    {item.isIndividualBuilding ? (
                        <>
                            <ReactTooltip id={`sm-charts-main${entity}`} effect="solid" place="bottom" backgroundColor="#007bff" />
                            <div
                                className="icon-b"
                                data-tip="This chart/table will repeat for every building in scope"
                                data-for={`sm-charts-main${entity}`}
                            >
                                <img src={`/img/sm-charts-all-buildings.svg`} />
                            </div>
                        </>
                    ) : null}
                </div>
                <div class="wrap-icon d-flex">
                    {item.isImageBand ? (
                        <>
                            <div
                                class="edt-icn ey-icn cursor-hand"
                                onClick={() =>
                                    toggleImageListForBandModal(
                                        {
                                            bandName: currentBand,
                                            chartKey: item.isImageBand ? item.docKey : item.name,
                                            entity: entity,
                                            itemConfig: item.config,
                                            isImageBand: item.isImageBand
                                        },
                                        true
                                    )
                                }
                            >
                                <img src="/img/sm-charts-img-eye.svg" />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
            <div className="cont-sec">
                <div className="icons-sec">
                    <img src={`/img/${item.entityIcon}`} />
                </div>
                <h3>{getDisplayNameFromKey(item.name, item.isUserDoc)}</h3>
            </div>
            {item.hasConfig ? (
                <div className="fot-sec top-border">
                    <div className="fot-select">
                        <span className="badge">{item?.totalChartCount}</span>
                        <span className="nme">{`Selected ${item.isImageBand ? "Images" : "Charts"}`}</span>
                    </div>
                    <div className="btn-area">
                        <div className="icon"></div>
                        <button
                            className="btn btn-conf"
                            onClick={() =>
                                openChartItemConfigModal({
                                    bandName: currentBand,
                                    chartKey: item.isImageBand ? item.docKey : item.name,
                                    entity: entity,
                                    itemConfig: item.config,
                                    isImageBand: item.isImageBand
                                })
                            }
                        >
                            View Config <img src="/img/blue_arrow_right.svg" />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
export default ViewChartItemForModal;
