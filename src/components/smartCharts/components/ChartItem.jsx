import React from "react";
import ReactTooltip from "react-tooltip";

import { getDisplayNameFromKey } from "../utils";

const ChartItem = ({
    item,
    setSmartChartData,
    chartItemData = null,
    currentBand,
    openChartItemConfigModal,
    provided,
    index,
    entity,
    toggleImageListForBandModal,
    toggleImageBandDeleteConfirmationModal,
    editImageBand
}) => {
    return (
        <div className="drag-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={`draggable-${index}`}>
            <div className="top-sec">
                <div className="icon">
                    <img src="/img/icon-squre.svg" />
                </div>
                {item.isImageBand ? (
                    <ReactTooltip id={`sm-charts-chart-item${entity}`} effect="solid" place="bottom" backgroundColor="#007bff" />
                ) : null}
                <div className="icon-rght-b">
                    {item.isIndividualBuilding ? (
                        <>
                            <ReactTooltip id={`sm-charts-main-indv${entity}`} effect="solid" place="bottom" backgroundColor="#007bff" />
                            <div
                                className="icon-b"
                                data-tip="This chart/table will repeat for every building in scope"
                                data-for={`sm-charts-main-indv${entity}`}
                            >
                                <img src={`/img/sm-charts-all-buildings.svg`} />
                            </div>
                        </>
                    ) : null}
                    <div class="wrap-icon d-flex">
                        {item.isImageBand ? (
                            <>
                                <div
                                    class="edt-icn cursor-hand"
                                    data-tip="Edit Image Band Name"
                                    data-for={`sm-charts-chart-item${entity}`}
                                    onClick={() =>
                                        editImageBand({
                                            bandName: currentBand,
                                            chartKey: item.docKey,
                                            entity: entity,
                                            name: item.name || "Image Band"
                                        })
                                    }
                                >
                                    <img src="/img/sm-charts-img-edit.svg" />
                                </div>
                                <div
                                    class="edt-icn de-icn cursor-hand"
                                    data-tip="Delete Image Band"
                                    data-for={`sm-charts-chart-item${entity}`}
                                    onClick={() =>
                                        toggleImageBandDeleteConfirmationModal({
                                            bandName: currentBand,
                                            chartKey: item.docKey,
                                            entity: entity
                                        })
                                    }
                                >
                                    <img src="/img/sm-charts-img-delete.svg" />
                                </div>
                                <div
                                    class="edt-icn ey-icn cursor-hand"
                                    data-tip="View Selected Images"
                                    data-for={`sm-charts-chart-item${entity}`}
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
                        <div className="checkbox">
                            <label className="container-check green-check">
                                <input
                                    type="checkbox"
                                    name="is_bold"
                                    onClick={e =>
                                        setSmartChartData("customize_chart", {
                                            bandName: currentBand,
                                            chartKey: item.isUserDoc || item.isImageBand ? item.docKey : item.name,
                                            is_remove: !e.target.checked,
                                            defaultValue: item.defaultValue,
                                            entity: entity
                                        })
                                    }
                                    checked={item.isSelected}
                                />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </div>
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
                        {item.name !== "sorted_recom" ? (
                            <>
                                <span className="badge">{item?.totalChartCount}</span>
                                <span className="nme">{`Selected ${item.isImageBand ? "Images" : "Charts"}`}</span>
                            </>
                        ) : null}
                    </div>
                    <div className="btn-area">
                        <div className="icon"></div>
                        {item.isImageBand ? (
                            <button
                                class="btn butn-img-select"
                                data-tip="Select Images"
                                data-for={`sm-charts-chart-item${entity}`}
                                onClick={() =>
                                    toggleImageListForBandModal({
                                        bandName: currentBand,
                                        chartKey: item.isImageBand ? item.docKey : item.name,
                                        entity: entity,
                                        itemConfig: item.config,
                                        isImageBand: item.isImageBand
                                    })
                                }
                            >
                                <img src="/img/sm-charts-img-select.svg" />
                            </button>
                        ) : null}
                        <button
                            className="btn btn-conf"
                            onClick={() =>
                                entity === "project" &&
                                item.isSelected &&
                                openChartItemConfigModal({
                                    bandName: currentBand,
                                    chartKey: item.isImageBand ? item.docKey : item.name,
                                    entity: entity,
                                    itemConfig: item.config,
                                    isImageBand: item.isImageBand
                                })
                            }
                        >
                            Configure <img src="/img/blue_arrow_right.svg" />
                        </button>
                    </div>
                </div>
            ) : null}
            {provided.placeholder}
        </div>
    );
};
export default ChartItem;
