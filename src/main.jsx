import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './style.css';
import {sigmoid, knockoutMatches, makeDuellingTrace} from './lectureAnimations.js';
import {StoryTimeSlide, LastComparisonSlide, BothOutcomesSlide} from './StorySlides.jsx';
import {ChessSelectionSlide} from './ChessSelectionSlide.jsx';
import {AlgorithmSlide} from './AlgorithmSlide.jsx';
import {DisruptionMeasuresSlide} from './DisruptionMeasuresSlide.jsx';
import {ExperimentsSlide} from './ExperimentsSlide.jsx';
import {NetflixSlide} from './NetflixSlide.jsx';
import {RucbRecapSlide} from './RucbRecapSlide.jsx';
import {walkthroughFrames} from './parwisWalkthrough.js';
const MEASURES_START = 44 + walkthroughFrames.length;
const EXPERIMENTS_START = MEASURES_START + 4;
const NETFLIX_START = EXPERIMENTS_START + 1;
const RESULTS_START = NETFLIX_START + 6;
const LAST_STAGE = RESULTS_START + 3;

function OpeningSlide({active}) {

  return (
    <section className={`title-slide slide ${active ? 'active' : ''}`} aria-label="Opening slide" aria-hidden={!active} inert={!active}>
      <h1>
        <span className="paper-name">PARWiS:</span>
        <span>Winner determination from Active</span>
        <span>Pairwise Comparisons under a Shoestring Budget</span>
      </h1>
      <section className="authors" aria-label="Paper authors">
        <p>Dev Yashpal Sheth and Arun Rajkumar</p>
        <p className="venue">ICDM 2021</p>
      </section>
      <section className="presenters" aria-label="Presenters">
        <p className="presenter-label">Presented by</p>
        <p>Saranath P</p>
        <p>Srividhya Sethuraman</p>
      </section>
      <section className="course-details" aria-label="Course">
        <p>DA5453 · Learning from Human Preferences</p>
        <p className="course-instructor">Prof. Suryanarayana Sankagiri</p>
      </section>
    </section>
  );
}

function Player({x, y, color}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g fill={color}>
        <circle cx="0" cy="-40" r="19" />
        <path d="M-19-12 Q-35-10-39 9 L-49 49 Q-51 58-43 60 Q-35 62-32 53 L-22 22 L-22 65 L-25 107 Q-25 117-15 117 Q-6 117-5 108 L0 70 L5 108 Q6 117 15 117 Q25 117 25 107 L22 65 L22 22 L32 53 Q35 62 43 60 Q51 58 49 49 L39 9 Q35-10 19-12 Z" />
      </g>
    </g>
  );
}

function ProblemSlide({active, revealed, noisy}) {
  return (
    <section className={`problem-slide slide ${active ? 'active' : ''} ${revealed ? 'revealed' : ''} ${noisy ? 'noisy' : ''}`} aria-label="Problem statement" aria-hidden={!active} inert={!active}>
      <h2>Problem statement</h2>
      <div className="problem-content">
        <svg className="players-diagram" viewBox="0 0 560 520" role="img" aria-label={revealed ? 'Four players. The blue and red players are selected to play against each other.' : 'Four players, colored blue, red, green, and purple.'}>
          <g className={`matchup ${revealed ? 'visible' : ''}`}>
            <path className="matchup-line" d="M208 136 H352" />
            <rect x="254" y="114" width="52" height="44" fill="white" />
            <text x="280" y="144" textAnchor="middle">vs</text>
          </g>
          <Player x={140} y={120} color="#3276b1" />
          <Player x={420} y={120} color="#c75a59" />
          <Player x={140} y={365} color="#35956b" />
          <Player x={420} y={365} color="#8862ae" />
        </svg>
        <div className="question-area">
          <div className="question-stack">
            <p className="main-question">Which is the best item<br className="desktop-break" /> in this group?</p>
            <p className="follow-up" aria-hidden={!revealed}>If you have control on<br className="desktop-break" /> whom to play next?</p>
            <p className="noise-note" aria-hidden={!noisy}>Comparisons can be noisy.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Equation({tex, className = ''}) {
  return <div className={`equation ${className}`} dangerouslySetInnerHTML={{__html: katex.renderToString(tex, {displayMode: true, throwOnError: true, strict: 'error'})}} />;
}

const itemColors = ['#3276b1', '#c75a59', '#35956b', '#8862ae'];
function ItemNode({x, y, index, radius = 17}) {
  return <g>
    <circle cx={x} cy={y} r={radius} fill={itemColors[index]} />
    <text x={x} y={y + 6} textAnchor="middle" fill="white" fontSize="19">{'ABCD'[index]}</text>
  </g>;
}

function useLoopTick(playing, interval) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!playing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setTick(0);
    const timer = window.setInterval(() => setTick(value => value + 1), interval);
    return () => window.clearInterval(timer);
  }, [playing, interval]);
  return tick;
}

