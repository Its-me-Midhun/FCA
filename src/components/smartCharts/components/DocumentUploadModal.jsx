import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import actions from "../actions";

const DocumentUploadModal = ({ uploadDocs, selectedDoc = null, defaultClient, editUserDoc, tabName, ...props }) => {
    const [formParams, setFormParams] = useState({
        name: "",
        file: null,
        client_id: defaultClient,
        notes: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        props.getClientDropDownData();
        if (selectedDoc) {
            setFormParams({
                name: selectedDoc.name || selectedDoc?.gallery_image?.caption || "",
                notes: selectedDoc.notes
            });
        }
    }, []);

    const handleFileChange = e => {
        if (e?.target?.files) {
            let selectedFile = e.target.files[0];
            // let ext = selectedFile.name.split(".").pop();
            // const acceptableExt =  ["docx"];
            // if (acceptableExt.includes(ext.toLowerCase())) {
            if (selectedFile.size < 25000000) {
                setErrorMessage("");
                setFormParams(prevParams => {
                    return {
                        ...prevParams,
                        file: selectedFile
                    };
                });
            } else {
                setErrorMessage("File is too big. Files with size greater than 25MB is not allowed.");
            }
            // } else {
            //     setErrorMessage("Accept only docx file format!");
            // }
        }
    };

    const validate = () => {
        setShowErrorBorder(false);
        if (!formParams.name && !formParams.name.trim().length) {
            setShowErrorBorder(true);
            return false;
        }
        if (!selectedDoc && !formParams.client_id && !formParams.client_id.trim().length) {
            setShowErrorBorder(true);
            return false;
        }
        if (!selectedDoc && !formParams.file) {
            setShowErrorBorder(true);
            return false;
        }
        return true;
    };

    const uploadDocument = async () => {
        const { name, file, client_id, notes } = formParams;
        if (validate()) {
            if (selectedDoc) {
                await editUserDoc(selectedDoc.id, { name, notes });
                props.onCancel();
            } else {
                setIsUploading(true);
                await uploadDocs({ name, file, client_id, notes });
                setIsUploading(false);
                props.onCancel();
            }
        }
    };

    let clientList = props?.smartChartReducer?.getClientDropDownDataResponse?.data || [];
    return (
        <React.Fragment>
            <div className="modal modal-region modal-view inbox-modal" id="modalId" tabIndex="-1" style={{ display: "block" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                <div className="txt-hed">{selectedDoc ? `Edit ${tabName}` : `Upload ${tabName}`}</div>
                            </h5>
                            <button type="button" className="close" onClick={props.onCancel}>
                                <span aria-hidden="true">
                                    <img src="/img/close.svg" alt="" />
                                </span>
                            </button>
                        </div>
                        <div className="modal-body region-otr sm-chart-upload">
                            <div className="upload-area not-draggable">
                                <div className="upload-sec cursor-hand" role="button" tabIndex="0">
                                    <input type="file" multiple="" autocomplete="off" tabIndex="-1" style={{ display: "none" }} />
                                </div>
                            </div>
                            <div className="col-md-12 main-sec">
                                <div className="form-row">
                                    <div className="form-group col-12 mb-4">
                                        <label>{tabName === "Image" ? "Caption" : "Name"}</label>
                                        <input
                                            type="text"
                                            value={formParams.name}
                                            onChange={e => {
                                                let value = e.target.value;
                                                setFormParams(prevParams => {
                                                    return {
                                                        ...prevParams,
                                                        name: value
                                                    };
                                                });
                                            }}
                                            className={`form-control ${
                                                showErrorBorder && !formParams.name && !formParams.name.trim().length ? "error-border" : ""
                                            }`}
                                        />
                                    </div>
                                </div>
                                {!selectedDoc ? (
                                    <div className="form-row">
                                        <div className="form-group col-12 mb-4">
                                            <label>Client</label>
                                            <select
                                                className={`form-control dropdown export-prop-select ${
                                                    showErrorBorder && !formParams.client_id && !formParams.client_id.trim().length
                                                        ? "error-border"
                                                        : ""
                                                }`}
                                                value={formParams.client_id}
                                                onChange={e => {
                                                    let value = e.target.value;
                                                    setFormParams(prevParams => {
                                                        return {
                                                            ...prevParams,
                                                            client_id: value
                                                        };
                                                    });
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {clientList.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="form-row">
                                    <div className="form-group col-12 mb-4">
                                        <label>Notes</label>
                                        <textarea
                                            className={`form-control`}
                                            value={formParams.notes}
                                            onChange={e => {
                                                let value = e.target.value;
                                                setFormParams(prevParams => {
                                                    return {
                                                        ...prevParams,
                                                        notes: value
                                                    };
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                {!selectedDoc ? (
                                    <div class="drag-otr col-md-12">
                                        <p>Select file</p>
                                        <input
                                            type="file"
                                            multiple
                                            class="custome-file-input cursor-hand"
                                            id="customFile"
                                            onChange={handleFileChange}
                                            accept={tabName === "Image" ? "image/*" : ".docx"}
                                        />
                                        <span class="show-btn">Browse</span>
                                    </div>
                                ) : null}
                                {formParams.file ? (
                                    <div className="col-md-12 pl-0 mb-3 mt-3 pr-0">
                                        <div className="upload-sec">
                                            <div className="form-group uplod-sec-fld mb-2">
                                                <div className="upload-files-nme mt-0">
                                                    <span className="badge-nme">
                                                        <label>{formParams.file.name} </label>
                                                        <i
                                                            className="material-icons close-icon"
                                                            onClick={e => {
                                                                e.stopPropagation();

                                                                setFormParams(prevParams => {
                                                                    return {
                                                                        ...prevParams,
                                                                        file: null
                                                                    };
                                                                });
                                                            }}
                                                        >
                                                            {/* <img src="/img/close-icn-white.svg" /> */}
                                                        </i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                {errorMessage ? (
                                    <div className="col-md-12 p-0 pb-4 text-right text-danger">
                                        <small>{`* ${errorMessage}`}</small>
                                    </div>
                                ) : null}
                            </div>
                            <div className="btn-sec">
                                <div className="text-right btnOtr edit-cmn-btn">
                                    <button
                                        type="button"
                                        className="btn btn-primary btnRgion "
                                        class="btn btn-create save"
                                        onClick={() => uploadDocument()}
                                    >
                                        {selectedDoc ? "Update" : "Upload"}
                                        {isUploading ? <span className="spinner-border spinner-border-sm pl-2 ml-2" role="status"></span> : ""}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary btnClr mr-1"
                                        data-dismiss="modal"
                                        onClick={() => props.onCancel()}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    const { smartChartReducer } = state;
    return { smartChartReducer };
};

const { uploadDocsForSmartReport, getClientDropDownData } = actions;

export default connect(mapStateToProps, { uploadDocsForSmartReport, getClientDropDownData })(DocumentUploadModal);
