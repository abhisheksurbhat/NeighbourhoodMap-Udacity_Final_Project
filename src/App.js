import React, { Component } from 'react';
import Map  from './components/mymap.js';
import './App.css';
import places from './data/places.json'
import escapeRegExp from 'escape-string-regexp';

class App extends Component {

  state = {
    finalPlaces: places.places,
    optionsBox: {},
    placesToMark: []
  }

  //Fetch all the places at initialization.
  componentDidMount() {
    let divInHand = document.querySelectorAll('.options');
    this.setState({optionsBox: divInHand});
  }

  //Search for query to filter out places.
  search = (input) => {
    let query = input.target.value;
    const match = new RegExp(escapeRegExp(query), 'i');
    let results =  places.places.filter((place) => match.test(place.name));
    this.setState({finalPlaces: results});
  }

  //Function called when a location is clicked on. The location is added to the
  //places to be displayed and div style elements are changed up a bit.
  selectMarker = (props) => {
    let finalDiv = this.state.optionsBox;
    let elementToColor = {};
    if(!props.marked) {
      props.marked = true; 
      finalDiv.forEach(element => {
        if(element.innerText === props.name) {
          elementToColor = element;
        }
      });
      elementToColor.style.background = '#0e1553';
      elementToColor.style.color = '#ffffff';
      this.state.placesToMark.push(props);
    }
    else {
      props.marked = false;
      finalDiv.forEach(element => {
        if(element.innerText === props.name) {
          elementToColor = element;
        }
      });
      elementToColor.style.background = '#ffffff';
      elementToColor.style.color = '#000000';
      this.state.placesToMark.pop(props);
    }
  }

  //Called every time the end-button is clicked. forceUpdate is to ensure updated
  //list of markers is displayed.
  callChange = () => {
    this.forceUpdate();
  }

  render() {
    return (
      <div className="container">
      <div className="options-box">
        <h1>Bangalore Tourist Guide</h1>
        <div>
          <input id="list-places" tabIndex="1" placeholder="Filter places to your choice" type="text" onChange={this.search}/>
        </div>
        <p className="helper-text">Click on the places you want to see</p>
        <ul>
            {this.state.finalPlaces.map((place) => (
              <li className="options" key={place.id} tabIndex="0" onClick={() => this.selectMarker(place)} onKeyPress={() => this.selectMarker(place)}>
                <a>{place.name}</a>
              </li>
            ))}
        </ul>
        <button className="end-button" onClick={this.callChange}>Click to show selected locations</button>
      </div>
      <Map tabIndex="-1"
        places={this.state.finalPlaces}
        markersToShow={this.state.placesToMark}
      />
      </div>
    );
  }
}
 
export default App