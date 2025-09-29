
export class SortedMap<TKey, TValue> extends Map<TKey, TValue> {
    constructor(entries?: readonly (readonly [TKey, TValue])[] | null) {
        super(entries);
    }

    private _sortedKeys: TKey[] = null;
    get sortedKeys() {
        if (this._sortedKeys == null) {
            this._sortedKeys = Array.from(this.keys()).sort();
        }
        return this._sortedKeys;
    }
    set(key: TKey, value: TValue) {
        super.set(key, value);
        this._sortedKeys = null;
        return this;
    }
    delete(key: TKey) {
        const result = super.delete(key);
        result && (this._sortedKeys = null);
        return result;
    }
    clear() {
        super.clear();
        this._sortedKeys = null;
    }
    forEach(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void, thisArg?: any) {
        this.sortedKeys.forEach(key => callbackfn(this.get(key), key, this));
    }
    map<T>(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => T, thisArg?: any) {
        return this.sortedKeys.map(key => callbackfn(this.get(key), key, this));
    }
    values(): IterableIterator<TValue> {
        return this.sortedKeys.map(key => this.get(key))[Symbol.iterator]();
    }
}