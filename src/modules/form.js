import Noty from 'noty'
import { generateRoute } from '../api.js'
import { processInput, watchStore } from '../utils.js'

import { removeLocation } from '../actions'

import formTemplate from '../templates/form.js'

const BTN_TEXT_LOADING = 'Generating route...'
const BTN_TEXT_DEFAULT = 'Plot route'

let $form, $input, $btn

export function init(map, store) {
    $form = document.createElement('div')
    // $input = $form.querySelector('textarea')
    $btn = $form.querySelector('button')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push($form)
    $form.addEventListener('click', event => {
        if (event.target.classList.contains('form-routes_list_item')) {
            store.dispatch(removeLocation(+event.target.dataset.id))
        }
    })

    watchStore(store, selector, render)

    return $form
}

function selector(state) {
    return state.locations
}

function render(state) {
    $form.innerHTML = formTemplate(state)
}

// async function handleFormSubmit(e) {
//     e.preventDefault()
//     const value = $input.value.trim()
//     if (value) {
//         const { success, data } = processInput(value)
//         if (success && data.length >= 2) {
//             $btn.setAttribute('disabled', true)
//             $btn.innerHTML = BTN_TEXT_LOADING
//             try {
//                 const res = await generateRoute(data)
//                 window.location.hash = res.data.token
//             } catch (error) {
//                 new Noty({ text: error.message, type: 'error', timeout: 1000}).show()
//             } finally {
//                 $btn.innerHTML = BTN_TEXT_DEFAULT
//                 $btn.removeAttribute('disabled')
//             }
//         } else {
//             new Noty({ text: 'Invalid input', type: 'error', timeout: 1000}).show()
//         }
//     }
// }

// export function addToRoute(coords) {
//     if ($input.value !== '' && $input.value.slice(-1) !== '\n') {
//         $input.value += '\n'
//     }
//     $input.value += `${coords.lat},${coords.lng}\n`
// }
