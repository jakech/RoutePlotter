export function parseWayPts(data) {
    return data.reduce(
        (result, tuple, index) => {
            const latLng = { lat: +tuple[0], lng: +tuple[1] }
            if (index === 0) {
                result.origin = latLng
            } else if (index === data.length - 1) {
                result.dest = latLng
            } else {
                result.wayPts.push({
                    location: latLng,
                    stopover: true
                })
            }
            return result
        },
        { origin: null, wayPts: [], dest: null }
    )
}

export function processInput(string) {
    const result = { success: true }
    const data = []

    const lines = string.trim().split('\n').filter(l => l) // remove empty lines

    // if (lines.length < 2) {
    //     result.success = false
    //     return result
    // }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        var latLng = line.replace(/\s/g, '').split(',')

        // check it is a tuple
        if (latLng.length !== 2) {
            result.success = false
            break
        }

        // check for empty items
        if (latLng[0].trim() === '' || latLng[1].trim() === '') {
            result.success = false
            break
        }

        // check both are number
        if (isNaN(+latLng[0]) || isNaN(+latLng[1])) {
            result.success = false
            break
        }

        data.push(latLng)
    }

    if (result.success) result.data = data

    return result
}

export const delay = t => new Promise(r => setTimeout(r, t))

// This helper function decorate any promise returning function
// to retry based on condition provided by shouldRetry func
// it will reject after retrying "max" times without shouldRetry returning true
//
// func: function that return a Promise
// max: maximum time to retry
// interval: time between retries
// shouldRetry: function, should return a boolean. true means to retry
//
export const makeRetryFunc = ({
    func,
    max = 10,
    interval = 1000,
    shouldRetry
}) => (...arg) => {
    const makeCall = () => {
        if (max === 0) throw new Error('exceeded retries')
        max--
        return func.apply(this, [...arg]).then(response => {
            if (shouldRetry.call(this, response)) {
                return delay(interval).then(makeCall)
            } else {
                return response
            }
        })
    }
    return makeCall()
}
