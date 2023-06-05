import React, { Component, Fragment } from "react";

import ImageSelectModal from "./ImageSelectModal";
import ChartSelectModal from "./ChartSelectModal";
import Portal from "../../common/components/Portal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ImageBand from "./narratives/ImageBand";
import TextBand from "./narratives/TextBand";
import ReportNoteBand from "./narratives/ReportNoteBand";
import { BandTypes, SPECIAL_REPORT_NARRATABLES } from "../constants";
import RecommendationBand from "./narratives/RecommendationBand";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import qs from "query-string";
import { withRouter } from "react-router-dom";
import InsertBand from "./narratives/InsertBand";
import ChartBand from "./narratives/ChartBand";
import InsertEditorBand from "./narratives/InsertEditorBand";
import ExportHistory from "./narratives/ExportHistory";
import Logs from "./narratives/Logs";

class Narrative extends Component {
    state = {
        showImageSelectModal: false,
        renderChartSelectModal: false,
        selectedBand: {
            index: null,
            bandIdx: null
        },
        isLoading: true,
        isInsert: false,
        imageList: [],
        imageRecommendationList: [],
        insertList: []
    };

    componentDidMount = async () => {
        await this.refreshImageList();
        await this.refreshChartList();
    };

    componentDidUpdate = async prevProps => {
        if (
            qs.parse(prevProps.location?.search)?.narratable_id != qs.parse(this.props.location?.search)?.narratable_id ||
            prevProps.match?.params?.tab != this.props.match?.params?.tab
        ) {
            this.setState({ isLoading: true });
            await this.refreshImageList();
            await this.refreshChartList();
        }
    };

    refreshChartList = async () => {
        await this.props.getNarrativeChart();
    };

    refreshImageList = async () => {
        await this.props.getAllInserts();
        await this.props.getAllImages();
        if (this.props.currentSection === "SubSystem") {
            await this.props.getAllRecommendationImages();
        }
        this.imageFilterHandler("notUsed");
        this.setState({ isLoading: false });
    };

    handleSelectedImage = image => {
        const {
            selectedBand: { index, bandIdx }
        } = this.state;

        this.props.setNarrativeData(image, index, bandIdx);
        this.setState({ showImageSelectModal: false });
    };

    handleSelectedChart = chart => {
        const {
            selectedBand: { index, bandIdx }
        } = this.state;

        this.props.setNarrativeData(chart, index, bandIdx);
        this.setState({ showChartSelectModal: false });
    };

    imageFilterHandler = value => {
        const { imageResponse, recommendationImageResponse, insertResponse } = this.props;
        const printableImageList = imageResponse?.filter(img => img.printable);
        const printableImageRecomList = recommendationImageResponse?.filter(img => img.printable);

        // eslint-disable-next-line default-case
        switch (value) {
            case "all":
                this.setState({
                    imageList: printableImageList,
                    imageRecommendationList: printableImageRecomList,
                    insertList: insertResponse
                });
                break;
            case "notUsed":
                if (this.state.isInsert) {
                    const filterInserts = this.props.filterUsedInserts(insertResponse);
                    this.setState({ insertList: filterInserts });
                } else {
                    const filteredImgs = this.props.filterUsedImages(printableImageList);
                    const filteredRecomImgs = this.props.filterUsedImages(printableImageRecomList);
                    this.setState({ imageList: filteredImgs, imageRecommendationList: filteredRecomImgs });
                }
                break;
        }
    };

    handleNarrativeDataChange = (data, index, bandIdx = 0) => {
        this.props.setNarrativeData(data, index, bandIdx);
    };

    renderImageSelectModal = () => {
        const { showImageSelectModal, selectedBand, isInsert, imageList, imageRecommendationList, insertList } = this.state;
        if (!showImageSelectModal) return null;
        return (
            <Portal
                body={
                    <ImageSelectModal
                        onCancel={() => this.setState({ showImageSelectModal: false })}
                        imageList={isInsert ? insertList : imageList}
                        imageRecommendationList={isInsert ? [] : imageRecommendationList}
                        handleSelectedImage={this.handleSelectedImage}
                        isLoading={this.state.isLoading}
                        selectedBand={selectedBand}
                        narratives={this.props.narratives}
                        isInsert={isInsert}
                        imageFilterHandler={this.imageFilterHandler}
                    />
                }
                onCancel={() => this.setState({ showImageSelectModal: false })}
            />
        );
    };

    renderChartSelectModal = () => {
        const { showChartSelectModal, selectedBand, isInsert, imageList, imageRecommendationList, insertList } = this.state;
        const { chartList, getChartDetails, graphData } = this.props;
        if (!showChartSelectModal) return null;
        return (
            <Portal
                body={
                    <ChartSelectModal
                        onCancel={() => this.setState({ showChartSelectModal: false })}
                        chartList={chartList}
                        handleSelectedChart={this.handleSelectedChart}
                        isLoading={this.state.isLoading}
                        selectedBand={selectedBand}
                        narratives={this.props.narratives}
                        isInsert={isInsert}
                        getChartDetails={getChartDetails}
                        graphData={graphData}
                        imageFilterHandler={this.imageFilterHandler}
                    />
                }
                onCancel={() => this.setState({ showChartSelectModal: false })}
            />
        );
    };

