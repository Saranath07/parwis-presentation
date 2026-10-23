import React, {useEffect, useState} from 'react';
import katex from 'katex';

function MathLine({tex, className = ''}) {
  return <div className={`story-math ${className}`} dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{displayMode:true,throwOnError:true,strict:'error'})}} />;
}
function DoodlePerson({color, side, talking, agreed}) {
  return <svg className={`doodle-person ${talking ? 'talking' : ''}`} viewBox="0 0 220 250" role="img" aria-label={side === 'left' ? 'Srividhya advocating bandits' : 'Me advocating active ranking'}>
    <path d="M70 158 Q110 138 150 158 L163 237 H57 Z" fill={color} stroke="#000" strokeWidth="2.5" />
    <path d={agreed ? 'M72 169 L38 127 L27 136 M148 169 L182 127 L193 136' : side === 'left' ? 'M72 169 L40 193 L25 172 M148 169 L185 146 L194 156' : 'M72 169 L40 146 L26 157 M148 169 L180 193 L195 172'} fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
    <g className="doodle-head">
      <circle cx="110" cy="95" r="52" fill="white" stroke="#000" strokeWidth="3" />
      <path d="M65 77 Q75 25 119 43 Q150 32 158 77" fill={color} stroke="#000" strokeWidth="2.5" />
      <circle cx="93" cy="94" r="4" fill="#000" /><circle cx="126" cy="94" r="4" fill="#000" />
      <path d={agreed ? 'M85 79 L101 79 M118 79 L135 79' : 'M84 75 L101 80 M118 80 L136 74'} stroke="#000" strokeWidth="2.5" />
      <path d={agreed ? 'M90 114 Q110 139 131 113' : 'M94 120 Q111 110 128 120'} fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>;
}
function Show({visible, children, className=''}) {
  return <div className={`story-reveal ${visible ? 'visible' : ''} ${className}`} aria-hidden={!visible}>{children}</div>;
}

export function StoryTimeSlide({active, step}) {
  return <section className={`story-slide slide ${active ? 'active' : ''} ${step >= 4 ? 'story-agreed' : ''}`} aria-label="Story time: choosing our paper" data-step={step} aria-hidden={!active} inert={!active}>
    <h2>Story time</h2>
    <p className="story-subtitle">Two teammates. Two interests. One presentation.</p>
    <div className="comic-scene" aria-hidden={step >= 4}>
      <div className="comic-person">
        <Show visible={step >= 1 && step < 3} className="speech-bubble">“Let’s do bandits.”</Show>
        <DoodlePerson side="left" color="#3276b1" talking={active && step === 1} agreed={step >= 3} />
        <span className="comic-label">Srividhya</span>
      </div>
      <div className="comic-person">
        <Show visible={step >= 2 && step < 3} className="speech-bubble">“Let’s do active ranking.”</Show>
        <DoodlePerson side="right" color="#8862ae" talking={active && step === 2} agreed={step >= 3} />
        <span className="comic-label">Me</span>
      </div>
      <Show visible={step >= 3 && step < 4} className="shared-bubble">“Let’s pick something we can explain<br />before the presentation ends.”</Show>
    </div>
    <Show visible={step >= 4} className="paper-agreement">
      <p className="agreement-factors">Interests · difficulty · presentation format · presenting later</p>
      <div className="favourite-paper"><span>WE FINALLY AGREED ON</span><strong>PARWiS</strong></div>
      <p className="paper-joke">We couldn’t agree on a paper from the list.<br />So naturally, we chose one outside it.</p>
    </Show>
  </section>;
}

export function LastComparisonSlide({active, step}) {
  return <section className={`story-slide comparison-story slide ${active ? 'active' : ''}`} aria-label="One more comparison: challenge our current favourite" data-step={step} aria-hidden={!active} inert={!active}>
    <h2>We finally agreed. Are we sure?</h2>
    <p className="story-subtitle">Time for just <strong>one</strong> more comparison.</p>
    <div className="favourite-anchor"><span>OUR CURRENT FAVOURITE</span><strong>PARWiS</strong></div>
    <div className="challenger-options">
      <div className="challenger-option">
        <div className="comparison-connector" aria-hidden="true" />
        <h3>A familiar paper</h3>
        <img className="challenger-paper-preview" src={`${import.meta.env.BASE_URL}papers/wisdom-first-page.png`} alt="First page of WiSDoM: Frugal Winner Selection by Design of Matchups"/>
        <p className="challenger-paper-title">WiSDoM</p>
        <Show visible={step >= 1} className="challenger-paper-details"><p>Saranath P · Arun Rajkumar</p><p>Uncertainty in Data Mining Workshop<br/>KDD 2026</p></Show>
      </div>
      <div className="challenger-option">
        <div className="comparison-connector" aria-hidden="true" />
        <h3>An overlooked paper</h3>
        <img className="challenger-paper-preview" src={`${import.meta.env.BASE_URL}papers/just-sort-it-first-page.png`} alt="First page of Just Sort It! A Simple and Effective Approach to Active Preference Learning"/>
        <p className="challenger-paper-title" title="A Simple and Effective Approach to Active Preference Learning">Just Sort It!</p>
        <Show visible={step >= 1} className="challenger-paper-details"><p>Lucas Maystre · Matthias Grossglauser</p><p><a href="https://proceedings.mlr.press/v70/maystre17a.html" target="_blank" rel="noreferrer">ICML 2017</a></p></Show>
      </div>
    </div>
    <Show visible={step >= 2} className="challenger-question">Which comparison could shake our judgement the most?</Show>
    <Show visible={step >= 3} className="challenger-answer">Consider <strong>both possible outcomes</strong>—and how likely each is.</Show>
  </section>;
}

