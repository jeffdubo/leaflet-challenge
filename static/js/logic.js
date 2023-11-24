// Create array to store colors for markers and depth legend
colors = ['#00FF00', '#99CC00', '#FFFF99', '#FFCC00', '#FF9900', '#FF6600'];

// Perform API call to get USGS earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson").then(createMap);

function getColor(d) {
    if (d < 10) { return colors[0];
    } else if (d < 30) { return colors[1];
    } else if (d < 50) { return colors[2];
    } else if (d < 70) { return colors[3];
    } else if (d < 90) { return colors[4];
    } else { return colors[5];
    }
};

// Function to create markers
function createMarkers(quakes) {

    let quakeMarkers = [];
    for(let i=0; i<quakes.length; i++) {
        let quake = quakes[i];
        let lat = quake.geometry.coordinates[1];
        let lng = quake.geometry.coordinates[0];
        let depth = quake.geometry.coordinates[2];
        let mag = quake.properties.mag;
        let place = quake.properties.place;
        let time = quake.properties.time;

        quakeMarkers.push(
            L.circle([lat, lng], {
            fillOpacity: 0.75,
            color: 'black',
            fillColor: getColor(depth),
            radius: (mag * mag * 5000)
          }).bindPopup(`<h2>${place}</h2> <hr> <p>Magnitude: ${mag.toLocaleString()}, Depth: ${depth.toLocaleString()}</p><p>Time: ${time}</p>`)
        )
    };
    return quakeMarkers;
};

// Create markers and map

function createMap(response) {
    let quakes = response.features;
    let quakeLayer = L.layerGroup(createMarkers(quakes));
    
    // Create the tile layer that will be the background of our map.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
    
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: quakeLayer
    };

    let map = L.map('map', {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, quakeLayer]
    });


    // Create a legend to display information about our map.
    let legend = L.control({
        position: 'bottomright'
    });

    // When the layer control is added, insert a div with the class of "legend".
    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML = [
            '<h3>Depth</h3>',
            '<i style="background:' + colors[0] + '"></i><span><10</span><br>',
            '<i style="background:' + colors[1] + '"></i><span>10-30</span><br>',
            '<i style="background:' + colors[2] + '"></i><span>30-50</span><br>',
            '<i style="background:' + colors[3] + '"></i><span>50-70</span><br>',
            '<i style="background:' + colors[4] + '"></i><span>70-90</span><br>',
            '<i style="background:' + colors[5] + '"></i><span>>90</span><br>'
        ].join('');
        return div;
    };

    legend.addTo(map);

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}













    

