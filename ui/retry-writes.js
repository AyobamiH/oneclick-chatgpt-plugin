// Retain a request identifier across an uncertain host response.
// Only an input fingerprint and random identifier are kept in session storage.
export function retrySafeWriter(call,{storage,randomUUID=()=>crypto.randomUUID(),hash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))).map(v=>v.toString(16).padStart(2,"0")).join("")}={}){
 if(storage===undefined)try{storage=globalThis.sessionStorage;}catch{}
 const memory=new Map();
 return async(name,args={},field="request_key")=>{
  const signature=await hash(JSON.stringify(args)),slot="oneclick-write:"+name;
  let previous=memory.get(slot);if(!previous)try{previous=JSON.parse(storage?.getItem(slot)??"null");}catch{}
  const record=previous?.signature===signature?previous:{signature,key:randomUUID()};
  memory.set(slot,record);try{storage?.setItem(slot,JSON.stringify(record));}catch{}
  return call(name,{...args,[field]:record.key});
 };
}
