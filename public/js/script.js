
// nav bar logic
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
  
    // Toggle the 'show' class on navbarCollapse when navbarToggler is clicked
    navbarToggler.addEventListener('click', function() {
      navbarCollapse.classList.toggle('show');
    });
  });
  
// Current Location Logic

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

let map, infoWindow;

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 1.291806, lng: 103.8495 }, // Centered at Funan Mall, Singapore
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    });

  // GeoJSON Data Link
    map.data.loadGeoJson('/data/NParksTracks_w_Name.geojson');

    map.data.setStyle({
    strokeWeight: 3, 
    strokeColor: '#3D550C', 
    });
  
    infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "See Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("You are here :)");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  //Trail classification
  map.data.setStyle(function(feature) {
    var type = feature.getProperty('type');
    var color;

    switch(type) {
        case 'Footpath':
            color = '#0047AB'; // Shade Grey for footpaths
            break;
        case 'Bikeway':
            color = '#4682B4'; // SteelBlue for bikeways
            break;
        default:
            color = '#3D550C'; // Default green color
    }

    return {
        strokeWeight: 2,
        strokeColor: color
    };
});

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation.",
      );
      infoWindow.open(map);
    }

}

window.initMap = initMap;