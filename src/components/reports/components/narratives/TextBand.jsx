import React, { Component } from "react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Draggable } from "react-beautiful-dnd";

import Portal from "../../../common/components/Portal";
import TemplateModal from "./TemplateModal";

const editorConfiguration = {
    toolbar: [
        // "fontFamily",
        // "fontSize",
        // "|",
        "bold",
        "italic",
        "underLine",
        "|",
        "alignment:left",
        "alignment:right",
        "alignment:center",
        "alignment:justify",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        // "outdent",
        // "indent",
        "highlight",
        "|",
        "undo",
        "redo"
        // "heading"
    ],
    removePlugins: ["Title", "ListStyle"],
    alignment: {
        options: ["left", "right", "center", "justify"]
    },
    highlight: {
        options: [
            { model: "yellowMarker", class: "marker-yellow", title: "Yellow marker", color: "var(--ck-highlight-marker-yellow)", type: "marker" },
            { model: "greenMarker", class: "marker-green", title: "Green marker", color: "#32CD32", type: "marker" },
            { model: "pinkMarker", class: "marker-pink", title: "Pink marker", color: "#FF00FF", type: "marker" },
            { model: "blueMarker", class: "marker-blue", title: "Blue marker", color: "#0000FF", type: "marker" }
        ]
    },
    placeholder: "Type Here..."
};

class TextBand extends Component {
    state = {
        showTemplateModal: false,
        bandContent: this.props.editorData?.data[0] || ""
    };

    componentDidMount = prevProps => {
        this.setState({
            bandContent: this.props.editorData?.data[0] || ""
        });
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.editorData.id !== this.props.editorData.id) {
            await this.setState({
                bandContent: this.props.editorData?.data[0] || ""
            });
        }
    };

    toggleShowTemplateModal = () => {
        const { showTemplateModal } = this.state;
        this.setState({
            showTemplateModal: !showTemplateModal
        });
    };

    updateTextBandContent = async newBandContent => {
        const { editorData } = this.props;
        let tempData = editorData.data[0] || "";
        await this.setState({
            bandContent: tempData + newBandContent,
            showTemplateModal: false
        });
    };

    renderTemplateModal = () => {
        const { showTemplateModal } = this.state;
        if (!showTemplateModal) return null;
        return (
            <Portal
                body={
                    <TemplateModal
                        heading={"Narrative Templates"}
                        onOk={this.updateTextBandContent}
                        onCancel={() => {
                            this.setState({ showTemplateModal: false });
                        }}
                    />
                }
                onCancel={() => this.setState({ showTemplateModal: false })}
            />
        );
    };

    render() {
        const { index, editorData, hasEdit, hasCreate } = this.props;
        const { bandContent } = this.state;
        return (
            <>
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
                                    <h3>Narrative Text Band</h3>
                                    {(hasCreate || hasEdit) && (
                                        <>
                                            <button class="add-template btn-fci" onClick={() => this.toggleShowTemplateModal()}>
                                                <i class="fas fa-plus"></i>Add Template
                                            </button>
                                            <button class="close-x" onClick={() => this.props.deleteBand(index)}>
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div class="cnt-sec-hed">
                                <div className="editor-se">
                                    <CKEditor
                                        editor={Editor}
                                        disabled={!(hasEdit || hasCreate)}
                                        config={editorConfiguration}
                                        data={bandContent}
                                        id={editorData.id}
                                        onReady={editor => {}}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            // if (data !== editorData?.data[0]) {
                                            this.props.handleChange(data, index);
                                            // }
                                        }}
                                        onBlur={(event, editor) => {}}
                                        onFocus={(event, editor) => {}}
                                        // className={"text-editor"}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Draggable>
                {this.renderTemplateModal()}
            </>
        );
    }
}

export default TextBand;
