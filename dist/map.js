/* global L */
fetch('/actonmass_reps.geojson')
  .then((response) => response.json())
  .then((repsData) => {
    const repsLayer = L.geoJson(repsData, {
      onEachFeature(feature, layer) {
        const props = feature.properties;

        // TODO: Link to actonmass
        layer.bindPopup(`
        <p><strong>${props.district}</strong></p>
        <p>
            <a href="${props.url}">${props.full_name}</a><br>
            ${props.party}
        </p>
        <p>
            <a href="mailto:${props.email}">${props.email}</a><br>
            <a href="tel:${props.phone}">${props.phone}</a><br>
        </p>
        `);
      },
      style(feature) {
        // TODO: Do styling here instead of Makefile
        return {
          fillColor: feature.properties.fill,
          fillOpacity: feature.properties['fill-opacity'],
          color: feature.properties.stroke,
        };
      },
    });

    L.map('map')
      .addLayer(L.tileLayer.provider('CartoDB.Positron'))
      .addLayer(repsLayer)
      .fitBounds(repsLayer.getBounds());
  });
