import pandas as pd, numpy as np, time
t0=time.time()
df=pd.read_pickle('df.pkl'); d=df[df.total>=3]
cnt=d.groupby('Cluster').size(); d=d[d.Cluster.isin(cnt[cnt>=2].index)]
print('seqs total>=3 in clusters with >=2:',len(d),'clusters',d.Cluster.nunique())
res={h:np.zeros((2,2),int) for h in (1,2,3)}   # [a yes?][b yes?]
npairs={h:0 for h in (1,2,3)}
for cid,g in d.groupby('Cluster'):
    if len(g)>1500: g=g.nlargest(1500,'total')
    for L,gl in g.groupby(g.sequence.str.len()):
        if len(gl)<2: continue
        A=np.frombuffer(''.join(gl.sequence).encode(),dtype=np.uint8).reshape(len(gl),L)
        y=(gl.label.values=='Yes').astype(int)
        for i in range(len(gl)-1):
            h=(A[i+1:]!=A[i]).sum(1)
            for hh in (1,2,3):
                idx=np.where(h==hh)[0]+i+1
                if len(idx):
                    npairs[hh]+=len(idx)
                    for j in idx: res[hh][y[i],y[j]]+=1
print('time',time.time()-t0)
for h in res:
    m=res[h]; n=m.sum()
    # symmetrise
    s=m+m.T; yy=s[1,1]/2; yn=s[1,0]; nn=s[0,0]/2
    p_yes_given_yes=2*yy/(2*yy+yn) if (2*yy+yn) else np.nan
    p_yes_given_non=yn/(yn+2*nn) if (yn+2*nn) else np.nan
    print(h,'pairs',n,'YY',int(yy),'YN',int(yn),'NN',int(nn),'P(nbr Yes|Yes)=%.3f P(nbr Yes|nonYes)=%.3f OR=%.1f'%(p_yes_given_yes,p_yes_given_non,(p_yes_given_yes/(1-p_yes_given_yes))/(p_yes_given_non/(1-p_yes_given_non))))
print('base Yes rate among these seqs',(d.label=='Yes').mean())
