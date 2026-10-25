import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeChanges } from './sync-merge.mjs';
const item = (id, overrides = {}) => ({id, name:id, type:'shopping', done:false, ...overrides});
test('independent edits to same item survive a concurrent update', () => {
  const {items} = mergeChanges([item('a',{name:'卵'})], [item('a')], [item('a',{done:true})]);
  assert.equal(items[0].name,'卵'); assert.equal(items[0].done,true);
});
test('remote deletion is not resurrected by an offline edit', () => {
  assert.deepEqual(mergeChanges([], [item('a')], [item('a',{name:'変更'})]),{items:[],conflicts:['a']});
});
test('deleting one item preserves another device’s additions', () => {
  assert.deepEqual(mergeChanges([item('a'),item('b')],[item('a')],[]).items,[item('b')]);
});
test('reorder preserves remote-only records and their slots', () => {
  const result=mergeChanges([item('a'),item('remote'),item('b')],[item('a'),item('b')],[item('b'),item('a')]);
  assert.deepEqual(result.items.map(x=>x.id),['b','remote','a']);
});
test('undo-restored records retain their local relative position', () => {
  const result=mergeChanges([item('a'),item('c')],[item('a'),item('c')],[item('a'),item('b'),item('c')]);
  assert.deepEqual(result.items.map(x=>x.id),['a','b','c']);
});
test('ToDo optional dates and other list entries survive patches', () => {
  const base=[item('a',{type:'todo',due:'2026-10-27T09:00'}),item('b')];
  const after=[item('a',{type:'todo',due:''}),item('b')];
  const remote=[item('a',{type:'todo',due:'2026-10-27T09:00',done:true}),item('b'),item('c')];
  const {items}=mergeChanges(remote,base,after);assert.equal(items[0].due,'');assert(items[0].done);assert.equal(items.length,3);
});
test('duplicate IDs and malformed cloud items fail closed', () => {
  assert.throws(()=>mergeChanges([item('a'),item('a')],[],[]));
  assert.throws(()=>mergeChanges([{id:'a',name:'x'}],[],[]));
});
test('merge does not mutate caller snapshots', () => {
  const a=[item('a')], b=[item('a',{done:true})];mergeChanges(a,a,b);assert.equal(a[0].done,false);
});
