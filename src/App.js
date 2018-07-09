import React, { Component } from 'react';
import Map  from './components/mymap.js';
import './App.css';
import places from './data/places.json'
import escapeRegExp from 'escape-string-regexp';
// import sortBy from 'sort-by';

class App extends Component {

  state = {
    finalPlaces: places.places,
    optionsBox: {},
    placesToMark: []
  }

  componentDidMount() {
    let divInHand = document.querySelectorAll('.options');
    this.setState({optionsBox: divInHand});
  }

  search = (input) => {
    let query = input.target.value;
    const match = new RegExp(escapeRegExp(query), 'i');
    let results =  places.places.filter((place) => match.test(place.name));
    this.setState({finalPlaces: results});
  }

  selectMarker = (props) => {
    let finalDiv = this.state.optionsBox;
    let elementToColor = {};
    finalDiv.forEach(element => {
      if(element.innerText === props.name) {
        elementToColor = element;
      }
    });
    elementToColor.style.background = '#0e1553';
    this.state.placesToMark.push(props);
    console.log(this.state.placesToMark);
  }

  render() {
    return (
      <div className="container">
      <div className="options-box">
        <h1>Bangalore Tourist Guide</h1>
        <div>
          <input id="show-listings" type="text" onChange={this.search}/>
        </div>
        <ul>
            {this.state.finalPlaces.map((place) => (
              <li className="options" id={place.id} key={place.id} onClick={() => this.selectMarker(place)}>
                <a>{place.name}</a>
              </li>
            ))}
        </ul>
      </div>
      <Map
        places={places}
      />
      </div>
    );
  }
}
 
export default App