function LossSurface({opposite=false, playing}) {
  const [phase, setPhase] = useState(.8);
  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(.8);
      return;
    }
    let frame;
    let start;
    const animate = time => {
      if (start === undefined) start = time;
      setPhase(((time-start) % 5200) / 5200);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  const ease = value => {const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
  const centre = opposite ? [-1.25,1.4] : [1.9,-.9];
  const shift = ease(phase/.2);
  const amount = .7*ease((phase-.27)/.43);
  const loss = (u,v) => .14*((u-centre[0]*shift)**2+(v-centre[1]*shift)**2);
  const project = (u,v) => [300+52*u-36*v, 195+16*u+15*v-42*loss(u,v)];
  const path = points => points.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
  const lines = Array.from({length:15},(_,i)=>-2.5+i*5/14);
  const samples = Array.from({length:41},(_,i)=>-2.5+i/8);
  const startPoint=project(0,0);
  const dot=project(centre[0]*amount,centre[1]*amount);
  const destination=project(centre[0]*.7,centre[1]*.7);
  const trail=Array.from({length:31},(_,i)=>project(centre[0]*amount*i/30,centre[1]*amount*i/30));
  const color=opposite?'#8862ae':'#3276b1';
  const opacity=Math.min(1,phase/.06,(1-phase)/.07);
  const status=phase<.25?'One new outcome changes the loss.':phase<.72?'Take a local step from the same θ.':'Measure the strength of that local push.';
  return <div className="loss-surface-animation" data-phase={phase.toFixed(3)}>
    <svg viewBox="0 0 600 350" className="loss-surface" role="img" aria-label={`Illustrative generic loss surface for ${opposite?'j':'i'} winning. The loss changes, then a point moves from the current theta along one descent step. This is a schematic, not a fitted data example.`}>
      <g opacity={Math.max(0,opacity)}>
        <g className="surface-mesh">{lines.map((fixed,i)=><React.Fragment key={i}>
          <path d={path(samples.map(v=>project(fixed,v)))} />
          <path d={path(samples.map(u=>project(u,fixed)))} />
        </React.Fragment>)}</g>
        <path d="M65 275 V165 M59 175 L65 165 L71 175" className="surface-loss-axis" />
        <text x="49" y="153" fontSize="23">L(θ)</text>
        <circle cx={destination[0]} cy={destination[1]} r="5" fill="white" stroke={color} strokeWidth="1.5" opacity={shift} />
        <path d={path(trail)} fill="none" stroke={color} strokeWidth="3.3" strokeLinecap="round" />
        <circle cx={startPoint[0]} cy={startPoint[1]} r="5" fill="#000" />
        <text x={startPoint[0]-16} y={startPoint[1]-14} fontSize="24">θ</text>
        <circle className="moving-theta" cx={dot[0]} cy={dot[1]} r="8" fill={color} stroke="white" strokeWidth="2" />
        {amount>.2&&<text x={dot[0]+(opposite?-27:16)} y={dot[1]+28} fontSize="23" fill={color}>θ⁺</text>}
      </g>
      <text x="300" y="330" textAnchor="middle" fontSize="20">{status}</text>
    </svg>
  </div>;
}

export function BothOutcomesSlide({active, step}) {
  const split=step>=1;
  return <section className={`story-slide outcomes-story animated-outcomes slide ${active?'active':''} ${split?'outcomes-split':''}`} aria-label="Disruption: average the local push from both outcomes" data-step={step} aria-hidden={!active} inert={!active}>
    <h2>One comparison. Two possible answers.</h2>
    <p className="story-subtitle">Same current estimate <span className="theta-symbol">θ</span>. Same pair <span className="theta-symbol">(i, j)</span>.</p>
    <div className="animated-branches">
      <div className="animated-outcome outcome-i">
        <h3>If <span className="theta-symbol">i</span> wins</h3>
        <Show visible={step>=2} className="animated-probability"><MathLine tex={String.raw`p_{ij}`} /></Show>
        <LossSurface playing={active} />
        <p>How strongly does this answer push us to revise <span className="theta-symbol">θ</span>?</p>
        <MathLine tex={String.raw`g_1=\nabla_\theta f(\theta;S\cup\{i\succ j\})`} />
      </div>
      <div className={`animated-outcome outcome-j ${split?'visible':''}`} aria-hidden={!split}>
        <h3>If <span className="theta-symbol">j</span> wins</h3>
        <Show visible={step>=2} className="animated-probability"><MathLine tex={String.raw`1-p_{ij}`} /></Show>
        <LossSurface opposite playing={active&&split} />
        <p>How strongly does this answer push us to revise <span className="theta-symbol">θ</span>?</p>
        <MathLine tex={String.raw`g_0=\nabla_\theta f(\theta;S\cup\{j\succ i\})`} />
      </div>
    </div>
    <Show visible={step>=2} className="expected-push">
      <MathLine tex={String.raw`d_f^S(i,j)=p_{ij}\,\|g_1\|_2+(1-p_{ij})\,\|g_0\|_2`} />
      <p><strong>Disruption</strong>: the expected strength of the local push to revise our estimate.</p>
    </Show>
    <p className="surface-caption">Illustrative generic loss · one local descent step with a common step size · not a full re-optimization.</p>
  </section>;
}
