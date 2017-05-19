import { ListenerFn } from 'eventemitter3';
export * from './helpers';
export interface SubscriptionOptions {
    query: string;
    variables?: Object;
    operationName?: string;
    context?: any;
}
export interface Subscription {
    options: SubscriptionOptions;
    handler: (error: Error[], result?: any) => void;
}
export interface Subscriptions {
    [id: string]: Subscription;
}
export declare type ConnectionParams = {
    [paramName: string]: any;
};
export interface ClientOptions {
    connectionParams?: ConnectionParams;
    timeout?: number;
    reconnect?: boolean;
    reconnectionAttempts?: number;
    connectionCallback?: (error: Error[], result?: any) => void;
}
export declare class SubscriptionClient {
    client: any;
    subscriptions: Subscriptions;
    private url;
    private maxId;
    private connectionParams;
    private subscriptionTimeout;
    private waitingSubscriptions;
    private unsentMessagesQueue;
    private reconnect;
    private reconnecting;
    private reconnectionAttempts;
    private reconnectSubscriptions;
    private backoff;
    private connectionCallback;
    private eventEmitter;
    private wsImpl;
    constructor(url: string, options?: ClientOptions, webSocketImpl?: any);
    readonly status: any;
    close(): void;
    subscribe(options: SubscriptionOptions, handler: (error: Error[], result?: any) => void): number;
    on(eventName: string, callback: ListenerFn, context?: any): Function;
    onConnect(callback: ListenerFn, context?: any): Function;
    onDisconnect(callback: ListenerFn, context?: any): Function;
    onReconnect(callback: ListenerFn, context?: any): Function;
    unsubscribe(id: number): void;
    unsubscribeAll(): void;
    private sendMessage(message);
    private generateSubscriptionId();
    private formatErrors(errors);
    private tryReconnect();
    private connect(isReconnect?);
}
