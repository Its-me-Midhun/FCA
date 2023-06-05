import React, { Component } from "react";
import FormData from "./formData";
import Highlighter from "react-highlight-words";
import HelperIcon from "../../helper/components/HelperIcon";

class UserPermissionInfo extends Component {
    render() {
        const {
            getAllTemplate,
            showUsers,
            isEdit,
            handleConsultancyUser,
            getPermissions,
            menuArray,
            onDoubleClickData,
            handleCancel,
            showErrorBorder,
            handleSelectAll,
            handleSubmit,
            handleChange,
            handleTab,
            tabData,
            handleCheck,
            activeUser,
            groupData,
            logArray,
            formArray,
            efciArray,
            graphArray,
            consultancyUser,
            consultancyUserId,
            handleTemplateChange,
            fullChecked,
            handleViewUser,
            templateId,
            handleDeleteGroup,
            onDragUser,
            onDropActiveUsers,
            onDropAvailableUsers,
            handleIsTemplate,
            searchKeyWord,
            onDragOverUser,
            handleSearch,
            availableUsers,
            hasDelete,
            entity
        } = this.props;
        let templateData = getAllTemplate && getAllTemplate.templates && JSON.parse(getAllTemplate.templates);

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
                                    {isEdit ? (
                                        <div className="text-right">
                                            <HelperIcon entity={entity} />
                                            <span onClick={() => handleCancel()} className="cncl-padding">
                                                <i className="fas fa-window-close"></i> Close
                                            </span>
                                            {hasDelete && (
                                                <span onClick={() => handleDeleteGroup(groupData.id)} className="edit-icn-bx ">
                                                    <i className="fas fa-trash-alt"></i> Delete
                                                </span>
                                            )}
                                        </div>
                                    ) : null}
                                    <div className="otr-topr">
                                        <h2>User Permissions</h2>
                                    </div>
                                    {/* onClick={() => handleDeleteGroup(groupData.id)} */}
                                </div>

                                <div className="d-fex">
                                    <div className="frm-area">
                                        <div className="col">
                                            <div className="form-group">
                                                <input
                                                    className={`${
                                                        showErrorBorder && ((groupData.name && !groupData.name.trim().length) || !groupData.name)
                                                            ? "error-border "
                                                            : ""
                                                    }form-control`}
                                                    name={"name"}
                                                    onChange={handleChange}
                                                    value={groupData.name || ""}
                                                    placeholder="Name *"
                                                />
                                            </div>
                                        </div>

                                        <div className="col ">
                                            <div className="form-group custom-selecbox">
                                                <select
                                                    autoComplete="nope"
                                                    className="form-control  custom-selecbox"
                                                    onChange={e => handleTemplateChange(e)}
                                                    value={templateId}
                                                >
                                                    <option value="">Select Template</option>
                                                    {templateData && templateData.length
                                                        ? templateData.map((td, i) => (
                                                              <option key={i} value={td.id}>
                                                                  {td.name}
                                                              </option>
                                                          ))
                                                        : null}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col ">
                                            <div className="form-group custom-selecbox">
                                                <select
                                                    autoComplete="nope"
                                                    className={`${
                                                        showErrorBorder && (!consultancyUserId.trim().length || !consultancyUserId)
                                                            ? "error-border "
                                                            : ""
                                                    }form-control  custom-selecbox`}
                                                    onChange={e => handleConsultancyUser(e)}
                                                    value={consultancyUserId}
                                                >
                                                    <option value="">Select Consultancy *</option>

                                                    {consultancyUser && consultancyUser.consultancies && consultancyUser.consultancies.length
                                                        ? consultancyUser.consultancies.map((cu, i) => (
                                                              <option key={i} value={cu.id}>
                                                                  {cu.name}
                                                              </option>
                                                          ))
                                                        : null}
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
                                                        checked={groupData.is_template}
                                                        onChange={e => handleIsTemplate(e)}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col ">
                                            <div className="form-group">
                                                <button
                                                    className="btn btn-acco"
                                                    type="button"
                                                    data-toggle="collapse"
                                                    data-target="#collapseExample"
                                                    aria-expanded="false"
                                                    aria-controls="collapseExample"
                                                    onClick={handleViewUser}
                                                >
                                                    {!showUsers ? "Select Users" : "Hide Users"}
                                                </button>
                                            </div>
                                        </div>
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
                                                            onChange={e => handleSearch(e)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row m-0 back-sec">
                                                <div
                                                    className="col-md-6 pl-0"
                                                    onDrop={event => onDropAvailableUsers(event)}
                                                    onDragOver={event => onDragOverUser(event)}
                                                >
                                                    <div className="h-ara pl-0 pt-0">
                                                        <div className="otr-topr">
                                                            <h2>Available Users</h2>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        {availableUsers && availableUsers.length
                                                            ? availableUsers.map((user, i) => {
                                                                  return (
                                                                      <div
                                                                          key={i}
                                                                          className="item-card"
                                                                          onDoubleClick={event => onDoubleClickData(event, user, "available")}
                                                                          onDrag={event => onDragUser(event, user)}
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
                                                    onDrop={event => onDropActiveUsers(event)}
                                                    onDragOver={event => onDragOverUser(event)}
                                                >
                                                    <div className="h-ara pl-0 pt-0">
                                                        <div className="otr-topr">
                                                            <h2>Active Users </h2>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        {activeUser && activeUser.length
                                                            ? activeUser.map(user => {
                                                                  return (
                                                                      <div
                                                                          className="item-card"
                                                                          onDoubleClick={event => onDoubleClickData(event, user, "active")}
                                                                          onDrag={event => onDragUser(event, user)}
                                                                          draggable={true}
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
                                        <li className={tabData == "form" ? "active" : "null"} onClick={() => handleTab("form")}>
                                            Form
                                        </li>
                                        <li className={tabData == "log" ? "active" : "null"} onClick={() => handleTab("log")}>
                                            Logs
                                        </li>
                                        <li className={tabData == "efci" ? "active" : "null"} onClick={() => handleTab("efci")}>
                                            EFCI & Sandbox
                                        </li>
                                        <li className={tabData == "charts_graphs" ? "active" : "null"} onClick={() => handleTab("charts_graphs")}>
                                            Charts & Graphs
                                        </li>
                                        <li className={tabData == "menu" ? "active" : "null"} onClick={() => handleTab("menu")}>
                                            Menu
                                        </li>
                                    </ul>
                                </div>
                                <FormData
                                    tabData={tabData}
                                    formContent={getPermissions}
                                    logArray={logArray}
                                    formArray={formArray}
                                    handleCheck={handleCheck}
                                    handleSelectAll={handleSelectAll}
                                    efciArray={efciArray}
                                    menuArray={menuArray}
                                    fullChecked={fullChecked}
                                    graphArray={graphArray}
                                />
                                <div className="d-flex mt-3 border-top pt-3">
                                    {" "}
                                    <div className="col-md-4 drp-btn ml-auto mb-3">
                                        <button type="button" className="btn btn-primary btnClr mr-3" onClick={() => handleCancel()}>
                                            Cancel
                                        </button>
                                        <button type="button" className="btn btn-primary btnRgion" onClick={() => handleSubmit()}>
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
export default UserPermissionInfo;
