import React, { Component } from 'react';
import Map  from './components/mymap.js';
import './App.css';
import places from './data/places.json'

class App extends Component {
  
  render() {
    return (
      <div className="container">
      <div className="options-box">
        <h1>Available Places</h1>
        <div>
          <input id="show-listings" type="button" value="Show Listings" />
          <input id="hide-listings" type="button" value="Hide Listings" />
        </div>
        <div>
          <ol>
            {places.places.map((place) => (
              <option key={place.id}>
                {place.name}
              </option>
            ))}
          </ol>  
        </div>
      </div>
      <Map
        places={places}
      />
      </div>
    );
  }
}
 
export default App