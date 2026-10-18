import{rand}from './engine.js?perf=2';
export const DEFAULT_CAMERA={yaw:.65,pitch:.35,distance:6};
const TAU=Math.PI*2;

// Geometry lives in world coordinates; the camera only projects it for display.
export function buildScene(layers,time){
 const segments=[];
 for(const l of layers){
  if(!l.visible||l.opacity<=0||time<l.start||time>=l.start+l.length)continue;
  const phase=(time-l.start)/l.length,t=phase*l.speed*2,rng=rand(l.seed),size=l.size;
  const rz=l.rotation*Math.PI/180,rx=(l.tiltX||0)*Math.PI/180,ry=(l.tiltY||0)*Math.PI/180;
  function transform(p){let[x,y,z]=p;[y,z]=[y*Math.cos(rx)-z*Math.sin(rx),y*Math.sin(rx)+z*Math.cos(rx)];[x,z]=[x*Math.cos(ry)+z*Math.sin(ry),-x*Math.sin(ry)+z*Math.cos(ry)];return{x:(x*Math.cos(rz)-y*Math.sin(rz))*size+l.x*1.55,y:(x*Math.sin(rz)+y*Math.cos(rz))*size-l.y*1.55,z:z*size+(l.z||0)*1.55};}
  function line(a,b,width=.012,alpha=1,color=l.color){segments.push({a:transform(a),b:transform(b),width:width*size,alpha:alpha*l.opacity,color,blend:l.blend});}
  function ring(radius,y=0,angle=0,axis='y',alpha=1,start=0,end=TAU){const n=48;let prev;for(let i=0;i<=n;i++){const a=start+(end-start)*i/n+angle,p=axis==='y'?[Math.cos(a)*radius,y,Math.sin(a)*radius]:axis==='x'?[y,Math.cos(a)*radius,Math.sin(a)*radius]:[Math.cos(a)*radius,Math.sin(a)*radius,y];if(prev)line(prev,p,.01,alpha);prev=p;}}
  function star(x,y,z,r,alpha=1){line([x-r,y,z],[x+r,y,z],r*.3,alpha);line([x,y-r,z],[x,y+r,z],r*.3,alpha,l.accent);line([x,y,z-r],[x,y,z+r],r*.25,alpha);}
  switch(l.type){
   case'rune':{
    for(const r of[1,.93,.72,.66])ring(r,-.65,t*.1);
    for(let i=0;i<28;i++){const a=i*TAU/28+t*.1,p=[Math.cos(a)*.82,-.65,Math.sin(a)*.82],q=[Math.cos(a+.04)*.87,-.65,Math.sin(a+.04)*.87];line(p,q,.016,.8);line([p[0],-.65,p[2]],[p[0]*1.06,-.65,p[2]*1.06],.01);}
    for(let i=0;i<6;i++){const a=i*TAU/6+t*.1,b=a+TAU/3;line([Math.cos(a)*.6,-.65,Math.sin(a)*.6],[Math.cos(b)*.6,-.65,Math.sin(b)*.6],.012,.8,l.accent);}break;
   }
   case'ring':for(let i=0;i<3;i++){const p=(phase*l.speed+i/3)%1;ring(.3+p,-.65,0,'y',1-p);}break;
   case'beam':for(let k=0;k<12;k++){const a=k*TAU/12+t*.13,r=.25+(k%3)*.07;line([Math.cos(a)*r,-.7,Math.sin(a)*r],[Math.cos(a)*r*.65,1.6,Math.sin(a)*r*.65],.018,.4);if(k%3===0)ring(r,-.7);}break;
   case'sparks':case'flame':case'smoke':{
    for(let i=0;i<l.density;i++){const a=rng()*TAU,r=Math.sqrt(rng())*(l.type==='flame'?.45:1),p=(rng()+t*(.15+rng()*.13))%1,fade=Math.sin(p*Math.PI),y=-.7+p*2;
     const x=Math.cos(a+t*.4)*r*(l.type==='flame'?1-p:1),z=Math.sin(a+t*.4)*r*(l.depth??1)*(l.type==='flame'?1-p:1);
     if(l.type==='smoke'){ring(.1+p*.15,y,a,'y',fade*.2);}
     else if(l.type==='flame')line([x,y,z],[x*.75,y+.18*(1-p),z*.75],.035*(1-p)+.005,fade);
     else{line([x,y,z],[x,y+.03+rng()*.08,z],.009,fade);if(i%7===0)star(x,y,z,.02,fade);}
    }break;
   }
   case'orb':case'shield':{
    const r=l.type==='orb'?.55:1;for(const axis of['x','y','z'])ring(r,0,t*.3,axis,.85);
    if(l.type==='shield'){for(let i=-2;i<=2;i++){const y=i*.27;ring(Math.sqrt(1-y*y),y,t*.1,'y',.35);}for(let i=0;i<6;i++){const a=i*TAU/6;let prev;for(let j=0;j<=32;j++){let p=j*TAU/32,v=[Math.cos(p)*Math.cos(a),Math.sin(p),Math.cos(p)*Math.sin(a)];if(prev)line(prev,v,.006,.3);prev=v;}}}
    else{star(0,0,0,.1,.9);ring(.28,0,-t*.8,'z',.6);}break;
   }
   case'slash':for(let i=0;i<6;i++)ring(.8+i*.035,(i-3)*.015,t*.2,'z',1-i/7,2.5,6.1);break;
   case'burst':for(let i=0;i<l.density;i++){const a=rng()*TAU,y=rng()*2-1,r=Math.sqrt(1-y*y),len=.45+rng()*.7,p=[Math.cos(a)*r,y,Math.sin(a)*r];line(p.map(v=>v*.12),p.map(v=>v*len),.012,.5+.4*Math.sin(t*TAU),i%4?l.color:l.accent);}break;
   case'lightning':{const random=rand(l.seed+Math.floor(t*10));for(let i=0;i<Math.min(l.density,12);i++){const a=random()*TAU;let p=[Math.cos(a)*.4,1.4,Math.sin(a)*.4];for(let j=0;j<12;j++){const q=[p[0]+(random()-.5)*.3,p[1]-.17,p[2]+(random()-.5)*.3];line(p,q,.013,.85,j%3?l.color:l.accent);p=q;}}break;}
   case'vortex':for(let i=0;i<Math.min(l.density,12);i++){let prev;for(let j=0;j<42;j++){const p=j/41,a=p*TAU*1.4+i*TAU/12-t*.8,r=.25+p*.8,v=[Math.cos(a)*r,-.65+p*1.7,Math.sin(a)*r];if(prev)line(prev,v,.01,.45);prev=v;}}break;
  }
 }
 return segments;
}

