const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.value='';this.dataset={};this.listeners={};this.classList={add(){},remove(){},toggle(){}}}addEventListener(k,f){this.listeners[k]=f}appendChild(x){this.children.push(x)}setAttribute(){}getAttribute(){return ''}focus(){}select(){}remove(){}append(...xs){this.children.push(...xs)}get textContent(){return this.text||''}set textContent(x){this.text=x;this.children=[]}}
const elements=new Map(),storage=new Map(),original=[{id:'original',type:'shopping',name:'牛乳',done:false}];storage.set('bani-kurashi-test-v2',JSON.stringify(original));
const ctx={document:{getElementById:id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)},createTextNode:t=>({textContent:t}),createElement:()=>new Element(),querySelectorAll:()=>[],body:new Element()},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},Image:class{},window:{},setTimeout:()=>0,clearTimeout(){},Date,console,Blob,URL,confirm:()=>true,navigator:{},location:{hash:''},URLSearchParams};
vm.createContext(ctx);const source=fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];vm.runInContext(source.replace("})();", "window.TestRestore=function(value){pendingBackup=value};})();"),ctx);


Element.prototype.checkValidity=function(){return true};
const api=ctx.window.BaniFamily,$=id=>ctx.document.getElementById(id);
function send(text){$('chat-input').value=text;$('chat-form').listeners.submit({preventDefault(){}})}
$('chat-input').value='歯医者、運動会、掃除';$('chat-todo-shortcut').listeners.click();assert.equal($('chat-input').value,'歯医者、運動会、掃除をToDoに追加して');$('chat-todo-shortcut').listeners.click();assert.equal($('chat-input').value,'歯医者、運動会、掃除をToDoに追加して');send($('chat-input').value);
assert.equal(api.snapshot().length,1);assert.match($('host-message').textContent,/歯医者.*日付/);assert.equal($('todo-date-panel').hidden,false);
$('todo-date-save').listeners.click();assert.equal(api.snapshot().length,1);$('todo-chat-date').value='2026-11-15';$('todo-date-save').listeners.click();assert.equal(api.snapshot().find(x=>x.name==='歯医者').due,'2026-11-15');assert.match($('host-message').textContent,/運動会.*日付/);
$('todo-date-none').listeners.click();assert.equal(api.snapshot().find(x=>x.name==='運動会').due,'');assert.match($('host-message').textContent,/掃除.*日付/);$('todo-date-cancel').listeners.click();assert.ok(!api.snapshot().some(x=>x.name==='掃除'));assert.equal($('todo-date-panel').hidden,true);
send('歯医者をToDoに追加して');assert.equal($('todo-date-panel').hidden,true);assert.equal(api.snapshot().filter(x=>x.name==='歯医者').length,1);
send('洗濯をToDoに追加して');api.activate('other-house',[],()=>{});$('todo-date-none').listeners.click();assert.equal(api.snapshot().length,0);assert.equal($('todo-date-panel').hidden,true);
assert.ok(!fs.readFileSync('index.html','utf8').includes('>買うものを確認</button>'));
console.log('PASS: batch shortcut, deferred per-task date, no-date, cancellation, duplicate safety and account switch');
