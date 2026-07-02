
const express=require('express'),cors=require('cors'),path=require('path'),
fs=require('fs'),http=require('http');
let db=null;
try{const{DatabaseSync}=require('node:sqlite');
db=new DatabaseSync(path.join(__dirname,'../../data/memory.db'));
db.exec('CREATE TABLE IF NOT EXISTS memory(id INTEGER PRIMARY KEY AUTOINCREMENT,key TEXT,value TEXT,brain TEXT,ts INTEGER DEFAULT(unixepoch()))');
console.log('✅ SQLite online');}catch(e){console.warn('SQLite skipped:',e.message);}
const app=express();
app.use(cors());app.use(express.json());
app.use(express.static(path.join(__dirname,'../../public')));
app.get('/health',(req,res)=>res.json({status:'AXON LUMA ONLINE',version:'1.0.0',
  brains:{deepseek:'http://localhost:11434',gemma:'http://localhost:11435',llama:'http://localhost:11436'},ts:Date.now()}));
app.post('/chat',async(req,res)=>{
  const{messages=[],brain='gemma'}=req.body;
  const ports={deepseek:11434,gemma:11435,llama:11436};
  const port=ports[brain]||11435;
  res.setHeader('Content-Type','text/event-stream');
  res.setHeader('Cache-Control','no-cache');
  res.setHeader('Connection','keep-alive');
  const payload=JSON.stringify({model:brain,stream:true,messages:[
    {role:'system',content:'You are AXON LUMA — KNOCKSSTUDiOS AI creative director. OPUS 8DK SPECTRUM. Terse, cinematic, intelligent.'},
    ...messages]});
  const opts={hostname:'127.0.0.1',port,path:'/v1/chat/completions',method:'POST',
    headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload)}};
  const up=http.request(opts,r=>{r.on('data',c=>res.write(c));r.on('end',()=>res.end());});
  up.on('error',e=>{res.write('data: {"error":"Brain offline: '+e.message+'"}

');res.end();});
  up.write(payload);up.end();});
app.get('/memory',(req,res)=>res.json(db?db.prepare('SELECT * FROM memory ORDER BY ts DESC LIMIT 100').all():[]));
app.post('/memory',(req,res)=>{if(db){const{key,value,brain='system'}=req.body;db.prepare('INSERT INTO memory(key,value,brain)VALUES(?,?,?)').run(key,value,brain);}res.json({ok:!!db});});
app.delete('/memory/:id',(req,res)=>{if(db)db.prepare('DELETE FROM memory WHERE id=?').run(req.params.id);res.json({ok:true});});
app.get('/files',(req,res)=>{const d=path.join(__dirname,'../../outputs');fs.readdir(d,(e,f)=>res.json(e?[]:f));});
app.listen(3000,'0.0.0.0',()=>{console.log('\n⚡ AXON LUMA GATEWAY ONLINE');console.log('   http://localhost:3000\n');});
