import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

// INSIDE COMPONENT, you can't say 'function functionName() { ... }', instead write like this:
// functionName = () => { ... }

class App extends Component {

  state = {
    venues: []
  }

  componentDidMount() { // When component did mount, get venues
    this.getVenues()
  }

  getVenues = () => { // Get venues is GET request from Foursquare
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "ORY3CXCT1M3CBRNVOZDJMAN250AMDHL5H24RWLMO4NYQOYVL",
      client_secret: "WU5OUOY1WL2O4JFDWKHSKDPF3OC2VXCQTLBEPNEN511AFPWD",
      query: "food",
      ll: "52.5058773, 13.4674052",
      v: "20180323",
      limit: 10
    }

    axios.get(endPoint + new URLSearchParams(parameters)) // Axios is comparable to fetch API
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items // Array of objects with venue data
        }, this.renderMap()) // Callback function: when response is reached and saved, render map
      })
      .catch(error => {
        console.log("Error! " + error)
      })
    }

  renderMap = () => { // Function will only be invoked when we have venues
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAPWE9q9dv42yCFbSvSJBK8x8wgjrwAMrA&v=3&callback=initMap")
    window.initMap = this.initMap // Respectively refers to initMap function below and to initMap function in callback of script URL
  }

  initMap = () => { // Add function to load map after page loads/before user interacts with map
    const map = new window.google.maps.Map(document.getElementById('map'), { // Initialize
      center: {lat: 52.5058773, lng: 13.4674052}, // What location to center
      zoom: 15
   });

    const infowindow = new window.google.maps.InfoWindow(); // Create single infowindow

    this.state.venues.map(myVenue => { // Loop over venues inside state
      const contentString =
        `${myVenue.venue.name}
        <br>
        ${myVenue.venue.categories[0].name}
        <br>
        <br>
        ${myVenue.venue.location.formattedAddress[0]},
        ${myVenue.venue.location.formattedAddress[1]}
        <br>
        (${myVenue.venue.location.distance} m away)`;
      const marker = new window.google.maps.Marker({ // Create marker
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng}, // Where marker should appear
        map: map, // The map it should appear on
        title: myVenue.venue.name // Appears when hovering over (optional)
      });

      // Click on a marker
      marker.addListener('click', function() { // Link marker and infowindow
        infowindow.setContent(contentString) // Change content
        infowindow.open(map, marker);
      });
    })
  }

  render() {
    return (
      <main className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to my hood</h1>
        </header>
        <p className="content">
          <div id="map"></div>
        </p>
        <ul className="credits">
          <li>Free vector art via <a target="_blank" href="https://www.Vecteezy.com/">Vecteezy.</a></li>
          <li>Walkthrough videos via <a href="https://www.youtube.com/playlist?list=PLgOB68PvvmWCGNn8UMTpcfQEiITzxEEA1">Yahya Elharony.</a></li>
        </ul>
      </main>
    );
  }
}

// Outside of our component we define a function that creates the required Google Maps script tag manually:
function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0] // First script tag
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index) // newNode, referenceNode
}

export default App;
