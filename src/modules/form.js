import Noty from 'noty'
import { generateRoute } from '../api.js'
import { processInput } from '../utils.js'

import formTemplate from '../templates/form.js'

const BTN_TEXT_LOADING = 'Generating route...'
const BTN_TEXT_DEFAULT = 'Plot route'

let $form, $input, $btn

export const init = map => {
    $form = document.createElement('div')
    $form.innerHTML = formTemplate()
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
        if (success && data.length >= 2) {
            $btn.setAttribute('disabled', true)
            $btn.innerHTML = BTN_TEXT_LOADING
            try {
                const res = await generateRoute(data)
                window.location.hash = res.data.token
            } catch (error) {
                new Noty({ text: error.message, type: 'error', timeout: 1000}).show()
            } finally {
                $btn.innerHTML = BTN_TEXT_DEFAULT
                $btn.removeAttribute('disabled')
            }
        } else {
            new Noty({ text: 'Invalid input', type: 'error', timeout: 1000}).show()
        }
    }
}

export function addToRoute(coords) {
    if ($input.value !== '' && $input.value.slice(-1) !== '\n') {
        $input.value += '\n'
    }
    $input.value += `${coords.lat},${coords.lng}\n`
}
