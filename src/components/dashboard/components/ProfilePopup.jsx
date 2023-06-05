import React from "react";
import profileImg from "../../../assets/img/profile.svg";

export const ProfilePopup = ({ viewUser, handleResetPassword, handleLogout, className = "" }) => {
    const userName = localStorage.getItem("user");
    const image = localStorage.getItem("image");
    const convertRoleName = (roleName = "") => {
        const lowercaseRoleName = roleName?.toLowerCase().replace(/_/g, " ");
        const words = lowercaseRoleName.split(" ");
        const capitalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return capitalizedWords.join(" ");
    };
    const role = convertRoleName(localStorage.getItem("role"));
    return (
        <div className={`dropdown-menu show ${className}`} aria-labelledby="navbarDropdown">
            <div className="profile-info">
                <div className="profile-img">
                    <img src={image === "null" ? profileImg : image} alt="" />
                </div>
                <div className="profile-data">
                    <h3>{userName}</h3>
                    <h5>{role}</h5>
                </div>
            </div>
            <div className="list-items">
                <a className="dropdown-item" href="#" onClick={viewUser}>
                    <div className="icons">
                        <svg xmlns=" http://www.w3.org/2000/svg " width="12.126" height="12.126" viewBox="0 0 12.126 12.126">
                            <g id="vuesax_bold_user" data-name="vuesax/bold/user" transform="translate(130 -236)">
                                <g id="user" transform="translate(-130 236)">
                                    <path id="Vector" d="M0,0H12.126V12.126H0Z" fill="none" opacity={0} />
                                    <path
                                        id="Vector-2"
                                        data-name="Vector"
                                        d="M5.052,2.526A2.526,2.526,0,1,1,2.526,0,2.526,2.526,0,0,1,5.052,2.526Z"
                                        transform="translate(3.537 1.01)"
                                        fill="#92a5b4"
                                    />
                                    <path
                                        id="Vector-3"
                                        data-name="Vector"
                                        d="M4.593,0C2.061,0,0,1.7,0,3.789a.25.25,0,0,0,.253.253h8.68a.25.25,0,0,0,.253-.253C9.185,1.7,7.124,0,4.593,0Z"
                                        transform="translate(1.47 7.326)"
                                        fill="#92a5b4"
                                    />
                                </g>
                            </g>
                        </svg>
                    </div>
                    <span> profile</span>
                </a>
                <a className="dropdown-item" href="#" onClick={handleResetPassword}>
                    <div className="icons">
                        <svg xmlns=" http://www.w3.org/2000/svg " width="12.306" height="12.306" viewBox="0 0 12.306 12.306">
                            <g id="vuesax_bold_key" data-name="vuesax/bold/key" transform="translate(-684 -188)">
                                <path
                                    id="Vector"
                                    d="M9.123,1.134a3.885,3.885,0,0,0-6.456,3.9L.258,7.442a1.033,1.033,0,0,0-.251.764L.16,9.323a.968.968,0,0,0,.769.769l1.118.154a1,1,0,0,0,.764-.256l.42-.42a.254.254,0,0,0,0-.364l-.995-.995a.384.384,0,0,1,.544-.544l1,1a.257.257,0,0,0,.359,0L5.226,7.585a3.881,3.881,0,0,0,3.9-6.451ZM6.411,5.124A1.282,1.282,0,1,1,7.693,3.842,1.282,1.282,0,0,1,6.411,5.124Z"
                                    transform="translate(685.024 189.029)"
                                    fill="#92a5b4"
                                />
                                <path
                                    id="Vector-2"
                                    data-name="Vector"
                                    d="M0,0H12.306V12.306H0Z"
                                    transform="translate(696.306 200.306) rotate(180)"
                                    fill="none"
                                    opacity={0}
                                />
                            </g>
                        </svg>
                    </div>
                    <span> Reset Password</span>
                </a>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                    <div className="icons">
                        <svg xmlns=" http://www.w3.org/2000/svg " width="12.306" height="12.306" viewBox="0 0 12.306 12.306">
                            <g id="vuesax_bold_key" data-name="vuesax/bold/key" transform="translate(-684 -188)">
                                <path
                                    id="Vector"
                                    d="M0,0H12.306V12.306H0Z"
                                    transform="translate(696.306 200.306) rotate(180)"
                                    fill="none"
                                    opacity={0}
                                />
                                <g
                                    id="_86295b14143e2c01dceb07f0f52310da"
                                    data-name="86295b14143e2c01dceb07f0f52310da"
                                    transform="translate(651.949 178.761)"
                                >
                                    <g id="Group_1" data-name="Group 1" transform="translate(33.075 10.01)">
                                        <path
                                            id="Path_1"
                                            data-name="Path 1"
                                            d="M419.09-500.962a.944.944,0,0,0-.567.485l-.069.133-.008,2.653c-.008,2.935-.013,2.8.157,3.045a.917.917,0,0,0,.87.375.911.911,0,0,0,.682-.513l.069-.146v-5.388l-.067-.144a.883.883,0,0,0-.775-.526A.881.881,0,0,0,419.09-500.962Z"
                                            transform="translate(-414.21 500.99)"
                                            fill="#92a5b4"
                                        />
                                        <path
                                            id="Path_2"
                                            data-name="Path 2"
                                            d="M34.971-342.15a.979.979,0,0,0-.5.339A5.148,5.148,0,0,0,33.1-338.8a5.176,5.176,0,0,0,1.139,3.774,6.828,6.828,0,0,0,.821.8,5.189,5.189,0,0,0,3.348,1.067,5.061,5.061,0,0,0,3.476-1.56,4.789,4.789,0,0,0,.937-1.337,5.109,5.109,0,0,0-.026-4.505,4.746,4.746,0,0,0-.89-1.27.87.87,0,0,0-.5-.316.905.905,0,0,0-1.052.549.779.779,0,0,0-.046.364.852.852,0,0,0,.308.659,3.368,3.368,0,0,1,.844,1.632,3.675,3.675,0,0,1,0,1.319,3.255,3.255,0,0,1-.913,1.688,3.227,3.227,0,0,1-1.688.913,3.675,3.675,0,0,1-1.319,0,3.322,3.322,0,0,1-2.6-2.6,3.675,3.675,0,0,1,0-1.319,3.357,3.357,0,0,1,.831-1.619.917.917,0,0,0,.321-.672.743.743,0,0,0-.046-.364A.914.914,0,0,0,34.971-342.15Z"
                                            transform="translate(-33.075 343.925)"
                                            fill="#92a5b4"
                                        />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <span> Logout</span>
                </a>
            </div>
        </div>
    );
};
