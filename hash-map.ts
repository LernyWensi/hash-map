export { HashMap };

import { List } from './list';

type HashNode<T> = { key: string; value: T };

type HashNodeList<T> = List<HashNode<T>>;

class HashMap<T> {
    private _size = 0;
    private _capacity = 16;
    private _loadFactor = 0.75;
    public _map: HashNodeList<T>[] = Array.from({ length: this._capacity }, () => new List());

    public size(): number {
        return this._size;
    }

    public has(key: string): boolean {
        return this._get(key) !== undefined;
    }

    public get(key: string): T | undefined {
        return this._get(key).node?.value;
    }

    public keys(): string[] {
        return this._collect((node) => node.key);
    }

    public values(): T[] {
        return this._collect((node) => node.value);
    }

    public entries(): [string, T][] {
        return this._collect((node) => [node.key, node.value]);
    }

    public set(key: string, value: T): HashMap<T> {
        const item = this._get(key);

        if (!item.node) {
            item.list.append({ key, value: value });
            this._size += 1;
            if (this._shouldGrow()) this._grow();
        } else {
            item.node.value = value;
        }

        return this;
    }

    public remove(key: string): boolean {
        const item = this._get(key);

        if (item.node) {
            item.list.removeAt(item.index!);
            this._size -= 1;
            return true;
        }

        return false;
    }

    public clear(): HashMap<T> {
        this._map = Array.from({ length: this._capacity }, () => new List());
        this._size = 0;
        return this;
    }

    private _get(key: string): {
        node: HashNode<T> | undefined;
        index: number | undefined;
        list: HashNodeList<T>;
    } {
        const list = this._map[this._hash(key)];
        const item = list.find((item) => item.key === key);

        return {
            node: item?.node.value,
            index: item?.index,
            list,
        };
    }

    private _collect<R extends string | T | [string, T]>(cb: (node: HashNode<T>) => R): R[] {
        const collected: R[] = [];

        this._map.filter((list) => {
            list.forEach((node) => {
                collected.push(cb(node));
            });
        });

        return collected;
    }

    private _hash(key: string): number {
        let hash = 0;

        for (let i = 0; i < key.length; i++) {
            hash = (31 * hash + key.charCodeAt(i)) % this._capacity;
        }

        return hash;
    }

    private _shouldGrow(): boolean {
        return this._size / this._capacity > this._loadFactor;
    }

    private _grow(): void {
        const map = this._map;

        this._capacity *= 2;
        this.clear();

        map.forEach((list) => {
            list.forEach((item) => {
                this.set(item.key, item.value);
            });
        });
    }
}
