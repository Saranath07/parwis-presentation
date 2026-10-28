import React, {useLayoutEffect,useRef} from 'react';
import katex from 'katex';
import {rucbExampleUpper as upper,rucbExampleChampion as champion,rucbExampleChallenger as challenger,rucbExampleWins as wins,rucbExampleRound as round,publishedUpper} from './rucbRecap.js';
const letters='ABCD',colors=['#3276b1','#c75a59','#35956b','#8862ae'];
function MathLine({tex}){return <span dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{throwOnError:true})}}/>;}
const after=wins.map(row=>[...row]);after[challenger][champion]++;
const newUpper=publishedUpper(after,round+1);
const messages=[
 'Start with four items and no observed wins.',
 'At a later round, use the observed wins to calculate one confidence bound.',
 'Now calculate every entry. U_ij bounds the probability that row i beats column j.',
 'A passes every opponent: move A into the candidate set.',
 'B also passes every opponent: keep B as a candidate.',
 'C fails against A: reject C as a possible champion.',
 'D also fails against A: reject D as a possible champion.',
 'A and B are candidates. H remembers B; this random draw chooses B.',
 'Read column B. D has the largest bound—even though D is outside the candidate set.',
 'Compare B with D. In this illustrative outcome, D wins.',
 'Record D’s win; update the counts and recompute U.',
 'Repeat the same steps in the next round.',
];
function ArmArena({phase}){
 const candidatesReady=phase>=3,challenge=phase>=8;
 return <svg className="rucb-arm-arena" viewBox="0 0 500 215" role="img" aria-label={messages[phase]}>
  {candidatesReady&&!challenge&&<><rect x="25" y="110" width="250" height="93" rx="8" fill="#f8f8f8" stroke="#bbb"/><text x="150" y="139" textAnchor="middle" fontSize="19.8">Candidate set C</text><rect x="305" y="110" width="170" height="93" rx="8" fill="#fafafa" stroke="#ddd"/><text x="390" y="139" textAnchor="middle" fontSize="19.8" fill="#888">Rejected</text></>}
  {challenge&&<path d="M160 82 H370" fill="none" stroke="#111" strokeWidth="2"/>}
  {[...letters].map((label,i)=>{
   let x=65+i*122,y=phase===0?105:45;
   if(phase>=3+i){x=i<2?100+i*100:350+(i-2)*80;y=174;}
   if(phase===7&&i===1){x=160;y=60;}
   if(challenge){x=i===1?160:i===3?370:i===0?55:455;y=i===1||i===3?82:165;}
   const rejected=phase>=3+i&&i>=2;
   return <g key={label} className="rucb-moving-arm" style={{transform:`translate(${x}px,${y}px)`,opacity:challenge&&i!==1&&i!==3?.2:rejected&&!challenge?.45:1}}>
    <circle r={phase===0?28:phase===7&&i===1?26:22} fill={colors[i]}/><text y="7" textAnchor="middle" fill="white" fontSize="26.4">{label}</text>
    {phase>=7&&i===1&&<text y={phase===7?-36:52} textAnchor="middle" fontSize="19.8">Champion</text>}
    {phase===8&&i===3&&<text y="52" textAnchor="middle" fontSize="19.8">Challenger</text>}
    {phase>=9&&i===3&&<><path d="M-18-45 L-11-37 L0-51 L11-37 L18-45 L14-29 H-14 Z" fill="#efc349" stroke="#8b6818"/><text y="52" textAnchor="middle" fontSize="19.8">Wins this draw</text></>}
   </g>;
  })}
 </svg>;
}
export function RucbRecapSlide({active,step}){
 const codeRef=useRef(null),previousRects=useRef([]);
 useLayoutEffect(()=>{
  const lines=[...codeRef.current.children];
  const rects=lines.map(line=>line.getBoundingClientRect());
  const previous=previousRects.current;
  previousRects.current=rects;
  if(!active||!previous.length||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const animations=lines.map((line,i)=>{
   const from=previous[i],to=rects[i];
   if(!from||!to.width||!to.height)return null;
   return line.animate([
    {transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`},
    {transform:'none'},
   ],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'});
  });
  return()=>animations.forEach(animation=>animation?.cancel());
 },[active,step]);
 const phase=Math.max(0,Math.min(step,11)),updated=phase>=10,table=updated?newUpper:upper;
 const activeLine=phase===0?0:phase<=2?1:phase<=6?2:phase===7?3:phase===8?4:phase<=10?5:6;
 const testRow=phase>=3&&phase<=6?phase-3:-1;
 const rows=[
  <><MathLine tex={String.raw`W\gets0,\quad\mathcal H\gets\varnothing`}/><small><MathLine tex="W_{ij}"/> counts wins of <MathLine tex="i"/> over <MathLine tex="j"/>; <MathLine tex={String.raw`\mathcal H`}/> remembers a champion.</small></>,
  <><MathLine tex={String.raw`U_{ij}\gets\frac{W_{ij}}{N_{ij}}+\sqrt{\frac{\alpha\log t}{N_{ij}}}`}/><small><MathLine tex={String.raw`N_{ij}=W_{ij}+W_{ji},\quad U_{ii}=\tfrac12`}/></small></>,
  <><MathLine tex={String.raw`\mathcal C\gets\{i:\ U_{ij}\ge\tfrac12\ \forall j\}`}/><small><MathLine tex={String.raw`\mathcal H\gets\mathcal H\cap\mathcal C`}/> · Keep only plausible champions.</small></>,
  <>Choose champion <MathLine tex="c"/> from <MathLine tex={String.raw`\mathcal C,\mathcal H`}/><small>Empty <MathLine tex={String.raw`\mathcal C`}/>: choose uniformly from all arms.<br/>Singleton <MathLine tex={String.raw`\mathcal C`}/>: choose it; <MathLine tex={String.raw`\mathcal H\gets\mathcal C`}/>. <br/>Otherwise: <MathLine tex={String.raw`\mathcal H`}/> gets <MathLine tex={String.raw`\tfrac12`}/>; share the rest uniformly.<br/>Empty <MathLine tex={String.raw`\mathcal H`}/>: uniform over <MathLine tex={String.raw`\mathcal C`}/>.</small></>,
  <><MathLine tex={String.raw`d\gets\arg\max_j U_{jc}`}/><small>Use the champion’s column. Random ties; exclude <MathLine tex="c"/> from a tie.</small></>,
  <>Compare <MathLine tex="(c,d)"/> and update <MathLine tex="W"/>.</>,
  <>Repeat until <MathLine tex="T"/>; report the winner.<small>The arm beating the most opponents in the observed win fractions.</small></>,
 ];
 return <section className={`slide story-slide rucb-recap-slide guided-rucb ${active?'active':''}`} aria-label="Published RUCB algorithm recap" data-step={step} aria-hidden={!active} inert={!active}>
  <h2>RUCB: optimistically test a champion</h2>
  <div className="rucb-recap-layout">
   <div ref={codeRef} className="rucb-recap-code">{rows.map((row,i)=><div key={i} className={`rucb-recap-line ${activeLine===i?'executing':''}`}><span className="rucb-line-number">{i+1}</span>{row}</div>)}</div>
   <div className={`rucb-recap-example guided-phase-${phase}`}>
    {phase===0?<div className="rucb-example-intro"><MathLine tex={String.raw`W_{ij}=0\quad\text{for all }i,j`}/><ArmArena phase={phase}/><p>Each comparison adds one observed win.</p></div>:phase===1?<div className="rucb-single-bound">
     <h3>What does <MathLine tex="U_{DB}"/> mean?</h3>
     <svg className="rucb-bound-picture" viewBox="0 0 560 380" role="img" aria-label="D versus B: D won one of four comparisons. The observed win rate is 0.25. An uncertainty bonus of 1.17 gives an optimistic upper bound of 1.42, beyond probability one.">
      <circle cx="175" cy="42" r="29" fill={colors[3]}/><text x="175" y="51" textAnchor="middle" fill="white" fontSize="28">D</text>
      <text x="280" y="50" textAnchor="middle" fontSize="24">vs</text>
      <circle cx="385" cy="42" r="29" fill={colors[1]}/><text x="385" y="51" textAnchor="middle" fill="white" fontSize="28">B</text>
      <text x="280" y="108" textAnchor="middle" fontSize="22">Four games · winners</text>
      {['B','B','D','B'].map((letter,i)=><g key={i}><circle cx={175+i*70} cy="148" r="23" fill={letter==='D'?colors[3]:colors[1]}/><text x={175+i*70} y="156" textAnchor="middle" fill="white" fontSize="25">{letter}</text></g>)}
      <text x="280" y="208" textAnchor="middle" fontSize="25">D won 1 of 4 → 0.25</text>
      <path d="M45 300 H515" stroke="#999" strokeWidth="1.5"/>
      <path d="M45 294 V306 M192 294 V306 M339 280 V312 M486 294 V306" stroke="#999" strokeWidth="1.5"/>
      <path d="M119 300 H462" stroke={colors[3]} strokeWidth="5" strokeDasharray="9 6"/>
      <path d="M452 291 L465 300 L452 309" fill="none" stroke={colors[3]} strokeWidth="3"/>
      <circle cx="119" cy="300" r="7" fill="#111"/><circle cx="462" cy="300" r="8" fill={colors[3]}/>
      <text x="280" y="268" textAnchor="middle" fontSize="22" fill={colors[3]}>Uncertainty bonus +1.17</text>
      <text x="45" y="337" textAnchor="middle" fontSize="20">0</text><text x="339" y="337" textAnchor="middle" fontSize="20">1</text>
      <text x="119" y="337" textAnchor="middle" fontSize="22">0.25</text><text x="462" y="337" textAnchor="middle" fontSize="22" fill={colors[3]}>1.42</text>
      <text x="119" y="369" textAnchor="middle" fontSize="18">Observed</text><text x="462" y="369" textAnchor="middle" fontSize="18">Optimistic bound</text>
     </svg>
     <div className="rucb-picture-equation"><MathLine tex={String.raw`U_{DB}=\underbrace{0.25}_{\text{observed}}+\underbrace{1.17}_{\text{uncertainty}}\approx1.42`}/></div>
     <small>Upper bound for D beating B · may exceed 1</small>
    </div>:<>
     <div className="rucb-matrix-heading">Computed <MathLine tex="U"/> · <MathLine tex={`t=${round+(updated?1:0)}`}/> · <MathLine tex={String.raw`\alpha=1`}/></div>
     <table className="rucb-upper-table" aria-label="U matrix: row i beats column j"><thead><tr><th><MathLine tex={String.raw`i\downarrow\;\cdot\;j\rightarrow`}/></th>{[...letters].map((c,j)=><th key={c} className={phase>=7&&j===champion?'champion-column':''}><MathLine tex={c}/></th>)}</tr></thead><tbody>{table.map((row,i)=><tr key={i} className={`${testRow===i?'testing-row':''} ${testRow>=0&&testRow!==i?'untested-row':''}`}><th style={{color:colors[i]}}><MathLine tex={letters[i]}/></th>{row.map((u,j)=><td key={j} className={`${phase>=7&&j===champion?'champion-column':''} ${phase>=8&&i===challenger&&j===champion?'chosen-upper':''} ${testRow===i&&u<.5?'failing-upper':''}`}>{u.toFixed(2)}</td>)}</tr>)}</tbody></table>
     {testRow>=0&&<div className={`rucb-row-verdict ${testRow>=2?'reject':''}`}><MathLine tex={testRow<2?String.raw`U_{${letters[testRow]}j}\ge\tfrac12\quad\forall j\quad\checkmark`:String.raw`U_{${letters[testRow]}A}=0.39<\tfrac12\quad\times`}/></div>}
     <ArmArena phase={phase}/>
    </>}
    {phase!==1&&<p className="rucb-recap-message">{phase===2?<>Now calculate every entry. <MathLine tex="U_{ij}"/> bounds the probability that row <MathLine tex="i"/> beats column <MathLine tex="j"/>.</>:messages[phase]}</p>}
    {phase>=8&&<div className="rucb-comparison-count"><MathLine tex={updated?String.raw`N_{BD}:\ 4\to5\qquad\widehat p_{DB}:\ 0.25\to0.40`:String.raw`N_{BD}=4\qquad\widehat p_{DB}=0.25`}/></div>}
   </div>
  </div>
  <p className={`rucb-better-line ${phase>=11?'visible':''}`}>We will see an algorithm that does <strong>better</strong> than RUCB.</p>
  <p className="rucb-recap-source"><a href="https://proceedings.mlr.press/v32/zoghi14.pdf" target="_blank" rel="noreferrer">Zoghi et al., ICML 2014 · Algorithm 1</a> · α &gt; ½; zero-denominator fractions use x/0 := 1.<br/>{phase===0?'The algorithm starts with zero counts.':'The later-round example uses one possible history of 244 comparisons; H remembers B.'} The lecture animation uses the simplified rule.</p>
 </section>;
}
