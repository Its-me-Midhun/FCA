import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import Editor from "ckeditor5-custom-build/build/ckeditor";

const editorConfiguration = {
    toolbar: [
        // "fontFamily",
        // "fontSize",
        // "|",
        // "bold",
        // "italic",
        // "underLine",
        // "|",
        // "alignment:left",
        // "alignment:right",
        // "alignment:center",
        // "alignment:justify",
        // "|",
        // "bulletedList",
        // "numberedList",
        // "|",
        // // "outdent",
        // // "indent",
        // "highlight",
        // "|",
        // "undo",
        // "redo"
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
function RecommendationNoteView({ onCancel, notes }) {
    return (
        <div id="modalId" className="modal modal-region modal-img-magamnt modal-report-note modal-ck-edit" style={{ display: "block", cursor: "move" }}>
            <Draggable cancel=".not-dragabble">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancel}>
                            <span aria-hidden="true">
                                <img src="/img/close.svg" alt="" />
                            </span>
                        </button>
                        <div className="modal-header">
                            <h5>Report Notes</h5>
                        </div>

                        <div className="modal-body region-otr">
                            <div className="report-notes-txt  col-md-12 p-0 ">
                            <CKEditor
                                    // editor={Editor}
                                    config={editorConfiguration}
                                    // disabled={!(hasEdit || hasCreate)}
                                    // id={editorData.id}
                                    editor={Editor} 
                                    disabled={true}
                                    isReadOnly={true}
                                    data={notes || ""}
                                    // onReady={editor => {
                                    //     // if (editor) {
                                    //     //     editor.setData(editorData?.data[0] || "");
                                    //     // }
                                    // }}
                                  
                                    // config.width = '75%';
                                    onBlur={(event, editor) => {}}
                                    onFocus={(event, editor) => {}}
                                    // className={"ck-editor__editable "}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        </div>
    );
}

export default RecommendationNoteView;
