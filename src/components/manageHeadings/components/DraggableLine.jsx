import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { DraggableItem } from "./DraggableItem";

export const DraggableLine = ({ lines, list, index, deleteItem, deleteLine, handleChangeInput }) => {
    return (
        <Draggable key={list} draggableId={list} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    isDragging={snapshot.isDragging}
                    style={provided.draggableProps.style}
                >
                    <Droppable
                        key={list}
                        type={"item"}
                        droppableId={list}
                        direction="horizontal"
                        isDropDisabled={lines[list]?.length && lines[list][0].type === "row" ? true : false}
                    >
                        {(provided, snapshot) => (
                            <div
                                className={`item ${!lines[list]?.length ? "upload" : ""}`}
                                ref={provided.innerRef}
                                isDraggingOver={snapshot.isDraggingOver}
                            >
                                <button className="close-btn-itm" onClick={() => deleteLine(list)}>
                                    <img src="/img/close-icn.svg" alt="" />
                                </button>
                                {lines[list]?.length ? (
                                    lines[list].map((item, index) => (
                                        <>
                                            {item?.type === "row" ? (
                                                <div className="outer-flex-item d-flex">
                                                    <div className="inner-box">
                                                        <div class="item-txt">{item.value}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <DraggableItem
                                                    item={item}
                                                    index={index}
                                                    list={list}
                                                    handleChangeInput={handleChangeInput}
                                                    deleteItem={deleteItem}
                                                />
                                            )}
                                        </>
                                    ))
                                ) : (
                                    <div className="upload-sec">
                                        <img src="/img/drag-drop.svg" alt="" />
                                        <h3>Drop Items Here</h3>
                                    </div>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    {provided.placeholder}
                </div>
            )}
        </Draggable>
    );
};
