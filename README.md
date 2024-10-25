# Hash Map

This project is a part of [The Odin Project's JavaScript course](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript).

## Overview

The Hash Map project is a simple TypeScript implementation of a hash map (or hash table) data structure. This project demonstrates how to store key-value pairs efficiently, allowing for quick retrieval, insertion, and deletion of elements. The implementation includes features such as dynamic resizing and collision handling using separate linked lists.

## Implementation Details

-   **Hash Function:** a straightforward hash function converts keys into array indices, facilitating efficient data retrieval.
-   **Load Factor:** the default load factor is set to 0.75, triggering a resize of the hash map when 75% of its capacity is utilized.
-   **Collision Handling:** each index in the hash map array employs a linked list to manage collisions, allowing for the storage of multiple values at the same index.

## Examples

-   **Usage**

```typescript
const map = new HashMap<number>();

// Set key-value pairs
map.set('a', 1);
map.set('b', 2);
map.set('c', 3);
console.log('Entries after adding a, b, c:', map.entries()); // Output: Entries: [["a", 1], ["b", 2], ["c", 3]]
console.log(`Size: ${map.size()}`); // Output: Size: 3

// Get a value by key
const valueA = map.get('a');
console.log(`Value for key 'a': ${valueA}`); // Output: Value for key 'a': 1

// Check if a key exists
const hasKeyB = map.has('b');
console.log(`Contains key 'b': ${hasKeyB}`); // Output: Contains key 'b': true

// Get all keys
const keys = map.keys();
console.log('Keys:', keys); // Output: Keys: ["a", "b", "c"]

// Get all values
const values = map.values();
console.log('Values:', values); // Output: Values: [1, 2, 3]

// Update a value
map.set('a', 10);
console.log(`Updated value for key 'a': ${map.get('a')}`); // Output: Updated value for key 'a': 10

// Remove a key
map.remove('b');
console.log('Entries after removing key b:', map.entries()); // Output: Entries: [["a", 10], ["c", 3]]
console.log(`Size after removing key 'b': ${map.size()}`); // Output: Size: 2

// Clear the HashMap
map.clear();
console.log('Entries after clearing:', map.entries()); // Output: Entries: []
console.log(`Size after clearing: ${map.size()}`); // Output: Size: 0

// Add multiple items to trigger growth
for (let i = 0; i < 20; i++) map.set(`key${i}`, i);
console.log('Entries after adding 20 items:', map.entries()); // Output: Entries: [["key0", 0], ["key1", 1], ..., ["key19", 19]]
console.log(`Size after adding 20 items: ${map.size()}`); // Output: Size: 20
```

-   **HashMap Class**

```typescript
type HashNode<T> = { key: string; value: T };

type HashNodeList<T> = List<HashNode<T>>;

class HashMap<T> {
    private _size = 0;
    private _capacity = 16;
    private _loadFactor = 0.75;
    public _map: HashNodeList<T>[] = Array.from(
        { length: this._capacity },
        () => new List(),
    );

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

    private _collect<R extends string | T | [string, T]>(
        cb: (node: HashNode<T>) => R,
    ): R[] {
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
```

-   **List Class**

```typescript
class ListNode<T> {
    constructor(
        public value: T,
        public next?: ListNode<T>,
    ) {}
}

class List<T> {
    public head?: ListNode<T>;
    public tail?: ListNode<T>;

    private _size: number = 0;

    public size(): number {
        return this._size;
    }

    public append(value: T): List<T> {
        const node = new ListNode(value);

        if (!this.head) {
            this.head = node;
            this.tail = this.head;
        } else {
            assert(
                this.tail,
                'Tail of the list should be defined at this point',
            );

            this.tail.next = node;
            this.tail = this.tail.next;
        }

        this._size += 1;
        return this;
    }

    public removeAt(index: number): T | undefined {
        if (index < 0 || index >= this._size) return undefined;

        let removed: ListNode<T> | undefined = undefined;

        if (index === 0) {
            removed = this.head;
            this.head = this.head?.next;

            if (!this.head) {
                this.tail = undefined;
            }
        } else {
            const prev = this.at(index - 1);

            assert(
                prev && prev.next,
                `Node at index ${index - 1} and node next to it should be defined at this point`,
            );

            removed = prev.next;
            prev.next = removed.next;

            if (removed === this.tail) {
                this.tail = prev;
            }
        }

        if (removed) {
            this._size -= 1;
            return removed.value;
        }

        return undefined;
    }

    public at(index: number): ListNode<T> | undefined {
        if (index < 0 || index >= this._size) return undefined;

        if (index === 0) return this.head;
        if (index === this._size - 1) return this.tail;

        let node = this.head;

        for (let i = 0; i < index; i += 1) {
            assert(node, `Node at ${index} should be defined at this point`);
            node = node.next;
        }

        return node;
    }

    public find(
        cb: (value: T) => boolean,
    ): { node: ListNode<T>; index: number } | undefined {
        let node = this.head;

        for (let index = 0; node; index += 1) {
            if (cb(node.value)) return { node, index };
            node = node.next;
        }

        return undefined;
    }

    public forEach(cb: (value: T) => void): void {
        let node = this.head;

        while (node) {
            cb(node.value);
            node = node.next;
        }
    }
}
```
