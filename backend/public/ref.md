const humanitarianTile = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        }),
        visible: false,
        title: 'Humanitarian'
    })

 const stamentTile = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'toner',
            url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg '
        }),
        visible: false,
        title: 'Stament'
    })


    map.on('click', (e) => {
        console.log(e.coordinate);
    })

    const baseLayerGroup = new ol.layer.Group({
        layers: [stamentTile, standardTile, humanitarianTile]
    });

    const pointGeoJson = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './lib/point.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'Point',
        style: myStyle
    });


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