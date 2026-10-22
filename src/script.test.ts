import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AetherLabs = require('../js/script.js');

const SAMPLE_PROJECTS = [
  { id: 'atlas-ai', title: 'Atlas AI', category: 'ai' },
  { id: 'pulse-commerce', title: 'Pulse Commerce', category: 'web' },
  { id: 'flowdesk', title: 'Flowdesk', category: 'automation' },
  { id: 'nova-cloud', title: 'Nova Cloud', category: 'cloud' },
];

test('normalizeCategory maps valid categories and falls back to all', () => {
  assert.equal(AetherLabs.normalizeCategory('all'), 'all');
  assert.equal(AetherLabs.normalizeCategory('AI'), 'ai');
  assert.equal(AetherLabs.normalizeCategory(' web '), 'web');
  assert.equal(AetherLabs.normalizeCategory('automation'), 'automation');
  assert.equal(AetherLabs.normalizeCategory('CLOUD'), 'cloud');
  assert.equal(AetherLabs.normalizeCategory('unknown-filter'), 'all');
  assert.equal(AetherLabs.normalizeCategory(''), 'all');
});

test('filterProjectsData filters each category accurately and restores all projects', () => {
  assert.equal(AetherLabs.filterProjectsData(SAMPLE_PROJECTS, 'all').length, 4);

  const aiOnly = AetherLabs.filterProjectsData(SAMPLE_PROJECTS, 'ai');
  assert.equal(aiOnly.length, 1);
  assert.equal(aiOnly[0].id, 'atlas-ai');

  const webOnly = AetherLabs.filterProjectsData(SAMPLE_PROJECTS, 'web');
  assert.equal(webOnly.length, 1);
  assert.equal(webOnly[0].id, 'pulse-commerce');

  const autoOnly = AetherLabs.filterProjectsData(SAMPLE_PROJECTS, 'automation');
  assert.equal(autoOnly.length, 1);
  assert.equal(autoOnly[0].id, 'flowdesk');

  const cloudOnly = AetherLabs.filterProjectsData(SAMPLE_PROJECTS, 'cloud');
  assert.equal(cloudOnly.length, 1);
  assert.equal(cloudOnly[0].id, 'nova-cloud');

  const restored = AetherLabs.filterProjectsData(SAMPLE_PROJECTS, 'all');
  assert.equal(restored.length, 4);
});

test('getProjectBlueprint returns structured modal specification data for all 4 projects', () => {
  const atlas = AetherLabs.getProjectBlueprint('atlas-ai');
  assert.ok(atlas);
  assert.equal(atlas.discipline, 'AI Engineering');
  assert.equal(atlas.metrics.length, 3);
  assert.equal(atlas.specs.length, 4);

  const pulse = AetherLabs.getProjectBlueprint('pulse-commerce');
  assert.ok(pulse);
  assert.equal(pulse.discipline, 'Web Development');

  const flowdesk = AetherLabs.getProjectBlueprint('flowdesk');
  assert.ok(flowdesk);
  assert.equal(flowdesk.discipline, 'Automation');

  const nova = AetherLabs.getProjectBlueprint('nova-cloud');
  assert.ok(nova);
  assert.equal(nova.discipline, 'Cloud Solutions');

  assert.equal(AetherLabs.getProjectBlueprint('nonexistent'), null);
});

test('getLifecycleStage returns engineering lifecycle deliverables for all 4 stages', () => {
  const spec = AetherLabs.getLifecycleStage('specification');
  assert.equal(spec.index, 'Phase 01 · Specification');
  assert.equal(spec.deliverables.length, 3);

  const arch = AetherLabs.getLifecycleStage('architecture');
  assert.equal(arch.index, 'Phase 02 · Architecture');

  const ver = AetherLabs.getLifecycleStage('verification');
  assert.equal(ver.index, 'Phase 03 · Verification');

  const op = AetherLabs.getLifecycleStage('operation');
  assert.equal(op.index, 'Phase 04 · Operation');
});

test('validateContactPayload rejects empty or invalid submissions with accessible errors', () => {
  const emptyCheck = AetherLabs.validateContactPayload({});
  assert.equal(emptyCheck.valid, false);
  assert.ok(emptyCheck.errors.fullName);
  assert.ok(emptyCheck.errors.email);
  assert.ok(emptyCheck.errors.service);
  assert.ok(emptyCheck.errors.description);

  const badEmailCheck = AetherLabs.validateContactPayload({
    fullName: 'Elena Vance',
    email: 'invalid-email',
    service: 'AI Engineering',
    description: 'Building a grounded enterprise RAG pipeline with citation verification.',
  });
  assert.equal(badEmailCheck.valid, false);
  assert.ok(badEmailCheck.errors.email);
  assert.equal(badEmailCheck.errors.fullName, undefined);

  const shortDescCheck = AetherLabs.validateContactPayload({
    fullName: 'Elena Vance',
    email: 'elena@aether.example',
    service: 'Cloud Solutions',
    description: 'Too short',
  });
  assert.equal(shortDescCheck.valid, false);
  assert.ok(shortDescCheck.errors.description);
});

test('validateContactPayload accepts valid submissions with optional budget', () => {
  const validWithoutBudget = AetherLabs.validateContactPayload({
    fullName: 'Elena Vance',
    email: 'elena@organization.com',
    service: 'AI Engineering',
    budget: '',
    description: 'We need a deterministic retrieval pipeline with citation verification.',
  });
  assert.equal(validWithoutBudget.valid, true);
  assert.deepEqual(validWithoutBudget.errors, {});
  assert.equal(validWithoutBudget.sanitized.budget, 'Not specified');

  const validWithBudget = AetherLabs.validateContactPayload({
    fullName: 'Marcus Sterling',
    email: 'marcus@enterprise.io',
    service: 'Intelligent Automation',
    budget: '$100,000 – $250,000',
    description: 'Automating multi-step document intake and ERP ledger synchronization.',
  });
  assert.equal(validWithBudget.valid, true);
  assert.equal(validWithBudget.sanitized.budget, '$100,000 – $250,000');
});
