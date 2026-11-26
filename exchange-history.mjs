export function historyOf(value){
 if(value===undefined)return [];
 if(!Array.isArray(value)||value.some(e=>!e||!Number.isSafeInteger(e.at)||e.at<0||!Array.isArray(e.items)||!e.items.length||e.items.some(x=>!x||typeof x.id!=='string'||typeof x.name!=='string'||!['shopping','todo'].includes(x.type)||![0,1].includes(x.points))))throw Error('invalid-exchange-history');
 return value.map(e=>({at:e.at,items:e.items.map(x=>({id:x.id,name:x.name,type:x.type,points:x.points}))}));
}
export function recentHistory(value,now=Date.now()){return historyOf(value).filter(e=>e.at>=now-7*86400000&&e.at<=now).sort((a,b)=>b.at-a.at)}
export function appendHistory(value,items,claimed,now=Date.now()){
 const history=recentHistory(value,now);if(!items.length)return history;
 return [{at:now,items:items.map(x=>({id:x.id,name:x.name,type:x.type,points:claimed.includes(JSON.stringify(x.id))?0:1}))},...history];
}
