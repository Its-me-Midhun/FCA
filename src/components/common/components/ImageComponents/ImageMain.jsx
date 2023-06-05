import React, { Component } from "react";
import ImageGrid from "./ImageGrid";
import ImageList from "./ImageList";

import "../../../../assets/css/image-management.css";
import "../../../../assets/css/image-management-listing.css";
import MasterFilter from "./MasterFilter";
import BottomControls from "./BottomControls";
class Imagemain extends Component {
    state = {
        isGridView: true
    };

    setGridView = async bool => {
        await this.setState({ isGridView: bool });
    };
    render() {
        const { isGridView } = this.state;
        const {
            imageList,
            imageParams,
            totalCount,
            fetchMoreImages,
            handleSelectImage,
            handleClickImage,
            handleLimitChange,
            hasCheckBox,
            isReportImage,
            checkIfNarrativeImageUsed,
            imagesNotUsedIds,
            hasMore,
            hasViewRecom = false,
            viewRecommendations,
            hasEdit = false,
            handleEdit,
            handleDelete,
            hasDelete = false,
            updateImage,
            handleInputCaptionData
        } = this.props;
        return (
            <div className={`dtl-sec col-md-12 image-manage info-images p-0`} id="main">
                <div className="filtr-otr">
                    <div className="flt-area-new">
                        <MasterFilter setGridView={this.setGridView} />
                    </div>
                </div>
                {isGridView ? (
                    <div className={"image-sec"}>
                        <ImageGrid
                            imageData={imageList}
                            handleSelect={handleSelectImage}
                            fetchMoreImages={fetchMoreImages}
                            handleClickImage={handleClickImage}
                            hasMore={hasMore}
                            hasCheckBox={hasCheckBox}
                            isReportImage={isReportImage}
                            checkIfNarrativeImageUsed={checkIfNarrativeImageUsed}
                            imagesNotUsedIds={imagesNotUsedIds}
                            hasViewRecom={hasViewRecom}
                            viewRecommendations={viewRecommendations}
                            hasEdit={hasEdit}
                            handleEdit={handleEdit}
                            updateImageFromInfoImages1={updateImage}
                            handleInputCaptionData={handleInputCaptionData}
                            handleDelete={handleDelete}
                            hasDelete={hasDelete}
                        />
                    </div>
                ) : (
                    <div className={"cnt-sec"}>
                        <ImageList
                            imageData={imageList}
                            handleSelect={handleSelectImage}
                            fetchMoreImages={fetchMoreImages}
                            handleClickImage={handleClickImage}
                            hasMore={hasMore}
                            hasCheckBox={hasCheckBox}
                            isReportImage={isReportImage}
                            checkIfNarrativeImageUsed={checkIfNarrativeImageUsed}
                            imagesNotUsedIds={imagesNotUsedIds}
                            hasViewRecom={hasViewRecom}
                            viewRecommendations={viewRecommendations}
                            hasEdit={hasEdit}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            hasDelete={hasDelete}
                            updateImageFromInfoImages1={updateImage}
                            handleInputCaptionData={handleInputCaptionData}
                        />
                    </div>
                )}
                <BottomControls
                    handleLimitChange={handleLimitChange}
                    loadedCount={imageList.length}
                    totalCount={totalCount}
                    limit={imageParams.limit}
                />
            </div>
        );
    }
}

export default Imagemain;
