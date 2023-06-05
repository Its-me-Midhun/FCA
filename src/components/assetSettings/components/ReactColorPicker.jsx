import React, { useState } from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

function ReactColorPicker({ onChange, title, color }) {
    const [showPicker, setShowPicker] = useState(false);
    const styles = reactCSS({
        default: {
            color: {
                width: "40px",
                height: "15px",
                borderRadius: "3px",
                background: color
            },
            popover: {
                position: "absolute",
                zIndex: "3"
            },
            cover: {
                position: "fixed",
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px"
            },
            swatch: {
                padding: "6px",
                background: "#ffffff",
                borderRadius: "2px",
                cursor: "pointer",
                display: "inline-block",
                boxShadow: "0 0 0 1px rgba(0,0,0,.2)"
            }
        }
    });
    return (
        <div className="col-md-4 basic-box">
            <div className="codeOtr">
                <h4>{title}</h4>
                <div>
                    <div
                        style={styles.swatch}
                        onClick={() => {
                            setShowPicker(!showPicker);
                        }}
                    >
                        <div
                         style={styles.color}
                          />
                    </div>
                    {showPicker ? (
                        <div 
                        style={styles.popover}
                        >
                            <div
                                style={styles.cover}
                                onClick={() => {
                                    setShowPicker(false);
                                }}
                            />
                            <SketchPicker
                                type="color"
                                color={color || ""}
                                presetColors={["#95cd50", "#ffe242", "#ffa105", "#ff0305", "#525252", "#343C65", "#8B572A", "#417505"]}
                                onChange={color => {
                                    onChange(color);
                                    // setShowPicker(false);
                                }}
                                // width="150px"
                            />
                        </div>
                ) : null}
                </div>
            </div>
        </div>
    );
}

export default ReactColorPicker;
