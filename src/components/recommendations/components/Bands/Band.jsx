import React from "react";
import NumberFormat from "react-number-format";

export const Band = ({ fieldType = "text", label, fieldKey, value, onChange, bandShown, bandId, handleBandClick, fieldItem }) => {
    return (
        <div className={`txt-rcm ${fieldItem.className ? fieldItem.className : ""}`} key={fieldKey}>
            <div className="content-inp-card">
                <div
                    className="form-group"
                    data-target={bandShown ? `#${bandId}` : "false"}
                    aria-expanded={bandShown ? true : "false"}
                    onClick={() => handleBandClick()}
                >
                    <label>{label}</label>
                    {fieldType === "text" ? (
                        <input
                            type="text"
                            autoComplete={"off"}
                            className="custom-input form-control"
                            placeholder={label}
                            value={value}
                            name={fieldKey}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    ) : (
                        <NumberFormat
                            autoComplete={"off"}
                            className={`form-control ${fieldItem.isReadOnly ? "cursor-diabled" : ""}`}
                            placeholder={label}
                            thousandSeparator={true}
                            prefix={fieldItem.isCost ? "$ " : ""}
                            value={value || ""}
                            disabled={fieldItem.isReadOnly ? true : false}
                            displayType={"input"}
                            onValueChange={values => {
                                const { value } = values;
                                onChange(fieldKey, value);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
