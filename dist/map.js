/* global L, Papa */
Promise.all([
  fetch('https://docs.google.com/spreadsheets/d/1iY5wzVUpAKRHBF-vrwyUBz9_wV93FVqu4MW5viPSkas/export?gid=0&format=csv')
    .then((response) => response.text())
    .then((csv) => {
      const supporters = Papa.parse(csv, { header: true }).data;
      const districtSupporters = supporters.reduce((acc, cur) => {
        acc[cur.district] = cur;
        return acc;
      }, {});
      return Promise.resolve(districtSupporters);
    }),
  fetch('https://raw.githubusercontent.com/bhrutledge/ma-legislature/main/dist/ma_house.geojson')
    .then((response) => response.json()),
])
  .then(([districtSupporters, districtFeatures]) => {
    const repsLayer = L.geoJson(districtFeatures, {
      onEachFeature(feature, layer) {
        const rep = feature.properties;
        const supporter = districtSupporters[rep.district] || {};

        layer.bindPopup(`
        <p><strong>${rep.district}</strong></p>
        <p>
          <img src="${rep.photo}" alt="Photo"><br>
          <a href="${rep.url}">${rep.full_name}</a><br>
          ${rep.party}<br>
          <a href="mailto:${rep.email}">${rep.email}</a><br>
          <a href="tel:${rep.phone}">${rep.phone}</a><br>
        </p>

        <p>
          Signed the pledge: ${supporter.pledge === 'yes' ? 'Yes' : 'Not yet'}</br>
          Committed to vote: ${supporter.vote === 'yes' ? 'Yes' : 'Not yet'}</br>
        </p>
        <p>
          <a href="https://actonmass.org/the-campaign/?your_state_representative=${rep.first_name} ${rep.last_name}">
            <strong>Join the Campaign!</strong>
          </a>
        `);
      },
      style(feature) {
        const rep = feature.properties;
        const supporter = districtSupporters[rep.district] || {};

        let partyColor;
        switch (rep.party) {
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
          fillColor: supporter.vote === 'yes' ? 'green' : partyColor,
          fillOpacity: supporter.pledge === 'yes' ? '0.6' : '0.3',
        };
      },
    });

    L.map('map')
      .addLayer(L.tileLayer.provider('CartoDB.Positron'))
      .addLayer(repsLayer)
      .fitBounds(repsLayer.getBounds());
  });
