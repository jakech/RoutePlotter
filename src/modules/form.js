import Noty from 'noty'
import { generateRoute } from '../api.js'
import { processInput } from '../utils.js'

const BTN_TEXT_LOADING = 'Generating route...'
const BTN_TEXT_DEFAULT = 'Plot route'

let $form, $input, $btn, $noty

export const init = map => {
    $noty = new Noty({ type: 'error', timeout: 1000 })
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
        if (success) {
            $btn.setAttribute('disabled', true)
            $btn.innerHTML = BTN_TEXT_LOADING
            try {
                const res = await generateRoute(data)
                if (res.data.token) {
                    window.location.hash = res.data.token
                } else {
                    throw new Error('no token')
                }
            } catch (error) {
                $noty.setText(error, true).show()
            } finally {
                $btn.innerHTML = BTN_TEXT_DEFAULT
                $btn.removeAttribute('disabled')
            }
        } else {
            $noty.setText('input error', true).show()
        }
    }
}
