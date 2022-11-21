window.onload = init;

// try using Leaflet
let iconFeatures = new Array();
let lineFeatures = new Array();

const locations = [
    "27.3256,86.0877",
    "19.0728,72.8826",
    "37.5483,-121.9886",
    "27.7017,85.3206",
    "27.6766,85.3142",
    "27.7017,85.3206",
    "37.5483,-121.9886",
    "53.3331,-6.2489",
    "53.3331,-6.2489"
]

function init() {
    const map = new ol.Map({
        target: 'map',
        view: new ol.View({
            center: [9497197.654051442, 3212586.1754353796],
            zoom: 2,
            minZoom: 1
        })
    })

    const standardTile = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: 'Standard'
    });

    const baseLayerGroup = new ol.layer.Group({
        layers: [standardTile]
    });

    map.addLayer(baseLayerGroup);

    const currentStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 255, 0, 1)',
            width: 2
        }),
        image: new ol.style.Icon({
            anchor: [0.34375, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.4,
            src: './img/pin7.png',
        })
    });

    const initialStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 255, 0, 0.5)',
            width: 2
        }),
        image: new ol.style.Icon({
            anchor: [0.34375, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.4,
            opacity: 0.2,
            src: './img/pin7.png',
        })
    });



    // ----------------------------------------TESTING----------------------------------------

    // Pins in locations
    locations.forEach((location) => {
        if (!location) return;
        const [lat, long] = location.split(',');

        iconFeatures.push(new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
        }))
    })

    // Lines between locations
    locations.forEach((location, index) => {
        if (!location || index === locations.length - 1) return;
        const [lat1, long1] = location.split(',');
        const [lat2, long2] = locations[index + 1].split(',');

        lineFeatures.push(new ol.Feature({
            geometry: new ol.geom.LineString([
                ol.proj.fromLonLat([long1, lat1]),
                ol.proj.fromLonLat([long2, lat2])
            ])
        }))
    })

    iconFeatures.forEach(function (feature) { feature.setStyle(initialStyle) });
    lineFeatures.forEach(function (feature) { feature.setStyle(initialStyle) });

    const iconVectorSource = new ol.source.Vector();
    const lineVectorSource = new ol.source.Vector();

    const iconVectorLayer = new ol.layer.Vector();
    const lineVectorLayer = new ol.layer.Vector();

    let timeOfIteration = iconFeatures.length > lineFeatures.length ? iconFeatures.length : lineFeatures.length;
    let count = 0;
    let loop = setInterval(() => {
        if (count > timeOfIteration - 2) {
            console.log(iconFeatures);
            clearInterval(loop)
        };
        map.removeLayer(iconVectorLayer);
        map.removeLayer(lineVectorLayer);

        iconVectorSource.clear();
        lineVectorSource.clear();

        iconFeatures.slice(0, count + 1).forEach(function (feature) { feature.setStyle(initialStyle) });
        lineFeatures.slice(0, count + 1).forEach(function (feature) { feature.setStyle(initialStyle) });

        iconFeatures[count].setStyle(currentStyle);
        lineFeatures[count - 1 > 0 ? count - 1 : 0].setStyle(currentStyle);
        console.log(count);

        iconVectorSource.addFeatures(iconFeatures.slice(0, count + 1));
        lineVectorSource.addFeatures(lineFeatures.slice(0, count));

        iconVectorLayer.setSource(iconVectorSource);
        lineVectorLayer.setSource(lineVectorSource);

        map.addLayer(iconVectorLayer);
        map.addLayer(lineVectorLayer);

        count++;
    }, 500)


    // ----------------------------------------TESTING_END----------------------------------------

    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.querySelector('input');
        const address = input.value;

        if (!address) {
            return alert('Please enter an address');
        }

        fetch(`/trace?address=${address}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    return console.log(data);
                } else {
                    console.log(data);

                    // Pins in locations
                    data.coords.forEach((location, index) => {
                        if (!location || index === locations.length - 1) return;
                        const [lat, long] = location.split(',');

                        iconFeatures.push(new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
                        }))
                    })

                    // Lines between locations
                    data.coords.forEach((location, index) => {
                        if (!location || index === locations.length - 1) return;
                        const [lat1, long1] = location.split(',');
                        const [lat2, long2] = locations[index + 1].split(',');

                        lineFeatures.push(new ol.Feature({
                            geometry: new ol.geom.LineString([
                                ol.proj.fromLonLat([long1, lat1]),
                                ol.proj.fromLonLat([long2, lat2])
                            ])
                        }))
                    })

                    iconFeatures.forEach(function (feature) { feature.setStyle(initialStyle) });
                    lineFeatures.forEach(function (feature) { feature.setStyle(initialStyle) });

                    const vectorLayer = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: iconFeatures
                        })
                    });

                    const lineLayer = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: lineFeatures
                        })
                    });

                    map.addLayer(vectorLayer);
                    map.addLayer(lineLayer);
                }
            })
    })
}

