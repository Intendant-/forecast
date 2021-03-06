/* thymeleaf throws error on script, work around to manually inject */
/** more reasons to not use thymeleaf */
let mapScript = document.createElement("script");
mapScript.async = true;
mapScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCQ16IY4VPnmLOt4OiQIIIzBNCMXgvulgg&libraries=places&callback=initMap";
let s0 = document.getElementsByTagName('script')[0];
s0.parentNode.insertBefore(mapScript, s0);



let map;
let marker;
let centerMarker;
let place;
let geocoder;
function initMap() {
    /**TODO: set starting position to user location (or default location) */
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 29.95106579999999, lng: -90.0715323},
        zoom: 12,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#444444"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#46bcec"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ]        
      });
        setMap();
       
        let input = document.getElementById('pac-input');

        geocoder = new google.maps.Geocoder();


        let autocomplete = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', map);

        // Set the data fields to return when the user selects a place.
        autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name']);

        let infowindow = new google.maps.InfoWindow();
        let infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);


        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); 
          }
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          let address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindowContent.children['place-icon'].src = place.icon;
          infowindowContent.children['place-name'].textContent = place.name;
          infowindowContent.children['place-address'].textContent = address;
          infowindow.open(map, marker);
        });

            let myLatLng = getCenter();
            marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                anchorPoint: new google.maps.Point(0, -29),
                draggable: true,
                title: "Center marker"
        
            });
}         


function getCenter() {
    let myLat = map.getCenter().lat();
    let myLng = map.getCenter().lng();
    let myLatLng = {lat: myLat, lng: myLng};

    return myLatLng;
}

function setMarker() {
    marker.setPosition(getCenter());
}

function getMarkerCords() {
    let myLat = marker.getPosition().lat();
    let myLng = marker.getPosition().lng();
    let myLatLng = {lat: myLat, lng: myLng}

    return myLatLng;
}

function getLocationForecast() {
    geocoder.geocode({
        latLng: {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()}
      }, (responses) => {
        if (responses && responses.length > 0) {
          let myLatLng = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()};
          let field = responses[0].address_components;
          let data = {};
          for(i = 0; i < field.length; i++) {
              
              if(field[i].types[0] == "country") {
                  data.country = field[i].long_name;
              } else if (field[i].types[0] == "administrative_area_level_1") {
                  data.state = field[i].short_name;
              } else if (field[i].types[0] == "locality") {
                  data.city = field[i].long_name;
              }
  
          }
        document.getElementById("cityCast").value = data.city + ', ' + data.state;
        document.getElementById("latCast").value = myLatLng.lat;
        document.getElementById("lngCast").value = myLatLng.lng;

        document.getElementById("forecast").submit(); 
        } else {
          marker.address_components = 'Cannot determine address at this location.';
        }
      })

    
}

function saveLocation() {
    geocoder.geocode({
      latLng: {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()}
    }, (responses) => {
      if (responses && responses.length > 0) {
        let myLatLng = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()};
        let field = responses[0].address_components;
        let data = {};
        for(i = 0; i < field.length; i++) {
            
            if(field[i].types[0] == "country") {
                data.country = field[i].long_name;
            } else if (field[i].types[0] == "administrative_area_level_1") {
                data.state = field[i].short_name;
            } else if (field[i].types[0] == "locality") {
                data.city = field[i].long_name;
            }

        }

        document.getElementById("city").value = data.city;
        document.getElementById("state").value = data.state;
        document.getElementById("country").value = data.country; 
        document.getElementById("latSave").value = myLatLng.lat;
        document.getElementById("lngSave").value = myLatLng.lng;

        document.getElementById("save").submit();
      } else {
        marker.address_components = 'Cannot determine address at this location.';
      }
    })

}

if(map.latLng) {
    setMap();
}

/** reverse geocoding URI "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latSave + "," + lngSave +"&key=AIzaSyCQ16IY4VPnmLOt4OiQIIIzBNCMXgvulgg" */