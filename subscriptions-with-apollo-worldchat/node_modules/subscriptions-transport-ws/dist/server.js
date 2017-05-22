"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var messageTypes_1 = require("./messageTypes");
var protocols_1 = require("./protocols");
var isObject = require("lodash.isobject");
var SubscriptionServer = (function () {
    function SubscriptionServer(options, socketOptions) {
        var _this = this;
        var subscriptionManager = options.subscriptionManager, onSubscribe = options.onSubscribe, onUnsubscribe = options.onUnsubscribe, onConnect = options.onConnect, onDisconnect = options.onDisconnect, keepAlive = options.keepAlive;
        if (!subscriptionManager) {
            throw new Error('Must provide `subscriptionManager` to websocket server constructor.');
        }
        this.subscriptionManager = subscriptionManager;
        this.onSubscribe = onSubscribe;
        this.onUnsubscribe = onUnsubscribe;
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;
        this.wsServer = new WebSocket.Server(socketOptions || {});
        this.wsServer.on('connection', function (request) {
            if (request.protocol === undefined || request.protocol.indexOf(protocols_1.GRAPHQL_SUBSCRIPTIONS) === -1) {
                request.close(1002);
                return;
            }
            if (keepAlive) {
                var keepAliveTimer_1 = setInterval(function () {
                    if (request.readyState === WebSocket.OPEN) {
                        _this.sendKeepAlive(request);
                    }
                    else {
                        clearInterval(keepAliveTimer_1);
                    }
                }, keepAlive);
            }
            var connectionSubscriptions = Object.create(null);
            var connectionContext = Object.create(null);
            request.on('message', _this.onMessage(request, connectionSubscriptions, connectionContext));
            request.on('close', function () {
                _this.onClose(request, connectionSubscriptions)();
                if (_this.onDisconnect) {
                    _this.onDisconnect(request);
                }
            });
        });
    }
    SubscriptionServer.prototype.unsubscribe = function (connection, handleId) {
        this.subscriptionManager.unsubscribe(handleId);
        if (this.onUnsubscribe) {
            this.onUnsubscribe(connection);
        }
    };
    SubscriptionServer.prototype.onClose = function (connection, connectionSubscriptions) {
        var _this = this;
        return function () {
            Object.keys(connectionSubscriptions).forEach(function (subId) {
                _this.unsubscribe(connection, connectionSubscriptions[subId]);
                delete connectionSubscriptions[subId];
            });
        };
    };
    SubscriptionServer.prototype.onMessage = function (connection, connectionSubscriptions, connectionContext) {
        var _this = this;
        var onInitResolve = null, onInitReject = null;
        connectionContext.initPromise = new Promise(function (resolve, reject) {
            onInitResolve = resolve;
            onInitReject = reject;
        });
        return function (message) {
            var parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
            }
            catch (e) {
                _this.sendSubscriptionFail(connection, null, { errors: [{ message: e.message }] });
                return;
            }
            var subId = parsedMessage.id;
            switch (parsedMessage.type) {
                case messageTypes_1.INIT:
                    var onConnectPromise = Promise.resolve(true);
                    if (_this.onConnect) {
                        onConnectPromise = new Promise(function (resolve, reject) {
                            try {
                                resolve(_this.onConnect(parsedMessage.payload, connection));
                            }
                            catch (e) {
                                reject(e);
                            }
                        });
                    }
                    onInitResolve(onConnectPromise);
                    connectionContext.initPromise.then(function (result) {
                        if (result === false) {
                            throw new Error('Prohibited connection!');
                        }
                        return {
                            type: messageTypes_1.INIT_SUCCESS,
                        };
                    }).catch(function (error) {
                        return {
                            type: messageTypes_1.INIT_FAIL,
                            payload: {
                                error: error.message,
                            },
                        };
                    }).then(function (resultMessage) {
                        _this.sendInitResult(connection, resultMessage);
                    });
                    break;
                case messageTypes_1.SUBSCRIPTION_START:
                    connectionContext.initPromise.then(function (initResult) {
                        var baseParams = {
                            query: parsedMessage.query,
                            variables: parsedMessage.variables,
                            operationName: parsedMessage.operationName,
                            context: Object.assign({}, isObject(initResult) ? initResult : {}),
                            formatResponse: undefined,
                            formatError: undefined,
                            callback: undefined,
                        };
                        var promisedParams = Promise.resolve(baseParams);
                        if (_this.onSubscribe) {
                            promisedParams = Promise.resolve(_this.onSubscribe(parsedMessage, baseParams, connection));
                        }
                        if (connectionSubscriptions[subId]) {
                            _this.unsubscribe(connection, connectionSubscriptions[subId]);
                            delete connectionSubscriptions[subId];
                        }
                        promisedParams.then(function (params) {
                            if (typeof params !== 'object') {
                                var error = "Invalid params returned from onSubscribe! return values must be an object!";
                                _this.sendSubscriptionFail(connection, subId, {
                                    errors: [{
                                            message: error,
                                        }],
                                });
                                throw new Error(error);
                            }
                            params.callback = function (error, result) {
                                if (!error) {
                                    _this.sendSubscriptionData(connection, subId, result);
                                }
                                else if (error.errors) {
                                    _this.sendSubscriptionData(connection, subId, { errors: error.errors });
                                }
                                else {
                                    _this.sendSubscriptionData(connection, subId, { errors: [{ message: error.message }] });
                                }
                            };
                            return _this.subscriptionManager.subscribe(params);
                        }).then(function (graphqlSubId) {
                            connectionSubscriptions[subId] = graphqlSubId;
                            _this.sendSubscriptionSuccess(connection, subId);
                        }).catch(function (e) {
                            if (e.errors) {
                                _this.sendSubscriptionFail(connection, subId, { errors: e.errors });
                            }
                            else {
                                _this.sendSubscriptionFail(connection, subId, { errors: [{ message: e.message }] });
                            }
                            return;
                        });
                    });
                    break;
                case messageTypes_1.SUBSCRIPTION_END:
                    connectionContext.initPromise.then(function () {
                        if (typeof connectionSubscriptions[subId] !== 'undefined') {
                            _this.unsubscribe(connection, connectionSubscriptions[subId]);
                            delete connectionSubscriptions[subId];
                        }
                    });
                    break;
                default:
                    _this.sendSubscriptionFail(connection, subId, {
                        errors: [{
                                message: 'Invalid message type!',
                            }],
                    });
            }
        };
    };
    SubscriptionServer.prototype.sendSubscriptionData = function (connection, subId, payload) {
        var message = {
            type: messageTypes_1.SUBSCRIPTION_DATA,
            id: subId,
            payload: payload,
        };
        connection.send(JSON.stringify(message));
    };
    SubscriptionServer.prototype.sendSubscriptionFail = function (connection, subId, payload) {
        var message = {
            type: messageTypes_1.SUBSCRIPTION_FAIL,
            id: subId,
            payload: payload,
        };
        connection.send(JSON.stringify(message));
    };
    SubscriptionServer.prototype.sendSubscriptionSuccess = function (connection, subId) {
        var message = {
            type: messageTypes_1.SUBSCRIPTION_SUCCESS,
            id: subId,
        };
        connection.send(JSON.stringify(message));
    };
    SubscriptionServer.prototype.sendInitResult = function (connection, result) {
        connection.send(JSON.stringify(result), function () {
            if (result.type === messageTypes_1.INIT_FAIL) {
                setTimeout(function () {
                    connection.close(1011);
                }, 10);
            }
        });
    };
    SubscriptionServer.prototype.sendKeepAlive = function (connection) {
        var message = {
            type: messageTypes_1.KEEPALIVE,
        };
        connection.send(JSON.stringify(message));
    };
    return SubscriptionServer;
}());
exports.SubscriptionServer = SubscriptionServer;
//# sourceMappingURL=server.js.map