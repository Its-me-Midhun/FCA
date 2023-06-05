import React, { Component, Fragment } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { BandTypes } from "../../constants";
import ImageBand from "./ImageBand";
import InsertEditorBand from "./InsertEditorBand";
import RecommendationBand from "./RecommendationBand";
import TextBand from "./TextBand";
import ReportNoteBand from "./ReportNoteBand";
import ChartBand from "./ChartBand";

export default class ViewOnlyNarrative extends Component {
    render() {
        const { narratives } = this.props;
        return (
            <div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable isDropDisabled={true} droppableId="droppable-2">
                        {(provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="tab-overflow-hght">
                                {narratives?.length
                                    ? narratives.map((item, index) => (
                                          <Fragment key={index}>
                                              {item.type === BandTypes.textBand ? (
                                                  <TextBand index={index} editorData={item} />
                                              ) : item.type === BandTypes.reportNoteBand ? (
                                                  <ReportNoteBand index={index} editorData={item} />
                                              ) : item.type === BandTypes.singleImageBand ? (
                                                  <ImageBand index={index} item={item} />
                                              ) : item.type === BandTypes.doubleImageBand ? (
                                                  <ImageBand index={index} item={item} />
                                              ) : item.type === BandTypes.insertBand ? (
                                                  <InsertEditorBand index={index} editorData={item.data[0]} />
                                              ) : item.type === BandTypes.chartBand ? (
                                                  <ChartBand index={index} editorData={item.data[0]} />
                                              ) : item.type === BandTypes.recommendationBand ? (
                                                  <RecommendationBand index={index} editorData={item} />
                                              ) : null}
                                          </Fragment>
                                      ))
                                    : null}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}
