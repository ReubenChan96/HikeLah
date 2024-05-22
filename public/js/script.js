
// nav bar logic
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
  
    // Toggle the 'show' class on navbarCollapse when navbarToggler is clicked
    navbarToggler.addEventListener('click', function() {
      navbarCollapse.classList.toggle('show');
    });
  });

// Map Logic 
  let map; 
  let infoWindow;

  const mapStyles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.government",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.medical",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.medical",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.medical",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "poi.place_of_worship",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.place_of_worship",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.school",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.school",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.school",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.school",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.station.airport",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit.station.airport",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ];

  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 1.291806, lng: 103.8495 }, // Centered at Funan Mall, Singapore
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      styles: mapStyles
      });

    // GeoJSON Data Link
      map.data.loadGeoJson('/data/merged-NParks-tracks.geojson');

      map.data.setStyle({
      strokeWeight: 3, 
      strokeColor: '#3D550C', 
      });
    
      infoWindow = new google.maps.InfoWindow();
      const marker = new google.maps.Marker({
        map: map,
        title: "You are here"
      });

    const locationButton = document.createElement("button");

    locationButton.textContent = "See Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
      // See Current Location
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

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
          browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation.",
        );
        infoWindow.open(map);
      }

    //Trail Style
    map.data.setStyle(function(feature) {
      var type = feature.getProperty('type');
      var color;

      switch(type) {
          case 'Footpath':
              color = '#3D550C'; // Teal for footpaths
              break;
          case 'Bikeway':
              color = '#4682B4'; // SteelBlue for bikeways
              break;
          default:
              color = '#4A7212'; // Default green color
      }

      return {
          strokeWeight: 2,
          strokeColor: color
      };
  });

    // Add specific points to the map 
    const points = [
      { lat: 1.409472, lng: 103.921667, info: "Coney Island Nature Trail" },
      { lat: 1.350833, lng: 103.764722, info: "Bukit Batok Nature Trail" }
    ];
  
    points.forEach(point => {
      const marker = new google.maps.Marker({
        position: point,
        map: map,
        title: `Marker at (${point.lat}, ${point.lng})`
      });
  
      const infoWindow = new google.maps.InfoWindow({
        content: point.info
      });
  
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  
    // Transit map layer
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    //Hover and highlight

      map.data.addListener('mouseover', function(event) {
        map.data.overrideStyle(event.feature, { strokeColor: 'orange', strokeWeight: 8 });
    });

    map.data.addListener('mouseout', function(event) {
        map.data.revertStyle();
  });

    map.data.addListener('click', function(event) {
      const feature = event.feature;
      const name = feature.getProperty('name');
      const description = feature.getProperty('description');
      const type = feature.getProperty('type');
      const park = feature.getProperty('park'); // Assuming 'park' is a property

      const contentString = `<div>
          <h4>${park}</h4>
          <p>Type: ${type}</p>
      </div>`;

      infoWindow.setContent(contentString);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
  });
}


  //filter logic
  document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const filterCheckboxes = document.querySelectorAll('.form-check-input');
    if (filterCheckboxes.length === 0) {
        console.error('No filter checkboxes found.');
        return;
    }

    const cardsContainer = document.querySelector('.container.search .cards-container');
    if (!cardsContainer) {
        console.error('Cards container not found.');
        return;
    }

    const cards = cardsContainer.querySelectorAll('.row');
    if (cards.length === 0) {
        console.error('No cards found.');
        return;
    }

    console.log('Filter checkboxes:', filterCheckboxes);
    console.log('Cards container:', cardsContainer);
    console.log('Cards:', cards);

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterCards);
    });

    function filterCards() {
        const selectedFilters = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        cards.forEach(card => {
            const cardClasses = card.className.split(' ');
            const matchesAnyFilters = selectedFilters.some(filter => cardClasses.includes(filter));

            if (selectedFilters.length === 0 || matchesAnyFilters) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
});










