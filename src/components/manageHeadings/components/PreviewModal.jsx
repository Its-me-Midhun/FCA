import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { reorderArray } from "../../../config/utils";
import commonActions from "../actions";
import _ from "lodash";
import Draggable from "react-draggable";

const Lines = ({ element, index }) => {
    const bgClass = index % 2 !== 0 ? "blue-bg" : "grey-bg";
    return (
        <div class={`${bgClass} content-preview not-draggable`}>
            {element?.map(item => (
                <>
                    {item}
                    <br />
                </>
            ))}
        </div>
    );
};
class PreviewModal extends Component {
    render() {
        const previewData = this.props.previewData();

        return (
            <React.Fragment>
                <div
                    className="modal modal-region modal-view reco-view-mdl manage-preview-modl"
                    id="modalId"
                    style={{ display: "block" }}
                    tabIndex="-1"
                >
                    <Draggable cancel=".not-dragabble">
                        <div className="modal-dialog draggable" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4>Heading Preview</h4>
                                    <button type="button" className="close" onClick={this.props.onCancel}>
                                        <span aria-hidden="true">
                                            <img src="/img/close.svg" alt="" />
                                        </span>
                                    </button>
                                </div>
                                <div class="modal-body region-otr">
                                    {previewData.map((elem, idx) => (
                                        <Lines element={elem} index={idx} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...commonActions })(PreviewModal));
