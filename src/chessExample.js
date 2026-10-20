// Illustrative rough ratings and synthetic past outcomes, not real player data.
export const chessPlayers = [
  {name: 'Magnus Carlsen', shortName: 'Carlsen', rating: 1900, color: '#3276b1'},
  {name: 'Garry Kasparov', shortName: 'Kasparov', rating: 1800, color: '#c75a59'},
  {name: 'Vishy Anand', shortName: 'Anand', rating: 1650, color: '#35956b'},
  {name: 'Beth Harmon', shortName: 'Harmon', rating: 1500, color: '#8862ae'},
];
const history = [
  {i: 0, j: 1, iWins: 8, jWins: 4},
  {i: 0, j: 2, iWins: 18, jWins: 2},
  {i: 0, j: 3, iWins: 1, jWins: 1},
  {i: 1, j: 2, iWins: 3, jWins: 1},
  {i: 1, j: 3, iWins: 7, jWins: 2},
  {i: 2, j: 3, iWins: 4, jWins: 2},
];
// Conventional Elo-to-BTL strength mapping. A shared scale cancels.
const strengths = chessPlayers.map(player => 10 ** ((player.rating - 1800) / 400));
const total = strengths.reduce((a,b)=>a+b,0);
export const chessEstimates = strengths.map(w=>w/total);

// Authors' regularized power_iter criterion, probability weighted.
// We omit a shared constant because it does not change which pair maximizes it.
// This teaching slide deliberately scores all six pairs; the actual PARWiS
// leader-only search restriction is a separate algorithmic step to explain later.
export const chessPairs = history.map(pair => {
  const n = pair.iWins + pair.jWins;
  const score = (chessEstimates[pair.i] * (pair.jWins + 1)
    + chessEstimates[pair.j] * (pair.iWins + 1)) / ((n + 2) * (n + 3));
  return {...pair, n, score, key: `${chessPlayers[pair.i].shortName}–${chessPlayers[pair.j].shortName}`};
});
export const selectedChessPair = chessPairs.reduce((a,b)=>a.score>b.score?a:b);
