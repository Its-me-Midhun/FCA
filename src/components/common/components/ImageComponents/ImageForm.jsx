import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ImageManagementCaption from "../../../images/actions";
import _ from "lodash";
import Draggable from "react-draggable";
import ConfirmationModal from "../ConfirmationModal";
import Portal from "../Portal";
import Loader from "../Loader";
import CaptionChangeModal from "../../../images/components/CaptionChangeModal";
import { resetCursor, toTitleCase } from "../../../../config/utils";
import ReactTooltip from "react-tooltip";

const initialState = {
    showErrorBorder: false,
    errorMessage: "",
    initialValues: {},
    showConfirmModal: false,
    isUpdating: false,
    missingRequiredFields: false,
    image: {},
    captionSync: false,
    forceChildCaptionChange: false,
    showPrevConfirmationModal: false,
    showNextConfirmationModal: false,
    showConfirmDeleteModal: false
};
export class UploadForm extends Component {
    state = initialState;

    componentDidMount = () => {
        const { images } = this.props;
        this.setState({ image: images, captionSync: images?.description === images?.master_image?.caption || !images?.master_image?.caption }, () =>
            this.setState({ initialValues: this.state.image })
        );
    };
    componentDidUpdate = prevProps => {
        if (prevProps?.images?.id !== this.props.images?.id) {
            this.setState({ image: this.props.images }, () => this.setState({ initialValues: this.state.image }));
        }
    };

