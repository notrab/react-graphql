import { ApolloAction } from '../actions';
import { QueryStore } from '../queries/store';
import { MutationStore } from '../mutations/store';
import { ApolloReducerConfig } from '../store';
import { NormalizedCache } from './storeUtils';
export declare function data(previousState: NormalizedCache, action: ApolloAction, queries: QueryStore, mutations: MutationStore, config: ApolloReducerConfig): NormalizedCache;
