import React, { Component } from "react";

export default class LogForm extends Component {
    state = {
        logData: {
            id: "",
            notes: ""
        }
    };

    componentDidMount = () => {
        this.setState({ logData: { ...this.props.logData } });
    };

    handleUpdate = async () => {
        await this.props.updateNote(this.state.logData);
        this.props.onCancel();
    };
    render() {
        const {
            logData: { notes }
        } = this.state;
        return (
            <React.Fragment>
                <div
                    className="modal modal-region"
                    style={{ display: "block" }}
                    id="modalId"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Edit History Note
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>

                            <div className="modal-body region-otr build-type-mod">
                                <form autoComplete={"nope"}>
                                    <div className="form-group">
                                        <div className="formInp">
                                            <label>Note</label>
                                            <textarea
                                                autoComplete={"nope"}
                                                placeholder="Note"
                                                className="form-control"
                                                value={notes}
                                                onChange={e => this.setState({ logData: { ...this.state.logData, notes: e.target.value } })}
                                            ></textarea>
                                        </div>
                                    </div>
                                </form>
                                <div className="col-md-12 p-0 text-right history-btn-otr btnOtr">
                                    <button type="button" onClick={() => this.props.onCancel()} className="btn btn-primary btnRgion col-md-2">
                                        Cancel
                                    </button>
                                    <button type="button" onClick={this.handleUpdate} className="btn btn-primary btnRgion col-md-2">
                                        Update
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
