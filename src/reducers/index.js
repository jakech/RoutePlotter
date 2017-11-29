import { combineReducers } from 'redux'
import humanFormat from 'human-format'

function swapItems(array, i, j) {
    const results = array.slice()
    const temp = array[i]
    results[i] = array[j]
    results[j] = temp

    return results
}

function findIndex(array, id) {
    return array.reduce((ret, loc, i) => {
        if (loc.id === id) return i
        else return ret
    }, -1)
}

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
        case 'LOCATION_MOVE': {
            const indexFrom = findIndex(state, action.id)
            let indexTo
            if (action.dir === 'up') indexTo = indexFrom - 1
            else if (action.dir === 'down') indexTo = indexFrom + 1
            if (indexTo < 0 || indexTo > state.length - 1) {
                return state
            }

            return swapItems(state, indexFrom, indexTo)
        }
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
const initMsgState = { text: '', type: 'alert' }
const message = (state = initMsgState, action) => {
    switch (action.type) {
        case 'ROUTE_SUBMIT_FAILURE':
            return { type: 'error', text: action.text, timeout: 1000 }
        case 'ROUTE_INFO_REQUEST':
            return { type: 'info', text: 'Processing route...' }
        case 'ROUTE_INFO_FAILURE':
            return { type: 'error', text: action.text, timeout: 1000 }
        case 'ROUTE_INFO_SUCCESS': {
            const distFormatted = humanFormat(
                action.payload['total_distance'],
                {
                    unit: 'm',
                    prefix: 'k'
                }
            )
            const timeFormatted = humanFormat(action.payload['total_time'], {
                scale: new humanFormat.Scale({
                    seconds: 1,
                    minutes: 60,
                    hours: 3600
                })
            })
            return {
                type: 'alert',
                text: `Distance: ${distFormatted} Time: ${timeFormatted}`
            }
        }
        case 'MESSAGE_CLEAR':
            return initMsgState
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
