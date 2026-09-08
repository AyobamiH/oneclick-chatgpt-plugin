import test from "node:test";
import assert from "node:assert/strict";
import { normaliseBrief, prepareBasic } from "../src/draft.js";

test("Basic Mode is lightweight and does not claim external creation", () => {
  const result = prepareBasic({ industry: "Pet grooming", primary_goal: "Book appointments" });
  assert.equal(result.tier, "basic");
  assert.equal(result.projectCreated, false);
  assert.equal(result.deployed, false);
  assert.equal(result.lovable.project_knowledge, null);
  assert.match(result.lovable.initial_message, /Pet grooming/);
  assert.match(result.lovable.initial_message, /Book appointments/);
});

test("Retained optional fields affect the generated handoff", () => {
  const result = prepareBasic({
    industry: "Pet grooming",
    primary_goal: "Book appointments",
    business_name: "Northampton Paws",
    brand_vibe: "Friendly",
    headline: "Gentle grooming",
    call_to_action: "Book now",
    layout: "local-service",
    services: ["Dog grooming", "Nail trims"]
  });
  for (const expected of ["Northampton Paws", "Friendly", "Gentle grooming", "Book now", "local-service", "Dog grooming", "Nail trims"]) {
    assert.match(result.lovable.initial_message, new RegExp(expected));
  }
});

test("No location or broad notes are introduced by normalisation", () => {
  const brief = normaliseBrief({ industry: "Pet care", primary_goal: "Get enquiries" });
  assert.equal("location" in brief, false);
  assert.equal("notes" in brief, false);
  assert.equal("referenceImages" in brief, false);
});
