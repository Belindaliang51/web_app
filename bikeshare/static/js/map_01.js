// Creating map object
var map = L.map("map", {
    center: [43.6532, -79.3832],
    zoom: 12
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1Ijoic2hhcm9uOTYzIiwiYSI6ImNrYW4zb2c5cTB0eGYyeWxvbDd6Nm5zYW8ifQ.hpsECQj1iB5m_iz8AOGXhw"
  }).addTo(map);

//Create a link to collect data from API
var link = "https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information.geojson";

function getColor(d) {
    return d > 50  ? '#8B0000' :
           d > 40  ? '#FF4500' :
           d > 30  ? '#FF7F50' :
           d > 20 ? '#FFD700' :
           d > 10 ? '#FFFACD' :
                    '#98FB98';
};

var lat_long;
//Grab Json Data
d3.json(link, function(response){
    

    for (i=0;i<response.data.stations.length; i++) {
        lat_long = [response.data.stations[i].lat,response.data.stations[i].lon];
        //console.log(lat_long);
        //console.log(response.data.stations[0].capacity);
        //console.log(response.data.stations.length)
            
        //add circle markder on each location
        L.circle(lat_long, {
            radius: 5*response.data.stations[i].capacity,
            fillColor: getColor(response.data.stations[i].capacity),//"#ff7800",
            color: "#000",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup("<h1>Station name: " + response.data.stations[i].name + "</h1> <hr> <h3>Capacity: " + response.data.stations[i].capacity + "</h3>")
        .addTo(map);

    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'info legend');
            grades = [0, 10, 20, 30, 40, 50];
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(map);
});





// //Grab Json Data
//  d3.json(link, function(response) {
//      var geodata = response.data.stations;
//      var latlng= [geodata[0].lat, geodata[0].lon];
//      console.log(latlng);   
//      L.geoJson(geodata[0], {

        
//         style: function(feature){
//         return {
//             radius: 10000*feature.capacity,
//             fillColor: getColor(feature.capacity),//"#ff7800",
//             color: "#000",
//             weight: 0.5,
//             opacity: 1,
//             fillOpacity: 0.8
//             };
//         },

    
        
        
//         pointToLayer: function (feature, latlng) {
//             return L.circleMarker(latlng);
//         },

//         onEachFeature: function(feature, layer) {
//             //
//             layer.on({
//             // When a feature is clicked, it provides additional info
//             click: function(event) {
//                 layer.bindPopup("<h1>Station name: " + feature.name + "</h1> <hr> <h2> with capacity of " + feature.capacity + "</h2>");
//             }
//         });
//         }    
//     }).addTo(map);
    



//     var legend = L.control({position: 'bottomright'});

//     legend.onAdd = function () {
    
//         var div = L.DomUtil.create('div', 'info legend');
//             grades = [0, 10, 20, 30, 40, 50];
//             labels = [];
    
//         // loop through our density intervals and generate a label with a colored square for each interval
//         for (var i = 0; i < grades.length; i++) {
//             div.innerHTML +=
//                 '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//                 grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//         }
    
//         return div;
//     };
    
//     legend.addTo(map);






// })