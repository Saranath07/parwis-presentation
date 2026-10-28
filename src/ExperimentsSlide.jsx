import React,{useState} from 'react';
import katex from 'katex';
const datasets=[{key:'synthetic',name:'Synthetic',detail:'n = 25 in the main figures',type:'scores'}, {key:'jester',name:'Jester Joke',detail:'Real user ratings of jokes',type:'joke'}, {key:'netflix',name:'Netflix Prize',detail:'100 most-rated movies',type:'movie'}];
const measureLegend=[['Markov','#f00'],['Least squares','#00f'],['Exact','#999'],['Log likelihood','#a55335'],['Random vs top','#e6ad00'],['Random pair','#ef00ef'],['SELECT','#008000']];
const baselineLegend=[['PARWiS','#f00'],['SELECT','#008000'],['Multisort','#ef00ef'],['AR','#00f'],['RUCB','#ff8000'],['SECS','#a55335']];
function MathText({tex}){return <span dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{throwOnError:true})}}/>;}
function DatasetIcon({type}){return <svg viewBox="0 0 180 120" aria-hidden="true">
 {type==='scores'?<g fill="none" stroke="#111" strokeWidth="3"><path d="M20 100 H160 M20 100 V20"/>{[100,70,55,37].map((v,i)=><rect key={i} x={35+i*29} y={100-v*.7} width="17" height={v*.7} fill={i===0?'#111':'#ddd'}/>)}</g>:type==='joke'?<g fill="none" stroke="#111" strokeWidth="3"><circle cx="90" cy="58" r="43"/><path d="M64 45 Q71 37 78 45 M102 45 Q109 37 116 45 M64 66 Q90 99 116 66 Z"/><path d="M130 17 L141 8 M140 31 L155 30"/></g>:<g fill="none" stroke="#111" strokeWidth="3"><path d="M35 44 H148 V103 H35 Z M35 42 L30 22 L140 5 L145 25 Z" fill="#f2f2f2"/><path d="M50 19 L64 37 M80 14 L95 32 M110 10 L125 28"/><path d="M83 60 L108 75 L83 90 Z" fill="#111"/></g>}
 </svg>;}
function Legend({items}){return <div className="experiment-legend">{items.map(([name,color])=><span key={name}><i style={{background:color}}/>{name}</span>)}</div>;}
function Plot({kind,dataset,metric,title}){return <figure className="paper-experiment-plot"><figcaption>{title||dataset.name}</figcaption><img src={`${import.meta.env.BASE_URL}experiments/${kind}-${dataset.key}-${metric}.png`} alt={`${title||dataset.name}: original ${metric==='recovery'?'winner recovery':metric==='reported'?'true rank of reported winner':'reported rank of true winner'} versus comparison budget plot from Figure ${kind==='measures'?2:3} of the PARWiS paper.`}/><span className="plot-x-axis">Comparison budget B</span></figure>;}
export function ExperimentsSlide({active,step}){
 const [selected,setSelected]=useState('jester');const dataset=datasets.find(d=>d.key===selected);const intro=step===0,quality=step>=3;
 return <section className={`slide story-slide experiments-slide ${active?'active':''}`} aria-label="Experiments reported in the PARWiS paper" aria-hidden={!active} inert={!active} data-step={step}>
  <h2>{intro?'Experiments: synthetic and real data':step===1?'Which disruption measure works best?':step===2?'Does PARWiS recover the winner more often?':'How good is the reported ranking?'}</h2>
  <div className="experiment-content" key={step}>
   {intro?<>
    <div className="experiment-dataset-cards">{datasets.map(d=><article key={d.key}><DatasetIcon type={d.type}/><h3>{d.name}</h3><p>{d.detail}</p>{d.key==='synthetic'?<div className="synthetic-setup"><MathText tex={String.raw`\pi_\star=100,\quad \pi_i\sim U[0,75]`}/><small>Also tested: n = 10 and 50 · 10 independent runs</small></div>:<p className="dataset-pipeline">{d.key==='jester'?'Joke ratings':'Movie ratings'} → pairwise probabilities<br/>→ fitted BTL scores → comparisons</p>}</article>)}</div>
    <p className="experiment-other-data">Also evaluated: <strong>Sushi-A · Sushi-B · MovieLens</strong> <span>Appendix figures</span></p>
    <div className="experiment-metric-intro"><span><strong>Recovery fraction ↑</strong>Find the actual winner</span><span><strong>True rank of reported winner ↓</strong>How good is our answer?</span><span><strong>Reported rank of true winner ↓</strong>Where did the winner end up?</span></div>
   </>:quality?<>
    <div className="experiment-dataset-tabs" role="group" aria-label="Choose dataset for ranking plots">{datasets.map(d=><button key={d.key} className={selected===d.key?'selected':''} aria-pressed={selected===d.key} onClick={()=>setSelected(d.key)}>{d.name}</button>)}</div>
    <Legend items={baselineLegend}/>
    <div className="experiment-quality-plots"><Plot kind="baselines" dataset={dataset} metric="reported" title="True rank of the reported winner ↓"/><Plot kind="baselines" dataset={dataset} metric="true" title="Reported rank of the true winner ↓"/></div>
    <p className="experiment-takeaway">Lower is better. Recovery is only one view of the final estimate.</p>
   </>:<>
    <p className="experiment-metric-label">Recovery fraction (%) ↑ <span>Higher is better</span></p>
    <Legend items={step===1?measureLegend:baselineLegend}/>
    <div className="experiment-recovery-plots">{datasets.map(d=><Plot key={d.key} kind={step===1?'measures':'baselines'} dataset={d} metric="recovery"/>)}</div>
    <p className="experiment-takeaway">{step===1?<><strong>Markov</strong> is best overall in the paper; <strong>least squares</strong> is close.</>:<>PARWiS reports higher recovery in these experiments, especially at small budgets.</>}</p>
   </>}
  </div>
  <p className="experiment-source">{intro?'PARWiS · §V-D/E':step===1?'Original plots: Figure 2 · PARWiS': 'Original plots: Figure 3 · PARWiS'}<br/>{intro?'Real datasets are converted to an approximate BTL model; the experiments use the fitted scores.':'Plots reproduced directly from the paper; real-data results use fitted BTL scores.'}</p>
 </section>;
}
