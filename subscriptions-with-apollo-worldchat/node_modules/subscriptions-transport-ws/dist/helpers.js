"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var printer_1 = require("graphql/language/printer");
function addGraphQLSubscriptions(networkInterface, wsClient) {
    return Object.assign(networkInterface, {
        subscribe: function (request, handler) {
            return wsClient.subscribe({
                query: printer_1.print(request.query),
                variables: request.variables,
            }, handler);
        },
        unsubscribe: function (id) {
            wsClient.unsubscribe(id);
        },
    });
}
exports.addGraphQLSubscriptions = addGraphQLSubscriptions;
//# sourceMappingURL=helpers.js.map