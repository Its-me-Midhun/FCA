import React, { Component } from "react";
import { withRouter } from "react-router";
import moment from "moment";
import SortedRecommendationsInfo from "./SortedRecommendationInfo";
import MultiRecommendationInfo from "./MultiRecommendationInfo";

class BasicDetails extends Component {
    render() {
        const {
            basicDetails: {
                name,
                description,
                notes,
                created_at,
                updated_at,
                header_style1,
                header_style2,
                para_style,
                caption_style,
                caption_style1,
                // table_style,

                trade,
                system,
                subsystem,
                recommendations,
                properties,
                recommendation_props,
                multi_recommendation_props
            },
            isHistoryView = false,
            hasEdit = true,
            hasLogView = true,
            selectedProperty,
            cancelForm,
            showEditPage,
            cancelInfoPage,
            activeDetail
            
        } = this.props;
        const { table } = properties;
        return (
            <React.Fragment>
                <div className="tab-active">
                    <div className="otr-edit-delte col-md-12 text-right">
                        {isHistoryView
                            ? hasLogView && (
                                  <span
                                      onClick={() => {
                                          this.props.changeToHistory();
                                      }}
                                      className="edit-icn-bx mr-3"
                                  >
                                      <i className="fas fa-history"></i> View History
                                  </span>
                              )
                            : null}
                        <span
                            onClick={() => {
                                cancelInfoPage();
                            }}
                            className="edit-icn-bx mr-3"
                        >
                            <i className="fas fa-window-close"></i> Close
                        </span>
                        {hasEdit && (
                            <span
                                onClick={() => {
                                    showEditPage(selectedProperty,activeDetail);
                                }}
                                className="edit-icn-bx"
                            >
                                <i className="fas fa-pencil-alt"></i> Edit
                            </span>
                        )}
                    </div>
                    <div className="basic-dtl-otr property-view min-height-dtl">
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Name</h4>
                                <h3>{name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Description</h4>
                                <h3>{description || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Created At</h4>
                                <h3>{created_at ? moment(created_at).format("MM-DD-YYYY h:mm A") : "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Updated At</h4>
                                <h3>{updated_at ? moment(updated_at).format("MM-DD-YYYY h:mm A") : "-"}</h3>
                            </div>
                        </div>
                        <div class="col-md-12 notes-sec p-0">
                            <div class="col-md-12 basic-box main-heading mt-2">
                                <h3>Notes</h3>
                            </div>
                            <div class="basic-box contDtl">{notes || "-"}</div>
                        </div>

                        {/* header */}
                        {this.props.match.params.tab === "sortedRecommendations" ? (
                            <SortedRecommendationsInfo recommendation_props={recommendation_props}/>
                          
                        ) : this.props.match.params.tab === "multiRecommendation" ? (
                           <MultiRecommendationInfo multi_recommendation_props={multi_recommendation_props}/>
                        ) : (
                            <>
                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>Header (Client Template Only)</h3>
                                </div>

                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Client Font Name</h4>
                                        <h3>{properties?.header?.client?.font_family || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Client Font Size</h4>
                                        <h3>{properties?.header?.client?.font_size ? `${properties?.header?.client?.font_size} pt` : ""}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Client Font Color</h4>
                                        <h3>
                                            {properties?.header?.client?.color || "-"}
                                            <span
                                                className="color"
                                                style={{
                                                    backgroundColor: properties?.header?.client?.color ? `#${properties?.header?.client?.color}` : ""
                                                }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Client Font Bold</h4>
                                        <h3>{properties?.header?.client?.bold ? "Yes" : "No"}</h3>
                                    </div>
                                </div>

                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Project Font Name</h4>
                                        <h3>{properties?.header?.project?.font_family || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Project Font Size</h4>
                                        <h3>{properties?.header?.project?.font_size ? `${properties?.header?.project?.font_size} pt` : ""}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Project Font Color</h4>
                                        <h3>
                                            {properties?.header?.project?.color || "-"}
                                            <span
                                                className="color"
                                                style={{
                                                    backgroundColor: properties?.header?.project?.color
                                                        ? `#${properties?.header?.project?.color}`
                                                        : ""
                                                }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Project Font Bold</h4>
                                        <h3>{properties?.header?.project?.bold ? "Yes" : "No"}</h3>
                                    </div>
                                </div>
                                {/* heading */}
                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>Heading</h3>
                                </div>

                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Name</h4>
                                        <h3>{properties?.heading?.font_family || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Size</h4>
                                        <h3>{properties?.heading?.font_size ? `${properties?.heading?.font_size} pt` : ""}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Color</h4>
                                        <h3>
                                            {properties?.heading?.color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: properties?.heading?.color ? `#${properties?.heading?.color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Bold</h4>
                                        <h3>{properties?.heading?.bold ? "Yes" : "No"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Alignment</h4>
                                        <h3>{properties?.heading?.alignment || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-9 basic-box"></div>
                                {/* chart outer frame */}
                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>Chart Outer Frame</h3>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Visible</h4>
                                        <h3>{properties?.chart?.frame ? "Yes" : "No"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-9 basic-box"></div>
                                {properties?.chart?.frame ? (
                                    <>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Frame Width</h4>
                                                <h3>{properties?.chart?.frame_props?.size ? `${properties?.chart?.frame_props?.size} Pt` : "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Frame Padding</h4>
                                                <h3>{properties?.chart?.frame_props?.space ? `${properties?.chart?.frame_props?.space} Pt` : "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Frame Color</h4>
                                                <h3>
                                                    {properties?.chart?.frame_props?.color || "-"}
                                                    <span
                                                        className="color"
                                                        style={{
                                                            backgroundColor: properties?.chart?.frame_props?.color
                                                                ? `#${properties?.chart?.frame_props?.color}`
                                                                : null
                                                        }}
                                                    ></span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Frame Style</h4>
                                                <h3>{properties?.chart?.frame_props?.val || "-"}</h3>
                                            </div>
                                        </div>
                                    </>
                                ) : null}

                                {/* x axis */}
                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>X-Axis</h3>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Size</h4>
                                        <h3>{properties?.x_axis?.font_size ? `${properties?.x_axis?.font_size} px` : "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Color</h4>
                                        <h3>
                                            {properties?.x_axis?.color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: properties?.x_axis?.color ? `#${properties?.x_axis?.color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-6 basic-box"></div>

                                {/* y axis */}
                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>Y-Axis</h3>
                                </div>

                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Size</h4>
                                        <h3>{properties?.y_axis?.font_size ? `${properties?.y_axis?.font_size || "-"} px` : "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Color</h4>
                                        <h3>
                                            {properties?.y_axis?.color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: properties?.y_axis?.color ? `#${properties?.y_axis?.color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-6 basic-box"></div>

                                {/* data labels */}
                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>Data Labels</h3>
                                </div>

                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Size</h4>
                                        <h3>{properties?.data_labels?.font_size ? `${properties?.data_labels?.font_size} px` : "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Font Color</h4>
                                        <h3>
                                            {properties?.data_labels?.color || "-"}
                                            <span
                                                className="color"
                                                style={{
                                                    backgroundColor: properties?.data_labels?.color ? `#${properties?.data_labels?.color}` : ""
                                                }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-6 basic-box"></div>

                                {/* legends */}
                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>Legends</h3>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Visible</h4>
                                        <h3>{properties?.legend?.show_legend ? "Yes" : "No"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-9 basic-box"></div>
                                {properties?.legend?.show_legend ? (
                                    <>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Font Size</h4>
                                                <h3>{properties?.legend?.font_size ? `${properties?.legend?.font_size} px` : "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Font Color</h4>
                                                <h3>
                                                    {properties?.legend?.font_color || "-"}
                                                    <span
                                                        className="color"
                                                        style={{
                                                            backgroundColor: properties?.legend?.font_color
                                                                ? `#${properties?.legend?.font_color}`
                                                                : ""
                                                        }}
                                                    ></span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Font Bold</h4>
                                                <h3>{properties?.legend?.bold ? "Yes" : "No"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box"></div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Background Color</h4>
                                                <h3>
                                                    {properties?.legend?.backgroundColor || "-"}
                                                    <span
                                                        className="color"
                                                        style={{
                                                            backgroundColor: properties?.legend?.backgroundColor
                                                                ? `#${properties?.legend?.backgroundColor}`
                                                                : ""
                                                        }}
                                                    ></span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Border Color</h4>
                                                <h3>
                                                    {properties?.legend?.borderColor || "-"}
                                                    <span className="color" style={{ backgroundColor: `#${properties?.legend?.borderColor}` }}></span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Border Width</h4>
                                                <h3>{properties?.legend?.borderWidth ? `${properties?.legend?.borderWidth} px` : "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Border Radius</h4>
                                                <h3>{properties?.legend?.borderRadius ? `${properties?.legend?.borderRadius} px` : "-"}</h3>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>Custom Legends</h3>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Visible</h4>
                                        <h3>{properties?.custom_legend?.show_legend ? "Yes" : "No"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-9 basic-box"></div>
                                {properties?.custom_legend?.show_legend ? (
                                    <>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Header Font Name</h4>
                                                <h3>{properties?.custom_legend?.legend_heading?.font_family || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Header Font Size</h4>
                                                <h3>{`${properties?.custom_legend?.legend_heading?.font_size} pt` || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Header Font Color</h4>
                                                <h3>
                                                    {properties?.custom_legend?.legend_heading?.color || "-"}
                                                    <span
                                                        className="color"
                                                        style={{ backgroundColor: `#${properties?.custom_legend?.legend_heading?.color}` }}
                                                    ></span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Header Font Bold</h4>
                                                <h3>{properties?.custom_legend?.legend_heading?.bold ? "Yes" : "No"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Header Font Alignment</h4>
                                                <h3>{properties?.custom_legend?.legend_heading?.alignment || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-9 basic-box"></div>

                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Value Font Name</h4>
                                                <h3>{properties?.custom_legend?.legend_value?.font_family || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Value Font Size</h4>
                                                <h3>{`${properties?.custom_legend?.legend_value?.font_size} pt` || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Value Font Color</h4>
                                                <h3>
                                                    {properties?.custom_legend?.legend_value?.color || "-"}
                                                    <span
                                                        className="color"
                                                        style={{ backgroundColor: `#${properties?.custom_legend?.legend_value?.color}` }}
                                                    ></span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Value Font Bold</h4>
                                                <h3>{properties?.custom_legend?.legend_value?.bold ? "Yes" : "No"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Value Font Alignment</h4>
                                                <h3>{properties?.custom_legend?.legend_value?.alignment || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-9 basic-box"></div>
                                    </>
                                ) : null}
                                {/* <div className="col-md-3 basic-box"></div> */}

                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>Total</h3>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Visible</h4>
                                        <h3>{properties?.total?.show_total ? "Yes" : "No"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-9 basic-box"></div>

                                {properties?.total?.show_total ? (
                                    <>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Font Name</h4>
                                                <h3>{properties?.total?.font_family || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Font Size</h4>
                                                <h3>{`${properties?.total?.font_size} pt` || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Font Color</h4>
                                                <h3>
                                                    {properties?.total?.color || "-"}
                                                    <span
                                                        className="color"
                                                        style={{ backgroundColor: properties?.total?.color ? `#${properties?.total?.color}` : null }}
                                                    ></span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Font Bold</h4>
                                                <h3>{properties?.total?.bold ? "Yes" : "No"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-3 basic-box">
                                            <div className="codeOtr">
                                                <h4>Font Alignment</h4>
                                                <h3>{properties?.total?.alignment || "-"}</h3>
                                            </div>
                                        </div>
                                        <div className="col-md-9 basic-box"></div>
                                    </>
                                ) : null}
                                <div className="col-md-12 basic-box main-heading mt-2">
                                    <h3>Table Properties (Chart Data Export Only)</h3>
                                </div>

                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Table Style</h4>
                                        <h3>{table?.table_style || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Table Column Width</h4>
                                        <h3>{`${table?.col_width} inch` || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-6 basic-box"></div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Custom Heading Font Name</h4>
                                        <h3>{table?.custom_head?.font_family || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Custom Heading Font Size</h4>
                                        <h3>{table?.custom_head?.font_size ? `${table?.custom_head?.font_size} pt` : "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Custom Heading Font Color</h4>
                                        <h3>
                                            {table?.custom_head?.bg_color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: table?.custom_head?.bg_color ? `#${table?.custom_head?.font_color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Custom Heading Background Color</h4>
                                        <h3>
                                            {table?.custom_head?.bg_color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: table?.custom_head?.bg_color ? `#${table?.custom_head?.bg_color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Custom Heading Alignment</h4>
                                        <h3>{table?.custom_head?.alignment || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-9 basic-box"></div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Heading Font Name</h4>
                                        <h3>{table?.heading?.font_family || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Heading Font Size</h4>
                                        <h3>{table?.heading?.font_size || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4> Heading Font Color</h4>
                                        <h3>
                                            {table?.heading?.font_color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: table?.heading?.font_color ? `#${table?.heading?.font_color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Heading Background Color</h4>
                                        <h3>
                                            {table?.heading?.bg_color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: table?.heading?.bg_color ? `#${table?.heading?.bg_color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4> Heading Alignment</h4>
                                        <h3>{table?.heading?.alignment || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-9 basic-box"></div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Data Font Name</h4>
                                        <h3>{table?.data?.font_family || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Data Font Size</h4>
                                        <h3>{table?.data?.font_size || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Data Font Color</h4>
                                        <h3>
                                            {table?.data?.font_color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: table?.data?.font_color ? `#${table?.data?.font_color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Data Alignment</h4>
                                        <h3>{table?.data?.alignment || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Sub Total Font Name</h4>
                                        <h3>{table?.sub_total?.font_family || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Sub TotalFont Size</h4>
                                        <h3>{table?.sub_total?.font_size || "-"}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Sub Total Font Color</h4>
                                        <h3>
                                            {table?.sub_total?.font_color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: table?.sub_total?.font_color ? `#${table?.sub_total?.font_color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4>Sub Total Background Color</h4>
                                        <h3>
                                            {table?.sub_total?.bg_color || "-"}
                                            <span
                                                className="color"
                                                style={{ backgroundColor: table?.sub_total?.bg_color ? `#${table?.sub_total?.bg_color}` : "" }}
                                            ></span>
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4> Sub Total Alignment</h4>
                                        <h3>{table?.sub_total?.alignment || "-"}</h3>
                                    </div>
                                </div>

                                {/* <div className="col-md-3 basic-box">
                                    <div className="codeOtr">
                                        <h4> Font Size</h4>
                                        <h3>{table?.data?.font_size || "-"}</h3>
                                    </div>
                                </div> */}
                                <div className="col-md-9 basic-box"></div>
                            </>
                        )}
                    </div>
                </div>
                <div className="row mt-2"></div>
            </React.Fragment>
        );
    }
}
export default withRouter(BasicDetails);
