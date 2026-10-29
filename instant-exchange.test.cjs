const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.value='';this.dataset={};this.listeners={};this.classList={add(){},remove(){},toggle(){}}}addEventListener(k,f){this.listeners[k]=f}appendChild(x){this.children.push(x)}setAttribute(){}getAttribute(){return ''}focus(){}select(){}remove(){}append(...xs){this.children.push(...xs)}get textContent(){return this.text||''}set textContent(x){this.text=x;this.children=[]}}
const elements=new Map(),storage=new Map(),original=[{id:'original',type:'shopping',name:'牛乳',done:false}];storage.set('bani-kurashi-test-v2',JSON.stringify(original));
const ctx={document:{getElementById:id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)},createTextNode:t=>({textContent:t}),createElement:()=>new Element(),querySelectorAll:()=>[],body:new Element()},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},Image:class{},window:{},setTimeout:()=>0,clearTimeout(){},Date,console,Blob,URL,confirm:()=>true,navigator:{},location:{hash:''},URLSearchParams};
vm.createContext(ctx);const source=fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];vm.runInContext(source.replace("})();", "window.TestRestore=function(value){pendingBackup=value};})();"),ctx);


(async()=>{
const api=ctx.window.BaniFamily,$=id=>ctx.document.getElementById(id),tick=()=>new Promise(r=>setImmediate(r));
const items=[{id:'done',name:'交換対象',type:'shopping',done:true},{id:'keep',name:'未完了',type:'shopping',done:false}];
let resolve,reject,calls=0;const waiting=()=>new Promise((yes,no)=>{resolve=yes;reject=no});let request=waiting();
api.activate('house',items,()=>{},'owner');api.configurePoints(()=>{calls++;return request});
$('clear-done').listeners.click();assert.equal($('items').children.length,1,'hide immediately before network call');assert.equal(api.snapshot().length,2,'do not delete saved data before server commit');await tick();assert.equal(calls,1);
api.receive(items.map(x=>({...x,name:x.id==='keep'?'家族が編集':x.name})));assert.equal($('items').children.length,1,'sync echo cannot flash pending rows');$('clear-done').listeners.click();await tick();assert.equal(calls,1,'duplicate click ignored');
reject(Error('offline'));await tick();assert.equal($('items').children.length,2);assert.equal(api.snapshot().find(x=>x.id==='keep').name,'家族が編集');
request=waiting();$('clear-done').listeners.click();await tick();resolve({removed:['done'],points:{balance:1},added:1,rewards:0});await tick();assert.equal($('items').children.length,1);assert.equal(api.snapshot().length,1);assert.equal(api.snapshot()[0].id,'keep');
api.activate('house',items,()=>{},'owner');request=waiting();$('clear-done').listeners.click();await tick();api.configurePoints(null);api.activate('another-house',[{id:'other',name:'別の家族',type:'shopping',done:false}],()=>{},'other');resolve({removed:['done'],points:{balance:2},added:1,rewards:0});await tick();assert.equal(api.snapshot()[0].id,'other');
console.log('PASS: immediate removal, deferred commit, echo filtering, double-click guard, rollback preserves remote edits, successful cache update, scope isolation');
})();
