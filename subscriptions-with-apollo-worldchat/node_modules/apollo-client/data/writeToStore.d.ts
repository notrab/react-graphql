/// <reference types="graphql" />
import { FragmentMap } from '../queries/getFromAST';
import { SelectionSetNode, DocumentNode } from 'graphql';
import { NormalizedCache } from './storeUtils';
import { IdGetter } from '../core/types';
export declare function writeQueryToStore({result, query, store, variables, dataIdFromObject, fragmentMap}: {
    result: Object;
    query: DocumentNode;
    store?: NormalizedCache;
    variables?: Object;
    dataIdFromObject?: IdGetter;
    fragmentMap?: FragmentMap;
}): NormalizedCache;
export declare type WriteContext = {
    store: NormalizedCache;
    variables?: any;
    dataIdFromObject?: IdGetter;
    fragmentMap?: FragmentMap;
};
export declare function writeResultToStore({result, dataId, document, store, variables, dataIdFromObject}: {
    dataId: string;
    result: any;
    document: DocumentNode;
    store?: NormalizedCache;
    variables?: Object;
    dataIdFromObject?: IdGetter;
}): NormalizedCache;
export declare function writeSelectionSetToStore({result, dataId, selectionSet, context}: {
    dataId: string;
    result: any;
    selectionSet: SelectionSetNode;
    context: WriteContext;
}): NormalizedCache;
