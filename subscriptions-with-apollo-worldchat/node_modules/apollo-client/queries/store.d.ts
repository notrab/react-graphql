import { ApolloAction } from '../actions';
import { DocumentNode, SelectionSetNode, GraphQLError } from 'graphql';
import { NetworkStatus } from './networkStatus';
export interface QueryStore {
    [queryId: string]: QueryStoreValue;
}
export declare type QueryStoreValue = {
    queryString: string;
    document: DocumentNode;
    variables: Object;
    previousVariables: Object | null;
    networkStatus: NetworkStatus;
    networkError: Error | null;
    graphQLErrors: GraphQLError[];
    lastRequestId: number;
    metadata: any;
};
export interface SelectionSetWithRoot {
    id: string;
    typeName: string;
    selectionSet: SelectionSetNode;
}
export declare function queries(previousState: QueryStore | undefined, action: ApolloAction): QueryStore;
