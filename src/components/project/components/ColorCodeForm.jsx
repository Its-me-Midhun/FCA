import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { CompactPicker } from 'react-color'

import projectActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import {
    addToBreadCrumpData,
    popBreadCrumpData,
    findPrevPathFromBreadCrump
} from "../../../config/utils";
import { color } from "highcharts";

class ColorCodeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openColorCode: false,
            activeColor: "green",
            color: null,
            stateValue: {
                name: "",
                range_start: "",
                range_end: "",
                code: ""
            },
            // tempColor: ""
        }
    }

    openColorCode() {
        this.setState({
            openColorCode: !this.state.openColorCode,

        })
    }

    setActiveTic(color) {
        this.setState({ activeColor: color })
    }
    componentDidMount() {
        //console.log("stateValue", this.props.activeItem)
        if (this.props.activeItem) {
            this.setState({
                stateValue: this.props.activeItem,
                activeColor: this.props.activeItem.code,
            })
        }

    }
    handleChangeComplete = (color) => {
        this.setState({
            activeColor: color.hex,
            stateValue: {
                ...this.state.stateValue,
                code: color.hex
            }
        });
        this.props.handleCode(color.hex)
    };

    render() {
        const { selectedItem, showErrorBorder, from, to, to_flag, from_flag } = this.props;
        const { stateValue } = this.state;

        return (<>
            <React.Fragment>
                <div
                    className="modal modal-region"
                    style={{ display: "block" }}
                    id="modalId"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    {selectedItem ?
                                        "Edit " : "Add"} {"Color Code"}
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => this.props.onCancel()}
                                >
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr build-type-mod">
                                <div className="form-group">
                                    <div className="formInp">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            // className={"form-control"}
                                            className={`${showErrorBorder && !this.props.name.trim().length
                                                // className={`${showErrorBorder && !stateValue.name.trim().length

                                                ? "error-border "
                                                : ""
                                                }form-control`}
                                            value={stateValue.name}
                                            onChange={e => {
                                                this.setState({
                                                    stateValue: {
                                                        ...stateValue,
                                                        name: e.target.value
                                                    }
                                                })
                                                this.props.handleName(e)
                                            }
                                            }
                                            placeholder="Name"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="formInp">
                                        <label>Scale From *</label>
                                        <input
                                            type="text"
                                            className={`${showErrorBorder && !from.trim().length || from_flag
                                                ? "error-border "
                                                : ""
                                                }form-control`}
                                            value={stateValue.range_start ?? ""}
                                            onChange={e => {
                                                this.setState({
                                                    stateValue: {
                                                        ...stateValue,
                                                        range_start: e.target.value
                                                    }
                                                })
                                                this.props.handleFrom(e)
                                            }}

                                            placeholder="Scale From"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="formInp">
                                        <label> Scale To *</label>
                                        <input
                                            type="text"
                                            // className={"form-control"}
                                            className={`${showErrorBorder && !to.trim().length || to_flag
                                                ? "error-border "
                                                : ""
                                                }form-control`}
                                            value={stateValue.range_end ?? ""}
                                            onChange={e => {
                                                this.setState({
                                                    stateValue: {
                                                        ...stateValue,
                                                        range_end: e.target.value
                                                    }
                                                })
                                                this.props.handleTo(e)
                                            }}
                                            placeholder="Scale To"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="formInp">
                                        <label>Color </label>
                                        <div className="clr-set">

                                            {selectedItem ?
                                                <div className="col-se cursor-hand">
                                                    <div
                                                        className="set" style={{ backgroundColor: `${stateValue.code}` }}
                                                        onClick={async (e) => {
                                                            await this.props.handleCode(stateValue.code)
                                                            //this.setActiveTic("active")
                                                            this.setActiveTic(stateValue.code)
                                                        }}
                                                    >
                                                        <div className={`${this.state.activeColor === stateValue.code ? "tic" : ""}`}></div>
                                                    </div>
                                                </div>
                                                : null

                                            }

                                            {!selectedItem ? <div className="col-se cursor-hand">
                                                <div className="set" style={{ backgroundColor: `${stateValue.code || "#95cd50"}` }}
                                                    onClick={(e) => {
                                                        this.props.handleCode(stateValue.code ? stateValue.code : "#95cd50")
                                                        this.setActiveTic(stateValue.code || "green")
                                                    }}>
                                                    <div className={`${this.state.activeColor === (stateValue.code ? stateValue.code : "green") ? "tic" : ""}`}></div>
                                                </div>
                                            </div> : null}
                                            {selectedItem ? <div className="col-se cursor-hand" >
                                                <div className="set " style={{ backgroundColor: "#95cd50" }} onClick={(e) => {
                                                    this.props.handleCode("#95cd50")
                                                    this.setActiveTic("green")
                                                }}>
                                                    <div className={`${this.state.activeColor === "green" ? "tic" : ""}`}></div> </div>
                                            </div> : null}
                                            <div className="col-se cursor-hand" >
                                                <div className="set yel" onClick={(e) => {
                                                    this.props.handleCode("#ffe242")
                                                    this.setActiveTic("yellow")
                                                }}>
                                                    <div className={`${this.state.activeColor === "yellow" ? "tic" : ""}`}></div> </div>
                                            </div>
                                            <div className="col-se cursor-hand">
                                                <div className="set org" onClick={(e) => {
                                                    this.props.handleCode("#ffa105")
                                                    this.setActiveTic("orange")
                                                }}>
                                                    <div className={`${this.state.activeColor === "orange" ? "tic" : ""}`}></div>
                                                </div>
                                            </div>
                                            <div className="col-se cursor-hand">
                                                <div className="set red" onClick={(e) => {
                                                    this.props.handleCode("#ff0305")
                                                    this.setActiveTic("red")
                                                }}>
                                                    <div className={`${this.state.activeColor === "red" ? "tic" : ""}`}></div>
                                                </div>
                                            </div>
                                            <div className="col-se cursor-hand">
                                                <div className="set">
                                                    <img src="/img/color-wheel.svg" alt="" className="img-whel"
                                                        onClick={() =>
                                                            this.openColorCode()
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.openColorCode ?
                                    <div className="color-code">
                                        {console.log("this.state.tempColor", this.state.activeColor)}
                                        <CompactPicker
                                            color={this.state.activeColor}
                                            onChangeComplete={this.handleChangeComplete}
                                        />
                                    </div>
                                    : null}
                                <div className="col-md-12 p-0 text-right btnOtr">
                                    <span className="errorMessage">
                                        {this.props.errorMessage}
                                    </span>
                                    {selectedItem ? (
                                        <button
                                            type="button"
                                            onClick={() => this.props.updateColor()}
                                            className="btn btn-primary btnRgion col-md-2"
                                        >
                                            {this.props.codeLoading ?
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                                : "Update"}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                this.props.addColorCode()
                                            }
                                            disabled={!this.props.activeButton}
                                            className={`btn btn-primary btnRgion col-md-2 ${!this.props.activeButton ? "cursor-notallowed" : ""}`}
                                        >
                                            {this.props.codeLoading ?
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                                : "Add"}
                                        </button>
                                    )}
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </>);
    }
}
export default ColorCodeForm;