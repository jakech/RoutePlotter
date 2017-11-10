const { parseWayPts } = require('./utils.js')

const routeData = [
    ['37.86893429', '-122.2678041'],
    ['37.89132957', '-122.2798893'],
    ['37.87041074', '-122.2658093'],
    ['37.87830521', '-122.2691698']
]

const expected = {
    origin: { lat: 37.86893429, lng: -122.2678041 },
    wayPts: [
        {
            location: { lat: 37.89132957, lng: -122.2798893 },
            stopover: true
        },
        {
            location: { lat: 37.87041074, lng: -122.2658093 },
            stopover: true
        }
    ],
    dest: { lat: 37.87830521, lng: -122.2691698 }
}

test('parseWayPts', () => {
    expect(parseWayPts(routeData)).toEqual(expected)
})
