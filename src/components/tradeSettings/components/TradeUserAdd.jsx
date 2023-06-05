import React from "react";

const TradeUserAdd = ({ values, setState, state, onSubmit, onCancel }) => {
    return (
        <div>
            <div className="modal-body region-otr build-type-mod">
                <form autoComplete={"nope"}>
                    <div className="form-group">
                        <div className="formInp">
                            <label>Name *</label>
                            <input
                                autoComplete={"nope"}
                                type="text"
                                className={`form-control`}
                                value={values.name}
                                onChange={({ target: { value } }) =>
                                    setState({
                                        ...state,
                                        inputs: {
                                            ...state.inputs,
                                            name: value
                                        }
                                    })
                                }
                                placeholder="Name"
                            />
                        </div>
                        <div className="formInp">
                            <label>Username *</label>
                            <input
                                autoComplete={"nope"}
                                type="text"
                                className={`form-control`}
                                value={values.username}
                                onChange={({ target: { value } }) =>
                                    setState({
                                        ...state,
                                        inputs: {
                                            ...state.inputs,
                                            username: value
                                        }
                                    })
                                }
                                placeholder="Email"
                            />
                        </div>
                        <div className="formInp">
                            <label>Email *</label>
                            <input
                                autoComplete={"nope"}
                                type="text"
                                className={`form-control`}
                                value={values.email}
                                onChange={({ target: { value } }) =>
                                    setState({
                                        ...state,
                                        inputs: {
                                            ...state.inputs,
                                            email: value
                                        }
                                    })
                                }
                                placeholder="Username"
                            />
                        </div>
                        <div className="formInp">
                            <label>Phone *</label>
                            <input
                                autoComplete={"nope"}
                                type="text"
                                className={`form-control`}
                                value={values.phone}
                                onChange={({ target: { value } }) =>
                                    setState({
                                        ...state,
                                        inputs: {
                                            ...state.inputs,
                                            phone: value
                                        }
                                    })
                                }
                                placeholder="Phone"
                            />
                        </div>
                    </div>
                </form>
            </div>
            <div className="d-flex mt-3 border-top pt-3">
                <div className="col-md-4 drp-btn ml-auto mb-3">
                    <button type="button" className="btn btn-primary btnClr mr-3" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-primary btnRgion" onClick={onSubmit}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeUserAdd;
