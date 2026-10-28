import React from 'react';
import {chessPlayers, chessPairs, selectedChessPair} from './chessExample.js';

const positions = [[140,105],[420,105],[140,345],[420,345]];
export function SeatedPlayer({color, facingLeft, portrait, pleased}) {
  return <g transform={facingLeft?'scale(-1 1)':undefined}>
    <path d="M-27 40 V99 H20 M-24 99 V126 M15 99 V126" fill="none" stroke="#999" strokeWidth="7" strokeLinecap="round" />
    <path d="M-9 46 L-8 82 Q-8 91 3 91 H30 V119 H43" fill="none" stroke={color} strokeWidth="16" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M-7 48 L15 69 H45" fill="none" stroke={color} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
    <g className="chess-reaching-arm">
      <path d="M2 46 L27 60 H59" fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="62" cy="60" r="6" fill="#eed1b5" />
    </g>
    <g className="chess-portrait-head">
      {[0,1].map(row=><svg key={row} x="-37" y="-32" width="74" height="74" viewBox={`${portrait*100} ${row*100} 100 100`} overflow="hidden" className="chess-portrait-expression" style={{opacity:row===(pleased?1:0)?1:0}}>
        <image href={`${import.meta.env.BASE_URL}chess-portraits.png`} width="400" height="200" />
      </svg>)}
    </g>
  </g>;
}
function Pawn({white=false}) {
  return <g fill={white?'white':'#111'} stroke={white?'#111':'white'} strokeWidth=".7">
    <circle cx="0" cy="-4" r="2.3" />
    <path d="M-1.5-1.5 L-2 3 H2 L1.5-1.5 Z M-3 3 H3 V5 H-3 Z" />
  </g>;
}
function BackPiece({white, file}) {
  const crown=file===3||file===4;
  return <g transform={`translate(${file*10+5} ${white?75:5})`} fill={white?'white':'#111'} stroke={white?'#111':'white'} strokeWidth=".65">
    <path d={crown?'M-3-3 L-1-1 L0-4 L1-1 L3-3 L2 2 H-2 Z M-3 2 H3 V4 H-3 Z':'M-3-4 H-1 V-2 H1 V-4 H3 V-1 H2 L1 2 H-1 L-2-1 H-3 Z M-3 2 H3 V4 H-3 Z'} />
  </g>;
}
export function SmallChessboard({className, y}) {
  return <g className={`chess-game-board ${className}`} style={{transform:`translate(224px,${y}px)`}}>
    <g transform="scale(1.4)">
    {Array.from({length:64},(_,i)=><rect key={i} x={i%8*10} y={Math.floor(i/8)*10} width="10" height="10" fill={(i%8+Math.floor(i/8))%2?'#bbb':'#fff'} />)}
    <rect width="80" height="80" fill="none" stroke="#000" strokeWidth="1" />
    {Array.from({length:8},(_,file)=><React.Fragment key={file}>
      <BackPiece file={file} white /><BackPiece file={file} />
      {file!==4&&<g transform={`translate(${file*10+5} 65)`}><Pawn white /></g>}
      {file!==3&&<g transform={`translate(${file*10+5} 15)`}><Pawn /></g>}
    </React.Fragment>)}
    <g className="white-pawn-step" transform="translate(45 65)"><Pawn white /></g>
    <g className="black-pawn-step" transform="translate(35 15)"><Pawn /></g>
    </g>
  </g>;
}
export function ChessSelectionSlide({active, step}) {
  const scored=step>=1, chosen=step>=2, playing=step>=3;
  return <section className={`story-slide chess-selection-slide slide ${active?'active':''} ${scored?'scores-revealed':''} ${chosen?'pair-selected':''} ${playing?'pair-playing':''}`} aria-label="Choose the next pair from four chess players" data-step={step} aria-hidden={!active} inert={!active}>
    <h2>Who should play next?</h2>
    <p className="story-subtitle">Rough ratings. Previous games. Six possible pairs.</p>
    <div className="chess-selection-layout">
      <svg className="chess-players" viewBox="0 0 560 560" role="img" aria-label={chosen?`The highest-scoring pair, ${selectedChessPair.key}, is selected to play next.`:'Illustrated Magnus Carlsen, Garry Kasparov, Vishy Anand, and fictional Beth Harmon, with hypothetical ratings.'}>
        {chessPlayers.map((player,index)=>{
          const selected=index===selectedChessPair.i||index===selectedChessPair.j;
          const destination=index===selectedChessPair.i?[120,215]:[440,215];
          const [x,y]=playing&&selected?destination:positions[index];
          return <g key={player.name} className={`chess-player ${selected?'selected-player':'other-player'}`} style={{transform:`translate(${x}px,${y}px)`}}>
            <SeatedPlayer color={player.color} portrait={index} pleased={chosen&&selected} facingLeft={playing&&selected?index===selectedChessPair.j:index%2===1} />
            <text x="0" y="170" textAnchor="middle" fontSize="25.3">{player.name}</text>
            <text x="0" y="198" textAnchor="middle" fontSize="24.2" fill="#555">{player.rating}</text>
          </g>;
        })}
        <SmallChessboard className="first-game-board" y={playing?195:130} />
        <SmallChessboard className="second-game-board" y={370} />
        <text className="play-chess-caption" x="280" y="444" textAnchor="middle" fontSize="28.6">{chessPlayers[selectedChessPair.i].shortName} vs {chessPlayers[selectedChessPair.j].shortName}</text>
      </svg>
      <div className="chess-score-table" role="table" aria-label="Previous comparison counts and computed disruption scores for all six pairs">
        <div className="chess-table-row chess-table-heading" role="row">
          <span role="columnheader">Pair</span><span role="columnheader">Previous games</span><span role="columnheader">Disruption</span>
        </div>
        {chessPairs.map((pair,index)=><div key={pair.key} className={`chess-table-row ${chosen&&pair.key===selectedChessPair.key?'maximum-score':''}`} role="row">
          <span role="cell">{pair.key}</span>
          <span role="cell" title={`${chessPlayers[pair.i].name}: ${pair.iWins} wins; ${chessPlayers[pair.j].name}: ${pair.jWins} wins`}>{pair.n}</span>
          <span role="cell" className="score-number-cell"><span className="uncomputed-score" aria-hidden={scored}>—</span><span className="computed-chess-score" aria-hidden={!scored} style={{transitionDelay:scored?`${index*85}ms`:'0ms'}}>{pair.score.toFixed(4)}</span></span>
        </div>)}
      </div>
    </div>
    <div className={`selected-pair-summary story-reveal ${chosen?'visible':''}`} aria-hidden={!chosen}>
      <span>Maximum disruption: <strong>{selectedChessPair.key}</strong></span>
      <span className="selected-score">{selectedChessPair.score.toFixed(4)}</span>
    </div>
    <p className="chess-illustration-note">Hypothetical ratings and results · Beth Harmon is fictional · illustrative score units.</p>
  </section>;
}
