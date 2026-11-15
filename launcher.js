export function validateProxyUrl(value) {
 const url=new URL(value);
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('Invalid proxy URL');
 return url.href;
}

// Keep the top-level tab on about:blank; the destination lives in a child frame.
// This must be called synchronously from the launch click, before any await.
export function openProxyInBlank(value,{openWindow=(...args)=>window.open(...args)}={}) {
 const url=validateProxyUrl(value);
 const tab=openWindow('about:blank','_blank');
 if(!tab)return null;
 try{
  tab.opener=null;
  const doc=tab.document;
  doc.documentElement.lang='en';
  const meta=doc.createElement('meta');meta.name='viewport';meta.content='width=device-width,initial-scale=1';
  const style=doc.createElement('style');style.textContent='html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#0c0d14}iframe{display:block;width:100%;height:100%;border:0;background:white}';
  doc.head.replaceChildren(meta,style);doc.title='Veil X Achroma';
  const frame=doc.createElement('iframe');frame.title='Veil X Achroma';frame.referrerPolicy='no-referrer';
  frame.setAttribute('allow','fullscreen; clipboard-read; clipboard-write');frame.setAttribute('allowfullscreen','');
  frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-pointer-lock');
  frame.src=url;
  doc.body.replaceChildren(frame);
  return tab;
 }catch(error){tab.close();throw error;}
}
