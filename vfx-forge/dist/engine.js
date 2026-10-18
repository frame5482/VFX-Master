export const PARTS=[
 {type:'rune',name:'Rune circle',th:'วงเวท',icon:'⊙'}, {type:'ring',name:'Energy ring',th:'วงแหวนพลังงาน',icon:'◎'},
 {type:'sparks',name:'Rising sparks',th:'ละอองประกาย',icon:'✧'}, {type:'beam',name:'Light pillar',th:'เสาแสง',icon:'⋮'},
 {type:'slash',name:'Arc slash',th:'คลื่นดาบ',icon:'◜'}, {type:'burst',name:'Star burst',th:'แสงระเบิด',icon:'✴'},
 {type:'flame',name:'Spirit flame',th:'เปลวไฟ',icon:'♨'}, {type:'lightning',name:'Lightning',th:'สายฟ้า',icon:'ϟ'},
 {type:'smoke',name:'Soft smoke',th:'ควัน',icon:'☁'}, {type:'orb',name:'Energy core',th:'แกนพลังงาน',icon:'◉'},
 {type:'shield',name:'Arcane shield',th:'โล่เวท',icon:'⬡'}, {type:'vortex',name:'Vortex',th:'วังวน',icon:'◌'}
];
export const THEMES=[['Arcane','#a48aff','#eee2ff'],['Flame','#ff713e','#ffe7a3'],['Glacier','#67cfff','#e2fdff'],['Nature','#79efb5','#e4ffbe'],['Sakura','#ff8bbf','#ffe1ed'],['Solar','#f5ce74','#fff7d8']];
export function layer(type,extra={}){const p=PARTS.find(p=>p.type===type);return {id:crypto.randomUUID(),type,name:p.name,color:'#ae8dff',accent:'#f4e5ff',size:1,opacity:1,rotation:0,x:0,y:0,z:0,tiltX:0,tiltY:0,depth:1,speed:1,density:32,seed:42,start:0,length:2,visible:true,blend:'lighter',...extra};}
export function presets(){return [
 {name:'Arcane awakening',tag:'MAGIC · 4 LAYERS',layers:[layer('rune',{name:'Ancient sigil',size:1.08,y:.24}),layer('beam',{name:'Ascension',size:.82,y:-.08,opacity:.75}),layer('sparks',{name:'Stardust',density:48,size:1.18}),layer('ring',{name:'Ground pulse',y:.24,size:1.12,opacity:.8})]},
 {name:'Crimson slash',tag:'COMBAT · 3 LAYERS',layers:[layer('slash',{rotation:-25}),layer('slash',{rotation:35,size:.75,opacity:.65,start:.15,length:1.85}),layer('sparks',{density:35,size:.9})],theme:1},
 {name:'Frozen nova',tag:'ICE · 3 LAYERS',layers:[layer('burst',{density:16}),layer('ring',{size:1.2}),layer('sparks',{density:48})],theme:2},
 {name:'Spirit flame',tag:'FIRE · 3 LAYERS',layers:[layer('flame',{density:35}),layer('orb',{size:.5,y:.15}),layer('sparks',{density:40,size:.9})],theme:1},
 {name:'Celestial shield',tag:'DEFENSE · 3 LAYERS',layers:[layer('shield',{size:1.15}),layer('orb',{size:.65,opacity:.5}),layer('sparks',{density:30})],theme:5},
 {name:'Thunder strike',tag:'LIGHTNING · 3 LAYERS',layers:[layer('lightning',{density:7}),layer('ring',{y:.3}),layer('burst',{size:.65,y:.2})],theme:2},
 {name:'Sakura bloom',tag:'HEALING · 3 LAYERS',layers:[layer('vortex',{size:1.1}),layer('sparks',{density:55}),layer('rune',{y:.25,opacity:.6})],theme:4},
 {name:'Void portal',tag:'DARK · 3 LAYERS',layers:[layer('vortex',{density:12}),layer('ring'),layer('smoke',{density:25,opacity:.45})]}
 ];}
