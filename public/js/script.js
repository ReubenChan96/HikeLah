
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

  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 1.291806, lng: 103.8495 }, // Centered at Funan Mall, Singapore
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
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
            const matchesAllFilters = selectedFilters.every(filter => cardClasses.includes(filter));

            if (selectedFilters.length === 0 || matchesAllFilters) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
});










