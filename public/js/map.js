 mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "map",
    style:"mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates,
    // center: ['75.8333','22.7179'],
    zoom: 9,
  });

  const marker = new mapboxgl.Marker({color : "red"})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25}).setHTML(
      `<h4>${listing.title}</h4><p>Exact Location will be provided after booking`
    ))
  .addTo(map);

