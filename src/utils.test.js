const { parseWayPts, processInput, makeRetryFunc } = require('./utils.js')

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
        expect(processInput('dummy')).toEqual(
            expect.objectContaining({
                success: expect.any(Boolean)
            })
        )
    })

    it('should return success false with bad input', () => {
        expect(processInput('dummy')).toEqual(
            expect.objectContaining({
                success: false
            })
        )
    })

    it('should return success with good input', () => {
        expect(processInput(userInput)).toEqual(
            expect.objectContaining({
                success: true
            })
        )
    })

    it('remove whitespaces', () => {
        const inputWhiteSpace = `

            37.89132957,-122.2798893

            37.87041074,-122.2658093
        `
        expect(processInput(inputWhiteSpace)).toEqual(
            expect.objectContaining({
                success: true
            })
        )
    })

    it('empty lat lng', () => {
        expect.assertions(2)
        expect(processInput(`,-122.2658093`)).toEqual(
            expect.objectContaining({
                success: false
            })
        )
        expect(processInput(`37.89132957,`)).toEqual(
            expect.objectContaining({
                success: false
            })
        )
    })

    it('should return data with good input', () => {
        expect(processInput(userInput)).toEqual(
            expect.objectContaining({
                data: routeData
            })
        )
    })
})

describe('makeRetryFunc', () => {
    let promiseFunc, makeRetryFuncOpts, ranNum

    beforeEach(() => {
        promiseFunc = jest.fn(() => {
            return new Promise(r => setTimeout(() => r('done'), 500))
        })

        makeRetryFuncOpts = {
            func: promiseFunc,
            max: 3,
            interval: 100,
            shouldRetry: () => true
        }

        ranNum = Math.floor(Math.random()*9) + 1 // 1 - 10
    })

    it('return a function', () => {
        expect(makeRetryFunc(makeRetryFuncOpts)).toEqual(expect.any(Function))
    })

    it('reject promise after "max" number of retries', async () => {
        expect.assertions(2)
        const refunc = makeRetryFunc(makeRetryFuncOpts)
        try {
            await refunc()
        } catch (e) {
            expect(e).toEqual(new Error('exceeded retries'))
        }

        expect(makeRetryFuncOpts.func).toHaveBeenCalledTimes(3)
    })

    describe('shouldRetry', () => {
        it('should be called with resolved result', async () => {
            const shouldRetry = jest.fn(() => false)
            const refunc = makeRetryFunc(
                Object.assign({}, makeRetryFuncOpts, {
                    shouldRetry
                })
            )

            await refunc()

            expect(shouldRetry).toBeCalledWith('done')
        })

        it('control when to stop', async () => {
            let count = 0
            const shouldRetry = jest.fn(() => {
                count++
                return count < ranNum
            })
            const refunc = makeRetryFunc(
                Object.assign({}, makeRetryFuncOpts, {
                    shouldRetry,
                    max: 11
                })
            )

            await refunc()

            expect(makeRetryFuncOpts.func).toHaveBeenCalledTimes(ranNum)
        })
    })
})
