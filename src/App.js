import React, { Component } from 'react';
import Map  from './components/mymap.js';
import './App.css';
import places from './data/places.json'
import escapeRegExp from 'escape-string-regexp';

class App extends Component {

  state = {
    finalPlaces: places.places,
    optionsBox: {},
    placesToMark: [],
    clickedMarker: []
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
    this.setState({placesToMark: results});
    this.forceUpdate();
  }

  //Function called when a location is clicked on. The location is added to the
  //places to be displayed and div style elements are changed up a bit.
  selectMarker = (props) => {
    this.setState({clickedMarker: props});
    this.forceUpdate();
  }

  //Called every time the end-button is clicked. forceUpdate is to ensure updated
  //list of markers is displayed.
  callChange = () => {
    this.forceUpdate();
  }

  //Added hamburger functionality
  toggleHam = () => {
    let menu = document.querySelector('.options-box');
    let burger = document.querySelector('.burger-icon');
    let fullThing = document.querySelector('.side-content');
    if(menu.style.visibility==="hidden") {
      menu.style.visibility="visible";
      burger.style.background = "#c9c6c6";
      burger.style.width = "320px";
      burger.style.height = "20px";
    }
    else {
      menu.style.visibility="hidden";
      fullThing.style.width="37px";
      burger.style.width="37px";
    }
	}

  render() {
    return (
      <div className="container">
      <div className="side-content">
      <div className="burger-icon">
					<a className="transition" tabIndex="1" onClick={this.toggleHam} onKeyPress={this.toggleHam}>
						<div className="hamburger"></div>
						<div className="hamburger"></div>
						<div className="hamburger"></div>
					</a>	
			</div>
      <div className="options-box">
        <h1>Bangalore Tourist Guide</h1>
        <div>
          <input id="list-places" tabIndex="2" placeholder="Filter places to your choice" type="text" onChange={this.search}/>
        </div>
        <p className="helper-text">Click on the places you want to see</p>
        <ul>
            {this.state.finalPlaces.map((place) => (
              <li className="options" key={place.id}
                role="listbox"
                tabIndex="0"
                onClick={() => this.selectMarker(place)}
                onKeyPress={() => this.selectMarker(place)}
                >
                <a>{place.name}</a>
              </li>
            ))}
        </ul>
      </div>
      <a href="#list-places" className="goback-toinput">Go back to the input field</a>
      </div>
      <Map
        places={this.state.finalPlaces}
        markersToShow={this.state.placesToMark}
        clickedMarker={this.state.clickedMarker}
      />
      </div>
    );
  }
}
 
export default App