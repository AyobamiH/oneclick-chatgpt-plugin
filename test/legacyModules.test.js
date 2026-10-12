import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
test("unused Supabase-era auth and data adapters cannot shadow canonical Full Mode", () => {
  for (const removed of ["src/auth.js","src/supabase.js"]) {
    assert.equal(existsSync(resolve(root,removed)),false,removed+" should stay retired");
  }
  for (const name of readdirSync(resolve(root,"src")).filter(f=>/\.js$/.test(f))) {
    const source=readFileSync(resolve(root,"src",name),"utf8");
    assert.doesNotMatch(source,/ONECLICK_SUPABASE_URL|ONECLICK_SUPABASE_PUBLISHABLE_KEY/,name);
    assert.doesNotMatch(source,/from\s*["']\.\/(?:auth|supabase)\.js["']/,name);
  }
});
