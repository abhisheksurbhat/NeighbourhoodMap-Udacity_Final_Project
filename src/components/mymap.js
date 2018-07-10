import React, { Component } from 'react';
import '../App.css'

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
                            console.log(searchResult);
                            infoWindow.setContent("<div>"+searchResult+"</div>");
                        });
                    })
                    
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

    componentDidMount() {
        this.setState({url: "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&exintro&origin=*&search="});
        window.initMap = this.initMap;
        loadGoogleMap('https://maps.googleapis.com/maps/api/js?key=AIzaSyDJIkg-D6_7_ApII3saQM5_KPv2wSR2lks&v=3&callback=initMap');
    }

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

    componentDidUpdate() {
        this.updateMarkers();
    }

    render() {
        return (
            <div id='map'></div>       
        )
    }
    
}
function loadGoogleMap(src) {
    var body = document.querySelector('body');
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    body.appendChild(script);
}
export default Map