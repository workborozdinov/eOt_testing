export {}

declare global {
    interface Array<T> {
        notNull(): T[];
    }
}

if (!Array.prototype.notNull) Array.prototype.notNull = function<T>(): T[] { 
    return this.filter(a => a != null);
}