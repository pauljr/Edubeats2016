let dictionary={};let ready=false;let loading;let failed=false;
export const pronunciationStatus=()=>ready?'ready':failed?'unavailable':'loading';
export function setPronunciations(value){dictionary=value;ready=true;}
export function loadPronunciations(){return loading ||= fetch(new URL('./pronunciations.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Pronunciation data unavailable');return r.json();}).then(setPronunciations).catch(error=>{failed=true;throw error;});}
export const words=text=>(String(text).toLowerCase().replace(/[’]/g,"'").replace(/([a-z])-(?=[a-z])/gi,'$1').match(/[a-z]+(?:'[a-z]+)?/g)||[]);
export const sounds=word=>dictionary[word]?.[0]||(word==='streetlights'&&dictionary.street&&dictionary.lights?[...dictionary.street[0],...dictionary.lights[0].map(p=>p.replace('1','2'))]:null);
const bare=phone=>phone.replace(/[012]/g,'');
const isVowel=phone=>/[012]$/.test(phone);
export function rhymeTail(word){const p=sounds(word);if(!p)return null;let index=p.findLastIndex(x=>/[12]$/.test(x));if(index<0)index=p.findLastIndex(isVowel);return index<0?null:p.slice(index).map(bare).join(' ');}
export function rhymes(a,b){return a!==b&&!!rhymeTail(a)&&rhymeTail(a)===rhymeTail(b);}
export function closeRhyme(a,b){const p=sounds(a),q=sounds(b);if(!p||!q||a===b||rhymes(a,b))return false;const pv=p.filter(isVowel).at(-1),qv=q.filter(isVowel).at(-1);return (pv&&qv&&bare(pv)===bare(qv))||(!isVowel(p.at(-1))&&!isVowel(q.at(-1))&&p.at(-1)===q.at(-1));}
const weak=new Set(['the','a','an','i','we','you','he','she','it','they','my','your','our','to','and','of','in','on','at','for','is','are','was','were','with','by','as','or','then','will','can','would','could','should','did','does']);
export function repeatedSound(text,type){const tokens=words(text).filter(w=>!weak.has(w));const counts=new Map();for(const w of tokens){const p=sounds(w);if(!p)continue;const candidates=type==='alliteration'?[bare(p[0])]:type==='assonance'?p.filter(x=>/[12]$/.test(x)).map(bare):p.slice(1).filter(x=>!isVowel(x));for(const sound of new Set(candidates)){const list=counts.get(sound)||[];if(!list.includes(w))list.push(w);counts.set(sound,list);}}const threshold=type==='alliteration'?3:3;const pair=[...counts].find(([,list])=>list.length>=threshold);return pair?{sound:pair[0],words:pair[1]}:null;}
export function texture(text,soft){const tokens=words(text).filter(w=>!weak.has(w)),found=tokens.filter(w=>sounds(w)?.some(p=>(soft?['L','M','N','R','W','S']:['K','G','T','D','CH','JH']).includes(bare(p))));return found.length>=3?found:null;}
export function multisyllabic(a,b){return rhymes(a,b)&&rhymeTail(a).split(' ').filter(p=>/^(?:AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/.test(p)).length>=2;}
export function meter(text,foot){const tokens=words(text);if(!tokens.length||tokens.some(w=>!sounds(w)))return false;const allowed=[];for(const w of tokens){const stresses=sounds(w).filter(isVowel).map(p=>p.endsWith('2')?[0,1]:[p.endsWith('1')?1:0]);if(weak.has(w)&&stresses.length===1)allowed.push([0,1]);else allowed.push(...stresses);}return allowed.length>=foot.length*2&&allowed.length%foot.length===0&&allowed.every((values,i)=>values.includes(foot[i%foot.length]));}
