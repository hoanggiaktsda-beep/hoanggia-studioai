import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDirection } from '../core/prompt-engine.js';
import { compilePrompt } from '../core/cognitive-core.js';

test('user-specific dimensions survive prompt generation',()=>{
 const brief='Thay sofa dài 2400 mm, giữ cao độ sàn +0.000 và camera gốc.';
 const out=buildDirection({mode:'Furniture',brief,target:'sofa',output:'image',camera:'original'});
 assert.ok(out.prompt.includes('2400 mm'));
 assert.ok(out.prompt.includes('+0.000'));
 assert.ok(out.prompt.includes('camera gốc'));
});
test('reference replica keeps authorized delta and reference authority',()=>{
 const out=buildDirection({mode:'ReferenceReplica',brief:'Chỉ thay sofa mẫu B',target:'sofa',referenceRoles:'Scene A, Product B'});
 assert.match(out.prompt,/Chỉ thay sofa mẫu B/);
 assert.match(out.prompt,/AUTHORIZED DELTA|authorized|chỉ/i);
});
test('compilePrompt preserves exact user task and reference role',()=>{
 const task='Giữ vân gỗ walnut và kích thước 1800 x 900 mm';
 const out=compilePrompt({task,mode:'edit',changes:['material'],evidence:[{role:'target',description:'scene A',observed:true}]});
 assert.ok(out.prompt.includes(task));
 assert.match(out.prompt,/Image 1: target/);
});
