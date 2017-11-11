import axios from 'axios'
import { makeRetryFunc } from './utils.js'

export const generateRoute = data => {
    // data is an array of arrays
    return axios.post('/route', {
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data)
    })
}

export const fetchRoute = token => {
    const get = makeRetryFunc({
        func: axios.get.bind(axios),
        shouldRetry: ({ data }) => data.status === 'in progress'
    })
    return get(`/route/${token}`).then(({ data }) => {
        if (data.status === 'failure') throw new Error(data.error)
        return data
    })
}
