import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareFull} from '../src/native-tools.js';

test('complete Full handoff does not contradict its evidence and privacy constraints',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({fullMode:true,state:'trial_active',trial:{}});
 try {
  const output=await prepareFull(new Request('https://native.example.invalid/mcp',{headers:{authorization:'Bearer fixture-token'}}),{ONECLICK_BACKEND_URL:'https://oneclick-trial-review.woeinvests.workers.dev'},{business_name:'Fixture',industry:'Website design services',location:'Northampton',primary_goal:'Enquiries',brand_vibe:'Professional',headline:'Owner headline'});
  const prompt=output.lovable.initial_message;

  assert.match(prompt, /Industry:\*\* Design/);
  assert.doesNotMatch(prompt, /Technology \/ SaaS|FID <|Placeholder testimonials|Placeholder for VAT|By submitting this form, you agree|Trust Markers to Include/);
  assert.match(prompt, /INP <= 200ms/);
  assert.match(prompt, /Never require marketing consent/);
  assert.match(prompt, /never render invented numbers or public placeholders/);
  assert.match(prompt, /owner-supplied, verified facts/);
  assert.match(prompt, /Owner headline/);

  assert.equal(output.projectInput.generated_prompt,prompt);
  assert.equal(output.projectCreated,false);
  assert.equal(output.deployed,false);
  assert.doesNotMatch(output.lovable.build_insights,/FID|3-5 customer reviews|✓/);
 } finally {globalThis.fetch=original;}
});
