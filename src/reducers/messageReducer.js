const initMsgState = { text: '', type: 'alert' }
const message = (state = initMsgState, action) => {
    switch (action.type) {
        case 'ROUTE_SUBMIT_FAILURE':
            return { type: 'error', text: action.text, timeout: 1000 }
        case 'ROUTE_INFO_REQUEST':
            return { type: 'info', text: 'Processing route...' }
        case 'ROUTE_INFO_FAILURE':
            return { type: 'error', text: action.text, timeout: 1000 }
        case 'ROUTE_INFO_SUCCESS':
            return initMsgState
        case 'MESSAGE_CLEAR':
            return initMsgState
        default:
            return state
    }
}

export default message
