import { createStore, applyMiddleware, compose } from "redux";
// To handle async actions (like API calls) in store
import thunk from "redux-thunk";
import reducers from "../reducers";

const initialState = {};

const configureStore = () =>
    createStore(
        reducers,
        initialState,
        // Apply thunk middleware and add support for Redux dev tools in Google Chrome
        process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION__
            ? compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
            : applyMiddleware(thunk)
    );

export default configureStore;
