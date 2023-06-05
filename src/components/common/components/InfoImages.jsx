import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

import Loader from "./Loader";
import ImagesModal from "./ImagesModal";
import Portal from "./Portal";
import ImageFullViewModal from "./ImageFullViewModal";
import { API_ROUTE } from "../../../../src/config/constants";
import LoadingOverlay from "react-loading-overlay";
import qs from "query-string";
import ReactTooltip from "react-tooltip";
import ConfirmationModal from "./ConfirmationModal";
import ImageMasterModal from "./ImageMasterModal";
import { findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose } from "../../../config/utils";
import history from "../../../config/history";
class InfoImages extends Component {
    state = {
        uploadAttachmentsHeader: "Add",
        uploadAttachment: [],
        uploadError: "",
        fileChanged: false,
        // imageList: this.props.imageList,
        showImagesModal: false,
        isLoading: true,
        showImageModal: false,
        imageList: [],
        selectedImage: "",
        showWarningModal: false,
        clickedImage: {},
        showImageMasterModal: false
    };

    componentDidMount = async () => {
        document.addEventListener("keydown", this.handleKeyPress);
        await this.refreshImageList();
    };

    componentDidUpdate = async prevProps => {
        if (
            qs.parse(prevProps.location?.search)?.narratable_id != qs.parse(this.props.location?.search)?.narratable_id ||
            prevProps.match.params?.tab != this.props.match.params?.tab
        ) {
            this.setState({ isLoading: true });
            await this.refreshImageList();
        }
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress);
    };

    refreshImageList = async () => {
        await this.props.getAllImageList(this.props.match.params.id);
        const { imageResponse } = this.props;
        let imageResult = imageResponse
            ? imageResponse.filter((img, i) => {
                  if (img.default_image) {
                      img.index = i;
                      return img;
                  }
              })
            : [];
        await this.setState({
            imageList: imageResponse,
            selectedImage: {
                image: (imageResult && imageResult[0]) || (imageResponse && imageResponse[0]),
                index: imageResult && imageResult.length ? imageResult[0].index : 0
            },
            isLoading: false
        });
    };

    handleKeyPress = e => {
        const { selectedImage, imageList, setSelectedImage } = this.state;
        if (e.keyCode === 39 || e.keyCode === 40) {
            e.preventDefault();
            this.setSelectedImage(selectedImage.index === imageList.length - 1 ? 0 : selectedImage.index + 1);
            this.scrollImageList(selectedImage.index === imageList.length - 1 ? 0 : selectedImage.index + 1);
        } else if (e.keyCode === 37 || e.keyCode === 38) {
            e.preventDefault();
            this.setSelectedImage(selectedImage.index === 0 ? imageList.length - 1 : selectedImage.index - 1);
            this.scrollImageList(selectedImage.index === 0 ? imageList.length - 1 : selectedImage.index - 1);
        }
    };

    toggleImagesModal = () => {
        this.setState({
            showImagesModal: !this.state.showImagesModal
        });
    };

    scrollElement = area => {
        area === 1 ? document.getElementById("sliderSection").scrollBy(0, -50) : document.getElementById("sliderSection").scrollBy(0, 50);
    };

    scrollImageList = id => {
        let elmnt = document.getElementById(`img_id_${id}`);

        elmnt && elmnt.scrollIntoView();
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
    setSelectedImage = async i => {
        const { imageList } = this.state;
        await this.setState({
            selectedImage: { image: imageList[i], index: i }
        });
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

    render() {
        const { isLoading } = this.state;
        const {
            imagesDetails,
            showImagesModal,
            selectedImage,
            imageList,
            setSelectedImage,
            deleteImage,
            updateImage,
            uploadImages,
            showImageMasterModal
        } = this.state;
        const {
            isBuildingLocked,
            locked,
            isDeleted = false,
            permissions,
            hasEdit = true,
            hasCreate = true,
            imagesNotUsedIds = null,
            basicDetails
        } = this.props;
        return (
            <React.Fragment>
                <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                    {this.state.showImageModal ? (
                        <Portal
                            body={<ImageFullViewModal imgSource={`${selectedImage.image.url}`} onCancel={this.closeImageModal} />}
                            onCancel={this.closeImageModal}
                        />
                    ) : null}
                    {this.renderUsedImageWarning()}
                    <div className="tab-active location-sec img-dt">
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
                                <div className="image-sec pt-3">
                            <div className={`${this.props.isReportImage ? "col-md-3" : "col-md-2"}  sld-left`}>
                                <ul id="sliderSection" className={`${imageList && imageList.length > 4 ? "slide-sec-scroll " : ""}slide-sec`}>
                                    {imageList && imageList.length ? (
                                        <div>
                                            {imageList.map((item, i) => (
                                                <li
                                                    id={`img_id_${i}`}
                                                    key={i}
                                                    onClick={() => this.setSelectedImage(i)}
                                                    className={`${
                                                        selectedImage.image && item.id === selectedImage.image.id ? "active-img " : ""
                                                    }cursor-pointer `}
                                                >
                                                    <img src={`${item.url}`} alt="" />
                                                    {this.props.noCheckbox ? (
                                                        ""
                                                    ) : this.props.isReportImage && !(hasCreate || hasEdit) ? (
                                                        ""
                                                    ) : this.props.isReportImage ? (
                                                        <div className="img-default-outer">
                                                            <label
                                                                className="container-check"
                                                                data-tip={item.printable ? "Disable in Narrative" : "Enable in Narrative"}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.printable ? "check" : ""}
                                                                    onChange={() => this.checkIfNarrativeImageUsed(item, !item.printable)}
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                            <ReactTooltip />
                                                        </div>
                                                    ) : (
                                                        <div className="img-default-outer">
                                                            <label className="container-check">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.default_image ? "check" : ""}
                                                                    onChange={() => this.defaultImageHandler(item, item.default_image ? false : true)}
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </div>
                                                    )}
                                                    {imagesNotUsedIds && !imagesNotUsedIds.includes(item.id) && item.printable ? (
                                                        <img
                                                            src="/img/check_green.svg"
                                                            className="no-recom img-ident-icon"
                                                            alt=""
                                                            data-tip={"Used"}
                                                        />
                                                    ) : (
                                                        <img
                                                            src="/img/check_green red.svg"
                                                            className="no-recom img-ident-icon"
                                                            alt=""
                                                            data-tip={"Not Used"}
                                                        />
                                                    )}
                                                </li>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <li className="no-img">
                                                <img src="/img/no-img.png" alt="" />
                                            </li>
                                            <li className="no-img">
                                                <img src="/img/no-img.png" alt="" />
                                            </li>
                                            <li className="no-img">
                                                <img src="/img/no-img.png" alt="" />
                                            </li>
                                            <li className="no-img">
                                                <img src="/img/no-img.png" alt="" />
                                            </li>
                                        </>
                                    )}
                                </ul>

                                <div className="carousel-controls">
                                    <label className="prev-slide cursor-pointer">
                                        <span>
                                            <i className="fas fa-chevron-up" onClick={() => this.scrollElement(1)}></i>
                                        </span>
                                    </label>
                                    <label className="next-slide cursor-pointer">
                                        <span>
                                            <i className="fas fa-chevron-down" onClick={() => this.scrollElement(2)}></i>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="col pr-0">
                                <div className="outer-sldr">
                                    <div className="sld-rgt">
                                        {imageList && imageList.length ? (
                                            <div className="carousel imgCrsr">
                                                <ul className="slides">
                                                    <li className="slide-container">
                                                        <div className="slide-image">
                                                            <div
                                                                className="bg-slide-img"
                                                                style={{ backgroundImage: `url(${selectedImage.image.url}` }}
                                                            ></div>
                                                            <div className="img-slde">
                                                                <img
                                                                    src={`${selectedImage.image.url}`}
                                                                    onClick={() => this.openImageModal()}
                                                                    alt=""
                                                                />
                                                            </div>
                                                            {selectedImage && selectedImage.image.description ? (
                                                                <div className="sub-cont">
                                                                    <h4>{selectedImage.image.description}</h4>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </li>
                                                    <label
                                                        className="prev-slide cursor-pointer"
                                                        onClick={() => {
                                                            this.setSelectedImage(
                                                                selectedImage.index === 0 ? imageList.length - 1 : selectedImage.index - 1
                                                            );
                                                            this.scrollImageList(
                                                                selectedImage.index === 0 ? imageList.length - 1 : selectedImage.index - 1
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            <i className="fas fa-chevron-left"></i>
                                                        </span>
                                                    </label>
                                                    <label
                                                        className="next-slide cursor-pointer"
                                                        onClick={() => {
                                                            this.setSelectedImage(
                                                                selectedImage.index === imageList.length - 1 ? 0 : selectedImage.index + 1
                                                            );
                                                            this.scrollImageList(
                                                                selectedImage.index === imageList.length - 1 ? 0 : selectedImage.index + 1
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            <i className="fas fa-chevron-right"></i>
                                                        </span>
                                                    </label>
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="no-data">
                                                <h3>Images not available please upload now</h3>
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
                                                            <button className="addLoc mr-2" onClick={() => this.toggleImagesModal()}>
                                                                Upload Image
                                                            </button>
                                                            {this.props.hasPullFromMasterImages && (
                                                                <button className="addLoc" onClick={() => this.toggleMasterImageModal()}>
                                                                    Pull Images From Gallery
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
                                <div>
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
                                            {hasEdit && (
                                                <span className="edit-icn-bx" onClick={() => this.toggleImagesModal()}>
                                                    <i className="fas fa-pencil-alt mr-1"></i> Edit
                                                </span>
                                            )}
                                            {this.props.hasPullFromMasterImages && (
                                                <span className="edit-icn-bx" onClick={() => this.toggleMasterImageModal()}>
                                                    <i className="fas fa-file-import mr-1"></i>Pull Images From Gallery
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                      
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
                                    basicDetails={basicDetails}
                                    entity={this.props.entity}
                                    handleAssignImages={this.handleAssignImages}
                                    onCancel={this.toggleMasterImageModal}
                                />
                            }
                            onCancel={() => this.toggleMasterImageModal()}
                        />
                    ) : null}
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

export default withRouter(InfoImages);
