import { watchStore } from '../utils.js'
import { removeLocation, submitRoute, unselectLocation } from '../actions'
import formTemplate from '../templates/form.js'

let $form
export function init(map, store) {
    $form = document.createElement('div')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push($form)

    $form.addEventListener('click', event => {
        const { classList } = event.target
        if (classList.contains('form-routes_list_item')) {
            store.dispatch(removeLocation(+event.target.dataset.id))
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

function selector({ locations, ui }) {
    return { locations, ui }
}

function render(state) {
    if (state.ui.routeHash === '') {
        $form.innerHTML = formTemplate(state)
    } else {
        $form.innerHTML = '<a class="btn btn-restart" href="#">Restart</a>'
    }
}
