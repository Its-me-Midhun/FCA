/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import Highlighter from "react-highlight-words";

import actions from "../actions";
import commonActions from "../../common/actions";
import FormData from "./formData";
import HelperIcon from "../../helper/components/HelperIcon";
import exclmIcon from "../../../assets/img/recom-icon.svg";

class userPermissionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyIdList: [],
            templateList: [],
            clientIdList: [],
            formParams: {
                forms: null,
                logs: null,
                menu: null,
                assign: null,
                event: null,
                name: null,
                // display_order: "1",
                consultancy_id: null,
                is_template: false
            },
            errorParams: {
                name: false,
                consultancy_id: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedUserPermission: props.match.params.id || null,
            activeTab: "menu",
            activeTabItems: {},
            activeTabHeaders: [],
            selectedTemplate: null,
            assigned_users: [],
            available_users: [],
            user_ids: [],
            initialData: {
                forms: null,
                logs: null,
                menu: null,
                assign: null,
                event: null,
                name: null,
                // display_order: "1",
                consultancy_id: null,
                is_template: false
            },
            showConfirmModal: false,
            currentUser: "",
            showUsers: false,
            searchKeyWord: ""
        };
    }

    componentDidMount = async () => {
        const { selectedUserPermission } = this.state;
        await this.props.getAllConsultancyUser();
        await this.props.getTemplateInitialValues();
        await this.props.getAllTemplate();
        await this.setState({
            consultancyIdList: this.props.userPermissionReducer.consultancyUser.consultancies,
            templateList: this.props.userPermissionReducer.getAllTemplate.templates,
            initialValues:
                this.props.userPermissionReducer.getTemplateInitialValuesResponse.data &&
                this.props.userPermissionReducer.getTemplateInitialValuesResponse.data.permissions,
            formParams: {
                ...(this.props.userPermissionReducer.getTemplateInitialValuesResponse.data &&
                    this.props.userPermissionReducer.getTemplateInitialValuesResponse.data.permissions),
                name: null,
                consultancy_id: null,
                // display_order: "1",
                is_template: false
            }
        });
        console.log("initial value", this.props.userPermissionReducer.getTemplateInitialValuesResponse.data.permissions);
        this.setActiveTab("menu");
        if (selectedUserPermission) {
            await this.props.getUserPermissionsById(selectedUserPermission);
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
                            event,
                            display_order
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
                        // display_order,
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
                        // display_order,
                        is_template: template
                    },
                    isEdit: true
                });
                this.getUserListForPermissions(consultancy.id);
            }
        }
    };

    getUserListForPermissions = async consultancy_id => {
        const { selectedUserPermission: id } = this.state;
        await this.props.getUserListForPermissions({ id, consultancy_id });
        const {
            userPermissionReducer: {
                getUserListForPermissionsResponse: { assigned_users = [], available_users = [] }
            }
        } = this.props;
        let tempAssignedUserIds = assigned_users && assigned_users.map(item => item.id);
        await this.setState({
            user_ids: tempAssignedUserIds,
            assigned_users,
            available_users
        });
    };

    selectConsultancy = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                consultancy_id: value
            }
        });
        this.getUserListForPermissions(value);
    };

    updateAssignedList = async (type, id) => {
        const { assigned_users, available_users } = this.state;
        let itemObj = {};
        let tempAssignedUsers = assigned_users;
        let tempAvailableUsers = available_users;
        let tempUserIds = [];

        if (id === "all") {
            if (type === "add") {
                tempAvailableUsers.map(item => tempAssignedUsers.push(item));
                tempAvailableUsers = [];
            } else {
                tempAssignedUsers.map(item => tempAvailableUsers.push(item));
                tempAssignedUsers = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_users.find(item => item.id === id);
                tempAssignedUsers.push(itemObj);
                tempAvailableUsers = tempAvailableUsers.filter(item => item.id !== id);
            } else {
                itemObj = assigned_users.find(item => item.id === id);
                tempAvailableUsers.push(itemObj);
                tempAssignedUsers = tempAssignedUsers.filter(item => item.id !== id);
            }
        }
        tempAssignedUsers = _.uniqBy(tempAssignedUsers, "id");
        tempAvailableUsers = _.uniqBy(tempAvailableUsers, "id");
        tempUserIds = tempAssignedUsers.map(item => item.id);
        await this.setState({
            assigned_users: tempAssignedUsers,
            available_users: tempAvailableUsers,
            user_ids: tempUserIds
        });
    };

    selectTemplate = async value => {
        const { formParams } = this.state;
        if (value) {
            await this.props.getUserPermissionsById(value);
            const {
                userPermissionReducer: {
                    getUserPermissionsById: {
                        permission: { assign, forms, logs, menu, event },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        ...formParams,
                        assign,
                        forms,
                        logs,
                        menu,
                        event
                    },
                    selectedTemplate: value
                });
            }
        } else {
            const {
                settingsCommonReducer: {
                    getTemplateInitialValuesResponse: {
                        data: {
                            permissions: { assign, forms, logs, menu, event }
                        }
                    }
                }
            } = this.props;
            await this.setState({
                formParams: {
                    ...formParams,
                    assign,
                    forms,
                    logs,
                    menu,
                    event
                },
                selectedTemplate: value
            });
        }
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            name: false,
            consultancy_id: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!formParams.consultancy_id || !formParams.consultancy_id.trim().length) {
            errorParams.consultancy_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    updateUserPermission = async () => {
        const { formParams, user_ids } = this.state;
        if (this.validate()) {
            await this.props.editUserPermissionsById({ permissions: formParams, user_ids }, this.props.match.params.id);
            await this.props.handleSubmit(true);
        }
    };

    addUserPermission = async () => {
        const { formParams, user_ids } = this.state;
        if (this.validate()) {
            await this.props.addUserPermissions({ permissions: formParams, user_ids });
            await this.props.handleSubmit();
        }
    };

    setActiveTab = async keyItem => {
        const { formParams } = this.state;
        let activeTabItems = formParams[keyItem];
        let activeTabHeaders = [];
        activeTabHeaders = keyItem === "menu" ? ["view"] : activeTabItems && Object.keys(activeTabItems[Object.keys(activeTabItems)[0]]);
        await this.setState({ activeTab: keyItem, activeTabItems, activeTabHeaders });
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

    handleSearch = e => {
        let searchKey = e.target.value || "";
        const {
            userPermissionReducer: {
                getUserListForPermissionsResponse: { available_users = [] }
            }
        } = this.props;

        const { assigned_users } = this.state;
        let assignedUsersIds = assigned_users.map(item => item.id);
        let result = available_users.filter(item => !assignedUsersIds.includes(item.id));

        if (searchKey.trim().length) {
            result = result.filter(
                au =>
                    au.name.toLowerCase().includes(e.target.value && e.target.value.toLowerCase()) ||
                    au.email.toLowerCase().includes(e.target.value && e.target.value.toLowerCase()) ||
                    (au.group_name && au.group_name.toLowerCase().includes(e.target.value && e.target.value.toLowerCase())) ||
                    (au.role_name && au.role_name.toLowerCase().includes(e.target.value && e.target.value.toLowerCase()))
            );
        }
        this.setState({
            searchKeyWord: searchKey,
            available_users: result
        });
    };

    render() {
        const {
            formParams,
            showErrorBorder,
            errorParams,
            selectedUserPermission,
            consultancyIdList,
            templateList,
            initialValues,
            activeTab,
            activeTabItems,
            activeTabHeaders,
            selectedTemplate,
            assigned_users,
            available_users,
            searchKeyWord
        } = this.state;
        const { handleCancel, handleDeleteGroup, entity } = this.props;
        return (
            <div className="dtl-sec col-md-12 usr-grp">
                <div className="tab-dtl region-mng ">
                    <ul>
                        <div className="recom-notify-img">
                            <img src={exclmIcon} alt="" />
                        </div>
                        <li className="cursor-pointer active pl-4">Users Group</li>
                    </ul>
                    <HelperIcon entity={entity} />
                    <form autocomplete="off">
                        <div className="tab-active bg-grey-table p-3">
                            <div className="bg-white">
                                <div className="h-ara">
                                    <div className="text-right">
                                        <span onClick={() => handleCancel()} className="cncl-padding">
                                            <i className="fas fa-window-close"></i> Close
                                        </span>
                                        <span onClick={() => handleDeleteGroup(selectedUserPermission)} className="edit-icn-bx ">
                                            <i className="fas fa-trash-alt"></i> Delete
                                        </span>
                                    </div>
                                    <div className="otr-topr">
                                        <h2>User Permissions</h2>
                                    </div>
                                </div>

                                <div className="d-fex">
                                    <div className="frm-area">
                                        <div className="col">
                                            <div className="form-group">
                                                <input
                                                    className={`${showErrorBorder && errorParams.name ? "error-border " : ""}form-control`}
                                                    name={"name"}
                                                    onChange={e => {
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                name: e.target.value
                                                            }
                                                        });
                                                    }}
                                                    value={formParams.name}
                                                    placeholder="Name *"
                                                />
                                            </div>
                                        </div>

                                        <div className="col ">
                                            <div className="form-group custom-selecbox">
                                                <select
                                                    className="form-control  custom-selecbox"
                                                    value={selectedTemplate}
                                                    onChange={e => this.selectTemplate(e.target.value)}
                                                    autocomplete="off"
                                                    placeholder="Select Template"
                                                >
                                                    <option value="">Select Template</option>
                                                    {templateList.length &&
                                                        templateList.map((item, idex) => {
                                                            return (
                                                                <option key={idex} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col ">
                                            <div className="form-group custom-selecbox">
                                                <select
                                                    className={`${
                                                        showErrorBorder && errorParams.consultancy_id ? "error-border " : ""
                                                    }form-control  custom-selecbox`}
                                                    value={formParams.consultancy_id}
                                                    onChange={e => this.selectConsultancy(e.target.value)}
                                                    autocomplete="off"
                                                    placeholder="Select Consultancy *"
                                                >
                                                    <option value="">Select Consultancy *</option>
                                                    {consultancyIdList.length &&
                                                        consultancyIdList.map((item, idex) => {
                                                            return (
                                                                <option key={idex} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="container-check">
                                                    Is Template
                                                    <input
                                                        type="checkbox"
                                                        name="isTemplate"
                                                        checked={formParams.is_template}
                                                        onChange={async e => {
                                                            await this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    is_template: e.target.checked
                                                                }
                                                            });
                                                        }}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                        {this.state.formParams.consultancy_id ? (
                                            <div className="col ">
                                                <div className="form-group">
                                                    <button
                                                        id="#showUser"
                                                        className="btn btn-acco"
                                                        type="button"
                                                        data-toggle="collapse"
                                                        data-target="#collapseExample"
                                                        aria-expanded="false"
                                                        aria-controls="collapseExample"
                                                        onClick={e => {
                                                            this.setState({
                                                                ...this.state,
                                                                showUsers: !this.state.showUsers
                                                            });
                                                        }}
                                                    >
                                                        {!this.state.showUsers ? "Select Users" : "Hide Users"}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="ara-content">
                                    <div className="collapse" id="collapseExample">
                                        <div className="card card-body">
                                            <div className="row frm-sec">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            autoComplete="nope"
                                                            className="form-control"
                                                            placeholder="Search"
                                                            name="search"
                                                            onChange={e => this.handleSearch(e)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row m-0 back-sec">
                                                <div
                                                    className="col-md-6 pl-0"
                                                    onDrop={e => {
                                                        e.preventDefault();
                                                        this.updateAssignedList("remove", this.state.currentUser);
                                                    }}
                                                    onDragOver={event => event.preventDefault()}
                                                >
                                                    <div className="h-ara pl-0 pt-0">
                                                        <div className="otr-topr">
                                                            <h2>Available Users</h2>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        {available_users && available_users.length
                                                            ? available_users.map((user, i) => {
                                                                  return (
                                                                      <div
                                                                          key={i}
                                                                          className="item-card"
                                                                          onDoubleClick={event => this.updateAssignedList("add", user.id)}
                                                                          onDrag={async event => {
                                                                              event.preventDefault();
                                                                              await this.setState({ currentUser: user.id });
                                                                          }}
                                                                          draggable={true}
                                                                      >
                                                                          <img alt="" src="/img/user-icon.png" />
                                                                          <div className="nme-del">
                                                                              <span className="nme">
                                                                                  {user.name ? (
                                                                                      <Highlighter
                                                                                          highlightClassName="YourHighlightClass"
                                                                                          searchWords={[searchKeyWord]}
                                                                                          autoEscape={true}
                                                                                          textToHighlight={user.name}
                                                                                      />
                                                                                  ) : null}
                                                                              </span>
                                                                              <span>
                                                                                  {user.email ? (
                                                                                      <Highlighter
                                                                                          highlightClassName="YourHighlightClass"
                                                                                          searchWords={[searchKeyWord]}
                                                                                          autoEscape={true}
                                                                                          textToHighlight={user.email}
                                                                                      />
                                                                                  ) : null}
                                                                              </span>
                                                                              <span>
                                                                                  {user.group_name ? (
                                                                                      <Highlighter
                                                                                          highlightClassName="YourHighlightClass"
                                                                                          searchWords={[searchKeyWord]}
                                                                                          autoEscape={true}
                                                                                          textToHighlight={user.group_name}
                                                                                      />
                                                                                  ) : null}
                                                                              </span>
                                                                              <span>
                                                                                  {user.role_name ? (
                                                                                      <Highlighter
                                                                                          highlightClassName="YourHighlightClass"
                                                                                          searchWords={[searchKeyWord]}
                                                                                          autoEscape={true}
                                                                                          textToHighlight={user.role_name}
                                                                                      />
                                                                                  ) : null}
                                                                              </span>
                                                                          </div>
                                                                      </div>
                                                                  );
                                                              })
                                                            : null}
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-md-6 pl-0"
                                                    onDrop={e => {
                                                        e.preventDefault();
                                                        this.updateAssignedList("add", this.state.currentUser);
                                                    }}
                                                    onDragOver={event => event.preventDefault()}
                                                >
                                                    <div className="h-ara pl-0 pt-0">
                                                        <div className="otr-topr">
                                                            <h2>Active Users </h2>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        {assigned_users && assigned_users.length
                                                            ? assigned_users.map(user => {
                                                                  return (
                                                                      <div
                                                                          className="item-card"
                                                                          onDoubleClick={event => this.updateAssignedList("remove", user.id)}
                                                                          // onDrag={event => onDragUser(event, user)}
                                                                          draggable={true}
                                                                          onDrag={async event => {
                                                                              event.preventDefault();
                                                                              await this.setState({ currentUser: user.id });
                                                                          }}
                                                                      >
                                                                          <img alt="" src="/img/user-icon.png" />
                                                                          <div className="nme-del">
                                                                              <span className="nme">{user.name}</span>
                                                                              <span>{user.email}</span>
                                                                          </div>
                                                                      </div>
                                                                  );
                                                              })
                                                            : null}
                                                    </div>
                                                </div>
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
                                            onClick={() => (selectedUserPermission ? this.updateUserPermission() : this.addUserPermission())}
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
    const { userPermissionReducer, settingsCommonReducer } = state;
    return { userPermissionReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(userPermissionForm));
