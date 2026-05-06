<script setup lang="ts">
/**
 * FxEditor.vue — Страница светильника.
 *
 * v2: Онбординг для новых + компактный шаг «Размер» с автоподбором.
 *
 * isNewFixture (нет opts/done):
 *   - Стартует на первом шаге, не на summary
 *   - После подтверждения → следующий шаг (не summary)
 *   - После последнего → summary
 *
 * Шаг «Размер» — пилюли S/M/L/1000, ось мягче→ярче,
 * детали только для выбранного, бейдж автоподбора.
 */

import { computed, ref } from 'vue'
import { T, WCOL } from '../theme/tokens'
import { MD, FAMILIES, type Fixture, type ModelId } from '../data/catalog'
import { MATS, BOWLS as ALL_BOWLS, BTEMPS, DEF_OPT, OPT_PRICE, WOOD_TIPS, OPT_TIPS, type Wood, type Bowl } from '../data/materials'
import { getBright } from '../data/moods'
import { buildSizeRecommendation, type AreaFit, type SizeCandidate } from '../engine/autosize'
import Icon, { type IconName } from './ui/Icons.vue'
import { buildFixtureShareUrl } from '../engine/share'

interface Props {
  item: Fixture; defWood?: Wood; skipSize?: boolean; backLabel?: string
  roomArea?: number; roomBaseLm?: number; roomCurrentLmWithoutThis?: number
  roomName?: string; roomTint?: string
}
const props = withDefaults(defineProps<Props>(), { skipSize: false, backLabel: '← Назад' })
const emit = defineEmits<{ (e: 'save', fx: Fixture): void; (e: 'delete'): void; (e: 'close'): void; (e: 'feedback', msg: string): void }>()

type StepId = 'size'|'wood'|'mount'|'bowl'|'temp'|'patrons'|'diffuser'|'wire'|'base'|'bulbs'
type StepStatus = 'default'|'chosen'
const SM: Record<StepId, {name:string;desc:string;icon:IconName}> = {
  size:{name:'Размер',desc:'Подберите размер под комнату',icon:'fxSize'},
  wood:{name:'Дерево',desc:'Три породы — три характера',icon:'leafy'},
  mount:{name:'Крепление',desc:'Как светильник крепится к потолку',icon:'fxMount'},
  bowl:{name:'Чаша',desc:'Декоративная накладка на потолке',icon:'fxBowl'},
  temp:{name:'Температура',desc:'Оттенок света',icon:'thermo'},
  patrons:{name:'Патроны',desc:'Больше патронов — ярче свет',icon:'sun'},
  diffuser:{name:'Рассеиватель',desc:'Мягкий свет без бликов',icon:'fxDiffuser'},
  wire:{name:'Подключение',desc:'Как подать электричество',icon:'fxWire'},
  base:{name:'Основание',desc:'Цвет ножки торшера',icon:'dotDashed'},
  bulbs:{name:'Лампочки',desc:'Включить в комплект?',icon:'bulb'},
}
const SIM_MOUNTS = [{id:'pendant',name:'На подвесе',tip:'Потолок >2.7м — больше света'},{id:'flush',name:'Вплотную',tip:'Потолок <2.7м — минимум зазора'}] as const
const BASE_COLORS = {white:{name:'Белое',color:'#E8E0D4'},black:{name:'Чёрное',color:'#3A3530'}} as const

const mid = ref<ModelId>(props.item.m)
const stepIdx = ref(0)
const hasExistingOpts = !!(props.item.opts && Object.keys(props.item.opts).length > 0)
const existingDone = props.item.done ?? []
const legacyAllDone = hasExistingOpts && existingDone.length === 0
const isNewFixture = !hasExistingOpts && existingDone.length === 0
/** Активен ли первичный онбординг. Выключается при первом выходе в summary. */
const inOnboarding = ref(isNewFixture)
const view = ref<'steps'|'summary'>(isNewFixture ? 'steps' : 'summary')
const showHelp = ref(false)
const touched = ref(new Set<StepId>())
const priceOpen = ref(false)

interface Build { m:ModelId;wood:Wood;mount:string;bowl:string;btemp:string;lamps:number;diffuser:boolean;moisture:boolean;bulbs:boolean;wire:string;baseColor:string;bulbOpt:string;steps:Record<string,StepStatus> }

function getSteps(modelId:ModelId):StepId[] {
  const m=MD[modelId]; const s:StepId[]=[]; const fam=m.family?FAMILIES[m.family]:null
  if(!props.skipSize&&fam&&fam.length>1)s.push('size')
  s.push('wood'); if(m.hasMount)s.push('mount'); if(m.avBowls.length>0)s.push('bowl')
  s.push('temp'); if(m.minL!==m.maxL)s.push('patrons'); if(m.hasDiffuser)s.push('diffuser')
  if(m.wireOpts)s.push('wire'); if(m.baseColors)s.push('base')
  if(!m.bulbsIn&&(m.bulbPrice||m.bulbOpts))s.push('bulbs'); return s
}

const build = ref<Build>((()=>{
  const m=MD[props.item.m]; const o=props.item.opts??{}; const stps=getSteps(props.item.m)
  return {m:props.item.m,wood:props.item.wood??props.defWood??'oak',mount:o.mount??DEF_OPT.mount,
    bowl:o.bowl??DEF_OPT.bowl,btemp:o.btemp??DEF_OPT.btemp,lamps:props.item.l??m.lamps,
    diffuser:o.diffuser??DEF_OPT.diffuser,moisture:o.moisture??DEF_OPT.moisture,bulbs:o.bulbs??DEF_OPT.bulbs,
    wire:o.wire??DEF_OPT.wire,baseColor:o.baseColor??'white',bulbOpt:o.bulbOpt??'none',
    steps:Object.fromEntries(stps.map(s=>{
      let isDone:boolean; if(existingDone.length>0)isDone=existingDone.includes(s)
      else if(legacyAllDone)isDone=true; else isDone=false
      return[s,isDone?'chosen' as StepStatus:'default' as StepStatus]}))}
})())

const model=computed(()=>MD[mid.value]); const steps=computed(()=>getSteps(mid.value))
const curStep=computed(()=>steps.value[stepIdx.value]); const meta=computed(()=>SM[curStep.value]||{name:'',desc:''})
const isTouched=computed(()=>touched.value.has(curStep.value))
const canAdvance=computed(()=>inOnboarding.value&&stepIdx.value<steps.value.length-1)
const families=computed(()=>{const m=model.value;return m.family?[...FAMILIES[m.family]].reverse():null})
const availBowls=computed(()=>model.value.avBowls.map(id=>ALL_BOWLS.find(b=>b.id===id)).filter(Boolean) as Bowl[])
const freeBowls=computed(()=>availBowls.value.filter(b=>b.price===0))
const paidBowls=computed(()=>availBowls.value.filter(b=>b.price>0))
const simMats=computed(()=>MATS.map(m=>({id:m.id as Wood,name:m.name,color:m.color||WCOL[m.id as Wood],tip:WOOD_TIPS[m.id as Wood]??''})))

