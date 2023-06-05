import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class SelectExportTypeWordModal extends Component {
    state = {
        sort_type: "building",
        file_type: "word"
    };
    render() {
        const { heading, paragraph, onOk, onCancel, isBuildingAddition = true, isWordExcel = true, isSmartChart = false } = this.props;

        return (
            <React.Fragment>
                <div
                    id="modalId"
                    className="modal modal-region deleteModal"
                    style={{ display: "block" }}
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog select-export-type" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr p-3 pb-5">
                                <div className="deleteInner">
                                    <i className="far fa-check-circle" />
                                    {isBuildingAddition && (
                                        <>
                                            {" "}
                                            <h2>{heading}</h2>
                                            <div class="d-flex hedd-otrr">
                                                <div className="formInp mr-3">
                                                    <label className="container-check">
                                                        Building
                                                        <input
                                                            type="radio"
                                                            name="double_header"
                                                            onClick={e =>
                                                                this.setState({
                                                                    sort_type: this.state.sort_type === "building" ? "addition" : "building"
                                                                })
                                                            }
                                                            checked={this.state.sort_type === "building"}
                                                        />
                                                        <span className="checkmark white" />
                                                    </label>
                                                </div>
                                                <div className="formInp">
                                                    <label className="container-check">
                                                        Addition
                                                        <input
                                                            type="radio"
                                                            name="double_header"
                                                            onClick={e =>
                                                                this.setState({
                                                                    sort_type: this.state.sort_type === "addition" ? "building" : "addition"
                                                                })
                                                            }
                                                            checked={this.state.sort_type === "addition"}
                                                        />
                                                        <span className="checkmark white" />
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {isWordExcel && (
                                        <>
                                            <h2>Please Select File Type</h2>
                                            <div class="d-flex hedd-otrr">
                                                <div className="formInp mr-3">
                                                    <label className="container-check">
                                                        Word
                                                        <input
                                                            type="radio"
                                                            name="double_headers"
                                                            onClick={e =>
                                                                this.setState({
                                                                    file_type: this.state.file_type === "word" ? "excel" : "word"
                                                                })
                                                            }
                                                            checked={this.state.file_type === "word"}
                                                        />
                                                        <span className="checkmark white" />
                                                    </label>
                                                </div>
                                                <div className="formInp">
                                                    <label className="container-check">
                                                        Excel
                                                        <input
                                                            type="radio"
                                                            name="double_headers"
                                                            onClick={e =>
                                                                this.setState({
                                                                    file_type: this.state.file_type === "excel" ? "word" : "excel"
                                                                })
                                                            }
                                                            checked={this.state.file_type === "excel"}
                                                        />
                                                        <span className="checkmark white" />
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {isSmartChart && (
                                        <>
                                            <h2>Please Select File Type</h2>
                                            <div class="d-flex hedd-otrr">
                                                <div className="formInp mr-3">
                                                    <label className="container-check">
                                                        Word
                                                        <input
                                                            type="radio"
                                                            name="double_headers"
                                                            onClick={e =>
                                                                this.setState({
                                                                    file_type: this.state.file_type === "word" ? "pdf" : "word"
                                                                })
                                                            }
                                                            checked={this.state.file_type === "word"}
                                                        />
                                                        <span className="checkmark white" />
                                                    </label>
                                                </div>
                                                <div className="formInp">
                                                    <label className="container-check">
                                                        PDF
                                                        <input
                                                            type="radio"
                                                            name="double_headers"
                                                            onClick={e =>
                                                                this.setState({
                                                                    file_type: this.state.file_type === "pdf" ? "word" : "pdf"
                                                                })
                                                            }
                                                            checked={this.state.file_type === "pdf"}
                                                        />
                                                        <span className="checkmark white" />
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* <div className="deleteInner">
                                    
                                </div> */}

                                <div className="btnOtr">
                                    <button type="button" className="btn btn-secondary btnClr" onClick={() => onCancel()}>
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary btnRgion"
                                        onClick={() => onOk(this.state.sort_type, this.state.file_type)}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(SelectExportTypeWordModal);
