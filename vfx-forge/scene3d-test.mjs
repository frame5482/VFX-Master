import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';
import{PARTS,layer}from'./dist/engine.js';
import{buildScene,projectPoint,DEFAULT_CAMERA}from'./dist/scene3d.js';
import{native3DFiles}from'./dist/export3d.js';
import{exportEffect}from'./dist/export.js';

for(const part of PARTS){const layers=[layer(part.type)],geometry=buildScene(layers,.6);assert(geometry.length>0,part.type+' has geometry');for(const s of geometry)for(const p of[s.a,s.b])for(const value of Object.values(p))assert(Number.isFinite(value));assert(new Set(geometry.flatMap(s=>[s.a.z,s.b.z])).size>1,part.type+' must occupy world depth');assert.deepEqual(buildScene(layers,.6),geometry,'geometry must be deterministic');assert.equal(buildScene([{...layers[0],visible:false}],.6).length,0);assert.equal(buildScene([{...layers[0],start:1}],.6).length,0);}
const original=layer('shield'),base=buildScene([original],.5),offset=buildScene([{...original,z:.5}],.5);assert(Math.abs(offset[0].a.z-base[0].a.z-.775)<1e-8);
const p={x:.5,y:.2,z:.7};assert.notDeepEqual(projectPoint(p),projectPoint(p,{...DEFAULT_CAMERA,yaw:1.5}));assert.equal(projectPoint({x:0,y:0,z:100},{yaw:0,pitch:0,distance:6}),null);
globalThis.fetch=async path=>({ok:true,text:()=>readFile(new URL('./dist/'+path,import.meta.url),'utf8')});
const project={version:1,name:'3D test',duration:2,mode:'3d',camera:{...DEFAULT_CAMERA},layers:[original]};
const files=await native3DFiles(project,16,'test'),data=JSON.parse(files.find(([name])=>name.endsWith('.world3d.json'))[1]);assert.equal(data.frames.length,16);assert.equal(data.duration,2);assert(data.frames[0].segments.length>0);
const[classFile,cs]=files.find(([name])=>name.endsWith('.cs'));assert(cs.includes('public class '+classFile.slice(0,-3)));assert(cs.includes('MeshFilter')&&cs.includes('SetTriangles'));const shader=files.find(([name])=>name.endsWith('.shader'))[1],shaderName=shader.match(/Shader "([^"]+)"/)[1];assert(cs.includes('Shader.Find("'+shaderName+'")'));
const out=await exportEffect(project,{format:'3d',resolution:256,frames:16,time:.5,name:'test'});assert.equal(out.name,'test_world3d.zip');assert(out.blob.size>10000);
await assert.rejects(()=>exportEffect({...project,mode:'2d'},{format:'3d'}));
console.log('PASS: all 12 parts have deterministic XYZ geometry; Z transforms, camera projection, visibility/timing, Unity 3D JSON, matching C# class/shader, and 3D ZIP export.');
