import * as api from '../api'
let incLocationID = 0

export const addLocation = ({ lat, lng, address }) => ({
    type: 'ADD_LOCATION',
    id: incLocationID++,
    lat,
    lng,
    address
})

export const selectLocation = ({ lat, lng, address }, geocode) => {
    console.log(address)
    if (address !== undefined) {
        return {
            type: 'SELECT_LOCATION',
            lat,
            lng,
            address
        }
    }
    return async dispatch => {
        try {
            const [result, status] = await geocode({
                location: { lat, lng }
            })
            switch (status) {
                case 'OK':
                    dispatch({
                        type: 'SELECT_LOCATION',
                        lat,
                        lng,
                        address: result[0].formatted_address
                    })
                    break
                case 'ZERO_RESULTS':
                    dispatch({
                        type: 'SELECT_LOCATION',
                        lat,
                        lng,
                        address: 'Unknown address'
                    })
                    break
                default:
                    throw new Error('api error', status)
            }
        } catch (e) {
            console.log('geocode error selectLocation', e)
        }
    }
}

export const unselectLocation = () => ({
    type: 'UNSELECT_LOCATION'
})

export const removeLocation = id => ({
    type: 'REMOVE_LOCATION',
    id
})

export const submitRoute = locations => async dispatch => {
    dispatch({
        type: 'ROUTE_SUBMIT_REQUEST'
    })
    try {
        const res = await api.generateRoute(locations)
        dispatch({
            type: 'ROUTE_SUBMIT_SUCCESS',
            token: res.data.token
        })
    } catch (error) {
        dispatch({
            type: 'ROUTE_SUBMIT_FAILURE',
            text: error.message,
            messageType: 'error'
        })
    }
}
