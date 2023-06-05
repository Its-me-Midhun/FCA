import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Portal from "../../common/components/Portal";
import ShowHelperModal from "./ShowHelperModal";

class HelperIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showHelperModal: false,
            selectedHelperItem: {}
        };
    }

    showHelperModal = async (item, subItem) => {
        await this.setState({
            showHelperModal: true,
            selectedHelperItem: {
                item,
                subItem
            }
        });
    };

    renderUploadHelperModal = () => {
        const { showHelperModal, selectedHelperItem } = this.state;
        if (!showHelperModal) return null;
        return (
            <Portal
                body={<ShowHelperModal selectedHelperItem={selectedHelperItem} onCancel={() => this.setState({ showHelperModal: false })} />}
                onCancel={() => this.setState({ showHelperModal: false })}
            />
        );
    };

    render() {
        const { entity, hasHelp = true, isHistory = false, additoinalClass = "", additionalSpanClass = "", type = null } = this.props;
        let helperType = type ? type : isHistory ? "logs" : "forms";

        return (
            <React.Fragment>
                {hasHelp && entity ? (
                    <div className={`help-icon-container ${additoinalClass}`}>
                        <span
                            className={`view-inner help-icon ${additionalSpanClass}`}
                            data-tip={`Help`}
                            data-effect="solid"
                            data-place="bottom"
                            data-background-color="#007bff"
                            onClick={() => this.showHelperModal(helperType, entity)}
                        >
                            <img src="/img/question-mark-icon.png" alt="" className="fil-ico" />
                        </span>
                        {this.renderUploadHelperModal()}
                    </div>
                ) : null}
            </React.Fragment>
        );
    }
}

export default withRouter(HelperIcon);
