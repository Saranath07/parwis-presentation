import {chessPlayers} from './chessExample.js';
const n=chessPlayers.length;
const initial=()=>Array.from({length:n+1},(_,i)=>Array.from({length:n+1},(_,j)=>i!==j&&(i===0||j===0)?1:0));
function estimate(wins){
  let pi=Array(n+1).fill(1/(n+1));
  const q=wins.map((row,i)=>row.map((_,j)=>i===j?0:(wins[j][i]+wins[i][j]?wins[j][i]/(wins[j][i]+wins[i][j])/n:0)));
  q.forEach((row,i)=>row[i]=1-row.reduce((a,b)=>a+b,0));
  for(let t=0;t<3000;t++){
    const next=pi.map((_,j)=>pi.reduce((a,p,i)=>a+p*q[i][j],0));
    const error=Math.max(...pi.map((p,i)=>Math.abs(p-next[i])));pi=next;if(error<1e-12)break;
  }
  return pi;
}
const ratings=pi=>{const logs=pi.slice(1).map(Math.log),mean=logs.reduce((a,b)=>a+b,0)/n;return logs.map(x=>Math.round(1500+400/Math.LN10*(x-mean)));};
const leader=pi=>pi.slice(1).reduce((a,p,i)=>p>pi[a+1]?i:a,0);
function candidates(pi,wins,i){return chessPlayers.flatMap((_,j)=>{if(i===j)return[];const a=wins[i+1][j+1],b=wins[j+1][i+1],count=a+b;return [{j,score:(pi[i+1]*(b+1)+pi[j+1]*(a+1))/((count+2)*(count+3))}];});}
export function makeWalkthrough(){
  const frames=[];let wins=initial(),pi=estimate(wins),used=0,pair=null,winner=null,scores=[],phase=1,line='start',message='Everyone begins at the same rough rating.',round=0;
  const push=()=>frames.push({phase,line,message,used,round,pair:pair&&[...pair],winner,scores:scores.map(x=>({...x})),ratings:ratings(pi),pi:[...pi],wins:wins.map(r=>[...r])});
  push();line='initialize';push();line='order';message='One illustrative random order: Carlsen → Kasparov → Anand → Harmon.';push();
  let champion=0;
  [0,2,3].forEach((result,k)=>{pair=[champion,k+1];winner=result;wins[winner+1][pair.find(x=>x!==winner)+1]++;used++;champion=winner;line='tournament';message=`${chessPlayers[winner].shortName} wins and stays; ${3-used} tournament comparison${3-used===1?'':'s'} left.`;push();});
  pi=estimate(wins);line='fit1';message='Fit the initial score estimate using all three tournament outcomes.';pair=null;winner=null;push();
  phase=2;line='loop';message='Three comparisons remain. Now choose them using disruption.';push();
  for(round=1;round<=3;round++){
    const i=leader(pi);pair=[i];winner=null;scores=[];line='leader';message=`Current leader: ${chessPlayers[i].shortName}.`;push();
    scores=candidates(pi,wins,i);const best=scores.reduce((a,b)=>a.score>b.score?a:b);pair=[i,best.j];line='challenger';message=`${chessPlayers[best.j].shortName} has the largest disruption against ${chessPlayers[i].shortName}.`;push();
    winner=round===1?best.j:i;line='query';message=`Observed outcome: ${chessPlayers[winner].shortName} wins.`;push();
    wins[winner+1][pair.find(x=>x!==winner)+1]++;used++;line='append';message=`Record the outcome. Budget used: ${used} / 6.`;push();
    pi=estimate(wins);line='refit';message='Update the score estimate from every outcome observed so far.';push();
  }
  pair=[leader(pi)];winner=pair[0];scores=[];line='return';message=`Budget exhausted. Report ${chessPlayers[winner].name}.`;push();
  return frames;
}
export const walkthroughFrames=makeWalkthrough();
