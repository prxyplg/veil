import {mkdir,writeFile} from 'node:fs/promises';
const entries=[
['vole','VOLE.wtf','https://vole.wtf'],['playdaily','Daily Games','https://playdaily.org'],
['bored','Bored.com','https://www.bored.com'],['r74n','R74n','https://r74n.com'],['useless-web','The Useless Web','https://theuselessweb.com'],['geoguessr','GeoGuessr','https://www.geoguessr.com'],['wikitrivia','Wikitrivia Daily','https://wikitrivia.tomjwatson.com/daily'],['higher-lower','The Higher Lower Game','https://www.higherlowergame.com'],['toms-toys',"Tom’s Toys",'https://toms.toys'],['globle','Globle','https://globle-game.com/game'],['lostgamer','Lostgamer','https://lostgamer.io'],['skribbl','skribbl.io','https://skribbl.io'],['gartic-phone','Gartic Phone','https://garticphone.com'],['quick-draw','Quick, Draw!','https://quickdraw.withgoogle.com'],['scale-universe','The Scale of the Universe','https://scaleofuniverse.com/en'],['neal-fun','Neal.fun','https://neal.fun'],['magnitudle','Magnitudle','https://magnitudle.com'],['oasis','Oasis AI','https://oasis-ai.org/play.php'],['codepen','Interactive CodePen','https://codepen.io/akm2/full/AGgarW?utm_medium=with-love&utm_source=shouldseethis.com'],['historical-tech-tree','Historical Tech Tree','https://www.historicaltechtree.com/?node=recP2LgxgbeHNEZRO']];
await mkdir('assets/sites',{recursive:true});
let previous=[];try{previous=JSON.parse(await (await import('node:fs/promises')).readFile('assets/sites/sources.json','utf8'));}catch{}
const results=[];
const attr=(tag,key)=>tag.match(new RegExp('\\b'+key+'\\s*=\\s*["\x27]([^"\x27]+)["\x27]','i'))?.[1]?.replaceAll('&amp;','&');
async function fetchUrl(url){return fetch(url,{signal:AbortSignal.timeout(8000),headers:{'User-Agent':'Mozilla/5.0'}});}
async function get(entry){
 const[id,name,url]=entry;const existing=previous.find(site=>site.id===id);if(existing?.logo){results.push(existing);return;}const candidates=[];let title='';
 try{const page=await fetchUrl(url);if(page.ok){const html=await page.text();title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()||'';
 for(const tag of html.match(/<link\b[^>]*>/gi)||[]){const rel=attr(tag,'rel');const href=attr(tag,'href');if(rel&&/icon/i.test(rel)&&href&&!/mask-icon/i.test(rel))candidates.push(new URL(href,page.url).href);}
 }}catch{}
 candidates.push(new URL('/favicon.ico',url).href);
 if(['neal-fun','codepen'].includes(id))candidates.push('https://www.google.com/s2/favicons?domain='+new URL(url).hostname+'&sz=128');
 for(const source of [...new Set(candidates)]){
  try{const response=await fetchUrl(source);if(!response.ok)continue;const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length<30||bytes.length>1500000)continue;
  const type=response.headers.get('content-type')||'';const text=new TextDecoder().decode(bytes.slice(0,300));
  let ext=type.includes('svg')||text.includes('<svg')?'svg':bytes[0]===137&&bytes[1]===80?'png':bytes[0]===0&&bytes[1]===0&&bytes[2]===1?'ico':bytes[0]===255&&bytes[1]===216?'jpg':String.fromCharCode(...bytes.slice(0,4))==='RIFF'?'webp':bytes[0]===71&&bytes[1]===73?'gif':null;
  if(!ext)continue;
  if(ext==='svg'&&(/<script|<foreignObject|(?:href|src)=["\x27](?:https?:|\/\/)|@import|onload=/i.test(new TextDecoder().decode(bytes))))continue;
  const path=`assets/sites/${id}.${ext}`;await writeFile(path,bytes);const result={id,name,url,logo:path,source,title};results.push(result);console.log(JSON.stringify({id,status:'downloaded',bytes:bytes.length}));return;
  }catch{}
 }
 results.push({id,name,url,logo:'',title});console.log(JSON.stringify({id,status:'unavailable',title}));
}
for(let i=0;i<entries.length;i+=4)await Promise.all(entries.slice(i,i+4).map(get));
results.sort((a,b)=>entries.findIndex(e=>e[0]===a.id)-entries.findIndex(e=>e[0]===b.id));
await writeFile('assets/sites/sources.json',JSON.stringify(results,null,2));
