
// nav bar logic: waits for the page to load "DOM Content Loaded", Finds the toggler on navbar 
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
  
    // Toggle the 'show' class on navbarCollapse when navbarToggler is clicked
    navbarToggler.addEventListener('click', function() {
      navbarCollapse.classList.toggle('show');
    });
  });

// Map Logic, loads map styles before the page 
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
      center: { lat: 1.291806, lng: 103.8495 }, // Centered at Funan Mall, Singapore cuz easter egg lol
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      styles: mapStyles,
      streetViewControl: true,
      });

    // GeoJSON Data Link - loads geojson file from data/merged-Nparks trails and sets the styles 
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

    //Taken from Google Maps API guide, action to see current location, and styled. (Google Maps API JS)
    const locationButton = document.createElement("button");

    locationButton.textContent = "See Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
      // See Current Location (Google Maps API JS)
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
        // Error handling for when the infoWindow returns false, browser doesn't support Geolocation (Google Maps API JS)
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

    //Trail Styles nased on the trail type (Google Maps API JS)
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

    // Add specific points to the map (Google Maps API JS)
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
  
    // Transit map layer, highlights public transport features
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    //Hover and highlight trails based on the mouseover event, mouseout for when the mouse leaves the highlighted trail mark

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
      const park = feature.getProperty('park'); // Park refers to name on the map 

      const div = document.createElement('div');
      const h5 = document.createElement('h5');
      h5.textContent = park || '';
      const p = document.createElement('p');
      p.textContent = `Trail Type: ${type || 'Unknown'}`;
      div.appendChild(h5);
      div.appendChild(p);

      infoWindow.setContent(div);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
  });
}


  //filter logic --> ensures page is loaded, query selectors from the checkbox in explore.ejs, console.logs were present to de-bug
  //Initialisation: Ensure DOM is fully loaded before executing any logic
  document.addEventListener('DOMContentLoaded', function () {
    // defines filterCheckboxes and selects all to check
    const filterCheckboxes = document.querySelectorAll('.form-check-input');
    const filterPillsContainer = document.getElementById('filter-pills-container');

    if (filterCheckboxes.length === 0) {
        return;
    }

    const cardsContainer = document.querySelector('.container.search .cards-container');
    if (!cardsContainer) {
        return;
    }

    const cards = cardsContainer.querySelectorAll('.row');
    if (cards.length === 0) {
        return;
    }

    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
          updateFilterPills();
          filterCards();
      });
    });

    // function to generate pills of the selection
    function updateFilterPills() {
      // Clears pills upon reload
      filterPillsContainer.innerHTML = '';

      // Creates new pills based on selected filters
      const selectedFilters = Array.from(filterCheckboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => ({ value: checkbox.value, label: checkbox.nextElementSibling.textContent }));

      selectedFilters.forEach(filter => {
          const pill = document.createElement('span');
          pill.className = 'filter-pill me-2';
          pill.innerHTML = `${filter.label} <i class="fas fa-times ms-2"></i>`;
          pill.setAttribute('data-value', filter.value);

          // Event listener for removing pills and uncheck the corresponding checkbox in filter pills as well as the cards. linking it to the check box to reflect the system status

          pill.addEventListener('click', function () {
            const value = this.getAttribute('data-value');
            const checkbox = Array.from(filterCheckboxes).find(cb => cb.value === value);
            if (checkbox) {
                checkbox.checked = false;
                updateFilterPills();
                filterCards();
            }
        });

          filterPillsContainer.appendChild(pill);
      });
  }

    // once the filters have been selected, render the related partials that have been defined by the related classes. ensures that when it matches SOME filters, it appears. This was done with the assistance of ChatGPT and GovTech Engineers <3. 

    function filterCards() {
        //Collect values into an array
        const selectedFilters = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        cards.forEach(card => {
            //Uses 'some' method and to return true if at least one filter matches any one of the card's classes
            const cardClasses = card.className.split(' ');
            const matchesSomeFilters = selectedFilters.some(filter => cardClasses.includes(filter));

            //Display the cards and make them visible
            if (selectedFilters.length === 0 || matchesSomeFilters) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
});

