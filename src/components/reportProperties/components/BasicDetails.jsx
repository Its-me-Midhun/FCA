import React, { Component } from "react";
import { withRouter } from "react-router";
class BasicDetails extends Component {
    render() {
        const {
            basicDetails: {
                name,
                description,
                notes,
                created_at,
                updated_at,
                header_style1: { trade, system, subsystem },
                header_style2: { recommendations },
                para_style,
                caption_style,
                caption_style1,
                table_style
            },
            isHistoryView = false,
            hasEdit = true,
            hasLogView = true,
            selectedProperty,
            cancelForm,
            showEditPage,
            cancelInfoPage
        } = this.props;
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
                                    showEditPage(selectedProperty);
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
                                <h3>{created_at || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Updated At</h4>
                                <h3>{updated_at || "-"}</h3>
                            </div>
                        </div>
                        <div class="col-md-12 notes-sec p-0">
                            <div class="col-md-12 basic-box main-heading mt-2">
                                <h3>Notes</h3>
                            </div>
                            <div class="basic-box contDtl">{notes || "-"}</div>
                        </div>
                        <div className="col-md-12 basic-box main-heading mt-2">
                            <h3>Trade Heading</h3>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Name</h4>
                                <h3>{trade?.font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Size</h4>
                                <h3>{`${trade?.font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Color</h4>
                                <h3>
                                    {trade?.font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${trade?.font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Type</h4>
                                <h3>{trade?.tag || "-"}</h3>
                            </div>
                        </div>

                        <div className="col-md-12 basic-box main-heading mt-2">
                            <h3>System Heading</h3>
                        </div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Name</h4>
                                <h3>{system?.font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Size</h4>
                                <h3>{`${system?.font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Color</h4>
                                <h3>
                                    {system?.font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${system?.font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Type</h4>
                                <h3>{system?.tag || "-"}</h3>
                            </div>
                        </div>

                        <div className="col-md-12 basic-box main-heading mt-2">
                            <h3>Sub System Heading</h3>
                        </div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Name</h4>
                                <h3>{subsystem?.font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Size</h4>
                                <h3>{`${subsystem?.font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Color</h4>
                                <h3>
                                    {subsystem?.font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${subsystem?.font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Type</h4>
                                <h3>{subsystem?.tag || "-"}</h3>
                            </div>
                        </div>

                        <div className="col-md-12 basic-box main-heading mt-2">
                            <h3>Paragraph</h3>
                        </div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Name</h4>
                                <h3>{para_style?.font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Size</h4>
                                <h3>{`${para_style?.font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Color</h4>
                                <h3>
                                    {para_style?.font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${para_style?.font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box"></div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>List Style</h4>
                                <h3>{`${para_style?.style_list} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Para Spacing</h4>
                                <h3>{`${para_style?.para_spacing} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Line Spacing Rule</h4>
                                <h3>{para_style?.line_spacing_rule || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Line Spacing</h4>
                                <h3>{para_style?.line_spacing || "-"}</h3>
                            </div>
                        </div>
                        {/* <div className="col-md-3 basic-box"></div> */}

                        <div className="col-md-12 basic-box main-heading mt-2">
                            <h3>Recommendation</h3>
                        </div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Font Name</h4>
                                <h3>{recommendations?.header_font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Font Size</h4>
                                <h3>{`${recommendations?.header_font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Font Color</h4>
                                <h3>
                                    {recommendations?.header_font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${recommendations?.header_font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Type</h4>
                                <h3>{recommendations?.tag || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Text</h4>
                                <h3>{recommendations?.text || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-9 basic-box"></div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Para Font Name</h4>
                                <h3>{recommendations?.para_font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Para Font Size</h4>
                                <h3>{recommendations?.para_font_size || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Para Font Color</h4>
                                <h3>
                                    {recommendations?.para_font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${recommendations?.para_font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Para Spacing</h4>
                                <h3>{`${recommendations?.para_spacing} pt` || "-"}</h3>
                            </div>
                        </div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>List Style</h4>
                                <h3>{recommendations?.style_list || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Line Spacing Rule</h4>
                                <h3>{recommendations?.line_spacing_rule || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Line Spacing</h4>
                                <h3>{recommendations?.line_spacing || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box"></div>

                        <div className="col-md-12 basic-box main-heading mt-2">
                            <h3>Single Image Caption</h3>
                        </div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Name</h4>
                                <h3>{caption_style?.font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Size</h4>
                                <h3>{`${caption_style?.font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Color</h4>
                                <h3>
                                    {caption_style?.font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${caption_style?.font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Alignment</h4>
                                <h3>{caption_style?.alignment || "-"}</h3>
                            </div>
                        </div>

                        <div className="col-md-12 basic-box main-heading mt-2">
                            <h3>Double Image Caption</h3>
                        </div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Name</h4>
                                <h3>{caption_style1?.font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Size</h4>
                                <h3>{`${caption_style1?.font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Font Color</h4>
                                <h3>
                                    {caption_style1?.font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${caption_style1?.font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Alignment</h4>
                                <h3>{caption_style1?.alignment || "-"}</h3>
                            </div>
                        </div>

                        <div className="col-md-12 basic-box main-heading mt-2">
                            <h3>Table Style</h3>
                        </div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Table Style</h4>
                                <h3>{table_style?.table_style || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-9 basic-box"></div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Font Name</h4>
                                <h3>{table_style?.header_font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Header Font Size</h4>
                                <h3>{`${table_style?.header_font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-6 basic-box"></div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Body Font Name</h4>
                                <h3>{table_style?.body_font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Body Font Size</h4>
                                <h3>{`${table_style?.body_font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Body Font Color</h4>
                                <h3>
                                    {table_style?.body_font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${table_style?.body_font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box"></div>

                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Footer Font Name</h4>
                                <h3>{table_style?.footer_font_name || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Footer Font Size</h4>
                                <h3>{`${table_style?.footer_font_size} pt` || "-"}</h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Footer Font Color</h4>
                                <h3>
                                    {table_style?.footer_font_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${table_style?.footer_font_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 basic-box">
                            <div className="codeOtr">
                                <h4>Footer Background Color</h4>
                                <h3>
                                    {table_style?.footer_bkg_color || "-"}
                                    <span className="color" style={{ backgroundColor: `#${table_style?.footer_bkg_color}` }}></span>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-2"></div>
            </React.Fragment>
        );
    }
}
export default withRouter(BasicDetails);
