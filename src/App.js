import React, { Component } from 'react';
import logo from './icon.jpg';
import icon from './icon.svg';
import house from './house.png'
import './App.css';
import Search from './Search';
import Atlas from './Atlas';
import DocumentTitle from 'react-document-title';
import styler from './styles.json';

// INSIDE COMPONENT, you can't say 'function functionName() { ... }', instead write like this:
// functionName = () => { ... }

const API = 'https://api.foursquare.com/v2/venues/explore?'
const DEFAULT_QUERY = 'client_id=ORY3CXCT1M3CBRNVOZDJMAN250AMDHL5H24RWLMO4NYQOYVL&client_secret=WU5OUOY1WL2O4JFDWKHSKDPF3OC2VXCQTLBEPNEN511AFPWD&v=20180323&limit=10&ll=52.5058773,13.4674052&query=ice+cream+shop'

class App extends Component {

  state = {
    allLocations: [],
    filteredLocations: [],
    markers: [],
    houseMarker: {},
    map: {},
    locDetails: [],
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

    const { markers, allLocations, houseMarker } = this.state;

    markers.map((marker) => { // TO DO: IMPROVE FILTER MARKERS (one step behind)
      marker.setMap(null); // Delete previous markers
    })

    houseMarker.setMap(null);

    const locationsList = allLocations.filter((location) => { // Filter list
        const lowercase = location.venue.name.toLowerCase()
        return lowercase.includes(query) || location.venue.name.includes(query)
    });

    this.setState({filteredLocations: locationsList}, this.initMarkersAndInfowindow)

  }

  renderMap = () => { // Function will only be invoked when we have venues
    loadscript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAPWE9q9dv42yCFbSvSJBK8x8wgjrwAMrA&v=3&callback=initMap")
      .then(() =>
        {console.log('loaded');
        return true;})
      .catch(err => {this.googleError();})
    window.initMap = this.initMap // Respectively refers to initMap function below and to initMap function in callback of script URL
  }

  googleError = () => {
    const loadingMsg = window.document.getElementById("maploader")
    const spinner = window.document.getElementById("loader")

    loadingMsg.innerHTML = loadingMsg.innerHTML.replace("Loading Google Maps ... This might take a while! Please be patient.", "There was an error loading Google Maps. Please try again later.")
    spinner.parentNode.removeChild(spinner)
  }

  initMarkersAndInfowindow = () => {
    const { map, filteredLocations } = this.state;
    const infowindow = new window.google.maps.InfoWindow(); // Create single infowindow
    const shownMarkers =[];

    const myClickFunctionsArray = filteredLocations.map(location => { // Loop over venues inside state
      const contentString =
        `<em class="restaurant-title">${location.venue.name}</em>
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

      const houseMarker = new window.google.maps.Marker({
        position: {lat: 52.515816, lng: 13.454293}, // Where marker should appear
        map: map, // The map it should appear on
        icon: house
      })

      this.setState({houseMarker: houseMarker})

      return myClickFunction
    })

  this.setState({myClickFunctionsArray: myClickFunctionsArray})
  }

  initMap = () => { // Add function to load map after page loads/before user interacts with map
    const styles = styler;
    const map = new window.google.maps.Map(document.getElementById('map'), { // Initialize
      center: {lat: 52.515816, lng: 13.454293}, // What location to center
      zoom: 14,
      styles: styles
    });
    this.setState({map: map})
  this.initMarkersAndInfowindow();
  }

  showInfo = (index) => {
    const { myClickFunctionsArray } = this.state;

    myClickFunctionsArray[index]();
  }

  showInfoOnKey = (event, index) => {
    const { myClickFunctionsArray } = this.state;
    const listItems = document.getElementsByClassName("listItem");

    if (event.keyCode === 13) {
      myClickFunctionsArray[index]();
      listItems[index].focus()
    }
  }

  render() {

    const intro = 'On this page, you will find the ten ice cream shops that are closest to my house in Friedrichshain, one of the (coolest) neighborhoods in Germany\'s capital Berlin. You can go through the list of shops and click on one of the items to receive more information about that specific venue. Alternatively, you can click on a lollipop on the map itself. Let me know if you want to have some ice cream with me if you are ever around!'
    const introScreenreader = 'On this page, you will find the ten ice cream shops that are closest to my house in Friedrichshain, one of the (coolest) neighborhoods in Germany\'s capital Berlin. Go through the list of shops and select one of the items to receive more information about that specific venue. Let me know if you want to have some ice cream with me if you are ever around!'
    const { isLoading, error, filteredLocations } = this.state;
    const { search, showInfo, showInfoOnKey } = this;

    if (error) {
      return <p className="error">{ error.message }</p>
    }

    if (isLoading) {
      return <p id="loading">Loading ...</p>;
    }

    return (
      <DocumentTitle title="Ice cream: Friedrichshain">
        <main
          role="main"
          className="App"
        >
          <header
            role="banner"
            className="App-header"
          >
            <img
              src={ logo }
              className="App-logo"
              alt="logo"
            />
            <h1 id="App-title">Time for ice cream</h1>

          </header>
          <section className="content">
            <p
              className="screenreader"
              tabIndex="0"
            >{ introScreenreader }</p>
            <p className="intro">{ intro }</p>
            <Search
              search = { search }
            />
            <section id="locations">
              <ul id="ulList">
                {filteredLocations.map((location, index) => (
                  <li
                    role="button"
                    tabIndex="0"
                    key={ location.venue.name }
                    className="listItem"
                    onClick={() => showInfo(index)}
                    onKeyDown={(event) => showInfoOnKey(event, index)}>
                      { location.venue.name }
                  </li>
                ))}
              </ul>
                <Atlas/>
            </section>
          </section>
          <footer>
            <ul id="credits">
              <li
                className="credit"
                role="contentinfo"
              ><a href='https://www.freepik.com/free-vector/happy-people-with-ice-cream_2631347.htm'>Logo's designed by Freepik.</a></li>
              <li
                className="credit"
                role="contentinfo"
              ><a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY.</a></li>
              <li
                className="credit"
                role="contentinfo"
              ><a href="https://foursquare.com/" title="Foursquare">Powered by Foursquare.</a></li>
            </ul>
          </footer>
        </main>
      </DocumentTitle>
    );
  }
}

// Outside of our component we define a function that creates the required Google Maps script tag manually:
var loadscript = function(url) {
  return new Promise((onSuccess, onError) => {
    const script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.onload = () => {
      onSuccess();
    };
    script.onerror = () => {
      onError();
    };

    const index = window.document.getElementsByTagName("script")[0] // First script tag
    index.parentNode.insertBefore(script, index) // newNode, referenceNode
  })
}

export default App;