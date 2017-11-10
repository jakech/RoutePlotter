import loadGmap from './loadGoogleMapsAPI.js'
import 'normalize.css'
import './style.css'

import { fetchRoute } from './api.js'

import * as form from './modules/form.js'
import * as gmap from './modules/gmap.js'
import * as utils from './utils.js'

loadGmap().then(() => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapTypeControl: false
    })
    gmap.init(map)
    form.init(map, handleToken)
})

async function handleToken(token) {
    try {
        const { status, path, error } = await fetchRoute(token)
        console.log(status)
        if (status === 'success') {
            console.log('draw', path)
            gmap.drawRouteOnMap(utils.parseWayPts(path))
        } else if (status === 'in progress') {
            console.log('retry')
        } else if (status === 'failure') {
            console.log('error', error)
        }
    } catch (error) {
        console.log('server failed', error)
    }
}


