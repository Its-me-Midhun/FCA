import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../actions";
import BuildModalHeader from "../../common/components/BuildModalHeader";
import ReactTooltip from "react-tooltip";
import { debounce } from "lodash";

class RecommendationTemplateModal extends Component {
    state = {
        recommendationTemplateList: [],
        totalCount: 0,
        selectedTemplates: {},
        searchKey: "",
        tempList: [],
        sortOrder: "asc"
    };

    componentDidMount = async () => {
        const {
            location: { search },
            sub_system_id
        } = this.props;
        let params = {};
        let dynamicUrl = `/sub_systems/${sub_system_id}/recommendation_templates`;
        let recommendationTemplateList = [];
        let totalCount = 0;
        await this.props.getRecommendationTemplates(params, dynamicUrl);
        recommendationTemplateList = this.props.recommendationsReducer.getRecommendationTemplatesResponse
            ? this.props.recommendationsReducer.getRecommendationTemplatesResponse.project_sub_system_recommendation_templates || []
            : [];
        totalCount = this.props.recommendationsReducer.getRecommendationTemplatesResponse
            ? this.props.recommendationsReducer.getRecommendationTemplatesResponse.count || 0
            : 0;
        await this.setState({
            recommendationTemplateList,
            tempList: recommendationTemplateList,
            totalCount
        });
    };

    setTextBandData = async (event, template) => {
        const { selectedTemplates } = this.state;
        await this.setState({
            selectedTemplates:
                template.id === selectedTemplates.id
                    ? {}
                    : {
                          id: template.id,
                          text: template.text_format,
                          description: template.description,
                          cost_per_unit: template.cost_per_unit,
                          unit: template.unit
                      }
        });
    };

    processSelectedTemplates = () => {
        const { selectedTemplates } = this.state;
        this.props.onOk(selectedTemplates);
        this.props.onCancel();
    };

    handleSearch = e => {
        const keyword = e.target.value;
        if (keyword !== "" && keyword?.trim().length) {
            const results = this.state.recommendationTemplateList.filter(item => {
                return (
                    item?.name?.toString().toLowerCase().includes(keyword.toLowerCase()) ||
                    item?.text_format?.toString().toLowerCase().includes(keyword.toLowerCase()) ||
                    item?.description?.toString().toLowerCase().includes(keyword.toLowerCase()) ||
                    item?.unit?.toString().toLowerCase().includes(keyword.toLowerCase()) ||
                    item?.cost_per_unit?.toString().toLowerCase().includes(keyword.toLowerCase())
                );
            });
            this.setState({ tempList: results });
        } else {
            this.setState({ tempList: this.state.recommendationTemplateList });
        }

        this.setState({ searchKey: keyword });
        this.debouncedChange();
    };

    debouncedChange = debounce(() => {
        ReactTooltip.rebuild();
    }, 1000);

    render() {
        const { onCancel } = this.props;
        const { tempList, searchKey, sortOrder, selectedTemplates } = this.state;
        let sortedList = [];
        if (sortOrder === "asc") {
            sortedList = tempList.sort((a, b) => (a.text_format.toLowerCase() > b.text_format.toLowerCase() ? 1 : -1));
        } else {
            sortedList = tempList.sort((a, b) => (a.text_format.toLowerCase() > b.text_format.toLowerCase() ? -1 : 1));
        }
        return (
            <React.Fragment>
                <div
                    className="modal select-template-modal slt-img-modl"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog select-rec-temp-modal" role="document">
                        <div className="modal-content">
                            <BuildModalHeader title="Select Template" onCancel={() => this.props.onCancel()} modalClass="select-rec-temp-modal" />
                            <div className="modal-body region-otr build-type-mod">
                                <div className="otr-templ-search">
                                    <div className="formInp search">
                                        <i className="fas fa-search" />
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={this.handleSearch}
                                            value={searchKey}
                                            placeholder="Search Now"
                                        />
                                    </div>
                                    <div className="sort">
                                        <select
                                            className="form-control"
                                            value={sortOrder}
                                            onChange={e => this.setState({ sortOrder: e.target.value })}
                                        >
                                            <option value="asc">ASC</option>
                                            <option value="desc">DESC</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="table-section table-scroll overflow-hght table-no-fixed">
                                    <table className="table table-common table-min-height sticky-table-otr">
                                        <thead>
                                            <tr>
                                                <th className="img-sq-box seting-type checkbox-container">
                                                    <img alt="" src="/img/sq-box.png" />
                                                </th>
                                                <th>Template</th>
                                                <th>Report Notes</th>
                                                <th className="width-100px">Cost Per Unit</th>
                                                <th>Unit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedList.length ? (
                                                sortedList.map((item, i) => (
                                                    <>
                                                        <tr key={item.id}>
                                                            <td className="img-sq-box seting-type checkbox-container">
                                                                <label class="container-checkbox cursor-hand m-0">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedTemplates.id === item.id}
                                                                        onChange={e => this.setTextBandData(e, item)}
                                                                    />
                                                                    <span class="checkmark"></span>
                                                                </label>
                                                            </td>
                                                            <td data-tip={item.text_format} data-for={`recom-template-table-row${item.id}`}>
                                                                <span className="text-overflow">{item.text_format}</span>
                                                            </td>
                                                            <td data-tip={item.description} data-for={`recom-template-table-row${item.id}`}>
                                                                <span className="text-overflow">{item.description || "-"}</span>
                                                            </td>
                                                            <td>
                                                                <span className="text-overflow">
                                                                    {item.cost_per_unit ? `$${item.cost_per_unit}` : "-"}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="text-overflow">{item.unit || "-"}</span>
                                                            </td>
                                                        </tr>
                                                        <ReactTooltip
                                                            id={`recom-template-table-row${item.id}`}
                                                            effect="solid"
                                                            place="bottom"
                                                            backgroundColor="#ff0000"
                                                            className="rc-tooltip-custom-class"
                                                            clickable={true}
                                                            html={true}
                                                            multiline={true}
                                                            getContent={dataTip => dataTip?.replace(/(?:\r\n|\r|\n)/g, "<br>")}
                                                        />
                                                    </>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center">
                                                        No Templates Found !!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="btnOtr mt-3 text-right d-flex">
                                    <div>Count : {sortedList.length}</div>
                                    <button type="button" className="btn btn-secondary btnClr ml-auto" onClick={() => onCancel()}>
                                        Cancel
                                    </button>
                                    {tempList.length ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion"
                                            disabled={!selectedTemplates.id}
                                            onClick={() => this.processSelectedTemplates()}
                                        >
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
    })(RecommendationTemplateModal)
);
