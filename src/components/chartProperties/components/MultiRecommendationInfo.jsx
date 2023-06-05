import React from 'react'

function MultiRecommendationInfo({multi_recommendation_props}) {
  return (
    <>
    <div className="col-md-12 basic-box main-heading mt-2">
        <h3>Multi Recomendation Properties</h3>
    </div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Heading Font Name</h4>
            <h3>{multi_recommendation_props?.heading?.font_family || "-"}</h3>
        </div>
    </div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Heading Font Size</h4>
            <h3>
                {multi_recommendation_props?.heading?.font_size
                    ? `${multi_recommendation_props?.heading?.font_size} pt`
                    : ""}
            </h3>
        </div>
    </div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Heading Font Color</h4>
            <h3>
                {multi_recommendation_props?.heading?.font_color || "-"}
                <span
                    className="color"
                    style={{
                        backgroundColor: multi_recommendation_props?.heading?.font_color
                            ? `#${multi_recommendation_props?.heading?.font_color}`
                            : ""
                    }}
                ></span>
            </h3>
        </div>
    </div>
    <div className="col-md-3 basic-box"></div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Body Font Name</h4>
            <h3>{multi_recommendation_props?.body?.font_family || "-"}</h3>
        </div>
    </div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Body Font Size</h4>
            <h3>
                {multi_recommendation_props?.body?.font_size ? `${multi_recommendation_props?.body?.font_size} pt` : ""}
            </h3>
        </div>
    </div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Body Font Color</h4>
            <h3>
                {multi_recommendation_props?.body?.font_color || "-"}
                <span
                    className="color"
                    style={{
                        backgroundColor: multi_recommendation_props?.body?.font_color
                            ? `#${multi_recommendation_props?.body?.font_color}`
                            : ""
                    }}
                ></span>
            </h3>
        </div>
    </div>
    <div className="col-md-3 basic-box"></div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Caption Font Name</h4>
            <h3>{multi_recommendation_props?.caption?.font_family || "-"}</h3>
        </div>
    </div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Caption Font Size</h4>
            <h3>{`${multi_recommendation_props?.caption?.font_size || "-"} pt`}</h3>
        </div>
    </div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Caption Font Color</h4>
            <h3>
                {multi_recommendation_props?.caption?.font_color || "-"}
                <span
                    className="color"
                    style={{
                        backgroundColor: multi_recommendation_props?.caption?.font_color
                            ? `#${multi_recommendation_props?.caption?.font_color}`
                            : ""
                    }}
                ></span>
            </h3>
        </div>
    </div>
    <div className="col-md-3 basic-box"></div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Notes Font Name</h4>
            <h3>{multi_recommendation_props?.notes?.font_family || "-"}</h3>
        </div>
    </div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Notes Font Size</h4>
            <h3>{`${multi_recommendation_props?.notes?.font_size || "-"} pt`}</h3>
        </div>
    </div>
    <div className="col-md-3 basic-box">
        <div className="codeOtr">
            <h4>Notes Font Color</h4>
            <h3>
                {multi_recommendation_props?.notes?.font_color || "-"}
                <span
                    className="color"
                    style={{
                        backgroundColor: multi_recommendation_props?.notes?.font_color
                            ? `#${multi_recommendation_props?.notes?.font_color}`
                            : ""
                    }}
                ></span>
            </h3>
        </div>
    </div>
    <div className="col-md-3 basic-box"></div>
</>
  )
}

export default MultiRecommendationInfo