/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import VisualIdentifier from "./VisualIdentifier";
class SideNavigation extends Component {
    handleMenu = (e, item) => {
        this.props.handleMenu(e, item);
    };

    render() {
        const { menuData, selectedMenu, hasTradeView, hasSystemView, hasSubSystemView } = this.props;
        // console.log("mexcxcxcxnuData", menuData);
        return (
            <>
                <div className="side-nav-inside">
                    <ul className="navList">
                        {menuData && menuData.length
                            ? menuData.map((item, key) => {
                                  return (
                                      <li className="dropdown active-1 dropr show" id="drop">
                                          <a
                                              className={`dropdown-toggle open-menu ${selectedMenu?.key === item.key ? "active" : ""}`}
                                              id="navbarDropdownMenuLink"
                                          >
                                              <i
                                                  onClick={e => this.props.showSubMenu(e, item && item.nodes && !item.nodes.length, item)}
                                                  className={
                                                      item && item.nodes && !item.nodes.length
                                                          ? "fas fa-plus cursor-pointer"
                                                          : "fas fa-minus cursor-pointer"
                                                  }
                                              ></i>
                                              <span className="menu cursor-pointer" onClick={e => this.handleMenu(e, item)}>
                                                  {item.label}
                                              </span>
                                          </a>
                                          {item && item.nodes && item.nodes.length ? (
                                              <ul className="dropdown-menu dropr-sub show" aria-labelledby="navbarDropdownMenuLink">
                                                  {item.nodes.map(node => {
                                                      return (
                                                          <li className="dropdown-submenu show">
                                                              <a
                                                                  className={`dropdown-item dropdown-toggle dropr-sub-item ${
                                                                      selectedMenu?.key === node.key ? "active" : ""
                                                                  }`}
                                                              >
                                                                  <div className="drop-list-flex">
                                                                      <i
                                                                          onClick={e =>
                                                                              this.props.showSubMenu(
                                                                                  e,
                                                                                  node && node.nodes && node.nodes.length,
                                                                                  node,
                                                                                  item
                                                                              )
                                                                          }
                                                                          className={
                                                                              node && node.nodes && node.nodes.length
                                                                                  ? "fas fa-minus cursor-pointer"
                                                                                  : "fas fa-plus cursor-pointer"
                                                                          }
                                                                      ></i>
                                                                      <span
                                                                          className={`menu ${hasTradeView ? "cursor-pointer" : "cursor-diabled"}`}
                                                                          onClick={e => (hasTradeView ? this.handleMenu(e, node) : null)}
                                                                      >
                                                                          {node.label}
                                                                      </span>
                                                                  </div>
                                                                  <div>
                                                                      <VisualIdentifier
                                                                          has_narrative={node.has_narrative}
                                                                          has_recommendations={node.has_recommendations}
                                                                          narrative_completed={node.narrative_completed}
                                                                          children_completed={node.children_completed}
                                                                          entity={node.entity}
                                                                          global_completed={node.global_completed}
                                                                      />
                                                                  </div>
                                                              </a>
                                                              {node && node.nodes && node.nodes.length ? (
                                                                  <ul className="dropdown-menu show" id="drop-sub">
                                                                      {node.nodes.map(sub => {
                                                                          return (
                                                                              <li className="dropdown-submenu">
                                                                                  <a
                                                                                      className={`dropdown-item dropdown-toggle dropr-sub-item1 ${
                                                                                          selectedMenu?.key === sub.key ? "active" : ""
                                                                                      }`}
                                                                                  >
                                                                                      <div className="drop-list-flex">
                                                                                          <i
                                                                                              onClick={e =>
                                                                                                  this.props.showSubMenu(
                                                                                                      e,
                                                                                                      sub && sub.nodes && sub.nodes.length,
                                                                                                      sub,
                                                                                                      node,
                                                                                                      item
                                                                                                  )
                                                                                              }
                                                                                              className={
                                                                                                  sub && sub.nodes && sub.nodes.length
                                                                                                      ? "fas fa-minus cursor-pointer"
                                                                                                      : "fas fa-plus cursor-pointer"
                                                                                              }
                                                                                          ></i>
                                                                                          <span
                                                                                              className={`menu ${
                                                                                                  hasSystemView ? "cursor-pointer" : "cursor-diabled"
                                                                                              }`}
                                                                                              onClick={e =>
                                                                                                  hasSystemView ? this.handleMenu(e, sub) : null
                                                                                              }
                                                                                          >
                                                                                              {sub.label}
                                                                                          </span>
                                                                                      </div>
                                                                                      <div>
                                                                                          <VisualIdentifier
                                                                                              has_narrative={sub.has_narrative}
                                                                                              has_recommendations={sub.has_recommendations}
                                                                                              narrative_completed={sub.narrative_completed}
                                                                                              children_completed={sub.children_completed}
                                                                                              entity={sub.entity}
                                                                                              global_completed={sub.global_completed}
                                                                                          />
                                                                                      </div>
                                                                                  </a>
                                                                                  {sub && sub.nodes && sub.nodes.length ? (
                                                                                      <ul className="dropdown-menu show">
                                                                                          {sub.nodes.map(child => {
                                                                                              return (
                                                                                                  <li className="dropdown-submenu">
                                                                                                      <a
                                                                                                          className={`${
                                                                                                              child.entity == "SubSystem"
                                                                                                                  ? "dropdown-item"
                                                                                                                  : "dropdown-item dropdown-toggle dropr-sub-item1"
                                                                                                          } ${
                                                                                                              selectedMenu?.key === child.key
                                                                                                                  ? "active"
                                                                                                                  : ""
                                                                                                          }`}
                                                                                                      >
                                                                                                          <div className="drop-list-flex">
                                                                                                              <i
                                                                                                                  onClick={e =>
                                                                                                                      this.props.showSubMenu(
                                                                                                                          e,
                                                                                                                          child &&
                                                                                                                              child.nodes &&
                                                                                                                              child.nodes.length,
                                                                                                                          child,
                                                                                                                          sub,
                                                                                                                          node,
                                                                                                                          item
                                                                                                                      )
                                                                                                                  }
                                                                                                                  className={
                                                                                                                      child.entity == "SubSystem"
                                                                                                                          ? "fas fa-circle"
                                                                                                                          : child &&
                                                                                                                            child.nodes &&
                                                                                                                            child.nodes.length
                                                                                                                          ? "fas fa-minus cursor-pointer"
                                                                                                                          : "fas fa-plus cursor-pointer"
                                                                                                                  }
                                                                                                              ></i>
                                                                                                              <span
                                                                                                                  className={`menu ${
                                                                                                                      hasSubSystemView
                                                                                                                          ? "cursor-pointer"
                                                                                                                          : "cursor-diabled"
                                                                                                                  }`}
                                                                                                                  onClick={e =>
                                                                                                                      hasSubSystemView
                                                                                                                          ? this.handleMenu(e, child)
                                                                                                                          : null
                                                                                                                  }
                                                                                                              >
                                                                                                                  {child.label}
                                                                                                              </span>
                                                                                                          </div>
                                                                                                          <div>
                                                                                                              <VisualIdentifier
                                                                                                                  has_narrative={child.has_narrative}
                                                                                                                  has_recommendations={
                                                                                                                      child.has_recommendations
                                                                                                                  }
                                                                                                                  narrative_completed={
                                                                                                                      child.narrative_completed
                                                                                                                  }
                                                                                                                  entity={child.entity}
                                                                                                                  children_completed={
                                                                                                                      child.children_completed
                                                                                                                  }
                                                                                                                  global_completed={
                                                                                                                      child.global_completed
                                                                                                                  }
                                                                                                              />
                                                                                                          </div>
                                                                                                      </a>
                                                                                                      {child && child.nodes && child.nodes.length ? (
                                                                                                          <ul className="dropdown-menu show">
                                                                                                              {child.nodes.map(child2 => {
                                                                                                                  return (
                                                                                                                      <li
                                                                                                                          className="dropdown-submenu"
                                                                                                                          onClick={e =>
                                                                                                                              this.props.showSubMenu(
                                                                                                                                  e,
                                                                                                                                  child2 &&
                                                                                                                                      child2.nodes &&
                                                                                                                                      child2.nodes
                                                                                                                                          .length,
                                                                                                                                  child2,
                                                                                                                                  child,
                                                                                                                                  sub,
                                                                                                                                  node,
                                                                                                                                  item
                                                                                                                              )
                                                                                                                          }
                                                                                                                      >
                                                                                                                          <a
                                                                                                                              className={`dropdown-item ${
                                                                                                                                  selectedMenu?.key ===
                                                                                                                                  child2.key
                                                                                                                                      ? "active"
                                                                                                                                      : ""
                                                                                                                              }`}
                                                                                                                          >
                                                                                                                              <div className="drop-list-flex">
                                                                                                                                  <i
                                                                                                                                      className={
                                                                                                                                          child2.entity !==
                                                                                                                                          "SubSystem"
                                                                                                                                              ? child2 &&
                                                                                                                                                child2.nodes &&
                                                                                                                                                child2
                                                                                                                                                    .nodes
                                                                                                                                                    .length
                                                                                                                                                  ? "fas fa-minus cursor-pointer"
                                                                                                                                                  : "fas fa-plus cursor-pointer"
                                                                                                                                              : "fas fa-circle"
                                                                                                                                      }
                                                                                                                                  ></i>
                                                                                                                                  <span
                                                                                                                                      className="menu cursor-pointer"
                                                                                                                                      onClick={e =>
                                                                                                                                          this.handleMenu(
                                                                                                                                              e,
                                                                                                                                              child2
                                                                                                                                          )
                                                                                                                                      }
                                                                                                                                  >
                                                                                                                                      {child2.label}
                                                                                                                                  </span>
                                                                                                                              </div>
                                                                                                                              <div>
                                                                                                                                  <VisualIdentifier
                                                                                                                                      has_narrative={
                                                                                                                                          child2.has_narrative
                                                                                                                                      }
                                                                                                                                      has_recommendations={
                                                                                                                                          child2.has_recommendations
                                                                                                                                      }
                                                                                                                                      narrative_completed={
                                                                                                                                          child2.narrative_completed
                                                                                                                                      }
                                                                                                                                      entity={
                                                                                                                                          child2.entity
                                                                                                                                      }
                                                                                                                                  />
                                                                                                                              </div>
                                                                                                                          </a>
                                                                                                                          {child2 &&
                                                                                                                          child2.nodes &&
                                                                                                                          child2.nodes.length ? (
                                                                                                                              <ul className="dropdown-menu show">
                                                                                                                                  {child2.nodes.map(
                                                                                                                                      child3 => {
                                                                                                                                          return (
                                                                                                                                              <li
                                                                                                                                                  className="dropdown-submenu"
                                                                                                                                                  onClick={e =>
                                                                                                                                                      this.props.showSubMenu(
                                                                                                                                                          e,
                                                                                                                                                          child3 &&
                                                                                                                                                              child3.nodes &&
                                                                                                                                                              child3
                                                                                                                                                                  .nodes
                                                                                                                                                                  .length,
                                                                                                                                                          child3,
                                                                                                                                                          child,
                                                                                                                                                          sub,
                                                                                                                                                          node,
                                                                                                                                                          item
                                                                                                                                                      )
                                                                                                                                                  }
                                                                                                                                              >
                                                                                                                                                  <a
                                                                                                                                                      className={`dropdown-item ${
                                                                                                                                                          selectedMenu?.key ===
                                                                                                                                                          child3.key
                                                                                                                                                              ? "active"
                                                                                                                                                              : ""
                                                                                                                                                      }`}
                                                                                                                                                  >
                                                                                                                                                      <div className="drop-list-flex">
                                                                                                                                                          <i
                                                                                                                                                              className={
                                                                                                                                                                  "fas fa-circle"
                                                                                                                                                              }
                                                                                                                                                          ></i>
                                                                                                                                                          <span
                                                                                                                                                              className="menu cursor-pointer"
                                                                                                                                                              onClick={e =>
                                                                                                                                                                  this.handleMenu(
                                                                                                                                                                      e,
                                                                                                                                                                      child3
                                                                                                                                                                  )
                                                                                                                                                              }
                                                                                                                                                          >
                                                                                                                                                              {
                                                                                                                                                                  child3.label
                                                                                                                                                              }
                                                                                                                                                          </span>
                                                                                                                                                      </div>
                                                                                                                                                      <div>
                                                                                                                                                          <VisualIdentifier
                                                                                                                                                              has_narrative={
                                                                                                                                                                  child3.has_narrative
                                                                                                                                                              }
                                                                                                                                                              has_recommendations={
                                                                                                                                                                  child3.has_recommendations
                                                                                                                                                              }
                                                                                                                                                              narrative_completed={
                                                                                                                                                                  child3.narrative_completed
                                                                                                                                                              }
                                                                                                                                                              entity={
                                                                                                                                                                  child3.entity
                                                                                                                                                              }
                                                                                                                                                          />
                                                                                                                                                      </div>
                                                                                                                                                  </a>
                                                                                                                                              </li>
                                                                                                                                          );
                                                                                                                                      }
                                                                                                                                  )}
                                                                                                                              </ul>
                                                                                                                          ) : null}
                                                                                                                      </li>
                                                                                                                  );
                                                                                                              })}
                                                                                                          </ul>
                                                                                                      ) : null}
                                                                                                  </li>
                                                                                              );
                                                                                          })}
                                                                                      </ul>
                                                                                  ) : null}
                                                                              </li>
                                                                          );
                                                                      })}
                                                                  </ul>
                                                              ) : null}
                                                          </li>
                                                      );
                                                  })}
                                              </ul>
                                          ) : null}
                                      </li>
                                  );
                              })
                            : null}
                    </ul>
                </div>
            </>
        );
    }
}
export default SideNavigation;
