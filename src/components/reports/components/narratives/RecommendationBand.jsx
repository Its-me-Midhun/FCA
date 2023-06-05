import React, { Component } from "react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Draggable } from "react-beautiful-dnd";

const editorConfiguration = {
    toolbar: ["bulletedList"],
    removePlugins: ["Title", "ListStyle"]
};

class RecommendationBand extends Component {
    render() {
        const { index, editorData, hasEdit, hasCreate } = this.props;
        return (
            <Draggable key={index} isDragDisabled={!(hasEdit || hasCreate)} draggableId={`draggable-${index}`} index={index}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} class="cnt-area" key={`text-${index}`}>
                        <div class="band-sec">
                            <div class="head">
                                <h3>Recommendation Band</h3>
                                {(hasEdit || hasCreate) && (
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
                                    config={editorConfiguration}
                                    disabled={!(hasEdit || hasCreate)}
                                    id={editorData.id}
                                    data={editorData?.data[0] || ""}
                                    onReady={editor => {
                                        // if (editor) {
                                        //     editor.setData(editorData?.data[0] || "");
                                        // }
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        if (data !== editorData?.data[0]) {
                                            this.props.handleChange(data, index);
                                        }
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

export default RecommendationBand;