export function rand(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
const TAU=Math.PI*2;
const previewContexts=new WeakSet(),glowSprites=new Map();
function glow(c,x,y,r,color,alpha=1){if(r<=0||alpha<=0)return;const oldAlpha=c.globalAlpha;c.globalAlpha*=alpha;
 if(previewContexts.has(c)){
  let sprite=glowSprites.get(color);
  if(!sprite){sprite=document.createElement('canvas');sprite.width=sprite.height=128;const sc=sprite.getContext('2d'),g=sc.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,color);g.addColorStop(.15,color+'bd');g.addColorStop(.5,color+'39');g.addColorStop(1,color+'00');sc.fillStyle=g;sc.fillRect(0,0,128,128);if(glowSprites.size>=64)glowSprites.delete(glowSprites.keys().next().value);glowSprites.set(color,sprite);}
  c.drawImage(sprite,x-r,y-r,r*2,r*2);
 }else{let g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(.15,color+'bd');g.addColorStop(.5,color+'39');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
 c.globalAlpha=oldAlpha;
}
function circle(c,r,w,color){c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();}
export function renderLayer(c,l,time,duration,options={}){if(!l.visible||time<l.start||time>=l.start+l.length)return;const preview=!!options.preview;if(preview)previewContexts.add(c);else previewContexts.delete(c);let local=(time-l.start)/l.length;const t=local*l.speed*2,random=rand(l.seed),s=142*l.size;
 c.save();c.translate(l.x*220,l.y*220);c.rotate(l.rotation*Math.PI/180);c.scale(s,s);c.globalAlpha=l.opacity; c.globalCompositeOperation=l.blend;c.lineCap='round';c.lineJoin='round';c.shadowColor=l.color;c.shadowBlur=preview?0:9;c.strokeStyle=l.color;c.fillStyle=l.color;
 const pulse=.78+.22*Math.sin(t*TAU);const col=l.color,hi=l.accent;
 switch(l.type){
 case 'rune': {c.save();c.scale(1,.38);c.rotate(t*.2);circle(c,1,.013,col);circle(c,.92,.006,hi);circle(c,.73,.009,col);circle(c,.66,.004,col);for(let i=0;i<28;i++){c.save();c.rotate(i*TAU/28);c.translate(.82,0);c.strokeStyle=i%3===0?hi:col;c.lineWidth=.012;c.beginPath();c.moveTo(-.02,-.035);c.lineTo(.025,.035);c.moveTo(.025,-.035);c.lineTo(-.02,.035);if(i%2===0){c.moveTo(-.025,0);c.lineTo(.03,0);}c.stroke();c.restore();}for(let k=0;k<2;k++){c.beginPath();for(let i=0;i<4;i++){let a=i*TAU/3+k*Math.PI;c.lineTo(Math.cos(a)*.62,Math.sin(a)*.62);}c.stroke();}glow(c,0,0,1.3,col,.35);c.restore();break;}
 case 'ring':{c.save();c.scale(1,.4);for(let i=0;i<3;i++){let f=(local*l.speed+i/3)%1; c.globalAlpha=l.opacity*(1-f)*.9;circle(c,.35+f*.85,.008+f*.007,i===0?hi:col);}c.restore();break;}
 case 'sparks':{c.shadowBlur=preview?0:5;for(let i=0;i<l.density;i++){let x=(random()-.5)*2.1,y0=random(),r=.008+random()*.017,vel=.4+random();let phase=(y0+t*vel*.3)%1,y=.75-phase*1.9;c.globalAlpha=l.opacity*Math.sin(phase*Math.PI)*(.5+random()*.5);glow(c,x+Math.sin(t+i)*.08,y,r*3,col);c.fillStyle=i%4===0?hi:col;c.beginPath();c.ellipse(x,y,r*.4,r*(1+vel),0,0,TAU);c.fill();if(i%9===0){c.strokeStyle=hi;c.lineWidth=.004;c.beginPath();c.moveTo(x-r*3,y);c.lineTo(x+r*3,y);c.moveTo(x,y-r*3);c.lineTo(x,y+r*3);c.stroke();}}break;}
 case 'beam':{c.shadowBlur=0;let g=c.createLinearGradient(0,-1.6,0,.5);g.addColorStop(0,col+'00');g.addColorStop(.5,col+'24');g.addColorStop(.95,col+'88');g.addColorStop(1,col+'00');c.fillStyle=g;c.beginPath();c.moveTo(-.43,-1.6);c.lineTo(.43,-1.6);c.lineTo(.65,.5);c.lineTo(-.65,.5);c.fill();for(let i=0;i<9;i++){let x=(random()-.5)*1.05;c.globalAlpha=l.opacity*(.12+random()*.3)*pulse;c.strokeStyle=i%3===0?hi:col;c.lineWidth=.003+random()*.009;c.beginPath();c.moveTo(x,-1.5);c.lineTo(x,.5);c.stroke();}c.globalAlpha=l.opacity;glow(c,0,.42,.75,col,.5);break;}
 case 'slash':{c.rotate(-.5+t*.15);c.scale(1,.52);for(let i=0;i<5;i++){let r=.8+i*.055;c.globalAlpha=l.opacity*(1-i/6)*pulse;c.lineWidth=.025+(4-i)*.012;c.strokeStyle=i===0?hi:col;c.beginPath();c.arc(0,0,r,Math.PI*.83,Math.PI*1.95);c.stroke();}for(let i=0;i<20;i++){let a=random()*3.3+2.6,r=.75+random()*.5;c.globalAlpha=l.opacity*random();c.lineWidth=.005;c.beginPath();c.arc(0,0,r,a,a+.12);c.stroke();}break;}
 case 'burst':{c.rotate(t*.1);glow(c,0,0,.65,col,.7);for(let i=0;i<l.density;i++){let a=TAU*i/l.density,len=.4+random()*.65;c.save();c.rotate(a);let g=c.createLinearGradient(.08,0,len,0);g.addColorStop(0,hi);g.addColorStop(.3,col+'b0');g.addColorStop(1,col+'00');c.fillStyle=g;c.beginPath();c.moveTo(.03,-.012);c.lineTo(len,-.005);c.lineTo(.03,.025);c.fill();c.restore();}glow(c,0,0,.24,hi);break;}
 case 'flame':{c.shadowBlur=preview?0:7;for(let i=0;i<l.density;i++){let phase=(random()+t*(.14+random()*.1))%1,x=(random()-.5)*.8*(1-phase),y=.6-phase*1.6,r=(.15+random()*.18)*(1-phase);c.globalAlpha=l.opacity*Math.sin(phase*Math.PI);c.fillStyle=i%5===0?hi:col;c.beginPath();c.moveTo(x-r,y+r);c.bezierCurveTo(x-r*1.2,y-r,x+Math.sin(t*8+i)*.16,y-r*3,x+r*.3,y-r*2.6);c.bezierCurveTo(x+r*.2,y-r*.5,x+r*1.6,y+r,x-r,y+r);c.fill();}glow(c,0,.4,.5,hi,.5);break;}
 case 'lightning':{let rng=rand(l.seed+Math.floor(t*10));for(let i=0;i<Math.min(12,l.density);i++){let x0=(rng()-.5)*1.1,y=-1.4;c.beginPath();c.moveTo(x0,y);for(let j=0;j<13;j++){y+=.15;x0+=(rng()-.5)*.45;c.lineTo(x0,y);}c.globalAlpha=l.opacity*(.4+rng()*.6);c.strokeStyle=col;c.lineWidth=.025;c.stroke();c.strokeStyle=hi;c.lineWidth=.006;c.stroke();}break;}
 case 'smoke':{c.shadowBlur=0;for(let i=0;i<l.density;i++){let phase=(random()+t*.1)%1,x=(random()-.5)*1.5+Math.sin(phase*5+i)*.15,y=.5-phase*1.6;c.globalAlpha=l.opacity*Math.sin(phase*Math.PI)*.2;glow(c,x,y,.2+phase*.35,col);}break;}
 case 'orb':{c.shadowBlur=0;glow(c,0,0,.9,col,.6*pulse);glow(c,0,0,.4,hi,.8);c.rotate(t*.3);for(let i=0;i<3;i++){c.save();c.rotate(i*Math.PI/3);c.scale(1,.4);circle(c,.55,.008,col);c.restore();}break;}
 case 'shield':{glow(c,0,0,1.1,col,.2);circle(c,1,.012,col);circle(c,.96,.004,hi);const R=.16;c.lineWidth=.006;c.globalAlpha=l.opacity*.5;for(let row=-6;row<=6;row++)for(let x=-5;x<=5;x++){let px=x*R*1.73+(row%2)*R*.865,py=row*R*1.5;if(px*px+py*py>.77)continue;c.beginPath();for(let i=0;i<7;i++){let a=i*TAU/6+Math.PI/6;c.lineTo(px+Math.cos(a)*R,py+Math.sin(a)*R);}c.stroke();}break;}
 case 'vortex':{c.rotate(-t*.6);for(let i=0;i<Math.min(l.density,20);i++){c.strokeStyle=i%4===0?hi:col;c.globalAlpha=l.opacity*(.25+random()*.6);c.lineWidth=.005+random()*.012;c.beginPath();let start=random()*TAU;for(let j=0;j<90;j++){let a=start+j*.035,r=.18+j*.009;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.stroke();}glow(c,0,0,.4,col,.4);break;}
 } c.restore();
}
export function renderEffect(canvas,layers,time,duration,options={}){const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);if(options.background){c.fillStyle=options.background;c.fillRect(0,0,w,h);}c.save();c.translate(w/2,h/2);const scale=Math.min(w,h)/512*(options.zoom||1);c.scale(scale,scale);for(const l of layers)renderLayer(c,l,time,duration,options);c.restore();return c;}
