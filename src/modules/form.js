import { generateRoute } from '../api.js'
import { processInput } from '../utils.js'

const BTN_TEXT_LOADING = 'Generating route...'
const BTN_TEXT_DEFAULT = 'Plot route'

let tokenCallback, $form, $input, $btn

export const init = (map, onReceiveToken) => {
    tokenCallback = onReceiveToken
    $form = document.getElementById('form')
    $input = $form.querySelector('textarea')
    $btn = $form.querySelector('button')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push($form)
    $form.addEventListener('submit', handleFormSubmit)
    return $form
}

async function handleFormSubmit(e) {
    e.preventDefault()
    const value = $input.value.trim()
    if (value) {
        const { success, data } = processInput(value)
        console.log(data)
        if (success) {
            $btn.setAttribute('disabled', true)
            $btn.innerHTML = BTN_TEXT_LOADING
            try {
                const res = await generateRoute(data)
                tokenCallback(res.data.token)
                $btn.innerHTML = BTN_TEXT_DEFAULT
            } catch (error) {
                console.log('api error', error)
            } finally {
                $btn.removeAttribute('disabled')
            }
        } else {
            console.log('input error')
        }
    }
}
