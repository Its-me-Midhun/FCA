import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { connect } from "react-redux";
import actions from "../../actions";
import BuildModalHeader from "../../../common/components/BuildModalHeader";

class TemplateModal extends Component {
    state = {
        narrativeTemplateList: [],
        totalCount: 0,
        selectedTemplates: []
    };

    componentDidMount = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let params = {};
        let dynamicUrl = `/trades/${query.narratable_id}/narrative_templates`;
        if (query.narratable_type === "System") {
            dynamicUrl = `/systems/${query.narratable_id}/narrative_templates`;
        } else if (query.narratable_type === "SubSystem") {
            dynamicUrl = `/sub_systems/${query.narratable_id}/narrative_templates`;
        }
        let narrativeTemplateList = [];
        let totalCount = 0;
        await this.props.getNarrativeTemplates(params, dynamicUrl);
        narrativeTemplateList = this.props.fcaReportReducer.getNarrativeTemplatesResponse
            ? this.props.fcaReportReducer.getNarrativeTemplatesResponse.narrative_templates || []
            : [];
        totalCount = this.props.fcaReportReducer.getNarrativeTemplatesResponse
            ? this.props.fcaReportReducer.getNarrativeTemplatesResponse.count || 0
            : 0;
        await this.setState({
            narrativeTemplateList,
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
        selectedTemplates.map(item => (returnArray = returnArray + `<p>${item.text.replaceAll("\n", "</p><p>")}</p>`));
        this.props.onOk(returnArray);
    };

    render() {
        const { onCancel } = this.props;
        const { narrativeTemplateList } = this.state;

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
                    <div className="modal-dialog select-temp-modal" role="document">
                        <div className="modal-content">
                            <BuildModalHeader title="Select Template" onCancel={() => this.props.onCancel()} modalClass="select-temp-modal" />
                            <div className="modal-body region-otr build-type-mod">
                                <div className="templateList">
                                    {narrativeTemplateList.length ? (
                                        narrativeTemplateList.map((item, i) => (
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
                                    {narrativeTemplateList.length ? (
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
    const { fcaReportReducer } = state;
    return { fcaReportReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(TemplateModal)
);
