var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { isMutationInitAction, isMutationResultAction, isMutationErrorAction, } from '../actions';
import { data, } from '../data/store';
import { assign } from '../util/assign';
var optimisticDefaultState = [];
export function getDataWithOptimisticResults(store) {
    if (store.optimistic.length === 0) {
        return store.data;
    }
    var patches = store.optimistic.map(function (opt) { return opt.data; });
    return assign.apply(void 0, [{}, store.data].concat(patches));
}
export function optimistic(previousState, action, store, config) {
    if (previousState === void 0) { previousState = optimisticDefaultState; }
    if (isMutationInitAction(action) && action.optimisticResponse) {
        var fakeMutationResultAction = {
            type: 'APOLLO_MUTATION_RESULT',
            result: { data: action.optimisticResponse },
            document: action.mutation,
            operationName: action.operationName,
            variables: action.variables,
            mutationId: action.mutationId,
            extraReducers: action.extraReducers,
            updateQueries: action.updateQueries,
        };
        var fakeStore = __assign({}, store, { optimistic: previousState });
        var optimisticData = getDataWithOptimisticResults(fakeStore);
        var patch = getOptimisticDataPatch(optimisticData, fakeMutationResultAction, store.queries, store.mutations, config);
        var optimisticState = {
            action: fakeMutationResultAction,
            data: patch,
            mutationId: action.mutationId,
        };
        var newState = previousState.concat([optimisticState]);
        return newState;
    }
    else if ((isMutationErrorAction(action) || isMutationResultAction(action))
        && previousState.some(function (change) { return change.mutationId === action.mutationId; })) {
        var optimisticData_1 = assign({}, store.data);
        var newState = previousState
            .filter(function (change) { return change.mutationId !== action.mutationId; })
            .map(function (change) {
            var patch = getOptimisticDataPatch(optimisticData_1, change.action, store.queries, store.mutations, config);
            assign(optimisticData_1, patch);
            return __assign({}, change, { data: patch });
        });
        return newState;
    }
    return previousState;
}
function getOptimisticDataPatch(previousData, optimisticAction, queries, mutations, config) {
    var optimisticData = data(previousData, optimisticAction, queries, mutations, config);
    var patch = {};
    Object.keys(optimisticData).forEach(function (key) {
        if (optimisticData[key] !== previousData[key]) {
            patch[key] = optimisticData[key];
        }
    });
    return patch;
}
//# sourceMappingURL=store.js.map