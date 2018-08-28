import React from 'react';

function Atlas() {
    return (
     	<div
     		tabIndex="-1"
     		id="map"
     		role="application"
     		aria-label="Google Maps window"
     	>
     		<div>
	     		<div id="maploader">Loading Google Maps ... This might take a while! Please be patient.</div>
	            <div id="loader"></div>
            </div>
      	</div>
    )
}

export default Atlas;