import Noty from 'noty'
// import { addToRoute } from './form.js'
import { fetchRoute } from '../api.js'
import { parseWayPts } from '../utils.js'

import infoTemplate from '../templates/infoWindow.js'

var directionsService, directionsDisplay, $noty, addToRoute

export function init(map) {
    directionsService = new google.maps.DirectionsService()
    directionsDisplay = new google.maps.DirectionsRenderer()
    directionsDisplay.setMap(map)

    const marker = new google.maps.Marker()
    const infowindow = new google.maps.InfoWindow()

    infowindow.addListener('closeclick', () => {
        // remove the marker when inforwindow close
        marker.setMap(null)
    })

    window.addEventListener('click', event => {
        if (event.target.classList.contains('js-addToRoute')) {
            event.preventDefault()
            const coords = marker.getPosition()
            if (typeof addToRoute === 'function') {
                addToRoute({ lat: coords.lat(), lng: coords.lng() })
            }
            marker.setMap(null)
        }
    })

    map.addListener('click', e => {
        const { latLng  } = e
        displayLocInfo({ map, latLng, marker, infowindow })
    })

    $noty = {
        message: (text) => new Noty({ text, type: 'info' }),
        error: (text) => new Noty({ text, type: 'error', timeout: 1000 })
    }

    window.onhashchange = handleHashChange
    handleHashChange()
}

export function onAddRoute(fn) {
    console.log('on', fn)
    addToRoute = fn
}

function displayLocInfo({ map, latLng, marker, infowindow }) {
    if (!marker.getMap()) marker.setMap(map)
    marker.setPosition(latLng)
    infowindow.setContent(infoTemplate(latLng.lat(), latLng.lng()))
    infowindow.open(map, marker)
}

async function handleHashChange() {
    const token = window.location.hash.substr(1)
    if (!token) return

    const n = $noty.message('Processing route...').show()
    try {
        const { path } = await fetchRoute(token)
        drawRouteOnMap(parseWayPts(path))
    } catch (error) {
        window.location.hash = ''
        $noty.error(error.message).show()
    } finally {
        n.close()
    }
}

function drawRouteOnMap({ origin, dest, wayPts }) {
    directionsService.route(
        {
            origin: origin,
            destination: dest,
            waypoints: wayPts,
            optimizeWaypoints: false,
            travelMode: 'DRIVING'
        },
        displayOnMap
    )
}

function displayOnMap(response, status) {
    if (status === 'OK') {
        directionsDisplay.setDirections(response)
    }
}
