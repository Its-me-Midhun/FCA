import React, { Component } from "react";
import { Draggable } from "react-beautiful-dnd";

import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";
import ChartView from "../charts/chartView";

class ChartBand extends Component {
    state = {
        showConfirmModal: false,
        selectedBand: {
            index: null,
            bandIndex: null
        }
    };

    confirmClearChart = (index, bandIndex) => {
        this.setState({ showConfirmModal: true, selectedBand: { index, bandIndex } });
    };

    renderConfirmationModal = () => {
        const {
            showConfirmModal,
            selectedBand: { index, bandIndex }
        } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to remove and lose all changes?"}
                        message={"This action cannot be reverted, Are you sure that you need to remove this chart?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => {
                            this.props.handleChange(null, index, bandIndex);
                            this.setState({ showConfirmModal: false });
                        }}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    render() {
        const { index, item, hasEdit, hasCreate } = this.props;
        return (
            <>
                {this.renderConfirmationModal()}
                <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            class="cnt-area image"
                            key={`text-${index}`}
                        >
                            <div class="band-sec">
                                <div class="head">
                                    <h3>Chart Band</h3>
                                    {(hasEdit || hasCreate) && (
                                        <button class="close-x" onClick={() => this.props.deleteBand(index)}>
                                            <i class="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div class="cnt-sec-hed">
                                <div class="img-se">
                                    {item.data[0] && (hasCreate || hasEdit) && (
                                        <button class="close-x" onClick={() => this.confirmClearChart(index, 0)}>
                                            <i class="fas fa-times"></i>
                                        </button>
                                    )}
                                    <div class="img-container no-img-container">
                                        {item?.data[0]?.graphData ? (
                                            <ChartView
                                                graphData={item.data[0].graphData.chartData}
                                                chartName={item.data[0].graphData.chartName}
                                                chartDetailType={item.data[0].name}
                                                projectName={item.data[0].graphData.projectName}
                                                chartType={item.data[0].chartType}
                                                isLoading={false}
                                                isChartBand={true}
                                            />
                                        ) : (
                                            <img
                                                className={`gal-icn-img`}
                                                src={"/img/chart-default.svg"}
                                                alt=""
                                                onClick={() => (hasCreate || hasEdit ? this.props.openChartSelectModal(0, index) : null)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Draggable>
            </>
        );
    }
}

export default ChartBand;
