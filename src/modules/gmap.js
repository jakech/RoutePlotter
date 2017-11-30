import { parseWayPts, watchStore, promisify } from '../utils.js'
import infoTemplate from '../templates/infoWindow.js'
import {
    addLocation,
    selectLocation,
    unselectLocation,
    fetchRoute,
    clearRoute
} from '../actions'

export function init(map, store) {
    const directionsService = new google.maps.DirectionsService()
    const directionsDisplay = new google.maps.DirectionsRenderer({
        preserveViewport: true
    })
    directionsDisplay.setMap(map)

    window.addEventListener('click', event => {
        if (event.target.classList.contains('js-addToRoute')) {
            event.preventDefault()
            const { currentLocation } = store.getState()
            store.dispatch(addLocation(currentLocation))
            store.dispatch(unselectLocation())
        }
    })

    watchStore(store, state => state.ui.routeHash, handleHashChange(store, map))
    watchStore(
        store,
        state => state.routeInfo,
        renderRoute(directionsService, directionsDisplay)
    )
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

function renderRoute(directionsService, directionsDisplay) {
    return routeInfo => {
        if (routeInfo) {
            drawRouteOnMap(parseWayPts(routeInfo.route))
        } else {
            directionsDisplay.setDirections({ routes: [] })
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
            const map = directionsDisplay.getMap()
            const b = directionsDisplay.getDirections().routes[0].bounds

            google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
                const panel = document
                    .querySelector('.js-route-info')
                    .getBoundingClientRect()
                const sw = b.getSouthWest()
                const worldCoords = map.getProjection().fromLatLngToPoint(sw)
                const scale = Math.pow(2, map.getZoom())
                const p = new google.maps.Point(
                    (worldCoords.x * scale - (panel.x + panel.width)) / scale,
                    worldCoords.y
                )
                map.fitBounds(
                    b.extend(map.getProjection().fromPointToLatLng(p))
                )
            })
            map.fitBounds(b)
        }
    }
}

function handleHashChange(store, map) {
    const geocode = promisify(new google.maps.Geocoder().geocode)
    const handleMapClick = async e => {
        const { ui } = store.getState()
        if (!ui.formSubmitting) {
            const { latLng } = e
            store.dispatch(
                selectLocation(
                    { lat: latLng.lat(), lng: latLng.lng() },
                    geocode
                )
            )
        }
    }
    let listener
    return async routeHash => {
        if (routeHash === '') {
            store.dispatch(clearRoute())
            listener = map.addListener('click', handleMapClick)
        } else {
            listener && listener.remove()
            store.dispatch(unselectLocation())
            store.dispatch(fetchRoute(routeHash))
        }
    }
}
