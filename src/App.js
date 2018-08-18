import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentDidMount() {
    this.renderMap()
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAPWE9q9dv42yCFbSvSJBK8x8wgjrwAMrA&v=3&callback=initMap")
    window.initMap = this.initMap // Refers to initMap function below
  }

  // Inside component, you can't say 'function functionName', instead write like this:
  initMap = () => { // Add function to load map after page loads/before user interacts with map
    // Constructor creates a new map instance - only center and zoom are required. First specification is where in page to load map (the map div), second is what part of world to show. Zoom can go up to 21.
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13
   });
  }

  render() {
    return (
      <main className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Berlin through Nynke's eyes</h1>
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
