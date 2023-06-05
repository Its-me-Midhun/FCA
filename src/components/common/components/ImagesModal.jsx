import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import ImageManagementCaption from "../../images/actions";
import ConfirmationModal from "./ConfirmationModal";
import Portal from "./Portal";
import Loader from "./Loader";
import { API_ROUTE } from "../../../../src/config/constants";
import LoadingOverlay from "react-loading-overlay";
import { toTitleCase } from "../../../config/utils";
import CaptionChangeModal from "../../images/components/CaptionChangeModal";
import { connect } from "react-redux";
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
        selectedImage: {},
        isUpdate: null,
        isDeleting: false,
        showNarrCompletedComfirmModal: false,
        captionSync: false,
        image: {},
        initialValues: {},
        forceChildCaptionChange: false
    };

    componentDidMount = () => {
        const { imageList, img_desc, isRecomentaionView } = this.props;
        // this.setState({ image : imageList});
        if (isRecomentaionView) {
            if (imageList[0] && !imageList[0].id && imageList[0].name) {
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

    deleteAttachment = async () => {
        this.setState({ isDeleting: true, showConfirmModal: false });
        await this.props.deleteImage(this.state.selectedImage.id);
        this.setState({
            tempAttachment: {},
            isUploading: false,
            missingRequiredFields: false,
            isUpdate: null
        });
        this.setState({ isDeleting: false });
    };

    handleDeleteAttachment = async id => {
        if (this.props.isRecomentaionView) {
            await this.props.deleteImageRecomention();
            this.setState({
                tempAttachment: {},
                isUpdate: null
            });
        } else {
            let usedImageFound = false;
            if (this.props.isReportImage) {
                usedImageFound = this.props.checkIfNarrativeImageUsed(id);
            }
            this.setState({
                showConfirmModal: true,
                selectedImage: { id: id, usedImageFound }
            });
        }
    };

    handleUpdateComment = async () => {
        const { tempAttachment, initialValues } = this.state;
        const { image } = tempAttachment;
        if (!tempAttachment.comments) {
            this.setState({
                isUploading: false,
                missingRequiredFields: true
            });
            return false;
        }
        let usedImageFound = false;
        if (this.props.isReportImage) {
            usedImageFound = this.props.checkIfNarrativeImageUsed(tempAttachment.id);
        }
        if (usedImageFound && this.props.narrativeCompleted) {
            this.setState({ showNarrCompletedComfirmModal: true });
        } else if (image.master_image?.caption !== initialValues.master_image?.caption) {
            this.setState({ changecaptionmodal: true });
        } else {
            await this.updateComment();
        }
    };

    updateComment = async () => {
        const { tempAttachment, forceChildCaptionChange, initialValues } = this.state;
        const { image } = tempAttachment;
        this.setState({
            isUploading: true
        });
        if (image.master_image?.caption !== initialValues.master_image?.caption) {
            let params = {
                image_ids: [image.master_image?.id],
                caption: image.master_image?.caption,
                removed_tags: [],
                tags: image.master_image?.labels?.map(tag => tag.name).filter(tag => tag) || [],
                captionchange: forceChildCaptionChange
            };
            await this.props.updateGlobalCaption(params);
        }
        if (this.props.isRecomentaionView && tempAttachment.comments) {
            this.props.handleAddImage(tempAttachment);
        } else {
            await this.props.updateImage({
                id: tempAttachment.id,
                description: forceChildCaptionChange ? image.master_image?.caption : tempAttachment.comments,
                printable: tempAttachment.printable,
                captionchange: forceChildCaptionChange
            });
        }

        await this.setState({
            tempAttachment: {},
            isUpdate: null,
            isUploading: false,
            missingRequiredFields: false,
            forceChildCaptionChange: false
        });
    };

    renderConfirmationModal = () => {
        const {
            showConfirmModal,
            selectedImage: { usedImageFound }
        } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Image?"}
                        message={
                            this.props.narrativeCompleted && usedImageFound
                                ? "The narrative is marked as complete & this image is already used in narrative. This action will mark the narrative as incomplete."
                                : "This action cannot be reverted, are you sure that you need to delete this image?"
                        }
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

    // handleDescription = e => {
    //     const { tempAttachment } = this.state;
    //     this.setState({
    //         tempAttachment: {
    //             ...tempAttachment,
    //             comments: toTitleCase(e.target.value)
    //         }
    //     });
    // };
    handleDescription = e => {
        const { tempAttachment, captionSync } = this.state;
        const { image } = tempAttachment;
        const { value } = e.target;
        if (image?.master_image?.id) {
            this.setState({
                tempAttachment: {
                    ...tempAttachment,
                    comments: toTitleCase(value),
                    image: {
                        ...image,
                        master_image: {
                            ...image.master_image,
                            caption: captionSync ? toTitleCase(value) : image.master_image?.caption
                        }
                    }
                }
            });
        } else {
            this.setState({
                tempAttachment: {
                    ...tempAttachment,
                    comments: toTitleCase(e.target.value)
                }
            });
        }
    };

    handleGlobalCaption = async e => {
        const { tempAttachment, captionSync } = this.state;
        console.log("check", captionSync);
        const { image } = tempAttachment;
        const { value } = e.target;
        this.setState({
            tempAttachment: {
                ...tempAttachment,
                comments: captionSync ? toTitleCase(value) : image.description,
                image: {
                    ...image,
                    master_image: {
                        ...image.master_image,
                        caption: toTitleCase(value)
                    }
                }
            }
        });
    };

    renderNarrCompletedConfirmationModal = () => {
        const { showNarrCompletedComfirmModal } = this.state;
        if (!showNarrCompletedComfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you really want to update this Image?"}
                        message={"This narrative is marked as completed. This action will mark the narrative as incomplete."}
                        onNo={() => this.setState({ showNarrCompletedComfirmModal: false })}
                        onYes={() => {
                            this.setState({ showNarrCompletedComfirmModal: false });
                            this.updateComment();
                        }}
                    />
                }
                onCancel={() => this.setState({ showNarrCompletedComfirmModal: false })}
            />
        );
    };

    renderCaptionChangeConfirmationModal = () => {
        const { changecaptionmodal } = this.state;
        if (!changecaptionmodal) return null;
        return (
            <Portal
                body={
                    <CaptionChangeModal
                        onCancel={() => this.setState({ changecaptionmodal: false })}
                        message={"Do you want the updated Caption pushed to ALL image Captions in recommendations with this image?"}
                        buttonNo={{ label: "No", value: "no", note: "Caption updated ONLY in Image Management Gallery" }}
                        buttonYes={{
                            label: "Yes",
                            value: "yes",
                            note: "Caption updated in Image Management Gallery AND in ALL Recommendations containing this image"
                        }}
                        hasCancelButton={true}
                        onSelection={this.onImageCaptionSelect}
                    />
                }
            />
        );
    };
    onImageCaptionSelect = async type => {
        switch (type) {
            case "no":
                await this.setState({ forceChildCaptionChange: false, changecaptionmodal: false });
                this.updateComment();
                break;
            case "yes":
                await this.setState({ forceChildCaptionChange: true, changecaptionmodal: false });
                this.updateComment();
                break;

            default:
                break;
        }
    };

    render() {
        const { tempAttachment, isUploading, missingRequiredFields, uploadError, isUpdate, isDeleting, image } = this.state;
        const { onCancel, imageList, img_desc, isRecomentaionView } = this.props;
        return (
            <React.Fragment>
                <div
                    id="modalId"
                    className={this.props.isReportImage ? "modal modal-region modal-add-img gal-image-modal" : "modal modal-region modal-add-img"}
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={onCancel}>
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <LoadingOverlay active={isDeleting} spinner={<Loader />} fadeSpeed={10}>
                                <div className="modal-body region-otr">
                                    <div className="otr-add-img">
                                        <div className="add-imges col-md-6 p-0">
                                            <h3>Add Images</h3>

                                            <div className="innr-img">
                                                <label
                                                    className={`${
                                                        missingRequiredFields && !isRecomentaionView && !tempAttachment.file ? "error-border" : ""
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
                                                        <label >Caption</label>
                                                        <textarea
                                                            className={`${
                                                                missingRequiredFields && !tempAttachment.comments ? "error-border" : ""
                                                            } form-control`}
                                                            placeholder="Enter Recommendation Caption"
                                                            value={tempAttachment.comments || ""}
                                                            onChange={e => this.handleDescription(e)}
                                                        />
                                                    </div>
                                                    {tempAttachment?.image?.master_image?.id && (
                                                        <>
                                                            <label class="container-check mt-2 mb-0 checkmark-caption ">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={this.state.captionSync}
                                                                    onChange={() => this.setState({ captionSync: !this.state.captionSync })}
                                                                    className="form-control not-draggable"
                                                                />
                                                                <span class="checkmark"></span>Caption Sync
                                                            </label>
                                                            <div className="col-md-12 formInp p-0 cmntImg">
                                                                <label>Image Management (Global) Caption</label>
                                                                <textarea
                                                                    className={`form-control not-draggable`}
                                                                    placeholder="Enter Image Management Caption"
                                                                    value={tempAttachment?.image?.master_image?.caption || ""}
                                                                    onChange={e => this.handleGlobalCaption(e)}
                                                                />
                                                            </div>
                                                        </>
                                                    )}
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
                                                                    Update
                                                                </label>
                                                            </>
                                                        )
                                                    ) : (
                                                        <label
                                                            className="custom-file-uploadd cursor-pointer"
                                                            style={{ position: "relative" }}
                                                            onClick={isRecomentaionView ? () => onCancel() : null}
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
                                                (imageList &&
                                                    imageList.length &&
                                                    isRecomentaionView &&
                                                    imageList[0].id &&
                                                    !this.state.attachmentChanged)
                                                    ? imageList.map((item, i) => (
                                                          <div
                                                              key={i}
                                                              className={`${tempAttachment.id === item.id ? "active " : ""}fl-dtl cursor-pointer`}
                                                              onClick={() =>
                                                                  this.setState({
                                                                      tempAttachment: {
                                                                          comments: isRecomentaionView ? img_desc : item.description,
                                                                          id: item.id,
                                                                          file: { name: item.name, url: `${item.url}` },
                                                                          printable: item?.printable,
                                                                          image: item
                                                                      },
                                                                      isUpdate: item.id
                                                                  })
                                                              }
                                                          >
                                                              {this.props.isReportImage ? (
                                                                  <>
                                                                      <img src={item.url} className="img-fl-dtl" />
                                                                      <div className="img-otr">
                                                                          <p className="img-nme">{item.name}</p>
                                                                          <p className="img-nme">{item.description}</p>
                                                                          <p className="img-size">{(item.size / 1024).toFixed(2)} kb</p>
                                                                      </div>
                                                                  </>
                                                              ) : (
                                                                  <>
                                                                      <img src={item.url} className="img-fl-dtl" />
                                                                      <div className="img-otr">
                                                                          <p className="img-nme">{item.name}</p>
                                                                          <p className="img-size">{(item.size / 1024).toFixed(2)} kb</p>
                                                                      </div>
                                                                  </>
                                                              )}
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
                            </LoadingOverlay>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
                {this.renderNarrCompletedConfirmationModal()}
                {this.renderCaptionChangeConfirmationModal()}
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};
const { updateImage: updateGlobalCaption } = ImageManagementCaption;
export default withRouter(connect(mapStateToProps, { updateGlobalCaption })(InfoImages));