export function projectPoint(p,camera=DEFAULT_CAMERA){
 const cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
 const x=p.x*cy-p.z*sy,z=p.x*sy+p.z*cy,y=p.y*cp-z*sp,depth=camera.distance-(p.y*sp+z*cp);
 if(depth<.15)return null;const scale=3.4/depth;
 return{x:x*scale,y:-y*scale,depth,scale};
}
export function renderScene3D(ctx,layers,time,{camera=DEFAULT_CAMERA,width=512,height=512,zoom=1,grid=false,clear=false}={}){
 if(clear)ctx.clearRect(0,0,width,height);
 const unit=Math.min(width,height)*.3*zoom,segments=buildScene(layers,time),project=p=>projectPoint(p,camera);
 ctx.save();ctx.translate(width/2,height/2);ctx.lineCap='round';ctx.lineJoin='round';
 if(grid){ctx.strokeStyle='#33333f';ctx.lineWidth=1;ctx.globalAlpha=.7;ctx.beginPath();for(let i=-6;i<=6;i++){for(const[a,b]of[[{x:i*.5,y:-.7,z:-3},{x:i*.5,y:-.7,z:3}],[{x:-3,y:-.7,z:i*.5},{x:3,y:-.7,z:i*.5}]]){const p=project(a),q=project(b);if(p&&q){ctx.moveTo(p.x*unit,p.y*unit);ctx.lineTo(q.x*unit,q.y*unit);}}}ctx.stroke();}
 const visible=[];for(const s of segments){const a=project(s.a),b=project(s.b);if(a&&b)visible.push({s,a,b});}visible.sort((a,b)=>b.a.depth+b.b.depth-a.a.depth-a.b.depth);
 for(const{s,a,b}of visible){ctx.globalCompositeOperation=s.blend;ctx.strokeStyle=s.color;const lineWidth=Math.max(.6,s.width*unit*(a.scale+b.scale)*.5);ctx.beginPath();ctx.moveTo(a.x*unit,a.y*unit);ctx.lineTo(b.x*unit,b.y*unit);ctx.globalAlpha=s.alpha*.12;ctx.lineWidth=lineWidth*5;ctx.stroke();ctx.globalAlpha=s.alpha;ctx.lineWidth=lineWidth;ctx.stroke();}
 ctx.restore();return segments.length;
}
