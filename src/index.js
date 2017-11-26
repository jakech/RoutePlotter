import loadGmap from './loadGoogleMapsAPI.js'
import 'normalize.css'
import './style.css'
import 'noty/lib/noty.css'

import * as form from './modules/form.js'
import * as gmap from './modules/gmap.js'

import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducers from './reducers'

loadGmap().then(() => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 22.3964, lng: 114.1095 },
        zoom: 11,
        mapTypeControl: false,
        clickableIcons: false
    })

    let middlewares = [thunk]

    if (process.env.NODE_ENV === 'development') {
        middlewares = [...middlewares, logger]
    }

    const store = createStore(reducers, applyMiddleware(...middlewares))

    gmap.init(map, store)
    form.init(map, store)
})
