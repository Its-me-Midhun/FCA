import React from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GridItem } from "./GridItem";
import { VariableSizeList as List } from "react-window";
import Row from "./Row";
import InfiniteLoader from "react-window-infinite-loader";
import ReactTooltip from "react-tooltip";

function ImageGrid({
    imageData,
    showSelectBox,
    selectedImages,
    handleMultiSelectImage,
    viewImageModal,
    handleEdit,
    handleDelete,
    hasMore,
    fetchMoreImages,
    isAssignView,
    hasEdit,
    hasDelete,
    handleFavClick,
    viewRecommendations,
    height,
    width,
    handleInputCaptionData,
    viewAssets,
    listRef,
    touchedImageId,
    isSmartChartView
}) {
    const cardHeight = 266;
    const columnCount = isAssignView ? 6 : 5;
    const rowCount = Math.ceil(imageData.length / columnCount);
    const getRowHeight = index => {
        return cardHeight + 6;
    };
    const isItemLoaded = index => !hasMore || index < rowCount;
    return (
        <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={imageData.length} loadMoreItems={fetchMoreImages}>
            {({ onItemsRendered, ref }) => (
                <>
                    <ReactTooltip
                        id="image-grid"
                        effect="solid"
                        place="top"
                        backgroundColor="#1383D9"
                        getContent={dataTip => dataTip?.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                        html={true}
                        multiline={true}
                    />
                    <List
                        className="list"
                        width={width}
                        height={height}
                        itemData={{
                            imageData,
                            showSelectBox,
                            selectedImages,
                            handleMultiSelectImage,
                            viewImageModal,
                            handleEdit,
                            handleDelete,
                            hasMore,
                            fetchMoreImages,
                            isAssignView,
                            hasEdit,
                            hasDelete,
                            handleFavClick,
                            viewRecommendations,
                            height,
                            width,
                            handleInputCaptionData,
                            viewAssets,
                            touchedImageId
                        }}
                        ref={listRef}
                        itemCount={rowCount}
                        itemSize={getRowHeight}
                        estimatedItemSize={cardHeight}
                        onItemsRendered={onItemsRendered}
                    >
                        {({ index, style, data }) => {
                            const dataIndex = index;
                            const columnIndices = Array(Math.min(columnCount, imageData.length - dataIndex * columnCount))
                                .fill(dataIndex * columnCount)
                                .map((base, i) => base + i);
                            return (
                                <Row style={style}>
                                    {columnIndices.map(columnIndex => (
                                        <GridItem index={columnIndex} data={data} isSmartChartView={isSmartChartView} />
                                    ))}
                                </Row>
                            );
                        }}
                    </List>
                </>
            )}
        </InfiniteLoader>
    );
}

export default React.memo(ImageGrid);
