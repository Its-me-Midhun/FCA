import React, { Component } from "react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Draggable } from "react-beautiful-dnd";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
const editorConfiguration = {
    toolbar: [],
    removePlugins: ["Title"]
};

class InsertEditorBand extends Component {
    state = {
        showConfirmModal: false,
        selectedBand: {
            index: null
        }
    };
    confirmClearTable = index => {
        this.setState({ showConfirmModal: true, selectedBand: { index } });
    };
    renderConfirmationModal = () => {
        const {
            showConfirmModal,
            selectedBand: { index }
        } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to remove and lose all changes?"}
                        message={"This action cannot be reverted, Are you sure that you need to remove this table?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => {
                            this.props.handleChange(null, index);
                            this.setState({ showConfirmModal: false });
                        }}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };
    render() {
        const { index, editorData, hasEdit, hasCreate } = this.props;
        return (
            <>
                {this.renderConfirmationModal()}
                <Draggable key={index} isDragDisabled={!(hasEdit || hasCreate)} draggableId={`draggable-${index}`} index={index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            class="cnt-area"
                            key={`text-${index}`}
                        >
                            <div class="band-sec">
                                <div class="head">
                                    <h3>Table Band</h3>
                                    {(hasEdit || hasCreate) && (
                                        <button class="close-x" onClick={() => this.props.deleteBand(index)}>
                                            <i class="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div class="cnt-sec-hed">
                                <div className="editor-se">
                                    {editorData?.html_format && (hasCreate || hasEdit) && (
                                        <button class="close-x" onClick={() => this.confirmClearTable(index)}>
                                            <i class="fas fa-times"></i>
                                        </button>
                                    )}
                                    <CKEditor
                                        editor={Editor}
                                        config={editorConfiguration}
                                        data={editorData?.html_format || ""}
                                        id={editorData?.id}
                                        disabled={true}
                                        onReady={editor => {}}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Draggable>
            </>
        );
    }
}

export default InsertEditorBand;
