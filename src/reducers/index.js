import { combineReducers } from 'redux'
import message from './messageReducer.js'
import locations from './locationsReducer.js'

const currentLocation = (state = null, action) => {
    switch (action.type) {
        case 'SELECT_LOCATION':
            return {
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

const routeInfo = (state = null, action) => {
    const struct = { route: [], distance: 0, time: 0 }
    switch (action.type) {
        case 'ROUTE_INFO_SUCCESS': {
            const {
                path: route,
                total_distance: distance,
                total_time: time
            } = action.payload
            return Object.assign({}, struct, { route, distance, time })
        }
        case 'ROUTE_INFO_CLEAR':
            return null
        default:
            return state
    }
}

export default combineReducers({
    locations,
    currentLocation,
    ui,
    message,
    routeInfo
})