function KnockoutVisual({playing}) {
  const tick = useLoopTick(playing, 470);
  const frame = tick % 22;
  const matchIndex = Math.min(2, Math.floor(frame / 7));
  const match = knockoutMatches[matchIndex];
  const count = Math.min(5, frame % 7);
  const complete = frame >= 20;
  const firstAdvanced = frame >= 6;
  const secondAdvanced = frame >= 13;
  const votes = complete ? knockoutMatches[2].votes : match.votes.slice(0, count);
  const pair = complete ? knockoutMatches[2].pair : match.pair;
  const leftWins = votes.filter(winner => winner === pair[0]).length;
  const rightWins = votes.length - leftWins;
  const positions = [[65, 35], [185, 35], [315, 35], [435, 35]];
  const selected = matchIndex === 2 ? [[125, 112], [375, 112]] : match.pair.map(i => positions[i]);
  return (
    <figure className="algorithm-figure" data-tick={tick}>
      <figcaption>Noisy knockout tournament</figcaption>
      <svg viewBox="0 0 500 330" role="img" aria-label={`Illustrative noisy tournament. ${'ABCD'[pair[0]]} versus ${'ABCD'[pair[1]]}: ${leftWins} to ${rightWins} from ${votes.length} comparisons. ${complete ? 'D wins the tournament; the example will restart.' : 'Repeated votes determine the majority winner.'}`}>
        <g className="bracket-lines"><path d="M65 45 V77 H125 V112 M185 45 V77 H125 M315 45 V77 H375 V112 M435 45 V77 H375 M125 112 V149 H250 V197 M375 112 V149 H250" /></g>
        {!complete && selected.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="25" className="active-item-ring" />)}
        {[65,185,315,435].map((x, index) => <ItemNode key={index} x={x} y={35} index={index} />)}
        {firstAdvanced && <ItemNode x={125} y={112} index={0} />}
        {secondAdvanced && <ItemNode x={375} y={112} index={3} />}
        {complete && <><ItemNode x={250} y={197} index={3} /><text x="285" y="204" fontSize="19">Winner</text></>}
        <text x="250" y="242" textAnchor="middle" className="match-status">{complete ? 'Majority winners advance → restart' : `${'ABCD'[pair[0]]} vs ${'ABCD'[pair[1]]} · comparison ${votes.length} / 5`}</text>
        {Array.from({length: 5}, (_, i) => <circle key={i} cx={190+i*30} cy="270" r="9" fill={votes[i] === undefined ? 'white' : itemColors[votes[i]]} stroke={votes[i] === undefined ? '#bbb' : itemColors[votes[i]]} />)}
        <text x="250" y="300" textAnchor="middle" fontSize="23">{'ABCD'[pair[0]]}: {leftWins}　 {'ABCD'[pair[1]]}: {rightWins}</text>
        <text x="250" y="326" textAnchor="middle" className="algorithm-caption">Illustrative votes · five comparisons per match</text>
      </svg>
    </figure>
  );
}

