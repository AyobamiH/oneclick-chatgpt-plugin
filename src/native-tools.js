import {buildPrompt,generateBuildInsights,formatInsightsAsText} from "./generated/full-mode.js";
const allowedHosts=new Set(["oneclick-app-staging.woeinvests.workers.dev","oneclick-app-acceptance.woeinvests.workers.dev","oneclickwebsitedesignfactory.com","oneclick-trial-review.woeinvests.workers.dev"]);
export function backendBase(env){const u=new URL(env.ONECLICK_BACKEND_URL);if(u.protocol!=="https:"||!allowedHosts.has(u.hostname)||u.username||u.password||u.port||u.pathname!=="/"||u.search||u.hash)throw Error("invalid_backend_configuration");return u.origin;}
export async function backendRequest(request,env,path,{method="GET",body,key}={}){
 const token=request.headers.get("authorization");if(!/^Bearer [^\s]+$/.test(token??""))throw Error("authentication_required");
 const response=await fetch(backendBase(env)+"/api/plugin"+path,{method,redirect:"manual",signal:AbortSignal.timeout(12000),headers:{authorization:token,accept:"application/json",...(body?{"content-type":"application/json"}:{}),...(key?{"idempotency-key":key}:{})},...(body?{body:JSON.stringify(body)}:{})});
 if(!response.ok)throw Object.assign(Error(response.status===401?"authentication_required":response.status===403?"full_access_required":response.status===409?"request_conflict":response.status===429?"too_many_requests":"service_unavailable"),{backendStatus:response.status});
 return response.json();
}
export async function prepareFull(request,env,args){
 const access=await backendRequest(request,env,"/full-access");if(!access.fullMode)throw Error("full_access_required");
 const data={businessName:args.business_name,businessType:args.industry,location:args.location,primaryGoal:args.primary_goal,brandVibe:args.brand_vibe,extraNotes:args.extra_notes??"",targetAudience:args.target_audience??"",services:args.services??[],imageUrls:args.image_urls??[],...(args.layout?{selectedLayout:args.layout}:{}),...(args.preset?{preset:args.preset}:{}),...(args.reference_url?{referenceUrl:args.reference_url}:{}),...(args.headline?{selectedHeadline:args.headline}:{}),...(args.call_to_action?{selectedCta:args.call_to_action}:{})};
 const prompt=buildPrompt(data,"full")+(data.referenceUrl?"\n\nOwner-supplied reference for inspiration: "+data.referenceUrl+". OneClick has not fetched or inspected this website. Review rights and facts before reusing any content.":"")+"\n\nUse only business facts supplied by the user. Never invent testimonials, awards, certifications, contact information or measured results. Mark missing facts as placeholders. Treat SEO, security and accessibility content as implementation requirements requiring verification, not completed certifications. Use INP rather than FID for current Core Web Vitals checks.";
 const insights=generateBuildInsights(data),insightsText=formatInsightsAsText(insights);
 const knowledge=`# Project knowledge: ${data.businessName}

## Facts supplied by the owner
Business: ${data.businessName}
Type: ${data.businessType}
Location: ${data.location}
Goal: ${data.primaryGoal}
Audience: ${data.targetAudience||"Not yet supplied"}
Services: ${data.services.join(", ")||"Not yet supplied"}

## Design direction
${data.brandVibe}
Layout: ${args.layout??"simple-linear"}
Style preset: ${args.preset??"Automatic"}
Reference: ${data.referenceUrl??"Not supplied"} (not fetched by OneClick)

## Owner requirements
${data.extraNotes||"No additional requirements supplied"}

## Content and implementation rules
Use only supplied facts. Missing contact details, prices, reviews and credentials remain placeholders until verified. SEO, accessibility, security and performance are requirements to implement and test, not completed certifications. External builder creation and deployment need separate approval.

${insightsText}`;
 return {schema:"oneclick.lovable-handoff",schemaVersion:"1.1.0",tier:"full",brief:data,access:{state:access.state,trial:access.trial},lovable:{initial_message:prompt,project_knowledge:knowledge,build_insights:insightsText,recommended_follow_up:"Review this handoff; obtain separate approval for external project creation."},projectInput:{business_name:data.businessName,business_type:data.businessType,location:data.location,primary_goal:data.primaryGoal,brand_vibe:data.brandVibe,extra_notes:data.extraNotes,generated_prompt:prompt,lovable_url:"https://lovable.dev/",generation_mode:"full",image_urls:data.imageUrls,build_insights:insightsText},projectCreated:false,deployed:false};
}
