export function createEffects(wallpaperCanvas, trailCanvas) {
  const bg = wallpaperCanvas.getContext('2d'); const ctx = trailCanvas.getContext('2d');
  let w=0,h=0,dpr=1,frame=0,last=0,running=false;
  let options={premium:false,wallpaper:'none',trail:'none',color:'#c18aff',motion:true};
  const points=[]; const particles=[];
  const seeds=Array.from({length:90},(_,i)=>({x:((i*73.37)%100)/100,y:((i*37.91)%100)/100,r:1+(i%3),speed:.2+(i%7)/10}));
  function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);for(const canvas of [wallpaperCanvas,trailCanvas]){canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';}bg?.setTransform(dpr,0,0,dpr,0,0);ctx?.setTransform(dpr,0,0,dpr,0,0);}
  resize();addEventListener('resize',resize);
  function glow(context,x,y,r,opacity){const g=context.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,options.color);g.addColorStop(1,'transparent');context.globalAlpha=opacity;context.fillStyle=g;context.fillRect(x-r,y-r,r*2,r*2);}
  function drawBackground(t){
    bg.clearRect(0,0,w,h);bg.strokeStyle=options.color;bg.fillStyle=options.color;bg.lineWidth=1;
    const kind=options.wallpaper;
    if(kind==='aurora'){bg.filter='blur(22px)';for(let i=0;i<5;i++){bg.beginPath();for(let x=0;x<=w+20;x+=20){const y=h*(.18+i*.13)+Math.sin(x/250+t*.35+i)*80+Math.cos(x/400-t*.2)*50;x?bg.lineTo(x,y):bg.moveTo(x,y);}bg.globalAlpha=.06+i*.018;bg.lineWidth=35+i*7;bg.stroke();}}
    if(kind==='stars'){for(const s of seeds){bg.globalAlpha=.12+(Math.sin(t*s.speed+s.x*20)+1)*.16;bg.beginPath();bg.arc(s.x*w,(s.y*h-t*6*s.speed%h+h)%h,s.r,0,Math.PI*2);bg.fill();}}
    if(kind==='waves'){for(let i=0;i<14;i++){bg.beginPath();for(let x=0;x<=w+12;x+=12){const y=h*.5+Math.sin(x/200+t*.7+i*.2)*(80+i*13)+i*10;x?bg.lineTo(x,y):bg.moveTo(x,y);}bg.globalAlpha=.12;bg.lineWidth=1.4;bg.stroke();}}
    if(kind==='rain'){bg.font='13px ui-monospace,monospace';for(let i=0;i<Math.ceil(w/36);i++){const x=i*36;const y=(t*(18+i%5*6)+i*71)%(h+200)-100;for(let j=0;j<8;j++){bg.globalAlpha=(8-j)*.022;bg.fillText(['0','1','·','∶'][(i+j)%4],x,y-j*18);}}}
    if(kind==='orbits'){bg.globalAlpha=.12;bg.lineWidth=1;for(let i=0;i<8;i++){bg.save();bg.translate(w*.5,h*.5);bg.rotate(t*.04*(i%2?1:-1)+i*.4);bg.beginPath();bg.ellipse(0,0,140+i*55,65+i*30,0,0,Math.PI*2);bg.stroke();const a=t*.15+i;bg.beginPath();bg.arc(Math.cos(a)*(140+i*55),Math.sin(a)*(65+i*30),4,0,Math.PI*2);bg.fill();bg.restore();}}
    if(kind==='nebula'){
      bg.globalCompositeOperation='screen';
      for(let i=0;i<7;i++)glow(bg,w*(.5+.48*Math.sin(t*.09+i*2)),h*(.5+.43*Math.cos(t*.12+i*1.6)),Math.min(w,h)*(.32+i*.045),.28);
      bg.globalCompositeOperation='source-over';bg.fillStyle=options.color;
      for(const s of seeds.slice(0,45)){bg.globalAlpha=.2+(Math.sin(t*.6+s.x*15)+1)*.12;bg.beginPath();bg.arc(s.x*w,s.y*h,s.r*.7,0,Math.PI*2);bg.fill();}
    }
    if(kind==='vortex'){bg.save();bg.translate(w*.5,h*.5);bg.rotate(t*.07);for(let ring=0;ring<6;ring++){bg.beginPath();for(let i=0;i<180;i++){const a=i/22+ring*Math.PI/3+t*.16;const r=i*3.2;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?bg.lineTo(x,y):bg.moveTo(x,y);}bg.globalAlpha=.15;bg.lineWidth=1.7;bg.stroke();}bg.restore();}
    if(kind==='fireflies'){for(const s of seeds.slice(0,42)){const x=s.x*w+Math.sin(t*s.speed+s.y*8)*48,y=s.y*h+Math.cos(t*s.speed*.7+s.x*9)*36;glow(bg,x,y,14+s.r*3,.25);bg.globalAlpha=.3+(Math.sin(t+s.x*8)+1)*.2;bg.fillStyle=options.color;bg.beginPath();bg.arc(x,y,s.r*.8,0,Math.PI*2);bg.fill();}}
    bg.globalAlpha=1;bg.filter='none';
  }
  function star(x,y,size){ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4;const r=i%2?size*.28:size;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();}
  function drawTrail(t,now){
    ctx.clearRect(0,0,w,h);const kind=options.trail;
    while(points.length && now-points[0].at>700)points.shift();
    ctx.fillStyle=options.color;ctx.strokeStyle=options.color;ctx.lineCap='round';ctx.lineJoin='round';
    if(kind==='comet'||kind==='ribbon'){
      for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];ctx.globalAlpha=(1-(now-b.at)/700)*.55;ctx.lineWidth=kind==='ribbon'?7:Math.max(1,i/points.length*6);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();if(kind==='ribbon'){ctx.globalAlpha*=.4;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.x+Math.sin(i*.4)*9,a.y+8);ctx.lineTo(b.x+Math.sin((i+1)*.4)*9,b.y+8);ctx.stroke();}}
    }
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];const age=(now-p.at)/p.life;if(age>=1){particles.splice(i,1);continue;}ctx.globalAlpha=(1-age)*.7;const x=p.x+p.vx*age,y=p.y+p.vy*age;ctx.lineWidth=1.3;
      if(kind==='sparkles')star(x,y,p.r*(1-age*.5));
      if(kind==='bubbles'){ctx.beginPath();ctx.arc(x,y-age*25,p.r+age*8,0,Math.PI*2);ctx.stroke();}
      if(kind==='embers'){ctx.beginPath();ctx.arc(x,y-age*45,p.r*(1-age),0,Math.PI*2);ctx.fill();}
      if(kind==='hearts'){const size=p.r*1.5*(1-age*.4);ctx.save();ctx.translate(x,y-age*35);ctx.beginPath();ctx.moveTo(0,size*.75);ctx.bezierCurveTo(-size*1.5,-size*.1,-size,-size*1.3,0,-size*.55);ctx.bezierCurveTo(size,-size*1.3,size*1.5,-size*.1,0,size*.75);ctx.fill();ctx.restore();}
      if(kind==='pulse'){ctx.globalAlpha=(1-age)*.5;ctx.lineWidth=2*(1-age)+.5;ctx.beginPath();ctx.arc(p.x,p.y,4+age*32,0,Math.PI*2);ctx.stroke();}
    }
    if(kind==='orbit'&&points.length){const p=points.at(-1),fade=Math.max(0,1-(now-p.at)/700);ctx.globalAlpha=fade*.65;for(let i=0;i<3;i++){const a=t*4+i*Math.PI*2/3;ctx.beginPath();ctx.arc(p.x+Math.cos(a)*16,p.y+Math.sin(a)*16,3,0,Math.PI*2);ctx.fill();}}
    ctx.globalAlpha=1;
  }
  function loop(now){frame=0;if(!running)return;if(now-last>30){last=now;const t=now/1000;drawBackground(t);drawTrail(t,now);}frame=requestAnimationFrame(loop);}
  function restart(){cancelAnimationFrame(frame);running=Boolean(bg&&ctx&&options.premium&&options.motion&&!document.hidden&&(options.wallpaper!=='none'||options.trail!=='none'));bg?.clearRect(0,0,w,h);ctx?.clearRect(0,0,w,h);if(running)frame=requestAnimationFrame(loop);}
  let lastPointer=0;
  addEventListener('pointermove',event=>{if(!running||options.trail==='none'||event.pointerType==='touch')return;const now=performance.now();const interval=options.trail==='pulse'?75:options.trail==='hearts'?40:14;if(now-lastPointer<interval)return;lastPointer=now;points.push({x:event.clientX,y:event.clientY,at:now});if(points.length>42)points.shift();if(['sparkles','bubbles','embers','hearts','pulse'].includes(options.trail)){particles.push({x:event.clientX,y:event.clientY,at:now,life:options.trail==='bubbles'?1000:650,vx:(Math.random()-.5)*40,vy:(Math.random()-.5)*30,r:options.trail==='sparkles'?4+Math.random()*4:2+Math.random()*3});if(particles.length>75)particles.shift();}},{passive:true});
  addEventListener('blur',()=>{points.length=0;particles.length=0;});document.addEventListener('visibilitychange',restart);
  return {set(next){const changed=JSON.stringify(options)!==JSON.stringify({...options,...next});options={...options,...next};if(changed){points.length=0;particles.length=0;restart();}}};
}
