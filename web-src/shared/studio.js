// Presentation adapter only: reads game state; never changes rules, scoring, or audio.
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
let selected=1,previousUnlocked=0;
const writer=document.createElement('dialog');writer.id='verse-workspace';writer.setAttribute('aria-labelledby','writer-title');
writer.innerHTML='<header class="writer-header"><div><div class="eyebrow">THE WRITING BOOTH</div><h2 id="writer-title">Write your rhyme.</h2></div><button type="button" id="writer-back">← Back to the beat</button></header><p class="writer-description">Four bars, your voice. Your draft saves as you type.</p>';
document.body.append(writer);
const verseHeading=$('.verse-heading'),tabs=$('.verse-tabs'),verses=$('#writeverse');
const song=document.createElement('details');song.className='song-progress';song.innerHTML='<summary><span id="song-summary">Your song · 0 / 4 verses saved</span><span>View saved bars</span></summary><div class="saved-bars"></div>';
writer.append(tabs,song,verses);
const savedPreview=document.createElement('div');savedPreview.className='saved-progress';
$('.verse-heading').append(savedPreview);
const launcher=document.createElement('button');launcher.id='open-writer';launcher.type='button';launcher.textContent='Write your rhyme ↗';verseHeading.after(launcher);
const overview=document.createElement('div');overview.className='verse-overview';launcher.after(overview);
const progress=document.createElement('button');progress.id='session-toggle';progress.type='button';$('.instructions').before(progress);
const closeProgress=document.createElement('button');closeProgress.id='close-progress';closeProgress.type='button';closeProgress.textContent='Back to the beat ×';$('#left').prepend(closeProgress);
const scrim=document.createElement('button');scrim.className='session-scrim';scrim.setAttribute('aria-label','Close session progress');document.body.append(scrim);
function closeSession(){document.body.classList.remove('session-open');progress.setAttribute('aria-expanded','false');}
progress.addEventListener('click',()=>{const open=document.body.classList.toggle('session-open');progress.setAttribute('aria-expanded',String(open));if(open)closeProgress.focus();});closeProgress.addEventListener('click',closeSession);scrim.addEventListener('click',closeSession);
function openWriter(){if(!window.edubeats.snapshot().unlocked)return;closeSession();$('.instructions').open=false;if(!writer.open)writer.showModal();update();}
function closeWriter(){writer.close();$('#hint').focus();}
launcher.addEventListener('click',openWriter);$('#writer-back').addEventListener('click',closeWriter);
writer.addEventListener('cancel',()=>setTimeout(()=>$('#hint').focus(),0));
// Keep the writing booth above a phone's software keyboard.
const fitWriter=()=>{if(window.visualViewport){writer.classList.toggle('writer-compact',visualViewport.height<500);if(visualViewport.height<500)song.open=false;writer.style.setProperty('--writer-height',`${visualViewport.height}px`);writer.style.setProperty('--writer-top',`${visualViewport.offsetTop}px`);}};
window.visualViewport?.addEventListener('resize',fitWriter);window.visualViewport?.addEventListener('scroll',fitWriter);fitWriter();
for(let j=0;j<3;j++){
 const piano=$(`#piano${j}`);const slot=document.createElement('div');slot.className='piano-slot';slot.dataset.piano=j;
 const label=document.createElement('div');label.className='piano-label';label.innerHTML=`<span>${['A / PURPLE','B / ORANGE','C / BLUE'][j]}</span><small>Play the operations</small>`;
 piano.before(slot);slot.append(label,piano);
 let white=0;const blackPositions=[6.75,16.75,36.75,46.75,56.75,76.75,86.75];let black=0;
 [...piano.children].forEach(key=>{key.style.left=key.className.includes('whitekey')?`${white++*10}%`:`${blackPositions[black++]}%`;});
}
const pianoTabs=document.createElement('nav');pianoTabs.className='piano-tabs';pianoTabs.setAttribute('aria-label','Choose a piano to play');
$('#main').before(pianoTabs);
for(let j=0;j<3;j++){const tab=document.createElement('button');tab.type='button';tab.textContent=['A · Purple','B · Orange','C · Blue'][j];tab.dataset.piano=j;tab.setAttribute('aria-pressed',String(j===0));pianoTabs.append(tab);tab.addEventListener('click',()=>{$$('.piano-slot').forEach((slot,k)=>slot.classList.toggle('selected-piano',k===j));$$('.piano-tabs button').forEach((button,k)=>button.setAttribute('aria-pressed',String(k===j)));});}
$('.piano-slot').classList.add('selected-piano');
function update(){
 const state=window.edubeats.snapshot();
 const newlyUnlocked=state.unlocked>previousUnlocked;
 if(newlyUnlocked)selected=state.unlocked;previousUnlocked=state.unlocked;
 progress.textContent=`${state.points} pts · ${state.done?'Complete':'Round '+(state.round+1)}`;
 launcher.disabled=state.unlocked===0;launcher.textContent=state.unlocked?'Write your rhyme ↗':'Unlock the mic · 100 points';
 overview.textContent=state.unlocked?`${state.unlocked} of 4 verses unlocked · ${state.confirmed.filter(Boolean).length} saved`:'Earn points on the piano to open the writing booth.';
 if(newlyUnlocked&&!writer.open){closeSession();writer.showModal();song.open=state.confirmed.some(Boolean)&&!writer.classList.contains('writer-compact');}
 $('#question-counter').textContent=state.done?'DONE':`${state.problem+1} / 4`;
 $('.round-total').hidden=state.done;
 $$('.round-progress i').forEach((el,i)=>el.classList.toggle('earned',state.done||i<state.problem));
 $$('.getPoint').forEach((el,i)=>{el.classList.toggle('earned',state.badges[i]===true);el.classList.toggle('missed',state.badges[i]===false);el.setAttribute('aria-label',`${el.textContent.trim()}: ${state.badges[i]===true?'earned':state.badges[i]===false?'missed':'upcoming'}`);});
 const saved=state.confirmed.filter(Boolean).length;
 $('#song-summary').textContent=`Your song · ${saved} / 4 verses saved`;
 song.hidden=saved===0;
 $('.saved-bars').replaceChildren();
 for(let i=0;i<4;i++){if(!state.confirmed[i])continue;const entry=document.createElement('section');const title=document.createElement('b');title.textContent=`Verse ${i+1} ✓`;const bars=document.createElement('p');bars.textContent=$$('.writingSample')[i].value;entry.append(title,bars);$('.saved-bars').append(entry);}
 savedPreview.textContent=saved?`${saved} verse${saved===1?'':'s'} saved ✓`:'';
 $('#verse-count').textContent=`${state.confirmed.filter(Boolean).length} / 4`;
 $('#verse-locked').hidden=state.unlocked>0;$('#writeverse').hidden=state.unlocked===0;
$$('.verse-tabs button').forEach((el,i)=>{el.disabled=i>=state.unlocked;el.classList.toggle('active',state.unlocked>0&&i+1===selected);el.classList.toggle('confirmed',!!state.confirmed[i]);el.setAttribute('aria-label',`Verse ${i+1}, ${i>=state.unlocked?'locked':state.confirmed[i]?'confirmed':'unlocked'}`);el.setAttribute('aria-pressed',String(i+1===selected&&state.unlocked>0));});
 for(let i=1;i<=4;i++)$(`#verse_note${i}`).hidden=i!==selected||i>state.unlocked;
}
for(let i=1;i<=4;i++){const save=$(`#stop${i}`);save.innerHTML='Save verse & return <span>↗</span>';save.addEventListener('click',()=>{if(window.edubeats.snapshot().confirmed[i-1])closeWriter();});}
$$('.verse-tabs button').forEach(el=>el.addEventListener('click',()=>{selected=Number(el.dataset.verse);update();}));
$('#close-instructions').addEventListener('click',()=>$('.instructions').open=false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){ $('.instructions').open=false;closeSession(); }});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.instructions'))$('.instructions').open=false;});
new MutationObserver(update).observe($('#totalPoints'),{childList:true,subtree:true,characterData:true});
update();
