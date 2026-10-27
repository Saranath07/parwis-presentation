import React from 'react';
import katex from 'katex';
function Math({tex}) {return <div className="markov-math" dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{displayMode:true,throwOnError:true})}}/>;}
export function MarkovDisruptionSlide({active,step}) {
 return <section className={`slide story-slide markov-disruption-slide ${active?'active':''} ${step>=1?'markov-split':''}`} aria-label="Markov chain disruption explained" aria-hidden={!active} inert={!active} data-step={step}>
  <h2>Markov-chain disruption</h2>
  <div className="markov-definition">
   <h3>Comparisons become a graph</h3>
   <p>Follow the probability mass leaving item A.</p>
   <svg className="markov-transition-graph" viewBox="0 0 520 280" role="img" aria-label="Illustrative row of Q: from A, three eighths goes to B, one eighth goes to C, and one half stays at A. B beat A in three of four comparisons; C beat A in one of four. Maximum degree is two.">
    <defs><marker id="markov-graph-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="context-stroke" strokeWidth="1.4"/></marker></defs>
    <path d="M145 115 Q265 28 385 55" fill="none" stroke="#8862ae" strokeWidth="3" markerEnd="url(#markov-graph-arrow)"/>
    <path d="M145 150 Q265 235 385 218" fill="none" stroke="#35956b" strokeWidth="3" markerEnd="url(#markov-graph-arrow)"/>
    <path d="M93 107 C5 25 5 238 93 154" fill="none" stroke="#3276b1" strokeWidth="3" markerEnd="url(#markov-graph-arrow)"/>
    <path d="M420 86 V187" fill="none" stroke="#ccc" strokeDasharray="5 6" strokeWidth="2"/>
    <text x="280" y="22" textAnchor="middle" fontSize="23">B beat A in 3 of 4 games</text>
    <text x="265" y="83" textAnchor="middle" fontSize="30" fill="#8862ae">3/8</text>
    <text x="270" y="204" textAnchor="middle" fontSize="30" fill="#35956b">1/8</text>
    <text x="280" y="270" textAnchor="middle" fontSize="23">C beat A in 1 of 4 games</text>
    <text x="55" y="241" textAnchor="middle" fontSize="25" fill="#3276b1">Stay: 1/2</text>
    {[[115,132,'#3276b1','A'],[420,55,'#8862ae','B'],[420,218,'#35956b','C']].map(([x,y,color,label])=><g key={label}><circle cx={x} cy={y} r="32" fill={color}/><text x={x} y={y+10} textAnchor="middle" fill="white" fontSize="30">{label}</text></g>)}
    {active&&<g className="markov-travelling-mass"><circle r="6" fill="#8862ae"><animateMotion dur="2.8s" repeatCount="indefinite" path="M145 115 Q265 28 385 55"/></circle><circle r="6" fill="#35956b"><animateMotion dur="2.8s" repeatCount="indefinite" path="M145 150 Q265 235 385 218"/></circle><circle r="6" fill="#3276b1"><animateMotion dur="2.8s" repeatCount="indefinite" path="M93 107 C5 25 5 238 93 154"/></circle></g>}
   </svg>
   <Math tex={step>=1?String.raw`Q_{AB}=\frac38`:String.raw`Q_{AB}=\underbrace{\frac12}_{1/d_{\max}}\times\underbrace{\frac34}_{B\text{ beats }A}=\frac38`}/>
   <p className="markov-definition-note">Outgoing probabilities add up to 1.</p>
  </div>
  <div className={`markov-local-push ${step>=1?'visible':''}`} aria-hidden={step<1}>
   <h3>One answer changes the chain</h3>
   <Math tex={String.raw`\underbrace{\pi^\top Q(S)=\pi^\top}_{\text{current estimate is stationary}}`}/>
   <Math tex={String.raw`S\longrightarrow S_{ij}^{y}\longrightarrow Q_{ij}^{y}=Q(S_{ij}^{y})`}/>
   <div className="markov-push-reveal"><span>Keep the current estimate. Apply the new chain once.</span>
    <Math tex={String.raw`\pi_{y}^{+\top}=\pi^\top Q_{ij}^{y}`}/>
    <Math tex={String.raw`r_y=\pi^\top-\pi^\top Q_{ij}^{y}=\pi^\top-\pi_{y}^{+\top}`}/>
   </div>
   <p>The size of this one-step push is <strong>the Markov analogue of gradient length.</strong></p>
  </div>
  <div className={`markov-expected-score ${step>=2?'visible':''}`} aria-hidden={step<2}>
   <Math tex={String.raw`d_{\mathrm{Markov}}^S(i,j)=p_{ij}\|r_1\|_2+(1-p_{ij})\|r_0\|_2`}/>
   <p>Two possible answers. Weight each push by its probability.</p>
  </div>
  <p className="markov-explanation-source">PARWiS · Algorithm 1, §IV-A/C & Appendix. Illustrative three-item graph; only A’s outgoing transitions are shown. Here d<sub>max</sub> = 2.<br/>The paper adds a phantom item with one win and one loss per real item. The score uses a stationarity residual, not the full gradient of a squared-residual loss.</p>
 </section>;
}
