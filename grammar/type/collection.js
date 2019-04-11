/**
 * Represents unions.
 * (A1, A1:C5, ...)
 */
class Collection {

    constructor(data, refs) {
        if (data == null && refs == null) {
            this._data = [];
            this._refs = [];
        } else {
            if (data.length !== refs.length)
                throw Error('Collection: data length should match references length.');
            this._data = data;
            this._refs = refs;
        }
    }

    get data() {
        return this._data;
    }

    get refs() {
        return this._refs;
    }

    get length() {
        return this._data.length;
    }

    /**
     * Add data and references to this collection.
     * @param {{}} obj - data
     * @param {{}} ref - reference
     */
    add(obj, ref) {
        this._data.push(obj);
        this._refs.push(ref);
    }
}

module.exports = Collection;
