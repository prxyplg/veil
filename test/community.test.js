import test from 'node:test';
import assert from 'node:assert/strict';
import { achievements, achievementProgress, cleanHistory, helpQuestions } from '../community.js';

test('36 distinct achievements include the original milestones and new topics',()=>{
 assert.equal(achievements.length,36);
 assert.equal(new Set(achievements.map(a=>a.id)).size,36);
 for(const metric of ['launches','minutes','streak'])assert.equal(achievements.filter(a=>a.metric===metric).length,6);
 assert.equal(achievementProgress(achievements[0],{launches:10}),1);
 assert.equal(achievementProgress(achievements[6],{activeMs:120000}),2);
 assert.equal(achievementProgress(achievements[12],{bestStreak:3}),2);
 assert.equal(achievementProgress(achievements[0],{launches:-5}),0);
 assert.equal(helpQuestions.length,9);
});

test('history rejects malformed data, orders timestamps, and retains the latest 500',()=>{
 assert.deepEqual(cleanHistory(null),[]);
 assert.deepEqual(cleanHistory([{name:'x',at:NaN},{at:1},{name:'',at:2}]),[]);
 const history=cleanHistory(Array.from({length:510},(_,i)=>({name:'Route '+i,at:i+1,mode:i===509?'quick':'other'})));
 assert.equal(history.length,500);
 assert.deepEqual(history[0],{name:'Route 509',at:510,mode:'quick'});
 assert.equal(history.at(-1).at,11);
 assert.equal(history[1].mode,'rotation');
});

test('new exploration milestones use their own recorded metrics',()=>{
 for(const metric of ['sites','routes','pages','colors','fonts','wallpapers','trails','exports']){
  const award=achievements.find(a=>a.metric===metric);assert.ok(award);
  assert.equal(achievementProgress(award,{}),0);
  assert.equal(achievementProgress(award,{launches:999},{[metric]:metric==='exports'?1:['first']}),1);
 }
});
