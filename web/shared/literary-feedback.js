import {DEVICE_BY_ID} from './literary-devices.js';
import {pronunciationStatus} from './literary-sound.js';
import {PATTERNS} from './literary-patterns.js';
import {STRUCTURES} from './literary-structures.js';
export function literaryDevice(index){return index%2===0?'metaphor':'simile';}
export const FEEDBACK_DEVICE_IDS=new Set(['metaphor','simile',...Object.keys(PATTERNS),...Object.keys(STRUCTURES)]);
// Recompute from the current text every call. A cue is evidence, not a semantic grade.
export function assessDevice(text,target){
 const device=DEVICE_BY_ID.get(target),lines=String(text||'').split('\n');
 const entries=lines.map((line,lineIndex)=>({line,lineIndex,clean:line.trim().replace(/’/g,"'").replace(/\bI'm\b/gi,'I am').replace(/\b(it|he|she|that|there)'s\b/gi,'$1 is').replace(/\b(we|you|they)'re\b/gi,'$1 are')})).filter(e=>e.clean);
 const result=(status,detail,indices=[],suggestion='',confidence='cue')=>{const lineIndices=[...new Set(indices)];return {status,detail,lineIndices,lineIndex:lineIndices[0]??null,line:lines[lineIndices[0]]??null,evidence:lineIndices.map(i=>({lineIndex:i,line:lines[i]})),suggestion,confidence};};
 if(!device)return result('Not checked','Choose a literary device to review this verse.',[],'','none');
 if(['metaphor','simile'].includes(target))return comparisonFeedback(text,target,entries,result);
 const tip=PATTERNS[target]?.[2]||STRUCTURE_TIPS[target]||`Try adding or adapting: “${device.examples[0].text}” ${device.description} Keep the idea connected to your own verse.`;
 if(!entries.length)return result('Not checked',`Write a line using ${device.name.toLowerCase()} to get feedback.`,[],tip,'none');
 if(SOUND_DEVICES.has(target)&&pronunciationStatus()!=='ready')return result('Not checked',pronunciationStatus()==='unavailable'?'The pronunciation check is unavailable. Use the sound example below and read your verse aloud.':'Checking pronunciation data… Feedback will update when it is ready.',[],tip,'none');
 const structure=STRUCTURES[target]?.(entries);
 const rule=PATTERNS[target];const found=rule&&entries.find(e=>rule[0].test(e.clean));const joinedMatch=!found&&rule?rule[0].exec(String(text).replace(/\n/g,' ')):null;const cross=[];if(joinedMatch){let offset=0;lines.forEach((line,i)=>{if(line.trim()&&offset<joinedMatch.index+joinedMatch[0].length&&offset+line.length>joinedMatch.index)cross.push(i);offset+=line.length+1;});}
 const indices=structure?.indices||(found?[found.lineIndex]:cross),why=structure?.why|| (found||cross.length?rule[1]:null);
 if(why)return result(target==='quatrain'?'Quatrain found':`Possible ${device.name.toLowerCase()}`,`This fits the ${device.name.toLowerCase()} pattern because ${why[0].toLowerCase()+why.slice(1)}${/[.!?]$/.test(why)?'':'.'}${target==='quatrain'?'':' Check the meaning and delivery in context; a visible cue alone cannot certify the intended effect.'}`,indices,`To strengthen it: ${tip}`);
 return result('Needs review',`No clear ${device.name.toLowerCase()} cue was detected in this wording. This does not prove it is missing; unusual phrasing and context can escape the check.`,[],tip,'none');
}
function comparisonFeedback(text,target,entries,result){
 const topic=/\b(?:voice|sing|song|beat|rhythm|rhyme)\b/i.test(text)?['My voice','a drum','its rhythm carries my words']:/\b(?:walk|road|street|feet|home)\b/i.test(text)?['My journey','a winding road','it has turns and challenges']:/\b(?:dream|idea|mind|think)\b/i.test(text)?['My ideas','sparks','they start something new']:['My confidence','a flame','it keeps growing'];
 const suggested=target==='simile'?`${topic[0]} ${topic[0]==='My ideas'?'are':'is'} like ${topic[1]}.`:`${topic[0]} ${topic[0]==='My ideas'?'are':'is'} ${topic[1]}.`;
 const suggestion=`Try adding or adapting: “${suggested}” This compares ${topic[0].toLowerCase()} with ${topic[1]} because ${topic[2]}. Keep your own rhythm and wording.`;
 const verb='(?:is|are|was|were|am|sounds?|moves?|shines?|flows?|runs?|ran|feels?|felt|looks?|looked|walks?|walked|rolls?|rolled|hits?|flew|flies|dances?|danced|jumps?|jumped|soars?|soared|sings?|sang|swims?|swam|glides?|glided)';
 const like=new RegExp(`\\b${verb}\\s+like\\s+(?!(?:I|we|you|he|she|they)\\b)(?:(?:a|an|the|my|your|our|his|her|their|its)\\s+)?[a-z]+`, 'i');
 const simile=entries.find(e=>like.test(e.clean)&&!new RegExp(`\\b${verb}\\s+like\\s+[a-z]+ing\\b`,'i').test(e.clean)||/\bas\s+\w+\s+as\b/i.test(e.clean));
 const literal=/\b(?:I|we|you|he|she|they)\s+(?:am|are|is|was|were)\s+(?:a|an|the)\s+(?:teacher|student|doctor|parent|person|child|worker)\b/i;
 const metaphor=entries.find(e=>/\b(?:is|are|was|were|am)\s+(?:a|an|the|my|your|our)\s+\w+/i.test(e.clean)&&!/\blike\b/i.test(e.clean)&&!literal.test(e.clean));
 if(!entries.length)return result('Not checked',`Write a comparison first. ${suggestion}`,[],suggestion,'none');
 if(target==='simile'&&simile){const phrase=simile.clean.match(new RegExp(`(.+?)\\s+${verb}\\s+like\\s+(.+?)[.!?]?$`,'i'));const why=phrase?`“${phrase[1]}” is compared with “${phrase[2]}” using “like”.`:'The “as … as” structure explicitly compares a quality between two things.';return result('Possible simile',`${why} It qualifies as a simile if the comparison is figurative, rather than literal.`,[simile.lineIndex],'To strengthen it, name the shared quality: “The world is like my friend because it guides me home.”');}
 if(target==='metaphor'&&metaphor){const phrase=metaphor.clean.match(/(.+?)\s+(?:is|are|was|were|am)\s+(.+?)[.!?]?$/i);return result('Possible metaphor',`${phrase?`“${phrase[1]}” is described as “${phrase[2]}”.`:'This line describes one thing as another.'} It uses a direct comparison without “like” or “as”. It qualifies as a metaphor when that identity is figurative.`,[metaphor.lineIndex],'To strengthen it, develop the shared quality or image in the next bar.');}
 if(target==='metaphor'&&entries.some(e=>literal.test(e.clean)))return result('Needs review',`This may be a literal identity or occupation rather than a metaphor. ${suggestion}`,[],suggestion,'none');
 if(target==='metaphor'&&simile)return result('Simile cue instead',`This line uses an explicit simile-style comparison, while the activity asks for a metaphor. ${suggestion}`,[simile.lineIndex],suggestion);
 return result('Needs review',`No clear ${target} pattern was found. Creative phrasing can escape this local checker. ${suggestion}`,[],suggestion,'none');
}
const SOUND_DEVICES=new Set(['alliteration','assonance','consonance','cacophony','euphony','end-rhyme','rhyming-couplet','slant-rhyme','multisyllabic-rhyme','eye-rhyme','internal-rhyme','monorhyme','iambic-meter','trochaic-meter','anapestic-meter','dactylic-meter']);
const STRUCTURE_TIPS={
 alliteration:'Give three nearby words the same beginning sound: “Bright beats bounce.” Choose words for their sounds, not just their first letters.',
 assonance:'Repeat a stressed vowel sound: “Slow roads glow.” Say the words aloud and listen for the long o sound.',
 consonance:'Repeat an internal or final consonant sound: “Blank ink sinks.” Listen for the repeated nk sound.',
 cacophony:'Build a harsh sound pattern: “Cracked crates crash and clatter.” Read it aloud with the rough effect you intend.',
 euphony:'Choose flowing sounds: “Mellow melodies roll over me.” Listen for the repeated m and l sounds.',
 'end-rhyme':'End two bars with matching sounds: “I chase the light / Across the night.” Light and night rhyme aloud.',
 'rhyming-couplet':'Make two consecutive bars rhyme: “I find the beat / Beneath my feet.” Keep the rhyme at both line endings.',
 'slant-rhyme':'Use an imperfect sound match: “I hold my love / And learn to move.” Love and move share the final v but not the vowel.',
 'multisyllabic-rhyme':'Match more than one syllable at the endings: “My dedication / Builds a foundation.” Listen to the shared ation ending.',
 'identical-rhyme':'Repeat a whole ending word deliberately: “I wait for home / I sing of home.” Make the repeated ending carry meaning.',
 'eye-rhyme':'Try endings with similar spelling but different sounds: “The glove / Begins to move.” Glove and move look alike but do not rhyme aloud.',
 'internal-rhyme':'Place two rhyming words inside one bar: “A bright light guides me home.” The rhyme is bright/light.',
 monorhyme:'Keep one rhyme sound across the stanza: end your bars with light, night, height, and right.',
 quatrain:'Write four separate, nonempty lines. Press Enter after each bar rather than relying on visual wrapping.',
 'end-stopped-line':'Finish a bar with a complete thought and a full stop: “Tonight, we sing together.” Let the pause finish that idea.',
 enjambment:'Let a sentence cross a line break: “I carry all my dreams\ninside this little book.” Do not put a full stop after dreams.',
 acrostic:'Start four lines with B, E, A, T: “Beat begins / Every voice / Adds hope / Together.” The first letters spell BEAT.',
 anaphora:'Repeat an opening across clauses: “I rise at dawn; I rise through doubt.” Keep the opening words the same.',
 epistrophe:'Repeat an ending: “We walk together; we win together.” Keep together at both clause endings.',
 symploce:'Repeat both edges: “We write for home; we fight for home.” We begins both clauses; home ends both.',
 anadiplosis:'Carry an ending into the next beginning: “I follow the beat; the beat follows my heart.” Repeat beat across the join.',
 epanalepsis:'Return to the first word at the end: “Home is where I find home.” Both edges repeat home.',
 epizeuxis:'Repeat immediately: “Rise, rise, rise!” Put no other word between the repetitions.',
 diacope:'Separate repeated words with a few words: “Beat, my heart, beat.” Beat returns after my heart.',
 repetition:'Repeat a meaningful word deliberately: “Keep going, keep going through the rain.” Show why that repetition matters.',
 refrain:'Repeat a complete line at an interval: “We keep the light alive.” Bring it back after each verse when performing.',
 motif:'Return to a meaningful image across bars: mention the open door again when your speaker finds a new opportunity.',
 polyptoton:'Use different forms of one root: “Dreamers keep dreaming.” The word forms change while the root dream returns.',
 antanaclasis:'Repeat a word with a different meaning: “I work on my bars behind the snack bar.” Show the lyric and counter meanings.',
 antimetabole:'Reverse key words: “I shape my words; my words shape me.” Change which thing acts on the other.',
 antithesis:'Balance opposites: “We fall in practice; we rise on stage.” Match the grammar and contrast the actions.',
 parallelism:'Match the grammatical pattern: “I build the beat; I write the bars; I tell the truth.” Keep the parts structurally alike.',
 isocolon:'Balance length as well as grammar: “We seek the beat; we speak the truth.” Read both parts aloud to compare their lengths.',
 tricolon:'Build three matching parts: “I listen, I learn, I lead.” Keep the three units parallel.',
 climax:'Increase intensity through a series: “A whisper, a shout, a roar.” Put the strongest element last.',
 enumeration:'List concrete details: “I pack pencils, pages, headphones, hope.” Choose details connected to your verse.',
 asyndeton:'Remove conjunctions from a series: “Pens, pages, beats, dreams.” Let the commas carry the pace.',
 polysyndeton:'Repeat the conjunction: “We walk and talk and laugh and sing.” Use the extra ands for emphasis.',
 hypophora:'Answer your own question: “Who writes my story? I do.” Include both the question and its answer.',
 'iambic-meter':'Try unstressed then stressed beats: “We KEEP / the BEAT / at NIGHT.” Read it aloud; performance changes stress.',
 'trochaic-meter':'Try stressed then unstressed beats: “DRUM-mers / PLAY-ing / SOFT-ly.” Keep that two-syllable pattern.',
 'anapestic-meter':'Try two unstressed syllables then a stressed one: “To the BEAT / of the DRUM.”',
 'dactylic-meter':'Try one stressed syllable then two unstressed ones: “BEAU-ti-ful / MEL-o-dy.”'
};
export function revisionFeedback(entry,text,target){const result=assessDevice(text,target);let note='';if(entry?.savedText!==null&&entry?.savedText!==undefined&&text!==entry.savedText){const before=assessDevice(entry.savedText,target);note=result.lineIndices.length&&!before.lineIndices.length?'Draft updated — a new device cue is now visible. Save to update the saved verse.':'Draft updated — feedback now uses your current wording. Save to update the saved verse.';}else if(entry?.revisionCount>0){note='Revision saved — feedback has been checked again using your revised verse.';}return {...result,revisionNote:note};}
