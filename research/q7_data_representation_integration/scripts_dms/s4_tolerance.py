import pandas as pd, numpy as np, collections, json, time
from common import *
t0=time.time()
df=pd.read_pickle('df.pkl'); cl=pd.read_pickle('clusters.pkl')
df['yes']=df.label=='Yes'
df2=df[df.total>=2]
g2=df2.groupby('Cluster').agg(n2=('total','size'),yes=('yes','sum'))
fam=g2[(g2.n2>=10)&(g2.yes>=3)]
allfam=g2[g2.n2>=10]
print('families: >=10 uniq seqs with total>=2:',len(allfam),' of which >=3 Yes:',len(fam))
fams=set(fam.index)
sub=df2[df2.Cluster.isin(fams)]
prof=collections.defaultdict(list); cons_keys=[]; nfam=0; used=0
rows=[]
for cid,gg in sub.groupby('Cluster'):
    L=gg.sequence.str.len().mode().iloc[0]; gg=gg[gg.sequence.str.len()==L]
    if len(gg)<10: continue
    seqs=gg.sequence.tolist(); arr=np.array([list(s) for s in seqs])
    # consensus + segmentation from consensus
    cons=''.join(collections.Counter(arr[:,j]).most_common(1)[0][0] for j in range(L))
    lab=segment(cons)
    if lab is None: continue
    ks=keys(lab)
    mism=(arr!=np.array(list(cons))).mean(0)       # mutation rate per column
    # normalised entropy
    ent=np.zeros(L)
    for j in range(L):
        cts=np.array(list(collections.Counter(arr[:,j]).values()),float)/len(arr); ent[j]=-(cts*np.log2(cts)).sum()/np.log2(20)
    for j in range(L): rows.append((cid,j,ks[j][0],ks[j][1],mism[j],ent[j],len(arr)))
    used+=1
R=pd.DataFrame(rows,columns=['cluster','col','region','d','mism','ent','n'])
print('families used',used,'time',time.time()-t0)
R.to_pickle('colstats.pkl')
tab=R.groupby(['region','d']).agg(mism=('mism','mean'),ent=('ent','mean'),ncol=('mism','size')).reset_index()
print(tab.to_string())
print(R.groupby('region').agg(mism=('mism','mean'),ent=('ent','mean')).to_string())
tab.to_pickle('prior.pkl'); tab.to_csv('prior_tolerance_by_region_pos.csv',index=False)
# family size distribution
print('family n (uniq total>=2) quantiles',fam.n2.describe().to_dict())
