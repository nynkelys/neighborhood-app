import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Search from './Search';
import Atlas from './Atlas';

// INSIDE COMPONENT, you can't say 'function functionName() { ... }', instead write like this:
// functionName = () => { ... }

class App extends Component {

  state = {
    allLocations: [],
    filteredLocations: []
  }

  componentDidMount() { // When component did mount, get venues
    this.getLocations()
  }

  getLocations = () => { // Get venues is GET request from Foursquare
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
          allLocations: response.data.response.groups[0].items, // Array of objects with venue data
          filteredLocations: response.data.response.groups[0].items
        }, this.renderMap()) // Callback function: when response is reached and saved, render map
      })
      .catch(error => {
        console.log("Error! " + error) // TO DO: INFORM USER ON PAGE
      })
  }

  search = (query) => {
    let locations = this.state.allLocations.filter((location) =>
    {
      return location.venue.name.includes(query) || location.venue.categories[0].name.includes(query)
    });
    this.setState({filteredLocations: locations})
  }

  renderMap = () => { // Function will only be invoked when we have venues
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAPWE9q9dv42yCFbSvSJBK8x8wgjrwAMrA&v=3&callback=initMap")
    window.initMap = this.initMap // Respectively refers to initMap function below and to initMap function in callback of script URL
  }

  // TO DO: Only initialize markers that adhere to search function (if search is empty, show all markers)
  initMap = () => { // Add function to load map after page loads/before user interacts with map
    const styles = []; // TO DO: Add styles
    const map = new window.google.maps.Map(document.getElementById('map'), { // Initialize
      center: {lat: 52.5058773, lng: 13.4674052}, // What location to center
      zoom: 15,
      styles: styles
    });
    const infowindow = new window.google.maps.InfoWindow(); // Create single infowindow

    this.state.allLocations.map(location => { // Loop over venues inside state
      const contentString =
        `<span class="restaurant-title">${location.venue.name}</span>
        <br>
        <span class="restaurant-type">${location.venue.categories[0].name}</span>
        <br>
        <br>
        ${location.venue.location.formattedAddress[0]},
        ${location.venue.location.formattedAddress[1]}
        <br>
        (${location.venue.location.distance} m away)`;
      const marker = new window.google.maps.Marker({ // Create marker for every location in venues array in state
        position: {lat: location.venue.location.lat, lng: location.venue.location.lng}, // Where marker should appear
        map: map, // The map it should appear on
        title: location.venue.name, // Appears when hovering over (optional)
        animation: window.google.maps.Animation.DROP
      });

      return(
        // Click on a marker
        marker.addListener('click', function() { // If you click a marker
          infowindow.setContent(contentString) // Change content with content of marker clicked
          infowindow.open(map, marker) // Open infowindow

          marker.setAnimation(window.google.maps.Animation.BOUNCE)
          setTimeout(function () {
            marker.setAnimation(null);
          }, 400)
        })
      )
    })
  }

  render() {
    return (
      <main className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to my hood</h1>
        </header>
        <div className="content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <Search
            search = {this.search}
          />
          <ul>
            {this.state.filteredLocations.map((location) => (
              <li key={location.venue.name}>
                {location.venue.name}, {location.venue.categories[0].name}
              </li>
            ))}
          </ul>
          <Atlas
            // Props
          />
          <div id="map">
          </div>
        </div>
        <div>
          <ul className="credits">
            <li>Free vector art via <a href="https://www.Vecteezy.com/">Vecteezy.</a></li>
          </ul>
        </div>
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
