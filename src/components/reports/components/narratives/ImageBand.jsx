import React, { Component } from "react";
import { Draggable } from "react-beautiful-dnd";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";
import { BandTypes } from "../../constants";

class ImageBand extends Component {
    state = {
        showConfirmModal: false,
        selectedBand: {
            index: null,
            bandIndex: null
        }
    };

    confirmClearImage = (index, bandIndex) => {
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
                        message={"This action cannot be reverted, Are you sure that you need to remove this image?"}
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
                <Draggable key={index} isDragDisabled={!(hasEdit || hasCreate)} draggableId={`draggable-${index}`} index={index}>
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
                                    <h3>
                                        {item.type === BandTypes.doubleImageBand
                                            ? "Double Image Band"
                                            : item.subType === "square"
                                            ? "Image Band (Sqare)"
                                            : "Image Band (Rectangle)"}
                                    </h3>
                                    {(hasCreate || hasEdit) && (
                                        <button class="close-x" onClick={() => this.props.deleteBand(index)}>
                                            <i class="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div class="cnt-sec-hed">
                                <div class="img-se">
                                    {item.data[0] && (hasCreate || hasEdit) && (
                                        <button class="close-x" onClick={() => this.confirmClearImage(index, 0)}>
                                            <i class="fas fa-times"></i>
                                        </button>
                                    )}
                                    <div
                                        class="img-container no-img-container"
                                        onClick={() => (hasEdit || hasCreate ? this.props.openImageSelectModal(0, index) : null)}
                                    >
                                        <img
                                            className={`${item.type === BandTypes.singleImageBand && item.data[0] ? "narrative-img" : ""} ${
                                                !item.data[0] ? "gal-icn-img" : ""
                                            } ${item.subType || ""}`}
                                            src={item.data[0]?.url ?? "/img/image-photography.svg"}
                                        />
                                        <div class="img-txt">{item.data[0]?.description}</div>
                                    </div>
                                </div>
                                {item.type === BandTypes.doubleImageBand && (
                                    <div class="img-se">
                                        {item.data[1] && (hasCreate || hasEdit) && (
                                            <button class="close-x" onClick={() => this.confirmClearImage(index, 1)}>
                                                <i class="fas fa-times"></i>
                                            </button>
                                        )}
                                        <div
                                            class="img-container no-img-container"
                                            onClick={() => (hasEdit || hasCreate ? this.props.openImageSelectModal(1, index) : null)}
                                        >
                                            <img
                                                className={item.data[1] ? "" : "gal-icn-img"}
                                                src={item.data[1]?.url ?? "/img/image-photography.svg"}
                                            />
                                            <div class="img-txt">{item.data[1]?.description}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Draggable>
            </>
        );
    }
}

export default ImageBand;
