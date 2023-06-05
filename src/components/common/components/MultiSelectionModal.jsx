import React, { useState } from "react";
import _ from "lodash";

import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { Multiselect } from "multiselect-react-dropdown";

export const MultiSelectionModal = ({ currentSelection, options, onSelection, heading, onCancel, viewOnly = false, ...props }) => {
    const [selectedValues, setSelectedValues] = useState(currentSelection);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const onSelectValues = selectedValues => {
        setSelectedValues(selectedValues);
    };

    const renderConfirmationModal = () => {
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => setShowConfirmModal(false)}
                        onYes={clearForm}
                    />
                }
                onCancel={() => setShowConfirmModal(false)}
            />
        );
    };

    const handleSubmit = async () => {
        onCancel();
        onSelection(selectedValues);
    };
    const cancelForm = () => {
        if (_.isEqual(selectedValues, currentSelection)) {
            clearForm();
        } else {
            setShowConfirmModal(true);
        }
    };

    const clearForm = async () => {
        setSelectedValues({
            selectedValues: currentSelection
        });
        onCancel();
    };

    return (
        <React.Fragment>
            <div
                className="modal modal-region add-new-template"
                style={{ display: "block" }}
                id="modalId"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog build-multi-modal" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                {heading}
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => cancelForm()}>
                                <span aria-hidden="true">
                                    <img src="/img/close.svg" alt="" />
                                </span>
                            </button>
                        </div>

                        <div className="modal-body region-otr build-type-mod">
                            {!viewOnly ? (
                                <>
                                    <form autoComplete={"nope"}>
                                        <div className="form-group">
                                            <div className="formInp bgInp">
                                                {/* <label>Selected {heading}</label> */}
                                                <Multiselect
                                                    autoComplete="nope"
                                                    options={options}
                                                    selectedValues={selectedValues}
                                                    onSelect={onSelectValues}
                                                    onRemove={onSelectValues}
                                                    displayValue="name"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-md-12 p-0 text-right btnOtr">
                                        <button type="button" onClick={cancelForm} className="btn btn-primary btnRgion col-md-2 btncancel">
                                            Cancel
                                        </button>

                                        <button type="button" onClick={() => handleSubmit()} className="btn btn-primary btnRgion col-md-2">
                                            Ok
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="region-mng">
                                    <div className="tab-active">
                                        <h3>
                                            {currentSelection.length
                                                ? currentSelection.map((userItem, i) => (
                                                      <span key={i} className="badge-otr">
                                                          <img src={userItem.url ? userItem.url : "/img/user-icon.png"} alt="" />
                                                          <span className="nme">{userItem.name}</span>
                                                      </span>
                                                  ))
                                                : "No Data Available"}
                                        </h3>
                                    </div>
                                    <div className="col-md-12 p-0 text-right btnOtr">
                                        <button type="button" onClick={() => onCancel()} className="btn btn-primary btnRgion col-md-2">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {renderConfirmationModal()}
        </React.Fragment>
    );
};
