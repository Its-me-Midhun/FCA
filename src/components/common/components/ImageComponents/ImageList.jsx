import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactTooltip from "react-tooltip";
import { resetCursor, toTitleCase } from "../../../../config/utils";

import Loader from "../Loader";

function ImageList({
    imageData,
    hasMore,
    fetchMoreImages,
    handleSelect,
    handleClickImage,
    hasCheckBox,
    imagesNotUsedIds,
    checkIfNarrativeImageUsed,
    isReportImage,
    hasViewRecom,
    viewRecommendations,
    hasEdit,
    handleEdit,
    handleDelete,
    hasDelete,
    updateImageFromInfoImages1,
    handleInputCaptionData
}) {
    const ref = useRef(null);
    // const inputRef = useRef(null);
    const [toggleInput, setToggleInput] = useState({});
    const [caption, setCaption] = useState({
        id: "",
        description: ""
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

    const handleClick = key => {
        setToggleInput(prevState => {
            return { ...prevState, toggleInput: toggleInput === key ? "" : key || "" };
        });
    };
    const handleInputCaption = async () => {
        await handleInputCaptionData(caption);
        handleClick("");
        updateImageFromInfoImages1(caption);
        ReactTooltip.rebuild();
    };
    const handleGetImageId = (id, value) => {
        setCaption({
            id: id,
            description: value
        });
        handleClick(id);
    };
    const moveCaretAtEnd = e => {
        var temp_value = e.target.value;
        e.target.value = "";
        e.target.value = temp_value;
    };
    return (
        <>
            <InfiniteScroll
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
                <div className="listing-items">
                    {imageData?.length
                        ? imageData.map((item, idx) => (
                              <div className={`list-item`} key={`img-list-items-${item.id}-${idx}`}>
                                  <div class="drop-sec">
                                      <div class="image-right d-flex">
                                          {item.hasOwnProperty("printable") && (
                                              <div class="mr-2 recom">
                                                  {imagesNotUsedIds && !imagesNotUsedIds.includes(item.id) && item.printable ? (
                                                      <img
                                                          src="/img/check_green.svg"
                                                          height={26}
                                                          width={26}
                                                          alt=""
                                                          data-for={item.id}
                                                          data-tip={"Used"}
                                                      />
                                                  ) : (
                                                      <img
                                                          src="/img/check_green red.svg"
                                                          height={26}
                                                          width={26}
                                                          alt=""
                                                          data-for={item.id}
                                                          data-tip={"Not Used"}
                                                      />
                                                  )}
                                              </div>
                                          )}
                                          {hasViewRecom && (
                                              <div className="recom" onClick={() => viewRecommendations(item.recommendation_id)}>
                                                  <i className="fa fa-file-alt" data-for={item.id} data-tip={"View Recommendation"}></i>
                                              </div>
                                          )}
                                          {hasEdit && (
                                              <div className="icon" onClick={() => handleEdit(item)}>
                                                  <i className="fa fa-pencil-alt" data-for={item.id} data-tip={"Edit"}></i>
                                              </div>
                                          )}
                                          {hasDelete && (
                                              <div className="icon" onClick={() => handleDelete(item.id)}>
                                                  <i className="fas fa-trash cursor-pointer" data-for={item.id} data-tip={"Remove"}></i>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                                  <div
                                      className="cnt-area cursor-hand"
                                      //   onClick={() => handleClickImage(item)}
                                  >
                                      <div className="img-section">
                                          <LazyLoadImage alt={`img-${idx}`} onClick={() => handleClickImage(item)} effect="blur" className="img-itm" src={item?.thumb || item?.url} />

                                          {hasCheckBox && (
                                              <>
                                                  {isReportImage ? (
                                                      <label
                                                          class="container-check"
                                                          data-for={item.id}
                                                          data-tip={item.printable ? "Disable in Narrative" : "Enable in Narrative"}
                                                          onClick={() => handleClickImage(item)}
                                                      >
                                                          <input
                                                              type="checkbox"
                                                              checked={item.printable}
                                                              onChange={() => checkIfNarrativeImageUsed(item, !item.printable)}
                                                          />
                                                          <span class="checkmark"></span>
                                                      </label>
                                                  ) : (
                                                      <label class="container-check" data-for={item.id} data-tip="Set as Default"
                                                      onClick={() => handleClickImage(item)}>
                                                          <input
                                                              type="checkbox"
                                                              checked={item.default_image}
                                                              onChange={() => handleSelect(item, !item.default_image)}
                                                          />
                                                          <span class="checkmark"></span>
                                                      </label>
                                                  )}
                                              </>
                                          )}
                                      </div>
                                      <div className="cnt-sec-itm">
                                          {toggleInput.toggleInput === item.id ? (
                                              <>
                                                  {/* {caption.id === item.id &&  */}
                                                  <label htmlFor="">
                                                      <>
                                                          <div>
                                                              <h3 style={{ textTransform: "none", cursor: "pointer" }}>{item?.description || "-"}</h3>
                                                              <textarea
                                                                  className="floating-textarea img-list-float-area"
                                                                  type="text"
                                                                  // maxLength={this.state.captionMaxLength}
                                                                  //   ref={inputRef}
                                                                  value={caption.description}
                                                                  onChange={e => {
                                                                      resetCursor(e);
                                                                      let updatedValue = {};
                                                                      updatedValue = { description: toTitleCase(e.target.value) };
                                                                      setCaption(caption => ({ ...caption, ...updatedValue }));
                                                                  }}
                                                                  //   onBlur={() => setToggleInput("")}
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
                                                                  data-for={item.id}
                                                                  data-tip={
                                                                      "Please Click Enter key to Update<br/>Or<br/>Double Click  to Go Back<br/>"
                                                                  }
                                                              />
                                                          </div>
                                                      </>
                                                  </label>
                                                  {/* } */}
                                              </>
                                          ) : (
                                              <h3
                                                  onDoubleClick={() => handleGetImageId(item.id, item.description)}
                                                  style={{ textTransform: "none", cursor: "pointer" }}
                                                  data-for={item.id}
                                                  html={true}
                                                  data-tip={
                                                      item.description
                                                          ? `Double Click Here to Edit Caption <br/> ${item.description}`
                                                          : "Double Click Here to Add Caption<br/>"
                                                  }
                                              >
                                                  {item?.description || "-"}
                                              </h3>
                                          )}
                                          <div onClick={() => handleClickImage(item)}className="item-sub">File name : {item?.name}</div>
                                          <div onClick={() => handleClickImage(item)}className="item-sub">Trade : {item?.master_image?.trade?.name}</div>
                                          <div onClick={() => handleClickImage(item)}className="item-sub">Building :{item?.master_image?.building?.name}</div>
                                          <div onClick={() => handleClickImage(item)} className="item-sub">
                                              Date Taken : {moment(item?.meta_data?.date_taken).format("dddd, MMMM Do YYYY, h:mm a") || "-"}
                                          </div>
                                      </div>
                                  </div>
                                  <ReactTooltip id={item.id} effect="solid" backgroundColor="#1383D9"  multiline={true} />
                              </div>
                          ))
                        : null}
                </div>
            </InfiniteScroll>
        </>
    );
}

export default ImageList;
