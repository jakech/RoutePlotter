import React from 'react'
import { render } from 'react-dom'
import loadGmap from './loadGoogleMapsAPI.js'
import 'normalize.css'
import './style.css'
import 'noty/lib/noty.css'

import * as form from './modules/form.js'
import * as gmap from './modules/gmap.js'

import RouteForm from './modules/RouteForm.jsx'

loadGmap().then(() => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 14,
        mapTypeControl: false,
        clickableIcons: false
    })
    gmap.init(map)

    const $form = document.createElement('div')
    render(<RouteForm />, $form, () => {
        map.controls[google.maps.ControlPosition.TOP_LEFT].push($form)
    })

    // form.init(map)
})
