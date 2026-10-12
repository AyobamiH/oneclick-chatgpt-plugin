import test from "node:test";
import assert from "node:assert/strict";
import {fetchHandler} from "../src/worker.js";
import {backendBase,backendRequest,prepareFull} from "../src/native-tools.js";
import {APP_HTML} from "../src/generated/native-ui.js";
import {createNativeHandler} from "../src/native.js";
async function call(method,params={},extra={}){
 const response=await fetchHandler(new Request("https://oneclick-chatgpt-native-review.woeinvests.workers.dev/mcp",{method:"POST",headers:{"content-type":"application/json",accept:"application/json, text/event-stream"},body:JSON.stringify({jsonrpc:"2.0",id:1,method,params})}),{ONECLICK_NATIVE_ENABLED:"true",...extra},{waitUntil(){}});
 const raw=await response.text();let body;try{body=JSON.parse(raw);}catch{const data=raw.split("\n").find(l=>l.startsWith("data: "));body=data?JSON.parse(data.slice(6)):raw;}
 return {response,body};
}
test("native global/thread entrypoints open with empty inputs and distinct titles",async()=>{
 const list=await call("tools/list");assert.equal(list.response.status,200);
 const tools=list.body.result.tools;assert.equal(tools.length,3);
 const global=tools.find(t=>t.name==="oneclick_open_workspace"),thread=tools.find(t=>t.name==="oneclick_open_brief_review");
 assert.equal(global._meta["openai/ui"].entrypoints[0].type,"global");assert.equal(thread._meta["openai/ui"].entrypoints[0].type,"thread");assert.notEqual(global.title,thread.title);
 const opened=await call("tools/call",{name:global.name,arguments:{}});assert.equal(opened.body.result.structuredContent.workspace,true);assert.equal(opened.body.result.structuredContent.fullModeReady,false);
});
test("native app resource is isolated and includes exact trial disclosure",async()=>{
 const r=await call("resources/read",{uri:"ui://oneclick/workspace-v1"});assert.equal(r.response.status,200);
 const content=r.body.result.contents[0];assert.equal(content.mimeType,"text/html;profile=mcp-app");
 assert.match(content.text,/3-day Full Mode trial at no cost/);assert.match(content.text,/No automatic charge/);assert.match(content.text,/£100 once/);assert.match(content.text,/Try at no cost/);
 assert.deepEqual(content._meta.ui.csp.connectDomains,[]);assert.deepEqual(content._meta.ui.csp.resourceDomains,[]);
 assert.doesNotMatch(APP_HTML,/localStorage\.setItem|sessionStorage\.setItem|fetch\(/);
});
test("Basic Mode still prepares an ephemeral handoff in native mode",async()=>{
 const r=await call("tools/call",{name:"oneclick_prepare_basic_draft",arguments:{industry:"Pet care",primary_goal:"Appointments"}});
 assert.equal(r.body.result.structuredContent.tier,"basic");assert.equal(r.body.result.structuredContent.projectCreated,false);
});
test("Full Mode remains gated and unauthenticated full calls receive OAuth challenge when configured",async()=>{
 const env={ONECLICK_FULL_MODE_READY:"true",ONECLICK_BACKEND_URL:"https://oneclick-app-staging.woeinvests.workers.dev"};
 const list=await call("tools/list",{},env);assert.equal(list.response.status,200);assert.ok(list.body.result.tools.some(t=>t.name==="oneclick_prepare_full_draft"));
 const r=await call("tools/call",{name:"oneclick_get_full_access",arguments:{}},env);assert.equal(r.response.status,401);assert.match(r.response.headers.get("www-authenticate"),/resource_metadata/);
});
test("backend origin validation rejects arbitrary domains, embedded credentials and URL paths",()=>{
 for(const url of ["https://evil.invalid","https://oneclickwebsitedesignfactory.com.evil.invalid","https://user:pass@oneclickwebsitedesignfactory.com","https://oneclickwebsitedesignfactory.com/api/","http://oneclickwebsitedesignfactory.com","https://oneclickwebsitedesignfactory.com/?target=evil"])assert.throws(()=>backendBase({ONECLICK_BACKEND_URL:url}));
 assert.equal(backendBase({ONECLICK_BACKEND_URL:"https://oneclickwebsitedesignfactory.com"}),"https://oneclickwebsitedesignfactory.com");
});

test("native request limits reject both declared and streamed oversize bodies before parsing",async()=>{
 for(const declared of ["600000","100"]){const response=await fetchHandler(new Request("https://review.example.invalid/mcp",{method:"POST",headers:{"content-type":"application/json","content-length":declared},body:"x".repeat(524289)}),{ONECLICK_NATIVE_ENABLED:"true"});assert.equal(response.status,413);}
});
test("account requests never follow redirects or forward tokens to a redirected destination",async()=>{
 const original=globalThis.fetch;const calls=[];globalThis.fetch=async(url,options)=>{calls.push({url,options});return new Response(null,{status:302,headers:{location:"https://untrusted.example.invalid/"}});};
 try{await assert.rejects(()=>backendRequest(new Request("https://mcp.example.invalid/mcp",{headers:{authorization:"Bearer fixture-token"}}),{ONECLICK_BACKEND_URL:"https://oneclick-trial-review.woeinvests.workers.dev"},"/full-access"));assert.equal(calls.length,1);assert.equal(calls[0].options.redirect,"manual");assert.equal(calls[0].url,"https://oneclick-trial-review.woeinvests.workers.dev/api/plugin/full-access");}finally{globalThis.fetch=original;}
});

test("Full handoff carries paid styling and reference inputs without fetching reference websites",async()=>{
 const original=globalThis.fetch;const calls=[];globalThis.fetch=async(url)=>{calls.push(String(url));return Response.json({fullMode:true,state:"trial_active",trial:{}});};
 try{const output=await prepareFull(new Request("https://mcp.example.invalid/mcp",{headers:{authorization:"Bearer fixture-token"}}),{ONECLICK_BACKEND_URL:"https://oneclick-trial-review.woeinvests.workers.dev"},{business_name:"Owner business",industry:"Pet care",location:"London",primary_goal:"Appointments",brand_vibe:"Calm",preset:"minimalist",reference_url:"https://reference.example.invalid/",headline:"Care for your pet",call_to_action:"Book now"});assert.equal(output.brief.preset,"minimalist");assert.equal(output.brief.referenceUrl,"https://reference.example.invalid/");assert.equal(output.projectInput.preset,"minimalist");assert.equal(output.projectInput.input_url,"https://reference.example.invalid/");assert.match(output.lovable.initial_message,/not fetched or inspected/);assert.match(output.lovable.project_knowledge,/Style preset: minimalist/);assert.equal(calls.length,1);assert.ok(calls[0].endsWith("/api/plugin/full-access"));}finally{globalThis.fetch=original;}
});


test("private write helpers update the existing workspace without advertising widgets",async()=>{
 const list=await call("tools/list",{},{ONECLICK_FULL_MODE_READY:"true",ONECLICK_BACKEND_URL:"https://oneclick-trial-review.woeinvests.workers.dev"});
 const helpers=list.body.result.tools.filter(t=>t.annotations?.readOnlyHint===false&&t._meta?.ui?.visibility?.length===1&&t._meta.ui.visibility[0]==="app");
 assert.equal(helpers.length,6);
 for(const tool of helpers){
  assert.deepEqual(tool._meta.ui.visibility,["app"]);
  assert.equal(tool._meta.ui.resourceUri,undefined);
  assert.deepEqual(tool._meta.securitySchemes,[{type:"oauth2",scopes:["oneclick:full"]}]);
 }
 for(const name of ["oneclick_open_workspace","oneclick_open_brief_review"]){
  const opener=list.body.result.tools.find(t=>t.name===name);
  assert.equal(opener._meta.ui.resourceUri,"ui://oneclick/workspace-v1");
  assert.equal(opener.annotations.readOnlyHint,true);
 }
});


test("registered project save forwards reviewed preset and reference and rejects unknown presets",async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async(url,options)=>{calls.push({url,body:JSON.parse(options.body),key:options.headers["Idempotency-Key"]});return Response.json({id:"saved-fixture"});};
 const project={business_name:"Fixture studio",business_type:"Design",location:"London",primary_goal:"Bookings",brand_vibe:"Calm",generated_prompt:"Reviewed fixture brief",lovable_url:"https://lovable.dev/",generation_mode:"full",image_urls:[],preset:"minimalist",input_url:"https://reference.example.invalid/"};
 const requestFor=p=>new Request("https://native.example.invalid/mcp",{method:"POST",headers:{"content-type":"application/json",accept:"application/json, text/event-stream",authorization:"Bearer fixture-token"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/call",params:{name:"oneclick_save_project",arguments:{project:p,request_key:"native_contract_review_20261011"}}})});
 try{
  const req=requestFor(project),env={ONECLICK_FULL_MODE_READY:"true",ONECLICK_BACKEND_URL:"https://oneclick-trial-review.woeinvests.workers.dev"};
  const good=await createNativeHandler(req,env,{waitUntil(){}}).fetch(req);const raw=await good.text();const body=JSON.parse(raw.startsWith("{")?raw:raw.split("\n").find(l=>l.startsWith("data: ")).slice(6));
  assert.equal(body.result.structuredContent.id,"saved-fixture");assert.equal(calls.length,1);assert.equal(calls[0].body.preset,"minimalist");assert.equal(calls[0].body.input_url,"https://reference.example.invalid/");
  const bad=requestFor({...project,preset:"unrecognised"});await createNativeHandler(bad,env,{waitUntil(){}}).fetch(bad);assert.equal(calls.length,1);
 }finally{globalThis.fetch=original;}
});
