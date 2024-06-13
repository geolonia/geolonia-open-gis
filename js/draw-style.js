const drawStyle = [
  {
    'id': 'gl-draw-polygon-fill',
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
    'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#555555'
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
];
