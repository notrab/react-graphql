import { readQueryFromStore, } from './readFromStore';
import { writeResultToStore, } from './writeToStore';
export function createStoreReducer(resultReducer, document, variables, config) {
    return function (store, action) {
        var currentResult = readQueryFromStore({
            store: store,
            query: document,
            variables: variables,
            returnPartialData: true,
            config: config,
        });
        var nextResult = resultReducer(currentResult, action, variables);
        if (currentResult !== nextResult) {
            return writeResultToStore({
                dataId: 'ROOT_QUERY',
                result: nextResult,
                store: store,
                document: document,
                variables: variables,
                dataIdFromObject: config.dataIdFromObject,
            });
        }
        return store;
    };
}
//# sourceMappingURL=resultReducers.js.map