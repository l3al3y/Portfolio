import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeSMCMetrics} from '../lab/smc-live.js';

test('v4.0 direct and MediaFire counts are read separately', () => {
  assert.deepEqual(summarizeSMCMetrics({direct: 430, mirror: 134}), {direct: 430, mirror: 134});
  assert.deepEqual(summarizeSMCMetrics({direct: 0, mirror: 0}), {direct: 0, mirror: 0});
});

test('missing counters and the legacy v3 response are rejected', () => {
  for (const data of [{direct: -1, mirror: 134}, {direct: 430, mirror: null},
    {direct: 430, mirror: 1.5}, {starts: 11862, mirror_requests: 4734}]) {
    assert.throws(() => summarizeSMCMetrics(data));
  }
});
