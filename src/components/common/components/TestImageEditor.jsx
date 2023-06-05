import React, { useEffect, useRef } from "react";
import TuiImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";

export default function TestImageEditor() {
    const testref = useRef(null);
    useEffect(() => {
        if (!testref.current) {
            return;
        }
        const myTheme = {
            // "header.display": "none"
            // "submenu.backgroundColor": "#eb4034"
        };

        const tuiEditor = new TuiImageEditor(testref.current, {
            includeUI: {
                initMenu: "filter",
                uiSize: {
                    // width: "500px",
                    height: "400px"
                },
                menuBarPosition: "left",
                theme: myTheme
            },
            cssMaxWidth: 700,
            cssMaxHeight: 500,
            selectionStyle: {
                cornerSize: 20,
                rotatingPointOffset: 70
            }
        });
    }, []);

    return (
        <div>
            {/* <div>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    Launch demo modal
                </button>
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document" style={{ maxWidth: "1000px" }}>
                        <div class="modal-content" style={{ width: "900px" }}>
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">
                                    Modal title
                                </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body"> */}
            <div ref={testref}></div>
            {/* </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" class="btn btn-primary">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
