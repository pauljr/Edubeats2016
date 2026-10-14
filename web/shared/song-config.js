export const STRUCTURE=Object.freeze({roundVerses:3,versesPerRound:4});
export const DIFFICULTIES=Object.freeze({
 easy:{label:'Easy',hintReplay:10,wrongNumeric:5,correctKey:12,wrongKey:5,soundMatch:50,wrongMatch:25,numericBonus:11,verseSave:3,unlockThreshold:80,correctMatches:2,requiredPianos:1},
 normal:{label:'Normal',hintReplay:50,wrongNumeric:10,correctKey:10,wrongKey:10,soundMatch:50,wrongMatch:50,numericBonus:11,verseSave:3,unlockThreshold:100,correctMatches:3,requiredPianos:3},
 hard:{label:'Hard',hintReplay:200,wrongNumeric:15,correctKey:8,wrongKey:15,soundMatch:50,wrongMatch:75,numericBonus:11,verseSave:3,unlockThreshold:200,correctMatches:4,requiredPianos:3}
});
const legacyLayers=Array.from({length:4},(_,i)=>({id:`backing-${i+1}`,label:`Backing stage ${i+1}`,src:`audio/makeverse${i+1}.mp3`}));
export const SONGS=[
 {id:'original-mixtape',title:'The Original Mixtape',audioMode:'stages',layers:legacyLayers,questionOffset:0,structure:STRUCTURE},
 {id:'next-mixtape',title:'The Next Mixtape',audioMode:'stages',layers:legacyLayers,questionOffset:7,structure:STRUCTURE}
];
export function rulesFor(song,difficulty){return {...DIFFICULTIES[difficulty],...song.difficulties?.[difficulty]};}
export function validateSong(song){
 if(!song||typeof song.id!=='string'||!song.id.trim()||typeof song.title!=='string'||!song.title.trim())throw Error('Song needs an ID and title.');
 if(!['stages','stems'].includes(song.audioMode))throw Error('audioMode must be stages or stems.');
 if(!Array.isArray(song.layers)||!song.layers.length)throw Error('Provide at least one audio layer.');
 const ids=new Set();for(const layer of song.layers){if(typeof layer.id!=='string'||!layer.id.trim()||ids.has(layer.id)||typeof layer.src!=='string'||!layer.src.trim())throw Error('Each layer needs a unique ID and an audio file.');ids.add(layer.id);if(song.audioMode==='stems'&&(!Number.isFinite(layer.gain)||layer.gain<0||layer.gain>1))throw Error('Stems need a gain from 0 to 1.');}
 if(song.audioMode==='stems'&&(!Number.isFinite(song.loopSeconds)||song.loopSeconds<=0||!song.layers.every(l=>Number.isFinite(l.offsetSeconds??0)&&(l.offsetSeconds??0)>=0)))throw Error('Stems require a positive shared loopSeconds and nonnegative offsets.');
 if(song.structure&&(song.structure.roundVerses!==3||song.structure.versesPerRound!==4))throw Error('Every song has 3 Round Verses, each with 4 verses.');
 for(const d of Object.keys(DIFFICULTIES)){const r=rulesFor(song,d);for(const k of ['wrongNumeric','hintReplay','correctKey','wrongKey','soundMatch','wrongMatch','numericBonus','verseSave','unlockThreshold'])if(!Number.isFinite(r[k])||r[k]<0)throw Error(`Invalid ${d} ${k}`);if(r.soundMatch!==50)throw Error('Sound Match reward stays +50.');if(r.unlockThreshold<=0||!Number.isInteger(r.correctMatches)||r.correctMatches<1||r.correctMatches>4||!Number.isInteger(r.requiredPianos)||r.requiredPianos<1||r.requiredPianos>3)throw Error('Invalid progression requirements.');}
 return {...song,structure:{...STRUCTURE},questionOffset:Number.isInteger(song.questionOffset)?song.questionOffset:0};
}
