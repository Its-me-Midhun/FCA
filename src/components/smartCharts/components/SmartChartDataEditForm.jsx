import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import actions from "../actions";
import { FILE_TYPE } from "../../common/constants";

const SmartChartDataEditForm = ({
    selectedData,
    updateData,
    actionType = "",
    regenerateSmartChart,
    heading,
    buttonText,
    hasExportType = false,
    exportSmartChart,
    hasNotes = true,
    ...props
}) => {
    const [formParams, setFormParams] = useState({
        name: "",
        notes: ""
    });
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const [exportType, setExportType] = useState(FILE_TYPE.WORD);

    useEffect(() => {
        setFormParams({
            name: selectedData?.name || "",
            notes: selectedData?.notes || ""
        });
    }, []);

    const validate = () => {
        setShowErrorBorder(false);
        if (!formParams.name && !formParams.name.trim().length) {
            setShowErrorBorder(true);
            return false;
        }
        return true;
    };

    const updateSmartChartData = async () => {
        let exportParams = {
            property_id: selectedData?.smart_export_props,
            ...formParams
        };
        let updateParams = {
            ...formParams
        };
        switch (exportType) {
            case FILE_TYPE.PDF:
                exportParams.is_pdf = true;
                updateParams.is_pdf = true;
                break;
            case FILE_TYPE.PPT:
                exportParams.is_ppt = true;
                updateParams.is_ppt = true;
                break;
            case FILE_TYPE.WORD:
                break;
            default:
                break;
        }
        if (validate()) {
            actionType === "Regenerate"
                ? regenerateSmartChart(exportParams)
                : actionType === "Export"
                ? exportSmartChart(exportParams)
                : updateData({ ...updateParams }, selectedData?.id);
            props.onCancel();
        }
    };
    return (
        <React.Fragment>
            <div className="modal modal-region modal-view inbox-modal" id="modalId" tabIndex="-1" style={{ display: "block" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                <div className="txt-hed">{heading}</div>
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
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            placeholder="Name"
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
                                <div className="form-row">
                                    {hasNotes ? (
                                        <div className="form-group col-12 mb-4">
                                            <label>Notes</label>
                                            <textarea
                                                className="form-control textarea"
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
                                            ></textarea>
                                        </div>
                                    ) : null}
                                </div>
                                {hasExportType ? (
                                    <div className="form-row">
                                        <div className="form-group col-3">
                                            <label className="container-check re-check-container">
                                                Word
                                                <input
                                                    type="radio"
                                                    name="export_type"
                                                    onClick={e => setExportType(FILE_TYPE.WORD)}
                                                    checked={exportType === FILE_TYPE.WORD}
                                                />
                                                <span className="checkmark white" />
                                            </label>
                                        </div>
                                        <div className="form-group col-3">
                                            <label className="container-check re-check-container">
                                                PDF
                                                <input
                                                    type="radio"
                                                    name="export_type"
                                                    onClick={e => setExportType(FILE_TYPE.PDF)}
                                                    checked={exportType === FILE_TYPE.PDF}
                                                />
                                                <span className="checkmark white" />
                                            </label>
                                        </div>
                                        <div className="form-group col-3">
                                            <label className="container-check re-check-container">
                                                PPT
                                                <input
                                                    type="radio"
                                                    name="export_type"
                                                    onClick={e => setExportType(FILE_TYPE.PPT)}
                                                    checked={exportType === FILE_TYPE.PPT}
                                                />
                                                <span className="checkmark white" />
                                            </label>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="btn-sec">
                                <div className="text-right btnOtr edit-cmn-btn">
                                    <button
                                        type="button"
                                        className="btn btn-primary btnRgion "
                                        class="btn btn-create save"
                                        onClick={() => updateSmartChartData()}
                                    >
                                        {buttonText}
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

const { uploadDocsForSmartReport } = actions;

export default connect(mapStateToProps, { uploadDocsForSmartReport })(SmartChartDataEditForm);
