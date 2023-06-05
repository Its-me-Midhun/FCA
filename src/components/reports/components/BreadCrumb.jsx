import React, { Component } from "react";

class BreadCrumbs extends Component {
    render() {
        const { breadCrumbData } = this.props
        const mainEntities = ["sites", "recommendations", "buildings", "floors", "regions", "clients", "consultancies", "system", "trade"];
        return (
            <div className="brd-crmb">
                <ul className="bread-crumb">
                    {breadCrumbData && breadCrumbData.length
                        ? breadCrumbData.map((item, i) => {
                            return breadCrumbData.length !== i + 1 ?
                                (<><li className=""><span className={item.key == "main" || mainEntities.includes(item.name && item.name.toLowerCase()) ?
                                    "main-entity" : ""}>{item.name}</span>
                                    <i className="fas fa-chevron-right"></i></li></>)
                                : (<li className=""><span className={item.key == "main" || mainEntities.includes(item.name && item.name.toLowerCase()) ?
                                    "main-entity" : ""}>{item.name}</span></li>)
                        }) : null}
                </ul>
            </div>
        )
    }
}
export default BreadCrumbs;