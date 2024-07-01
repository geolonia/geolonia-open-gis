if (document.getElementById('geolonia-gis-editor-container')) {


  const defaultColor = '#FF0000'

  const current = {
    features: [],
    undo: [],
    redo: [],
  }

  const map = new geolonia.Map({
    container: 'geolonia-map-editor',
  })

  const colorPicker = AColorPicker.createPicker( '#color-picker' )

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

  // 地物の数をエディターの下に表示
  const setFeatureCount = (geojson) => {
    const count = geojson.features.length
    document.getElementById('num-of-features').innerText = count
  }

  // カラーピッカー及びタイトル用のメタボックスの表示/非表示
  const toggleMetabox = (toggle) => {
    if (true === toggle) {
      document.getElementById('geojson-meta-container').style.display = 'block'
    } else {
      document.getElementById('geojson-meta-container').style.display = 'none'
    }
  }

  // カラーピッカー及びタイトル用のメタボックスの閉じるボタン
  document.querySelector('#geolonia-gis-editor-container #geojson-meta-container .close').addEventListener('click', (e) => {
    toggleMetabox(false)
  })

  // Map 及び GeoJSON エディタの切り替え
  const editorMenus = document.querySelectorAll('#geolonia-gis-editor-container .editor-menu button')
  editorMenus.forEach((menu) => {
    menu.addEventListener('click', (e) => {
      if ('inactive' === e.target.className) {
        editorMenus.forEach((menu) => {
          menu.className = 'inactive'
        })
        e.target.className = 'active'
      }

      if ('map' === e.target.dataset.editor) {
        document.getElementById('geolonia-geojson-editor').style.display = 'none'
      } else if ('geojson' === e.target.dataset.editor) {
        document.getElementById('geolonia-geojson-editor').style.display = 'block'

        const content = document.getElementById('content').value
        const geojson = JSON.stringify(JSON.parse(content), null, 2)
        document.getElementById('geolonia-geojson-editor').value = geojson
      }
    })
  })

  document.querySelector('#geolonia-gis-editor-container .editor-container').addEventListener('dragenter', (e) => {
    document.getElementById('geolonia-uploader').style.display = 'flex'
  }, false)

  document.querySelector('#geolonia-gis-editor-container .editor-container').addEventListener('dragleave', (e) => {
    if (e.target === document.getElementById('geolonia-uploader')) {
      document.getElementById('geolonia-uploader').style.display = 'none'
      document.getElementById('geolonia-uploader').classList.remove('alert')
    }
  }, false)

  // これがないとファイルをドロップした際にブラウザがファイルを開いてしまう
  document.getElementById('geolonia-uploader').addEventListener('dragover', (e) => {
    e.preventDefault()

    // GeoJSON 以外のファイルがひとつでもあれば拒否
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      if (!e.dataTransfer.items[i].type.match(/application\/(geo\+)?json/)) {
        document.getElementById('geolonia-uploader').classList.add('alert')
      }
    }
  }, false)

  // ドロップされたファイルを読み込む
  document.getElementById('geolonia-uploader').addEventListener('drop', (e) => {
    e.preventDefault()
    document.getElementById('geolonia-uploader').style.display = 'none'

    if (document.getElementById('geolonia-uploader').classList.contains('alert')) {
      return;
    }

    console.log(e.dataTransfer)

    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      const file = e.dataTransfer.items[i]
      const fileName = e.dataTransfer.files[i].name
      const fileContent = file.getAsFile()
      const reader = new FileReader()

      reader.onload = (readerEvent) => {
        try {
          const geojson = JSON.parse(readerEvent.target.result)
          const features = draw.getAll().features.concat(geojson.features)

          // stirigify() の結果のフォーマットを合わせるための処理
          draw.set({
            "type": "FeatureCollection",
            "features": features
          })
          const data = draw.getAll() // フォーマットが統一された GeoJSON を取得

          // 重複を削除するために stringify() する
          const arr = data.features.map((feature) => {
            delete feature.id
            return JSON.stringify(feature)
          })

          // 重複を削除
          const result = arr.filter(function(item, pos) {
            return arr.indexOf(item) == pos;
          })

          draw.set({
            "type": "FeatureCollection",
            "features": JSON.parse('[' + result.join(',') + ']')
          })

          setGeoJSON()
        } catch (error) {
          console.log(fileName)
        }
      }

      reader.readAsText(fileContent)
    }
  }, false)

  // GeoJSON エディタの内容をWP用のコンテンツとしてセットする
  const setGeoJSON = () => {
    const geojson = draw.getAll()

    setFeatureCount(geojson)

    const last = current.undo[current.undo.length - 1]
    if (JSON.stringify(geojson) !== JSON.stringify(last)) {
      current.undo.push(geojson)
    }

    document.getElementById('content').value = JSON.stringify(geojson)
  }

  map.on('load', () => {

    map.addControl(draw, 'top-right') // draw の各種コントロールを追加

    // デフォルトの GeoJSON をセット
    const content = document.getElementById('content').value

    try {
      const geojson = JSON.parse(content)
      draw.set(geojson)
      current.undo.push(geojson)
      setFeatureCount(geojson)
    } catch (e) {
      // textarea が空の場合は、新規に空の GeoJSON をセット
      const geojson = {
        "type": "FeatureCollection",
        "features": []
      }
      draw.set(geojson)
      current.undo.push(geojson)
      setFeatureCount(geojson)
    }

    // 地図の外側をクリックしたらすべての選択を外す
    document.body.addEventListener('click', (e) => {
      if (null === e.target.closest('#geolonia-gis-editor-container .editor-container')) {
        draw.changeMode('draw_point') // 一度モードを変更
        draw.changeMode('simple_select', { featureIds: [] }) // 元に戻す
        setGeoJSON()
      }
    })

    // 地物を新しく追加した際の処理
    map.on('draw.create', (e) => {
      setGeoJSON()
    });

    map.on('draw.delete', setGeoJSON); // 地物を削除した際の処理
    map.on('draw.update', setGeoJSON); // 地物を更新した際の処理

    // WPのオートセーブによるバックアップから復元するための処理
    document.getElementsByClassName('restore-backup')[0].addEventListener('click', (e) => {
      const savedPostdata = window.wp.autosave.local.getSavedPostData()
      if (savedPostdata && 'maps' === savedPostdata.post_type) {
        document.getElementById('title').value = savedPostdata.post_title
        draw.set(JSON.parse(savedPostdata.content))
        document.getElementById('geolonia-geojson-editor').value = JSON.stringify(JSON.parse(savedPostdata.content), null, 2)

        setGeoJSON()

        document.getElementById('title').focus() // WP に全選択されるので解除
        draw.changeMode('draw_point') // スタイルを反映させるために一度モードを変更
        draw.changeMode('simple_select') // さらに元に戻す

        e.preventDefault()
      }
    }, false)

    // 現在の中心座標を取得してWPのメタボックスにセット
    document.getElementById('geolonia-get-latlng-button').addEventListener('click', () => {
      const lnglat = map.getCenter()
      document.getElementById('geolonia-gis-lat').value = lnglat.lat
      document.getElementById('geolonia-gis-lng').value = lnglat.lng
    })

    // 現在のズームレベルを取得してWPのメタボックスにセット
    document.getElementById('geolonia-get-zoom-button').addEventListener('click', () => {
      document.getElementById('geolonia-gis-zoom').value = map.getZoom()
    })

    // カラーピッカーで色を変更した際の処理
    colorPicker.on( 'change', ( picker, color ) => {
      const colorArray =  AColorPicker.parseColor(color)
      colorArray.push(0.4)

      for (let i = 0; i < current.features.length; i++) {
        const featureId = current.features[i].id
        draw.setFeatureProperty(featureId, 'marker-color', AColorPicker.parseColor(colorArray, 'rgbcss'))
          .setFeatureProperty(featureId, 'stroke', AColorPicker.parseColor(colorArray, 'rgbcss'))
          .setFeatureProperty(featureId, 'fill', AColorPicker.parseColor(colorArray, 'rgbacss'))
      }

      draw.set(draw.getAll())
      setGeoJSON()
    })

    // 地物に対する選択/選択解除の際の処理
    map.on('draw.selectionchange', (e) => {
      if (e.features.length && e.features[0].id) {
        current.features = e.features
        toggleMetabox(true)
        colorPicker.setColor(e.features[0].properties.stroke || defaultColor, false)
        document.getElementById('geojson-meta-title').value = e.features[0].properties.title || ''
      } else {
        current.features = []
        toggleMetabox(false)
      }

      setGeoJSON()
    })

    // 地物が削除された際に地図のポップアップを非表示にする
    map.on('draw.delete', () => {
      current.features = []
      toggleMetabox(false)
    })

    // 各地物のタイトルを GeoJson にセットするためのコールバック
    const handleTitleChange = (e) => {
      const title = e.target.value

      // 複数選択があり得るのでループ
      for (let i = 0; i < current.features.length; i++) {
        const featureId = current.features[i].id
        draw.setFeatureProperty(featureId, 'title', title)
      }

      draw.set(draw.getAll())
      setGeoJSON()
    }

    document.getElementById('geojson-meta-title').addEventListener('change', handleTitleChange)

    // タイトルの入力欄で Enter キーを押した際にタイトルをセットしてその後のイベントをキャンセル
    document.getElementById('geojson-meta-title').addEventListener('keydown', (e) => {
      if ('Enter' === e.key) {
        handleTitleChange(e)
        e.preventDefault()
      }
    })

    // GeoJSON エディタの内容を地図及び `#content` に反映
    document.getElementById('geolonia-geojson-editor').addEventListener('change', (e) => {
      const content = e.target.value
      try {
        if (!content) {
          const geojson = {
            "type": "FeatureCollection",
            "features": []
          }
          draw.set(geojson)
          setFeatureCount(geojson)
        } else {
          const geojson = JSON.parse(content)
          draw.set(geojson)
          setFeatureCount(geojson)
        }
        setGeoJSON()
      } catch (e) {
      }
    })

    // Undo / Redo
    document.getElementById('geolonia-map-editor').addEventListener('keydown', (e) => {
      if ('z' === e.key && false === e.shiftKey && (true === e.metaKey || true === e.ctrlKey)) { // Cmd + z Undo
        if (current.undo.length > 1) {
          current.redo.push(current.undo.pop())
          if (current.undo.length) {
            const undo = current.undo.pop()
            current.redo.push(undo)
            draw.set(undo)

            draw.changeMode('draw_point') // スタイルを反映させるために一度モードを変更
            draw.changeMode('simple_select') // さらに元に戻す
            toggleMetabox(false)
            current.features = []

            setGeoJSON()
          }
        }
      } else if ('z' === e.key && true === e.shiftKey && (true === e.metaKey || true === e.ctrlKey)) { // Cmd + Shift + z Redo
        if (current.redo.length > 1) {
          current.undo.push(current.redo.pop())
          if (current.redo.length) {
            const redo = current.redo.pop()
            current.undo.push(redo)
            draw.set(redo)

            draw.changeMode('draw_point') // スタイルを反映させるために一度モードを変更
            draw.changeMode('simple_select') // さらに元に戻す
            toggleMetabox(false)
            current.features = []

            setGeoJSON()
          }
        }
      } else if ('Backspace' === e.key && ! e.target.closest('input, textarea')) { // Backspace Delete
        if (current.features.length) {
          for (let i = 0; i < current.features.length; i++) {
            draw.delete(current.features[i].id)
          }

          toggleMetabox(false)
          current.features = []
          setGeoJSON()
        }
      }
    })

  }) // End of `map.on('load')`
}
