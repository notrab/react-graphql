/// <reference types="@types/ws" />
import * as WebSocket from 'ws';
import { SubscriptionManager } from 'graphql-subscriptions';
export interface SubscribeMessage {
    [key: string]: any;
    payload: string;
    query?: string;
    variables?: {
        [key: string]: any;
    };
    operationName?: string;
    id: string;
    type: string;
}
export interface ServerOptions {
    subscriptionManager: SubscriptionManager;
    onSubscribe?: Function;
    onUnsubscribe?: Function;
    onConnect?: Function;
    onDisconnect?: Function;
    keepAlive?: number;
}
export declare class SubscriptionServer {
    private onSubscribe;
    private onUnsubscribe;
    private onConnect;
    private onDisconnect;
    private wsServer;
    private subscriptionManager;
    constructor(options: ServerOptions, socketOptions: WebSocket.IServerOptions);
    private unsubscribe(connection, handleId);
    private onClose(connection, connectionSubscriptions);
    private onMessage(connection, connectionSubscriptions, connectionContext);
    private sendSubscriptionData(connection, subId, payload);
    private sendSubscriptionFail(connection, subId, payload);
    private sendSubscriptionSuccess(connection, subId);
    private sendInitResult(connection, result);
    private sendKeepAlive(connection);
}
