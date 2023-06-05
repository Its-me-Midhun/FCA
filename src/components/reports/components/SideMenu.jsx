/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import VisualIdentifier from "./VisualIdentifier";
class SideNavigation extends Component {
    handleMenu = (e, item) => {
        this.props.handleMenu(e, item);
    };

    render() {
        const { menuData, selectedMenu, hasTradeView, hasSystemView, hasSubSystemView } = this.props;
        return (
            <>
                <div className="side-nav-inside">
                    <SideMenu menuData={menuData} selectedMenu={selectedMenu} showSubMenu={this.props.showSubMenu} handleMenu={this.handleMenu} />
                </div>
            </>
        );
    }
}

const SideMenu = ({ depth = 0, menuData, selectedMenu, showSubMenu, parent = [], handleMenu }) => {
    const ulClass = depth === 0 ? "navList" : depth === 1 ? "dropdown-menu dropr-sub show" : "dropdown-menu show";
    const liClass = depth === 0 ? "dropdown active-1 dropr show" : depth === 1 ? "dropdown-submenu show" : "dropdown-submenu";
    return (
        <ul className={ulClass}>
            {menuData && menuData.length
                ? menuData.map((item, idx) => {
                      let anchorClass = !item.has_child
                          ? "dropdown-item dropdown-toggle dropr-sub-item-sp"
                          : depth === 0
                          ? "dropdown-toggle open-menu"
                          : depth === 1
                          ? "dropdown-item dropdown-toggle dropr-sub-item"
                          : "dropdown-item dropdown-toggle dropr-sub-item1";
                      anchorClass += selectedMenu?.key === item.key ? " active" : "";
                      const iconClass = !item.has_child
                          ? "fas fa-circle"
                          : !item?.nodes?.length
                          ? "fas fa-plus cursor-pointer"
                          : "fas fa-minus cursor-pointer";
                      return (
                          <li className={liClass} id="drop" key={item.key}>
                              <a className={anchorClass} id="navbarDropdownMenuLink">
                                  <div className="drop-list-flex">
                                      <i onClick={e => showSubMenu(e, !item?.nodes?.length, item, parent)} className={iconClass}></i>
                                      <span className="menu cursor-pointer" onClick={e => handleMenu(e, item)}>
                                          {item.label}
                                      </span>
                                  </div>
                                  <div>
                                      <VisualIdentifier
                                          has_narrative={item.has_narrative}
                                          has_recommendations={item.has_recommendations}
                                          narrative_completed={item.narrative_completed}
                                          children_completed={item.children_completed}
                                          entity={item.entity}
                                          global_completed={item.global_completed}
                                      />
                                  </div>
                              </a>
                              {item && item.nodes && item.nodes.length ? (
                                  <SideMenu
                                      menuData={item.nodes}
                                      selectedMenu={selectedMenu}
                                      showSubMenu={showSubMenu}
                                      handleMenu={handleMenu}
                                      depth={depth + 1}
                                      parent={[item, ...parent]}
                                  />
                              ) : null}
                          </li>
                      );
                  })
                : null}
        </ul>
    );
};

export default SideNavigation;
