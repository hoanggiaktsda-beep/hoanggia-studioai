import {reason,compilePrompt} from "../core/cognitive-core.js";
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const r=reason({task:"Thay sofa",mode:"edit",evidence:[{role:"target"}],changes:["sofa"]});
assert(r.ready,"valid edit should be ready");
assert(r.locks.includes("camera"),"camera lock");
const c=reason({task:"Change camera",mode:"edit",evidence:[{role:"target"}],changes:["camera"]});
assert(!c.ready&&c.conflicts.length===1,"detect lock conflict");
assert(!reason({task:"Edit",mode:"edit"}).ready,"missing target");
const p=compilePrompt({task:"Thay sofa",evidence:[{role:"target"}],changes:["sofa"]},"gemini");
assert(p.platform==="Gemini"&&p.prompt.includes("PRESERVE:"),"platform compilation");
const aliases=reason({task:"Đổi góc máy",mode:"edit",evidence:[{role:"target"}],changes:["đổi góc máy"]});
assert(!aliases.ready&&aliases.conflicts.length===1,"Vietnamese camera alias conflict");
const independent=reason({task:"Thay sofa",mode:"edit",evidence:[{role:"target"}],changes:["sofa"],locks:["camera"]});
assert(independent.domains.includes("furniture")&&!independent.domains.includes("lighting"),"independent domain decisions");
assert(!reason({task:" ",mode:"create"}).ready,"missing task");
assert(reason({task:"Thiết kế mới",mode:"create"}).ready,"create without target");
assert(compilePrompt({task:"Thay sofa",mode:"edit",evidence:[{role:"target"}],changes:["sofa"]},"grok").platform==="Grok","grok");
for (const [name,changes,locks,expected] of [
  ["camera change blocked",["đổi góc máy"],["camera"],false],
  ["camera expert permitted",["camera"],["architecture","geometry"],true],
  ["furniture only",["sofa"],["camera","architecture"],true],
  ["material only",["vật liệu"],["camera","architecture"],true],
  ["lighting only",["ánh sáng"],["camera","architecture"],true],
  ["aspect ratio only",["frame"],["camera","architecture"],true]
]) {
  const result=reason({task:name,mode:"edit",evidence:[{role:"target"}],changes,locks});
  assert(result.ready===expected,name);
}
console.log("HG Cognitive Core: regression assertions passed");
