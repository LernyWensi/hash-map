export { List };

function assert(expr: unknown, msg: string): asserts expr {
    if (!expr) throw Error(msg);
}

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
