// Edubeats2016 keeps its original screen navigation; this adapter presents live state.
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
for(let j=0;j<3;j++){
 const piano=$(`#piano${j}`),slot=document.createElement('div');slot.className='piano-slot';slot.dataset.piano=j;
 const label=document.createElement('div');label.className='piano-label';label.innerHTML=`<span>${['A / PURPLE','B / ORANGE','C / BLUE'][j]}</span><small>Play the operations</small>`;piano.before(slot);slot.append(label,piano);
 let white=0,black=0;const positions=[6.75,16.75,36.75,46.75,56.75,76.75,86.75];[...piano.children].forEach(key=>key.style.left=key.className.includes('whitekey')?`${white++*10}%`:`${positions[black++]}%`);
}
const tabs=document.createElement('nav');tabs.className='piano-tabs';tabs.setAttribute('aria-label','Choose a piano to play');$('#main').before(tabs);
for(let j=0;j<3;j++){const b=document.createElement('button');b.type='button';b.dataset.piano=j;b.textContent=['A · Purple','B · Orange','C · Blue'][j];b.setAttribute('aria-pressed',String(j===0));tabs.append(b);b.addEventListener('click',()=>{$$('.piano-slot').forEach((el,k)=>el.classList.toggle('selected-piano',j===k));$$('.piano-tabs button').forEach((el,k)=>el.setAttribute('aria-pressed',String(j===k)));});}
$('.piano-slot').classList.add('selected-piano');
$('#flow-replay').addEventListener('click',()=>$('#hint').click());
$('.flow-progress').append($('#web-verse-nav'));
function update(){
 const state=window.edubeats.snapshot(),saved=state.confirmed.filter(Boolean).length;
 $$('.flow-song-count').forEach(el=>el.textContent=`Your song · ${saved} / 4 verses saved · ${state.unlocked} unlocked`);
 $('.flow-question').textContent=state.done?'Complete':`${state.problem+1} / 4`;
 $$('.getPoint').forEach((el,i)=>{el.classList.toggle('earned',state.badges[i]===true);el.classList.toggle('missed',state.badges[i]===false);});
 $$('.saved-bars,.flow-saved-preview').forEach(container=>{container.replaceChildren();for(let i=0;i<4;i++){if(!state.confirmed[i])continue;const section=document.createElement('section'),title=document.createElement('b'),bars=document.createElement('p');title.textContent=`Verse ${i+1} ✓`;bars.textContent=$$('.writingSample')[i].value;section.append(title,bars);container.append(section);}});
 $$('.flow-history').forEach(el=>{el.hidden=!saved;el.querySelector('summary span').textContent=`${saved} / 4 saved`;});
}
document.addEventListener('edubeats:view',e=>{
 const id=e.detail.id;$('.flow-location').textContent=id==='left'?'YOUR PROGRESS':id==='right'?'FIND YOUR RHYTHM':id.startsWith('writeverse')?'WRITE YOUR BARS':'LYRICAL TOOLBOX';
 $('.instructions').open=false;update();
 if(id.startsWith('writeverse')){const page=$('#'+id);page.querySelector('.flow-history').open=window.edubeats.snapshot().confirmed.some(Boolean)&&(!visualViewport||visualViewport.height>=500);}
});
new MutationObserver(update).observe($('#totalPoints'),{childList:true,subtree:true,characterData:true});
const fit=()=>{const short=window.visualViewport&&visualViewport.height<500;document.body.classList.toggle('flow-keyboard',short);if(window.visualViewport)document.body.style.setProperty('--flow-height',`${visualViewport.height}px`);if(short)$$('.flow-history').forEach(el=>el.open=false);};visualViewport?.addEventListener('resize',fit);fit();update();
for(let i=1;i<=4;i++)$(`#stop${i}`).addEventListener('click',()=>{if(window.edubeats.snapshot().confirmed[i-1]&&!$(`#writeverse${i}`).hidden)$(`#writeverse${i} .flow-back`).click();});
