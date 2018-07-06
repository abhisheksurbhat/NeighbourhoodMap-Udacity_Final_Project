import React, { Component } from 'react';
import Map  from './components/mymap.js';
import './App.css';
import { places } from './data/places.json'

export class App extends Component {
  
  render() {
    console.log(places[0]);
    return (
      <Map
      googleMapURL= "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: '100%' }} />}
      containerElement={<div style={{ height: 'calc(100vh - 80px)'}} />}
      mapElement={<div style={{ height: '100%' }} />}
      />
    );
  }
}
 
export default App
