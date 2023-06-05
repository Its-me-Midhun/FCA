import React, { Component, createRef } from "react";
import { withRouter } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Draggable from "react-draggable";
import tradeIcon from "../../../../assets/img/Trade.svg";
import systemIcon from "../../../../assets/img/systm.svg";
import subSystemIcon from "../../../../assets/img/sub-systm.svg";
import buildingIcon from "../../../../assets/img/buildings.svg";
import metaIcon from "../../../../assets/img/meta.svg";
import ReactTooltip from "react-tooltip";
import { getAddressFromCoordinates, renderFileSize, resetCursor, toTitleCase } from "../../../../config/utils";
import moment from "moment";
class ImageView extends Component {
    constructor(props) {
        super(props);
        // this.inputRef = createRef();
        // this.wrapperRef =createRef();
    }
    state = {
        formattedAddress: "",
        currentTab: "main",
        caption: {
            id: "",
            description: ""
        },
        toggleInput: false
    };

    componentDidMount = async () => {
        document.addEventListener("mousedown", this.handleClickOutside);
        const { image } = this.props;
        const { latitude, longitude } = image?.master_image?.meta_data || {};
        // this.inputRef && this.inputRef.current &&  this.inputRef.current.focus();
        if (latitude && longitude) {
            this.setAdress(latitude, longitude);
        }
    };
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevState?.toggleInput !== this.state.toggleInput) {
            // if(! this.state.toggleInput){
            ReactTooltip.rebuild();
            // this.inputRef.current && this.inputRef.current &&  this.inputRef.current.focus();
            // }
        }
    };

    setWrapperRef = node => {
        this.wrapperRef = node;
    };

    setAdress = async (latitude, longitude) => {
        let address = await getAddressFromCoordinates(latitude, longitude);
        this.setState({
            formattedAddress: address
        });
    };

    componentWillUnmount = () => {
        document.removeEventListener("mousedown", this.handleClickOutside);
    };
    handleClickOutside = event => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ toggleInput: false });
        }
    };

    handleClick = () => {
        const { toggleInput } = this.state;
        this.setState({ toggleInput: !toggleInput });
    };
    handleInputCaption = async () => {
        const { caption } = this.state;
        await this.props.handleInputCaptionData(caption);
        this.handleClick();
        this.props.updateImageFromInfo1(caption);
        ReactTooltip.rebuild();
    };
    handleGetImageId = (id, value) => {
        const { caption } = this.state;
        this.setState({
            caption: {
                ...caption,
                id: id,
                description: value
            }
        });
        this.handleClick();
    };

    moveCaretAtEnd = e => {
        var temp_value = e.target.value;
        e.target.value = "";
        e.target.value = temp_value;
    };
    render() {
        const { onCancel, image, handleEdit, hasEditButton = true, imageList, match } = this.props;
        const { currentTab, caption } = this.state;
        if (!image.url) return null;
        return (
            <div>
                <div id="modalId" className="modal modal-region modal-img-magamnt" style={{ display: "block", cursor: "move" }}>
                    <ReactTooltip
                        id="image-view-modal"
                        effect="solid"
                        backgroundColor="#007bff"
                        getContent={dataTip => dataTip?.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                        html={true}
                        multiline={true}
                    />
                    <Draggable cancel=".not-draggable">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                {match.params.tab !== "maindetails" ? (
                                    <div>
                                        <button
                                            className={`arrow-butn-left ${imageList[0]?.id === image.id ? "cursor-diabled" : ""}`}
                                            disabled={imageList[0]?.id === image?.id}
                                            onClick={() => this.props.handlePrev(image.id)}
                                            data-place="top"
                                            data-effect="solid"
                                            data-tip="Previous"
                                            data-for="image-view-modal"
                                        >
                                            <i class="fas fa-chevron-left"></i>
                                        </button>

                                        <button
                                            className={`arrow-butn-right ${
                                                image?.id === imageList[imageList.length - 1]?.id ? "cursor-diabled" : ""
                                            }`}
                                            disabled={image?.id === imageList[imageList.length - 1]?.id}
                                            onClick={() => this.props.handleNext(image.id)}
                                            data-place="top"
                                            data-effect="solid"
                                            data-tip="Next"
                                            data-for="image-view-modal"
                                        >
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                ) : null}
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancel}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                                <div className="modal-header">
                                    <div class="heading position-relative">
                                        <div ref={this.setWrapperRef}>
                                            {this.state.toggleInput ? (
                                                <>
                                                    {/* {caption.id === item.id &&  */}
                                                    <label htmlFor="">
                                                        <>
                                                            <div>
                                                                <textarea
                                                                    className="floating-textarea img-txt-area not-draggable"
                                                                    type="text"
                                                                    // maxLength={this.state.captionMaxLength}
                                                                    // ref={this.inputRef}
                                                                    value={caption.description}
                                                                    onChange={e => {
                                                                        const { caption } = this.state;
                                                                        resetCursor(e);
                                                                        this.setState({
                                                                            caption: {
                                                                                ...caption,
                                                                                description: toTitleCase(e.target.value)
                                                                            }
                                                                        });
                                                                    }}
                                                                    //   onBlur={() => setToggleInput("")}
                                                                    onKeyPress={event => {
                                                                        if (event.key === "Enter") {
                                                                            this.handleInputCaption();
                                                                        }
                                                                    }}
                                                                    autoFocus
                                                                    onFocus={this.moveCaretAtEnd}
                                                                    placeholder="Caption"
                                                                    onDoubleClick={() => this.handleClick()}
                                                                    data-effect="solid"
                                                                    data-for="image-view-modal"
                                                                    data-tip={
                                                                        "<b>Please Click Enter key to Update</b><br/>.........................Or........................<br/><b>Double Click  to Go Back</b> <br/>"
                                                                    }
                                                                />
                                                            </div>
                                                        </>
                                                    </label>
                                                    {/* } */}
                                                </>
                                            ) : (
                                                <h5
                                                    style={{ textTransform: "none", cursor: "pointer" }}
                                                    onDoubleClick={() => this.handleGetImageId(image.id, image.description)}
                                                    className="not-draggable"
                                                    data-place="top"
                                                    data-effect="solid"
                                                    data-tip="Double Click Here to Edit Caption"
                                                    data-for="image-view-modal"
                                                >
                                                    {image?.description || "-"}
                                                </h5>
                                            )}
                                        </div>
                                        <div class="image-right d-flex">
                                            {hasEditButton && (
                                                <div class="mr-2">
                                                    <i
                                                        class="fa fa-edit"
                                                        onClick={() => handleEdit(image)}
                                                        data-for="image-view-modal"
                                                        data-place="left"
                                                        data-tip="Edit"
                                                    ></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-body region-otr">
                                    <TransformWrapper defaultScale={1}>
                                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                            <div className="image-preview not-draggable">
                                                <div className="md-grp-btn">
                                                    <button onClick={zoomIn}>
                                                        <img src="/img/zoom-in.svg" alt="" />
                                                    </button>
                                                    <button onClick={zoomOut}>
                                                        <img src="/img/zoom-out.svg" alt="" />
                                                    </button>
                                                </div>
                                                <TransformComponent>
                                                    <LazyLoadImage effect="blur" src={image?.url} />
                                                </TransformComponent>
                                            </div>
                                        )}
                                    </TransformWrapper>

                                    <div className="cnt-img-se outer-right-tabpane">
                                        <ul className="nav-ul-tab">
                                            <li
                                                className={currentTab === "main" ? "active cursor-hand" : "cursor-hand"}
                                                onClick={() => this.setState({ currentTab: "main" })}
                                            >
                                                Main Details
                                            </li>
                                            <li
                                                className={currentTab === "meta" ? "active cursor-hand" : "cursor-hand"}
                                                onClick={() => this.setState({ currentTab: "meta" })}
                                            >
                                                Meta Data
                                            </li>
                                            <li
                                                className={currentTab === "labels" ? "active cursor-hand" : "cursor-hand"}
                                                onClick={() => this.setState({ currentTab: "labels" })}
                                            >
                                                Labels
                                            </li>
                                        </ul>
                                        {currentTab === "main" ? (
                                            <>
                                                <div className="img-itms">
                                                    <div className="icons">
                                                        <img src={buildingIcon} alt="" />
                                                    </div>

                                                    <div className="text-area">
                                                        <h4>Client</h4>
                                                        <h3>{image?.master_image?.client?.name || "-"}</h3>
                                                    </div>
                                                </div>
                                                <div className="img-itms">
                                                    <div className="icons">
                                                        <img src={buildingIcon} alt="" />
                                                    </div>
                                                    <div className="text-area">
                                                        <h4>Project</h4>
                                                        <h3>{image?.master_image?.project?.name || "-"}</h3>
                                                    </div>
                                                </div>
                                                <div className="img-itms">
                                                    <div className="icons">
                                                        <img src={buildingIcon} alt="" />
                                                    </div>
                                                    <div className="text-area">
                                                        <h4>Region</h4>
                                                        <h3>{image?.master_image?.region?.name || "-"}</h3>
                                                    </div>
                                                </div>
                                                <div className="img-itms">
                                                    <div className="icons">
                                                        <img src={buildingIcon} alt="" />
                                                    </div>
                                                    <div className="text-area">
                                                        <h4>Site</h4>
                                                        <h3>{image?.master_image?.site?.name || "-"}</h3>
                                                    </div>
                                                </div>
                                                <div className="img-itms">
                                                    <div className="icons">
                                                        <img src={buildingIcon} alt="" />
                                                    </div>
                                                    <div className="text-area">
                                                        <h4>Building</h4>
                                                        <h3>
                                                            {`${image?.master_image?.building?.name || "-"} ${
                                                                image?.master_image?.building?.description
                                                                    ? `(${image?.master_image?.building?.description})`
                                                                    : ""
                                                            }` || ""}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="img-itms">
                                                    <div className="icons">
                                                        <img src={tradeIcon} alt="" />
                                                    </div>
                                                    <div className="text-area">
                                                        <h4>Trade</h4>
                                                        <h3>{image?.master_image?.trade?.name || "-"}</h3>
                                                    </div>
                                                </div>
                                                <div className="img-itms">
                                                    <div className="icons">
                                                        <img src={systemIcon} alt="" />
                                                    </div>
                                                    <div className="text-area">
                                                        <h4>System</h4>
                                                        <h3>{image?.master_image?.system?.name || "-"}</h3>
                                                    </div>
                                                </div>
                                                <div className="img-itms">
                                                    <div className="icons">
                                                        <img src={subSystemIcon} alt="" />
                                                    </div>
                                                    <div className="text-area">
                                                        <h4>Sub-System</h4>
                                                        <h3>{image?.master_image?.sub_system?.name || "-"}</h3>
                                                    </div>
                                                </div>
                                            </>
                                        ) : currentTab === "meta" ? (
                                            <div className="img-itms meta not-dragabble">
                                                <div className="foot-area">
                                                    <div class="list">
                                                        <span class="label-nme">File Name </span>
                                                        <span>: </span>
                                                        <span class="dtl-lbl">{image?.master_image?.name}</span>
                                                    </div>
                                                    <div className="list">
                                                        <span class="label-nme">Uploaded By </span>
                                                        <span>: </span>
                                                        <span class="dtl-lbl">{image?.master_image?.user?.name}</span>
                                                    </div>
                                                    {image?.master_image?.meta_data?.date_taken && (
                                                        <div className="list">
                                                            <span class="label-nme">Date Taken </span>
                                                            <span>: </span>{" "}
                                                            <span class="dtl-lbl">
                                                                {moment(image?.master_image?.meta_data?.date_taken).format(
                                                                    "dddd, MMMM Do YYYY, h:mm a"
                                                                ) || ""}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="list">
                                                        <span class="label-nme">Date Uploaded </span>
                                                        <span>: </span>
                                                        <span class="dtl-lbl">
                                                            {moment(image?.master_image?.created_at).format("dddd, MMMM Do YYYY, h:mm a") || ""}
                                                        </span>
                                                    </div>
                                                    <div className="list">
                                                        <span class="label-nme">Date Modified</span>
                                                        <span>: </span>
                                                        <span class="dtl-lbl">
                                                            {" "}
                                                            {moment(image?.master_image?.updated_at).format("dddd, MMMM Do YYYY, h:mm a") || ""}
                                                        </span>
                                                    </div>
                                                    <div className="list">
                                                        <span class="label-nme">Image Modified</span>
                                                        <span>: </span>
                                                        <span class="dtl-lbl">{image?.master_image?.is_edited === true ? "Yes" : "No"}</span>
                                                    </div>

                                                    {this.state.formattedAddress && (
                                                        <div className="list">
                                                            <span class="label-nme">Location </span>
                                                            <span>: </span>
                                                            <span class="dtl-lbl">{this.state.formattedAddress}</span>
                                                        </div>
                                                    )}
                                                    {image?.master_image?.meta_data?.file_size && (
                                                        <div className="list">
                                                            <span class="label-nme">Size </span>
                                                            <span>: </span>
                                                            <span class="dtl-lbl">
                                                                {renderFileSize(image?.master_image?.meta_data?.file_size) || ""}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div class="list">
                                                        <span class="label-nme">Is Asset Image</span>
                                                        <span>: </span>
                                                        <span class="dtl-lbl">{image?.master_image?.is_asset_image ? "Yes" : "No"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <ul className="label-notification">
                                                {image.master_image?.labels?.map(item => (
                                                    <li key={item.name}>{item.name}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <ReactTooltip id={image.id} effect="solid" place="left" backgroundColor="#1383D9" />
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </div>
            </div>
        );
    }
}

export default withRouter(ImageView);
