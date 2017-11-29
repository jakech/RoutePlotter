import humanFormat from 'human-format'
const initMsgState = { text: '', type: 'alert' }
const message = (state = initMsgState, action) => {
    switch (action.type) {
        case 'ROUTE_SUBMIT_FAILURE':
            return { type: 'error', text: action.text, timeout: 1000 }
        case 'ROUTE_INFO_REQUEST':
            return { type: 'info', text: 'Processing route...' }
        case 'ROUTE_INFO_FAILURE':
            return { type: 'error', text: action.text, timeout: 1000 }
        case 'ROUTE_INFO_SUCCESS': {
            const distFormatted = humanFormat(
                action.payload['total_distance'],
                {
                    unit: 'm',
                    prefix: 'k'
                }
            )
            const timeFormatted = humanFormat(action.payload['total_time'], {
                scale: new humanFormat.Scale({
                    seconds: 1,
                    minutes: 60,
                    hours: 3600
                })
            })
            return {
                type: 'alert',
                text: `Distance: ${distFormatted} Time: ${timeFormatted}`
            }
        }
        case 'MESSAGE_CLEAR':
            return initMsgState
        default:
            return state
    }
}

export default message
