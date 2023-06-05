/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import usePrevious from "../../common/components/prevProps";
import history from "../../../config/history";
import { bulkResetBreadCrumpData, inrange } from "../../../config/utils";
import $ from "jquery";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
const GMap = props => {
    const googleMapRef = useRef();
    let googleMap = null;
    const prevMarkers = usePrevious(props.markers);
    const prevTheme = usePrevious(props.theme);
    const getInfowindowOffset = (map, marker) => {
        var center = getPixelFromLatLng(map, map.getCenter()),
            point = getPixelFromLatLng(map, marker.getPosition()),
            quadrant = "",
            offset;
        quadrant += point.y > center.y ? "b" : "t";
        quadrant += point.x < center.x ? "l" : "r";
        if (quadrant === "tr") {
            offset = new window.google.maps.Size(-95, 140);
        } else if (quadrant === "tl") {
            offset = new window.google.maps.Size(70, 140);
        } else if (quadrant === "br") {
            offset = new window.google.maps.Size(-80, 0);
        } else if (quadrant === "bl") {
            offset = new window.google.maps.Size(70, 10);
        }

        return offset;
    };

    const getPixelFromLatLng = (map, latLng) => {
        var projection = map.getProjection();
        var point = projection.fromLatLngToPoint(latLng);
        return point;
    };

    useEffect(() => {
        renderMap();
    }, [props.isFullscreen]);

    useEffect(() => {
        renderMap();
    }, [props.center]);

    useEffect(() => {
        if (prevMarkers !== props.markers) {
            renderMap();
        }
    }, [prevMarkers, props.markers]);

    useEffect(() => {
        if (prevTheme !== props.theme) {
            renderMap();
        }
    }, [prevTheme, props.theme]);

    const renderMap = async () => {
        googleMap = await initGoogleMap();
        let clicked = false;
        var bounds = new window.google.maps.LatLngBounds();
        const { markers } = props;
        const mapMarkers =
            googleMap &&
            markers
                //filter out invalid lat/long
                .filter(x => x.lat && x.long && inrange(-90, parseFloat(x.lat), 90) && inrange(-180, parseFloat(x.long), 180))
                .map(x => {
                    const contentString =
                        '<div class="map-tooltip" id="scrollFix"><b>' +
                        x.name +
                        "</b><br>" +
                        x.place +
                        '<br/><button id="clickableItem" class="click-btn">Check Details</button>';
                    const marker = createMarker({
                        lat: parseFloat(x.lat),
                        lng: parseFloat(x.long),
                        place: x.place,
                        name: x.name,
                        contentString,
                        entity_type: x.entity_type,
                        color: x.color
                    });
                    bounds.extend(marker.position);
                    const infowindow = new window.google.maps.InfoWindow({
                        content: contentString
                    });

                    marker.setMap(googleMap);
                    // marker icon resizing on zoom change
                    window.google.maps.event.addListener(googleMap, "zoom_changed", function () {
                        let zoomLevel = this.getZoom();
                        marker.setIcon(circleIcon(x.color, x.entity_type, zoomLevel));
                    });

                    window.google.maps.event.addListener(marker, "mouseover", function () {
                        if (!clicked) {
                            // infowindow.setOptions({ pixelOffset: getInfowindowOffset(googleMap, marker) });
                            infowindow.open(googleMap, marker);
                        }
                    });
                    window.google.maps.event.addListener(marker, "mouseout", function () {
                        if (!clicked) {
                            infowindow.close();
                        }
                    });
                    window.google.maps.event.addListener(marker, "click", function () {
                        clicked = true;
                        infowindow.open(googleMap, marker);
                    });
                    window.google.maps.event.addListener(infowindow, "closeclick", function () {
                        clicked = false;
                    });

                    window.google.maps.event.addListener(infowindow, "domready", () => {
                        if (x.entity_type === "building") {
                            document.getElementById("clickableItem") &&
                                document.getElementById("clickableItem").addEventListener("click", () => {
                                    props.setRecomentationFilter({ building_ids: [x.id] }, { name: "Building", value: [x.name] }, true, true);
                                    history.push(`/building/buildinginfo/${x.id}/recommendations?info=true&pid=${x.project_id}&dashboardView=true`);
                                });
                            let bc = [
                                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                                { key: "main", name: "FCA Projects", path: "/project", index: 1 },
                                {
                                    key: "projectName",
                                    name: x.project_name,
                                    path: `/project/projectinfo/${x.project_id}/basicdetails?dashboardView=true`,
                                    index: 2
                                },
                                { key: "main", name: "Buildings", path: "/buildings", index: 3 },
                                {
                                    key: "buildingName",
                                    name: x.name,
                                    path: `/building/buildinginfo/${x.project_id}/basicdetails?dashboardView=true`,
                                    index: 5
                                },
                                {
                                    key: "info",
                                    name: "Recommendations",
                                    path: `/building/buildinginfo/${x.id}/recommendations?info=true&pid=${x.project_id}&dashboardView=true`,
                                    index: 6
                                }
                            ];
                            bulkResetBreadCrumpData(bc);
                        } else {
                            document.getElementById("clickableItem") &&
                                document.getElementById("clickableItem").addEventListener("click", () => {
                                    props.setRecomentationFilter({ site_ids: [x.id] }, { name: "Site", value: [x.name] }, true, true);

                                    history.push(`/site/siteinfo/${x.id}/recommendations?info=true&pid=${x.project_id}&dashboardView=true`);
                                });
                            let bc = [
                                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                                { key: "main", name: "FCA Projects", path: "/project", index: 1 },
                                {
                                    key: "projectName",
                                    name: x.project_name,
                                    path: `/project/projectinfo/${x.project_id}/basicdetails?dashboardView=true`,
                                    index: 2
                                },
                                { key: "main", name: "Sites", path: "/sites", index: 3 },
                                {
                                    key: "basicdetails",
                                    name: x.name,
                                    path: `/site/siteinfo/${x.id}/basicdetails?info=true&pid=${x.project_id}&dashboardView=true`,
                                    index: 4
                                },
                                {
                                    key: "siteName",
                                    name: x.name,
                                    path: `/site/siteinfo/${x.project_id}/basicdetails?dashboardView=true`,
                                    index: 5
                                },
                                {
                                    key: "info",
                                    name: "Recommendations",
                                    path: `/site/siteinfo/${x.id}/recommendations?info=true&pid=${x.project_id}&dashboardView=true`,
                                    index: 6
                                }
                            ];
                            bulkResetBreadCrumpData(bc);
                        }
                    });
                    const panorama = new window.google.maps.StreetViewPanorama(document.getElementById("pano"), {
                        position: { lat: parseFloat(x.lat), lng: parseFloat(x.long) },
                        pov: {
                            heading: 25,
                            pitch: 15
                        },
                        visible: false,
                        enableCloseButton: true,
                        fullscreenControl: false
                    });
                    googleMap.setStreetView(panorama);
                    window.google.maps.event.addListener(panorama, "visible_changed", function () {
                        if (panorama.getVisible() && $("#pano").is(":visible")) {
                        } else if (panorama.getVisible() && $("#pano").is(":hidden")) {
                            props.hideSelect(true);
                            $("#pano").show();
                            $("#map").removeClass("bigmap");
                            if (props.isFullscreen) {
                                $("#map").addClass("minimap-flscrn");
                            } else {
                                $("#map").addClass("minimap");
                            }
                            $("#map-canvas").addClass("divide-map");
                            googleMap.setCenter({ lat: parseFloat(x.lat), long: parseFloat(x.long) });
                            // onWindowResize()
                        }
                        window.google.maps.event.addListener(panorama, "closeclick", function () {
                            props.hideSelect(false);

                            $("#pano").hide();
                            if (props.isFullscreen) {
                                $("#map").removeClass("minimap-flscrn");
                            } else {
                                $("#map").removeClass("minimap");
                            }
                            $("#map-canvas").removeClass("divide-map");
                            $("#map").addClass("bigmap");
                            // onWindowResize()
                        });
                    });
                    return marker;
                });

        window.google.maps.event.addListener(googleMap, "zoom_changed", function () {
            let zoomChangeBoundsListener = window.google.maps.event.addListener(googleMap, "bounds_changed", function (event) {
                if (this.getZoom() > 12 && this.initialZoom === true) {
                    // Change max/min zoom here
                    this.setZoom(12);
                    this.initialZoom = false;
                }

                window.google.maps.event.removeListener(zoomChangeBoundsListener);
            });
        });
        if (mapMarkers?.length) {
            new MarkerClusterer({ map: googleMap, markers: mapMarkers });
        }
        googleMap.initialZoom = true;
        googleMap && googleMap.fitBounds(bounds);
    };

    const styles = {
        default: [],
        silver: [
            {
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }]
            },
            {
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }]
            },
            {
                elementType: "labels.text.fill",
                stylers: [{ color: "#616161" }]
            },
            {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#f5f5f5" }]
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{ color: "#bdbdbd" }]
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#eeeeee" }]
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#757575" }]
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#e5e5e5" }]
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9e9e9e" }]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#ffffff" }]
            },
            {
                featureType: "road.arterial",
                elementType: "labels.text.fill",
                stylers: [{ color: "#757575" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#dadada" }]
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#616161" }]
            },
            {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9e9e9e" }]
            },
            {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [{ color: "#e5e5e5" }]
            },
            {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{ color: "#eeeeee" }]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#c9c9c9" }]
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9e9e9e" }]
            }
        ],
        night: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }]
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }]
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }]
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }]
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }]
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }]
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }]
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }]
            },
            {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }]
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }]
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }]
            }
        ],
        retro: [
            { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{ color: "#c9b2a6" }]
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "geometry.stroke",
                stylers: [{ color: "#dcd2be" }]
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{ color: "#ae9e90" }]
            },
            {
                featureType: "landscape.natural",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }]
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }]
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#93817c" }]
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{ color: "#a5b076" }]
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#447530" }]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#f5f1e6" }]
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{ color: "#fdfcf8" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#f8c967" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#e9bc62" }]
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry",
                stylers: [{ color: "#e98d58" }]
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry.stroke",
                stylers: [{ color: "#db8555" }]
            },
            {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{ color: "#806b63" }]
            },
            {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }]
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.fill",
                stylers: [{ color: "#8f7d77" }]
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#ebe3cd" }]
            },
            {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }]
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#b9d3c2" }]
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#92998d" }]
            }
        ],
        hiding: [
            {
                featureType: "poi.business",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }]
            }
        ]
    };

    // initialize the google map
    const initGoogleMap = () => {
        const map = new window.google.maps.Map(googleMapRef.current, {
            center: { lat: -33.9, lng: 151.1 },
            zoom: 10,
            zoomControl: true,
            scaleControl: false,
            fullscreenControl: false,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            streetViewControl: true,
            panControl: false,
            styles: [
                {
                    elementType: "geometry",
                    stylers: [{ color: "#f5f5f5" }]
                },
                {
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }]
                },
                {
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#616161" }]
                },
                {
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#f5f5f5" }]
                },
                {
                    featureType: "administrative.land_parcel",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#bdbdbd" }]
                },
                {
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [{ color: "#eeeeee" }]
                },
                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#757575" }]
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#e5e5e5" }]
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9e9e9e" }]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#ffffff" }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#757575" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#dadada" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#616161" }]
                },
                {
                    featureType: "road.local",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9e9e9e" }]
                },
                {
                    featureType: "transit.line",
                    elementType: "geometry",
                    stylers: [{ color: "#e5e5e5" }]
                },
                {
                    featureType: "transit.station",
                    elementType: "geometry",
                    stylers: [{ color: "#eeeeee" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#c9c9c9" }]
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9e9e9e" }]
                }
            ]
        });
        map.setTilt(45);
        map.setOptions({ styles: styles[props.theme] || styles["silver"] });
        return map;
    };

    const circleIcon = (color, type, zoom = 10) => {
        let icon = {};
        if (type === "building") {
            let colorValue = color ? `"${color}"` : `"#CD6090"`;

            let svg = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="33.865px" height="49.383px" viewBox="0 0 33.865 49.383" enable-background="new 0 0 33.865 49.383" xml:space="preserve">
       <g>
           <g>
               <g>
                   <circle fill=${colorValue} cx="17.013" cy="14.949" r="13.91"/>
                   <ellipse opacity="0.4" fill="#72695C" cx="17.064" cy="46.743" rx="12.942" ry="1.885"/>
               </g>
               <ellipse fill=${colorValue} cx="19.924" cy="7.339" rx="3.985" ry="3.023"/>
           </g>
           <rect x="16.67" y="29.634" fill="#72695C" width="1" height="14"/>
       </g>
       </svg>`;
            icon = {
                url: "data:image/svg+xml;charset=UTF-8;base64," + btoa(svg),
                scaledSize: new window.google.maps.Size(30, 30)
                // scaledSize:{height:props.num,width:props.num}
            };
        } else {
            let colorValue = color ? `${color}` : "#006DB0";
            let scale = zoom > 12 ? 12 : zoom < 7 ? 6 : zoom;
            icon = {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillOpacity: 1.0,
                fillColor: colorValue,
                strokeOpacity: 1.0,
                strokeColor: colorValue,
                strokeWeight: 1.0,
                scale: scale
            };
        }
        return icon;
    };

    // create marker on google map
    const createMarker = markerObj =>
        new window.google.maps.Marker({
            position: { lat: parseFloat(markerObj.lat), lng: parseFloat(markerObj.lng) },
            icon: circleIcon(markerObj.color, markerObj.entity_type),
            map: googleMap,
            animation: window.google.maps.Animation.DROP,
            title: "Click me"
        });
    return (
        <>
            <div id="map" class="bigmap" ref={googleMapRef} style={{ width: "100%", height: "100%" }} />
            <div id="pano" class="bigmap" style={{ display: "none" }}></div>
        </>
    );
};

export default GMap;
