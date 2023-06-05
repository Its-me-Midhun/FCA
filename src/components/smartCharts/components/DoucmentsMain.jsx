import React, { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

import ImageFullViewModal from "../../common/components/ImageFullViewModal";
import Portal from "../../common/components/Portal";

const DocumentsMain = ({ userDocs = [], entity, ...props }) => {
    const [docRowConstructArray, setDocRowConstructArray] = useState([]);
    const [allUserDocs, setAllUserDocs] = useState([]);
    const [showImageViewModal, setShowImageViewModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        let tempDocRowConstructArray = [];
        if (userDocs.length) {
            let totalRows = userDocs.length / 4 + (userDocs.length % 4 ? 1 : 0);
            for (let i = 1; i <= totalRows; i++) {
                tempDocRowConstructArray.push(i);
            }
        }
        setDocRowConstructArray([...tempDocRowConstructArray]);
        setAllUserDocs([...userDocs]);
    }, [userDocs]);

    const downloadDocs = (doc, key) => {
        if (key === "images") {
            setSelectedImage(doc?.gallery_image?.image_file);
            setShowImageViewModal(true);
        } else {
            const link = document.createElement("a");
            link.href = doc.file;
            link.download = doc.file;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const renderImageFullViewModal = () => {
        if (!showImageViewModal) return null;
        return (
            <Portal
                body={<ImageFullViewModal imgSource={selectedImage} onCancel={() => setShowImageViewModal(false)} />}
                onCancel={() => setShowImageViewModal(false)}
            />
        );
    };

    return (
        <div class="card">
            <div class="card-header" id={`headingOnes${entity.dragDropKey}`}>
                <div class="icon">
                    <img src="/img/icon-squre.svg" />
                </div>
                <div
                    class="heading-text"
                    data-toggle="collapse"
                    data-target={`#collapseOnes${entity.dragDropKey}`}
                    aria-expanded="false"
                    aria-controls={`collapseOnes${entity.dragDropKey}`}
                >
                    <h3>{entity.label}</h3>
                </div>
            </div>
            <div id={`collapseOnes${entity.dragDropKey}`} class="collapse" aria-labelledby={`headingOnes${entity.dragDropKey}`}>
                <div class="card-body">
                    <div class="drag-main">
                        <div class="row m-0">
                            <div class="col-md-12 p-0">
                                {docRowConstructArray.map((dropRow, index) => (
                                    <Droppable droppableId={`${entity.dragDropKey}-document-${index}`} direction="horizontal" isDropDisabled={true}>
                                        {(provided, snapshot) => (
                                            <div class="dragble-area" ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                                                {allUserDocs.slice(index * 4, (index + 1) * 4).map((doc, i) => (
                                                    <Draggable
                                                        key={`draggable-doc${doc.id}`}
                                                        draggableId={`draggable-doc${doc.id}`}
                                                        index={index * 4 + i}
                                                    >
                                                        {(provided, snapshot) => {
                                                            return (
                                                                <>
                                                                    <div
                                                                        class="drag-item"
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        // key={`draggable-docs${i}${index}`}
                                                                        isDragging={snapshot.isDragging}
                                                                        style={provided.draggableProps.style}
                                                                    >
                                                                        <div class="top-sec">
                                                                            <div class="icon">
                                                                                <img src="/img/icon-squre.svg" />
                                                                            </div>
                                                                        </div>
                                                                        <div class="cont-sec">
                                                                            <div
                                                                                class={`icons-sec ${
                                                                                    entity.key === "images" && doc?.gallery_image?.thumbnail_file
                                                                                        ? "image-thumb-sec"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                {entity.key === "images" ? (
                                                                                    <img
                                                                                        src={
                                                                                            doc?.gallery_image?.thumbnail_file ||
                                                                                            `/img/${"smart-chart-image-item.svg"}`
                                                                                        }
                                                                                    />
                                                                                ) : (
                                                                                    <img src={`/img/file-type-standard.svg`} />
                                                                                )}
                                                                            </div>
                                                                            <h3>{doc.name || doc?.gallery_image?.caption || "-"}</h3>
                                                                        </div>
                                                                        <div class="notes-sm-chart">
                                                                            <label>Notes</label>
                                                                            <p>{doc.notes || "-"}</p>
                                                                        </div>

                                                                        <div class="fot-sec top-border">
                                                                            <div class="fot-select"></div>
                                                                            <div class="btn-area">
                                                                                <div class="icon"></div>
                                                                                <button
                                                                                    class="btn btn-conf"
                                                                                    onClick={() => downloadDocs(doc, entity.key)}
                                                                                >
                                                                                    {entity.key === "documents" ? "Download" : "View Image"}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        {provided.placeholder}
                                                                    </div>
                                                                    {snapshot.isDragging && (
                                                                        <div class="drag-item">
                                                                            <div class="top-sec">
                                                                                <div class="icon">
                                                                                    <img src="/img/icon-squre.svg" />
                                                                                </div>
                                                                            </div>
                                                                            <div class="cont-sec">
                                                                                <div class="icons-sec">
                                                                                    <img
                                                                                        src={`/img/${
                                                                                            entity.key === "images"
                                                                                                ? "smart-chart-image-item.svg"
                                                                                                : "file-type-standard.svg"
                                                                                        }`}
                                                                                    />
                                                                                </div>
                                                                                <h3>{doc.name || doc?.gallery_image?.caption || "-"}</h3>
                                                                            </div>

                                                                            <div class="notes-sm-chart">
                                                                                <label>Notes</label>
                                                                                <p>{doc.notes || "-"}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            );
                                                        }}
                                                    </Draggable>
                                                ))}
                                                {/* {provided.placeholder} */}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {renderImageFullViewModal()}
        </div>
    );
};

export default DocumentsMain;
