"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var invariant = require("invariant");
var ApolloProvider = (function (_super) {
    __extends(ApolloProvider, _super);
    function ApolloProvider(props, context) {
        var _this = _super.call(this, props, context) || this;
        invariant(props.client, 'ApolloClient was not passed a client instance. Make ' +
            'sure you pass in your client via the "client" prop.');
        _this.client = props.client;
        if (props.store) {
            _this.store = props.store;
            if (props.immutable)
                props.client.initStore();
            return _this;
        }
        props.client.initStore();
        _this.store = props.client.store;
        return _this;
    }
    ApolloProvider.prototype.getChildContext = function () {
        return {
            store: this.store,
            client: this.client,
        };
    };
    ApolloProvider.prototype.render = function () {
        return React.Children.only(this.props.children);
    };
    return ApolloProvider;
}(react_1.Component));
ApolloProvider.propTypes = {
    store: react_1.PropTypes.shape({
        subscribe: react_1.PropTypes.func.isRequired,
        dispatch: react_1.PropTypes.func.isRequired,
        getState: react_1.PropTypes.func.isRequired,
    }),
    client: react_1.PropTypes.object.isRequired,
    immutable: react_1.PropTypes.bool,
    children: react_1.PropTypes.element.isRequired,
};
ApolloProvider.childContextTypes = {
    store: react_1.PropTypes.object.isRequired,
    client: react_1.PropTypes.object.isRequired,
};
exports.default = ApolloProvider;
;
//# sourceMappingURL=ApolloProvider.js.map