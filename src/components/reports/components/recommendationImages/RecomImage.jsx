import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import Loader from "../../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import ReactTooltip from "react-tooltip";
import ImageFullViewModal from "../../../common/components/ImageFullViewModal";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";

class RecomImage extends Component {
    state = {
        showImageFullViewModal: false,
        showWarningModal: false,
        selectedImage: {},
        stateLoading: false,
        narrCompletedWarning: false
    };

    componentDidMount = async () => {
        document.addEventListener("keydown", this.handleKeyPress);
    };
    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress);
    };

    scrollElement = area => {
        area === 1 ? document.getElementById("sliderSection").scrollBy(0, -50) : document.getElementById("sliderSection").scrollBy(0, 50);
    };

    setPrintableImage = async (item, state) => {
        const param = {
            id: item.id,
            printable: state
        };
        await this.updateImage(param);
    };

    checkIfNarrativeImageUsed = (item, state) => {
        if (state === true) {
            this.setPrintableImage(item, state);
        } else {
            let usedImgFound = this.props.checkIfNarrativeImageUsed(item.id);
            if (usedImgFound) {
                this.setState({ selectedImage: { item, state, narrativeCompleted: this.props.narrativeCompleted }, showWarningModal: true });
            } else {
                this.setPrintableImage(item, state);
            }
        }
    };

    updateImage = async imageData => {
        this.setState({ stateLoading: true });
        await this.props.updateImageComment(imageData);
        await this.props.refreshImageList();
        this.setState({ stateLoading: false });
    };

    toggleImageFullViewModal = () => {
        this.setState({ showImageFullViewModal: !this.state.showImageFullViewModal });
    };

    renderUsedImageWarning = () => {
        const {
            showWarningModal,
            selectedImage: { item, state, narrativeCompleted }
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

    render() {
        const { selectedImage, imageList, isLoading, hasEdit, hasCreate, imagesNotUsed } = this.props;
        const { stateLoading } = this.state;
        let imagesNotUsedIds = imagesNotUsed.map(img => img.id);
        console.log(`filterUsedImages`, imagesNotUsedIds);
        return (
            <React.Fragment>
                <LoadingOverlay active={isLoading || stateLoading} spinner={<Loader />} fadeSpeed={10}>
                    {this.state.showImageFullViewModal ? (
                        <Portal
                            body={<ImageFullViewModal imgSource={`${selectedImage.image.url}`} onCancel={this.toggleImageFullViewModal} />}
                            onCancel={this.toggleImageFullViewModal}
                        />
                    ) : null}
                    {this.renderUsedImageWarning()}
                    <div className="tab-active location-sec img-dt">
                        {imageList?.length ? (
                            <div class="otr-edit-delte col-md-12 text-right gtl-dl">
                                <button type="button" class="gt-btn" onClick={() => this.props.showInfoPage(selectedImage?.image?.recommendation_id)}>
                                    View Recommendation
                                </button>
                            </div>
                        ) : null}
                        <div className="image-sec pt-3">
                            <div className={`${this.props.isReportImage ? "col-md-3" : "col-md-2"}  sld-left`}>
                                <ul id="sliderSection" className={`${imageList && imageList.length > 4 ? "slide-sec-scroll " : ""}slide-sec`}>
                                    {imageList && imageList.length ? (
                                        <div>
                                            {imageList.map((item, i) => (
                                                <li
                                                    id={`img_id_${i}`}
                                                    key={i}
                                                    onClick={() => this.props.setSelectedImage(i)}
                                                    className={`${
                                                        selectedImage.image && item.id === selectedImage.image.id ? "active-img " : ""
                                                    }cursor-pointer `}
                                                >
                                                    <img src={`${item.url}`} alt="" />
                                                    {(hasEdit || hasCreate) && (
                                                        <div className="img-default-outer">
                                                            <label
                                                                className="container-check"
                                                                data-tip={item.printable ? "Disable in Narrative" : "Enable in Narrative"}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.printable ? "check" : ""}
                                                                    // onChange={() => this.setPrintableImage(item, !item.printable)}
                                                                    onChange={() => this.checkIfNarrativeImageUsed(item, !item.printable)}
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                            <ReactTooltip />
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
                                                                    // onDoubleClick={() =>
                                                                    //     this.props.showInfoPage(selectedImage.image.recommendation_id)
                                                                    // }
                                                                    onClick={this.toggleImageFullViewModal}
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
                                                            this.props.setSelectedImage(
                                                                selectedImage.index === 0 ? imageList.length - 1 : selectedImage.index - 1
                                                            );
                                                            this.props.scrollImageList(
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
                                                            this.props.setSelectedImage(
                                                                selectedImage.index === imageList.length - 1 ? 0 : selectedImage.index + 1
                                                            );
                                                            this.props.scrollImageList(
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
                                                <h3>Images not available</h3>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

export default withRouter(RecomImage);
