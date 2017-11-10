const { parseWayPts, processInput } = require('./utils.js')

const userInput = `
    37.86893429,-122.2678041
    37.89132957,-122.2798893
    37.87041074,-122.2658093
    37.87830521,-122.2691698
`

const routeData = [
    ['37.86893429', '-122.2678041'],
    ['37.89132957', '-122.2798893'],
    ['37.87041074', '-122.2658093'],
    ['37.87830521', '-122.2691698']
]

test('parseWayPts', () => {

    const expectedWayPts = {
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
    expect(parseWayPts(routeData)).toEqual(expectedWayPts)
})

describe('processInput', () => {
    it('should return an obj with a success prop', () => {
        expect(processInput('dummy')).toEqual(expect.objectContaining({
            success: expect.any(Boolean)
        }))
    })

    it('should return success false with bad input', () => {
        expect(processInput('dummy')).toEqual(expect.objectContaining({
            success: false
        }))
    })

    it('should return success with good input', () => {
        expect(processInput(userInput)).toEqual(expect.objectContaining({
            success: true
        }))
    })

    it('should return data with good input', () => {
        expect(processInput(userInput)).toEqual(expect.objectContaining({
            data: routeData
        }))
    })
})
