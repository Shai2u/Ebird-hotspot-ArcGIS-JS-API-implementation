
// Define variables
var API_KEY = "AAPK2b9d83399ba1413f8c6cff164ec8fd85-8M2RQwo1ZczBqrcqlwhQQ6jugWmzIwcIdU5-j23AMr5hU5MmA3SJeHl-U7-jFcJ"
var centerPoint = [35, 32.8]
var lngLat = [0, 0]

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
require(["esri/config", "esri/Map", "esri/views/MapView", "esri/widgets/Locate", "esri/geometry/Point", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/geometry/geometryEngine",  "esri/layers/GeoJSONLayer"],
    (esriConfig, Map, MapView, Locate, Point, GraphicsLayer, Graphic, geometryEngine, GeoJSONLayer) => {

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
            lngLat = [position.coords.longitude, position.coords.latitude]
            document.getElementById('submit').addEventListener('click', function (e) {
                get_hotspots()
            })

        })

        // Add buffer layer
        const bufferLayer = new GraphicsLayer();
        map.add(bufferLayer)

        function show_radius_on_map(radius_value, location)
        {
            // Set the label to the radius
            document.getElementById('radius_value').textContent = `${radius_value} [m]`;
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

        function get_hotspots() {
            var radius = document.getElementById('slider').value/1000
            var url = `https://api.ebird.org/v2/ref/hotspot/geo?lat=${lngLat[1]}&lng=${lngLat[0]}&back=30&dist=${radius}&fmt=json`;
            console.log(url)
        
        
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // Perform further actions with the response data
        
                    var geojson = generate_geojson_hot_spot_sightings(data);
        

                    // create a new blob from geojson featurecollection
                    const blob = new Blob([JSON.stringify(geojson)], {
                        type: "application/json"
                    });
                    
                    // URL reference to the blob
                    const url = URL.createObjectURL(blob);
                    // create new geojson layer using the blob url
     
                    const geojsonLayer = new GeoJSONLayer({
                        url: url,
                        renderer: {
                          type: "simple",
                          symbol: {
                            type: "simple-marker",
                            color: [255, 0, 0],
                            size: "8px",
                            outline: {
                              color: [255, 255, 255],
                              width: 1
                            }
                          }
                        }
                      });
                    // Add the GeoJSONLayer to the map
                    map.add(geojsonLayer);
        

                })
                .catch(error => {
                    console.log('Error:', error);
                });
        
        }

    });


    function generate_geojson_hot_spot_sightings(inputList) {
    


        const features = inputList.map(item => {
            const { locName, lat, lng, ...properties } = item;
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                properties: {
                    locName,
                    ...properties
                }
            };
        });
    
        const geojson = {
            type: "FeatureCollection",
            features
        };
    
        console.log(JSON.stringify(geojson, null, 2));
    
        return geojson;
    
    
    
    
    } 