import Noty from 'noty'
import { generateRoute } from '../api.js'
import { processInput, watchStore } from '../utils.js'

import { removeLocation, submitRoute } from '../actions'

import formTemplate from '../templates/form.js'

const BTN_TEXT_LOADING = 'Generating route...'
const BTN_TEXT_DEFAULT = 'Plot route'

let $form, $input, $btn

export function init(map, store) {
    $form = document.createElement('div')
    // $input = $form.querySelector('textarea')
    // $btn = $form.querySelector('button')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push($form)

    $form.addEventListener('click', event => {
        const { classList } = event.target
        if (classList.contains('form-routes_list_item')) {
            store.dispatch(removeLocation(+event.target.dataset.id))
        } else if (classList.contains('form-routes_list_btn')) {
            event.preventDefault()
            // handleFormSubmit(selector(store.getState()))
            const { locations } = store.getState()
            store.dispatch(submitRoute(locations))
        }
    })

    watchStore(store, selector, render)

    return $form
}

function selector({ locations, ui }) {
    return { locations, ui }
}

function render(state) {
    $form.innerHTML = formTemplate(state)
    $btn = $form.querySelector('button')
}

// async function handleFormSubmit(locations) {
//     const data = locations.map(loc => {
//         return [loc.lat, loc.lng]
//     })
//     if (data.length >= 2) {
//         $btn.setAttribute('disabled', true)
//         $btn.innerHTML = BTN_TEXT_LOADING
//         try {
//             const res = await generateRoute(data)
//             window.location.hash = res.data.token
//         } catch (error) {
//             new Noty({
//                 text: error.message,
//                 type: 'error',
//                 timeout: 1000
//             }).show()
//         } finally {
//             $btn.innerHTML = BTN_TEXT_DEFAULT
//             $btn.removeAttribute('disabled')
//         }
//     } else {
//         new Noty({
//             text: 'Invalid input',
//             type: 'error',
//             timeout: 1000
//         }).show()
//     }
// }