interface PriceRow{label:string;amount:number}
const priceBreakdown=computed<PriceRow[]>(()=>{
  const m=model.value,b=build.value; const items:PriceRow[]=[]
  const wn=simMats.value.find(x=>x.id===b.wood)?.name??'Дуб'; items.push({label:`Базовая (${wn})`,amount:m.p[b.wood]||0})
  const extra=Math.max(0,b.lamps-m.lamps); if(extra>0)items.push({label:`+${extra} ${spw(extra)}`,amount:extra*m.sur})
  if(m.avBowls.length>0&&b.bowl){const bowl=ALL_BOWLS.find(x=>x.id===b.bowl);if(bowl&&bowl.price>0)items.push({label:`Чаша «${bowl.name}»`,amount:bowl.price})}
  if(b.diffuser&&m.hasDiffuser)items.push({label:'Рассеиватель',amount:OPT_PRICE.diffuser})
  if(b.moisture)items.push({label:'Влагозащита',amount:OPT_PRICE.moisture})
  if(m.bulbOpts){const bo=m.bulbOpts.find(x=>x.id===b.bulbOpt);if(bo&&bo.price>0)items.push({label:bo.label,amount:bo.price})}
  else if(!m.bulbsIn&&b.bulbs&&m.bulbPrice)items.push({label:`Лампочки ${b.lamps} шт`,amount:Math.round((m.bulbPrice*b.lamps)/m.lamps)})
  if(m.wireOpts){const wo=m.wireOpts.find(x=>x.id===b.wire);if(wo&&wo.price>0)items.push({label:wo.label,amount:wo.price})}
  return items
})
const price=computed(()=>priceBreakdown.value.reduce((s,r)=>s+r.amount,0))
const progress=computed(()=>{const t=steps.value.length;const d=steps.value.filter(s=>build.value.steps[s]==='chosen').length;return{total:t,done:d,pct:t?Math.round((d/t)*100):0}})
const status=computed(()=>{const c=steps.value.filter(s=>build.value.steps[s]==='chosen').length;if(c===steps.value.length)return'Собран';return c>0?'В сборке':'Новый'})
const sc=computed(()=>status.value==='Собран'?T.green:status.value==='В сборке'?T.neutral:T.textDim)
const isDone=computed(()=>status.value==='Собран')
const myChoices=computed<[string,string][]>(()=>{
  const m=model.value,b=build.value
  const list:([string,string]|null)[]=[
    ['Свет',`${b.lamps} п. · ${fmt(Math.round(b.lamps*m.lmPer*diffMult()))} лм · ${btempK()}`],
    m.hasMount?['Крепление',b.mount==='pendant'?'На подвесе':'Вплотную']:null,
    m.avBowls.length>0?['Чаша',bowlName()]:null,
    m.hasDiffuser?['Рассеиватель',b.diffuser?'Да':'Нет']:null,
    m.wireOpts?['Подключение',m.wireOpts.find(x=>x.id===b.wire)?.label||'—']:null,
    m.baseColors?['Основание',BASE_COLORS[b.baseColor as keyof typeof BASE_COLORS]?.name||'—']:null,
    (m.bulbPrice||m.bulbOpts)?['Лампочки',m.bulbOpts?(m.bulbOpts.find(x=>x.id===b.bulbOpt)?.label??'—'):(b.bulbs?`${b.lamps} шт в комплекте`:'Свои')]:null,
  ];return list.filter(Boolean) as [string,string][]
})

/* ═══ SIZE RECOMMENDATION ═══ */
const hasRoomContext=computed(()=>props.roomArea!=null&&props.roomBaseLm!=null&&props.roomCurrentLmWithoutThis!=null)
const sizeRecs=computed<SizeCandidate[]|null>(()=>{
  if(!hasRoomContext.value||!families.value)return null
  return buildSizeRecommendation(families.value,props.roomArea!,props.roomBaseLm!,props.roomCurrentLmWithoutThis!,props.item.q??1)
})
const recommendedMid=computed<ModelId|null>(()=>sizeRecs.value?.find(r=>r.recommended)?.mid??null)
function getRecFor(fid:ModelId):SizeCandidate|null{return sizeRecs.value?.find(r=>r.mid===fid)??null}
function brightLabel(fid:ModelId):string{const rec=getRecFor(fid);if(!rec)return'';return getBright(rec.projectedRatio).name}
function brightColor(fid:ModelId):string{const rec=getRecFor(fid);if(!rec)return T.textDim;return getBright(rec.projectedRatio).color}

/** Описание шага «Размер» — крупная плашка комнаты с площадью. */
const roomLabel=computed(()=>{
  if(!hasRoomContext.value)return null
  const name=props.roomName??'Комната'
  return `${name} · ${props.roomArea} м²`
})

/** Текст-совет «что делать» под сеткой. Многострочный, покрывает все сценарии. */
interface SizeAdvice{text:string;tone:'good'|'warn'|'bad'|'neutral'}
const sizeAdvice=computed<SizeAdvice|null>(()=>{
  if(!sizeRecs.value||!hasRoomContext.value)return null
  const recs=sizeRecs.value
  const sel=recs.find(r=>r.mid===build.value.m)
  const rec=recs.find(r=>r.recommended)
  if(!sel)return null
  const selBright=getBright(sel.projectedRatio).name
  const cats=recs.map(r=>getBright(r.projectedRatio).name)
  const uniqueCats=[...new Set(cats)]
  const comfCount=recs.filter(r=>r.projectedRatio>=0.8&&r.projectedRatio<=2.0).length

  // 1. Выбран рекомендованный
  if(rec&&rec.mid===sel.mid){
    if(comfCount>1){
      return{text:`${MD[rec.mid].name} — лучший баланс яркости и размера для вашей комнаты. Остальные «комфортные» тоже подойдут — выбирайте по диаметру под потолок и стиль интерьера.`,tone:'good'}
    }
    return{text:`${MD[rec.mid].name} — оптимальный выбор для этой комнаты. Ровно столько света, сколько нужно.`,tone:'good'}
  }

  // 2. Все одинаковая яркость
  if(uniqueCats.length===1){
    if(selBright==='Не хватает'||selBright==='Приглушённо'){
      return{text:`Ни один размер этой коллекции не осветит ${props.roomArea} м² самостоятельно. Выберите крупнейший — он даст максимум, а остальной свет добавьте бра, торшером или спотами.`,tone:'bad'}
    }
    if(selBright==='Избыточно'){
      return{text:`Все размеры дают слишком много света для этой комнаты. Возьмите наименьший и обязательно поставьте диммер — будете управлять яркостью.`,tone:'warn'}
    }
    if(selBright==='С запасом'){
      return{text:`Все размеры дают запас яркости. Крупный — для выразительного потолка, компактный — если хотите минимализм. Диммер пригодится в любом случае.`,tone:'neutral'}
    }
    // Все «Комфортно»
    return{text:`Все размеры подходят по яркости — свет одинаковый. Крупнее — выразительнее на потолке, компактнее — деликатнее. Выбирайте по диаметру под высоту потолка и стиль.`,tone:'neutral'}
  }

  // 3. Выбран НЕ рекомендованный, есть рекомендация
  if(rec&&sel){
    const recName=MD[rec.mid].name
    if(sel.modelLm<rec.modelLm){
      if(selBright==='Не хватает'){
        return{text:`Этого размера не хватит — будет темно. Рекомендуем ${recName} или добавьте дополнительные светильники (бра, торшер).`,tone:'bad'}
      }
      if(selBright==='Приглушённо'){
        return{text:`Получится приглушённый свет — для атмосферы хорошо, для работы мало. Хотите ярче — возьмите ${recName}.`,tone:'warn'}
      }
      return{text:`Чуть меньше рекомендуемого, но всё равно комфортно. Если любите яркость — возьмите ${recName}.`,tone:'neutral'}
    }
    // Больше рекомендуемого
    if(selBright==='Избыточно'){
      return{text:`Этот размер даст слишком много света. Возьмите ${recName} — он идеально балансирует, или поставьте диммер.`,tone:'warn'}
    }
    if(selBright==='С запасом'){
      return{text:`Будет с запасом — хорошо для рабочей зоны или если в комнате тёмные стены. Поставьте диммер для вечернего режима.`,tone:'neutral'}
    }
    return{text:`Хороший выбор. Рекомендация — ${recName}, но ваш вариант тоже в комфортном диапазоне.`,tone:'good'}
  }

  // 4. Нет рекомендации, разные яркости
  if(selBright==='Не хватает'){
    return{text:`Для ${props.roomArea} м² этого мало. Возьмите крупнее или добавьте другие светильники — бра, торшер, споты.`,tone:'bad'}
  }
  if(selBright==='Приглушённо'){
    return{text:`Приглушённый свет — создаст атмосферу, но для постоянного использования мало. Добавьте бра или возьмите размер крупнее.`,tone:'warn'}
  }
  if(selBright==='Избыточно'){
    return{text:`Много света для этой комнаты. Возьмите размер поменьше или установите диммер.`,tone:'warn'}
  }
  if(selBright==='С запасом'){
    return{text:`С запасом яркости — комфортно днём, а вечером приглушите диммером. Хороший вариант для светлых комнат и рабочих зон.`,tone:'neutral'}
  }
  return{text:`Комфортный уровень света для вашей комнаты.`,tone:'good'}
})

