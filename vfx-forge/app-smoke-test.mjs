import assert from'node:assert/strict';
import vm from'node:vm';
import{readFile}from'node:fs/promises';
import{PARTS,THEMES,layer,presets}from'./dist/engine.js';
import{DEFAULT_CAMERA}from'./dist/scene3d.js';
const nodes=new Map(),groups=new Map();let threeDraws=0,twoDraws=0;
const context=new Proxy({},{get:()=>()=>{}});
function node(tag='div'){return{tagName:tag.toUpperCase(),dataset:{},style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}},children:[],value:'16',open:false,append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},addEventListener(){},setAttribute(){},getContext(){return context;},getBoundingClientRect(){return{width:640,height:480};},setPointerCapture(){},showModal(){this.open=true;},close(){this.open=false;},click(){this.onclick?.();},remove(){}};}
function group(selector,key,values){const items=values.map(value=>{const n=node('button');n.dataset[key]=value;return n;});groups.set(selector,items);for(const n of items)nodes.set(`[data-${key}="${n.dataset[key]}"]`,n);return items;}
const modes=group('[data-dimension]','dimension',['2d','3d']);group('[data-library]','library',['presets','parts']);const formats=group('[data-format]','format',['png','sheet','shader','vfx','3d']);
const document={hidden:false,querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s);},querySelectorAll:s=>groups.get(s)||[],createElement:node,createTextNode:value=>({nodeValue:value}),addEventListener(){},body:node()};
const sandbox={document,PARTS,THEMES,layer,presets,DEFAULT_CAMERA,renderEffect(){},renderLayer(){twoDraws++;},renderScene3D(){threeDraws++;},exportEffect(){},structuredClone,crypto,console,URL,Blob,requestAnimationFrame(){},setTimeout(){},clearTimeout(){},ResizeObserver:class{observe(){}},localStorage:{getItem(){return null;},setItem(){}}};
let source=await readFile(new URL('./dist/app.js',import.meta.url),'utf8');source=source.replace(/^import[^\n]+\n/gm,'').replace('export function downloadBlob','function downloadBlob');vm.createContext(sandbox);vm.runInContext(source,sandbox);
assert.equal(document.querySelector('#renderMode').textContent,'3D · WORLD SPACE');sandbox.draw(100);assert.equal(threeDraws,1);
modes[0].click();assert.equal(document.querySelector('#renderMode').textContent,'2D · COMPOSITE');assert.equal(formats[4].disabled,true);sandbox.draw(200);assert(twoDraws>0);
modes[1].click();assert.equal(formats[4].disabled,false);formats[4].click();assert(document.querySelector('#exportNote').textContent.includes('geometry X/Y/Z'));
sandbox.applyPreset(1);assert.equal(document.querySelector('#renderMode').textContent,'3D · WORLD SPACE');
const legacy={version:1,name:'Legacy',duration:2,layers:[layer('sparks')]};delete legacy.layers[0].z;delete legacy.layers[0].depth;delete legacy.layers[0].tiltX;delete legacy.layers[0].tiltY;assert.equal(sandbox.validateProject(legacy).mode,'2d');assert.equal(legacy.layers[0].z,0);
console.log('PASS: app boots, 2D/3D buttons select correct renderer, native export gating, presets preserve mode, and old JSON projects migrate. DOM is simulated; no visual browser validation.');
