import { applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

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

let middlewares = [thunk, hashRouteMiddleware]

if (process.env.NODE_ENV === 'development') {
    middlewares = [...middlewares, logger]
}

export default applyMiddleware(...middlewares)
