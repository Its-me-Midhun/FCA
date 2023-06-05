import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import actions from "../actions";
import { reorderArray } from "../../../config/utils";

const ImageListForBandModal = ({
    onCancel,
    selectedClient,
    getUploadedImageList,
    setSmartChartData,
    configData = {},
    isView = false,
    isTemplateView = false,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [imageRowConstructArray, setImageRowConstructArray] = useState([]);

    useEffect(() => {
        if (isView && isTemplateView) {
            getUploadedImageList({ client_id: selectedClient, is_image: true });
        }
        if (configData?.selectedChartConfig?.data?.length && !isView) {
            let selectedImageIds = configData.selectedChartConfig.data.map(img => img.id) || [];
            setSelectedImages([...selectedImageIds]);
        }
    }, []);

    useEffect(() => {
        let allImages = props.smartChartReducer.uploadedImageListResponse?.data || [];
        if (allImages?.length) {
            if (isView) {
                let selectedImagList = configData?.selectedChartConfig?.data || [];
                let selectedImagIdList = selectedImagList.map(img => img.id);
                let filteredImages = allImages.filter(img => selectedImagIdList.includes(img.id));
                allImages = filteredImages.slice().sort((a, b) => selectedImagIdList.indexOf(a.id) - selectedImagIdList.indexOf(b.id));
            }
            let tempImageRowConstructArray = [];
            let totalRows = allImages.length / 4 + (allImages.length % 4 ? 1 : 0);
            for (let i = 1; i <= totalRows; i++) {
                tempImageRowConstructArray.push(i);
            }
            setImageRowConstructArray([...tempImageRowConstructArray]);
            setImageList([...allImages]);
        }
    }, [props.smartChartReducer.uploadedImageListResponse]);

    const handleSelectImages = imageId => {
        let tempSelectedImages = [...selectedImages];
        if (tempSelectedImages.includes(imageId)) {
            tempSelectedImages = tempSelectedImages.filter(img => img !== imageId);
        } else {
            tempSelectedImages.push(imageId);
        }
        setSelectedImages(prevSelectedImages => {
            return [...tempSelectedImages];
        });
    };

    const saveImagesForBand = () => {
        let updatesImageIdsForBand = selectedImages.map(img => {
            return { id: img };
        });
        setSmartChartData("config_image_band", {
            ...configData,
            imageBandConfig: { data: [...updatesImageIdsForBand] }
        });
        onCancel();
    };

    const handleSelectAll = (isUnselect = false) => {
        if (isUnselect) {
            setSelectedImages([]);
        } else {
            let allImages = props.smartChartReducer?.uploadedImageListResponse?.data || [];
            let allImagIds = allImages.map(img => img.id);
            setSelectedImages([...allImagIds]);
        }
    };

    const onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        let reOrderedImages = reorderArray([...imageList], result.source.index, result.destination.index);
        setImageList([...reOrderedImages]);
        let updatedImageData = reOrderedImages.map(img => {
            return { id: img.id };
        });
        setSmartChartData("config_image_band", {
            ...configData,
            imageBandConfig: { data: [...updatedImageData] }
        });
    };

    return (
        <div class="modal modal-region smart-chart-popup smart-dtl-pop add-image-modal" id="modalId" tabindex="-1" style={{ display: "block" }}>
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <div class="txt-hed">{isView ? "Selected Images" : "Select Images"}</div>
                            <div class="btn-mod-headotr">
                                {!isView ? (
                                    <div class="checkbox">
                                        <label class="container-check green-check">
                                            <input
                                                type="checkbox"
                                                name="is_bold"
                                                checked={selectedImages.length === imageList.length}
                                                onClick={e => handleSelectAll(!e.target.checked)}
                                            />
                                            <span class="checkmark"></span>
                                        </label>
                                        Select All Images
                                    </div>
                                ) : null}
                            </div>
                        </h5>
                        <button type="button" class="close" onClick={() => onCancel()}>
                            <span aria-hidden="true">
                                <img src="/img/close.svg" alt="" />
                            </span>
                        </button>
                    </div>
                    <div class="modal-body region-otr">
                        <DragDropContext onDragEnd={onDragEnd}>
                            {imageRowConstructArray.map((dropRow, index) => (
                                <Droppable
                                    droppableId={`selected-images-document-${index}`}
                                    direction="horizontal"
                                    isDropDisabled={isTemplateView || !isView}
                                >
                                    {(provided, snapshot) => (
                                        <div class="images-list col-12" ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                                            {imageList.slice(index * 4, (index + 1) * 4).map((imageItem, i) => (
                                                <Draggable
                                                    key={`draggable-selected-img${imageItem.id}`}
                                                    draggableId={`draggable-selected-img${imageItem.id}`}
                                                    index={index * 4 + i}
                                                    isDragDisabled={isTemplateView || !isView}
                                                >
                                                    {(provided, snapshot) => {
                                                        return (
                                                            <div
                                                                class="images-bx-out col-md-3"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                key={`draggable-${i}`}
                                                            >
                                                                <div class="img-out-section">
                                                                    <div class="img-list-out">
                                                                        {!isView ? (
                                                                            <div class="checkbox">
                                                                                <label class="container-check">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name="is_bold"
                                                                                        checked={selectedImages.includes(imageItem.id)}
                                                                                        onClick={() => handleSelectImages(imageItem.id)}
                                                                                    />
                                                                                    <span class="checkmark"></span>
                                                                                </label>
                                                                            </div>
                                                                        ) : null}
                                                                        <img src={imageItem.gallery_image?.image_file} />
                                                                    </div>
                                                                    <div class="dtl-out-txt">
                                                                        <h3>{imageItem.name || "-"}</h3>
                                                                        <div class="notes-otr">
                                                                            <label>Notes</label>
                                                                            <p class="notes-txt">{imageItem.notes || "-"}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div class="footer-txt">
                                                                        <div class="ftr-dt">
                                                                            <label>Uploaded By</label>
                                                                            <p class="txt-ftr">{imageItem.user || "-"}</p>
                                                                        </div>
                                                                        <div class="ftr-dt">
                                                                            <label>Uploaded On</label>
                                                                            <p class="txt-ftr">
                                                                                {imageItem.created_at
                                                                                    ? moment(imageItem.created_at).format("MM-DD-YYYY h:mm A")
                                                                                    : "-"}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {provided.placeholder}
                                                            </div>
                                                        );
                                                    }}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </DragDropContext>
                    </div>
                    <div class="modal-footer">
                        <div class="footer-otr">
                            <div class="count-tr">
                                <span class="drk-bl">Total selected images</span>
                                <span class="bl-txt">{isView ? imageList.length : selectedImages.length}</span>
                            </div>
                            {!isView ? (
                                <div class="btn-otrr">
                                    <button class="btn-img-rpt" onClick={() => saveImagesForBand()}>
                                        Select Images for Report
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    const { smartChartReducer } = state;
    return { smartChartReducer };
};

export default connect(mapStateToProps, { ...actions })(ImageListForBandModal);
