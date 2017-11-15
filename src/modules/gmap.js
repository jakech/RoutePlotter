import Noty from 'noty'
import { fetchRoute } from '../api.js'
import { parseWayPts } from '../utils.js'

var directionsService, directionsDisplay, $noty

export function init(map) {
    directionsService = new google.maps.DirectionsService()
    directionsDisplay = new google.maps.DirectionsRenderer()
    directionsDisplay.setMap(map)

    $noty = {
        message: new Noty({ type: 'info' }),
        error: new Noty({ type: 'error', timeout: 1000 })
    }

    window.onhashchange = handleHashChange
    handleHashChange()
}

async function handleHashChange() {
    const token = window.location.hash.substr(1)
    if (!token) return

    const n = $noty.message.setText('Processing route...', true).show()
    try {
        const { path } = await fetchRoute(token)
        drawRouteOnMap(parseWayPts(path))
    } catch (error) {
        window.location.hash = ''
        $noty.error.setText(error, true).show()
    } finally {
        n.close()
    }
}

export function drawRouteOnMap({ origin, dest, wayPts }) {
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

export function displayOnMap(response, status) {
    if (status === 'OK') {
        directionsDisplay.setDirections(response)
    }
}
