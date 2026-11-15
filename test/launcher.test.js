import test from 'node:test';
import assert from 'node:assert/strict';
import {openProxyInBlank,validateProxyUrl} from '../launcher.js';
function element(tag){return {tag,attributes:{},children:[],setAttribute(name,value){this.attributes[name]=value;},append(...children){this.children.push(...children);},replaceChildren(...children){this.children=children;}};}
function previewTab(){const tab={opener:{},document:{documentElement:{},head:element('head'),body:element('body'),createElement:element},closed:false,close(){this.closed=true;}};Object.defineProperty(tab,'location',{get(){throw new Error('Top-level navigation is not allowed in blank-mode launch');}});return tab;}
test('proxy launch stays on about:blank and embeds the URL with opener disconnected',()=>{
 const tab=previewTab();const opened=[];
 const result=openProxyInBlank('https://proxy.example/path?a=1&b=2',{openWindow:(...args)=>{opened.push(args);return tab;},accent:'#ff9191'});
 assert.equal(result,tab);assert.deepEqual(opened,[['about:blank','_blank']]);assert.equal(tab.opener,null);
 assert.equal(tab.document.title,'Veil X Achroma');
 assert.equal(tab.document.body.children.length,1);
 const [frame]=tab.document.body.children;
 assert.equal(frame.tag,'iframe');assert.equal(frame.src,'https://proxy.example/path?a=1&b=2');
 assert.equal(frame.referrerPolicy,'no-referrer');assert.ok(!frame.attributes.sandbox.includes('allow-top-navigation'));
 assert.equal(frame.title,'Veil X Achroma');
 const css=tab.document.head.children.find(e=>e.tag==='style').textContent;assert.ok(css.includes('height:100%'));assert.ok(!css.includes('header'));
});
test('blocked popup returns null and inaccessible popup is closed',()=>{
 assert.equal(openProxyInBlank('https://proxy.example',{openWindow:()=>null}),null);
 const tab={opener:{},close(){this.closed=true;},get document(){throw new Error('Denied');}};
 assert.throws(()=>openProxyInBlank('https://proxy.example',{openWindow:()=>tab}),/Denied/);assert.equal(tab.closed,true);
});
test('non-web and credential-bearing destinations cannot create popup content',()=>{
 let opened=false;
 for(const url of ['javascript:alert(1)','data:text/html,bad','https://user:pass@example.com'])assert.throws(()=>openProxyInBlank(url,{openWindow:()=>{opened=true;}}),/Invalid proxy URL/);
 assert.equal(opened,false);assert.equal(validateProxyUrl('https://example.com'),'https://example.com/');
});
