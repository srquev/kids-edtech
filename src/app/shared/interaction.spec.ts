import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { GamesComponent } from '../features/games/games.component';
import { AudioService, SpeechAdapter } from '../core/audio/audio.service';
import { I18nService } from '../core/i18n/i18n.service';
import { ContentService } from '../core/content/content.service';
import { StorageAdapter, initialState } from '../core/storage/local.repository';
import { FamilyService } from '../core/storage/family.service';
import { LearningItem } from '../core/models';
const items:LearningItem[]=['elephant','dog','cat'].map(id=>({id,category:'animals',name:id,shortDescription:id,emoji:'🐻',difficulty:1,tags:[],enabled:true,audioAvailable:false}));
describe('Answer interaction and audio controls',()=>{
 beforeEach(()=>{TestBed.configureTestingModule({imports:[GamesComponent],providers:[provideZonelessChangeDetection(),provideRouter([]),{provide:ActivatedRoute,useValue:{snapshot:{paramMap:convertToParamMap({kind:'find-it'}),queryParamMap:convertToParamMap({category:'animals',target:'elephant'})}}},{provide:StorageAdapter,useValue:{read:async()=>initialState(),write:async()=>undefined}},{provide:ContentService,useValue:{load:async()=>items}},{provide:SpeechAdapter,useValue:{speak:(_t:string,_l:string,done:()=>void)=>done(),stop:()=>undefined,pause:()=>undefined}},{provide:I18nService,useValue:{t:(key:string)=>key,language:()=> 'en',locale:'en-IN'}}]});});
 it('retains a question after an incorrect answer and disables choices after success',async()=>{const fixture=TestBed.createComponent(GamesComponent);await fixture.whenStable();fixture.detectChanges();const component=fixture.componentInstance;component.answer('dog');fixture.detectChanges();expect(component.feedback()).toBe('retry');expect(component.index()).toBe(0);component.answer('elephant');fixture.detectChanges();expect(component.feedback()).toBe('correct');const buttons=fixture.nativeElement.querySelectorAll('.answer-card') as NodeListOf<HTMLButtonElement>;expect(Array.from(buttons).every(button=>button.disabled)).toBeTrue();});
 it('cancels prior speech and respects mute',async()=>{const speech=TestBed.inject(SpeechAdapter);const speak=spyOn(speech,'speak');const stop=spyOn(speech,'stop');const family=TestBed.inject(FamilyService);const audio=TestBed.inject(AudioService);audio.playInstruction('hello');audio.playInstruction('again');expect(stop).toHaveBeenCalledTimes(2);expect(speak).toHaveBeenCalledTimes(2);await family.updateSettings({muted:true});audio.playInstruction('quiet');expect(speak).toHaveBeenCalledTimes(2);expect(audio.playing()).toBeFalse();});
});
