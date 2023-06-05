import React, { Component } from "react";
import { withRouter, Prompt } from "react-router-dom";
import _ from "lodash";

import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";
import Loader from "../../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { v4 as uuidv4 } from "uuid";
import * as htmlToImage from "html-to-image";
import ReactTooltip from "react-tooltip";
import { convertToXML } from "../../../../config/utils";
import { BandTypes, DISABLE_COMMANDS } from "../../constants";
import qs from "query-string";

const editorConfiguration = {
    // extraPlugins: [DisallowNestingTables],
    toolbar: ["insertTable", "|", "alignment:left", "alignment:right", "alignment:center", "alignment:justify"],
    tableProperties: {
        defaultProperties: {
            alignment: "left"
        }
    },
    table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableCellProperties"]
        // defaultHeadings: { rows: 2}
    },
    removePlugins: ["Title"],
    alignment: {
        options: ["left", "right", "center", "justify"]
    }
};
class InsertModal extends Component {
    constructor(props) {
        super(props);
        this.insert = React.createRef();
    }

    state = {
        uploadAttachment: [],
        tempAttachment: {},
        uploadError: "",
        fileChanged: false,
        isUploading: false,
        missingRequiredFields: false,
        isInvalidFile: false,
        showConfirmModal: false,
        selectedInsert: {},
        isUpdate: null,
        isDeleting: false,
        attachmentChanged: false,
        showNarrCompletedComfirmModal: false
    };

    componentDidMount = () => {
        this.setState({ tempAttachment: { double_header: false, footer: false } });
    };

    componentDidUpdate = prevProps => {
        if (
            qs.parse(prevProps.location?.search)?.narratable_id != qs.parse(this.props.location?.search)?.narratable_id ||
            prevProps.match.params?.tab != this.props.match.params?.tab
        ) {
            this.setState({ tempAttachment: { double_header: false, footer: false } });
        }
    };

    handleChangeTable = data => {
        this.setState({
            attachmentChanged: true,
            tempAttachment: {
                ...this.state.tempAttachment,
                html_format: data
            }
        });
        this.props.setIsUnsaved(true);
    };

    deleteAttachment = async () => {
        this.setState({ isDeleting: true, showConfirmModal: false });
        await this.props.deleteInsert(this.state.selectedInsert.id);
        this.setState({
            tempAttachment: { double_header: false, footer: false },
            isUploading: false,
            missingRequiredFields: false,
            isUpdate: null
        });
        this.setState({ isDeleting: false });
    };

    handleDeleteAttachment = async id => {
        let usedTableFound = this.props.checkIfNarrativeTableUsed(id);
        this.setState({
            showConfirmModal: true,
            selectedInsert: { id: id, usedTableFound }
        });
    };

    handleUpdateInsert = async () => {
        const { tempAttachment } = this.state;
        if (!(tempAttachment.description?.trim()?.length >= 3) || !tempAttachment.html_format) {
            this.setState({
                isUploading: false,
                missingRequiredFields: true
            });
            return false;
        } else if (this.validateTable(tempAttachment)) {
            this.setState({
                missingRequiredFields: true,
                uploadError: "Invalid table format !"
            });
            return false;
        }
        let usedTableFound = this.props.checkIfNarrativeTableUsed(tempAttachment.id);
        if (usedTableFound && this.props.narrativeCompleted) {
            this.setState({ showNarrCompletedComfirmModal: true });
        } else {
            await this.updateInsert();
        }
    };

    updateInsert = async () => {
        const { tempAttachment } = this.state;
        this.setState({
            isUploading: true
        });

        let node = document.getElementsByClassName("ck ck-editor__main")[0];
        let url = await this.printImage(node);
        await this.setState({
            tempAttachment: {
                ...tempAttachment,
                image: url,
                text_format: convertToXML(this.state.tempAttachment, BandTypes.insertBand)
            }
        });

        await this.props.updateInsert(this.state.tempAttachment);
        this.setState({
            tempAttachment: { double_header: false, footer: false },
            isUpdate: null,
            isUploading: false,
            missingRequiredFields: false,
            attachmentChanged: false,
            uploadError: ""
        });
        this.props.setIsUnsaved(false);
    };

