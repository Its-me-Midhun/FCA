import React, { Component } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import "react-lazy-load-image-component/src/effects/blur.css";
import Draggable from "react-draggable";

class ImageSelectModal extends Component {
    state = {
        selectedImage: null,
        selectedFilter: "notUsed"
    };

    componentDidMount = async () => {
        await this.refreshImageList();
    };

    refreshImageList = async () => {
        const {
            narratives,
            selectedBand: { index, bandIdx }
        } = this.props;
        const selectedImage = narratives[index]?.data[bandIdx] || null;

        await this.setState({
            selectedImage
        });
        this.props.imageFilterHandler(this.state.selectedFilter);
    };

    handleFilter = value => {
        this.setState({ selectedFilter: value });
        this.props.imageFilterHandler(value);
    };

    render() {
        const { selectedImage } = this.state;
        const { isInsert, isLoading, imageList = [], imageRecommendationList = [] } = this.props;
        return (
            <div
                class="modal slt-img-modl narr"
                style={{ display: "block" }}
                id="Modal-region"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <Draggable positionOffset={{ x: "0%", y: "50%" }}>
                    <div>
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">
                                        {isInsert ? "Select Table" : "Select Image"}
                                    </h5>
                                    <div class="drp-sel-lz-img">
                                        <select
                                            class="form-control"
                                            value={this.state.selectedFilter}
                                            onChange={e => this.handleFilter(e.target.value)}
                                        >
                                            <option value="all">All</option>
                                            <option value="notUsed">Not Used</option>
                                        </select>
                                    </div>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                                    <div class="modal-body region-otr build-type-mod">
                                        {imageList.length || imageRecommendationList.length ? (
                                            <div className="im-outer-scroll">
                                                {!isInsert && (
                                                    <div className="im-rec-outer">
                                                        {!isInsert && imageRecommendationList.length ? (
                                                            <span class="img-select-header">Images - Recommendations</span>
                                                        ) : null}
                                                        <div
                                                            className={`img-rec-inner ${
                                                                imageList.length && imageRecommendationList.length ? "brd-btm" : ""
                                                            }`}
                                                        >
                                                            {imageRecommendationList.length
                                                                ? imageRecommendationList?.map(item => (
                                                                      <>
                                                                          <div class="img-sec" key={item.id}>
                                                                              <div
                                                                                  class={`itm ${selectedImage?.id === item?.id ? "slted" : ""}`}
                                                                                  onClick={() => this.setState({ selectedImage: item })}
                                                                              >
                                                                                  <LazyLoadImage
                                                                                      src={item.url}
                                                                                      height="50"
                                                                                      width="50"
                                                                                      effect="blur"
                                                                                  />
                                                                                  <div
                                                                                      class={`${
                                                                                          selectedImage?.id === item?.id ? "sl-overlay" : "name"
                                                                                      }`}
                                                                                  >
                                                                                      {selectedImage?.id === item?.id ? (
                                                                                          <div class="tic">
                                                                                              <img src="/img/tic-green.svg" />
                                                                                          </div>
                                                                                      ) : (
                                                                                          <h3>{item.description} </h3>
                                                                                      )}
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                      </>
                                                                  ))
                                                                : null}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="im-add-outer">
                                                    {!isInsert && imageList.length ? (
                                                        <span class="img-select-header">Images - Additional</span>
                                                    ) : null}
                                                    <div className="img-rec-inner">
                                                        {imageList.length
                                                            ? imageList?.map(item => (
                                                                  <>
                                                                      <div class="img-sec" key={item.id}>
                                                                          <div
                                                                              class={`itm ${selectedImage?.id === item?.id ? "slted" : ""}`}
                                                                              onClick={() => this.setState({ selectedImage: item })}
                                                                          >
                                                                              <LazyLoadImage src={item.url} height="50" width="50" effect="blur" />
                                                                              <div
                                                                                  class={`${selectedImage?.id === item?.id ? "sl-overlay" : "name"}`}
                                                                              >
                                                                                  {selectedImage?.id === item?.id ? (
                                                                                      <div class="tic">
                                                                                          <img src="/img/tic-green.svg" />
                                                                                      </div>
                                                                                  ) : (
                                                                                      <h3>{item.description} </h3>
                                                                                  )}
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  </>
                                                              ))
                                                            : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div class="no-img">
                                                <img src="/img/Group 6.svg" />
                                                {isInsert ? "Tables not available" : "Images not available"}
                                            </div>
                                        )}
                                        {imageList.length || imageRecommendationList.length ? (
                                            <div class="btn-sec">
                                                <button
                                                    disabled={!selectedImage}
                                                    className={`btn btn-slt ${!selectedImage ? "cursor-diabled" : ""}`}
                                                    onClick={() => this.props.handleSelectedImage(selectedImage)}
                                                >
                                                    Select
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </LoadingOverlay>
                            </div>
                        </div>
                    </div>
                </Draggable>
            </div>
        );
    }
}

export default ImageSelectModal;