const duellingTrace = makeDuellingTrace();
function DuellingVisual({playing}) {
  const tick = useLoopTick(playing, 800);
  const record = duellingTrace[Math.floor(tick / 4) % duellingTrace.length];
  const phase = tick % 4;
  const positions = [[130, 48], [370, 48], [130, 172], [370, 172]];
  const c = positions[record.champion], d = positions[record.challenger];
  const current = phase === 3 ? record.after : record.before;
  const phases = ['Choose champion', 'Choose challenger', 'Play the comparison', 'Update estimates'];
  return (
    <figure className="algorithm-figure" data-tick={tick} data-phase={phase}>
      <figcaption>Duelling bandits (RUCB)</figcaption>
      <svg viewBox="0 0 500 330" role="img" aria-label={`Illustrative RUCB round ${record.round}. ${phases[phase]}. Champion ${'ABCD'[record.champion]}, challenger ${'ABCD'[record.challenger]}.`}>
        <g className="duel-edges"><path d="M130 48 H370 V172 H130 Z M370 48 L130 172 M130 48 L370 172" /></g>
        {phase >= 1 && <line x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} stroke="#000" strokeWidth="2.5" />}
        <circle cx={c[0]} cy={c[1]} r="27" className="active-item-ring" />
        {phase >= 1 && <circle cx={d[0]} cy={d[1]} r="27" className="challenger-ring" />}
        {positions.map(([x,y], index) => <ItemNode key={index} x={x} y={y} index={index} />)}
        <text x={c[0]} y={c[1]-38} textAnchor="middle" fontSize="18">Champion</text>
        {phase >= 1 && <text x={d[0]} y={d[1]+45} textAnchor="middle" fontSize="18">Challenger</text>}
        <text x="250" y="242" textAnchor="middle" className="match-status">{phases[phase]}</text>
        {phase === 2 ? <text x="250" y="277" textAnchor="middle" fontSize="25" fill={itemColors[record.winner]}>{'ABCD'[record.winner]} wins</text> : <text x="250" y="277" textAnchor="middle" fontSize="23">{phase === 0 ? `Champion: ${'ABCD'[record.champion]}` : `${'ABCD'[record.champion]} vs ${'ABCD'[record.challenger]}　 N = ${current.n}${phase === 3 ? '  ↑' : ''}`}</text>}
        <text x="250" y="305" textAnchor="middle" fontSize="18">{phase === 3 ? `Empirical win fraction: ${(current.wins / Math.max(1, current.n)).toFixed(2)}` : `Round ${record.round}`}</text>
        <text x="250" y="329" textAnchor="middle" className="algorithm-caption">Illustrative run of the lecture’s simplified RUCB</text>
      </svg>
    </figure>
  );
}

