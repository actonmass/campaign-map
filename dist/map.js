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
        const props = feature.properties;

        let partyColor;
        switch (props.party) {
          case 'Democrat':
            partyColor = 'blue';
            break;
          case 'Republican':
            partyColor = 'red';
            break;
          default:
            partyColor = 'gray';
        }

        return {
          color: 'gray',
          weight: 1,
          fillColor: props.vote === 'yes' ? 'green' : partyColor,
          fillOpacity: props.pledge === 'yes' ? '0.6' : '0.3',
        };
      },
    });

    L.map('map')
      .addLayer(L.tileLayer.provider('CartoDB.Positron'))
      .addLayer(repsLayer)
      .fitBounds(repsLayer.getBounds());
  });
