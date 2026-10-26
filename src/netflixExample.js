// Teaching example: these Tamil titles/ratings are NOT Netflix Prize records.
export const netflixMovies=[
 {title:'Nayakan',year:1987,posterFile:'nayakan-poster.jpg'},
 {title:'Padayappa',year:1999,posterFile:'padayappa-poster.jpg'},
 {title:'Anbe Sivam',year:2003,posterFile:'anbe-sivam-poster.jpg'},
 {title:'Ghilli',year:2004,posterFile:'ghilli-poster.jpg'},
];
export const netflixRatings=[[5,4,3,2],[4,3,5,4],[5,4,4,2],[4,5,2,3]];
const means=netflixMovies.map((_,j)=>netflixRatings.reduce((s,row)=>s+row[j],0)/netflixRatings.length);
// Complete demo ratings yield consistent mean differences, so exp(mean rating)
// is the spectral BTL solution up to normalization. This is not a fit to real data.
const strengths=means.map(x=>Math.exp(x-Math.max(...means)));
const total=strengths.reduce((a,b)=>a+b,0);
export const netflixWeights=strengths.map(x=>x/total);
export const exampleRatingDifference=means[0]-means[2];
export const exampleWinProbability=netflixWeights[0]/(netflixWeights[0]+netflixWeights[2]);
// Approximate MEANS digitized from the original Figure 3 Netflix recovery panel.
// These are not raw author data. Error bars are intentionally not reconstructed.
export const netflixPaperRecovery={
 budgets:[100,200,300,400,500,600,700],
 parwis:[4.8,8.8,12.3,12.8,15.2,15.2,17.0],
 rucb:[3.0,3.7,4.0,4.4,5.4,5.8,6.8],
};

// Approximate Figure 3 Netflix means, read from the original plot crops:
// public/experiments/baselines-netflix-{reported,true}.png.
// No raw author measurements or reconstructed error bars are implied.
export const netflixPaperRanks={
 budgets:[100,200,300,400,500,600,700],
 reported:{parwis:[33.2,15.8,13.0,11.5,10.9,10.0,9.3],rucb:[36.1,30.5,27.6,26.8,22.7,21.1,19.6]},
 true:{parwis:[35.5,34.5,32.0,29.3,27.3,25.5,23.7],rucb:[40.2,36.2,34.0,31.8,28.6,27.1,25.1]},
};
