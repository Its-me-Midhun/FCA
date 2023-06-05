import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import _ from "lodash";
import ReactTooltip from "react-tooltip";

import Loader from "./Loader";
import LocationModal from "./LocationModal";
import Portal from "./Portal";
import LoadingOverlay from "react-loading-overlay";

class InfoMap extends Component {
    state = {
        isLoading: true,
        address: "",
        locationDetails: {},
        showLocationModal: false
    };

    componentDidMount = () => {
        this.setState({
            isLoading: false
        });
    };

    toggleLocationModal = () => {
        this.setState({
            showLocationModal: !this.state.showLocationModal
        });
    };

    saveLocation = async locationDetails => {

        this.setState({
            isLoading: true
        });
        const { basicDetails } = this.props

        let data = {
            ...locationDetails,
            client_id: basicDetails.client.id,
            consultancy_id: basicDetails.consultancy.id
        }
        await this.props.handleUpdateLocation(data);
        this.setState({
            locationDetails,
            isLoading: false
        });
        this.toggleLocationModal();
    };

    render() {
        const { isLoading } = this.state;
        const { locationDetails, basicDetails, isBuildingLocked, permissions } = this.props;
        const { showLocationModal } = this.state;
        return (
            <React.Fragment>
                <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div className="tab-active location-sec pt-3">
                
                    {locationDetails && locationDetails.place && locationDetails.place.length ? (
                        <>
                            {isBuildingLocked && isBuildingLocked ?
                                ""
                                :
                                permissions && permissions.edit == false ? ("") : <div className="edit-icn-bx col-md-12 text-right pt-0 pr-2">
                                    <span onClick={() => this.toggleLocationModal()}>
                                        <i className="fas fa-pencil-alt"></i> Update location
                                </span>
                                </div>
                            }
                            <div
                                style={{
                                    height: "600px",
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
                                >
                                    
                                    <div
                                        lat={parseFloat(locationDetails.lat) || 38.9071923}
                                        lng={parseFloat(locationDetails.long) || -77.03687070000001}
                                        data-tip={`${basicDetails.name + "<br>" + locationDetails.place}`}
                                        data-multiline={true}
                                        data-place="top"
                                        data-effect="solid"
                                        data-background-color="#ec6262"
                                    >
                                        <ReactTooltip />
                                        <img className="location-marker" src="/img/map-marker-icon.png" alt="" />
                                    </div>
                                </GoogleMapReact>
                            </div>
                        </>
                    ) : (
                            <>
                                <div className="no-data">
                                    <img src="/img/loc-img.png" alt="" />
                                    <h3>Location Not Available</h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                    {isBuildingLocked && isBuildingLocked ?
                                        "" :
                                        permissions && permissions.create == false && permissions.edit == false ? ("") : <button className="addLoc" onClick={() => this.toggleLocationModal()}>
                                            Add Location
                                        </button>
                                    }
                                </div>
                            </>
                        )}
                </div>

                {showLocationModal ? (
                    <Portal
                        body={
                            <LocationModal
                                saveLocation={this.saveLocation}
                                locationDetails={locationDetails}
                                onCancel={() => this.toggleLocationModal()}
                            />
                        }
                        onCancel={() => this.toggleLocationModal()}
                    />
                ) : null}
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

export default withRouter(InfoMap);
