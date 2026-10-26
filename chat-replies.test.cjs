const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.value='';this.dataset={};this.listeners={};this.classList={add(){},remove(){},toggle(){}}}addEventListener(k,f){this.listeners[k]=f}appendChild(x){this.children.push(x)}setAttribute(){}getAttribute(){return ''}focus(){}select(){}remove(){}append(...xs){this.children.push(...xs)}get textContent(){return this.text||''}set textContent(x){this.text=x;this.children=[]}}
const elements=new Map(),storage=new Map(),original=[{id:'original',type:'shopping',name:'牛乳',done:false}];storage.set('bani-kurashi-test-v2',JSON.stringify(original));
const ctx={document:{getElementById:id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)},createTextNode:t=>({textContent:t}),createElement:()=>new Element(),querySelectorAll:()=>[],body:new Element()},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},Image:class{},window:{},setTimeout:()=>0,clearTimeout(){},Date,console,Blob,URL,confirm:()=>true,navigator:{},location:{hash:''},URLSearchParams};
storage.set('bani-kurashi-chat-v1',JSON.stringify([{role:'bani',text:'以前の日常会話',at:1}]));
storage.set('bani-kurashi-host-v1',JSON.stringify({text:'以前の日常会話'}));
const html=fs.readFileSync('index.html','utf8');
assert.ok(!html.includes('これまでのおはなし'));
assert.ok(!html.includes('id="chatlog"'));
assert.ok(!/chatTopics|extraChatTopics|function chatReply|api.smallTalk/.test(html));
for(const example of ['牛乳を買うものに追加して','完了分をバニPと交換','家族共有は画面下','端末内データを置き換えます'])assert.ok(html.includes(example),example);
vm.createContext(ctx);const source=html.match(/<script>([\s\S]*?)<\/script>/)[1];vm.runInContext(source.replace("})();", "window.ChatTest={reply:respond,pets:petReplies};})();"),ctx);
const chat=ctx.window.ChatTest;
const checkedReplies=[];
function firstCheckbox(){return elements.get('items').children[0].children[0].children.find(x=>x.type==='checkbox')}
for(let i=0;i<3;i++){let checkbox=firstCheckbox();checkbox.checked=true;checkbox.listeners.change();checkedReplies.push(elements.get('host-message').textContent);assert.equal(ctx.window.BaniFamily.snapshot()[0].done,true);checkbox=firstCheckbox();checkbox.checked=false;checkbox.listeners.change();assert.equal(elements.get('host-message').textContent,'未完了に戻したバニ！')}
assert.equal(new Set(checkedReplies).size,3);assert.ok(checkedReplies.includes('完了にしたバニ！'));assert.equal(elements.get('bani-points').textContent,'0 バニP');

assert.equal(JSON.parse(storage.get('bani-kurashi-chat-v1'))[0].text,'以前の日常会話');
assert.ok(!elements.get('host-message').textContent.includes('以前の日常会話'));
function say(text){ctx.document.getElementById('chat-input').value=text;elements.get('chat-form').listeners.submit({preventDefault(){}});return JSON.parse(storage.get('bani-kurashi-chat-v1')).at(-1).text}
const before=JSON.stringify(ctx.window.BaniFamily.snapshot());
for(const text of ['おはよう','ただいま','こんにちは','ありがとう','疲れた','眠い','不安だよ','うれしい','夕飯どうしよう','音楽を聴きたい','家族で散歩','バニ平って誰','応援して','仕事が終わった']){assert.match(say(text),/買うもの・ToDoの操作/);assert.equal(JSON.stringify(ctx.window.BaniFamily.snapshot()),before)}
say('買うものに追加して');say('こんにちは');say('お願い');assert.equal(JSON.stringify(ctx.window.BaniFamily.snapshot()),before);
assert.match(say('バニ平、牛乳と卵を買うものに追加して'),/追加した|すでに/);assert.ok(ctx.window.BaniFamily.snapshot().some(x=>x.name==='卵'));assert.match(say('バニ平、買うものは何が残ってる？'),/卵/);
say('音楽の練習をToDoに追加して');assert.ok(ctx.window.BaniFamily.snapshot().some(x=>x.name==='音楽の練習'&&x.type==='todo'));assert.match(say('ToDoの音楽の練習が終わった'),/完了にした/);
say('卵を削除して');assert.ok(ctx.window.BaniFamily.snapshot().some(x=>x.name==='卵'));say('お願い');assert.ok(!ctx.window.BaniFamily.snapshot().some(x=>x.name==='卵'));
assert.equal(chat.pets.length,10);const petResponses=[];for(let i=0;i<10;i++){elements.get('host-pet').listeners.click();petResponses.push(elements.get('host-message').textContent)}assert.equal(new Set(petResponses).size,10);assert.ok(petResponses.every(t=>chat.pets.includes(t)));
const lastPet=petResponses.at(-1);vm.runInContext(source,ctx);elements.get('host-pet').listeners.click();assert.notEqual(elements.get('host-message').textContent,lastPet);
console.log('PASS: history UI and all daily reply tables removed; help includes real examples; old saved history preserved without resurfacing old replies; unrelated talk does not mutate lists; add/query/complete/confirmed deletion and ten rotating pet reactions retained');
