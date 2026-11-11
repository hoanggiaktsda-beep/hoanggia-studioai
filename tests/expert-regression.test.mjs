import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPERTS, expertFor, expertDecision } from '../core/expert-decision-layer.js';
import { buildDirection } from '../core/prompt-engine.js';

const modes = ['Furniture','Material','Lighting','Camera','Removal','AspectRatio','ReferenceReplica','SpaceSync'];
for (const mode of modes) {
  test('expert registry: '+mode, () => {
    const expert = expertFor(mode);
    assert.ok(expert.name);
    assert.ok(Array.isArray(expert.qualityGates) && expert.qualityGates.length);
    assert.ok(Array.isArray(expert.protocol) && expert.protocol.length);
    assert.equal(expert, EXPERTS[mode]);
    assert.ok(expertDecision(mode).instruction);
  });
  test('prompt five-part structure: '+mode, () => {
    const result = buildDirection({mode,brief:'Chỉ sửa đúng vùng đã chọn',target:'sofa',output:'image',camera:'original'});
    assert.equal(typeof result.prompt,'string');
    for (const section of ['BỐI CẢNH:','VAI TRÒ:','NHIỆM VỤ:','RÀNG BUỘC:','KẾT QUẢ:']) {
      assert.ok(result.prompt.includes(section), mode+' missing '+section);
    }
    assert.ok(result.prompt.includes('Chỉ sửa đúng vùng đã chọn'), 'user brief must survive');
  });
}
test('independent expert decision stays in its domain',()=>{
  for (const mode of ['Furniture','Material','Lighting','Camera']) {
    const expert = expertFor(mode);
    assert.ok(expert.lockedDomains.length >= 1,mode);
  }
});
test('SpaceSync explicitly composes four experts',()=>{
  assert.equal(expertFor('SpaceSync').composedOf.length,4);
});
