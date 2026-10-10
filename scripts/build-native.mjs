import {build} from "esbuild";
import {readFile,writeFile,mkdir} from "node:fs/promises";
await mkdir(new URL("../src/generated/",import.meta.url),{recursive:true});
await build({entryPoints:["src/full-mode/engine.ts"],outfile:"src/generated/full-mode.js",bundle:true,format:"esm",platform:"neutral",target:"es2022"});
const bundle=await build({entryPoints:["ui/app.js"],bundle:true,format:"iife",platform:"browser",target:"es2022",write:false,minify:true});
const template=await readFile("ui/index.html","utf8");
const html=template.replace("<!-- APP_SCRIPT -->",()=>'<script>'+bundle.outputFiles[0].text.replace(/<\/script/gi,()=>'<'+String.fromCharCode(92)+'/script')+'</script>');
await writeFile("src/generated/native-ui.js","export const APP_HTML = "+JSON.stringify(html)+";\n");
console.log("Built native MCP app and pinned Full Mode engine.");
