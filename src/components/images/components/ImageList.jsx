import moment from "moment";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Dropdown } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactTooltip from "react-tooltip";

import docIcon from "../../../assets/img/doc.svg";
import Loader from "../../common/components/Loader";
import SingleImagePreview from "./SingleImagePreview";
import imgProcess from "../../../assets/img/img-process.svg";

import heartLine from "../../../assets/img/heart-line.svg";
import heartFill from "../../../assets/img/heart-fill.svg";
import "react-lazy-load-image-component/src/effects/blur.css";
import { resetCursor, toTitleCase } from "../../../config/utils";
import { connect } from "react-redux";
import actions from "../actions";

function ImageList({
    imageData,
    showSelectBox,
    handleMultiSelectImage,
    selectedImages,
    hasMore,
    fetchMoreImages,
    viewImageModal,
    handleEdit,
    handleDelete,
    isAssignView,
    hasEdit,
    hasDelete,
    handleFavClick,
    viewRecommendations,
    handleInputCaptionData,
    updateImage
    // listRef,
    // initialScrollY
}) {
    const [selectedImage, setSelectedImage] = useState({});
    const [toggleInput, setToggleInput] = useState("");
    const ref = useRef();
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
    const handleClickOutside = event => {
        if (ref.current && !ref.current.contains(event.target)) {
            handleClick("");
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
    const handleClick = key => {
        setToggleInput(prevState => {
            return { ...prevState, toggleInput: toggleInput === key ? "" : key || "" };
        });
    };
    const handleInputCaption = async () => {
        console.log("io",caption)
        await handleInputCaptionData(caption);
        handleClick("");
        updateImage(caption);
        ReactTooltip.rebuild();
    };
    const moveCaretAtEnd = e => {
        var temp_value = e.target.value;
        e.target.value = "";
        e.target.value = temp_value;
    };
    return (
        <>
            <InfiniteScroll
                // ref={listRef}
                // initialScrollY={initialScrollY}
                dataLength={imageData?.length}
                next={fetchMoreImages}
                hasMore={hasMore}
                height={600}
                loader={
                    <div className="col-12">
                        <Loader />
                    </div>
                }
                className="d-flex flex-wrap infinite-scroll"
                endMessage={<p style={{ textAlign: "center" }}>{/* <b>No more data</b> */}</p>}
            >
                <div className="listing-items" ref={ref}>
                    {imageData?.length
                        ? imageData.map((item, idx) => (
                              <div className={`list-item ${item.id === selectedImage.id ? "active" : ""}`} key={`img-list-items-${item.id}-${idx}`}>
                                  <div class="drop-sec">
                                      <div class="image-right d-flex">
                                          <div class="heart">
                                              <span class="icon-url icon-heart">
                                                  <img
                                                      src={item.favourite ? heartFill : heartLine}
                                                      alt="fav"
                                                      onClick={() => handleFavClick(item.id, !item.favourite)}
                                                      data-for={`text${item.id}`}
                                                      data-tip={item.favourite ? "Remove from Favorites" : "Add to Favorites"}
                                                  />
                                              </span>
                                          </div>
                                          {!isAssignView && hasEdit && (
                                              <div class="edit" onClick={() => handleEdit(item)}>
                                                  <i class="fa fa-pencil-alt" data-for={`text${item.id}`} data-tip="Edit"></i>
                                              </div>
                                          )}
                                          {!isAssignView && item.recommendations?.length > 0 && (
                                              <div class="mr-2 recom" onClick={() => viewRecommendations(item)}>
                                                  <i class="fa fa-file-alt" data-for={`text${item.id}`} data-tip={"View Recommendations"}></i>
                                              </div>
                                          )}
                                      </div>
                                  </div>

                                  <div className="cnt-area cursor-hand">
                                      <div className="img-section" onClick={() => setSelectedImage(selectedImage.id === item.id ? {} : item)}>
                                          {item?.s3_thumbnail_key ? (
                                              <LazyLoadImage
                                                  alt={`img-${idx}`}
                                                  delayTime={500}
                                                  effect="blur"
                                                  className="img-itm"
                                                  placeholderSrc={imgProcess}
                                                  src={`${item?.is_edited ? item?.s3_ethumbnail_key : item?.s3_thumbnail_key}?${moment(
                                                      item?.updated_at
                                                  ).format()}`}
                                              />
                                          ) : (
                                              <div className="image-preview">
                                                  <div class="img-process-sec">
                                                      <img src={imgProcess} alt="processing" />
                                                      <h3>Processing..</h3>
                                                  </div>
                                              </div>
                                          )}
                                          {isAssignView && !item.not_assigned
                                              ? null
                                              : showSelectBox && (
                                                    <label className="container-check">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedImages.find(img => img.id === item.id) ? true : false}
                                                            onChange={e => handleMultiSelectImage(item, e.target.checked)}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                )}
                                      </div>
                                      <div className="cnt-sec-itm">
                                          {toggleInput.toggleInput === item.id ? (
                                              <label htmlFor="">
                                                  <>
                                                      <div>
                                                          <h3 style={{ cursor: "pointer", textTransform: "none" }}> {item?.caption || "-"}</h3>
                                                          <textarea
                                                              className="floating-textarea img-list-float-area"
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
                                                              onDoubleClick={() => handleClick("")}
                                                              autoFocus
                                                              onFocus={moveCaretAtEnd}
                                                              data-place="bottom"
                                                              data-effect="solid"
                                                              data-for={`text${item.id}`}
                                                              data-tip={
                                                                  "<b>Please Click Enter key to Update</b><br/>.........................Or........................<br/><b>Double Click  to Go Back</b> <br/>"
                                                              }
                                                          />
                                                      </div>
                                                  </>
                                              </label>
                                          ) : (
                                              <h3
                                                  data-for={`text${item.id}`}
                                                  style={{ cursor: "pointer", textTransform: "none" }}
                                                  html={true}
                                                  data-tip={
                                                      item.caption
                                                          ? `Double Click Here to Edit Caption<br/>${item.caption}`
                                                          : "Double Click Here to Add Caption"
                                                  }
                                                  onDoubleClick={() => handleGetImageId(item.id, item)}
                                              >
                                                  {item?.caption || "-"}
                                              </h3>
                                          )}
                                          {/* </div> */}

                                          <div onClick={() => setSelectedImage(selectedImage.id === item.id ? {} : item)} className="item-sub">
                                              File Name : {item?.name}
                                          </div>
                                          <div onClick={() => setSelectedImage(selectedImage.id === item.id ? {} : item)} className="item-sub">
                                              Trade : {item?.trade?.name}
                                          </div>
                                          <div onClick={() => setSelectedImage(selectedImage.id === item.id ? {} : item)} className="item-sub">
                                              Building :{item?.building?.name}
                                          </div>
                                          <div onClick={() => setSelectedImage(selectedImage.id === item.id ? {} : item)} className="item-sub">
                                              Date Taken : {moment(item?.meta_data?.date_taken).format("dddd, MMMM Do YYYY, h:mm a") || "-"}
                                          </div>
                                      </div>
                                  </div>
                                  <ReactTooltip
                                      id={`text${item.id}`}
                                      effect="solid"
                                      backgroundColor="#1383D9"
                                      getContent={dataTip => dataTip?.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                                      html={true}
                                      multiline={true}
                                  />
                              </div>
                          ))
                        : null}
                </div>
            </InfiniteScroll>
            {selectedImage.id && (
                <SingleImagePreview
                    setSelectedImage={setSelectedImage}
                    viewImageModal={viewImageModal}
                    selectedImg={selectedImage}
                    handleFavClick={handleFavClick}
                    viewRecommendations={viewRecommendations}
                    isAssignView={isAssignView}
                    handleInputCaptionData={handleInputCaptionData}
                />
            )}
        </>
    );
}
const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};
export default connect(mapStateToProps, { ...actions })(React.memo(ImageList));
