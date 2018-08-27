import React from 'react';
import loading from './loading.svg';

function Atlas() {
    return (
     	<div
     		tabIndex="-1"
     		id="map"
     		role="application"
     		aria-label="Google Maps window"
     	>
     		<div id="loader">
            </div>
      	</div>
    )
}

export default Atlas;