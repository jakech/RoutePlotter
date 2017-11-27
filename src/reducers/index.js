import { combineReducers } from 'redux'

const locations = (state = [], action) => {
    switch (action.type) {
        case 'ADD_LOCATION':
            return [
                ...state,
                {
                    id: action.id,
                    lat: action.lat,
                    lng: action.lng,
                    address: action.address
                }
            ]
        case 'REMOVE_LOCATION':
            return state.filter(loc => loc.id !== action.id)
        case 'HASH_CHANGE':
            if (action.hash === '') {
                return state
            } else {
                return []
            }
        default:
            return state
    }
}

const currentLocation = (state = null, action) => {
    switch (action.type) {
        case 'SELECT_LOCATION':
            return {
                id: action.id,
                lat: action.lat,
                lng: action.lng,
                address: action.address
            }
        case 'UNSELECT_LOCATION':
            return null
        default:
            return state
    }
}

const message = (state = { text: '', type: 'alert' }, action) => {
    switch (action.type) {
        case 'ROUTE_SUBMIT_FAILURE':
            return { type: 'error', text: action.text, timeout: 1000 }
        default:
            return state
    }
}

const ui = (state = { formSubmitting: false, routeHash: '' }, action) => {
    switch (action.type) {
        case 'ROUTE_SUBMIT_REQUEST':
            return Object.assign({}, state, { formSubmitting: true })
        case 'ROUTE_SUBMIT_SUCCESS':
        case 'ROUTE_SUBMIT_FAILURE':
            return Object.assign({}, state, { formSubmitting: false })
        case 'HASH_CHANGE':
            return Object.assign({}, state, { routeHash: action.hash })
        default:
            return state
    }
}

export default combineReducers({ locations, currentLocation, ui, message })
