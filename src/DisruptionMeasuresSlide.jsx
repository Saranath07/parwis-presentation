import React from 'react';
import katex from 'katex';
function Formula({tex,className=''}) { return <div className={`measure-formula ${className}`} dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{displayMode:true,throwOnError:true})}} />; }
const measures=[
  {name:'Exact update',subtitle:'Re-estimate after each possible outcome',objective:String.raw`(\pi_{ij}^{y})^\top Q(S_{ij}^{y})=(\pi_{ij}^{y})^\top`,score:String.raw`d_{\mathrm{exact}}^S(i,j)=p_{ij}\|\pi-\pi_{ij}^{1}\|_2+(1-p_{ij})\|\pi-\pi_{ij}^{0}\|_2`,note:'Same spectral estimator; no separate loss f.'},
  {name:'Log likelihood',subtitle:'BTL log likelihood',objective:String.raw`f^{\mathrm{LogL}}(\theta;S)=\sum_{(a,b)\in E(S)}\!\left[N_{ab}^{1}\log p_{ab}+N_{ab}^{0}\log(1-p_{ab})\right]`,score:String.raw`d_{f^{\mathrm{LogL}}}^{S}(i,j)=2\sqrt{2}\,\frac{\pi_i\pi_j}{\pi_i+\pi_j}`,note:'The paper’s closed form at a fitted likelihood optimum.'},
  {name:'Least squares',subtitle:'Fit log strengths to empirical log odds',objective:String.raw`f^{\mathrm{LS}}(\theta;S)=\sum_{(a,b)\in E(S)}\!\left[(\theta_a-\theta_b)-\log\frac{N_{ab}^{1}}{N_{ab}^{0}}\right]^2`,score:String.raw`d_{f^{\mathrm{LS}}}^{S}(i,j)=\frac{2\sqrt{2}}{\pi_i+\pi_j}\!\left[\pi_i\log\!\left(1+\frac1{N_{ij}^{1}}\right)+\pi_j\log\!\left(1+\frac1{N_{ij}^{0}}\right)\right]`,note:'Final logarithmic expression, before the paper’s approximation.'},
  {name:'Markov chain',subtitle:'Stationarity objective',objective:String.raw`f^{\mathrm{Markov}}:\quad\text{find }\pi\text{ such that }\pi^\top Q(S)=\pi^\top`,score:String.raw`\begin{aligned}d_{f^{\mathrm{Markov}}}^{S}(i,j)={}&p_{ij}\|\pi^\top-\pi^\top Q_{ij}^{1}\|_2\\&+(1-p_{ij})\|\pi^\top-\pi^\top Q_{ij}^{0}\|_2\end{aligned}`,note:'Expected stationarity residual, evaluated at the current π.'},
];
export function DisruptionMeasuresSlide({active,step}) {
  return <section className={`slide story-slide disruption-measures-slide ${active?'active':''}`} aria-label="Four disruption measures from the paper" aria-hidden={!active} inert={!active} data-step={step}>
    <h2>Four ways to measure disruption</h2>
    <Formula className="measure-notation" tex={String.raw`p_{ij}=\frac{\pi_i}{\pi_i+\pi_j},\quad\theta_i=\log\pi_i,\quad S_{ij}^{y}=S\cup\{(i,j,y)\}`} />
    <div className="disruption-measures-grid">
      {measures.map((measure,index)=><article key={measure.name} className={`disruption-measure-card ${step>=index?'revealed':''} ${step===index?'current-measure':''}`} aria-hidden={step<index}>
        <div className="measure-card-heading"><span className="measure-number">0{index+1}</span><h3>{measure.name}</h3></div>
        <p className="measure-subtitle">{measure.subtitle}</p>
        <div className="measure-objective"><Formula tex={measure.objective} /></div>
        <div className="measure-score"><Formula tex={measure.score} /></div>
        <p className="measure-note">{measure.note}</p>
      </article>)}
    </div>
    <p className="measures-source">PARWiS · §IV-C, Theorem 2 & Appendix. N¹ / N⁰ count the two outcomes; E(S) contains observed pairs.<br/>LS uses the paper’s fitted-objective assumption. Add-one count regularization avoids zero counts in implementation.</p>
  </section>;
}