function BTLAnimation({playing}) {
  const [difference, setDifference] = useState(-5);
  useEffect(() => {
    if (!playing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame;
    let start;
    function animate(time) {
      if (start === undefined) start = time;
      setDifference(-5 * Math.cos(2 * Math.PI * (time-start) / 10000));
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  const x = value => 70 + (value+5)*46;
  const y = value => 243 - value*208;
  const probability = sigmoid(difference);
  const path = Array.from({length: 161}, (_,i) => {
    const value = -5+i/16;
    return `${i ? 'L' : 'M'}${x(value)},${y(sigmoid(value))}`;
  }).join(' ');
  return (
    <>
      <svg className="btl-animation" viewBox="0 0 600 310" role="img" aria-label={`BTL sigmoid: log strength difference ${difference.toFixed(2)}, win probability ${probability.toFixed(2)}. A ball moves continuously along the curve.`}>
        <path d="M70 25 V243 H555" className="sigmoid-axis" />
        <path d="M70 139 H530 M300 35 V243" className="sigmoid-grid" />
        {[0,.5,1].map(value => <text key={value} x="53" y={y(value)+6} textAnchor="end" fontSize="18">{value}</text>)}
        {[-4,-2,0,2,4].map(value => <text key={value} x={x(value)} y="266" textAnchor="middle" fontSize="18">{value}</text>)}
        <text x="24" y="17" fontSize="21">p<tspan baselineShift="sub" fontSize="14">ij</tspan></text>
        <path d={path} className="sigmoid-curve" />
        <path d={`M${x(difference)} 243 V${y(probability)} H70`} className="sigmoid-projection" />
        <circle className="sigmoid-ball" cx={x(difference)} cy={y(probability)} r="9" fill={itemColors[0]} />
        <text x="300" y="301" textAnchor="middle" fontSize="22">θᵢ − θⱼ = {difference.toFixed(2)}　 pᵢⱼ = {probability.toFixed(2)}</text>
      </svg>
      <Equation className="sigmoid-equation" tex={String.raw`p_{ij}=\sigma(\theta_i-\theta_j),\qquad\theta_i=\log w_i`} />
    </>
  );
}

function SetupVisuals({reveal}) {
  const setupColors=['#3276b1','#c75a59','#35956b','#8862ae','#db7d25','#159ca6','#ca5790','#b29a20','#526273','#875138'];
  return <>
    <div className={`formal-setup-items ${reveal>=1?'setup-parked-left':''} ${reveal>=3?'setup-dismissed':''}`} aria-hidden={reveal>=3}>
      <h3>N items</h3>
      <svg viewBox="0 0 440 250" role="img" aria-label="A collection of N items with unknown strengths">
        {setupColors.map((color,index)=><g key={color} transform={`translate(${55+(index%5)*82} ${45+Math.floor(index/5)*110})`}><g className="setup-item-arrival" style={{animationDelay:`${index*60}ms`}}><g transform="scale(.45)"><Player x={0} y={0} color={color}/></g></g></g>)}
        <text x="220" y="240" textAnchor="middle" fontSize="32">…</text>
      </svg>
      <Equation tex={String.raw`\mathcal I=\{1,\ldots,N\}`} />
      <p>Unknown strengths <span className="setup-inline-math">wᵢ &gt; 0</span></p>
    </div>
    <div className={`formal-setup-budget ${reveal>=1?'setup-visible':''} ${reveal>=2?'setup-parked-right':''} ${reveal>=3?'setup-dismissed':''}`} aria-hidden={reveal<1||reveal>=3}>
      <h3>A budget of B games</h3>
      <svg viewBox="0 0 440 250" role="img" aria-label="B comparison tokens; one token pays for one game between a chosen pair">
        {[0,1,2,3,4].map(i=><g key={i} className="setup-budget-token" style={{animationDelay:`${i*120}ms`}}>
          <rect x={30+i*76} y="50" width="66" height="90" rx="9" fill={i%2?'#eee':'#fff'} stroke="#111" strokeWidth="2"/>
          <circle cx={63+i*76} cy="79" r="8" fill="#111"/><path d={`M${57+i*76} 90 L${53+i*76} 109 H${73+i*76} L${69+i*76} 90 Z M${50+i*76} 110 H${76+i*76} V117 H${50+i*76} Z`} fill="#111"/>
        </g>)}
        <path d="M40 157 V168 H400 V157" fill="none" stroke="#999" strokeWidth="2"/>
        <text x="220" y="205" textAnchor="middle" fontSize="34">B tokens</text>
      </svg>
      <Equation tex={String.raw`1\text{ game}=1\text{ pairwise comparison}`} />
      <p>Choose the pair. Spend one token.</p>
    </div>
  </>;
}

function ModellingSlide({active, step: reveal, bridgeOnly = false}) {
  const step = reveal - 2;
  return (
    <section className={`modelling-slide slide ${bridgeOnly ? 'bridge-slide' : ''} ${active ? 'active' : ''} ${step >= 7 ? 'bridge-active' : ''} ${step >= 9 ? 'uncertainty-revealed' : ''}`} aria-label="BTL modelling and lecture recap" data-step={step} aria-hidden={!active} inert={!active}>
      <h2 aria-hidden={step >= 7}>{reveal<=2?'Active ranking: the setup':'Modelling noisy comparisons'}</h2>
      <div className={`modelling-stage ${reveal<=2?'formal-setup-stage':''}`}>
        <SetupVisuals reveal={reveal} />
        <div className={`btl-block ${reveal<2?'setup-btl-hidden':''} ${step >= 1 ? 'at-top' : ''}`} aria-hidden={reveal<2||step >= 7}>
          <h3>BTL assumption</h3>
          <Equation tex={String.raw`p_{ij}=\Pr(i\succ j)=\frac{w_i}{w_i+w_j}`} />
          <div className={`btl-animation-wrapper ${step >= 1 ? 'disappeared' : ''}`} aria-hidden={step >= 1}>
            <BTLAnimation playing={active && step === 0} />
          </div>
        </div>
        <p className={`lecture-intro ${step >= 1 ? 'visible' : ''}`} aria-hidden={step < 1 || step >= 7}>From the lectures</p>
        <div className={`algorithm-panel knockout-panel ${step >= 2 ? 'visible' : ''} ${step >= 3 ? 'parked-left' : ''}`} aria-hidden={step < 2 || step >= 7}>
          <KnockoutVisual playing={active && step >= 2} />
        </div>
        <div className={`algorithm-panel duelling-panel ${step >= 4 ? 'visible' : ''} ${step >= 5 ? 'parked-right' : ''}`} aria-hidden={step < 4 || step >= 7}>
          <DuellingVisual playing={active && step >= 4} />
        </div>
        <div className={`better-claim ${step >= 7 ? 'visible' : ''}`} aria-hidden={step < 7}>
          <p className="claim-reframed" aria-hidden={step < 7}>What do we mean by “<strong>better</strong>”?</p>
        </div>
        <p className={`recovery-question bridge-text ${step >= 8 ? 'visible' : ''}`} aria-hidden={step < 8}>Can we identify the winner with fewer comparisons?</p>
        <p className={`uncertainty-question bridge-text ${step >= 9 ? 'visible' : ''}`} aria-hidden={step < 9}>Given what we know, which pair would reduce uncertainty most?</p>
        <p className={`disruption-introduction bridge-text ${step >= 10 ? 'visible' : ''}`} aria-hidden={step < 10}>PARWiS uses a criterion called <strong>disruption</strong>.</p>
      </div>
    </section>
  );
}

function App() {
  const [stage, setStage] = useState(0);
  const slideNumber = stage === 0 ? 1 : stage <= 3 ? 2 : stage <= 11 ? 3 : stage <= 23 ? 4 : stage <= 27 ? 5 : stage <= 32 ? 6 : stage <= 36 ? 7 : stage <= 39 ? 8 : stage <= 43 ? 9 : stage < MEASURES_START ? 10 : stage < EXPERIMENTS_START ? 11 : stage < NETFLIX_START ? 12 : stage < RESULTS_START ? 13 : stage < LAST_STAGE ? 14 : 15;
  const next = () => setStage(value => Math.min(LAST_STAGE, value + 1));
  const previous = () => setStage(value => Math.max(0, value - 1));

  useEffect(() => {
    async function handleKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey ||
          event.target.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;

      if (['ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
        setStage(value => Math.min(LAST_STAGE, value + 1));
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setStage(value => Math.max(0, value - 1));
      } else if (event.key.toLowerCase() === 'f' && !event.repeat) {
        event.preventDefault();
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
          else await document.documentElement.requestFullscreen();
        } catch (error) {
          console.error('Could not toggle fullscreen:', error);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="presentation">
      <OpeningSlide active={stage === 0} />
      <ProblemSlide active={stage >= 1 && stage <= 3} revealed={stage >= 2} noisy={stage >= 3} />
      <ModellingSlide active={stage >= 4 && stage <= 11} step={Math.max(0, Math.min(stage - 4, 7))} />
      <ModellingSlide bridgeOnly active={stage >= 24 && stage <= 27} step={Math.max(9, Math.min(stage - 15, 12))} />
      <RucbRecapSlide active={stage >= 12 && stage <= 23} step={stage - 12} />
      <StoryTimeSlide active={stage >= 28 && stage <= 32} step={stage - 28} />
      <LastComparisonSlide active={stage >= 33 && stage <= 36} step={stage - 33} />
      <BothOutcomesSlide active={stage >= 37 && stage <= 39} step={stage - 37} />
      <ChessSelectionSlide active={stage >= 40 && stage <= 43} step={stage - 40} />
      <AlgorithmSlide active={stage >= 44 && stage < MEASURES_START} step={stage - 44} />
      <DisruptionMeasuresSlide active={stage >= MEASURES_START && stage < EXPERIMENTS_START} step={stage - MEASURES_START} />
      <ExperimentsSlide active={stage === EXPERIMENTS_START || (stage >= RESULTS_START && stage < LAST_STAGE)} step={stage === EXPERIMENTS_START ? 0 : stage - RESULTS_START + 1} />
      <NetflixSlide active={stage >= NETFLIX_START && stage < RESULTS_START} step={stage - NETFLIX_START} />
      <section className={`slide questions-slide ${stage === LAST_STAGE ? 'active' : ''}`} aria-label="Questions" aria-hidden={stage !== LAST_STAGE} inert={stage !== LAST_STAGE}>
        <h2>Questions?</h2>
        <p className="questions-presenters">Saranath P &amp; Srividhya Sethuraman</p>
        <p className="questions-paper">PARWiS · ICDM 2021</p>
      </section>
      <div className="presentation-page-number" aria-label={`Slide ${slideNumber} of 15`}>{slideNumber} / 15</div>
      <nav className="slide-controls" aria-label="Presentation navigation">
        <button onClick={previous} disabled={stage === 0} aria-label="Previous reveal or slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12 H5 M11 6 L5 12 L11 18" /></svg>
        </button>
        <button onClick={next} disabled={stage >= LAST_STAGE} aria-label="Next reveal or slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12 H19 M13 6 L19 12 L13 18" /></svg>
        </button>
      </nav>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
