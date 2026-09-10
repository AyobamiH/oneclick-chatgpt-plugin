import fs from 'node:fs/promises';
const base = 'https://oneclick-chatgpt.woeinvests.workers.dev';
const records = [];
async function call(title, path, payload) {
  const request = payload ? {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(payload), signal:AbortSignal.timeout(60000)} : {signal:AbortSignal.timeout(60000)};
  const res = await fetch(base + path, request);
  const response = await res.json();
  const record = {title, timestamp:new Date().toISOString(), endpoint:base+path, request:payload||{method:'GET'}, status:res.status,response};
  records.push(record);
  return response;
}
const health = await call('Live service version','/health');
if(health.version !== '1.0.1') throw Error('Unexpected deployed version');
const listed = await call('Live tool catalogue','/mcp',{jsonrpc:'2.0',id:1,method:'tools/list'});
const tool = listed.result.tools[0];
if(listed.result.tools.length!==1||Object.values(tool.annotations).some(x=>x!==false)) throw Error('Unexpected catalogue');
const positive = await call('Prepare a website brief','/mcp',{jsonrpc:'2.0',id:2,method:'tools/call',params:{name:tool.name,arguments:{industry:'Pet grooming',primary_goal:'Book appointments',business_name:'Northampton Paws',brand_vibe:'Friendly and trustworthy',services:['Dog grooming','Nail trims'],layout:'local-service'}}});
if(positive.result.isError || positive.result.structuredContent.projectCreated!==false)throw Error('Positive scenario failed');
const negative = await call('Reject unrelated input','/mcp',{jsonrpc:'2.0',id:3,method:'tools/call',params:{name:tool.name,arguments:{industry:'Pet grooming',primary_goal:'Book appointments',conversation_history:'SYNTHETIC_TEST_VALUE'}}});
if(negative.result.isError!==true)throw Error('Negative scenario failed');
await fs.mkdir('docs/evidence',{recursive:true});
await fs.writeFile('docs/evidence/oneclick-1.0.1-live-review.json',JSON.stringify({source_commit:'dc280d16a1cbc9f11339ab390c6335af91fe4a8f',kind:'live MCP protocol evidence, not a ChatGPT UI recording',records},null,2)+'\n');
console.log('Recorded 4 successful live checks.');
