import React,{useEffect,useState} from 'react';
import katex from 'katex';
import {netflixMovies,netflixRatings,netflixWeights,exampleRatingDifference,exampleWinProbability,netflixPaperRecovery,netflixPaperRanks} from './netflixExample.js';
function MathLine({tex}){return <div className="netflix-equation" dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{displayMode:true,throwOnError:true})}}/>;}
function Movie({index,score=false}){const m=netflixMovies[index];return <div className="netflix-movie"><img className="netflix-cover" src={`${import.meta.env.BASE_URL}netflix/${m.posterFile}`} alt={`${m.title} theatrical release poster`}/><h3>{m.title}</h3><p>{score?`BTL score ${(100*netflixWeights[index]).toFixed(1)}`:m.year}</p></div>;}

function NetflixSigmoid({playing}) {
 const [difference,setDifference]=useState(1);
 useEffect(()=>{if(!playing||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;let frame,start;const tick=time=>{if(start===undefined)start=time;setDifference(4*Math.sin((time-start)/8500*2*Math.PI+.25));frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[playing]);
 const probability=1/(1+Math.exp(-difference)),x=v=>45+(v+4)/8*330,y=p=>190-p*165;
 const path=Array.from({length:129},(_,k)=>{const v=-4+k/16;return `${k?'L':'M'}${x(v)},${y(1/(1+Math.exp(-v)))}`;}).join(' ');
 return <svg className="netflix-moving-sigmoid" viewBox="0 0 420 255" role="img" aria-label={`Logistic function: mean rating difference ${difference.toFixed(2)}, win probability ${probability.toFixed(2)}`}>
  <path d="M45 15 V190 H390" fill="none" stroke="#777"/>
  <path d="M45 107.5 H375 M210 25 V190" fill="none" stroke="#ddd" strokeDasharray="4 5"/>
  <path d={path} fill="none" stroke="#b9090b" strokeWidth="3"/>
  <path d={`M45 ${y(probability)} H${x(difference)} V190`} fill="none" stroke="#b9090b" opacity=".45" strokeDasharray="4 4"/>
  <circle cx={x(difference)} cy={y(probability)} r="7" fill="#b9090b"/>
  {[0,.5,1].map(p=><text key={p} x="34" y={y(p)+5} textAnchor="end" fontSize="17.6">{p}</text>)}
  {[-4,-2,0,2,4].map(v=><text key={v} x={x(v)} y="215" textAnchor="middle" fontSize="17.6">{v}</text>)}
  <text x="210" y="248" textAnchor="middle" fontSize="19.8">Δ = {difference.toFixed(2)} · σ(Δ) = {probability.toFixed(2)}</text>
 </svg>;
}
function NetflixPipeline({step,active}) {
 return <div className={`netflix-model-flow staged-model-flow pipeline-stage-${step}`}>
  <article className={`model-rating-panel ${step>=2?'model-parked-left':''}`}>
   <span className="netflix-flow-number">1</span><h3>Rating differences</h3><div className="mini-pair"><Movie index={0}/><Movie index={2}/></div>
   <MathLine tex={String.raw`\Delta_{ij}=\operatorname{mean}_{u}(r_{ui}-r_{uj})`}/>
   <div className="netflix-rating-definition"><MathLine tex={String.raw`r_{ui}:\text{ user }u\text{'s rating of movie }i`}/><MathLine tex={String.raw`r_{uj}:\text{ the same user's rating of movie }j`}/></div>
   <p className="netflix-rating-example">U01: Nayakan 5, Anbe Sivam 3 → difference 2.</p><small>Average over users who rated both. Here: {exampleRatingDifference.toFixed(1)}.</small>
  </article>
  <article className={`model-probability-panel ${step>=2?'model-panel-visible':''} ${step>=3?'model-parked-right':''}`} aria-hidden={step<2}>
   <span className="netflix-flow-number">2</span><h3>Pairwise probabilities</h3><NetflixSigmoid playing={active&&step>=2}/>
   <MathLine tex={String.raw`\widehat P_{ij}=\sigma(\Delta_{ij})`}/><p>Convert the mean difference with a logistic function.</p><small>For our example: σ(1) ≈ {exampleWinProbability.toFixed(2)}</small>
  </article>
  <article className={`model-fit-panel ${step>=3?'model-panel-visible':''}`} aria-hidden={step<3}>
   <span className="netflix-flow-number">3</span><h3>Fit BTL scores</h3><div className="netflix-score-bars">{netflixMovies.map((m,i)=><div key={m.title}><span>{m.title}</span><i style={{width:`${netflixWeights[i]*150}%`,animationDelay:`${i*110}ms`}}/><strong>{(netflixWeights[i]*100).toFixed(1)}</strong></div>)}</div>
   <p>Fit one global score vector using spectral ranking.</p><MathLine tex={String.raw`P_{ij}^{\mathrm{BTL}}=\frac{w_i}{w_i+w_j}`}/><small>These fitted scores define the experimental winner.</small>
  </article>
 </div>;
}

function RecoveryChart(){const {budgets,parwis,rucb}=netflixPaperRecovery;const x=b=>85+(b-100)/600*680,y=v=>335-v/20*280;
 return <svg className="netflix-recovery-chart" viewBox="0 0 860 420" role="img" aria-label="Netflix recovery fraction versus budget, approximately digitized from the paper: PARWiS rises from about 5 to 17 percent; RUCB from about 3 to 7 percent.">
  {[0,5,10,15,20].map(v=><g key={v}><path d={`M85 ${y(v)} H765`} stroke="#ddd"/><text x="65" y={y(v)+6} textAnchor="end" fontSize="26">{v}</text></g>)}
  <path d="M85 45 V335 H765" fill="none" stroke="#555"/>
  <text x="85" y="25" fontSize="24.2">Winner recovery (%) ↑</text>
  {budgets.map(b=><text key={b} x={x(b)} y="366" textAnchor="middle" fontSize="26">{b}</text>)}
  <text x="425" y="408" textAnchor="middle" fontSize="28">Comparison budget B</text>
  {[[parwis,'#b9090b','PARWiS'],[rucb,'#b36818','RUCB']].map(([values,color,name])=><g key={name}><polyline className="netflix-result-line" points={values.map((v,i)=>`${x(budgets[i])},${y(v)}`).join(' ')} fill="none" stroke={color} strokeWidth="4"/>{values.map((v,i)=><circle key={i} cx={x(budgets[i])} cy={y(v)} r="5" fill={color}/>)}<text x="786" y={y(values.at(-1))+6} fontSize="26" fill={color}>{name}</text></g>)}
 </svg>;
}

function ResultLegend(){return <div className="netflix-results-legend"><span>● PARWiS</span><span>● RUCB</span></div>;}
function RecoveryResults(){return <div className="netflix-recovery-view">
 <div className="netflix-recovery-definition"><MathLine tex={String.raw`\operatorname{Recovery}(B)=\frac1R\sum\nolimits_{r=1}^{R}\mathbf 1\!\left\{\widehat i_r(B)=i^\star\right\}`}/><p><MathInline tex="R"/> independent runs · <MathInline tex="i^\star"/>: true winner · <MathInline tex={String.raw`\widehat i_r(B)`}/>: winner returned in run <MathInline tex="r"/>. The plot shows this fraction × 100%.</p></div>
 <div className="netflix-results"><div className="netflix-results-plot"><ResultLegend/><RecoveryChart/></div><aside><span className="netflix-result-kicker">Netflix Prize · 100 movies</span><p>At <strong>B = 700</strong> comparisons:</p><div className="netflix-number-result"><span>PARWiS</span><strong>≈17%</strong></div><div className="netflix-number-result rucb"><span>RUCB</span><strong>≈7%</strong></div><p className="netflix-result-limit">Higher is better; both remain below 20%.</p></aside></div>
 </div>;}
function MathInline({tex}){return <span dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{throwOnError:true})}}/>;}
function RankChart({metric}){
 const {budgets}=netflixPaperRanks,series=netflixPaperRanks[metric],low=metric==='reported'?0:20,high=metric==='reported'?50:45;
 const ticks=metric==='reported'?[0,10,20,30,40,50]:[20,25,30,35,40,45];
 const x=b=>72+(b-100)/600*490,y=v=>300-(v-low)/(high-low)*250;
 return <svg className="netflix-rank-chart" viewBox="0 0 620 380" role="img" aria-label={`${metric==='reported'?'True rank of the reported winner':'Reported rank of the true winner'} on Netflix, approximate means from Figure 3; PARWiS and RUCB only`}>
  {ticks.map(v=><g key={v}><path d={`M72 ${y(v)} H562`} stroke="#ddd"/><text x="56" y={y(v)+7} textAnchor="end" fontSize="23">{v}</text></g>)}
  <path d="M72 50 V300 H562" fill="none" stroke="#555"/><text x="72" y="29" fontSize="24">Mean rank ↓</text>
  {budgets.map(b=><text key={b} x={x(b)} y="330" textAnchor="middle" fontSize="23">{b}</text>)}
  <text x="315" y="373" textAnchor="middle" fontSize="25">Comparison budget B</text>
  {[[series.parwis,'#b9090b','PARWiS'],[series.rucb,'#b36818','RUCB']].map(([values,color,name])=><g key={name}><polyline points={values.map((v,i)=>`${x(budgets[i])},${y(v)}`).join(' ')} fill="none" stroke={color} strokeWidth="4"/>{values.map((v,i)=><circle key={i} cx={x(budgets[i])} cy={y(v)} r="5" fill={color}/>)}</g>)}
 </svg>;
}
function RankingResults(){return <div className="netflix-ranking-view"><ResultLegend/><div className="netflix-rank-grid">
 <figure><figcaption>True rank of the reported winner</figcaption><p>How good is the movie we chose?</p><RankChart metric="reported"/></figure>
 <figure><figcaption>Reported rank of the true winner</figcaption><p>Where did the best movie end up?</p><RankChart metric="true"/></figure>
 </div><p className="netflix-rank-takeaway">Lower is better. PARWiS has lower mean ranks in this Netflix experiment.</p></div>;}
