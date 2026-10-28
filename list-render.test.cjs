const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.value='';this.dataset={};this.listeners={};this.classList={add(){},remove(){},toggle(){}}}addEventListener(k,f){this.listeners[k]=f}appendChild(x){this.children.push(x)}setAttribute(){}getAttribute(){return ''}focus(){}select(){}remove(){}append(...xs){this.children.push(...xs)}get textContent(){return this.text||''}set textContent(x){this.text=x;this.children=[]}}
const elements=new Map(),storage=new Map(),original=[{id:'original',type:'shopping',name:'牛乳',done:false}];storage.set('bani-kurashi-test-v2',JSON.stringify(original));
const ctx={document:{getElementById:id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)},createTextNode:t=>({textContent:t}),createElement:()=>new Element(),querySelectorAll:()=>[],body:new Element()},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},Image:class{},window:{},setTimeout:()=>0,clearTimeout(){},Date,console,Blob,URL,confirm:()=>true,navigator:{},location:{hash:''},URLSearchParams};
const pageEvents={},scrollCalls=[];ctx.window.history={scrollRestoration:'auto'};ctx.window.scrollTo=pos=>scrollCalls.push(pos);ctx.window.addEventListener=(name,fn)=>pageEvents[name]=fn;
vm.createContext(ctx);const source=fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];vm.runInContext(source.replace("})();", "window.TestRestore=function(value){pendingBackup=value};})();"),ctx);


Element.prototype.replaceChildren=function(...nodes){this.children=nodes};
Element.prototype.insertBefore=function(node,before){const old=this.children.indexOf(node);if(old>=0)this.children.splice(old,1);const at=before?this.children.indexOf(before):this.children.length;this.children.splice(at,0,node);node.parent=this};
Element.prototype.remove=function(){const p=this.parent||elements.get('items');const i=p.children.indexOf(this);if(i>=0)p.children.splice(i,1)};
Object.defineProperty(Element.prototype,'lastElementChild',{get(){return this.children.at(-1)}});
const api=ctx.window.BaniFamily,$=id=>ctx.document.getElementById(id),names=()=>$('items').children.map(n=>n.baniItem?.name);
$('entry').value='即時表示テスト';$('form').listeners.submit({preventDefault(){}});assert.deepEqual(names(),['牛乳','即時表示テスト']);
$('reorder').listeners.click();const nodes=$('items').children.slice();nodes[1].baniUp.listeners.click();assert.deepEqual(names(),['即時表示テスト','牛乳']);assert.equal($('items').children[0],nodes[1]);assert.equal($('items').children[1],nodes[0]);assert.equal(nodes[1].baniUp.disabled,true);
api.receive(api.snapshot());assert.equal($('items').children[0],nodes[1]);
api.receive(api.snapshot().map(x=>({...x})));$('items').children[0].children[0].children[0].checked=true;$('items').children[0].children[0].children[0].listeners.change();assert.equal(api.snapshot()[0].done,true);
console.log('PASS: immediate add, stable row identity on reorder, boundary controls, identical sync echoes, checkbox after receive');

assert.equal(ctx.window.history.scrollRestoration,'manual');assert.equal(scrollCalls[0].top,0);pageEvents.pageshow();assert.equal(scrollCalls.at(-1).top,0);assert.equal(elements.get('clear-done').hidden,false);elements.get('todo').listeners.click();assert.equal(elements.get('clear-done').hidden,true);
