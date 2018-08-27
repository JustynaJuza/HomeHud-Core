import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, Store, StoreEnhancerStoreCreator, ReducersMapObject } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
//import * as StoreModule from './store';
//import { ApplicationState, reducers } from './store';
import { History } from 'history';

import { reducers } from './store/reducers';
import { IAppState } from './store/state';

export default function configureStore(history: History, initialState?: IAppState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__ as () => GenericStoreEnhancer;
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk, routerMiddleware(history)),
        devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);
    const store = (<any>createStoreWithMiddleware)(allReducers, initialState) as Store<IAppState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./state/reducers', () => {
            const nextRootReducer = require<typeof reducers>('./state/reducers');
            store.replaceReducer(buildRootReducer(reducers));
        });
    }

    return store;
}

function buildRootReducer(allReducers: ReducersMapObject) {
    return combineReducers<IAppState>(Object.assign({}, allReducers, { routing: routerReducer }));
}
