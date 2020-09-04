var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4  //make the map
});

var colors = ["#FFBE33", "#FFA833", "#FF9333", "#FF5833", "#FF4933","#FF3333"]
function getColor(magnitude){ //seperate the magnitudes by color
  var mag = magnitude;
  if (mag <= 1) {
    return colors[0]
  }
  else if (mag <= 2) {
    return colors[1]
  }
  else if (mag <= 3) {
    return colors[2]
  }
  else if (mag <= 4) {
    return colors[3]
  }
  else if (mag <= 5) {
    return colors[4]
  }
  else {
    return colors[5]
  }
}
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYWRpdGlzaGFybWEiLCJhIjoiY2poM2t4N2s2MDNwbzJ3bzMyeHBzcjRkZiJ9.br_I_ut1iVuBPkdtTDNzPA").addTo(myMap);
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl, function(data) {  //grab the data from the wedsite
  var features = data["features"];

//Loop through the data and create popuops
for (var i = 0; i < features.length; i++) {
  var geometry = features[i]["geometry"]["coordinates"];
  var magnitude = features[i]["properties"]["mag"];
  var title = features[i]["properties"]["title"];
  var coords = {
    longitude: geometry["0"],
    latitude: geometry["1"]
  };
    var latlng = L.latLng(coords.latitude, coords.longitude);
    var circle = L.circle(latlng, {
      color: getColor(magnitude),
      fillOpacity: 0.50,
      radius: 100000
    }).addTo(myMap);

    L.circle(latlng)
      .bindPopup("<h1>" + title + "</h1> <hr> <h3>Magnitude: " + magnitude + "</h3><h3>Latitude: " + coords.latitude + "</h3><h3>Longitude: " + coords.longitude + "</h3>")
      .addTo(myMap);
}

//Set up legend
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "info legend");
  var limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
  var labelsColor = ["#FFBE33", "#FFA833", "#FF9333", "#FF5833", "#FF4933","#FF3333"];
  var labelsText = [];
  for (var i = 0; i < limits.length; i++){
    div.innerHTML +=
      '<i class="legend" style="background:' + labelsColor[i] + '; color:' + labelsColor[i] + ';">....</i>' + limits[i];
  }
  return div;
};

legend.addTo(myMap);

});
