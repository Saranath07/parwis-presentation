import React from 'react';
import katex from 'katex';
import {rucbExampleUpper as upper,rucbExampleCandidates as candidates,rucbExampleChampion as champion,rucbExampleChallenger as challenger,rucbExampleWins as wins,rucbExampleRound as round,publishedUpper} from './rucbRecap.js';
const letters='ABCD',colors=['#3276b1','#c75a59','#35956b','#8862ae'];
function MathLine({tex}){return <span dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{throwOnError:true})}}/>;}
const after=wins.map(row=>[...row]);after[challenger][champion]++;
const newUpper=publishedUpper(after,round+1);
const messages=['One possible A–D history. Recompute confidence bounds every round.','Uᵢⱼ is an optimistic estimate that i beats j; it can exceed 1.','Only A and B pass every opponent in their row.','Remembered champion: B. With C = {A, B}, each is selected with probability ½. This draw selects B.','Read column B. D has the largest upper bound against B.','Compare B vs D. In this illustrative outcome, D wins.','Record D’s win, then recompute U in the next round.'];
export function RucbRecapSlide({active,step}){
 const phase=Math.max(0,Math.min(step,6)),updated=phase>=6,table=updated?newUpper:upper;
 const rows=[
  <><MathLine tex={String.raw`W\gets0,\quad\mathcal H\gets\varnothing;\quad\alpha>\tfrac12`}/><small>Wᵢⱼ counts wins of i over j; H remembers a champion.</small></>,
  <><MathLine tex={String.raw`U_{ij}\gets\frac{W_{ij}}{N_{ij}}+\sqrt{\frac{\alpha\log t}{N_{ij}}},\quad U_{ii}=\tfrac12`}/><small><MathLine tex={String.raw`N_{ij}=W_{ij}+W_{ji}`}/></small></>,
  <><MathLine tex={String.raw`\mathcal C\gets\{i:\ U_{ij}\ge\tfrac12\ \forall j\};\quad\mathcal H\gets\mathcal H\cap\mathcal C`}/></>,
  <>Choose champion <MathLine tex="c"/> using <MathLine tex={String.raw`\mathcal C,\mathcal H`}/><small>Empty C: uniform over all arms. Singleton C: choose it; H ← C.<br/>Otherwise: H gets probability ½; share the rest uniformly.<br/>If H is empty, sample uniformly from C.</small></>,
  <><MathLine tex={String.raw`d\gets\arg\max_j U_{jc}`}/><small>Random ties; exclude c from a tie when possible.</small></>,
  <>Compare <MathLine tex="(c,d)"/>; increment the winner’s entry in <MathLine tex="W"/>.</>,
  <>Repeat. At horizon <MathLine tex="T"/>, report the arm that<br/>beats the most opponents empirically.</>,
 ];
 return <section className={`slide story-slide rucb-recap-slide ${active?'active':''}`} aria-label="Published RUCB algorithm recap" data-step={step} aria-hidden={!active} inert={!active}>
  <h2>RUCB: optimistically test a champion</h2>
  <div className="rucb-recap-layout">
   <div className="rucb-recap-code">{rows.map((row,i)=><div key={i} className={`rucb-recap-line ${phase===i?'executing':''}`}><span className="rucb-line-number">{i+1}</span>{row}</div>)}</div>
   <div className="rucb-recap-example">
    <div className="rucb-matrix-heading">A–D example · α = 1 · t = {round+(updated?1:0)}</div>
    <table className="rucb-upper-table" aria-label="Optimistic probability matrix U: rows are winners, columns opponents"><thead><tr><th>Uᵢⱼ</th>{[...letters].map((c,j)=><th key={c} className={phase>=3&&j===champion?'champion-column':''}>{c}</th>)}</tr></thead><tbody>{table.map((row,i)=><tr key={i} className={phase>=2&&candidates.includes(i)?'candidate-row':''}><th style={{color:colors[i]}}>{letters[i]}</th>{row.map((u,j)=><td key={j} className={`${phase>=3&&j===champion?'champion-column':''} ${phase>=4&&i===challenger&&j===champion?'chosen-upper':''} ${phase>=2&&u<.5?'ruled-out':''}`}>{u.toFixed(2)}</td>)}</tr>)}</tbody></table>
    <div className="rucb-candidate-summary">{phase>=2?<>Plausible champions: <strong>{'{A, B}'}</strong></>:'Read a row to test a candidate.'}</div>
    <svg className="rucb-four-arms" viewBox="0 0 500 155" role="img" aria-label={phase>=4?'B challenges D; D wins this illustrative comparison.':'Four arms A, B, C, D'}>
     {phase>=4&&<path d="M180 65 H405" stroke="#111" strokeWidth="2"/>}
     {[...letters].map((label,i)=><g key={label} transform={`translate(${65+i*122} 65)`} opacity={phase>=3&&i!==champion&&!(phase>=4&&i===challenger)?.3:1}>
      <circle r="22" fill={colors[i]}/><text y="7" textAnchor="middle" fill="white" fontSize="24">{label}</text>
      {phase>=3&&i===champion&&<text y="55" textAnchor="middle" fontSize="18">Champion</text>}
      {phase===4&&i===challenger&&<text y="55" textAnchor="middle" fontSize="18">Challenger</text>}
      {phase>=5&&i===challenger&&<><path d="M-18-45 L-11-37 L0-51 L11-37 L18-45 L14-29 H-14 Z" fill="#efc349" stroke="#8b6818"/><text y="55" textAnchor="middle" fontSize="18">Wins this draw</text></>}
     </g>)}
    </svg>
    <p className="rucb-recap-message">{messages[phase]}</p>
    {phase>=4&&<div className="rucb-comparison-count"><MathLine tex={updated?String.raw`N_{BD}:\ 4\to5\qquad\widehat p_{DB}:\ 0.25\to0.40`:String.raw`N_{BD}:\ 4\qquad\widehat p_{DB}:\ 0.25`}/></div>}
   </div>
  </div>
  <p className={`rucb-better-line ${phase>=6?'visible':''}`}>We will see an algorithm that does <strong>better</strong> than RUCB.</p>
  <p className="rucb-recap-source"><a href="https://proceedings.mlr.press/v32/zoghi14.pdf" target="_blank" rel="noreferrer">Zoghi et al., ICML 2014 · Algorithm 1</a>. Original RUCB; the preceding lecture animation uses the course’s simplified rule.<br/>Zero denominators use the paper’s x/0 := 1 convention in each fraction. The displayed history and outcome are illustrative.</p>
 </section>;
}
