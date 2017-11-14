var directionsService, directionsDisplay

export function init(map) {
    directionsService = new google.maps.DirectionsService()
    directionsDisplay = new google.maps.DirectionsRenderer()
    directionsDisplay.setMap(map)
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
