import React, { Component } from "react";
import { BandTypes, SPECIAL_REPORT_NARRATABLES } from "../constants";

class TopHeader extends Component {
    render() {
        const { selectedMenu, hasEdit, hasCreate, narratable_type } = this.props;
        return (
            <>
                <div class="top-bar-btn">
                    <div className="top-hedr">{selectedMenu}</div>
                    {(hasEdit || hasCreate) && (
                        <>
                            <div>
                                <button
                                    class="btn-fci"
                                    data-toggle="modal"
                                    data-target="#Modal-build"
                                    onClick={() => this.props.insertNarrativeBand(BandTypes.textBand)}
                                >
                                    <i class="fas fa-plus"></i>
                                    Text Band
                                </button>
                                <button class="btn-fci" data-toggle="modal" data-target="#Modal-region-one" onClick={() => this.props.onAddImage()}>
                                    <i class="fas fa-plus"></i>
                                    Image Band
                                </button>
                                {SPECIAL_REPORT_NARRATABLES.includes(narratable_type) ? (
                                    <button
                                        class="btn-fci"
                                        data-toggle="modal"
                                        data-target="#Modal-region-one"
                                        onClick={() => this.props.insertNarrativeBand(BandTypes.chartBand)}
                                    >
                                        <i class="fas fa-plus"></i>
                                        Chart Band
                                    </button>
                                ) : null}
                                <button
                                    class="btn-fci"
                                    data-toggle="modal"
                                    data-target="#Modal-region"
                                    onClick={() => this.props.insertNarrativeBand(BandTypes.insertBand)}
                                >
                                    <i class="fas fa-plus"></i>
                                    Table Band
                                </button>

                                <button
                                    class="btn-fci"
                                    data-toggle="modal"
                                    data-target="#Modal-build"
                                    onClick={() => this.props.insertNarrativeBand(BandTypes.recommendationBand)}
                                >
                                    <i class="fas fa-plus"></i>
                                    Recommendations Band
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <div class="top-bar-btn">
                    <div className="top-hedr"></div>
                    {hasEdit || hasCreate ? (
                        <>
                            {narratable_type === "SubSystem" ? (
                                <div>
                                    <button class="btn-fci pl-3" onClick={() => this.props.autoPopulateImages()}>
                                        Auto Populate Images
                                    </button>
                                    <button class="btn-fci pl-3" onClick={() => this.props.autoPopulateReportNotes()}>
                                        Auto Populate Report Notes
                                    </button>
                                </div>
                            ) : null}
                        </>
                    ) : null}
                </div>
            </>
        );
    }
}
export default TopHeader;
