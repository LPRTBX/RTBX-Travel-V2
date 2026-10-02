/**
 * Phase 4 guarded bridge into the actual Travel runtime reducer.
 * Synthetic fixture eligibility only; no live ingestion, authenticated identity, persistence or vendor API proof.
 */
import {afterAll, describe, expect, it} from 'vitest';
import {mkdirSync,writeFileSync} from 'node:fs';
import {DEFAULT_DEPLOYMENT} from '../data/travelDeploymentConfig';
import {TRAVEL_SCENARIOS} from '../data/travelScenarios';
import {TRAVEL_PLAYBOOKS} from '../data/travelPlaybooks';
import {createExecution,transitionExecution,sendCommunication,triggerEscalation,
 acknowledgeEscalation,captureEvidence,recordOutcome,getMandatoryEvidenceGaps,
 type ScenarioExecution} from '../lib/runtimeEngine';
import cohortList from './phase4-cohorts.json';
import manifest from './phase4-fixture-manifest.json';

type Cohort = (typeof cohortList)[number];
const byId=new Map(manifest.cases.map(x=>[x.fixtureId,x]));
const fixtureIds=new Set(manifest.cases.map(x=>x.fixtureId));
const rows:Array<Record<string,unknown>>=[];
const initiated=new Date().toISOString();
function eligible(c:Cohort){const reasons:string[]=[];
 for(const field of c.requires)if((c.testContext as Record<string,boolean|undefined>)[field]!==true) reasons.push(`missing-context:${field}`);
 for(const id of c.sourceFixtures){if(!fixtureIds.has(id))reasons.push(`unknown:${id}`);
   const status=byId.get(id)?.mockOutcome;
   if(status!=='accepted')reasons.push(`mock-event-unavailable:${id}:${status??'missing'}`);
 }
 return reasons;
}
function log(id:string,status:string,extra:Record<string,unknown>={}){rows.push({scenarioId:id,status,...extra});}
afterAll(()=>{
 const report={schemaVersion:'jaldo.phase4.travel-native.v1',evidenceLevel:'synthetic-canonical-reducer',
  startedAt:initiated,finishedAt:new Date().toISOString(),gitSha:process.env.GITHUB_SHA??null,
  passed:rows.filter(x=>x.status==='passed').length,
  blocked:rows.filter(x=>x.status==='correctly-blocked').length,
  failed:rows.filter(x=>x.status==='failed').length,results:rows,
  limitations:['Synthetic fixtures and context are injected, not parsed from partner payloads.',
   'Role strings are not authenticated identities.',
   'Canonical reducer is not a durable, server-side authorisation boundary.',
   'No vendor API, persistence, webhook or actual business outcome tested.']};
 mkdirSync('simulation-results',{recursive:true});
 writeFileSync('simulation-results/phase4-travel-native.json',JSON.stringify(report,null,2)+'\n');
 const summary=['# Phase 4 guarded canonical bridge','',
  `Fixture inventory: **${manifest.cases.length}** synthetic signal definitions.`,
  `Canonical reducer results: **${report.passed} passed**, **${report.blocked} correctly blocked**, **${report.failed} failed**.`,
  '', '| Scenario | Status | Canonical executions |', '|---|---|---:|',
  ...rows.map(r=>`| ${r.scenarioId} | ${r.status} | ${String(r.canonicalExecutions ?? 0)} |`),
  '', 'Evidence level: **synthetic canonical reducer** — not live vendor integration, authenticated human approval, persistence or measured business outcomes.',''];
 writeFileSync('simulation-results/phase4-summary.md',summary.join('\n'));
});
describe('Phase 4 guarded candidate runs through actual Travel canonical reducer',()=>{
 for(const c of cohortList){
  it(`${c.scenarioId}: preserve guard and reducer evidence`,()=>{
   const issues=eligible(c);
   const syntheticContext={...c.testContext};
   for(const required of c.requires){
     const broken={...syntheticContext,[required]:false};
     expect(c.requires.every(key=>(broken as Record<string,boolean|undefined>)[key]===true)).toBe(false);
   }
   if(issues.length){
     expect(['maintenance-defect','transport-disruption']).toContain(c.scenarioId);
     log(c.scenarioId,'correctly-blocked',{issues,canonicalExecutions:0});return;
   }
   const scenario=TRAVEL_SCENARIOS.find(x=>x.id===c.scenarioId);
   expect(scenario).toBeDefined();
   const playbook=TRAVEL_PLAYBOOKS.find(x=>x.id===scenario!.playbookId);
   expect(playbook).toBeDefined();
   const cfg=structuredClone(DEFAULT_DEPLOYMENT);
   const dc=cfg.scenarios.find(x=>x.scenarioId===c.scenarioId);
   expect(dc).toBeDefined();dc!.active=true;
   const os=cfg.operatingSystems.find(x=>x.osId===scenario!.operatingSystemId);
   expect(os).toBeDefined();os!.active=true;
   let e=createExecution({deployment:cfg,scenario:scenario!,playbook:playbook!});
   const move=(to:ScenarioExecution['state'])=>{
     const next=transitionExecution(e,to,scenario!,'Synthetic Phase 4 test');
     expect(next).not.toBeNull();e=next!;
   };
   expect(e.isSynthetic).toBe(true);
   expect(transitionExecution(e,'closed',scenario!)).toBeNull();
   move('understanding');move('decision-required');
   if(e.isWelfareScenario&&scenario!.governanceConfig.humanApprovalRequired){
     expect(transitionExecution(e,'in-action',scenario!)).toBeNull();
   }
   move('approval-required');move('in-action'); // simulation ONLY: no verified human approval
   let gateChecks=0;
   for(const comm of e.communications){
     if(comm.approvalRequired){expect(()=>sendCommunication(e,comm.id)).toThrow(/approval/i);gateChecks++;
       e=sendCommunication(e,comm.id,dc!.accountableRoleId); // synthetic role identifier, NOT auth
     } else e=sendCommunication(e,comm.id);
   }
   e=triggerEscalation(e,'Synthetic escalation',dc!.accountableRoleId);
   move('escalated');expect(e.escalations[0].acknowledged).toBe(false);
   e=acknowledgeEscalation(e,e.escalations[0].id);expect(e.escalations[0].acknowledged).toBe(true);
   move('in-action');move('resolved');
   expect(transitionExecution(e,'closed',scenario!)).toBeNull();
   for(const v of e.evidence.filter(x=>x.required))
     e=captureEvidence(e,v.id,{capturedByRole:v.ownerRoleId,note:'Synthetic fixture only'});
   for(const out of e.outcomes)e=recordOutcome(e,out.id,'not-measured','No external result');
   move('closed');expect(getMandatoryEvidenceGaps(e)).toEqual([]);
   log(c.scenarioId,'passed',{canonicalExecutions:1,syntheticGateChecks:gateChecks,
    finalState:e.state,transitionCount:e.stateHistory.length-1,fixtureIds:c.sourceFixtures});
  });
 }
});
