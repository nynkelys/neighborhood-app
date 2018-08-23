import React, { Component } from 'react';
import logo from './icon.jpg';
import icon from './icon.svg';
import './App.css';
import Search from './Search';
import Atlas from './Atlas';

// INSIDE COMPONENT, you can't say 'function functionName() { ... }', instead write like this:
// functionName = () => { ... }

const API = 'https://api.foursquare.com/v2/venues/explore?'
const DEFAULT_QUERY = 'client_id=ORY3CXCT1M3CBRNVOZDJMAN250AMDHL5H24RWLMO4NYQOYVL&client_secret=WU5OUOY1WL2O4JFDWKHSKDPF3OC2VXCQTLBEPNEN511AFPWD&v=20180323&limit=20&ll=52.5058773,13.4674052&query=ice+cream+shop'

class App extends Component {

  state = {
    allLocations: [],
    filteredLocations: [],
    markers: [],
    map: {},
    isLoading: false,
    error: null
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(API + DEFAULT_QUERY)
      .then(response => {
        if (response.ok) {
          return response.json();
        } if (response.status === 200) {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '. Something about this request is using deprecated functionality, or the response format may be about to change.');
        } if (response.status === 400) {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '. Seems like you made a bad request. Please check your request query string and the request body.');
        } if (response.status === 401) {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '. This is an authorization issue: your OAuth token was invalid.');
        } if (response.status === 403) {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '. You are not allowed to access this page.');
        } if (response.status === 404) {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '. Seems like what you were looking for is not here.');
        } if (response.status === 405) {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '. You have attempted to use a POST with a GET-only endpoint, or vice-versa.');
        } if (response.status === 409) {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '. The request could not be completed as it is. Use the information included in the response to modify the request and retry.');
        } if (response.status === 429) {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '. You have made too many requests. You fanatic!');
        } if (response.status === 500) {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '. This points at an internal server error.');
        } else {
          throw Error('Oh no! Something went wrong loading the required data from Foursquare. The error code is ' + response.status + '.')
        }
      })
      .then(response =>
        this.setState({
          allLocations: response.response.groups[0].items, // Array of objects with venue data
          filteredLocations: response.response.groups[0].items,
          isLoading: false
        }, this.renderMap)
      )
      .catch(error =>
        this.setState({
          error, isLoading: false
        })
      );
  }

  search = (query) => {
    this.state.markers.map((marker) => { // TO DO: IMPROVE FILTER MARKERS (one step behind)
      marker.setMap(null); // Delete previous markers
    })

    const locationsList = this.state.allLocations.filter((location) => { // Filter list
        const lowercase = location.venue.name.toLowerCase()
        return lowercase.includes(query) || location.venue.name.includes(query)
    });

    this.setState({filteredLocations: locationsList}, this.initMarkersAndInfowindow)

  }

  renderMap = () => { // Function will only be invoked when we have venues
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAPWE9q9dv42yCFbSvSJBK8x8wgjrwAMrA&v=3&callback=initMap")
    window.initMap = this.initMap // Respectively refers to initMap function below and to initMap function in callback of script URL
  }

  initMarkersAndInfowindow = () => {
    const infowindow = new window.google.maps.InfoWindow(); // Create single infowindow
    const shownMarkers =[];
    const map = this.state.map;

    const myClickFunctionsArray = this.state.filteredLocations.map(location => { // Loop over venues inside state
      const contentString =
        `<span class="restaurant-title">${location.venue.name}</span>
        <br>
        <br>
        ${location.venue.location.formattedAddress[0]},
        ${location.venue.location.formattedAddress[1]}
        <br>
        (${location.venue.location.distance} m away)`;

      const marker = new window.google.maps.Marker({ // Create marker for every location in venues array in state
        position: {lat: location.venue.location.lat, lng: location.venue.location.lng}, // Where marker should appear
        map: this.state.map, // The map it should appear on
        title: location.venue.name, // Appears when hovering over (optional)
        animation: window.google.maps.Animation.DROP,
        icon: icon
      });

      shownMarkers.push(marker);

      this.setState({markers: shownMarkers})

      const myClickFunction = () => { // If you click a marker
          infowindow.setContent(contentString) // Change content with content of marker clicked
          infowindow.open(map, marker) // Open infowindow

          marker.setAnimation(window.google.maps.Animation.BOUNCE)
          setTimeout(function () {
            marker.setAnimation(null);
          }, 400)

          window.location.assign('http://localhost:3000#map')

        }

        marker.addListener('click', myClickFunction)


      return myClickFunction
    })

  this.setState({myClickFunctionsArray: myClickFunctionsArray})
  }

  initMap = () => { // Add function to load map after page loads/before user interacts with map
    const styles = [];
    const map = new window.google.maps.Map(document.getElementById('map'), { // Initialize
      center: {lat: 52.515816, lng: 13.454293}, // What location to center
      zoom: 14,
      styles: styles
    });
    this.setState({map: map})
  this.initMarkersAndInfowindow();
  }

  showInfo = (index) => {
    this.state.myClickFunctionsArray[index]();
  }

  render() {
    const intro = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    const { isLoading, error } = this.state;

    if (error) {
      return <p className="error">{error.message}</p>
    }

    if (isLoading) {
      return <p id="loading">Loading ...</p>;
    }

    return (
      <main className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Ice cream in F'hain</h1>

        </header>
        <div className="content">
          <p className="intro">{intro}</p>
          <Search
            search = {this.search}
          />
          <ul>
            {this.state.filteredLocations.map((location, index) => (
              <li
                key={location.venue.name}
                id="listItem"
                onClick={() => this.showInfo(index)}>
                  {location.venue.name}
              </li>
            ))}
          </ul>
          <Atlas
            // Props
          />
        </div>
        <div>
          <ul id="credits">
            <li className="credit"><a href='https://www.freepik.com/free-vector/happy-people-with-ice-cream_2631347.htm'>Logo's designed by Freepik.</a></li>
            <li className="credit"><a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY.</a></li>
            <li className="credit"><a href="https://foursquare.com/" title="Foursquare">Powered by Foursquare.</a></li>
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
