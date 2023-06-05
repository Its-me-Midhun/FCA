import React from "react";
import DragM from "dragm";

class BuildModalHeader extends React.Component {
    updateTransform = transformStr => {
        this.modalDom.style.transform = transformStr;
    };
    componentDidMount() {
        const { modalClass } = this.props;
        this.modalDom = document.getElementsByClassName(modalClass)[0];
    }
    render() {
        const { title, onCancel, showData, entityData } = this.props;
        return (
            <DragM updateTransform={this.updateTransform}>
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        {title}
                    </h5>
                    {showData && (
                        <div class="pull-img-recom ml-2">
                            <div className="text-label">
                                <label>Recommendation: {`[${entityData?.code}] ${entityData?.description || ""}`}</label>
                            </div>
                        </div>
                    )}
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => onCancel()}>
                        <span aria-hidden="true">
                            <img src="/img/close.svg" alt="" />
                        </span>
                    </button>
                </div>
            </DragM>
        );
    }
}

export default BuildModalHeader;
