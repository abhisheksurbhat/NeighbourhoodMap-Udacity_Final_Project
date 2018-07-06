import { withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import React, { Component } from 'react';

const Map = withScriptjs(withGoogleMap(props => {
    return (
        <GoogleMap defaultZoom={11} defaultCenter={{ lat: -34.397, lng: 150.644 }} >
            <Marker position={{ lat: -34.397, lng: 150.644 }} />
        </GoogleMap>
        )
    })
)

export default Map
