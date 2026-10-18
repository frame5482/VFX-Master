import assert from 'node:assert/strict';
import{readFile}from'node:fs/promises';
import vm from'node:vm';
import{layer,PARTS,renderLayer}from'./dist/engine.js';

let gradients=0,images=0,blurred=0;
function context(){return new Proxy({globalAlpha:1,createRadialGradient(){gradients++;return{addColorStop(){}};},createLinearGradient(){return{addColorStop(){}};},drawImage(){images++;}},{get(o,k){return k in o?o[k]:(()=>{});},set(o,k,v){if(k==='shadowBlur'&&v>0)blurred++;o[k]=v;return true;}});}
globalThis.document={createElement(){return{getContext:context};}};
const c=context(),sparks=layer('sparks',{density:80});
for(let i=0;i<60;i++)renderLayer(c,sparks,i/60,2,{preview:true});
assert.equal(gradients,1,'all preview particles should share a cached glow');assert.equal(images,4800);assert.equal(blurred,0,'preview must avoid per-path blur');
for(const p of PARTS)renderLayer(c,layer(p.type),.5,2,{preview:true});
const before=gradients;renderLayer(c,sparks,.5,2);assert.equal(gradients-before,80,'exports keep full-resolution analytic gradients');assert(blurred>0,'exports keep original path shadows');

// Exercise the actual animation loop with a controlled clock and no browser dependency.
const source=await readFile(new URL('./dist/app.js',import.meta.url),'utf8');
const loop=source.slice(source.indexOf('function draw(stamp){'),source.indexOf("import{renderLayer}from"));
let queued=0,renders=0;const sandbox={document:{hidden:false},$:()=>({open:false}),requestAnimationFrame(){queued++;},playing:true,dirty:true,renderPending:true,lastFrame:0,lastStamp:0,lastUI:0,time:0,state:{duration:2,layers:[]},canvas:{width:512,height:512},ctx:context(),zoom:1,previewOptions:{preview:true},drawBackground(){renders++;},renderLayer(){},timeText:{nodeValue:''},durationText:{textContent:''},scrub:{value:0},fpsLabel:{textContent:''},fpsFrames:0,fpsStart:0};vm.createContext(sandbox);vm.runInContext(loop,sandbox);
for(let i=0;i<60;i++)sandbox.draw(100+i*1000/60);
assert(renders>=29&&renders<=31,'preview is capped at 30 FPS');assert(sandbox.time>.9&&sandbox.time<1.05,'FPS cap must preserve elapsed animation time');
sandbox.playing=false;sandbox.dirty=true;sandbox.draw(1200);const stopped=renders,queuedBefore=queued;sandbox.draw(1300);assert.equal(renders,stopped,'paused canvas must not redraw');assert.equal(queued,queuedBefore,'paused canvas must not schedule a frame');
sandbox.document.hidden=true;sandbox.playing=true;sandbox.draw(1400);assert.equal(renders,stopped,'hidden tab must not render');assert.equal(queued,queuedBefore,'hidden tab must stop the frame loop');
console.log('PASS: 4,800 particle glow draws reuse 1 gradient; preview uses no path blur; all 12 parts render; export quality preserved; 30 FPS clock, idle and background scheduling checks passed.');
