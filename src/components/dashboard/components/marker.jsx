import React, { useState, useCallback, useEffect, useLayoutEffect } from "react";
import GMap from "./GMap";
import $ from "jquery";
import ReactTooltip from "react-tooltip";
import ReactSelect from "react-select";

// API key of the google map
const GOOGLE_MAP_API_KEY = "AIzaSyBknjmLFtejuWK1m_czDlv6LAn0D_HfnrU";

// load google map script
const loadGoogleMapScript = callback => {
    if (typeof window.google === "object" && typeof window.google.maps === "object") {
        callback();
    } else {
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBknjmLFtejuWK1m_czDlv6LAn0D_HfnrU&callback=initialize&libraries=&v=weekly`;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener("load", callback);
    }
};

const Markers = props => {
    const [loadMap, setLoadMap] = useState(false);
    const [pos, setPos] = useState(false);
    const [hide, setHide] = useState(false);
    const [isFullscreen, setFullScreen] = useState(props.isFullScreen === "map" ? true : false);

    useEffect(() => {
        loadGoogleMapScript(() => {
            setLoadMap(true);
        });
    }, []);

    useEffect(() => {
        setMapMode();
    }, [props.markers]);

    const setMapMode = () => {
        let allEqual = props?.markers?.every(item => item.map_view === props.markers[0]?.map_view);
        props.handleMapModeChange(allEqual ? props.markers[0]?.map_view : "silver");
    };

    const handleFullView = () => {
        if (isFullscreen) {
            $("#map-canvas").removeClass("flscrn-map");
        } else {
            // window.google.maps.event.trigger(document.getElementById('map'), 'resize')
            $("#map-canvas").addClass("flscrn-map");
        }
        setFullScreen(!isFullscreen);

        props.handleViewDetails("map");
    };

    const hideSelect = value => {
        setHide(value);
    };

    const [dimensions, setDimensions] = useState(null);

    const callBackRef = useCallback(domNode => {
        if (domNode) {
            setDimensions(domNode.getBoundingClientRect());
        }
    }, []);

    const dropDownValues = [
        { label: "Sites", value: "site" },
        { label: "Buildings", value: "building" },
        { label: "All", value: "all" }
    ];
    const mapRecommendationValues = [
        { label: "With Recommendations", value: "with_recommmendation" },
        { label: "Without Recommendations", value: "without_recommendation" },
        { label: "All", value: "all" }
    ];
    const mapModeValues = [
        { label: "Silver", value: "silver" },
        { label: "Default", value: "default" },
        { label: "Night Mode", value: "night" },
        { label: "Retro", value: "retro" }
    ];

    const selectedMapModeValue = mapModeValues.find(option => option.value === props.individualFilters?.map_mode);
    const selectedMapTypeValue = mapRecommendationValues.find(option => option.value === props.individualFilters?.reco_type);
    const selectedDropValue = dropDownValues.find(option => option.value === props.individualFilters?.map_type);
    return (
        <div className={isFullscreen ? "sld-ara w-100" : "sld-ara"}>
            <ReactTooltip id="map-mod" className="rc-tooltip-custom-class" />
            <div className={"hed-set"}>
                <h2>{props.renderHeading("map")}</h2>
                <div className="btn-grp">
                    {!hide ? (
                        <div
                            className="categ-select-box wid-sel-bx-110 pr-1"
                            data-delay-show="500"
                            data-tip={`Select Map Mode`}
                            data-effect="solid"
                            data-for="map-mod"
                            data-place="left"
                            data-background-color="#007bff"
                        >
                            <ReactSelect
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={selectedMapModeValue}
                                onChange={async value => {
                                    await props.handleMapModeChange(value?.value);
                                }}
                                options={mapModeValues}
                            />
                        </div>
                    ) : null}
                    <div
                        className="categ-select-box wid-sel-bx-250 pr-1"
                        data-delay-show="500"
                        data-tip={`Select Map Type `}
                        data-effect="solid"
                        data-for="map-mod"
                        data-place="left"
                        data-background-color="#007bff"
                    >
                        <ReactSelect
                            className="react-select-container"
                            classNamePrefix="react-select"
                            value={selectedMapTypeValue}
                            onChange={async value => {
                                await props.handleMapChange(value?.value, "recommendation");
                            }}
                            options={mapRecommendationValues}
                        />
                    </div>
                    <div
                        className="categ-select-box wid-sel-bx-110 pr-1 "
                        data-delay-show="500"
                        data-tip={`Select Map Type`}
                        data-effect="solid"
                        data-for="map-mod"
                        data-place="left"
                        data-background-color="#007bff"
                    >
                        <ReactSelect
                            className="react-select-container"
                            classNamePrefix="react-select"
                            value={selectedDropValue}
                            onChange={async value => {
                                await props.handleMapChange(value?.value, "map");
                            }}
                            options={dropDownValues}
                        />
                    </div>
                    <div
                        className="fl-srn"
                        onClick={() => setPos(!pos)}
                        data-delay-show="500"
                        data-tip={`Reset Zoom`}
                        data-effect="solid"
                        data-for="map-mod"
                        data-place="left"
                        data-background-color="#007bff"
                    >
                        <img src="/img/refresh-dsh.svg" alt="" className="set-icon-width" />
                    </div>
                    <div
                        className="fl-srn"
                        onClick={() => handleFullView()}
                        data-delay-show="500"
                        data-tip={isFullscreen ? `Minimize Map` : `Maximize Map`}
                        data-effect="solid"
                        data-for="map-mod"
                        data-place="left"
                        data-background-color="#007bff"
                    >
                        <img src="/img/restore.svg" alt="" className="set-icon-width" />
                    </div>
                </div>
            </div>
            {props.markers && props.markers.length ? (
                <div className={isFullscreen ? "graph-ara map-cstm" : "test"}>
                    <div className="App" id="map-canvas" style={{ width: "100%", height: "100%" }} ref={callBackRef}>
                        {props.markers ? (
                            <GMap
                                markers={props.markers}
                                // theme={theme}
                                theme={props.individualFilters.map_mode}
                                setRecomentationFilter={props.setRecomentationFilter}
                                hideSelect={hideSelect}
                                isFullscreen={isFullscreen}
                                dashboardFilterParams={props.dashboardFilterParams}
                                center={pos}
                            />
                        ) : null}
                    </div>
                </div>
            ) : (
                <div className="coming-soon no-data">
                    <div className="coming-soon-img">
                        <img src="/img/no-data.svg" />
                    </div>
                    <div className="coming-txt">
                        <h3>NO DATA FOUND</h3>
                        <h4>There is no data to show you right now!!!</h4>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Markers;
