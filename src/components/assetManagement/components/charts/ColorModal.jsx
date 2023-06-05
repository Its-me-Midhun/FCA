import React, { Component } from "react";
import Draggable from "react-draggable";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../../common/components/Loader";
import history from "../../../../config/history";

import { resetBreadCrumpData, bulkResetBreadCrumpData, addToBreadCrumpData } from "../../../../config/utils";
import { withRouter } from "react-router-dom";

class ViewModal extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);

        // await this.setState({ chartData, clientName, isLoading: false });
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.onCancel();
        }
    }
    viewAssets = () => {
        console.log(this.props.location);
        const {
            chartData,
            location: { pathname }
        } = this.props;
        let tempPath = pathname.split("/");
        tempPath[tempPath.length - 1] = "assets";
        tempPath = tempPath.join("/");
        addToBreadCrumpData({
            key: "info",
            name: "Assets",
            path: tempPath
        });
        let assetData = {};
        if (chartData.type === "SFCI") {
            assetData.sub_system_id = chartData.entityId;
        }

        history.push(tempPath, assetData);
    };

    render() {
        const { colorCodes, colorCodeDetails, fciDataDetails, isFullScreen, chartData, isSingleView, color_code } = this.props;
        const chartMainClass = isSingleView ? "chart-5" : chartData.type === "SFCI" ? "chart-4" : "chart-5";
        console.log(chartData);
        return (
            <>
                <Draggable>
                    <div
                        className={`dropdown-menu-view efci-clr fca-pup view_chart_asset ${chartMainClass}`}
                        aria-labelledby="dropdownMenuButton"
                        style={{ display: "block", cursor: "move" }}
                        ref={this.setWrapperRef}
                    >
                        <LoadingOverlay active={this.props.isCodeLoading} spinner={<Loader />} fadeSpeed={10}>
                            <div class="btn-ara">
                                <div>
                                    <h3>Color Scale For SFCI Chart </h3>
                                    {this.props.chartData.category && <h4 class="mt-0 mb-2">Sub-System : {this.props.chartData.category}</h4>}
                                </div>
                                <button class="btn btn-outline-secondary act-btn" onClick={() => this.viewAssets()}>
                                    View Assets
                                </button>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>

                            <div className="table-section">
                                <table className="table table-common table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Scale</th>
                                            <th className="">Color</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {color_code && color_code.length ? (
                                            color_code.map((code, i) => (
                                                <React.Fragment key={i}>
                                                    <tr>
                                                        <td>
                                                            <b>{code.name}</b>
                                                        </td>
                                                        <td>
                                                            <span className="">
                                                                <strong>{code.range_start}</strong>
                                                            </span>
                                                            <span className="rng-wid">To</span>
                                                            <span>
                                                                <strong>{code.range_end}</strong>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="clr-set">
                                                                <div className="col-se">
                                                                    <div className="set" style={{ backgroundColor: `${code.code}` }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <td colSpan={3}>No Color Codes found.</td>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </LoadingOverlay>
                    </div>
                </Draggable>
            </>
        );
    }
}

export default withRouter(ViewModal);
