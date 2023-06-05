import React, { useCallback, useState } from "react";
import { useRef } from "react";
import { ProgressBar } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import actions from "../actions";

import folderIcon from "../../../assets/img/folder-open.svg";
import { connect } from "react-redux";
import moment from "moment";

export const UploadContainer = props => {
    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        props.handleFileInput(acceptedFiles, fileRejections);
    }, []);

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "svg", "heic"];

    const imageValidator = file => {
        const extension = file?.name?.split(".")?.pop()?.toLowerCase();
        if (!imageExtensions.includes(extension)) {
            return {
                message: `Non-image file`
            };
        }
        return null;
    };
    const { getRootProps, getInputProps } = useDropzone({ onDrop, validator: imageValidator, maxFiles: props.isAssignView ? 10 : 0 });
    const { filesCount, selectedImages, uploadedFiles, uploadProgress, setRotate, rotate } = props;

    return (
        <>
            {props.isEdit ? (
                <>
                    {selectedImages?.length === 1 ? (
                        <>
                            <img
                                src={
                                    selectedImages[0]?.is_edited
                                        ? `${selectedImages[0]?.s3_eimage_key}?${moment(selectedImages[0]?.updated_at).format()}`
                                        : `${selectedImages[0]?.s3_image_key}?${moment(selectedImages[0]?.updated_at).format()}`
                                }
                                alt=""
                                style={{ transform: `rotate(${rotate}deg)` }}
                            />
                            {!selectedImages[0]?.is_edited ? (
                                <button className="btn btn-rotate-blue" onClick={setRotate}>
                                    <i class="fas fa-sync-alt"></i> Rotate
                                </button>
                            ) : null}
                        </>
                    ) : (
                        <div className="upload-sec">
                            <div class="imge-pre">
                                <img src={folderIcon} alt="" />
                                {props.filesCount ? <h4>Selected Images : {props.filesCount}</h4> : null}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="upload-sec cursor-hand" {...getRootProps()}>
                    {props.isUploading ? (
                        <div className="imge-loading">
                            <ProgressBar animated now={uploadProgress} label={`${uploadProgress}%`} />
                            <div className="count-progress"> {`${props.uploadedFiles.imagesCount}/${filesCount} `}</div>
                        </div>
                    ) : (
                        <>
                            <input type="file" {...getInputProps()} />
                            <div class="imge-pre">
                                <img src={folderIcon} />
                                {!props.isEdit && (
                                    <h4>
                                        Click here to select Files or Folders from your machine
                                        <br /> OR <br /> Drag & Drop your Files or Folders here
                                    </h4>
                                )}
                                {props.filesCount ? <h4>Selected Images : {props.filesCount}</h4> : null}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};
let { rotateImages } = actions;
export default React.memo(connect(mapStateToProps, { rotateImages })(UploadContainer));
