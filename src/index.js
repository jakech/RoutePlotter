import loadGmap from './loadGoogleMapsAPI.js'
import 'normalize.css'
import './style.css'
import 'noty/lib/noty.css'

import * as form from './modules/form.js'
import * as gmap from './modules/gmap.js'

import { createStore } from 'redux'
import middlewares from './middlewares'
import reducers from './reducers'

import { watchStore } from './utils.js'
import { clearMessage } from './actions'
import Noty from 'noty'

loadGmap().then(() => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 22.3964, lng: 114.1095 },
        zoom: 11,
        mapTypeControl: false,
        clickableIcons: false
    })

    const store = createStore(reducers, middlewares)

    let n
    watchStore(
        store,
        state => state.message,
        message => {
            n && n.close()
            if (message.text !== '') {
                n = new Noty(message)
                if (message.timeout !== undefined) {
                    n.on('afterClose', () => store.dispatch(clearMessage()))
                }
                n.show()
            }
        }
    )

    gmap.init(map, store)
    form.init(map, store)
})
