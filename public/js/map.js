document.addEventListener('DOMContentLoaded', function() {
  const mapContainer = document.getElementById('map');
  const mapError = document.getElementById('map-error');

  // Check if required data is available
  if (typeof listing === 'undefined') {
    console.error('Listing data not available');
    showMapError('Map configuration is missing. Please contact support.');
    return;
  }

  let coordinates = [20.5937, 78.9629]; // Default to India
  let hasValidCoords = false;

  if (listing.geometry && listing.geometry.coordinates && 
      listing.geometry.coordinates.length === 2 &&
      !(listing.geometry.coordinates[0] === 0 && listing.geometry.coordinates[1] === 0)) {
    coordinates = listing.geometry.coordinates;
    hasValidCoords = true;
  }

  try {
    // Initialize Leaflet map with improved styling
    const map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true
    }).setView(coordinates.reverse(), hasValidCoords ? 10 : 4);

    // Add attractive OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
      maxZoom: 19,
      opacity: 0.9
    }).addTo(map);

    // Create custom marker icon
    const customIcon = L.divIcon({
      html: '<div style="background-color: #ff385c; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-map-marker-alt" style="color: white; font-size: 12px;"></i></div>',
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });

    // Add marker with enhanced popup (only if valid coordinates)
    if (hasValidCoords) {
      const marker = L.marker(coordinates, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
        <div style="font-family: 'Montserrat', sans-serif; max-width: 200px;">
          <h5 style="margin: 0 0 8px 0; color: #2c3e50; font-weight: 600;">${listing.title}</h5>
          <p style="margin: 0; color: #7f8c8d; font-size: 14px;">
            <i class="fa-solid fa-info-circle" style="margin-right: 5px;"></i>
            Exact location provided after booking
          </p>
        </div>
      `, {
        closeButton: true,
        autoClose: false,
        closeOnEscapeKey: true,
        className: 'custom-popup'
      });

      // Open popup by default
      marker.openPopup();
    }

    // Add scale control
    L.control.scale({
      position: 'bottomleft',
      metric: true,
      imperial: false
    }).addTo(map);

    // Reposition zoom control
    map.zoomControl.setPosition('bottomright');

    // Hide error message if map loads successfully
    if (mapError) {
      mapError.style.display = 'none';
    }

  } catch (error) {
    console.error('Error initializing map:', error);
    showMapError('Failed to load map. Please check your internet connection.');
  }

  function showMapError(message) {
    if (mapContainer) {
      mapContainer.style.display = 'none';
    }
    if (mapError) {
      mapError.querySelector('p').textContent = message;
      mapError.style.display = 'block';
    }
  }
});

