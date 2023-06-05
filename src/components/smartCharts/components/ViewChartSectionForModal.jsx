import React, { useState, useEffect } from "react";

import ViewChartItemForModal from "./ViewChartItemForModal";
import { CHART_ITEMS } from "../constants";

const ViewChartSectionForModal = ({
    getSmartChartMasterFilterDropDown,
    projectsDropdownData = [],
    projectId,
    currentBand,
    currentBandIndex,
    masterFilterList,
    openChartItemConfigModal,
    chartSectionData,
    entity,
    toggleImageListForBandModal,
    ...props
}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        setChartItemData(entity);
    }, [chartSectionData]);

    const setChartItemData = (entity = "project") => {
        let chartDataArray = [];
        let chartItemList = { ...chartSectionData.type };
        let chartKeys = Object.keys(chartItemList);
        chartKeys.forEach(chartItem => {
            chartDataArray.push({
                name:
                    chartItem.includes("user_doc") || chartItem.includes("image_doc")
                        ? chartItemList[chartItem]?.name || chartItem
                        : chartItem.includes("list_image")
                        ? chartItemList[chartItem]?.name || "Image Band"
                        : chartItem,
                totalChartCount: chartItem.includes("list_image")
                    ? chartItemList?.[chartItem]?.data?.length || 0
                    : (chartItemList?.[chartItem]?.summary_view?.chart_type?.length || 0) +
                      (chartItemList?.[chartItem]?.detailed_view?.chart_type?.length || 0),
                isUserDoc: chartItem.includes("user_doc") || chartItem.includes("image_doc") ? true : false,
                docKey: chartItem,
                isImage: chartItem.includes("image_doc") ? true : false,
                hasConfig: CHART_ITEMS[entity]?.[chartItem]?.hasConfig || chartItem.includes("list_image") ? true : false,
                config: CHART_ITEMS[entity]?.[chartItem]?.config || null,
                entityIcon: getEntityIcon(chartItem),
                isIndividualBuilding: chartItemList?.[chartItem]?.hasOwnProperty("is_indv_bld"),
                isImageBand: chartItem.includes("list_image") ? true : false
            });
        });
        setChartData([...chartDataArray]);
    };

    const getEntityIcon = chartItem => {
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
                <div class="col-md-12 p-0">
                    <div class="dragble-area">
                        {chartData.map((item, i) => (
                            <ViewChartItemForModal
                                index={i}
                                item={item}
                                currentBand={currentBand}
                                entity={entity}
                                openChartItemConfigModal={openChartItemConfigModal}
                                toggleImageListForBandModal={toggleImageListForBandModal}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ViewChartSectionForModal;
