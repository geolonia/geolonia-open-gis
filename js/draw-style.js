const drawStyle = [
  {
    'id': 'gl-draw-polygon',
    'type': 'fill',
    'filter': ['all',
      ['==', '$type', 'Polygon'],
    ],
    'paint': {
      'fill-color': ['string', ['get', 'user_fill'], 'rgba(255, 0, 0, 0.4)'],
      'fill-outline-color': ['string', ['get', 'user_stroke'], '#FF0000'],
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
      'line-color': ['string', ['get', 'user_stroke'], '#FF0000'],
      'line-width': ['number', ['get', 'user_stroke-width'], 2]
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
      'circle-color': '#000000'
    }
  },
  {
    'id': 'gl-draw-point-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'vertex'],
      ['!=', 'meta', 'midpoint'],
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
      ['!=', 'meta', 'midpoint'],
    ],
    'paint': {
      'circle-radius': 9,
      'circle-color': ['string', ['get', 'user_marker-color'], 'rgba(255, 0, 0, 0.4)']
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-stroke-active',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
    ],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#000000'
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-active',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-stroke-mid',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'midpoint'],
      ['==', '$type', 'Point'],
    ],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#000000'
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-mid',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'midpoint'],
      ['==', '$type', 'Point'],
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
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
        ['==', 'small', ['get', 'marker-size']], ['literal', [0, 1]],
        ['==', 'large', ['get', 'marker-size']], ['literal', [0, 1.6]],
        ['literal', [0, 1.2]],
      ],
      'text-allow-overlap': false,
      'icon-allow-overlap': false,
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': [
        'case',
        ['==', 'small', ['get', 'marker-size']], 1,
        ['==', 'large', ['get', 'marker-size']], 1.6,
        1.2,
      ],
    },
  },
];
