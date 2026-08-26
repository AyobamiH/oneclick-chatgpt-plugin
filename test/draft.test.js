import test from "node:test";
import assert from "node:assert/strict";
import { prepareBasic, prepareFull } from "../src/draft.js";

const brief = { business_name: "Northampton Paws", industry: "Pet grooming", location: "Northampton", primary_goal: "Book appointments", brand_vibe: "Friendly and trustworthy", services: ["Dog grooming"], layout: "local-service" };
test("Basic Mode is lightweight and ephemeral", () => { const result = prepareBasic(brief); assert.equal(result.tier, "basic"); assert.equal(result.lovable.project_knowledge, null); assert.equal(result.stateChanged, false); assert.match(result.lovable.initial_message, /lightweight/i); });
test("Full Mode contains production knowledge", () => { const result = prepareFull(brief); assert.equal(result.tier, "full"); assert.match(result.lovable.project_knowledge, /WCAG 2\.1 AA/); assert.match(result.lovable.project_knowledge, /Five-sprint roadmap/); assert.ok(result.lovable.project_knowledge.length <= 10000); });
test("Required fields are enforced", () => assert.throws(() => prepareBasic({}), /missing_required_fields/));

