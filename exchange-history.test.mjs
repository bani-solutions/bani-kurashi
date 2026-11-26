import assert from 'node:assert/strict';
import {appendHistory,recentHistory,historyOf} from './exchange-history.mjs';
import {empty,credit} from './shared-points.mjs';
const now=Date.now(),item={id:'a',name:'<牛乳>',type:'shopping'},todo={id:'b',name:'洗濯',type:'todo'};
const old=[{at:now-7*86400000-1,items:[{...item,points:1}]},{at:now-7*86400000,items:[{...todo,points:1}]}];
let h=appendHistory(old,[item,todo],[],now);assert.equal(h.length,2);assert.equal(h[0].items.length,2);assert.equal(h[0].items[0].name,'<牛乳>');assert.equal(recentHistory(h,now+7*86400000+1).length,0);
assert.equal(appendHistory(h,[item],[JSON.stringify('a')],now+1)[0].items[0].points,0);assert.deepEqual(historyOf(undefined),[]);
const first=credit(empty(),['a'],[item],now);assert.equal(first.points.history[0].items[0].points,1);const again=credit(first.points,['a'],[item],now+1);assert.equal(again.added,0);assert.equal(again.points.history[0].items[0].points,0);assert.equal(first.points.history.length,1);
console.log('PASS: seven-day boundary, ordering, exact names/types, legacy data, shared credit and zero-point re-exchange');
