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

export default locations
