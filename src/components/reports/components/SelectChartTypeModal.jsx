import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import "react-lazy-load-image-component/src/effects/blur.css";
import Draggable from "react-draggable";

import ChartView from "./charts/chartView";

class SelectChartTypeModal extends Component {
    state = {
        selectedChart: null,
        selectedChartType: this.props.selectedChart?.name === "efci" ? "stackedcolumn2d" : "pie2d"
    };

    updateChartType = async chartType => {
        await this.setState({
            selectedChartType: chartType
        });
    };

    render() {
        const { isLoading, selectedChart } = this.props;
        const { selectedChartType } = this.state;
        return (
            <div
                class="modal slt-img-modl narr"
                style={{ display: "block" }}
                id="Modal-region"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <Draggable>
                    <div className="chart-select-modal">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">
                                        Select Chart Type
                                    </h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                                    <div class="modal-body region-otr build-type-mod">
                                        <ChartView
                                            graphData={selectedChart.graphData.chartData}
                                            chartName={selectedChart.graphData.chartName}
                                            chartDetailType={selectedChart.name}
                                            projectName={selectedChart.graphData.projectName}
                                            isLoading={false}
                                            updateChartType={this.updateChartType}
                                        />
                                        {selectedChartType ? (
                                            <div class="btn-sec">
                                                <button
                                                    disabled={!selectedChartType}
                                                    className={`btn btn-slt ${!selectedChartType ? "cursor-diabled" : ""}`}
                                                    onClick={() => this.props.onOk(selectedChartType)}
                                                >
                                                    Select
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </LoadingOverlay>
                            </div>
                        </div>
                    </div>
                </Draggable>
            </div>
        );
    }
}

export default SelectChartTypeModal;
