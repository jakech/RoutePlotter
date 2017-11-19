import Noty from 'noty'
import humanFormat from 'human-format'
import { addToRoute } from './form.js'
import { fetchRoute } from '../api.js'
import { parseWayPts } from '../utils.js'

import infoTemplate from '../templates/infoWindow.js'

var directionsService, directionsDisplay, $info

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
        const { latLng } = e
        displayLocInfo({ map, latLng, marker, infowindow })
    })

    window.onhashchange = handleHashChange
    handleHashChange()
}

function displayLocInfo({ map, latLng, marker, infowindow }) {
    if (!marker.getMap()) marker.setMap(map)
    marker.setPosition(latLng)
    infowindow.setContent(infoTemplate(latLng.lat(), latLng.lng()))
    infowindow.open(map, marker)
}

async function handleHashChange() {
    if ($info) $info.close()
    const token = window.location.hash.substr(1)
    if (!token) {
        directionsDisplay.setDirections({ routes: [] })
        return
    }

    const n = new Noty({ text: 'Processing route...', type: 'info' }).show()
    try {
        const { path, total_distance, total_time } = await fetchRoute(token)
        const distFormatted = humanFormat(total_distance, {
            unit: 'm',
            prefix: 'k'
        })
        const timeFormatted = humanFormat(total_time, {
            scale: new humanFormat.Scale({
                seconds: 1,
                minutes: 60,
                hours: 3600
            })
        })
        drawRouteOnMap(parseWayPts(path))
        $info = new Noty({
            type: 'alert',
            text: `Distance: ${distFormatted} Time: ${timeFormatted}`
        }).show()
    } catch (error) {
        window.location.hash = ''
        new Noty({ text: error.message, type: 'error', timeout: 1000 }).show()
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
