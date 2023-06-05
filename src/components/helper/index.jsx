import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import history from "../../config/history";
import Portal from "../common/components/Portal";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../common/components/Loader";
import helperActions from "./actions";
import UploadHelperModal from "./components/UploadHelperModal";
import ShowHelperModal from "./components/ShowHelperModal";
import commonActions from "../common/actions";

class templateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateList: [],
            clientIdList: [],
            initialValues: {},
            formParams: {
                name: null,
                display_order: null,
                logs: null,
                forms: null,
                menu: null,
                assign: null,
                event: null,
                template: true
            },
            errorParams: {
                name: false,
                consultancy_id: false
            },
            isEdit: false,
            showErrorBorder: false,
            isUploading: false,
            selectedTemplate: props.match.params.id,
            activeTab: "menu",
            activeTabItems: {},
            activeTabHeaders: [],
            showHelperModal: false,
            selectedHelperItem: {}
        };
    }

    componentDidMount = async () => {
        await this.refreshHelperData();
        this.setActiveTab("menu");
    };

    refreshHelperData = async () => {
        await this.props.getHelperData();
        const {
            helperReducer: {
                getHelperDataResponse: { page_info, success }
            }
        } = this.props;
        if (success) {
            await this.setState({
                formParams: page_info,
                isLoading: false
            });
        }
        localStorage.setItem("page_info", JSON.stringify(page_info));
        return true;
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    updateHelper = async () => {
        const { formParams } = this.state;
        await this.props.updateHelper({ page_info: formParams });
        const {
            helperReducer: { updateHelperResponse }
        } = this.props;
        await this.setState({
            alertMessage: updateHelperResponse.message || updateHelperResponse.error
        });
        this.showAlert();
        this.refreshHelperData();
    };

    cancelForm = () => {
        this.props.setFormDirty(false);
        this.refreshHelperData();
    };

    setActiveTab = async keyItem => {
        const { formParams } = this.state;
        let activeTabItems = formParams[keyItem];
        let activeTabHeaders = [];
        activeTabHeaders = activeTabItems && Object.keys(activeTabItems[Object.keys(activeTabItems)[0]]);
        await this.setState({ activeTab: keyItem, activeTabItems, activeTabHeaders });
    };

    updateFormValues = async (activeTab, item, subItem, value) => {
        const { formParams } = this.state;
        let tempFormParams = formParams;
        if (subItem) {
            tempFormParams[activeTab][item][subItem] = value;
        } else {
            tempFormParams[activeTab][item] = value;
        }
        await this.setState({
            formParams: tempFormParams
        });
    };

    areAllValuesChecked = column => {
        const { formParams, activeTab } = this.state;
        for (const item in formParams[activeTab]) {
            if (formParams[activeTab][item][column] !== true && formParams[activeTab][item][column] !== null) return false;
        }
        return true;
    };

    selectAllValuesInColumn = async column => {
        const { formParams, activeTab } = this.state;
        let tempFormParams = formParams;
        let setVal = !this.areAllValuesChecked(column);
        for (const item in formParams[activeTab]) {
            if (tempFormParams[activeTab][item][column] !== null) tempFormParams[activeTab][item][column] = setVal;
        }
        await this.setState({
            formParams: tempFormParams
        });
    };

    updateFormContent = async (activeTab, item, subItem, value) => {
        const { formParams } = this.state;
        let tempFormParams = formParams;
        if (subItem) {
            tempFormParams[activeTab][item][subItem] = value;
        } else {
            tempFormParams[activeTab][item] = value;
        }
        await this.setState({
            formParams: tempFormParams
        });
    };

    showHelperModal = async (item, subItem) => {
        await this.setState({
            showHelperModal: true,
            selectedHelperItem: {
                item,
                subItem
            }
        });
    };

    renderHelperModal = () => {
        const { showHelperModal, selectedHelperItem } = this.state;
        if (!showHelperModal) return null;
        return (
            <Portal
                body={<ShowHelperModal selectedHelperItem={selectedHelperItem} onCancel={() => this.setState({ showHelperModal: false })} />}
                onCancel={() => this.setState({ showHelperModal: false })}
            />
        );
    };

    showUploadHelperModal = async (activeTab, item, subItem, value) => {
        await this.setState({
            showUploadHelperModal: true,
            selectedHelperItem: {
                activeTab,
                item,
                subItem,
                value
            }
        });
    };

    renderUploadHelperModal = () => {
        const { showUploadHelperModal, isUploading } = this.state;
        if (!showUploadHelperModal) return null;
        return (
            <Portal
                body={
                    <UploadHelperModal
                        uploadHelperDocToAWS={this.uploadHelperDocToAWS}
                        handleUpdateHelper={this.handleUpdateHelper}
                        isUploading={isUploading}
                        onCancel={() => this.setState({ showUploadHelperModal: false })}
                    />
                }
                onCancel={() => this.setState({ showUploadHelperModal: false })}
            />
        );
    };

    handleUpdateHelper = async helperValues => {
        this.props.setFormDirty(true);
        const {
            selectedHelperItem: { activeTab, item, subItem, value }
        } = this.state;
        const { formParams } = this.state;
        let tempFormParams = formParams;
        if (subItem) {
            tempFormParams[activeTab][item][subItem] = helperValues;
        } else {
            tempFormParams[activeTab][item] = helperValues;
        }
        await this.setState({
            formParams: tempFormParams,
            showUploadHelperModal: false
        });
    };

    uploadHelperDocToAWS = async file => {
        await this.setState({
            isUploading: true
        });
        let helperDoc = new FormData();
        helperDoc.append("document", file);
        await this.props.uploadHelperDocToAWS(helperDoc);
        const {
            helperReducer: {
                uploadHelperDocToAWSResponse: { message, success, url }
            }
        } = this.props;
        await this.setState({
            isUploading: false
        });
        if (success) {
            return url;
        }
        return null;
    };

    render() {
        const { isLoading, formParams, showErrorBorder, errorParams, selectedTemplate, initialValues, activeTab, activeTabItems, activeTabHeaders } =
            this.state;

        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div className="dtl-sec col-md-12 usr-grp helper-main-container">
                    <div className="tab-dtl region-mng ">
                        <div className="bg-white">
                            <div className="h-ara">
                                <div className="otr-topr">
                                    <h2>Helpers</h2>
                                </div>
                            </div>
                            <div className="min-nav">
                                <ul>
                                    {formParams &&
                                        Object.keys(formParams).map(keyItem =>
                                            keyItem !== "_id" ? (
                                                <li className={`${activeTab === keyItem ? "active" : ""}`} onClick={() => this.setActiveTab(keyItem)}>
                                                    {keyItem}
                                                </li>
                                            ) : null
                                        )}
                                </ul>
                            </div>
                            <div className="table-section">
                                <table className="table table-common table-min-height mt-0 tbl-area">
                                    <thead>
                                        <tr>
                                            <th className=" cursor-pointer">Title </th>
                                            {activeTabHeaders && activeTabHeaders.length
                                                ? activeTabHeaders.map(item => (
                                                      <th className=" cursor-pointer">
                                                          {item !== "content" ? (
                                                              <label className="container-check">
                                                                  {item}

                                                                  <input type="checkbox" checked={this.areAllValuesChecked(item)} />
                                                                  <span
                                                                      className="checkmark"
                                                                      onClick={() => this.selectAllValuesInColumn(item)}
                                                                  ></span>
                                                              </label>
                                                          ) : (
                                                              <label>{item}</label>
                                                          )}
                                                      </th>
                                                  ))
                                                : null}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTabItems
                                            ? Object.keys(activeTabItems).map(item => (
                                                  <tr className="table-row">
                                                      <td>{item}</td>
                                                      {Object.keys(activeTabItems[item]).map((subItem, i) => (
                                                          <td>
                                                              {subItem === "content" ? (
                                                                  <div class="helper-action-container">
                                                                      <button
                                                                          className="add-btn"
                                                                          onClick={() =>
                                                                              this.showUploadHelperModal(
                                                                                  activeTab,
                                                                                  item,
                                                                                  subItem,
                                                                                  !formParams[activeTab][item][subItem]
                                                                              )
                                                                          }
                                                                      >
                                                                          <i className="fas fa-plus"></i> Update Content
                                                                      </button>
                                                                      <img
                                                                          src="/img/eye-ico.svg"
                                                                          alt=""
                                                                          className="eye-ico"
                                                                          onClick={() => {
                                                                              this.showHelperModal(activeTab, item);
                                                                          }}
                                                                      />
                                                                      {formParams[activeTab][item][subItem].description?.length ||
                                                                      formParams[activeTab][item][subItem].file_url?.length ? (
                                                                          <img
                                                                              src="/img/check_green.svg"
                                                                              class="no-recom img-helper-icon"
                                                                              alt=""
                                                                              data-tip="Used"
                                                                              currentitem="false"
                                                                          />
                                                                      ) : null}
                                                                  </div>
                                                              ) : (
                                                                  <label
                                                                      className={`container-check ${
                                                                          formParams[activeTab][item][subItem] === null ? "disabled" : ""
                                                                      }`}
                                                                  >
                                                                      <input
                                                                          type="checkbox"
                                                                          checked={
                                                                              formParams[activeTab][item][subItem] !== null &&
                                                                              formParams[activeTab][item][subItem]
                                                                          }
                                                                          disabled={formParams[activeTab][item][subItem] === null ? true : false}
                                                                          onClick={() =>
                                                                              this.updateFormValues(
                                                                                  activeTab,
                                                                                  item,
                                                                                  subItem,
                                                                                  !formParams[activeTab][item][subItem]
                                                                              )
                                                                          }
                                                                      />
                                                                      <span className={`checkmark`}></span>
                                                                  </label>
                                                              )}
                                                          </td>
                                                      ))}
                                                  </tr>
                                              ))
                                            : null}
                                    </tbody>
                                </table>
                            </div>
                            <div class="d-flex mt-3 border-top pt-3">
                                <div class="col-md-4 drp-btn ml-auto mb-3">
                                    <button type="button" class="btn btn-primary btnClr mr-3" onClick={() => this.cancelForm()}>
                                        Cancel
                                    </button>
                                    <button type="button" class="btn btn-primary btnRgion" onClick={() => this.updateHelper()}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderUploadHelperModal()}
                {this.renderHelperModal()}
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { helperReducer } = state;
    return { helperReducer };
};

export default withRouter(connect(mapStateToProps, { ...helperActions, ...commonActions })(templateForm));
