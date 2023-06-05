import React, { Component } from "react";
import Draggable from 'react-draggable';
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import history from "../../../config/history"
import { resetBreadCrumpData, bulkResetBreadCrumpData } from "../../../config/utils";
import ReactTooltip from "react-tooltip";

class ViewModal extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    /**
    * Alert if clicked on outside of element
    */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.onCancel()
        }
    }

    viewBuilding = async () => {
        const { fciDataDetails, individualFilters, colorCodeDetails } = this.props
        if (individualFilters.fci_type == "buildings") {
            this.props.setRecomentationFilter({ "building_ids": [fciDataDetails.entity_id], year: fciDataDetails.year }, { name: "Building", value: [colorCodeDetails.building] })
            let bc = [{ key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
            { key: "info", name: "FCA Projects", path: "/project", index: 1 },
            {
                key: "projectName", name: colorCodeDetails.project_name,
                path: `/project/projectinfo/${colorCodeDetails.project_id}/basicdetails?info=true&pid=${colorCodeDetails.project_id}`, index: 2
            },
            { key: "info", name: "Buildings", path: "/building", index: 3 },
            {
                key: "basicdetails", name: colorCodeDetails.building,
                path: `/building/buildinginfo/${fciDataDetails.entity_id}/basicdetails?info=true&pid=${colorCodeDetails.project_id}&dashboardView=true`, index: 4
            },
            {
                key: "info", name: "Recommendations",
                path: `/building/buildinginfo/${fciDataDetails.entity_id}/recommendations?DM_ID=${colorCodeDetails.DM_ID}&info=true&pid=${colorCodeDetails.project_id}&dashboardView=true`, index: 5
            }]

            bulkResetBreadCrumpData(bc)
            await history.push(`/building/buildinginfo/${fciDataDetails.entity_id}/recommendations?DM_ID=${colorCodeDetails.DM_ID}&info=true&pid=${colorCodeDetails.project_id}&dashboardView=true`)

        }
        else if (individualFilters.fci_type == "sites") {
            this.props.setRecomentationFilter({ "site_ids": [fciDataDetails.entity_id] }, { name: "Site", value: [colorCodeDetails.building] })


            let bc = [{ key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
            { key: "info", name: "FCA Projects", path: "/project", index: 1 },
            {
                key: "projectName", name: colorCodeDetails.project_name,
                path: `/project/projectinfo/${colorCodeDetails.project_id}/basicdetails?info=true&pid=${colorCodeDetails.project_id}`, index: 2
            },
            { key: "info", name: "Sites", path: "/site", index: 3 },
            {
                key: "basicdetails", name: colorCodeDetails.building,
                path: `/site/siteinfo/${fciDataDetails.entity_id}/basicdetails?info=true&pid=${colorCodeDetails.project_id}&dashboardView=true`, index: 4
            },
            {
                key: "info", name: "Recommendations",
                path: `/site/siteinfo/${fciDataDetails.entity_id}/recommendations?DM_ID=${colorCodeDetails.DM_ID}&info=true&pid=${colorCodeDetails.project_id}&dashboardView=true`, index: 5
            }]

            bulkResetBreadCrumpData(bc)
            await history.push(`/site/siteinfo/${fciDataDetails.entity_id}/recommendations?DM_ID=${colorCodeDetails.DM_ID}&info=true&pid=${colorCodeDetails.project_id}&dashboardView=true`)

        }
        else if (individualFilters.fci_type == "projects") {
            this.props.setRecomentationFilter({ "project_ids": [fciDataDetails.entity_id] }, { name: "FCA Project", value: [colorCodeDetails.building] })
            let bc = [{ key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
            { key: "info", name: "FCA Projects", path: "/project", index: 1 },
            {
                key: "projectName", name: colorCodeDetails.building,
                path: `/project/projectinfo/${fciDataDetails.entity_id}/basicdetails?dashboardView=true`, index: 2
            },
            {
                key: "info", name: "Recommendations",
                path: `/project/projectinfo/${fciDataDetails.entity_id}/recommendations?DM_ID=${colorCodeDetails.DM_ID}&dashboardView=true`, index: 3
            }]
            bulkResetBreadCrumpData(bc)
            await history.push(`/project/projectinfo/${fciDataDetails.entity_id}/recommendations?DM_ID=${colorCodeDetails.DM_ID}&dashboardView=true`)
        }
        else if (individualFilters.fci_type == "regions") {
            this.props.setRecomentationFilter({ "region_ids": [fciDataDetails.entity_id] }, { name: "Region", value: [colorCodeDetails.building] })
            let bc = [{ key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
            { key: "info", name: "FCA Projects", path: "/project", index: 1 },
            {
                key: "projectName", name: colorCodeDetails.project_name,
                path: `/project/projectinfo/${colorCodeDetails.project_id}/basicdetails`, index: 2
            },

            { key: "info", name: "Regions", path: "/region", index: 3 },
            {
                key: "regionName", name: colorCodeDetails.building,
                path: `/region/regioninfo/${fciDataDetails.entity_id}/basicdetails?dashboardView=true`, index: 4
            },
            {
                key: "info", name: "Recommendations",
                path: `/region/regioninfo/${fciDataDetails.entity_id}/recommendations?DM_ID=${colorCodeDetails.DM_ID}&info=true&pid=${colorCodeDetails.project_id}&dashboardView=true`, index: 5
            }]
            bulkResetBreadCrumpData(bc)
            await history.push(`/region/regioninfo/${fciDataDetails.entity_id}/recommendations?DM_ID=${colorCodeDetails.DM_ID}&info=true&pid=${colorCodeDetails.project_id}&dashboardView=true`)
        }


        this.props.onCancel()
    }
    render() {
        const { colorCodes, colorCodeDetails, fciDataDetails, isFullScreen } = this.props
        return (

            <>
                <Draggable>
                    <div className={`${this.props.isOpenColorCode ? this.props.isDashboardColor ? (isFullScreen == "fci_charts" ? "dropdown-menu-view efci-clr clr-dsbrd fixed-bot" : "dropdown-menu-view efci-clr clr-dsbrd") : "dropdown-menu-view efci-clr" : "dropdown-menu-view "
                        }`} aria-labelledby="dropdownMenuButton"
                        style={{ display: 'block' }} ref={this.setWrapperRef}>
                        <LoadingOverlay active={this.props.isCodeLoading} spinner={<Loader />} fadeSpeed={10}>
                            <div class="btn-ara">
                            <ReactTooltip id="filter-icons" />
                                <div>
                                    <h3>Color Scale For FCI Chart </h3>
                                    <h4 class="mt-0"> {colorCodeDetails && colorCodeDetails.hospital_name ?
                                        ` ${colorCodeDetails.hospital_name} - ` : null}  {colorCodeDetails && colorCodeDetails.building ?
                                            `  ${colorCodeDetails.building}` : null}
                                        {colorCodeDetails && colorCodeDetails.building_type ?
                                            ` ( ${colorCodeDetails.building_type} )` : null}

                                    </h4>
                                </div>
                                <div
                                    className="cursor-hand"
                                    data-delay-show="500"
                                    data-tip={`Click To View Recommendation `}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="right"
                                    data-background-color="#007bff"
                                  
                                >
                                <button class="btn btn-outline-secondary act-btn" onClick={() => this.viewBuilding()}>Check Details</button>
                                </div>
                            </div>
                            {this.props.isDashboardColor ? <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={() => this.props.onCancel()}
                            >
                                   <div
                                    className="cursor-hand"
                                    data-delay-show="500"
                                    data-tip={`Close `}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="right"
                                    data-background-color="#007bff"
                                  
                                >
                                <span aria-hidden="true">
                                    <img src="/img/close.svg" alt="" />
                                </span>
                                </div>
                            </button> : null}
                            <div className="table-section">
                                <table className="table table-common table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Scale</th>
                                            <th className="">Color</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {colorCodes && colorCodes.length ?
                                            colorCodes.map((code, i) =>
                                                <React.Fragment key={i}>
                                                    <tr >
                                                        <td><b>{code.name}</b></td>
                                                        <td>
                                                            <span className="">
                                                                <strong>{code.range_start}</strong>
                                                            </span>
                                                            <span className="rng-wid">
                                                                To
                                                                    </span>
                                                            <span>
                                                                <strong>{code.range_end}</strong>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="clr-set">
                                                                <div className="col-se">
                                                                    <div
                                                                        className="set" style={{ backgroundColor: `${code.code}` }}>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                            :
                                            <td colSpan={3}>No Color Codes found.</td>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </LoadingOverlay>
                    </div>
                </Draggable>
            </>
        );
    }
}


export default ViewModal;