function adviceColor(tone:'good'|'warn'|'bad'|'neutral'):string{
  if(tone==='good')return T.green
  if(tone==='warn')return T.yellow
  if(tone==='bad')return T.red
  return T.neutral
}

/** «Выбери за меня» — переключает на рекомендуемый размер. */
function selectBestForMe(){
  const best=recommendedMid.value
  if(!best)return
  mid.value=best
  upBuild({m:best,lamps:MD[best].lamps})
}

/** Статусы яркости для модалки «Как подбирается размер». */
const helpStatuses=[
  {label:'Не хватает',color:T.red,desc:'Меньше половины нормы. Будет темно даже днём.'},
  {label:'Приглушённо',color:T.yellow,desc:'0.5–0.8× от нормы. Хорошо для атмосферы и засыпания.'},
  {label:'Комфортно',color:T.green,desc:'0.8–2× — целевой диапазон. Достаточно для всех задач.'},
  {label:'С запасом',color:T.neutral,desc:'2–4×. Для рабочих зон или комнат с тёмными стенами.'},
  {label:'Избыточно',color:T.textDim,desc:'Больше 4× нормы. Поставьте диммер или возьмите меньше.'},
]

/* ═══ MUTATIONS ═══ */
function upBuild(patch:Partial<Build>){
  const cur=build.value
  const isNoChange=Object.entries(patch).every(([k,v])=>cur[k as keyof Build]===v)
  build.value={...cur,...patch}
  const cs=curStep.value
  if(isNoChange&&touched.value.has(cs)){
    // Повторный тап по уже выбранному → снимаем touched (кнопка «Пропустить»)
    const next=new Set(touched.value);next.delete(cs);touched.value=next
  }else{
    touched.value=new Set([...touched.value,cs])
  }
}
function doCommit(isChoice:boolean){
  build.value={...build.value,steps:{...build.value.steps,[curStep.value]:isChoice?'chosen':'default'}}
  touched.value=new Set([...touched.value].filter(x=>x!==curStep.value))
  if(canAdvance.value){
    stepIdx.value++
  }else{
    // Первый выход в summary завершает онбординг — далее «Пропустить» всегда возвращает в summary
    view.value='summary'
    inOnboarding.value=false
  }
}
function goToStep(i:number){stepIdx.value=i;view.value='steps'}
function backFromStep(){
  if(inOnboarding.value&&stepIdx.value>0){
    stepIdx.value--
  }else{
    view.value='summary'
    inOnboarding.value=false
  }
}
function lampOpts():number[]{const r:number[]=[];for(let i=model.value.minL;i<=model.value.maxL;i++)r.push(i);return r}
function diffMult():number{return build.value.diffuser&&model.value.diffLoss?1-model.value.diffLoss:1}
function buildFixture():Fixture{const b=build.value;const done=(Object.entries(b.steps) as [StepId,StepStatus][]).filter(([,st])=>st==='chosen').map(([s])=>s as string);return{m:b.m,q:props.item.q??1,wood:b.wood,zone:props.item.zone,l:b.lamps,opts:{bowl:b.bowl,mount:b.mount,wire:b.wire,btemp:b.btemp,diffuser:b.diffuser,moisture:b.moisture,bulbs:b.bulbs,bulbOpt:b.bulbOpt,baseColor:b.baseColor},done}}
function doSave(){emit('save',buildFixture())}
async function shareFx(){const url=buildFixtureShareUrl(buildFixture());try{await navigator.clipboard.writeText(url);emit('feedback','Ссылка на светильник скопирована')}catch{emit('feedback',url)}}

const fmt=(n:number)=>n.toLocaleString('ru-RU')
function spw(n:number){const a=Math.abs(n),l=a%10,t=a%100;if(t>=11&&t<=19)return'патронов';if(l===1)return'патрон';if(l>=2&&l<=4)return'патрона';return'патронов'}
function slw(n:number){const a=Math.abs(n),l=a%10,t=a%100;if(t>=11&&t<=19)return'лампочек';if(l===1)return'лампочка';if(l>=2&&l<=4)return'лампочки';return'лампочек'}
function bowlName(){return ALL_BOWLS.find(x=>x.id===build.value.bowl)?.name??'—'}
function btempK(){const bt=BTEMPS.find(x=>x.id===build.value.btemp);return bt?bt.kelvin+'К':'—'}
function bulbTotal(){const bp=model.value.bulbPrice??OPT_PRICE.bulbsPerLamp*model.value.lamps;return Math.round((bp*build.value.lamps)/model.value.lamps)}
function bulbPer(){return model.value.bulbPrice?Math.round(model.value.bulbPrice/model.value.lamps):OPT_PRICE.bulbsPerLamp}
</script>

