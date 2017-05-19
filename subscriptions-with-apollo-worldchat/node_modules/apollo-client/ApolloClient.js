var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { createNetworkInterface, } from './transport/networkInterface';
import { createApolloStore, createApolloReducer, } from './store';
import { QueryManager, } from './core/QueryManager';
import { isProduction, } from './util/environment';
import { storeKeyNameFromFieldNameAndArgs, } from './data/storeUtils';
import { version, } from './version';
var DEFAULT_REDUX_ROOT_KEY = 'apollo';
function defaultReduxRootSelector(state) {
    return state[DEFAULT_REDUX_ROOT_KEY];
}
var ApolloClient = (function () {
    function ApolloClient(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.middleware = function () {
            return function (store) {
                _this.setStore(store);
                return function (next) { return function (action) {
                    var previousApolloState = _this.queryManager.selectApolloState(store);
                    var returnValue = next(action);
                    var newApolloState = _this.queryManager.selectApolloState(store);
                    if (newApolloState !== previousApolloState) {
                        _this.queryManager.broadcastNewStore(store.getState());
                    }
                    if (_this.devToolsHookCb) {
                        _this.devToolsHookCb({
                            action: action,
                            state: _this.queryManager.getApolloState(),
                            dataWithOptimisticResults: _this.queryManager.getDataWithOptimisticResults(),
                        });
                    }
                    return returnValue;
                }; };
            };
        };
        var networkInterface = options.networkInterface, reduxRootKey = options.reduxRootKey, reduxRootSelector = options.reduxRootSelector, initialState = options.initialState, dataIdFromObject = options.dataIdFromObject, resultComparator = options.resultComparator, _a = options.ssrMode, ssrMode = _a === void 0 ? false : _a, _b = options.ssrForceFetchDelay, ssrForceFetchDelay = _b === void 0 ? 0 : _b, _c = options.addTypename, addTypename = _c === void 0 ? true : _c, resultTransformer = options.resultTransformer, customResolvers = options.customResolvers, connectToDevTools = options.connectToDevTools, _d = options.queryDeduplication, queryDeduplication = _d === void 0 ? false : _d;
        if (reduxRootKey && reduxRootSelector) {
            throw new Error('Both "reduxRootKey" and "reduxRootSelector" are configured, but only one of two is allowed.');
        }
        if (reduxRootKey) {
            console.warn('"reduxRootKey" option is deprecated and might be removed in the upcoming versions, ' +
                'please use the "reduxRootSelector" instead.');
            this.reduxRootKey = reduxRootKey;
        }
        if (!reduxRootSelector && reduxRootKey) {
            this.reduxRootSelector = function (state) { return state[reduxRootKey]; };
        }
        else if (typeof reduxRootSelector === 'string') {
            this.reduxRootKey = reduxRootSelector;
            this.reduxRootSelector = function (state) { return state[reduxRootSelector]; };
        }
        else if (typeof reduxRootSelector === 'function') {
            this.reduxRootSelector = reduxRootSelector;
        }
        else {
            this.reduxRootSelector = null;
        }
        this.initialState = initialState ? initialState : {};
        this.networkInterface = networkInterface ? networkInterface :
            createNetworkInterface({ uri: '/graphql' });
        this.addTypename = addTypename;
        if (resultTransformer) {
            console.warn('"resultTransformer" is being considered for deprecation in an upcoming version. ' +
                'If you are using it, please file an issue on apollostack/apollo-client ' +
                'with a description of your use-case');
        }
        this.resultTransformer = resultTransformer;
        this.resultComparator = resultComparator;
        this.shouldForceFetch = !(ssrMode || ssrForceFetchDelay > 0);
        this.dataId = dataIdFromObject;
        this.fieldWithArgs = storeKeyNameFromFieldNameAndArgs;
        this.queryDeduplication = queryDeduplication;
        if (ssrForceFetchDelay) {
            setTimeout(function () { return _this.shouldForceFetch = true; }, ssrForceFetchDelay);
        }
        this.reducerConfig = {
            dataIdFromObject: dataIdFromObject,
            customResolvers: customResolvers,
        };
        this.watchQuery = this.watchQuery.bind(this);
        this.query = this.query.bind(this);
        this.mutate = this.mutate.bind(this);
        this.setStore = this.setStore.bind(this);
        this.resetStore = this.resetStore.bind(this);
        var defaultConnectToDevTools = !isProduction() &&
            typeof window !== 'undefined' && (!window.__APOLLO_CLIENT__);
        if (typeof connectToDevTools === 'undefined' ? defaultConnectToDevTools : connectToDevTools) {
            window.__APOLLO_CLIENT__ = this;
        }
        this.version = version;
    }
    ApolloClient.prototype.watchQuery = function (options) {
        this.initStore();
        if (!this.shouldForceFetch && options.forceFetch) {
            options = __assign({}, options, { forceFetch: false });
        }
        return this.queryManager.watchQuery(options);
    };
    ;
    ApolloClient.prototype.query = function (options) {
        this.initStore();
        if (!this.shouldForceFetch && options.forceFetch) {
            options = __assign({}, options, { forceFetch: false });
        }
        return this.queryManager.query(options);
    };
    ;
    ApolloClient.prototype.mutate = function (options) {
        this.initStore();
        return this.queryManager.mutate(options);
    };
    ;
    ApolloClient.prototype.subscribe = function (options) {
        this.initStore();
        var realOptions = __assign({}, options, { document: options.query });
        delete realOptions.query;
        return this.queryManager.startGraphQLSubscription(realOptions);
    };
    ApolloClient.prototype.reducer = function () {
        return createApolloReducer(this.reducerConfig);
    };
    ApolloClient.prototype.__actionHookForDevTools = function (cb) {
        this.devToolsHookCb = cb;
    };
    ApolloClient.prototype.initStore = function () {
        var _this = this;
        if (this.store) {
            return;
        }
        if (this.reduxRootSelector) {
            throw new Error('Cannot initialize the store because "reduxRootSelector" or "reduxRootKey" is provided. ' +
                'They should only be used when the store is created outside of the client. ' +
                'This may lead to unexpected results when querying the store internally. ' +
                "Please remove that option from ApolloClient constructor.");
        }
        this.setStore(createApolloStore({
            reduxRootKey: DEFAULT_REDUX_ROOT_KEY,
            initialState: this.initialState,
            config: this.reducerConfig,
            logger: function (store) { return function (next) { return function (action) {
                var result = next(action);
                if (_this.devToolsHookCb) {
                    _this.devToolsHookCb({
                        action: action,
                        state: _this.queryManager.getApolloState(),
                        dataWithOptimisticResults: _this.queryManager.getDataWithOptimisticResults(),
                    });
                }
                return result;
            }; }; },
        }));
        this.reduxRootKey = DEFAULT_REDUX_ROOT_KEY;
    };
    ;
    ApolloClient.prototype.resetStore = function () {
        if (this.queryManager) {
            this.queryManager.resetStore();
        }
    };
    ;
    ApolloClient.prototype.getInitialState = function () {
        this.initStore();
        return this.queryManager.getInitialState();
    };
    ApolloClient.prototype.setStore = function (store) {
        var reduxRootSelector;
        if (this.reduxRootSelector) {
            reduxRootSelector = this.reduxRootSelector;
        }
        else {
            reduxRootSelector = defaultReduxRootSelector;
            this.reduxRootKey = DEFAULT_REDUX_ROOT_KEY;
        }
        if (typeof reduxRootSelector(store.getState()) === 'undefined') {
            throw new Error('Existing store does not use apolloReducer. Please make sure the store ' +
                'is properly configured and "reduxRootSelector" is correctly specified.');
        }
        this.store = store;
        this.queryManager = new QueryManager({
            networkInterface: this.networkInterface,
            reduxRootSelector: reduxRootSelector,
            store: store,
            addTypename: this.addTypename,
            resultTransformer: this.resultTransformer,
            resultComparator: this.resultComparator,
            reducerConfig: this.reducerConfig,
            queryDeduplication: this.queryDeduplication,
        });
    };
    ;
    return ApolloClient;
}());
export default ApolloClient;
//# sourceMappingURL=ApolloClient.js.map