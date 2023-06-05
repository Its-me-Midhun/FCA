import DragM from "dragm";
import React, { Component } from "react";

class BuildModalHeader extends React.Component {
    updateTransform = transformStr => {
        this.modalDom.style.transform = transformStr;
    };
    componentDidMount() {
        const { modalClass } = this.props;
        this.modalDom = document.getElementsByClassName(modalClass)[0];
    }
    render() {
        const { title, onCancel } = this.props;
        return (
            <DragM updateTransform={this.updateTransform}>
                <div class="modal-header">
                    <h4 class="modal-title">{title}</h4>
                    <button type="button" class="close" data-dismiss="modal" onClick={() => onCancel()}>
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
