import React from "react";

function SortedRecommendationsInfo({recommendation_props}) {
    return (
        <>
        <div className="col-md-12 basic-box main-heading mt-2">
            <h3>Legends</h3>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Table Style</h4>
                <h3>{(recommendation_props?.table_style?.style_id && recommendation_props?.table_style?.name) || "-"}</h3>
            </div>
        </div>
        <div className="col-md-9 basic-box"></div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Custom Heading Font Name</h4>
                <h3>{ (recommendation_props?.custom_heading?.font_id && recommendation_props?.custom_heading?.font_family) || "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Custom Heading Font Size</h4>
                <h3>{recommendation_props?.custom_heading?.font_size || "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Custom Heading Font Color</h4>
                <h3>
                    {recommendation_props?.custom_heading?.font_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.custom_heading?.font_colour
                                ? `#${recommendation_props?.custom_heading?.font_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Custom Heading Background Color</h4>
                <h3>
                    {recommendation_props?.custom_heading?.background_colour || ""}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.custom_heading?.background_colour
                                ? `#${recommendation_props?.custom_heading?.background_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        {/* <div className="col-md-6 basic-box"></div> */}
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Heading Font Name</h4>
                <h3>{(recommendation_props?.table_heading?.font_id && recommendation_props?.table_heading?.font_family )|| "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Heading Font Size</h4>
                <h3>{recommendation_props?.table_heading?.font_size || "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Heading Font Color</h4>
                <h3>
                    {recommendation_props?.table_heading?.font_colour || ""}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.table_heading?.font_colour
                                ? `#${recommendation_props?.table_heading?.font_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Heading Background Color</h4>
                <h3>
                    {recommendation_props?.table_heading?.background_colour || ""}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.table_heading?.background_colour
                                ? `#${recommendation_props?.table_heading?.background_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>

        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Heading Border</h4>
                <h3>
                    {recommendation_props?.table_heading?.border_colour || ""}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.table_heading?.border_colour
                                ? `#${recommendation_props?.table_heading?.border_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Heading Border </h4>
                <div className={`input-ft-size`}>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.table_heading?.border?.left}
                        ></input>
                    </span>
                    <span className="check-align">
                        <label>left</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.table_heading?.border?.right}
                        ></input>
                        <label>right</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.table_heading?.border?.top}
                        ></input>
                        <label>top</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.table_heading?.border?.bottom}
                        ></input>
                        <label>bottom</label>
                    </span>
                </div>
            </div>
        </div>
        <div className="col-md-6 basic-box"></div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Body Font Name</h4>
                <h3>{(recommendation_props?.body?.font_id && recommendation_props?.body?.font_family) || ""}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Body Font Size</h4>
                <h3>{recommendation_props?.body?.font_size || ""}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Body Font Color</h4>
                <h3>
                    {recommendation_props?.body?.font_colour || ""}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.body?.background_colour
                                ? `#${recommendation_props?.body?.background_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Body Border Color</h4>
                <h3>
                    {recommendation_props?.body?.border_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.body?.border_colour
                                ? `#${recommendation_props?.body?.border_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Body Border </h4>
                <div className={`input-ft-size`}>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.body?.border?.left}></input>
                        <label>left</label>
                    </span>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.body?.border?.right}></input>
                        <label>right</label>
                    </span>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.body?.border?.top}></input>
                        <label>top</label>
                    </span>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.body?.border?.bottom}></input>
                        <label>bottom</label>
                    </span>
                </div>
            </div>
        </div>
        <div className="col-md-9 basic-box"></div>

        {/* <div className="col-md- basic-box"></div> */}
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Site Font Name</h4>
                <h3>{(recommendation_props?.site?.font_id && recommendation_props?.site?.font_family )|| "_"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Site Font Size</h4>
                <h3>{recommendation_props?.site?.font_size || "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Site Font Color</h4>
                <h3>
                    {recommendation_props?.site?.font_colour || ""}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.site?.background_colour
                                ? `#${recommendation_props?.site?.background_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Site Background Color</h4>
                <h3>
                    {recommendation_props?.site?.background_colour || ""}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.site?.background_colour
                                ? `#${recommendation_props?.site?.background_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>

        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Site Border Color</h4>
                <h3>
                    {recommendation_props?.site?.border_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.site?.border_colour
                                ? `#${recommendation_props?.site?.border_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Site Border </h4>
                <div className={`input-ft-size`}>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.site?.border?.left}></input>
                        <label>left</label>
                    </span>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.site?.border?.right}></input>
                        <label>right</label>
                    </span>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.site?.border?.top}></input>
                        <label>top</label>
                    </span>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.site?.border?.bottom}></input>
                        <label>bottom</label>
                    </span>
                </div>
            </div>
        </div>
        <div className="col-md-6 basic-box"></div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Building Font Name</h4>
                <h3>{( recommendation_props?.custom_heading?.font_id && recommendation_props?.custom_heading?.font_family) || "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Building Font Size</h4>
                <h3>{recommendation_props?.building?.font_size || "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Building Font Color</h4>
                <h3>
                    {recommendation_props?.building?.font_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.building?.font_colour
                                ? `#${recommendation_props?.building?.font_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Building Font Background Color</h4>
                <h3>
                    {recommendation_props?.building?.background_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.building?.background_colour
                                ? `#${recommendation_props?.building?.background_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Building Font Border Color</h4>
                <h3>
                    {recommendation_props?.building?.border_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.building?.border_colour
                                ? `#${recommendation_props?.building?.border_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Building Border </h4>
                <div className={`input-ft-size`}>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.building?.border?.left}></input>
                        <label>left</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.building?.border?.right}
                        ></input>
                        <label>right</label>
                    </span>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.building?.border?.top}></input>
                        <label>top</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.building?.border?.bottom}
                        ></input>
                        <label>bottom</label>
                    </span>
                </div>
            </div>
        </div>
        <div className="col-md-6 basic-box"></div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Addition Font Name</h4>
                <h3>{(recommendation_props?.addition?.font_id && recommendation_props?.addition?.font_family) || "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Addition Font Size</h4>
                <h3>{recommendation_props?.addition?.font_size || "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Addition Font Color</h4>
                <h3>
                    {recommendation_props?.addition?.font_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.addition?.font_colour
                                ? `#${recommendation_props?.addition?.font_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Addition Background Color</h4>
                <h3>
                    {recommendation_props?.addition?.background_colour || ""}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.addition?.background_colour
                                ? `#${recommendation_props?.addition?.background_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Addition Border Color</h4>
                <h3>
                    {recommendation_props?.addition?.background_colour || ""}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.addition?.border_colour
                                ? `#${recommendation_props?.addition?.border_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Addition Border </h4>
                <div className={`input-ft-size`}>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.addition?.border?.left}></input>
                        <label>left</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.addition?.border?.right}
                        ></input>
                        <label>right</label>
                    </span>
                    <span className="check-align">
                        <input disabled type="checkbox" defaultChecked={recommendation_props?.addition?.border?.top}></input>
                        <label>top</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.addition?.border?.bottom}
                        ></input>
                        <label>bottom</label>
                    </span>
                </div>
            </div>
        </div>
        <div className="col-md-6 basic-box"></div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Grand Total Font Name</h4>
                <h3>{(recommendation_props?.grand_total?.font_id && recommendation_props?.grand_total?.font_family )|| "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Grand Total Font Size</h4>
                <h3>{recommendation_props?.grand_total?.font_size || "-"}</h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Grand Total Font Color</h4>
                <h3>
                    {recommendation_props?.grand_total?.font_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.grand_total?.font_colour
                                ? `#${recommendation_props?.grand_total?.font_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Grand Total Background Color</h4>
                <h3>
                    {recommendation_props?.grand_total?.background_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.grand_total?.background_colour
                                ? `#${recommendation_props?.grand_total?.background_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Grand Total Border Color</h4>
                <h3>
                    {recommendation_props?.grand_total?.background_colour || "-"}

                    <span
                        className="color"
                        style={{
                            backgroundColor: recommendation_props?.grand_total?.border_colour
                                ? `#${recommendation_props?.grand_total?.border_colour}`
                                : ""
                        }}
                    ></span>
                </h3>
            </div>
        </div>
        <div className="col-md-3 basic-box">
            <div className="codeOtr">
                <h4>Grand Total Border </h4>
                <div className={`input-ft-size`}>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.grand_total?.border?.left}
                        ></input>
                        <label>left</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.grand_total?.border?.right}
                        ></input>
                        <label>right</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.grand_total?.border?.top}
                        ></input>
                        <label>top</label>
                    </span>
                    <span className="check-align">
                        <input
                            disabled
                            type="checkbox"
                            defaultChecked={recommendation_props?.grand_total?.border?.bottom}
                        ></input>
                        <label>bottom</label>
                    </span>
                </div>
            </div>
        </div>
        <div className="col-md-6 basic-box"></div>
    </>
    );
}

export default SortedRecommendationsInfo;
