import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import "react-lazy-load-image-component/src/effects/blur.css";
import Draggable from "react-draggable";

import Loader from "../../common/components/Loader";
import Portal from "../../common/components/Portal";
import SelectChartTypeModal from "./SelectChartTypeModal";

class ChartSelectModal extends Component {
    state = {
        selectedChart: null,
        isChartLoading: true,
        selectedFilter: "notUsed",
        openSelectChartTypeModal: false
    };

    componentDidMount = async () => {
        await this.refreshchartList();
    };

    refreshchartList = async () => {
        const {
            narratives,
            selectedBand: { index, bandIdx }
        } = this.props;
        const selectedChart = narratives[index]?.data[bandIdx] || null;

        await this.setState({
            selectedChart
        });
        this.props.imageFilterHandler(this.state.selectedFilter);
    };

    handleFilter = value => {
        this.setState({ selectedFilter: value });
        this.props.imageFilterHandler(value);
    };

    handleChartClick = async item => {
        await this.setState({
            isChartLoading: true
        });
        await this.setState({ selectedChart: item });
        await this.props.getChartDetails(item.name);
        const { graphData } = this.props;
        await this.setState({ selectedChart: { ...this.state.selectedChart, graphData } });
        await this.setState({
            isChartLoading: false
        });
    };

    renderChartTypeSelectModal = () => {
        const { openSelectChartTypeModal, selectedChart } = this.state;
        if (!openSelectChartTypeModal) return null;
        return (
            <Portal
                body={
                    <SelectChartTypeModal
                        onCancel={() => this.setState({ openSelectChartTypeModal: false })}
                        selectedChart={selectedChart}
                        onOk={this.updateChartType}
                    />
                }
                onCancel={() => this.setState({ openSelectChartTypeModal: false })}
            />
        );
    };

    updateChartType = async chartType => {
        await this.setState({ selectedChart: { ...this.state.selectedChart, chartType } });
        this.props.handleSelectedChart(this.state.selectedChart);
        this.setState({
            openSelectChartTypeModal: false
        });
    };

    render() {
        const { selectedChart, isChartLoading } = this.state;
        const { isLoading, chartList = [], imageRecommendationList = [] } = this.props;
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
                <Draggable positionOffset={{ x: "0%", y: "50%" }}>
                    <div className="chart-select-modal">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">
                                        Select Chart
                                    </h5>
                                    {/* <div class="drp-sel-lz-img">
                                        <select
                                            class="form-control"
                                            value={this.state.selectedFilter}
                                            onChange={e => this.handleFilter(e.target.value)}
                                        >
                                            <option value="all">All</option>
                                            <option value="notUsed">Not Used</option>
                                        </select>
                                    </div> */}
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                                    <div class="modal-body region-otr build-type-mod">
                                        {chartList.length ? (
                                            <div className="im-outer-scroll">
                                                <div className="im-rec-outer">
                                                    <span class="img-select-header">Charts</span>
                                                    <div className={`img-rec-inner ${chartList.length ? "brd-btm" : ""}`}>
                                                        {chartList.length
                                                            ? chartList?.map(item => (
                                                                  <>
                                                                      <div class="img-sec" key={item.id}>
                                                                          <div
                                                                              class={`itm ${selectedChart?.id === item?.id ? "slted" : ""}`}
                                                                              onClick={() => this.handleChartClick(item)}
                                                                          >
                                                                              <img src="/img/chart-default.svg" alt="" />
                                                                              <div
                                                                                  class={`${selectedChart?.id === item?.id ? "sl-overlay" : "name"}`}
                                                                              >
                                                                                  {selectedChart?.id === item?.id ? (
                                                                                      <div class="tic">
                                                                                          <img src="/img/tic-green.svg" alt="" />
                                                                                      </div>
                                                                                  ) : (
                                                                                      <h3>{item.name} </h3>
                                                                                  )}
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  </>
                                                              ))
                                                            : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div class="no-img">
                                                <img src="/img/Group 6.svg" alt="" />
                                                Charts not available
                                            </div>
                                        )}
                                        {chartList.length || imageRecommendationList.length ? (
                                            <div class="btn-sec">
                                                <button
                                                    disabled={!selectedChart || isChartLoading}
                                                    className={`btn btn-slt ${!selectedChart || isChartLoading ? "cursor-diabled" : ""}`}
                                                    onClick={() =>
                                                        this.setState({
                                                            openSelectChartTypeModal: true
                                                        })
                                                    }
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
                {this.renderChartTypeSelectModal()}
            </div>
        );
    }
}

export default ChartSelectModal;
