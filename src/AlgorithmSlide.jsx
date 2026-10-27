import React from 'react';
import katex from 'katex';
import {chessPlayers} from './chessExample.js';
import {SeatedPlayer,SmallChessboard} from './ChessSelectionSlide.jsx';
import {walkthroughFrames} from './parwisWalkthrough.js';
function InlineMath({tex}){return <span dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{throwOnError:true})}}/>;}
function Line({id,frame,children}){return <div className={`parwis-code-line ${frame.line===id?'executing':''}`} data-line={id}><span className="execution-pointer">▸</span>{children}</div>;}
export function AlgorithmSlide({active,step}){
  const frame=walkthroughFrames[Math.max(0,Math.min(step,walkthroughFrames.length-1))];
  const second=frame.phase===2;
  const latestTournament=walkthroughFrames.slice(0,Math.max(0,step)+1).filter(f=>f.phase===1&&f.winner!==null).at(-1);
  const tournamentChampion=latestTournament?.winner;
  const displayedPair=second?frame.pair:(frame.pair||latestTournament?.pair||[0,1]);
  const displayedWinner=second?frame.winner:tournamentChampion;
  const eliminated=new Set(chessPlayers.flatMap((_,i)=>frame.wins.some((row,r)=>r>0&&r!==i+1&&row[i+1]>0)?[i]:[]));
  return <section className={`slide story-slide parwis-algorithm-slide ${active?'active':''} ${second?'phase-two-running':'phase-one-running'}`} aria-label="PARWiS algorithm walkthrough" aria-hidden={!active} inert={!active} data-step={step}>
    <h2>PARWiS, one comparison at a time</h2>
    <p className="algorithm-inputs"><InlineMath tex={String.raw`n=4,\quad B=6,\quad f:\text{ ranking objective}`} /></p>
    <div className="parwis-walkthrough-layout">
      <div className="parwis-pseudocode">
        <div className="parwis-phase-one">
          <h3>Phase 1 · Winner-stays tournament <small>n − 1 comparisons</small></h3>
          <Line id="initialize" frame={frame}><InlineMath tex={String.raw`S\gets\varnothing;\quad\widehat\theta_1=\cdots=\widehat\theta_n`} /></Line>
          <Line id="order" frame={frame}>Shuffle the items; start with the first.</Line>
          <Line id="tournament" frame={frame}>Compare with each remaining item;<br/>promote the winner and record the outcome in <InlineMath tex="S" />.</Line>
          <Line id="fit1" frame={frame}>Estimate the scores <InlineMath tex={String.raw`\widehat\theta\gets\operatorname{Estimate}(S)`} />.</Line>
        </div>
        <div className="parwis-phase-two" aria-hidden={!second}>
          <h3>Phase 2 · Disruption-guided comparisons</h3>
          <Line id="loop" frame={frame}>While the comparison budget remains:</Line>
          <Line id="leader" frame={frame}><InlineMath tex={String.raw`i^*\gets\arg\max_i\widehat\theta_i`} /> <span className="code-hint">current leader</span></Line>
          <Line id="challenger" frame={frame}><InlineMath tex={String.raw`j^*\gets\arg\max_{j\ne i^*}d_f^S(i^*,j)`} /></Line>
          <Line id="query" frame={frame}>Compare <InlineMath tex={String.raw`(i^*,j^*)`} /> and observe <InlineMath tex="y" />.</Line>
          <Line id="append" frame={frame}><InlineMath tex={String.raw`S\gets S\cup\{(i^*,j^*,y)\}`} /></Line>
          <Line id="refit" frame={frame}>Update <InlineMath tex={String.raw`\widehat\theta\gets\operatorname{Estimate}(S)`} />; repeat.</Line>
          <Line id="return" frame={frame}>Return <InlineMath tex={String.raw`\arg\max_i\widehat\theta_i`} />.</Line>
        </div>
      </div>
      <div className="parwis-live-example">
        <div className="parwis-budget"><span>{second?`Phase 2 · Round ${Math.min(frame.round,3) || 1}`:'Phase 1 · Tournament'}</span><strong>{frame.used} / 6 comparisons</strong></div>
        <svg className={`parwis-live-players ${displayedPair?.length===2?'match-on-board':''}`} viewBox={second?'0 0 560 540':'0 0 560 300'} role="img" aria-label={frame.message}>
          {chessPlayers.map((player,index)=>{
            const involved=displayedPair?.includes(index),won=displayedWinner===index;
            if(!second&&!involved)return null;
            const playing=displayedPair?.length===2&&involved;
            const x=playing?(displayedPair[0]===index?120:440):(index%2===0?120:440),y=playing?(second?210:90):(index<2?90:330);
            return <g key={player.name} style={{transform:`translate(${x}px,${y}px)`}} className={`parwis-live-player ${frame.pair&&!involved?'waiting':''} ${involved?'in-match':''} ${!second&&eliminated.has(index)?'eliminated':''}`}>
              <SeatedPlayer color={player.color} facingLeft={playing?displayedPair[1]===index:index%2===1} portrait={index} pleased={won} />
              {won&&<g className="winner-crown" role="img" aria-label={`${player.name} wins`}>
                <path d="M-23-63 L-13-54 L0-70 L13-54 L23-63 L18-43 H-18 Z" fill="#efc349" stroke="#8b6818" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M-18-39 H18" fill="none" stroke="#8b6818" strokeWidth="3" strokeLinecap="round" />
              </g>}
              <text x="0" y="151" textAnchor="middle" fontSize="25.3">{player.name}</text>
              <text x="0" y="180" textAnchor="middle" fontSize="29.7" fill={player.color}>{frame.ratings[index]}</text>
            </g>;
          })}
          <SmallChessboard className="walkthrough-board" y={second?210:90} />
          <text x="280" y={second?194:74} textAnchor="middle" fontSize="23.1">{displayedPair?.length===2?displayedPair.map(i=>chessPlayers[i].shortName).join(' vs '):'Next comparison'}</text>
        </svg>
        {!second&&<div className="parwis-tournament-roster" aria-label="Tournament lineup">
          {chessPlayers.map((player,index)=>{
            const out=eliminated.has(index),champion=tournamentChampion===index;
            const status=out?'Out':champion?(frame.used===3?'Tournament winner':'Stays'):tournamentChampion===undefined&&index===0?'Starts':index===frame.used+1?'Next':'Waiting';
            return <div key={player.name} className={`tournament-roster-player ${out?'eliminated':''} ${champion?'champion':''}`} data-eliminated={out}>
              <svg viewBox={`${index*100} ${champion?100:0} 100 100`} role="img" aria-label={player.name}><image href={`${import.meta.env.BASE_URL}chess-portraits.png`} width="400" height="200"/></svg>
              <strong>{player.shortName}</strong><span>{status}</span>
            </div>;
          })}
        </div>}
        <div className="parwis-candidates" aria-label="Challenger disruption scores">
          {frame.scores.map(({j,score})=><span key={j} className={frame.pair?.[1]===j?'best-candidate':''}>{chessPlayers[j].shortName} <strong>{score.toFixed(4)}</strong></span>)}
        </div>
        <p className="parwis-step-message" aria-live={active?'polite':'off'}>{frame.message}</p>
      </div>
    </div>
    <div className="parwis-objective-footnote">
      <span>Paper’s Markov choice: </span><InlineMath tex={String.raw`d_{f^{\mathrm{Markov}}}^{S}(i,j)=\frac{\pi_i}{\pi_i+\pi_j}\|\pi^\top-\pi^\top Q_{ij}^{1}\|_2+\frac{\pi_j}{\pi_i+\pi_j}\|\pi^\top-\pi^\top Q_{ij}^{0}\|_2`} />
      <small><InlineMath tex={String.raw`Q_{ij}^{y}`} />: chain after hypothetical outcome <InlineMath tex="y" />. The paper uses spectral ranking; update details omitted. Scripted outcomes; ratings are illustrative.</small>
    </div>
  </section>;
}
