import React from "react";

export const BuildingFieldRows = ({ label, options = [], field, handleChangeDynamicFieldValue, handleChangeDynamicFields }) => {
    return (
        <tr>
            <td className="img-sq-box">
                <img alt="" src="/img/sq-box.png" />
            </td>
            <td>{label}</td>
            <td className="fy-dtl">
                <div className="button-group pt-0 pb-2" style={{ margin: "initial" }}>
                    <div className="form-group outer p-0 mb-0 col-md-12 align-items-center d-flex flex-wrap label-add-outer">
                        {options?.length > 0 &&
                            options.map((item, index) => (
                                <div key={index} className="form-group d-flex align-items-center label-del col-md-3 pl-0 mb-0 mt-2">
                                    <div className="col-md-10 p-0">
                                        <input
                                            value={item}
                                            onChange={e => handleChangeDynamicFieldValue(field, e.target.value, index)}
                                            className="form-control not-draggable"
                                            placeholder="Type Here..."
                                        />
                                    </div>
                                    <div className="col-md-2 p-0 pr-0">
                                        <button
                                            className="del-button not-draggable"
                                            onClick={() => {
                                                handleChangeDynamicFields(field, "delete", index);
                                            }}
                                        >
                                            <i className="fas fa-trash" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        <button className="btn add-button-wrapper not-draggable" onClick={() => handleChangeDynamicFields(field, "add")}>
                            + Add
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
};
