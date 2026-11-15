import test from 'node:test';
import assert from 'node:assert/strict';
import { updates } from '../updates.js';

test('update versions advance consecutively with one digit after the dot', () => {
 const oldestFirst=[...updates].reverse();
 oldestFirst.forEach((entry,index)=>assert.equal(entry.version,`${Math.floor((index+1)/10)}.${(index+1)%10}`));
 assert.equal(oldestFirst[8].version,'0.9');
 assert.equal(oldestFirst[9].version,'1.0');
});

test('every update has a request date and dates remain chronological', () => {
 let previous='';
 for(const entry of [...updates].reverse()){
  assert.match(entry.date,/^2026-11-(13|14|15)$/);
  assert.ok(entry.date>=previous);
  assert.ok(entry.title && entry.description);
  previous=entry.date;
 }
 assert.equal(updates.find(e=>e.title==='Appearance membership access').date,'2026-11-14');
 assert.equal(updates.find(e=>e.title==='The Sites library').date,'2026-11-15');
 assert.equal(updates.at(-1).date,'2026-11-13');
});
