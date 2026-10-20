import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeSMCMetrics} from '../lab/smc-live.js';
const snapshot={version:'smc-crows-v3.0-stable-20261019',starts:2790,mirror_requests:629,total_requests:3419,previous_v2:11918,previous_v2_mirror:1212,previous_setup:4248,previous_v1:1849,previous_r4:4689,previous_r2:2,historical_v4:1};
test('SMC live reach counts each release bucket once and preserves direct/mirror definitions',()=>{
  assert.deepEqual(summarizeSMCMetrics(snapshot),{total:27338,current:3419,direct:2790,mirror:629,release:'v3.0'});
  assert.equal(summarizeSMCMetrics({...snapshot,starts:2791,total_requests:3420}).total,27339);
});
test('partial, inconsistent or invalid counters never become a misleading live total',()=>{
  for(const change of [{starts:-1},{mirror_requests:NaN},{total_requests:9999},{previous_v1:undefined},{version:'quota'},{previous_r4:1.5}])assert.throws(()=>summarizeSMCMetrics({...snapshot,...change}));
});
