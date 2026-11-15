import { config } from './config.js';
import { destinations, configurationError, nextRoute, keyTier, activeDelta, localDay, updateStreak, currentStreak, isPremium, normalizeTier, routePool, cleanProfile, BADGE_IDS, canCustomizeAppearance, appearanceForTier, faviconDataUrl } from './core.js';
import { tierIcons, badgeIcons, badgeDetails, personIcon, closeIcon, navIcons } from './icons.js';
import { createEffects } from './effects.js';
const $ = id => document.getElementById(id);
const KEYS={member:'veil.membership.v1',stats:'veil.stats.v1',rotation:'veil.rotation.v1',settings:'veil.settings.v1',profile:'veil.profile.v1',excluded:'veil.excluded.v1'};
let persistent=true;
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{persistent=false;return fallback;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{persistent=false;return false;}}
const legacy=read('volt.membership.v1',null);
const membership=read(KEYS.member,legacy||{});
let tier=normalizeTier(membership?.status);
if(membership?.status==='verified'||(legacy&&!read(KEYS.member,null)))write(KEYS.member,{status:tier});
let profile=cleanProfile(read(KEYS.profile,{}));
write(KEYS.profile,profile);
function cleanStats(value={}){
 const positive=n=>Number.isFinite(n)?Math.max(0,n):0;
 const daily={};if(value?.daily&&typeof value.daily==='object')for(const [day,total]of Object.entries(value.daily).filter(([key])=>/^\d{4}-\d{2}-\d{2}$/.test(key)).sort().slice(-366))daily[day]=positive(total);
 return {activeMs:positive(value?.activeMs),launches:Math.floor(positive(value?.launches)),lastLaunch:typeof value?.lastLaunch==='string'?value.lastLaunch:'',lastAt:positive(value?.lastAt),streakDay:typeof value?.streakDay==='string'?value.streakDay:'',streakCount:Math.floor(positive(value?.streakCount)),bestStreak:Math.floor(positive(value?.bestStreak)),daily};
}
let stats=cleanStats(read(KEYS.stats,{}));let sessionMs=0;
let rotation=read(KEYS.rotation,read('volt.rotation.v1',{}));if(!rotation||typeof rotation!=='object')rotation={};
let excluded=read(KEYS.excluded,[]);if(!Array.isArray(excluded))excluded=[];
const colors=[
{id:'red',label:'Red',accent:'#ff9191',start:'#a12e3b',end:'#76202e',hue:'92deg'},
{id:'orange',label:'Orange',accent:'#ffb574',start:'#9a4b12',end:'#703409',hue:'120deg'},
{id:'yellow',label:'Yellow',accent:'#ffe27a',start:'#756014',end:'#55440c',hue:'139deg'},
{id:'light-green',label:'Light green',accent:'#b4ed85',start:'#47752a',end:'#31531d',hue:'185deg'},
{id:'dark-green',label:'Dark green',accent:'#51b98b',start:'#176347',end:'#104830',hue:'246deg'},
{id:'light-blue',label:'Light blue',accent:'#8cdcff',start:'#246c94',end:'#184c70',hue:'290deg'},
{id:'dark-blue',label:'Dark blue',accent:'#789bff',start:'#2d479e',end:'#203477',hue:'317deg'},
{id:'purple',label:'Purple',accent:'#c18aff',start:'#8b41c7',end:'#65309b',hue:'0deg'},
{id:'pink',label:'Pink',accent:'#ff9ed1',start:'#a73977',end:'#7b2858',hue:'60deg'}];
const wallpapers=[['aurora','Aurora','≋'],['stars','Starfield','✧'],['waves','Waves','∿'],['rain','Digital rain','⋮'],['orbits','Orbits','◎'],['nebula','Nebula','◌'],['vortex','Vortex','◉'],['fireflies','Fireflies','⁘']];
const trails=[['comet','Comet','☄'],['sparkles','Sparkles','✦'],['bubbles','Bubbles','◌'],['ribbon','Ribbon','∿'],['orbit','Orbit','◎'],['embers','Embers','⁙'],['hearts','Hearts','♡'],['pulse','Pulse rings','◉']];
const fonts={system:'system-ui, sans-serif',rounded:'"Trebuchet MS", sans-serif',humanist:'Candara, Calibri, sans-serif',mono:'Consolas, "Courier New", monospace',serif:'Georgia, "Times New Roman", serif',classic:'Verdana, Arial, sans-serif'};
function cleanSettings(value){return {color:colors.some(c=>c.id===value?.color)?value.color:'purple',glow:value?.glow!==false,strength:Math.min(10,Math.max(1,Number(value?.strength)||5)),font:Object.hasOwn(fonts,value?.font)?value.font:'system',motion:value?.motion!==false,wallpaper:wallpapers.some(([id])=>id===value?.wallpaper)?value.wallpaper:'none',trail:trails.some(([id])=>id===value?.trail)?value.trail:'none'};}
let settings=cleanSettings(read(KEYS.settings,{}));
try{localStorage.setItem('veil.probe','1');localStorage.removeItem('veil.probe');}catch{persistent=false;}
const effects=createEffects($('wallpaper-canvas'),$('trail-canvas'));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let booting=true,currentPage='',pageAnimation=null,dialogAction=null,masterUnlocked=false;
const titleCase=value=>value[0].toUpperCase()+value.slice(1);
const duration=ms=>{const minutes=Math.floor(ms/60000),hours=Math.floor(minutes/60);return hours?`${hours}h ${minutes%60}m`:`${minutes}m`;};
function notify(message){$('notice').textContent=message;}
function showDialog(title,text,action=null){$('dialog-title').textContent=title;$('dialog-description').textContent=text;$('cancel-dialog').hidden=!action;$('confirm-dialog').textContent=action?'Confirm':'Got it';dialogAction=action;$('message-dialog').showModal();}
$('close-dialog').addEventListener('click',()=>$('message-dialog').close());$('cancel-dialog').addEventListener('click',()=>$('message-dialog').close());
$('message-dialog').addEventListener('close',()=>{dialogAction=null;});
$('confirm-dialog').addEventListener('click',()=>{const action=dialogAction;dialogAction=null;$('message-dialog').close();action?.();});
function renderProfile(){
 const label=titleCase(tier);$('header-tier').textContent=label;$('tier-icon').innerHTML=tierIcons[tier];
 $('tier-badge').dataset.tier=tier;$('tier-badge').setAttribute('aria-label',`${label} membership${profile.badges.length?', '+profile.badges.map(badge=>badgeDetails[badge].name).join(', '):''}. Manage membership`);
 $('member-card').dataset.tier=tier;$('profile-tier').textContent=tier==='member'?'Member · verified access':label;
 $('profile-tier-icon').innerHTML=tierIcons[tier];$('profile-name').textContent=profile.name||'Guest';$('greeting').textContent=profile.name?`Welcome back, ${profile.name}.`:'Welcome to Veil';
 $('access-summary').textContent=tier==='unverified'?'Unverified · activate a key to launch.':tier==='member'?'3 routes · Premium effects locked.':`${destinations(config.proxies,tier).length} routes · Premium effects unlocked.`;
 $('badge-stickers').replaceChildren();$('profile-badges').replaceChildren();
 for(const badge of profile.badges){
  const sticker=document.createElement('span');sticker.className=`badge-sticker sticker-${badge}`;sticker.innerHTML=badgeIcons[badge];$('badge-stickers').append(sticker);
  const pill=document.createElement('span');pill.className='profile-badge';pill.setAttribute('role','listitem');const icon=document.createElement('span');icon.className='badge-icon';icon.innerHTML=badgeIcons[badge];const text=document.createElement('span');text.textContent=badgeDetails[badge].name;pill.append(icon,text);$('profile-badges').append(pill);
 }
 $('profile-badges').hidden=!profile.badges.length;
 renderBadgeGuide();
}
function renderChart(){
 const days=[];for(let i=6;i>=0;i--){const date=new Date();date.setDate(date.getDate()-i);days.push({date,key:localDay(date)});}
 const max=Math.max(60000,...days.map(d=>stats.daily[d.key]||0));$('activity-chart').replaceChildren();
 for(const day of days){const total=stats.daily[day.key]||0;const column=document.createElement('div');column.className='chart-column';const value=document.createElement('span');value.textContent=Math.floor(total/60000);const track=document.createElement('div');track.className='chart-track';const bar=document.createElement('div');bar.className='chart-bar';bar.style.height=`${Math.max(2,total/max*100)}%`;track.append(bar);const label=document.createElement('small');label.textContent=day.date.toLocaleDateString(undefined,{weekday:'short'});column.title=`${day.key}: ${(total/60000).toFixed(1)} active minutes`;column.append(value,track,label);$('activity-chart').append(column);}
 $('activity-chart').setAttribute('aria-label',days.map(d=>`${d.key}: ${Math.floor((stats.daily[d.key]||0)/60000)} minutes`).join('; '));
}
function refreshStats(){
 const streak=currentStreak(stats);$('card-uptime').textContent=duration(stats.activeMs);$('card-streak').textContent=`${streak} ${streak===1?'day':'days'}`;$('card-launches').textContent=stats.launches.toLocaleString();$('card-last').textContent=stats.lastLaunch||'None yet';
 $('minutes').textContent=Math.floor(stats.activeMs/60000).toLocaleString();$('hours').textContent=(stats.activeMs/3600000).toFixed(2);$('days').textContent=(stats.activeMs/86400000).toFixed(3);
 $('activity-streak').textContent=`${streak} ${streak===1?'day':'days'}`;$('best-streak').textContent=`${stats.bestStreak} ${stats.bestStreak===1?'day':'days'}`;$('launch-count').textContent=stats.launches.toLocaleString();$('session-time').textContent=duration(sessionMs);$('last-launch').textContent=stats.lastLaunch||'None yet';$('last-launch-time').textContent=stats.lastAt?new Date(stats.lastAt).toLocaleString():'Never';
 if(currentPage==='activity')renderChart();
}
function renderPool(){
 const base=destinations(config.proxies,tier);const pool=routePool(config.proxies,tier,excluded);
 $('pool-label').textContent=tier==='unverified'?'Locked':isPremium(tier)?`${titleCase(tier)} pool`:'Member pool';
 $('pool-count').textContent=tier==='unverified'?'Membership required':`${pool.length} / ${base.length} routes enabled`;
 const remaining=rotation.signature===JSON.stringify(pool.map(p=>p.url))&&Array.isArray(rotation.remaining)?rotation.remaining.length:pool.length;
 $('cycle-info').textContent=pool.length?`${remaining||pool.length} left in cycle`:'';
 $('launch').disabled=tier!=='unverified'&&!pool.length;
 $('proxy-list').replaceChildren();
 base.forEach((proxy,i)=>{
  const isExcluded=excluded.includes(proxy.url);const row=document.createElement('label');row.className=`proxy-row${isExcluded?' excluded':''}${tier==='unverified'?' route-locked':''}`;
  const details=document.createElement('div');const name=document.createElement('strong');name.textContent=`${String(i+1).padStart(2,'0')}  ${proxy.name}`;const status=document.createElement('small');status.textContent=tier==='unverified'?'Membership required':isExcluded?'Excluded':proxy.normal?'Member route':'Premium route';details.append(name,status);
  const toggle=document.createElement('input');toggle.type='checkbox';toggle.setAttribute('role','switch');toggle.checked=!isExcluded;toggle.disabled=tier==='unverified';toggle.setAttribute('aria-label',`Include ${proxy.name} in rotation`);
  toggle.addEventListener('change',()=>{const latest=read(KEYS.excluded,excluded);excluded=Array.isArray(latest)?latest:[];excluded=toggle.checked?excluded.filter(url=>url!==proxy.url):[...new Set([...excluded,proxy.url])];write(KEYS.excluded,excluded);renderPool();$('launch-note').textContent=routePool(config.proxies,tier,excluded).length?'Rotation updated.':'All routes excluded. Turn one back on to launch.';});
  row.append(details,toggle);$('proxy-list').append(row);
 });
}

