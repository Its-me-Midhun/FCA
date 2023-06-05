import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import Loader from "./Loader";
import ImagesModal from "./ImagesModal";
import Portal from "./Portal";
import ImageViewInfo from "./ImageComponents/ImageViewModal";
import LoadingOverlay from "react-loading-overlay";
import qs from "query-string";
import ConfirmationModal from "./ConfirmationModal";
import ImageMasterModal from "./ImageMasterModal";
import { findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose } from "../../../config/utils";
import history from "../../../config/history";
import Imagemain from "./ImageComponents/ImageMain";
import SingleImageUpdateModal from "./ImageComponents/SingleImageUpdateModal";
import ImageForm from "./ImageComponents/ImageForm";
class InfoImages extends Component {
    state = {
        uploadAttachmentsHeader: "Add",
        uploadAttachment: [],
        uploadError: "",
        fileChanged: false,
        showImagesModal: false,
        isLoading: true,
        showImageModal: false,
        imageList: [],
        selectedImage: "",
        showWarningModal: false,
        clickedImage: {},
        showImageMasterModal: false,
        totalCount: 0,
        imageParams: {
            limit: 40,
            offset: 1
        },
        hasMore: false,
        showSingleImageEditModal: false,
        showConfirmModal: false
    };

    componentDidMount = async () => {
        await this.refreshImageList();
    };

    componentDidUpdate = async prevProps => {
        if (
            qs.parse(prevProps.location?.search)?.narratable_id !== qs.parse(this.props.location?.search)?.narratable_id ||
            prevProps.match.params?.tab !== this.props.match.params?.tab ||
            prevProps.match.params?.id !== this.props.match.params.id
        ) {
            await this.refreshImageList();
        }
    };

    refreshImageList = async (isFetchMore = false) => {
        if (!isFetchMore) {
            await this.setState({ isLoading: true, hasMore: false, imageParams: { ...this.state.imageParams, offset: 1 } });
        }
        const { imageParams } = this.state;
        await this.props.getAllImageList(this.props.match.params.id, imageParams);
        const {
            imageResponse: { images, count }
        } = this.props;
        await this.setState({
            imageList: isFetchMore ? [...this.state.imageList, ...images] : images,
            totalCount: count,
            isLoading: false
        });
        this.setState({ hasMore: this.state.imageList?.length >= count ? false : true });
    };

    fetchMoreImages = () => {
        const { imageParams } = this.state;
        this.setState(
            {
                imageParams: { ...imageParams, offset: imageParams.offset + 1 }
            },
            () => this.refreshImageList(true)
        );
    };

    handleLimitChange = value => {
        this.setState(
            {
                imageParams: {
                    ...this.state.imageParams,
                    offset: 1,
                    limit: value
                }
            },
            () => {
                this.refreshImageList();
            }
        );
    };

    toggleImagesModal = () => {
        this.setState({
            showImagesModal: !this.state.showImagesModal
        });
    };

    defaultImageHandler = async (item, state) => {
        this.setState({
            isLoading: true
        });
        const param = {
            id: item.id,
            description: item.description,
            default: state
        };
        await this.updateImage(param);
    };

    setPrintableImage = async (item, state) => {
        this.setState({
            isLoading: true
        });
        const param = {
            id: item.id,
            description: item.description,
            printable: state
        };
        await this.updateImage(param);
    };

    checkIfNarrativeImageUsed = (item, state) => {
        if (state === true) {
            this.setPrintableImage(item, state);
        } else {
            let usedImgFound = false;
            let narrativeCompleted = false;
            if (this.props.isReportImage) {
                usedImgFound = this.props.checkIfNarrativeImageUsed(item.id);
                narrativeCompleted = this.props.narrativeCompleted;
            }
            if (usedImgFound) {
                this.setState({ clickedImage: { item, state, narrativeCompleted }, showWarningModal: true });
            } else {
                this.setPrintableImage(item, state);
            }
        }
    };

    openImageModal = () => {
        this.setState({
            showImageModal: true
        });
    };

