import axios from 'axios'
import { makeRetryFunc } from './utils.js'

/* global SERVICE_URL */
const service = axios.create({
    baseURL: SERVICE_URL,
    headers: { 'Content-Type': 'application/json' }
})

export const generateRoute = data => {
    // data is an array of arrays
    return service.post('/route', JSON.stringify(data))
}

export const fetchRoute = token => {
    const get = makeRetryFunc({
        func: service.get.bind(service),
        shouldRetry: ({ data }) => data.status === 'in progress'
    })
    return get(`/route/${token}`).then(({ data }) => {
        if (data.status === 'failure') throw new Error(data.error)
        return data
    })
}
