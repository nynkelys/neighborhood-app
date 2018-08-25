import React, { Component } from 'react';

class Atlas extends Component {

  render() { // Turn into stateless functional component if it remains stateless

    return (
     	<div
     		tabIndex="-1"
     		id="map"
     		role="application"
     		aria-label="Google Maps window"
     	>
      	</div>
    )
  }
}

export default Atlas;