import _ from "lodash";
import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
  StreetViewPanorama,
  OverlayView,
} from "react-google-maps";

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
})

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBknjmLFtejuWK1m_czDlv6LAn0D_HfnrU&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `300px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <>
    <GoogleMap ref={map => map && map.fitBounds()} defaultZoom={12} defaultCenter={{ lat: -37.0902, lng: 95.7129 }}>
      {props.markers.map((x, index) => {
        return <Circle
          key={index}
          center={{ lat: parseFloat(x.lat), lng: parseFloat(x.long) }}
          radius={50000}
          options={{
            strokeColor: "#66009a",
            strokeOpacity: 0.8,
            strokeWeight: 10,
            fillColor: `#66009a`,
            fillOpacity: 0.35,
            zIndex: 1
          }}
        />
      }
      )}
      <StreetViewPanorama defaultPosition={props.center} visible>
        {/* <OverlayView
          position={{ lat: 49.28590291211115, lng: -123.11248166065218 }}
          mapPaneName={OverlayView.OVERLAY_LAYER}
          getPixelPositionOffset={getPixelPositionOffset}
        >
          <div style={{ background: `red`, color: `white`, padding: 5, borderRadius: `50%` }}>
            OverlayView
        </div>
        </OverlayView> */}
      </StreetViewPanorama>
    </GoogleMap>
  </>
));

const enhance = _.identity;

const ReactGoogleMaps = (props) => [
  <MyMapComponent key="map" markers={props.markers} dashboardFilterParams={props.dashboardFilterParams} />
];

export default enhance(ReactGoogleMaps);
