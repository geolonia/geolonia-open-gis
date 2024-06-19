if (document.getElementById('geolonia-gis-editor-container')) {

  const params = {
    container: 'geolonia-map-editor',
  }

  const defaultColor = '#3bb2d0'

  const map = new geolonia.Map(params)

  const colorPicker = AColorPicker.createPicker( '#color-picker' )

  const current = {
    features: [],
    undo: [],
    redo: [],
  }

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

    setFeatureCount(geojson)

    const last = current.undo[current.undo.length - 1]
    if (JSON.stringify(geojson) !== JSON.stringify(last)) {
      current.undo.push(geojson)
    }

    document.getElementById('content').value = JSON.stringify(geojson)
  }

  const setFeatureCount = (geojson) => {
    const count = geojson.features.length
    document.getElementById('wp-word-count').innerText = 'Count: ' + count
  }

  const toggleMetabox = (toggle) => {
    if (true === toggle) {
      document.getElementById('geojson-meta-container').style.display = 'block'
    } else {
      document.getElementById('geojson-meta-container').style.display = 'none'
    }
  }

  document.querySelector('#geolonia-gis-editor-container #geojson-meta-container .close').addEventListener('click', (e) => {
    toggleMetabox(false)
  })

  map.on('load', () => {

    // 地図の外側をクリックしたらすべての選択を外す
    document.body.addEventListener('click', (e) => {
      if (null === e.target.closest('#geolonia-gis-editor-container')) {
        draw.changeMode('draw_point') // 一度モードを変更
        draw.changeMode('simple_select', { featureIds: [] }) // 元に戻す
        setGeoJSON()
      }
    })

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
        draw.changeMode('draw_point') // スタイルを反映させるために一度モードを変更
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
    })

    map.on('draw.selectionchange', (e) => {
      if (e.features.length && e.features[0].id) {
        current.features = e.features
        toggleMetabox(true)
        colorPicker.setColor(e.features[0].properties.stroke, false)
        document.getElementById('geojson-meta-title').value = e.features[0].properties.title || ''
      } else {
        current.features = []
        toggleMetabox(false)
      }

      setGeoJSON()
    })

    map.on('draw.delete', () => {
      current.features = []
      toggleMetabox(false)
    })

    document.getElementById('geojson-meta-title').addEventListener('change', (e) => {
      const title = e.target.value

      for (let i = 0; i < current.features.length; i++) {
        const featureId = current.features[i].id
        draw.setFeatureProperty(featureId, 'title', title)
      }

      draw.set(draw.getAll())
    })

    document.getElementById('geolonia-gis-editor-container').addEventListener('keydown', (e) => {
      if ('z' === e.key && false === e.shiftKey && (true === e.metaKey || true === e.ctrlKey)) {
        if (current.undo.length > 1) {
          current.redo.push(current.undo.pop())
          if (current.undo.length) {
            const undo = current.undo.pop()
            current.redo.push(undo)
            draw.set(undo)

            draw.changeMode('draw_point') // スタイルを反映させるために一度モードを変更
            draw.changeMode('simple_select') // さらに元に戻す

            setGeoJSON()
          }
        }
      } else if ('z' === e.key && true === e.shiftKey && (true === e.metaKey || true === e.ctrlKey)) {
        if (current.redo.length > 1) {
          current.undo.push(current.redo.pop())
          if (current.redo.length) {
            const redo = current.redo.pop()
            current.undo.push(redo)
            draw.set(redo)

            draw.changeMode('draw_point') // スタイルを反映させるために一度モードを変更
            draw.changeMode('simple_select') // さらに元に戻す

            setGeoJSON()
          }
        }
      }
    })

  })
}
