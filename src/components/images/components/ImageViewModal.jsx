import React, { useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import tradeIcon from "../../../assets/img/Trade.svg";
import systemIcon from "../../../assets/img/systm.svg";
import subSystemIcon from "../../../assets/img/sub-systm.svg";
import docIcon from "../../../assets/img/doc.svg";
import buildingIcon from "../../../assets/img/buildings.svg";
import metaIcon from "../../../assets/img/meta.svg";
import { getAddressFromCoordinates, renderFileSize, toTitleCase, resetCursor } from "../../../config/utils";
import moment from "moment";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactTooltip from "react-tooltip";

import imgProcess from "../../../assets/img/img-process.svg";
import heartLine from "../../../assets/img/heart-line.svg";
import heartFill from "../../../assets/img/heart-fill.svg";
import Draggable from "react-draggable";
import { color } from "highcharts";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import actions from "../actions";
import { useSelector } from "react-redux";

function ImageViewModal({
    selectedImg,
    onCancel,
    hasEdit,
    handleEdit,
    handleFavClick,
    viewRecommendations,
    isAssignView,
    handleNext,
    handlePrev,
    imageList,
    updateImage,
    handleInputCaptionData,
    imageReducer,
    viewAssets
}) {
    const [formattedAddress, setFormattedAddress] = useState("");
    const [copied, setCopied] = useState(false);
    const [caption, setCaption] = useState({
        caption: selectedImg?.caption,
        image_ids: [selectedImg?.id],
        tags: selectedImg?.labels?.map(item => item.name),
        removed_tags: [],
        captionchange: true
    });
    const [currentTab, setCurrentTab] = useState("main");
    const [toggleInput, setToggleInput] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [imageExporting, setImageExporting] = useState(false);
    const ref = useRef(null);
    // const inputRef = useRef(null);

    useEffect(() => {
        const { latitude, longitude } = selectedImg.meta_data;
        if (latitude && longitude) {
            setAddress(latitude, longitude);
        }
        // inputRef && inputRef.current && inputRef.current.focus();
        ReactTooltip.rebuild();
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [toggleInput]);

    useEffect(() => {
        alertMessage?.length && showAlertMessages();
    }, [alertMessage]);

    const handleClickOutside = event => {
        if (ref.current && !ref.current.contains(event.target)) {
            setToggleInput(false);
        }
    };

    const setAddress = async (latitude, longitude) => {
        let address = await getAddressFromCoordinates(latitude, longitude);
        setFormattedAddress(address);
    };

    const showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = "Copied to Clipboard";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 2500);
        }
    };

    const showAlertMessages = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
        }
    };

    const handleClick = () => {
        setToggleInput(!toggleInput);
    };

    const handleInputCaption = async () => {
        await handleInputCaptionData(caption);
        handleClick();
        updateImage(caption);
        ReactTooltip.rebuild();
    };

    const moveCaretAtEnd = e => {
        var temp_value = e.target.value;
        e.target.value = "";
        e.target.value = temp_value;
    };

    const downloadImage = selectedImg => {
        setImageExporting(true);
        const url = selectedImg?.is_edited ? selectedImg?.s3_eimage_key : selectedImg?.s3_image_key;
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = selectedImg.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setImageExporting(false);
            })
            .catch(error => {
                console.error(error);
                setImageExporting(false);
            });
    };
    return (
        <div id="modalId" className="modal modal-region modal-img-magamnt" ref={ref} style={{ display: "block", cursor: "move" }}>
            <Draggable cancel=".not-dragabble">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div>
                            <button
                                className={`arrow-butn-left ${selectedImg?.id === imageList[0]?.id ? "cursor-diabled" : ""}`}
                                disabled={selectedImg?.id === imageList[0]?.id}
                                onClick={() => handlePrev(selectedImg.id)}
                                data-place="top"
                                data-effect="solid"
                                data-tip="Previous"
                                data-for={selectedImg.id}
                            >
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button
                                className={`arrow-butn-right ${selectedImg?.id === imageList[imageList.length - 1]?.id ? "cursor-diabled" : ""}`}
                                disabled={selectedImg?.id === imageList[imageList.length - 1]?.id}
                                onClick={() => handleNext(selectedImg.id)}
                                data-place="top"
                                data-effect="solid"
                                data-tip="Next"
                                data-for={selectedImg.id}
                            >
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancel}>
                            <span aria-hidden="true">
                                <img src="/img/close.svg" alt="" />
                            </span>
                        </button>
                        <div className="modal-header">
                            <div class="heading position-relative">
                                {toggleInput ? (
                                    <label htmlFor="">
                                        <>
                                            <div>
                                                <textarea
                                                    className="floating-textarea img-txt-area not-draggable"
                                                    type="text"
                                                    // maxLength={this.state.captionMaxLength}
                                                    // ref={inputRef}
                                                    value={caption.caption}
                                                    onChange={e => {
                                                        resetCursor(e);
                                                        let updatedValue = {};
                                                        updatedValue = { caption: toTitleCase(e.target.value) };
                                                        setCaption(caption => ({ ...caption, ...updatedValue }));
                                                    }}
                                                    onBlur={() => setToggleInput(false)}
                                                    onKeyPress={event => {
                                                        if (event.key === "Enter") {
                                                            handleInputCaption();
                                                        }
                                                    }}
                                                    autoFocus
                                                    onFocus={moveCaretAtEnd}
                                                    placeholder="Caption"
                                                    onDoubleClick={handleClick}
                                                    data-place="bottom"
                                                    data-effect="solid"
                                                    data-for={selectedImg.id}
                                                    data-tip={
                                                        "<b>Please Click Enter key to Update</b><br/>.........................Or........................<br/><b>Double Click  to Go Back</b> <br/>"
                                                    }
                                                />
                                            </div>
                                        </>
                                    </label>
                                ) : (
                                    <h5
                                        data-place="top"
                                        data-effect="solid"
                                        data-tip={
                                            selectedImg?.caption
                                                ? `<b>Double Click Here to Edit Caption</b> <br/> ${selectedImg?.caption}`
                                                : "Double Click Here to Add Caption"
                                        }
                                        data-for={selectedImg.id}
                                        style={{ cursor: "pointer" }}
                                        className="not-dragabble"
                                        onDoubleClick={handleClick}
                                    >
                                        {selectedImg?.caption || "-"}
                                    </h5>
                                )}
                                <div class="image-right d-flex">
                                    <div class="mr-2">
                                        <span class="icon-url icon-heart">
                                            <img
                                                src={selectedImg?.favourite ? heartFill : heartLine}
                                                data-for={selectedImg.id}
                                                data-tip={selectedImg?.favourite ? "Remove from Favorites" : "Add to Favorites"}
                                                onClick={() => handleFavClick(selectedImg.id, !selectedImg.favourite)}
                                                alt=""
                                            />
                                        </span>
                                    </div>
                                    {hasEdit && (
                                        <div class="mr-2">
                                            <i
                                                class="fa fa-edit"
                                                onClick={() => handleEdit(selectedImg)}
                                                data-for={selectedImg.id}
                                                data-tip="Edit Image"
                                            ></i>
                                        </div>
                                    )}
                                    <div class="mr-2">
                                        <CopyToClipboard
                                            // text={selectedImg?.s3_image_key}
                                            text={selectedImg?.is_edited ? `${selectedImg?.s3_eimage_key}` : `${selectedImg?.s3_image_key}`}
                                            onCopy={() => {
                                                setCopied(true);
                                                setTimeout(() => {
                                                    setCopied(false);
                                                }, 3500);
                                            }}
                                        >
                                            {copied ? (
                                                <i
                                                    class="fa fa-check"
                                                    style={{ color: "green" }}
                                                    data-for={selectedImg.id}
                                                    data-tip={"Copied to Clipboard"}
                                                ></i>
                                            ) : (
                                                <i
                                                    class="fa fa-link"
                                                    onClick={() => showAlert()}
                                                    data-for={selectedImg.id}
                                                    data-tip={"Click to Copy Image URL"}
                                                ></i>
                                            )}
                                        </CopyToClipboard>
                                    </div>
                                    <div class="mr-2">
                                        {imageExporting ? (
                                            <div className="edit-icn-bx icon-btn-sec d-inline-block">
                                                <div className="spinner-border" role="status"></div>
                                            </div>
                                        ) : (
                                            <i
                                                class="fa fa-download"
                                                onClick={() => downloadImage(selectedImg)}
                                                data-for={selectedImg.id}
                                                data-tip="Download Image"
                                            ></i>
                                        )}
                                    </div>
                                    {!isAssignView && selectedImg?.recommendations?.length ? (
                                        <div
                                            class="icon mr-2 cursor-hand"
                                            onClick={() => viewRecommendations(selectedImg)}
                                            data-for={selectedImg.id}
                                            data-tip="View Assigned Recommendations"
                                        >
                                            <img src={docIcon} height={18} width={18} alt="" />
                                        </div>
                                    ) : null}
                                    {!isAssignView && selectedImg?.assets?.length ? (
                                        <div
                                            class="icon mr-2 cursor-hand"
                                            onClick={() => viewAssets(selectedImg)}
                                            data-for={selectedImg.id}
                                            data-tip="View Assigned Assets"
                                        >
                                            <img src={docIcon} height={18} width={18} alt="" />
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="modal-body region-otr">
                            {selectedImg?.s3_image_key ? (
                                <TransformWrapper defaultScale={1}>
                                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                        <div className="image-preview not-dragabble">
                                            <div className="md-grp-btn">
                                                <button onClick={zoomIn}>
                                                    <img src="/img/zoom-in.svg" alt="" />
                                                </button>
                                                <button onClick={zoomOut}>
                                                    <img src="/img/zoom-out.svg" alt="" />
                                                </button>
                                            </div>
                                            <TransformComponent>
                                                <LazyLoadImage
                                                    effect="blur"
                                                    // src={`${selectedImg?.s3_image_key}?${moment(selectedImg?.updated_at).format()}`}
                                                    src={
                                                        selectedImg?.is_edited
                                                            ? `${selectedImg?.s3_eimage_key}?${moment(selectedImg?.updated_at).format()}`
                                                            : `${selectedImg?.s3_image_key}?${moment(selectedImg?.updated_at).format()}`
                                                    }
                                                />
                                            </TransformComponent>
                                        </div>
                                    )}
                                </TransformWrapper>
                            ) : (
                                <div className="image-preview">
                                    <div class="img-process">
                                        <img src={imgProcess} alt="" />
                                        <h3>Processing...</h3>
                                    </div>
                                </div>
                            )}
                            <div className="cnt-img-se outer-right-tabpane">
                                <ul className="nav-ul-tab">
                                    <li
                                        className={currentTab === "main" ? "active cursor-hand" : "cursor-hand"}
                                        onClick={() => setCurrentTab("main")}
                                    >
                                        Main Details
                                    </li>
                                    <li
                                        className={currentTab === "meta" ? "active cursor-hand" : "cursor-hand"}
                                        onClick={() => setCurrentTab("meta")}
                                    >
                                        Meta Data
                                    </li>
                                    <li
                                        className={currentTab === "labels" ? "active cursor-hand" : "cursor-hand"}
                                        onClick={() => setCurrentTab("labels")}
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
                                                <h3>{selectedImg?.client?.name || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="img-itms">
                                            <div className="icons">
                                                <img src={buildingIcon} alt="" />
                                            </div>
                                            <div className="text-area">
                                                <h4>Project</h4>
                                                <h3>{selectedImg?.project?.name || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="img-itms">
                                            <div className="icons">
                                                <img src={buildingIcon} alt="" />
                                            </div>
                                            <div className="text-area">
                                                <h4>Region</h4>
                                                <h3>{selectedImg?.region?.name || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="img-itms">
                                            <div className="icons">
                                                <img src={buildingIcon} alt="" />
                                            </div>
                                            <div className="text-area">
                                                <h4>Site</h4>
                                                <h3>{selectedImg?.site?.name || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="img-itms">
                                            <div className="icons">
                                                <img src={buildingIcon} alt="" />
                                            </div>
                                            <div className="text-area">
                                                <h4>Building</h4>
                                                <h3>
                                                    {`${selectedImg?.building?.name || "-"} ${
                                                        selectedImg?.building?.description ? `(${selectedImg?.building?.description})` : ""
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
                                                <h3>{selectedImg?.trade?.name || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="img-itms">
                                            <div className="icons">
                                                <img src={systemIcon} alt="" />
                                            </div>
                                            <div className="text-area">
                                                <h4>System</h4>
                                                <h3>{selectedImg?.system?.name || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="img-itms">
                                            <div className="icons">
                                                <img src={subSystemIcon} alt="" />
                                            </div>
                                            <div className="text-area">
                                                <h4>Sub-System</h4>
                                                <h3>{selectedImg?.sub_system?.name || "-"}</h3>
                                            </div>
                                        </div>
                                    </>
                                ) : currentTab === "meta" ? (
                                    <div className="img-itms meta not-dragabble">
                                        {/* <div className="w-100">
                                        <div className="icons">
                                            <img src={metaIcon} alt="" />
                                        </div>
                                        <div className="text-area">
                                            <h4>Metadata</h4>
                                        </div>
                                    </div> */}
                                        <div className="foot-area">
                                            <div class="list">
                                                <span class="label-nme">File Name </span>
                                                <span>: </span>
                                                <span class="dtl-lbl">{selectedImg?.name}</span>
                                            </div>
                                            <div className="list">
                                                <span class="label-nme">Uploaded By </span>
                                                <span>: </span>
                                                <span class="dtl-lbl">{selectedImg?.user?.name}</span>
                                            </div>
                                            {selectedImg?.meta_data?.date_taken && (
                                                <div className="list">
                                                    <span class="label-nme">Date Taken </span>
                                                    <span>: </span>{" "}
                                                    <span class="dtl-lbl">
                                                        {moment(selectedImg?.meta_data?.date_taken).format("dddd, MMMM Do YYYY, h:mm a") || ""}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="list">
                                                <span class="label-nme">Date Uploaded </span>
                                                <span>: </span>
                                                <span class="dtl-lbl">
                                                    {moment(selectedImg?.created_at).format("dddd, MMMM Do YYYY, h:mm a") || ""}
                                                </span>
                                            </div>
                                            <div className="list">
                                                <span class="label-nme">Date Modified</span>
                                                <span>: </span>
                                                <span class="dtl-lbl">
                                                    {" "}
                                                    {moment(selectedImg?.updated_at).format("dddd, MMMM Do YYYY, h:mm a") || ""}
                                                </span>
                                            </div>
                                            <div className="list">
                                                <span class="label-nme">Image Modified</span>
                                                <span>: </span>
                                                <span class="dtl-lbl">{selectedImg?.is_edited === true ? "Yes" : "No"}</span>
                                            </div>

                                            {formattedAddress && (
                                                <div className="list">
                                                    <span class="label-nme">Location </span>
                                                    <span>: </span>
                                                    <span class="dtl-lbl">{formattedAddress}</span>
                                                </div>
                                            )}
                                            {selectedImg?.meta_data?.file_size && (
                                                <div className="list">
                                                    <span class="label-nme">Size </span>
                                                    <span>: </span>
                                                    <span class="dtl-lbl">{renderFileSize(selectedImg?.meta_data?.file_size) || ""}</span>
                                                </div>
                                            )}
                                            <div class="list">
                                                <span class="label-nme">Is Asset Image</span>
                                                <span>: </span>
                                                <span class="dtl-lbl">{selectedImg?.is_asset_image ? "Yes" : "No"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <ul className="label-notification">
                                        {selectedImg.labels?.map(item => (
                                            <li key={item.name}>{item.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <ReactTooltip
                                id={selectedImg.id}
                                effect="solid"
                                place="left"
                                backgroundColor="#1383D9"
                                getContent={dataTip => dataTip?.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                                html={true}
                                multiline={true}
                            />
                        </div>
                    </div>
                </div>
            </Draggable>
        </div>
    );
}

const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(ImageViewModal));
