/*
  global
  axios:false,
  mapboxgl:false,
  MapboxGeocoder:false
*/

window.sources = []
window.layers = []
window.events = {}
window.popups = []
window.markers = []

async function removeMapSources() {
  if (window.sources.length > 0) {
    for (const mapSource of window.sources) {
      window.map.removeSource(mapSource)
    }
  }

  window.sources = []
}

async function removeMapLayers() {
  if (window.layers.length > 0) {
    for (const mapLayer of window.layers) {
      window.map.removeLayer(mapLayer)
    }
  }

  window.layers = []
}

async function removeMapEvents() {
  const mapLayers = Object.keys(window.events)

  if (mapLayers.length > 0) {
    for (const mapLayer of mapLayers) {
      const mapEvents = Object.keys(window.events[mapLayer])
      for (const mapEvent of mapEvents) {
        if (mapLayer === 'map') {
          window.map.off(
            mapEvent,
            window.events[mapLayer][mapEvent]
          )
        } else {
          window.map.off(
            mapEvent,
            mapLayer,
            window.events[mapLayer][mapEvent]
          )
        }
      }
    }
  }

  window.events = {}
}

async function removeMapPopups() {
  if (window.popups.length > 0) {
    for (const popup of window.popups) {
      popup.remove()
    }
  }

  window.popups = []
}

async function removeMapMarkers() {
  if (window.markers.length > 0) {
    for (const marker of window.markers) {
      marker.remove()
    }
  }

  window.markers = []
}

async function removeAll() {
  await removeMapPopups()
  await removeMapMarkers()
  await removeMapEvents()
  await removeMapLayers()
  await removeMapSources()
}

async function drawAllParks() {
  const reply = await axios.get('/data/parks')
  const geojson = reply.data
  // const geojson = await requestAllParks()

  await removeAll()

  window.sources.push('parks-all')

  window.map.addSource('parks-all', {
    type: 'geojson',
    data: geojson
  })

  window.layers.push('parks-all-polygons')

  // window.map.addLayer({
  //   id: 'parks-all-polygons',
  //   type: 'fill',
  //   source: 'parks-all',
  //   paint: {
  //     'fill-color': '#a500ff', // '#ff7f00', // '#00ffcb',
  //     'fill-opacity': 0.4
  //   },
  //   filter: ['==', '$type', 'Polygon']
  // })

  window.map.addLayer({
    id: 'parks-all-polygons',
    type: 'fill',
    source: 'parks-all',
    paint: {
      'fill-color': '#a500ff',
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['get', 'population'],
        0, 0.4,
        2000, 0.5,
        4000, 0.6,
        6000, 0.7,
        8000, 0.8,
        10000, 0.9,
        12000, 1
      ]
    },
    filter: ['==', '$type', 'Polygon']
  })

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  })

  window.popups.push(popup)

  window.events['parks-all-polygons'] = {
    click: function(e) {
      drawParkWithPoint(
        e.lngLat.lng,
        e.lngLat.lat
      )
    },
    mouseenter: function(e) {
      window.map.getCanvas().style.cursor = 'pointer'

      const centerPoint = e.features[0].properties.center_point
      const coordinates = JSON.parse(centerPoint).coordinates
      const name = e.features[0].properties.name
      const population = e.features[0].properties.population

      popup
        .setLngLat(coordinates)
        .setHTML(name + '<br>' + population)
        .addTo(window.map)
    },
    mouseleave: function() {
      window.map.getCanvas().style.cursor = ''
      popup.remove()
    }
  }

  window.map.on(
    'click',
    'parks-all-polygons',
    window.events['parks-all-polygons']['click']
  )

  window.map.on(
    'mouseenter',
    'parks-all-polygons',
    window.events['parks-all-polygons']['mouseenter']
  )

  window.map.on(
    'mouseleave',
    'parks-all-polygons',
    window.events['parks-all-polygons']['mouseleave']
  )
}

async function drawParkWithPoint(lng, lat) {
  const reply = await axios.post('/data/park', {
    lng,
    lat
  })
  const geojson = reply.data
  // const geojson = await requestParkWithPoint(lng, lat)

  await removeAll()

  window.sources.push('park-point')

  window.map.addSource('park-point', {
    type: 'geojson',
    data: geojson
  })

  window.layers.push('park-point-polygons')

  window.map.addLayer({
    id: 'park-point-polygons',
    type: 'fill',
    source: 'park-point',
    paint: {
      'fill-color': '#a500ff', // '#00ffcb',
      'fill-opacity': 0.4
    },
    filter: ['==', '$type', 'Polygon']
  })

  window.events['map'] = {
    click: function(e) {
      drawAllParks()
    }
  }

  window.events['park-point-polygons'] = {
    mouseenter: function(e) {
      window.map.getCanvas().style.cursor = ''
      window.map.off('click', window.events['map']['click'])
    },
    mouseleave: function() {
      window.map.getCanvas().style.cursor = 'pointer'
      window.map.on('click', window.events['map']['click'])
    }
  }

  window.map.on(
    'mouseenter',
    'park-point-polygons',
    window.events['park-point-polygons']['mouseenter']
  )

  window.map.on(
    'mouseleave',
    'park-point-polygons',
    window.events['park-point-polygons']['mouseleave']
  )

  let bbox = geojson.features[0].geometry.bbox
  bbox = [[bbox[0], bbox[1]], [bbox[2], bbox[3]]]

  window.map.fitBounds(
    bbox,
    {
      padding: {
        top: 250,
        bottom: 250,
        left: 250,
        right: 250
      },
      maxZoom: 15
    }
  )

  await drawParkMarkers(lng, lat)
  await drawBusMarkers(lng, lat)
  // await drawPopulation(lng, lat)
}