let faviconSource='',faviconLoad=null,requestedFaviconColor='',appliedFaviconColor='';
function updateFavicon(accent){
 requestedFaviconColor=accent;
 if(faviconSource){
  if(appliedFaviconColor===accent)return;
  const link=document.querySelector('link[rel="icon"]');
  link.href=faviconDataUrl(faviconSource,accent);appliedFaviconColor=accent;return;
 }
 if(!faviconLoad)faviconLoad=fetch(new URL('./logo.svg',import.meta.url),{cache:'no-cache'})
  .then(response=>{if(!response.ok)throw new Error('Favicon unavailable');return response.text();})
  .then(source=>{faviconSource=source;updateFavicon(requestedFaviconColor);})
  .catch(()=>{faviconLoad=null;});
}

function applyAppearance(){
 const unlocked=canCustomizeAppearance(tier);
 const appearance=appearanceForTier(tier,settings,cleanSettings({}));
 $('appearance-controls').disabled=!unlocked;
 $('appearance-lock').hidden=unlocked;
 $('appearance').classList.toggle('appearance-locked',!unlocked);
 const color=colors.find(c=>c.id===appearance.color)||colors[7];const root=document.documentElement;
 const motion=appearance.motion&&!reducedMotion.matches;
 for(const [name,value]of Object.entries({'--accent':color.accent,'--button-start':color.start,'--button-end':color.end,'--logo-hue':color.hue,'--font-family':fonts[appearance.font],'--glow':`0 0 ${appearance.strength*5}px color-mix(in srgb,var(--accent) ${8+appearance.strength*2}%,transparent)`}))root.style.setProperty(name,value);
 document.body.classList.toggle('no-glow',!appearance.glow);document.body.classList.toggle('no-motion',!motion);
 $('glow').checked=appearance.glow;$('motion').checked=appearance.motion;$('font').value=appearance.font;$('glow-strength').value=appearance.strength;$('glow-value').textContent=appearance.strength;$('selected-color').textContent=color.label;
 updateFavicon(color.accent);
 document.querySelectorAll('[data-color]').forEach(button=>{button.disabled=!unlocked;const selected=button.dataset.color===color.id;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
 for(const category of ['wallpaper','trail']){
  $(category+'-access').textContent=isPremium(tier)?'Unlocked':'Premium · locked';
  document.querySelectorAll(`[data-effect="${category}"]`).forEach(button=>{
   const locked=!unlocked||(!isPremium(tier)&&button.dataset.value!=='none');button.disabled=!unlocked;const selected=(isPremium(tier)?settings[category]:'none')===button.dataset.value;
   button.classList.toggle('locked',locked);button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-disabled',String(locked));
   const suffix=!unlocked?' · Membership required':locked?' · Premium locked':'';button.setAttribute('aria-label',button.dataset.label+suffix);
  });
 }
 $('effects-note').textContent=!unlocked?'Activate a membership key to customize Veil.':!isPremium(tier)?'Premium unlocks all wallpapers and trails.':!motion?'Motion is paused by your animation or device preference.':'Effects match your accent. Cursor trails appear when you move a mouse.';
 effects.set({premium:isPremium(tier)&&!booting,wallpaper:appearance.wallpaper,trail:appearance.trail,color:color.accent,motion});
}
function render(){renderAccessGate();renderProfile();renderPool();refreshStats();applyAppearance();$('forget').disabled=tier==='unverified';$('storage-status').textContent=persistent?'This browser':'This visit only';$('launch-note').textContent=tier==='unverified'?'Activate a membership key to launch.':'Ready to launch.';if(!persistent)notify('Browser storage is unavailable. Changes last for this visit only.');}

function renderAccessGate(){
 const banned=tier==='banned';
 document.body.classList.toggle('banned',banned);
 document.querySelector('.app').hidden=banned;
 $('banned-screen').hidden=!banned;
 $('banned-screen').inert=booting;
 if(banned){
  masterUnlocked=false;
  document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
  $('key').value='';
 }
}

function navigate(){
 if(tier==='banned'){
  pageAnimation?.cancel();currentPage='banned';
  document.querySelectorAll('.page').forEach(page=>page.hidden=true);
  if(location.hash!=='#banned')history.replaceState(null,'','#banned');
  document.title='Veil — BANNED';return;
 }
 if(location.hash==='#banned')history.replaceState(null,'','#home');
 const wanted=location.hash.slice(1);const page=['home','launcher','activity','badges','membership','appearance','settings'].includes(wanted)?wanted:'home';
 const changed=page!==currentPage;currentPage=page;pageAnimation?.cancel();document.querySelectorAll('.page').forEach(el=>el.hidden=el.id!==page);
 document.querySelectorAll('[data-page]').forEach(el=>{const active=el.dataset.page===page;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 $('page-box').scrollTop=0;document.title=`Veil — ${titleCase(page)}`;notify('');
 if(page==='launcher')renderPool();if(page==='activity')refreshStats();
 if(changed&&appearanceForTier(tier,settings,cleanSettings({})).motion&&!reducedMotion.matches&&!booting)pageAnimation=$(page).animate([{opacity:0,transform:'translateY(10px)',filter:'blur(3px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:300,easing:'cubic-bezier(.2,.7,.2,1)'});
}
window.addEventListener('hashchange',navigate);
function activatePrompt(text){location.hash='membership';navigate();$('activation-message').textContent=text;$('activation-message').className='hint error';$('key').focus();}
$('launch').addEventListener('click',()=>{
 if(tier==='banned')return;
 if(tier==='unverified'){activatePrompt('Enter a Member, Premium, or Owner key to unlock launching.');return;}
 const error=configurationError(config);if(error){notify(error);return;}
 const latest=read(KEYS.rotation,rotation);if(latest&&typeof latest==='object')rotation=latest;
 const pool=routePool(config.proxies,tier,excluded);if(!pool.length){notify('All routes are excluded. Turn a route back on.');return;}
 if(pool.length===1&&rotation.last===pool[0].url){notify('Enable another route to keep launches from repeating.');return;}
 const next=nextRoute(pool,rotation);if(!next)return;
 const tab=window.open('about:blank','_blank');if(!tab){notify('Allow popups for Veil, then launch again.');return;}
 try{tab.opener=null;tab.location.replace(next.url);}catch{tab.close();notify('Could not open the route. Try again.');return;}
 rotation=next.state;write(KEYS.rotation,rotation);stats=cleanStats(read(KEYS.stats,stats));stats.launches++;stats.lastLaunch=pool.find(p=>p.url===next.url).name;stats.lastAt=Date.now();write(KEYS.stats,stats);renderPool();refreshStats();$('launch-note').textContent=`Opened ${stats.lastLaunch}.`;
 if(settings.motion&&!reducedMotion.matches)$('launch').animate([{transform:'scale(1)'},{transform:'scale(.97)'},{transform:'scale(1)'}],{duration:300});
});
document.querySelectorAll('[data-buy]').forEach(button=>button.addEventListener('click',()=>showDialog('Contact the owner',`Contact the owner to buy ${button.dataset.buy} for ${button.dataset.buy==='Member'?'$1':'$5'} lifetime. The owner will provide your key.`)));
async function digestKey(value){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value.trim()))),b=>b.toString(16).padStart(2,'0')).join('');}
function askName(){if(['member','premium','owner'].includes(tier)&&!profile.named&&!booting&&!$('name-dialog').open&&!$('master-dialog').open){$('first-name').value='';$('name-error').textContent='';$('name-dialog').showModal();$('first-name').focus();}}
function setTier(value){tier=normalizeTier(value);write(KEYS.member,{status:tier});render();navigate();}
$('activation-form').addEventListener('submit',async event=>{
 event.preventDefault();const message=$('activation-message');$('verify').disabled=true;message.className='hint';message.textContent='Checking key…';
 try{
  if(!crypto?.subtle)throw new Error('Open Veil over HTTPS or localhost.');
  const key=$('key').value;
  if(config.masterKeySha256&&await digestKey(key)===config.masterKeySha256){$('key').value='';message.textContent='';masterUnlocked=true;openMaster();return;}
  const result=await keyTier(key,config);if(!result)throw new Error('Key not recognized.');
  setTier(result);$('key').value='';message.className='hint success';message.textContent=`${titleCase(tier)} activated.`;askName();
 }catch(error){message.className='hint error';message.textContent=error.message;}finally{$('verify').disabled=false;}
});

$('recovery-form').addEventListener('submit',async event=>{
 event.preventDefault();const message=$('recovery-message');$('recover').disabled=true;message.className='hint';message.textContent='Checking key…';
 try{
  if(!crypto?.subtle)throw new Error('Open Veil over HTTPS or localhost.');
  const result=await keyTier($('recovery-key').value,config);
  if(!result)throw new Error('Key not recognized. Enter a valid membership key.');
  $('recovery-key').value='';
  if(result==='banned')throw new Error('The Banned tier is still active. Use a different membership key.');
  setTier(result);message.textContent='';askName();
 }catch(error){message.className='hint error';message.textContent=error.message;}
 finally{$('recover').disabled=false;}
});

function normalizedName(value){return value.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,32);}
$('name-dialog').addEventListener('cancel',event=>event.preventDefault());
$('name-form').addEventListener('submit',event=>{event.preventDefault();const name=normalizedName($('first-name').value);if(!name){$('name-error').textContent='Enter a name to continue.';return;}profile={...profile,name,named:true};write(KEYS.profile,profile);$('name-dialog').close();renderProfile();});
function openMaster(){if(!masterUnlocked)return;$('master-name').value=profile.name;$('master-tier').value=tier;for(const badge of BADGE_IDS)$('badge-'+badge).checked=profile.badges.includes(badge);$('master-error').textContent='';$('master-dialog').showModal();}
$('close-master').addEventListener('click',()=>$('master-dialog').close());$('master-dialog').addEventListener('close',()=>{masterUnlocked=false;});
$('master-form').addEventListener('submit',event=>{event.preventDefault();if(!masterUnlocked)return;const name=normalizedName($('master-name').value);if(!name){$('master-error').textContent='Enter a profile name.';return;}profile=cleanProfile({name,named:true,badges:BADGE_IDS.filter(b=>$('badge-'+b).checked),badgeSchema:2});write(KEYS.profile,profile);setTier($('master-tier').value);$('master-dialog').close();notify('Profile updated.');});

$('profile-avatar').innerHTML=personIcon;
document.querySelectorAll('[data-nav-icon]').forEach(el=>el.innerHTML=navIcons[el.dataset.navIcon]);
for(const id of ['close-dialog','close-master'])$(id).innerHTML=closeIcon;
for(const id of BADGE_IDS){
 const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';input.id='badge-'+id;
 const icon=document.createElement('span');icon.className='badge-icon';icon.innerHTML=badgeIcons[id];
 const text=document.createElement('span');text.textContent=badgeDetails[id].name;
 label.append(input,text,icon);$('badge-toggles').append(label);
}
function renderBadgeGuide(){
 $('badge-guide').replaceChildren();
 for(const id of BADGE_IDS){
  const badge=badgeDetails[id];const card=document.createElement('article');card.className='badge-guide-card';
  const head=document.createElement('div');head.className='badge-guide-head';const icon=document.createElement('span');icon.className='badge-guide-icon';icon.innerHTML=badgeIcons[id];
  const title=document.createElement('h2');title.textContent=badge.name;head.append(icon,title);
  if(profile.badges.includes(id)){const owned=document.createElement('span');owned.className='badge';owned.textContent='On your profile';head.append(owned);}
  const summary=document.createElement('p');summary.className='badge-summary';summary.textContent=badge.summary;
  const meaning=document.createElement('p');meaning.textContent=badge.meaning;
  const how=document.createElement('h3');how.textContent='How to get it';const instruction=document.createElement('p');instruction.textContent=badge.how;
  card.append(head,summary,meaning,how,instruction);$('badge-guide').append(card);
 }
}
$('member-plan-icon').innerHTML=tierIcons.member;$('premium-plan-icon').innerHTML=tierIcons.premium;
for(const color of colors){const button=document.createElement('button');button.type='button';button.className='color-option';button.dataset.color=color.id;button.style.setProperty('--swatch',color.accent);const dot=document.createElement('span');dot.className='color-dot';dot.setAttribute('aria-hidden','true');const label=document.createElement('span');label.textContent=color.label;button.append(dot,label);button.addEventListener('click',()=>{if(!canCustomizeAppearance(tier))return;settings.color=color.id;write(KEYS.settings,settings);applyAppearance();});$('color-options').append(button);}
for(const [category,items]of [['wallpaper',wallpapers],['trail',trails]])for(const [id,label,icon]of [['none','Off','○'],...items]){
 const button=document.createElement('button');button.type='button';button.className='effect-option';button.dataset.effect=category;button.dataset.value=id;button.dataset.label=label;const symbol=document.createElement('span');symbol.className='effect-icon effect-'+id;symbol.textContent=icon;const text=document.createElement('span');text.textContent=label;const lock=document.createElement('small');lock.className='effect-lock';lock.textContent='Premium';button.append(symbol,text,lock);
 button.addEventListener('click',()=>{if(!canCustomizeAppearance(tier))return;if(id!=='none'&&!isPremium(tier)){showDialog('Premium effects','Upgrade to Premium ($5 lifetime) to unlock eight animated wallpapers and eight cursor trails.');return;}settings[category]=id;write(KEYS.settings,settings);applyAppearance();});$(category+'-options').append(button);
}
for(const [id,property,event]of [['font','font','change'],['glow','glow','change'],['glow-strength','strength','input'],['motion','motion','change']])$(id).addEventListener(event,()=>{if(!canCustomizeAppearance(tier)){applyAppearance();return;}settings[property]=['glow','motion'].includes(property)?$(id).checked:property==='strength'?Number($(id).value):$(id).value;write(KEYS.settings,settings);applyAppearance();});
reducedMotion.addEventListener('change',applyAppearance);
$('forget').addEventListener('click',()=>showDialog('Forget membership?','You will need a key to activate again. Your profile and activity stay saved.',()=>{setTier('unverified');try{localStorage.removeItem('volt.membership.v1');}catch{persistent=false;}notify('Membership forgotten.');}));
$('reset-stats').addEventListener('click',()=>showDialog('Reset statistics?','This clears activity, streaks, and launch history. Your profile, membership, and exclusions stay saved.',()=>{stats=cleanStats({});sessionMs=0;write(KEYS.stats,stats);refreshStats();notify('Statistics reset.');}));
$('export').addEventListener('click',()=>{const data={app:'Veil',exportedAt:new Date().toISOString(),membership:tier,profile,stats,settings};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='veil-data.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Data exported.');});
let lastTick=performance.now(),lastActivity=performance.now();
for(const event of ['pointerdown','pointermove','keydown','touchstart','scroll','focus'])window.addEventListener(event,()=>{lastActivity=performance.now();},{passive:true});
function tick(){const now=performance.now();const delta=booting||tier==='banned'?0:activeDelta(now-lastTick,{visible:!document.hidden,focused:document.hasFocus(),idleMs:now-lastActivity});lastTick=now;stats=cleanStats(read(KEYS.stats,stats));if(delta){stats.activeMs+=delta;sessionMs+=delta;stats=updateStreak(stats);const day=localDay();stats.daily[day]=(stats.daily[day]||0)+delta;write(KEYS.stats,stats);}refreshStats();}
setInterval(tick,1000);document.addEventListener('visibilitychange',()=>{lastTick=performance.now();});window.addEventListener('pagehide',tick);
window.addEventListener('storage',event=>{if(event.key===KEYS.member){tier=normalizeTier(read(KEYS.member,{})?.status);render();navigate();}if(event.key===KEYS.profile){profile=cleanProfile(read(KEYS.profile,{}));renderProfile();}if(event.key===KEYS.stats){stats=cleanStats(read(KEYS.stats,{}));refreshStats();}if(event.key===KEYS.settings){settings=cleanSettings(read(KEYS.settings,{}));applyAppearance();}if(event.key===KEYS.excluded){const saved=read(KEYS.excluded,[]);excluded=Array.isArray(saved)?saved:[];renderPool();}});
render();navigate();
const bootStart=performance.now();
function bootProgress(){const progress=Math.min(1,(performance.now()-bootStart)/5000);$('loading-bar').style.width=`${progress*100}%`;document.querySelector('.loading-track').setAttribute('aria-valuenow',String(Math.round(progress*100)));if(progress<1)requestAnimationFrame(bootProgress);else{booting=false;document.querySelector('.app').removeAttribute('inert');$('banned-screen').removeAttribute('inert');document.body.classList.remove('booting');$('loading-label').textContent='Ready';$('loading-screen').classList.add('loaded');setTimeout(()=>{$('loading-screen').hidden=true;applyAppearance();if(tier!=='unverified')askName();},350);}}
requestAnimationFrame(bootProgress);
