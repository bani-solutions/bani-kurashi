const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class E{constructor(){this.children=[];this.value='';this.dataset={};this.listeners={};this.classList={add(){},remove(){},toggle(){}}}addEventListener(k,f){this.listeners[k]=f}appendChild(x){this.children.push(x)}setAttribute(){}getAttribute(){return ''}focus(){}select(){}remove(){}append(...xs){this.children.push(...xs)}get textContent(){return this.text||''}set textContent(x){this.text=x;this.children=[]}}
const elements=new Map(),storage=new Map(),original=[{id:'original',type:'shopping',name:'牛乳',done:false}];storage.set('bani-kurashi-test-v2',JSON.stringify(original));let now=1000,failWrites=false;
class Clock extends Date{static now(){return now}}
const ctx={document:{getElementById:id=>{if(!elements.has(id))elements.set(id,new E());return elements.get(id)},createTextNode:t=>({textContent:t}),createElement:()=>new E(),querySelectorAll:()=>[],body:new E()},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(failWrites)throw Error('full');storage.set(k,v)},removeItem:k=>storage.delete(k)},Image:class{},window:{},setTimeout:()=>0,clearTimeout(){},Date:Clock,console,Blob,URL,confirm:()=>true,navigator:{},location:{hash:''},URLSearchParams};
vm.createContext(ctx);const source=fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];vm.runInContext(source.replace('})();','window.PetTest={history:function(){return history},replies:petReplies};})();'),ctx);
const events=elements.get('host-pet').listeners,test=ctx.window.PetTest,message=()=>elements.get('host-message').textContent,count=()=>test.history().length;
const touch=(x=10,y=10,id=1)=>({pointerType:'touch',isPrimary:true,pointerId:id,clientX:x,clientY:y});
function tap(){events.pointerdown(touch());events.pointerup(touch());}
let before=count();tap();assert.equal(count(),before+1);assert.ok(test.replies.includes(message()));const first=message();events.click({detail:1});assert.equal(count(),before+1,'one touch must not produce a second reply through synthetic click');
now+=100;tap();assert.notEqual(message(),first,'fast consecutive taps each work');assert.equal(count(),before+2);events.click({detail:1});assert.equal(count(),before+2);
before=count();events.pointerdown(touch());events.pointermove(touch(35,10));events.pointermove(touch());events.pointerup(touch());events.click({detail:1});assert.equal(count(),before,'swipe returning to start is not a tap');
events.pointerdown(touch());events.pointercancel(touch());events.click({detail:1});assert.equal(count(),before,'cancelled scrolling touch is ignored');
events.pointerdown({...touch(),isPrimary:false});events.pointerup({...touch(),isPrimary:false});assert.equal(count(),before);
events.click({detail:0});assert.equal(count(),before+1,'keyboard/accessibility click works');now+=1000;events.click({detail:1});assert.equal(count(),before+2,'mouse click works');
failWrites=true;const previous=message();now+=1000;tap();assert.ok(test.replies.includes(message()));assert.notEqual(message(),previous);assert.ok(!message().includes('保存できなかった'));const failedFirst=message();now+=1000;tap();assert.notEqual(message(),failedFirst,'reactions rotate when storage fails');
assert.equal(storage.get('bani-kurashi-test-v2'),JSON.stringify(original));
console.log('PASS: touch release reacts without click; synthetic click suppressed; rapid taps, keyboard and mouse work; swipe/cancel/multitouch ignored; storage failure keeps rotating pet reply visible; saved lists unchanged');
