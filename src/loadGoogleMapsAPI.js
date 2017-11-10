import { GOOGLE_MAPS_API_URL, GOOGLE_MAPS_API_KEY } from '../config.js'
const CALLBACK_NAME = '__gmap_callback'
const TIMEOUT = 5000

module.exports = () =>
    new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Could not load the Google Maps API'))
        }, TIMEOUT)

        window[CALLBACK_NAME] = () => {
            if (timeout !== null) clearTimeout(timeout)
            resolve(window.google.maps)
            delete window[CALLBACK_NAME]
        }

        const script = document.createElement('script')
        script.src = `${GOOGLE_MAPS_API_URL}?key=${GOOGLE_MAPS_API_KEY}&callback=${CALLBACK_NAME}`
        document.body.appendChild(script)
    })
