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
