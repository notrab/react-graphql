export function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) { return Object.keys(source).forEach(function (key) {
        target[key] = source[key];
    }); });
    return target;
}
//# sourceMappingURL=assign.js.map