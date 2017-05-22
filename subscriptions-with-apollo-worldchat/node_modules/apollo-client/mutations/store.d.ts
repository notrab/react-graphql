import { ApolloAction } from '../actions';
import { SelectionSetNode } from 'graphql';
export interface MutationStore {
    [mutationId: string]: MutationStoreValue;
}
export interface MutationStoreValue {
    mutationString: string;
    variables: Object;
    loading: boolean;
    error: Error | null;
}
export interface SelectionSetWithRoot {
    id: string;
    typeName: string;
    selectionSet: SelectionSetNode;
}
export declare function mutations(previousState: MutationStore | undefined, action: ApolloAction): MutationStore;
