import Noty from 'noty'
import { addToRoute } from './form.js'
import { fetchRoute } from '../api.js'
import { parseWayPts } from '../utils.js'

var directionsService, directionsDisplay, $noty

export function init(map) {
    directionsService = new google.maps.DirectionsService()
    directionsDisplay = new google.maps.DirectionsRenderer()
    directionsDisplay.setMap(map)

    const marker = new google.maps.Marker({ map })
    const infowindow = new google.maps.InfoWindow()

    map.addListener('click', handleClick)

    window.addEventListener('click', event => {
        if (event.target.classList.contains('js-addToRoute')) {
            const coords = marker.getPosition()
            addToRoute({ lat: coords.lat(), lng: coords.lng() })
        }
    })

    function handleClick(e) {
        const { latLng } = e
        marker.setPosition(latLng)
        infowindow.setContent(infoTemplate(latLng))
        infowindow.open(map, marker)
    }

    $noty = {
        message: new Noty({ type: 'info' }),
        error: new Noty({ type: 'error', timeout: 1000 })
    }

    window.onhashchange = handleHashChange
    handleHashChange()
}

function infoTemplate(latLng) {
    return `
        <div>
            <dl class="cf">
                <dt>Lat</dt>
                <dd>${latLng.lat()}</dd>
                <dt>Lng</dt>
                <dd>${latLng.lng()}</dd>
            </dl>
            <button class="js-addToRoute">Add to route</button>
        </div>
    `
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