async function drawParkMarkers(lng, lat) {
  const reply = await axios.post('/data/markers', {
    lng,
    lat
  })
  const geojson = reply.data
  console.log(geojson)

  if (geojson.features === null) {
    return
  }

  geojson.features.forEach(function(point) {
    const el = document.createElement('div')
    console.log(point.properties.marker)
    el.className = point.properties.marker

    const marker = new mapboxgl.Marker(el)
      .setLngLat(point.geometry.coordinates)
      .addTo(window.map)

    window.markers.push(marker)

    el.addEventListener('mouseenter', function(event) {
      window.map.getCanvas().style.cursor = 'pointer'
      const popup = new mapboxgl.Popup()
        .setLngLat(point.geometry.coordinates)
        .setHTML(point.properties.marker)
        .addTo(window.map)

      window.popups.push(popup)
    })

    el.addEventListener('mouseleave', async function(event) {
      window.map.getCanvas().style.cursor = ''
      await removeMapPopups()
    })
  })
}

async function drawBusMarkers(lng, lat) {
  const reply = await axios.post('/data/buses', {
    lng,
    lat
  })
  const geojson = reply.data
  console.log(geojson)

  if (geojson.features === null) {
    return
  }

  geojson.features.forEach(function(point) {
    const el = document.createElement('div')
    console.log(point.properties.marker)
    el.className = point.properties.marker

    const marker = new mapboxgl.Marker(el)
      .setLngLat(point.geometry.coordinates)
      .addTo(window.map)

    window.markers.push(marker)

    el.addEventListener('mouseenter', function(event) {
      window.map.getCanvas().style.cursor = 'pointer'
      const popup = new mapboxgl.Popup()
        .setLngLat(point.geometry.coordinates)
        .setHTML(point.properties.name)
        .addTo(window.map)

      window.popups.push(popup)
    })

    el.addEventListener('mouseleave', async function(event) {
      window.map.getCanvas().style.cursor = ''
      await removeMapPopups()
    })
  })
}

// async function drawPopulation(lng, lat) {
//   console.log('Getting..')
//   const reply = await axios.post('/data/population', {
//     lng,
//     lat
//   })
//   const geojson = reply.data
//   // const geojson = await requestAllParks()

//   // await removeAll()

//   window.sources.push('population')

//   window.map.addSource('population', {
//     type: 'geojson',
//     data: geojson
//   })

//   window.layers.push('population-polygons')

//   window.map.addLayer({
//     id: 'population-polygons',
//     type: 'fill',
//     source: 'population',
//     paint: {
//       'fill-color': '#ff7f00', // '#ff7f00', // '#00ffcb',
//       'fill-opacity': 0.4
//     },
//     filter: ['==', '$type', 'Polygon']
//   })
// }

async function requestSecrets() {
  const secrets = (await axios.get('/secret')).data
  return secrets
}

function initMap(secrets) {
  window.mapboxgl.accessToken = secrets.token

  window.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/nodex/cjorl84i26n4d2rtdcqkj7qzj',
    maxBounds: new window.mapboxgl.LngLatBounds(
      new window.mapboxgl.LngLat(17.012851746604753, 48.07479068472537),
      new window.mapboxgl.LngLat(17.274448450623083, 48.26021724023067)
    ),
    center: new window.mapboxgl.LngLat(17.10890799754472, 48.15235619643062),
    zoom: 13
  })

  // animation: easeTo, flyTo
}

function initControls(secrets) {
  // Location search bar
  window.map.addControl(new MapboxGeocoder({
    accessToken: secrets.token
  }))

  // Navigation controls
  window.map.addControl(new window.mapboxgl.NavigationControl())

  // Where-am-I controls
  window.map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  }))

  // Coordinates display
  window.map.on('mousemove', function(e) {
    document.getElementById('info').innerHTML =
        JSON.stringify(e.point) + '<br />' + JSON.stringify(e.lngLat)
  })
}

async function main() {
  const secrets = await requestSecrets()
  initMap(secrets)
  console.log('Map initiated')
  initControls(secrets)
  console.log('Secrets received')

  window.map.on('load', async function() {
    await drawAllParks()
  })
}

console.log('Hello')
main()