    openImageSelectModal = (bandIdx, index) => {
        this.setState({ selectedBand: { bandIdx, index }, showImageSelectModal: true, isInsert: false });
    };

    openChartSelectModal = (bandIdx, index) => {
        this.setState({ selectedBand: { bandIdx, index }, showChartSelectModal: true });
    };

    openInsertSelectModal = (bandIdx, index) => {
        this.setState({ selectedBand: { bandIdx, index }, showImageSelectModal: true, isInsert: true });
    };

    onDragEnd = result => {
        if (!result.destination || !this.props.hasEdit || !this.props.hasCreate) {
            return;
        }
        this.props.onDragEnd(result);
    };

    render() {
        const {
            narratives,
            isLoading,
            narrativeEnd,
            narrativeCompleted,
            narrativeId,
            isUnSaved,
            showExportHistory,
            exportHistoryData,
            currentSection,
            hasDelete,
            hasExport,
            hasMarkAsComplete,
            hasCreate,
            hasEdit,
            showLogs,
            logData,
            narrativeTimes,
            isEmptyNarrative,
            globalCompleted,
            childrenCompleted,
            hasLogView
        } = this.props;

        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                {showExportHistory ? (
                    <ExportHistory
                        currentSection={currentSection}
                        getExportHistory={this.props.getExportHistory}
                        logData={exportHistoryData}
                        toggleExportHistory={this.props.toggleExportHistory}
                        updateExportHistoryNote={this.props.updateExportHistoryNote}
                        globalCompleted={globalCompleted}
                    />
                ) : showLogs ? (
                    <Logs
                        logData={logData.logs}
                        count={logData.count}
                        getLogs={this.props.getLogs}
                        toggleLogs={this.props.toggleLogs}
                        updateLogNote={this.props.updateLogNote}
                    />
                ) : (
                    <>
                        {this.renderImageSelectModal()}
                        {this.renderChartSelectModal()}
                        {narrativeId && (
                            <div className="cc-date">
                                <div className="cc-itm">{`Created At: ${narrativeTimes.created_at ?? "N/A"}`}</div>
                                <div className="cc-itm">{`Modified At: ${narrativeTimes.updated_at ?? "N/A"}`}</div>
                                <div className="cc-itm">{`Completed At: ${narrativeTimes.completed_at ?? "N/A"}`}</div>
                            </div>
                        )}
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="droppable-1">
                                {(provided, snapshot) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="tab-overflow-hght">
                                        {narratives?.length
                                            ? narratives.map((item, index) => (
                                                  <Fragment key={index}>
                                                      {item.type === BandTypes.textBand ? (
                                                          <TextBand
                                                              index={index}
                                                              editorData={item}
                                                              handleChange={this.handleNarrativeDataChange}
                                                              deleteBand={() => this.props.deleteBand(index)}
                                                              hasEdit={hasEdit}
                                                              hasCreate={hasCreate}
                                                          />
                                                      ) : item.type === BandTypes.reportNoteBand ? (
                                                          <ReportNoteBand
                                                              index={index}
                                                              editorData={item}
                                                              handleChange={this.handleNarrativeDataChange}
                                                              deleteBand={() => this.props.deleteBand(index)}
                                                              hasEdit={hasEdit}
                                                              hasCreate={hasCreate}
                                                          />
                                                      ) : item.type === BandTypes.singleImageBand ? (
                                                          <ImageBand
                                                              index={index}
                                                              item={item}
                                                              deleteBand={() => this.props.deleteBand(index)}
                                                              openImageSelectModal={this.openImageSelectModal}
                                                              handleChange={this.handleNarrativeDataChange}
                                                              hasEdit={hasEdit}
                                                              hasCreate={hasCreate}
                                                          />
                                                      ) : item.type === BandTypes.doubleImageBand ? (
                                                          <ImageBand
                                                              index={index}
                                                              item={item}
                                                              deleteBand={() => this.props.deleteBand(index)}
                                                              openImageSelectModal={this.openImageSelectModal}
                                                              handleChange={this.handleNarrativeDataChange}
                                                              hasEdit={hasEdit}
                                                              hasCreate={hasCreate}
                                                          />
                                                      ) : item.type === BandTypes.insertBand ? (
                                                          <>
                                                              {item.data[0]?.id ? (
                                                                  //showing the band with table data after selection
                                                                  <InsertEditorBand
                                                                      index={index}
                                                                      handleChange={this.handleNarrativeDataChange}
                                                                      deleteBand={() => this.props.deleteBand(index)}
                                                                      openImageSelectModal={this.openInsertSelectModal}
                                                                      editorData={item.data[0]}
                                                                      hasEdit={hasEdit}
                                                                      hasCreate={hasCreate}
                                                                  />
                                                              ) : (
                                                                  // showing the table band before selection
                                                                  <InsertBand
                                                                      index={index}
                                                                      handleChange={this.handleNarrativeDataChange}
                                                                      deleteBand={() => this.props.deleteBand(index)}
                                                                      openImageSelectModal={this.openInsertSelectModal}
                                                                      item={item}
                                                                      hasEdit={hasEdit}
                                                                      hasCreate={hasCreate}
                                                                  />
                                                              )}
                                                          </>
                                                      ) : item.type === BandTypes.chartBand ? (
                                                          <ChartBand
                                                              index={index}
                                                              handleChange={this.handleNarrativeDataChange}
                                                              deleteBand={() => this.props.deleteBand(index)}
                                                              openChartSelectModal={this.openChartSelectModal}
                                                              item={item}
                                                              hasEdit={hasEdit}
                                                              hasCreate={hasCreate}
                                                          />
                                                      ) : item.type === BandTypes.recommendationBand ? (
                                                          <RecommendationBand
                                                              index={index}
                                                              handleChange={this.handleNarrativeDataChange}
                                                              deleteBand={() => this.props.deleteBand(index)}
                                                              editorData={item}
                                                              hasEdit={hasEdit}
                                                              hasCreate={hasCreate}
                                                          />
                                                      ) : null}
                                                  </Fragment>
                                              ))
                                            : null}
                                        <div ref={narrativeEnd} className="dummy-div" />
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <div className="w-100 text-right">
                            {hasDelete && narrativeId && !isEmptyNarrative ? (
                                <button className={`btn btn-danger ml-auto`} onClick={() => this.props.deleteNarrative()}>
                                    Delete
                                </button>
                            ) : null}
                            {isUnSaved ? (
                                <button disabled={!isUnSaved} className="btn btn-secondary ml-2" onClick={() => this.props.discardChanges()}>
                                    Discard Changes
                                </button>
                            ) : null}
                            <button
                                disabled={!isUnSaved}
                                className={`btn btn-secondary ml-2 ${!isUnSaved ? "cursor-diabled" : ""}`}
                                onClick={() => this.props.saveDoc()}
                            >
                                Save
                            </button>
                            {narrativeId && (
                                <>
                                    {hasLogView && (
                                        <button className="btn btn-secondary ml-2" onClick={() => this.props.toggleLogs()}>
                                            View Narrative Editing History
                                        </button>
                                    )}
                                    <button className="btn btn-secondary ml-2" onClick={() => this.props.toggleExportHistory()}>
                                        View Export History
                                    </button>
                                    {hasExport && !isEmptyNarrative && (
                                        <button
                                            disabled={!narratives.length}
                                            className={`btn btn-secondary ml-2 ${!narratives.length ? "cursor-diabled" : ""}`}
                                            onClick={() => this.props.exportReport("partial")}
                                        >
                                            <i className="fas fa-solid fa-file-word" style={{ marginRight: "8px" }}></i>
                                            {currentSection !== "SubSystem" ? "Export Word (Local)" : "Export Word"}
                                        </button>
                                    )}
                                </>
                            )}
                            {hasExport && currentSection !== "SubSystem" && (
                                <button
                                    disabled={!narratives.length}
                                    className={`btn btn-secondary ml-2 ${!narratives.length ? "cursor-diabled" : ""}`}
                                    onClick={() => this.props.exportReport("whole")}
                                >
                                    <i className="fas fa-solid fa-file-word" style={{ marginRight: "8px" }}></i>
                                    Export Word (Global)
                                </button>
                            )}

                            {hasMarkAsComplete && (
                                <>
                                    <button
                                        disabled={isUnSaved || narrativeCompleted}
                                        className={`btn btn-primary ml-2 ${
                                            narrativeCompleted ? "btn-completed cursor-diabled" : isUnSaved ? "cursor-diabled" : ""
                                        }`}
                                        onClick={() => this.props.markAsComplete("local_complete")}
                                    >
                                        {narrativeCompleted
                                            ? currentSection === "SubSystem"
                                                ? "Completed"
                                                : "Completed (Local)"
                                            : currentSection === "SubSystem"
                                            ? "Mark As Complete"
                                            : "Mark As Complete (Local)"}
                                    </button>
                                    {currentSection !== "SubSystem" && (
                                        <button
                                            disabled={isUnSaved || globalCompleted}
                                            className={`btn btn-primary ml-2 ${
                                                globalCompleted ? "btn-completed cursor-diabled" : isUnSaved ? "cursor-diabled" : ""
                                            }`}
                                            onClick={() => this.props.markAsComplete("complete")}
                                        >
                                            {globalCompleted ? "Completed (Global)" : "Mark As Complete (Global)"}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </LoadingOverlay>
        );
    }
}
export default withRouter(Narrative);
