import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class ConfirmationModal extends Component {
    state = {
        isDoubleCheckOk: false,
        isDeletePermanent: false,
        isRestoreCheckOk: false,
        isUnassignCheckOk: false
    };

    componentDidMount = async () => {
        this.nameInput.focus();
        const { isDeleted } = this.props;
        if (isDeleted) {
            await this.setState({ isDeletePermanent: true });
        }
    };

    confirmationDoublecheck = event => {
        this.setState({
            isDoubleCheckOk: false
        });
        if (event.target.value.trim() === "DELETE") {
            this.setState({
                isDoubleCheckOk: true
            });
        }
    };

    confirmRestore = event => {
        this.setState({
            isRestoreCheckOk: false
        });
        if (event.target.value.trim() === "RESTORE") {
            this.setState({
                isRestoreCheckOk: true
            });
        }
    };

    confirmUnAssign = event => {
        this.setState({
            isUnassignCheckOk: false
        });
        if (event.target.value.trim() === "YES") {
            this.setState({
                isUnassignCheckOk: true
            });
        }
    };

    thousands_separators = num => {
        if (!num) return null;
        let numbe = num?.toString();
        let number = numbe?.split(".");
        number[0] = number[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return number.join(".");
    };

    render() {
        const {
            heading,
            message,
            onNo,
            onYes,
            isUnAssign,
            type = "delete",
            isHard = false,
            onHardDelete,
            isRestore = false,
            isDeleted = false,
            isCutPaste = false,
            isLogChange = false,
            associatedchanges,
            singleOk,
            onlyOk
        } = this.props;
        const { isDeletePermanent } = this.state;
        const integerValues = [
            "cost",
            "project_total",
            "area",
            "priority",
            "priority_element1",
            "priority_element2",
            "priority_element3",
            "priority_element4",
            "priority_element5",
            "priority_element6",
            "priority_element7",
            "priority_element8",
            "crv",
            "replacement_cost"
        ];
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
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                {singleOk ? (
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => onlyOk()}>
                                        <span aria-hidden="true">
                                            <img src="/img/close.svg" alt="" />
                                        </span>
                                    </button>
                                ) : (
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => onNo()}>
                                        <span aria-hidden="true">
                                            <img src="/img/close.svg" alt="" />
                                        </span>
                                    </button>
                                )}
                            </div>
                            <div className="modal-body region-otr p-3 pb-5">
                                <div className="deleteInner">
                                    <i className="far fa-check-circle" />
                                    <h2>{heading}</h2>
                                    {isLogChange
                                        ? associatedchanges && associatedchanges.length
                                            ? associatedchanges.map(i => {
                                                  return Object.entries(i.changeset).map((dat, index) => {
                                                      return (
                                                          <p>
                                                              The Value of Field <b>{dat[0].replace("_id", "")}</b> will restore to{" "}
                                                              <b>
                                                                  {integerValues.includes(dat[0]) || typeof dat[1][0] === "number"
                                                                      ? this.thousands_separators(dat[1][0] && dat[1][0].toString()) || "null"
                                                                      : (dat[1][0] && dat[1][0].toString()) || "null"}
                                                              </b>
                                                          </p>
                                                      );
                                                  });
                                              })
                                            : null
                                        : null}
                                    {isLogChange ? (
                                        Object.entries(message).map((data, index) => {
                                            return (
                                                <p>
                                                    The Value of Field <b>{data[0]}</b> will restore to{" "}
                                                    <b>
                                                        {integerValues.includes(data[0]) || typeof data[1][0] === "number"
                                                            ? this.thousands_separators(data[1][0] && data[1][0].toString()) || "null"
                                                            : (data[1][0] && data[1][0].toString()) || "null"}
                                                    </b>
                                                </p>
                                            );
                                        })
                                    ) : this.state.isDeletePermanent ? (
                                        <p>{"This action cannot be reverted, are you sure that you need to permanently delete this item?"}</p>
                                    ) : (
                                        <p>{message}</p>
                                    )}
                                    {isHard ? (
                                        <p>
                                            <label className="container-check">
                                                <input
                                                    className="form-check-input ml-2"
                                                    type="checkbox"
                                                    checked={isDeletePermanent || isDeleted ? "check" : ""}
                                                    disabled={isDeleted}
                                                    onClick={() => this.setState({ isDeletePermanent: !this.state.isDeletePermanent })}
                                                />{" "}
                                                Delete permanently<span className="checkmark"></span>
                                            </label>
                                        </p>
                                    ) : null}
                                </div>
                                {this.props.match.params.tab !== "infoimages" && type === "delete" ? (
                                    <div className="deleteInner">
                                        <p>Type "DELETE" to confirm</p>
                                        <input className="form-control" type="text" onChange={e => this.confirmationDoublecheck(e)} />
                                    </div>
                                ) : type === "restore" ? (
                                    <div className="deleteInner">
                                        <p>Type "RESTORE" to confirm</p>
                                        <input className="form-control" type="text" onChange={e => this.confirmRestore(e)} />
                                    </div>
                                ) : type === "unassign" ? (
                                    <div className="deleteInner">
                                        <p>Type "YES" to confirm</p>
                                        <input className="form-control" type="text" onChange={e => this.confirmUnAssign(e)} />
                                    </div>
                                ) : null}
                                {isRestore ? (
                                    <div className="btnOtr">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btnClr"
                                            onClick={() => onNo()}
                                            ref={input => {
                                                this.nameInput = input;
                                            }}
                                        >
                                            No
                                        </button>
                                        {this.state.isRestoreCheckOk ? (
                                            <button type="button" className="btn btn-primary btnRgion" onClick={() => onYes()}>
                                                Yes
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-primary btnRgion cursor-diabled" disabled={true}>
                                                Yes
                                            </button>
                                        )}
                                    </div>
                                ) : isUnAssign ? (
                                    <div className="btnOtr">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btnClr"
                                            onClick={() => onNo()}
                                            ref={input => {
                                                this.nameInput = input;
                                            }}
                                        >
                                            No
                                        </button>
                                        {this.state.isUnassignCheckOk ? (
                                            <button type="button" className="btn btn-primary btnRgion" onClick={() => onYes()}>
                                                Yes
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-primary btnRgion cursor-diabled" disabled={true}>
                                                Yes
                                            </button>
                                        )}
                                    </div>
                                ) : isCutPaste ? (
                                    <div className="btnOtr">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btnClr"
                                            onClick={() => onNo()}
                                            ref={input => {
                                                this.nameInput = input;
                                            }}
                                        >
                                            No
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion"
                                            onClick={() => {
                                                onYes();
                                            }}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                ) : singleOk ? (
                                    <div className="btnOtr">
                                        <button type="button" className="btn btn-primary" 
                                             onClick={() => onlyOk()}
                                            ref={input => {
                                                this.nameInput = input;
                                            }} >
                                            Ok
                                        </button>
                                    </div>
                                ) : (
                                    <div className="btnOtr">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btnRgion"
                                            onClick={() => onNo()}
                                            ref={input => {
                                                this.nameInput = input;
                                            }}
                                        >
                                            No
                                        </button>
                                        {this.state.isDoubleCheckOk || this.props.match.params.tab === "infoimages" || type !== "delete" ? (
                                            <button
                                                type="button"
                                                className="btn btn-primary  btnClr"
                                                onClick={() => {
                                                    isHard ? onYes(isDeletePermanent) : onYes();
                                                }}
                                            >
                                                Yes
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-primary btnClr cursor-diabled" disabled={true}>
                                                Yes
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(ConfirmationModal);
