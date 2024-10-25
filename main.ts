import { HashMap } from './hash-map.ts';

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
