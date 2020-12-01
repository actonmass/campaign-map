/* global L, Papa */
Promise.all([
  fetch('https://docs.google.com/spreadsheets/d/1iY5wzVUpAKRHBF-vrwyUBz9_wV93FVqu4MW5viPSkas/export?gid=0&format=csv')
    .then((response) => response.text())
    .then((csv) => Promise.resolve(Papa.parse(csv, { header: true, dynamicTyping: true }).data)),
  fetch('https://raw.githubusercontent.com/bhrutledge/ma-legislature/main/dist/ma_house.geojson')
    .then((response) => response.json()),
])
  .then(([supporters, houseFeatures]) => {
    const supportersByDistrict = supporters.reduce((acc, cur) => {
      acc[cur.district] = cur;
      return acc;
    }, {});

    const houseLayer = L.geoJson(houseFeatures, {
      onEachFeature(feature, layer) {
        const rep = {
          ...supportersByDistrict[feature.properties.district],
          ...feature.properties,
        };

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
            Signed the pledge: ${rep.pledge ? 'Yes' : 'Not yet'}</br>
            Committed to vote: ${rep.vote ? 'Yes' : 'Not yet'}</br>
          </p>
          <p>
            <a href="https://actonmass.org/the-campaign/?your_state_representative=${rep.first_name} ${rep.last_name}">
              <strong>Join the Campaign!</strong>
            </a>
          </p>
        `);

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

        layer.setStyle({
          color: 'gray',
          weight: 1,
          fillColor: rep.vote ? 'green' : partyColor,
          fillOpacity: rep.pledge ? '0.6' : '0.3',
        });
      },
    });

    L.map('map')
      .addLayer(L.tileLayer.provider('CartoDB.Positron'))
      .addLayer(houseLayer)
      .fitBounds(houseLayer.getBounds());
  });
