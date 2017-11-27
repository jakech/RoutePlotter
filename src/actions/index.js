let incLocationID = 0

export const addLocation = ({ lat, lng, address }) => ({
    type: 'ADD_LOCATION',
    id: incLocationID++,
    lat,
    lng,
    address
})

export const selectLocation = ({ lat, lng }, geocode) => async dispatch => {
    try {
        const [result, status] = await geocode({
            location: { lat, lng }
        })
        if (status === 'OK' || status === 'ZERO_RESULTS') {
            dispatch({
                type: 'SELECT_LOCATION',
                lat,
                lng,
                address: result[0].formatted_address
            })
        } else {
            throw new Error('api error', status)
        }
    } catch (e) {
        console.log('geocode error selectLocation', e)
    }
}

export const unselectLocation = () => ({
    type: 'UNSELECT_LOCATION'
})

export const removeLocation = (id) => ({
    type: 'REMOVE_LOCATION',
    id
})
