import React, { Component } from "react";
import { connect } from "react-redux";
import regionActions from "../actions";

class AssignClientUserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentDidMount = async () => {
        await this.setState({
            isLoading: false
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return null;
        const { onCancel, userList } = this.props;

        return (
            <React.Fragment>
                <div
                    id="modalId"
                    className="modal modal-region modal-view"
                    id="Modal-view"
                    style={{ display: "block" }}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    <div className="txt-hed">Assign Client</div>
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={onCancel}
                                >
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr">
                                <div className="col-md-12 formInp search">
                                    <i className="fas fa-search" />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search Now"
                                    />
                                </div>
                                <div className="col-md-12 check-otr d-flex checkbox-sec">
                                    {userList.length
                                        ? userList.map((item, i) => (
                                              <div className="col-md-6 box-otr">
                                                  <div className="rem-txt">
                                                      <label className="container-check">
                                                          {item.name}
                                                          <input type="radio" name="client" />
                                                          <span className="checkmark" />
                                                      </label>
                                                  </div>
                                              </div>
                                          ))
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { regionReducer } = state;
    return { regionReducer };
};

export default connect(mapStateToProps, { ...regionActions })(AssignClientUserModal);
