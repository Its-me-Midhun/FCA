import React, { useEffect, useRef, useState } from "react";

import tradeIcon from "../../../assets/img/Trade.svg";
import systemIcon from "../../../assets/img/systm.svg";
import subSystemIcon from "../../../assets/img/sub-systm.svg";
import docIcon from "../../../assets/img/doc.svg";
import buildingIcon from "../../../assets/img/buildings.svg";
import metaIcon from "../../../assets/img/meta.svg";
import CopyToClipboard from "react-copy-to-clipboard";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getAddressFromCoordinates, renderFileSize, resetCursor, toTitleCase } from "../../../config/utils";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import imgProcess from "../../../assets/img/img-process.svg";
import heartLine from "../../../assets/img/heart-line.svg";
import heartFill from "../../../assets/img/heart-fill.svg";
import actions from "../actions";
import { connect } from "react-redux";

function SingleImagePreview({
    selectedImg,
    viewImageModal,
    setSelectedImage,
    handleFavClick,
    viewRecommendations,
    isAssignView,
    handleInputCaptionData,
    updateImage
}) {
    const [copied, setCopied] = useState(false);
    const [formattedAddress, setFormattedAddress] = useState(false);
    const [toggleInput, setToggleInput] = useState(false);
    const ref = useRef();
    const [caption, setCaption] = useState({
        caption: "",
        image_ids: [],
        tags: [],
        removed_tags: [],
        captionchange: true
    });
    useEffect(() => {
        const { latitude, longitude } = selectedImg.meta_data;
        if (latitude && longitude) {
            setAddress(latitude, longitude);
        }
    }, []);

    useEffect(() => {
        // inputRef && inputRef.current && inputRef.current.focus();
        document.addEventListener("click", handleClickOutside, true);
        ReactTooltip.rebuild();
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
            ReactTooltip.rebuild();
        };
    }, [toggleInput]);
    const handleClickOutside = event => {
        if (ref.current && !ref.current.contains(event.target)) {
            setToggleInput(false);
        }
    };

    const handleGetImageId = (id, value) => {
        setCaption({
            caption: value.caption,
            image_ids: [id],
            tags: value?.labels?.map(item => item.name),
            removed_tags: [],
            captionchange: true
        });
        handleClick(id);
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
    return (
        <div className="preveiew">
            <div className="img-view cursor-hand">
                <div class="img-close" onClick={() => setSelectedImage({})}>
                    <img src="/img/close.svg" alt="" />
                </div>
                {selectedImg?.s3_thumbnail_key ? (
                    <LazyLoadImage
                        onClick={() => viewImageModal(selectedImg)}
                        alt={`img-prev`}
                        effect="blur"
                        // src={`${selectedImg?.s3_image_key}?${moment(selectedImg?.updated_at).format()}`}
                        src={
                            selectedImg?.is_edited
                                ? `${selectedImg?.s3_ethumbnail_key}?${moment(selectedImg?.updated_at).format()}`
                                : `${selectedImg?.s3_image_key}?${moment(selectedImg?.updated_at).format()}`
                        }
                    />
                ) : (
                    <div className="image-preview">
                        <div class="img-process-otr">
                            <img src={imgProcess} />
                            <h3>Processing...</h3>
                        </div>
                    </div>
                )}
            </div>
            <div className="caption-area">
                {/* <ReactTooltip
                    id="image-single-modal"
                    effect="solid"
                    backgroundColor="#007bff"
                    getContent={dataTip => dataTip?.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                    html={true}
                    multiline={true}
                /> */}
                <div ref={ref}>
                    {toggleInput ? (
                        <>
                            <h3 style={{ textTransform: "none" }}>{selectedImg?.caption || "-"}</h3>
                            <label htmlFor="">
                                <>
                                    <div>
                                        <textarea
                                            className="floating-textarea preview-area"
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
                                            // onBlur={() => setToggleInput(false)}
                                            onKeyPress={event => {
                                                if (event.key === "Enter") {
                                                    handleInputCaption();
                                                }
                                            }}
                                            placeholder="Caption"
                                            onDoubleClick={handleClick}
                                            autoFocus
                                            onFocus={moveCaretAtEnd}
                                            data-place="bottom"
                                            data-effect="solid"
                                            data-for={selectedImg.id}
                                            data-tip={
                                                "<b>Please Click Enter key to Update</b> <br/>.........................Or........................<br/><b>Double Click  to Go Back</b> <br/>"
                                            }
                                        />
                                    </div>
                                </>
                            </label>
                        </>
                    ) : (
                        <h3
                            // data-for="image-single-modal"
                            data-for={selectedImg.id}
                            style={{ cursor: "pointer", textTransform: "none" }}
                            html={true}
                            data-tip={
                                selectedImg.caption
                                    ? `Double Click Here to Edit Caption<br/>${selectedImg.caption}`
                                    : "Double Click Here to Add Caption"
                            }
                            onDoubleClick={() => handleGetImageId(selectedImg.id, selectedImg)}
                        >
                            {selectedImg?.caption || "-"}
                        </h3>
                    )}
                </div>
                <div class="icon">
                    <span class="icon-url icon-heart mr-2">
                        <img
                            src={selectedImg?.favourite ? heartFill : heartLine}
                            data-tip={selectedImg?.favourite ? "Remove from Favorites" : "Add to Favorites"}
                            onClick={() => handleFavClick(selectedImg.id, !selectedImg.favourite)}
                        />
                    </span>
                    <span class="icon-url mr-2 cursor-hand">
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
                                <i class="fa fa-check" style={{ color: "green" }} data-for={selectedImg.id} data-tip={"Copied to Clipboard"}></i>
                            ) : (
                                <i class="fa fa-link" onClick={() => showAlert()} data-for={selectedImg.id} data-tip={"Click to Copy Image URL"}></i>
                            )}
                        </CopyToClipboard>
                    </span>
                    {!isAssignView && selectedImg.recommendations?.length ? (
                        <span class="icon-url icon-edit cursor-hand" onClick={() => viewRecommendations(selectedImg)}>
                            <i class="far fa-file-alt" data-for={selectedImg.id} data-tip={"View Recommendations"}></i>
                        </span>
                    ) : null}
                </div>
            </div>
            <div className="table-area">
                <table className="table table-borderd">
                    <tbody>
                        <tr>
                            <td>
                                <div className="table-cnt">
                                    <div className="icons">
                                        <img src={docIcon} />
                                    </div>
                                    <div className="text-area">
                                        <h4>Project</h4>
                                        <h3 data-for={selectedImg.id} data-tip={selectedImg?.project?.name || ""}>
                                            {" "}
                                            {selectedImg?.project?.name}
                                        </h3>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="table-cnt">
                                    <div className="icons">
                                        <img src={buildingIcon} />
                                    </div>
                                    <div className="text-area">
                                        <h4>Building</h4>
                                        <h3 data-for={selectedImg.id} data-tip={selectedImg?.building?.name || ""}>
                                            {selectedImg?.building?.name}
                                        </h3>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="table-cnt">
                                    <div className="icons">
                                        <img src={tradeIcon} />
                                    </div>
                                    <div className="text-area">
                                        <h4>Trade</h4>
                                        <h3 data-for={selectedImg.id} data-tip={selectedImg?.trade?.name || ""}>
                                            {selectedImg?.trade?.name}
                                        </h3>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="table-cnt">
                                    <div className="icons">
                                        <img src={systemIcon} />
                                    </div>
                                    <div className="text-area">
                                        <h4>System</h4>
                                        <h3 data-for={selectedImg.id} data-tip={selectedImg?.system?.name || ""}>
                                            {selectedImg?.system?.name}
                                        </h3>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className="table-cnt">
                                    <div className="icons">
                                        <img src={subSystemIcon} />
                                    </div>
                                    <div className="text-area">
                                        <h4>Sub-System</h4>
                                        <h3 className="wid-max" data-for={selectedImg.id} data-tip={selectedImg?.sub_system?.name || ""}>
                                            {selectedImg?.sub_system?.name}
                                        </h3>
                                    </div>
                                </div>
                            </td>
                            {/* <td>
                                <CopyToClipboard text={selectedImg?.s3_image_key} onCopy={() => setCopied(true)}>
                                    <div className="table-cnt">
                                        <div className="icons">
                                            <img src={docIcon} />
                                        </div>
                                        <div className="text-area">
                                            <h4>Image URL</h4>
                                            <h3>{selectedImg?.s3_image_key}</h3>
                                        </div>
                                        {copied && <span>copied!</span>}
                                    </div>
                                </CopyToClipboard>
                            </td> */}
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className="table-cnt flex-wrap">
                                    <div className="icons">
                                        <img src={metaIcon} />
                                    </div>
                                    <div className="text-area">
                                        <h4>Metadata</h4>
                                    </div>
                                    <div className="foot-area">
                                        <div class="list">
                                            <span class="label-nme">File Name </span>
                                            <span>:</span>
                                            <span class="dtl-lbl">{selectedImg?.name}</span>
                                        </div>
                                        <div className="list">
                                            <span class="label-nme">Uploaded By </span>
                                            <span>:</span>
                                            <span class="dtl-lbl">{selectedImg?.user?.name}</span>
                                        </div>
                                        {selectedImg?.meta_data?.date_taken && (
                                            <div className="list">
                                                <span class="label-nme">Date Taken </span>
                                                <span>:</span>{" "}
                                                <span class="dtl-lbl">
                                                    {moment(selectedImg?.meta_data?.date_taken).format("dddd, MMMM Do YYYY, h:mm a") || ""}
                                                </span>
                                            </div>
                                        )}
                                        <div className="list">
                                            <span class="label-nme">Date Uploaded </span>
                                            <span>:</span>
                                            <span class="dtl-lbl">{moment(selectedImg?.created_at).format("dddd, MMMM Do YYYY, h:mm a") || ""}</span>
                                        </div>
                                        {formattedAddress && (
                                            <div className="list">
                                                <span class="label-nme">Location </span>
                                                <span>:</span>
                                                <span class="dtl-lbl">{formattedAddress}</span>
                                            </div>
                                        )}
                                        {selectedImg?.meta_data?.file_size && (
                                            <div className="list">
                                                <span class="label-nme">Size </span>
                                                <span>:</span>
                                                <span class="dtl-lbl">{renderFileSize(selectedImg?.meta_data?.file_size) || ""}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                        </tr>
                        {selectedImg.labels?.length > 0 && (
                            <tr>
                                <td colSpan={2}>
                                    <div className="table-cnt flex-wrap">
                                        <div className="icons">
                                            <img src={metaIcon} alt="" />
                                        </div>
                                        <div className="text-area">
                                            <h4>Labels</h4>
                                        </div>
                                        <div className="foot-area">
                                            {selectedImg.labels?.map(item => (
                                                <div class="list">
                                                    <span key={item.name}>{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ReactTooltip
                id={selectedImg.id}
                effect="solid"
                backgroundColor="#1383D9"
                getContent={dataTip => dataTip?.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                html={true}
                multiline={true}
            />
        </div>
    );
}

const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};

export default connect(mapStateToProps, { ...actions })(SingleImagePreview);
