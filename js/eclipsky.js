var viewModel;
var markers = []; // the array of markers displayed on the map
var map;

function ViewModel() {

    var self = this;

    // array for weather station objects
    self.stations = ko.observableArray([]);

    // view model operations

    // add a station
    self.addStation = function(id, lat, lng, name, state, report, icon, timestamp, cloudCode) {
        // stations added are visible on the map by default, but not highlighted.
        var visible = true;
        var highlight = false;
        self.stations.push(new Station(id, lat, lng, name, state, report, icon, timestamp, cloudCode, visible, highlight));
    }

    // clear station list
    self.clearStations = function() {
        self.stations.removeAll();
    }

}

function getJSON(weatherQuery) {
    const API_STR1 = "&client_id=";
    const API_STR2 = "&client_secret=";
    const CLIENT_ID = "nrgwd5Mn9Jzrpi3mtw6mU";
    const CLIENT_KEY = "AwL583BS29G2MJGnxAlCN2PSCBW7OHNOI7YsUyVZ";
    const URL_PATH = "http://api.aerisapi.com/observations/";
    const jsonReturnSpec = "&fields=id,place.name,place.state,loc.long,loc.lat,ob.weather,ob.icon,ob.timestamp,ob.cloudsCoded";

    var weatherUrl =  URL_PATH + weatherQuery + jsonReturnSpec + API_STR1 + CLIENT_ID + API_STR2 + CLIENT_KEY ;
    $.ajax({
        url: weatherUrl,
        dataType: "jsonp",
        success: function(jsonResponse) {
           if (jsonResponse.success == true) {
                var response = jsonResponse.response;
                viewModel.clearStations();
                hideMarkers(markers);
                response.forEach(function(entry) {
                    viewModel.addStation(entry.id, entry.loc.lat, entry.loc.long, entry.place.name, entry.place.state, entry.ob.weather, entry.ob.icon, entry.ob.timestamp, entry.ob.cloudsCoded)
                });
                createMarkersForStations();
                zoomMapToMarkerBounds();
             }
            else {
                 alert('Unable to retrieve weather data. ' + jsonResponse.error.description);
            }
        } // end of success function
    }); // end of ajax params
} // end of getJSON function


// getWeather is called by a user's click on the map to request weather reports
// from a specific area.

function getWeather(event) {
    var weatherQuery = "closest?p="+ Math.round(event.latLng.lat()*100)/100 + "," + Math.round(event.latLng.lng()*100)/100 + "&radius=100mi&limit=5";
    getJSON(weatherQuery);
}

function googleAPIError() {
    // Report error in connecting to map data source.
    // If the network is down, we won't be able to load jQuery or Knockout scripts from CDN,
    // so use DOM method.
    const googleAPIErrorMsg='EclipSky is unable to connect to the map server. Please check your network connection.';
    document.getElementById("error").textContent=googleAPIErrorMsg;
}

function initMap() {
    // new default map - USA coast-to-coast
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 38.38, lng: -97.42},
        zoom: 3
    });
    google.maps.event.addListener(map, 'click', function(event) {
        getWeather(event);
    });
    var weatherQuery = "search?query=id:KLAX;id:KSEA;id:KAUS;id:KORD;id:KDCA;id:KBOS;id:KJFK;id:KMCO;id:KSFO;id:KDEN&limit=10";
    getJSON(weatherQuery);
    var northLimitCoordinates = [
    {lat: 45.35771, lng: -130.0000},
    {lat: 45.31976, lng: -125.0000},
    {lat: 45.09000, lng: -120.0000},
    {lat: 44.65057, lng: -115.0000},
    {lat: 43.98082, lng: -110.0000},
    {lat: 43.05729, lng: -105.0000},
    {lat: 41.85448, lng: -100.0000},
    {lat: 40.34744, lng: -95.0000},
    {lat: 38.51747, lng: -90.0000},
    {lat: 36.36223, lng: -85.0000},
    {lat: 33.90970, lng: -80.0000},
    {lat: 31.23004, lng: -75.0000}
    ];

    var southLimitCoordinates = [
    {lat: 44.49868, lng: -130.0000},
    {lat: 44.43156, lng: -125.0000},
    {lat: 44.17150, lng: -120.0000},
    {lat: 43.69981, lng: -115.0000},
    {lat: 42.99500, lng: -110.0000},
    {lat: 42.03295, lng: -105.0000},
    {lat: 40.78804, lng: -100.0000},
    {lat: 39.23623, lng: -95.0000},
    {lat: 37.36168, lng: -90.0000},
    {lat: 35.16783, lng: -85.0000},
    {lat: 32.69146, lng: -80.0000},
    {lat: 30.01229, lng: -75.0000}
    ];

    var centerCoordinates = [
    {lat: 44.92783, lng: -130.0000},
    {lat: 44.87543, lng: -125.0000},
    {lat: 44.63067, lng: -120.0000},
    {lat: 44.17524, lng: -115.0000},
    {lat: 43.48809, lng: -110.0000},
    {lat: 42.54543, lng: -105.0000},
    {lat: 41.32165, lng: -100.0000},
    {lat: 39.79226, lng: -95.0000},
    {lat: 37.93992, lng: -90.0000},
    {lat: 35.76511, lng: -85.0000},
    {lat: 33.30016, lng: -80.0000},
    {lat: 30.62006, lng: -75.0000}
    ];

    // Draw the eclipse paths on the map
    var eclipsePathN = new google.maps.Polyline({
        path: northLimitCoordinates,
        geodesic: true,
        strokeColor: '#08086B',
        strokeOpacity: 1.0,
        strokeWeight: 1.0
    });
    var eclipsePathS = new google.maps.Polyline({
        path: southLimitCoordinates,
        geodesic:true,
        strokeColor: '#08086B',
        strokeOpacity: 1.0,
        strokeWeight: 1.0
    });
    var eclipsePathCenter = new google.maps.Polyline({
        path: centerCoordinates,
        geodesic:true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2.0
    });
    eclipsePathN.setMap(map);
    eclipsePathS.setMap(map);
    eclipsePathCenter.setMap(map);
}; // end of init map function


