import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { connect } from "react-redux";

import actions from "../actions";
import BuildModalHeader from "../../common/components/BuildModalHeader";

class RepotNoteTemplateModal extends Component {
    state = {
        reportNoteTemplateList: [],
        totalCount: 0,
        selectedTemplates: []
    };

    componentDidMount = async () => {
        const {
            sub_system_id
        } = this.props;
        let params = {};
        let dynamicUrl = `/sub_systems/${sub_system_id}/report_note_templates`;
        let reportNoteTemplateList = [];
        let totalCount = 0;
        await this.props.getReportNoteTemplates(params, dynamicUrl);
        reportNoteTemplateList = this.props.recommendationsReducer.getReportNoteTemplatesResponse
            ? this.props.recommendationsReducer.getReportNoteTemplatesResponse.report_note_templates || []
            : [];
        totalCount = this.props.recommendationsReducer.getReportNoteTemplatesResponse
            ? this.props.recommendationsReducer.getReportNoteTemplatesResponse.count || 0
            : 0;
        await this.setState({
            reportNoteTemplateList,
            totalCount
        });
    };

    setTextBandData = async (event, template) => {
        const { selectedTemplates } = this.state;
        let tempData = selectedTemplates;

        if (tempData && tempData.length) {
            if (tempData.find(item => item.id === template.id)) {
                tempData = tempData.filter(item => item.id !== template.id);
            } else {
                tempData.push({ id: template.id, text: template.text_format });
            }
        } else {
            tempData.push({ id: template.id, text: template.text_format });
        }
        await this.setState({
            selectedTemplates: tempData
        });
    };

    processSelectedTemplates = () => {
        const { selectedTemplates } = this.state;
        let returnArray = "";
        selectedTemplates.map(item => (returnArray = returnArray + `${item.text}`));
        this.props.onOk(returnArray);
        this.props.onCancel();
    };

    render() {
        const { onCancel } = this.props;
        const { reportNoteTemplateList } = this.state;

        return (
            <React.Fragment>
                <div
                    className="modal select-template-modal slt-img-modl"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog select-rec-temp-modal" role="document">
                        <div className="modal-content">
                            <BuildModalHeader title="Select Template" onCancel={() => this.props.onCancel()} modalClass="select-rec-temp-modal" />
                            <div className="modal-body region-otr build-type-mod">
                                <div className="templateList">
                                    {reportNoteTemplateList.length ? (
                                        reportNoteTemplateList.map((item, i) => (
                                            <div className="templateItem">
                                                <div className="template-name">
                                                    <span className="mr-3">{item.name}</span>
                                                    <span>{item.description}</span>
                                                </div>
                                                <p>
                                                    <label className="container-check">
                                                        <input
                                                            className="form-check-input ml-2"
                                                            type="checkbox"
                                                            onClick={e => this.setTextBandData(e, item)}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    <span className="template-text">
                                                        <span className="template-data">{item.text_format}</span>
                                                    </span>
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <div className="no-img">
                                                <img src="/img/Group 6.svg" alt="" />
                                                Templates not available
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="btnOtr mt-3 text-right">
                                    <button type="button" className="btn btn-secondary btnClr" onClick={() => onCancel()}>
                                        Cancel
                                    </button>
                                    {reportNoteTemplateList.length ? (
                                        <button type="button" className="btn btn-primary btnRgion" onClick={() => this.processSelectedTemplates()}>
                                            Add
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { recommendationsReducer } = state;
    return { recommendationsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(RepotNoteTemplateModal)
);
