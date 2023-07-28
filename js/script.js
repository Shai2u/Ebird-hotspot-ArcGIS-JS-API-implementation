
// Define variables
var API_KEY = "AAPK2b9d83399ba1413f8c6cff164ec8fd85-8M2RQwo1ZczBqrcqlwhQQ6jugWmzIwcIdU5-j23AMr5hU5MmA3SJeHl-U7-jFcJ"
var centerPoint = [35, 32.8]

// Hide sldier element
document.getElementById("overlay").style.display = "none"

//Init map view
require(["esri/config", "esri/Map", "esri/views/MapView", "esri/widgets/Locate"], 
(esriConfig, Map, MapView, Locate) => {

    esriConfig.apiKey = API_KEY;

    const map = new Map({
        basemap: "arcgis-topographic" // Basemap layer service
    });

    const view = new MapView({
        map: map,
        center: centerPoint, // Longitude, latitude
        zoom: 13, // Zoom level
        container: "map" // Div element
    });

    // Define location variable
    const locateBtn = new Locate({
        view: view
    });

    // Add the locate widget to the top left corner of the view
    view.ui.add(locateBtn, {
        position: "top-left"
    });

    locateBtn.on("locate", ({ position }) => {
        doSomething(position)
        
      })
});

function doSomething(location)
{
    const { longitude, latitude } = location.coords;
        console.log(`lat: ${latitude.toFixed(4)}, long: ${longitude.toFixed(4)}`);

}
