import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactTooltip from "react-tooltip";
import { resetCursor, toTitleCase } from "../../../../config/utils";
import Loader from "../Loader";

function ImageGrid({
    imageData,
    handleSelect,
    handleClickImage,
    hasMore,
    fetchMoreImages,
    hasCheckBox,
    isReportImage,
    checkIfNarrativeImageUsed,
    imagesNotUsedIds,
    hasViewRecom,
    viewRecommendations,
    hasEdit,
    handleEdit,
    updateImageFromInfoImages1,
    handleInputCaptionData,
    hasDelete,
    handleDelete
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
    const moveCaretAtEnd= (e) =>{
        var temp_value = e.target.value
        e.target.value = ''
        e.target.value = temp_value
      }
    return (
        <InfiniteScroll
            dataLength={imageData?.length}
            next={fetchMoreImages}
            hasMore={hasMore}
            height={400}
            scrollThreshold={0.6}
            loader={
                <div className="col-12">
                    <Loader />
                </div>
            }
            className="infinite-scroll"
            endMessage={<p style={{ textAlign: "center" }}>{/* <b>No more data</b> */}</p>}
        >
            <div ref={ref}>
                {imageData?.length
                    ? imageData.map((item, idx) => (
                          <div class="items" key={`img-grid-items-${item.id}-${idx}`}>
                              <div class="drop-sec">
                                  {hasViewRecom && (
                                      <div class="icon-rec" onClick={() => viewRecommendations(item.recommendation_id)}>
                                          <i class="far fa-file-alt" data-for={item.id} data-tip={"View Recommendation"}></i>
                                      </div>
                                  )}
                                  {hasDelete && (
                                      <div class="icon mr-2" onClick={() => handleDelete(item.id)}>
                                          <i class="fa fa-trash" data-for={item.id} data-tip={"Remove"}></i>
                                      </div>
                                  )}
                                  {hasEdit && (
                                      <div class="icon" onClick={() => handleEdit(item)}>
                                          <i class="fa fa-pencil-alt" data-for={item.id} data-tip={"Edit"}></i>
                                      </div>
                                  )}
                              </div>
                              <div class="images">
                                  <LazyLoadImage
                                      onClick={() => handleClickImage(item)}
                                      alt={`img-${idx}`}
                                      effect="blur"
                                      src={`${item?.thumb || item?.url}?${moment(item?.master_image?.updated_at).format()}`}
                                      className="cursor-hand"
                                  />
                                  {hasCheckBox && (
                                      <>
                                          {isReportImage ? (
                                              <label
                                                  class="container-check"
                                                  data-for={item.id}
                                                  data-tip={item.printable ? "Disable in Narrative" : "Enable in Narrative"}
                                              >
                                                  <input
                                                      type="checkbox"
                                                      checked={item.printable}
                                                      onChange={() => checkIfNarrativeImageUsed(item, !item.printable)}
                                                  />
                                                  <span class="checkmark"></span>
                                              </label>
                                          ) : (
                                              <label class="container-check" data-for={item.id} data-tip="Set as Default">
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
                                  {item.hasOwnProperty("printable") && (
                                      <>
                                          {imagesNotUsedIds && !imagesNotUsedIds.includes(item.id) && item.printable ? (
                                              <img
                                                  src="/img/check_green.svg"
                                                  className="no-recom img-ident-icon"
                                                  alt=""
                                                  data-for={item.id}
                                                  data-tip={"Used"}
                                              />
                                          ) : (
                                              <img
                                                  src="/img/check_green red.svg"
                                                  className="no-recom img-ident-icon"
                                                  alt=""
                                                  data-for={item.id}
                                                  data-tip={"Not Used"}
                                              />
                                          )}
                                      </>
                                  )}
                              </div>
                              <div class="cnt-img-sec">
                                  <div class="heading">
                                      {toggleInput.toggleInput === item.id ? (
                                          <>
                                              {/* {caption.id === item.id &&  */}
                                              <label htmlFor="">
                                                  <>
                                                      <div>
                                                          <textarea
                                                              className="floating-textarea"
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
                                                              data-tip={"Please Click Enter key to Update<br/>Or<br/>Double Click  to Go Back<br/>"}
                                                          />
                                                      </div>
                                                  </>
                                              </label>
                                              {/* } */}
                                          </>
                                      ) : (
                                          <h3
                                              onDoubleClick={() => handleGetImageId(item.id, item.description)}
                                              style={{ textTransform: "none" ,cursor:"pointer"}}
                                              data-for={item.id}
                                              html={true}
                                              data-tip={item.description? `Double Click Here to Edit Caption <br/> ${item.description}` : "Double Click Here to Add Caption<br/>"}
                                              
                                          >
                                              {item?.description || "-"}
                                          </h3>
                                      )}
                                  </div>
                                  <div class="cnt-area sec-row" onClick={() => handleClick("")}>
                                      <div class="secs">
                                          <span className="dtl" data-for={item.id} data-tip={item?.name || "-"}>
                                              {item?.name}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                              <ReactTooltip id={item.id} effect="solid" backgroundColor="#1383D9" multiline={true} />
                          </div>
                      ))
                    : null}
            </div>
        </InfiniteScroll>
    );
}

export default ImageGrid;
