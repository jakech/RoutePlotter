import loadGmap from './loadGoogleMapsAPI.js'
import 'normalize.css'
import './style.css'
import 'noty/lib/noty.css'

import * as form from './modules/form.js'
import * as gmap from './modules/gmap.js'

loadGmap().then(() => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapTypeControl: false
    })
    gmap.init(map)
    form.init(map)
})

