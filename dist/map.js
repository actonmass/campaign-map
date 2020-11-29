const MapApp = {};

MapApp.render = function (repsData) {

    const repsLayer = L.geoJson(repsData, {
        onEachFeature: function (feature, layer) {
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
        style: function (feature) {
            // TODO: https://github.com/rowanwins/leaflet-simplestyle
            return {
                fillColor: feature.properties['fill'],
                fillOpacity: feature.properties['fill-opacity'],
                color: feature.properties['stroke'],
            };
        }
    });

    MapApp.map = L.map('map')
        .addLayer(L.stamenTileLayer('toner-lite'))
        .addLayer(repsLayer)
        .fitBounds(repsLayer.getBounds());
};

// TODO: fetch polyfill, e.g https://github.com/github/fetch
fetch('/actonmass_reps.geojson')
    .then(function (response) { return response.json(); })
    .then(MapApp.render);
