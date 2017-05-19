import { NormalizedCache } from '../data/storeUtils';
import { Store } from '../store';
export declare type OptimisticStore = {
    mutationId: string;
    data: NormalizedCache;
}[];
export declare function getDataWithOptimisticResults(store: Store): NormalizedCache;
export declare function optimistic(previousState: any[], action: any, store: any, config: any): OptimisticStore;
