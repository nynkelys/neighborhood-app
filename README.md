# My Neighborhood Map Project
Google/Udacity Front End Web Development Nanodegree: Project 8 (final project).

## Table of Contents

* [Project](#project)
* [Dependencies](#dependencies)
* [Important](#important)
* [Third party APIs](#thirdpartyapis)
* [Bugs](#bugs)
* [Contributing](#contributing)

## Project

To get started developing right away:

* install all project dependencies with `npm install`
* start the development server with `npm start`

## Dependencies 

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find the most recent version of the guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Important

The [`sw-precache-webpack-plugin`](https://github.com/goldhand/sw-precache-webpack-plugin) is integrated into production configuration, and it will take care of generating a service worker file that will automatically precache all of the local assets and keep them up to date as updates are deployed.
The service worker will use a [cache-first strategy](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network) for handling all requests for local assets, including the initial HTML, ensuring that the web app is reliably fast, even on a slow or unreliable network.

**Note:** The service worker is only enabled in the production environment, e.g. the output of `npm run build`. For more information, see the most recent version of the React guide ([here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md)).

## Third party APIs

The [Google Maps API](https://cloud.google.com/maps-platform/) was used to create the map and the [Foursquare API](https://foursquar