    renderConfirmationModal = () => {
        const {
            showConfirmModal,
            selectedInsert: { usedTableFound }
        } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you really want to delete this Table?"}
                        message={
                            this.props.narrativeCompleted && usedTableFound
                                ? "The narrative is marked as complete & this table is used in narrative. This action will mark the narrative as incomplete."
                                : "This action cannot be reverted, are you sure that you need to delete this table?"
                        }
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteAttachment}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    renderNarrCompletedConfirmationModal = () => {
        const { showNarrCompletedComfirmModal } = this.state;
        if (!showNarrCompletedComfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you really want to update this Table?"}
                        message={"The narrative is marked as complete. This action will mark the narrative as incomplete."}
                        onNo={() => this.setState({ showNarrCompletedComfirmModal: false })}
                        onYes={() => {
                            this.setState({ showNarrCompletedComfirmModal: false });
                            this.updateInsert();
                        }}
                    />
                }
                onCancel={() => this.setState({ showNarrCompletedComfirmModal: false })}
            />
        );
    };

    printImage = async node => {
        try {
            let blob = await htmlToImage.toBlob(node);
            return blob;
        } catch (error) {
            console.error("oops, something went wrong!", error);
        }
    };

    addInsert = async () => {
        const { tempAttachment, uploadAttachment } = this.state;
        if (!(tempAttachment.html_format && tempAttachment.description?.trim()?.length >= 3)) {
            this.setState({
                missingRequiredFields: true
            });
            return false;
        } else if (this.validateTable(tempAttachment)) {
            this.setState({
                missingRequiredFields: true,
                uploadError: "Invalid table format !"
            });
            return false;
        }
        this.setState({
            isUploading: true
        });
        let node = document.getElementsByClassName("ck ck-editor__main")[0];
        let url = await this.printImage(node);
        if (!url) {
            this.setState({ isUploading: false });
            return window.alert("failed to take screenshot!");
        }
        await this.setState({
            tempAttachment: {
                ...tempAttachment,
                image: url,
                text_format: convertToXML(this.state.tempAttachment, BandTypes.insertBand)
            }
        });
        await this.props.uploadInsert(this.state.tempAttachment);
        this.setState(
            {
                uploadAttachment: [...uploadAttachment, tempAttachment],
                tempAttachment: { double_header: false, footer: false },
                isUploading: false,
                missingRequiredFields: false,
                uploadError: ""
            },
            () => this.setState({ attachmentChanged: false })
        );
        this.props.setIsUnsaved(false);
    };

    handleChange = e => {
        const { tempAttachment } = this.state;
        const { name, value } = e.target;
        this.setState({ attachmentChanged: true });
        if (name === "description") {
            this.setState({
                tempAttachment: {
                    ...tempAttachment,
                    [name]: value
                }
            });
        } else {
            this.setState({
                tempAttachment: {
                    ...tempAttachment,
                    [name]: !tempAttachment[name]
                }
            });
        }
        this.props.setIsUnsaved(true);
    };

    validateTable = table => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(table.html_format, "text/html");
        let elems = xmlDoc.getElementsByTagName("table");
        let tbody = xmlDoc.getElementsByTagName("tbody")[0];

        if (_.isEmpty(elems)) return true;
        else if (elems.length > 1) return true;
        else if (tbody.childNodes.length === 1 && table.footer) return true;
        else if (tbody.childNodes.length === 1 && table.double_header) return true;
        else if (tbody.childNodes.length === 2 && table.footer && table.double_header) return true;
        else if (this.isContainRowSpan(xmlDoc)) return true;
        else if (this.isNestedTabe(this.insert)) return true;
        else return false;
    };

    isNestedTabe = editor => {
        editor.model.schema.addChildCheck((context, childDefinition) => {
            if (childDefinition.name == "table" && Array.from(context.getNames()).includes("table")) {
                return true;
            }
        });
    };

    isContainRowSpan = xmlDoc => {
        let tds = xmlDoc.getElementsByTagName("td");
        let ths = xmlDoc.getElementsByTagName("th");
        let flag = Array.from(tds)
            .concat(Array.from(ths))
            .some(td => td.hasAttribute("rowspan") && td.getAttribute("rowspan") !== "1");
        return flag;
    };

    clearInsert = () => {
        this.setState(
            {
                tempAttachment: { double_header: false, footer: false },
                missingRequiredFields: false
            },
            () => {
                this.setState({ attachmentChanged: false });
                this.props.setIsUnsaved(false);
            }
        );
    };

    disableCommand = cmd => {
        cmd.on("set:isEnabled", forceDisable, { priority: "highest" });

        cmd.isEnabled = false;

        // Make it possible to enable the command again.
        return () => {
            cmd.off("set:isEnabled", forceDisable);
            cmd.refresh();
        };

        function forceDisable(evt) {
            evt.return = false;
            evt.stop();
        }
    };

    render() {
        const { tempAttachment, isUploading, missingRequiredFields, isUpdate, isDeleting, attachmentChanged } = this.state;
        const { insertList, hasCreate, hasEdit } = this.props;
        let viewOnly = !(hasCreate || hasEdit);
        return (
            <React.Fragment>
                <div id="modalId" className={"insert-tabl modal-region modal-add-img gal-image-modal"} style={{ display: "block" }}>
                    <div className="" role="document">
                        <div className="modal-content">
                            <LoadingOverlay className="insert-tabl-wrap" active={isDeleting} spinner={<Loader />} fadeSpeed={10}>
                                <div className="modal-body region-otr">
                                    <div className="otr-add-img">
                                        <div className="add-imges col-md-7 p-0">
                                            <h3>{viewOnly ? "View Table" : isUpdate ? "Update Table" : "Add Table"}</h3>
                                            {(!viewOnly || tempAttachment?.id) && (
                                                <div className="innr-img" aria-disabled>
                                                    <div className="form-group">
                                                        <div className="formInp">
                                                            <label>Select Header *</label>
                                                        </div>
                                                        <div class="d-flex hedd-otrr">
                                                            <div className="formInp mr-3">
                                                                <label className="container-check">
                                                                    Single Header
                                                                    <input
                                                                        type="radio"
                                                                        name="double_header"
                                                                        onClick={e => this.handleChange(e)}
                                                                        checked={!tempAttachment.double_header}
                                                                        disabled={viewOnly}
                                                                    />
                                                                    <span className="checkmark white" />
                                                                </label>
                                                            </div>
                                                            <div className="formInp">
                                                                <label className="container-check">
                                                                    Double Header
                                                                    <input
                                                                        type="radio"
                                                                        name="double_header"
                                                                        onClick={e => this.handleChange(e)}
                                                                        checked={!!tempAttachment.double_header}
                                                                        disabled={viewOnly}
                                                                    />
                                                                    <span className="checkmark white" />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="formInp">
                                                            <label>Table Details *</label>
                                                        </div>
                                                        <div
                                                            className={`${
                                                                missingRequiredFields &&
                                                                (!tempAttachment.html_format || this.validateTable(tempAttachment))
                                                                    ? "error-border"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <CKEditor
                                                                editor={Editor}
                                                                config={editorConfiguration}
                                                                id={tempAttachment.id}
                                                                data={tempAttachment.html_format || ""}
                                                                disabled={viewOnly}
                                                                onReady={editor => {
                                                                    if (editor) {
                                                                        this.insert = editor;
                                                                        // disable unwanted ckeditor table features
                                                                        DISABLE_COMMANDS.map(cmd => this.disableCommand(editor.commands.get(cmd)));
                                                                    }
                                                                }}
                                                                onChange={(event, editor) => {
                                                                    const data = editor.getData();
                                                                    this.handleChangeTable(data);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <small className="text-danger">{uploadError}</small> */}
                                                    <div className="form-group">
                                                        <div className="formInp">
                                                            <label>Select Footer</label>
                                                        </div>
                                                        <div className="col-md-12 formInp p-0 cmntImg">
                                                            <label className="container-check">
                                                                Footer
                                                                <input
                                                                    type="checkbox"
                                                                    name="footer"
                                                                    onChange={e => this.handleChange(e)}
                                                                    checked={tempAttachment.footer}
                                                                    disabled={viewOnly}
                                                                />
                                                                <span className="checkmark white" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-md-12 formInp p-0 cmntImg">
                                                            <label>Table Name *</label>
                                                            <input
                                                                type="text"
                                                                autoComplete="off"
                                                                className={`${
                                                                    missingRequiredFields && !(tempAttachment.description?.trim()?.length >= 3)
                                                                        ? "error-border"
                                                                        : ""
                                                                } form-control`}
                                                                placeholder="Enter the insert name"
                                                                name="description"
                                                                maxLength="80"
                                                                value={tempAttachment.description || ""}
                                                                onChange={e => this.handleChange(e)}
                                                                disabled={viewOnly}
                                                            />
                                                        </div>
                                                    </div>
                                                    {!viewOnly && (
                                                        <div className="upld-otr d-flex">
                                                            {!isUploading ? (
                                                                !isUpdate ? (
                                                                    <>
                                                                        {attachmentChanged && (
                                                                            <label className="btn btn-light mr-2" onClick={() => this.clearInsert()}>
                                                                                Clear
                                                                            </label>
                                                                        )}
                                                                        <label
                                                                            className="custom-file-uploadd cursor-pointer"
                                                                            onClick={() => this.addInsert()}
                                                                        >
                                                                            Add Table
                                                                        </label>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <label
                                                                            className="btn btn-light mr-2"
                                                                            onClick={() => {
                                                                                this.setState({
                                                                                    tempAttachment: { double_header: false, footer: false },
                                                                                    isUpdate: null,
                                                                                    uploadError: "",
                                                                                    missingRequiredFields: false,
                                                                                    attachmentChanged: false
                                                                                });
                                                                                this.props.setIsUnsaved(false);
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </label>
                                                                        <label
                                                                            className="custom-file-uploadd cursor-pointer"
                                                                            onClick={() => this.handleUpdateInsert()}
                                                                        >
                                                                            Update
                                                                        </label>
                                                                    </>
                                                                )
                                                            ) : (
                                                                <label
                                                                    className="custom-file-uploadd cursor-pointer"
                                                                    style={{ position: "relative" }}
                                                                >
                                                                    <Loader />
                                                                </label>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="upload-fle col-md-5 p-0">
                                            <div class="top-bar-btn table-tab-header">
                                                <h3>Uploaded Tables</h3>
                                                <button class="btn-fci pl-3" onClick={() => this.props.autoPopulateTableTemplates()}>
                                                    INITIALIZE TABLE TEMPLATES
                                                </button>
                                            </div>

                                            <div className="files">
                                                {insertList?.length ? (
                                                    insertList.map((item, i) => (
                                                        <div
                                                            key={i}
                                                            className={`${tempAttachment.id === item.id ? "active " : ""}fl-dtl cursor-pointer`}
                                                            onClick={() => {
                                                                this.setState({
                                                                    tempAttachment: {
                                                                        id: item.id,
                                                                        description: item.description,
                                                                        html_format: item.html_format,
                                                                        footer: item.footer,
                                                                        double_header: item.double_header
                                                                    },
                                                                    isUpdate: item.id,
                                                                    uploadError: "",
                                                                    missingRequiredFields: false
                                                                });
                                                            }}
                                                        >
                                                            <img src="/img/table 1.svg" className="img-fl-dtl wid-unset" alt="" />
                                                            <div className="img-otr">
                                                                <p className="img-nme">{item.description}</p>
                                                            </div>
                                                            {!viewOnly && (
                                                                <>
                                                                    <i
                                                                        className="fas fa-trash cursor-pointer"
                                                                        data-tip={`Delete Table`}
                                                                        onClick={() => this.handleDeleteAttachment(item.id)}
                                                                    ></i>
                                                                    <ReactTooltip effect="solid" backgroundColor="#1383D9" />
                                                                </>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span>No Tables Available</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </LoadingOverlay>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
                {this.renderNarrCompletedConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default withRouter(InsertModal);
