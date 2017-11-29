import reducer from './locationsReducer.js'

fdescribe('location reducer', () => {
    const mockLoc = {
        id: 0,
        lat: 22.32816440605653,
        lng: 114.12700653076172,
        address: 'Tsing Sha Hwy, Stonecutters Island, Hong Kong'
    }
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual([])
    })

    it('should handle ADD_LOCATION', () => {
        expect(
            reducer([], Object.assign({}, mockLoc, { type: 'ADD_LOCATION' }))
        ).toEqual([Object.assign({}, mockLoc)])
    })

    it('should handle REMOVE_LOCATION', () => {
        expect(
            reducer([mockLoc], {
                type: 'REMOVE_LOCATION',
                id: mockLoc.id
            })
        ).toEqual([])
    })
})
