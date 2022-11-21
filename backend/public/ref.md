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