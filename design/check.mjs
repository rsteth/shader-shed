import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=async p=>JSON.parse(await readFile(new URL(p,root),'utf8'));
const hashes=await read('design/source-hashes.json');
for(const [path,expected] of Object.entries(hashes)) assert.equal(createHash('sha256').update(await readFile(new URL(path,root))).digest('hex'),expected,path);
const collection=await read('design/collection.json'); const inventory=await read('design/inventory.json');
assert.equal(new Set(collection.fixtures.map(f=>f.id)).size,collection.fixtures.length);
for(const item of inventory.items){for(const path of item.source) await readFile(new URL(path,root)); for(const id of item.fixtures) assert(collection.fixtures.some(f=>f.id===id));}
console.log(`${Object.keys(hashes).length} production source hashes unchanged; ${collection.fixtures.length} source-mapped fixtures.`);
