import React from "react";

import ChartSection from "./ChartSection";
import { getDisplayNameFromKey } from "../utils";

const ChartMain = ({
    getSmartChartMasterFilterDropDown,
    projectsDropdownData,
    projectId,
    setSmartChartData,
    chartData,
    masterFilterList,
    openChartItemConfigModal,
    chartKeys = [],
    copyChartData,
    entity,
    selectedClient,
    isEdit,
    toggleImageListForBandModal,
    toggleImageBandDeleteConfirmationModal,
    editImageBand
}) => {
    return (
        <div class="card">
            <div
                class={`card-header ${isEdit && Object.keys(chartData[entity].band1.type).length ? "bg-th-filtered" : ""}`}
                id={`headingOne${entity}`}
            >
                <div class="icon">
                    <img src="/img/icon-squre.svg" />
                </div>
                <div
                    class="heading-text"
                    data-toggle="collapse"
                    data-target={`#collapseOne${entity}`}
                    aria-expanded="false"
                    aria-controls={`collapseOne${entity}`}
                >
                    <h3>{getDisplayNameFromKey(entity)}</h3>
                </div>
                <div class="check-box-area">
                    <label class="container-check green-check">
                        {" "}
                        Select All Charts{" "}
                        <input
                            type="checkbox"
                            name="is_bold"
                            checked={chartData?.[entity]?.band1?.type && chartKeys.length === Object.keys(chartData[entity].band1.type).length}
                            onClick={e =>
                                setSmartChartData("project", "selectAll", {
                                    isSelectAll: e.target.checked,
                                    bandName: "band1",
                                    entity: entity
                                })
                            }
                        />
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
            <div id={`collapseOne${entity}`} class="collapse" aria-labelledby={`headingOne${entity}`}>
                <div className="card-body">
                    <div className="btn-sec">
                        <button
                            className="btn btn-add-img"
                            onClick={() =>
                                setSmartChartData("image_band", {
                                    bandName: "band1",
                                    entity: entity
                                })
                            }
                        >
                            Add Image Band <img src="/img/white-pls.svg" />
                        </button>
                        {/* <button className="btn btn-file-add">
                            Add Document <img src="/img/blue-pls.svg" />
                        </button> */}
                    </div>
                    {Object.keys(chartData[entity]).map((band, index) => {
                        return (
                            <ChartSection
                                currentBand={band}
                                currentBandIndex={index}
                                getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                                projectsDropdownData={projectsDropdownData}
                                projectId={projectId}
                                setSmartChartData={setSmartChartData}
                                masterFilterList={masterFilterList}
                                chartSectionData={chartData[entity][band]}
                                openChartItemConfigModal={openChartItemConfigModal}
                                chartKeys={chartKeys}
                                copyChartSectionData={copyChartData?.[entity][band]}
                                entity={entity}
                                selectedClient={selectedClient}
                                toggleImageListForBandModal={toggleImageListForBandModal}
                                toggleImageBandDeleteConfirmationModal={toggleImageBandDeleteConfirmationModal}
                                editImageBand={editImageBand}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default ChartMain;
