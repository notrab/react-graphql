import { ApolloAction } from '../actions';
export declare type MutationQueryReducer = (previousResult: Object, options: {
    mutationResult: Object;
    queryName: Object;
    queryVariables: Object;
}) => Object;
export declare type MutationQueryReducersMap = {
    [queryName: string]: MutationQueryReducer;
};
export declare type OperationResultReducer = (previousResult: Object, action: ApolloAction, variables: Object) => Object;
export declare type OperationResultReducerMap = {
    [queryId: string]: OperationResultReducer;
};
