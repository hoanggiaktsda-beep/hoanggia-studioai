import test from 'node:test';
import assert from 'node:assert/strict';
import { reason, compilePrompt } from '../core/cognitive-core.js';

const target=[{role:'target',description:'living room',observed:true}];
test('default edit locks include architecture, geometry, camera',()=>{
 const r=reason({mode:'edit',task:'replace sofa',evidence:target,changes:['furniture']});
 for(const key of ['architecture','geometry','camera','perspective','composition']) assert.ok(r.locks.includes(key));
 assert.equal(r.ready,true);
});
test('reject explicit change of a locked domain',()=>{
 const r=reason({mode:'edit',task:'replace sofa',evidence:target,changes:['đổi góc máy']});
 assert.equal(r.ready,false);
 assert.ok(r.conflicts.length>0);
});
test('require target evidence for edit readiness',()=>{
 const r=reason({mode:'edit',task:'replace sofa',changes:['furniture']});
 assert.equal(r.ready,false);
 assert.ok(r.warnings.some(w=>w.includes('Target image')));
});
test('never claim inferred evidence is visually observed',()=>{
 const r=reason({mode:'edit',task:'replace sofa',changes:['furniture'],evidence:[{role:'target',description:'user supplied',observed:false}]});
 assert.ok(r.warnings.some(w=>w.includes('not verified')));
});
test('compiled prompt carries locks and conflict policy',()=>{
 const out=compilePrompt({mode:'edit',task:'replace sofa',changes:['furniture'],evidence:target});
 assert.match(out.prompt,/PRESERVE:/);
 assert.match(out.prompt,/CONFLICT RULE:/);
 assert.match(out.prompt,/EVIDENCE RULE:/);
});
