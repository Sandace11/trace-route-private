window.onload = init;

// try using Leaflet
let iconFeatures = new Array();
let lineFeatures = new Array();

const data = {
    coords: [
        "39.0437,-77.4875",
        "27.6766,85.3142",
        "27.7017,85.3206",
        "39.0437,-77.4875",
        "33.9728,-118.4276",
        "33.9728,-118.4276",
        null,
        "22.3302,114.1595",
        "22.3302,114.1595",
        "28.4601,77.0263",
        "27.6766,85.3142"
    ],
    ips: [
        "2400:1a00:b050:48a6::1",
        "2400:1a00:b1a5::229",
        "2400:1a00:0:1::228",
        "2404:d180:1:212::201",
        "2001:5a0:2300:200::b9",
        "2001:5a0:2300:200::b5",
        "2404:6800:8110::1",
        "2001:4860:0:1::4fe8",
        "2001:4860:0:1::269f",
        "2404:6800:4009:82c::2004",
        "2400:1a00:b050:48a6::1"
    ]
}

function init() {
    const map = new ol.Map({
        target: 'map',
        view: new ol.View({
            center: [0, 0],
            zoom: 1,
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
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.2,
            src: './img/pin_.png',
        })
    });

    const initialStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 255, 0, 0.5)',
            width: 2
        }),
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.2,
            opacity: 0.4,
            src: './img/pin_.png',
        })
    });

    const form = document.querySelector('form');
    const input = document.querySelector('input');
    const button = document.querySelector('button');
    const infoField = document.querySelector('#info');
    const ripple = document.querySelector('#ripple');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const address = input.value;
        ripple.classList.add('lds-ripple');
        infoField.innerHTML = 'Sending request...';

        if (!address) {
            ripple.classList.remove('lds-ripple');
            infoField.innerHTML = 'Please enter an address!';
            return alert('Please enter an address');
        }
        button.disabled = true;

        try {
            fetch(`/trace?address=${address}`)
                .then(response => response.json())
                .then(data => {
                    infoField.innerHTML = 'Processing response...This may take upto a minute!';
                    if (data.error) {
                        ripple.classList.remove('lds-ripple');
                        infoField.innerHTML = ' Error: ' + data.error.errorMessage;
                        button.disabled = false;
                        return console.log(data);
                    } else {
                        // console.log(data);
                        data.coords.forEach((location, index) => {
                            if (!location) {
                                data.coords[index] = data.coords[index - 1];
                            }
                        })

                        data.coords.forEach((location, index) => {
                            if (!location) {
                                const [lat, long] = data.coords[index - 1].split(',');
                                const [lat1, long1] = data.coords[index - 1].split(',');
                                [lat2, long2] = [lat1, long1];
                                return;
                            }
                            // For Pins
                            const [lat, long] = location.split(',');

                            iconFeatures.push(new ol.Feature({
                                geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
                            }))

                            // For Lines
                            if (data.coords[index + 1]) {
                                const [lat1, long1] = location.split(',');
                                const [lat2, long2] = data.coords[index + 1].split(',');

                                lineFeatures.push(new ol.Feature({
                                    geometry: new ol.geom.LineString([
                                        ol.proj.fromLonLat([long1, lat1]),
                                        ol.proj.fromLonLat([long2, lat2])
                                    ])
                                }))
                            }
                        })

                        // // Pins in locations
                        // data.coords.forEach((location, index) => {
                        //     if (!location) {
                        //         const [lat, long] = data.coords[index - 1].split(',');
                        //         return;
                        //     }
                        //     const [lat, long] = location.split(',');

                        //     iconFeatures.push(new ol.Feature({
                        //         geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
                        //     }))
                        // })

                        // // Lines between locations
                        // data.coords.forEach((location, index) => {
                        //     if (!location) {
                        //         const [lat1, long1] = data.coords[index - 1].split(',');
                        //         [lat2, long2] = [lat1, long1];
                        //         return;
                        //     }
                        //     if (index === data.coords.length - 1) return;
                        //     const [lat1, long1] = location.split(',');
                        //     const [lat2, long2] = data.coords[index + 1].split(',');

                        //     lineFeatures.push(new ol.Feature({
                        //         geometry: new ol.geom.LineString([
                        //             ol.proj.fromLonLat([long1, lat1]),
                        //             ol.proj.fromLonLat([long2, lat2])
                        //         ])
                        //     }))
                        // })

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
                                button.disabled = false;
                                ripple.classList.remove('lds-ripple');
                                infoField.innerHTML = `Done! ${count + 1}/${timeOfIteration}`;
                                clearInterval(loop);
                                return;
                            }

                            infoField.innerHTML = `Plotting IP:${data.ips[count]} ${count + 1}/${timeOfIteration}`;

                            map.removeLayer(iconVectorLayer);
                            map.removeLayer(lineVectorLayer);

                            iconVectorSource.clear();
                            lineVectorSource.clear();

                            iconFeatures.slice(0, count + 1).forEach(function (feature) { feature.setStyle(initialStyle) });
                            lineFeatures.slice(0, count + 1).forEach(function (feature) { feature.setStyle(initialStyle) });

                            iconFeatures[count].setStyle(currentStyle);
                            lineFeatures[count - 1 > 0 ? count - 1 : 0].setStyle(currentStyle);

                            iconVectorSource.addFeatures(iconFeatures.slice(0, count + 1));
                            lineVectorSource.addFeatures(lineFeatures.slice(0, count));

                            iconVectorLayer.setSource(iconVectorSource);
                            lineVectorLayer.setSource(lineVectorSource);

                            map.addLayer(iconVectorLayer);
                            map.addLayer(lineVectorLayer);

                            count++;
                        }, 1000);
                    }
                })
        } catch {
            ripple.classList.remove('lds-ripple');
            infoField.innerHTML = 'Error: Something went wrong!';
            button.disabled = false;
            return console.log('Error: Something went wrong!');
        }
    })
}
