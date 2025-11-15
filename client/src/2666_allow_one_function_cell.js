/**
 * @param {Function} fn
 * @return {Function}
 */
var once = function (fn) {
    var a = false;
    return function (...args) {
        if (a == true) return undefined;
        a = true;
        return fn(...args);
    }
};