/// <reference types="isomorphic-fetch" />
/// <reference types="graphql" />
import { ExecutionResult } from 'graphql';
import 'whatwg-fetch';
import { HTTPFetchNetworkInterface, HTTPNetworkInterface, Request } from './networkInterface';
export declare class HTTPBatchedNetworkInterface extends HTTPFetchNetworkInterface {
    private pollInterval;
    private batcher;
    constructor(uri: string, pollInterval: number, fetchOpts: RequestInit);
    query(request: Request): Promise<ExecutionResult>;
    batchQuery(requests: Request[]): Promise<ExecutionResult[]>;
    private batchedFetchFromRemoteEndpoint(requestsAndOptions);
}
export interface BatchingNetworkInterfaceOptions {
    uri: string;
    batchInterval: number;
    opts?: RequestInit;
}
export declare function createBatchingNetworkInterface(options: BatchingNetworkInterfaceOptions): HTTPNetworkInterface;
