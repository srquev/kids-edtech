import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { FamilyService } from '../../core/storage/family.service';
import { dayKey, mastery, ProgressService } from '../../core/progress/progress.service';
import { ContentService } from '../../core/content/content.service';
import { Difficulty, LearningItem } from '../../core/models';
import { ParentGateService } from '../../core/platform/parent-gate.service';
import { UpdateService } from '../../core/platform/platform.service';
@Component({ imports: [RouterLink, ReactiveFormsModule], templateUrl: './parent.component.html', styleUrl: './parent.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class ParentComponent implements OnDestroy {
  readonly i = inject(I18nService); readonly family = inject(FamilyService); readonly progress = inject(ProgressService); readonly content = inject(ContentService); readonly updates = inject(UpdateService);
  private readonly gate = inject(ParentGateService); private readonly router = inject(Router); private readonly route = inject(ActivatedRoute);
  readonly Math = Math;
  readonly tab = this.route.snapshot.data['tab'] as string ?? 'overview'; readonly saved = signal(false); readonly failed = signal(false); readonly items = signal<LearningItem[]>([]); readonly loading = signal(true); readonly confirmation = signal<'reset'|'delete'>('reset'); readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('confirmDialog');
  readonly settingsForm = new FormGroup({ language: new FormControl(this.family.active()?.preferredLanguage ?? 'en', {nonNullable:true}), difficulty: new FormControl<Difficulty>(this.family.active()?.difficulty ?? 'easy',{nonNullable:true}), dailyGoal: new FormControl(this.family.settings().dailyGoal,{nonNullable:true}), voice: new FormControl(this.family.settings().voice,{nonNullable:true}), effects: new FormControl(this.family.settings().effects,{nonNullable:true}), haptics: new FormControl(this.family.settings().haptics,{nonNullable:true}) });
  readonly strengths = computed(() => this.progress.concepts().filter(c => mastery(c)==='mastered' || mastery(c)==='practicing').slice(0,5));
  readonly practice = computed(() => this.progress.concepts().filter(c => c.attempts > c.successes || mastery(c)==='learning').slice(0,5));
  readonly categories = computed(() => this.content.categories().map(category => { const items = this.items().filter(item=>item.category===category.id); const mastered = this.progress.mastered().filter(c=>c.category===category.id).length; const explored = this.progress.concepts().filter(c=>c.category===category.id).length; return { ...category, total:items.length, mastered, explored, percent:items.length?Math.round(mastered/items.length*100):0 }; }));
  readonly week = computed(() => Array.from({length:7},(_,index)=>{const date=new Date();date.setDate(date.getDate()-6+index);const day=dayKey(date);return {day,label:new Intl.DateTimeFormat(this.i.locale,{weekday:'short'}).format(date),minutes:Math.round((this.progress.data().dailySeconds[day] ?? 0)/60)};}));
  readonly weekMax = computed(()=> Math.max(5,...this.week().map(d=>d.minutes)));
  private readonly expiry = setInterval(()=> { if(!this.gate.unlocked) void this.router.navigateByUrl('/parent/gate'); }, 1000);
  constructor(){void this.load();}
  async load(): Promise<void> {this.loading.set(true);this.failed.set(false);try {const packs=await Promise.all(this.content.categories().map(c=>this.content.load(c.id,this.i.language())));this.items.set(packs.flat());}catch{this.failed.set(true);}finally{this.loading.set(false);}}
  name(category:string,id:string):string{return this.items().find(item=>item.category===category && item.id===id)?.name ?? this.i.t('category.'+category);}
  formatDate(date:string):string{return new Intl.DateTimeFormat(this.i.locale,{month:'short',day:'numeric'}).format(new Date(date));}
  async save():Promise<void>{if(!this.gate.unlocked){await this.router.navigateByUrl('/parent/gate');return;}try{const v=this.settingsForm.getRawValue();await this.i.use(v.language);await this.family.updateProfile({preferredLanguage:v.language,difficulty:v.difficulty});await this.family.updateSettings({dailyGoal:Number(v.dailyGoal),voice:v.voice,effects:v.effects,haptics:v.haptics});this.saved.set(!this.family.repository.unavailable());}catch{this.failed.set(true);}}
  async select(id:string):Promise<void>{if(!this.gate.unlocked)return;await this.family.select(id);await this.i.use(this.family.active()?.preferredLanguage ?? 'en');this.gate.lock();await this.router.navigateByUrl('/');}
  confirm(action:'reset'|'delete'):void{this.confirmation.set(action);this.dialog()?.nativeElement.showModal();}
  async execute():Promise<void>{this.dialog()?.nativeElement.close();if(!this.gate.unlocked){await this.router.navigateByUrl('/parent/gate');return;}if(this.confirmation()==='reset')await this.family.reset();else{await this.family.remove();await this.i.use(this.family.active()?.preferredLanguage??'en');this.gate.lock();await this.router.navigateByUrl(this.family.active()?'/':'/welcome');}}
  back():void{this.gate.lock();void this.router.navigateByUrl('/');}
  ngOnDestroy():void{clearInterval(this.expiry);}
}