// create weather station object
function Station(id, lat, lng, name, state, report, icon, timestamp, cloudCode) {
    var self = this;
    self.id = ko.observable(id);
    self.lat = ko.observable(lat);
    self.lng = ko.observable(lng);
    self.name = ko.observable(name);
    self.state = ko.observable(state);
    self.report = ko.observable(report);
    self.icon = ko.observable(icon);
    self.timestamp = ko.observable(timestamp);
    self.cloudCode = ko.observable(cloudCode)
    self.visible = ko.observable(true);
    self.highlight = ko.observable(false);
}

function createMarkersForStations() {
    ko.utils.arrayForEach(viewModel.stations(), function(station) {
        if (station.visible()){
        var position = {lat: station.lat(), lng: station.lng()};
        var weatherIcon = makeMarkerIcon(station.icon());
        var highlightedIcon = makeHighlightedMarkerIcon(station.icon());
        var marker = new google.maps.Marker({
            id: station.id(),
            time: station.timestamp(),
            animation: google.maps.Animation.DROP,
            position: position,
            map: map,
            icon: weatherIcon
        });
            infoWindow = new google.maps.InfoWindow();
            // set up mouseover info window
            marker.addListener('mouseover',function(){
                this.setIcon(highlightedIcon)
                populateInfoWindow(this,infoWindow);
                $("tr:contains('"+ station.id() +"')").addClass('highlight');

            });
            // close the info window on mouseout and restore the icon to default:
            marker.addListener('mouseout',function(){
                infoWindow.close();
                this.setIcon(weatherIcon);
                $("tr:contains('"+ station.id() +"')").removeClass('highlight');
            });

            // show the info window on click, too:
            marker.addListener('click', function(){
                this.setIcon(highlightedIcon)
                populateInfoWindow(this,infoWindow);
                $("tr:contains('"+ station.id() +"')").addClass('highlight');
            });

            markers.push(marker);
        }
    });
}

function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
      }
    markers.length = 0;
}

function zoomMapToMarkerBounds() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function filterList() {
    var setFilter = document.getElementById("setFilter");
    switch(setFilter.value) {
        case "0":
            ko.utils.arrayForEach(viewModel.stations(), function(station){
            if (station.cloudCode() == "CL"){
                station.visible(true);
                }
            else {
                station.visible(false);
                }
            })
        break;

        case "1":
            ko.utils.arrayForEach(viewModel.stations(), function(station){
            if (station.cloudCode() == "CL" || station.cloudCode() == "FW"){
                station.visible(true);
                }
            else {
                station.visible(false);
                }
            })
        break;

        case "2":
            ko.utils.arrayForEach(viewModel.stations(), function(station) {
            if (station.cloudCode() == "BK" || station.cloudCode() == "OV"){
                station.visible(false);
                }
            else {
                station.visible(true);
            }
            })
        break;

        case "3":
            ko.utils.arrayForEach(viewModel.stations(), function(station) {
            if (station.cloudCode() == "OV"){
                station.visible(false);
                }
            else {
                station.visible(true);
            }
            })
        break;
        case "4":
            ko.utils.arrayForEach(viewModel.stations(), function(station) {
                station.visible(true);
            })
    } // end of switch

    // update the markers to match the list:
    hideMarkers(markers);
    createMarkersForStations();

} // end of filterList function

function populateInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
        infoWindow.setContent('');
        infoWindow.marker = marker;
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });
    }
    var ageOfReport = Math.round((Date.now()-marker.time*1000)/60000);
    infoWindow.setContent('<div> Station ID: ' + marker.id + '<br> Time since report: ' + ageOfReport + ' minutes</div>')
    infoWindow.open(map, marker)
    infoWindow.addListener('closeclick', function() {
        infoWindow.marker = null;
    });
}

function makeMarkerIcon(markerWeather) {
    var image = {
        url: 'weatherIcon/' + markerWeather,
        size: new google.maps.Size(34,34),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(17,17),
        scaledSize: new google.maps.Size(34,34)
    }
    return image;
}

function makeHighlightedMarkerIcon(markerWeather) {
    var iconImage = {
        url: 'weatherIcon/' + markerWeather,
        size: new google.maps.Size(50,50),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(25,25),
        scaledSize: new google.maps.Size(50,50)
    }
    return iconImage;
}
//map is set up, now start KnockoutJS.
$(document).ready(function() {
    var status = networkCheck();
    viewModel = new(ViewModel);
    ko.applyBindings(viewModel);
    // listen for clicks on the filter selector
    var setFilter = document.getElementById("setFilter");
    setFilter.addEventListener("change", filterList);
});
