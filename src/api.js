import axios from 'axios'

export const generateRoute = data => {
    // data is an array of arrays
    console.log(data)
    return axios({
        method: 'post',
        url: '/route',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data)
    })
}

export const fetchRoute = token => {
    return axios.get(`/route/${token}`).then(r => r.data)
}
