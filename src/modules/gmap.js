import Noty from 'noty'
import humanFormat from 'human-format'
// import { addToRoute } from './form.js'
import { addLocation, selectLocation, unselectLocation } from '../actions'
import { fetchRoute } from '../api.js'
import { parseWayPts, watchStore, promisify } from '../utils.js'

import infoTemplate from '../templates/infoWindow.js'

var directionsService, directionsDisplay, $info

export function init(map, store) {
    directionsService = new google.maps.DirectionsService()
    directionsDisplay = new google.maps.DirectionsRenderer()
    const geocode = promisify(new google.maps.Geocoder().geocode)
    directionsDisplay.setMap(map)

    window.addEventListener('click', event => {
        if (event.target.classList.contains('js-addToRoute')) {
            event.preventDefault()
            const { currentLocation } = store.getState()
            store.dispatch(addLocation(currentLocation))
            store.dispatch(unselectLocation())
        }
    })

    map.addListener('click', async e => {
        const { latLng } = e
        store.dispatch(
            selectLocation({ lat: latLng.lat(), lng: latLng.lng() }, geocode)
        )
    })

    // window.onhashchange = handleHashChange(store)
    

    watchStore(
        store,
        state => state.currentLocation,
        displayLocInfo(map, store)
    )
    watchStore(store, state => state.locations, renderMarkers(map))
}

function displayLocInfo(map, store) {
    const marker = new google.maps.Marker()
    const infowindow = new google.maps.InfoWindow()

    infowindow.addListener('closeclick', () => {
        // remove the marker when inforwindow close
        store.dispatch(unselectLocation())
    })

    return currentLocation => {
        if (currentLocation) {
            const { lat, lng } = currentLocation
            if (!marker.getMap()) marker.setMap(map)
            marker.setPosition({ lat, lng })
            infowindow.setContent(infoTemplate(currentLocation))
            infowindow.open(map, marker)
        } else {
            marker.setMap(null)
        }
    }
}

function renderMarkers(map) {
    let markers = []
    return locations => {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null)
        }
        markers = []
        markers = locations.map(
            ({ lat, lng }) =>
                new google.maps.Marker({ position: { lat, lng }, map: map })
        )
    }
}

function handleHashChange(store) {
    return async () => {
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
            store.dispatch({ type: 'CLEAR_ALL_LOCATIONS' })
            drawRouteOnMap(parseWayPts(path))
            $info = new Noty({
                type: 'alert',
                text: `Distance: ${distFormatted} Time: ${timeFormatted}`
            }).show()
        } catch (error) {
            window.location.hash = ''
            new Noty({
                text: error.message,
                type: 'error',
                timeout: 1000
            }).show()
        } finally {
            n.close()
        }
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
