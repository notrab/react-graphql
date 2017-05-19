var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { isQueryResultAction, isMutationResultAction, isUpdateQueryResultAction, isStoreResetAction, isSubscriptionResultAction, } from '../actions';
import { writeResultToStore, } from './writeToStore';
import { getOperationName, } from '../queries/getFromAST';
import { graphQLResultHasError, } from './storeUtils';
import { replaceQueryResults, } from './replaceQueryResults';
import { readQueryFromStore, } from './readFromStore';
import { tryFunctionOrLogError, } from '../util/errorHandling';
export function data(previousState, action, queries, mutations, config) {
    if (previousState === void 0) { previousState = {}; }
    var constAction = action;
    if (isQueryResultAction(action)) {
        if (!queries[action.queryId]) {
            return previousState;
        }
        if (action.requestId < queries[action.queryId].lastRequestId) {
            return previousState;
        }
        if (!graphQLResultHasError(action.result)) {
            var queryStoreValue = queries[action.queryId];
            var clonedState = __assign({}, previousState);
            var newState_1 = writeResultToStore({
                result: action.result.data,
                dataId: 'ROOT_QUERY',
                document: action.document,
                variables: queryStoreValue.variables,
                store: clonedState,
                dataIdFromObject: config.dataIdFromObject,
            });
            if (action.extraReducers) {
                action.extraReducers.forEach(function (reducer) {
                    newState_1 = reducer(newState_1, constAction);
                });
            }
            return newState_1;
        }
    }
    else if (isSubscriptionResultAction(action)) {
        if (!graphQLResultHasError(action.result)) {
            var clonedState = __assign({}, previousState);
            var newState_2 = writeResultToStore({
                result: action.result.data,
                dataId: 'ROOT_SUBSCRIPTION',
                document: action.document,
                variables: action.variables,
                store: clonedState,
                dataIdFromObject: config.dataIdFromObject,
            });
            if (action.extraReducers) {
                action.extraReducers.forEach(function (reducer) {
                    newState_2 = reducer(newState_2, constAction);
                });
            }
            return newState_2;
        }
    }
    else if (isMutationResultAction(constAction)) {
        if (!constAction.result.errors) {
            var queryStoreValue = mutations[constAction.mutationId];
            var clonedState = __assign({}, previousState);
            var newState_3 = writeResultToStore({
                result: constAction.result.data,
                dataId: 'ROOT_MUTATION',
                document: constAction.document,
                variables: queryStoreValue.variables,
                store: clonedState,
                dataIdFromObject: config.dataIdFromObject,
            });
            var updateQueries_1 = constAction.updateQueries;
            if (updateQueries_1) {
                Object.keys(updateQueries_1).forEach(function (queryId) {
                    var query = queries[queryId];
                    if (!query) {
                        return;
                    }
                    var currentQueryResult = readQueryFromStore({
                        store: previousState,
                        query: query.document,
                        variables: query.variables,
                        returnPartialData: true,
                        config: config,
                    });
                    var reducer = updateQueries_1[queryId];
                    var nextQueryResult = tryFunctionOrLogError(function () { return reducer(currentQueryResult, {
                        mutationResult: constAction.result,
                        queryName: getOperationName(query.document),
                        queryVariables: query.variables,
                    }); });
                    if (nextQueryResult) {
                        newState_3 = writeResultToStore({
                            result: nextQueryResult,
                            dataId: 'ROOT_QUERY',
                            document: query.document,
                            variables: query.variables,
                            store: newState_3,
                            dataIdFromObject: config.dataIdFromObject,
                        });
                    }
                });
            }
            if (constAction.extraReducers) {
                constAction.extraReducers.forEach(function (reducer) {
                    newState_3 = reducer(newState_3, constAction);
                });
            }
            return newState_3;
        }
    }
    else if (isUpdateQueryResultAction(constAction)) {
        return replaceQueryResults(previousState, constAction, config);
    }
    else if (isStoreResetAction(action)) {
        return {};
    }
    return previousState;
}
//# sourceMappingURL=store.js.map