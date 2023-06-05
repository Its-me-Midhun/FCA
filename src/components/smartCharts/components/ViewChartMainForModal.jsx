import React from "react";

import ViewChartSectionForModal from "./ViewChartSectionForModal";
import ViewPropertyFilters from "./ViewPropertyFilters";
import { getDisplayNameFromKey } from "../utils";

const ViewChartMainForModal = ({ chartData, chartKeys = [], entity, openChartItemConfigModal, toggleImageListForBandModal, ...props }) => {
    return (
        <>
            <div class="card">
                <div class="card-header" id={`headingOne${entity}`}>
                    <div class="icon">
                        <img src="/img/icon-squre.svg" />
                    </div>
                    <div
                        class="heading-text"
                        data-toggle="collapse"
                        data-target={`#collapseOne${entity}`}
                        aria-expanded="true"
                        aria-controls={`collapseOne${entity}`}
                    >
                        <h3>{getDisplayNameFromKey(entity)}</h3>
                    </div>
                </div>
                <div id={`collapseOne${entity}`} class="collapse show" aria-labelledby={`headingOne${entity}`}>
                    <div class="card-body">
                        <ViewPropertyFilters chartData={chartData} entity={entity} />
                        {Object.keys(chartData[entity]).map((band, index) => {
                            return (
                                <ViewChartSectionForModal
                                    currentBand={band}
                                    currentBandIndex={index}
                                    chartSectionData={chartData[entity][band]}
                                    chartKeys={chartKeys}
                                    entity={entity}
                                    openChartItemConfigModal={openChartItemConfigModal}
                                    toggleImageListForBandModal={toggleImageListForBandModal}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
export default ViewChartMainForModal;
