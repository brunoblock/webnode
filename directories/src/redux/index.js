import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import promise from 'redux-promise';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducer from 'redux/reducers';
import epics from './epics';
import { peerReceive } from './api';

const epicMiddleware = createEpicMiddleware(epics, {
  dependencies: {
    peerReceive
  }
})

const loggerMiddleware = createLogger();

const middlewares = [epicMiddleware, loggerMiddleware, promise];
const storeEnhancer = [applyMiddleware(...middlewares)];

const persistConfig = {
  key: 'directories',
  storage
};

export const store = createStore(
  persistReducer(persistConfig, reducer),
  compose(...storeEnhancer)
);

export const persistor = persistStore(store);
