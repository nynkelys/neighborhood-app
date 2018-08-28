import React, { Component } from 'react';

class Atlas extends Component {
	state = {
    	mapLoading: true
    }

    googleError = () => {
    	this.setState({ mapLoading: false })
    }

    render() {

    	const { mapLoading } = this.state;

	    return (
	     	<div
	     		tabIndex="-1"
	     		id="map"
	     		role="application"
	     		aria-label="Google Maps window"
	     	>

	     	{
	     		mapLoading ?
	     		<div>
		     		<div id="maploader">Loading Google Maps ... This might take a while! Please be patient.</div>
		            <div id="loader"></div>
	            </div>
	            :
	     		<div>
	     			<div id="maperror">Oh no! There was an error loading Google Maps. Please try again later.</div>
	     		</div>
	        }

	      	</div>
	    )
	}
}

export default Atlas;