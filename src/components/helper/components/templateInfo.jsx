import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import FormData from "../../userPermissions/components/formData";
import Actions from "../../userPermissions/actions";

class TemplateInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateList: [],
            clientIdList: [],
            initialValues: {},
            formParams: {
                name: null,
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
            selectedTemplate: props.match.params.id,
            activeTab: "menu",
            activeTabItems: {},
            activeTabHeaders: []
        };
    }
    componentDidMount = async () => {
        const { selectedTemplate } = this.state;
        await this.props.getTemplateInitialValues();
        await this.setState({
            initialValues:
                this.props.userPermissionReducer.getTemplateInitialValuesResponse.data &&
                this.props.userPermissionReducer.getTemplateInitialValuesResponse.data.permissions,
            formParams: {
                ...(this.props.userPermissionReducer.getTemplateInitialValuesResponse.data &&
                    this.props.userPermissionReducer.getTemplateInitialValuesResponse.data.permissions),
                name: null,
                template: true
            }
        });
        this.setActiveTab("menu");
        if (selectedTemplate) {
            await this.props.getUserPermissionsById(selectedTemplate);
            const {
                userPermissionReducer: {
                    getUserPermissionsById: {
                        permission: {
                            assign,
                            consultancy,
                            forms,
                            id,
                            logs,
                            menu,
                            name,
                            efci_and_sandbox,
                            charts_and_graph,
                            narratives,
                            template,
                            event
                        },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        assign,
                        efci_and_sandbox,
                        charts_and_graph,
                        consultancy_id: consultancy.id,
                        forms,
                        narratives,
                        id,
                        logs,
                        menu,
                        event,
                        name,
                        is_template: template
                    },
                    initialData: {
                        assign,
                        efci_and_sandbox,
                        charts_and_graph,
                        consultancy_id: consultancy.id,
                        forms,
                        narratives,
                        id,
                        logs,
                        menu,
                        event,
                        name,
                        is_template: template
                    },
                    isEdit: true
                });
                // this.getUserListForPermissions(consultancy.id);
            }
        }
    };

    setActiveTab = async keyItem => {
        const { formParams } = this.state;
        let activeTabItems = formParams[keyItem];
        let activeTabHeaders = [];
        activeTabHeaders = activeTabItems && Object.keys(activeTabItems[Object.keys(activeTabItems)[0]]);
        await this.setState({ activeTab: keyItem, activeTabItems, activeTabHeaders });
    };

    areAllValuesChecked = column => {
        const { formParams, activeTab } = this.state;
        for (const item in formParams[activeTab]) {
            if (activeTab === "menu") {
                if (formParams[activeTab][item].view !== true && formParams[activeTab][item].view !== null) return false;
                if (Object.keys(formParams[activeTab][item]).length > 1)
                    for (const submenu in formParams[activeTab][item]) {
                        if (submenu !== "view" && formParams[activeTab][item][submenu].view !== null && !formParams[activeTab][item][submenu].view)
                            return false;
                    }
            } else {
                if (formParams[activeTab][item][column] !== true && formParams[activeTab][item][column] !== null) return false;
            }
        }
        return true;
    };

    selectAllValuesInColumn = async column => {
        const { formParams, activeTab } = this.state;
        let tempFormParams = formParams;
        let setVal = !this.areAllValuesChecked(column);
        for (const item in formParams[activeTab]) {
            if (activeTab === "menu") {
                if (tempFormParams[activeTab][item].view !== null) tempFormParams[activeTab][item].view = setVal;
                if (Object.keys(tempFormParams[activeTab][item]).length > 1)
                    for (const submenu in tempFormParams[activeTab][item]) {
                        if (submenu !== "view" && tempFormParams[activeTab][item][submenu].view !== null)
                            tempFormParams[activeTab][item][submenu].view = setVal;
                    }
            } else {
                if (tempFormParams[activeTab][item][column] !== null) tempFormParams[activeTab][item][column] = setVal;
            }
        }
        await this.setState({
            formParams: tempFormParams
        });
    };

    updateFormValues = async (activeTab, item, subItem, value) => {
        const { formParams } = this.state;
        let tempFormParams = formParams;
        if (subItem) {
            if (activeTab === "menu") {
                if (tempFormParams[activeTab][item][subItem].view !== null) tempFormParams[activeTab][item][subItem].view = value;
                if (value) {
                    if (tempFormParams[activeTab][item].view !== null) tempFormParams[activeTab][item].view = value;
                } else {
                    let tempVal = false;
                    for (const submenu in tempFormParams[activeTab][item]) {
                        if (submenu !== "view" && tempFormParams[activeTab][item][submenu].view !== null) {
                            if (tempFormParams[activeTab][item][submenu].view === true) tempVal = true;
                            tempFormParams[activeTab][item].view = tempVal;
                        }
                    }
                }
            } else {
                tempFormParams[activeTab][item][subItem] = value;
            }
        } else {
            if (activeTab === "menu") {
                if (tempFormParams[activeTab][item].view !== null) tempFormParams[activeTab][item].view = value;
                if (Object.keys(tempFormParams[activeTab][item]).length > 1)
                    for (const submenu in tempFormParams[activeTab][item]) {
                        if (submenu !== "view" && tempFormParams[activeTab][item][submenu].view !== null)
                            tempFormParams[activeTab][item][submenu].view = value;
                    }
            } else {
                tempFormParams[activeTab][item] = value;
            }
        }
        await this.setState({
            formParams: tempFormParams
        });
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            name: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addTemplate = async () => {
        const { formParams, initialValues } = this.state;
        if (this.validate()) {
            await this.props.addUserPermissions({ permissions: formParams });
            await this.props.handleSubmit();
        }
    };

    updateTemplate = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editUserPermissionsById({ permissions: formParams }, this.props.match.params.id);
            await this.props.handleSubmit(true);
        }
    };

    render() {
        const { handleCancel, handleIsTemplate, handleDeleteGroup } = this.props;

        const { formParams, showErrorBorder, errorParams, selectedTemplate, initialValues, activeTab, activeTabItems, activeTabHeaders } = this.state;

        return (
            <div className="dtl-sec col-md-12 usr-grp">
                <div className="tab-dtl region-mng ">
                    <ul>
                        <li className="cursor-pointer active">Users Group</li>
                    </ul>
                    <form autocomplete="off">
                        <div className="tab-active bg-grey-table p-3">
                            <div className="bg-white">
                                <div className="h-ara">
                                    {selectedTemplate ? (
                                        <div className="text-right">
                                            <span onClick={() => handleDeleteGroup(selectedTemplate)} className="edit-icn-bx">
                                                <i className="fas fa-trash-alt"></i> Delete
                                            </span>
                                        </div>
                                    ) : null}
                                    <div className="otr-topr">
                                        <h2>Template</h2>
                                    </div>
                                    {/* onClick={() => handleDeleteGroup(groupData.id)} */}
                                </div>

                                <div className="d-fex">
                                    <div className="frm-area">
                                        <div className="col">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    id="text"
                                                    value={formParams.name}
                                                    onChange={e => {
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                name: e.target.value
                                                            }
                                                        });
                                                    }}
                                                    className={`${showErrorBorder && errorParams.name ? "error-border" : ""} form-control`}
                                                    placeholder="Template Name *"
                                                    autocomplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="container-check">
                                                    Is Template
                                                    <input type="checkbox" name="isTemplate" checked={true} onChange={e => handleIsTemplate(e)} />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="min-nav">
                                    <ul>
                                        {initialValues &&
                                            Object.keys(initialValues).map(keyItem => (
                                                <li className={`${activeTab === keyItem ? "active" : ""}`} onClick={() => this.setActiveTab(keyItem)}>
                                                    {keyItem}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                <FormData
                                    activeTabHeaders={activeTabHeaders}
                                    selectAllValuesInColumn={this.selectAllValuesInColumn}
                                    areAllValuesChecked={this.areAllValuesChecked}
                                    activeTabItems={activeTabItems}
                                    activeTab={activeTab}
                                    formParams={formParams}
                                    updateFormValues={this.updateFormValues}
                                />
                                <div className="d-flex mt-3 border-top pt-3">
                                    {" "}
                                    <div className="col-md-4 drp-btn ml-auto mb-3">
                                        <button type="button" className="btn btn-primary btnClr mr-3" onClick={() => handleCancel()}>
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion"
                                            onClick={() => (selectedTemplate ? this.updateTemplate() : this.addTemplate())}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { userPermissionReducer } = state;
    return { userPermissionReducer };
};

export default withRouter(connect(mapStateToProps, { ...Actions })(TemplateInfo));
