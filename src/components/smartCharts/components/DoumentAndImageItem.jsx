import React from "react";
import moment from "moment";

const DocumentAndImageItem = ({
    doc,
    index,
    uploadOrEditDocument,
    handleDeleteUserDocs,
    downloadDocs,
    provided,
    isImage,
    tabName,
    viewImage,
    ...props
}) => {
    return (
        <div class="drag-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={`draggable-${index}`}>
            <div class="top-sec">
                <div class="icon">
                    <img src="/img/icon-squre.svg" alt="" />
                </div>
                <div class="right-smchart-sec d-flex">
                    <div
                        class="del-icn mr-2 edit-icon"
                        data-tip={tabName === "Image" ? "Edit Image Caption" : `Edit ${tabName} Name`}
                        data-for="table-top-icons-grid"
                        onClick={() => uploadOrEditDocument(doc)}
                    >
                        <img src="/img/edit-pen-icon.svg" alt="" />
                    </div>
                    <div
                        class="del-icn mr-2 edit-icon"
                        data-tip={`Delete ${tabName}`}
                        data-for="table-top-icons-grid"
                        onClick={() => handleDeleteUserDocs(doc.id)}
                    >
                        <img src="/img/delete-sm-chrt.svg" alt="" />
                    </div>
                    {!isImage ? (
                        <div
                            class="del-icn mr-2 edit-icon"
                            data-tip="Download Document"
                            data-for="table-top-icons-grid"
                            onClick={() => downloadDocs(doc.file)}
                        >
                            <img src="/img/download.svg" alt="" />
                        </div>
                    ) : null}
                </div>
            </div>
            {isImage && doc.is_image ? (
                <div class="cont-sec flex-wrap flex-column">
                    <div class="img-sec" onClick={() => viewImage(doc?.gallery_image?.image_file)}>
                        <img src={doc?.gallery_image?.image_file} alt="" />
                    </div>
                    <div class="img-name">{doc.name || doc?.gallery_image?.caption || "-"}</div>
                </div>
            ) : (
                <div class="cont-sec">
                    <div class="icons-sec">
                        <img src="/img/file-type-standard.svg" alt="" />
                    </div>
                    <h3>{doc.name || "-"}</h3>
                </div>
            )}
            <div class="notes-cont">
                <label>Notes</label>
                <div class="content-dtl">{doc.notes || "-"}</div>
            </div>
            <div class="fot-sec top-border mt-0">
                <div class="fot-select">
                    <label>Uploaded By</label>
                    <div class="upl-cont">{doc.user || "-"}</div>
                </div>
                <div class="fot-select">
                    <label>Uploaded On</label>
                    <div class="upl-cont">{doc.created_at ? moment(doc.created_at).format("MM-DD-YYYY h:mm A") : "-"}</div>
                </div>
            </div>
            {provided.placeholder}
        </div>
    );
};
export default DocumentAndImageItem;
