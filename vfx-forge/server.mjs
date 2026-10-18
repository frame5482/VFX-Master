import http from 'node:http';
import{readFile,stat}from 'node:fs/promises';
import path from 'node:path';
import{fileURLToPath}from 'node:url';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.txt':'text/plain; charset=utf-8','.vfx':'text/plain','.shadergraph':'text/plain'};
const server=http.createServer(async(req,res)=>{try{const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let target=path.resolve(root,'.'+p);if(!target.startsWith(root)){res.writeHead(403);return res.end('Forbidden');}if((await stat(target)).isDirectory())target=path.join(target,'index.html');const body=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}});
server.on('error',e=>{console.error('Cannot start localhost:',e.message);process.exitCode=1;});server.listen(Number(process.env.PORT||80),'127.0.0.1',()=>console.log('VFX Forge ready at http://localhost/'));
