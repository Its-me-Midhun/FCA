import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import Loader from "../../common/components/Loader";
import { API_ROUTE } from "../../../../src/config/constants";

class InfoImages extends Component {
    state = {
        uploadAttachmentsHeader: "Add",
        uploadAttachment: [],
        tempAttachment: {},
        uploadError: "",
        fileChanged: false,
        isUploading: false,
        missingRequiredFields: false,
        isInvalidFile: false,
        showConfirmModal: false,
        selectedImage: null,
        isUpdate: null
    };

    componentDidMount = () => {
        const { imageList, img_desc, isRecomentaionView } = this.props;
        if (isRecomentaionView) {
            if (imageList[0] && !imageList[0].url && imageList[0].name) {
                this.setState({
                    attachmentChanged: true,
                    tempAttachment: { file: imageList[0], comments: img_desc }
                });
            }
        }
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleAddAttachment = e => {
        this.setState({
            uploadError: ""
        });
        if (this.isIterable(e.target.files)) {
            if (e.target.files.length) {
                this.setState({
                    uploadAttachmentsHeader: "Add"
                });
            }
            Object.values(e.target.files).map((attachment, i) => {
                let ext = attachment.name.split(".").pop();
                const acceptableExt = ["png", "jpg", "ttf", "jpeg", "svg"];
                if (acceptableExt.includes(ext.toLowerCase())) {
                    if (attachment.size < 5000000) {
                        this.setState({
                            attachmentChanged: true,
                            tempAttachment: { file: e.target.files[0], comments: "" }
                        });
                    } else {
                        this.setState({
                            uploadError: "File is too big. Files with size greater than 5MB is not allowed."
                        });
                    }
                } else {
                    this.setState({
                        attachmentChanged: false,
                        uploadError: "* Accepts images only !!!"
                    });
                }
            });
        }
    };

    deleteAttachment = () => {
        this.setState({ showConfirmModal: false });
        this.props.deleteImage(this.state.selectedImage);
        this.setState({
            tempAttachment: {},
            isUploading: false,
            missingRequiredFields: false
        });
    };

    handleDeleteAttachment = async id => {
        if (this.props.isRecomentaionView) {

            await this.props.deleteImageRecomention();
            this.setState({
                tempAttachment: {},
                isUpdate: null
            });
        } else {
            this.setState({
                showConfirmModal: true,
                selectedImage: id,

            });
        }
    };

    handleUpdateComment = async () => {
        this.setState({
            isUploading: true
        });
        const { tempAttachment } = this.state;
        if (!tempAttachment.comments) {
            this.setState({
                isUploading: false,
                missingRequiredFields: true
            });
            return false;
        }
        if (this.props.isRecomentaionView && tempAttachment.comments) {
            this.props.handleAddImage(tempAttachment);
        } else {
            await this.props.updateImage({
                id: tempAttachment.url,
                description: tempAttachment.comments
            });
        }

        await this.setState({
            tempAttachment: {},
            isUploading: false,
            missingRequiredFields: false
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Image?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteAttachment}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    addImage = async () => {
        const { handleAddImage, isRecomentaionView } = this.props;
        this.setState({
            isUploading: true
        });
        const { tempAttachment, uploadAttachment } = this.state;
        if (!(tempAttachment.file && tempAttachment.comments)) {
            this.setState({
                isUploading: false,
                missingRequiredFields: true
            });
            return false;
        }
        if (isRecomentaionView) {
            handleAddImage(tempAttachment);
            // await this.setState({
            //     uploadAttachment: [...uploadAttachment, tempAttachment],
            //     // tempAttachment: {},
            //     isUploading: false,
            //     missingRequiredFields: false
            // });
        } else {
            await this.props.uploadImages(tempAttachment);
            await this.setState({
                uploadAttachment: [...uploadAttachment, tempAttachment],
                tempAttachment: {},
                isUploading: false,
                missingRequiredFields: false
            });
        }
    };

    handleDescription = e => {
        const { tempAttachment } = this.state;
        this.setState({
            tempAttachment: {
                ...tempAttachment,
                comments: e.target.value
            }
        });
    };

    render() {
        const { tempAttachment, isUploading, missingRequiredFields, uploadError, isUpdate } = this.state;
        const { onCancel, imageList, img_desc, isRecomentaionView } = this.props;
        return (
            <React.Fragment>
                <div id="modalId" className="modal modal-region modal-add-img" style={{ display: "block" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={onCancel}>
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr">
                                <div className="otr-add-img">
                                    <div className="add-imges col-md-6 p-0">

                                        {imageList && imageList.length === 0 ? <h3>Add Image </h3> : <h3>Update Image </h3>}


                                        <div className="innr-img">
                                            <label
                                                className={`${missingRequiredFields && !isRecomentaionView && !tempAttachment.file ? "error-border" : ""
                                                    } drag-otr cursor-pointer`}
                                                params
                                                htmlFor="attachmentFiles"
                                            >
                                                {!_.isEmpty(tempAttachment) && tempAttachment.file ? (
                                                    <>
                                                        <img
                                                            src={
                                                                tempAttachment.file.url
                                                                    ? tempAttachment.file.url
                                                                    : URL.createObjectURL(tempAttachment.file)
                                                            }
                                                            alt=""
                                                        />
                                                        <p>{tempAttachment.file && tempAttachment.file.name}</p>
                                                    </>
                                                ) : (
                                                        <>
                                                            <i className={`fas fa-cloud-upload-alt`}></i>
                                                            <p>Click to upload</p>
                                                        </>
                                                    )}
                                            </label>
                                            <div className="text-center">
                                                <small className="text-danger">{uploadError}</small>
                                            </div>
                                            <div className="col-md-12 upldFile btnAddCam p-0">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="attachmentFiles"
                                                    name="profilePic"
                                                    onChange={this.handleAddAttachment}
                                                />
                                            </div>
                                            <div className="comments form-group">
                                                <div className="col-md-12 formInp p-0 cmntImg">
                                                    <label>Comments</label>
                                                    <textarea
                                                        className={`${missingRequiredFields && !tempAttachment.comments ? "error-border" : ""
                                                            } form-control`}
                                                        placeholder="Enter Comments"
                                                        value={tempAttachment.comments || ""}
                                                        onChange={e => this.handleDescription(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="upld-otr d-flex">
                                                {!isUploading ? (
                                                    !isUpdate ? (
                                                        <label className="custom-file-uploadd cursor-pointer" onClick={() => this.addImage()}>
                                                            Add Image
                                                        </label>
                                                    ) : (
                                                            <>
                                                                <label
                                                                    className="btn btn-light mr-2"
                                                                    onClick={
                                                                        isRecomentaionView
                                                                            ? () => onCancel()
                                                                            : () =>
                                                                                this.setState({
                                                                                    tempAttachment: {},
                                                                                    isUpdate: null
                                                                                })
                                                                    }
                                                                >
                                                                    Cancel
                                                            </label>
                                                                <label
                                                                    className="custom-file-uploadd cursor-pointer"
                                                                    onClick={() => this.handleUpdateComment()}
                                                                >
                                                                    Update Comment
                                                            </label>
                                                            </>
                                                        )
                                                ) : (
                                                        <label
                                                            className="custom-file-uploadd cursor-pointer"
                                                            style={{ position: "relative" }}
                                                            onClick={isRecomentaionView ? () => onCancel() : () => this.addImage()}
                                                        >
                                                            <Loader />
                                                        </label>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="upload-fle col-md-6 p-0">
                                        <h3>Uploaded Files</h3>
                                        <div className="files">
                                            {(imageList && imageList.length && !isRecomentaionView) ||
                                                (imageList && imageList.length && isRecomentaionView && imageList[0].url && !this.state.attachmentChanged)
                                                ? imageList.map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className={`${tempAttachment.url === item.url ? "active " : ""}fl-dtl cursor-pointer`}
                                                        onClick={() =>
                                                            this.setState({
                                                                tempAttachment: {
                                                                    comments: isRecomentaionView ? img_desc : item.description,
                                                                    id: item.url,
                                                                    file: { name: item.name, url: `${item.url}` }
                                                                },
                                                                isUpdate: item.url
                                                            })
                                                        }
                                                    >
                                                        <i className="fas fa-check"></i>
                                                        <div className="img-otr">
                                                            <p className="img-nme">{item.name}</p>
                                                            <p className="img-size">{(item.size / 1024).toFixed(2)} kb</p>
                                                        </div>
                                                        <i
                                                            className="fas fa-trash cursor-pointer"
                                                            onClick={() => this.handleDeleteAttachment(item.id)}
                                                        ></i>
                                                    </div>
                                                ))
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default withRouter(InfoImages);
