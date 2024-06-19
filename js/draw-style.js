const drawStyle = [
  {
    'id': 'gl-draw-polygon',
    'type': 'fill',
    'filter': ['all',
      ['==', '$type', 'Polygon'],
    ],
    'paint': {
      'fill-color': ['string', ['get', 'user_fill'], 'rgba(59, 178, 208, 0.2)'],
      'fill-outline-color': ['string', ['get', 'user_stroke'], '#3bb2d0'],
      'fill-opacity': 1
    }
  },
  {
    'id': 'gl-draw-line',
    'type': 'line',
    'filter': ['all',
      ['==', '$type', 'LineString'],
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': ['string', ['get', 'user_stroke'], '#3bb2d0'],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-stroke-active',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#3bb2d0'
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-active',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-active-outline',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'vertex'],
      ['==', 'active', 'true'],
    ],
    'paint': {
      'circle-radius': 13,
      'circle-color': '#3bb2d0'
    }
  },
  {
    'id': 'gl-draw-point-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'vertex'],
      ['==', 'active', 'true'],
    ],
    'paint': {
      'circle-radius': 11,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'vertex'],
    ],
    'paint': {
      'circle-radius': 9,
      'circle-color': ['string', ['get', 'user_marker-color'], '#3bb2d0']
    }
  },
  {
    'id': 'gl-draw-polygon-symbol',
    'type': 'symbol',
    'filter': ['==', '$type', 'Polygon'],
    'paint': {
      'text-color': '#000',
      'text-halo-color': '#fff',
      'text-halo-width': 1,
    },
    'layout': {
      'text-field': ['get', 'user_title'],
      'text-font': ['Noto Sans Regular'],
      'text-size': 12,
      'text-max-width': 12,
      'text-allow-overlap': false,
    },
  },
  {
    'id': 'gl-draw-line-symbol',
    'type': 'symbol',
    'filter': ['==', '$type', 'LineString'],
    'paint': {
      'text-color': '#000',
      'text-halo-color': '#fff',
      'text-halo-width': 1,
    },
    'layout': {
      'symbol-placement': 'line',
      'text-field': ['get', 'user_title'],
      'text-font': ['Noto Sans Regular'],
      'text-size': 12,
      'text-max-width': 12,
      'text-allow-overlap': false,
    },
  },
  {
    'id': 'gl-draw-point-symbol',
    'type': 'symbol',
    'filter': ['!', ['has', 'point_count']],
    'paint': {
      'text-color': '#000',
      'text-halo-color': '#fff',
      'text-halo-width': 1,
    },
    'layout': {
      'icon-image': ['get', 'marker-symbol'],
      'text-field': ['get', 'user_title'],
      'text-font': ['Noto Sans Regular'],
      'text-size': 12,
      'text-anchor': 'top',
      'text-max-width': 12,
      'text-offset': [
        'case',
        ['==', 'small', ['get', 'marker-size']], ['literal', [0, 0.6]],
        ['==', 'large', ['get', 'marker-size']], ['literal', [0, 1.2]],
        ['literal', [0, 0.8]],
      ],
      'text-allow-overlap': true,
      'icon-allow-overlap': true,
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': [
        'case',
        ['==', 'small', ['get', 'marker-size']], 0.6,
        ['==', 'large', ['get', 'marker-size']], 1.3,
        0.8,
      ],
    },
  }
];
