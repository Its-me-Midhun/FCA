import React from "react";
import { Band } from "./Band";

export const water_fields = [
    {
        label: "Annual Savings Opportunity ($)",
        tableLabel: "Annual Savings Opportunity ($) (Water)",
        key: "annual_savings_water",
        type: "number",
        isCost: true
    },
    {
        label: "Identified Safety Concerns",
        key: "safety_concerns",
        type: "text",
        className: "max-width-100"
    },
    {
        label: "Simple Payback (Yrs)",
        tableLabel: "Simple Payback (Yrs) (Water)",
        key: "simple_payback_water",
        type: "number"
    }
];

export const WaterBand = ({ waterData, bandShown, handleBandClick, handleChangeData, bandId }) => {
    const handleChangeWaterData = (key, value) => {
        handleChangeData({ water_band: { ...waterData, [key]: value } });
    };
    return (
        <div className={`card`}>
            <div className="card-header" id="headingSeven">
                <div className="otr-recom-div">
                    <button
                        className="btn btn-link"
                        data-toggle="collapse"
                        data-target={`#${bandId}`}
                        aria-expanded="false"
                        onClick={() => handleBandClick(bandId, false)}
                    >
                        Water
                    </button>
                    {water_fields.slice(0, 2).map(elem => (
                        <Band
                            bandShown={bandShown}
                            bandId={bandId}
                            fieldType={elem.type}
                            onChange={(key, value) => handleChangeWaterData(key, value)}
                            value={waterData[elem.key] || ""}
                            fieldKey={elem.key}
                            label={elem.label}
                            handleBandClick={() => handleBandClick(bandId, true)}
                            fieldItem={elem}
                        />
                    ))}
                </div>
            </div>

            <div id={bandId} className={bandShown ? "collapse show" : "collapse"} aria-labelledby="headingSeven">
                <div className="card-body">
                    <div className="outer-rcm mt-1">
                        {water_fields.slice(2).map(elem => (
                            <Band
                                fieldType={elem.type}
                                onChange={(key, value) => handleChangeWaterData(key, value)}
                                value={waterData[elem.key] || ""}
                                fieldKey={elem.key}
                                label={elem.label}
                                handleBandClick={() => handleBandClick(bandId, true)}
                                fieldItem={elem}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
