import test from "node:test";
import assert from "node:assert/strict";
import {JSDOM,VirtualConsole} from "jsdom";
import {APP_HTML} from "../src/generated/native-ui.js";
import {webcrypto} from "node:crypto";
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function until(check){for(let i=0;i<200;i++){if(check())return;await delay(10);}throw Error("Native workspace did not reach the expected state");}
test("real native SDK handshake delivers entrypoint context; trial requires consent and never charges automatically",async()=>{
 const calls=[],links=[],errors=[],outgoing=[];let access={state:"trial_eligible",fullMode:false,trialAvailable:true,ticketsRemaining:0,offer:{continuation:{available:true}}};
 const virtualConsole=new VirtualConsole();virtualConsole.on("jsdomError",e=>errors.push(e.message));
 const dom=new JSDOM(APP_HTML,{url:"https://view.example.invalid/",runScripts:"dangerously",pretendToBeVisual:true,virtualConsole,beforeParse(w){
  const setTimer=w.setTimeout.bind(w);w.setTimeout=(fn,ms,...args)=>setTimer(fn,ms>86400000?150:ms,...args);
  w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.ResizeObserver=class{observe(){}disconnect(){}};Object.defineProperty(w,"crypto",{value:webcrypto});
  const emit=data=>setTimeout(()=>w.dispatchEvent(new w.MessageEvent("message",{data,source:w})),0);
  w.postMessage=data=>{outgoing.push({method:data.method,keys:Object.keys(data)});
   if(data.method==="ui/initialize")emit({jsonrpc:"2.0",id:data.id,result:{protocolVersion:data.params.protocolVersion,hostInfo:{name:"SDK integration fixture",version:"1"},hostCapabilities:{serverTools:{},openLinks:{},updateModelContext:{}},hostContext:{theme:"light",displayMode:"fullscreen",availableDisplayModes:["inline","fullscreen"]}}});
   if(data.method==="ui/notifications/initialized")emit({jsonrpc:"2.0",method:"ui/notifications/tool-result",params:{content:[],structuredContent:{workspace:true,fullModeReady:true}}});
   if(data.method==="tools/call"){
    calls.push(data.params);const name=data.params.name;
    if(name==="oneclick_get_full_access"&&access.state==="trial_active")access={...access,state:"trial_expired",fullMode:false,ticketsRemaining:0};
    if(name==="oneclick_start_full_trial")access={...access,state:"trial_active",fullMode:true,trialAvailable:false,ticketsRemaining:25,trial:{expiresAt:new Date(Date.now()+259200000).toISOString()}};
    emit({jsonrpc:"2.0",id:data.id,result:{content:[],structuredContent:access}});
   }
   if(data.method==="ui/open-link"){links.push(data.params.url);emit({jsonrpc:"2.0",id:data.id,result:{}});}
  };
 }});
 try{
  const document=dom.window.document,button=id=>document.getElementById(id);
  await until(()=>!button("connect").disabled);
  assert.ok(document.body.textContent.includes("3-day Full Mode trial at no cost"));assert.ok(document.body.textContent.includes("No automatic charge"));assert.equal(calls.length,0);
  button("connect").click();await until(()=>!button("trial-consent").hidden&&!button("start-trial").disabled);
  assert.equal(calls[0].name,"oneclick_get_full_access");assert.equal(calls.filter(c=>c.name==="oneclick_start_full_trial").length,0);
  button("start-trial").click();await until(()=>button("status").textContent.includes("confirm the trial duration"));assert.equal(calls.filter(c=>c.name==="oneclick_start_full_trial").length,0);
  button("accept-trial").checked=true;button("start-trial").click();await until(()=>!button("full-fields").hidden&&!button("prepare").disabled);
  const activation=calls.find(c=>c.name==="oneclick_start_full_trial");assert.deepEqual({...activation.arguments},{accept_trial_terms:true,policy_version:"oneclick.full-trial.v1"});assert.equal(calls.filter(c=>c.name==="oneclick_create_checkout").length,0);assert.equal(links.length,0);assert.equal(errors.length,0);assert.equal(button("checkout").hidden,true);
  await until(()=>!button("checkout").hidden);assert.equal(button("full-fields").hidden,true);assert.equal(calls.filter(c=>c.name==="oneclick_create_checkout").length,0);assert.equal(links.length,0);
 }catch(e){throw new Error(e.message+"; status="+dom.window.document.getElementById("status").textContent+"; errors="+JSON.stringify(errors)+"; messages="+JSON.stringify(outgoing));}finally{dom.window.close();}
});

