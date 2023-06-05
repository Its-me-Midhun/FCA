import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastFunction = ({title,body}) => {
    return {
        ...toast.info(<ToastComponent title={title} body={body}/>, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme:"colored"
        })
    };
};

const ToastComponent=({title,body})=>{
    return(
        <div>
            <h4>{title}</h4>
            <p>{body}</p>
        </div>
    )
}

export default toastFunction;