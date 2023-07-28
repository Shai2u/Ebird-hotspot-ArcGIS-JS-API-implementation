
// Define variables
var API_KEY = "AAPK2b9d83399ba1413f8c6cff164ec8fd85-8M2RQwo1ZczBqrcqlwhQQ6jugWmzIwcIdU5-j23AMr5hU5MmA3SJeHl-U7-jFcJ"
var centerPoint = [35, 32.8]

// Hide sldier element
document.getElementById("overlay").style.display = "none"

const polySym = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [140, 0, 0, 0.25],
    outline: {
      color: [0, 0, 0, 0.5],
      width: 2
    }
  };

//Init map view
require(["esri/config", "esri/Map", "esri/views/MapView", "esri/widgets/Locate", "esri/geometry/Point", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/geometry/geometryEngine"],
    (esriConfig, Map, MapView, Locate, Point, GraphicsLayer, Graphic, geometryEngine) => {

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
            document.getElementById("overlay").style.display = "block"
            document.getElementById('slider')
            .addEventListener('input', function (e) {
                show_radius_on_map(e.target.value, position)
            });

        })

        // Add buffer layer
        const bufferLayer = new GraphicsLayer();
        map.add(bufferLayer)

        function show_radius_on_map(radius_value, location)
        {
            const { longitude, latitude } = location.coords;
            //console.log(`lat: ${latitude.toFixed(4)}, long: ${longitude.toFixed(4)}`);
            var point = new Point({
                x: longitude,
                y: latitude,
              });

            const buffer = geometryEngine.geodesicBuffer(point, radius_value, "meters");
            if(bufferLayer.graphics.length === 0){
                bufferLayer.add(
                  new Graphic({
                    geometry: buffer,
                    symbol: polySym
                  })
                );
              } else {
                const graphic = bufferLayer.graphics.getItemAt(0);
                graphic.geometry = buffer;
              }

        }

    });