test("chat-prepared Full briefs render through actual SDK notifications and Basic briefs never become savable Full projects",async()=>{
 const calls=[],errors=[];let emit;
 const draft={tier:"full",brief:{businessName:"Paws",businessType:"Grooming",location:"Bristol",primaryGoal:"Bookings",brandVibe:"Calm",preset:"minimalist",referenceUrl:"https://example.com/",services:["Grooming"]},projectInput:{business_name:"Paws"},lovable:{initial_message:"<script>window.untrusted=true</script>Full brief",project_knowledge:"Separate knowledge"}};
 const virtualConsole=new VirtualConsole();virtualConsole.on("jsdomError",e=>errors.push(e.message));
 const html=APP_HTML.replace("<!-- SERVICE_CONFIGURATION -->",'<script type="application/json" id="service-configuration">{"fullModeReady":true}</script>');
 const dom=new JSDOM(html,{url:"https://view.example.invalid/",runScripts:"dangerously",pretendToBeVisual:true,virtualConsole,beforeParse(w){
  w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.ResizeObserver=class{observe(){}disconnect(){}};
  emit=data=>setTimeout(()=>w.dispatchEvent(new w.MessageEvent("message",{data,source:w})),0);
  w.postMessage=data=>{
   if(data.method==="ui/initialize")emit({jsonrpc:"2.0",id:data.id,result:{protocolVersion:data.params.protocolVersion,hostInfo:{name:"SDK prepared-draft fixture",version:"1"},hostCapabilities:{serverTools:{},openLinks:{},updateModelContext:{}},hostContext:{theme:"light",displayMode:"fullscreen"}}});
   if(data.method==="ui/notifications/initialized")emit({jsonrpc:"2.0",method:"ui/notifications/tool-result",params:{content:[],structuredContent:draft}});
   if(data.method==="tools/call"){calls.push(data.params);emit({jsonrpc:"2.0",id:data.id,result:{content:[],structuredContent:{state:"paid",fullMode:true,trialAvailable:false,ticketsRemaining:25}}});}
  };
 }});
 try{
  const document=dom.window.document,el=id=>document.getElementById(id);
  await until(()=>!el("save-project").hidden&&!el("save-project").disabled);
  assert.match(el("result").textContent,/<script>window.untrusted=true<\/script>Full brief/);assert.match(el("result").textContent,/Separate knowledge/);assert.equal(dom.window.untrusted,undefined);assert.equal(el("business-name").value,"Paws");assert.equal(el("preset").value,"minimalist");assert.equal(el("reference").value,"https://example.com/");assert.equal(el("trial-intro").hidden,true);assert.deepEqual(calls.map(c=>c.name),["oneclick_get_full_access"]);
  emit({jsonrpc:"2.0",method:"ui/notifications/tool-result",params:{content:[],structuredContent:{tier:"basic",lovable:{initial_message:"Anonymous Basic brief"}}}});
  await until(()=>el("result").textContent==="Anonymous Basic brief");assert.equal(el("save-project").hidden,true);assert.equal(el("reference").value,"");assert.equal(el("services").value,"");assert.equal(calls.length,1);assert.equal(errors.length,0);
 }finally{dom.window.close();}
});
