import loadGmap from './loadGoogleMapsAPI.js'
import 'normalize.css'
import './style.css'
import 'noty/lib/noty.css'

import * as form from './modules/form.js'
import * as gmap from './modules/gmap.js'

import { createStore } from 'redux'
import middlewares from './middlewares'
import reducers from './reducers'

loadGmap().then(() => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 22.3964, lng: 114.1095 },
        zoom: 11,
        mapTypeControl: false,
        clickableIcons: false
    })

    const store = createStore(reducers, middlewares)

    gmap.init(map, store)
    form.init(map, store)
})
