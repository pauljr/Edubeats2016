export class SongAudio {
 constructor(){this.context=null;this.masterGain=null;this.muted=false;this.buffers=new Map();this.sources=[];this.generation=0;this.playing=false;this.playedIds=[];}
 setMuted(value){this.muted=!!value;if(this.masterGain)this.masterGain.gain.setValueAtTime(this.muted?0:1,this.context.currentTime);}
 async enable(){this.context ||= new AudioContext();if(!this.masterGain){this.masterGain=this.context.createGain();this.masterGain.gain.value=this.muted?0:1;this.masterGain.connect(this.context.destination);}await this.context.resume();}
 async buffer(layer){await this.enable();const key=layer.assetKey||layer.src;if(this.buffers.has(key))return this.buffers.get(key);let data;
  if(layer.assetKey){const db=await openAssets();const blob=await new Promise((resolve,reject)=>{const req=db.transaction('audio').objectStore('audio').get(layer.assetKey);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});db.close();if(!blob)throw Error(`Missing uploaded audio: ${layer.src}`);data=await blob.arrayBuffer();}
  else {const response=await fetch(layer.src);if(!response.ok)throw Error(`Audio unavailable: ${layer.src}`);data=await response.arrayBuffer();}
  const decoded=await this.context.decodeAudioData(data);this.buffers.set(key,decoded);return decoded;
 }
 stop(){this.generation++;this.sources.forEach(s=>{try{s.stop();}catch{}});this.sources=[];this.playing=false;this.playedIds=[];}
 async play(song,earnedIds){this.stop();const generation=this.generation;const earned=song.layers.filter(l=>earnedIds.includes(l.id));if(!earned.length)return false;const selected=song.audioMode==='stages'?[earned[earned.length-1]]:earned;
  const buffers=await Promise.all(selected.map(layer=>this.buffer(layer)));if(generation!==this.generation)return false;
  if(song.audioMode==='stems')buffers.forEach((buffer,i)=>{if(buffer.duration+0.02<(selected[i].offsetSeconds||0)+song.loopSeconds)throw Error(`${selected[i].label||selected[i].id} is shorter than the configured loop.`);});
  const when=this.context.currentTime+0.08;selected.forEach((layer,i)=>{const source=this.context.createBufferSource();source.buffer=buffers[i];source.loop=true;const gain=this.context.createGain();gain.gain.value=song.audioMode==='stems'?layer.gain/Math.max(1,selected.length):1;source.connect(gain);gain.connect(this.masterGain);
   const offset=song.audioMode==='stems'?(layer.offsetSeconds||0):0;if(song.audioMode==='stems'){source.loopStart=offset;source.loopEnd=offset+song.loopSeconds;}source.start(when,offset);this.sources.push(source);});
  this.playing=true;this.playedIds=selected.map(l=>l.id);return true;
 }
 snapshot(){return {muted:this.muted,outputGain:this.masterGain?.gain.value??(this.muted?0:1),playing:this.playing,playedIds:[...this.playedIds]};}
}
export function openAssets(){return new Promise((resolve,reject)=>{const request=indexedDB.open('edubeats-song-assets',1);request.onupgradeneeded=()=>request.result.createObjectStore('audio');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
export async function storeAssets(entries){const db=await openAssets();await new Promise((resolve,reject)=>{const tx=db.transaction('audio','readwrite');entries.forEach(([key,blob])=>tx.objectStore('audio').put(blob,key));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();}
