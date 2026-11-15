import test from 'node:test';
import assert from 'node:assert/strict';
import { animals, ANIMAL_IDS, assignAnimal } from '../avatars.js';
import { cleanProfile } from '../core.js';

test('14 unique local animal drawings can each be randomly assigned',()=>{
 assert.equal(animals.length,14);
 assert.equal(new Set(ANIMAL_IDS).size,14);
 assert.equal(new Set(animals.map(a=>a.icon)).size,14);
 for(let i=0;i<14;i++){
  const profile=assignAnimal(cleanProfile({name:'Avery',named:true}),()=>i/14);
  assert.equal(profile.avatar,animals[i].id);
  assert.deepEqual(cleanProfile(profile),profile);
  assert.match(animals[i].icon,/^<svg/);
 }
});

test('saved animal survives rerolls, membership normalization, and invalid values',()=>{
 const profile=cleanProfile({name:'Avery',named:true,avatar:'fox'});
 assert.equal(assignAnimal(profile,()=>.99).avatar,'fox');
 assert.equal(cleanProfile({avatar:'invalid'}).avatar,'');
 assert.equal(assignAnimal({...profile,avatar:''},()=>.99).avatar,'otter');
});

test('removed animals cannot be selected or retained as valid profile avatars',()=>{for(const id of ['owl','deer','bat','axolotl']){assert.ok(!ANIMAL_IDS.includes(id));assert.equal(cleanProfile({avatar:id}).avatar,'');assert.ok(ANIMAL_IDS.includes(assignAnimal({avatar:id},()=>.5).avatar));}});