    cancelForm = () => {
        const { initialValues, image } = this.state;
        if (_.isEqual(initialValues, image)) {
            this.props.onCancel();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => this.props.onCancel()}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    handleUpdateComment = async () => {
        const { image, initialValues } = this.state;
        if (!image.description) {
            this.setState({
                isUpdating: false,
                missingRequiredFields: true
            });
            return false;
        }
        let usedImageFound = false;
        if (this.props.isReportImage) {
            usedImageFound = this.props.checkIfNarrativeImageUsed(image.id);
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
        const { image, initialValues, forceChildCaptionChange } = this.state;
        this.setState({
            isUpdating: true
        });
        // updating the global image caption
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
        await this.props.updateImage({
            id: image.id,
            description: forceChildCaptionChange ? image.master_image?.caption : image.description,
            printable: image.printable
        });
        await this.setState({
            image: {},
            isUpdating: false,
            missingRequiredFields: false,
            forceChildCaptionChange: false
        });
        this.props.onCancel();
    };

    handleDescription = async e => {
        e.preventDefault();
        const { image, captionSync } = this.state;
        const { value } = e.target;
        resetCursor(e);
        await this.setState({
            image: {
                ...image,
                description: toTitleCase(value),
                master_image: {
                    ...image.master_image,
                    caption: captionSync ? toTitleCase(value) : image.master_image?.caption
                }
            }
        });
    };
    handleGlobalCaption = async e => {
        const { image, captionSync } = this.state;
        const { value } = e.target;
        resetCursor(e);
        this.setState({
            image: {
                ...image,
                description: captionSync ? toTitleCase(value) : image.description,
                master_image: {
                    ...image.master_image,
                    caption: toTitleCase(value)
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

    confirmViewNext = async () => {
        const { handleNext } = this.props;
        const { initialValues, image } = this.state;
        if (_.isEqual(initialValues, image)) {
            await handleNext(image.id);
        } else {
            this.setState({
                showNextConfirmationModal: true
            });
        }
    };
    confirmViewPrev = async () => {
        const { handlePrev } = this.props;
        const { initialValues, image } = this.state;
        if (_.isEqual(initialValues, image)) {
            await handlePrev(image.id);
        } else {
            this.setState({
                showPrevConfirmationModal: true
            });
        }
    };
    renderNextConfirmationModal = () => {
        const { handleNext } = this.props;
        const { showNextConfirmationModal, image } = this.state;
        if (!showNextConfirmationModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showNextConfirmationModal: false })}
                        onYes={() => {
                            handleNext(image.id);
                            this.setState(initialState);
                        }}
                        cancel={() => this.setState({ showNextConfirmationModal: false })}
                    />
                }
                onCancel={() => this.setState({ showNextConfirmationModal: false })}
            />
        );
    };
    renderPrevConfirmationModal = () => {
        const { handlePrev } = this.props;
        const { showPrevConfirmationModal, image } = this.state;
        if (!showPrevConfirmationModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showPrevConfirmationModal: false })}
                        onYes={() => {
                            handlePrev(image.id);
                            this.setState(initialState);
                        }}
                        cancel={() => this.setState({ showPrevConfirmationModal: false })}
                    />
                }
                onCancel={() => this.setState({ showPrevConfirmationModal: false })}
            />
        );
    };
    // handleDelete = async id => {
    //     console.log("checkingxxxid",id)
    //     // if (this.props.isRecomentaionView) {
    //     //     await this.props.deleteImageRecomention();

    //     // } else {
    //     //     let usedImageFound = false;
    //     //     if (this.props.isReportImage) {
    //     //         usedImageFound = this.props.checkIfNarrativeImageUsed(id);
    //     //     }
    //         this.setState({
    //             showConfirmDeleteModal: true,
    //             image: { id: id }
    //         });
    //     // }
    // };

    // renderConfirmationDeleteModal = () => {
    //     const {
    //         showConfirmDeleteModal,
    //         // selectedImage: { usedImageFound },
    //     } = this.state;
    //     if (!showConfirmDeleteModal) return null;
    //     return (
    //         <Portal
    //             body={
    //                 <ConfirmationModal
    //                     heading={"Do you want to delete this Image?"}
    //                     message={
    //                         this.props.narrativeCompleted
    //                             ? "The narrative is marked as complete & this image is already used in narrative. This action will mark the narrative as incomplete."
    //                             : "This action cannot be reverted, are you sure that you need to delete this image?"
    //                     }
    //                     onNo={() => this.setState({ showConfirmDeleteModal: false })}
    //                     onYes={this.handleDeleteImage}
    //                 />
    //             }
    //             onCancel={() => this.setState({ showConfirmDeleteModal: false })}
    //         />
    //     );
    // };
    // handleDeleteImage = async () => {
    //     this.setState({  showConfirmDeleteModal: false });
    //     await this.props.deleteImage(this.state.selectedImage.id);
    //     // await this.refreshImageList();
    //     // this.setState({ isLoading: false });
    // };

    render() {
        const { image, isUpdating, missingRequiredFields, errorMessage } = this.state;
        const { onCancel, imageList, match } = this.props;
        return (
            <React.Fragment>
                {this.renderConfirmationModal()}
                {this.renderCaptionChangeConfirmationModal()}
                {this.renderNextConfirmationModal()}
                {this.renderPrevConfirmationModal()}
                {/* {this.renderConfirmationDeleteModal()} */}

                <div id="modalId" className="modal modal-region modal-img-upload" style={{ display: "block", cursor: "move" }}>
                    <ReactTooltip id="recmmendation-image-form" effect="solid" backgroundColor="#007bff" />
                    <Draggable cancel=".not-draggable">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                {/* {images?.length === 1  && ( */}
                                {match.params.tab !== "maindetails" ? (
                                    <div>
                                        <button
                                            className={`arrow-butn-left ${image?.id === imageList[0]?.id ? "cursor-diabled" : ""}`}
                                            disabled={image?.id === imageList[0]?.id}
                                            onClick={() => this.confirmViewPrev()}
                                            data-place="top"
                                            data-effect="solid"
                                            data-tip="Previous"
                                            data-for="recmmendation-image-form"
                                        >
                                            <i class="fas fa-chevron-left"></i>
                                        </button>

                                        <button
                                            class={`arrow-butn-right ${image?.id === imageList[imageList.length - 1]?.id ? "cursor-diabled" : ""}`}
                                            disabled={image?.id === imageList[imageList.length - 1]?.id}
                                            onClick={() => this.confirmViewNext()}
                                            data-place="top"
                                            data-effect="solid"
                                            data-tip="Next"
                                            data-for="recmmendation-image-form"
                                        >
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                ) : null}
                                {/* )} */}
                                <div className="modal-header">
                                    <h3>Edit Image</h3>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancel}>
                                        <span aria-hidden="true">
                                            <img src="/img/close.svg" alt="" />
                                        </span>
                                    </button>
                                </div>
                                <div className="modal-body region-otr">
                                    <div className="form-area flex-wrap">
                                        <div className="form-sec">
                                            <div className="form-group">
                                                <label>User</label>
                                                <input
                                                    disabled
                                                    type="text"
                                                    defaultValue={image?.master_image?.user?.name || ""}
                                                    className="form-control not-draggable"
                                                    placeholder="Username"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Project</label>
                                                <input
                                                    disabled
                                                    type="text"
                                                    defaultValue={image?.master_image?.project?.name || ""}
                                                    className="form-control not-draggable"
                                                    placeholder="Project"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Building</label>
                                                <input
                                                    disabled
                                                    type="text"
                                                    defaultValue={image?.master_image?.building?.name || ""}
                                                    className="form-control not-draggable"
                                                    placeholder="Building"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Trade</label>
                                                <input
                                                    disabled
                                                    type="text"
                                                    defaultValue={image?.master_image?.trade?.name || ""}
                                                    className="form-control not-draggable"
                                                    placeholder="Trade"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>System</label>
                                                <input
                                                    disabled
                                                    type="text"
                                                    defaultValue={image?.master_image?.system?.name || ""}
                                                    className="form-control not-draggable"
                                                    placeholder="System"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Sub-System</label>
                                                <input
                                                    disabled
                                                    type="text"
                                                    defaultValue={image?.master_image?.sub_system?.name || ""}
                                                    className="form-control not-draggable"
                                                    placeholder="System"
                                                />
                                            </div>

                                            <div className="form-group col-md-12 p-0">
                                                <label>Recommendation (Local) Caption</label>
                                                <textarea
                                                    className={`${
                                                        missingRequiredFields && !image.description ? "error-border" : ""
                                                    } form-control not-draggable`}
                                                    placeholder="Enter Recommendation Caption"
                                                    value={image?.description || ""}
                                                    onChange={e => this.handleDescription(e)}
                                                />
                                                <label class="container-check mt-2 mb-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={this.state.captionSync}
                                                        onChange={() => this.setState({ captionSync: !this.state.captionSync })}
                                                        className="form-control not-draggable"
                                                    />
                                                    <span class="checkmark"></span>Caption Sync
                                                </label>
                                            </div>
                                            <div className="form-group col-md-12 p-0">
                                                <label>Image Management (Global) Caption</label>
                                                <textarea
                                                    className={`form-control not-draggable`}
                                                    placeholder="Enter Image Management Caption"
                                                    value={image?.master_image?.caption || ""}
                                                    onChange={e => this.handleGlobalCaption(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="upload-area">
                                            <label className={`drag-otr cursor-pointer`} params htmlFor="attachmentFiles">
                                                <img src={image?.thumb || image?.url} alt="" />
                                                <p>{image?.name}</p>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="btnOtr">
                                        <span className="errorMessage">{errorMessage}</span>

                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btnClr not-draggable"
                                                data-dismiss="modal"
                                                onClick={this.cancelForm}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary btnDlt not-draggable"
                                                data-dismiss="modal"
                                                onClick={() => this.props.handleDelete(image.id)}
                                            >
                                                Remove
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary btnRgion not-draggable"
                                                onClick={() => this.handleUpdateComment()}
                                            >
                                                Update
                                                {isUpdating && <span className="spinner-border spinner-border-sm pl-2 ml-2" role="status"></span>}
                                            </button>
                                        </>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};
const { updateImage: updateGlobalCaption } = ImageManagementCaption;

export default withRouter(connect(mapStateToProps, { updateGlobalCaption })(UploadForm));
