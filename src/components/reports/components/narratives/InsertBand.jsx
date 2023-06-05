import React, { Component } from "react";
import { Draggable } from "react-beautiful-dnd";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";
import { BandTypes } from "../../constants";

class InsertBand extends Component {
    render() {
        const { index, item, hasEdit, hasCreate } = this.props;
        return (
            <>
                {/* {this.renderConfirmationModal()} */}
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
                                    <h3>Table Band</h3>
                                    {(hasEdit || hasCreate) && (
                                        <button class="close-x" onClick={() => this.props.deleteBand(index)}>
                                            <i class="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div class="cnt-sec-hed">
                                <div class="img-se">
                                    {/* {item.data[0] && (
                                        <button class="close-x" onClick={() => this.confirmClearImage(index, 0)}>
                                            <i class="fas fa-times"></i>
                                        </button>
                                    )} */}
                                    <div
                                        class="img-container no-img-container"
                                        onClick={() => (hasCreate || hasEdit ? this.props.openImageSelectModal(0, index) : null)}
                                    >
                                        <img
                                            className={`${item?.data[0] ? "narrative-img" : "gal-icn-img"}`}
                                            src={item?.data[0]?.url ?? "/img/table 1.svg"}
                                            alt=""
                                        />
                                        <div class="img-txt">{item?.data[0]?.description}</div>
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

export default InsertBand;