<template>
  <div :style="{position:'fixed',inset:0,background:T.bg,overflow:'auto'}">
    <!-- STICKY HEADER -->
    <div :style="{position:'sticky',top:0,background:T.bg,zIndex:2,borderBottom:`1px solid ${T.border}`}">
      <div :style="{position:'relative',maxWidth:'480px',margin:'0 auto',height:'48px'}">
        <button :style="{position:'absolute',left:'16px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:T.textSec,cursor:'pointer',padding:'4px 8px 4px 0',fontSize:'14px',fontWeight:500}" @click="view==='summary'?emit('close'):backFromStep()">← Назад</button>
        <div :style="{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%, -50%)',fontSize:'15px',fontWeight:700,color:T.text,whiteSpace:'nowrap',maxWidth:'60%',overflow:'hidden',textOverflow:'ellipsis'}">{{ model.name }}</div>
      </div>
    </div>
    <!-- CONTENT -->
    <div :style="{maxWidth:'480px',margin:'0 auto',padding:'16px 20px',fontFamily:`'Segoe UI', system-ui, sans-serif`,color:T.text,boxSizing:'border-box'}">

      <!-- SUMMARY -->
      <template v-if="view==='summary'">
        <div :style="{background:T.card,border:`1px solid ${isDone?sc+'44':T.border}`,borderRadius:'14px',padding:'14px',marginBottom:'16px'}">
          <div :style="{display:'flex',alignItems:'center',gap:'12px'}">
            <div :style="{width:'52px',height:'52px',borderRadius:'12px',background:WCOL[build.wood]+'22',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}"><Icon name="ceiling" :color="WCOL[build.wood]" :size="26"/></div>
            <div :style="{flex:1,minWidth:0}">
              <div :style="{fontSize:'15px',fontWeight:700,color:T.text,marginBottom:'2px'}">{{ model.name }}</div>
              <div :style="{fontSize:'11px',color:T.textDim,display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}">
                <span :style="{textTransform:'uppercase',letterSpacing:'.5px'}">{{ model.type }} · {{ simMats.find(x=>x.id===build.wood)?.name }}</span>
                <span :style="{display:'inline-block',padding:'2px 8px',borderRadius:'4px',background:sc+'22',fontSize:'10px',fontWeight:700,color:sc}">{{ status }}</span>
              </div>
            </div>
            <button :style="{background:'none',border:'none',cursor:'pointer',padding:'4px',display:'flex',flexDirection:'column',alignItems:'flex-end',color:T.neutral,flexShrink:0}" @click="priceOpen=!priceOpen">
              <span :style="{fontSize:'15px',fontWeight:800,fontVariantNumeric:'tabular-nums'}">{{ fmt(price) }} ₽</span>
              <span :style="{fontSize:'10px',color:T.textSec,display:'flex',alignItems:'center',gap:'3px',marginTop:'2px'}">{{ priceOpen?'Скрыть':'Детали' }}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :style="{transform:priceOpen?'rotate(180deg)':'none',transition:'transform .2s'}"><polyline points="6 9 12 15 18 9"/></svg></span>
            </button>
          </div>
          <div v-if="priceOpen" :style="{marginTop:'12px',paddingTop:'12px',borderTop:`1px solid ${T.border}`}">
            <div v-for="(row,i) in priceBreakdown" :key="i" :style="{display:'flex',justifyContent:'space-between',alignItems:'baseline',fontSize:'12px',padding:'3px 0'}"><span :style="{color:T.textSec}">{{ row.label }}</span><span :style="{color:i===0?T.text:T.yellow,fontWeight:600,fontVariantNumeric:'tabular-nums'}">{{ i===0?'':'+' }}{{ fmt(row.amount) }} ₽</span></div>
            <div :style="{display:'flex',justifyContent:'space-between',alignItems:'baseline',fontSize:'13px',fontWeight:800,color:T.text,marginTop:'6px',paddingTop:'8px',borderTop:`1px solid ${T.border}`}"><span>Итого</span><span :style="{color:T.neutral,fontVariantNumeric:'tabular-nums'}">{{ fmt(price) }} ₽</span></div>
          </div>
          <div :style="{borderTop:`1px solid ${T.border}`,marginTop:'12px',paddingTop:'10px'}">
            <div :style="{fontSize:'10px',fontWeight:700,color:T.neutral,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'6px'}">Мой выбор</div>
            <div :style="{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'4px 12px'}">
              <div v-for="([k,v]) in myChoices" :key="k" :style="{display:'flex',justifyContent:'space-between',fontSize:'12px',gap:'8px'}"><span :style="{color:T.textSec,flexShrink:0}">{{ k }}</span><span :style="{fontWeight:600,color:T.text,textAlign:'right',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}">{{ v }}</span></div>
            </div>
          </div>
        </div>
        <div :style="{background:T.card,border:`1px solid ${T.border}`,borderRadius:'10px',padding:'14px',marginBottom:'16px'}">
          <div :style="{display:'flex',justifyContent:'space-between',marginBottom:'8px'}"><span :style="{fontSize:'13px',fontWeight:700}">Чек-лист</span><span :style="{fontSize:'12px',fontWeight:700,color:sc}">{{ isDone?'Готово':`${progress.done} из ${progress.total}` }}</span></div>
          <div :style="{height:'6px',background:T.border,borderRadius:'4px',overflow:'hidden',marginBottom:'12px'}"><div :style="{height:'100%',width:progress.pct+'%',background:sc,borderRadius:'4px',transition:'width .3s'}"/></div>
          <button v-for="(s,i) in steps" :key="s" :style="{display:'flex',alignItems:'center',gap:'10px',width:'100%',padding:'10px 0',background:'none',border:'none',cursor:'pointer',borderBottom:i<steps.length-1?`1px solid ${T.border}`:'none',textAlign:'left'}" @click="goToStep(i)">
            <Icon :name="SM[s]?.icon??'sun'" :size="18" :color="build.steps[s]==='chosen'?T.green:T.textDim"/>
            <span :style="{flex:1,fontSize:'13px',color:T.text}">{{ SM[s]?.name }}</span>
            <span :style="{fontSize:'10px',padding:'4px 10px',borderRadius:'5px',fontWeight:600,background:build.steps[s]==='chosen'?T.green+'22':T.neutral+'15',color:build.steps[s]==='chosen'?T.green:T.neutral}">{{ build.steps[s]==='chosen'?'Готово':'Выбрать' }}</span>
          </button>
        </div>
        <button :style="{width:'100%',padding:'14px',background:isDone?sc:T.neutral,color:T.bg,border:'none',borderRadius:'10px',cursor:'pointer',fontSize:'14px',fontWeight:700,marginBottom:'8px'}" @click="doSave">Сохранить</button>
        <button :style="{width:'100%',padding:'12px',background:'none',border:`1px solid ${T.border}`,borderRadius:'8px',color:T.textSec,cursor:'pointer',fontSize:'13px',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'6px',marginBottom:'20px'}" @click="shareFx"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>Поделиться ссылкой на светильник</button>
        <div :style="{textAlign:'center',marginTop:'24px',paddingTop:'20px',borderTop:`1px solid ${T.border}`}"><button :style="{padding:'8px 20px',background:'none',border:`1px solid ${T.red}55`,borderRadius:'6px',color:T.red,cursor:'pointer',fontSize:'12px'}" @click="emit('delete')">Удалить светильник</button></div>
      </template>

      <!-- STEP -->
      <template v-if="view==='steps'">
        <div :style="{marginBottom:'16px',paddingTop:'8px'}">
          <div :style="{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}">
            <Icon :name="meta.icon" :color="T.neutral" :size="18"/>
            <span :style="{fontSize:'17px',fontWeight:700}">{{ meta.name }}</span>
            <span :style="{flex:1}"/>
            <span :style="{padding:'3px 10px',borderRadius:'10px',background:T.neutral+'18',fontSize:'10px',color:T.textSec,fontWeight:600,letterSpacing:'.3px'}">{{ stepIdx+1 }}/{{ steps.length }}</span>
          </div>
          <div v-if="curStep!=='size'" :style="{fontSize:'12px',color:T.textSec}">{{ curStep==='bulbs'?`${build.lamps} ${spw(build.lamps)}`:meta.desc }}</div>
        </div>

        <!-- Бейдж комнаты — ВНЕ карточки, по центру над ней -->
        <div v-if="curStep==='size'&&roomLabel" :style="{textAlign:'center',marginBottom:'12px'}">
          <div :style="{display:'inline-block',padding:'7px 16px',borderRadius:'20px',background:`linear-gradient(135deg, ${(props.roomTint??T.neutral)}33, ${(props.roomTint??T.neutral)}10)`,border:`1px solid ${(props.roomTint??T.neutral)}55`,fontSize:'13px',fontWeight:600,color:T.text,letterSpacing:'.2px'}">{{ roomLabel }}</div>
        </div>

        <div :style="{background:T.card,border:`1px solid ${T.border}`,borderRadius:'12px',padding:'16px'}">

          <!-- SIZE — Смарт-подбор -->
          <div v-if="curStep==='size'&&families">

            <!-- Заголовок -->
            <div v-if="hasRoomContext" :style="{textAlign:'center',marginBottom:'14px'}">
              <div :style="{fontSize:'18px',fontWeight:800,color:T.text,letterSpacing:'.3px',marginBottom:'6px'}">Смарт-подбор</div>
              <div v-if="recommendedMid" :style="{fontSize:'13px',color:T.textSec,fontWeight:500,marginBottom:'8px'}">Рекомендация — <span :style="{fontWeight:700,color:T.text}">{{ MD[recommendedMid].name }}</span></div>
              <!-- Бабл «Как подбирается размер» — яркий -->
              <button :style="{display:'inline-flex',alignItems:'center',gap:'6px',padding:'6px 14px',borderRadius:'14px',background:T.neutral+'22',border:`1px solid ${T.neutral}55`,color:T.text,cursor:'pointer',fontSize:'12px',fontWeight:500}" @click="showHelp=true">
                <span :style="{width:'16px',height:'16px',borderRadius:'50%',background:T.neutral,color:T.bg,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:800}">?</span>
                <span>Как подбирается размер</span>
              </button>
            </div>

            <!-- «Сравните размеры:» -->
            <div :style="{fontSize:'13px',fontWeight:600,color:T.textSec,marginBottom:'10px'}">Сравните размеры:</div>

            <!-- 2-колоночная сетка карточек -->
            <div :style="{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'14px'}">
              <button v-for="fid in families" :key="fid"
                :style="{
                  padding:'14px 10px',borderRadius:'10px',cursor:'pointer',textAlign:'center',
                  border:build.m===fid?`2px solid ${recommendedMid===fid?T.green:T.neutral}`:`1px solid ${T.border}`,
                  background:build.m===fid?(recommendedMid===fid?T.green+'10':T.neutral+'10'):T.cardAlt,
                  position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',
                }"
                @click="()=>{mid=fid;upBuild({m:fid,lamps:MD[fid].lamps})}"
              >
                <!-- Letter + check -->
                <div :style="{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',gap:'6px'}">
                  <span :style="{fontSize:'20px',fontWeight:800,color:build.m===fid?T.text:T.textSec}">{{ MD[fid].letter }}</span>
                  <span v-if="recommendedMid===fid" :style="{width:'20px',height:'20px',borderRadius:'50%',background:T.green,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:T.bg,fontWeight:700}">✓</span>
                </div>

                <!-- Бейдж яркости -->
                <div v-if="hasRoomContext" :style="{padding:'6px 14px',borderRadius:'7px',background:brightColor(fid)+'22',color:brightColor(fid),fontSize:'13px',fontWeight:700,whiteSpace:'nowrap'}">
                  {{ brightLabel(fid) }}
                </div>

                <!-- Диаметр — бабл с обводкой -->
                <div :style="{padding:'5px 12px',borderRadius:'7px',border:`1px solid ${T.border}`,background:T.card,color:T.text,fontSize:'13px',fontWeight:700,whiteSpace:'nowrap'}">
                  {{ MD[fid].dimD }} см
                </div>

                <!-- Лм и площадь -->
                <div :style="{fontSize:'11px',color:T.textSec,lineHeight:'1.5'}">
                  <div>{{ fmt(MD[fid].lmPer*MD[fid].lamps) }} лм</div>
                  <div>{{ MD[fid].sqMin }}–{{ MD[fid].sqMax }} м²</div>
                </div>
              </button>
            </div>

            <!-- Кнопка «Выбери за меня» -->
            <button v-if="recommendedMid&&build.m!==recommendedMid"
              :style="{width:'100%',padding:'12px',marginBottom:'14px',borderRadius:'10px',cursor:'pointer',border:`1px solid ${T.green}55`,background:T.green+'12',color:T.green,fontSize:'13px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}"
              @click="selectBestForMe"
            >
              <span :style="{width:'20px',height:'20px',borderRadius:'50%',background:T.green,color:T.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700}">✓</span>
              Выбери за меня
            </button>

            <!-- Блок совета с анимацией ламелей -->
            <div v-if="sizeAdvice" :style="{
              padding:'12px 14px',
              background:`linear-gradient(135deg, ${(props.roomTint??T.neutral)}26, ${(props.roomTint??T.neutral)}10)`,
              border:`1px solid ${(props.roomTint??T.neutral)}44`,
              borderRadius:'10px',
              display:'flex',gap:'12px',alignItems:'flex-start',
            }">
              <div class="rotor-mini" aria-hidden="true">
                <div v-for="i in 12" :key="i" class="rotor-mini-l" :style="{'--rot': ((i-1)/12*360)+'deg', animationDelay: ((i-1)*30)+'ms'}" />
              </div>
              <div :style="{fontSize:'12px',lineHeight:1.6,color:T.text,flex:1}">{{ sizeAdvice.text }}</div>
            </div>
          </div>

          <!-- wood --><div v-else-if="curStep==='wood'" :style="{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}"><button v-for="mt in simMats" :key="mt.id" :style="{padding:'16px 8px',borderRadius:'10px',cursor:'pointer',border:build.wood===mt.id?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.wood===mt.id?T.neutral+'18':T.card,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center'}" @click="upBuild({wood:mt.id})"><div :style="{width:'40px',height:'40px',borderRadius:'50%',background:mt.color,border:mt.id==='black'?`2px solid ${T.textDim}`:'none'}"/><div :style="{fontSize:'14px',fontWeight:700,color:build.wood===mt.id?T.text:T.textSec,marginTop:'10px'}">{{ mt.name }}</div><div v-if="mt.tip" :style="{fontSize:'11px',color:T.textDim,marginTop:'6px',lineHeight:'1.4'}">{{ mt.tip }}</div></button></div>
          <!-- mount --><div v-else-if="curStep==='mount'" :style="{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}"><button v-for="mt in SIM_MOUNTS" :key="mt.id" :style="{padding:'18px 12px',borderRadius:'8px',cursor:'pointer',textAlign:'center',border:build.mount===mt.id?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.mount===mt.id?T.neutral+'18':T.card,color:build.mount===mt.id?T.text:T.textSec}" @click="upBuild({mount:mt.id})"><div :style="{marginBottom:'8px',display:'flex',justifyContent:'center'}"><Icon :name="mt.id==='pendant'?'fxPendant':'fxFlush'" :size="28" :color="build.mount===mt.id?T.neutral:T.textDim"/></div><div :style="{fontSize:'13px',fontWeight:600}">{{ mt.name }}</div><div :style="{fontSize:'10px',color:T.textDim,marginTop:'6px'}">{{ mt.tip }}</div></button></div>
          <!-- bowl --><div v-else-if="curStep==='bowl'"><div v-if="freeBowls.length>0"><div :style="{fontSize:'10px',fontWeight:700,color:T.textDim,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'6px'}">{{ paidBowls.length>0?'Стандарт · входит в цену':'Выберите чашу' }}</div><div :style="{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))',gap:'6px'}"><button v-for="b in freeBowls" :key="b.id" :style="{padding:'10px 8px',borderRadius:'8px',cursor:'pointer',textAlign:'center',border:build.bowl===b.id?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.bowl===b.id?T.neutral+'18':T.card,color:build.bowl===b.id?T.text:T.textSec}" @click="upBuild({bowl:b.id})"><div :style="{fontSize:'12px',fontWeight:600}">{{ b.name }}</div></button></div></div><div v-if="paidBowls.length>0" :style="{marginTop:freeBowls.length>0?'12px':'0'}"><div :style="{fontSize:'10px',fontWeight:700,color:T.yellow,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'6px'}">С доплатой</div><div :style="{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))',gap:'6px'}"><button v-for="b in paidBowls" :key="b.id" :style="{padding:'10px 8px',borderRadius:'8px',cursor:'pointer',textAlign:'center',border:build.bowl===b.id?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.bowl===b.id?T.neutral+'18':T.card,color:build.bowl===b.id?T.text:T.textSec}" @click="upBuild({bowl:b.id})"><div :style="{fontSize:'12px',fontWeight:600}">{{ b.name }}</div><div :style="{fontSize:'11px',color:T.yellow,marginTop:'3px'}">+{{ fmt(b.price) }} ₽</div></button></div></div></div>
          <!-- temp --><div v-else-if="curStep==='temp'" :style="{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px'}"><button v-for="bt in BTEMPS" :key="bt.id" :style="{padding:'12px 6px',borderRadius:'8px',cursor:'pointer',textAlign:'center',border:build.btemp===bt.id?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.btemp===bt.id?T.neutral+'18':T.card,color:build.btemp===bt.id?T.text:T.textSec}" @click="upBuild({btemp:bt.id})"><div :style="{fontSize:'13px',fontWeight:700}">{{ bt.label }}</div><div :style="{fontSize:'11px',color:T.textDim,marginTop:'2px'}">{{ bt.kelvin }}К</div><div v-if="bt.tip" :style="{fontSize:'10px',color:T.textSec,marginTop:'6px',lineHeight:'1.3'}">{{ bt.tip }}</div></button></div>
          <!-- patrons --><div v-else-if="curStep==='patrons'"><div :style="{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(70px, 1fr))',gap:'8px'}"><button v-for="v in lampOpts()" :key="v" :style="{padding:'14px 6px',borderRadius:'10px',cursor:'pointer',textAlign:'center',border:build.lamps===v?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.lamps===v?T.neutral+'18':T.card,transition:'all .15s'}" @click="upBuild({lamps:v})"><div :style="{display:'inline-block',padding:'2px 8px',borderRadius:'4px',background:T.neutral+'22',fontSize:'11px',fontWeight:700,color:T.neutral,marginBottom:'8px'}">{{ v }} {{ spw(v) }}</div><div :style="{fontSize:'20px',fontWeight:800,color:build.lamps===v?T.yellow:T.text}">{{ fmt(Math.round(v*model.lmPer*diffMult())) }} <span :style="{fontSize:'12px',fontWeight:400,color:T.textDim}">лм</span></div><div v-if="v===model.lamps" :style="{fontSize:'10px',color:T.neutral,marginTop:'6px'}">стандарт</div><div v-if="(v-model.lamps)*model.sur>0" :style="{fontSize:'11px',color:T.yellow,marginTop:'4px',fontWeight:700}">+{{ fmt((v-model.lamps)*model.sur) }} ₽</div></button></div></div>
          <!-- diffuser --><div v-else-if="curStep==='diffuser'" :style="{display:'flex',flexDirection:'column',gap:'8px'}"><button :style="{width:'100%',padding:'14px 16px',borderRadius:'10px',cursor:'pointer',textAlign:'left',border:build.diffuser?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.diffuser?T.neutral+'12':T.cardAlt,color:T.text,display:'flex',alignItems:'center',justifyContent:'space-between'}" @click="upBuild({diffuser:true})"><div><div :style="{fontSize:'14px',fontWeight:700}">Добавить рассеиватель</div><div :style="{fontSize:'11px',color:T.textDim,marginTop:'4px'}">{{ OPT_TIPS.diffuser.on }}</div></div><span :style="{fontSize:'14px',fontWeight:700,color:T.yellow,flexShrink:0}">+{{ fmt(OPT_PRICE.diffuser) }} ₽</span></button><button :style="{width:'100%',padding:'14px 16px',borderRadius:'10px',cursor:'pointer',textAlign:'left',border:!build.diffuser?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:!build.diffuser?T.neutral+'12':T.cardAlt,color:T.textSec,fontSize:'13px'}" @click="upBuild({diffuser:false})">{{ OPT_TIPS.diffuser.off }}</button></div>
          <!-- wire --><div v-else-if="curStep==='wire'&&model.wireOpts" :style="{display:'flex',flexDirection:'column',gap:'6px'}"><button v-for="w in model.wireOpts" :key="w.id" :style="{textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',borderRadius:'8px',cursor:'pointer',border:build.wire===w.id?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.wire===w.id?T.neutral+'18':T.card,color:build.wire===w.id?T.text:T.textSec}" @click="upBuild({wire:w.id})"><div><div :style="{fontSize:'13px',fontWeight:600}">{{ w.label }}</div><div v-if="w.tip" :style="{fontSize:'10px',color:T.textDim,marginTop:'2px'}">{{ w.tip }}</div></div><span v-if="w.price>0" :style="{fontSize:'12px',fontWeight:700,color:T.yellow,flexShrink:0}">+{{ fmt(w.price) }} ₽</span><span v-else :style="{fontSize:'10px',color:T.green,flexShrink:0}">стандарт</span></button></div>
          <!-- base --><div v-else-if="curStep==='base'" :style="{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}"><button v-for="(bc,bcId) in BASE_COLORS" :key="bcId" :style="{padding:'20px 10px',borderRadius:'8px',cursor:'pointer',textAlign:'center',border:build.baseColor===bcId?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.baseColor===bcId?T.neutral+'18':T.card,color:build.baseColor===bcId?T.text:T.textSec}" @click="upBuild({baseColor:String(bcId)})"><div :style="{width:'36px',height:'36px',borderRadius:'50%',background:bc.color,margin:'0 auto 8px',border:`1px solid ${T.border}`}"/><div :style="{fontSize:'14px',fontWeight:700}">{{ bc.name }}</div></button></div>
          <!-- bulbs rotorx --><div v-else-if="curStep==='bulbs'&&model.bulbOpts" :style="{display:'flex',flexDirection:'column',gap:'6px'}"><div :style="{fontSize:'12px',color:T.textSec,marginBottom:'2px'}">Включить в комплект?</div><button v-for="bo in model.bulbOpts" :key="bo.id" :style="{textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',borderRadius:'8px',cursor:'pointer',border:build.bulbOpt===bo.id?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.bulbOpt===bo.id?T.neutral+'18':T.card,color:build.bulbOpt===bo.id?T.text:T.textSec,fontSize:'14px'}" @click="upBuild({bulbOpt:bo.id})"><span :style="{fontWeight:600}">{{ bo.label }}</span><span v-if="bo.price>0" :style="{fontWeight:700,color:T.yellow}">+{{ fmt(bo.price) }} ₽</span></button></div>
          <!-- bulbs standard --><div v-else-if="curStep==='bulbs'" :style="{display:'flex',flexDirection:'column',gap:'8px'}"><button :style="{width:'100%',padding:'14px 16px',borderRadius:'10px',cursor:'pointer',textAlign:'left',border:build.bulbs?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:build.bulbs?T.neutral+'12':T.cardAlt,color:T.text,display:'flex',alignItems:'center',justifyContent:'space-between'}" @click="upBuild({bulbs:true})"><div><div :style="{fontSize:'14px',fontWeight:700}">Да, {{ build.lamps }} {{ slw(build.lamps) }} в комплекте</div><div :style="{fontSize:'11px',color:T.textDim,marginTop:'4px'}">{{ build.lamps }} {{ spw(build.lamps) }} × {{ fmt(bulbPer()) }} ₽</div></div><span :style="{fontSize:'14px',fontWeight:700,color:T.yellow,flexShrink:0}">+{{ fmt(bulbTotal()) }} ₽</span></button><button :style="{width:'100%',padding:'14px 16px',borderRadius:'10px',cursor:'pointer',textAlign:'left',border:!build.bulbs?(isTouched?'2px solid #fff':`2px solid ${T.neutral}`):`1px solid ${T.border}`,background:!build.bulbs?T.neutral+'12':T.cardAlt,color:T.textSec,fontSize:'13px'}" @click="upBuild({bulbs:false})">Подберу свои лампочки</button></div>
        </div>
        <button :style="{width:'100%',marginTop:'14px',padding:'14px',border:'none',borderRadius:'10px',cursor:'pointer',fontWeight:700,fontSize:'14px',background:isTouched?T.text:T.neutral+'33',color:isTouched?T.bg:T.neutral}" @click="doCommit(isTouched)">{{ isTouched?'Готово':'Пропустить' }}</button>
      </template>
    </div>

    <!-- ═══════ HELP MODAL: Смарт-подбор ═══════ -->
    <div v-if="showHelp" :style="{position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'flex-end',justifyContent:'center'}" @click.self="showHelp=false">
      <div :style="{width:'100%',maxWidth:'480px',maxHeight:'92vh',overflow:'auto',background:T.bg,borderTopLeftRadius:'18px',borderTopRightRadius:'18px',borderTop:`1px solid ${T.border}`}">
        <div :style="{padding:'20px 20px 16px'}">

          <!-- Hero -->
          <div :style="{display:'flex',justifyContent:'center',padding:'20px 0 14px'}">
            <div class="rotor-hero" aria-hidden="true">
              <div v-for="i in 16" :key="i" class="rotor-hero-l" :style="{'--rot': ((i-1)/16*360)+'deg', animationDelay: ((i-1)*40)+'ms'}" />
            </div>
          </div>

          <div :style="{textAlign:'center',marginBottom:'24px'}">
            <div :style="{fontSize:'10px',fontWeight:700,color:T.neutral,letterSpacing:'1.5px',marginBottom:'8px'}">СМАРТ-ПОДБОР</div>
            <div :style="{fontSize:'22px',fontWeight:800,color:T.text,lineHeight:1.2,marginBottom:'10px'}">Как подбирается<br/>размер светильника</div>
            <div :style="{fontSize:'13px',color:T.textSec,lineHeight:1.6,maxWidth:'340px',margin:'0 auto'}">Алгоритм WOODLED сравнивает яркость всех светильников в комнате с нормой и подсказывает лучшее сочетание.</div>
          </div>

          <!-- Три фактора -->
          <div :style="{marginBottom:'24px'}">
            <div :style="{fontSize:'12px',fontWeight:700,color:T.textSec,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'10px'}">Учитываем три фактора</div>
            <div :style="{display:'flex',flexDirection:'column',gap:'8px'}">
              <div :style="{padding:'14px',background:T.card,border:`1px solid ${T.border}`,borderRadius:'12px',display:'flex',gap:'12px',alignItems:'flex-start'}">
                <div :style="{flexShrink:0,width:'36px',height:'36px',borderRadius:'10px',background:T.neutral+'22',display:'flex',alignItems:'center',justifyContent:'center'}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="T.neutral" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M14 15H9v-5"/><path d="M16 3h5v5"/><path d="M21 3 9 15"/></svg></div>
                <div :style="{flex:1}"><div :style="{fontSize:'13px',fontWeight:700,color:T.text,marginBottom:'3px'}">Площадь и норма</div><div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}">Базовая норма — 100 лм/м². Для спальни мягче, для кухни ярче. Каждая модель Rotor рассчитана на свой диапазон м².</div></div>
              </div>
              <div :style="{padding:'14px',background:T.card,border:`1px solid ${T.border}`,borderRadius:'12px',display:'flex',gap:'12px',alignItems:'flex-start'}">
                <div :style="{flexShrink:0,width:'36px',height:'36px',borderRadius:'10px',background:T.yellow+'22',display:'flex',alignItems:'center',justifyContent:'center'}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="T.yellow" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98"/><ellipse cx="12" cy="19" rx="9" ry="3"/></svg></div>
                <div :style="{flex:1}"><div :style="{fontSize:'13px',fontWeight:700,color:T.text,marginBottom:'3px'}">Все светильники в комнате</div><div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}">Спот, бра, торшер — суммируем общий свет, и на этом фоне считаем, сколько добавит выбранный Rotor.</div></div>
              </div>
              <div :style="{padding:'14px',background:T.card,border:`1px solid ${T.border}`,borderRadius:'12px',display:'flex',gap:'12px',alignItems:'flex-start'}">
                <div :style="{flexShrink:0,width:'36px',height:'36px',borderRadius:'10px',background:T.green+'22',display:'flex',alignItems:'center',justifyContent:'center'}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="T.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg></div>
                <div :style="{flex:1}"><div :style="{fontSize:'13px',fontWeight:700,color:T.text,marginBottom:'3px'}">Мебель и зоны</div><div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}">Стол, диван, кухонный гарнитур поднимают локальную норму — рабочей зоне нужно больше света, чем проходу.</div></div>
              </div>
            </div>
          </div>

          <!-- Что означают статусы -->
          <div :style="{marginBottom:'24px'}">
            <div :style="{fontSize:'12px',fontWeight:700,color:T.textSec,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'10px'}">Что означают статусы</div>
            <div :style="{display:'flex',flexDirection:'column',gap:'6px'}">
              <div v-for="row in helpStatuses" :key="row.label" :style="{padding:'10px 12px',background:T.card,border:`1px solid ${T.border}`,borderRadius:'10px',display:'flex',alignItems:'center',gap:'10px'}">
                <div :style="{padding:'4px 10px',borderRadius:'6px',background:row.color+'22',color:row.color,fontSize:'11px',fontWeight:700,whiteSpace:'nowrap',flexShrink:0,minWidth:'92px',textAlign:'center'}">{{ row.label }}</div>
                <div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.4,flex:1}">{{ row.desc }}</div>
              </div>
            </div>
          </div>

          <!-- Кнопка «Выбери за меня» -->
          <div :style="{marginBottom:'24px'}">
            <div :style="{fontSize:'12px',fontWeight:700,color:T.textSec,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'10px'}">Кнопка «Выбери за меня»</div>
            <div :style="{padding:'14px',background:T.green+'10',border:`1px solid ${T.green}33`,borderRadius:'12px'}">
              <div :style="{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}">
                <span :style="{width:'22px',height:'22px',borderRadius:'50%',background:T.green,color:T.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700}">✓</span>
                <span :style="{fontSize:'13px',fontWeight:700,color:T.green}">Доверьтесь зелёной галочке</span>
              </div>
              <div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.6}">Если несколько размеров подходят — нажмите «Выбери за меня». Алгоритм выберет самый сбалансированный: ровно столько света, сколько нужно, без переплаты за избыточный размер.</div>
            </div>
          </div>

          <!-- Когда довериться -->
          <div :style="{marginBottom:'24px'}">
            <div :style="{fontSize:'12px',fontWeight:700,color:T.textSec,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'10px'}">Когда положиться на алгоритм</div>
            <div :style="{padding:'14px',background:T.green+'10',border:`1px solid ${T.green}33`,borderRadius:'12px',marginBottom:'8px'}">
              <div :style="{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}">
                <span :style="{width:'22px',height:'22px',borderRadius:'50%',background:T.green,color:T.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700}">✓</span>
                <span :style="{fontSize:'13px',fontWeight:700,color:T.green}">Обычная комната</span>
              </div>
              <div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.6}">Типичная мебель, потолок до 2.7 м, светлые стены — рекомендация попадёт в комфортный диапазон.</div>
            </div>
            <div :style="{padding:'14px',background:T.cardAlt,border:`1px solid ${T.border}`,borderRadius:'12px'}">
              <div :style="{fontSize:'13px',fontWeight:700,color:T.text,marginBottom:'10px'}">Играйте — выбирайте и пробуйте:</div>
              <div :style="{display:'flex',flexDirection:'column',gap:'8px'}">
                <div :style="{display:'flex',gap:'8px',alignItems:'flex-start'}"><span :style="{color:T.yellow,fontSize:'14px',flexShrink:0,marginTop:'1px'}">→</span><div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}"><b :style="{color:T.text}">Высокий потолок (&gt;3 м)</b> — выберите на размер крупнее, свет расходится на больший объём</div></div>
                <div :style="{display:'flex',gap:'8px',alignItems:'flex-start'}"><span :style="{color:T.yellow,fontSize:'14px',flexShrink:0,marginTop:'1px'}">→</span><div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}"><b :style="{color:T.text}">Тёмные стены, мало окон</b> — тоже крупнее, тёмные поверхности поглощают свет</div></div>
                <div :style="{display:'flex',gap:'8px',alignItems:'flex-start'}"><span :style="{color:T.yellow,fontSize:'14px',flexShrink:0,marginTop:'1px'}">→</span><div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}"><b :style="{color:T.text}">Конкретная задача</b> (чтение, кино, готовка) — выбирайте под зону, а не под всю комнату</div></div>
                <div :style="{display:'flex',gap:'8px',alignItems:'flex-start'}"><span :style="{color:T.yellow,fontSize:'14px',flexShrink:0,marginTop:'1px'}">→</span><div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}"><b :style="{color:T.text}">Хотите минимализм</b> — возьмите компактнее, добавьте диммер для управления яркостью</div></div>
              </div>
            </div>
          </div>

          <!-- Как пользоваться — карточки-шаги -->
          <div :style="{marginBottom:'24px'}">
            <div :style="{fontSize:'12px',fontWeight:700,color:T.textSec,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'10px'}">Как пользоваться</div>
            <div :style="{display:'flex',flexDirection:'column',gap:'6px'}">
              <div :style="{padding:'12px 14px',background:T.card,border:`1px solid ${T.border}`,borderRadius:'10px',display:'flex',gap:'10px',alignItems:'flex-start'}">
                <span :style="{width:'22px',height:'22px',borderRadius:'6px',background:T.neutral+'22',color:T.neutral,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:800,flexShrink:0}">1</span>
                <div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}"><b :style="{color:T.text}">Сравните карточки</b> — каждый статус показывает, как ляжет размер именно в эту комнату.</div>
              </div>
              <div :style="{padding:'12px 14px',background:T.card,border:`1px solid ${T.border}`,borderRadius:'10px',display:'flex',gap:'10px',alignItems:'flex-start'}">
                <span :style="{width:'22px',height:'22px',borderRadius:'6px',background:T.neutral+'22',color:T.neutral,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:800,flexShrink:0}">2</span>
                <div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}"><b :style="{color:T.text}">Нажмите «Выбери за меня»</b> — если не уверены. Алгоритм подставит лучший вариант.</div>
              </div>
              <div :style="{padding:'12px 14px',background:T.card,border:`1px solid ${T.border}`,borderRadius:'10px',display:'flex',gap:'10px',alignItems:'flex-start'}">
                <span :style="{width:'22px',height:'22px',borderRadius:'6px',background:T.neutral+'22',color:T.neutral,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:800,flexShrink:0}">3</span>
                <div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}"><b :style="{color:T.text}">Подбор обновляется</b> — при любом изменении в комнате (добавление/удаление светильников) статусы пересчитываются.</div>
              </div>
              <div :style="{padding:'12px 14px',background:T.card,border:`1px solid ${T.border}`,borderRadius:'10px',display:'flex',gap:'10px',alignItems:'flex-start'}">
                <span :style="{width:'22px',height:'22px',borderRadius:'6px',background:T.neutral+'22',color:T.neutral,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:800,flexShrink:0}">4</span>
                <div :style="{fontSize:'12px',color:T.textSec,lineHeight:1.5}"><b :style="{color:T.text}">Можно менять позже</b> — зайдите в чек-лист и пересмотрите размер когда добавите другие светильники.</div>
              </div>
            </div>
          </div>

          <button :style="{width:'100%',padding:'14px',background:T.text,color:T.bg,border:'none',borderRadius:'12px',cursor:'pointer',fontSize:'14px',fontWeight:700,marginBottom:'12px'}" @click="showHelp=false">Супер!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Мини-анимация ламелей — блок совета. Висит собранным, кратко разбирается. */
