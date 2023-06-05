import React, { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

import ChartItem from "./ChartItem";
import MasterFilter from "./MasterFilter";
import { CHART_ITEMS, MASTER_FILTER_ROWS } from "../constants";

const ChartSection = ({
    getSmartChartMasterFilterDropDown,
    projectsDropdownData = [],
    projectId,
    setSmartChartData,
    currentBand,
    currentBandIndex,
    masterFilterList,
    openChartItemConfigModal,
    chartSectionData,
    chartKeys = [],
    copyChartSectionData,
    entity,
    selectedClient,
    toggleImageListForBandModal,
    toggleImageBandDeleteConfirmationModal,
    editImageBand
}) => {
    const [chartData, setChartData] = useState([]);
    const [rowConstructArray, setRowConstructArray] = useState([]);

    useEffect(() => {
        setChartItemData(entity);
    }, [chartSectionData]);

    const setChartItemData = (entity = "project") => {
        let chartDataArray = [];
        let chartItemList = { ...chartSectionData.type };
        let copyChartItemList = copyChartSectionData?.type || {};
        chartKeys.forEach(chartItem => {
            chartDataArray.push({
                name:
                    chartItem.includes("user_doc") || chartItem.includes("image_doc")
                        ? chartItemList[chartItem]?.name || copyChartItemList?.[chartItem]?.name || chartItem
                        : chartItem.includes("list_image")
                        ? chartItemList[chartItem]?.name || copyChartItemList?.[chartItem]?.name || "Image Band"
                        : chartItem,
                isSelected: chartItemList.hasOwnProperty(chartItem),
                defaultValue: CHART_ITEMS[entity][chartItem]?.defaultValue || "",
                // isVisible: CHART_ITEMS[entity][chartItem]?.isVisible,
                totalChartCount: chartItem.includes("list_image")
                    ? chartItemList?.[chartItem]?.data?.length || 0
                    : (chartItemList?.[chartItem]?.summary_view?.chart_type?.length || 0) +
                      (chartItemList?.[chartItem]?.detailed_view?.chart_type?.length || 0),
                isUserDoc: chartItem.includes("user_doc") || chartItem.includes("image_doc") ? true : false,
                isImage: chartItem.includes("image_doc") ? true : false,
                isImageBand: chartItem.includes("list_image") ? true : false,
                docKey: chartItem,
                hasConfig: CHART_ITEMS[entity]?.[chartItem]?.hasConfig || chartItem.includes("list_image") ? true : false,
                config: CHART_ITEMS[entity]?.[chartItem]?.config || null,
                entityIcon: getEntityIcon(chartItem, chartItemList),
                isIndividualBuilding: chartItemList?.[chartItem]?.hasOwnProperty("is_indv_bld")
            });
        });
        if (chartDataArray.length) {
            let totalRows = chartDataArray.length / 4 + (chartDataArray.length % 4 ? 1 : 0);
            let tempRowConstructArray = [];
            for (let i = 1; i <= totalRows; i++) {
                tempRowConstructArray.push(i);
            }
            setRowConstructArray([...tempRowConstructArray]);
        }
        setChartData([...chartDataArray]);
    };

    const getEntityIcon = (chartItem, chartItemList) => {
        if (chartItem == "sorted_recom" || chartItem == "energy_band" || chartItem == "water_band") {
            return "sm-charts-table-blue-icon.svg";
        }
        if (chartItem.includes("user_doc")) {
            return "file-type-standard.svg";
        }
        if (chartItem.includes("image_doc") || chartItem.includes("list_image")) {
            return "smart-chart-image-item.svg";
        }
        return "smart-chart-chart-icon-item.svg";
    };

    return (
        <div class="drag-main">
            <div class="row m-0">
                {MASTER_FILTER_ROWS[entity].map((row, rowIndex) => (
                    <MasterFilter
                        getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                        masterFilterList={masterFilterList[entity]}
                        setSmartChartData={setSmartChartData}
                        currentBand={currentBand}
                        selectedFiltersList={chartSectionData?.mfilter}
                        selectedClient={selectedClient}
                        entity={entity}
                        rowIndex={rowIndex}
                    />
                ))}
            </div>
            {/* <DragDropContext onDragEnd={onDragEnd}> */}
            <div class="row m-0">
                <div class="col-md-12 p-0">
                    {rowConstructArray.map((dropRow, index) => (
                        <Droppable droppableId={`CHARTITEMS-${entity}-${index}`} direction="horizontal">
                            {(provided, snapshot) => (
                                <div
                                    class="dragble-area"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps} //new prop
                                    // isDraggingOver={snapshot.isDraggingOver}
                                >
                                    {chartData
                                        // .filter(chartItem => chartItem.isVisible)
                                        .slice(index * 4, (index + 1) * 4)
                                        .map((item, i) => {
                                            return (
                                                <Draggable
                                                    key={`draggable-${entity}-${i}${index}`}
                                                    draggableId={`draggable-${entity}-${i}${index}`}
                                                    index={index * 4 + i}
                                                    // index={i}
                                                >
                                                    {provided => {
                                                        return (
                                                            <ChartItem
                                                                index={i}
                                                                provided={provided}
                                                                item={item}
                                                                setSmartChartData={setSmartChartData}
                                                                currentBand={currentBand}
                                                                openChartItemConfigModal={openChartItemConfigModal}
                                                                droppableIndex={index}
                                                                draggableIndex={i}
                                                                entity={entity}
                                                                toggleImageListForBandModal={toggleImageListForBandModal}
                                                                toggleImageBandDeleteConfirmationModal={toggleImageBandDeleteConfirmationModal}
                                                                editImageBand={editImageBand}
                                                            />
                                                        );
                                                    }}
                                                </Draggable>
                                            );
                                        })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </div>
            {/* </DragDropContext> */}
        </div>
    );
};
export default ChartSection;
