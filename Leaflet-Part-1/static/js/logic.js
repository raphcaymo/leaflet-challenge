// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function markerSize(magnitude) {
    return magnitude * 35000;
  };


function chooseColor(depth){
    if (depth < 10) return "lightgreen";
    else if (depth < 30) return "#9ACD32";
    else if (depth < 50) return "green";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "Red";
    else return "#8B0000"; //dark red color
  }


  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
  
      // Point to layer used to alter markers
      pointToLayer: function(feature, latlng) {
  
        // Determine the style of markers based on properties
        var markers = {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.5,
          color: "black",
          stroke: true,
          weight: 0.3
        }
        return L.circle(latlng,markers);
      }
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }



function createMap(earthquakes) {

  // Create tile layer
  var grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,

  });

  // Create our map, giving it the grayscale map and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [grayscale, earthquakes]
  });

// Create map legend to provide context for map data
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info-legend');
    var grades = [10, 30, 50, 70, 90];
    var labels = [];
    var legendInfo = "<h4>Magnitude Level</h4>";

    div.innerHTML = legendInfo

    // go through each magnitude item to label and color the legend
    // push to labels array as list item
    for (var i = 0; i < grades.length; i++) {
          labels.push('<ul><span style="color:' + chooseColor(grades[i] + 1) + '"> ■ </span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</ul>');
        }

      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join(" ") + "</ul>";
    
    return div;
  };


  legend.addTo(myMap);
}

