import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {retrySafeWriter} from "../ui/retry-writes.js";
const hash=async value=>createHash("sha256").update(value).digest("hex");
test("uncertain support responses and iframe reloads reuse one debit identifier",async()=>{
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 const requests=[],spent=new Set();let loseResponse=true;
 const call=async(name,args)=>{requests.push(args.request_key);spent.add(args.request_key);if(loseResponse){loseResponse=false;throw Error("The host lost the committed response");}return {id:"ticket",balance:25-spent.size};};
 let write=retrySafeWriter(call,{storage,hash,randomUUID:()=>String(requests.length+1)});
 await assert.rejects(write("oneclick_create_support_ticket",{subject:"Fixture",description:"One request"}));
 write=retrySafeWriter(call,{storage,hash,randomUUID:()=>String(requests.length+1)});
 const result=await write("oneclick_create_support_ticket",{subject:"Fixture",description:"One request"});
 assert.equal(result.balance,24);assert.equal(requests[0],requests[1]);assert.equal(spent.size,1);
 await write("oneclick_create_support_ticket",{subject:"Fixture",description:"A different request"});assert.equal(spent.size,2);
});
test("knowledge and branding retries preserve their original asset identifier",async()=>{
 const calls=[];let uncertain=true;
 const write=retrySafeWriter(async(name,args)=>{calls.push(args.id);if(uncertain){uncertain=false;throw Error("Unknown response");}return {version:1};},{storage:null,hash,randomUUID:()=>String(calls.length+1)});
 const args={project_id:"owned-project",content:"Reviewed knowledge",expected_version:0};
 await assert.rejects(write("oneclick_save_knowledge_base",args,"id"));await write("oneclick_save_knowledge_base",args,"id");assert.equal(calls[0],calls[1]);
});
