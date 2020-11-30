/* global L */
fetch('/actonmass_reps.geojson')
  .then((response) => response.json())
  .then((repsData) => {
    const repsLayer = L.geoJson(repsData, {
      onEachFeature(feature, layer) {
        const props = feature.properties;

        layer.bindPopup(`
        <p><strong>${props.district}</strong></p>
        <p>
          <img src="${props.photo}" alt="Photo"><br>
          <a href="${props.url}">${props.full_name}</a><br>
          ${props.party}<br>
          <a href="mailto:${props.email}">${props.email}</a><br>
          <a href="tel:${props.phone}">${props.phone}</a><br>
        </p>

        <p>
          Signed the pledge: ${props.pledge === 'yes' ? 'Yes' : 'Not yet'}</br>
          Committed to vote: ${props.vote === 'yes' ? 'Yes' : 'Not yet'}</br>
        </p>
        <p>
          <a href="https://actonmass.org/the-campaign/?your_state_representative=${props.first_name} ${props.last_name}">
            <strong>Join the Campaign!</strong>
          </a>
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