export function NetflixSlide({active,step}){
 const [trial,setTrial]=useState(0),[draw,setDraw]=useState(.24);
 useEffect(()=>{if(!active||step!==4)return;setTrial(0);setDraw(Math.random());if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const t=setInterval(()=>{setTrial(v=>v+1);setDraw(Math.random());},2500);return()=>clearInterval(t);},[active,step]);
 const firstWins=draw<exampleWinProbability;const outcome=firstWins?0:2;
 const title=step===0?'What do the movie ratings look like?':step<=3?'From ratings to a comparison model':step===4?'The model becomes a noisy game oracle':step===5?'Netflix: PARWiS versus RUCB':'Netflix: how good is the reported ranking?';
 const tab=step===0?0:step<=3?1:step===4?2:3;
 return <section className={`slide netflix-slide ${active?'active':''}`} aria-label="Netflix dataset and PARWiS versus RUCB" aria-hidden={!active} inert={!active} data-step={step}>
  <header className="netflix-retro-header"><img src={`${import.meta.env.BASE_URL}netflix/netflix-2001.svg`} alt="Historical Netflix logo"/><span>Movie ratings. Pairwise games. One winner.</span></header>
  <div className="netflix-retro-tabs" aria-hidden="true">{['Browse Movies','Your Ratings','Comparison Model','Results'].map((label,i)=><span key={label} className={i===tab?'selected':''}>{label}</span>)}</div>
  <h2>{title}</h2>
  <div className="netflix-scene" key={step>=1&&step<=3?'pipeline':step}>
   {step===0?<>
    <div className="netflix-catalogue"><div className="netflix-shelf">{netflixMovies.map((_,i)=><Movie key={i} index={i}/>)}</div><p className="netflix-example-label">Tamil titles and ratings below are an illustrative example.</p></div>
    <div className="netflix-ratings"><h3>What a ratings dataset contains</h3><table><thead><tr><th>User</th>{netflixMovies.map(m=><th key={m.title}>{m.title}</th>)}</tr></thead><tbody>{netflixRatings.map((row,i)=><tr key={i}><th>U0{i+1}</th>{row.map((v,j)=><td key={j}>{v}<span className="rating-star">★</span></td>)}</tr>)}</tbody></table><p>Each record: user · movie · rating (1–5) · date</p><strong>Paper: keep the 100 most-rated movies.</strong></div>
   </>:step>=1&&step<=3?<NetflixPipeline step={step} active={active}/>:step===4?<div className="netflix-oracle"><div style={{'--poster-scale':1}} className={`netflix-oracle-movie ${firstWins?'oracle-winner':''}`}><Movie index={0} score/><p className="netflix-poster-probability">{(100*exampleWinProbability).toFixed(0)}%<span>chance of winning</span></p>{firstWins&&<span className="netflix-outcome-badge">Wins this draw</span>}</div><div className="netflix-oracle-center"><span className="netflix-query-tag">PARWiS or RUCB chooses a pair</span><h3>“Compare these two movies.”</h3><MathLine tex={String.raw`Y\sim\operatorname{Bernoulli}\!\left(\frac{w_i}{w_i+w_j}\right)`}/><div key={trial} className="netflix-oracle-output">Outcome {trial+1}: <strong>{netflixMovies[outcome].title}</strong> wins</div><p className="netflix-oracle-caption">The same pair can produce different answers.<br/>Each answer spends one comparison from B.</p></div><div style={{'--poster-scale':Math.sqrt((1-exampleWinProbability)/exampleWinProbability)}} className={`netflix-oracle-movie ${!firstWins?'oracle-winner':''}`}><Movie index={2} score/><p className="netflix-poster-probability">{(100*(1-exampleWinProbability)).toFixed(0)}%<span>chance of winning</span></p>{!firstWins&&<span className="netflix-outcome-badge">Wins this draw</span>}</div></div>:step===5?<RecoveryResults/>:<RankingResults/>}
  </div>
  <footer className="netflix-footnote">{step>=5?<><strong>PARWiS · Figure 3 · Netflix Prize.</strong> Approximate means digitized from the paper; original error bars omitted. Not new runs. <a href={`${import.meta.env.BASE_URL}experiments/baselines-netflix-${step===5?'recovery':'reported'}.png`} target="_blank" rel="noreferrer">Original plot</a>.</>:<>Paper’s pipeline: PARWiS §V-E and authors’ <a href="https://github.com/DevSheth/active-ranking-under-shoe-string-budget/blob/master/datasets/netflix.py" target="_blank" rel="noreferrer">Netflix preprocessing</a>. Tamil films, ratings and draws are illustrative; the reported experiment uses its own fitted BTL model.</>}</footer>
 </section>;
}
