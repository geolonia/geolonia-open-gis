if (document.getElementById('geolonia-gis-editor-container')) {

  const params = {
    container: 'geolonia-map-editor',
  }

  const defaultColor = '#3bb2d0'

  const map = new geolonia.Map(params)

  const colorPicker = AColorPicker.createPicker( '#color-picker' )

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

  const setGeoJSON = () => {
    const geojson = draw.getAll()
    document.getElementById('content').value = JSON.stringify(geojson)
    setFeatureCount(geojson)
  }

  const setFeatureCount = (geojson) => {
    const count = geojson.features.length
    document.getElementById('wp-word-count').innerText = 'Count: ' + count
  }

  const toggleMetabox = (toggle) => {
    if (true === toggle) {
      document.getElementById('geojson-meta-container').style.display = 'flex'
    } else {
      document.getElementById('geojson-meta-container').style.display = 'none'
    }
  }

  map.on('load', () => {

    map.addControl(draw, 'top-right')

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
      draw.set(geojson)
      setFeatureCount(geojson)
    }

    document.getElementsByClassName('restore-backup')[0].addEventListener('click', () => {
      const savedPostdata = window.wp.autosave.local.getSavedPostData()
      if (savedPostdata && 'maps' === savedPostdata.post_type) {
        draw.add(JSON.parse(savedPostdata.content))

        document.getElementById('title').focus() // WP に全選択されるので解除
        draw.changeMode('draw_line_string') // スタイルを反映させるために一度モードを変更
        draw.changeMode('simple_select') // さらに元に戻す

        setGeoJSON()
      }
    })

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

      for (let i = 0; i < current.features.length; i++) {
        const featureId = current.features[i].id
        draw.setFeatureProperty(featureId, 'marker-color', AColorPicker.parseColor(colorArray, 'rgbcss'))
          .setFeatureProperty(featureId, 'stroke', AColorPicker.parseColor(colorArray, 'rgbcss'))
          .setFeatureProperty(featureId, 'fill', AColorPicker.parseColor(colorArray, 'rgbacss'))
      }

      draw.set(draw.getAll())
      setGeoJSON()
    })

    map.on('draw.selectionchange', (e) => {
      console.log(e)
      if (e.features.length && e.features[0].id) {
        current.features = e.features
        toggleMetabox(true)
        colorPicker.setColor(e.features[0].properties.stroke, false)
      } else {
        current.featureId = null
        toggleMetabox(false)
      }
    })

    map.on('draw.delete', () => {
      current.featureId = null
      toggleMetabox(false)
    })

  })
}
