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

    // // Pins in locations
    // locations.forEach((location) => {
    //     const [lat, long] = location.split(',');
    //     iconFeatures.push(new ol.Feature({
    //         geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
    //     }))
    // })

    // iconFeatures.forEach(function (feature) { feature.setStyle(myStyle) });

    // const vectorLayer = new ol.layer.Vector({
    //     source: new ol.source.Vector({
    //         features: iconFeatures
    //     })
    // });

    // map.addLayer(vectorLayer);


    // // Lines between locations
    // locations.forEach((location, index) => {
    //     if (index === locations.length - 1) return;

    //     const [lat1, long1] = location.split(',');
    //     const [lat2, long2] = locations[index + 1].split(',');

    //     lineFeatures.push(new ol.Feature({
    //         geometry: new ol.geom.LineString([
    //             ol.proj.fromLonLat([long1, lat1]),
    //             ol.proj.fromLonLat([long2, lat2])
    //         ])
    //     }))
    // })

    // lineFeatures.forEach(function (feature) { feature.setStyle(myStyle) });

    // const lineLayer = new ol.layer.Vector({
    //     source: new ol.source.Vector({
    //         features: lineFeatures
    //     })
    // });

    // map.addLayer(lineLayer);

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

                    lineFeatures.forEach(function (feature) { feature.setStyle(myStyle) });

                    const lineLayer = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: lineFeatures
                        })
                    });

                    map.addLayer(lineLayer);
                }
            })
    })
}

