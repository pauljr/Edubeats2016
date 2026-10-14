import {LiterarySession} from './literary-session.js';
import {Game,evaluate} from './game.js';
import {SONGS,DIFFICULTIES,rulesFor,validateSong} from './song-config.js';
export class SongGame extends Game {
 constructor(bank,{songs=SONGS,difficulty='normal',saved=null,legacyVerses=[],answerAnytime=false,random=Math.random}={}){
  super(bank,random);this.songs=songs.map(validateSong);this.difficulty=difficulty in DIFFICULTIES?difficulty:'normal';this.songIndex=0;this.points=0;this.archives=[];this.songStates={};this.roundPoints=0;this.roundCorrect=0;this.attempts=0;this.events=[];this.hintCount=0;this.answerAnytime=answerAnytime;
  if(saved?.version===2){this.answerAnytime=typeof saved.answerAnytime==='boolean'?saved.answerAnytime:answerAnytime;this.difficulty=saved.difficulty in DIFFICULTIES?saved.difficulty:this.difficulty;this.songStates=saved.songStates||{};this.archives=saved.archives||[];this.points=Number.isFinite(saved.points)?saved.points:0;this.songIndex=Math.min(Math.max(saved.songIndex||0,0),this.songs.length-1);}
  this.literary=new LiterarySession({random});this.takeCounter=0;for(const state of Object.values(this.songStates))this.takeCounter=Math.max(this.takeCounter,Number(String(state.takeId||'').split('-')[1])||0);
  this.ensureState();if(!saved){legacyVerses.slice(0,4).forEach((v,i)=>{if(typeof v==='string')this.state().verses[i]=v;});this.state().legacyDrafts=legacyVerses.some(v=>typeof v==='string'&&v.trim());}
  if(saved?.literary){this.literary.explored=new Set(saved.literary.exploredIds||[]);this.literary.practices=new Map(Object.entries(saved.literary.practiceCounts||{}));this.literary.activities=new Map((saved.literary.activities||[]).map(v=>[v.verseId,{...v}]));}
  if(saved&&!saved.literary){const current=this.songIndex;for(let si=0;si<this.songs.length;si++){if(!this.songStates[this.songs[si].id])continue;this.songIndex=si;this.ensureState();this.state().confirmed.forEach((confirmed,i)=>{if(confirmed){const entry=this.writing(i,{assign:true});this.literary.assign(entry.verseId,i%2===0?'metaphor':'simile');this.literary.save(entry.verseId,this.state().verses[i]);}});}this.songIndex=current;}
  this.startActivity();
 }
 get song(){return this.songs[this.songIndex];}
 get scoring(){return rulesFor(this.song,this.difficulty);}
 state(){return this.songStates[this.song.id];}
 ensureState(){if(!this.songStates[this.song.id])this.songStates[this.song.id]={verses:Array(12).fill(''),confirmed:Array(12).fill(false),steps:0,earnedLayerIds:[],unlockHistory:[],activity:null,finished:false};const s=this.state();s.takeId ||= `take-${++this.takeCounter}`;s.verses=Array.from({length:12},(_,i)=>typeof s.verses?.[i]==='string'?s.verses[i]:'');s.confirmed=Array.from({length:12},(_,i)=>!!s.confirmed?.[i]);s.verseRewarded=Array.from({length:12},(_,i)=>s.verseRewarded?.[i]??s.confirmed[i]);s.steps=Math.min(12,Math.max(0,s.steps||0));s.earnedLayerIds=(s.earnedLayerIds||[]).filter(id=>this.song.layers.some(l=>l.id===id));s.unlockHistory ||= [];}
 get unlocked(){return this.songStates?this.state().steps:0;} set unlocked(v){/* Legacy Game constructor compatibility; song state owns unlocks. */}
 get confirmed(){return this.songStates?this.state().confirmed:[];} set confirmed(v){}
 startActivity(){
  const s=this.state();this.done=!!s.finished||s.steps===12;this.round=((this.song.questionOffset+s.steps)%this.bank.length+this.bank.length)%this.bank.length;this.problem=0;this.roundPoints=0;this.roundCorrect=0;this.badges=[];
  if(!this.done){this.prepare();if(s.activity&&s.activity.difficulty===this.difficulty){const a=s.activity;this.hintCount=a.hintCount||0;this.problem=a.problem;this.roundPoints=a.roundPoints;this.roundCorrect=a.roundCorrect;this.badges=a.badges;this.expressions=a.expressions;this.displays=a.displays;this.starts=a.starts;this.orders=a.orders;this.remaining=a.remaining;this.correct=a.correct;this.credited=a.credited.map(v=>new Set(v));}}
 }
 resetPianoAttempts(){this.remaining=this.orders.map(order=>[...order]);this.capture();}
 playHint(){if(this.done||this.awaitingVerses())return null;this.hintCount++;const penalty=this.hintCount>1?this.scoring.hintReplay:0;this.points-=penalty;this.roundPoints-=penalty;this.resetPianoAttempts();return {count:this.hintCount,penalty};}
 key(piano,index){if(this.done||this.awaitingVerses())return false;const before=this.points;const ok=super.key(piano,index);this.roundPoints+=this.points-before;this.capture();return ok;}
 awaitingVerses(){const s=this.state();return s.steps>0&&s.steps%4===0&&!s.confirmed.slice(0,s.steps).every(Boolean);}
 answer(index,numeric){
  if(this.done||this.awaitingVerses())return {blocked:true,message:this.state().finished?'Song complete. Choose Next song or Create another.':'Save the unlocked verses in this Round Verse before continuing.'};
  if(!this.answerAnytime&&this.remaining.filter(o=>o.length===0).length<this.scoring.requiredPianos)return {blocked:true,message:`Complete ${this.scoring.requiredPianos} piano sequence${this.scoring.requiredPianos===1?'':'s'} before choosing your Sound Match.`};
  const ok=index===this.correct,entered=String(numeric??'').trim();
  const validNumber=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(entered)&&Number.isFinite(Number(entered));
  const numericStatus=!entered?'empty':!validNumber?'invalid':Math.abs(Number(entered)-evaluate(this.expressions[index]))<1e-9?'correct':'incorrect';
  const bonus=numericStatus==='correct';
  const pianoDelta=ok?this.scoring.soundMatch:-this.scoring.wrongMatch;
  const numericDelta=bonus?this.scoring.numericBonus:['incorrect','invalid'].includes(numericStatus)?-this.scoring.wrongNumeric:0;
  const delta=pianoDelta+numericDelta;this.points+=delta;this.roundPoints+=delta;this.roundCorrect+=Number(ok);this.badges[this.problem]=ok;this.problem++;this.hintCount=0;
  let unlocked=false,roundCompleted=false,retry=false,earned=null;
  if(this.problem===4){roundCompleted=true;this.attempts++;const score=this.roundPoints;const matches=this.roundCorrect;
   if(score>=this.scoring.unlockThreshold&&matches>=this.scoring.correctMatches){const s=this.state();earned=this.song.layers[s.steps%this.song.layers.length];s.unlockHistory.push({step:s.steps+1,layerId:earned.id,points:score,correctMatches:matches,difficulty:this.difficulty});if(!s.earnedLayerIds.includes(earned.id))s.earnedLayerIds.push(earned.id);s.steps++;unlocked=true;}else retry=true;
   this.state().activity=null;this.startActivity();
  }else this.prepare();
  this.capture();return {ok,bonus,numericStatus,pianoDelta,numericDelta,delta,unlocked,roundCompleted,retry,earned,message:retry?'Activity round complete, but the beat target was not met. Earn it on a fresh attempt.':null};
 }
 writing(index,{assign=false}={}){const verseId=`${this.state().takeId}:v${index+1}`;if(!assign)return this.literary.activities.get(verseId)||null;const entry=this.literary.ensure(verseId,{songId:this.song.id,title:this.song.title,takeId:this.state().takeId,index});entry.draft=this.state().verses[index]||'';return entry;}
 chooseDevice(index,id){if(index<0||index>=this.unlocked)return false;this.writing(index,{assign:true});this.literary.assign(this.writing(index).verseId,id);return true;}
 deleteWriting(verseId){const entry=this.literary.activities.get(verseId);if(!entry)return false;this.literary.delete(verseId);const state=this.songStates[entry.songId];if(state?.takeId===entry.takeId){state.verses[entry.index]='';state.confirmed[entry.index]=false;}for(const archive of this.archives){if(archive.state.takeId===entry.takeId){archive.state.verses[entry.index]='';archive.state.confirmed[entry.index]=false;}}return true;}
 editSavedWriting(verseId,text){const entry=this.literary.activities.get(verseId);if(!entry||!text.trim())return false;this.literary.save(verseId,text);const candidates=[this.songStates[entry.songId],...this.archives.map(a=>a.state)];for(const state of candidates)if(state?.takeId===entry.takeId){state.verses[entry.index]=text;state.confirmed[entry.index]=true;}return true;}
 confirm(index,text){const s=this.state();if(index<0||index>=s.steps||!text.trim())return false;s.verses[index]=text;const entry=this.writing(index,{assign:true});this.literary.save(entry.verseId,text);if(!s.confirmed[index]){s.confirmed[index]=true;if(!s.verseRewarded[index]){s.verseRewarded[index]=true;this.points+=this.scoring.verseSave;}}
  if(s.steps===12&&s.confirmed.every(Boolean)){s.finished=true;this.done=true;}this.capture();return true;
 }
 setDraft(index,text){if(index>=0&&index<12){this.state().verses[index]=text;const entry=this.writing(index);if(entry)this.literary.draft(entry.verseId,text);}}
 capture(){if(!this.songStates)return;this.state().activity=this.done?null:{difficulty:this.difficulty,hintCount:this.hintCount,problem:this.problem,roundPoints:this.roundPoints,roundCorrect:this.roundCorrect,badges:[...this.badges],expressions:this.expressions,displays:this.displays,starts:this.starts,orders:this.orders,remaining:this.remaining,correct:this.correct,credited:this.credited.map(s=>[...s])};}
 setAnswerAnytime(value){this.answerAnytime=!!value;this.capture();}
 setDifficulty(value){if(!(value in DIFFICULTIES))throw Error('Unknown difficulty');this.difficulty=value;this.state().activity=null;this.startActivity();this.capture();}
 nextSong(){if(!this.state().finished||this.songIndex+1>=this.songs.length)return false;this.songIndex++;this.hintCount=0;this.ensureState();this.startActivity();this.capture();return true;}
 selectSong(index){if(!Number.isInteger(index)||!this.songs[index]||!this.songStates[this.songs[index].id])return false;this.capture();this.songIndex=index;this.ensureState();this.startActivity();this.capture();return true;}
 restoreLegacyR1(){const s=this.state();if(!s.legacyDrafts||!s.verses.slice(0,4).every(v=>v.trim()))return false;s.steps=Math.max(4,s.steps);for(let i=0;i<4;i++){s.confirmed[i]=true;s.verseRewarded[i]=true;const entry=this.writing(i,{assign:true});this.literary.assign(entry.verseId,i%2===0?'metaphor':'simile');this.literary.save(entry.verseId,s.verses[i]);}this.song.layers.slice(0,Math.min(4,this.song.layers.length)).forEach(l=>{if(!s.earnedLayerIds.includes(l.id))s.earnedLayerIds.push(l.id);});s.legacyDrafts=false;s.legacyCompletedRestored=true;s.activity=null;this.startActivity();this.capture();return true;}
 restartSong(){this.archives.push({songId:this.song.id,savedAt:new Date().toISOString(),state:JSON.parse(JSON.stringify(this.state()))});delete this.songStates[this.song.id];this.ensureState();this.hintCount=0;this.startActivity();this.capture();}
 addSong(song){const valid=validateSong(song);if(this.songs.some(s=>s.id===valid.id))throw Error('Song ID already exists.');this.songs.push(valid);return valid;}
 export(){this.capture();return {version:2,literary:this.literary.summary(),answerAnytime:this.answerAnytime,songIndex:this.songIndex,points:this.points,difficulty:this.difficulty,songStates:this.songStates,archives:this.archives};}
 snapshot(){return {...this.export(),song:this.song,scoring:this.scoring,round:this.round,hintCount:this.hintCount,problem:this.problem,roundPoints:this.roundPoints,roundCorrect:this.roundCorrect,roundVerse:Math.min(3,Math.floor(this.unlocked/4)+1),unlocked:this.unlocked,confirmed:this.confirmed,verses:this.state().verses,earnedLayerIds:this.state().earnedLayerIds,nextLayer:this.song.layers[this.unlocked%this.song.layers.length],finished:this.state().finished,done:this.done,awaitingVerses:this.awaitingVerses(),orders:this.orders,remaining:this.remaining,correct:this.correct,expressions:this.expressions,displays:this.displays,starts:this.starts,badges:this.badges};}
}
