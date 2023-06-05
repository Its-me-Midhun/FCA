import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import TuiImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";

const ImageEditModal = props => {
    const ref = useRef(null);
    let tuiEditor = null;
    useEffect(() => {
        if (!ref.current) {
            return;
        }
        const myTheme = {
            "header.display": "none"
            // "submenu.backgroundColor": "#eb4034"
        };
        const { selectedImages = [] } = props;
        tuiEditor = new TuiImageEditor(ref.current, {
            includeUI: {
                loadImage: {
                    path: `${selectedImages[0]?.s3_image_key}`,
                    name: "SampleImage"
                },
                uiSize: {
                    // width: "500px",
                    height: "495px"
                },
                // locale: {
                //     Crop: "Crop Image",
                // },
                shape: {
                    strokeWidth: 20
                },
                menu: ["crop", "flip", "rotate", "draw", "shape", "icon", "mask", "text", "filter"],
                menuBarPosition: "left",
                theme: myTheme
            },
            selectionStyle: {
                cornerSize: 50,
                rotatingPointOffset: 1000,
                cornerStyle: "circle",
                cornerStrokeColor: "#FFFFFF",
                cornerColor: "#FFFFFF",
                borderColor: "#FFFFFF",
                transparentCorners: false
            }
        });
        tuiEditor.ui.shape.options.strokeWidth = 20;
        tuiEditor.ui.shape.options.stroke = "#ff4040";
        tuiEditor.ui.text._els.textRange._value = 250;
        tuiEditor.ui.text._els.textColorpicker._color = "#ff4040";
        tuiEditor.ui.draw.color = "#ff4040";
        tuiEditor.ui.icon._els.iconColorpicker._color = "#ff4040";
        window.fabric.Object.prototype.controls.mtr.offsetY = -110;
        // document.body.style.zoom = "110%";
        // console.log("tuiEditor", tuiEditor);
        // let imageUrl = tuiEditor.toDataURL();
        // const tempImage = await (await fetch(imageUrl)).blob();
        // const blob = new Blob([imageUrl]);
        // document.getElementById("#imageDownload").addEventListener("click", async function (e) {
        //     console.log("imageEditor", tuiEditor);
        //     let imageUrl = tuiEditor.toDataURL({ format: "jpeg" });
        //     const blobImage = await (await fetch(imageUrl)).blob();
        //     let secondImage = dataURLtoBlob(imageUrl);
        //     console.log("imageUrl", imageUrl, blobImage);
        //     const downloadUrl = window.URL.createObjectURL(blobImage);
        //     const link = document.createElement("a");
        //     link.href = downloadUrl;
        //     document.body.appendChild(link);
        //     link.click();
        //     link.remove();
        // });
    }, []);

    // const dataURLtoBlob = dataurl => {
    //     var arr = dataurl.split(","),
    //         mime = arr[0].match(/:(.*?);/)[1],
    //         bstr = atob(arr[1]),
    //         n = bstr.length,
    //         u8arr = new Uint8Array(n);
    //     while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new Blob([u8arr], { type: mime });
    // };

    return <div ref={ref} className="not-draggable"></div>;
};

export default ImageEditModal;
