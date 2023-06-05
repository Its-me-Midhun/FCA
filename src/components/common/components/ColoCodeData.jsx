import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import Loader from "./Loader";

class ColorCodedata extends Component {
    state = {};

    render() {
        const { colorCodes } = this.props;
        return (
            <>
                <div
                    className={`${
                        this.props.isOpenColorCode
                            ? this.props.isDashboardColor
                                ? "dropdown-menu-view efci-clr clr-dsbrd"
                                : "dropdown-menu-view efci-clr clr-code-lgnd"
                            : "dropdown-menu-view "
                    }`}
                    aria-labelledby="dropdownMenuButton"
                    style={{ display: "block" }}
                >
                    <LoadingOverlay active={this.props.isCodeLoading} spinner={<Loader />} fadeSpeed={10}>
                        <h3>Color Code</h3>
                        {this.props.isDashboardColor ? (
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                <span aria-hidden="true">
                                    <img src="/img/close.svg" alt="" />
                                </span>
                            </button>
                        ) : null}
                        <div className="table-section">
                            <table className="table table-common table-bordered">
                                <thead>
                                    <tr>
                                        <th className="th-nme">Name</th>
                                        <th className="th-scale">Scale</th>
                                        <th className="th-color">Color</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {colorCodes && colorCodes.length ? (
                                        colorCodes.map((code, i) => (
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
            </>
        );
    }
}
export default ColorCodedata;
