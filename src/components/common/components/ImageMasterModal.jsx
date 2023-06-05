import React from "react";
import { useState } from "react";
import { connect } from "react-redux";

import Images from "../../images";
import BuildModalHeader from "./BuildModalHeader";
function ImageMasterModal(props) {
    const [isLoading, setLoading] = useState(false);
    const {
        imageReducer: { selectedImages }
    } = props;

    const handleAssign = async () => {
        setLoading(true);
        let temp = [];
        selectedImages.map(img => {
            let obj = { id: img.id, url: img?.is_edited ? img.s3_eimage_key : img.s3_image_key };
            temp.push(obj);
        });
        await props.handleAssignImages({ images: temp });
        setLoading(false);
        props.onCancel();
    };
    const { showData = true } = props;
    return (
        <React.Fragment>
            <div
                className="modal assign-init-modal image-pull-modal"
                style={{ display: "block" }}
                id="modalId"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog assignModal" role="document">
                    <div className="modal-content">
                        <BuildModalHeader
                            title="Pull Images"
                            showData={showData}
                            entityData={props.basicDetails}
                            onCancel={props.onCancel}
                            modalClass="assignModal"
                        />

                        <form autoComplete="nope">
                            <div className="modal-body ">
                                <div className="form-group">
                                    <div className="formInp">
                                        <div className="dashboard-outer">
                                            <div className="outer-detail">
                                                <div className="right-panel-section">
                                                    <div className="dtl-sec">
                                                        <div className="dtl-sec system-building col-md-12 ">
                                                            <div className="tab-dtl region-mng">
                                                                <div className="tab-active recomdn-table bg-grey-table">
                                                                    <Images
                                                                        entity={props.entity}
                                                                        entityData={props.basicDetails}
                                                                        AssetName={props.AssetName}
                                                                        selectedFilters={props?.selectedFilters}
                                                                        isSmartChartView={props?.isSmartChartView}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 p-0 text-right btnOtr">
                                        {props.submitAssign ? (
                                            <button type="button" className="btn btn-primary btnRgion col-md-2">
                                                <div className="button-loader d-flex justify-content-center align-items-center">
                                                    <div className="spinner-border text-white" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ) : (
                                            <button
                                                disabled={!selectedImages?.length || isLoading}
                                                type="button"
                                                onClick={() => handleAssign()}
                                                className="btn btn-primary btnRgion col-md-2"
                                            >
                                                Assign {isLoading && <span className="spinner-border spinner-border-sm pl-2" role="status"></span>}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};

export default connect(mapStateToProps)(ImageMasterModal);
