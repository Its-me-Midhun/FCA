import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import Portal from "./Portal";
import ConfirmationModal from "./ConfirmationModal";
import _ from "lodash";
import RepotNoteTemplateModal from "../../recommendations/components/RepotNoteTemplateModal";
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

function RecommendationNoteEdit({ onCancel, notes, handleChangeNote, subSystemId }) {
    const [notesEdit, setNotes] = useState(notes);
    const [initialState, setInitialState] = useState(notes);
    const [ConfirmationModalState, showConfirmModal] = useState(false);
    const [reportNoteTemplate, showReportNoteTemplate] = useState(false);


    useEffect(() => {
        setNotes(notes);
    }, [notes]);

    const handleChange = data => {
        setNotes(data);
    };
    const handleSubmit = () => {
        notesEdit && notesEdit.length && handleChangeNote(notesEdit);
        onCancel();
    };
    const cancelForm = () => {
        if (_.isEqual(initialState, notesEdit)) {
            onCancel();
        } else {
            showConfirmModal(true);
        }
    };

    const renderConfirmationModal = () => {
        if (!ConfirmationModalState) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to cancel and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => showConfirmModal(false)}
                        onYes={() => onCancel()}
                        cancel={() => showConfirmModal(false)}
                    />
                }
                onCancel={() => showConfirmModal(false)}
            />
        );
    };
    const toggleShowReportNoteTemplateModal = () => {
        showReportNoteTemplate(!reportNoteTemplate)
    };

   const renderReportNoteTemplateModal = () => {
      
        if (!reportNoteTemplate || !subSystemId) return null;
        return (
            <Portal
                body={
                    <RepotNoteTemplateModal
                        heading={"Narrative Templates"}
                        sub_system_id={subSystemId|| null}
                        onOk={updateTextBandContent}
                        onCancel={() =>showReportNoteTemplate(false)}
                    />
                }
                onCancel={() => showReportNoteTemplate(false)}
            />
        );
    };

    const updateTextBandContent = async newBandContent => {
        setNotes(notesEdit + newBandContent)
    };

   

    return (
        <React.Fragment>
            <div
                id="modalId"
                className="modal modal-region modal-img-magamnt modal-report-note modal-ck-edit"
                style={{ display: "block", cursor: "move" }}
            >
                <Draggable cancel=".not-dragabble">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            {renderConfirmationModal()}
                            {renderReportNoteTemplateModal()}
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={cancelForm}>
                                <span aria-hidden="true">
                                    <img src="/img/close.svg" alt="" />
                                </span>
                            </button>
                            <div className="modal-header d-flex align-items-center">
                                <h5 className="mb-0">Report Notes</h5>

                                <div className="button-rpt-note mr-4">
                                    {subSystemId && (
                                        <button className="btn btn-add-temp" onClick={() => toggleShowReportNoteTemplateModal()}>
                                            <i className="fas fa-plus" /> Add Template
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="modal-body region-otr not-dragabble">
                                <div className="report-notes-txt  col-md-12 p-0">
                                    <CKEditor
                                        editor={Editor}
                                        config={editorConfiguration}
                                        id="text-note"
                                        data={notesEdit || ""}
                                        onReady={editor => {
                                            if (editor) {
                                                editor.setData(notesEdit || "");
                                            }
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            handleChange(data);
                                        }}
                                        onBlur={(event, editor) => {}}
                                        onFocus={(event, editor) => {}}
                                        // className={"ck-editor__editable "}
                                    />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <div class="btn-otr col-md-12 text-right p-0">
                                    <button type="button" onClick={cancelForm} className="btn btn-primary btnRgion btn-cancel mr-2">
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => handleSubmit()} className="btn btn-primary btnRgion">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            </div>
        </React.Fragment>
    );
}

export default RecommendationNoteEdit;
