import React, { Component } from 'react';
import '../App.css'

window.gm_authFailure = () => {
    alert("Authentication failure. Your key is invalid!");
}

class Map extends Component {

    state = {
        markers: [],
        myMap: {},
        style: {
            height: 665,
            left: 300
        },
        url: ""
    }

    //Makes a marker icon at any colour given.
    makeMarkerIcon = (color) => {
        var markerImage = new window.google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ color +
            '|40|_|%E2%80%A2',
            new window.google.maps.Size(21, 34),
            new window.google.maps.Point(0, 0),
            new window.google.maps.Point(10, 34),
            new window.google.maps.Size(21,34));
          return markerImage;
    }

    //Initializes map, it's markers and InfoWindows. Also calls Wikipedia API to fill up InfoWindow.
    initMap = () => {
        let places = this.props.places;
        let searchResult = '';
        let map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: 12.9716 , lng: 77.5946},
            zoom: 11
        });
        let infoWindow = new window.google.maps.InfoWindow({
            maxWidth: 200
        });
        let bounds = new window.google.maps.LatLngBounds();
        let markers = [];
        let defaultIcon = this.makeMarkerIcon('ff0000');
        let highlightedIcon = this.makeMarkerIcon('FFFF24');
        let clickedIcon = this.makeMarkerIcon('0091ff');
        for(let i=0; i<places.length; i++) {

            //New marker created here. Set to visible by default.
            let marker = new window.google.maps.Marker({ 
                map: map,
                position: places[i].location,
                title: places[i].name,
                animation: window.google.maps.Animation.DROP,
                icon: defaultIcon,
                id: places[i].id,
                visible: true
            });
            markers.push(marker);

            //Here, infoWindow is generated. Wikipedia API is used as third-party API.
            marker.addListener('click', function() {
                if (infoWindow.marker !== marker) {
                    infoWindow.marker = marker;
                    fetch("https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&exintro&origin=*&search="+places[i].searchString+"&format=json", {
                        method: 'GET',
                        headers: new Headers({
                            'Api-User-Agent': 'Example/1.0'
                        })
                    }).then(function(response) {
                        if(response.ok) {
                            return response.json();
                        }
                    }).then(function(res) {
                        res[2].forEach(element => {
                            searchResult = element;
                            // console.log(searchResult);
                            infoWindow.setContent("<div>"+searchResult+"</div><br/><div>Source:Wikipedia</div>");
                        });
                    }).catch(err => {
                        infoWindow.setContent("<div style='text-align:center;'>There was a problem with the Wiki App :(<br />Please try again later.");
                    });
                    infoWindow.open(map, marker);
                    infoWindow.addListener('closeclick',function(){
                      infoWindow.setMarker = null;
                    });
                }
                this.setIcon(clickedIcon);
            });
            marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
        this.setState({ myMap: map, markers: markers });

    }

    //Runs map initialization code as soon as component mounts.
    componentDidMount() {
        window.initMap = this.initMap;
        loadGoogleMap('https://maps.googleapis.com/maps/api/js?key=AIzaSyDJIkg-D6_7_ApII3saQM5_KPv2wSR2lks&v=3&callback=initMap');
    }

    //Function to show only filtered markers.
    updateMarkers = () => {
        for(let i=0; i<this.state.markers.length; i++) {
            for(let j=0; j<this.props.markersToShow.length; j++) {
                let marker = this.state.markers[i];
                let selected = this.props.markersToShow[j];
                if(marker.title === selected.name) {
                    marker.setMap(this.state.myMap);
                    break;
                }
                else {
                    marker.setMap(null);
                }
            }
        }
    }

    //Call function to update markers every time component is updated, ie new set of components is obtained.
    componentDidUpdate() {
        this.updateMarkers();
        if(this.props.clickedMarker.length !== 0) {
            this.state.markers.forEach(mapMarker => {
                if(mapMarker.title === this.props.clickedMarker.name) {
                    new window.google.maps.event.trigger(mapMarker, 'click');
                }
                else {
                    new window.google.maps.event.trigger(mapMarker, 'mouseout');
                }
            })
        }
    }

    render() {
        return (
            <div id='map'></div>       
        )
    }    
}

//Basic function to load map asynchronously.
function loadGoogleMap(src) {
    let body = document.querySelector('body');
    let script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function() {
        alert("Sorry! Map can't load at the moment.");
    }
    body.appendChild(script);
}
export default Map