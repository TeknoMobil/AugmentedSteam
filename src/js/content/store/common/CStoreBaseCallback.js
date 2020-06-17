import { CStoreBase } from "./CStoreBase.js";

export class CStoreBaseCallback extends CStoreBase {

    _callbacks = [];

    registerCallback(fn) {
        this._callbacks.push(fn);
    }

    triggerCallbacks(...params) {
        for (let callback of this._callbacks) {
            callback(...params);
        }
    }
}