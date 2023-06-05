import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import GoogleMapReact from "google-map-react";
import ReactTooltip from "react-tooltip";

import Loader from "./Loader";
import { splitAddressComponents } from "../../../config/utils";

class AddLocationModal extends Component {
    state = {
        isLoading: true,
        address: this.props.locationDetails.place,
        locationDetails: this.props.locationDetails,
        isMapUpdated: true,
        addressError: ""
    };

    handleAddressSearch = address => {
        if (address) {
            this.setState({
                address,
                addressError: "",
                isMapUpdated: false,
                locationDetails: {
                    ...this.state.locationDetails,
                    place: address
                }
            });
        } else {
            this.setState({
                address: "",
                addressError: "Address is required"
            });
        }
    };

    handleSelect = async address => {
        try {
            this.setState({
                address,
                isLoading: true
            });
            const results = await geocodeByAddress(address);
            const latLng = await getLatLng(results[0]);
            const addressComponents = results[0]?.address_components;
            const addressObj = splitAddressComponents(addressComponents);
            this.setState({
                address,
                locationDetails: {
                    ...this.state.locationDetails,
                    place: address,
                    lat: latLng?.lat?.toString(),
                    long: latLng?.lng?.toString(),
                    ...addressObj
                },
                isMapUpdated: true,
                isLoading: false
            });
        } catch (error) {
            console.log(error);
            this.setState({
                isLoading: false
            });
        }
    };

    clearLocationData = () => {
        this.setState({
            address: "",
            locationDetails: {
                place: "",
                lat: "",
                long: ""
            },
            isMapUpdated: false
        });
    };

    saveLocation = () => {
        this.props.saveLocation(this.state.locationDetails);
    };

    render() {
        const { address, locationDetails, isMapUpdated } = this.state;
        const { onCancel } = this.props;
        return (
            <React.Fragment>
                <div id="modalId" className="modal modal-region modal-location" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Add Location
                                </h5>
                                <button type="button" className="close" onClick={onCancel}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr">
                                <div className="form-group d-flex flex-wrap">
                                    <div className="col-md-12 formInp">
                                        <label>Location Name</label>
                                        <PlacesAutocomplete value={address} onChange={this.handleAddressSearch} onSelect={this.handleSelect}>
                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                <div className="autocompleteOuter">
                                                    <input
                                                        {...getInputProps({
                                                            placeholder: "Search Places ..",
                                                            className: "location-search-input form-control"
                                                        })}
                                                    />
                                                    <div className="autocomplete-dropdown-container">
                                                        {loading && <div className="loader">Loading...</div>}
                                                        {suggestions.map((suggestion, suggKey) => {
                                                            const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                                                            return (
                                                                // eslint-disable-next-line react/jsx-key
                                                                <div
                                                                    {...getSuggestionItemProps(suggestion, {
                                                                        className
                                                                    })}
                                                                >
                                                                    <span key={suggKey}>{suggestion.description}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </PlacesAutocomplete>
                                    </div>
                                    <div className="col-md-6 formInp">
                                        <label>Latitude</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={locationDetails.lat}
                                            placeholder="Enter Latitude"
                                            onChange={e =>
                                                this.setState({
                                                    locationDetails: {
                                                        ...locationDetails,
                                                        lat: e.target.value
                                                    },
                                                    isMapUpdated: false
                                                })
                                            }
                                            onBlur={e =>
                                                this.setState({
                                                    isMapUpdated: true
                                                })
                                            }
                                            onKeyPress={event => {
                                                if (event.key === "Enter") {
                                                    this.setState({
                                                        isMapUpdated: true
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6 formInp">
                                        <label>Longitude</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Longitude"
                                            value={locationDetails.long}
                                            onChange={e =>
                                                this.setState({
                                                    locationDetails: {
                                                        ...locationDetails,
                                                        long: e.target.value
                                                    },
                                                    isMapUpdated: false
                                                })
                                            }
                                            onBlur={e =>
                                                this.setState({
                                                    isMapUpdated: true
                                                })
                                            }
                                            onKeyPress={event => {
                                                if (event.key === "Enter") {
                                                    this.setState({
                                                        isMapUpdated: true
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-12 formInp location-otr">
                                        {isMapUpdated ? (
                                            <div
                                                style={{
                                                    height: "200px",
                                                    width: "100%",
                                                    border: "1px solid #cccccc"
                                                }}
                                            >
                                                <GoogleMapReact
                                                    bootstrapURLKeys={{
                                                        key: "AIzaSyBknjmLFtejuWK1m_czDlv6LAn0D_HfnrU"
                                                    }}
                                                    longitude
                                                    defaultCenter={{
                                                        lat: parseFloat(locationDetails.lat) || 38.9071923,
                                                        lng: parseFloat(locationDetails.long) || -77.03687070000001
                                                    }}
                                                    defaultZoom={11}
                                                    yesIWantToUseGoogleMapApiInternals={true}
                                                    options={function (maps) {
                                                        return {
                                                            mapTypeControl: true
                                                        };
                                                    }}
                                                    defaultOptions={{ mapTypeControl: false }}
                                                >
                                                    <div
                                                        lat={parseFloat(locationDetails.lat) || 38.9071923}
                                                        lng={parseFloat(locationDetails.long) || -77.03687070000001}
                                                        data-tip={address}
                                                        data-multiline={true}
                                                        data-place="top"
                                                        data-effect="solid"
                                                        data-background-color="#ec6262"
                                                        style={{ position: "relative" }}
                                                    >
                                                        <ReactTooltip />
                                                        <img className="location-marker" src="/img/map-marker-icon.png" alt="" />
                                                    </div>
                                                </GoogleMapReact>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    height: "200px",
                                                    width: "100%",
                                                    border: "1px solid #cccccc"
                                                }}
                                                className="modal-map-loader"
                                            >
                                                <Loader />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12 p-0 text-right btnOtr">
                                    <button type="button" className="btn btn-secondary btnClr col-md-2" onClick={() => this.clearLocationData()}>
                                        Clear
                                    </button>
                                    <button type="button" className="btn btn-primary btnsve col-md-2 ml-2" onClick={() => this.saveLocation()}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(AddLocationModal);
