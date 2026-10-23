// A possible four-arm history at round 245: 244 previous comparisons.
// The remembered singleton {B} can persist from an earlier singleton candidate set.
export const rucbExampleWins=[[0,32,58,58],[32,0,12,3],[6,4,0,16],[6,1,16,0]];
export const rucbExampleRound=245;
export function publishedUpper(wins,t,alpha=1){return wins.map((row,i)=>row.map((w,j)=>{
 if(i===j)return .5;
 const count=w+wins[j][i];
 // Algorithm 1's element-wise convention is x/0 := 1 in each fraction.
 return count===0?2:w/count+Math.sqrt(alpha*Math.log(t)/count);
}));}
export const rucbExampleUpper=publishedUpper(rucbExampleWins,rucbExampleRound);
export const rucbExampleCandidates=rucbExampleUpper.map((row,i)=>row.every(u=>u>=.5)?i:-1).filter(i=>i>=0);
export const rucbExampleChampion=1;
export const rucbExampleChallenger=rucbExampleUpper.reduce((best,row,j)=>row[1]>rucbExampleUpper[best][1]?j:best,0);
