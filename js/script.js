
//Init map view
require(["esri/config", "esri/Map", "esri/views/MapView"], function(esriConfig, Map, MapView) {
    esriConfig.apiKey = "AAPK2b9d83399ba1413f8c6cff164ec8fd85-8M2RQwo1ZczBqrcqlwhQQ6jugWmzIwcIdU5-j23AMr5hU5MmA3SJeHl-U7-jFcJ";

    const map = new Map({
      basemap: "arcgis-topographic" // Basemap layer service
    });

    const view = new MapView({
        map: map,
        center: [35, 32.8], // Longitude, latitude
        zoom: 13, // Zoom level
        container: "map" // Div element
      });

});

