import { applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import { clearMessage } from '../actions'

import Noty from 'noty'

function hashRouteMiddleware(store) {
    const handleHashChange = () => {
        const hash = window.location.hash.substr(1)
        store.dispatch({ type: 'HASH_CHANGE', hash })
    }
    window.onhashchange = handleHashChange
    handleHashChange()
    return next => action => {
        if (action.type === 'HASH_CHANGE') {
            window.location.hash = action.hash
        }
        return next(action)
    }
}

function notyMiddleware(store) {
    let n
    function handleClose(notyInstance) {
        return () => {
            notyInstance === n && store.dispatch(clearMessage())
        }
    }
    return next => action => {
        const { message: prevMessage } = store.getState()
        next(action)
        const { message: nextMessage } = store.getState()

        if (prevMessage === nextMessage) return

        n && n.close()
        if (nextMessage.text !== '') {
            n = new Noty(nextMessage)
            n.on('afterClose', handleClose(n))
            n.show()
        }
    }
}

let middlewares = [thunk, hashRouteMiddleware, notyMiddleware]

if (process.env.NODE_ENV === 'development') {
    middlewares = [...middlewares, logger]
}

export default applyMiddleware(...middlewares)
