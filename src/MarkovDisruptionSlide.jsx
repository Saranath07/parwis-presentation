import React from 'react';
import katex from 'katex';
function Math({tex}) {return <div className="markov-math" dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{displayMode:true,throwOnError:true})}}/>;}
export function MarkovDisruptionSlide({active,step}) {
 return <section className={`slide story-slide markov-disruption-slide ${active?'active':''} ${step>=1?'markov-split':''}`} aria-label="Markov chain disruption explained" aria-hidden={!active} inert={!active} data-step={step}>
  <h2>Markov-chain disruption</h2>
  <div className="markov-definition">
   <h3>Results become transition probabilities</h3>
   <p>Probability flows toward items that win.</p>
   <svg className="markov-flow" viewBox="0 0 500 120" role="img" aria-label="Schematic probability mass flowing from a losing item to a winning item">
    <path id="markov-mass-path" d="M120 60 H380" stroke="#aaa" strokeWidth="2" fill="none"/>
    <path d="M365 51 L380 60 L365 69" stroke="#aaa" strokeWidth="2" fill="none"/>
    <circle cx="90" cy="60" r="29" fill="#3276b1"/><text x="90" y="68" textAnchor="middle" fill="white" fontSize="28.6">a</text>
    <circle cx="410" cy="60" r="29" fill="#8862ae"/><text x="410" y="68" textAnchor="middle" fill="white" fontSize="28.6">b</text>
    <text x="250" y="28" textAnchor="middle" fontSize="23.1">b beat a</text>
    {active&&<circle r="7" fill="#111"><animateMotion dur="2.4s" repeatCount="indefinite" path="M120 60 H380"/></circle>}
    <text x="250" y="109" textAnchor="middle" fontSize="19.8">schematic flow · stronger items accumulate more mass</text>
   </svg>
   <Math tex={String.raw`Q_{ab}(S)=\begin{cases}\widehat p_{ba}/d_{\max},&a\ne b,\\1-\displaystyle\sum_{c\ne a}Q_{ac}(S),&a=b.\end{cases}`}/>
   <Math tex={String.raw`\widehat p_{ba}=\frac{\#(b\text{ beats }a)}{\#(a\text{ plays }b)}`}/>
   <p className="markov-definition-note">Rows sum to 1; the diagonal retains the rest.</p>
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
  <p className="markov-explanation-source">PARWiS · Algorithm 1, §IV-A/C & Appendix. Uncompared pairs have zero empirical probability; d<sub>max</sub>: maximum comparison-graph degree.<br/>The paper adds a phantom item with one win and one loss per real item. The score uses a stationarity residual, not the full gradient of a squared-residual loss.</p>
 </section>;
}
