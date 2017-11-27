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
        case 'CLEAR_ALL_LOCATION':
            return []
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

export default combineReducers({ locations, currentLocation })