.rotor-mini { width: 32px; height: 32px; position: relative; flex-shrink: 0; }
.rotor-mini-l {
  position: absolute; top: 50%; left: 50%;
  width: 2px; height: 8px; margin: -4px 0 0 -1px;
  border-radius: 1px;
  background: linear-gradient(to bottom, #d4b87a, #b4915a, #8a6e3e);
  transform-origin: 50% 50%;
  animation: rotorMiniCycle 5000ms ease-in-out infinite;
  opacity: 0;
}
@keyframes rotorMiniCycle {
  0%   { transform: rotate(var(--rot)) translateY(-22px) scale(0.3); opacity: 0; }
  5%   { transform: rotate(var(--rot)) translateY(-10px) scale(1);   opacity: 0.95; }
  80%  { transform: rotate(var(--rot)) translateY(-10px) scale(1);   opacity: 0.95; }
  90%  { transform: rotate(var(--rot)) translateY(-22px) scale(0.3); opacity: 0; }
  100% { transform: rotate(var(--rot)) translateY(-22px) scale(0.3); opacity: 0; }
}
/* Hero — модалка */
.rotor-hero { width: 100px; height: 100px; position: relative; animation: rotorHeroSpin 18s linear infinite; }
.rotor-hero-l {
  position: absolute; top: 50%; left: 50%;
  width: 3px; height: 22px; margin: -11px 0 0 -1.5px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #d4b87a, #b4915a, #8a6e3e);
  transform-origin: 50% 50%;
  animation: rotorHeroAssemble 3500ms ease-in-out infinite;
  opacity: 0;
}
@keyframes rotorHeroSpin { to { transform: rotate(360deg); } }
@keyframes rotorHeroAssemble {
  0%   { transform: rotate(var(--rot)) translateY(-70px) scale(0.4); opacity: 0; }
  20%  { transform: rotate(var(--rot)) translateY(-32px) scale(1);   opacity: 0.9; }
  70%  { transform: rotate(var(--rot)) translateY(-32px) scale(1);   opacity: 0.9; }
  85%  { transform: rotate(var(--rot)) translateY(-70px) scale(0.4); opacity: 0; }
  100% { transform: rotate(var(--rot)) translateY(-70px) scale(0.4); opacity: 0; }
}
</style>
