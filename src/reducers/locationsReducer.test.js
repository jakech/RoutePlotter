import reducer from './locationsReducer.js'

fdescribe('location reducer', () => {
    const mockLoc = {
        id: 0,
        lat: 22.32816440605653,
        lng: 114.12700653076172,
        address: 'Tsing Sha Hwy, Stonecutters Island, Hong Kong'
    }
    const mockLoc2 = {
        id: 1,
        lat: 22.347217992714814,
        lng: 114.10125732421875,
        address: '22 Tsing Chin St, Tsing Yi, Hong Kong'
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

    it('should handle LOCATION_MOVE', () => {
        expect.assertions(2)
        const state = [mockLoc, mockLoc2]
        const expectedState = [mockLoc2, mockLoc]

        expect(
            reducer(state, { type: 'LOCATION_MOVE', id: 1, dir: 'up' })
        ).toEqual(expectedState)

        expect(
            reducer(state, { type: 'LOCATION_MOVE', id: 0, dir: 'down' })
        ).toEqual(expectedState)
    })
})
