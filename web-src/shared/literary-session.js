import {LITERARY_DEVICES} from './literary-devices.js';
// Page-session domain model. No storage, scoring or audio dependencies.
export class LiterarySession {
 constructor({devices=LITERARY_DEVICES,random=Math.random}={}){this.devices=devices;this.byId=new Map(devices.map(d=>[d.id,d]));this.random=random;this.explored=new Set();this.activities=new Map();this.practices=new Map();}
 view(id){if(!this.byId.has(id))throw Error('Unknown literary device');this.explored.add(id);return this.byId.get(id);}
 state(id){return this.saved().some(v=>v.deviceId===id)?'completed':this.explored.has(id)?'explored':'not-explored';}
 pick(items){return items[Math.min(items.length-1,Math.max(0,Math.floor(this.random()*items.length)))];}
 ensure(verseId,metadata={}){if(this.activities.has(verseId))return this.activities.get(verseId);let pool=this.devices.filter(d=>this.state(d.id)==='not-explored');if(!pool.length)pool=this.devices.filter(d=>this.state(d.id)==='explored');if(!pool.length)pool=this.devices;const entry={verseId,...metadata,draft:'',savedText:null,deviceId:null,exampleId:null};this.activities.set(verseId,entry);return this.assign(verseId,this.pick(pool).id);}
 assign(verseId,id){const device=this.view(id),entry=this.activities.get(verseId);if(!entry)throw Error('Open a verse before choosing its device');entry.deviceId=id;entry.exampleId=this.pick(device.examples).id;this.practices.set(id,(this.practices.get(id)||0)+1);return entry;}
 nextExample(verseId){const entry=this.activities.get(verseId);if(!entry)return null;const examples=this.byId.get(entry.deviceId).examples;const index=examples.findIndex(e=>e.id===entry.exampleId);entry.exampleId=examples[(index+1)%examples.length].id;return entry;}
 draft(verseId,text){const entry=this.activities.get(verseId);if(entry)entry.draft=text;}
 save(verseId,text){const entry=this.activities.get(verseId);if(!entry||!text.trim())return false;if(entry.savedText!==null&&entry.savedText!==text){entry.previousSavedText=entry.savedText;entry.revisionCount=(entry.revisionCount||0)+1;}entry.draft=text;entry.savedText=text;return true;}
 delete(verseId){const entry=this.activities.get(verseId);if(!entry)return false;entry.savedText=null;entry.draft='';entry.revisionCount=0;entry.previousSavedText=null;return true;}
 saved(){return [...this.activities.values()].filter(v=>v.savedText!==null);}
 stats(){const completed=this.devices.filter(d=>this.state(d.id)==='completed').length;return {total:this.devices.length,completed,explored:this.explored.size,exploredOnly:this.devices.filter(d=>this.state(d.id)==='explored').length,remaining:this.devices.length-completed};}
 summary(){return {...this.stats(),exploredIds:[...this.explored],practiceCounts:Object.fromEntries(this.practices),activities:[...this.activities.values()].map(v=>({...v}))};}
}
