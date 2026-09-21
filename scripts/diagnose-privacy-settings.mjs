const account = process.env.CF_ACCOUNT_ID;
const token = process.env.CF_API_TOKEN;
if (!/^[a-f0-9]{32}$/i.test(account || "") || !token) throw new Error("missing_credentials");
const isRecord = v => v !== null && typeof v === "object" && !Array.isArray(v);
const kind = v => v === null ? "null" : Array.isArray(v) ? "array" : typeof v;
const field = (o,k) => ({present:Object.hasOwn(o,k),kind:kind(o[k]),...typeof o[k] === "boolean" ? {value:o[k]} : {}});
const exportsState = v => ({kind:kind(v),...(Array.isArray(v) ? {count:v.length} : {})});
for (const [endpoint, route, nested] of [
 ["script-settings","scripts/oneclick-chatgpt/script-settings",false],
 ["settings","scripts/oneclick-chatgpt/settings",false],
 ["environment-metadata","services/oneclick-chatgpt/environments/production",true],
 ["worker-metadata","workers/oneclick-chatgpt",false]
]) {
 let response;
 try {
  response = await fetch("https://api.cloudflare.com/client/v4/accounts/"+account+"/workers/"+route, {method:"GET",redirect:"error",signal:AbortSignal.timeout(15000),headers:{Authorization:"Bearer "+token,Accept:"application/json"}});
  if (!response.ok) { console.log(JSON.stringify({endpoint,http_status:response.status})); continue; }
  const p = await response.json();
  if (p.success !== true || !Array.isArray(p.errors) || p.errors.length || !isRecord(p.result)) { console.log(JSON.stringify({endpoint,result:"invalid_envelope"})); continue; }
  const s = nested ? p.result.script : p.result;
  if (!isRecord(s)) { console.log(JSON.stringify({endpoint,result:'missing_script_metadata'})); continue; }
  const report = {endpoint,logpush:field(s,"logpush"),tail_consumers:exportsState(s.tail_consumers),observability:field(s,"observability")};
  if (isRecord(s.observability)) {
   const o = s.observability;
   report.observability.details = {enabled:field(o,"enabled"),keys_count:Object.keys(o).length};
   for(const k of ["logs","traces","issues"]) {
    report.observability.details[k] = field(o,k);
    if(isRecord(o[k])) report.observability.details[k].details = {enabled:field(o[k],"enabled"),invocation_logs:field(o[k],"invocation_logs"),persist:field(o[k],"persist"),destinations:exportsState(o[k].destinations),keys_count:Object.keys(o[k]).length};
   }
  }
  console.log(JSON.stringify(report));
 } catch { console.log(JSON.stringify({endpoint,result:"read_failed"})); process.exitCode=1; }
}
