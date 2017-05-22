var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { isQueryInitAction, isQueryResultAction, isQueryErrorAction, isQueryResultClientAction, isQueryStopAction, isStoreResetAction, } from '../actions';
import { graphQLResultHasError, } from '../data/storeUtils';
import { isEqual } from '../util/isEqual';
import { NetworkStatus } from './networkStatus';
export function queries(previousState, action) {
    if (previousState === void 0) { previousState = {}; }
    if (isQueryInitAction(action)) {
        var newState = __assign({}, previousState);
        var previousQuery = previousState[action.queryId];
        if (previousQuery && previousQuery.queryString !== action.queryString) {
            throw new Error('Internal Error: may not update existing query string in store');
        }
        var isSetVariables = false;
        var previousVariables = null;
        if (action.storePreviousVariables &&
            previousQuery &&
            previousQuery.networkStatus !== NetworkStatus.loading) {
            if (!isEqual(previousQuery.variables, action.variables)) {
                isSetVariables = true;
                previousVariables = previousQuery.variables;
            }
        }
        var newNetworkStatus = NetworkStatus.loading;
        if (isSetVariables) {
            newNetworkStatus = NetworkStatus.setVariables;
        }
        else if (action.isPoll) {
            newNetworkStatus = NetworkStatus.poll;
        }
        else if (action.isRefetch) {
            newNetworkStatus = NetworkStatus.refetch;
        }
        else if (action.isPoll) {
            newNetworkStatus = NetworkStatus.poll;
        }
        newState[action.queryId] = {
            queryString: action.queryString,
            document: action.document,
            variables: action.variables,
            previousVariables: previousVariables,
            networkError: null,
            graphQLErrors: [],
            networkStatus: newNetworkStatus,
            lastRequestId: action.requestId,
            metadata: action.metadata,
        };
        if (typeof action.fetchMoreForQueryId === 'string') {
            newState[action.fetchMoreForQueryId] = __assign({}, previousState[action.fetchMoreForQueryId], { networkStatus: NetworkStatus.fetchMore });
        }
        return newState;
    }
    else if (isQueryResultAction(action)) {
        if (!previousState[action.queryId]) {
            return previousState;
        }
        if (action.requestId < previousState[action.queryId].lastRequestId) {
            return previousState;
        }
        var newState = __assign({}, previousState);
        var resultHasGraphQLErrors = graphQLResultHasError(action.result);
        newState[action.queryId] = __assign({}, previousState[action.queryId], { networkError: null, graphQLErrors: resultHasGraphQLErrors ? action.result.errors : [], previousVariables: null, networkStatus: NetworkStatus.ready });
        if (typeof action.fetchMoreForQueryId === 'string') {
            newState[action.fetchMoreForQueryId] = __assign({}, previousState[action.fetchMoreForQueryId], { networkStatus: NetworkStatus.ready });
        }
        return newState;
    }
    else if (isQueryErrorAction(action)) {
        if (!previousState[action.queryId]) {
            return previousState;
        }
        if (action.requestId < previousState[action.queryId].lastRequestId) {
            return previousState;
        }
        var newState = __assign({}, previousState);
        newState[action.queryId] = __assign({}, previousState[action.queryId], { networkError: action.error, networkStatus: NetworkStatus.error });
        if (typeof action.fetchMoreForQueryId === 'string') {
            newState[action.fetchMoreForQueryId] = __assign({}, previousState[action.fetchMoreForQueryId], { networkError: action.error, networkStatus: NetworkStatus.error });
        }
        return newState;
    }
    else if (isQueryResultClientAction(action)) {
        if (!previousState[action.queryId]) {
            return previousState;
        }
        var newState = __assign({}, previousState);
        newState[action.queryId] = __assign({}, previousState[action.queryId], { networkError: null, previousVariables: null, networkStatus: action.complete ? NetworkStatus.ready : NetworkStatus.loading });
        return newState;
    }
    else if (isQueryStopAction(action)) {
        var newState = __assign({}, previousState);
        delete newState[action.queryId];
        return newState;
    }
    else if (isStoreResetAction(action)) {
        return resetQueryState(previousState, action);
    }
    return previousState;
}
function resetQueryState(state, action) {
    var observableQueryIds = action.observableQueryIds;
    var newQueries = Object.keys(state).filter(function (queryId) {
        return (observableQueryIds.indexOf(queryId) > -1);
    }).reduce(function (res, key) {
        res[key] = __assign({}, state[key], { networkStatus: NetworkStatus.loading });
        return res;
    }, {});
    return newQueries;
}
//# sourceMappingURL=store.js.map