import React, { Component } from "react";

import uploadIcon from "../../../../assets/img/upload-file.svg";
import gridIcon from "../../../../assets/img/grid1.svg";
import listIcon from "../../../../assets/img/grid.svg";
import arrowIcon from "../../../../assets/img/timer-grp.svg";
import helpIcon from "../../../../assets/img/question-mark-icon.png";
import { connect } from "react-redux";
import Loader from "../Loader";
import tunnelIcon from "../../../../assets/img/tunnel.svg";
import ReactTooltip from "react-tooltip";

export class MasterFilter extends Component {
    render() {
        return (
            <div className="nav-fil-top">
                <div className="top-bar"></div>
                <div className="top-bar icon-bar">
                    <div className="itm-tp" data-for="master-img-filter" data-tip={"List View"} onClick={() => this.props.setGridView(false)}>
                        <img src={listIcon} />
                    </div>
                    <div className="itm-tp" data-for="master-img-filter" data-tip={"Grid View"} onClick={() => this.props.setGridView(true)}>
                        <img src={gridIcon} />
                    </div>
                </div>
                <ReactTooltip id="master-img-filter" effect="solid" backgroundColor="#1383D9" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { imageReducer } = state;
    return { imageReducer };
};

export default connect(mapStateToProps)(MasterFilter);
