import React, { useState, useEffect } from "react";
import _ from "lodash";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { getDisplayNameFromKey, shiftObjectProps } from "../utils";
import { CHART_DATA_VIEWS, CHART_ITEMS, INDV_BUILDING_EXPORT_ENTITIES } from "../constants";
import { reorderArray } from "../../../config/utils";

const ChartItemConfigModal = ({ setSmartChartData, configData = {}, onCancel, defaultData = {}, configOrder = {}, isView = false, ...props }) => {
    const [chartConfigData, setChartConfigData] = useState({ ...configData?.selectedChartConfig });
    const [chartViews, setChartViews] = useState([]);
    const [rowConstructArray, setRowConstructArray] = useState([]);
    const [isIndividualExport, setIsIndividualExport] = useState(
        (configData?.chartKey === "sorted_recom"
            ? configData?.selectedChartConfig?.band1?.is_indv_bld
            : configData?.selectedChartConfig?.is_indv_bld) || false
    );
    useEffect(() => {
        let defaultChartView = CHART_ITEMS?.[configData.entity]?.[configData.chartKey]?.config
            ? Object.keys(CHART_ITEMS[configData.entity][configData.chartKey].config)
            : [];
        let currentChartView = configOrder?.[configData.chartKey] ? [...configOrder?.[configData.chartKey]] : [];
        setChartViews(currentChartView?.length ? [...currentChartView] : defaultChartView);
        if (defaultChartView.length) {
            let totalRows = defaultChartView.length / 2 + (defaultChartView.length % 2 ? 1 : 0);
            let tempRowConstructArray = [];
            for (let i = 1; i <= totalRows; i++) {
                tempRowConstructArray.push(i);
            }
            setRowConstructArray([...tempRowConstructArray]);
        }
    }, []);

    const handleChartConfigData = (action, chartView, params) => {
        const { is_remove = false, chartType } = params;
        switch (action) {
            case "view":
                if (is_remove) {
                    setChartConfigData(prevConfig => {
                        return {
                            ..._.omit(prevConfig, [chartView])
                        };
                    });
                } else {
                    if (chartView === "table_view") {
                        setChartConfigData(prevConfig => {
                            return {
                                ...prevConfig,
                                [chartView]: ""
                            };
                        });
                    } else {
                        const { entity, chartKey } = configData;
                        let previousSelectedValue = defaultData?.[entity]?.band1?.type?.[chartKey]?.[chartView]?.chart_type || [];
                        setChartConfigData(prevConfig => {
                            return {
                                ...prevConfig,
                                [chartView]: {
                                    chart_type: [...previousSelectedValue]
                                }
                            };
                        });
                    }
                }

                break;
            case "chartType":
                let currentTypes = chartConfigData[chartView]?.chart_type ? [...chartConfigData[chartView].chart_type] : [];
                let updatedChartTypes = [];
                if (is_remove) {
                    updatedChartTypes = currentTypes.filter(type => type !== chartType);
                } else {
                    updatedChartTypes = [...currentTypes, chartType];
                }
                setChartConfigData(prevConfig => {
                    return {
                        ...prevConfig,
                        [chartView]: {
                            chart_type: [...updatedChartTypes]
                        }
                    };
                });
                break;
            case "allSelect":
                if (is_remove) {
                    setChartConfigData({});
                } else {
                    let allChartTypes = {};
                    if (configData?.chartKey === "EFCI") {
                        allChartTypes = {
                            detailed_view: {
                                chart_type: ["line_column_2d"]
                            }
                        };
                    }
                    //  else if (configData?.chartKey === "system") {
                    //     allChartTypes = {
                    //         detailed_view: {
                    //             chart_type: ["stacked_column_2d", "stacked_column_3d"]
                    //         },
                    //         table_view: ""
                    //     };
                    // }
                    else {
                        allChartTypes = {
                            summary_view: {
                                chart_type: ["pie_2d", "pie_3d", "donut_2d", "donut_3d"]
                            },
                            detailed_view: {
                                chart_type: ["stacked_column_2d", "stacked_column_3d"]
                            },
                            table_view: ""
                        };
                    }
                    setChartConfigData(prevConfig => {
                        return {
                            ...allChartTypes
                        };
                    });
                }
                break;
            default:
        }
    };

    const handleClickCancel = () => {
        setChartConfigData({});
        onCancel();
    };

    const handleClickSave = () => {
        setChartConfigData({});
        setSmartChartData("config_chart", {
            ...configData,
            chartConfigData: { ...shiftObjectProps(chartConfigData, CHART_DATA_VIEWS) },
            configOrder: [...chartViews],
            defaultValue: configData?.selectedChartConfig || null,
            additionalKeysForConfig: INDV_BUILDING_EXPORT_ENTITIES.includes(configData?.chartKey) && isIndividualExport ? { is_indv_bld: "T" } : {}
        });
        onCancel();
    };

    const isAllSelected = () => {
        if (configData?.chartKey === "EFCI") {
            if (chartConfigData?.detailed_view?.chart_type?.length === 1) {
                return true;
            }
        }
        // else if (configData?.chartKey === "system") {
        //     if (chartConfigData?.detailed_view?.chart_type?.length === 2 && chartConfigData.hasOwnProperty("table_view")) {
        //         return true;
        //     }
        // }
        else if (
            chartConfigData?.summary_view?.chart_type?.length === 4 &&
            chartConfigData?.detailed_view?.chart_type?.length === 2 &&
            chartConfigData.hasOwnProperty("table_view")
        ) {
            return true;
        }
        return false;
    };

    const renderChartTypes = (view, chartKey) => {
        switch (view) {
            case "summary_view":
                return ["pie_2d", "pie_3d", "donut_2d", "donut_3d"];
            case "detailed_view":
                if (chartKey === "EFCI") {
                    return ["line_column_2d"];
                }
                return ["stacked_column_2d", "stacked_column_3d"];
            default:
                return [];
        }
    };

    const onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        const keyList = reorderArray(chartViews, result.source.index, result.destination.index);
        setChartViews(keyList);
    };

    const getIconsForView = view => {
        switch (view) {
            case "summary_view":
                return "sm-charts-pie-chart-icon.svg";
            case "detailed_view":
                return "smart-chart-chart-icon-item.svg";
            case "table_view":
                return "sm-charts-table-blue-icon.svg";
        }
    };

    // console.log("chartConfigData", chartConfigData);

    return (
        <div className="modal modal-region smart-chart-popup" id="modalId" tabindex="-1" style={{ display: "block" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            <div className="txt-hed d-flex align-items-center">
                                {getDisplayNameFromKey(configData?.chartKey)}
                                {INDV_BUILDING_EXPORT_ENTITIES.includes(configData?.chartKey) ? (
                                    <div class="check-box-area ml-4">
                                        <label className={`container-check ${isView ? "cursor-diabled" : ""} green-check`}>
                                            Repeat for EVERY building in scope
                                            <input
                                                type="checkbox"
                                                name="is_bold"
                                                checked={isIndividualExport}
                                                onClick={e =>
                                                    !isView &&
                                                    setIsIndividualExport(prevValue => {
                                                        return !prevValue;
                                                    })
                                                }
                                            />
                                            <span class="checkmark"></span>
                                        </label>
                                    </div>
                                ) : null}
                            </div>
                            <div className="check-box-area">
                                {configData?.chartKey !== "sorted_recom" ? (
                                    <label className={`container-check ${isView ? "cursor-diabled" : ""} green-check`}>
                                        {" "}
                                        Select All Charts{" "}
                                        <input
                                            type="checkbox"
                                            name="is_bold"
                                            checked={isAllSelected()}
                                            onClick={e => !isView && handleChartConfigData("allSelect", "", { is_remove: !e.target.checked })}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                ) : null}
                            </div>
                        </h5>
                        <button type="button" className="close" onClick={() => onCancel()}>
                            <span aria-hidden="true">
                                <img src="/img/close.svg" alt="" />
                            </span>
                        </button>
                    </div>
                    <div className="modal-body region-otr">
                        <div className="upload-area not-draggable">
                            <div className="upload-sec cursor-hand" role="button" tabindex="0">
                                <input type="file" multiple="" autocomplete="off" tabindex="-1" style={{ display: "none" }} />
                            </div>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            {configData?.chartKey !== "sorted_recom" ? (
                                <div className="col-md-12">
                                    {rowConstructArray.map((dropRow, rowIndex) => (
                                        <Droppable
                                            droppableId={`CHART-VIEW-${rowIndex}`}
                                            direction="horizontal"
                                            isDropDisabled={isView || chartViews.length < 2 ? true : false}
                                        >
                                            {(provided, snapshot) => (
                                                <div className="dragble-area" ref={provided.innerRef} {...provided.droppableProps}>
                                                    {chartViews.slice(rowIndex * 2, (rowIndex + 1) * 2).map((view, index) => (
                                                        <>
                                                            {configData?.itemConfig?.[view] ? (
                                                                <Draggable
                                                                    key={`draggable-chart-view-${rowIndex}${index}`}
                                                                    draggableId={`draggable-chart-view-${rowIndex}${index}`}
                                                                    index={rowIndex * 2 + index}
                                                                    isDragDisabled={isView || chartViews.length < 2 ? true : false}
                                                                >
                                                                    {provided => (
                                                                        <div
                                                                            className="box-drg-outr"
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            key={`draggable-${index}`}
                                                                        >
                                                                            <div className="drag-item">
                                                                                <div className="top-sec">
                                                                                    <div className="icon">
                                                                                        <img src="/img/icon-squre.svg" />
                                                                                    </div>
                                                                                    <div className="checkbox">
                                                                                        <label
                                                                                            className={`container-check ${
                                                                                                isView ? "cursor-diabled" : ""
                                                                                            } green-check`}
                                                                                        >
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                name="is_bold"
                                                                                                checked={chartConfigData.hasOwnProperty(view)}
                                                                                                onClick={e =>
                                                                                                    !isView &&
                                                                                                    handleChartConfigData("view", view, {
                                                                                                        is_remove: !e.target.checked
                                                                                                    })
                                                                                                }
                                                                                            />
                                                                                            <span className="checkmark"></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="cont-sec">
                                                                                    <div className="icons-sec">
                                                                                        <img src={`/img/${getIconsForView(view)}`} />
                                                                                    </div>
                                                                                    <h3>{getDisplayNameFromKey(view)}</h3>
                                                                                </div>
                                                                                {view !== "table_view" ? (
                                                                                    <div className="fot-sec top-border">
                                                                                        <div className="fot-select">
                                                                                            {renderChartTypes(view, configData.chartKey).map(
                                                                                                (chartType, i) => (
                                                                                                    <div className="check-box-area" key={i}>
                                                                                                        <label
                                                                                                            className={`container-check ${
                                                                                                                isView ? "cursor-diabled" : ""
                                                                                                            } green-check`}
                                                                                                        >
                                                                                                            {getDisplayNameFromKey(chartType)}
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="is_bold"
                                                                                                                checked={
                                                                                                                    chartConfigData?.[
                                                                                                                        view
                                                                                                                    ]?.chart_type?.includes(chartType)
                                                                                                                        ? true
                                                                                                                        : false
                                                                                                                }
                                                                                                                onClick={e =>
                                                                                                                    !isView &&
                                                                                                                    handleChartConfigData(
                                                                                                                        "chartType",
                                                                                                                        view,
                                                                                                                        {
                                                                                                                            is_remove:
                                                                                                                                !e.target.checked,
                                                                                                                            chartType: chartType
                                                                                                                        }
                                                                                                                    )
                                                                                                                }
                                                                                                            />
                                                                                                            <span className="checkmark"></span>
                                                                                                        </label>
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ) : null}
                                                                            </div>
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ) : null}
                                                        </>
                                                    ))}
                                                    {/* {provided.placeholder} */}
                                                </div>
                                            )}
                                        </Droppable>
                                    ))}
                                </div>
                            ) : (
                                <div class="no-data-section no-data-section-for-smcharts">
                                    <img src="/img/no-data.svg" alt="no-data-img" />
                                    <h3>No Charts Available</h3>
                                </div>
                            )}
                        </DragDropContext>
                        <div className="btn-sec">
                            <div className="text-right btnOtr edit-cmn-btn">
                                <button
                                    type="button"
                                    className="btn btn-secondary btnClr col-md-2 mr-1"
                                    data-dismiss="modal"
                                    onClick={() => handleClickCancel()}
                                >
                                    Cancel
                                </button>
                                {!isView ? (
                                    <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => handleClickSave()}>
                                        Save
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartItemConfigModal;
