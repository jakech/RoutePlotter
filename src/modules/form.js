import { watchStore } from '../utils.js'
import {
    removeLocation,
    submitRoute,
    unselectLocation,
    moveLocation
} from '../actions'
import formTemplate from '../templates/form.js'
import routeInfo from '../templates/routeInfo.js'

let $form
export function init(map, store) {
    $form = document.createElement('div')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push($form)

    $form.addEventListener('click', event => {
        const { classList } = event.target
        if (classList.contains('js-form-routes_list_item--delete')) {
            const id = +event.target.parentElement.parentElement.dataset.id
            store.dispatch(removeLocation(id))
        } else if (classList.contains('js-form-routes_list_item--up')) {
            const id = +event.target.parentElement.parentElement.dataset.id
            store.dispatch(moveLocation(id, 'up'))
        } else if (classList.contains('js-form-routes_list_item--down')) {
            const id = +event.target.parentElement.parentElement.dataset.id
            store.dispatch(moveLocation(id, 'down'))
        } else if (classList.contains('form-routes_list_btn')) {
            event.preventDefault()
            const { locations } = store.getState()
            store.dispatch(unselectLocation())
            store.dispatch(submitRoute(locations))
        }
    })

    watchStore(store, selector, render)

    return $form
}

function selector({ locations, ui, routeInfo }) {
    return { locations, ui, routeInfo }
}

function render(state) {
    if (state.ui.routeHash === '') {
        $form.innerHTML = formTemplate(state)
    } else if (state.routeInfo !== null) {
        $form.innerHTML = routeInfo(state.routeInfo)
    } else {
        $form.innerHTML = ''
    }
}
