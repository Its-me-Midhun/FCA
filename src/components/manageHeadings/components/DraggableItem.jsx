import React from "react";
import { Draggable } from "react-beautiful-dnd";

export const DraggableItem = ({ item, index, deleteItem, list, handleChangeInput }) => {
    return (
        <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
                <>
                    <div
                        className="outer-flex-item d-flex"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        isDragginKioskg={snapshot.isDragging}
                        style={provided.draggableProps.style}
                        {...provided.dragHandleProps}
                    >
                        {item.type === "input" ? (
                            <div className="inner-box">
                                <div class="item-txt">
                                    <input
                                        type="text"
                                        value={item.value}
                                        disabled={item.type !== "input"}
                                        className="form-control"
                                        placeholder="Type here"
                                        onChange={e => handleChangeInput(e, list, index)}
                                    />
                                    <button class="close-btn-icn" onClick={() => deleteItem(list, index)}>
                                        <img src="/img/close.svg" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="inner-box">
                                <div class="item-txt">
                                    {item.value}
                                    <button class="close-btn-icn" onClick={() => deleteItem(list, index)}>
                                        <img src="/img/close.svg" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {provided.placeholder}
                </>
            )}
        </Draggable>
    );
};
