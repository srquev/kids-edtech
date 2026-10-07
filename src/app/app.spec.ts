import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ContentService, validatePack } from './core/content/content.service';
import { createSession, evaluate, shuffle, createMemory } from './core/game-engine/game-engine';
import { ConceptProgress, LearningItem, LocalState } from './core/models';
import { mastery, practiceItems, dayKey, ProgressService } from './core/progress/progress.service';
import { initialState, LocalRepository, StorageAdapter } from './core/storage/local.repository';
import { FamilyService } from './core/storage/family.service';
import { ParentGateService } from './core/platform/parent-gate.service';
import { advanceTrace } from './features/tracing/tracing-engine';
const item=(id:string):LearningItem=>({id,category:'animals',name:id,shortDescription:'An animal',emoji:'🐻',audioAvailable:false,difficulty:1,tags:['animal'],enabled:true});
const pool=['elephant','dog','cat','lion','bear','rabbit'].map(item);
const concept=(changes:Partial<ConceptProgress>={}):ConceptProgress=>({id:'elephant',category:'animals',attempts:3,successes:3,firstTry:3,sessions:['1','2','3'],lastPracticed:'2026-01-01T00:00:00Z',...changes});
class MemoryStorage extends StorageAdapter { value:LocalState|undefined; fail=false; async read():Promise<LocalState|undefined>{return this.value;} async write(state:LocalState):Promise<void>{if(this.fail)throw new Error('Disk full');this.value=structuredClone(state);} }
describe('Content-driven games',()=>{
 it('generates unique age-appropriate options with exactly one answer',()=>{for(const difficulty of ['easy','normal','advanced'] as const){const session=createSession('find-it',pool,difficulty);expect(session.questions.length).toBe(5);for(const q of session.questions){expect(q.options.length).toBe({easy:2,normal:3,advanced:4}[difficulty]);expect(new Set(q.options.map(o=>o.id)).size).toBe(q.options.length);expect(q.options.filter(o=>o.id===q.answerId).length).toBe(1);}}});
 it('retries preserve the question and reward effort independently of mistakes',()=>{const q=createSession('find-it',pool,'easy').questions[0];expect(evaluate(q,'wrong',0)).toEqual({correct:false,attempts:1,stars:0});expect(evaluate(q,q.answerId,2)).toEqual({correct:true,attempts:3,stars:1});});
 it('counting options always include the visible count',()=>{for(let i=0;i<20;i++){const q=createSession('count',pool,'easy').questions[0];expect(q.count).toBeGreaterThanOrEqual(1);expect(q.count).toBeLessThanOrEqual(5);expect(q.options.some(o=>o.id===String(q.count))).toBeTrue();}});
 it('creates exactly two cards per pair without mutating content',()=>{const copy=[...pool];for(const difficulty of ['easy','normal','advanced'] as const){const cards=createMemory(pool,difficulty);expect(cards.length).toBe({easy:4,normal:6,advanced:12}[difficulty]);for(const card of cards)expect(cards.filter(c=>c.item.id===card.item.id).length).toBe(2);}expect(pool).toEqual(copy);expect(shuffle(pool,()=>0)).not.toBe(pool);});
});
describe('Mastery and practice',()=>{
 it('requires repeated successes in separate sessions',()=>{expect(mastery()).toBe('new');expect(mastery(concept({successes:1,sessions:['1']}))).toBe('learning');expect(mastery(concept({sessions:['1']}))).toBe('practicing');expect(mastery(concept())).toBe('mastered');expect(mastery(concept({attempts:10}))).toBe('practicing');});
 it('balances known and new items, prioritizing weak concepts',()=>{const known={'animals:elephant':concept({attempts:10,successes:1}),'animals:dog':concept({id:'dog'}),'animals:cat':concept({id:'cat'}),'animals:lion':concept({id:'lion'})};const selected=practiceItems(pool,known,5,Date.parse('2026-01-02'));expect(selected[0].id).toBe('elephant');expect(selected.length).toBe(5);expect(new Set(selected.map(i=>i.id)).size).toBe(5);expect(selected.some(i=>i.id==='bear'||i.id==='rabbit')).toBeTrue();});
 it('uses the local calendar day',()=>{expect(dayKey(new Date(2026,0,2,0,1))).toBe('2026-01-02');});
});
describe('Repositories and family progress',()=>{
 let adapter:MemoryStorage;let repository:LocalRepository;let family:FamilyService;let progress:ProgressService;
 beforeEach(()=>{adapter=new MemoryStorage();TestBed.configureTestingModule({providers:[provideZonelessChangeDetection(),{provide:StorageAdapter,useValue:adapter}]});repository=TestBed.inject(LocalRepository);family=TestBed.inject(FamilyService);progress=TestBed.inject(ProgressService);});
 const create=async(name:string)=>family.create({nickname:name,avatar:'🐻',ageGroup:'2–3',preferredLanguage:'en',difficulty:'easy'});
 it('persists and reloads typed state',async()=>{await create('Sunny');const next=new LocalRepository(adapter);await next.load();expect(next.state().profiles[0].nickname).toBe('Sunny');});
 it('isolates progress across profiles and supports reset',async()=>{await create('Sunny');const sunny=family.active()?.id??'';progress.record(pool[0],'find-it',2,'session');await create('Tara');expect(family.progress().stars).toBe(0);await family.select(sunny);expect(family.progress().stars).toBe(1);expect(progress.accuracy()).toBe(0);await family.reset();expect(family.progress().stars).toBe(0);expect(family.profiles().length).toBe(2);});
 it('lessons do not grant mastery and repeated games count distinct sessions',async()=>{await create('Sunny');progress.record(pool[0],'lesson',0,'lesson',0);expect(mastery(progress.concepts()[0])).toBe('learning');for(let n=0;n<4;n++)progress.record(pool[0],'find-it',1,'same');expect(mastery(progress.concepts()[0])).toBe('practicing');progress.record(pool[0],'find-it',1,'two');progress.record(pool[0],'find-it',1,'three');expect(mastery(progress.concepts()[0])).toBe('mastered');});
 it('keeps in-memory learning available when persistence fails',async()=>{adapter.fail=true;await create('Sunny');expect(repository.unavailable()).toBeTrue();expect(family.active()?.nickname).toBe('Sunny');adapter.fail=false;await family.updateSettings({voice:false});expect(repository.unavailable()).toBeFalse();});
 it('serializes writes in order and rejects future storage versions',async()=>{await Promise.all([repository.update(s=>({...s,settings:{...s.settings,dailyGoal:10}})),repository.update(s=>({...s,settings:{...s.settings,dailyGoal:15}}))]);expect(adapter.value?.settings.dailyGoal).toBe(15);adapter.value={...initialState(),version:2} as unknown as LocalState;await repository.load();expect(repository.unavailable()).toBeTrue();});
});
describe('Content validation',()=>{
 const pack=()=>({version:1,language:'en',category:'animals',items:pool});
 it('accepts versioned local content and rejects unsafe assets, duplicates and newer schemas',()=>{expect(validatePack(pack(),'animals','en').items.length).toBe(6);expect(()=>validatePack({...pack(),version:2},'animals','en')).toThrow();expect(()=>validatePack({...pack(),items:[pool[0],pool[0]]},'animals','en')).toThrow();expect(()=>validatePack({...pack(),items:[{...pool[0],image:'https://tracker.test/image'}]},'animals','en')).toThrow();});
 it('loads packs lazily and caches requests',async()=>{const fetchSpy=spyOn(window,'fetch').and.resolveTo(new Response(JSON.stringify(pack())));const content=new ContentService();content.categories.set([{id:'animals',symbol:'🐻',theme:'mint',titleKey:'category.animals',descriptionKey:'categoryDesc.animals',illustration:'/assets/illustrations/animals.svg',pack:'core'}]);await Promise.all([content.load('animals','en'),content.load('animals','en')]);expect(fetchSpy).toHaveBeenCalledTimes(1);await expectAsync(content.load('../invalid','en')).toBeRejected();});
});
describe('Parent gate and tracing boundaries',()=>{
 it('expires permission and locks explicitly',()=>{const gate=new ParentGateService();const [a,b]=gate.challenge();expect(gate.answer(-1)).toBeFalse();expect(gate.unlocked).toBeFalse();expect(gate.answer(a*b)).toBeTrue();expect(gate.unlocked).toBeTrue();gate.lock();expect(gate.unlocked).toBeFalse();});
 it('rejects unrelated scribbles and requires ordered path coverage',()=>{const samples=[{x:0,y:0},{x:10,y:0},{x:20,y:0},{x:30,y:0}];expect(advanceTrace(samples,0,{x:200,y:200})).toBe(0);expect(advanceTrace(samples,0,{x:30,y:0},5)).toBe(0);expect(advanceTrace(samples,0,{x:0,y:0},5)).toBe(1);});
});
