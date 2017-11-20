import loadGmap from './loadGoogleMapsAPI.js'
import 'normalize.css'
import './style.css'
import 'noty/lib/noty.css'

import * as form from './modules/form.js'
import * as gmap from './modules/gmap.js'

loadGmap().then(() => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 22.3964, lng: 114.1095 },
        zoom: 11,
        mapTypeControl: false,
        clickableIcons: false
    })
    gmap.init(map)
    form.init(map)
})