    closeImageModal = () => {
        this.setState({
            showImageModal: false
        });
    };
    uploadImages = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.uploadImages(imageData);
        await this.refreshImageList();
    };

    deleteImage = async imageId => {
        this.setState({
            isloading: true
        });
        await this.props.deleteImage(imageId);
        await this.refreshImageList();
    };

    handleAssignImages = async imgData => {
        this.setState({
            isloading: true
        });
        let res = await this.props.handleAssignImagesFromMaster(imgData);
        await this.refreshImageList();
        if (res?.success) {
            this.setState(
                {
                    alertMessage: res.message
                },
                () => this.showAlert()
            );
        }
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

    updateImage = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.updateImageComment(imageData);
        await this.refreshImageList();
        if (this.props.refreshinfoDetails) {
            await this.props.refreshinfoDetails();
        }
    };
    setSelectedImage = async img => {
        this.setState(
            {
                selectedImage: img
            },
            () => this.openImageModal()
        );
    };

    renderUsedImageWarning = () => {
        const {
            showWarningModal,
            clickedImage: { item, state, narrativeCompleted }
        } = this.state;
        if (!showWarningModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you really want to disable ?"}
                        message={
                            narrativeCompleted
                                ? `The narrative is marked as complete & the image is already used in narrative. Disabled image will be removed from the narrative & this action will mark the narrative as incomplete.`
                                : "This image is already used in narrative, Disabled image will be removed from the narrative."
                        }
                        onNo={() => this.setState({ showWarningModal: false })}
                        onYes={() => {
                            this.setState({ showWarningModal: false });
                            this.setPrintableImage(item, state);
                        }}
                    />
                }
                onCancel={() => this.setState({ showWarningModal: false })}
            />
        );
    };

    toggleMasterImageModal = () => {
        this.setState({
            showImageMasterModal: !this.state.showImageMasterModal
        });
    };

    handleEdit = async item => {
        await this.setState({
            showSingleImageEditModal: true,
            selectedImage: item
        });
    };

    handleNext = id => {
        let current_index = this.state.imageList?.findIndex(item => item.id === id);
        let selectedImage = this.state.imageList[current_index + 1];
        this.setSelectedImage(selectedImage);
    };
    handlePrev = id => {
        let current_index = this.state.imageList?.findIndex(item => item.id === id);
        let selectedImage = this.state.imageList[current_index - 1];
        this.setSelectedImage(selectedImage);
    };

    handleNextForm = id => {
        let current_index = this.state.imageList?.findIndex(item => item.id === id);
        let selectedImage = this.state.imageList[current_index + 1];

        this.handleEdit(selectedImage);
    };
    handlePrevForm = id => {
        let current_index = this.state.imageList?.findIndex(item => item.id === id);
        let selectedImage = this.state.imageList[current_index - 1];
        this.handleEdit(selectedImage);
    };
    handleDelete = async id => {
        if (this.props.isRecomentaionView) {
            await this.props.deleteImageRecomention();
        } else {
            let usedImageFound = false;
            if (this.props.isReportImage) {
                usedImageFound = this.checkIfNarrativeImageUsed(id);
            }
            this.setState({
                showConfirmModal: true,
                selectedImage: { id: id, usedImageFound }
            });
        }
    };
    renderConfirmationModal = () => {
        const {
            showConfirmModal,
            selectedImage: { usedImageFound },
            narrativeCompleted
        } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to remove this image from this recommendation?"}
                        message={
                            narrativeCompleted && usedImageFound
                                ? "The narrative is marked as complete & this image is already used in narrative. This action will mark the narrative as incomplete."
                                : "This action cannot be reverted, are you sure that you need to remove this image?"
                        }
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.handleDeleteImage}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };
    handleDeleteImage = async () => {
        this.setState({ isLoading: true, showConfirmModal: false, showSingleImageEditModal: false });
        await this.props.deleteImage(this.state.selectedImage.id);
        await this.refreshImageList();
        this.setState({ isLoading: false });
    };

    handleInputCaptionData = async caption => {
        let caption_id = caption?.id;
        if (caption_id) {
            this.setState(prevState => {
                const imageList = prevState.imageList.map(item => {
                    if (item.id === caption_id) {
                        item.description = caption?.description;
                        return item;
                    } else return item;
                });
                // const selectedImage = prevState.selectedImage.map(item => {
                //     if (item.id === caption_id) {
                //         item.description = caption?.description;
                //         return item;
                //     } else return item;
                // });
                return { imageList };
            });
        }
    };

    render() {
        const { isLoading } = this.state;

        const {
            imagesDetails,
            showImagesModal,
            selectedImage,
            imageList,
            showImageMasterModal,
            imageParams,
            totalCount,
            hasMore,
            showSingleImageEditModal
        } = this.state;
        const {
            isBuildingLocked,
            locked,
            isDeleted = false,
            hasEdit = true,
            hasDelete = true,
            hasCreate = true,
            imagesNotUsed = [],
            basicDetails
        } = this.props;
        let imagesNotUsedIds = imagesNotUsed.map(img => img.id);

        return (
            <React.Fragment>
                <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                    {this.state.showImageModal ? (
                        <Portal
                            body={
                                <ImageViewInfo
                                    imageList={imageList}
                                    image={selectedImage}
                                    handleEdit={this.handleEdit}
                                    onCancel={this.closeImageModal}
                                    handleNext={this.handleNext}
                                    handlePrev={this.handlePrev}
                                    handleInputCaptionData={this.handleInputCaptionData}
                                    updateImageFromInfo1={this.updateImage}
                                />
                            }
                            onCancel={this.closeImageModal}
                        />
                    ) : null}

                    {this.renderUsedImageWarning()}
                    {this.renderConfirmationModal()}
                    <div className="tab-active location-sec img-dt images-overlay flex-column">
                        {isBuildingLocked === true || locked === true || isDeleted || (this.props.isRecommendation && !this.props.noCheckbox) ? (
                            ""
                        ) : this.props.noCheckbox ? (
                            <div className="otr-edit-delte col-md-12 text-right ed-dl view-narrative-report">
                                <span className="edit-icn-bx">
                                    <div className="edit-icn-bx text-right image-edit">
                                        <span onClick={this.props.closeInfoPage}>
                                            <i className="fas fa-window-close"></i> Close
                                        </span>
                                    </div>
                                </span>
                            </div>
                        ) : this.props.isReportImage ? (
                            <>
                                {imageList.length > 0 && (hasCreate || hasEdit) && (
                                    <div className="otr-edit-delte col-md-12 text-right ed-dl view-narrative-report">
                                        <span className="edit-icn-bx">
                                            <div className="edit-icn-bx text-right image-edit">
                                                <span className="mr-2" onClick={() => this.toggleImagesModal()}>
                                                    <i className="fas fa-pencil-alt"></i> Edit
                                                </span>
                                                <span onClick={() => this.toggleMasterImageModal()}>
                                                    <i className="fas fa-file-import"></i> Pull Images From Gallery
                                                </span>
                                            </div>
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div class="btn-edit-otr btn-main-outr">
                                <div className="text-label">
                                    {basicDetails?.description && <label>Recommendation: {basicDetails?.description || "-"}</label>}
                                </div>
                                <div className="image-wrapper-btn-icon">
                                    <span
                                        className="edit-icn-bx"
                                        onClick={() => {
                                            popBreadCrumpOnPageClose();
                                            history.push(findPrevPathFromBreadCrumpData());
                                        }}
                                    >
                                        <i className="fas fa-window-close mr-1"></i>Close
                                    </span>
                                    {imageList?.length > 0 && (
                                        <>
                                            {/* {hasEdit && (
                                                <span className="edit-icn-bx" onClick={() => this.toggleImagesModal()}>
                                                    <i className="fas fa-pencil-alt mr-1"></i> Edit
                                                </span>
                                            )} */}
                                            {this.props.hasPullFromMasterImages && (
                                                <span className="edit-icn-bx" onClick={() => this.toggleMasterImageModal()}>
                                                    <i className="fas fa-file-import mr-1"></i>Assign From Gallery/ Upload New Images
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="image-sec pt-3">
                            <div className="col">
                                <div className="outer-sldr">
                                    <div className="sld-rgt">
                                        {imageList && imageList.length ? (
                                            <Imagemain
                                                imageList={imageList}
                                                imageParams={imageParams}
                                                totalCount={totalCount}
                                                handleSelectImage={this.defaultImageHandler}
                                                handleClickImage={this.setSelectedImage}
                                                fetchMoreImages={this.fetchMoreImages}
                                                handleLimitChange={this.handleLimitChange}
                                                hasCheckBox={
                                                    this.props.noCheckbox || (this.props.isReportImage && !(hasCreate || hasEdit)) ? false : true
                                                }
                                                isReportImage={this.props.isReportImage}
                                                hasViewRecom={this.props.isReportImage && this.props.isRecommendation}
                                                checkIfNarrativeImageUsed={this.checkIfNarrativeImageUsed}
                                                imagesNotUsedIds={imagesNotUsedIds}
                                                hasMore={hasMore}
                                                viewRecommendations={this.props.showInfoPage}
                                                hasEdit={(this.props.isReportImage && this.props.isRecommendation) || hasEdit}
                                                handleEdit={this.handleEdit}
                                                handleDelete={this.handleDelete}
                                                hasDelete={(this.props.isReportImage && this.props.isRecommendation) || hasDelete}
                                                updateImage={this.updateImage}
                                                handleInputCaptionData={this.handleInputCaptionData}
                                            />
                                        ) : (
                                            <div className="no-data">
                                                <h3>Images not Available. Please Assign/Upload New Images</h3>
                                                {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
                                                {locked === true || isBuildingLocked === true || isDeleted || this.props.isRecommendation ? (
                                                    ""
                                                ) : this.props.isReportImage ? (
                                                    <>
                                                        {(hasCreate || hasEdit) && (
                                                            <div class="btn-sec-otr d-flex">
                                                                <button className="addLoc mr-2" onClick={() => this.toggleImagesModal()}>
                                                                    Upload Image
                                                                </button>
                                                                {this.props.hasPullFromMasterImages && (
                                                                    <button className="addLoc " onClick={() => this.toggleMasterImageModal()}>
                                                                        Pull Images From Gallery
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    hasEdit &&
                                                    hasCreate && (
                                                        <div class="btn-sec-otr d-flex">
                                                            {!this.props.hasPullFromMasterImages ? (
                                                                <button className="addLoc mr-2" onClick={() => this.toggleImagesModal()}>
                                                                    Upload Image
                                                                </button>
                                                            ) : (
                                                                <button className="addLoc" onClick={() => this.toggleMasterImageModal()}>
                                                                    Assign From Gallery/ Upload New Images
                                                                </button>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showImagesModal ? (
                        <Portal
                            body={
                                <ImagesModal
                                    uploadImages={this.uploadImages}
                                    deleteImage={this.deleteImage}
                                    updateImage={this.updateImage}
                                    imageList={imageList}
                                    locationDetails={imagesDetails}
                                    onCancel={() => this.toggleImagesModal()}
                                    isReportImage={this.props.isReportImage}
                                    narrativeCompleted={this.props.narrativeCompleted}
                                    checkIfNarrativeImageUsed={this.props.checkIfNarrativeImageUsed}
                                />
                            }
                            onCancel={() => this.toggleImagesModal()}
                        />
                    ) : null}
                    {showImageMasterModal ? (
                        <Portal
                            body={
                                <ImageMasterModal
                                    AssetName={basicDetails?.asset?.asset_name}
                                    basicDetails={basicDetails}
                                    entity={this.props.entity}
                                    handleAssignImages={this.handleAssignImages}
                                    onCancel={this.toggleMasterImageModal}
                                />
                            }
                            onCancel={() => this.toggleMasterImageModal()}
                        />
                    ) : null}
                    {showSingleImageEditModal ? (
                        <>
                            {this.props.match.params?.section === "recommendationsinfo" ? (
                                <Portal
                                    body={
                                        <ImageForm
                                            handlePrev={this.handlePrevForm}
                                            handleNext={this.handleNextForm}
                                            imageList={imageList}
                                            images={this.state.selectedImage}
                                            isReportImage={this.props.isReportImage}
                                            narrativeCompleted={this.props.narrativeCompleted}
                                            updateImage={this.updateImage}
                                            checkIfNarrativeImageUsed={this.props.checkIfNarrativeImageUsed}
                                            onCancel={() => this.setState({ showSingleImageEditModal: false })}
                                            handleDelete={this.handleDelete}
                                        />
                                    }
                                    onCancel={() => this.setState({ showSingleImageEditModal: false })}
                                />
                            ) : (
                                <Portal
                                    body={
                                        <SingleImageUpdateModal
                                            image={this.state.selectedImage}
                                            isReportImage={this.props.isReportImage}
                                            narrativeCompleted={this.props.narrativeCompleted}
                                            updateImage={this.updateImage}
                                            checkIfNarrativeImageUsed={this.props.checkIfNarrativeImageUsed}
                                            onCancel={() => this.setState({ showSingleImageEditModal: false })}
                                        />
                                    }
                                    onCancel={() => this.setState({ showSingleImageEditModal: false })}
                                />
                            )}
                        </>
                    ) : null}
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

export default withRouter(InfoImages);
