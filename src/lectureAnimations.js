export const sigmoid = x => 1 / (1 + Math.exp(-x));

// A scripted, possible sequence of noisy outcomes, used to explain majority voting.
export const knockoutMatches = [
  {pair: [0, 1], votes: [0, 1, 0, 0, 1], winner: 0},
  {pair: [2, 3], votes: [3, 2, 3, 3, 2], winner: 3},
  {pair: [0, 3], votes: [3, 0, 3, 3, 0], winner: 3},
];

// A reproducible illustrative run of the simplified RUCB rule in the course notes.
// Each record contains counts before and after one actual Bernoulli comparison.
export function makeDuellingTrace(rounds = 48) {
  let seed = 5453;
  const random = () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const choose = xs => xs[Math.floor(random() * xs.length)];
  const weights = [4, 3, 2, 1];
  const wins = Array.from({length: 4}, () => Array(4).fill(0));
  const lambda = Math.log(2 * 6 * rounds / .05);
  return Array.from({length: rounds}, (_, round) => {
    const upper = wins.map((row, i) => row.map((w, j) => {
      if (i === j) return .5;
      const n = w + wins[j][i];
      return n === 0 ? 1 : Math.min(1, w / n + Math.sqrt(lambda / (2 * n)));
    }));
    const candidates = upper.map((row, i) => row.every(u => u >= .5) ? i : -1).filter(i => i >= 0);
    const champion = choose(candidates.length ? candidates : [0, 1, 2, 3]);
    const maximum = Math.max(...upper.map(row => row[champion]));
    const challenger = choose(upper.map((row, j) => row[champion] === maximum ? j : -1).filter(j => j >= 0));
    const before = {n: wins[champion][challenger] + wins[challenger][champion], wins: wins[champion][challenger]};
    const winner = random() < weights[champion] / (weights[champion] + weights[challenger]) ? champion : challenger;
    if (champion !== challenger) wins[winner][winner === champion ? challenger : champion]++;
    const after = {n: wins[champion][challenger] + wins[challenger][champion], wins: wins[champion][challenger]};
    return {round: round + 1, champion, challenger, winner, before, after, candidates, upper};
  });
}
