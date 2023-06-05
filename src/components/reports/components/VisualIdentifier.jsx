import React, { Component } from "react";
import ReactTooltip from "react-tooltip";

export default class VisualIdentifier extends Component {
    render() {
        const { has_recommendations, has_narrative, narrative_completed, entity, children_completed, global_completed } = this.props;
        return (
            <>
                {has_recommendations === "true" && (
                    <>
                        <img src="/img/caution.svg" data-tip="Recommendations found" data-for="recom-found" className="no-recom" />
                        <ReactTooltip id="recom-found" effect="solid" backgroundColor="#1383D9" />
                    </>
                )}
                {has_narrative === "true" && (
                    <>
                        <img src="/img/Doc.svg" data-tip="Narrative found" data-for="narr-found" className="no-recom narrative-found" />
                        <ReactTooltip id="narr-found" effect="solid" backgroundColor="#1383D9" />
                    </>
                )}
                {narrative_completed === true ? (
                    <>
                        <img
                            src="/img/check_green.svg"
                            data-tip="Narrative completed"
                            data-for="narr-complt"
                            className="no-recom narrative-completed"
                        />
                        <ReactTooltip id="narr-complt" effect="solid" backgroundColor="#1383D9" />
                    </>
                ) : narrative_completed === false ? (
                    <>
                        <img
                            src="/img/check_green red.svg"
                            data-tip="Narrative incomplete"
                            data-for="narr-complt"
                            className="no-recom narrative-completed"
                        />
                        <ReactTooltip id="narr-complt" effect="solid" backgroundColor="#1383D9" />
                    </>
                ) : null}
                {entity !== "SubSystem" && children_completed !== null && children_completed !== undefined && (
                    <>
                        <img 
                            src={
                                children_completed && global_completed
                                    ? "/img/check_green.svg"
                                    : children_completed
                                    ? "/img/check_orange.svg"
                                    : "/img/warning.svg"
                            }
                            data-tip={
                                children_completed && global_completed
                                    ? "Child narratives are completed and narrative is globally completed"
                                    : children_completed
                                    ? "Child narratives are completed but not globally completed"
                                    : "Child narratives are not completed"
                            }
                            data-for="narr-child-check"
                            className="no-recom narrative-child-complt"
                        />
                        <ReactTooltip id="narr-child-check" effect="solid" backgroundColor="#1383D9" />
                    </>
                )}
            </>
        );
    }
}
