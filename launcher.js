export function validateProxyUrl(value) {
 const url=new URL(value);
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('Invalid proxy URL');
 return url.href;
}

// Keep the top-level tab on about:blank; the destination lives in a child frame.
// This must be called synchronously from the launch click, before any await.
export function openProxyInBlank(value,{openWindow=(...args)=>window.open(...args),accent='#c18aff'}={}) {
 const url=validateProxyUrl(value);
 const tab=openWindow('about:blank','_blank');
 if(!tab)return null;
 try{
  tab.opener=null;
  const doc=tab.document;
  const color=/^#[a-f0-9]{6}$/i.test(accent)?accent:'#c18aff';
  doc.documentElement.lang='en';
  const meta=doc.createElement('meta');meta.name='viewport';meta.content='width=device-width,initial-scale=1';
  const style=doc.createElement('style');style.textContent=`*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#0c0d14;color:#f3eff9;font:12px system-ui,sans-serif}body{display:flex;flex-direction:column}header{height:42px;flex-shrink:0;display:flex;align-items:center;gap:12px;padding:0 15px;background:#11111b;border-bottom:1px solid ${color}55}strong{color:${color};font-size:12px}span{margin-left:auto;color:#a6a0b1;font-size:10px}a{display:inline-flex;align-items:center;padding:5px 10px;border:1px solid ${color}66;border-radius:999px;color:${color};text-decoration:none;font-size:10px}a:focus-visible{outline:2px solid ${color};outline-offset:2px}iframe{display:block;width:100%;flex:1;min-height:0;border:0;background:white}@media(max-width:420px){header{gap:8px;padding:0 10px}span{font-size:9px}}`;
  doc.head.replaceChildren(meta,style);doc.title='Veil proxy';
  const bar=doc.createElement('header');
  const title=doc.createElement('strong');title.textContent='Veil proxy';
  const hint=doc.createElement('span');hint.textContent='If the frame is blocked:';
  const direct=doc.createElement('a');direct.textContent='Open directly ↗';direct.href=url;direct.target='_self';direct.rel='noreferrer';direct.title='Open the proxy directly if it cannot load inside the frame';
  bar.append(title,hint,direct);
  const frame=doc.createElement('iframe');frame.title='Veil proxy content';frame.referrerPolicy='no-referrer';
  frame.setAttribute('allow','fullscreen; clipboard-read; clipboard-write');frame.setAttribute('allowfullscreen','');
  frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-pointer-lock');
  frame.src=url;
  doc.body.replaceChildren(bar,frame);
  return tab;
 }catch(error){tab.close();throw error;}
}
