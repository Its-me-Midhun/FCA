import React, { Component } from "react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Draggable } from "react-beautiful-dnd";

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
    render() {
        const { index, editorData, hasEdit, hasCreate } = this.props;
        return (
            <Draggable key={index} isDragDisabled={!(hasEdit || hasCreate)} draggableId={`draggable-${index}`} index={index}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} class="cnt-area" key={`text-${index}`}>
                        <div class="band-sec">
                            <div class="head">
                                <h3>Report Notes Band</h3>
                                {(hasCreate || hasEdit) && (
                                    <button class="close-x" onClick={() => this.props.deleteBand(index)}>
                                        <i class="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div class="cnt-sec-hed">
                            <div className="editor-se">
                                <CKEditor
                                    editor={Editor}
                                    disabled={!(hasEdit || hasCreate)}
                                    config={editorConfiguration}
                                    data={editorData?.data[0] || ""}
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
        );
    }
}

export default TextBand;
