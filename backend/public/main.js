window.onload = init;

// try using Leaflet
let iconFeatures = new Array();

const locations = [
    "27.6766,85.3142",
    "29.7179,-95.4263",
    "27.7017,85.3206",
    "27.6766,85.3142",
    "27.6766,85.3142",
    "27.6766,85.3142",
    "27.6766,85.3142",
    "27.7017,85.3206"
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

    const myStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, 1)',
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
                    console.log(data.coords);

                    data.coords.forEach((location) => {
                        const [lat, long] = location.split(',');
                        iconFeatures.push(new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
                        }))
                    })

                    iconFeatures.forEach(function (feature) { feature.setStyle(myStyle) });

                    const vectorLayer = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: iconFeatures
                        })
                    });

                    map.addLayer(vectorLayer);
                }
            })

    })
}
