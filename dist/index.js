"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var mobx_1 = require("mobx");
var lodash_1 = require("lodash");
var cache = {};
function getKey(path, method, args, body) {
    return [path, method, JSON.stringify(args), JSON.stringify(body)];
}
var defaultOptions = {
    log: function () { }
};
function createGetter(path, method, options) {
    var _this = this;
    if (method === void 0) { method = 'get'; }
    var opts = __assign({}, defaultOptions, options);
    var log = function (data) {
        if (!opts.log) {
            return;
        }
        var dataWithoutMobx = {};
        for (var _i = 0, _a = lodash_1.keys(data); _i < _a.length; _i++) {
            var key = _a[_i];
            dataWithoutMobx[key] = mobx_1.toJS(data[key]);
        }
        opts.log(dataWithoutMobx);
    };
    var getterForPath = function (args, body) {
        if (args === void 0) { args = {}; }
        if (body === void 0) { body = undefined; }
        var resultingPath = path;
        for (var _i = 0, _a = lodash_1.keys(args); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = args[key];
            resultingPath = resultingPath.replace(":" + key, value);
        }
        var logData = { path: path, args: args, method: method, body: body, resultingPath: resultingPath };
        var cachedResult = lodash_1.get(cache, getKey(path, method, args, body));
        if (cachedResult) {
            log(__assign({}, logData, { status: 'cached', result: cachedResult }));
            return cachedResult;
        }
        var result = mobx_1.observable({ data: undefined, error: undefined, loading: true });
        lodash_1.set(cache, getKey(path, method, args, body), result);
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log(__assign({}, logData, { status: 'awaiting' }));
                        return [4 /*yield*/, axios_1.default[method](resultingPath, body)];
                    case 1:
                        data = (_a.sent()).data;
                        result.data = data;
                        result.loading = false;
                        result.error = undefined;
                        log(__assign({}, logData, { status: 'done', result: result }));
                        return [2 /*return*/];
                }
            });
        }); })();
        return result;
    };
    return getterForPath;
}
exports.createGetter = createGetter;
function clearPath(path, method, args, body) {
    if (method === void 0) { method = 'get'; }
    if (args === void 0) { args = {}; }
    if (body === void 0) { body = undefined; }
    var cachedResult = lodash_1.get(cache, [path, method]);
    if (cachedResult) {
        cachedResult.data = undefined;
    }
}
exports.clearPath = clearPath;