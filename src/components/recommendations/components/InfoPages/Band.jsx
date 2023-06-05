import React from "react";
import NumberFormat from "react-number-format";

export const Field = ({ elem, data }) => {
    return (
        <div class="codeOtr">
            <h4>{elem.label}</h4>
            <h3>
                {elem.type === "number" ? (
                    <NumberFormat value={data[elem.key] || 0} thousandSeparator={true} displayType={"text"} prefix={elem.isCost ? "$ " : ""} />
                ) : (
                    <>{data[elem.key] || "-"}</>
                )}
            </h3>
        </div>
    );
};

export const Band = ({ bandName = "", data = {}, setToolTip, fields = [], bandId = "", handleBandClick }) => {
    return (
        <div class="card">
            <div class="card-header" id={`heading-${bandId}`}>
                <div className="otr-recom-div">
                    <button
                        class="btn btn-link"
                        data-toggle="collapse"
                        onClick={handleBandClick}
                        data-target={`#${bandId}`}
                        aria-expanded="false"
                        // aria-controls="collapseOne"
                    >
                        {bandName}
                    </button>
                    {fields.slice(0, 3).map(elem => (
                        <div class="col-md-3 basic-box">
                            <Field elem={elem} data={data} />
                        </div>
                    ))}
                </div>
            </div>

            <div id={bandId} class="collapse" aria-labelledby={`heading-${bandId}`}>
                <div class="card-body">
                    <div class="outer-rcm mt-1  basic-dtl-otr p-0">
                        {fields.slice(3).map(elem => (
                            <div className="col-md-3 basic-box">
                                <Field elem={elem} data={data} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
