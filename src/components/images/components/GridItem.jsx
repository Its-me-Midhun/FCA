import React, { memo, useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import imgProcess from "../../../assets/img/img-process.svg";
import heartLine from "../../../assets/img/heart-line.svg";
import heartFill from "../../../assets/img/heart-fill.svg";
import { areEqual } from "react-window";
import { connect } from "react-redux";
import actions from "../actions";
import { resetCursor, toTitleCase } from "../../../config/utils";
import { useRef } from "react";

const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};

export const GridItem = connect(mapStateToProps, { ...actions })(
    memo(({ index, style, data, updateImage, isSmartChartView = false }) => {
        const ref = useRef(null);
        // const inputRef = useRef(null);
        const [toggleInput, setToggleInput] = useState(false);
        const [caption, setCaption] = useState({
            caption: "",
            image_ids: [],
            tags: [],
            removed_tags: [],
            captionchange: true
        });
        useEffect(() => {
            // inputRef && inputRef.current && inputRef.current.focus();
            document.addEventListener("click", handleClickOutside, true);
            ReactTooltip.rebuild();
            return () => {
                document.removeEventListener("click", handleClickOutside, true);
            };
        }, [toggleInput]);
        const {
            imageData,
            handleEdit,
            handleFavClick,
            handleMultiSelectImage,
            isAssignView,
            hasEdit,
            viewRecommendations,
            viewImageModal,
            showSelectBox,
            selectedImages,
            handleInputCaptionData,
            viewAssets,
            touchedImageId
        } = data;

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
            handleClick();
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
        if (!imageData[index]) return null;
        const item = imageData[index];

        return (
            <div class={`items ${touchedImageId === item.id ? "active-item" : ""}`} key={`img-grid-items-${item.id}`} ref={ref}>
                <div class="drop-sec">
                    <div class="icon-url icon-hert mr-2">
                        <img
                            alt="fav"
                            src={item?.favourite ? heartFill : heartLine}
                            data-for={"image-grid"}
                            data-tip={item?.favourite ? "Remove from Favorites" : "Add to Favorites"}
                            onClick={() => handleFavClick(item?.id, !item.favourite)}
                        />
                    </div>
                    {item.recommendations?.length ? (
                        <div class="icon-rec" onClick={() => (isAssignView ? null : viewRecommendations(item, index))}>
                            <i
                                class="far fa-file-alt"
                                data-for={"image-grid"}
                                data-tip={isAssignView ? "Assigned to Recommendation" : "View Recommendations"}
                            ></i>
                        </div>
                    ) : null}
                    {item.assets?.length ? (
                        <div class="icon-rec" onClick={() => (isAssignView ? null : viewAssets(item, index))}>
                            <i
                                class="far fa-file-alt"
                                data-for={"image-grid"}
                                data-tip={isAssignView ? "Assigned to Asset" : "View Assigned Assets"}
                            ></i>
                        </div>
                    ) : null}
                    {hasEdit && (
                        <div class="icon" onClick={() => handleEdit(item)}>
                            <i class="fa fa-pencil-alt" data-for={"image-grid"} data-tip={"Edit"}></i>
                        </div>
                    )}
                </div>

                <div class="images">
                    {item?.s3_thumbnail_key ? (
                        <img
                            onClick={() => viewImageModal(item)}
                            alt={`${item?.name}`}
                            placeholderSrc={imgProcess}
                            src={
                                item.is_edited
                                    ? `${item?.s3_eimage_key}?${moment(item?.updated_at).format()}`
                                    : `${item?.s3_thumbnail_key}?${moment(item?.updated_at).format()}`
                            }
                            className="cursor-hand"
                        />
                    ) : (
                        <div class="img-process">
                            <img src={imgProcess} alt="processing" />
                            <h3>Processing...</h3>
                        </div>
                    )}
                    {isAssignView && (!item.not_assigned || item.is_locked || !item.s3_thumbnail_key) && !isSmartChartView
                        ? null
                        : showSelectBox && (
                              <label class="container-check">
                                  <input
                                      type="checkbox"
                                      checked={!!selectedImages.find(img => img.id === item.id)}
                                      onChange={e => handleMultiSelectImage(item, e.target.checked)}
                                  />
                                  <span class="checkmark"></span>
                              </label>
                          )}
                </div>
                <div class="cnt-img-sec">
                    <div class="heading">
                        {toggleInput ? (
                            <label htmlFor="">
                                <>
                                    <div>
                                        <textarea
                                            className="floating-textarea"
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
                                            data-for={"image-grid"}
                                            data-tip={
                                                "<b>Please Click Enter key to Update</b><br/>.........................Or........................<br/><b>Double Click  to Go Back</b> <br/>"
                                            }
                                        />
                                    </div>
                                </>
                            </label>
                        ) : (
                            <h3
                                data-for={"image-grid"}
                                style={{ cursor: "pointer", textTransform: "none" }}
                                html={true}
                                data-tip={
                                    item.caption
                                        ? `<b>Double Click Here to Edit Caption</b> <br/> ${item.caption}`
                                        : "Double Click Here to Add Caption"
                                }
                                onDoubleClick={() => handleGetImageId(item.id, item)}
                            >
                                {item?.caption || "-"}
                            </h3>
                        )}
                    </div>
                    <div class="cnt-area">
                        <div class="secs">
                            <span className="sec-label"> Building </span>
                            <span
                                className="dtl"
                                data-for={"image-grid"}
                                data-tip={`${item?.building?.name || ""} ${item.building?.description ? `(${item.building?.description})` : ""}`}
                            >
                                {item?.building?.name || "-"}
                            </span>
                        </div>
                        <div class="secs">
                            <span className="sec-label">Trade </span>
                            <span className="dtl" data-for={"image-grid"} data-tip={item?.trade?.name || "-"}>
                                {item?.trade?.name || "-"}
                            </span>
                        </div>
                    </div>
                    <div class="cnt-area sec-row">
                        <div class="secs">
                            <span className="dtl" data-for={"image-grid"} data-tip={item?.name || "-"}>
                                {item?.name || "-"}
                            </span>
                        </div>
                        <div class="secs">
                            <span
                                className="dtl"
                                data-for={"image-grid"}
                                data-tip={item?.meta_data?.date_taken ? moment(item?.meta_data?.date_taken).format("MM/DD/YY h:mm a") : "-"}
                            >
                                {item?.meta_data?.date_taken ? moment(item?.meta_data?.date_taken).format("MM/DD/YY h:mm a") : "-"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, areEqual)
);
