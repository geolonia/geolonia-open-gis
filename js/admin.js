if (document.getElementById('geolonia-gis-editor-container')) {

  const params = {
    container: 'geolonia-map-editor',
  }

  const defaultColor = '#3bb2d0'

  const map = new geolonia.Map(params)

  const colorPicker = AColorPicker.createPicker( '#color-picker' )
  colorPicker.hide()

  const current = {}

  MapboxDraw.constants.classes.CONTROL_BASE = 'maplibregl-ctrl' // as 'mapboxgl-ctrl'
  MapboxDraw.constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-' // as 'mapboxgl-ctrl-'
  MapboxDraw.constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group' // as 'mapboxgl-ctrl-group'
  MapboxDraw.constants.classes.ATTRIBUTION = 'maplibregl-ctrl-attrib' // as 'mapboxgl-ctrl-attrib'

  const draw = new MapboxDraw({
    controls: {
      point: true,
      line_string: true,
      polygon: true,
      trash: true,
      combine_features: false,
      uncombine_features: false,
    },
    styles: drawStyle,
    userProperties: true,
  });

  map.on('load', () => {

    map.addControl(draw, 'top-right')

    const setGeoJSON = () => {
      const geojson = draw.getAll()
      document.getElementById('content').value = JSON.stringify(geojson)
    }

    map.on('draw.create', (e) => {
      const featureId = e.features[0].id

      const colorArray =  AColorPicker.parseColor(defaultColor)
      colorArray.push(0.2)

      draw.setFeatureProperty(featureId, 'marker-color', AColorPicker.parseColor(colorArray, 'rgbcss'))
      draw.setFeatureProperty(featureId, 'stroke', AColorPicker.parseColor(colorArray, 'rgbcss'))
      draw.setFeatureProperty(featureId, 'fill', AColorPicker.parseColor(colorArray, 'rgbacss'))

      setGeoJSON()
    });
    map.on('draw.delete', setGeoJSON);
    map.on('draw.update', setGeoJSON);

    const content = document.getElementById('content').value
    if (content) {
      const geojson = JSON.parse(content)
      draw.add(geojson)
    }

    document.getElementById('geolonia-get-latlng-button').addEventListener('click', () => {
      const lnglat = map.getCenter()
      document.getElementById('geolonia-gis-lat').value = lnglat.lat
      document.getElementById('geolonia-gis-lng').value = lnglat.lng
    })

    document.getElementById('geolonia-get-zoom-button').addEventListener('click', () => {
      document.getElementById('geolonia-gis-zoom').value = map.getZoom()
    })

    colorPicker.on( 'change', ( picker, color ) => {
      const colorArray =  AColorPicker.parseColor(color)
      colorArray.push(0.2)

      draw.setFeatureProperty(current.featureId, 'marker-color', AColorPicker.parseColor(colorArray, 'rgbcss'))
        .setFeatureProperty(current.featureId, 'stroke', AColorPicker.parseColor(colorArray, 'rgbcss'))
        .setFeatureProperty(current.featureId, 'fill', AColorPicker.parseColor(colorArray, 'rgbacss'))

      setGeoJSON()
    } )

    map.on('draw.selectionchange', (e) => {
      if (e.features.length && e.features[0].id) {
        current.featureId = e.features[0].id
        colorPicker.show()
        colorPicker.setColor(e.features[0].properties.stroke, false)
      } else {
        current.featureId = null
        colorPicker.hide()
      }
    } )
  })
}
